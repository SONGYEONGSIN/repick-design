## Concept
A blocked-workflow Account Data Export screen where category selection + an email-delivery confirmation gate a "Request Export" band that drives a drafting → compiling → packaged state machine, auto-retracting to drafting the moment either input changes after submission.

## 브리프에 없던 것

1. ① How many data categories to offer and what they're called → ② Four: Listings, Orders & Transactions, Messages & Offers, Photos & Media, each with a realistic item count and MB size → ③ Arbitrary but grounded in the domain brief's own list ("listings, orders, messages, photos"); split "orders" into "Orders & Transactions" and renamed messages to "Messages & Offers" to match repick's offer-based buyer/seller vocabulary rather than reusing generic names.

2. ① What counts as "confirmed an email destination" when there's no real account-settings backend to edit an address against → ② A checkbox-style confirm row next to the account's existing (masked-free, shown in full) email, framed as "confirm this is where you want the export sent" rather than a free-text input → ③ Arbitrary, chosen to avoid inventing fake text-validation logic; keeps the blocking condition real (boolean confirmed/not) without implying an editable-email flow that isn't being built.

3. ① How to compute the "deterministic (not fake-random) ETA" → ② A fixed throughput constant (60 MB/min, 2 min floor) applied to the sum of selected categories' sizes via `computeEtaMinutes()` in data.ts → ③ Arbitrary formula, but genuinely a function of the input data (selecting more/larger categories changes the shown ETA), satisfying "computed" rather than "picked."

4. ① How to actually advance compiling → packaged without Math.random/Date.now and without a real backend → ② A fixed `PROCESSING_SIMULATION_MS = 3200` constant driving a single `setTimeout`, decoupled from the displayed ETA minutes (which stay a realistic domain number, not literally 3.2ms) → ③ Arbitrary engineering choice: the displayed ETA is domain-accurate, the demo's actual transition timing is a fixed constant so the state machine is observable in review without waiting real minutes.

5. ① What the "real download/share action" in the ready state should do, given there's no file to produce → ② Call RN's built-in `Share.share()` with a message containing the archive filename and a dummy export URL, labeled "Share Download Link" (not "Download") → ③ Chose copy that exactly matches the implemented action (opens the OS share sheet) rather than claiming a download, per the rule against promising an unperformed side effect.

6. ① What the destructive/irreversible action is and how to present it without a native Alert → ② "Cancel Request" (while compiling) / "Discard Export" (while packaged), tapped once to reveal an in-place "Keep …" / "Cancel Export"·"Discard Export" two-button row, with the confirmation question and outcome both announced through the screen's single live region → ③ Directly follows the spec's explicit instruction for destructive actions; invented this screen's own two labels rather than reusing a generic "Confirm/Cancel" pair.

7. ① Where the one `accessibilityLiveRegion="polite"` container should live on screen → ② A persistent status strip directly under the header/subtitle, whose text doubles as the screen's ambient instructions before any action and as the transition announcer after every action (submit, auto-retract, cancel/discard, keep) → ③ Arbitrary placement choice to satisfy "exactly one region, all transitions route through it" without needing a second toast-like element anywhere else on screen.
