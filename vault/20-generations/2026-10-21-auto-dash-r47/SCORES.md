# auto-dash-r47 — SCORES

Target: dash · Round: 47 · Date: 2026-10-21 · Frozen source hash (post-1-fix): see below.

## Candidates

| v | product | dominant visualization (first-of-catalog claim) | macro shell | selection-fanout target | theme/accent/face |
|---|---|---|---|---|---|
| a | **Warden** — SOC 2 audit/controls-compliance workspace | 10×10 Waffle (100 controls by compliance status) | Board-centric (4-column Kanban: Backlog → In Progress → Evidence Review → Attested) | tier-3: independent category-pin + finding-pin, different cards, neither resets the other | dark / emerald / `--font-display-grotesk` |
| b | **Keelwatch** — multi-region SRE reliability console | 7×5 intensity heatmap (service × region, error-rate/latency, metric-toggleable), doubles as its own semantic-table a11y fallback | Feed-centric (live Incident Feed as hero column + side rail) | tier-3: heatmap-cell pin (→ Pinned Cell card only) + feed-row hover ephemeral inspector (fully local); verified independent by grep (`pinnedKey` vs `hoverId`, disjoint file sets) | dark / rose / `--font-display-wide` |
| c | **Northbound** — renewal-operations ranking console | Horizontal bar ranking folded directly into the ranked rail rows (no separate standalone bar widget) | Strict two-pane master-detail (ranked rail + detail panel only, no third always-populated pane) | rail→detail (expected master-detail wiring, single consumer) + fully independent sparkline hover tooltip (zero connection to rail selection) | light / blue / `--font-display-mono` |

## 1st-pass hard gate (`gate.mjs --target web`)

All three candidates failed the **same** lint rule independently on first pass — three separate designer-agent instances converged on the identical `useEffect`-based "reset query/index when the palette opens" idiom in their own `CommandPalette` component:

| v | 1st-pass failures |
|---|---|
| a | lint `react-hooks/set-state-in-effect` ×2 (CommandPalette.tsx:31,40) |
| b | lint `react-hooks/set-state-in-effect` ×2 (command-palette.tsx:39,49) |
| c | lint `react-hooks/set-state-in-effect` ×1 (command-palette.tsx:51) + sweep `page-overflow` 34px@390px |

## 1-fix (orchestrator-applied, per §3-1/established precedent of small orchestrator fixes e.g. r40's "오케스트레이터 1줄 보정")

- **All three**: converted the open/query-reset `useEffect(() => { setX(...) }, [open|query])` pattern to a render-time state adjustment (`if (open !== wasOpen) { setWasOpen(open); if (open) { setQuery(""); ... } }`) — the documented React "derive state from a prop change during render" pattern, which does not trigger `react-hooks/set-state-in-effect` since it isn't inside an effect. DOM-only side effects (autofocus via `requestAnimationFrame`/`setTimeout`) were left in their own `useEffect`.
- **c only**: root-caused the 390px `page-overflow` (34px) via direct Playwright DOM inspection — `PrimaryButton`'s base class hardcodes `inline-flex` unconditionally; passing `className="hidden sm:inline-flex"` / `"sm:hidden"` directly to two sibling `PrimaryButton` instances put a competing unprefixed `hidden` against the component's own hardcoded unprefixed `inline-flex` on the same element, and this Tailwind build's cascade layer order resolved both instances to visible (`display:flex`) simultaneously at 390px — the icon-only mobile button pushed the full-text desktop button 34px past the viewport edge. Fixed by moving the visibility toggle to wrapper `<span>` elements with no competing display utility of their own, leaving `PrimaryButton`'s className empty in both call sites.

## 2nd-pass (post-fix) hard gate — all clean, no further fix needed

| v | route | types | static | lint | weights | sweep | focus | console | a11y | perf |
|---|---|---|---|---|---|---|---|---|---|---|
| a | pass | 0 errors | 0 violations | 0 violations | 3 (rendered) | 0 overflow | 0 missing | 104 msgs · 0 defects | unavailable (pass-through) | unavailable (pass-through) |
| b | pass | 0 errors | 0 violations | 0 violations | 3 (rendered) | 0 overflow | 0 missing | 134 msgs · 0 defects | unavailable (pass-through) | unavailable (pass-through) |
| c | pass | 0 errors | 0 violations | 0 violations | 3 (rendered) | 0 overflow | 0 missing | 26 msgs · 0 defects | unavailable (pass-through) | unavailable (pass-through) |

Lighthouse (a11y/perf) reports `unavailable` for all three — this sandbox's Chrome-for-Lighthouse path isn't wired up (only the pre-installed Playwright chromium at `/opt/pw-browsers/chromium` is available, used via `PW_CHROMIUM_PATH` for sweep/focus/screenshots). Per `page-brief-repo.md` §5, `a11y`/`perf` are documented to pass through as `unavailable` when Lighthouse+Chrome aren't available — not a candidate defect, an environment limitation, applied uniformly to all three candidates so it is non-differentiating.

**All three candidates pass the hard gate clean (10/10 after 1-fix).** Proceeding to screenshot capture and judge panel.

Frozen source hash (all files, post-1-fix, pre-judge): computed via `find app/src/app/dash-evolve/r47 -type f \( -name "*.tsx" -o -name "*.ts" \) | sort | xargs cat | shasum`.

**Hash value**: `3a5defb95223eb824f5cdc9189e7fbb25aed5a10`
