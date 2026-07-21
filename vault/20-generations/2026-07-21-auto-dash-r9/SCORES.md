# auto-dash-r9 — SCORES

타깃: dash · 후보 3개 (a/b/c) · 하드게이트 결과

## 정적 검사 (dash-static-check.mjs)
`node scripts/dash-static-check.mjs app/src/app/dash-evolve/r9/{a,b,c}/*.tsx` → `[]` (전 후보 1차 통과, 위반 0건 — 이미지 규칙 3종 포함)

## sweep (dash-sweep.mjs)
`PW_CHROMIUM_PATH=/opt/pw-browsers/chromium node scripts/dash-sweep.mjs --base http://localhost:3100 --routes /dash-evolve/r9/a /dash-evolve/r9/b /dash-evolve/r9/c`
→ `{"pass": true, "failures": []}` — 1280/1366/1440/1536/1680/1920(−16px 여유폭 변형 포함) + 모바일 390px 전 구간 page/table-overflow 0건, 전 후보 1차 통과.

(참고: 이 샌드박스에 사전 설치된 Chromium이 root package.json이 요구하는 playwright 리비전(1228)보다 오래된 빌드(1194)라 `PW_CHROMIUM_PATH` 환경변수로 dash-sweep.mjs 내장 override를 사용 — 스크립트 자체 수정 없음.)

## Lighthouse (a11y ≥95 하드게이트 · perf 기록만)

| 후보 | a11y | perf | 잔여 마이너 이슈 |
|---|---|---|---|
| a (Redline) | 96 | 96 | color-contrast 1건 (숨김 상태 반응형 버튼, `hidden` 클래스 — 렌더 시 비가시) |
| b (Meshline) | 100 | 96 | label-content-name-mismatch 5건 (그래프 노드 버튼 — 시각 라벨 없음, 접근성 이름은 상세 aria-label로 이미 더 풍부하게 제공, false positive 성격) |
| c (Currents) | 97 | 96 | color-contrast 2건 (배지·숨김 상태 반응형 버튼) |

전 후보 하드게이트(a11y ≥95) 1차 통과 — 수정 사이클 불요(임계 상회, dash-brief-v3.md 기준 재수정 대상 아님). perf는 기록만(탈락 미적용).

## 결론
3개 후보 전원 하드게이트 통과 → JUDGE 패널 진행.
