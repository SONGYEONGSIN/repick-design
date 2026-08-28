# SCORES — auto-dash-r20

State frozen at hash `9d2a70c740d0e34799afec010df458945d5cbeb1` (`cat app/src/app/dash-evolve/r20/*/*.tsx app/src/app/dash-evolve/r20/*/*.ts | shasum`) — this is the state judging ran against; screenshots in `shots/` were captured from it. A first freeze (`69e83d22995fc32cb97308a42bccb925bab85d40`) passed the hard gate identically but, on visual review of its own screenshots, showed a grid-craft defect in candidate c (see below) — fixed before any judging occurred, so this is ordinary GENERATE-phase iteration, not a §3-1 post-judgment fix (no winner had been named yet).

**Pre-judgment fix (candidate c only, before DECISION.md existed):** the Deploy feed card (12 rows, ~540px) and the Error budgets card (10 bullets, ~850px) sat side-by-side with independent natural heights, leaving a bare gap under the shorter card once the taller one kept going — exactly the grid-craft rule's named defect ("나란한 카드의 콘텐츠 양 차이가 크면... 짧은 쪽은 여백이 뜨지 않게 배치 재조정"). Fixed by giving both cards a shared `lg:h-[640px]` with independent internal scroll (`LockstepClient.tsx`), matching the fixed-height-rail pattern already used in candidate b's `WatchlistRail`/`FillsFeed`. Re-gated clean (all 10 gates pass, a11y 100), screenshots recaptured.

Environment note: `PW_CHROMIUM_PATH` / `CHROME_PATH` pointed at `/opt/pw-browsers/chromium-1194/chrome-linux/chrome` and `PW_NO_SANDBOX=1` set, since the installed Playwright browser revision (1194) didn't match what the bundled `playwright` package expected by default (1228) — see final report for detail. `--font-vars` not needed (repo default whitelist used).

## Candidate a — Ridge (cohort matrix + baseline pin)

| gate | result | detail |
|---|---|---|
| route | pass | 1개 라우트 응답 OK |
| types | pass | 에러 0 |
| static | pass | 위반 0 |
| lint | pass | 위반 0 |
| weights | pass | 3종 (렌더 실측) |
| sweep | pass | 전 폭 오버플로 0 |
| focus | pass | 포커스 표시 0건 누락 |
| console | pass | 메시지 90건 · 결함 0 |
| a11y | pass | 100 · 실패 감사 bf-cache (기록만, 하드페일 아님) |
| perf | pass | 66 (기록만) |

1-fix 이력: 최초 게이트에서 `types`(2건, setter 콜백 타입) · `sweep`(390px page-overflow 100px) · `console`(TypeError null read) 4관문 실패 → 전부 해소 후 재게이트 전 항목 통과. 근본원인: `SegmentTable.tsx`가 `overflow-x-auto` + `min-w-[640px]` 테이블을 썼을 때 390px에서 `document.documentElement.scrollWidth`가 부풀었다(다른 스크롤 컨테이너와의 상호작용으로 재현 — 단일 스크롤러만으로는 재현 안 됨, 정확한 근본원인은 미특정). 해소: `OrderTable.tsx`(r19/b) 관용구인 퍼센트 컬럼 `table-fixed` + 저우선 열 `sm:table-cell` 숨김으로 교체, 가로 스크롤 자체를 제거.

## Candidate b — Fathom (3-pane trading terminal)

| gate | result | detail |
|---|---|---|
| route | pass | 1개 라우트 응답 OK |
| types | pass | 에러 0 |
| static | pass | 위반 0 |
| lint | pass | 위반 0 |
| weights | pass | 3종 (렌더 실측) |
| sweep | pass | 전 폭 오버플로 0 |
| focus | pass | 포커스 표시 0건 누락 |
| console | pass | 메시지 39건 · 결함 0 |
| a11y | pass | 100 · 실패 감사 bf-cache |
| perf | pass | 72 (기록만) |

1-fix 이력: 최초 게이트에서 `types`(3건, `Segmented<T extends string>`가 숫자 `Range` 타입을 거부) · `a11y`(96, `aria-prohibited-attr` — SVG `<rect role 없음>`에 `aria-label`) 2관문 실패 → `Segmented` 제네릭을 `T extends string | number`로 완화, 히트타깃 `<rect>`에 `role="button"` 추가 후 재게이트 전 항목 통과(a11y 100).

## Candidate c — Lockstep (feed-centric deploy console + SLO bullet grid)

| gate | result | detail |
|---|---|---|
| route | pass | 1개 라우트 응답 OK |
| types | pass | 에러 0 |
| static | pass | 위반 0 |
| lint | pass | 위반 0 |
| weights | pass | 3종 (렌더 실측) |
| sweep | pass | 전 폭 오버플로 0 |
| focus | pass | 포커스 표시 0건 누락 |
| console | pass | 메시지 112건 · 결함 0 |
| a11y | pass | 100 · 실패 감사 bf-cache |
| perf | pass | 65 (기록만) |

1-fix 이력: 하드게이트 위반 없음 — 전 관문 1차 통과(양쪽 해시 모두). 위 "Pre-judgment fix" 절 참조 — 판정 시작 전 그리드 크래프트 결함 하나를 자체 발견해 수정, 재게이트 동일 결과.

## 요약

3/3 생존. 판정 진행(§4).
