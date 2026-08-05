// FNV-1a over a string — deterministic, dependency-free, no Math.random. Used to derive stable
// hues/coordinates for generated cover art and the identity mark so the same case-study id always
// renders identical art on server and client (hydration-safe) without fetching a third-party image.
export function hashString(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

export function hueFromSeed(seed: string, spread = 360): number {
  return hashString(seed) % spread;
}
