# auto-native-r19 — hard gate (§3)

정본 해시(게이트 직전 동결, 후보 3개 소스 이어붙임 SHA-1): `76420b310acec8cfc4d42105aa0a91cc1f1a6d94`

`node scripts/gate.mjs --target native --screens evolve-r19-a evolve-r19-b evolve-r19-c` (env: `PW_CHROMIUM_PATH=/opt/pw-browsers/chromium PW_NO_SANDBOX=1 CHROME_PATH=/opt/pw-browsers/chromium`)

| 후보 | tsc | export | render | iframe |
|---|---|---|---|---|
| a (Shipment Pickup) | ✅ | ✅ | ✅ | ✅ |
| b (Bundle Builder) | ✅ | ✅ | ✅ | ✅ |
| c (Listing Q&A) | ✅ | ✅ | ✅ | ✅ |

12/12 게이트 1차 클린 — 1-fix 루프 미소모, `blockedBy` 없음.
