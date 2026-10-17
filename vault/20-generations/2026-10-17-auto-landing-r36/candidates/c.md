# Candidate c — repick, "Sell-through by category"

**Route**: `app/src/app/landing-evolve/r36/c/` (`page.tsx` + `LandingPage.tsx`, `Header.tsx`, `Hero.tsx`,
`CategoryChips.tsx`, `BubbleCluster.tsx`, `packing.ts`, `categories.ts`, `theme.ts`, `ui.tsx`,
`useMounted.ts`, `Reveal.tsx`, `ValueSection.tsx`, `SoldComps.tsx`, `SocialProof.tsx`, `ClosingCTA.tsx`)

## Product / brand

**repick for sellers.** Same brand as the catalog's other seller-facing candidates, new angle.

## One-line concept

Pick the categories you actually sell; a packed-circle bubble cluster, sized by each category's
real 30-day sell-through rate, shows you how fast each one actually moves and what it typically
pays — before you write a single listing.

## The device (input → output)

- **Input**: a 6-item category chip cloud (Sneakers, Watches, Handbags, Outerwear, Electronics,
  Denim), multi-select, `aria-pressed`, at least one always stays on.
- **Output**: a **packed-circle bubble cluster** (`BubbleCluster.tsx` + `packing.ts`) — not a
  treemap, not a ring, not a dial. Circle radius is driven by `sellThroughRate` (percent of that
  category's listings that sell within 30 days); the median `daysToSell` is printed on every
  circle, at every size tier, as real always-visible DOM text (never hover-only). Packing is a
  from-scratch deterministic algorithm: largest circle first, then each subsequent circle is
  placed tangent to the best pair of already-placed circles (closed-form circle/circle
  intersection, every pair tried in fixed `j<k` order, closest-to-centroid valid candidate wins).
  A fixed golden-angle fallback handles the (here, never-triggered) case where no tangent point
  validates. No `Math.random`, no physics engine.
- **Headline number**: the fastest-selling category in the current selection, computed by
  `fastestOf()` (ties broken on fixed category order, so order-independent).

## Manipulation-survives-to-CTA

The same `fastestOf(selected)` / `averageDays(selected)` pair is read fresh, independently, in:
1. **Hero headline (`h1`)** — "`{fastest label} sells in {fastest days} days.`"
2. **Hero's own live readout panel** — "`N categories selected · fastest is X at Y days · your mix
   averages Z days to sell.`"
3. **Value-section recap** — the first stat column, `averageDays(selected)`, live, `aria-live`.
4. **Sold-comps section** — the card list itself is `selected`-filtered, so it changes with the chips.
5. **Closing CTA summary sentence** — restates the same fastest category/day figures.
6. **Closing CTA button label** — `"Check {fastest label} payout timing"`, and the hero's own CTA
   button carries the identical label — both are the same string, not two independently-hardcoded
   copies of similar text.

There is exactly one source of truth (`selected: CategoryId[]` in `LandingPage.tsx`); every number
above is a pure function of it, recomputed on render, never cached or duplicated.

## Interactions (4 required, 4 implemented)

1. **Category chip multi-select** (`CategoryChips.tsx`) — toggles categories in/out live; `Tab`
   reaches every chip (none pulled from tab order), `ArrowLeft`/`ArrowRight` additionally rove
   focus between chips as a convenience; `aria-pressed` announces state.
2. **Scroll-trigger reveal** (`Reveal.tsx`, gated by `useMounted.ts`'s `useSyncExternalStore` mount
   check, not `useReducedMotion()` alone) — used below the hero only (value section, sold comps,
   social proof quotes). The hero's own content is never wrapped in it, so first paint always ships
   the finished, visible state server-side.
3. **Product-preview interaction** — hovering or focusing any bubble (`onMouseEnter`/`onFocus`)
   swaps the detail panel beneath the cluster to that category (sell-through %, avg payout, sample
   size) without ever hiding the baseline day-count printed on the bubble itself; `onMouseLeave`/
   `onBlur` returns the panel to the live "fastest" default.
4. **Sold-comps accordion disclosure** (`SoldComps.tsx`) — each sold-item card has a "See the
   math" `aria-expanded` toggle that reveals a sentence comparing that one real sale's days-to-sell
   against the category median, computed live from fixed data (never a canned string).

## Theme / accent

**Light** (pure white `bg-white`, near-black `zinc-950` ink) — this round's three candidates are
deliberately all light, since dark has won the last two rounds in this catalog.

**Accent: blue-600 `#2563EB`**, distinct from the brief's default violet (`#6E56CF`) and from this
catalog's prior sky-blue candidate (`r35/c`, `#0EA5E9`) — a different blue family (royal/indigo-leaning
vs. cyan-leaning).

