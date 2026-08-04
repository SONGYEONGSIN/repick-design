// FNV-1a over a string — deterministic, no dependencies, no Math.random. Used to derive stable
// gradient hues for generated art (avatar mark + listing tiles) so the same slug always renders the
// same art and nothing is fetched from a third-party image host at page-load time.
export function hashString(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}
