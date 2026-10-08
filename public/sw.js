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

self.addEventListener("fetch", (e) => {
  const req = e.request;
  const url = new URL(req.url);
  if (req.method !== "GET" || url.origin !== location.origin) return;

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
