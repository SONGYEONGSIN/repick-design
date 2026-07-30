# r6/a — Certificate of Appraisal hero

## One-line concept
The hero presents the AI's decision as a formal, already-notarized document — a "Certificate of Appraisal" (serial number, item photo, tabular-nums match-score count-up, condition grade, verified-seller line, price-fairness verdict, dashed signature line) with a lucide `Stamp` wax-seal that springs into place on scroll-into-view in sync with the findings list revealing, instead of a live console, slider, table, or dial; the same document language repeats downstream as four selectable "exhibit" case files (`app/src/app/landing-evolve/r6/a/ExhibitPreview.tsx`) whose core proof (match %, grade, verified badge, before/after price) is always visible at rest, with selection swapping in that exhibit's real appraisal notes and price verdict — never a hover-only reveal.

## Files
- `app/src/app/landing-evolve/r6/a/page.tsx` — server component, metadata only.
- `app/src/app/landing-evolve/r6/a/ui.tsx` — `"use client"`, assembles nav → hero → case files → method (3-split) → social proof → closing CTA → footer, all English copy.
- `app/src/app/landing-evolve/r6/a/Certificate.tsx` — `"use client"`, the hero certificate artifact: deterministic `animate()` count-up (0 → 96, gated by `useReducedMotion`, no `Math.random`/`Date.now`), staggered findings reveal, and the spring-in wax seal (`Stamp` icon in an accent-ringed circle).
- `app/src/app/landing-evolve/r6/a/ExhibitPreview.tsx` — `"use client"`, four exhibit stubs (`role="tab"`) with always-on badges + a swapping "Appraisal notes" panel (`role="tabpanel"`).
- `app/src/app/landing-evolve/r6/a/data.ts` — shared tokens (`EASE`/`VIEWPORT`/`FOCUS`/`EYEBROW`/`CAPTION`/`NUM`) plus the `CertItem` domain type and 4 fixed products, all in English.

## Notes
- Verified with `npx tsc --noEmit`, `npx eslint src/app/landing-evolve/r6/a --max-warnings=0`, and `npx next build` (all clean); Playwright checks at 390/1264–1920px found no horizontal overflow. One real bug caught and fixed pre-delivery: the original headline word "recommendation." was wide enough at the desktop clamp tier to visually overflow into the certificate card — reworded to "Not a guess. / A verdict." which fits cleanly at every tested width.
