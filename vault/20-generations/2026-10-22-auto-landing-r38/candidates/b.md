# Candidate b — repick, "The Split"

**Route**: `app/src/app/landing-evolve/r38/b/` (`page.tsx`, `LandingPage.tsx`, `Hero.tsx`,
`SplitDevice.tsx`, `ProductPreview.tsx`, `ValueSection.tsx`, `SocialProof.tsx`, `ClosingCTA.tsx`,
`data.ts`, `score-math.ts`, `theme.ts`, `ui.tsx`, `Reveal.tsx`)

## Concept

**One line**: Drag a full-width before/after divider across a real listing photo — raw on one
side, AI-annotated overlay on the other — and switch between four listings on a tab-set; the AI
confidence %, a fair-price estimate and a checks-visible count all recompute live from both the
drag position and whichever listing is selected, and the closing CTA's own button label is
generated from that same number.

**Full writeup — device / mechanism / structure**:

The device is a vertical divider line laid over a 4:3 photo box. Everything left of the line shows
the plain listing photo (`layer 0`, a `next/image` with `fill`); everything right of the line shows
the same photo under a desaturated/dimmed "AI-processed" filter plus a cyan scrim (`layer 1`), cut
to the revealed region with `clipPath: inset(0 ${100 - reveal}% 0 0)`. A third, un-clipped layer
(`layer 2`) holds four fixed bounding-box annotations per listing — each a small bordered box with
a label chip ("Outsole wear: minor", "Authenticity tag: verified", "Strap: aftermarket") that fades
and scales in once the divider has fully swept past that box's horizontal position. Boxes are kept
on their own un-clipped layer specifically so a box is never cut in half mid-reveal by the photo's
own clip-path — it just doesn't exist yet, then it does, as a clean opacity/scale transition.

`reveal` (0–100) is driven by a real `<input type="range">` that spans the entire photo box at
`opacity: 0` — so dragging anywhere in the image moves it, and (crucially) the browser's own native
range-input keyboard handling (arrow keys ±1, Home/End to the limits) comes for free once the input
has focus. A separate, `pointer-events-none` visual layer draws the actual divider line and a small
circular handle at `left: {reveal}%`; it paints the real keyboard-focus ring via Tailwind's `peer`
variant (`peer-focus-visible:outline-*`) rather than relying on the invisible input's own (invisible)
focus state.

The second input axis is a `role="tablist"` of the four listings (sneakers / jacket / bag / watch),
with full roving-tabindex arrow-key navigation (`ArrowLeft`/`ArrowRight`/`Home`/`End`) independent
of the native range input's own arrow-key handling — the two controls never fight over the same key.

The live output is `confidenceAt(listing, reveal)` (`score-math.ts`): a plain linear interpolation
between the selected listing's own `baseConfidence` (at reveal = 0) and `maxConfidence` (at reveal =
100). It recomputes on every unit of drag (not stepped on box boundaries — that distinguishes it
from a hotspot-toggle device) **and** changes immediately on a tab switch, because each listing has
its own base/max pair — e.g. switching from the sneakers (54→97) to the bag (48→99) at the same
`reveal` position changes the number even with zero further dragging. Two more numbers are pure
functions of that same confidence: `fairPrice()` (asking price scaled 0.85→1.00 as confidence climbs
0→100) and `revealedBoxes()` (the subset of the four fixed boxes the divider has swept past). All
three thread, unduplicated, into: the device's own stat row, one of Hero's three proof cards (the
one tracking the *currently selected* listing, explicitly labeled "— live"), all three ValueSection
pillars, and the ClosingCTA — whose `<h2>`, body copy and **button label itself**
(`ctaLabel(confidence) → "Shop the 76%-confidence catalog"`) are generated from the live number, not
hardcoded strings.

