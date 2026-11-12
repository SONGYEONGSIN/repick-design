# Candidate a — "Gift This Item"

A buyer sends an item they're buying (or already bought) as a gift: a pinned preview of the item stays visible above a scrolling recipient form (name, email, optional 200-char note) and a 3-way single-select delivery method. A bottom band gates the "Send Gift" action behind form validity — recomputed as one derived boolean every render, never a hand-set flag — and states in one sentence what's still missing until every required field is filled. Sending swaps the form out for a local, honest confirmation ("Your gift is on its way to {name}") rather than faking a navigation anywhere else; a plain inline "Send Another Gift" button resets the form, with no second fixed band since nothing needs gating once the gift is sent.

## Delivery-method choice: contact = email, not phone

Picked **email** as the single required contact field, for two reasons specific to this screen's own delivery options:
- One of the three delivery methods is "send as a digital gift card" — that path is inherently email-delivered, so email is already load-bearing for at least one branch, not an arbitrary pick.
- A single channel avoids introducing phone-number formatting/country-code validation into a static demo where none of that logic can be meaningfully exercised; email also reads naturally as "where we notify them a gift is coming" across all three delivery methods, including the two non-digital ones.

## 브리프에 없던 것 (Brief gaps)

1. ① Whether the bottom band should literally unmount while the form is invalid, or stay mounted-but-disabled with a status sentence.
   ② Kept it always mounted (while the form stage is active) with the sentence changing between "Fill in X, Y, and Z to continue." and "Ready to send.", and only the primary button's enabled state/label is what flips.
   ③ The brief itself supplies both an invalid-state sentence and a valid-state sentence as examples, which only makes sense if the sentence's container persists through both states — an unmounted band couldn't host "Fill in recipient details to continue." This also matches this catalog's established "blocked-workflow state machine" band form (states why you can't proceed in a sentence).

2. ① Whether email format (e.g. requiring an "@") should be validated, since the brief only says "required."
   ② Left it as a plain non-empty check, no format validation.
   ③ The brief's validity gate is explicitly "required fields... are filled," not "...are well-formed" — adding format validation would be scope creep onto a gate the brief didn't ask for, and this is a static demo with no backend to actually verify an address against.

3. ① What happens to the bottom band once the gift is sent — keep it as a permanently-mounted action bar for "Send Another Gift," or drop it entirely.
   ② Dropped it; "Send Another Gift" is an ordinary inline button inside the confirmation panel instead.
   ③ This screen's completed state is a one-shot, read-only outcome (per this catalog's doctrine: a finished-result screen either gets a real always-available action bar or no band at all) — there's no ongoing validity to gate anymore, and a floating bar for a single reset action would be a decoration, not work; it also keeps exactly one live region active at a time (the band's while filling the form, the confirmation panel's after sending — never both).

4. ① Whether the item preview needed to be truly pinned (outside the scroll) or just the first element inside a scrolling list.
   ② Rendered it outside the ScrollView entirely, as a static header alongside the screen heading.
   ③ The brief calls it "a fixed preview... at the top" — the most literal reading is that it never scrolls away, which only a sibling-to-the-scroll element (not a ListHeaderComponent) guarantees.
