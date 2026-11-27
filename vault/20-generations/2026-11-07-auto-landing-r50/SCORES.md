# auto-landing-r50 — SCORES

Frozen source hash (candidates a+b+c concatenated, before any 1-fix): `a1de52e8c8457cd82ddf4dd0279ffe416ec06b24`
(hash changed for candidate a after its 1-fix — see note below; b and c unchanged.)

| gate | a | b | c |
|---|---|---|---|
| route | pass | pass | pass |
| types | pass (에러 0) | pass (에러 0) | pass (에러 0) |
| static | **1차 실패** (위반 11, `no-unlisted-font` — `fontFamily: DISPLAY_FONT` JS 변수 참조, static-check 정규식은 `var(--font-...)` 리터럴만 인식) → **1-fix**: `DISPLAY_FONT` 변수 참조 11곳을 `"var(--font-display-grotesk)"` 리터럴로 인라인 치환, 미사용 const 제거 → 재게이트 위반 0 | pass (위반 0) | pass (위반 0) |
| lint | pass (위반 0) | pass (위반 0) | pass (위반 0) |
| weights | pass (3종, 렌더 실측) | pass (3종, 렌더 실측) | pass (3종, 렌더 실측) |
| sweep | pass (오버플로 0) | pass (오버플로 0) | pass (오버플로 0) |
| focus | pass (누락 0건) | pass (누락 0건) | pass (누락 0건) |
| console | pass (152건·결함 0) | pass (143건·결함 0) | pass (127건·결함 0) |
| a11y | pass (100) | pass (98 · `landmark-one-main` 실패 — 승격 7감사 목록 밖, 기록만) | pass (100) |
| perf | pass (95, 기록만) | pass (91, 기록만) | pass (94, 기록만) |
| **verdict** | **PASS (1-fix 1회 소진)** | **PASS (1차 클린)** | **PASS (1차 클린)** |

3후보 전원 생존 → §4 JUDGE 패널로 진행.
