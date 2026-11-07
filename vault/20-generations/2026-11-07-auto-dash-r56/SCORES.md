# auto-dash-r56 — SCORES

Frozen source hash (candidates a+b+c concatenated, before any 1-fix): `de9f53ee8891812c13ddb92099acca122395482f`

| gate | a | b | c |
|---|---|---|---|
| route | pass | pass | pass |
| types | pass (에러 0) | pass (에러 0) | pass (에러 0) |
| static | pass (위반 0) | pass (위반 0) | pass (위반 0) |
| lint | **1차 실패** (unused `Users` import in `data.ts`) → 1-fix: 제거 → pass | **1차 실패** (`react-hooks/set-state-in-effect` ×2, `CommandPalette.tsx`) → 1-fix: open-트리거 reset 2건을 render-time prop-비교 패턴으로 전환 → **재실패** (`react-hooks/refs` ×2 — ref.current를 render 중 읽음, 수정 자체가 새 위반을 만듦) | **1차 실패** (`react-hooks/set-state-in-effect` ×4, `CommandPalette.tsx`+`NodewatchDashboard.tsx`) → 1-fix: (1) palette를 마운트-시점 리셋 패턴(내부 컴포넌트 분리)으로 전환 (2) focus-request를 ref+tick 패턴으로 전환(setState 없음) (3) matchMedia 초기값을 `useSyncExternalStore`로 전환(SSR-세이프, setState-in-effect 없음) → pass |
| weights | pass (3종, 렌더 실측) | — (미도달) | pass (4종, 기록만 — 하드페일 아님) |
| sweep | pass (오버플로 0) | — | pass (오버플로 0) |
| focus | pass (누락 0건) | — | pass (누락 0건) |
| console | pass (39건·결함 0) | — | pass (40건·결함 0) |
| a11y | **1차 실패**(`label-content-name-mismatch` — 슬로프차트 행 버튼의 커스텀 `aria-label`이 행의 실제 가시 텍스트(지역/타입 보조줄·델타 태그)를 전부 포함하지 못함) → 1-fix: 커스텀 `aria-label` 제거, 버튼 콘텐츠 자체를 접근 가능한 이름으로 사용(컬럼 헤더가 이미 맥락 제공) → pass 100 | **1차 실패**(동일 감사 — 박스플롯 행의 `aria-label`이 `team.name`+raw median을 썼고 가시 텍스트는 `team.short`+`formatHours()` 포맷 문자열이라 겹치지 않음) → 1-fix로 라벨을 가시 포맷 문자열 그대로 포함하도록 재작성했으나 **재게이트에서도 동일 감사 재실패**(탈락 확정 후 근본원인 재검증 안 함 — lint 재실패로 이미 탈락이라 a11y 수정 효과는 무의미) | pass 100 (1차부터) |
| perf | 94 (기록만) | — | 80 (기록만) |
| **verdict** | **PASS (1-fix 1회 소진)** | **FAIL — 1-fix 후 재실패, 탈락** (스킬 §3: "재통과 → 생존, 재실패 → 탈락") | **PASS (1-fix 1회 소진)** |

2후보 생존(a, c) → §4 JUDGE 패널로 진행 (2개 이상이므로 정상 패널, 단독 심사 아님).

b는 게이트 탈락이나 **형태 판정이 아니다** — 두 실패 모두 구현 디테일(React effect 패턴, aria-label 문구)이고 컨셉(박스플롯+피드중심 티켓대시보드) 자체의 결함이 아니다. `reassign-queue.md`에 등재(아래 DECISION.md §6 참조).
