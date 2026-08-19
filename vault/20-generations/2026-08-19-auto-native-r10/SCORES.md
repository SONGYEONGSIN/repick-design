# auto-native-r10 — SCORES

freeze hash (native/src/evolve/r10/*/*.tsx + *.ts): `4d162a18542b48a0407cca638b4f7a12bfb75c73`

## 후보 개요
- a — Search & Browse (SearchBrowseScreen.tsx)
- b — Chat Inbox (ChatInbox.tsx → ChatInboxScreen)
- c — Report Listing / User (ReportListingScreen.tsx)

## 하드게이트 (`node scripts/gate.mjs --target native --screens evolve-r10-a evolve-r10-b evolve-r10-c`)

| 후보 | tsc | export | render | iframe |
|---|---|---|---|---|
| a | 통과 | 통과 | 통과 | 통과 |
| b | 통과 | 통과 | 통과 | 통과 |
| c | 통과 | 통과 | 통과 | 통과 |

3후보 전원 12/12 게이트 1차 통과 (1-fix 불요). `violations: []`.

환경 고유: `PW_CHROMIUM_PATH=/opt/pw-browsers/chromium` + `CHROME_PATH` + `PW_NO_SANDBOX=1`로 chromium build 1194 사용 (컨테이너에 playwright-core가 요구하는 최신 빌드 미설치 — r8과 동일 환경 이슈).
