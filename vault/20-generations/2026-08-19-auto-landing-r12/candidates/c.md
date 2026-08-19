# Candidate c — "Trace"

**One line:** A vertical, scroll-linked process timeline — registration → AI verdict → instant offer
→ settlement — that follows one real listing (photo included) end to end, its SVG spine literally
drawing itself as the visitor scrolls and each stage's numbers wired to the same arithmetic the
closing payout calculator uses, on a dark canvas with a dual rose/cyan accent split by whose claim
each figure is (seller vs. repick).

- Theme: dark · accent: rose `#e11d48`/`#fb7185` + cyan `#06b6d4`/`#0e7490`/`#22d3ee` (assigned pair,
  r12 diversity axis) · display face: none — Pretendard only, per assignment (candidate a also drew
  "no display face"; c's slot explicitly excludes `-wide` and `-mono` too, leaving only "none").
- Files: `app/src/app/landing-evolve/r12/c/page.tsx` (84 lines, server shell + metadata + nav +
  footer) · `HeroSection.tsx` (198, client) · `ProcessTimeline.tsx` (442, client) ·
  `PayoutCalculator.tsx` (190, client) · `SocialProof.tsx` (46, server) · `ClosingCta.tsx` (34,
  server) · `data.ts` (309, palette/contrast math + all content + shared settlement arithmetic) —
  1,303 lines total.

## Macro skeleton

Hero (headline + subhead + CTA, live listing card with category tabs + match/grade/certified/
discount in the first fold) → vertical scroll-linked process timeline (4 stages, one traced listing)
→ payout calculator (form/CTA) → social proof (stats + 2 quotes) → closing CTA. No stepper, no tab
panel, no carousel, no bento grid, no comparison table, no marquee, no ledger/journal page format —
none of the 16 existing macro shapes (see below).

## Why this differs from its nearest neighbour — `auto-landing-r10/b` ("Filter-Rail Storefront")

r10/b is the closest existing shape: it also has a "how it works" section with numbered steps, built
as a **`role="tablist"` horizontal stepper** — four parallel tabs a visitor picks between, each swap
replacing a single detail panel, with **no scroll-position dependency** (the panel is inert until a
tab is clicked; nothing changes if you just scroll past it). Candidate c's timeline is the opposite
mechanism on every axis that matters:

1. **Selection model.** r10/b's steps are *parallel* — clicking step 3 does not require having seen
   step 1 or 2, and the four panels are mutually exclusive alternates. c's steps are *sequential* —
   they are one listing's history in order, and the scroll position itself (not a click) is what
   advances which stage is "current" (`onViewportEnter` on each `<li>`).
2. **What scrolling does.** In r10/b, scrolling past the stepper does nothing to it — it is inert
   until clicked; the "reveal" mechanism it actually built its interaction budget around was the
   *keyboard roving-tabindex* between tabs, not scroll. In c, scroll position is data: the SVG spine's
   `pathLength` is bound directly to `useScroll`'s `scrollYProgress`, so the connecting line is
   visibly, continuously mid-way drawn at whatever fraction of the section has been scrolled — a
   `motion.li[onViewportEnter]` per stage confirms this in Playwright (§Verification) actually
   painted a live-updating `stroke-dasharray` between 0 and 1 as the mouse wheel moved, not just a
   click-triggered panel swap.
3. **What's on screen at once.** r10/b shows **one panel at a time** (the other three are `hidden`).
   c shows **all four stages simultaneously**, stacked, each with its own always-visible core evidence
   (photo, subscore bars, offer figures, payout figures) plus an *optional* expand for secondary
   detail — nothing is hidden behind a required click the way r10/b's non-active panels are.
4. **Real data, not swapped copy.** r10/b's step panels are independent prose blocks. c's four stages
   are arithmetically chained: the offer (`OFFER_AMOUNT = compHigh − Σdeductions`) feeds the
   settlement (`settle(OFFER_AMOUNT)`), and the closing payout calculator calls that exact same
   `settle()` function on a different input — a visitor who checks the calculator's answer against the
   timeline's Step 4 is checking one function, not two writers' independently-typed numbers.

`design-principles.md`'s own §Landing 구조 기본형 3 draws the relevant line: the test for "조작=가치
체감" is functional ("조작이 표시되는 핵심 증명/비교 데이터를 실시간으로 갱신하는가"), not which
widget family is used — a stepper and a scroll-linked timeline both *can* satisfy it. What r10/b and
this candidate do not share is the **selection model**: r10/b is a switch (parallel, click-driven,
one-visible-at-a-time), c is a sequence (linear, scroll-driven, all-visible-at-once). That is the
axis the brief's differentiation instruction is checking, and it is a structural difference in how
the visitor's action maps onto what's revealed, not a cosmetic one (dark vs light, icon set, etc.).

(Runner-up nearest neighbours also checked and ruled out: `v13`/`auto-landing-r11/c`'s "Audit Trail"
uses `useScroll` too, but drives a **horizontal top progress bar** — `scaleX` on a sticky bar, not a
line running *through* the content — and its scroll callback only updates a running total, never a
node's fill color or a drawn path; `v9`'s `AnnotationScan` pins are an **autoplaying sequence on a
timer**, not scroll-linked, and single-photo, not four data-bearing stages.)

## Verification actually run this session

- `node scripts/dash-static-check.mjs app/src/app/landing-evolve/r12/c/*.tsx` — 0 violations (all
  rules: `no-random`, `no-emoji`, `no-raw-img`, `no-next-image-unopt`, `no-unlisted-font`,
  `no-font-serif`, `no-next-font`, `no-random-image-host`, `no-dark-dim-text`, `img-needs-alt`).
- `npx tsc --noEmit` — 0 errors. `npx eslint src/app/landing-evolve/r12/c/*.tsx` — 0
  errors/warnings (found and removed one unused import in the process).
- Font-weight audit: `grep -o "font-(normal|semibold|...)"` across all six files — exactly three
  weights present (`font-normal`/`font-semibold`/`font-extrabold`), no strays.
- Route smoke test against the repo's own dev server (already running on :3100, shared with the
  other two candidates in this round): `GET /landing-evolve/r12/c` → 200.
