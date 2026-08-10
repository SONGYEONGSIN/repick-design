# SCORES — auto-native-r2

판정 대상 해시: `8f18f529fdd1a061efedba499122b5ea1647996e` (게이트 전/후 동일 — `cat native/src/evolve/r2/*/*.tsx native/src/evolve/r2/*/*.ts | shasum`)

## 하드게이트 — `node scripts/gate.mjs --target native --screens evolve-r2-a evolve-r2-b evolve-r2-c`

| 후보 | tsc | export | render | iframe |
|---|:--:|:--:|:--:|:--:|
| a — Discover (Search & Discover) | ✅ | ✅ | ✅ | ✅ |
| b — AlertsCenter (Alerts Center) | ✅ | ✅ | ✅ | ✅ |
| c — Preferences (Account & Preferences) | ✅ | ✅ | ✅ | ✅ |

12/12 통과. 1-fix 루프 불요.

환경 메모(무인 라운드 고유): 샌드박스 chromium 리비전(1194)이 `node_modules`의 playwright-core가 기대하는 리비전(1228)과 달라 `native/scripts/iframe-check.mjs`·`native/scripts/validate.sh`에 `executablePath: process.env.PW_CHROMIUM_PATH` 오버라이드를 추가(스킬 불변식 대상 아님 — 정본/게이트 로직 무변경, 환경 고유 실행 경로만 보정). `PW_CHROMIUM_PATH=/opt/pw-browsers/chromium`로 게이트 실행.
