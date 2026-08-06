# SCORES — auto-about-r1

게이트 실행: `CHROME_PATH=/opt/pw-browsers/chromium PW_NO_SANDBOX=1 PW_CHROMIUM_PATH=/opt/pw-browsers/chromium node scripts/gate.mjs --target web --routes /about-evolve/r1/<v>`

소스 동결 해시(`cat r1/*/*.tsx r1/*/*.ts | shasum`): `76334675e503529ca0596de5dc0dca2f667043eb`

| 후보 | static | weights | sweep | a11y | perf | pass |
|---|---|---|---|---|---|---|
| a — Portage | 위반 0 | 3종 | 오버플로 0 | 100 | 66 | ✅ |
| b — Tallwood | 위반 0 | 3종 | 오버플로 0 | 100 | 64 | ✅ |
| c — Northline | 위반 0 | 3종 | 오버플로 0 | 96 | 72 | ✅ |

1-fix 루프 불요 — 전 후보 1차 통과.
