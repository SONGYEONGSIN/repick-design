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
    // 다크 표면(`ink`) 위의 글자. 흰 바탕용 `muted`·`faint` 를 그대로 얹으면 각각 2.29:1 · 3.67:1 로
    // AA 에 미달한다 — 툴팁 말풍선이 실제로 그 상태였고, 역할이 없어 값이 하드코딩돼 있었다.
    onInk: "#ffffff", // on ink = 17.72:1
    onInkMuted: "#a1a1aa", // on ink = 6.91:1
    border: "#e4e4e7",
  },
  space: (n: number) => n * 4, // 4/8 spacing rhythm
  radius: { md: 12, sm: 6 },
} as const;
