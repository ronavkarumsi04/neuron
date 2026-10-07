# Quality audit

Run against the production build (`pnpm build && pnpm start`). First pass on 2026-10-06; re-run on 2026-10-07 after the advanced track (Modules 05–08), the rank ladder, and the scrollytelling homepage were added.

## Accessibility: axe-core 4.10 (WCAG 2.0/2.1/2.2 A + AA, best practices)

| Pass | Pages | Violations |
| --- | --- | --- |
| Light theme, new visitor | All 63 routes: every module, all 38 lessons, all 6 labs, and every utility page. The homepage is scanned at six scroll positions so every story scene is checked | 0 |
| Dark theme, new visitor | same 63 routes | 0 |
| Light theme, Judge Mode demo progress (badges, fading neurons, unlocked bonus and advanced modules, certificate) | 10 routes | 0 |
| Dark theme, demo progress | same 10 routes | 0 |

Issues found and fixed:
1. **Secondary text contrast** (first pass). `--ink-3` was 4.0–4.3:1. It was darkened to `#686456`, which gives 5.6:1 on raised paper, 5.3:1 on paper, and 4.8:1 on sunk paper. In dark mode it was lightened to `#969184`.
2. **`aria-label` on a plain `<span>`** (first pass, the module progress dots on the Progress page). The span now has `role="img"`.
3. **Lesson callouts used `<aside>` inside `<main>`** (first pass). They are now `role="note"`.
4. **Selected word in the attention widget** (re-run). White on signal orange was 4.46:1 in light mode and 2.8:1 in dark mode. It now uses `--signal-ink` with paper-colored text.

## Lighthouse 12 (mobile, simulated slow 4G)

| Route | Performance | Accessibility | Best practices | SEO | CLS |
| --- | --- | --- | --- | --- | --- |
| `/` (scrollytelling) | 96 | 100 | 100 | 100 | 0 |
| `/map` | 95 | 100 | 100 | 100 | 0 |
| `/modules/foundations/how-llms-work` | 96 | 100 | 100 | 100 | 0 |
| `/modules/transformers/attention` | 96 | 100 | 100 | 100 | 0 |
| `/modules/model-building/parameters` | 97 | 100 | 100 | 100 | 0 |
| `/labs/teach-the-machine` | 96 | 100 | 100 | 100 | 0 |
| `/judge` | 97 | 100 | 100 | 100 | 0 |

## Robustness checks

- **No hydration errors with non-US locales.** With the browser set to German, the parameter-counter widget crashed hydration (React error #418), because the server printed `50,257` and the browser printed `50.257`. Numbers are now always formatted as `en-US`. Re-checked in `de-DE` and in a UTC+14 time zone: no console errors.
- **Judge Mode**: the full 11-stop tour, a reload at every stop, and reload-then-navigate across the main pages produce no console errors.
- **Offline cache refreshes on every deploy.** The service worker's cache is named after the build, so an old cache is dropped and every page is re-cached after a new deploy. When offline, client-side navigation falls back to the cached page instead of receiving HTML in place of route data.

## Manual checks

- Keyboard only: every control can be reached with Tab and has a visible focus ring. The settings panel traps focus, and Esc closes it. The brain map's neurons are links.
- Reduced motion is respected through both the OS setting and the in-site toggle. The homepage story becomes a still, sequential version.
- At 390px wide, no page scrolls horizontally, including the homepage story.
- Offline: after one visit, lessons, labs, the brain map, and client-side links load with the network disabled.
- Printing the certificate gives a single landscape page with the site chrome hidden.

## Reproduce

```bash
pnpm build && pnpm start -p 3000
npx lighthouse http://localhost:3000/ --only-categories=performance,accessibility,best-practices,seo
# axe: inject axe-core into each route with Playwright and call axe.run()
```
