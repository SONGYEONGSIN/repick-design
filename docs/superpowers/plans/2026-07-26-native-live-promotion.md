# Native Live Promotion (①) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the gallery's static-PNG native work with **live Expo-web renders** of the three real native screens (watchlist / match / detail), Englishized, embedded as mobile iframes.

**Architecture:** Englishize the RN screens → make `App.tsx` pick the screen from a runtime `?screen=` query → export Expo web to a subpath-served static bundle committed at `app/public/native-app/` (baseUrl gated by env so the native evolve-gate is unaffected) → point three `NATIVE_WORKS` at `/native-app/?screen=<slug>` and render them as mobile iframes. No production runtime Expo dependency (the bundle is static).

**Tech Stack:** Expo ~57 / React Native 0.86 / react-native-web 0.21 (static web export), Next.js 16 (serves the static bundle + iframes it), TypeScript.

## Global Constraints

- **Native screens Englishized** (rendered UI + code comments) same rules as the web ②: translate language only; preserve logic, design, `tokens.ts` hex values, layout, numeric data; no `Date.now()`/`Math.random()`/`new Date()`.
- **`screens.json` `check` strings must be an English substring that actually renders** in the corresponding screen (the native gate greps for it).
- **`baseUrl` is env-gated** via `native/app.config.js` (`EXPO_PUBLIC_BASE_URL`) — NOT hardcoded in `app.json` (the `gate.mjs --target native` evolve-loop export must stay baseUrl-free).
- **The Expo web bundle is a committed static artifact** at `app/public/native-app/` (index.html + `_expo/`). Rebuild via `native/scripts/build-gallery-web.sh` when native screens change. `react-native-svg` (declared in `native/package.json`) must be installed before export (`npx expo install`).
- **Verification:** `cd app && npx next build`; rendered-Korean check by curling routes and grepping `[가-힣]`; `node --test "scripts/**/*.test.mjs"` stays green. This repo has no React/RN component unit-test harness — do not add one.
- **Subset gate:** removing the old `n1` spec drops `SUBSET_IDS` to **14** (the web works); the native works render "coming soon" detail.
- Surgical: touch only the files each task names. Conventional commits (English prefix, Korean body OK).

---

### Task 1: Englishize the native screens + screens.json

Translate the three real native screens (and their charts/data) from Korean to English, and update the gate `check` strings to match.

**Files:**
- Modify: `native/src/watchlist/WatchList.tsx`, `native/src/watchlist/data.ts`, `native/src/detail/PriceDetail.tsx`, `native/src/detail/data.ts`, `native/src/MatchList.tsx`, `native/src/data.ts`, `native/src/charts/Sparkline.tsx`, `native/src/charts/LineChart.tsx`, `native/src/charts/BarBreakdown.tsx`, `native/src/tokens.ts` (comments only), `native/src/screens.ts` (comments only if any)
- Modify: `native/screens.json`

**Interfaces:**
- Produces: three screens whose rendered text is English; `screens.json` `check` strings that are English substrings present in each screen's render.

- [ ] **Step 1: Translate all Korean UI + comments to English**

For each file above, replace every Korean string (rendered `<Text>` content, labels, accessibility strings, and `//`/`/* */` comments) with natural English. Keep `tokens.ts` hex values, all numbers, StyleSheet, and component structure identical — language only. Read each file, grep it for `[가-힣]`, translate, re-grep until zero.

- [ ] **Step 2: Update screens.json check strings to a real rendered English substring**

Replace `native/screens.json` with check strings that each appear verbatim in the corresponding screen's English render (pick a stable heading/label you translated in Step 1). Example shape (adjust each `check` to a string you actually rendered):
```json
{
  "watchlist": { "check": "Watchlist" },
  "match": { "check": "AI Match" },
  "detail": { "check": "Price history" }
}
```
For each screen, confirm the check string exists in its component: `grep -F "Watchlist" native/src/watchlist/WatchList.tsx` etc. — each must return a hit.

