# Candidate c — repick, "Spot the Proof"

**Route**: `app/src/app/landing-evolve/r37/c/` (`page.tsx` + `LandingPage.tsx`, `Header.tsx`,
`Hero.tsx`, `MagnifierDevice.tsx`, `SneakerIllustration.tsx`, `hotspots.ts`, `ProductCards.tsx`,
`ItemGlyphs.tsx`, `products.ts`, `ValueSection.tsx`, `SocialProof.tsx`, `ClosingCTA.tsx`,
`theme.ts`, `useMounted.ts`, `Reveal.tsx`)

## Product / brand

**repick for buyers.** AI-graded resale marketplace — this candidate's whole premise is making the
authentication step itself the hero device, not a badge you have to take on faith.

## One-line concept

Drag a magnifier lens over a hand-drawn sneaker illustration; each of its five fixed authenticity
zones locks in permanently the moment the lens passes over it, and a live confidence score — reused
everywhere else on the page — fills in exactly as fast as you find them.

## The device (input → output)

- **Input**: continuous pointer/hover position over a 640×400 (8:5) illustration box
  (`MagnifierDevice.tsx`), *or* arrow keys moving the lens by a fixed step (4 percentage points,
  10 with Shift), *or* five direct "jump to marker" buttons — three independent ways to reach the
  same five fixed coordinates, so the control is never pointer-only.
- **Output**: a circular magnifier (CSS `clip-path: circle()` + a `transform: scale(1.8)` duplicate
  layer, both computed in real measured pixels via `ResizeObserver`, not percentage-of-diagonal
  guesswork) that visually zooms whatever is under it. A hotspot is marked **found** when the lens
  center lands within a fixed distance of its coordinate — done in the illustration's own 640×400
  viewBox units so the math is resolution-independent (see formula below). Found state lives in one
  `Set<string>` in `LandingPage.tsx` and only ever grows — nothing un-finds a marker, and each
  discovery leaves a permanent checkmark badge baked into the SVG at that fixed coordinate, plus a
  permanent row in a visible "markers found" list underneath (not hover-only).
- **Headline numbers**: "`{found.size} / 5 authenticity markers found`" and a confidence-score
  meter, both read live off the same `Set`.

## Manipulation-survives-to-CTA

`found: Set<string>` lives once, in `LandingPage.tsx`, and every other number is a pure function of
it, recomputed wherever it's read — never duplicated or cached:

1. **Hero device** — the counter, the confidence bar, and the permanent found-markers list.
2. **Value-split section** — all three pillars (`ValueSection.tsx`) recompute from the *same*
   `confidence = confidenceFromFound(found.size)`: an "AI match %" that climbs with it, a condition
   grade that steps through five bands as it crosses them, and the raw "`found/5`" count repeated in
   its own pillar — moving the lens re-renders all three.
3. **Closing CTA** — reads `found.size` and the derived confidence directly; before any interaction
   it reads a neutral default sentence, after it names the live count and percentage. Never a
   hardcoded placeholder in either state.

## Interactions implemented

1. **The magnifier itself** — hover/drag (mouse or touch, same `onPointerMove` handler), arrow-key
   movement, and five keyboard-focusable jump buttons, all funnelled through one `moveLensTo()` so
   every input path produces identical found-state logic.
2. **Confidence meter** — `role="progressbar"`, animates via `transform: scaleX()` only (never
   `width`), gated `motion-reduce:transition-none`.
3. **Scroll-reveal** on `ValueSection`/`SocialProof` card entrances (`Reveal.tsx`, mount-gated via
   `useSyncExternalStore`, never relying on `useReducedMotion()` alone for the SSR-safe branch).
4. **Live region** (`aria-live="polite"`) announces whichever hotspot the lens currently sits over,
   and whether it was already verified or just found, independent of the always-visible list.

## Theme / accent

