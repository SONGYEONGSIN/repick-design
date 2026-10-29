# c — Verification Timeline

Dark / sky / no display face (Pretendard only — a deliberate "don't use the
slot" choice, valid per design-principles.md §Typography: "디스플레이 활자
1종 선택 가능" is permissive, not mandatory). A 4-stage stepper (Listed →
Inspected → Authenticated → Shipped), clickable in any order (not forced
sequential), drives three synchronized surfaces from one `STAGES` lookup
table indexed by stage: a confidence %, an ETA in days, and a badge count
on a single preview card. Non-trivial default (stageIndex=2,
"Authenticated", not stage 0) satisfies the non-trivial-default doctrine
and also its r41 generalization (every reset, not just first paint — here
there's no reset action at all, so the doctrine is satisfied trivially by
never defaulting to the empty/zero stage in the first place).

## 브리프에 없던 것

1. **Accent hex + contrast calc** — chose sky. White on `#0369a1`
   (sky-700) = 5.93:1 (safe small-text fill, CTA button). `#38bdf8`
   (sky-400) against `#09090b` = 9.29:1 and `#7dd3fc` (sky-300) against
   the same bg = 11.93:1 — both used only for large stat numbers,
   borders, and icon fills, never for small-text-on-fill.
2. **No display face, explicitly** — design-principles.md §Typography
   frames the display-face slot as optional ("활자를 안 바꾸는 선택도
   유효하다"). Chose to skip it for this candidate specifically to add a
   face-axis data point at "none" for the round's three candidates
   (a=grotesk, b=wide, c=none), since recent rounds (r38 mono, r39 wide,
   r40 mono, r41 grotesk, r42 mono) have leaned heavily on `mono` and
   none have used "no display face" recently — read as an underused
   lever on the diversity axis, not as a brief gap.
3. **Lookup-table causality** — the three synchronized values are a plain
   array indexed by `stageIndex`, not a formula. Chose this deliberately
   over interpolation specifically to avoid any strict-comparator-reduce
   shape (the r42/b bug class) — there is no reduce, no min/max, and no
   tie condition possible since `stageIndex` is a single integer index
   into one array.
4. **Clickable-in-any-order vs forced-sequential** — the brief doesn't
   specify whether a verification/stepper device must progress linearly.
   Chose any-order clickability so a visitor can directly compare
   "Listed" against "Shipped" without having to step through the middle
   stages, on the theory that comparison (not just forward narrative) is
   the thing that sells the proof here.
5. **Duplicate-avoidance depth** — same caveat as a/b.
