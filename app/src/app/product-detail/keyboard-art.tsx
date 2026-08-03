// Stylized top-down illustration of the Anvil TKL-75, built from plain rects so it never depends
// on a remote image asset. The home-row keys pick up the selected switch's swatch color so the
// gallery visibly answers "what does this switch look like" alongside the text spec — decorative,
// so it is aria-hidden and the informative label lives on the wrapping figure instead.

const ROWS = 5;
const COLS_PER_ROW = [15, 15, 14, 12, 8];
const KEY_W = 6.1;
const KEY_H = 6.1;
const GAP = 0.9;

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export default function KeyboardArt({ switchColor }: { switchColor: string }) {
  const keys: { x: number; y: number; accent: boolean }[] = [];
  for (let row = 0; row < ROWS; row++) {
    const cols = COLS_PER_ROW[row];
    const rowWidth = cols * (KEY_W + GAP) - GAP;
    const offsetX = (COLS_PER_ROW[0] * (KEY_W + GAP) - GAP - rowWidth) / 2;
    for (let col = 0; col < cols; col++) {
      const x = round2(6 + offsetX + col * (KEY_W + GAP));
      const y = round2(8 + row * (KEY_H + GAP));
      // Home-row accent: row 2 (ASDF/JKL;-ish band), a centered cluster of 4 keys.
      const accent = row === 2 && col >= Math.floor(cols / 2) - 2 && col < Math.floor(cols / 2) + 2;
      keys.push({ x, y, accent });
    }
  }

  const viewW = round2(COLS_PER_ROW[0] * (KEY_W + GAP) - GAP + 12);
  const viewH = round2(8 + ROWS * (KEY_H + GAP) + 10);
  const spaceW = round2(COLS_PER_ROW[0] * (KEY_W + GAP) - GAP - 40);
  const spaceX = round2(6 + (COLS_PER_ROW[0] * (KEY_W + GAP) - GAP - spaceW) / 2);
  const spaceY = round2(8 + ROWS * (KEY_H + GAP) + 1);

  return (
    <svg viewBox={`0 0 ${viewW} ${viewH}`} className="h-full w-full" aria-hidden="true" focusable="false">
      <rect x="1" y="1" width={viewW - 2} height={viewH - 2} rx="6" className="fill-slate-200" />
      <rect x="3" y="3" width={viewW - 6} height={viewH - 6} rx="5" className="fill-slate-50" />
      {keys.map((k, i) => (
        <rect
          key={i}
          x={k.x}
          y={k.y}
          width={KEY_W}
          height={KEY_H}
          rx="1.4"
          className={k.accent ? "" : "fill-white stroke-slate-300"}
          style={k.accent ? { fill: switchColor, opacity: 0.85 } : undefined}
          strokeWidth={k.accent ? 0 : 0.5}
        />
      ))}
      <rect
        x={spaceX}
        y={spaceY}
        width={spaceW}
        height={KEY_H}
        rx="1.4"
        className="fill-white stroke-slate-300"
        strokeWidth="0.5"
      />
    </svg>
  );
}