- [ ] **Step 3: Verify zero Korean remains in native/src**

Run: `grep -rnP '[가-힣]' native/src native/screens.json`
Expected: no output (zero Korean).

- [ ] **Step 4: Commit**

```bash
git add native/src native/screens.json
git commit -m "feat(native): 3화면(watchlist·match·detail) UI+주석 영문화 + screens.json check 영문"
```

---

### Task 2: Runtime `?screen=` selection + env-gated baseUrl

Make `App.tsx` pick the screen from the URL at runtime (so one static bundle serves all three), and add an env-gated `baseUrl` so the gallery export can be subpath-served without affecting the native gate.

**Files:**
- Modify: `native/App.tsx`
- Create: `native/app.config.js`

**Interfaces:**
- Consumes: `resolveScreen(slug?)` from `native/src/screens.ts` (unchanged — already falls back to `DEFAULT_SCREEN` for unknown/missing slugs).
- Produces: web bundle that reads `?screen=<slug>` at runtime; `baseUrl` = `EXPO_PUBLIC_BASE_URL` when set.

- [ ] **Step 1: Make App.tsx read `?screen=` at runtime**

Replace `native/App.tsx` with:
```tsx
import { SafeAreaView, StyleSheet } from "react-native";
import { resolveScreen } from "./src/screens";

// Web: pick the screen from the ?screen= query at runtime so one static export serves every screen.
// Native/build-time: fall back to EXPO_PUBLIC_SCREEN (used by the evolve gate).
function currentSlug(): string | undefined {
  if (typeof window !== "undefined" && window.location) {
    return new URLSearchParams(window.location.search).get("screen") ?? undefined;
  }
  return process.env.EXPO_PUBLIC_SCREEN;
}

export default function App() {
  const Screen = resolveScreen(currentSlug());
  return (
    <SafeAreaView style={styles.safe}>
      <Screen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#ffffff" },
});
```

- [ ] **Step 2: Add env-gated baseUrl via app.config.js**

Create `native/app.config.js`:
```js
// Extends app.json. baseUrl is only applied when EXPO_PUBLIC_BASE_URL is set (the gallery build),
// so the native evolve-gate export (no env) stays at the root and is unaffected.
module.exports = ({ config }) => ({
  ...config,
  experiments: {
    ...(config.experiments || {}),
    baseUrl: process.env.EXPO_PUBLIC_BASE_URL || undefined,
  },
});
```

- [ ] **Step 3: Verify export works both with and without baseUrl**

Run (no env — gate path, assets root-relative):
`cd native && npx expo install react-native-svg >/dev/null 2>&1; rm -rf /tmp/nwe0 && npx expo export --platform web --output-dir /tmp/nwe0 --clear >/tmp/nwe0.log 2>&1; echo exit=$?; grep -oE 'src="[^"]*_expo[^"]*"' /tmp/nwe0/index.html | head -1`
Expected: exit=0; asset src starts with `/_expo/...` (no `/native-app/`).

Run (with env — gallery path):
`cd native && rm -rf /tmp/nwe1 && EXPO_PUBLIC_BASE_URL=/native-app npx expo export --platform web --output-dir /tmp/nwe1 --clear >/tmp/nwe1.log 2>&1; echo exit=$?; grep -oE 'src="/native-app/_expo[^"]*"' /tmp/nwe1/index.html | head -1`
Expected: exit=0; asset src starts with `/native-app/_expo/...`.

- [ ] **Step 4: Commit**

```bash
git add native/App.tsx native/app.config.js
git commit -m "feat(native): 런타임 ?screen= 화면선택 + app.config.js env 게이트 baseUrl"
```

---

### Task 3: Build + commit the Expo web bundle at app/public/native-app/

Add a build script and produce the committed static bundle the gallery iframes.

