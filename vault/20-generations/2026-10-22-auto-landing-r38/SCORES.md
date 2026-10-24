# SCORES — auto-landing-r38

Frozen-source SHA-1 (candidates a/b/c concatenated .tsx+.ts): `6b3a274185232a0f60199fe37bb39ccbe85a2da2`

## Hard gate — `node scripts/gate.mjs --target web --routes /landing-evolve/r38/<v>`

All three candidates passed 1차 하드게이트 전 항목 클린 — **1-fix 불요**.

| gate | a (The Proof Ladder) | b (The Split) | c (The Clock) |
|---|---|---|---|
| route | pass | pass | pass |
| types | pass (에러 0) | pass (에러 0) | pass (에러 0) |
| static | pass (위반 0) | pass (위반 0) | pass (위반 0) |
| lint | pass (위반 0) | pass (위반 0) | pass (위반 0) |
| weights | pass (3종, 렌더 실측) | pass (3종, 렌더 실측) | pass (3종, 렌더 실측) |
| sweep | pass (전 폭 오버플로 0) | pass (전 폭 오버플로 0) | pass (전 폭 오버플로 0) |
| focus | pass (포커스 표시 0건 누락) | pass (포커스 표시 0건 누락) | pass (포커스 표시 0건 누락) |
| console | pass (26건 · 결함 0) | pass (149건 · 결함 0) | pass (26건 · 결함 0) |
| a11y | pass (100 · 실패 감사 bf-cache만) | pass (100 · 실패 감사 bf-cache만) | pass (100 · 실패 감사 bf-cache만) |
| perf | pass (58, 기록만) | pass (58, 기록만) | pass (52, 기록만) |

`bf-cache`는 세 후보 공통 실패 감사이고 승격 감사 목록(heading-order·definition-list·target-size·skip-link·color-contrast·button-name·label-content-name-mismatch)에 없어 하드페일 대상이 아니다 — 기록만.

## Variety axes (self-reported by designer, per `scripts/catalog-variety.mjs` banned-axis guidance)

| 후보 | theme | accent | face |
|---|---|---|---|
| a | light | rose (#E11D48) | mono |
| b | dark | cyan (#0E7490 fill / #22D3EE tint) | grotesk |
| c | light (2 dark instrument panels) | cyan (#0E7490 fill) | mono |

금지축(테마 dark 과다·액센트 amber/teal/violet-hex 과다·직전 2라운드 wide 연속)을 세 후보 모두 회피했다. a/c 가 cyan 중복이나 fill hex는 동일(#0E7490)하고 c는 light theme 베이스 — 판정에는 영향 없음(렌즈는 액센트 중복을 금지축으로 쓰지 않는다).
