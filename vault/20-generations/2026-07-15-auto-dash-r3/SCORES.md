# auto-dash-r3 — HARD GATE 결과

| 후보 | 아키타입 | 정적 | sweep | a11y | perf (기록만) |
|---|---|---|---|---|---|
| a — Trackline | 간트/타임라인 중심 | pass | pass (1회 수정: DetailRail/Gantt/ui.tsx의 min-w-0·history-table 셀 truncate 등 없음 — 애초 sweep 통과, 해당 없음) | 100/100 (1차 91 → aria-progressbar-name·color-contrast·heading-order 1회 수정 후 100) | 96 |
| b — Waylight | 지도(맵) 중심 | pass | pass (1차 실패 → 1회 수정 후 통과: topbar 검색버튼 min-w-0, filter-bar 존칩 overflow-x→flex-wrap, history-table 셀 truncate 래핑) | 100/100 (1차부터 100) | 96 |
| c — Fieldset | 덴스 데이터그리드 중심 | pass | pass (1차 실패 → 1회 수정 후 통과: DealsGrid 테이블 스크롤 래퍼 contain-layout+min-w-0, dashboard-client min-w-0 체인) | 100/100 (1차 93 → StatStrip dl 마크업 구조 결함 1회 수정 후 100) | 95 |

## 상세 로그

### 정적 검사 (dash-static-check.mjs)
전 후보 전체 파일 대상 실행 — 위반 0건 (next/font·세리프폰트·Math.random/Date.now·이모지 전부 없음).

### sweep (dash-sweep.mjs, 1280/1366/1440/1536/1680/1920 및 각 -16px + 모바일 390)
- 1차: a 통과. b 실패(390px page-overflow 66px, 1264~1536px 구간 table-overflow 78~350px — map-panel 존칩 overflow-x-auto + history-table 셀 미truncate). c 실패(390px page-overflow 476px — DealsGrid 테이블 스크롤 래퍼가 페이지 레벨로 오버플로 누출).
- 1회 수정 후 재sweep: a/b/c 전원 통과 (0 failures).

### Lighthouse (--preset=desktop, --only-categories=performance,accessibility)
- 1차: a11y a=91(aria-progressbar-name, color-contrast, heading-order), b=100, c=93(definition-list, dlitem — StatStrip dl 마크업 구조 위반).
- 1회 수정 후 재측정: a11y a=100, b=100(변경 없음), c=100. perf는 a=96/b=96/c=95로 기록만(탈락 미적용).
- Lighthouse 실행 환경: 샌드박스 프록시가 playwright-core pin(1.61.1, chromium rev 1228) 다운로드를 차단(cdn.playwright.dev host not permitted) — `/opt/pw-browsers/chromium`(사전 설치된 rev 1194)을 `CHROME_PATH`로 지정해 lighthouse CLI 실행. sweep도 동일 사유로 로컬 executablePath 래퍼(임시 스크립트, 커밋 대상 아님)로 실행 — 커밋에는 포함하지 않음.

## 생존 후보
3개 전원 하드게이트 생존 (a, b, c) — JUDGE 패널로 진행.
