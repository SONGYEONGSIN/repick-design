# auto-landing-r32 — HARD GATE (gate.mjs --target web)

Freeze hash (concatenated source of all 3 candidates, pre-gate): `0b1c9f744755b7011f160fdb938bca47f13d6634` (unchanged post-gate).

Environment note: `PW_CHROMIUM_PATH`/`CHROME_PATH` set to the pre-installed `/opt/pw-browsers/chromium-1194/chrome-linux/chrome` to work around a Playwright package-version (1228) vs preinstalled-browser-revision (1194) mismatch in this sandbox (same workaround as prior sessions, e.g. r29/r31). `PW_NO_SANDBOX=1` set for the container's unprivileged user namespace.

| gate | a (box-plot) | b (chord diagram) | c (pictogram array) |
|---|---|---|---|
| route | pass | pass | pass |
| types | 에러 0 | 에러 0 | 에러 0 |
| static | 위반 0 | 위반 0 | 위반 0 |
| lint | 위반 0 | 위반 0 | 위반 0 |
| weights | 3종 (렌더 실측) | 3종 (렌더 실측) | 3종 (렌더 실측) |
| sweep | 전 폭 오버플로 0 | 전 폭 오버플로 0 | 전 폭 오버플로 0 |
| focus | 누락 0 | 누락 0 | 누락 0 |
| console | 결함 0 (26건 메시지) | 결함 0 (26건 메시지) | 결함 0 (13건 메시지) |
| a11y | **100** (bf-cache 제외) | **100** (bf-cache 제외) | **100** (bf-cache 제외) |
| perf | 63 (기록만) | 55 (기록만) | 58 (기록만) |

**All 3 candidates passed 10/10 gates on the first attempt — no 1-fix loop needed, no candidate dropped.** All 3 proceed to the judge panel.

## Candidate summaries
- **a** — "Box plot" distribution: dual-handle price-range slider narrows a 60-item comparable-sales pool, recomputing live box-and-whisker plots (min/Q1/median/Q3/max) per condition grade, with the example listing plotted as a diamond marker. Light theme, sky accent (`sky-600` 4.10:1/white · `sky-700` 5.94:1/white for small text), `--font-display-wide`.
- **b** — "Chord diagram": single-select category chooser (6 categories as circular nodes) drives a live chord/arc diagram of companion-purchase relationships, plus a derived stat sentence and closing-CTA button label that both re-read the same selection. Light theme, rose accent (`rose-600` 4.70:1/white large-only · `rose-700` 6.29:1/white small text), `--font-display-mono`.
- **c** — "Pictogram array": three continuous threshold sliders (price/grade/trust) drive a live 10×10 lucide-icon isotype array (lit/dimmed) over a 100-item sample pool, with a bound `aria-live` count/percentage that also flows into the value section and closing CTA. Light theme, lime accent (`lime-700` 4.99:1/white small text; lit-icon `lime-600` 3.09:1/white large-fill only), no display face (plain `--font-sans`).

All 3 are genuinely new output-visualization devices for this catalog (box-plot, chord/arc diagram, icon-array/isotype) — none reproduce any of the ~32 prior landing-evolve archetypes.