**Files:**
- Create: `native/scripts/build-gallery-web.sh`
- Create (generated, committed): `app/public/native-app/**` (index.html + `_expo/` + metadata.json + favicon.ico)

**Interfaces:**
- Consumes: `native/app.config.js` (baseUrl env) + the Englishized screens (Task 1) + runtime `?screen=` (Task 2).
- Produces: `/native-app/?screen=<slug>` served as static files by Next from `app/public/`.

- [ ] **Step 1: Create the build script**

Create `native/scripts/build-gallery-web.sh`:
```bash
#!/usr/bin/env bash
# Build the Expo web bundle for the Specimen gallery and write it to app/public/native-app/.
# Re-run this whenever the native screens change, then commit app/public/native-app/.
set -euo pipefail
cd "$(dirname "$0")/.."          # native/
npx expo install react-native-svg >/dev/null 2>&1 || true
EXPO_PUBLIC_BASE_URL=/native-app npx expo export --platform web \
  --output-dir ../app/public/native-app --clear
echo "built -> app/public/native-app"
```
Then: `chmod +x native/scripts/build-gallery-web.sh`.

- [ ] **Step 2: Confirm app/public/native-app is NOT gitignored**

Run: `cd /Users/yss/개발/build/repick-design && git check-ignore app/public/native-app/index.html; echo "ignored?=$?"`
Expected: `ignored?=1` (NOT ignored). If it prints a path with `ignored?=0`, the bundle is being ignored — inspect `app/.gitignore` / root `.gitignore` and add a negation `!public/native-app/` so the bundle is committed. (Only act if it is actually ignored.)

- [ ] **Step 3: Build the bundle**

Run: `bash native/scripts/build-gallery-web.sh`
Expected: prints `built -> app/public/native-app`; `app/public/native-app/index.html` exists and `app/public/native-app/_expo/` is populated.

- [ ] **Step 4: Verify subpath serving + English render**

Run: `cd app && (npx next start -p 3100 &) ; sleep 5 ; for s in watchlist match detail; do echo -n "$s: "; curl -s -o /dev/null -w "html=%{http_code} " "localhost:3100/native-app/?screen=$s"; done ; echo ; echo -n "asset: "; A=$(grep -oE '/native-app/_expo[^"]*\.js' public/native-app/index.html | head -1); curl -s -o /dev/null -w "%{http_code}\n" "localhost:3100$A" ; echo -n "korean in html: "; curl -s "localhost:3100/native-app/?screen=watchlist" | grep -oP '[가-힣]' | wc -l ; kill %1 2>/dev/null`
Expected: `html=200` for all three screens; asset `200`; korean count `0`. (The RN screen renders client-side; the initial HTML shell + JS bundle should contain no Korean since the screens are Englishized.)

- [ ] **Step 5: Commit**

```bash
git add native/scripts/build-gallery-web.sh app/public/native-app
git commit -m "feat(native): Expo web 정적 번들 빌드 스크립트 + app/public/native-app/ 커밋"
```

---

### Task 4: Gallery integration — 3 live native works, mobile iframe, cleanup

Point `NATIVE_WORKS` at the live bundle, render native works as mobile iframes, remove the now-unused `Work.image`, drop the old `n1` spec (subset → 14), and delete the orphaned PNG.

**Files:**
- Modify: `app/src/lib/works.ts` (NATIVE_WORKS, remove `image` field from `Work`)
- Modify: `app/src/app/gallery/work-card.tsx` (mobile-iframe branch)
- Modify: `app/src/app/gallery/[id]/detail-client.tsx` (HeroPreview mobile-iframe branch)
- Modify: `app/src/lib/specimen-specs.data.json` (remove `n1`)
- Modify: `scripts/specimen-spec-schema.mjs` (SUBSET_IDS drop `n1`)
- Delete: `app/public/native/notification-center.png`

**Interfaces:**
- Consumes: `/native-app/?screen=<slug>` (Task 3); `category === "mobile"` (existing).
- Produces: `NATIVE_WORKS` of 3 works with `category:"mobile"`, no `image`; WorkCard/HeroPreview branch on `category === "mobile"`.

