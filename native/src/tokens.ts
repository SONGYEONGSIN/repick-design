// native/src/tokens.ts — repick DNA → RN StyleSheet tokens (extracted from S0 PoC validated values)
export const tokens = {
  color: {
    bg: "#ffffff",
    accent: "#4f46e5", // indigo-600 (single accent)
    onAccent: "#ffffff",
    ink: "#18181b",
    ink2: "#27272a",
    muted: "#52525b",
    faint: "#71717a",
    border: "#e4e4e7",
  },
  space: (n: number) => n * 4, // 4/8 spacing rhythm
  radius: { md: 12, sm: 6 },
} as const;
