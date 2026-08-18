# auto-dash-r16 · candidate a — Warden

**Concept**: Warden is a B2B application-security operations console. Its core workflow is a
security finding (SQLi, IDOR, exposed secret, outdated dependency…) moving through a six-stage
remediation pipeline: **Backlog → Triaged → Assigned → In Remediation → Verifying → Resolved**.

**Macro structure (board-dominant — not hero/master-detail/calendar/3-pane)**: standard app shell
(left sidebar with workspace switcher + section nav + user footer; 44px topbar with a ⌘K search
trigger, primary action, notifications, avatar menu) → a slim single-row inline `<dl>` stat strip
(Open findings / Critical open / SLA breaches / Avg. age / Resolved 30d — no 4-card KPI hero) →
the six-column board filling the rest of the viewport, each column independently
vertically-scrolling, with the whole board horizontally scrollable as one unit only once real
window width can't fit all six columns (same accepted pattern as any local-overflow region).
Clicking a card opens a **slide-over drawer** (not a persistent third pane) with full finding
detail. Route: `app/src/app/dash-evolve/r16/a/page.tsx` (+ `WardenClient`, `Sidebar`, `Topbar`,
`Toolbar`, `Board`, `FindingCard`, `DetailDrawer`, `CommandPalette`, `StatStrip`, `ui`, `data`,
`format` — one file per concern, self-contained).

**Dominant visualization**: a bullet-style SLA bar repeated on every card and in the drawer — days
open vs. a severity-based SLA target (critical 7d / high 14d / medium 30d / low 90d) — with the
exact numbers always rendered as text (never hover-only) and a keyboard-accessible tooltip
(`focus`/`hover`) surfacing the underlying dates. The drawer additionally shows a per-item
stage-duration breakdown (stacked bar + a real `<table>` fallback with `caption`/`scope`) computed
deterministically from discovery date, current stage, and elapsed days — segments always sum to
exactly the item's age.

**Theme / typography**: light theme (white/zinc-50 canvas, white cards, zinc-200 hairlines), single
UI accent **teal-700** (avoids violet; severity/SLA status colors — rose/orange/amber/slate/emerald
— are separate semantic encodings, always paired with an icon and a text label, never color alone).
Display face: **`--font-display-mono`** (JetBrains Mono Display), used only on the wordmark and the
page `<h1>` — body/Korean stays Pretendard everywhere else, exactly one display face used.

**Interactions (6 wired, `'use client'`, `motion-reduce`-gated)**:
1. **Move stage** — a "Move to {next}" button on every card, plus full prev/next stage buttons in
   the drawer; both mutate the shared client state (setting/clearing `resolvedISO` on entering or
   leaving "Resolved").
2. **Search + severity filter** — a text filter (id/title/asset/CVE) and multi-toggle severity
   chips, live across all six columns, with an `aria-live` result count.
3. **Crosshair-style tooltip** on the SLA bullet bar — keyboard focus or hover reveals the
   underlying discovery/target/resolution dates.
4. **Select → drawer sync** — clicking a card opens the slide-over with that finding's full detail,
   and stays in sync if its stage is changed from either the card or the drawer while selected.
5. **Per-column sort** — each column has its own native `<select>` (SLA urgency / Severity /
   Newest) that only reorders that column.
6. **⌘K command palette** — global shortcut, searches the same fields as the toolbar filter,
   selecting a result opens the drawer.

**Data**: 30 deterministic findings (6/5/4/6/3/6 across the six stages), fixed `TODAY_ISO =
"2026-08-18"`. All stat-strip numbers and the per-finding day counts are computed at render time
from the single seed array (verified by hand: Open 24, Critical open 5, SLA breaches 4, Avg. age
13d, Resolved(30d) 4 — all reconcile against the 24 open + 6 resolved records).

## 브리프에 없던 것

1. **언제부터 담당자가 배정되는가.** 브리프는 카드 필드 구성을 정하지 않는다. Backlog·Triaged
   단계는 `assigneeId` 없음(카드에 "Unassigned" 표시), Assigned 단계부터 담당자가 붙는 것으로
   정했다 — 실제 보안 운영에서 "triage 완료 전에는 담당자를 지정하지 않는다"는 흔한 관례를
   반영한 임의 결정이며, 코드 한 곳(`data.ts` 주석)에 명시해 두었다.
2. **SLA 목표를 "단계별"이 아니라 "전체 수명주기"로 잡을지.** 카탈로그의 Bullet/Gauge 항목은
   "목표 대비 값"만 규정할 뿐 단위를 정하지 않는다. 단계별 SLA(예: "Triage까지 3일") 대신
   심각도별 전체 목표(critical 7일 / high 14일 / medium 30일 / low 90일, 실제 AppSec 벤더들이
   공개하는 SLA 구간과 유사한 값)를 택했다 — 이유는 ①보드 전체에서 "같은 막대가 같은 의미"를
   유지해 단일 지배 시각화의 일관성이 커지고 ②이미 Resolved된 카드도 같은 잣대(달성/미달)로
   설명할 수 있어서다.
3. **단계 이력(stage history)을 손으로 30개 다 채울지, 파생시킬지.** 브리프의 결정론 규칙은
   "Math.random 금지"만 강제할 뿐 이력 데이터의 출처는 규정하지 않는다. 30개 항목마다 과거
   전이 이력을 수기로 채우는 대신, discovery 날짜·현재 단계·경과일로부터 고정 가중치
   배열(`STAGE_WEIGHTS`)을 적용해 결정론적으로 역산하는 `buildStageHistory`를 만들었다 — 근거는
   ①수기 30개 배열은 오타로 합계가 깨지기 쉽고 ②이 방식은 "구간 합 = 경과일"이 구조적으로
   보장되어 브리프의 "합계 정합" 요구를 자동으로 만족한다.
4. **보드 자체가 12-col 그리드에 맞아야 하는지.** dash-brief-v3 §레이아웃은 "명시적 12-col
   그리드(8/4 등)"를 일반 원칙으로 들지만, 같은 문서의 "레이아웃 아키타입 다양화" 절이 캘린더/
   보드 중심을 별도 아키타입으로 인정한다. 이번 후보는 스탯 스트립엔 12-col을 적용할 대상이
   없고(인라인 dl 한 줄), 보드 본체는 스테이지 개수(6)만큼의 동적 폭 flex 컬럼이 본질이라 12-col
   그리드를 인위적으로 씌우지 않았다 — 카탈로그의 기존 보드형 후보(`/dash/d33`)도 동일하게
   flex 컬럼을 썼던 선례를 따른 결정이다.
5. **1920px 폭 캡을 걸지 않기로 한 것.** 브리프는 "캡을 두지 않는 것"도 허용하지만 기본값을
   정하지 않는다. 보드가 컬럼 수만큼 폭을 쓸수록 스크롤 없이 더 많은 스테이지가 한 화면에
   보이는 이점이 커서, 상한을 두지 않고 flex-1 컬럼이 뷰포트를 그대로 채우도록 했다 — 대신
   1920px 렌더에서 우측 여백이 페이지 패딩(`sm:px-6`=24px)뿐임을 직접 확인했다.
