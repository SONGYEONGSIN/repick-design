# auto-landing-r39 — SCORES

**self_judged: true** — see DECISION.md sec0 for the deviation this round operated under
(no Agent/Task subagent-spawn tool in this execution environment; all three candidates
were generated and all three judge lenses were applied by the same single session).

Freeze hash (`cat r39/*/*.tsx r39/*/*.ts | shasum`): `d7212497f8ee0cad2068a04e653d8bba0d604c2c`
— taken once, before gating, screenshots, and judging; unchanged through all three stages.

Lighthouse env note: `npx lighthouse` needed `CHROME_PATH=/opt/pw-browsers/chromium-1243/chrome-linux64/chrome`
and `PW_NO_SANDBOX=1` to resolve a Chrome binary and launch as root in this sandbox — without
them a11y/perf report `unavailable` (a pass, per `page-brief-repo` §5) rather than a real
score. Both were set for every gate run below, so a11y/perf are real measurements, not
`unavailable` placeholders.

All three candidates passed every hard-gate stage on the **first attempt** — no 1-fix loop
was used for any candidate.

| gate | a (Fairline) | b (Marked Down) | c (Afterhours) |
|---|---|---|---|
| route | 200 | 200 | 200 |
| types | 에러 0 | 에러 0 | 에러 0 |
| static | 위반 0 | 위반 0 | 위반 0 |
| lint | 위반 0 | 위반 0 | 위반 0 |
| weights (렌더 실측) | 3종 | 3종 | 3종 |
| sweep (전 폭 오버플로) | 0 | 0 | 0 |
| focus (포커스 표시 누락) | 0건 | 0건 | 0건 |
| console | 결함 0 | 결함 0 | 결함 0 |
| a11y (Lighthouse) | **100** | **100** | **100** |
| perf (기록만) | 67 | 56 | 59 |

## Environment note — display-face CDN unavailable (applies equally to all three)

All three candidates reference an allow-listed `--font-display-*` CSS variable exactly as
`page-brief-core` §1 requires (confirmed by the `static` gate's `no-unlisted-font` passing
clean). Runtime font loading failed identically for all three, however: the three faces
(`Space Grotesk Display` / `Archivo Display` / `JetBrains Mono Display`) are all served from
`cdn.jsdelivr.net`, and this sandbox's egress proxy returns `403` to `cdn.jsdelivr.net:443`
(confirmed via `document.fonts` → `status: "error"` for the loaded face, and via direct
`curl` against the font URL returning `CONNECT tunnel failed, response 403`). Screenshots
therefore show each candidate's CSS fallback chain (`var(--font-sans)` for grotesk/wide,
system `ui-monospace` stack for mono) instead of the intended display face. This is an
environment-wide network-policy constraint, not a candidate defect, and it affects all
three candidates identically, so it was not treated as a differentiator in judging. No hard
gate checks actual font-file loading (only the source-level CSS variable reference), so
this does not change any pass/fail result above.

## Shots

16 frames per candidate (4 widths × 4 scroll depths) in `shots/`, no blanks, no capture
errors (`capture-shots.mjs` output confirmed `"blanks": []`, `"errors": []` for all three).
Judge frame budget per DECISION.md: `<v>-1440.png`, `<v>-1440-s70.png`, `<v>-390.png` (3 of
16 per candidate) — the remaining 13 per candidate were captured but not manually reviewed;
sweep's mechanical 1280–1920px zero-overflow check covers layout risk at the unreviewed
desktop widths, but that is not a visual review.
