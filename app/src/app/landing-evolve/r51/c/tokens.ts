// Shared literal tokens -- dark theme, cyan accent, assigned exactly by this round's brief
// (do not recompute/guess; the numbers below are the brief's own precomputed figures).

export const BG = "#0B0B0F";
export const SURFACE = "#13131A"; // panel / card surface, one step up from BG
export const SURFACE_BORDER = "#23232C";
export const FG = "#FFFFFF";

// Accent: cyan-400, assigned by the brief with these exact precomputed contrasts:
//   #22D3EE text on #0B0B0F background -> 10.87:1 -- safe for ANY text size directly on bg.
//   White on a #22D3EE FILL -> 1.81:1 (fails, any size) -- so fills never carry white text.
//   Dark ink #0B0B0F on a #22D3EE FILL -> 10.87:1 (always safe) -- so fills always carry ink.
// Because the bg-contrast figure (10.87:1) already clears body AA on its own, this accent does
// NOT need a separate bright "tint" derivative for small text the way a dimmer accent would --
// the single hex is used for text at any size directly on BG/SURFACE, and only fills switch to
// dark-ink text.
export const ACCENT_HEX = "#22D3EE";
export const ACCENT_FILL = "bg-[#22D3EE]";
export const ACCENT_BORDER = "border-[#22D3EE]";
export const ACCENT_TEXT = "text-[#22D3EE]"; // safe at any size, directly on BG or SURFACE
export const ON_ACCENT_FILL_TEXT = "text-[#0B0B0F]"; // never white on the cyan fill -- see above

// Muted / de-emphasized text. zinc-400 (#A1A1AA) is this repo's documented dark-theme floor
// (no-dark-dim-text). Computed by hand (sRGB -> linear -> WCAG relative luminance) against this
// exact bg: #A1A1AA -> L=0.3567; #0B0B0F -> L=0.0034; contrast = (0.3567+0.05)/(0.0034+0.05) =
// 7.61:1 -- clears AA with wide margin. Against the panel surface #13131A (L=0.0068):
// (0.3567+0.05)/(0.0068+0.05) = 7.16:1 -- also clears. One token, safe on both surfaces used here.
export const MUTED_TEXT = "text-zinc-400";

export const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#22D3EE]";

export const EYEBROW = "text-[11px] font-semibold uppercase tracking-[0.28em]";
export const CAPTION = "text-[11px] font-semibold uppercase tracking-[0.16em]";
export const STAT_LABEL = "text-[11px] font-semibold uppercase tracking-[0.12em]";
export const FIG_CAPTION = "text-[11px] font-normal tracking-[0.04em]";

// Optional display face: JetBrains Mono Display, large Latin headline text only (h1), never
// mixed with another display variable, never body copy. Chosen because it reads as a
// numbers/ledger face, which fits a budget-planning headline -- Pretendard (--font-sans) carries
// every other weight, including every other heading, on this page.
export const DISPLAY_FONT = "var(--font-display-mono)";
