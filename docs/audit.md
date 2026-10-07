# Quality audit

Run against the production build (`pnpm build && pnpm start`) on 2026-10-06.

## Accessibility: axe-core 4.10 (WCAG 2.0/2.1/2.2 A + AA, best practices)

| Pass | Pages | Violations |
| --- | --- | --- |
| Light theme, new visitor | 25 routes: every module, a sample of lessons from each module, all 6 labs, and all utility pages | 0 |
| Dark theme, new visitor | same 25 routes | 0 |
| Light theme, Judge Mode demo progress (badges, fading neurons, unlocked bonus module, certificate) | 8 routes | 0 |
| Dark theme, demo progress | 4 routes | 0 |

The first run found three issues, all fixed in this pass:
1. **Secondary text contrast.** `--ink-3` was 4.0–4.3:1. It was darkened to `#686456`, which gives 5.6:1 on raised paper, 5.3:1 on paper, and 4.8:1 on sunk paper. In dark mode it was lightened to `#969184`.
2. **`aria-label` on a plain `<span>`** (the module progress dots on the Progress page). The span now has `role="img"`.
3. **Lesson callouts used `<aside>` inside `<main>`.** They are now `role="note"`.

## Lighthouse 12 (mobile, simulated slow 4G)

| Route | Performance | Accessibility | Best practices | SEO | CLS |
| --- | --- | --- | --- | --- | --- |
| `/` | 96 | 100 | 100 | 100 | 0 |
| `/map` | 96 | 100 | 100 | 100 | 0 |
| `/modules/foundations/how-llms-work` | 96 | 100 | 100 | 100 | 0 |
| `/labs/teach-the-machine` | 97 | 100 | 100 | 100 | 0 |
| `/judge` | 96 | 100 | 100 | 100 | 0 |

## Manual checks

- Keyboard only: every control can be reached with Tab and has a visible focus ring. The settings panel traps focus, and Esc closes it. The brain map's neurons are links.
- Reduced motion is respected through both the OS setting and the in-site toggle.
- At 390px wide, no page scrolls horizontally.
- Offline: after one visit, a lesson and a lab load with the network disabled.
- Printing the certificate gives a single landscape page with the site chrome hidden.

## Reproduce

```bash
pnpm build && pnpm start -p 3000
npx lighthouse http://localhost:3000/ --only-categories=performance,accessibility,best-practices,seo
# axe: inject axe-core into each route with Playwright and call axe.run()
```
