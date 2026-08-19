# SCORES — auto-native-r8

소스 해시(동결, 게이트/캡처/judge 전 공통): `fd15d31baf58e7121a98447feb7527ce8cf76907`
(`cat native/src/evolve/r8/*/*.tsx native/src/evolve/r8/*/*.ts | shasum`)

환경 고유 조치: 이 컨테이너의 playwright-core(1.61.1)가 요구하는 chromium build(1228)가 미설치이고,
사전 설치된 시스템 chromium은 build 1194뿐이었다. `native/scripts/validate.sh`가 이미 지원하는
`PW_CHROMIUM_PATH`/`CHROME_PATH`/`PW_NO_SANDBOX=1` 환경변수로 `/opt/pw-browsers/chromium`(1194)을
가리켜 해결 — [[curation-criteria]] 2026-08-16 dash r15 판정에서 쓴 것과 동일 계열 조치, 스킬 불변 사항 아님(환경 조치).

| 후보 | tsc | export | render | iframe | 결과 |
|---|:--:|:--:|:--:|:--:|:--:|
| evolve-r8-a (Seller Storefront) | 통과 | 통과 | 통과 | 통과 | 생존 (1차 통과, 1-fix 불요) |
| evolve-r8-b (Write a Review) | 통과 | 통과 | 통과 | 통과 | 생존 (1차 통과, 1-fix 불요) |
| evolve-r8-c (Checkout / Order Review) | 통과 | 통과 | 통과 | 통과 | 생존 (1차 통과, 1-fix 불요) |

전 후보 12/12 게이트 1차 통과. 1-fix 루프 미발동.
