# r47/c — Points Redemption Catalog

A persistent points-balance bar sits above a virtualized FlatList of redeemable rewards (shipping credit, listing boosts, store-credit vouchers); each row's "Redeem" flips in place into a Cancel/Confirm pair before it spends points, and the balance bar visibly drops by the exact cost the instant a redemption is confirmed.

## 브리프에 없던 것

1. ① Starting points balance ② 2,480 pts ③ Arbitrary, but chosen deliberately so it's below the catalog's single most expensive reward (the $30 voucher at 4,000 pts), so the "genuinely disabled, can't afford" branch is exercised on first load without any contrived math, while still affording most of the catalog. No source brief value existed for this.

2. ① Exact reward catalog (titles, descriptions, categories, count) ② Eight rewards across three categories — shipping credit ($5/$10), listing boost (24h/72h/7-day), store-credit voucher ($5/$15/$30) ③ Brief named the three categories as examples but not concrete SKUs/costs; I picked three tiers per category so sorting-by-affordability and the disabled-state branch would both have real examples, loosely mirroring how repick's existing reward-ish screens (referral credits, shipping flows) talk about dollar amounts.

3. ① Exact point costs per reward ② 300–4000 pts, roughly scaling with the named dollar/duration value (e.g. $5 shipping = 400 pts, 7-day boost = 1500 pts) ③ Arbitrary but internally consistent — chosen so costs span both sides of the 2,480 starting balance.

4. ① Whether a reward can be redeemed more than once ② Yes — rewards are repeatable (redeeming doesn't remove or disable the row permanently, only the brief acknowledgement timer gates re-entry) ③ Brief didn't specify; a resale marketplace loyalty catalog realistically lets you keep trading points for shipping credit/boosts repeatedly as you keep earning, unlike a one-time-redeemable gift code, so repeatable felt like the correct domain default. This also makes the "balance updates live, verifiable before/after" doctrine requirement trivially demonstrable by tapping the same row twice.

5. ① Acknowledgement/auto-revert timing for the "done" row state ② Fixed 1400ms (`REDEEM_ACK_MS`) ③ Arbitrary deterministic constant, same idiom as the reviewed `ActiveSessionsScreen.tsx`'s `SIGN_OUT_ACK_MS` (used only as a timing-convention reference, not copied structurally — variable names/state shape are fresh for this screen).

6. ① Exact confirm/redeemed copy wording ("This spends your points and can't be undone." / "Redeemed X for Y points. Your balance is now Z points.") ② As written in RewardRow.tsx ③ Arbitrary phrasing invented to satisfy the irreversible-spend framing from the assignment and to fold the balance-change announcement into the same live-region sentence as the row-state announcement (so only one live region is ever active, per the hard constraint).

7. ① Whether the ambient balance bar needed its own separate live-region announcement for balance changes ② Decided no — the balance change is announced via the row's "done" sentence instead, which states the new balance ③ The brief's own hint ("this repo's established pattern for guaranteeing [a single live sentence] is a single shared (activeRowId, phase)-style state") read as explicitly steering toward folding both concerns into one sentence rather than running two live regions; I treated that as the intended reading rather than inventing a second regionless mechanism.

8. ① Category tag copy/order on each row ("Shipping credit", "Listing boost", "Store credit voucher") and catalog ordering (interleaved by category rather than grouped) ② As implemented in data.ts ③ Arbitrary — interleaving was chosen so the FlatList visibly mixes categories rather than reading as three separate static blocks, reinforcing that it's one virtualized list, not three.
