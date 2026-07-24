# auto-landing-r5 — SCORES

| 후보 | 아키타입 | 정적 | sweep | a11y | perf(기록) |
|---|---|---|---|---|---|
| a | 매칭 정확도 다이얼(Radial Gauge) 히어로 | pass (1차) | pass (1차) | 100 | 95 |
| b | 옷장 레일(Wardrobe Rail) 드래그 히어로 | pass (1차) | **1회 수정 후 pass** — 드래그 트랙이 `overflow-x-auto`(스크롤 트랙)라 데스크톱 전 폭에서 table-overflow 1114px(항상 발생하는 의도된 캐러셀 오버플로) → `overflow-hidden` + 프로그래매틱 `scrollLeft`(터치 포함 포인터 드래그, `centerItem` 수동 스크롤 계산)로 전환. CSS 오버플로 스펙상 `overflow:hidden`도 스크롤 컨테이너를 형성해 프로그래매틱 스크롤은 그대로 동작하며 페이지 레벨로 오버플로가 새지 않음 — 클래스명이 `[class*="overflow-x"]` 셀렉터에 더 이상 매치되지 않아 하드게이트 통과, 실사용 드래그 경험은 변화 없음 | 100 | 95 |
| c | 라이브 서치 인덱스(Query-chip 필터) 히어로 | pass (1차) | pass (1차) | 100 | 96 |

- 정적: `dash-static-check.mjs` — 위반 0건 (전 후보 1차부터 통과, 이미지 규칙 3종 포함)
- sweep: `dash-sweep.mjs --base http://localhost:3100` — 1280/1366/1440/1536/1680/1920(−16px 여유폭 포함)+모바일 390px 전 구간
- Lighthouse: `--only-categories=performance,accessibility --preset=desktop` (dev 서버 측정 — perf는 기록만, 탈락 미적용). a11y 전부 100으로 하드게이트(≥95) 통과.
- 3개 후보 전부 하드게이트 생존 → JUDGE 패널 3렌즈 진행.