**Dark** (`#0B0B0F` page, `#15151B` card surfaces), accent **emerald** — not teal/orange/violet/rose
(this catalog's last four winners), and not the brief's default violet. Emerald also does
double duty: the device's entire premise is verification checkmarks, and green-for-verified reads
correctly here precisely *because* it's never relied on alone (every meaningful green pairs a
`Check`/`BadgeCheck`/`ShieldCheck` glyph and explicit text, never color by itself).

## 브리프에 없던 것

**1 — accent 대비 계산 (필수)**

sRGB→linear 변환 후 `0.2126R+0.7152G+0.0722B`로 상대휘도를 구하고 `(L1+0.05)/(L2+0.05)`로 대비를
낸 손계산. 처음에는 emerald-500(`#10B981`)을 채움(fill) 색으로 잡았는데, 계산해 보니 이 색은
생각보다 밝아서(L=0.364) **흰 텍스트와의 대비가 2.31:1로 AA 미달**이고 오히려 어두운 잉크 쪽이
7.74:1로 통과하는, 브리프가 설명한 "전형적인 accent"와 정반대 방향의 색이었다 — 그래서 셰이드를
한 단계씩 내려가며 흰 텍스트 대비를 다시 계산했다:

| 색 | hex | 흰 텍스트 대비 (채움 위) | 비텍스트 대비 (배경 위) |
|---|---|---|---|
| emerald-500 | `#10B981` | 2.31:1 (미달) | 7.74:1 |
| emerald-600 | `#059669` | 3.43:1 (미달) | 5.21:1 |
| **emerald-700** | **`#047857`** | **4.99:1 (AA 통과)** | 3.58:1 |
| emerald-800 | `#065F46` | 6.99:1 | 2.56:1 |

**emerald-700(`#047857`)을 `ACCENT_FILL`로 확정** — 흰 텍스트가 4.99:1로 소형 텍스트 AA(4.5:1)를
통과하는 가장 밝은(=가장 채도감 있는) 셰이드였다. 이 라우트의 모든 accent 채움(기본 CTA 버튼,
"찾음" 상태 점프 버튼, confidence 바 채움)은 전부 흰 텍스트를 쓴다, 어두운 잉크를 쓰는 곳은 없다.

non-fill 용도(아이콘, 포커스 링, 에이바로우, 작은 캡션)는 더 밝은 **emerald-400(`#34D399`,
`ACCENT_TINT`)**을 쓴다 — 배경(`#0B0B0F`) 대비 10.22:1로 AA에 넉넉한 여유가 있다. 포커스 링도 이
색 하나(`FOCUS` 토큰)로 전 컴포넌트가 공유한다.

보조 텍스트 색(zinc 계열)도 전부 계산했다: `zinc-300`(본문) 배경 대비 13.29:1·카드 대비 12.30:1,
`zinc-400`(캡션/보조) 배경 대비 7.66:1·카드 대비 7.09:1 — 둘 다 레포의 다크 하한(zinc-400 이상)을
만족한다. `zinc-500`은 배경 대비 4.06:1로 소형 텍스트 AA에 못 미쳐 — 실루엣 안의 장식용 SVG 스트로크
(텍스트 노드 아님)에만 썼고, 실제 DOM 텍스트에는 어디에도 쓰지 않았다.

**2 — 본문 줄 길이 계산 (필수, `ch` 미사용)**

Pretendard 혼합 본문 평균 자폭 `0.44em` 기준, `chars/line = width ÷ (0.44 × font-size-px)`:

| 위치 | 컨테이너 폭 | 폰트 크기 | 계산 | 자수 |
|---|---|---|---|---|
| Hero 서브헤드 (`Hero.tsx`) | 560px (inline style) | 18px (`sm:text-lg`) | 560÷7.92 | 70.7 |
| ValueSection 인트로 본문 | 520px (`max-w-[520px]`) | 16px | 520÷7.04 | 73.9 |
| ClosingCTA 본문 | 520px (`max-w-[520px]`) | 16px | 520÷7.04 | 73.9 |

