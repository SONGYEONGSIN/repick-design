// native/src/tokens.ts — repick DNA → RN StyleSheet tokens (extracted from S0 PoC validated values)
export const tokens = {
  color: {
    bg: "#ffffff",
    accent: "#4f46e5", // indigo-600 (single accent)
    onAccent: "#ffffff",
    // light accent tint for a selected-state background (indigo-50) — kept for
    // selection/emphasis only, never used as a flood color
    accentBg: "#eef2ff",
    ink: "#18181b",
    ink2: "#27272a",
    muted: "#52525b",
    faint: "#71717a",
    // 다크 표면(`ink`) 위의 글자. 흰 바탕용 `muted`·`faint` 를 그대로 얹으면 각각 2.29:1 · 3.67:1 로
    // AA 에 미달한다 — 툴팁 말풍선이 실제로 그 상태였고, 역할이 없어 값이 하드코딩돼 있었다.
    onInk: "#ffffff", // on ink = 17.72:1
    onInkMuted: "#a1a1aa", // on ink = 6.91:1
    border: "#e4e4e7",
    // destructive-red, AA on white: #b91c1c on #ffffff = 6.11:1
    danger: "#b91c1c",
    dangerBg: "#fef2f2",
    dangerBorder: "#fecaca",
    // covered/eligible-green, AA on white: #15803d on #ffffff ≈ 5.13:1
    success: "#15803d",
    successBg: "#f0fdf4",
    successBorder: "#bbf7d0",
    // expiring/warning-amber, AA on white: #92400e on #ffffff ≈ 6.52:1
    // (amber-700 #b45309 only clears ~4.5:1, too close to the AA line — went one
    // step darker to amber-800 for a safer margin)
    warning: "#92400e",
    warningBg: "#fffbeb",
    warningBorder: "#fde68a",
    // neutral photo-placeholder swatches (zinc scale, deterministic index cycle —
    // used by photo-grid style screens instead of hardcoding arbitrary hex)
    swatch1: "#d4d4d8",
    swatch2: "#a1a1aa",
    swatch3: "#71717a",
    // translucent scrims for legibility over photo-swatch thumbnails (selection
    // check-circle backing, order-number badge backing) — alpha-channel variants
    // of onInk/ink, not new hues, so they stay inside the near-monochrome DNA
    scrimLight: "rgba(255,255,255,0.85)",
    scrimDark: "rgba(24,24,27,0.55)",
  },
  space: (n: number) => n * 4, // 4/8 spacing rhythm
  radius: { md: 12, sm: 6 },
} as const;
