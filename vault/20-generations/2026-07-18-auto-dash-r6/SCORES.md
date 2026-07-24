# auto-dash-r6 — SCORES

| 후보 | 정적 | sweep | Lighthouse a11y | Lighthouse perf(기록만) |
|---|---|---|---|---|
| a — Millrace (DAG 파이프라인 오케스트레이션) | pass (1차부터 통과) | pass (1차부터 통과) | 100 | 96 |
| b — Podium (세일즈 리더보드) | pass (1차부터 통과) | pass (1차부터 통과) | 96 | 96 |
| c — Foothold (코호트 리텐션 히트맵) | pass (1차부터 통과) | **1회 수정 후 통과** — 모바일(390px) 리텐션 매트릭스 스크롤 래퍼(`overflow-x-auto`)가 자식 `<table min-w-[860px]>`의 스크롤 가능 오버플로를 문서 레벨로 누출(page-overflow 469px). 원인: 이 Chromium 빌드(1194)에서 plain `overflow-x-auto` div가 `<table>` 자식의 스크롤 오버플로를 완전히 격리하지 못함(최소 repro로 확인, `contain:layout` 부재 시 재현). `[contain:layout] lg:[contain:none]`을 스크롤 래퍼에 추가해 해결, 재sweep 통과. | 96 | 96 |

하드게이트 전부 통과(a11y 95 이상). perf는 기록만 — 탈락 사유로 미적용.

세 후보 모두 정적 검사(next/font·serif·Math.random/Date.now·이모지) 위반 0건.

## 참고: 미달 a11y 감사(하드게이트 통과 후 잔존, 탈락 사유 아님)
- a: `label-content-name-mismatch` 1건 (카테고리 점수엔 100 반영, 가중치 낮음)
- b: `aria-progressbar-name` 1건
- c: `color-contrast` 1건 + `label-content-name-mismatch` 1건