세 곳 모두 컬럼/카드의 유동 폭이 아니라 **명시적 `max-width`로 분리**했다 — 1280px 컨테이너에서
유동 폭에 그대로 묶었다면 ValueSection 인트로(실측 가용폭 ≈1200px)가 16px에서 170자를 넘겨
읽기 어려운 줄이 됐을 것. `ch` 단위는 전혀 쓰지 않았다. Hero 바로 아래 "Try it: this exact sneaker
has 5 markers…" 한 줄짜리 라벨과 제품 카드의 2–3단어 배지 텍스트는 애초에 자체 길이가 짧아 줄바꿈이
생기지 않으므로 별도 폭 제한을 걸지 않았다 — 정적 긴 본문 문단에만 계산을 적용했다.

**3 — confidence score 공식 (필수)**

`hotspots.ts`의 `confidenceFromFound(foundCount) = round((foundCount / 5) × 100)` — 균등 가중
백분율. 마커별로 가중치를 다르게(예: 시리얼 태그를 로고보다 더 중요하게) 두는 것도 고려했지만,
이 장치의 핵심은 "옆에 적힌 숫자를 보자마자 바로 이해할 수 있는 것"이라 `found/total`이 범례 없이도
읽히는 유일한 공식이라 그대로 뒀다. 여기서 파생된 두 공식도 모두 결정론적이다:
- `gradeFromConfidence(c)`: 0→"Not yet scanned", 0<c<40→"Early scan", 40≤c<80→"Good",
  80≤c<100→"Excellent", c=100→"Museum-grade" — 5칸이 5개 마커의 20%씩 경계와 정확히 맞아떨어진다.
- `matchPctFromConfidence(c) = min(99, 81 + round(c × 0.18))` — 81%(스캔 전 기본 매치)에서
  시작해 마커를 다 찾으면 99%까지 오른다. 100%를 주장하지 않도록 상한을 의도적으로 99로 캡했다.

마커 발견 판정 자체도 별도 상수로 문서화했다: 렌더된 픽셀이 아니라 일러스트 자체의 640×400 viewBox
단위로 거리를 재서(컨테이너의 CSS `aspect-ratio`가 이 비율에 고정돼 있으므로 해상도 무관),
렌즈 중심이 마커 좌표에서 40유닛(가로폭의 ≈6.25%) 이내일 때 "발견"으로 센다 — 렌즈 자체의 시각
반지름(가로폭의 12%)의 절반 정도라, 마커가 렌즈 가장자리에 살짝 스칠 때가 아니라 유리 안쪽에 제대로
들어왔을 때 반응하도록 의도적으로 더 좁게 잡았다.

**4 — 제품 사진 대신 손으로 그린 스니커 SVG, 좌표를 실제 디테일에 맞춤**

브리프의 세 선택지(스니커/가방/재킷) 중 스니커를 골랐다 — 브리프가 예시로 든 다섯 구역(스티칭,
로고 스탬프, 밑창 마모, 시리얼 태그, 레이스 아일렛)이 그대로 맞아떨어지는 아이템이라서다.
`SneakerIllustration.tsx`의 다섯 핫스팟 좌표는 그냥 균등 분산시킨 임의의 점이 아니라, 실제로 그
자리에 그려 넣은 디테일(아일렛 2열, 힐 시리얼 태그 안의 가로줄, 토캡 근처의 점선 스티치, 밑창의
트레드 선, 로고 스우시)의 중심과 거의 정확히 겹치도록 손으로 좌표를 맞췄다 — 렌즈가 지나가는 자리에
"보이는 무언가"가 실제로 있어야 발견 경험이 자의적으로 느껴지지 않는다.

**5 — 헤드라인 그리드를 `7/5` 분할 대신 풀폭 스택으로**

