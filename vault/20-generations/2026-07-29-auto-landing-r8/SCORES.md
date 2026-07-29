# SCORES — auto-landing-r8

| 후보 | static | sweep | a11y | perf | 비고 |
|---|---|---|---|---|---|
| a — Signal Graph | pass (위반 0) | pass (오버플로 0) | 96 | 96 | 1차 통과 |
| b — Counterweight | pass (위반 0) | 1회 수정 후 pass | 96 | 96 | 1차 sweep 실패(390px page-overflow +8px) — 우측 pan(`left:85%`+`w-46%`) 우측단이 스테이지 108%로 이탈, 모바일에서만 섹션 패딩 여유를 넘김. `left-[74%] sm:left-[85%]`로 반응형 오프셋 적용 후 재통과 |
| c — Strata | pass (위반 0) | pass (오버플로 0) | 100 | 96 | 1차 통과 |

hardgate 요약 (ledger 소싱용):
- static: pass (a,b,c 전부 위반 0건)
- sweep: pass (a,c는 1차 통과; b는 1회 수정 후 통과 — 우측 pan 절대배치 오프셋이 모바일 390px에서만 스테이지 우측단 이탈, `left-[74%] sm:left-[85%]` 반응형 분리로 해결)
- lighthouse: a11y 96/96/100(a/b/c, 전부 하드게이트 95 이상 통과) · perf 96/96/96(기록만, 탈락 미적용) — 사전설치 Chromium(rev1194)을 PW_CHROMIUM_PATH+PW_NO_SANDBOX(gate.mjs·dash-sweep.mjs 내장 opt-in env var, r7 선례와 동일)로 기동해 실측
