# Candidate c — Return Shipping Label Generator

Concept: a buyer-side three-step wizard (reason → address confirm → generated label) with a fixed "Step X of 3" indicator and progress dots that stay visible while only the current step's pane renders, gated by a Back/Continue band that explains in plain text why Continue is still disabled.

## Brief gaps

1. **Decision:** How to render the mock barcode's 2-D grid of squares (16×5 fixed cells) without treating it as a "list" subject to the FlatList-not-.map() idiom rule.
   **Decided:** Precompute the grid as a deterministic `boolean[][]` in `data.ts` (pure function of the fixed tracking number, no randomness), and render it in the component via nested `.map()` calls over that fixed, non-interactive visual grid, wrapped with `accessibilityElementsHidden` + `importantForAccessibility="no-hide-descendants"` so screen readers skip the decoration and rely on the adjacent accessible tracking-number text instead.
   **Why:** The idiom rule targets scrollable collections of interactive/record items (where FlatList's virtualization and keyExtractor matter); a fixed-size decorative pixel-pattern standing in for a barcode graphic isn't that, and forcing it through FlatList would produce an absurd nested-scrollable-grid rather than a believable barcode visual. The carrier-instructions list and the reason-picker list, which ARE genuine item collections, both use real FlatLists per the idiom rule.

2. **Decision:** Whether the main `accessibilityRole="header"` title should change per step (brief anticipates this is possible) or stay constant.
   **Decided:** Kept it constant — "Return Shipping Label" — for all three steps, and used a separate (non-header-role) "Step X of 3: <step name>" caption for per-step orientation.
   **Why:** Keeps exactly one header-role element on the screen at all times (avoids ambiguity about which text is "the" header for assistive tech and for validation), while still giving per-step context through the caption and the band's status text.

3. **Decision:** How to pair the brief's two distinct accessibility requirements — (a) a persistent band explanation of why Continue is blocked, and (b) a single self-clearing live-region+alert for transition moments — without creating two live regions or letting the persistent text wrongly disappear after 4s.
   **Decided:** Split them structurally: the band's status line is a plain, non-alert `Text` that always reflects current state (blocked or ready) and never clears itself; a separate, single `accessibilityLiveRegion="polite"` container above the band holds the transient `accessibilityRole="alert"` announcement text, which a single shared `announce()` timer clears after ~4.2s. The transient announcer fires on step changes and on in-step blocked↔possible flips (reason selected/cleared, address confirmed/unconfirmed) but is suppressed during the same render a step change already announces itself, so the two mechanisms never double-fire.
   **Why:** Treating the persistent explanation and the transient announcement as the same text would force a choice between a band that goes blank every 4s (bad UX) or an alert that never clears (stuck-on violation) — splitting them satisfies both rules at once while keeping exactly one live region on screen.

CHECK_STRING: Return Shipping Label