이번 라운드에서 피하라고 명시된 `col-span-7` + `col-span-5` 비율을 다른 비율(8/4, 9/3)로 바꾸는 게
아니라 아예 **좌우 분할 자체를 쓰지 않았다** — 장치가 실제로 조작 가능하려면 폭이 많이 필요한데,
헤드라인과 나란히 두는 어떤 컬럼 비율도 장치를 좁게 만든다. 그래서 헤드라인/서브헤드/CTA를 먼저
풀폭(단, 가독성을 위해 자체적으로 760px 상한)으로 쌓고, 그 아래에 장치 전체 폭을, 다시 그 아래에
제품 카드 그리드를 쌓는 완전 스택 레이아웃을 택했다 — 브리프가 대안으로 직접 제안한 "stacked/
full-width hero" 쪽이다.

**6 — 제품 카드 제목을 `<h3>`가 아니라 일반 `<p>`로**

`ProductCards.tsx`의 네 카드 제목은 헤딩 레벨을 쓰지 않았다. 이 그리드는 히어로의 단일 `h1` 바로
아래, 문서 전체에서 아직 `h2`가 하나도 나오지 않은 지점에 있다 — 여기서 `h3`를 쓰면 `h1`→`h3`
헤딩 레벨 스킵이 된다. 카드 제목은 페이지 아웃라인에 들어갈 필요가 없는 단순 레이블이라 판단해,
시각적으로는 동일하게 굵게(`font-semibold`) 보이는 `<p>`로 바꿔 문제 자체를 없앴다 — 첫 `h2`는
ValueSection에서 등장하고, 이후 SocialProof·ClosingCTA도 전부 `h2` 한 레벨만 써서 스킵이 생길 여지를
없앴다.

**7 — confidence 바를 `width` 대신 `transform: scaleX()`로 애니메이션**

모션 규율("transform/opacity만 애니메이션")을 글자 그대로 지키려고, 처음에 `transition-[width]`로
짰던 걸 `origin-left` + `transform: scaleX(confidence/100)` + `transition-transform`으로 바꿨다 —
레이아웃에 영향을 주는 `width` 트랜지션 대신 GPU 합성 가능한 `transform`만 쓰고,
`motion-reduce:transition-none`으로 게이팅은 그대로 유지했다.

## 완성도 노트

- 폰트 웨이트 정확히 3종 렌더(기본 400 · `font-semibold` 600 · `font-extrabold` 800), 4번째
  웨이트 클래스(`font-medium`/`font-bold` 등)는 어디에도 쓰지 않음.
- 디스플레이 활자 0종 — Pretendard(`--font-sans`) 단독, 허용 목록 syntax 함정(`font-[var(...)]`
  vs `font-[family-name:var(...)]`)은 애초에 디스플레이 활자를 쓰지 않아 해당 사항 없음.
- `next/image`/`<img>` 전혀 없음 — 제품 사진 자리는 전부 손으로 그린 인라인 `<svg>`(스니커 큰
  일러스트 + 재킷/가방/시계/스니커 썸네일 글리프), 고정 `aspect-square`/`aspect-[8/5]` +
  예약 배경색 컨테이너.
- 배지는 전부 사진/일러스트 아래 별도 행에만 — 오버레이 없음(제품 카드, 점프 버튼 모두).
- 색만으로 구분하지 않음 — "찾음" 상태는 항상 체크 아이콘 + 텍스트 + 색 셋이 함께 바뀐다.
- `aria-label`을 쓰는 세 곳(렌즈 핸들, confidence progressbar, 스니커 `role="img"`) 모두 그
  요소 자체에 가시 텍스트 자식이 없어 `label-content-name-mismatch` 위험이 구조적으로 없다.
- 포커스는 `outline-none` 선행 없이 `focus-visible:outline-2 outline-offset-2
  outline-[#34D399]` 단일 패턴만 사용(`theme.ts`의 `FOCUS` 토큰 하나를 전 컴포넌트가 공유), 렌즈
  핸들의 "찾음"/"미발견" 두 상태 모두에서 동일하게 적용되는지 확인함.
- 합계 재현: 제품 카드의 "(41% off)"는 `priceBefore`/`priceAfter` 두 값에서 `discountPct()`로
  **매번 계산**해서 보여준다 — 따로 하드코딩한 세 번째 숫자가 없어 드리프트가 불가능하다.
