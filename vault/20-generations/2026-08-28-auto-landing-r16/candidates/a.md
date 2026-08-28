# Candidate a — "The Q2 disclosure"

A quarterly self-audit report that repick publishes about its own AI-matching mistakes, structured as the entire landing page: the hero is a ranked disclosure of five error categories (worst-harm first, sort rationale printed on the page, two categories shown getting worse), a ranked list where clicking a category recomputes a live detail panel (count bars, resolution rate, quarter-over-quarter delta, and a "what changed" note), a static admission of what the report can't measure, and — directly below the fold — four verified listings carrying the same proof (match%, condition grade, verified badge, before/after price) as "what we do differently now." The closing CTA echoes whichever category is currently selected, so the interactive state follows the reader all the way to the bottom.

Route: `/landing-evolve/r16/a`. Files: `page.tsx`, `Hero.tsx`, `VerifiedNow.tsx`, `AuditReport.tsx`, `SocialProof.tsx`, `ClosingCta.tsx`, `data.ts`, `theme.ts`.

## 브리프에 없던 것 (Things the brief didn't specify)

**① Exact accent hex + contrast math.**
② Decided on two shades of the assigned orange hue, each scoped to where it's legally usable, plus a light tint:
- `ACCENT` = `#EA580C` (Tailwind orange-600)
- `ACCENT_TEXT` = `#C2410C` (Tailwind orange-700)
- `ACCENT_TINT` = `#FFF7ED` (Tailwind orange-50)

③ Verified with a precise sRGB→linear WCAG calculation (Python, not eyeballed) rather than trust an approximate mental calculation — my first manual pass got several pairs wrong by enough to flip a pass/fail, so I re-derived everything programmatically before finalizing. Measured pairs actually used on the page:

| Pair | Contrast | Where used | Threshold cleared |
|---|---|---|---|
| `#EA580C` vs white | 3.560 | left-border rule on hero rationale callout | ≥3:1 (border/large) |
| `#EA580C` vs `zinc-900` (`#18181B`) | 4.977 | (headroom check only, not directly used on dark) | ≥4.5 |
| `#EA580C` vs `zinc-100` (`#F4F4F5`) | 3.238 | "this quarter" bar fill vs its track | ≥3:1 (graph fill) |
| `#EA580C` vs `zinc-200` (`#E4E4E7`) | **2.805 — fails** | rejected: original track color, swapped to zinc-100 | — |
| `#C2410C` vs white | 5.178 | filled CTA button bg (with white text), "Changed" label, links, focus outline | ≥4.5:1 (small text) |
| `#C2410C` vs `#FFF7ED` (accent tint) | 4.877 | active list-item border/label on its own tint bg | ≥4.5:1 |
| `#C2410C` vs `zinc-100` | 4.711 | verified-badge icon on a zinc-100 chip | ≥4.5:1 |
| white text vs `#C2410C` fill | 5.178 (same pair as above) | CTA button label | ≥4.5:1 small text on fill |

Because `#EA580C` only clears **3.56:1** on white — short of the 4.5:1 small-text floor — it is used exclusively for fills/bars/borders (bar fill, left-border rule), never for text or icons. `#C2410C` clears 4.5:1+ against every surface it actually touches (white, the orange-50 tint, and zinc-100), so it carries all small text, icons, links, the focus-ring color, and doubles as the filled-button background specifically because white-on-`#C2410C` (5.18:1) comfortably beats white-on-`#EA580C` (3.56:1, which would have failed small-button-label text). This is why the button background and the "small text" accent are two different shades of the same hue rather than one.

