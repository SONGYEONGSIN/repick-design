# SCORES — auto-contact-r2

판정 대상 해시: `b2ed540111f02d04797ff962e17676c97e68f7ea` (게이트 전/후 동일 — `cat app/src/app/contact-evolve/r2/*/*.tsx app/src/app/contact-evolve/r2/*/*.ts | shasum`)

## 하드게이트 — `node scripts/gate.mjs --target web --routes /contact-evolve/r2/<v>` (후보별 개별 실행)

| | route | static | lint | weights | sweep | a11y | perf |
|---|---|---|---|---|---|---|---|
| a — Escalation Ladder | OK | 위반 0 | 위반 0 | 3종 | 오버플로 0 | **100** | 74(기록만) |
| b — Trust Tier Console | OK | 위반 0 | 위반 0 | 3종 | 오버플로 0 | **100** | 66(기록만) |
| c — Desk Directory | OK | 위반 0 | 위반 0 | 3종 | 오버플로 0 | **100** | 70(기록만) |

3/3 전원 1차 통과. 1-fix 루프 불요.

환경 메모(무인 라운드 고유): 샌드박스 chromium 리비전(1194)이 playwright-core 기대 리비전(1228)과 달라 CDN 다운로드가 프록시에서 차단됨 — `PW_CHROMIUM_PATH=/opt/pw-browsers/chromium`(executablePath 오버라이드, native r2에서 이미 스크립트에 반영) + lighthouse용 `CHROME_PATH`/`PW_NO_SANDBOX=1`(root 실행이라 `--no-sandbox` 필요, `gate.mjs`가 이미 지원하는 플래그) 환경변수로 우회. 게이트 로직·기준 자체는 무변경.
