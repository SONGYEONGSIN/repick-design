# Candidate b — Vernier (auto-dash-r63)

## Concept summary

Vernier is a feature-flag / rollout-management console for product and platform teams — the
"dial" a team turns to move a flag's exposure from 0% to 100% across named user segments, watch
it, and roll it back if it misbehaves. The home view is built around the brief's assigned
structural test: a single large hero number ("workspace enrollment," the eligible-user-weighted
percentage currently enrolled across every active flag) with a small inline sparkline and trend
arrow beside it — not inside a chart — followed by a grid of six stat tiles (active flags, flags
at 100%, flags paused, rollback events this month, average time to full rollout, users enrolled)
plus one tile-sized waffle grid spotlighting a single flag's rollout fill. Below that sits the
real secondary surface: a sortable, filterable table of all nine flags (name/key, status, rollout
% with an inline bar, segments, owner, last changed), with row selection opening an
independently-scoped detail panel (rollout history sparkline, exact eligible/enrolled counts,
rollback count, segments, owner) that is the only thing a selection touches — the hero and stat
tiles stay fixed workspace aggregates on purpose. There is deliberately no large dominant
visualization anywhere on the page. Theme is pure white/zinc, accent is AA-corrected `lime-700`,
and the one display face used (wordmark + hero number only) is `--font-display-mono`, matching the
assignment's instruction to prefer mono/wide over grotesk this round.

## Structure

- `data.ts` — deterministic flag records (9 flags) and every derived aggregate (`ENROLLED_PCT`,
  `FLAGS_AT_FULL`, `ROLLBACK_EVENTS_THIS_MONTH`, `AVG_DAYS_TO_FULL`, …), all computed from the one
  `FLAGS` array so the hero, the tiles, the table and the detail panel can never drift apart.
- `ui.tsx` — shared system: `Card`, `Badge`/`StatusBadge`, `SegmentedControl`, `Progress`,
  `InitialsAvatar`, `Sparkline` (deterministic polyline, coordinates rounded to 2 decimals), the
  `FOCUS_RING` token, and the one allow-listed `DISPLAY_FACE`.
- `Sidebar.tsx` / `Topbar.tsx` — app shell: brand lockup, a real workspace switcher (popover,
  radio-style menu with a checkmark on the current workspace), nav sections, bottom user block;
  topbar has the ⌘K trigger, a "New flag" primary action, a wired notifications popover, and a
  wired avatar menu. Every shell control is 44px (`h-11`) individually.
- `CommandPalette.tsx` — ⌘K palette: jump to any flag, set the status filter, or jump to the table.
- `Hero.tsx` — the hero number + sparkline + trend delta; explicitly does not read selection state.
- `StatTiles.tsx` — the six simple tiles plus `WaffleTile`, the one tile-sized supporting
  visualization (10×10 fill grid), with its own independent hover/click inspector and a
  `<details>` table fallback (mandatory for a C-grade chart type).
- `FlagTable.tsx` — sortable (`aria-sort`, 4 sort keys), filterable (status segmented control +
  text search), `table-fixed` + `colgroup` %, single `overflow-x-auto` with `min-w-[720px]` for
  mobile-only local scroll.
- `FlagDetailPanel.tsx` — the independently-scoped widget a row selection updates: history
  sparkline, a `dl` of exact counts, segments, owner.
- `VernierClient.tsx` — orchestrates `selectedId`, `statusFilter`, palette/mobile-nav state; wires
  the whole shell together.
- `page.tsx` — server metadata + `<VernierClient />`.

## Interactions (5, all real and `motion-reduce` gated)

1. **Table sort** — click any of Flag/Status/Rollout/Owner header to sort, with `aria-sort` kept in
   sync and direction toggling on repeat clicks.
2. **Table filter** — status segmented control (All/Active/Paused/Archived) + free-text search
   across name, key and segments, both applied live to the same row set the sort reads.
3. **Row selection → detail panel (tier 2)** — clicking a flag's name toggles `FlagDetailPanel`'s
   content. The hero and stat tiles are explicitly *not* wired to this state — commented in both
   `Hero.tsx` and `VernierClient.tsx` — so the page never implies the hero re-scopes to whatever is
   selected.
4. **Waffle-tile hover/pin inspector (tier 3, fully independent axis)** — hovering or focusing the
   waffle grid (or clicking to pin it) updates one `aria-live` caption scoped only to that tile. It
   shares no state with the row-selection system above or with anything else on the page.
5. **⌘K command palette** — open a flag, change the status filter, or jump to the table, all from
   one searchable list with arrow-key navigation and proper focus restoration on close.

## Font / accent / theme confirmation

