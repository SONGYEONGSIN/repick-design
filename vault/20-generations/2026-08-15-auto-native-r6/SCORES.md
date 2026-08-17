# auto-native-r6 — SCORES

Target: `native` (round selected by base-3 random draw excluding `dash`, already generated as round 1 of this run — see round-1 SCORES.md/DECISION.md for the exclusion rule). Round number 6 = max prior native round (5) + 1.

Frozen-state SHA-1 (concatenated `.tsx`+`.ts` in each candidate's own folder):

| Candidate | SHA-1 |
|---|---|
| a (Payouts) | `046677ce5c245c7b2376162c5c8cee1b28248478` |
| b (Discover Listings) | `19b2bacb9417aab7e3eb3330cd8ef2388179d776` |
| c (Seller verification) | `c1120360ee42ab2dfd4d2579223fcb598985f445` |

## Hard gate — `node scripts/gate.mjs --target native --screens evolve-r6-a evolve-r6-b evolve-r6-c`

Env: `PW_CHROMIUM_PATH=/opt/pw-browsers/chromium` (native's `validate.sh`/`iframe-check.mjs` launch chromium without an explicit `--no-sandbox` arg, and this worked cleanly in this sandbox — unlike the web `sweep`/`capture-shots` scripts, `PW_NO_SANDBOX`/`CHROME_PATH` were not needed here).

| Screen | tsc | export | render | iframe |
|---|---|---|---|---|
| evolve-r6-a (Payouts) | pass | pass | pass | pass |
| evolve-r6-b (Discover Listings) | pass | pass | pass | pass |
| evolve-r6-c (Seller verification) | pass | pass | pass | pass |

All 12 gate steps pass on first attempt — no 1-fix loop needed this round. (Each candidate also self-validated via `native/scripts/validate.sh` during generation; occasional retries there were due to shared `dist/`/port-8091 races between the 3 parallel candidates, not code defects — resolved by retrying after the port freed.)

## 후보 요약 (screen-type assignment, pre-decided to avoid collision with the 9 existing screens: watchlist/match/detail/offer-thread/account/handoff/notifications/listing/order-status)
- **a — Payouts**: seller earnings/payout ledger. Sticky top balance strip (no bottom band — genuinely no terminal/blocking action) + scrolling `FlatList` of transactions. 4 real interactions: period filter, pull-to-refresh (live-region announced), tap-to-expand transaction detail, "Request payout" action that debits the live balance to ₩0 and disables with an announced state change.
- **b — Discover Listings**: marketplace browse/search surface (distinct from `watchlist`'s saved-items list). Sticky search+filter-chip header (justified as "does real work every frame," unlike decorative fixed chrome) + `FlatList numColumns=2` grid of 12 listings. 5 real interactions: live search, 3 filter-chip groups (non-color selected-state), tap-to-expand quick preview, pull-to-refresh, empty-state "clear filters" fallback.
- **c — Seller verification**: 4-step KYC/onboarding flow with a real terminal action (final submission). Implements the r3/r5-promoted state-machine bottom band (`accessibilityRole="alert"` + `accessibilityLiveRegion="polite"`, names the exact blocking step in words, tap-to-jump via `scrollToIndex`) — the one screen type in this round the r3/r5 deltas directly apply to.

## 다양성/중복 회피
3개 화면 타입 모두 기존 9종(watchlist/match/detail/offer-thread/account/handoff/notifications/listing/order-status)과 구조적으로 상이 — 신규 도입 확인(payouts=재무 원장, discover=범용 브라우즈/검색, verification=상태기계 종결액션형). accent/theme/typeface는 native DNA가 `tokens.ts` 단일 고정값(순백/indigo-600/시스템 폰트)이라 웹 dash처럼 라운드별 배정 불필요 — 전 후보 동일 토큰만 사용 확인(그레핑 완료, 하드코딩 hex 0건).
