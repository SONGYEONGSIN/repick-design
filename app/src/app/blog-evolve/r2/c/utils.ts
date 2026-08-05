// app/src/app/blog-evolve/r2/c/utils.ts
//
// Deterministic helpers shared by the generated SVG art (cover tiles, avatars). No Math.random —
// every "seed" here is derived from a fixed string (a release id or author name) with a plain
// string hash, so server and client render byte-identical output and the same input always paints
// the same art.

/** Simple deterministic string hash (djb2 variant). Always non-negative. */
export function hashString(input: string): number {
  let h = 5381;
  for (let i = 0; i < input.length; i++) {
    h = (h * 33) ^ input.charCodeAt(i);
  }
  return Math.abs(h);
}

/** Round to 2 decimals, per page-brief-core §4's SVG-coordinate rule. */
export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/** First letter of up to two words, upper-cased — for monogram avatars. */
export function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
  return (first + last).toUpperCase();
}