- [ ] **Step 1: Replace NATIVE_WORKS + remove the image field**

In `app/src/lib/works.ts`, replace the entire `NATIVE_WORKS` array with:
```ts
export const NATIVE_WORKS: Work[] = [
  { id: "n1", route: "/native-app/?screen=watchlist", brand: "Watchlist", desc: { en: "Saved-item watchlist · price-drop alerts and a single accent for unread, as a native mobile screen.", ko: "관심목록 · 가격 하락 알림 · 미읽음 단일 액센트 (네이티브 모바일 화면)" }, target: "native", category: "mobile", previewH: 520 },
  { id: "n2", route: "/native-app/?screen=match", brand: "AI Match", desc: { en: "AI-match results feed · ranked secondhand picks with match scores, native mobile.", ko: "AI 매칭 결과 피드 · 매칭 점수순 중고 추천 (네이티브 모바일)" }, target: "native", category: "mobile", previewH: 520 },
  { id: "n3", route: "/native-app/?screen=detail", brand: "Price Detail", desc: { en: "Product price-history detail · chart + spec breakdown on a native mobile screen.", ko: "상품 가격 히스토리 상세 · 차트 + 스펙 분해 (네이티브 모바일)" }, target: "native", category: "mobile", previewH: 520 },
];
```
Then in the `Work` type, delete the line:
```ts
  image?: string; // static screenshot path (for native, etc. image-preview works). If set, WorkCard renders an <img> instead of an iframe
```

- [ ] **Step 2: WorkCard — mobile-iframe branch (replace the image branch)**

