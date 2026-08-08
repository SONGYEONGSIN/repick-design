# SCORES — auto-careers-r3

게이트 실행: `CHROME_PATH=/opt/pw-browsers/chromium PW_NO_SANDBOX=1 PW_CHROMIUM_PATH=/opt/pw-browsers/chromium node scripts/gate.mjs --target web --routes /careers-evolve/r3/<v>`

소스 동결 해시(`cat r3/*/*.tsx r3/*/*.ts | shasum`): `a6531c101ed83c7ebc1c24fb345359ad80e260d0`

| 후보 | static | weights | sweep | a11y | perf | pass |
|---|---|---|---|---|---|---|
| a — Isoline | 위반 0 | 3종 | 오버플로 0 | 100 | 80 | ✅ |
| b — Loomwork | 위반 0 | 3종 | 오버플로 0 | 100 | 68 | ✅ |
| c — Fenmark | 위반 0 | 3종 | 오버플로 0 | 100 | 72 | ✅ |

1-fix 루프 불요 — 전 후보 1차 통과.

스크린샷: 후보별 16장(4폭×4스크롤 지점), blank 판정 전원 통과(48/48, `blanks: []`).

## 프로세스 주석

이 라운드는 `about r3`와 달리 세션 워커 재시작 없이 3개 designer 서브에이전트가 전원 완주했다(candidate a가 스스로 JSX 표현식-공백 소실 결함을 발견·수정한 것을 자체 보고 — `about r3`의 비승자 b에서 이 세션이 처음 관측한 것과 같은 결함 클래스가 다른 타깃·다른 세션 컨텍스트에서 독립 재현됨. 재현 2회째이나 about-r3/b는 미승격 참고 기록이었고 이번은 designer 자체 수정으로 산출물에 남지 않아, 정식 delta 승격 여부는 이 라운드 DECISION §참고에 관측만 남긴다).
