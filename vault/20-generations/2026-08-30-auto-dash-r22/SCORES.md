# SCORES — auto-dash-r22

동결 해시 (게이트 확정 시점, `cat app/src/app/dash-evolve/r22/*/*.tsx app/src/app/dash-evolve/r22/*/*.ts | shasum`):
`e5457769c8f1dcadc1512eb1e647625307959ef2`

환경 메모: 이 세션은 라운드 1(auto-landing-r17)에서 이미 `/opt/pw-browsers` chromium-1228 심볼릭 링크 + `lighthouse`/`chrome-launcher` npm 즉석설치 + `CHROME_PATH`/`PW_NO_SANDBOX=1` 우회를 적용해 뒀다. 이번 라운드 도중 원격 저장소에 동시 푸시가 있어 `git merge`로 병합(`4b40505` — `/dash-evolve` §0-0 서브에이전트 가용성 가드 신설 + `gate.mjs` 라우트 스코프 재귀 탐색 수정). 이 세션은 매 후보 생성을 실제 `Agent` 도구로 배정했으므로(설계·1-fix·판정 전부 서브에이전트) §0-0 가드 대상이 아니다 — `self_judged` 표시 불필요.

## 후보별 게이트 (1차)

| 후보 | route | types | static | lint | weights | sweep | focus | console | a11y | perf |
|---|---|---|---|---|---|---|---|---|---|---|
| a | ✅ | ✅ | ✅ | ❌ `react-hooks/immutability`(EventStream.tsx:86 렌더중 재할당) | ✅ 3종 | ✅ | ✅ | ✅ | ❌ `label-content-name-mismatch` | 53 |
| b | ✅ | ✅ | ✅ | ❌ `react-hooks/static-components`(AdjacencyTable.tsx SortHeader 4건) | ✅ 3종 | ❌ 오버플로 1(390px +32px) | ✅ | ✅ | ❌ `button-name`·`label-content-name-mismatch`(95점) | 68 |
| c | ✅ | ✅ | ✅ | ❌ `react-hooks/refs`(Topbar.tsx 커스텀훅 ref 렌더중 접근 6건)·unused var·`role-supports-aria-props` | ✅ 3종 | ✅ | ❌ 4건(세그먼트 토글 7D/30D/90D/12M 포커스 무표시) | ✅ | ✅ 97(`aria-progressbar-name`만, 비승격감사) | 68 |

## 1-fix

- **a**: EventStream.tsx의 렌더중 `lastDay` 재할당 → `useMemo`로 `showDivider` 배열 사전계산. `aria-label`이 보이는 텍스트를 재서술/재배열해 `label-content-name-mismatch` 유발 → `aria-label` 제거, 보이는 텍스트로 접근이름 자연 구성 + 부가정보는 `sr-only` span. **재게이트: 전 항목 통과(a11y 100, bf-cache만).**
- **b**: `SortHeader`를 렌더 본문 밖 모듈 스코프로 이동(4곳 호출부 props 전달로 수정). 계정메뉴 버튼 `aria-label` 추가(`button-name`). `ServiceGraph.tsx` SVG `<text>` 형제 사이 공백 없어 `label-content-name-mismatch` 발생 → 라벨 순서 수정. **sweep은 모바일 컬럼 폭 재분배(32/32/36%)로 시도했으나 동일 지점에서 재실패(390px +32px, 1차와 완전히 동일) — 근본 원인 미해소.**
- **c**: `useDismissablePopover`가 `ref`를 반환값에 번들링해 렌더중 `.current` 접근으로 읽히던 것을 호출부에서 `useRef` 생성 후 훅에 파라미터로 전달하는 방식으로 리팩터(Topbar·Sidebar). 미사용 변수 제거. `SelectPopover` 트리거에 `role="combobox"` 추가(`aria-activedescendant` 지원 위해). **재게이트 결과: lint·sweep 통과했으나 focus 4건 동일 재현 + a11y 신규 회귀**(97→92, `button-name` 신규 하드페일 감사 등장 — 아마 combobox role 변경의 부작용, 원인 미특정).

## 판정

- **a — 생존** (1-fix 후 전 항목 통과).
- **b — 탈락** (1-fix 후 sweep 재실패, `/dash-evolve` §3 규칙: "재실패 시 탈락").
- **c — 탈락** (1-fix 후 focus 재실패 + a11y 신규 회귀).

**생존 후보 1개 — §4 단독 심사로 승자/no-winner만 판정.**
