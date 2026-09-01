# SCORES — auto-landing-r17

동결 해시 (게이트 확정 시점, `cat app/src/app/landing-evolve/r17/*/*.tsx app/src/app/landing-evolve/r17/*/*.ts | shasum`):
`c57f2351fc8d93ec94463d1b3120dfa92daa5cf8`

환경 메모: 이 세션은 `/opt/pw-browsers`에 chromium revision 1194만 있었고 이 레포의 `playwright@1.61.1`은 리비전 1228을 요구했다 — `chromium-1228`·`chromium_headless_shell-1228` 심볼릭 링크(구조 재매핑 포함)로 우회했다. `lighthouse`/`chrome-launcher`는 npm 레지스트리에서 즉석 설치(`npm install --no-save lighthouse chrome-launcher`), `CHROME_PATH=/opt/pw-browsers/chromium` + `PW_NO_SANDBOX=1`로 root 컨테이너에서 실행. 둘 다 스킬 밖의 이 세션 고유 환경 복구이며 vault·게이트 스크립트 자체는 무변경.

## 후보별 게이트 (1차)

| 후보 | route | types | static | lint | weights | sweep | focus | console | a11y | perf |
|---|---|---|---|---|---|---|---|---|---|---|
| a | ✅ | ✅ | ✅ | ✅ | ✅ 3종 | ✅ | ✅ | ✅ | ✅ 100 (bf-cache만) | 57 |
| b | ✅ | ✅ | ✅ | ✅ | ✅ 3종 | ❌ 오버플로 12(전 데스크톱폭, div#0 table-overflow) | ✅ | ✅ | ✅ 100 (bf-cache만) | 58 |
| c | ✅ | ✅ | ✅ | ✅ | ✅ 3종 | ❌ 오버플로 1(390px, page-overflow +24px) | ✅ | ✅ | ✅ 98 (bf-cache·landmark-one-main만 — 둘 다 승격 감사 아님) | 61 |

## 1-fix

- **b**: 원인 — Hero.tsx 리스팅 선택 칩 행이 `overflow-x-auto`로 데스크톱에서도 가로 스크롤을 강제, 실제 콘텐츠 폭(~1100–1200px)이 우측 컬럼(≤1280px 캡) 폭을 넘어 문서 전체가 580~651px 오버플로. `sm:flex-wrap sm:overflow-visible sm:pb-0` 추가로 데스크톱은 줄바꿈, 모바일은 기존 가로 스크롤 캐러셀 유지. **재게이트 결과: 전 항목 통과(sweep 오버플로 0).**
- **c**: 원인 진단 — 순위 매물 카드의 `<h3 className="truncate …">`가 flex 행 안에서 `min-w-0`이 없어 `truncate`의 `white-space:nowrap`이 flex item 기본 `min-width:auto`를 텍스트 전체 폭으로 고정, 390px 1열 레이아웃에서 카드 폭 초과. `min-w-0 flex-1` 추가. **재게이트 결과: 동일 위반 재현(390px, +24px, page-overflow) — 원인이 해소되지 않았다.**

## 판정

- **a, b — 생존** (1차 통과 / 1-fix 후 통과).
- **c — 탈락** (1-fix 후 재실패, `/dash-evolve` §3 규칙: "재실패 시 탈락"). 생존 후보 2개로 §4 JUDGE 진행.
