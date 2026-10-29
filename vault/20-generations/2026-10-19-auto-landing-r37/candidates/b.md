# Candidate b — The Verification Walk

Route: `/landing-evolve/r37/b` · Files: `app/src/app/landing-evolve/r37/b/`

## Concept (one line)

A buyer-facing resale landing page where trust is earned, not asserted: a horizontal 4-step
verification chain (AI Photo Scan → Condition Grading → Authenticity Check → Listed) that a buyer
clicks through in any order, with a live Trust Score that only means what it claims once the
buyer has actually inspected the steps behind it.

## The device (input × output)

- **Input**: four chain nodes in `VerificationWalk.tsx`, each a real `<button>` with
  `aria-expanded` + `aria-controls`, clickable/focusable in any order (not forced sequential).
  Clicking a closed node opens its evidence panel AND adds that step's id to the `inspected`
  `Set<StepId>` lifted in `LandingPage.tsx`; clicking an already-open node only collapses the
  panel — the step stays inspected either way, so the score never regresses.
- **Output**: `TrustScoreCard.tsx` — a progress ring (fraction = `inspectedCount/4`) plus a real
  running average of the inspected steps' own fixed scores (`trustScoreState` in
  `score-math.ts`). Before any step is opened it shows an honest "—" with "Inspect a step below
  to start building the trust score," not a fake 0%. One step opened shows that step's own score
  verbatim; all four shows the final resolved figure with a distinct accent-filled badge style.

## Interactions implemented (3, all real/deterministic/`'use client'`)

1. **Chain click-to-inspect** (`VerificationWalk.tsx`) — the core device. Each of the 4 steps
   reveals its own evidence via `StepEvidence.tsx`: Scan shows a 6/6 angle-coverage ring +
   6 named angle chips; Grading shows 4 named sub-scores (fabric wear, hardware condition, odor
   control, structural integrity) rolling into one overall grade; Authenticity shows 4 named,
   all-matched markers; Listed shows the final confidence (the *rounded average of the first
   three steps*, not a fifth independent reading) plus the example item's live price/discount
   and catalog status.
2. **Trust Score recompute** — every click that opens a previously-unopened step immediately
   recomputes `trustScoreState` and re-renders the hero card's ring, center figure and caption
   inside an `aria-live="polite"` region, so a screen-reader user hears the same update a sighted
   user sees.
3. **Scroll-trigger reveal** (`Reveal.tsx`) — used only on the social-proof quotes, mount-gated
   with `useMounted.ts` (`useSyncExternalStore`, server snapshot `false`), never
   `useReducedMotion()` alone.

## Manipulation-survives-to-CTA

The exact same `trustScoreState(inspected)` call (imported from `score-math.ts`, never
re-implemented) is read in all three places the brief requires:
- Hero's own `TrustScoreCard`.
- `ValueSection`'s first column, explicitly labeled `LIVE` against two `FIXED` facts (average
  verification time, catalog rejection rate).
- `ClosingCTA`'s closing sentence, which branches on `state.score === null` /
  `state.resolved` / partial — never a hardcoded placeholder number.

## Typography

- Body stack: `--font-sans` (Pretendard). Weights used, verified by grep across every file:
  **400 / 600 / 800** exactly (`font-normal` / `font-semibold` / `font-extrabold`) — no
  `font-bold` (700), no `font-medium` (500), no bare `<strong>`/`<b>`/`<th>` anywhere that could
  leak a UA-default weight.
- Display face: `--font-display-wide` (Archivo Display), applied via the safe inline-style form
  (`style={{ fontFamily: "var(--font-display-wide)" }}`) to the h1 and every h2 only — **never**
  the `font-[var(--font-display-wide)]` bracket form the brief flags as silently compiling to a
  `font-weight` utility in this repo's Tailwind v4 setup. Verified by grep: zero
  `font-[var(` occurrences anywhere in the route.
- Tracking: eyebrow `0.28em` (`Eyebrow` component), caption `0.16em` (section labels, LIVE/FIXED
  tags), stat `0.02em` (big tabular numbers in ValueSection/SocialProof).
- **Line-length calc**: body paragraphs use `max-width: 480px` at `text-base` (16px). Pretendard's
  mixed-text average character advance is `0.44em` (NOT the `ch` unit, which is the digit `0`'s
  advance and runs ~35% wide of the true average): chars-per-line = `480 / (0.44 × 16)` =
  `480 / 7.04` ≈ **68.2 characters** — under the ~70 target and comfortably under the 75-char
  ceiling. No `ch` units used anywhere in the route (grep-verified).

## Accent contrast calculations (blue — not teal/orange/violet/rose, and not the emerald the
immediately preceding round used)

`ACCENT = #2563EB` (Tailwind blue-600, fill/border/chain-node) and `ACCENT_TINT = #1E40AF`
(Tailwind blue-800, small text/icon/focus ring), both against this route's pure-white page,
full relative-luminance WCAG math (computed via a small script, not eyeballed):

