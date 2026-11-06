# Candidate c — The Clock

Route: `/landing-evolve/r38/c` · Files: `app/src/app/landing-evolve/r38/c/`

## Concept

A continuous horizontal scrub timeline over one listing's six-stage lifecycle that fills a live, itemized trust-ledger receipt as you drag.

The visitor drags a single playhead — a real `<input type="range">`, not discrete step
buttons — along a timeline running `Listed → AI Photo Scan → Condition Grading →
Authenticity Check → Price Calibration → Buyer Match & Sold`. The six stages are strictly
chronological and equal-width (100 playhead units each, 600 total). Every number on the
device is a pure function of the playhead's raw numeric position, recomputed on every
`onChange` tick, never snapped on a discrete click:

- **Trust accumulation**: each stage carries a fixed weight (8/20/24/28/12/8, summing to
  100). `trustTotal(value)` sums `stageProgress(i, value) * weight[i]` across all six
  stages, where `stageProgress` is the literal fraction (0–1) of that stage's 100-unit span
  the playhead has passed. Dragging the handle 40% of the way through "Authenticity Check"
  (weight 28) adds exactly `0.4 × 28 = 11.2` points to the running total mid-drag — the
  value genuinely interpolates, it does not jump at stage boundaries.
- **The ledger**: a literal multi-line itemized receipt (a real `<table>`, not a progress
  ring or step-chain visual) with five columns — Stage, Timestamp, Confidence pts,
  **running Subtotal**, Status. Each row's Timestamp only appears once that stage's
  progress is `>0` (otherwise "—"), its Confidence cell shows the live partial points over
  the stage's total (e.g. `+11.2 / 28.0 pts`), and its Subtotal column is the true
  cumulative sum through that row — a genuine running total, mirroring a real receipt's
  math, not a derived display value computed separately from what the row actually shows.
  Status reads Pending → "In progress — N%" → Confirmed (icon + text together, never color
  alone), driven by the exact same per-row `progress` value.
- **Threaded to the close**: the identical `trustTotal(playhead)` (rounded) flows, unchanged,
  into the Hero's own big number, the Value section's labeled `LIVE` column, and the Closing
  CTA's own headline ("**{n}%** of the trust chain, traced by you") and button label ("View
  graded listings — {n}% traced") — all three read the one number computed in
  `LandingPage.tsx`, never re-derived, and the CTA copy was written to read sensibly at
  every value from 0 to 100, including the untouched default (0%).