**Archive check performed** (per the brief's instruction, before finalizing):

Grepped `vault/20-generations/*-auto-landing-r*/candidates/*.md` and
`vault/00-principles/landing-deltas-provisional.jsonl` for `magnifier|hotspot|split|reveal|drag|
divider|overlay` — 200+ hits, overwhelmingly either unrelated uses of "reveal" (scroll-reveal
animation) or the word "split" meaning a layout column split, not a device. Specifically read
`auto-landing-r37/candidates/c.md` ("Spot the Proof"): a *circular magnifier lens* (CSS
`clip-path: circle()` + `scale(1.8)`) dragged over **one fixed hand-drawn SVG sneaker
illustration**, with **five fixed hotspots that permanently toggle found/not-found** (a `Set` that
only grows) and a confidence score computed as `found/5`. This candidate differs on every axis the
brief calls out: real `next/image` photos across a **four-listing tab-set** (not one fixed
illustration); a **full-width/height vertical divider drag** (not a small circular lens); and a
confidence number that is a **continuous linear function of drag position**, recomputed on every
unit of `reveal` and re-based on every listing switch (not a monotonically-growing found-count that
can only go up). No other candidate in the archive combines a multi-listing selector with a
recomputed live numeric output, so "The Split" is a new (input × output) pair for this catalog.

## 브리프에 없던 것

**1 — accent 색상 선택 및 대비 계산 (필수)**

브리프 기본값 바이올렛(`#6E56CF`)과, 이 카탈로그에서 이미 과포화된 amber/teal/violet-hex/blue를
모두 피해 **cyan**을 골랐다 (브리프가 명시적으로 제시한 under-represented 목록: rose, sky, emerald,
cyan, indigo, orange, lime, green 중 하나). 이 라우트는 다크 테마(`#0B0B0F`)이므로, sRGB→linear
변환 후 `0.2126R+0.7152G+0.0722B`로 상대휘도를 구하고 `(L1+0.05)/(L2+0.05)`로 대비를 낸 손계산:

| 용도 | 색 | hex | 상대휘도 L | 흰 텍스트 대비 | 배경(#0B0B0F) 대비 | 판정 |
|---|---|---|---|---|---|---|
| `ACCENT_FILL` (버튼/바 채움) | cyan-700 | `#0E7490` | 0.1460 | **5.36:1** | 3.67:1 | 흰 텍스트 AA 통과(≥4.5), 비텍스트 대비 3:1 통과 |
| `ACCENT_TINT` (아이콘/캡션/포커스링) | cyan-400 | `#22D3EE` | 0.5311 | 1.81:1 (미사용 조합) | **10.88:1** | 배경 위 소형 텍스트 AA 여유 통과 |
| 배경 자체 | — | `#0B0B0F` | 0.003453 | — | — | 기준값 |
| 흰 잉크 | — | `#FFFFFF` | 1.0 | — | 19.65:1 (배경 위) | — |

근거: cyan-600(`#0891B2`, L=0.2355)을 먼저 시도했으나 흰 텍스트 대비가 3.68:1로 AA(4.5:1) 미달이라
한 단계 더 어두운 cyan-700으로 내렸다(5.36:1로 통과) — 이 과정 자체가 r37c가 emerald로 겪은 것과
동일한 "채움 색은 생각보다 밝으면 흰 텍스트와 싸운다" 패턴이다. 모든 채움(히어로 CTA, 클로징 CTA,
confidence 칩 보더)은 흰 텍스트만 쓰고, 어두운 잉크를 흰 텍스트 대신 쓰는 조합은 이 라우트에
전혀 없다(다크 테마라 다크 잉크 자체를 쓸 자리가 없음). `ACCENT_TINT` vs 흰색 대비(1.81:1)는
브리프의 "양쪽 다 계산해서 기록하라"는 지시를 따라 구했을 뿐, 이 라우트가 전부 다크라서 실제로는
전혀 쓰이지 않는 조합이다 — 만약 썼다면 명백히 실패했을 조합이라는 것만 기록해 둔다.
`flaw` 박스에는 별도로 amber-400(`#FBBF24`)을 썼다 — 배경 위 대비 약 11.9:1, 색만으로 구분하지
않도록 `ShieldAlert` 아이콘 + "aftermarket"/"minor" 같은 텍스트와 항상 함께 쓴다.

**2 — confidence/가격 공식 (필수, 결정론적)**

`score-math.ts`:
- `confidenceAt = round(base + (reveal/100) × (max - base))` — 드래그 위치의 **선형** 함수. 박스
  경계에서만 값이 바뀌는 계단식으로 만들 수도 있었지만(실제로 처음엔 "노출된 박스 가중치 합" 방식을
  먼저 설계했다), 브리프가 r37c와 명확히 구분하라고 요구한 지점이 정확히 "고정 5개 핫스팟이 켜짐/
  꺼짐만 토글하는 것이 아닌" 연속 재계산이라, 가중치 합(계단식)보다 매 픽셀 드래그마다 값이 바뀌는
  선형 보간 쪽이 그 요구를 더 명확하게 만족한다고 판단해 최종 채택했다. 리스팅별 base/max는
  임의로 다르게 줬다(스니커 54→97, 재킷 61→95, 가방 48→99, 시계 58→93) — 탭을 바꾸는 것 자체가
  숫자를 바꾼다는 걸 보여주기 위한 의도적 변주, 실제 서비스 데이터는 아니다.
- `fairPrice = round(price × (0.85 + 0.15 × confidence/100))` — 확신도가 낮을수록(0%) asking price의
  85%, 확신도가 완전할수록(100%) asking price의 100%로 수렴. "불확실하면 공정가가 호가보다 낮게
  보인다"는 직관을 숫자로 옮긴 임의의 계수(0.85~1.00)이며, repick의 실제 가격 정책과는 무관하다.
- `revealedBoxes`는 `reveal >= box.leftPct + box.widthPct`(박스 전체가 완전히 지나갔을 때만 "발견")
  — 박스 중앙이 아니라 박스 우측 끝 기준으로 잡은 것은, 어노테이션 레이어가 클립과 별도 레이어라서
  "박스가 시각적으로 완전히 나타난 시점 = 발견 시점"을 일치시키기 위함.
- `ctaLabel(confidence) = "Shop the ${confidence}%-confidence catalog"` — 하드코딩 문자열이 아니라
  매 렌더마다 live confidence로 생성되는 템플릿 함수. ClosingCTA의 버튼 텍스트 자체가 이 함수의
  리턴값이라, "증거(proof)를 보여주다가 마지막에 죽어버리는" 이 카탈로그의 최다 지적 실패를 구조적으로
  피한다.

예시 재현(스니커, 기본 `reveal=50`): `confidence = round(54 + 0.5×43) = 76`. 박스 4개 트리거
`[54, 32, 76, 94]` 중 `50 ≥ trigger`를 만족하는 건 `sole(32)`뿐 → `1/4` checks visible.
`fairPrice = round(72 × (0.85+0.15×0.76)) = round(72×0.964) = 69`. `discount = round(1-72/150) = 52%`.
이 네 숫자는 Hero 통계행, ProofCard, ValueSection, ClosingCTA에 전부 같은 함수 호출로 다시
나타나며 어디에도 별도 리터럴로 박아두지 않았다.

**3 — 본문 줄 길이 계산 (필수, `ch` 미사용)**

Pretendard 혼합 본문 평균 자폭 `0.44em` 기준, `chars/line = width ÷ (0.44 × font-size-px)`:

| 위치 | 컨테이너 폭 | 폰트 크기 | 계산 | 자수 |
|---|---|---|---|---|
| Hero 서브헤드 (`Hero.tsx`, inline `maxWidth`) | 540px | 18px (`text-lg`) | 540÷7.92 | 68.2 |
| `SectionIntro` 본문 (`ui.tsx`, Product preview/Value/Social proof 공용) | 500px | 16px (`text-base`) | 500÷7.04 | 71.0 |
| ClosingCTA 본문 (`ClosingCTA.tsx`, inline `maxWidth`) | 500px | 16px | 500÷7.04 | 71.0 |

세 곳 모두 컬럼의 유동 폭이 아니라 명시적 `maxWidth` 인라인 스타일로 분리했다 — 1360px 컨테이너의
`lg:col-span-5` 칼럼(유동 폭 ≈520px, 패딩/갭 포함 변동)에 그대로 묶었다면 뷰포트에 따라 들쑥날쑥한
자수가 나왔을 것. `ch` 단위는 전혀 쓰지 않았다. 짧은 캡션(스탯 라벨, 배지 텍스트, 카드 제목)은 자체
길이가 짧아 계산 대상에서 제외했다.

**4 — 리스팅 4종 선정 및 어노테이션 좌표**

브리프가 예시로 든 "sneakers, jacket, bag, etc." 중 네 가지(스니커/재킷/가방/시계)를 모두 썼다 —
Unsplash 사진 id는 전부 이 레포의 다른 라운드(`r31/b`, `r36/b` 등)에서 이미 쓰여 렌더가 확인된
고정 id를 재사용했다(`photo-1549298916-b41d501d3772` 스니커, `photo-1441986300917-64674bd600d8`
재킷, `photo-1485462537746-965f33f7f6a7` 가방, `photo-1524805444758-089113d48a6d` 시계) — 시드/랜덤
엔드포인트는 전혀 쓰지 않았고, 검증 안 된 새 id를 추측해서 쓰는 리스크도 피했다. 어노테이션 4개 중
항상 최소 1개는 `flaw: true`(스니커 밑창 마모, 재킷 밑단 마모, 가방 비브랜드 하드웨어 + 밑면 마모,
시계 비정품 스트랩)로 두어 "AI가 단점도 숨기지 않는다"는 신뢰 톤을 지켰다 — 넷 다 전부 긍정적
체크면 "증거"가 아니라 광고처럼 읽힌다고 판단했다.

**5 — 어노테이션 라벨 칩의 좌/우 앵커 전환 (모바일 클리핑 방지)**

브리프가 명시적으로 경고한 "390px에서 페이지 레벨 오버플로를 트리거하지 않으면서 텍스트 노드만
클리핑되는" 결함 클래스를 피하려고, 각 박스의 라벨 칩은 `leftPct + widthPct/2 > 55`일 때 `left-0`
대신 `right-0`으로 앵커를 바꾼다(프레임 우측 절반에 있는 박스는 칩이 왼쪽으로 자라도록) + 칩 자체에
`max-w-[150px] whitespace-normal`을 둬 길이가 어떻든 항상 줄바꿈으로 수렴하게 했다. 상단 여유
(최소 topPct 14%, 모바일 4:3 268px 기준 37.6px)가 칩의 `-top-7`(28px) 오프셋보다 커서 상단 클리핑은
계산상 발생하지 않는다 — 따로 보정 로직을 넣지 않았다.

**6 — 키보드 접근: 네이티브 `<input type="range">` 재사용**

드래그 디바이더의 키보드 등가물을 별도 `onKeyDown` 핸들러로 새로 만들지 않고, 네이티브
`<input type="range">`를 이미지 전체 크기로 깔아 포인터/터치 드래그를 받게 하면서 동시에 그 입력의
기본 키보드 동작(←/→ 1단위, Home/End 양 끝)을 그대로 활용했다 — 브리프가 예시로 든 "화살표로
고정 스텝 이동"을 커스텀 로직 없이 브라우저가 대신 보장한다. 시각적 디바이더 선/핸들은 별도
`pointer-events-none peer` 형제 엘리먼트로 그리고, `peer-focus-visible:outline-*`로 실제 포커스
링을 그린다 — `outline-none` 선행 없음, `ring-*`/`ring-offset-*` 전혀 미사용.

**7 — Hero 안의 증거 카드 선정 로직**

Hero의 증거 카드 3장 중 1장은 항상 "현재 선택된 리스팅"(live, `confidenceAt`로 계산), 나머지 2장은
`LISTINGS.filter(l => l.id !== selectedId).slice(0, 2)`로 뽑은, 선택되지 않은 나머지 리스팅의
**완전 검수 상태(maxConfidence)** 숫자다 — `Math.random` 없이, 배열 순서만으로 결정론적으로 정해져
탭을 바꿔도 같은 두 함수 호출이 항상 같은 두 카드를 돌려준다. 이 두 카드가 왜 live 숫자가 아니라
maxConfidence인지: "다른 두 아이템은 지금 조작 중인 대상이 아니라 이미 다 그레이딩이 끝난 카탈로그의
일부"라는 구분을 명확히 하기 위한 의도적 선택 — 라이브 카드에만 "— live" 텍스트를 붙여 색상이 아닌
텍스트로도 구분했다.

## 완성도 노트

- 폰트 웨이트 정확히 3종(`font-normal` 400 · `font-semibold` 600 · `font-extrabold` 800) 렌더,
  `font-medium`/`font-bold`/`font-black` 전부 미사용(grep 확인).
- 디스플레이 활자 1종만(`--font-display-grotesk`), 전부 `style={{ fontFamily: "var(...)" }}`
  형태로 적용(h1·h2 2곳) — 깨지는 `font-[var(...)]` bare 문법은 전혀 사용하지 않음. r36·r37이
  연속으로 `--font-display-wide`를 쓴 것을 피해 grotesk를 선택.
- `outline-none`/`ring-*`/`ring-offset-*` 전혀 없음(grep 확인) — 포커스는 전부
  `focus-visible:outline-2 outline-offset-2 outline-[#22D3EE]` 단일 토큰(`FOCUS`).
- `next/image`만 사용, raw `<img>` 없음. 모든 사진 컨테이너가 `aspect-[4/3]` + 배경색 예약.
  배지는 전부 사진 아래 별도 행(히어로 증거 카드, Product preview 카드 모두) — 오버레이 없음.
  어노테이션 박스는 브리프가 명시한 예외(그 자체가 기능)로만 사진 위에 겹친다.
- 인터랙션 4종: ① 드래그 디바이더(reveal), ② 리스팅 탭셋(selectedId), ③ ValueSection/
  SocialProof/ProductPreview 카드의 스크롤 리빌(`Reveal.tsx`, `useSyncExternalStore` 하이드레이션
  게이팅 + reduced-motion 분기, no-JS에서도 콘텐츠가 처음부터 보임), ④ ProductPreview 카드 호버
  리프트(`hover:-translate-y-1`, transform만, `motion-reduce:hover:translate-y-0`로 리듀스드
  모션 시 리프트 자체를 끔, 포인터를 떼면 CSS transition이 자동으로 되돌림).
- `Math.random`/`Date.now`/`new Date()` 전혀 없음(grep 확인) — 모든 "무작위처럼 보이는" 값(박스
  위치, base/max confidence)은 `data.ts`의 고정 리터럴.
- `aria-label`을 쓰는 곳(디바이더 입력)은 그 자체에 가시 텍스트 자식이 없어
  `label-content-name-mismatch` 위험이 구조적으로 없음. 탭 버튼의 접근 가능한 이름은 보이는
  텍스트(리스팅 제목) 그 자체.
- z-index는 0(기본)/10(처리된 사진 클립)/20(어노테이션·디바이더 비주얼·배지)/30(입력) 4단만 사용,
  임의의 `z-[9999]` 없음.
