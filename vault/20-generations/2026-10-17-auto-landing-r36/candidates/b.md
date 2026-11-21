# Candidate b — Covera

Route: `/landing-evolve/r36/b` · Files: `app/src/app/landing-evolve/r36/b/`

## Concept (one line)

A resale marketplace where "trust" is never one blended score — it's five independently
toggleable concerns (authenticity, condition accuracy, ship speed, seller reliability, price
fairness), each rendered as its own ring in a concentric ring cluster, so a buyer sees exactly
which concerns are actually covered on a real listing rather than a single number they have to
take on faith.

## The device (input × output)

- **Input**: five concern chips in `ConcernPanel.tsx`, each independently toggleable on/off —
  0 to all 5 can be selected at once. State lives in `LandingPage.tsx` as a single
  `Set<ConcernId>`, lifted to the top so every section below reads the same selection.
- **Output**: `RingCluster.tsx` — a concentric ring cluster (nested SVG circles, one ring per
  concern, NOT a polygon radar). Only selected concerns get a colored score arc; deselected
  concerns keep their full-circle track but render it **dashed and dimmed** (structural cue, not
  color-only) — so the viewer sees which concerns are *not* being measured right now rather than
  having them disappear from the layout. A center readout ("Match confidence") shows the live
  average of the selected concerns' scores for one real listing (a Leica M6 camera), or an
  explicit dash when nothing is selected — always static, always-visible text, never hover-only.

## Interactions implemented (4, all real/deterministic/`'use client'`)

1. **Concern chip toggle** (`ConcernPanel.tsx`) — the core device. Toggling any chip recomputes
   the ring cluster, the center readout, the value-section recap, the closing CTA sentence *and*
   its own button label, and every listing card's "Covers N/M" badge and the "best coverage"
   sort order — all from the one `Set` in `LandingPage.tsx`.
2. **Scroll-trigger reveal** (`Reveal.tsx`) — used below the hero only (value section stats,
   social-proof quotes, grid cards). Mount-gated with `useMounted.ts`
   (`useSyncExternalStore`, server snapshot `false`), never `useReducedMotion()` alone, so SSR
   output never ships literal `opacity:0`.
3. **Product-preview hover/focus reveal** (`ListingCard.tsx`) — hovering (or focusing a
   dedicated disclosure button) reveals the listing's full per-concern breakdown, using the same
   selected/dim convention as the rings — WITHOUT hiding the baseline numbers (overall match %,
   grade, verified badge, discount %, "Covers N/M") that stay visible regardless of hover state.
   A `pinned` boolean gives keyboard users an explicit click-to-toggle path independent of hover.
4. **Sort control** (`ProductGrid.tsx`) — "Best coverage first" vs "Most recently listed"
   segmented buttons re-sort the grid. "Best coverage first" sorts against the *same* selected
   concerns the rings use (tie-broken by overall match), so the order itself depends on what the
   viewer picked above, not a fixed popularity ranking.

## Manipulation-survives-to-CTA

The same `aggregateForSelection(FEATURED_LISTING.scores, selectedIds)` call (and the same
`selectedIds.length`) is read in all three places the brief asks for:
- Hero's own `ConcernPanel` center readout.
- `ValueSection`'s first column (`LIVE`, explicitly contrasted against two `FIXED` facts).
- `ClosingCTA`'s summary sentence *and* its button label via `ctaLabel(selectedCount)` →
  `"See items covering {N} of your concerns"` (or an honest fallback when N = 0:
  `"Browse items across every concern"`).

## Typography

- Body/Korean stack: `--font-sans` (Pretendard), weights used: **400 / 600 / 700** exactly
  (`font-normal` / `font-semibold` / `font-bold`), verified by grep — no 4th weight anywhere,
  no bare UA-bold elements (`<th>`/`<strong>`/`<label>` not used), no serif.
- Display face: `--font-display-grotesk`, applied via inline `fontFamily` only to the h1 and the
  five h2 headings (latin headline-scale text) — body copy stays on Pretendard.
- Tracking 3-tier scale: eyebrow `0.28em` (`Eyebrow` component) / caption `0.16em` (badges,
  "LIVE"/"FIXED" labels) / stat `0.12em` (big tabular numbers in ValueSection/SocialProof).
- **Line-length calc**: body paragraphs use `max-width: 490px` at `text-base` (16px). Pretendard
  mixed-text average char advance is `0.44em` → chars/line = `490 / (0.44 × 16)` = `490 / 7.04`
  ≈ **69.6 characters**, just under the 70-char target and comfortably under the 75-char ceiling.
  No `ch` units used anywhere.

## Accent contrast calculations (emerald, chosen per design-principles' "계열 자유" clause)

`ACCENT = #059669` (emerald-600, fill/border/ring-arc) and `ACCENT_TINT = #047857`
(emerald-700, small text/icon/focus ring), both against this route's pure-white page
(`bg-white`), full relative-luminance WCAG math:

