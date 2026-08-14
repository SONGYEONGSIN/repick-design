# auto-native-r5 — SCORES

frozen hash (candidate 소스 전체 SHA-1): `9a77a3b0d316bb5a2ca932f127ffb939655b1837`

## 후보 개요
- **a** — Listing creation / upload flow (4-step wizard: Photos → Category&Condition → Price → Review&Publish). Confirmation-type. check: "Create listing"
- **b** — Order / shipment tracking timeline (4-step status stepper + terminal Confirm-receipt action). check: "Order status"
- **c** — Saved searches & alerts management (settings-type list, instant inline apply). check: "Saved searches"

## 하드게이트 (`gate.mjs --target native --screens evolve-r5-a evolve-r5-b evolve-r5-c`) — 1차 전원 통과 (1-fix 불요)

| 후보 | tsc | export | render | iframe |
|---|:--:|:--:|:--:|:--:|
| a | ✅ 통과 | ✅ 통과 | ✅ 통과 | ✅ 통과 |
| b | ✅ 통과 | ✅ 통과 | ✅ 통과 | ✅ 통과 |
| c | ✅ 통과 | ✅ 통과 | ✅ 통과 | ✅ 통과 |

`pass: true`, `violations: []` — 12/12 게이트 통과.

## 오케스트레이터 독립 확인 (게이트 미검사 항목, r1 선례에 따른 재확인)
- **SafeAreaView 최상위 래핑**: a(`:290`)·b(`:132`)·c(`:248`) 전부 함수 최종 `return`문의 리터럴 최상위 JSX가 `<SafeAreaView>`임을 소스 확인.
- **하드코딩 hex**: 0건 (grep 전수).
- **이모지**: 0건 (✓ 체크마크만 존재 — GENERATION.md 허용 범위인 텍스트 글리프).
- **한글 텍스트**: 0건.
- **결정론 위반**(`Math.random`/`Date.now`/무인자 `new Date()`): 0건.
- **₩+tabular-nums 아티팩트 회피** (r4 delta 대응): a·b 모두 ₩ 기호를 숫자 런과 분리된 별도 `<Text>`로 렌더링 확인.

전체 tsc(`npx tsc --noEmit`, native 전체)도 3후보 동시 등재 상태에서 0 에러.
