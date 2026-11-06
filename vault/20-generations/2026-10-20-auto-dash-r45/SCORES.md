# auto-dash-r45 — SCORES

Post-fix freeze hash (`cat app/src/app/dash-evolve/r45/*/*.tsx app/src/app/dash-evolve/r45/*/*.ts | shasum`): `d993b37cf52684a3daf3379559a6f09b4824fa90`
Pre-fix freeze hash (GENERATE completion, before 1-fix): `aaa354e189e348c65e6121646d363ca2ab8e276c`

| gate | a (Vendly) | b (Kelvin) | c (Switchboard) |
|---|---|---|---|
| route | pass | pass | pass |
| types | pass (에러 0) | pass (에러 0) | pass (에러 0) |
| static | pass (위반 0) | pass (위반 0) | pass (위반 0) |
| lint | **1-fix** → pass | pass (위반 0, no fix needed) | **1-fix** → pass |
| weights | pass (3종, 렌더 실측) | pass (3종, 렌더 실측) | pass (3종, 렌더 실측) |
| sweep | pass (오버플로 0) | pass (오버플로 0) | pass (오버플로 0) |
| focus | pass (누락 0건) | pass (누락 0건) | pass (누락 0건) |
| console | pass (결함 0) | pass (결함 0) | pass (결함 0) |
| a11y | unavailable (Lighthouse 미가용 — 기록전용 pass) | unavailable | unavailable |
| perf | unavailable | unavailable | unavailable |

## 1-fix 상세

- **a (Vendly)**: `command-palette.tsx` — `react-hooks/set-state-in-effect` 2건 (query-change 시 `setActiveIndex(0)`, open 시 `setQuery("")`+`setActiveIndex(0)`를 각각 `useEffect` 본문에서 동기 호출). **오케스트레이터가 직접 수정** — `auto-dash-r39/b` 선례(렌더 중 `prevOpen`/`prevQuery` 비교로 전환)와 동일 패턴 적용. `.focus()` 타임아웃은 진짜 DOM 부수효과라 `useEffect`에 남김. 재게이트 클린.
- **c (Switchboard)**: `command-palette.tsx` — 동일 규칙 1건(open 시 `setQuery("")`). 동일 패턴으로 수정(`prevOpen` 렌더 중 비교), `.focus()` 호출은 effect에 유지. 재게이트 클린.
- **b (Kelvin)**: 1차부터 클린(1-fix 불요) — command palette가 같은 open-reset idiom을 쓰지 않음(디자이너 리포트: 작업 중 발견한 미사용 컴포넌트 `ChangeBadge`/`Avatar`/`Pill`를 자체적으로 제거).

`blockedBy` 해당 없음 — 웹 타깃은 라우트별 격리라 후보 간 귀속 분기가 필요 없다(native 전용 규칙).

## Note
`PW_CHROMIUM_PATH=/opt/pw-browsers/chromium` 환경변수로 게이트의 Playwright 브라우저 경로를 오버라이드함 — 이 샌드박스의 사전설치 Chromium(리비전 1194)이 `app/node_modules/playwright-core`가 기대하는 리비전(1228)과 달라 기본 실행이 `browserType.launch` 에러로 실패했다. `dash-sweep.mjs`·`capture-shots.mjs`가 이미 `process.env.PW_CHROMIUM_PATH` 오버라이드를 지원해 코드 수정 없이 해소됨.
