# auto-landing-r21 — hard gate (§3)

정본 해시(게이트 직전 동결, 후보 3개 소스 이어붙임 SHA-1): `e1d0a841d7ace104ef8c5559a6026a344d1d652a`
(a의 `StageScrubber.tsx` 미사용 eslint-disable 지시어 1건 제거 — lint 게이트 1-fix. 나머지 위반 없음.)

`node scripts/gate.mjs --target web --routes /landing-evolve/r21/<v>` (env: `PW_CHROMIUM_PATH=/opt/pw-browsers/chromium PW_NO_SANDBOX=1 CHROME_PATH=/opt/pw-browsers/chromium` — 이 환경의 사전설치 Chromium 리비전이 이 레포 playwright(1.61.1, 기대 리비전 1228)와 어긋나 headless shell 를 못 찾아 명시 경로로 우회)

| 후보 | route/types | static | lint | weights | sweep | focus | console | a11y | perf | pass |
|---|---|---|---|---|---|---|---|---|---|---|
| a | OK/에러0 | 위반0 | 1차 warning 1(unused eslint-disable)→1-fix→위반0 | 3종 | 오버플로0 | 누락0 | 39건·결함0 | 96 (aria-hidden-focus · bf-cache) | 49 | ✅ |
| b | OK/에러0 | 위반0 | 위반0 (1차) | 3종 | 오버플로0 | 누락0 | 39건·결함0 | 95 (aria-prohibited-attr · bf-cache · landmark-one-main) | 49 | ✅ |
| c | OK/에러0 | 위반0 | 위반0 (1차) | 3종 | 오버플로0 | 누락0 | 77건·결함0 | 96 (aria-prohibited-attr · bf-cache) | 54 | ✅ |

3후보 전원 생존 — 1-fix 루프는 a의 lint 위반 1건뿐(기계적 미사용 지시어 삭제, 디자인 판단 불요라 오케스트레이터가 직접 수정). a11y 세 후보 모두 95 이상(하드페일 기준 미달 없음), perf는 기록만.
