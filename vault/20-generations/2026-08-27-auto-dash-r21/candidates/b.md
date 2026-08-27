# Candidate b — Vantage (master-detail vendor-risk register)

Classic master-detail (per [[dash-brief-v3]] "마스터-디테일: 좌측 목록 레일 + 우측 상세, Linear/Superhuman식"), literal but in a fresh domain (vendor risk & compliance case management) and with the r17–r20 selection-convergence lesson applied structurally: the detail pane is the *sole* consumer of the list selection — nothing else on the page threads a raw `selectedId`. A filterable, status-tabbed case list sits in a fixed left rail; selecting a case swaps a five-axis risk radar (dominant visualization, every axis value printed as standing text beside the shape), a case timeline, and a findings table that runs its own severity sort and open/all toggle.

Product: Vantage, a vendor-risk case register for enterprise procurement teams. Light theme (true white/zinc-50), rose accent, `--font-display-mono` for the wordmark and case keys.

Interactions (4): ① radar-axis hover/focus (invisible `foreignObject` buttons at each vertex) → live-region crosshair readout with the exact 0–10 score ② case-list status tabs + free-text search (real filter) ③ findings view toggle (Open only / All, 90d) that recomputes the findings table from the selected case's own data ④ findings table real column-header sort (severity / days-to-due). Case selection itself is a fifth, structural interaction (classic master-detail navigation) but is not counted among the four — it deliberately has exactly one consumer, so it never becomes the multi-widget-sync pattern [[questions-queue]] Q46 flagged as brief-interpretation-contested; this candidate simply doesn't attempt that interaction at all.

## 브리프에 없던 것

1. **무엇을 정해야 했나**: Radar 차트(charts.catalog A11y grade B, "Grouped Bar 대안 필수 + 원본 테이블")의 필수 폴백을 어떤 형태로 구현할지.
   **무엇으로 정했나**: 별도 막대 차트 대신, 축마다 라벨+값을 상시 텍스트로 병기하는 `<dl>` 미니 목록을 차트 옆에 항상 표시(hover 불필요) — [[dash-brief-v3]] "단일 지배 시각화 완성도 = 값 상시 병기" L3 델타를 폴백 요구와 동시에 충족.
   **왜**: 별도 Grouped Bar를 추가하면 컴포넌트가 중복되고 화면이 붐빈다. 값을 텍스트로 상시 노출하는 쪽이 "값이 hover 전에도 보여야 한다"는 완성도 규칙과 "필수 폴백" 규칙을 한 번에 만족.
2. **무엇을 정해야 했나**: 2단 그리드(레이더 카드 + 타임라인 카드)가 몇 px부터 나란히 배치돼야 안전한지 — 직접 계산 없이 임의 브레이크포인트를 골랐다가 1280px에서 13px 오버플로가 실측으로 드러남.
   **무엇으로 정했나**: 최초 `xl:`(1280px)에서 `2xl:`(1536px)로 브레이크포인트를 올림 — 좌측 레일(360px 고정)+본문 flex-1 구조에서 1280px는 xl 임계와 정확히 겹쳐 2단 그리드가 낄 공간이 없었다.
   **왜**: [[dash-brief-v3]] "1920에서는 캡이 걸리면 안 된다" 절이 말하는 "재는 방법을 적으면 어떤 구조에서도 같은 답이 나온다" 원칙을 브레이크포인트 선택에도 적용 — 셸 폭(사이드바 256+레일 360+패딩)을 계산해 실제로 room이 나는 지점(1536)까지 미뤘고, sweep 재실행으로 0 오버플로를 확인.
3. **무엇을 정해야 했나**: 케이스 상태 배지 4종(open/review/escalated/closed)의 색.
   **무엇으로 정했나**: sky/amber/rose/zinc — severity 배지(critical/high/medium/low)와는 별개의 색 집합을 써서 두 배지 종류가 화면에 함께 있어도 시각적으로 구분되게 함.
   **왜**: 브리프도 카탈로그도 상태-배지 색을 지정하지 않음 — 두 배지 체계가 겹치는 화면(케이스 카드)에서 서로 다른 색군을 쓰지 않으면 "무엇이 상태이고 무엇이 심각도인지" 혼동된다는 판단.
