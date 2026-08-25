# auto-native-r13 — SCORES

candidate source hash (frozen before gate): `55565851c39f2eaabb58ce36cd59409c93b3567e`
(`cat native/src/evolve/r13/*/*.tsx native/src/evolve/r13/*/*.ts | shasum`)

환경 고유 절차(스킬 밖): 이 세션에서 `PW_CHROMIUM_PATH`/`CHROME_PATH`/`PW_NO_SANDBOX` 환경변수가
Bash 툴 호출 간에 유지되지 않아(각 호출이 새 셸), 첫 `gate.mjs` 실행은 render 3건 전원 실패했다.
같은 커맨드에 `export PW_CHROMIUM_PATH=/opt/pw-browsers/chromium-1194/chrome-linux/chrome
CHROME_PATH=... PW_NO_SANDBOX=1`를 인라인으로 붙여 재실행하니 12/12 통과했다 — 코드 결함이 아니라
환경 셸 상태 소실이었음을 확인.

## 하드게이트 — `node scripts/gate.mjs --target native --screens evolve-r13-a evolve-r13-b evolve-r13-c`

| 후보 | tsc | export | render | iframe | 1-fix |
|---|---|---|---|---|---|
| a (Payout & Withdraw) | ✅ | ✅ | ✅ | ✅ | 불요(1차 통과) |
| b (Seller Onboarding Setup) | ✅ | ✅ | ✅ | ✅ | 불요(1차 통과) |
| c (Support Center) | ✅ | ✅ | ✅ | ✅ | 불요(1차 통과) |

3후보 전원 12/12 게이트 1차 통과. `pass:true`, `violations: []`.
