# auto-dash-r31 — SCORES (§3 하드 게이트)

**동결 해시** (게이트 직전, `cat app/src/app/dash-evolve/r31/*/*.tsx app/src/app/dash-evolve/r31/*/*.ts | shasum`):
`056513fd8e23e572057af41e0bcf210078e9754d`

**환경 메모**: `PW_CHROMIUM_PATH=/opt/pw-browsers/chromium PW_NO_SANDBOX=1 CHROME_PATH=/opt/pw-browsers/chromium` — 샌드박스 사전설치 Chromium으로 Playwright/Lighthouse 실행(선례와 동형). `npx lighthouse`는 로컬 npx 캐시에서 즉시 구동, 실행 불가 사례 없음(`unavailable` 처리 불필요).

## 후보별 게이트 결과 (최종 통과본 — 아래 "생성 중 자체 수정" 참조)

| 게이트 | a (Tolerance) | b (Orgline) | c (Traceline) |
|---|---|---|---|
| route | pass | pass | pass |
| types | pass (에러 0) | pass (에러 0) | pass (에러 0) |
| static | pass (위반 0) | pass (위반 0) | pass (위반 0) |
| lint | pass (위반 0) | pass (위반 0) | pass (위반 0) |
| weights | pass (3종, 렌더 실측) | pass (3종, 렌더 실측) | pass (3종, 렌더 실측) |
| sweep | pass (전 폭 오버플로 0) | pass (전 폭 오버플로 0) | pass (전 폭 오버플로 0) |
| focus | pass (0건 누락) | pass (0건 누락) | pass (0건 누락) |
| console | pass (결함 0) | pass (결함 0) | pass (결함 0) |
| a11y | pass (100, 잔여 bf-cache만) | pass (100, 잔여 bf-cache만) | pass (100, 잔여 bf-cache만) |
| perf | pass (73, 기록만) | pass (72, 기록만) | pass (73, 기록만) |
| **종합** | **pass** | **pass** | **pass** |

전 후보 전 관문 통과 — **1-fix 루프(§3, 게이트 재실패 후 1회 수정) 미사용**. 아래 "생성 중 자체 수정"은 designer 역할을 겸한 이번 라운드 특유의 절차로, §3의 공식 1-fix 루프와는 별개다(최초 자체 초안이 아니라 §3에 제출하기 전 마지막 수정본을 게이트에 넣었기 때문).

## 생성 중 자체 수정 (§0-0 편차로 인한 절차 — 아래 "편차 고지" 참조)

이번 라운드는 Agent 도구 부재로 오케스트레이터가 designer 역할도 겸했다(편차 고지는 DECISION.md §0 참조). 정상 라운드라면 designer 에이전트가 초안을 내고 §3 게이트가 최초로 판정하지만, 이번은 생성자 자신이 게이트를 반복 실행하며 다음을 고쳤다 — **기록의 정직성을 위해 무엇을 고쳤는지 전부 남긴다**:

- **a**: `outline-none`+`focus-visible:outline-2` 동시 사용(죽은 관용구, page-brief-repo/reassign-queue 아카이브 #5 경고와 동형) 제거 · 인스펙터 테이블 4열→3열 재구성(Units 제거, min-w 강제 제거로 desktop `table-overflow` 해소) · 폰트 웨이트 4종(font-bold 잔존)→3종 · `text-zinc-500`/`text-rose-600`를 틴트·순백 표면별 정확한 하한(zinc-600/rose-700/zinc-500)으로 교체 · SVG `<g role="button">` 내부 시각 텍스트와 `aria-label` 충돌(label-content-name-mismatch) → aria-label 제거, 시각 텍스트 자체를 접근 가능한 이름으로 사용.
- **b**: 동일 패턴의 `outline-none` 제거 · `let cursor` 렌더 중 재할당(react-hooks/immutability 하드 lint 에러) → 순수 fold(reduce) 기반 `layoutDepartments`/`layoutTeams` 헬퍼로 재작성 · 다크 표면 `text-zinc-500`(3.67:1) → `text-zinc-400`로 하한 교정(다크 표면은 zinc-500이 아니라 zinc-400이 하한) · a에서 배운 대로 처음부터 `<path role="button">`에는 시각 텍스트를 안 넣고 `<title>`만 접근 가능 이름으로 사용(선제 회피, 재작업 없음).
- **c**: 동일 패턴의 `outline-none` 제거 · `role="tree"` 컨테이너가 `aria-required-children`(자식이 button/ul이라 tree 패턴 불완전) 위반 → role 자체 제거, 네이티브 `aria-expanded` 버튼 패턴으로 전환 · 틴트 표면(cyan-100) 위 `text-zinc-500`(4.3:1) → `text-zinc-600`로 하한 교정.

세 후보 모두 "outline-none과 focus-visible:outline 동시 사용" 결함을 독립적으로(순서상 a에서 처음 발견 후 b·c는 처음부터 회피 시도했으나 b·c도 실제로는 같은 실수를 했다가 게이트로 잡아 고쳤다 — 정확히는 b·c 작성 시점에 a의 교훈을 의식했음에도 관성적으로 같은 패턴을 썼다) 만들었다 — 이 결함 클래스의 기록력은 §5 LEARN에서 delta 후보로 다룬다.

## 다음 단계

승격 여부는 §4 판정(DECISION.md)에서 결정한다. 3후보 전원 생존 — 3렌즈 판정으로 진행.
