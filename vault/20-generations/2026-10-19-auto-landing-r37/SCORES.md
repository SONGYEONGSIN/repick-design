# auto-landing-r37 — SCORES

Freeze hash (`cat app/src/app/landing-evolve/r37/*/*.tsx app/src/app/landing-evolve/r37/*/*.ts | shasum`):
`bbd4f27212e8273516c5714a9381647635d67bf7`

Environment note: this sandbox's `npx lighthouse` initially returned `unavailable` for
both the `a11y` and `perf` gates (silent soft-pass per `page-brief-repo.md` §5 — "Lighthouse
+ Chrome 없으면 unavailable (pass)"). Root-caused and fixed rather than left as a silent pass,
since `a11y` is the single most load-bearing hard gate for web candidates:
1. `chrome-launcher` (Lighthouse's Chrome driver) requires the `CHROME_PATH` env var to point
   at a Chrome/Chromium executable — it does not share Playwright's `PLAYWRIGHT_BROWSERS_PATH`
   resolution. Set `CHROME_PATH=/opt/pw-browsers/chromium` (the same pre-installed binary used
   for Playwright screenshots/sweep).
2. Running as root, Chromium refuses to launch without `--no-sandbox`
   (`zygote_host_impl_linux.cc` error). `gate.mjs`'s `runLighthouse()` already conditionally adds
   `--no-sandbox` to `--chrome-flags` when `process.env.PW_NO_SANDBOX` is set — so exporting
   `PW_NO_SANDBOX=1` (no script change needed) fixes it.
Both exported alongside the existing `PW_CHROMIUM_PATH` (used by the Playwright-based `sweep`/
`focus` gates and ad hoc screenshot capture) before invoking `gate.mjs`. Neither fix touched any
script or candidate code — purely sandbox environment setup, same category as the native-round
fixes (documented in `../2026-10-19-auto-native-r40/SCORES.md`).

## `node scripts/gate.mjs --target web --routes /landing-evolve/r37/<v>` (one candidate at a time)

All candidates passed cleanly on the first attempt — zero 1-fix loops, zero candidates dropped.

| candidate | route · types · static · lint · weights · sweep · focus · console | a11y | perf |
|---|---|---|---|
| a — Instant Estimate | all ✅ | 100 (bf-cache only, not a promoted hard-fail audit) | 61 (record only) |
| b — The Verification Walk | all ✅ | 100 (bf-cache only) | 63 (record only) |
| c — Spot the Proof | all ✅ | 98 (bf-cache + landmark-one-main, neither a promoted hard-fail audit) | 59 (record only) |

`verdict.violations`: `[]` for all three.
