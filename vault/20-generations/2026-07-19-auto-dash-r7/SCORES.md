# auto-dash-r7 — HARD GATE SCORES

TARGET=dash · 후보 2개(a,b) · 2026-07-19

| 후보 | 아키타입 | static (이미지 규칙 포함) | sweep (overflow) | Lighthouse a11y (게이트 ≥95) | perf (기록만) | next/image |
|---|---|---|---|---|---|---|
| a — Apogee | Orbit Canvas (동심원 궤도) | pass `[]` (1차) | pass (1차, overflow 0) | **100** pass | 97 | 3곳 (상단바·사이드바 유저 아바타, 상세 패널 고객 아바타) |
| b — Tessera | Treemap Cockpit (2단 트리맵) | pass `[]` (1차) | pass (1차, overflow 0) | **97** pass | 97 | 2곳 (상단바 유저 아바타, 보유/상세 자산 셀) |

- 정적: 두 후보 모두 1차부터 위반 0건 — 이미지 규칙 3종(no-raw-img·img-needs-alt·no-unoptimized) 포함 통과. 즉 두 후보 다 next/image·alt·비-unoptimized 준수.
- sweep: 1280/1366/1440/1536/1680/1920(−16px 여유폭 포함) 전 구간 + 모바일 390px, page-overflow·table-overflow 0.
- Lighthouse: a11y 100/97 전부 하드게이트(≥95) 통과. perf는 dev 서버 측정, 기록만(탈락 미적용).
- 배선 결함: 후보 a는 designer 1차 산출에서 page.tsx(App Router 엔트리)와 컨셉 노트 a.md가 누락 → 오케스트레이터가 designer를 1회 재개(SendMessage)하여 page.tsx(→OrbitClient default export)·a.md 완성. 재개 후 static-check `[]`·렌더 200 확인. b는 1차부터 완비.
