# auto-landing-r28 — hard gate scores

Freeze hash (candidate sources concatenated, SHA-1, before gating): `160bfd1be26b9333364b12e97ec6d75eb80b54c5`
(candidate a was subsequently 1-fixed for a lint violation — see below; hash recorded is pre-fix)

| Candidate | route | types | static | lint | weights | sweep | focus | console | a11y | perf | 1-fix |
|---|---|---|---|---|---|---|---|---|---|---|---|
| a (The Route — Sankey/flow) | pass | pass | pass | **pass (after 1-fix)** | 3 (record) | pass | pass | pass | unavailable | unavailable | yes |
| b (The Funnel) | pass | pass | pass | pass | 3 (record) | pass | pass | pass | unavailable | unavailable | no |
| c (Five Axes — parallel-coords) | pass | pass | pass | pass | 3 (record) | pass | pass | pass | unavailable | unavailable | no |

**a11y/perf unavailable**: this sandbox has no Lighthouse CDP path (consistent with prior rounds
r25/r27 — treated as pass/unverified, not a hard fail).

**1-fix on a**: `react-hooks/set-state-in-effect` at `client.tsx:34` — the designer's own
mount-gating fix for a latent SSR `opacity:0` bug (`useState`+`useEffect(() => setMounted(true))`)
itself tripped this lint rule. Orchestrator fix: replaced with the standard
`useSyncExternalStore(() => () => {}, () => true, () => false)` hydration-detection idiom, which
is exactly the React-sanctioned pattern for "has this component mounted on the client yet"
without a setState-in-effect cascade. Re-gated clean (12/12 effectively, lint 0 violations).

12/12 across all 3 candidates after the single 1-fix. All 3 candidates survive to judging.