- Playwright (browsers already cached at `/opt/pw-browsers`, no network needed) width sweep at
  390/1280/1366/1440/1600/1920 — **0px horizontal overflow at every width**, 0 `pageerror`/hydration
  console errors. Only console entries anywhere are `403`/`ERR_TUNNEL_CONNECTION_FAILED` on
  `images.unsplash.com` and `_next/image` — this sandbox's outbound proxy blocks that host
  (confirmed via the proxy's own `/__agentproxy/status`, which lists it as a `connect_rejected`
  policy denial), a pre-existing environment limitation documented in `auto-landing-r10/c`'s own
  notes, not a defect in this candidate. All four image URLs reuse fixed `photo-<id>` sources already
  verified working in the promoted champion (`/`) and `v13` — sneakers `1543076447-…`, bag
  `1560243563-…`, boots `1608256246200-…` (champion/v13-verified), coat `1445205170230-…`
  (champion-verified).
- Interaction smoke test (Playwright, real clicks/selects, not just source inspection): hero
  category tab click swaps the panel without error; timeline expand button toggles
  `aria-expanded` false→true; payout calculator `<select>` change recomputes the live estimate.
  Directly inspected the rendered SVG: `stroke-dasharray` on the animated line measured `"0 1"`
  pre-scroll, `"0.4697… 1"` mid-scroll, `"1 1"` after scrolling past the section — the line is
  actually, continuously scroll-bound, not a fixed illustration.
- Reduced-motion check with Playwright's `reducedMotion: 'reduce'` context option (verified against
  `window.matchMedia` directly, not assumed): the animated `<svg>` computes `display: none` and the
  static fallback `<svg>` computes `display: block`; all four node dots compute the "reached" fill
  color regardless of scroll position. With `reducedMotion: 'no-preference'`, the reverse holds and
  only the already-scrolled-past dot is filled. Both directions verified, not just the reduced one.

## A bug this caught, and the fix

