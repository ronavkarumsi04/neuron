# Neuron design direction

**Purpose:** teach high schoolers how AI works, how to use it, and how to use it responsibly, with progress they can see.
**Audience:** students aged 14–18 on school Chromebooks and phones, plus judges and teachers who will scan the site quickly.
**Tone:** a scientist's lab notebook. Editorial and precise, with a single live signal color. This is a deliberate step away from the generic dark-gradient "AI" look.
**Memorable detail:** the brain map. Every lesson is a neuron drawn as a printed diagram, and it "fires" in signal orange once you finish it.

## Tokens (`src/app/globals.css`)
| Role | Paper (light) | Night (dark) | Use |
|---|---|---|---|
| paper | `#f4f1ea` | `#111210` | page background, with a faint 24px graph-paper grid |
| ink | `#16150f` | `#ece8de` | text, primary buttons |
| signal | `#d9401f` | `#ff6a45` | **live state only**: up-next neuron, XP, focus ring, badges |
| cobalt / green / plum / gold | module 01 / 02 / 03 / 04 | lighter tints in dark mode | module identity, never decoration |

- **Type:** Instrument Serif (display; italic for emphasis), Geist (UI and body), Geist Mono (figure labels, numbers). Atkinson Hyperlegible is available as an accessibility font.
- **Shape:** radius 4–8px, 1px hairline rules, no glassmorphism, no gradients, no cards nested inside cards.
- **Motion:** neuron pulses, travelling synapses, and spring-based toasts. All of it is turned off by `prefers-reduced-motion` or the in-app "Reduce motion" setting.

## Rules
- Signal orange means "something is happening". Don't use it for decoration.
- Lists of things are numbered editorial rows (`01`, `02`…), not card grids.
- Every number that changes uses `tabular-nums`.
- Never use `transition: all`. Hit areas are at least 40px.
- Accessibility panel: theme, text size, high contrast, readable font, reduce motion. All settings are applied before first paint.
