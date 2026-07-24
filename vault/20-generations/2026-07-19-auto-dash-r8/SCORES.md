# auto-dash-r8 — HARD GATE 결과

대상: dash (SaaS 대시보드) · 후보 3개 · 라우트 `/dash-evolve/r8/{a,b,c}`

| 후보 | 컨셉 | static | sweep | Lighthouse a11y | Lighthouse perf(기록만) | 판정 |
|---|---|---|---|---|---|---|
| a | Chute — 체크아웃 퍼널 인텔리전스 | pass (1차, 위반 0건) | pass (1차, 1280~1920±16px + 390px 전 구간 overflow 0) | 100 | 97 | 생존 |
| b | Farsight — AI 코파일럿 챗독 워크스페이스 | pass (1차, 위반 0건) | pass (1차, 1280~1920±16px + 390px 전 구간 overflow 0) | 96 (aria-progressbar-name, label-content-name-mismatch — 하드게이트 95 통과, 수정 불요) | 96 | 생존 |
| c | Canopy — 조직/역량 트리 캔버스 | pass (1차, 위반 0건) | pass (1차, 1280~1920±16px + 390px 전 구간 overflow 0) | 97 (color-contrast, label-content-name-mismatch — 하드게이트 95 통과, 수정 불요) | 97 | 생존 |

- 전 후보 static-check 1차 통과(위반 0건) — 수정 기회 미사용.
- 전 후보 sweep 1차 통과 — 데스크톱 6폭(1280/1366/1440/1536/1680/1920) + 여유폭 −16px 변형 + 모바일 390px에서 page-overflow·table-overflow 0건.
- Lighthouse a11y 전 후보 하드게이트(≥95) 통과 — b(96)·c(97)는 마이너 잔여 이슈(진행바 accessible name, 라벨-콘텐츠 불일치, 대비 1건)가 있으나 임계 통과로 수정 불요(§3 규칙).
- Lighthouse perf는 기록만(97/96/97) — 탈락 사유로 미적용.
- 생존 후보 3개 → JUDGE 패널 3렌즈 진행.