- **White text (#FFFFFF) on ACCENT (#2563EB)**: relative luminances 1.0 and ≈0.1382 → contrast =
  (1.0+0.05)/(0.1382+0.05) ≈ **5.17:1**. Clears body-text AA (4.5:1) at *every* size — this is
  why every solid-fill control on this route (both CTA buttons, the active/resolved chain node,
  the resolved Trust Score card's accent border) prints **white** text on an ACCENT fill, never
  dark ink, satisfying the hard accent-fill rule directly rather than needing a large-text
  exception.
- **Dark ink (#09090b, zinc-950) on ACCENT (#2563EB)**: relative luminance of the ink ≈0.00278 →
  contrast = (0.1382+0.05)/(0.00278+0.05) ≈ **3.85:1**. Clears the 3:1 non-text/large-text floor
  only, misses body-text AA — so dark ink is never set on an ACCENT fill at small sizes anywhere
  on this route (there was no need to use it, since white already works everywhere).
- **ACCENT_TINT (#1E40AF) vs white**: relative luminance ≈0.0792 → contrast =
  (1.0+0.05)/(0.0792+0.05) ≈ **8.72:1**. Clears body-text AA with heavy headroom — used for every
  small running label, discount/match figures, the focus-ring color
  (`focus-visible:outline-[#1E40AF]`), and badge icons, so there is exactly one accent-on-white
  number to keep safe.
- Muted grays actually used for small text were individually checked rather than assumed:
  `zinc-500 (#71717A)` vs white ≈ **4.83:1** (clears AA, used for captions/"Fixed" labels/chain
  status text — an earlier draft used `zinc-400` at ≈2.56:1 here and was corrected after
  computing it), `zinc-600 (#52525B)` vs white ≈ **7.73:1**, `zinc-700`/`zinc-950` clear AA with
  large margins.

## Completeness notes

- Hero structure rule: headline, subhead, CTA, the Trust Score card, the verification-walk device
  and the four product-preview cards with full proof (match-reason tag, condition grade,
  verification badge, before/after discount) are all physically inside `Hero.tsx` itself — not a
  separate section below it. The top row is an explicit **8/4** split (copy / Trust Score card),
  deliberately not the flagged `col-span-7`/`col-span-5` ratio; the device and the card grid both
  then run full-width beneath that row rather than living in a second column.
- Images: zero raster images and zero remote hosts anywhere. All four product cards
  (`ProductPreview.tsx`) use hand-built flat SVG illustrations (`ProductArt.tsx`) inside a fixed
  `aspect-[4/5]` container with a reserved `bg-slate-100`, so there is no layout shift and nothing
  that can fail to load. Badges sit in a row below the art, never an absolute overlay on it.
- The jacket card's own numbers (grade 96, verified) are the *same* fixed figures the
  verification walk's Grading/Authenticity evidence panels show (`FEATURED_ITEM` / `STEP_SCORE`
  in `data.ts`) — the hero's chain is demonstrably inspecting the exact item shown in the first
  preview card, not a coincidentally similar number.
- Trust Score's big ring-center number is a decorative, `aria-hidden` plain-HTML `<p>` positioned
  over the SVG ring (not SVG `<text>`, and not the whole SVG hidden with the readable number
  trapped inside it); the actual accessible value lives in the caption paragraph beneath it,
  inside the same `aria-live="polite"` wrapper, so a screen reader always has a real sentence to
  announce rather than depending on how it happens to expose inline SVG text.
- Evidence panels: only one open at a time (an explicit accordion choice, not a brief
  requirement); all 4 steps keep a stable `id="evidence-<id>"`, rendered as a real `sr-only`
  placeholder when closed and the genuine content block when open, so `aria-controls` always
  points at a real, uniquely-id'd element (same convention as prior rounds' disclosure panels,
  reused because it's correct, not because it's unexamined).
- Keyboard/a11y: every chain node is a real `<button>` (not a `div` + click handler) with
  `aria-expanded` reflecting its own open state; no node carries a redundant custom `aria-label`
  on top of its own visible text. "Inspected" vs "Not yet opened" status is conveyed by icon
  (`CircleCheck`) + border color + text together (text is `sr-only` below the `sm` breakpoint to
  save width, never `hidden`, so it still reaches screen readers at every size) — never color
  alone.
- Motion: panel open/close and the chevron rotation animate only `opacity`/`transform`
  (`rotate`, `translateY`), never `height`/`width`/`top`/`left`. `useReducedMotion()` gates the
  verification-walk's open transition directly (click-triggered content has no SSR/hydration
  mismatch risk, since it cannot exist before a client interaction); the separate
  `whileInView` scroll-reveal on the buyer quotes is mount-gated with `useMounted.ts` regardless,
  per the brief's stricter rule for that specific pattern.
- No `Math.random`/`Date.now`/`new Date`, no raw `<img>`, no `next/image` (not needed — no
  raster images exist), no `unoptimized`, no emoji, no extra `next/font` imports, no serif, no
  `ch` units, single `h1`, no heading-level skips (h1 → h2 only, no h3+), English-only copy —
  verified by grep across every file in the route.

## 브리프에 없던 것

1. **무엇**: Trust Score의 정확한 계산식 (단순 "열어본 개수/4"가 아니라 무엇의 평균인가).
   **결정**: 각 스텝에 고정 점수(`STEP_SCORE`: scan=100, grading=96, authenticity=100,
   listed=99)를 부여하고, `inspected` Set에 들어있는 스텝들의 점수만 평균낸다
   (`trustScoreState`). listed의 99는 독립 측정값이 아니라 `round((100+96+100)/3)` —
   앞 세 스텝의 반올림 평균. **왜**: 브리프는 "진짜 파생값이어야 한다"고만 명시했을 뿐 정확한
   공식은 요구하지 않았다. listed를 별도 원시값으로 두면 "4번째 스텝은 그냥 요약일 뿐 새 측정이
   아니다"라는 파이프라인의 실제 의미가 사라지므로, 의도적으로 1~3의 함수로 정의했다.
2. **무엇**: 체인 아코디언이 한 번에 몇 개까지 열리는가. **결정**: 한 번에 하나만 (단일
   `openStep` 상태), 나머지는 이전에 열렸었다면 "Inspected" 상태를 유지한 채 접힌다. **왜**:
   브리프는 "순서 무관하게 아무거나 누를 수 있다"고만 했지 동시에 여러 패널이 열려야 한다고는
   하지 않았다. 여러 패널이 동시에 열리면 한 번에 하나의 증거 블록만 리플로우하면 되는 현재
   레이아웃보다 모바일에서 세로 길이가 예측 불가능해지는 위험이 커서, 단일 아코디언을 택했다.
3. **무엇**: Trust Score 카드의 중앙 큰 숫자를 어떻게 스크린리더에 노출할지. **결정**: SVG
   안에 `<text>`로 넣지 않고, SVG 전체를 `aria-hidden`으로 감춘 뒤 그 위에 겹쳐지는 평범한 HTML
   `<p>`로 숫자를 그리되, 이 `<p>`마저 다시 `aria-hidden`으로 감추고 실제 접근성 정보는 바로
   아래 캡션 문장(`trustScoreLabel`) 하나에만 둔다. **왜**: 초안에서는 SVG `<text>`를 그대로
   `aria-live` 영역 안에 두고 SVG 루트를 `aria-hidden` 처리했는데, 이러면 라이브 리전이
   업데이트를 공지해야 할 숫자 자체가 스크린리더에서 사라지는 모순이 생긴다는 걸 뒤늦게
   발견해 구조를 바꿨다 — 시각적 표현과 접근성 트리의 소스를 완전히 분리하는 편이 안전했다.
4. **무엇**: 4개 프리뷰 카드의 SVG 일러스트 스타일(사실적 벡터 vs 단순 도형). **결정**:
   사실적 묘사 대신 trapezoid/arc 등 단순 기하 도형 + 2톤 회색(slate-500/300) + 액센트 포인트
   1개(지퍼/스티치/램프 테두리/밑창)로 통일했다. **왜**: 브리프가 "사진 호스트 금지 → SVG
   권장"이라고만 했을 뿐 사실성 수준은 정하지 않았다. 4개 품목(재킷/토트백/램프/부츠) 모두를
   같은 단순 도형 어휘로 그리면 "이 페이지의 모든 이미지는 같은 시스템에서 나왔다"는 일관성이
   생기고, 복잡한 패스 좌표에서 생기는 렌더링 버그 위험도 줄어든다.
5. **무엇**: 모바일(390px)에서 체인 노드 라벨이 "Authenticity"처럼 긴 단어일 때 넘침 처리.
   **결정**: `break-words`를 라벨/캡션 span에 추가하고, "Inspected/Not yet opened" 상태 텍스트는
   `sr-only sm:not-sr-only` 패턴으로 모바일에서는 시각적으로만 숨기고 스크린리더에는 항상
   남긴다(`hidden`이 아니라 `sr-only`를 써서 완전히 DOM/접근성 트리에서 제거하지 않음). **왜**:
   브리프가 지적한 "자동 스윕은 페이지 레벨 가로 스크롤만 잡고, 요소 단위 텍스트 잘림은 못
   잡는다"는 위험을 직접 검토하다 발견한 문제라 고쳤다 — `hidden`을 썼다면 공간은 절약되지만
   스크린리더 사용자에게는 그 스텝이 "inspected"인지 알려줄 방법이 아예 사라졌을 것이다.