The first implementation branched the timeline's SVG line on `useReducedMotion()`'s return value
directly — a plain `<path>` when reduced, `<motion.path style={{ pathLength: scrollYProgress }}>`
otherwise. `useReducedMotion()` returns `null` during SSR (it can't call `matchMedia` on the server)
and only resolves client-side after mount. Branching *element type* on that value means the
server-rendered markup and the first client render can genuinely disagree whenever a real visitor has
the OS setting on — and in Playwright testing with `reducedMotion: 'reduce'` this produced a real
hydration mismatch: the dev server's own error overlay logged the exact diff (server's `<path>`
missing the `pathLength`/`stroke-dashoffset`/`stroke-dasharray` attributes the client tried to
hydrate onto it), and the rendered line was stuck at `stroke-dasharray: "0 1"` (fully hidden)
regardless of scroll. The fix: render **both** SVG elements unconditionally (identical DOM on server
and client, nothing for hydration to disagree about) and let Tailwind's `motion-safe:`/
`motion-reduce:` CSS variants — pure media queries, no JS mount timing — decide which one paints.
The same reasoning was applied to the node-dot "reached" color: the JS-derived `active` state stays
consistent between server and client (both start at 0), and the reduced-motion "every stage already
reached" look is layered on as a `motion-reduce:` class override rather than folded into the boolean
that gates the base color. This is not in any brief — it's a correctness bug the brief's own
"prefers-reduced-motion 존중" requirement surfaced once actually tested with emulation rather than
just read from source, and CSS-media-query-driven branching over JS-hook-driven branching is the
general fix for this whole class of hydration bug wherever `useReducedMotion()` would otherwise
change an element's *type* or *attribute set* rather than just a class list.

## 계산 근거 — 본문 폭 (0.44em 상수, `ch` 미사용)

줄당 글자수 = 컨테이너 폭 ÷ (0.44 × font-size). 이 파일에 쓰인 모든 프로즈 컨테이너:

| 위치 | font-size | 컨테이너 | 계산 | 결과 |
|---|---|---|---|---|
| Hero subhead (`HeroSection.tsx`) | 16px (`text-base`) | `max-w-[480px]` | 480 ÷ (0.44×16=7.04) | **68자** |
| Hero "Why this match" (같은 파일) | 14px (`text-sm`) | `max-w-[400px]`* | 400 ÷ (0.44×14=6.16) | **65자** |
| Timeline intro (`ProcessTimeline.tsx`) | 15.2px (`0.95rem`) | `max-w-[460px]` | 460 ÷ (0.44×15.2=6.688) | **69자** |
| Calculator intro (`PayoutCalculator.tsx`) | 15.2px | `max-w-[460px]` | 460 ÷ 6.688 | **69자** |
| Calculator disclaimer (같은 파일) | 12px (`text-xs`) | `max-w-[370px]`* | 370 ÷ (0.44×12=5.28) | **70자** |
| Closing subhead (`ClosingCta.tsx`) | 16px | `max-w-[460px]` | 460 ÷ 7.04 | **65자** |
| Testimonial quote (`SocialProof.tsx`) | 16px | `max-w-[460px]` (figure) | 460 ÷ 7.04 | **65자** |

\* 두 줄은 처음에 각각 `max-w-[480px]`(text-sm → 78자, 상한 초과)와 폭 미지정(text-xs가 최대
~1120px 그리드 안에서 감싸지 않은 채 놓여 있어 이론상 100자+ 가능)으로 작성됐다가, 이 계산을 실제로
해보며 잡아 좁혔다 — "짧은 문장이라 실제로는 안 넘길 것"이라는 추측 대신 상수로 역산했다. 나머지
(타임라인의 finding·라벨류)는 문장 자체가 35~62자로 짧아 어떤 컨테이너 폭에서도 한 줄을 넘기지 않는
것을 직접 확인했고, 그래서 별도 `max-w`를 걸지 않았다 — 폭 제약은 "컨테이너가 넓어서 문단이
늘어지는" 경우에만 의미가 있고, 문장 자체가 짧으면 컨테이너 폭과 무관하게 규칙을 만족한다.

