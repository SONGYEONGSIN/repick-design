# Candidate B — Relay (Handoff Flow)

## Concept (one line)

**Relay** is a cross-team handoff-intelligence console for engineering orgs — a real light (pure white/zinc-50), emerald-accented workspace whose single dominant visualization is an **arc diagram**: eight engineering teams laid out along one linear pipeline axis, with semicircular arcs above the line showing how many work items moved between each pair of teams this sprint.

## Structure

- **Macro shell: hero + inline-stats.** Page order: hero header (`<h1>` + description + sprint `SegmentedControl`) → an inline KPI row (`grid-cols-2 xl:grid-cols-4`) → the full-width arc-diagram card (the dominant visualization, with its own "all handoffs / rework only" filter) → a two-column row (`Team Spotlight` card, `lg:col-span-4` + `Handoff Log` fallback table, `lg:col-span-8`). No third, always-populated detail pane; no master-detail, board/kanban, or feed-centric shell.
- **Dominant chart: arc diagram**, hand-built as plain SVG (`viewBox`, no chart library). Eight teams (`design → product → frontend → backend → qa → security → devops → support`) sit at fixed `x` positions in canonical pipeline order; fifteen handoff pairs are drawn as true semicircular arcs (`A r,r 0 0,1`) arching *above* the line, radius = half the distance between the two endpoints. Arc **thickness** linearly encodes handoff weight (1.5–6px, scaled from the data's own min/max, 12–61 items) — the chart's real data-bearing channel. Forward handoffs are solid emerald; rework (backward) handoffs are dashed amber, with a text+icon legend so color is never the only cue. All coordinates are computed from fixed constants and rounded to 2 decimals (`round2()`).
- **Always-visible headline readout.** "Busiest handoff this sprint: **Frontend → QA — 61** items" renders as plain text (`text-4xl`/`sm:text-5xl`, 36/48px) above the chart, recomputed from the currently filtered edge set on every render — never hover-gated. Switching the chart's own "Rework only" filter correctly re-points the headline to the busiest *rework* pair instead (QA → Frontend, 23 items), proving it isn't hardcoded.
- **Required accessible fallback: `handoff-table.tsx`.** A real `<table>` (visible `<caption>`, `scope="col"`/`scope="row"`, `aria-sort`), sortable by From/To/Type/Weight/Δ-vs-prior, plus its own "rework only" row filter — sitting directly in the DOM below the chart, reachable without any state change. Below `sm` it becomes a card list instead of letting five columns scroll, and the arc diagram itself never scrolls (pure `viewBox` scaling), so there is exactly one `overflow-x-auto` on the whole page. The table's "From" cell is also this route's avatar cell (`TeamLeadAvatar`, `next/image`, fixed hand-picked Unsplash ids per team lead), and its Type column is the shared `HandoffTypeBadge`.
- **Component system**, each local to this folder: `Card`, `SegmentedControl`, `Tabs`, `HandoffTypeBadge`, `Delta`, `ProgressBar`, `Sparkline`, `TeamLeadAvatar`, `SortHeader`/`SortIcon` (`ui.tsx`); dropdowns/popovers (workspace switcher, notifications, account menu in `sidebar.tsx`/`topbar.tsx`); command palette (`command-palette.tsx`).

## Selection fan-out — the two independently-scoped mechanisms

This is the part a sibling candidate in the immediately preceding round got wrong, so here is the explicit accounting the brief asks for:

1. **`active` (hover/focus) — declared in `arc-diagram.tsx`, read only in `arc-diagram.tsx`.**
   `const [active, setActive] = useState<ArcActive>(null);` lives inside the `ArcDiagram` component and nowhere else. It is written by `onMouseEnter`/`onFocus` on the invisible arc hit-paths and the team-dot circles, and cleared on `onMouseLeave`/`onBlur`. It is read only inside this same file, to compute `isEdgeDimmed`, `isNodeHighlighted` and the inline caption line under the chart. **No prop, callback, or id derived from `active` ever leaves this file.** `page.tsx` never imports or reads it.

2. **`selectedId` (click-to-pin) — declared in `team-spotlight.tsx`, read only in `team-spotlight.tsx`.**
   `const [selectedId, setSelectedId] = useState<TeamId>(DEFAULT_SPOTLIGHT_TEAM_ID);` lives inside the `TeamSpotlight` component and nowhere else. Its only producer is `onClick` on the roster chips; its only consumer is the spotlight readout (name, category, Overview/Trend tabs, stats) rendered immediately below, in the same component. `page.tsx` passes `TeamSpotlight` only `period` (a view filter, not an identity selection) and never receives `selectedId` or its setter back. A third, fully separate `hoverId` state in the *same* file provides an ephemeral chip-hover preview, exactly mirroring the `active`/`setActive` pattern in the chart — but it is its own `useState`, never shared with `arc-diagram.tsx`.

   **Verified by grep**: `grep -rn "selectedId\|setSelectedId" app/src/app/dash-evolve/r46/b` and `grep -rn "\bactive\b" app/src/app/dash-evolve/r46/b/arc-diagram.tsx` each return matches in exactly **one** file. Neither state value, nor its setter, is ever passed as a prop. The command palette (`command-palette.tsx`) touches neither: its per-team "quick jump" entries call `document.getElementById('team-chip-<id>').focus()` — a plain DOM call that triggers the chip's own `onFocus` handler, not a third read/write path into `team-spotlight.tsx`'s state.

   The default readout for `TeamSpotlight` is never empty: it seeds from `DEFAULT_SPOTLIGHT_TEAM_ID`, computed in `data.ts` as the team with the highest combined in+out handoff volume this sprint (Frontend, 232 items) — never guessed.

## Interactions (6 implemented, all `'use client'`, deterministic, `motion-safe:`-gated)

1. **Arc/node hover-or-focus tooltip-equivalent** — dims unrelated arcs/nodes and updates the inline caption line, keyboard-accessible via Tab onto any arc or team dot (mechanism #1 above).
2. **Click-to-pin Team Spotlight** with its own ephemeral hover preview (mechanism #2 above).
3. **Sprint segmented control** ("This sprint" / "Last sprint") — swaps the dataset driving the KPIs, the chart, and the table at once.
4. **"All handoffs / Rework only" segmented control** on the arc diagram card — filters which arcs draw and re-targets the headline readout.
5. **Real table sort** — `handoff-table.tsx`, sortable by From/To/Type/Weight/Δ, `aria-sort` kept in sync, default sort = Weight desc, plus its own independent "Show rework only" row filter.
6. **Overview / Volume-trend tabs** inside Team Spotlight — a `ProgressBar` (rework share) in Overview, a `Sparkline` (5-point combined-volume history) in Trend.

Also real (not decorative): the header "Export sprint report" button builds a CSV client-side from `EDGES`/`TEAMS` and triggers a real download. The ⌘K command palette is a seventh, navigation-only interaction (scroll-to-section, team quick-focus, and two filter-setting actions that flip the same page-level `viewFilter` a view toggle already writes to — never the chart's or the spotlight's selection state).

## Font / weight discipline

- Body/UI copy: `var(--font-sans)` default, never overridden.
- Display font: exactly one, `var(--font-display-wide)` (Archivo Display), used only for the sidebar wordmark ("Relay") and the page `<h1>` ("Handoff Flow"). Never on the chart's own headline (that uses size/weight/color on the body face instead).
- Exactly three rendered weights across the whole route: `font-normal` / `font-medium` / `font-semibold` — grepped for `font-bold`/`font-light`/`font-extrabold`/`font-black`/`font-thin`: zero matches.
- All numeric figures use `tabular-nums`, right-aligned in every table column. Section/axis labels are 11px uppercase with `tracking-[0.06em]`, applied consistently.
- Contrast audited by surface: `text-zinc-500`/`fill-zinc-500` only on plain white/zinc-50; `text-zinc-600`+ on tinted surfaces (chips, the segmented-control track). A first pass used `bg-emerald-600 text-white` for the Team Spotlight "Selected" pill and computed to ~3.77:1 — below the 4.5:1 text floor — so it was moved to `bg-emerald-700` (~5.48:1); every other white-on-emerald button already used emerald-700/800. `emerald-600` is kept only for non-text decoration (focus outlines, the notification dot, arc/node fills), where the 3:1 non-text floor applies.

## Reconciliation (how the numbers can't drift)

`data.ts` stores each handoff edge's `current`/`prior` weight as two authored literals; every sprint-level figure (`totalWeight`, `reworkWeight`, `reworkRatePct`, `strongestEdge`, `teamStats`) is a function over that one array, called identically by the KPI row, the chart's headline, the inline caption, the Team Spotlight, and the table — never re-typed. Hand-verified: total handoffs 513 current / 463 prior (+10.8%); rework rate 9.94% current / 13.39% prior (−3.45pp, shown as a *green* down-arrow via `invertGoodness`, since less rework is good); the busiest pair (Frontend → QA) is 61/53 in both periods (+15.1%); the five rework-touched teams (Support, Frontend, QA, Security, Backend) and the three rework-free teams (Design, Product, DevOps) are both derived from the same `EDGES` array via `Array.from(new Set(...))`, never typed out by hand. Each team's 5-point `volumeHistory` sparkline ends in exactly `[priorCombinedVolume, currentCombinedVolume]` — e.g. Frontend's `[178, 192, 201, 214, 232]` ends at the same 214/232 that `teamStats("frontend", period)` derives from `EDGES`, so the sparkline and the printed totals can never disagree.

## Arc diagram fallback table — how it works

`handoff-table.tsx` renders unconditionally in the DOM directly below the chart: a semantic `<table>` with a visible `<caption>`, `scope="col"` sort headers (`aria-sort="ascending"|"descending"|"none"`), `scope="row"` team names, and click-to-sort on every column (From, To, Type, Weight, Δ vs prior), defaulting to Weight-descending (matching the chart's own headline emphasis). A "Show rework only" toggle filters rows without touching anything else. Below `sm` the table is replaced (`sm:hidden`) by a card list (`hidden sm:block` on the table) showing the same from→to→weight→Δ data per pair, so nothing needs horizontal scroll at 390px, and `min-w-[640px]` sits on the `<table>` element itself, never on a `<td>`/`<th>`.

## 브리프에 없던 것

- **① 무엇을 정해야 했는가:** 아크 다이어그램의 도메인과 엔티티/관계가 무엇을 나타낼지 자체 (브리프는 배포 의존성, 티켓 에스컬레이션, 온보딩 단계 등 예시만 제시).
  **② 무엇으로 정했는가:** "Relay" — 엔지니어링 조직의 팀 간 핸드오프(업무 이전) 분석 콘솔. 8개 팀을 SDLC 파이프라인 순서(Design→Product→Frontend→Backend→QA→Security→DevOps→Support)로 축에 배치하고, 15개 핸드오프 쌍을 아크로 표현.
  **③ 왜:** "forward"(정방향 진행) vs "rework"(역방향 재작업) 라는 자연스러운 이분법이 생겨서, 단순히 "관계가 있다"는 것 이상으로 "같은 축 위에서 방향이 왜 중요한가"를 보여줄 수 있었고, 이 카탈로그의 최근 라운드들(디플로이/옵저버빌리티 도메인)과 겹치지 않는 현실적인 B2B 엔지니어링-운영 제품 콘셉트이기 때문.

- **① 무엇을 정해야 했는가:** 아크가 선 위로만 솟아야 하는지, forward/rework를 위/아래로 나눠 그려야 하는지 (브리프는 "above (or below)"라고만 명시).
  **② 무엇으로 정했는가:** 모든 아크를 선 위로만 그리고, forward(에메랄드 실선)와 rework(앰버 점선)를 색상+선 스타일+범례 텍스트로만 구분.
  **③ 왜:** 양방향으로 아크를 그리면 각 팀 라벨이 위/아래 양쪽에서 오는 아크와 겹칠 위험이 커지고 뷰박스 세로 여백 계산이 두 배로 복잡해짐 — 한 방향만 쓰면 라벨 밴드를 선 아래에 안전하게 고정할 수 있고, 함정 #17(라벨 클리핑)을 원천적으로 피할 수 있다고 판단.

- **① 무엇을 정해야 했는가:** 아크의 "높이"가 무엇을 인코딩해야 하는지 (브리프는 "height/thickness can encode magnitude or recency"라고만 명시, 둘 다 강제하지 않음).
  **② 무엇으로 정했는가:** 높이는 두 엔티티 사이의 축 거리로부터 기하학적으로 결정(진짜 반원)되고, 두께만 핸드오프 가중치(실제 데이터)를 인코딩.
  **③ 왜:** 이것이 실제 아크 다이어그램(예: Mike Bostock 스타일)의 표준 관례이며, 높이까지 데이터로 임의 인코딩하면 반원이 아니라 눌린 타원이 되어 "semicircular"라는 브리프의 명시적 요구를 어기게 됨. 두께 하나만으로도 "magnitude를 인코딩"하는 요구를 충분히 만족시킴.

- **① 무엇을 정해야 했는가:** 사용자/팀 리드 아바타에 실제 이미지를 쓸지, 이니셜만 쓸지 (브리프는 "avatars must be fixed hand-picked Unsplash ids"라고만 명시, 아바타 자체의 존재 여부는 선택).
  **② 무엇으로 정했는가:** 현재 사용자(사이드바/탑바)와 핸드오프 테이블의 "From" 셀(8명의 팀 리드) 모두에 `next/image` + 이 레포에서 이미 여러 후보가 사용해 검증된 고정 Unsplash photo id를 사용.
  **③ 왜:** 일반 프로필의 "sortable data table (… avatar cells …)" 요구를 테이블에서 실제로 충족시켜야 했고, 레포 내 다른 후보들에서 이미 유효성이 검증된 동일 id들을 재사용하는 것이 깨진 이미지 URL의 위험을 가장 낮추는 방법이라고 판단.

- **① 무엇을 정해야 했는가:** "Busiest Handoff Volume" KPI와 아크 다이어그램 자체의 헤드라인이 서로 다른 숫자를 보여줄 수 있는 상황(아크 쪽에 "Rework only" 필터가 걸렸을 때)을 모순으로 취급해야 하는지.
  **② 무엇으로 정했는가:** KPI는 항상 전체 15개 엣지 기준 "최고 볼륨" 핸드오프를 보여주고, 아크 헤드라인은 "현재 필터링된 뷰" 기준 최고 볼륨을 보여주도록 분리하되, 두 쪽 모두 팀 이름 쌍을 텍스트로 명시해 서로 다른 지표임을 분명히 함.
  **③ 왜:** 두 숫자는 서로 다른 범위(전체 vs 필터된 뷰)를 측정하는 것이므로 "모순"이 아니라 "다른 질문에 대한 답"이며, 각자의 레이블에 팀 이름이 포함돼 있어 judge가 소스를 추적했을 때 숨겨진 불일치로 오인할 여지가 없다고 판단.
