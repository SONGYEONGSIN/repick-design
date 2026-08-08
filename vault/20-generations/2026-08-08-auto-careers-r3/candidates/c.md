# auto-careers-r3 / c — Fenmark

Fenmark is a fictional B2B SaaS ("routing and compliance software for field-service and logistics
teams") whose careers page leads with an input-driven pay calculator: a years-of-experience
stepper (numeric input + +/- buttons + quick-pick chips), a team `<select>`, and a location
`<select>` feed a fixed step function and a published base-band lookup table through real
arithmetic (band × location multiplier, rounded to the nearest thousand) into a live, `aria-live`
readout of matched level, salary range, and equity band, plus a clipboard-copy of that estimate.
Below the calculator sits an always-fully-rendered grid of all 11 open roles (title, team, level,
location) — the calculator only adds a "matches your profile" / "same team" badge to a subset of
already-visible cards, it never hides or gates any role, satisfying the careers-page proof
requirement even at the zero-interaction default state. A static "where the roles are" tally and a
four-item "how we think about pay" list round out the page. Theme: light. Accent: rose (rose-700
interactive surfaces, rose-600 focus rings). Typography: `--font-sans`/Pretendard only, no display
face, exactly three weight classes route-wide (`font-normal`, `font-semibold`, `font-bold`).

## 브리프에 없던 것

1. **① 계산기가 실제로 무엇을 "계산"할지 — ② 연차→레벨 계단함수 + (레벨×트랙 기본 밴드) × 위치
   배수를 반올림하는 2단 산술로 결정 — ③ 지시문이 "실제 계산된 값, 정적 라벨 스왑 아님"을 명시
   요구했다. r2/b가 이미 "슬라이더가 고정 배열 인덱스를 선택"하는 방식을 썼는데(계산이 아니라
   조회), 그것과 기계적으로 구분되려면 곱셈·반올림이 화면에 보이는 실제 산술이어야 했다. 밴드
   숫자 자체는 여전히 사람이 정한 고정 리터럴이라 결정론이 깨지지 않는다.

2. **① 상시-노출 역할 목록을 테이블로 할지 카드로 할지 — ② 카드 그리드(테이블 아님)로 결정 —
   ③ `careers-deltas-provisional.jsonl`의 두 번째 delta가 `table-fixed` 4열 이상 시맨틱
   테이블이 390px에서 sweep은 통과해도 시각적으로 크로우딩된다고 명시 경고했다. 브리프가
   테이블을 요구하지 않았으므로, 그 실패 모드를 원천적으로 피할 수 있는 카드 리스트를 택해
   모바일 폭 검증에 쓸 예산을 아꼈다(실측: 390/1280/1920 등 13개 폭 전부 오버플로 0).

3. **① 매칭 배지의 강도 단계를 몇 단계로, 무엇으로 구분할지 — ② 정확 일치(테두리+배경 rose +
   아이콘+"Matches your profile" 텍스트)와 같은 팀·다른 레벨("Same team, different level",
   중립 회색 + 아이콘) 두 단계로 결정 — ③ 색만으로 의미를 전달하면 안 된다는 코어 §3 규칙 때문에
   모든 강조가 아이콘+텍스트를 동반해야 했고, 단계를 두 개로 제한한 이유는 그 이상 나누면
   범례 없이는 카드 그리드만 보고 구분이 안 될 것으로 판단했기 때문이다.
