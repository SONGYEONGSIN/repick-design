# SCORES — auto-dash-r15

State hashes (frozen after all fixes, `cat <files> | shasum`):
- a: `ab05336bad956d5c7b482bb61e57db0314ead429`
- b: `1d7e4dddc39ce2334dd61cc1075d7def6e0702a8` (post 1-fix — see below)
- c: `4a864f42dddebba037017c30f1bea5e2dc7e29fa`

Env for live a11y/perf measurement (this sandbox's preinstalled Chromium needs `--no-sandbox` to launch as root; without it `gate.mjs`'s own dispatcher call reports `unavailable`, non-hard-fail — same workaround as `auto-dash-r11`–`r14`): `PW_CHROMIUM_PATH=/opt/pw-browsers/chromium CHROME_PATH=/opt/pw-browsers/chromium PW_NO_SANDBOX=1`.

## Candidate a — Nodal (network-topology console)

| gate | pass | detail |
|---|---|---|
| route | ✅ | 1개 라우트 응답 OK |
| types | ✅ | 에러 0 |
| static | ✅ | 위반 0 |
| lint | ✅ | 위반 0 |
| weights | ✅ | 3종 (렌더 실측) |
| sweep | ✅ | 전 폭 오버플로 0 |
| focus | ✅ | 포커스 표시 0건 누락 |
| console | ✅ | 메시지 51건 · 결함 0 |
| a11y | ✅ | 100 · 실패 감사 bf-cache (비승격 감사, 하드페일 아님) |
| perf | ✅ | 65 (기록만) |

1차 통과, 수정 없음.

## Candidate b — Traverse (geo route-map console)

**1차**: `pass: false` — `focus` 게이트 7건 (`focus-invisible`): map hub 노드 SVG `<circle>` 7개(#13/#15/#16/#19/#20/#23/#24)가 `outline-none`에 상태 구동(onFocus/onBlur) **형제 `<circle>` 링**으로 포커스를 표시하고 있었으나, `dash-sweep.mjs`의 `evaluateFocus`는 포커스 대상 요소 자신 + 조상 + 자식의 outline/box-shadow 페인트만 비교하고(주석 §61-78 참조) **형제 요소는 검사 범위 밖**이라 이 표시가 감지되지 않음 — 실사용자에게는 보였을 수 있으나 게이트의 검사 방법론이 감지 못하는 자리였다.

**1-fix**: `network-map.tsx`의 탭 가능 `<circle>` className에서 `outline-none`을 제거하고 `tokens.ts`의 기존 `FOCUS_VISIBLE`(`focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400`) 토큰을 직접 적용 — candidate a가 동일 방식(요소 자신에 `focus-visible:outline-*`, 선행 `outline-none` 없이)으로 1차 통과한 것과 동일 패턴. 형제 링 `<circle>`은 시각적 보강으로 유지.

**재게이트**: 전 항목 통과.

| gate | pass | detail (재게이트 후) |
|---|---|---|
| route | ✅ | 1개 라우트 응답 OK |
| types | ✅ | 에러 0 |
| static | ✅ | 위반 0 |
| lint | ✅ | 위반 0 |
| weights | ✅ | 3종 (렌더 실측) |
| sweep | ✅ | 전 폭 오버플로 0 |
| focus | ✅ | 포커스 표시 0건 누락 (7건 → 0건) |
| console | ✅ | 메시지 52건 · 결함 0 |
| a11y | ✅ | 100 · 실패 감사 bf-cache |
| perf | ✅ | 66 (기록만) |

## Candidate c — Vela (forecast confidence-band console)

| gate | pass | detail |
|---|---|---|
| route | ✅ | 1개 라우트 응답 OK |
| types | ✅ | 에러 0 |
| static | ✅ | 위반 0 |
| lint | ✅ | 위반 0 |
| weights | ✅ | 3종 (렌더 실측) |
| sweep | ✅ | 전 폭 오버플로 0 |
| focus | ✅ | 포커스 표시 0건 누락 |
| console | ✅ | 메시지 29건 · 결함 0 |
| a11y | ✅ | 100 · 실패 감사 bf-cache |
| perf | ✅ | 62 (기록만) |

1차 통과, 수정 없음.

## 생존
전 후보(a/b/c) 3개 전원 생존 — judge 3렌즈 패널로 진행.
