# Candidate c — "repick Sort"

One line: eight real closet items sit in three labelled lanes (List for cash / Bundle & discount /
Donate it) inside the hero itself; dragging a card to another lane (or using its "Move to" button)
moves it, not copies it, and a proportional stacked bar plus a derived verdict sentence ("5 of 8
items are set to list for cash -- a projected payout of $510...") recompute from the current lane
assignment on every move, with the identical live sentence quoted again, word for word, in the
closing CTA. Interactions: (1) native drag-and-drop between lanes, (2) its full keyboard/touch
equivalent -- a "Move to &lt;other lane&gt;" button on every card, (3) scroll-triggered reveals across
every section, (4) a "Why this match" disclosure toggle on each product-preview card, (5) a
"Reset sort" control that returns all eight cards to their default lanes. Theme: light (pure
white, zinc-50 drop zones). Accent: green (`#16A34A` large text/fills/borders, `#15803D` small
text/icons/focus ring -- math below). Display face: `--font-display-mono` on headline-scale Latin
text only. Line-length: body paragraphs capped at `max-w-[480px]` at 16px -> 480/(0.44*16) =
68.18 chars, under the ~70 target and the 75 ceiling. Keyboard equivalent: every card's "Move to
&lt;lane&gt;" buttons are real tabbable `&lt;button&gt;` elements (not a fallback -- native HTML5 drag has
no reliable touch path either, so the buttons are the universal way to operate the device on
keyboard AND touch).

## 브리프에 없던 것

1. **Which drag mechanism, and why not framer-motion's own `drag` prop.** The brief suggests
   either `motion.div drag` or "a dnd approach of your choice." I decided against framer-motion's
   physical drag transform for moving cards *between separate parent containers* (one zone's list
   to another's): combining `drag` + `layout` + cross-container re-parenting on drop is a known
   rough edge (the dragged element's x/y transform and the `layout` FLIP animation fight each other
   unless carefully reset, and framer's own cross-list examples lean on `layoutId` + `LayoutGroup`
   to paper over it). Given the hard "no React runtime issues" gate, I chose native HTML5
   `draggable`/`onDragStart`/`onDragOver`/`onDrop` for the pointer mechanic instead -- simple,
   well-understood, zero position math -- and reserved framer-motion for what it's actually good
   at here: scroll reveals and the closing-CTA entrance. This also made the keyboard-equivalent
   design cleaner: native HTML5 DnD has no keyboard path AND no reliable touch-screen path, so the
   per-card "Move to" buttons aren't a secondary fallback bolted on for keyboard users only -- they
   are the one universal mechanism, which resolved the "plan the keyboard path before writing drag
   logic" instruction by making the button set the primary spec, not an afterthought.
2. **Accent hue + contrast computation.** Picked green over this round's banned axis
   (amber/teal/violet/blue/orange/cyan/rose) and over lime, which this catalog's immediately
   preceding landing round (`r53/c`) already used -- green has zero prior catalog uses. Computed
   via sRGB -> linearised channel -> WCAG relative luminance (script-verified, not eyeballed):
   `L(white)=1.0`, `L(#0B0B0F) ink=0.0034`, `L(#16A34A) green-600=0.2686`, `L(#15803D)
   green-700=0.1593`. White text on a green-600 fill = **3.296:1** (fails body AA) vs. dark ink on
   the same fill = **5.961:1** (passes every size) -- green-600 is a *light* accent like this
   catalog's amber/lime precedent, so every fill carries dark ink, never white. green-600 text
   directly on white = **3.296:1** (large-text/non-text 3:1 floor only); green-700 on white =
   **5.016:1** (clears body AA) -- so green-600 is reserved for fills/borders/>=24px display text
   and chart segments, green-700 for every small-text/icon/focus-ring role. One extra finding: a
   green-600 border on a first-draft *green-tinted* drop-zone surface measured only **3.06:1** --
   inside this catalog's own "no just-barely" margin concern -- so I dropped the tint and made the
   zones a neutral zinc-50 instead, which pushed the same border to **3.158:1** and let muted text
   standardise on zinc-600 (**7.73:1** on white, **7.18:1** on the zinc-50 zones) everywhere rather
   than auditing zinc-500-vs-zinc-600 per surface.
3. **Line-length container width, computed, not eyeballed.** Brief gives the constant (0.44em/char
   in Pretendard) and the ~70/75 target but not a literal pixel width, and bans `ch` (which renders
   ~35% wider than the true average in this font). Set every flowing body paragraph to 16px inside
   `max-w-[480px]`: `480 / (0.44 * 16) = 480 / 7.04 = 68.18` characters -- comfortably under the
   ~70 target with headroom to the 75 ceiling, applied uniformly (not per-column) so it holds at
   every breakpoint, including the ungated widths between the mobile and desktop check-points.
4. **Hero vs. Product Preview as separate sections.** `design-principles.md` §Landing-구조-기본형
   has an older, stricter reading ("parallel listing cards and their match/grade/verification/
   discount proof must render inside the hero component, not a sibling section, or they fall below
   the fold"). This task's assembled structure list, which it names as "the actual machine-checked
   rule set," instead enumerates Hero and Product Preview as two distinct, ordered sections, and
   its own hero self-check is scoped to "the device AND its own proof visualization," not to a
   separate rich-card grid. I followed the assembled brief literally: the hero contains the
   sorter + the composition bar + the verdict sentence (all genuinely inside the hero component),
   and a separate Product Preview section below carries the rich match/grade/verified/discount
   cards for four example listings. Reasoning, surfaced honestly: cramming eight sortable cards
   *and* four full image-backed listing cards into one hero risked real mobile overflow and a
   genuinely overloaded first screen; splitting them keeps the hero's own device legible while
   still shipping every badge type the brief asks for, one section down.
5. **Why the composition bar is `aria-hidden` rather than `role="img"`.** A stacked bar whose
   segments carry visible count text is awkward for assistive tech: `role="img"` on the container
   is meant to collapse its children into a single accessible object, but some screen readers still
   expose the children's own text nodes underneath, producing a confusing partial read ("5", "2",
   "1" with no context). I made the bar purely decorative (`aria-hidden="true"`) and put the full,
   always-visible breakdown in a real `<ul>` legend right below it (icon + label + "N of 8" in
   plain text) -- the same information, asserted once, unambiguously, rather than twice in two
   different accessibility representations that could drift apart.
6. **Why `aria-live` is scoped per-stat, not per-section.** The Value-split section's three stat
   lines (`columnStat`) are the only text that changes when a card moves; its heading, icon, and
   description are static. Wrapping the whole three-column grid in one `aria-live="polite"` would
   re-announce all of that static copy on every single drag. I scoped the live region to just the
   `<p>` holding each bucket's live count/payout string, so a screen reader user hears only what
   actually changed.
