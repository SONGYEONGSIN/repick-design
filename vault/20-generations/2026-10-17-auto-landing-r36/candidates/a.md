---
tags: [candidate, landing, r36]
---

# r36 / Candidate A — "A grade is a claim."

## Product / brand
**repick** (kept consistent with this catalog's existing fictional AI-graded resale brand).

## One-line concept
Grading-and-pricing confidence for resale: move a condition-grade slider and a category select,
and a slope chart of four real comparables redraws live — seller's asking price on the left,
repick's AI-adjusted price on the right — with the item matching your exact selection bold and
pinned while the other three grade tiers stay visible, muted.

## Device
- **Input**: a 4-step condition-grade slider (Like New → Excellent → Good → Fair, native
  `<input type="range">`) + a 4-category `<select>` (Sneakers / Handbags / Watches / Cameras).
  Both are real, fully keyboard-operable native controls.
- **Output**: a slope/ladder chart — two vertical axes ("Listed by seller" / "repick AI price"),
  one line per grade tier in the current category, joined start-to-end. Start/end dollar values
  and the signed delta are always-visible static HTML text (not hover-only); the SVG lines are
  `aria-hidden` pure geometry. The row matching the slider's current grade draws 3px/full-opacity
  in teal with bold dark-ink labels; the other three stay 1.75px/55% opacity in muted gray with
  lighter labels — never a color-only distinction (stroke width, dot radius and label weight all
  differ too).

## Implemented interactions (5, minimum was 4)
1. **Core device** — grade slider + category select, live-updates the chart highlight, the hero's
   own readout number, the four parallel thumbnail cards, the value-section recap, and the closing
   CTA's sentence *and* its button label (`See {category} at {grade} grade`) — all from one shared
   `selectedRow`/`ctaLabel` computed once in `landing-client.tsx` and passed down, never
   re-hardcoded per section.
2. **Scroll-triggered reveal** — `Reveal` wraps every section below the hero, mount-gated with
   `useSyncExternalStore` (`use-mounted.ts`), never the hero itself.
3. **Hover/focus on a slope-chart row** — reveals the row's reason tags and swaps the hero's "AI
   price for this condition" callout to that row's data, without ever hiding the row's own
   always-visible baseline labels (those render as static text regardless of hover state).
4. **Secondary filter** — `ProductPreview`'s category chips + an independent "needs re-grading
   only" boolean toggle (≥15% listed-vs-AI disagreement), a second, separate control surface from
   the hero's device.
5. (bonus) Each listing card has a "What the grade is based on" expand/collapse disclosure.

## Typography
- Exactly **3 rendered weights**: 400 (`font-normal`, body/captions), 600 (`font-semibold`,
  labels/buttons/badges), 800 (`font-extrabold`, headings + big stat numbers). Every text-bearing
  element carries an explicit weight class — audited by grep after the build, four stray
  no-explicit-weight paragraphs and two duplicate `font-bold` (700, a 4th weight) sweeps were
  caught and fixed.
- Display face: `--font-display-wide` only, on the h1, the three section h2s, and the two large
  percentage readouts (hero live number + nothing else) — headline-scale latin only. Body and all
  labels stay on `--font-sans` (Pretendard). No serif, no second display face.
- **Line-length calculation** (constant: Pretendard mixed-text average advance = `0.44em`):
  - Body paragraphs: `max-w-[500px]` at `text-base` (16px) → `500 ÷ (0.44 × 16) = 500 ÷ 7.04 ≈
    71.0` characters/line — inside the 65–75 target, ~5 chars of margin under the 75 cap, close to
    the 70 target. Used for the hero subhead, value-section intro, product-preview intro and
    closing-CTA body.
  - Secondary asides (hero device callout, value-section's 3 explainer cards): `max-w-[400px]` at
    `text-sm` (14px) → `400 ÷ (0.44 × 14) = 400 ÷ 6.16 ≈ 64.9` characters/line — under 65 is
    explicitly allowed for shorter supporting copy per brief.
  - No `ch` units used anywhere (brief's documented ~35% Pretendard discrepancy).

## Accent contrast (teal — calculated, not assumed from the repo default)
Real WCAG relative-luminance contrast, computed by hand (sRGB→linear per channel, `L = 0.2126R +
0.7152G + 0.0722B`, `contrast = (L_lighter+0.05)/(L_darker+0.05)`):

| Pairing | Ratio | Verdict |
|---|---|---|
| teal-700 `#0F766E` text vs white `#FFFFFF` | **5.47:1** | passes AA at every text size — used for all small text/icons/links directly on white |
| teal-600 `#0D9488` fill vs white `#FFFFFF` | **3.74:1** | passes the 3:1 large-text/non-text floor only — fills/buttons/chips/highlighted line, never small text on white |
| **white** text on teal-600 fill | **3.74:1** | fails small-text AA (needs 4.5:1) — never used |
| **zinc-950** `#09090B` ink text on teal-600 fill | **5.31:1** | clears AA at every size — the only text color used on an accent fill on this route |
| zinc-600 `#52525B` (muted text) vs white | 7.73:1 | floor on pure white is zinc-500 (4.83:1); using 600 everywhere keeps the same token safe on tinted zinc-50/teal-50 surfaces too |
| zinc-950 ink vs white (page fg/bg) | 19.90:1 | |
| teal-700 text vs teal-50 `#F0FDFA` chip bg | 5.25:1 | passes AA — used for the "% match" / "needs re-grading" chip text |
| teal-800 `#115E59` vs white (large-text-only alt) | 7.58:1 | unused on this route, recorded for completeness |

**This is the opposite split from the repo's documented default (`#6E56CF` on `#0B0B0F`, where
white-on-fill passes full AA and dark-ink-on-fill only clears the large-text floor).** For this
teal-on-white pairing, white-on-fill *fails* small-text AA (3.74:1) and dark-ink-on-fill *passes*
(5.31:1) — confirming the brief's warning that the same split cannot be assumed across hue/ground
pairs; it had to be computed fresh.

## Completeness
Full page: sticky header (nav + CTA) → hero (headline + subhead + CTA + full device, all one
component) → value-section recap → 16-item filterable product gallery → social proof + trust
strip → closing CTA → footer. 16 files, light theme (`#FFFFFF` ground, true white, not off-white),
single teal accent hue, fully deterministic data (`data.ts`, zero `Math.random`/`Date`), fixed
`images.unsplash.com/photo-<id>` images with reserved aspect-ratio + background, badges in a row
below each photo (never overlaid), `focus-visible:outline-2` pattern everywhere with **no**
preceding `outline-none` (two instances of the exact dead-focus footgun — the `<select>` and the
slope-chart row buttons — were caught and fixed during build), single `h1`, sequential heading
levels, skip link to `#main`, `aria-live="polite"` on the live readout.

## 브리프에 없던 것

**1. 카테고리·데이터셋 구성**
- 결정: 4개 카테고리(Sneakers/Handbags/Watches/Cameras) × 4개 그레이드 = 고정 16개 비교 항목, 가격은 `retailPrice × conditionFactor(score) × demandFactor(demandIndex)`로 결정론적 산출.
- 이유: 디바이스가 매 선택마다 실제로 다른 숫자를 내야 하므로, 무작위 없이 신뢰 가능한 산출 로직이 필요했다 — 네 카테고리는 범용 리세일 마켓 도메인에서 가장 보편적인 것들을 골랐다.

**2. 브랜드명**
- 결정: "repick" 유지 (새 이름 발명 안 함).
- 이유: 카탈로그 전체가 이미 이 가상 브랜드로 수렴해 있어, 새 이름을 쓰면 오히려 카탈로그 일관성을 해친다.

**3. 히어로 그리드 비례**
- 결정: Tailwind 12-col span이 아니라 커스텀 `grid-cols-[minmax(0,420px)_minmax(0,1fr)]` — 헤드라인 칼럼은 고정 420px, 디바이스 칼럼이 나머지를 전부 차지(비율 역전).
- 이유: 금지된 "헤드라인 7 + 증명카드 5, 아래 디바이스 12 전체폭" 스켈레톤과 구조적으로 다르게 만들기 위해 — 디바이스를 히어로 밖 별도 행으로 밀지 않고 아예 히어로 그리드 안에서 더 넓은 칼럼을 주는 쪽을 선택했다.

**4. "needs re-grading" 2차 필터 의미**
- 결정: listed price와 AI price가 ±15% 이상 벌어진 항목만 남기는 독립 토글, 히어로의 그레이드/카테고리 디바이스와 상태를 공유하지 않음.
- 이유: 두 컨트롤이 같은 상태를 공유하면 "4번째 인터랙션"이 사실상 1번째의 재진술이 된다 — 완전히 분리된 축(연속 등급 vs 이산 불린)을 줘야 진짜 별개 인터랙션이 된다.

**5. 카테고리당 사진 1장 재사용**
- 결정: 16개 항목 각각에 새 unsplash id를 추측하는 대신, 카테고리당 이미 이 카탈로그에서 검증된 고정 id 1개를 그 카테고리의 4개 그레이드 카드 전부에 재사용.
- 이유: 깨진 이미지/오검증 리스크를 줄이면서도 "고정·비무작위·내용이 정해진 이미지" 요건은 그대로 만족 — 대표 제품샷이라는 디자인 결정으로 문서화.

**6. 호버 상세 패널의 위치**
- 결정: 행을 직접 확장하지 않고, 차트 아래 고정 크기의 별도 상세 패널(이유 태그 + 읽음값)이 호버/포커스된 행에 따라 내용만 바뀌도록 구현.
- 이유: 행 높이가 호버로 바뀌면 SVG 라인의 y좌표(고정 ROW_H 기반)와 HTML 라벨 그리드가 어긋난다 — 좌표계를 깨지 않는 유일한 방법이 "내용만 교체되는 고정 패널"이었다.

**7. 로드 시 기본 선택값**
- 결정: 카테고리=Sneakers, 그레이드=Excellent (가장 극적인 수치도 가장 평탄한 수치도 아닌 중간값, −4%도 아니고 +71%도 아닌 +21.4%).
- 이유: 첫 화면에서 디바이스가 "뭔가 하고 있다"는 걸 믹바로 보여줄 신뢰 가능한 숫자가 필요했다 — 최댓값을 기본값으로 두면 치리픽처럼 보인다.

**8. Accent 2차 사용(2차 필터 활성 상태) 색상**
- 결정: 처음엔 amber를 썼다가 teal 단일 계열로 되돌림(`border-teal-700/30 bg-teal-50 text-teal-800`).
- 이유: near-monochrome + 단일 accent 원칙을 지키기 위해 — amber를 쓰면 의미 분할 근거 없는 2차 accent가 생겨 조항 위반이 된다.
