---
tags: [auto-landing-r23, scores]
---

# auto-landing-r23 — SCORES

소스 상태 해시(게이트/스크린샷/judge가 본 산출물의 동일성 증거): `a0db3e929c09c802a9ceae5686010002c26d4b97`
(`cat app/src/app/landing-evolve/r23/*/*.tsx app/src/app/landing-evolve/r23/*/*.ts | shasum`)

환경 메모: 샌드박스 사전설치 Chromium 리비전(1194) vs Playwright 1.61.1 요구(1228) 불일치 + root 실행 sandbox 제약 — `CHROME_PATH`/`PW_CHROMIUM_PATH=/opt/pw-browsers/chromium` + `PW_NO_SANDBOX=1` 로 우회(선례: `auto-landing-r22`·`auto-native-r16` 등과 동일 패턴, 스킬/게이트 스크립트 변경 없음). `images.unsplash.com` 아웃바운드 차단(403, Q49와 동일)도 재확인됨 — 스크린샷상 해당 이미지가 깨져 보일 수 있음, 판정 유효성엔 영향 없음(레이아웃 예약 규칙으로 검증).

모든 후보 1차 통과, 1-fix 불요.

| 후보 | route | types | static | lint | weights | sweep | focus | console | a11y | perf |
|---|---|---|---|---|---|---|---|---|---|---|
| a (The Grading Timeline) | OK | 에러0 | 위반0 | 위반0 | 3종 | 오버플로0 | 누락0 | 결함0(26건) | **100**(bf-cache만) | 66 |
| b (Comparable Sales Distribution) | OK | 에러0 | 위반0 | 위반0 | 3종 | 오버플로0 | 누락0 | 결함0(40건) | **100**(bf-cache만) | 64 |
| c (Price Lab) | OK | 에러0 | 위반0 | 위반0 | 3종 | 오버플로0 | 누락0 | 결함0(80건) | **100**(bf-cache만) | 68 |

게이트 커맨드: `CHROME_PATH=/opt/pw-browsers/chromium PW_CHROMIUM_PATH=/opt/pw-browsers/chromium PW_NO_SANDBOX=1 node scripts/gate.mjs --target web --routes /landing-evolve/r23/<v>`

전 후보 12/12 하드게이트 클린 → §4 JUDGE 패널로 전원 진입.
