# auto-landing-r49 — SCORES

target: landing · round: auto-landing-r49 · date: 2026-11-06

## Candidates
- **a** — "Live Match Search" — live text-query/autocomplete-driven filter+match device, dark/violet/`display-grotesk`.
- **b** — "Week Scrubber" (Market Pulse Playback) — single-point draggable timeline playhead (keyboard-operable `<input type="range">`), dark/blue/none.
- **c** — "Point Select" (Drop-off Map Finder) — abstract selectable location-pin field with live detail panel, light/rose/`display-wide`.

## Hard gate — `node scripts/gate.mjs --target web --routes /landing-evolve/r49/a /landing-evolve/r49/b /landing-evolve/r49/c`

| gate | 1st attempt | after 1-fix |
|---|---|---|
| route | 통과 (3/3 200) | — |
| types | 통과 (0 에러) | — |
| static | 통과 (위반 0) | — |
| lint | **실패** (1 error: `react/no-unescaped-entities`, `a/ProductPreview.tsx:32`) | 통과 (위반 0) |
| weights | 통과 (3종, 렌더 실측) | — |
| sweep | 통과 (전 폭 오버플로 0) | — |
| focus | 통과 (0건 누락) | — |
| console | 통과 (295건 메시지, 결함 0) | — |
| a11y | 통과 (100) | — |
| perf | 통과 (83, 기록만) | 재측정 63 (perf는 탈락 미적용, 기록만) |

**1-fix applied by the orchestrator directly** (trivial, mechanical, single-character): `a/ProductPreview.tsx:32` — unescaped apostrophe in "it's" → `it&apos;s`. Re-gate: **10/10 clean.** 0 other violations, b and c needed no fix at all.

## Freeze hash

`cat app/src/app/landing-evolve/r49/*/*.tsx app/src/app/landing-evolve/r49/*/*.ts | shasum`:

```
d8cbdd9036fcfd164145828b2c339bc234bffc74
```

Computed after the 1-fix; unchanged from this point through screenshot capture and judging.

## Environment notes

- Playwright/Lighthouse ran with `PW_CHROMIUM_PATH=/opt/pw-browsers/chromium PW_NO_SANDBOX=1 CHROME_PATH=/opt/pw-browsers/chromium` (pre-installed Chromium, since this sandbox's network blocks Playwright's own Chromium download — no script changes, pre-existing env vars).
- All 3 candidates use `images.unsplash.com/photo-<fixed-id>` product photos; this sandbox's network is blocked from `images.unsplash.com`, so photos render as empty/gray boxes here (known, previously-documented environment artifact per `questions-queue` Q49 — not a code defect, excluded from judging criteria given to all 3 lenses).
