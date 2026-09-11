# Candidate A — repick landing (r20)

**Concept:** A light, editorial resale landing whose hero is a 4-step qualification wizard (category → condition → brand tier → original price) that narrows a persistent price-range estimate, a comparable-sales/confidence readout, and a synced example listing card in real time, with the same live numbers echoed in the closing CTA.

## 브리프에 없던 것

**① 액센트 색상(hue)을 무엇으로 할지**
② Full-strength `#1F7A5C` (deep signal/forest green) for borders, fills and large text, plus a lighter tint `#4FD8A8` for small text/icons/focus rings on the one dark section. Computed contrasts: `#1F7A5C` vs white `#FFFFFF` = **5.26:1** (passes small-text AA, not just the 3:1 large-text floor); `#1F7A5C` vs the page's dark ink `#121214` = **3.61:1** (borders/large-text only, as expected — this is why the dark closing-CTA section never puts small `#1F7A5C` text directly on its own background, only on the white-text-on-fill button); white text on a solid `#1F7A5C` fill = **5.26:1** (used for every discount pill and CTA button label, all ≤15px non-bold); tint `#4FD8A8` vs `#121214` = **10.60:1** (used for the dark section's eyebrow label and focus ring).
③ Brief explicitly bans violet/amber and asks for a distinct hue; green also reads semantically as "verified/trustworthy" for a resale-authentication product, so it does double duty instead of being arbitrary.

**① 본문 단락의 정확한 컨테이너 폭**
② Four different fixed widths, each solved from the 0.44em/char formula: hero sub-paragraph `500px` @ `17px` → 500/(0.44×17) = 500/7.48 = **66.8 chars/line**; section intros (Product grid, would-be Social proof) `540px` @ `18px` → 540/7.92 = **68.2 chars**; testimonial quotes (card content width after padding) `~360px` @ `15px` → 360/6.6 = **54.5 chars**; closing-CTA sub `480px` @ `17px` → 480/7.48 = **64.2 chars**. All land under the 70-char target and well under the 75 ceiling.
③ Arbitrary judgment call tuned to hit ~65–68 chars (a comfortable editorial measure) rather than the ceiling, since the brief flags going over as the failure mode and going under as harmless.

**① 브랜드명, 헤드라인, 위저드 문항 문구**
② Brand stayed "repick" (lower-case), matching every prior round's convention found in `r19/a/page.tsx`'s metadata. Headline: "Know what it's worth before you list it." Wizard questions: "What are you selling? / What condition is it in? / What's the brand tier? / What did you pay originally?"
③ Referenced the existing catalog's established brand name rather than inventing a new one — consistency across rounds outweighs novelty here.

**① 위저드가 좁혀가는 실제 숫자(카테고리별 가격대·comps·retail, 조건/등급/가격대별 배수)**
② Deterministic formula, not a lookup table: each category has a base `[low, high]` range + comps + retail (e.g. bags `[40,640]`, 5,400 comps, $780 retail); each of the 3 attribute steps (condition/tier/original-price-band) applies a `centerMult` (shifts the range's midpoint) and a fixed `widthShrink` (0.62 / 0.6 / 0.55, always <1) plus a `compsShrink` (0.55 / 0.55 / 0.5) — so the range width and comps count are guaranteed to monotonically shrink regardless of which options are picked, while the center moves up/down based on how favorable the answers are.
③ A hand-authored lookup table for 4×3×3×3=108 combinations wasn't tractable to keep internally consistent; a shrink-toward-recentered-midpoint formula guarantees "answers always narrow the range" (the brief's core requirement) by construction instead of by manual tuning, and back-navigation is free because the estimate is a pure function of the `answers` object, never accumulated state.

**① 확신도(confidence) 라벨의 임계값**
② `comps >= 2500` → "Broad range", `900–2499` → "Solid estimate", `< 900` → "High-confidence estimate".
③ Picked by simulating the formula's output range across categories (comps span ~18,200 default down to ~700–1,200 at 4 answers) so that every category can reach "High-confidence" by the final step, but starts in "Broad" — arbitrary but back-solved from the real numbers instead of picked first.

**① 헤더의 3-웨이트 예산을 무엇으로 채울지**
② `font-bold` (700) for all headings/big numbers, `font-medium` (500) for labels/buttons/badges/eyebrows, `font-normal` (400) for body/captions — verified no `font-semibold`/`font-extrabold` and no bare `<strong>`/`<b>` anywhere (Tailwind v4 preflight sets heading `font-weight: inherit`, so every `<h1>`–`<h3>` needed an explicit weight class or it would've silently rendered at 400, not a stray 4th weight — checked each one).
③ Brief mandates exactly 3 rendered weights; this is the smallest set that still distinguishes "heading," "interactive/label," and "body" roles.

**① 선택적 디스플레이 서체를 쓸지, 쓴다면 어디에**
② Used `--font-display-grotesk` (Space Grotesk Display) on the hero `<h1>` only, at `font-bold` (700, inside the face's 300–700 variable range) — nowhere else.
③ The brief allows at most one display face for large latin headline text; the hero is the only oversized latin headline on the page, so it's the single opportunity for type-scale contrast the DNA section asks for.

**① 소셜프루프 통계·후기 숫자(가짜 실적 데이터)**
② "128,400+ items resold," "4.8 / 5 average seller rating," "92% of estimates within 10% of final sale," "38,000+ verified sellers," plus 3 fictional testimonial personas (Priya N., Marcus T., Elena R.) with generic, non-impersonating role labels.
③ Needed some proof-of-scale numbers; kept them plausible-but-round and clearly fictional/generic (no real company or person named) rather than borrowing from any real marketplace's public stats.

**① 위저드 카드의 그리드 레이아웃(카테고리 스텝 2열 vs 나머지 1열)**
② Category step (has icons, short labels) renders as a 2×2 grid; condition/tier/original-price steps (text-only, longer labels like "Designer / luxury brand") render as a single column.
③ At the sidebar's ~460px card width, a 2-col grid would force `truncate` on longer text-only labels; single-column keeps every option label fully readable at both mobile (390px, stacked hero) and desktop widths — an arbitrary but width-driven call made after checking the actual rendered column math.

## Files
- `app/src/app/landing-evolve/r20/a/page.tsx` — metadata + default export
- `app/src/app/landing-evolve/r20/a/client.tsx` — state orchestrator (answers/activeStep, `MotionConfig reducedMotion="user"`)
- `app/src/app/landing-evolve/r20/a/data.ts` — pure deterministic estimate engine + static listing/testimonial data
- `app/src/app/landing-evolve/r20/a/Hero.tsx`, `WizardCard.tsx`, `FeaturedCard.tsx` — hero + wizard + synced proof card (all inside one hero component)
- `app/src/app/landing-evolve/r20/a/ProductGrid.tsx`, `SocialProof.tsx`, `ClosingCTA.tsx`, `Nav.tsx`, `Reveal.tsx`, `CategoryIcon.tsx` — remaining sections + shared helpers
