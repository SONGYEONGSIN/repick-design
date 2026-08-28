# Candidate a — Meridian (board-centric support triage console)

Board/kanban-centric macro (per [[dash-brief-v3]] "레이아웃 아키타입 다양화" — "캘린더/보드 중심: 대형 캘린더·칸반이 화면 주인공"), not used by any dash winner in the last several rounds (r18–r20 used cohort-matrix / 3-pane trading desk / feed+bullet-grid). A five-column triage board (New → Triaging → In progress → Waiting → Resolved) is the page's main stage — every column scrolls independently, every ticket card prints its own SLA-burn progress bar and countdown text. A compact SLA heat grid (priority × age bucket) sits in a fixed right rail, scoped only by its own time-window toggle.

Product: Meridian, a support-ops triage console. Light theme (true white/zinc-50, not cream), cyan accent, `--font-display-wide` for the wordmark.

Interactions (4): ① heat-grid cell hover/focus → live-region crosshair readout with exact count + percentage ② priority filter chips + free-text search on the board (real filter, no simulated state) ③ SLA-window segmented toggle (Today/7D/30D) that recomputes the heat grid's bucket counts from the same underlying ticket list ④ tabbed, sortable ticket-history table (Recently resolved / Escalated) with real column-header sort. The board's five columns never react to the heat grid's window toggle and vice versa — no raw `selectedId` threading between them (r17–r20 lesson).

## 브리프에 없던 것

1. **무엇을 정해야 했나**: 히트맵(우선순위×연령버킷) 강도 램프의 구체적 톤 — 진한 발산 색에 흰 글자를 얹을지, 옅은 색에 어두운 글자를 얹을지.
   **무엇으로 정했나**: 4단계 전부 `cyan-50/100/200/300` 옅은 틴트 + `zinc-900` 어두운 글자로 통일(강도와 무관하게 텍스트 색 고정).
   **왜**: [[page-brief-core]]가 인용하는 `/dash/d30` 사례(발산 램프+흰 글자가 램프 어느 지점에서도 AA를 못 넘어 강도 분기를 없앤 사례)를 선제 회피 — 옅은 배경+어두운 글자는 강도와 무관하게 항상 AA를 통과한다.
2. **무엇을 정해야 했나**: 보드 5열이 데스크톱에서 가로 스크롤(칸반의 관용적 패턴)해야 하는지, 세로 그리드로 접어야 하는지.
   **무엇으로 정했나**: `grid-cols-1 sm:grid-cols-2 xl:grid-cols-5`로 전 폭 그리드 — 가로 스크롤 컨테이너를 아예 만들지 않음.
   **왜**: `auto-dash-r20/a` 델타(두 개의 독립 `overflow-x-auto` 컨테이너가 각자는 클립해도 페이지 레벨 `scrollWidth`를 오염시킬 수 있음)를 이번 라운드 브리프에서 읽고, 이 후보는 애초에 `overflow-x-auto`를 하나도 안 씀으로써 그 결함 클래스 자체를 봉쇄.
3. **무엇을 정해야 했나**: 우선순위 배지의 4단계 색(rose/amber/sky/zinc)이 브리프에 지정되지 않음.
   **무엇으로 정했나**: severity 통상 관용구(P1=rose critical, P2=amber high, P3=sky normal, P4=zinc low)를 아이콘(AlertOctagon/AlertTriangle/Info/Circle)과 함께 병행 — 색만으로 전달하지 않음.
