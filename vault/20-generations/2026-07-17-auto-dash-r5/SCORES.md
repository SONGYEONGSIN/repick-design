# auto-dash-r5 — HARD GATE 스코어

| 후보 | 브랜드 | 아키타입 | static | sweep | lighthouse a11y | lighthouse perf(기록만) |
|---|---|---|---|---|---|---|
| a | Ballast | 3-페인 마켓/트레이딩 터미널(FX 리스크 데스크) | pass | pass (1회 수정 후 통과 — 포지션 테이블 마지막 열 콜그룹 % 재배분 + 패딩 축소, 1264/1280px에서 5~7px table-overflow) | 100 (1차 97 → 선택 행 zinc-500 캡션·rose 계열 대비 미달 2건 수정 후 100) | 95 |
| b | Quay | 통합 인박스 트리아지(Front/Intercom급) | pass | pass (1회 수정 후 통과 — Sparkline sr-only 데이터 테이블이 `sr-only` 클래스를 `<table>`에 직접 적용해 table auto-layout 콘텐츠 기반 확장으로 288px까지 부풀어 1536px 이상에서 34px page-overflow; `sr-only` div 래퍼로 감싸 1px 고정) | 100 (1차 96 → 선택 대화 행 배경(indigo-50) 위 zinc-500 타임스탬프·rose-600 Urgent 배지 대비 미달 2건 수정 후 100) | 97 |
| c | Bisect | 대칭 비교(A/B 실험) 대시보드 | pass | pass (1차부터 통과) | 100 (1차부터 100) | 97 |

## 하드게이트 비고
- **static**: 최초 스캔에서 a의 `ui.tsx` 정렬 화살표 유니코드 문자(▲▼↕)가 `no-emoji` 룰(Extended_Pictographic)에 걸림 — lucide-react `ArrowUp/ArrowDown/ArrowUpDown` 아이콘으로 교체 후 3파일 전체 정적 위반 0건.
- **sweep**: `DESKTOP_WIDTHS=[1280,1366,1440,1536,1680,1920]` ± 16px(SLACK) 전 구간 + 모바일 390px 측정. a/b는 1회 수정 후 재sweep(해당 route만)으로 전원 통과, c는 최초 통과.
  - a 결함은 "그리드 검증 룰 v2"(카드 내 테이블 완전 수납)의 표준 재발 패턴(콜그룹 % 배분 부족).
  - b 결함은 새로운 패턴 — sr-only 유틸리티를 `<table>` 요소에 직접 적용하면 `table-layout:auto`의 콘텐츠 기반 최소폭 확장 때문에 `width:1px`가 무시되고 실제 콘텐츠 폭(약 289px)까지 렌더링됨(`table-layout:fixed`+`min-w-0`을 추가해도 재현 — 브라우저가 표 자체의 min-content 하한을 강제하는 것으로 보임). position:absolute라 형제 요소를 밀어내진 않지만 자신의 박스가 뷰포트를 벗어나 `document.documentElement.scrollWidth`를 늘림 → 최종 수정은 `sr-only`를 `<table>`이 아니라 감싸는 `<div>`에 적용하는 것.
- **lighthouse a11y**: 3후보 모두 1차 스캔에서 ≥95(하드게이트 통과선) 도달(a 97 / b 96 / c 100)이었으나, 축적된 delta(다크/라이트 표면 보조텍스트 대비 규칙)의 신규 변종 — **선택(active/selected) 상태의 틴트 배경**(blue-50/indigo-50) 위에서는 순수 라이트 배경 기준 zinc-500(4.5:1 근접 통과)이 4.31~4.43:1로 재차 미달하는 것을 확인해 하드게이트 통과 후에도 선제 수정(a: 워치리스트 선택 행 zinc-600 승격 + 계정 메뉴 aria-label에 시각 텍스트 이름 포함(label-content-name-mismatch 수정), b: 선택 대화 행 타임스탬프·Urgent 배지 색상 승격) — 3후보 전원 100/100 도달.
- **lighthouse perf**: 기록만(탈락 미적용) — a 95 / b 97 / c 97.