- **White text (#FFFFFF) on ACCENT (#059669)**: relative luminances 1.0 and ≈0.2287 →
  contrast = (1.0+0.05)/(0.2287+0.05) ≈ **3.77:1**. Clears the 3:1 non-text/large-text floor,
  misses body-text AA (4.5:1) — so ACCENT is **never used as small text**, only as a fill,
  border, or the ring arc stroke (where it's read as a graphical object against the white page,
  same 3.77:1 pair, which clears the 3:1 non-text floor for a meaningful graphic).
- **Dark ink (#09090b, zinc-950) on ACCENT (#059669)**: relative luminance of the ink ≈0.00278 →
  contrast = (0.2287+0.05)/(0.00278+0.05) ≈ **6.23:1**. Clears AA at every size. This is why
  every solid-fill control on this route (CTA buttons, the "selected" chip's filled state) prints
  dark-ink text, not white, on an ACCENT fill — the opposite pairing from the default violet
  token's write-up, confirming the rule is "calculate for your own hex," not "assume white wins."
- **ACCENT_TINT (#047857) vs white**: relative luminance ≈0.1415 → contrast =
  (1.0+0.05)/(0.1415+0.05) ≈ **5.49:1**. Clears body-text AA with headroom — used for every
  small running label, the "LIVE/FIXED" eyebrows, and the focus-ring color
  (`focus-visible:outline-[#047857]`), so there is exactly one accent-on-white number to keep
  safe, not several.

## Completeness notes

- Hero structure rule: headline, subhead, CTA, chips, ring cluster and two real listing proof
  cards (match %, grade, verified badge, discount) are all inside `Hero.tsx` itself, in one
  `lg:grid-cols-12` row split `5 / 4 / 3` (copy / device / proof) — deliberately not the banned
  `7 + 5` two-block-plus-full-width-device skeleton.
- Images: `next/image` with fixed `images.unsplash.com/photo-<id>` URLs (ids reused from this
  catalog's existing verified set), `fill` + reserved `aspect-[4/5]`/`aspect-[4/3]` containers
  with a `bg-zinc-100` placeholder. Badges sit in a separate row below the image, never an
  absolute overlay on the photo.
- `ul > li` structure kept valid: `Reveal`'s wrapping `div` sits *inside* each `<li>`, not between
  `<ul>` and `<li>`, to avoid the list-semantics nesting bug called out in page-brief-core.
- Avoided a real Tailwind `hidden` + `flex` conflict: the per-concern breakdown panel in
  `ListingCard.tsx` is conditionally *rendered*, not toggled via the `hidden` attribute next to an
  always-on `flex` class (which the UA stylesheet's `[hidden]{display:none}` cannot win against
  an author `.flex{display:flex}` utility of the same specificity).
- SVG dasharray/circumference values rounded to 2 decimals (`round2`) for hydration-safe digits.
- No `Math.random`/`Date.now`/`new Date`, no raw `<img>`, no `unoptimized`, no emoji, no extra
  `next/font` imports, no serif, single `h1`, English-only copy — verified by grep across the
  route's files.

## 브리프에 없던 것

1. **무엇**: "covered" 임계값(threshold) 숫자. **결정**: 75점 이상이면 그 concern을 "covers"로
   센다 (`COVER_THRESHOLD`). **왜**: 브리프는 링의 fill 비율만 요구했고, 카드의 "Covers N/M"
   배지·정렬("Best coverage first")에 쓸 이산 판정 기준이 따로 필요했다. 75는 매물 데이터가
   임계 양쪽에 걸치도록 역산해 고른 값이다.
2. **무엇**: 기본 선택 상태. **결정**: 페이지 로드 시 5개 concern 전부 선택됨(`new
   Set(ALL_IDS)`). **왜**: 전부 꺼진 상태로 시작하면 첫 페인트의 center readout이 "—"로 비어
   보여 증명력이 떨어진다. 전부 선택을 기본값으로 둬서 히어로가 첫 폴드에서 바로 완전한
   숫자를 보여주고, 끄는 동작 자체가 "조작"으로 체감된다.
3. **무엇**: 히어로의 두 "proof card"가 어떤 매물인지. **결정**: 그리드의 5개 중 2개(watch,
   lamp)를 재사용해 히어로에도 보여준다. **왜**: 새 unsplash id를 추가로 끌어오는 대신 이미
   검증된 2개를 재사용해 리스크를 줄이고, 히어로의 "두 매물이 같은 방식으로 체크된다"는
   카피가 그리드와 바로 연결되게 했다.
4. **무엇**: 링 지름 체계(반지름 간격·스트로크폭)를 `size` 비율로 산출. **결정**:
   `baseRadius = size*0.172`, `ringGap = size*0.069`, `strokeWidth = size*0.047` (size=232에서
   각 ≈40/≈16/≈11px). **왜**: 히어로(180px)와 추후 재사용 가능한 크기에서도 5개 링이 겹치지
   않고 중앙 텍스트와 충돌하지 않도록 비율로 고정했다 — 고정 px 상수였다면 size prop을 바꿀
   때마다 손으로 재조정해야 했다.
5. **무엇**: 정렬 "Best coverage first"의 동점 처리. **결정**: covered count 동률이면
   `overallMatch` 내림차순으로 2차 정렬. **왜**: 임의 순서(배열 삽입 순)에 맡기면 토글할 때마다
   동점 그룹의 순서가 안정적이지 않게 보일 위험이 있어, 결정론적인 2차 키를 둬 항상 같은
   순서가 나오게 했다.
