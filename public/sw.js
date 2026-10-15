const CACHE = `neuron-${new URL(location.href).searchParams.get("v") || "v1"}`;
const ASSET = /\/_next\/static\/|\.(?:svg|woff2|png|ico)$/;

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()),
  );
});

async function cachePage(cache, url) {
  const res = await fetch(url, { credentials: "same-origin" });
  if (!res.ok) return;
  await cache.put(url, res.clone());
  const html = await res.text();
  const assets = [...html.matchAll(/(?:src|href)="(\/_next\/static\/[^"]+)"/g)].map((m) => m[1]);
  await Promise.all(assets.map((a) => cache.match(a).then((hit) => hit || cache.add(a).catch(() => {}))));
}

self.addEventListener("message", (e) => {
  if (e.data?.type !== "precache") return;
  e.waitUntil(
    caches.open(CACHE).then(async (cache) => {
      for (const url of e.data.urls) {
        if (!(await cache.match(url))) await cachePage(cache, url).catch(() => {});
      }
    }),
  );
});

// Narration files are content-hashed, so a cached copy never goes stale. <audio> asks for byte
// ranges, which the Cache API can't store, so the full file is cached and ranges are cut from it.
async function ranged(res, req) {
  const m = /bytes=(\d*)-(\d*)/.exec(req.headers.get("range") || "");
  if (!m) return res;
  const buf = await res.arrayBuffer();
  const size = buf.byteLength;
  let start = m[1] ? Number(m[1]) : Math.max(0, size - Number(m[2] || 0));
  let end = m[1] && m[2] ? Math.min(Number(m[2]), size - 1) : size - 1;
  if (start >= size) return new Response(null, { status: 416, headers: { "Content-Range": `bytes */${size}` } });
  return new Response(buf.slice(start, end + 1), {
    status: 206,
    headers: {
      "Content-Type": res.headers.get("Content-Type") || "audio/mpeg",
      "Content-Range": `bytes ${start}-${end}/${size}`,
      "Content-Length": String(end - start + 1),
      "Accept-Ranges": "bytes",
    },
  });
}

// Online, the browser streams ranges straight from the network as if there were no worker;
// the full file is cached on the side and only used when the network is gone.
function narration(e, req, url) {
  e.respondWith(
    fetch(req).catch(() => caches.match(url.pathname).then((hit) => (hit ? ranged(hit, req) : Response.error()))),
  );
  e.waitUntil(
    caches
      .match(url.pathname)
      .then((hit) => hit || caches.open(CACHE).then((c) => c.add(url.pathname)))
      .catch(() => {}),
  );
}

self.addEventListener("fetch", (e) => {
  const req = e.request;
  const url = new URL(req.url);
  if (req.method !== "GET" || url.origin !== location.origin) return;

  if (url.pathname.startsWith("/audio/")) return narration(e, req, url);

  if (ASSET.test(url.pathname)) {
    e.respondWith(
      caches.match(req).then(
        (hit) =>
          hit ||
          fetch(req).then((res) => {
            if (res.ok) caches.open(CACHE).then((c) => c.put(req, res.clone()));
            return res;
          }),
      ),
    );
    return;
  }

  if (req.mode === "navigate" || req.headers.get("RSC") === "1") {
    const key = req.mode === "navigate" ? url.pathname : req;
    e.respondWith(
      fetch(req)
        .then((res) => {
          if (res.ok && req.mode === "navigate") caches.open(CACHE).then((c) => c.put(key, res.clone()));
          return res;
        })
        .catch(async () =>
          req.mode === "navigate" ? (await caches.match(key)) || (await caches.match("/")) || Response.error() : Response.error(),
        ),
    );
  }
});
