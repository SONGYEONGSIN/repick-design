# auto-landing-r56 — DECISION

## 0. 연속 라운드 예산 고지 (스킬 §0-0-1)

`round-budget.mjs "2"` → **N=1** ("미채움 0종 — N≥2 의 근거(커버리지)가 없다" — `app/src/lib/works.ts`의
`PAGE_TYPES` 18종 전부 카탈로그에 채워져 있음, `node scripts/round-budget.mjs --explain 2` 실측).
이 스케줄 실행이 요청한 2라운드 중 **이번이 유일하게 도는 1라운드**다 — 2번째 요청 라운드는 이 스킬
자체의 예산 규칙에 의해 돌지 않는다(동일 디스포지션: 과거 r44/r48/r49/r51-r58 전부 같은 사유).

타깃 결정: 미채움 큐가 비어 있어 `[dash, landing, native]` 균등 난수 → **landing**. 오늘(2026-11-17,
UTC 화요일)은 native 주간 고정 요일(월요일)이 아니라 난수 결과가 그대로 적용됨. 직전 native 주간
라운드(`auto-native-r58`)는 2026-11-16(월)에 이미 돌았음.

`reassign-queue.md` "대기 중"에는 landing 타깃 항목이 없었다(23번 항목은 dash 타깃) — 이번 라운드 3
후보 전부 자유 탐색.

## 1. Agent 도구 가용성 확인

`Agent` 도구 실제 가용 — 6개 서브에이전트(디자이너 3·judge 3) 블라인드 디스패치, `self_judged: false`.

## 2. 후보

| | 브랜드 | 디바이스(입력축) | 테마/액센트/활자 |
|---|---|---|---|
| a | repick (카메라/렌즈 리세일) | 자유 텍스트 검색 → 퍼지매치 랭킹 | light / cyan `#0891B2` / `--font-display-grotesk` |
| b | GRIDLINE (스니커/스트리트웨어) | 구역 지도 클릭(공간적 단일선택) → 물류/매물 재계산 | dark / indigo `#4F46E5` / `--font-display-mono` |
| c | Sift (스니커/스트리트웨어) | 순차 스와이프(Pass/Like) → 선호 프로필 축적 → 추천 레일 재랭크 | light / lime `#4D7C0F` / `--font-display-wide` |

세 입력축(타이핑/공간 클릭/순차 스와이프) 모두 이 카탈로그에 전례 없는 조합으로 사전 배정됨 — 최근
5라운드(r51-r55)가 전부 continuous-slider/drag-handle/stepper/toggle-grid/scatter-plot 계열이었던
것과 구분하기 위한 선제 매크로-버킷 회피. 다양성 축: 최근 3라운드 승자 테마/액센트/활자 전부 distinct
(밴리스트 없음), 카탈로그 최다 액센트(amber·teal 8건 공동)는 3후보 전부 회피.

## 3. 하드게이트

| | 1차 | 1-fix | 재게이트 |
|---|---|---|---|
| a | 10/10 클린 | 불요 | — |
| b | a11y `label-content-name-mismatch` 실패(100점이지만 승격 감사 실패) | `ZoneMap.tsx` zone 버튼의 경쟁 `aria-label` 제거(보이는 텍스트 "{zone.name}{tier}"를 그대로 접근 가능한 이름으로 복원, "선택됨"은 `aria-pressed`가 이미 전달) | 10/10 클린 |
| c | `sweep` table-overflow 12건(1264~1920px, `RecommendRail`의 `<ul>`에 데스크톱 상시 `overflow-x-auto`) + a11y `color-contrast` 실패(할인 배지 취소선 가격 `opacity-80`로 흰글자 실효대비 3.81:1) | ① `overflow-x-auto` 제거 → `flex-wrap`+반응형 아이템폭(150px→190px) ② `opacity-80` 제거 | 10/10 클린 |

두 결함은 서로 독립(다른 파일, 다른 축)이라 1회 수정 기회 안에서 함께 처리. 실패 노드 특정은
Lighthouse 요약만으로 불가해 Playwright+axe-core 직접 실행(`color-contrast`만 필터)으로 정확한
selector를 얻은 뒤 수정 — 상세는 `SCORES.md`.

freeze hash(재게이트 후, 전수 재확인): `555e17c193cd414296a942a396b3006d74cbf452`

## 4. 스크린샷

