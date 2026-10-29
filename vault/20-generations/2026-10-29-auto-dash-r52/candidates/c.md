# c — Flowpath

Support escalation / root-cause console for a customer-support org. Macro layout: master-detail —
left ticket rail + right pane, but the right pane's dominant visualization is a hand-built Sankey
(ticket flow across 5 stages: Intake → Triage → Engineering/Escalated → Resolved) rather than the
radar/network/decomposition-tree charts recent master-detail rounds have used. Theme light / accent
indigo / display face Space Grotesk ("grotesk").

**Structure**: app shell → 4 reconciled flow KPIs (intake/resolved/resolve-rate/escalated, period-
aware) → two-column: ticket rail (xl:col-span-2) + Sankey + detail panel stacked (xl:col-span-3) →
full-width all-tickets table below.

**Interactions (5)**: ① click a rail item → selects the ticket, driving the detail panel (primary pin)
② hover/focus a Sankey node or flow band → ephemeral highlight + readout with the exact ticket count
for that stage/flow — **independently scoped from the rail/table ticket selection**: hovering the
chart never changes which ticket is open in the detail panel, and selecting a ticket never disturbs
the chart's highlight state ③ all-tickets table sort by SLA hours or priority ④ stage filter segmented
control on that table ⑤ "Last 30 days / Last 7 days" period toggle recomputes the entire Sankey
geometry from a second, independently-reconciled flow dataset (not a re-scaled copy of the first).
⌘K also jumps straight to a ticket, setting the same primary selection as the rail.

**Data integrity**: both flow datasets are constructed so every node's inflow equals its outflow and
all three terminal (`Resolved`) inflows sum to the stage's total intake — checked with a small script
during authoring, not asserted by hand (30d: 100→100, 7d: 28→28).

**Diversity**: accent indigo and a light theme are both well short of the most-saturated axes (amber/
teal at 8 each); "grotesk" was last a *winner's* face at r47 (4 rounds back), clear of the
documented "last 2 winners" exclusion (r51 mono, r49 none).

## 브리프에 없던 것

1. **무엇을 정해야 했나**: Sankey가 charts.catalog 상 A11y 등급 C(단독 사용 금지, 필수 폴백 요구)인데,
   "필수 폴백"이 전체 페이지에 별도 테이블로 또 있어야 하는지, 차트 자체의 텍스트 라벨(노드명+수치
   상시 표기)로 충분한지는 불명확하다.
   **무엇으로 정했나**: 차트 자체에 노드마다 라벨+수치를 SVG `<text>`로 상시 표기(hover 불필요)하고,
   그와 별개로 "All tickets" 테이블을 이미 가지고 있어 개별 티켓 단위의 시맨틱 테이블 폴백도
   갖췄다 — 두 요구를 분리된 두 장치로 만족시켰다.
   **왜 그렇게 정했나**: dash-brief-v3의 "단일 지배 시각화 완성도" 조항("핵심 값을 상시 텍스트로
   병기, hover 전에도 보이게")이 차트 자체에 이미 수치 상시 표기를 요구하므로, charts.catalog의
   "필수 폴백"과 겹치지만 다른 목적(개별 레코드 vs 집계)의 두 번째 테이블을 더하는 것이 합리적이라
   판단했다(관행 — Sankey/Funnel 행의 "Source→Target→Value 테이블" 권고를 집계 수준에서 텍스트
   라벨로, 개별 레코드 수준에서 All-tickets 테이블로 나눠 만족).
2. **무엇을 정해야 했나**: SVG 안의 `<path>`/`<rect>`를 키보드로 포커스 가능하게 만드는 것이 이
   레포의 관행과 합치하는지 — page-brief-core는 "SVG 세그먼트가 onFocus로 자기 채움을 바꾸는" 사례를
   이미 언급하지만 신규 생성 시 이 패턴을 쓰라고 지시하지는 않는다.
   **무엇으로 정했나**: `tabIndex={0}` + `role="button"` + `aria-label` + onFocus로 하이라이트를
   토글하는 패턴을 그대로 썼다.
   **왜 그렇게 정했나**: 다른 작품 참조 — page-brief-core §2가 그 관용구를 "이미 존재하는 사례"로
   언급하므로 레포 안에서 검증된 패턴으로 간주했다.
3. **무엇을 정해야 했나**: 7일/30일 두 기간의 Sankey 데이터가 서로 다른 절대값을 가질 때, 노드
   높이의 스케일을 공유해야 하는지(절대 비교 가능) 아니면 기간마다 캔버스를 꽉 채우도록 재정규화해야
   하는지.
   **무엇으로 정했나**: 기간마다 그 기간의 intake 합계를 100%로 재정규화(캔버스를 항상 꽉 채움).
   **왜 그렇게 정했나**: 임의 — 절대 스케일 공유 시 7일 차트가 과도하게 작아져 즉시가독성(단일
   지배 시각화 완성도 조항)이 떨어질 것으로 판단했다. 두 기간의 절대 수치 비교가 필요하면 KPI
   카드(Intake/Resolved 숫자)가 이미 그 역할을 한다.
