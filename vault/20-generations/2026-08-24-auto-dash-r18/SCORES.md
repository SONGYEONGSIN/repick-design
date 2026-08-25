# auto-dash-r18 — SCORES

candidate source hash (동결 — 1-fix 후 최종): 재계산값은 본문 참조

환경 고유 절차(스킬 밖): Lighthouse가 `CHROME_PATH`(뿐 아니라 `PW_CHROMIUM_PATH`/`PW_NO_SANDBOX`)를 인라인으로 지정해야 실제 점수를 낸다 — 없으면 `unavailable`(하드페일 아님)로 조용히 넘어간다. 이번 라운드는 셋을 모두 인라인 export 해서 실측 a11y/perf 점수를 받았다.

## 하드게이트 — `node scripts/gate.mjs --target web --routes /dash-evolve/r18/<v>`

| 후보 | route | types | static | lint | weights | sweep | focus | console | a11y | perf | 1-fix |
|---|---|---|---|---|---|---|---|---|---|---|---|
| a (Quorum — 모더레이션 큐, 피드중심) | ✅ | ✅ | ✅ | ✅(1-fix) | 4종 | ✅ | ✅ | ✅ | 100 | 50 | `react-hooks/set-state-in-effect` ×2 + 파생 `react-hooks/refs` ×4 |
| b (Tenure — 갱신 데스크, 마스터-디테일) | ✅ | ✅ | ✅ | ✅(1-fix) | 3종 | ✅ | ✅ | ✅ | 100 | 51 | `react-hooks/set-state-in-effect` ×1 |
| c (Trellis — 코호트 삼각행렬) | ✅ | ✅ | ✅ | ✅(1-fix) | 4종 | ✅ | ✅ | ✅ | 100 | 44 | `react-hooks/set-state-in-effect` ×2 |

3후보 전원 1-fix 후 10/10 통과, `pass:true`.

## 1-fix 상세

- **a**: `CommandPalette.tsx`·`QueueConsole.tsx`의 팔레트 오픈시 상태 리셋을 `useEffect` 안 `setState`에서 "렌더 중 상태 조정" 패턴으로 전환. `QueueConsole.tsx`는 추가로 `requestFocus`가 `commands` 배열(→ `<CommandPalette commands={commands}/>`로 렌더에 흘러 들어감)에 담긴 `jumpToNextPending`에서 참조되며 ref(`anchors.current`)를 직접 건드려 `react-hooks/refs`(렌더 중 ref 접근) 위반을 연쇄 발생시켰다 — ref 접근을 전부 `useEffect` 안으로 옮기고, 트리거는 순수 state(함수형 업데이트, ref 미사용)로 교체해 해소.
- **b**: `RenewalDeskClient.tsx` 팔레트 오픈시 쿼리 리셋을 렌더 중 조정 패턴으로 전환(포커스 `.focus()`는 별도 effect 유지).
- **c**: `CommandPalette.tsx`의 `activeIndex` 리셋(`[query, open]` 의존)과 쿼리 리셋(`[open]` 의존) 두 effect를 하나의 렌더 중 조정 블록으로 통합.

공통 원인: 이 레포의 React Compiler ESLint 프리셋이 `react-hooks/set-state-in-effect`를 하드페일로 강제한다 — ⌘K 팔레트 오픈시 상태 초기화가 세 후보 모두 독립적으로 이 패턴을 썼다(3/3 재현, LEARN delta 후보).
