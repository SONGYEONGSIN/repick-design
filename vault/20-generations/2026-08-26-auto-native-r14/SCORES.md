# SCORES — auto-native-r14

- 환경 부트스트랩(스킬 밖, 이 세션 고유): `native/` 자체 `npm install` 누락 → 조치(r12 선례와 동일 패턴). `PW_CHROMIUM_PATH=/opt/pw-browsers/chromium` + `CHROME_PATH=/opt/pw-browsers/chromium` + `PW_NO_SANDBOX=1` 인라인 지정(chromium build 1194).
- 후보 소스 해시(freeze, `cat native/src/evolve/r14/*/*.tsx native/src/evolve/r14/*/*.ts | shasum`): `3627bcbc6be85ca51eaccfddbd98769813a60b66`

## 하드게이트 (`node scripts/gate.mjs --target native --screens evolve-r14-a evolve-r14-b evolve-r14-c`)

| 후보 | tsc | export | render | iframe |
|---|---|---|---|---|
| a (Bulk Relist / Inventory Manager) | ✅ | ✅ | ✅ | ✅ |
| b (Referral & Rewards) | ✅ | ✅ | ✅ | ✅ |
| c (Wallet & Transaction History) | ✅ | ✅ | ✅ | ✅ |

전 후보 12/12 통과, 1-fix 루프 불요(1차 통과).