- Theme: light only — `bg-white` canvas, `zinc-200` hairline borders, `shadow-sm` cards. No
  `dark:` variants anywhere (explicit color utilities throughout, immune to system dark mode).
- Accent: single hue, `lime-700` for all text-bearing accent usage (buttons, active nav pill,
  badges, focus outline color), `lime-600` reserved for non-text fills (progress bars, waffle
  cells, sparkline strokes) where text-contrast rules don't apply.
- Face: Pretendard everywhere for body/table/caption/Korean-capable text; the single allow-listed
  display face, `--font-display-mono`, is used only on the "Vernier" wordmark and the hero
  percentage — never two display faces, never on data that could carry Korean.
- No emoji, no raw `<img>` (avatars are initials, not photos, so no `next/image` call was needed),
  no `Math.random`/`Date.now`/`new Date` anywhere in `data.ts`.

## 브리프에 없던 것

1. **① 결정해야 했던 것**: "last changed" 같은 상대 시간 레이블을 어떤 포맷으로 쓸지 — 브리프는
   `new Date()` 금지만 명시했지, 정적 문자열의 길이나 포맷은 정하지 않음.
   **② 결정**: 처음엔 "2 days ago" 식 긴 포맷으로 썼다가, `table-fixed` + `colgroup %`에서 10%
   폭(약 84–105px) 칸에 `whitespace-nowrap`(줄바꿈 금지, truncate 없음)로 넣으려니 길이가 아슬아슬
   했다. 그래서 "2d ago"/"1w ago"/"2mo ago" 같은 짧은 포맷으로 전부 바꿨다.
   **③ 근거**: 브리프의 "nowrap/truncate 컬럼은 2줄로 안 꺾인다" + "min-w on `<td>` 는 아무 효과
   없다" 규칙상, nowrap 칸은 콘텐츠 자체가 칸보다 짧아야 안전하다는 뜻으로 해석 — 실제 SaaS 대시보드
   (Linear, GitHub)도 상대 시간을 압축 포맷으로 쓰는 게 일반적이라 임의가 아니라 관례를 따른 선택.

2. **① 결정해야 했던 것**: 웨이플 타일의 호버/핀 인스펙터를 "셀 단위"로 할지 "그리드 전체 단위"로
   할지 — 브리프는 "waffle-grid tile with a compact proportional bar" 예시만 주고 인터랙션 scope는
   명시하지 않음.
   **② 결정**: 셀 100개 각각에 호버 리스너를 달지 않고, 그리드 전체를 감싼 **하나의** `<button>`에
   호버/포커스/클릭을 묶어 **하나의** `aria-live` 캡션만 갱신하게 만들었다.
   **③ 근거**: 브리프의 하드룰 "Never a per-cell/per-point floating tooltip (even opacity:0) inside
   a table/chart — use ONE shared `aria-live` status element outside instead"를 차트뿐 아니라 이
   "차트급" 타일에도 그대로 적용한 것 — 100개의 개별 호버 타겟을 만드는 순간 이 규칙을 정면으로
   어기게 되므로, 타일 전체를 하나의 인스펙터 단위로 축소한 것은 규칙의 가장 안전한 해석.

3. **① 결정해야 했던 것**: "multi-axis independent scope" 요구를 만족시키려 할 때, 두 번째 독립
   축을 어디에 둘지 — 브리프는 "hover/focus inspector scoped only to its own widget" 예시만 주고
   구체적 위치는 지정하지 않음.
   **② 결정**: 두 번째 축을 테이블 바깥의 전혀 다른 위젯(웨이플 타일)에 두고, 클릭(핀) 상태와
   호버 상태를 모두 그 타일 **내부 로컬 state**로만 가뒀다. 사이드바 워크스페이스 스위처도 비슷한
   이유로 로컬 state의 실제 드롭다운으로 만들었다 (처음엔 레퍼런스처럼 비연결 버튼이었으나, 브리프의
   "every visually-interactive-looking control must be ACTUALLY wired" 규칙을 자가 점검하면서
   업그레이드).
   **③ 근거**: 브리프의 fan-out 티어 표에서 "tier 3 (strongest)"가 요구하는 "두 개의 독립적으로
   스코프된 selection state가 서로 닿지 않는다"는 조건을 가장 명확하게 만족시키는 방법은, 두 축을
   아예 다른 컴포넌트 트리(테이블 행 선택 vs. 타일 내부 호버)에 두고 서로의 setter를 아예 import하지
   않는 것이라 판단 — VernierClient.tsx의 주석에도 "읽지도 쓰지도 않는다"고 명시해 자가 감사
   근거를 남겼다.
