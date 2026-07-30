# Candidate b — Covenant (contract review & redlining console)

## Product

**Covenant** — "Contract Review & Redlining Console." A B2B legal-tech product (Ironclad/Juro/Concord-tier)
for an in-house legal/procurement team (fictional client: Anders & Vale Industries) to track contracts
through their lifecycle: In Review → Redlining → Countersigning → Executed → Expiring Soon.

## Archetype

Master-detail (Linear/Superhuman-style), entirely legal-ops in content rather than engineering-issue
content. The left rail is a semantic, sortable `<table>` of 16 contracts grouped by status (matching the
five lifecycle stages above), each row showing a counterparty, contract type, a generative SVG risk
gauge with an always-visible numeric score + risk word, and days-to-expiry. The rail header carries a
compact "contracts expiring per month" area sparkline (generative SVG, deterministic, derived directly
from the same 16-contract dataset so the total always reconciles) plus a one-line text summary — the
sparkline earns its place as a rail-level triage aid rather than sitting in a separate hero stat row.
Selecting a row drives the right detail pane, which shows a metadata strip (parties, effective date,
contract value, renewal term, days to expiry), then a segmented "Clause risk / Redline" toggle. Clause
risk view lists each clause with its own gauge + score + risk word + one-line note, always as visible
text. Redline view shows a hand-authored `<ins>`/`<del>` markup diff for two contracts with genuinely
contested language (Corvid Analytics Corp. — Limitation of Liability + Indemnification; Ashgrove Biotech
Ltd. — Termination for Convenience); every other contract shows a status-appropriate empty-state
sentence (not yet redlined / finalized awaiting signature / no further changes on the executed text)
instead of a fabricated diff.

## Interactions implemented (6, brief requires 4+)

1. Real list sort — clickable `Counterparty` / `Risk` / `Expiry` column headers with correct `aria-sort`,
   toggling direction on repeat clicks.
2. Real list filter — status chips (multi-select, each shows its own live count) plus a free-text search
   across counterparty/contract type.
3. Row selection syncs the detail pane (metadata, clause risk list, and redline all update together).
4. Segmented control toggles the detail pane between "Clause risk" and "Redline" views.
5. ⌘K command palette — jump directly to a contract, or apply a counterparty filter to the list.
6. Keyboard ↑/↓ navigation across the flattened, currently-visible row list, moving both focus and the
   synced detail pane (mirrors the r11/a permission-matrix roving-focus pattern).

## Typography / font confirmation

Single unified `font-sans` (Pretendard, already wired globally) throughout — no `next/font` import added,
no serif/display font anywhere. All copy is English-only. Numeric fields (risk scores, currency, day
counts) use `tabular-nums`. Section labels use the house `text-[11px] font-semibold uppercase
tracking-wider` eyebrow style consistently (`EyebrowLabel` in `ui.tsx`).

## Commercial-polish reference points

Light theme is a pure white/zinc-50 canvas with `zinc-200` hairline borders and `shadow-sm` cards (no
cream/paper tone anywhere); dark theme uses zinc-950/900 surfaces with `white/10` borders — matching the
Mercury/Asana/Calendly-vs-n8n/Coinbase split called for in the brief. Every interactive control in the
header (search trigger, notification/avatar icon buttons, "New contract" primary action) is exactly
`h-11` (44px), verified individually rather than assuming the header container height carries through.
The contract table uses the `min-w-[560px] lg:min-w-0 lg:table-fixed` + percentage `<colgroup>` pattern
(confirmed via Playwright at 390/1280/1920px: `scrollWidth === clientWidth` at all three, no internal
desktop scrollbar). Risk is always rendered as gauge *and* text (never color- or hover-only); the same
holds for the expiry sparkline, which is paired with an explicit "N contracts expiring… next expiry in N
days" sentence. Contrast tokens follow the house rule: dark-surface secondary text is `zinc-400` or
lighter, light-surface secondary text is `zinc-500` or darker, checked across the filtered/toggled states
(empty redline states, filtered-out status chips) and not just the default render.