48장(4폭×4스크롤×3후보), blank 0건, orchestrator 390px scroll-0 프레임의 실제 픽셀 치수(390×900)를
PNG 헤더로 재확인(judge 렌즈1이 독립적으로도 같은 확인을 했다). judge에는 후보당 4장
(`1440`·`1440-s70`·`1440-s100`·`390`) 지급.

## 5. 3렌즈 블라인드 판정

**렌즈1 (브리프/DNA 준수) — 1위 c · 2위 a · 3위 b**
결정적 차별 축은 히어로-폴드 규칙을 **실제 390px scroll-0 프레임**(PNG 헤더로 390×900 단일 뷰포트임을
확인)으로 판정한 것 — c만 헤드라인+디바이스+4배지 증거가 전부 보였고, a는 배지 행이 일부만(첫 배지
한 조각) 걸려 잘렸고, b는 제품 그리드가 **전혀** 안 보였다(0건, a보다 더 심한 폴드 실패). 그 외 항목
(언어/비자명 디폴트/manipulation-persists-to-CTA/배지 내용 자체/죽은 포커스 관용구 부재)은 셋 다
클린이거나 비차별적이었다. 부차 차별: b는 디스플레이 활자가 `ValueSplit`·`SocialProof`의 h2 2곳에
적용 안 됨(의도 주석 없음 — a의 단일 const 구현이 가장 일관적). accent 대비는 독립 sRGB 계산으로
재확인(c의 lime-700/백색 ≈4.99:1로 셋 중 가장 좁은 마진이나 AA는 통과).

**렌즈2 (상용 완성도, Linear/Stripe/Vercel 기준) — 1위 a · 2위 b · 3위 c**
결정적 차별은 **카피의 상업적 신뢰도**였다 — a는 어디에도 "이것은 데모"라는 고지가 없는 반면, b
(`"Dummy preview catalog — figures above are illustrative."`)와 c(`"A demo catalog of 10 fixed
listings. Prices and photos are illustrative."`) 둘 다 풋터에서 카탈로그가 가짜임을 스스로 고지해
실제 SaaS/마켓플레이스 마케팅 페이지라면 절대 넣지 않을 문장을 넣었다. c는 추가로 0-스와이프
베이스라인에서 히어로 카피("so far"로 헤지)와 클로징 카피("Right now, X is your top match", 헤지
없음)가 **같은 미조작 상태를 서로 다르게 단언**하는 내부 불일치가 있었고(둘 다 아직 아무 결정도 안
한 상태를 가리키는데 한쪽만 과장), 베이스라인에서 세 매물이 동시에 "56% match"로 동률(결정론적 타이
브레이크 자체는 정상 작동 확인)인 것도 "날카로운 눈의 쇼핑객이라면 알아챌" 완성도 결함으로 지적됐다.
b는 가장 강력한 디바이스 파급력(4곳에서 동시 재계산)을 보였으나 위 고지 문장과 템플릿식 alt 텍스트로
2위에 머물렀다. 이미지는 스크린샷상 전부 회색 박스였으나 소스 추적으로 세 후보 모두 `next/image`+고정
Unsplash URL을 올바르게 썼음을 확인(샌드박스 네트워크 차단에 따른 캡처 아티팩트로 판단, 감점 미적용).

**렌즈3 (구조 차별성) — 1위 c · 2위 a · 3위 b**
세 입력축 모두 "실제로 주장대로 작동하는가"를 직접 코드로 검증(라벨 믈이 아니라 메커니즘) —
b의 구역 클릭은 진짜 공간적 클릭 타깃(불균등 좌표의 유기적 지도, 상호배타 선택)이라 토글그리드로
환원되지 않음을 확인했으나, **도달가능 상태 위상이 7개 무순서·무기억 상태로 가장 얇다**(사실상
"7개 중 1개 선택"과 구조적으로 동등, 지도 스킨은 장식). a의 자유 텍스트는 입력 기수는 가장 크지만
**무기억**(쿼리 하나의 순수 함수, 과거 입력에 의존 안 함). c의 순차 스와이프만 **누적·경로의존적**
상태 기계(결정 순서가 프로필에 영향, 되돌리기 불가, 매 결정이 전체 잔여 풀을 재계산)로, 세 축 중
가장 풍부한 도달가능 상태 구조를 가져 1위. **독립 발견(표준 관측, 순위와 무관하게 기록)**: 세 후보의
입력 메커니즘은 실제로 다른데도 **매크로 페이지 골격이 사실상 동일**하다 — 헤더 → (헤드라인+디바이스
+전체증거가 히어로 컴포넌트 안) → 3분할 "메커니즘 설명" 섹션 → "이 패널은 고정 스냅샷"이라고 명시한
정적 테스티모니얼 → 라이브 값 인용 클로징 CTA → "데모/예시 데이터" 고지 풋터, 이 6단 구조가 셋 다
동일(심지어 "single source of truth" 주석 패턴까지 유사). 이는 기존 원칙([[curation-criteria]]
"Q22·Q30 판정 — 수렴은 배정으로 못 막는다, 층위를 옮기며 계속된다")의 **재확인**이다 — 입력 디바이스
층위에서 배정으로 분기시키면 수렴이 한 층 위(페이지 골격)로 옮겨간다. 판정에는 반영하지 않음(세
후보가 동등하게 공유하는 특성은 순위를 만들지 못한다 — 비차별적).

