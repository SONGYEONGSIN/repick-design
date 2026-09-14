# SCORES — auto-native-r21

target: native · run: 2026-09-14-auto-native-r21

Source hash (concat of all `native/src/evolve/r21/*/*.tsx` + `*.ts`, sha1): `cae6ff97e5824e519530aea25c17c83726690376`

## 하드게이트 (1차, 1-fix 불요)

| 후보 | slug | tsc | export | render | iframe |
|---|---|:--:|:--:|:--:|:--:|
| a (Live Auction Bid) | evolve-r21-a | ✅ | ✅ | ✅ | ✅ |
| b (Compare Items) | evolve-r21-b | ✅ | ✅ | ✅ | ✅ |
| c (Invite Friends) | evolve-r21-c | ✅ | ✅ | ✅ | ✅ |

12/12 전원 1차 클린. `pass: true`, `violations: []`.

환경 메모: `native/node_modules`가 이 세션에서 미설치 상태였다(부트스트랩 지시에 `native/`가 빠져 있었음) — `cd native && npm install` 실행 후 재게이트해 통과. 첫 시도는 `expo/tsconfig.base` 미해석으로 전 파일 `TS17004`(JSX flag) 대량 오탐이었고 내 후보 코드 결함이 아니었다(기존 `ItemAuthenticationScreen.tsx` 등 기존 파일도 동일하게 실패했었다). 샌드박스 Chromium 리비전 불일치는 `PW_CHROMIUM_PATH`/`CHROME_PATH`=`/opt/pw-browsers/chromium-1194/chrome-linux/chrome` + `PW_NO_SANDBOX=1`로 선례와 동일하게 우회.