전부 65~70자 구간으로, 75자 상한에서 5~10자 여유를 뒀다(design-principles의 "70자 근처를 목표로
한다" 및 auto-landing-r11의 "16px 여유" 관례와 같은 태도).

## 색 대비 근거 (rose/cyan 파생, WCAG 상대휘도 직접 계산)

전문은 `data.ts` 상단 주석에 있다. 핵심 결론만: `BG #0B0C10` 위에서 rose-400(`#fb7185`, 7.26:1)·
cyan-400(`#22d3ee`, 10.82:1)만 소형 텍스트/아이콘에 쓴다. rose-600(`#e11d48`)·cyan-500(`#06b6d4`)은
BG 위 4.16:1/8.05:1로 **대형 텍스트·보더·막대 채움 전용**이다. 흰 글자를 얹는 채움 배경은 rose-600
(4.70:1)과 cyan-**700**(`#0e7490`, 5.36:1)만 쓴다 — cyan-600(`#0891b2`)은 흰 글자와 3.68:1로 AA
미달이라 이 페이지 어디에도 텍스트를 얹은 채움으로 쓰지 않았다(버튼·배지는 전부 rose-600 또는
cyan-700). rose-600을 카드 표면(`#14151C`) 위 소형 텍스트로 쓴 경우가 하나도 없는지도 확인했다
(3.87:1로 미달이기 때문 — deduction 금액 라인은 그래서 rose-**400** 틴트를 쓴다,
`ProcessTimeline.tsx`의 `-{money(d.amount)}` 라인 참조).

## 브리프에 없던 것

1. **① rose/cyan을 장식이 아니라 "누구의 주장인가"로 나눴다.** ② 셀러가 제출한 값(등록 단계의 asking
   price·self-grade)은 rose, repick이 산출한 모든 값(AI 판정·오퍼·정산)은 cyan으로 고정 배정했고,
   포커스 링은 둘 다 아닌 cyan-400 한 종으로 통일해 "인터페이스가 반응하고 있다"는 세 번째 의미를
   따로 뒀다. ③ 브리프는 두 accent를 "파생 색조"로만 배정했지 용도를 정하지 않았다 — 임의로 두 색을
   섞느니 타임라인의 실제 서사(셀러 주장 vs repick 검증)에 의미를 걸어, 판정 렌즈가 색을 봤을 때
   "왜 이 카드는 로즈고 저 카드는 시안인가"에 답이 있게 만들었다.
2. **① 스크롤선을 SVG `<path>` + `pathLength`로 구현하되, reduced-motion 분기를 CSS로 옮겼다.**
   ② 처음엔 `reduced ? <path/> : <motion.path/>`로 JS에서 엘리먼트 타입 자체를 분기했으나, 이것이
   실제 하이드레이션 불일치를 냈다(§검증 "이 세션이 잡은 버그" 참조) — 그래서 두 `<svg>`를 항상 함께
   렌더링하고 `motion-safe:block`/`motion-reduce:block`로 어느 쪽을 보여줄지 순수 CSS 미디어쿼리가
   정하도록 바꿨다. ③ 이 클래스의 버그(`useReducedMotion()`이 SSR에서 `null`이라 첫 클라이언트
   렌더와 서버 렌더가 갈릴 수 있다는 것)는 브리프에 없었지만, 실제로 Playwright의
   `reducedMotion:'reduce'` 에뮬레이션으로 검증하다가 발견했다 — 소스만 읽으면 정상으로 보이는
   종류였다(§공통 필수 "다크 보조텍스트 하한"이 정적 스캔의 한계였던 것과 같은 계열: 실제로 재야
   보인다).
3. **① 타임라인 4단계와 마무리 계산기가 같은 `settle()` 함수를 공유하게 설계했다.** ② 정산 단계의
   수수료(9%)·처리비($2)를 상수(`SERVICE_FEE_RATE`, `PROCESSING_FEE`)로 뽑고, 계산기의 견적도 같은
   함수를 호출해 저·중·고 견적을 낸다(`data.ts`의 `settle()`, `PayoutCalculator.tsx`의
   `settle(low).net`/`settle(high).net`). ③ 브리프는 "조작이 핵심 증명을 실시간 갱신"만 요구했지
   증명들이 서로 산술적으로 맞물려야 한다고는 안 했다 — 하지만 타임라인이 "실 데이터"를 자처하면서
   같은 페이지의 계산기가 다른 공식을 쓰면 그 자체로 "이 숫자들이 진짜인가"에 대한 반증거리가 되므로,
   자체적으로 더 엄격한 기준(숫자 출처 단일화)을 세웠다.

## 완성도 참고

- 인터랙션 5종 확보(요구 4종 이상): ① 히어로 카테고리 탭(매치%·등급·인증·할인 전부 재계산) ②
  스크롤 연동 SVG 선 드로잉 + 단계 활성화 ③ 단계 카드 확장(추가 증거, 장식 아님) ④ 페이오아웃
  계산기(select 변경 시 실시간 재계산 + 폼 제출) ⑤ CTA hover/tap 마이크로인터랙션(보너스).
- 히어로 첫 폴드: 매물 카드(사진 + 매칭%·등급·인증·할인) 전부 스크롤 없이 노출, 배지는 사진과
  분리된 별도 행(사진 위 오버레이 아님).
- 실사진 3장(히어로 토글 스니커즈/백/부츠) + 1장(타임라인 등록 단계, 코트) — 전부 `next/image`,
  고정 `photo-<id>`, 고정 `aspect-*` + 배경색 예약 컨테이너.
- 웨이트 정확히 3종(400/600/800), 세리프 없음, 디스플레이 활자 미사용(배정: c는 펜던다드만).