**Archive check performed** (per the brief's instruction): grepped
`vault/20-generations/*-auto-landing-r*/candidates/*.md` and
`vault/00-principles/landing-deltas-provisional.jsonl` for "timeline", "scrub", "ledger",
"receipt", "step", "verification chain", "trust score" (156 files matched across both
dash/landing/native rounds; read the landing-specific hits). Read `r37/b` ("The
Verification Walk") in full: it is a **4-step chain, any-order clickable `<button>` nodes**,
with a **progress ring** (`inspectedCount/4`) plus an averaged score that only "resolves"
once all 4 are opened — the score snaps to a new discrete value the instant a step opens,
it does not interpolate while a step is being read. Also read `r37/c` ("The Magnifier"), a
drag-a-lens-over-hotspots device with a simple fill bar — a different mechanism (2D
pointer-drag over an illustration, not a 1D timeline) but close enough in spirit that I
kept its "jump to a marker" chip convention rather than reinventing it, since it was
already correct. This candidate's input (continuous 1D scrub along one strictly-ordered
timeline) and output (a five-column itemized receipt with a true running subtotal, filling
proportionally mid-stage rather than snapping on click) are both structurally distinct from
both.

## Interactions (4 distinct types)

1. **Continuous scrub timeline** (`ScrubLedger.tsx`) — the core device, a real range input;
   native keyboard support (arrows/Home/End/Page Up/Down) for free, plus optional
   quick-jump stage chips.
2. **Scroll-triggered reveal** (`Reveal.tsx`, mount-gated via `useMounted.ts`'s
   `useSyncExternalStore`) on the product-preview cards, the value-section stats, and each
   social-proof quote (staggered via a per-index `delay`).
3. **Hover micro-feedback with mouseleave reversal** — each product card's art container
   lifts (`-translate-y-1`, transform-only, 200ms ease-out) on hover and returns on
   mouseleave via plain CSS `:hover`; gated with `motion-reduce:transition-none
   motion-reduce:hover:translate-y-0`.
4. **Secondary filter/toggle** (`ProductPreview.tsx`) — three `aria-pressed` chips switch
   which example listing is "tracked": this changes the Hero's `ScrubLedger` header label
   and `ProofStrip` badges (match%/grade/cert/discount), not just the preview grid — a real
   cross-section effect, not a decorative tab.

## Manipulation-survives-to-CTA

`trustTotal(playhead)` is computed once in `LandingPage.tsx` and passed down as
`trustRounded` to `Hero` (device + proof strip), `ValueSection` (the `LIVE` column), and
`ClosingCTA` (headline + button label) — one source, three readers, never re-implemented.

## Typography

- Body stack: `--font-sans` (Pretendard, system fallback). Weights used, grep-verified
  across every file in the route: **400 / 600 / 800** exactly (`font-normal` /
  `font-semibold` / `font-extrabold`). No `font-bold`/`font-medium`, no bare
  `<strong>`/`<b>`, and every `<th>` is explicitly given `font-semibold` to override the
  browser's default bold-700 UA style.
- Display face: `--font-display-mono` (JetBrains Mono Display) — applied via the safe
  inline-style form (`style={{ fontFamily: "var(--font-display-mono)" }}`) to the `<h1>`
  **only**. Chosen over `--font-display-wide` specifically because the two immediately
  preceding rounds (r36, r37) both used `wide`, and mono fits this device's numeric/receipt
  register. Grep-verified: zero `font-[var(` bracket-form occurrences anywhere in the
  route.
- A **separate, non-display** monospace — Tailwind's plain `font-mono` utility, which maps
  to this repo's own `--font-mono` system stack (`ui-monospace, SFMono-Regular, …`, already
  declared in `globals.css`, not a whitelisted *display* face) — is used for all numeric
  ledger/receipt/stat data (timestamps, confidence pts, subtotals, the big trust %, the
  Value section's stat figures). This keeps the whitelisted display face scoped to "large
  Latin headline text only" per the brief, while still giving the numeric content a
  receipt-like monospace register.
- Tracking: eyebrow `0.28em` (`Eyebrow`), caption `0.16em` (ledger header labels, quick-jump
  chip row), stat `0.12em` (Value section's LIVE/FIXED tag).
- **Line-length calc** (constant: Pretendard-stack body text ≈ 0.44em/char, not `ch`):
  the Hero subhead uses `max-width: 500px` at `text-base` (16px) → `500 / (0.44 × 16)` =
  `500 / 7.04` ≈ **71.0 characters** — just over the ~70 target, comfortably under the
  75-char ceiling. The Closing CTA's subhead uses `max-width: 520px` at the same 16px →
  `520 / 7.04` ≈ **73.9 characters** — closer to the ceiling but still under it. No `ch`
  units used anywhere in the route (grep-verified).

## Accent contrast calculations (cyan — not amber/teal/violet/blue, and not the emerald the immediately preceding round, r37/b, used)

Full WCAG relative-luminance formula, computed by hand (not eyeballed): for each sRGB
channel `c ∈ [0,1]`, linear `c' = ((c+0.055)/1.055)^2.4` (channels here are all `> 0.04`, so
the linear-threshold branch never applies); `L = 0.2126R' + 0.7152G' + 0.0722B'`; contrast
`= (L_light + 0.05) / (L_dark + 0.05)`.

- **White (#FFFFFF) vs ACCENT_FILL `#0E7490`** (cyan-700 — L≈0.1460): contrast =
  `(1.0+0.05)/(0.1460+0.05)` ≈ **5.36:1**. Clears body-text AA (4.5:1) at *every* size, so
  every solid accent fill in this route (primary/closing CTA buttons, the active quick-jump
  chip, the discount badge, the trust bar's filled track) carries **white** text, never dark
  ink.
- **Dark ink (#0B0B0F, L≈0.00344) vs ACCENT_FILL `#0E7490`**: contrast =
  `(0.1460+0.05)/(0.00344+0.05)` ≈ **3.67:1**. Clears only the 3:1 large-text/non-text
  floor, fails body AA — this is *why* every fill uses white text instead; the route never
  needs the large-text exception because white already works everywhere.
- **ACCENT_DEEP `#155E75`** (cyan-800, L≈0.0946) **vs white**: contrast =
  `(1.05)/(0.0946+0.05)` ≈ **7.27:1** — clears AA with real headroom. Used for text/icons/
  links/focus-ring color on the light page (Eyebrow default tone, "LIVE" tag text, selected
  card's "Tracked in the ledger above" label, `FOCUS_LIGHT`).
- **ACCENT_DEEP `#155E75` vs `#0B0B0F`** (ink, L≈0.00344): contrast =
  `(0.0946+0.05)/(0.00344+0.05)` ≈ **2.71:1** — **fails** even the 3:1 floor. This is
  exactly why `ACCENT_DEEP` is never used as text on the dark panels; `ACCENT_LIGHT` exists
  specifically to cover that case instead.
- **ACCENT_LIGHT `#67E8F9`** (cyan-300, L≈0.6744) **vs `#0B0B0F`**: contrast =
  `(0.6744+0.05)/(0.00344+0.05)` ≈ **13.56:1** — clears AA with very wide headroom. Used for
  text/icons/focus rings on the two dark panels only (device panel's quick-jump focus ring
  and "Confirmed" check icon, Closing CTA's dark-tone Eyebrow, `FOCUS_DARK`).
- **ACCENT_LIGHT `#67E8F9` vs white**: contrast = `(1.05)/(0.6744+0.05)` ≈ **1.45:1** —
  fails badly. `ACCENT_LIGHT` is therefore never used on the light page background anywhere
  in the route (grep-verified: it only ever appears inside `ScrubLedger.tsx`'s dark panel
  and `ClosingCTA.tsx`'s dark section).
- **Muted grays, individually checked**: `zinc-500 (#71717A)` vs the page's pure-white
  background ≈ **4.83:1** (clears AA; used for the Hero/Value-section body captions, the
  Header's secondary label, and — per the brief's explicit rule that `aria-hidden` numerals
  are still contrast-scanned — the `GhostNumeral` folio numbers). `zinc-600 (#52525B)` vs
  white ≈ **7.75:1** (used for muted text on the `zinc-100` tinted card-art backgrounds and
  pill surfaces, per the brief's "tinted surface → zinc-600 floor" rule). `zinc-400
  (#A1A1AA)` vs `#0B0B0F` ≈ **7.66:1** (used for muted captions on the two dark panels).
  An earlier draft used `white/40` opacity for the ledger's "Pending" status text, which
  computes to only **3.78:1** against `#0B0B0F` (fails body AA, clears only the large-text
  floor) — caught while writing this section and replaced with the pre-computed
  `MUTED_ON_DARK` token (7.66:1) instead.

## 브리프에 없던 것

1. **무엇**: 6단계 각각에 몇 점을 배분할지, 그리고 신뢰도 공식의 정확한 형태(단순 평균이
   아니라 "스크럽 위치의 연속 함수"여야 한다는 요구를 어떻게 구체적인 숫자로 만들지).
   **결정**: 8/20/24/28/12/8점(합계 100)으로 고정하고, `trustTotal(value) =
   Σ stageProgress(i, value) × weight[i]` — 각 스테이지의 진행률(0~1)과 가중치의 곱의 합으로
   정의했다. Authenticity Check에 가장 큰 가중치(28)를 준 것은 재판매 마켓플레이스에서
   "정품 확인"이 구매자 신뢰에 가장 크게 기여한다는 도메인 판단(임의 결정이지만 r37/b가
   authenticity에 100점 만점 중 가장 비중있는 단계로 다룬 선례와 방향이 일치). **왜**:
   브리프는 "진짜 스크럽 위치에 연동된 연속값"이라고만 요구했고 정확한 가중치 분배는
   요구하지 않았다 — 가중치 합을 정확히 100으로 맞추면 "trust accumulation 값"이 항상
   0~100% 범위의 직관적인 퍼센트로 읽히므로 그렇게 설계했다.
2. **무엇**: 타임라인을 6개 구간으로 나눌 때 각 구간의 폭을 동일하게 할지, 실제 처리
   소요시간에 비례하게 할지. **결정**: 완전히 동일한 폭(100 유닛씩, 총 600)으로 했다.
   **왜**: 브리프는 "연속 드래그, 엄격히 시간순"이라고만 했을 뿐 구간 폭이 소요시간을
   반영해야 한다고는 하지 않았다. 폭을 실제 소요시간(Day 0→Day 5 등)에 비례시키면 재밌을
   수 있지만, 그러면 "Listed"와 "Sold" 사이의 긴 공백이 타임라인 대부분을 차지해 중간
   단계(Scan/Grading/Authenticity)가 지나치게 좁아져 드래그로 그 구간을 정확히 통과하기
   어려워진다 — 디바이스의 핵심 체험(각 단계를 천천히 스크럽하며 점수가 채워지는 것을
   느끼는 것)을 해치므로, 균등 폭을 택했다. 타임스탬프 자체는 여전히 Day 0~Day 5로 비선형
   간격을 보여주므로 "실제로는 단계별 소요시간이 다르다"는 정보는 리거/타임스탬프 열에서
   따로 전달된다.
3. **무엇**: 레저(영수증)의 정확한 자료 구조 — `<dl>`을 쓸지, `<table>`을 쓸지, 단순
   리스트를 쓸지. **결정**: 실제 `<table>`(caption + thead/th scope=col + tbody)을 썼다.
   **왜**: 브리프가 "진행률에 비례해 채워지는 영수증 느낌을 강화하라"고 명시적으로
   권장했고, 또한 `<dl>`을 쓸 경우 "dt/dd를 아이콘으로 감싸면 안 된다"는 axe
   `definition-list` 함정을 브리프가 별도로 경고했다 — 영수증의 5개 열(Stage/Timestamp/
   Confidence/Subtotal/Status)은 각 행마다 값이 여러 개라서 `<dl>`의 1-대-1 term/definition
   모델보다 `<table>`의 다중 컬럼 모델이 훨씬 자연스럽고, `<dl>` 관련 접근성 함정을
   원천적으로 피할 수 있었다.
4. **무엇**: 연속 스크럽 중 스크린리더에 얼마나 자주 알릴지(매 픽셀마다 읽으면 소음,
   전혀 안 읽으면 "live"하지 않음). **결정**: 네이티브 `<input type="range">`의
   `aria-valuetext`가 세밀한 연속값을 담당하게 하고(스크린리더가 포커스/방향키 이동 시
   자체적으로 읽음), 별도의 `aria-live="polite"` 영역은 "스테이지를 넘어갈 때만" 문장을
   갱신하도록 분리했다. **왜**: 브리프는 "진짜 live해야 한다"고만 했고 알림 빈도의
   세부사항은 정하지 않았다 — 매 `onChange`마다 라이브 리전을 갱신하면 드래그 한 번에
   수십~수백 번의 음성 알림이 발생해 오히려 사용성을 해치므로, 네이티브 슬라이더 시맨틱과
   "상태 전환 시에만 추가 공지"를 분리하는 절충을 택했다. r37/b가 SVG `<text>`를
   `aria-live` 안에 두고 SVG 루트를 `aria-hidden`해서 모순이 생겼던 사례를 참고해, 여기서는
   큰 숫자 표시 자체를 통째로 `aria-hidden`으로 감추고 실제 접근성 정보(연속값은
   valuetext, 전환 공지는 별도 sr-only 문장)를 완전히 분리된 두 경로로 설계했다.
5. **무엇**: 액센트 색(시안)을 정할 때 정확히 어떤 톤(네온 vs 차분한 톤)과 어떤 용도별
   변형(fill/deep/light 3단)을 쓸지. **결정**: Tailwind의 cyan-700/800/300을 각각
   fill/light-페이지 텍스트/dark-패널 텍스트 용도로 나눴다(정확한 수치는 위 "Accent
   contrast calculations" 참조). **왜**: 브리프의 기본 바이올렛 토큰이 이미 "채움용 1개 +
   작은 텍스트용 밝은 틴트 1개"의 2단 구조를 제시했지만, 이 후보는 라이트 페이지 + 다크
   패널이 공존하는 구조라 "라이트 배경용 진한 텍스트색"과 "다크 배경용 밝은 텍스트색"이
   따로 필요했다 — 그래서 브리프의 2단 패턴을 거울상으로 확장해 3단(fill/deep/light)으로
   만들었다.
6. **무엇**: 모바일(390px)에서 5열 영수증 테이블과 6개 스테이지 틱 레이블이 겹치거나
   페이지 레벨 가로 스크롤을 유발하지 않게 하는 구체적 방법. **결정**: 테이블은
   `overflow-x-auto [contain:layout]` 래퍼 안에 `min-w-[560px]`로 자체 스크롤되게 하고,
   퀵점프 칩 행은 고정폭 대신 `flex flex-wrap`으로 자유롭게 줄바꿈되게 했다(가로 스크롤
   없음). 모든 그리드(Hero/ProductPreview/ValueSection/SocialProof)에는 `lg:` 접두사
   이전에 명시적 `grid-cols-1` 베이스를 먼저 선언했다. **왜**: 브리프가 정확히 이 두 가지
   실패 사례(요소 단위 잘림이 페이지 레벨 가로 스크롤 게이트에 안 걸리는 문제, 그리고 넓은
   고정폭 타임라인이 `document.scrollWidth`를 밀어내는 문제)를 명시적으로 지적했으므로,
   테이블에는 "자체 포함된 스크롤러"를, 칩 행에는 "스크롤 대신 줄바꿈"을 각각 다른 해법으로
   적용해 두 실패 모드를 모두 피했다.