## 6. 집계

1위 표: **c 2표(렌즈1·렌즈3)· a 1표(렌즈2)** → **통상 2:1 다수결, 완전 동률 아님** (tie-break 절차
불요). **승자: 후보 c (Sift)**.

## 7. 정제 조치 (§3-1)

없음 — 승자 c는 어느 렌즈로부터도 규칙 위반 지적을 받지 않았다. b·c의 1-fix는 §3 하드게이트 단계에서
완료되어 판정 패널에는 이미 클린 상태로 진입했다.

## 8. 재배정 큐

이번 라운드 탈락 후보(a·b, 판정 2·3위) 중 **게이트 위반으로 탈락한 경우는 없음** — 둘 다 하드게이트를
클린 통과해 판정까지 정상 진입했고, 순수 judge 다수결 패배다([[curation-criteria]] "게이트 탈락은
형태 판정이 아니다" 원칙과 반대로, 이 경우는 애초에 적용 대상이 아님 — 그 원칙은 게이트 탈락에만
적용). `reassign-queue.md`에 추가하지 않음.

## 9. LEARN — delta 1건

```json
{"round":"auto-landing-r56","variant":"c","delta":"Among this round's three deliberately-novel input-manipulation devices (free-text search, discrete spatial map-click, sequential swipe-deck), the structural-differentiation lens ranked them not by surface novelty but by reachable-state topology richness: a cumulative, path-dependent state machine (sequential swipe, where decision order matters and each decision permanently narrows/reweights the remaining space) outranked a memoryless pure-function-of-current-input device (free-text search, which fully resets to the same state on query deletion) and a flat, unordered, single-step lookup device (map-zone click, which despite a genuinely spatial/non-grid click target reduces to 'select 1 of N' with zero history-dependence, the geometric map being a skin on that same structure per the device's own code comment). This generalizes beyond this round's specific devices: when assigning or evaluating new input axes for novelty, check not just whether the control type itself is new to the catalog, but whether its resulting state machine accumulates/depends on history versus resetting to a function of only the current input, or only ever having a handful of unordered terminal states -- the former scores higher on structural differentiation even when all three control types are equally new.","evidence":"lens3: \"Only lens3's top candidate (c) has state built up over a fixed order so it is cumulative and path-dependent... ranked 2nd [a] because the mechanism is real and distinct... but the topology itself doesn't accumulate... ranked 3rd [b]... only 7 discrete, unordered, memoryless states... functionally equivalent to select 1 of 7 options, with the geometric/map skin providing visual but not structural differentiation (the code's own comment... concedes the geometry is decorative).\"","judge_votes":{"lens1":"c","lens2":"a","lens3":"c"},"confidence":"medium","level":"L1","status":"provisional"}
```

append 대상: `vault/00-principles/landing-deltas-provisional.jsonl`.

## 10. 지식 정제 게이트

이번 delta는 특정 선행 round-id를 "확장/재현"한다고 주장하지 않음(일반 관찰) — 재현 주장 검증 불요.
충돌하는 delta 쌍 없음. 신규 질문 없음 — 렌즈3의 "매크로 골격 수렴" 독립 발견은 [[curation-criteria]]
"Q22·Q30 판정"의 **재확인**(기존 원칙과 무충돌, meta-기준으로 정당화 가능)이라 신규 questions-queue
항목 등재 기준(충돌 쌍 또는 meta-기준 정당화 불가) 미충족 — DECISION에 기록만.

## 11. 불변식 확인

정본 2개(`dash-brief-v3.md`·`design-principles.md`) 무변경. `/dash` 갤러리·`/v1~v5` 무변경. jsonl
append-only(이번 섹션 9의 1건 외 수정 없음). main 미커밋 — 전부 `evolve/dash`.