In `app/src/app/gallery/work-card.tsx`, replace the preview block (the `{work.image ? (<img .../>) : (<iframe .../>)}` conditional, lines ~16–23) with:
```tsx
        {work.category === "mobile" ? (
          <iframe src={work.route} loading="lazy" title={`${work.brand} preview`} tabIndex={-1}
            onLoad={() => setLoaded(true)}
            className={`pointer-events-none absolute left-1/2 top-0 origin-top transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
            style={{ width: "390px", height: "844px", transform: `translateX(-50%) scale(${h / 844})`, border: 0 }} />
        ) : (
          <iframe src={work.route} loading="lazy" title={`${work.brand} preview`} tabIndex={-1} scrolling="no" onLoad={() => setLoaded(true)}
            className={`pointer-events-none absolute left-0 top-0 origin-top-left transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
            style={{ width: "1440px", height: "1100px", transform: "scale(0.34)", border: 0 }} />
        )}
```
(`h` is the existing `const h = work.previewH ?? 300;`. Mobile: a 390×844 phone scaled to fill the card height `h`, centered horizontally. Web branch: byte-identical to the current iframe branch.)

- [ ] **Step 3: HeroPreview — mobile-iframe branch (detail page)**

In `app/src/app/gallery/[id]/detail-client.tsx`, the `HeroPreview` component currently branches on `work.image`. Replace its `{work.image ? (<img .../>) : (<iframe .../>)}` with a `category`-based branch:
```tsx
      {work.category === "mobile" ? (
        <iframe src={work.route} title={`${work.brand} preview`} tabIndex={-1} onLoad={() => setLoaded(true)}
          className={`pointer-events-none absolute left-1/2 top-1/2 origin-center transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
          style={{ width: "390px", height: "844px", transform: "translate(-50%, -50%) scale(0.55)", border: 0 }} />
      ) : (
        <iframe src={work.route} title={`${work.brand} preview`} tabIndex={-1} scrolling="no" onLoad={() => setLoaded(true)}
          className={`pointer-events-none absolute left-0 top-0 origin-top-left transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
          style={{ width: "1440px", height: "2028px", transform: "scale(0.711)", border: 0 }} />
      )}
```
(Removes the `<img>` path entirely. The web iframe branch keeps the existing values. Confirm `HeroPreview` no longer references `work.image`.)

- [ ] **Step 4: Remove the old n1 spec + drop it from the subset**

In `app/src/lib/specimen-specs.data.json`, delete the entire `"n1": { ... }` entry (the notification-center spec — it describes a screen no longer shown). Keep the other 14 entries.
In `scripts/specimen-spec-schema.mjs`, change `SUBSET_IDS` to drop `"n1"`:
```js
export const SUBSET_IDS = ["d29", "d30", "d31", "d32", "d33", "d34", "d35", "d36", "d37", "d38", "v0", "v6", "v7", "v8"];
```

- [ ] **Step 5: Delete the orphaned PNG**

Run: `git rm app/public/native/notification-center.png`

- [ ] **Step 6: Verify build + subset gate + native cards**

Run: `node --test scripts/specimen-subset-complete.test.mjs` → PASS (14 subset, no strays, no n1).
Run: `cd app && npx next build` → succeeds (no `Work.image` type errors — grep confirms only work-card/detail-client used it, both updated).
Run: `cd app && (npx next start -p 3100 &) ; sleep 5 ; echo -n "native cards iframe src: "; curl -s localhost:3100/gallery | grep -oE 'src="/native-app/\?screen=[a-z]+"' | sort -u | tr '\n' ' ' ; echo ; echo -n "/gallery/n1 detail: "; curl -s -o /dev/null -w "%{http_code}\n" localhost:3100/gallery/n1 ; kill %1 2>/dev/null`
Expected: three `/native-app/?screen=watchlist|match|detail` iframe srcs on /gallery; `/gallery/n1` → 200 (coming-soon detail with live hero).

- [ ] **Step 7: Commit**

```bash
git add app/src/lib/works.ts app/src/app/gallery/work-card.tsx app/src/app/gallery/\[id\]/detail-client.tsx app/src/lib/specimen-specs.data.json scripts/specimen-spec-schema.mjs
git commit -m "feat(gallery): 네이티브 3작품 라이브 iframe 통합 — NATIVE_WORKS·모바일 iframe·Work.image 제거·n1 스펙 정리(subset 14)"
```

---

## Self-Review

**1. Spec coverage:**
- §3 native englishization + screens.json → Task 1. ✅
- §4 runtime `?screen=` → Task 2 Step 1. ✅
- §5 app.config.js baseUrl env + build script + committed bundle → Task 2 Step 2 + Task 3. ✅
- §6 NATIVE_WORKS 3 works / WorkCard mobile iframe / detail mobile iframe / remove Work.image / specimen-specs n1 + SUBSET 14 / delete PNG → Task 4. ✅
- §7 verification (english render, subpath serving, subset gate, web regression, native gate) → per-task steps + final review. The `gate.mjs --target native` re-run is covered by Task 1's screens.json check-substring verification + noted for the final review (it's slow; the substring check is the deterministic proxy).

**2. Placeholder scan:** Task 1 does not inline the translated strings (that's the deliverable — the implementer reads + translates each file, same as the ② workflow), but it names every file, the exact grep gate (`[가-힣]`=0), and the screens.json check-substring requirement. Task 4's `desc` values are concrete. No `TBD`/vague directives; every code/config step shows the exact content.

**3. Type consistency:** `Work.category === "mobile"` used identically in WorkCard (Task 4 Step 2) and HeroPreview (Task 4 Step 3), and matches the `category` union already in `Work` (includes `"mobile"`). `NATIVE_WORKS` entries use only fields still on `Work` after removing `image` (id, route, brand, desc, target, category, previewH). `SUBSET_IDS` (Task 4 Step 4) = the 14 keys remaining in `specimen-specs.data.json` after removing `n1` → `specimen-subset-complete.test` (reads `SUBSET_IDS` + data) stays green. `resolveScreen` signature (Task 2) unchanged from `screens.ts`.
