# auto-native-r17 — SCORES

게이트: `PW_CHROMIUM_PATH=/opt/pw-browsers/chromium CHROME_PATH=/opt/pw-browsers/chromium PW_NO_SANDBOX=1 node scripts/gate.mjs --target native --screens evolve-r17-a evolve-r17-b evolve-r17-c` (세션 로컬 chromium 사전설치본 — playwright.dev CDN 다운로드가 프록시에서 차단됨, gate.mjs 자체는 무수정)

환경 부트스트랩: `native/node_modules` 미설치 상태로 세션 시작 → `cd native && npm install`(503 packages) 조치 — r12·r14·r16 등 다수 선례와 동일 계열, 스킬 밖 절차.

소스 동결 해시(§2 종료 시점): `d53325fcf62ee7c38757f7ea50ea95f387d698a2`

등록: `native/screens.ts`(import + `COMPONENTS["evolve-r17-<v>"]`)·`native/screens.json`("evolve-r17-<v>": {"check": ...})에 3후보 전원 등재 — designer 3명은 공유 레지스트리를 직접 수정하지 않고 컴포넌트만 작성(r15 선례와 동일 계열, 경쟁조건 회피), 오케스트레이터가 3후보 완료 확인 후 순차 등록.

| 후보 | 개념 | check 문자열 | tsc | export | render | iframe |
|---|---|---|---|---|---|---|
| a | Seller Performance Scorecard | "Performance Scorecard" | 통과 | 통과 | 통과 | 통과 |
| b | Item Authentication Submission | "Submit for Authentication" | 통과 | 통과 | 통과 | 통과 |
| c | Price Suggestion & Market Comps | "Price Suggestion" | 통과 | 통과 | 통과 | 통과 |

**12/12 게이트 1차 통과, 1-fix 미소모.** 전역 tsc 클린(blockedBy 없음 — 후보 간 상호 컴파일 방해 없음).
