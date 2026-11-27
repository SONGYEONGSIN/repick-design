# r52 / a — Flash Drop Raffle Entry

A time-boxed raffle entry screen for one scarce limited-drop item: before a fixed entry deadline the
user can tap once to put their name in the drawing; at the deadline entry closes outright with the band
explaining why (no silent disable); once results are posted (a fixed, deterministic outcome) the band
becomes a terminal state — a working "Claim Your Item" action on a win, or a no-op, honestly-hinted
"Browse Similar Items" affordance on a loss.

## 브리프에 없던 것

1. **Which of "won" / "lost" to actually bake into the fixed dummy data**
   ① Decision: `RAFFLE_OUTCOME = "lost"` in `data.ts`.
   ② Why: the brief calls out a specific, narrow a11y rule only on the lost path — a no-op Pressable
   that must carry no `accessibilityHint` promising navigation. Picking "lost" means that exact rule is
   the one actually rendered and reviewable on screen, not just present as unreached code. The "won" /
   claim branch is still fully implemented in `describeRaffleBand` (so the logic is complete either way),
   it's simply the one that would need `RAFFLE_OUTCOME` flipped to be the on-screen default.

2. **Whether the entry deadline + results reveal should tick on a compressed "demo" timescale or a
   realistic one**
   ① Decision: realistic business scale — entries close 3h 42m 18s after the fixed epoch, results post
   ~22h 15m after that (next-day style), matching `LiveAuctionScreen`'s existing convention of a multi-
   hour fixed countdown rather than a few compressed seconds.
   ② Why: `native/src/auction/LiveAuctionScreen.tsx` already establishes "tick a local counter, derive
   phase by comparing it to fixed multi-hour ms constants" as this codebase's sanctioned determinism
   idiom for a wall-clock gate. Matching its timescale keeps the screen honest about what a real flash
   drop feels like, and the three phases (open/closed/resultsPosted) are still fully exercised by reading
   `getRafflePhase`/`describeRaffleBand` directly — nothing about correctness depends on the review
   session living long enough to watch the clock run out in real time.

3. **Whether to let the user "leave" the raffle after entering but before the deadline**
   ① Decision: no withdraw/leave action exists. Once entered, the only thing shown is a static "✓
   Entered" status chip (not a disabled button) until the clock moves the phase along.
   ② Why: the brief only requires an entry action and two terminal actions; adding a withdraw step would
   have pulled in the destructive-confirmation band form (Cancel/Confirm flip) for an action that isn't
   actually destructive here (entering a free raffle has no money or binding weight, unlike Auction's
   bid or a real withdraw). Keeping scope to exactly what's asked avoids manufacturing a confirmation
   flow the mechanic doesn't need, and keeps the "no two reasons a band exists" line clean.

4. **How to shape state so a clock boundary and an externally-posted outcome don't get conflated**
   ① Decision: the clock side (`RafflePhase`) is a pure, derived value — `getRafflePhase(elapsedMs)` —
   while "did the user enter" and "has a win been claimed" are separate `useState` fields that no tick of
   the clock can ever change on their own.
   ② Why: contrasted directly against `ItemSwapProposalScreen`'s single hand-written `SwapPhase` enum,
   which was the right fit *there* because that screen has exactly one external unblock event (the
   counterpart's reply). This screen has two independent external events — the deadline and the results
   post — from two different sources (a timer vs. a platform decision), so folding everything into one
   enum would hide that "entries closed" and "results are in" are not the same fact. Four small
   orthogonal pieces of state map onto four independent triggers; one combined enum would not.

5. **What a FlatList-worthy "growable list" looks like on a screen with only one item**
   ① Decision: added a short "Drop details" facts list (entry fee, winners drawn, entrants so far,
   retail value, delivery) rendered via `FlatList` + a dedicated `DropFactRow` component, rather than a
   list of raffle entrants (which this screen never needs to show).
   ② Why: the brief requires `FlatList` for "anything that could grow," and a single-item raffle screen
   has no natural entrant list to show the viewer — but a drop's fact sheet is exactly the kind of row
   set a real product would keep adding to over time (shipping terms, restrictions, etc.), so it's the
   legitimate growable list for this domain rather than a decorative pretext to use `FlatList`.

6. **Whether the band disappears once the win is actually claimed (nothing left to gate)**
   ① Decision: kept the band visible with a plain confirmation sentence ("Checkout started. We've
   reserved …") and no button, rather than removing the band entirely.
   ② Why: the brief explicitly allows "no band at all" when there's nothing to gate, but a screen that
   simply goes blank the instant an action resolves reads as an unannounced drop of context. Since the
   same single `accessibilityLiveRegion="polite"` container was already carrying every prior transition's
   sentence, letting it carry the final confirmation too is a smaller surface change than removing the
   whole band for one terminal frame.
