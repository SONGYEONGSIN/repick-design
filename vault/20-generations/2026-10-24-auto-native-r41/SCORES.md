# auto-native-r41 — SCORES

Freeze hash (all 3 candidates): `05de51ab38be663be2db5c454a454816140f5b9f`
(computed via `cat native/src/evolve/r41/*/*.tsx native/src/evolve/r41/*/*.ts | shasum`)

Registration: added to `native/src/screens.ts` (imports + `COMPONENTS["evolve-r41-<v>"]`) and `native/screens.json` (`check` strings) by the orchestrator after all 3 designer subagents completed, to avoid 3 parallel agents editing the same shared files. `evolve-r41-a` → `GiftThisItemScreen` (named export), `evolve-r41-b` → `ProtectionPlanPickerScreen` (default export), `evolve-r41-c` → `NotificationPreferencesScreen` (named export).

## Hard gate — 12/12 clean on the first attempt, zero 1-fix loops, zero candidates dropped

`node scripts/gate.mjs --target native --screens evolve-r41-a evolve-r41-b evolve-r41-c` (env: `CHROME_PATH`/`PW_CHROMIUM_PATH=/opt/pw-browsers/chromium`, `PW_NO_SANDBOX=1`):

| screen | tsc | export | render | iframe |
|---|---|---|---|---|
| evolve-r41-a (Gift This Item) | ✅ | ✅ | ✅ | ✅ |
| evolve-r41-b (Protection Plan Picker) | ✅ | ✅ | ✅ | ✅ |
| evolve-r41-c (Notification Preferences) | ✅ | ✅ | ✅ | ✅ |

`pass: true`, `violations: []`. The shared global `tsc` pass (all 3 candidates compiled together, per this repo's native gate architecture) found no cross-candidate breakage.

## Screenshots

Expo Web export per screen (`EXPO_PUBLIC_SCREEN=evolve-r41-<v> npx expo export --platform web`), served and captured at 390×844 and 768×844 via Playwright (`PW_CHROMIUM_PATH` env override — see environment notes below):
- `shots/a-390.png`, `shots/a-768.png`
- `shots/b-390.png`, `shots/b-768.png`
- `shots/c-390.png`, `shots/c-768.png`

No blank-frame check script exists for native (unlike the web `capture-shots.mjs`'s pixel-sampling blank detector) — file sizes (54–79KB each, all non-trivial) spot-checked as a proxy; all 6 are real, non-trivial PNGs.

## Environment notes
- `native/` had never had `npm install` run in this session/container — ran it fresh (503 packages) before anything else.
- Lighthouse is not part of the native gate path (native uses the 4-gate tsc/export/render/iframe pipeline, no Chrome a11y audit) — no `CHROME_PATH` dependency for the gate itself, only for the Playwright-driven screenshot capture (`PW_CHROMIUM_PATH`), using the same pre-installed-browser symlink workaround set up earlier this session (pinned revision 1228 symlinked to the pre-installed 1243 build).
- `npx expo export` attempts a `cdp.expo.dev` telemetry/dev-tools connection that this sandbox's egress proxy refuses (`connect_rejected`) — this is non-fatal background telemetry, not a build error; the export itself completes successfully and writes a valid `dist/` (confirmed: "Exported: dist" + working `index.html`/bundle every time).
- Avoided `pkill` between candidates after it unexpectedly produced an anomalous shell exit code in this sandbox (code 144) that aborted the orchestrating script — worked around by exporting each candidate to its own `dist-b`/`dist-c` output directory and serving each on a distinct port (8091/8092/8093) instead of reusing one port+directory with a kill-and-restart cycle between candidates. The temporary `dist`/`dist-b`/`dist-c` directories were deleted after screenshot capture (only `dist/` is covered by `native/.gitignore`; `dist-b`/`dist-c` were untracked and removed manually before committing).