## 브리프에 없던 것

**1 — Radius metric vs. printed metric**
결정: 원 크기는 `sellThroughRate`(30일 내 판매율)로, 원에 항상 보이는 숫자는 `daysToSell`(중간값
판매 소요일)로 분리했다. 둘 다 같은 숫자로 하면 장치가 단조로워진다.
이유: 두 지표가 이 고정 데이터셋에서 완전히 순위 일치(빨리 팔릴수록 판매율도 높음)라서, 큰 원 =
빠른 판매라는 직관이 항상 성립한다 — "fastest" 배지가 항상 가장 큰 원과 겹친다는 사실을 주석에
명시해 디자인 선택임을 분명히 했다(우연이 아니라).

**2 — 원 재배치에 애니메이션을 주지 않음**
결정: 칩을 토글하면 모든 원의 `left/top/width/height`가 애니메이션 없이 즉시 재계산된다. 호버 시
`scale` 트랜스폼만 트랜지션을 탄다(`motion-reduce:transition-none`로 게이팅).
이유: `transform: scale()`으로 재배치를 애니메이션하면 자식 텍스트까지 함께 스케일되어 작은 원에서
숫자가 읽을 수 없는 크기로 줄어든다 — 그래서 위치/크기는 순수 재계산(jump), 모션은 호버 한 곳에만
둔다. 이 저장소 r24/c `bubble-stage.tsx`의 동일한 선택과 그 주석("sidesteps the motion catalog's
'transform+opacity only' rule for animation entirely: this is an instant recompute, not an
animation")을 그대로 따랐다.

**3 — 선택 가능 카테고리 6개, 입력 가이드는 "1~5"**
결정: 칩 전체 6개를 두고 상한을 강제하지 않았다(전부 선택 가능).
이유: 가이드의 "~5"는 근사치이고, 6개를 전부 선택해도 패킹 알고리즘과 폭 검증(아래 대비 계산 참조)
이 390px 모바일까지 안전하므로 상한을 인위적으로 걸 이유가 없었다. 대신 "최소 1개" 하한만
강제했다(가장 마지막 칩은 끌 수 없음, 조용히 무시) — 그래야 헤드라인·클로징 CTA가 항상 유효한
"fastest" 카테고리를 가진다.

**4 — accent 대비 계산 (필수)**

블루 `#2563EB`(blue-600)과 배경 `#FFFFFF`/잉크 `#09090B`(zinc-950) 간 WCAG 상대휘도 계산:

- **`#2563EB` vs 흰색**: 상대휘도 L=0.1533. 대비 = (1+0.05)/(0.1533+0.05) = **5.16:1** — 모든
  크기의 텍스트에서 AA(4.5:1) 통과. 이 라우트의 모든 채움 버튼/칩은 흰 텍스트를 쓴다.
- **`#2563EB` vs 잉크 `#09090B`**: 잉크 L=0.00278. 대비 = (0.1533+0.05)/(0.00278+0.05) =
  **3.85:1** — 대형 텍스트/비텍스트 하한(3:1)은 통과하지만 소형 텍스트 AA(4.5:1)는 미달. 이 라우트는
  accent 채움 위에 어두운 잉크 텍스트를 쓰는 곳이 없다(전부 흰 텍스트) — 이 숫자는 기본값
  `#6E56CF`의 경우와 같은 구조(흰색이 소형 텍스트에 안전, 어두운 잉크는 대형/비텍스트 전용)임을
  확인하기 위해 계산했다.
- **`#1D4ED8`(blue-700, ACCENT_TINT) vs 흰색**: L=0.1067. 대비 = (1.05)/(0.1067+0.05) =
  **6.70:1** — 소형 텍스트/아이콘/포커스 링에 쓰는 유일한 accent-on-light 색으로, AA에 여유를 두고
  통과하고 포커스 링의 3:1 하한도 넉넉히 넘는다.

(계산은 sRGB→linear 변환 후 `0.2126R+0.7152G+0.0722B`로 상대휘도를 구하고
`(L1+0.05)/(L2+0.05)`로 대비를 낸 손계산이며, Tailwind `blue-600`/`blue-700`의 공식 hex
(`#2563EB`/`#1D4ED8`)를 그대로 사용했다.)

**5 — 본문 줄 길이 계산 (필수, `ch` 미사용)**

Pretendard 혼합 본문 평균 자폭 `0.44em` 기준, `chars/line = width ÷ (0.44 × font-size-px)`:

| 위치 | 컨테이너 폭 | 폰트 크기 | 계산 | 자수 |
|---|---|---|---|---|
| Hero 서브헤드 | 480px (inline style) | 16px | 480÷7.04 | 68.2 |
| Hero "Your live mix" 패널 | 400px (inline style, 명시적으로 좁힘) | 14px | 400÷6.16 | 64.9 |
| SoldComps 섹션 인트로 본문 | 480px (`SectionIntro` 기본값) | 16px | 480÷7.04 | 68.2 |
| BubbleCluster 스포트라이트 설명 | 370px (`max-w-[370px]`, 컬럼 폭과 분리) | 12px | 370÷5.28 | 70.1 |
| SoldComps 카드 "math" 디스클로저 | 300px (`max-w-[300px]`, 카드 폭과 분리) | 12px | 300÷5.28 | 56.8 |
| ClosingCTA 본문 | 480px (inline style) | 16px | 480÷7.04 | 68.2 |

모든 폭은 **카드/컬럼의 유동 폭에 묶지 않고 명시적 `max-width`로 분리**했다 — 특히
`SoldComps`가 `sm:grid-cols-2`→`lg:grid-cols-3`로 전환되기 직전(≈1023px 뷰포트)에 2열 카드가
일시적으로 넓어지는 구간에서, 폭을 컬럼에 묶었다면 12px 디스클로저 텍스트가 84자까지 벌어지는
것을 손계산으로 확인하고 명시적 캡으로 수정했다. `ch` 단위는 전혀 쓰지 않았다.

## 완성도 노트

- 폰트 웨이트 정확히 3종(400/700/800, Tailwind `font-normal`/`font-bold`/`font-extrabold`) —
  `sr-only` 보조 텍스트에도 명시 클래스를 달아 실측 누락을 방지했다.
- 디스플레이 활자 1종만 사용(`--font-display-wide`, Archivo Display, 100–900 가변축이라 800이
  네이티브로 렌더됨) — 모든 `h1`/`h2`에 일관 적용, 본문/한글은 전부 `--font-sans`.
- `next/image` + 고정 `images.unsplash.com/photo-<id>` 6종, `fill` + 고정 `aspect-[4/3]` +
  `bg-zinc-100` 예약 컨테이너, 배지는 사진 하단의 분리된 행에만(오버레이 없음).
- `useSyncExternalStore` 기반 마운트 게이트로 스크롤 리빌의 SSR `opacity:0` 잔존을 방지, 히어로는
  리빌을 아예 쓰지 않는다.
- 색만으로 구분하지 않음: 모든 버블에 카테고리 약어 텍스트 + 숫자가 항상 같이 있고, 칩에도 라벨
  텍스트가 항상 있다(상태는 `aria-pressed`로도 중복 전달).
- `aria-label`과 가시 텍스트 불일치 위험을 피하려고 버블 버튼에는 커스텀 `aria-label`을 전혀 쓰지
  않았다 — 가시 텍스트 자체가 접근 가능한 이름이고, `sr-only` 보조 문장은 추가 정보일 뿐 가시
  텍스트를 가리지 않는다.
- 포커스는 `outline-none` 선행 없이 `focus-visible:outline-2 outline-offset-2
  outline-[#1D4ED8]` 단일 패턴만 사용(`theme.ts`의 `FOCUS` 토큰 하나로 전 컴포넌트 공유).
- 합계 재현: 소셜프루프의 "listings behind every median" 숫자는 6개 카테고리의 `itemsAnalyzed`를
  `totalItemsAnalyzed()`로 **합산해서** 보여준다 — 별도로 하드코딩한 두 번째 총계가 없으므로 항상
  정확히 일치한다.
