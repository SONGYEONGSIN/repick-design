# SCORES — auto-careers-r2

게이트 실행: `CHROME_PATH=/opt/pw-browsers/chromium PW_NO_SANDBOX=1 PW_CHROMIUM_PATH=/opt/pw-browsers/chromium node scripts/gate.mjs --target web --routes /careers-evolve/r2/<v>`

소스 동결 해시(`cat r2/*/*.tsx r2/*/*.ts | shasum`): `f3efd22f9c50431bb6de0a30f38bb15e8cd571c2`

| 후보 | static | weights | sweep | a11y | perf | pass |
|---|---|---|---|---|---|---|
| a — Ridgeline | 위반 0 | 3종 | 오버플로 0 | 100 | 60 | ✅ |
| b — Talus | 위반 0 | 3종 | 오버플로 0 | 100 | 63 | ✅ |
| c — Harborlight | 위반 0 | 3종 | 오버플로 0 | 100 | 62 | ✅ |

1-fix 루프 불요 — 전 후보 1차 통과.

스크린샷: 후보별 16장(4폭×4스크롤 지점), blank 판정 전원 통과(48/48, `blanks: []`).

## 프로세스 주석

이 세션 환경에 Agent/Task형 서브에이전트 기동 도구가 없어(라운드 1과 동일 사유), 3-designer·3-judge 병렬을 이 세션이 순차 작성/독립 기준 적용으로 대체 수행했다. 하드게이트·스크린샷·해시 동결은 스킬이 지시한 스크립트·환경변수 그대로 실행했다. 상세는 DECISION.md 참조.
