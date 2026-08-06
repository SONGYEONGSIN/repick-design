# SCORES — auto-careers-r1

게이트 실행: `CHROME_PATH=/opt/pw-browsers/chromium PW_NO_SANDBOX=1 PW_CHROMIUM_PATH=/opt/pw-browsers/chromium node scripts/gate.mjs --target web --routes /careers-evolve/r1/<v>`

소스 동결 해시(1-fix 이후, `cat r1/*/*.tsx r1/*/*.ts | shasum`): `65b17e3928bb9fa1712fe70ccf279d101daa9377`

| 후보 | static | weights | sweep | a11y | perf | pass |
|---|---|---|---|---|---|---|
| a — Fathom Labs | 위반 0 (1-fix 후) | 3종 | 오버플로 0 | 100 | 71 | ✅ |
| b — Portside | 위반 0 | 3종 | 오버플로 0 | 97 | 70 | ✅ |
| c — Northlane | 위반 0 | 3종 | 오버플로 0 | 100 | 70 | ✅ |

## 1-fix 루프
- **a**: 1차 static 위반 1건 — `no-emoji`가 footer의 `©`(U+00A9, Unicode Extended_Pictographic 속성 보유)를 이모지로 오탐. `page.tsx:213` `© 2026 Fathom Labs` → `Copyright 2026 Fathom Labs`로 수정 후 재게이트, 전 항목 통과. 취향 개선이 아니라 정적 규칙 위반 해소이므로 §3-1 범위 내(승자 확정 전 1-fix 루프 단계라 §3-1 "판정 후 수정" 조항과는 별개 — 통상 하드게이트 1-fix).
- b·c는 1차부터 전 항목 통과.
