# Candidate B — FOCAL

**One-line concept:** A verified camera/lens resale landing page whose hero device is a drag-and-reorder four-chip priority list (Price / Condition / Speed of delivery / Seller trust score) that live-recomputes a weighted top pick across six fixed listings and explains it in one deterministic, rank-driven sentence ("Because you ranked Price first and Seller trust score last, we're surfacing the Fujifilm X-T5 Body — it's 31% under market and backed by an established seller, trading verification depth for savings.") — restated as derived stat tiles and cited again by the closing CTA, never re-templated.

Route: `app/src/app/landing-evolve/r57/b/page.tsx` (+ `Client.tsx`, `Hero.tsx`, `RankDevice.tsx`, `TopPickCard.tsx`, `AlternativeRow.tsx`, `NarrativeOutput.tsx`, `ProofWall.tsx`, `ValueSplit.tsx`, `SocialProof.tsx`, `ClosingCta.tsx`, `Reveal.tsx`, `lib.ts`, `ui.ts`).

## Mechanism

- **Input:** four draggable chips, reorderable by mouse drag, by visible move-up/move-down buttons on every chip, and by Arrow Up/Down on a focused chip (all three paths call the same `move`/`handleDrop` logic in `RankDevice.tsx`). A visible instruction line and a "Reset order" button make the keyboard path discoverable, not silent.
- **Weights:** rank 1 → 0.4, rank 2 → 0.3, rank 3 → 0.2, rank 4 → 0.1 (the brief's own example scheme, adopted literally — see `RANK_WEIGHTS` in `lib.ts`).
- **Scoring:** 6 fixed listings (`LISTINGS` in `lib.ts`), each with a 0–100 `conditionScore`, `speedScore`, `trustScore`; the price criterion's score is always `discountPercent(listing)` (never a separately-stored duplicate). `getRankResult(order)` computes every listing's weighted total, sorts, and returns the top listing plus the rank-1 ("primary") and rank-4 ("deprioritized") criteria.
- **Output:** `getRankResult` also builds the one narrative sentence — "Because you ranked {primary} first and {deprioritized} last, we're surfacing the {top listing} — it's {fact(primary)} and {fact(deprioritized)}, trading {noun(deprioritized)} for {noun(primary)}." Both named criteria, the listing, and both factual clauses are genuine functions of `order`; reordering changes all of them together, not just a swapped number. Verified by hand for two orders: default `[price,condition,speed,trust]` → Fujifilm X-T5 (score 63.0) narrated around Price/Trust; `[price,condition,trust,speed]` → Sony A7 IV (score 61.1) narrated around Price/Speed — a different listing and a different pair of named priorities.
- **Citation discipline:** Hero, `ProofWall`, `ValueSplit`, and `ClosingCta` all call `getRankResult(order)` directly — none hardcodes a second copy of the top listing, price, discount, or named criteria. `SocialProof` is the one section that is explicitly NOT wired to the ranking, and says so in its own copy ("this panel does not change when you reorder your priorities").

## Hero-fold compliance

All four badge types (match %, condition grade, verification, before/after discount via `TopPickCard`) plus the full `RankDevice` plus the live `NarrativeOutput` are literal children of `Hero.tsx`, not a sibling section, and render with the real default-order result (Fujifilm X-T5, $1,180 vs $1,699, 86% match, Excellent, Verified) at first paint — no interaction required. On mobile (`grid-cols-1` until `lg:`), the text column (eyebrow/h1/subhead/CTA) stays first in document order so the `h1` is never pushed off-screen, and the device column simply follows it rather than disappearing.

## Four required interactions

1. Hero device — drag, keyboard arrows, and move buttons to reorder priority chips.
2. "Reset order" button next to the chips (distinct control, not part of the reorder gesture itself).
3. Scroll-triggered reveal (`Reveal.tsx`, framer-motion `whileInView`, `useReducedMotion`-gated — `initial={false}` under reduced motion so nothing is left at a permanent `opacity: 0`) on the proof-wall featured card, the three value-prop tiles, and the testimonials.
4. Product-preview interaction — "Show all 5 alternatives" expand/collapse toggle in the proof wall's runner-up list.

## Color — accent contrast (computed)

Dark-default theme, `bg #0B0B0F` / `fg #FFFFFF` / muted `#A1A1AA` (zinc-400), no light-mode surfaces at all, so accent-vs-white is informational only (no white fills exist on this route).

- **ACCENT `#2F6FED`** (fresh blue — not amber/teal/violet): vs white ≈ **4.55:1** (clears 4.5:1 body AA); vs this route's dark bg `#0B0B0F` ≈ **4.32:1** (clears the ≥3:1 large/bold tier, just under the 4.5:1 body-size tier). Used only where that's safe: (a) solid CTA-button fills, where the *white text on the fill* is what needs checking — that pairing is the same 4.55:1 ratio, clears AA; (b) nowhere as small body-size text color on the dark bg.
- **ACCENT_TINT `#7CA6FF`** (derived lighter tint): vs dark bg `#0B0B0F` ≈ **8.19:1** — used for every small-text/icon/focus-ring use of the accent on the dark bg (eyebrow, match-% badge text, criterion icons, focus ring). Vs white ≈ 2.40:1 (not used there; no white surfaces exist).
- Fixed a first draft that put the eyebrow in raw `ACCENT` at 11px — moved to `ACCENT_TINT` since 11px/600-weight is not WCAG "large text."

## Typography

- Body: Pretendard (site default, `--font-sans`), no next/font imports.
- Display face: `--font-display-grotesk` (Space Grotesk Display) — the only Latin headline face on this route, used solely on the `h1`, the header/footer wordmark, and the closing-CTA `h2`. Chosen over `--font-display-wide` per the diversity note (wide was used 2 of the last 3 landing rounds); `r56/b` already used `--font-display-mono`, so grotesk keeps this round's faces spread out.
- Exactly 3 rendered weights: 400 (Tailwind Preflight default, all unstyled body/paragraph text), 600 (`font-semibold` — eyebrows, captions, badges, buttons, nav), 800 (`font-extrabold` — all headings, prices, rank numerals). Audited the whole route for stray `font-bold`/`font-medium`/`font-black` — none present.
- Tracking: eyebrow `0.28em` (hero eyebrow), caption `0.16em` (Fig. 01/02 labels, narrative label), stat `0.12em` (section numbers 02–05, "Weight 0.4" readout, tile micro-labels, nav links). Headings `tracking-[-0.02em]`.

## Body-copy width (computed, not guessed)

chars-per-line = container_px / (0.44 × font_size_px). Standardized every multi-sentence paragraph on this route to land at **68.18 chars/line** (safely under the 70 target, well clear of the 75 hard-fail line):

- `max-w-[480px]` + `text-base` (16px): 480 / (0.44×16) = **68.18** — hero subhead, and the intro paragraphs in ProofWall / ValueSplit / SocialProof.
- `max-w-[420px]` + `text-sm` (14px): 420 / (0.44×14) = **68.18** — closing-CTA stat line.
- `max-w-[360px]` + `text-xs` (12px): 360 / (0.44×12) = **68.18** — rank-device instructions, footer blurb.

(First draft paired `max-w-[480px]` with `text-sm`/`text-xs` in three places — 480/(0.44×14)=77.9 and 480/(0.44×12)=90.9, both over the 75-char hard-fail line — caught and fixed by narrowing the container to match the font size instead of widening the font.)

## Macro skeleton vs. assignment

Full-bleed, no persistent side rail anywhere (top header bar only). Hero: single wide 12-col grid, text column (`lg:col-span-5`) and device column (`lg:col-span-7`) sharing one canvas. Proof wall (section 2): asymmetric `lg:col-span-7` / `lg:col-span-5` split — one large featured card vs. a narrower stacked list — deliberately not an equal-tile bento grid.

## 브리프에 없던 것

1. **결정 사항:** 구체 브랜드명과 버티컬. **결정:** "FOCAL" — 카메라/렌즈 중고거래 (repick의 실제 캐논컬 도메인, r56/a 메타데이터에서 확인). **이유:** 브리프는 "resale/marketplace product"로만 명시; 기존 카탈로그(r56/b GRIDLINE)도 자체 버티컬을 발명하는 선례가 있어, repick의 실제 도메인(카메라 장비)에 머물면서 새 브랜드명만 발명함.
2. **결정 사항:** 정확한 accent 색상 hex 값. **결정:** `#2F6FED`(base) / `#7CA6FF`(tint). **이유:** 브리프는 "any hue"를 허용하되 대조비 계산을 요구; amber/teal/violet을 피하고 직접 상대휘도 공식으로 계산해 4.5:1/3:1 경계를 수동 검증함.
3. **결정 사항:** 디스플레이 서체 3종 중 선택. **결정:** `--font-display-grotesk`. **이유:** `--font-display-wide`가 최근 3라운드 중 2회 사용되어 다양성 권고에 따라 회피; `r56/b`는 이미 mono를 사용했으므로 grotesk로 분산.
4. **결정 사항:** 랭크 가중치 스킴의 실제 숫자. **결정:** 1위 0.4 / 2위 0.3 / 3위 0.2 / 4위 0.1. **이유:** 브리프 예시("e.g.")를 문자 그대로 채택하고 그렇게 명시.
5. **결정 사항:** 내러티브에서 "구동한 두 우선순위"가 정확히 무엇을 가리키는지. **결정:** rank1(주도)과 rank4(희생)의 조합. **이유:** 브리프 자체 예문("ranked Price first and Seller trust last")이 바로 이 쌍을 사용하므로 그 패턴을 그대로 일반화함.
6. **결정 사항:** 6개 고정 매물의 실제 데이터셋(가격, condition/speed/trust 0–100 점수, 등급·배송·신뢰 등 임계값 90/70, 90/75/55, 85/60). **결정:** 위 본문에 기재한 구체 값들. **이유:** 브리프는 "a FIXED set of listings' per-criterion scores"만 요구; 서로 다른 랭크 순서에서 승자가 실제로 바뀌는지 손으로 검증한 뒤(기본 순서→Fujifilm X-T5, Price/Trust 역전 순서→Sony A7 IV) 확정함.
7. **결정 사항:** 비대칭 그리드의 구체 비율. **결정:** Hero 5:7, Proof Wall 7:5 (lg 기준). **이유:** 브리프는 "asymmetric, not equal tiles"만 요구; 텍스트 열은 짧고 디바이스 열은 콘텐츠가 많아 5:7로, Proof Wall은 피처드 카드가 커야 해서 7:5로 반대 비율을 줘 두 섹션이 시각적으로 구분되게 함.
8. **결정 사항:** Proof Wall "더보기" 토글의 기본/확장 개수. **결정:** 기본 3개 노출, 확장 시 5개 전체. **이유:** 브리프는 "product-preview interaction"만 요구; 상위 3개로 스캔 가능하게 하고 나머지 2개는 토글 뒤에 둠.
9. **결정 사항:** 본문 폭 규칙을 만족시키는 (max-w, font-size) 조합. **결정:** 480px/16px, 420px/14px, 360px/12px — 전부 68.18자/줄로 통일. **이유:** 브리프의 계산식을 그대로 적용해 70자 이하·75자 미달을 안전하게 확보; 초안에서 480px+text-sm/text-xs 조합이 77.9~90.9자로 하드-실패선을 넘겨 발견 후 컨테이너 폭을 좁혀 수정함.
10. **결정 사항:** 디스플레이 서체를 적용할 구체 지점(라우트당 한 서체, 여러 인스턴스 가능). **결정:** Hero `h1`, 헤더/푸터 워드마크, 클로징 CTA `h2`에만 적용. **이유:** "max one face per route"는 서체 종류 제한이며 인스턴스 수는 제한하지 않음; 실제로 큰 헤드라인급 텍스트에만 한정해 본문에는 전혀 쓰지 않음.
11. **결정 사항:** "plus one more" 네 번째 인터랙션의 구체적 형태. **결정:** 랭크 칩 옆의 "Reset order" 버튼. **이유:** 브리프가 나열한 세 범주(히어로 디바이스/스크롤 트리거/제품 프리뷰) 외에 명시가 없어, 재정렬 제스처 자체와는 구분되는 독립적이고 결정론적인 네 번째 컨트롤을 추가함.