**① Muted-gray shade selection per surface, and the specific failure that forced a mid-build fix.**
② Standardized: `zinc-500` for muted text/icons on white or `zinc-50` surfaces, `zinc-600` minimum wherever that same text sits on a `zinc-100`+ tint (matches the brief's own stated rule).
③ The brief already states this rule with one example number; I re-derived it independently and it reproduced almost exactly — `zinc-500` vs `zinc-100` measured **4.397:1** in my calculation (brief cites 4.34:1; same conclusion, small hex-shade rounding difference), confirming the fail is real. This caught a live bug in my own first draft: the audit-report ranked-list rows use the same rank-number/status-text elements in both their resting (white bg) and selected (orange-tint bg) states — `zinc-500` passes on white (4.83:1) but fails on the orange-50 tint (2.41:1, since the tint's luminance sits closer to `zinc-100` than to pure white), and since the *default* selected category is the first/most-severe one, that failure would have been live in the page's default render, not just an edge case. Fixed by promoting both elements to `zinc-600` (7.28:1 on the tint), which also passes comfortably on white. I also found and fixed the same class of issue in three other spots (`zinc-400` used for a folio number and a strikethrough price, both of which fail even on plain white at 2.56:1) by bumping every `zinc-400` text usage in the file to `zinc-500`.

**① Body-copy container width, computed from the given glyph-width constant.**
② Two widths, chosen by font size: `max-w-[32rem]` (512px) for `text-base`/`text-lg` (16–18px) copy, `max-w-[28rem]` (448px) for `text-sm` (14px) copy.
③ Applied the brief's own formula (`chars = width / (0.44 × font-size)`) rather than picking a round number: at 512px/16px that's 512/(0.44×16) ≈ 72.7 chars (under the 75 ceiling); at 512px/14px it's 512/(0.44×14) ≈ 83.1 chars (over ceiling) — so every `text-sm` long-form paragraph (sort rationale, category description, "what changed" note, measurement-limits disclosure) was deliberately narrowed to 448px, which resolves to ≈72.7 chars at 14px, back under the ceiling.

**① Whether to use real product photography or a generative alternative.**
② Used flat `zinc-100` panels with a large (48px) `lucide-react` category icon (`Shirt`/`Luggage`/`Lamp`/`Armchair`) standing in for each listing's photo, instead of `next/image` + a real photo URL.
③ The sandbox's outbound network was unreachable when I tried to `curl`-verify specific `images.unsplash.com/photo-<id>` URLs (every attempt returned connection code `000`), so I could not confirm any fixed photo id would actually resolve — shipping an unverified id risked a broken image directly under the "product + proof in the first fold" requirement. The brief explicitly allows "generative SVG/CSS" as an equal alternative to photos, so I took that branch rather than gamble on an unverified URL; this also sidesteps the photo/badge-collision rule entirely since there's no photo to collide with.

**① Whether entrance/mount animation should ever be the *only* thing making content visible.**
② The single `h1` uses a plain CSS `@keyframes rise` animation (already defined in `globals.css`, `motion-reduce:animate-none` gated) instead of framer-motion's `initial`/`animate` props; the audit-report detail panel dropped its enter/exit motion entirely and just swaps content instantly on selection. Scroll-triggered reveals lower on the page (listing cards, quotes, closing CTA) keep framer-motion's `whileInView`, still gated by `useReducedMotion`.
③ `globals.css` itself documents exactly this tradeoff in a comment: framer-motion's `initial={{opacity:0}}` is applied as an inline style during server render (before hydration), so any content depending on it for its *first* visible state is briefly (or, if JS never loads, permanently) invisible — the file's own `rise` keyframe exists specifically so "the resting styles are the finished state." Since the `h1` is the one element the "no scrolling to see product+proof in the first fold" rule most directly protects, I moved only that element (and the always-live detail panel) off framer-motion's mount-time opacity trick, while keeping framer-motion for genuinely progressive, below-fold reveals where the convention is well precedented and expected.

**① Specific audit figures, category set, and sort order (the brief asks for the *shape* of the report, not the numbers).**
② Five categories, ranked by invented "harm to trust" rather than count: Wrong item shipped (6, rank 1) → Verification badge shown in error (11, rank 2, **got worse**, +7) → Condition grade overstated (34, rank 3) → Size/measurement mismatch (58, rank 4, **got worse**, +9, explicitly marked unresolved) → Match score overconfident (142, rank 5). Totals: 251 cases this quarter vs. 271 last quarter, 82% average resolution rate.
③ Arbitrary but deliberately shaped to hit every required beat: the worst-harm category has the fewest incidents (tests the "sort by harm, not frequency" instruction is legible), two categories are honestly shown getting worse (not hidden), and one category (`size-mismatch`) is left explicitly unresolved going into next quarter rather than having every row resolve into a tidy "we fixed it" story — a report where everything always improves would read as marketing copy wearing an audit's clothes.

**① Whether the primary CTA's destination should be an audit page or the product list.**
② Both the hero CTA and the closing CTA link to `#verified-now` (the listing carousel), not to the audit table.
③ The brief frames the audit report as one half of the fold and "what we do differently now" (the listings) as the commercially load-bearing half; routing the primary action toward the listings keeps the CTA action-oriented (browsing) while the audit section is reached via a secondary text link and by scrolling — matches the stated pattern "the audit report IS the hero, and the redeemed/verified listings sit right below."

**① Interaction-type inventory, to hit the stated minimum of four.**
② (1) Hero CTA hover/tap micro-scale (framer-motion `whileHover`/`whileTap`), (2) scroll-triggered `whileInView` reveals on the listing cards, quotes, and closing panel, (3) a real horizontally-scrolling listing carousel with keyboard-reachable prev/next buttons and a `tabular-nums` "`x / 4`" live counter, (4) the audit-category selector, which is also the "value in three parts" control — clicking a category recomputes the headline count, the description sentence, two comparison bars, the resolution-rate stat, and the "what changed" note simultaneously.
③ Not specified beyond "minimum 4, decorative doesn't count" — chose these four so each maps onto a distinct, load-bearing part of the structural brief rather than adding a fifth cosmetic effect.

**① List semantics under Tailwind's Preflight.**
② Added `role="list"` to every `<ul>`/`<ol>` in the file (badge chips, the carousel track, the audit ranked list, the quotes grid).
③ Tailwind's Preflight strips default `list-style`, which is a documented trigger for Safari/VoiceOver to drop the implicit `list`/`listitem` roles from `ul`/`ol`/`li`; restoring the role explicitly is cheap insurance the brief doesn't mention but that this repo's own Preflight setup makes necessary.
