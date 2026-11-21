# auto-landing-r45 — SCORES

target: landing · round: auto-landing-r45 · date: 2026-11-02 · freeze hash (post 1-fix): `6a38f6956f0384cae593d12a072eaf79c122e46d`

## Hard gate (`node scripts/gate.mjs --target web --routes /landing-evolve/r45/<v> --app-root app/src/app`, run per-candidate to localize a11y failures per `auto-landing-r44` precedent)

| candidate | 1st attempt | 1-fix applied | re-gate |
|---|---|---|---|
| a (Live Payout Receipt) | FAIL — `lint` 2× `react/no-unescaped-entities` (`Hero.tsx:50`, `page.tsx:64`) + `a11y` 96 `color-contrast` (ghost-numeral `GHOST_TEXT` token `text-zinc-800` on `#0B0B0F`, used `aria-hidden` — not an exemption per `page-brief-core` §2) | escaped both apostrophes (`&apos;`); `GHOST_TEXT` changed to `text-[#6B6B78]`, this repo's own documented remedy for a ghost numeral on this exact background (`design-principles.md` §Layout, `auto-landing-r14`, 3.74:1) | **pass** — lint 0, a11y 100, perf 74 |
| b (Match Reasoning Tree) | FAIL — `lint` 1× `react-hooks/set-state-in-effect` (`useMounted.ts:8`) | rewrote `useMounted` to this repo's established `useSyncExternalStore` idiom (`landing-evolve/r34/a/useMounted.ts`) instead of `useEffect`+`setState` | **pass** — lint 0, a11y 100, perf 85 |
| c (Side-by-Side Savings Split) | **pass clean** — 0 violations, a11y 100, perf 68 | none needed | — |

All three candidates used at most their allotted single 1-fix (a used it for a combined lint+a11y fix in one pass, b for lint, c needed none). Freeze hash computed after the 1-fix pass and re-verified unchanged through screenshot capture and judging: `6a38f6956f0384cae593d12a072eaf79c122e46d`.

Routes sanity-checked 200 before gating: `/landing-evolve/r45/a`, `/landing-evolve/r45/b`, `/landing-evolve/r45/c`.
