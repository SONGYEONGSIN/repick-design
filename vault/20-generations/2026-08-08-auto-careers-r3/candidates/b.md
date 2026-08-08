# auto-careers-r3 / b — Loomwork

Loomwork is a fictional B2B SaaS ("workflow orchestration for revenue operations teams") whose
careers page is structured as a real kanban board: all twelve open roles render at once inside
department columns (Engineering, Product & Design, Revenue, Operations), with a regroup toggle
that recomputes the same columns by hub city (Remote/Austin/Lisbon) instead — no role is ever
hidden in either grouping. Selecting any role card swaps a single persistent detail panel rendered
alongside the board (not a drawer, not an inline expansion), reachable by Tab and activated with
Enter/Space, and defaulting to the first role so the panel is never empty on load. A separate
compensation panel resolves a published band from two independent real inputs — department and a
years-of-experience bucket — against a small fixed 4x5 lookup table (`COMP_MATRIX`), so switching
department alone can move the displayed band even at the same experience level. Theme: dark
(zinc-950/zinc-50). Accent: violet (`violet-400`/`violet-300` interactive surfaces and focus
rings, plain Tailwind palette). Typography: body on `--font-sans`/Pretendard, the h1 and section
labels on `--font-display-mono`, exactly three weight classes route-wide (`font-normal`,
`font-semibold`, `font-bold`).

## 브리프에 없던 것

1. **① 칸반 보드의 재편성(regroup) 축을 무엇으로 할지 — ② 부서/도시 두 축으로 결정하고 토글 버튼
   그룹으로 구현 — ③ 배정 방향이 "부서 컬럼이 전부 상시-노출"만 요구했지 두 번째 그루핑 축까지
   요구하지 않았다. 하지만 브리프가 "완전히 새로운 두 번째 메커니즘"을 강하게 권고했고, 필터로
   역할을 숨기면 careers 델타(상시-노출 위반)를 어길 위험이 있어, 숨기지 않고 재배열만 하는
   토글을 택해 두 요구를 동시에 만족시켰다.

2. **① 보상 계산기가 조회할 축을 몇 개·무엇으로 할지 — ② 부서 × 연차(4x5) 이차원 고정 조회
   테이블로 결정 — ③ r2/b(Talus, 이전 라운드 우승작)가 이미 레벨 하나만 고르는 단일 슬라이더를
   썼기 때문에, 배정 프롬프트가 명시한 "메커니즘/프레이밍을 구분하라"는 지시를 지키려면 입력축이
   최소 2개여야 같은 연차에서도 부서를 바꾸면 밴드가 달라지는 것을 보여줄 수 있었다. 두 축 모두
   버튼 그룹(라디오 유사)이라 슬라이더 조작감과도 명확히 다르다.

3. **① 역할 카드에 표시할 레벨 표기를 어떤 이름 체계로 할지 — ② "Band I-V" (로마 숫자) 체계로
   결정, Talus의 "L1-L5" 및 "Associate/Mid/Senior/Staff/Principal" 라벨과 겹치지 않게 — ③ 라벨
   문구 자체가 archetype 판정 대상은 아니지만, 같은 라운드 계열의 직전 우승작과 나란히 카탈로그에
   실릴 것을 고려해 시각적으로도 즉시 구분되는 표기를 골라 재탕 인상을 줄였다.
