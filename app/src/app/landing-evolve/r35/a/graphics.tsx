import { SIGNATURE_PATH, BARCODE_WIDTHS } from "./data";

// All coordinates below are fixed literals (rounded to 2 decimals where derived), never
// Math.random/Date.now/new Date — server and client always render byte-identical markup.

/** Repick's own generative seal — concentric rings + radial ticks + a plain "R" monogram.
 *  Not a logo rip-off of any outside mark, and used purely as decoration (aria-hidden), so it
 *  never has to clear text-contrast rules — but it's built as plain geometry anyway, no glyphs. */
export function Seal({ className }: { className?: string }) {
  const ticks = Array.from({ length: 16 }, (_, i) => {
    const angle = (i / 16) * Math.PI * 2;
    const x1 = Number((32 + Math.cos(angle) * 26).toFixed(2));
    const y1 = Number((32 + Math.sin(angle) * 26).toFixed(2));
    const x2 = Number((32 + Math.cos(angle) * 29).toFixed(2));
    const y2 = Number((32 + Math.sin(angle) * 29).toFixed(2));
    return { x1, y1, x2, y2, key: i };
  });

  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="32" cy="32" r="30" fill="none" stroke="currentColor" strokeWidth="1" />
      <circle cx="32" cy="32" r="22" fill="none" stroke="currentColor" strokeWidth="1" />
      <circle cx="32" cy="32" r="14" fill="none" stroke="currentColor" strokeWidth="1.25" />
      {ticks.map((t) => (
        <line key={t.key} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke="currentColor" strokeWidth="1" />
      ))}
      <path d="M24,22 L24,42 M24,22 L34,22 C38,22 38,30 34,30 L24,30 M30,30 L38,42" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** A large, very low-opacity watermark duplicate of the seal, placed behind the certificate
 *  body. Pure geometry (no text glyphs), aria-hidden, decorative only. */
export function SealWatermark({ className }: { className?: string }) {
  return (
    <div className={className} aria-hidden="true">
      <Seal className="h-full w-full text-[#15140E]/5" />
    </div>
  );
}

export function Signature({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 32" className={className} aria-hidden="true" focusable="false">
      <path d={SIGNATURE_PATH} fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

export function Barcode({ className }: { className?: string }) {
  const bars = BARCODE_WIDTHS.reduce<{ x: number; w: number; key: number }[]>((acc, w, i) => {
    const prevEnd = acc.length ? acc[acc.length - 1].x + acc[acc.length - 1].w + 1.4 : 0;
    acc.push({ x: prevEnd, w, key: i });
    return acc;
  }, []);
  const last = bars[bars.length - 1];
  const total = last.x + last.w;
  return (
    <svg viewBox={`0 0 ${total} 20`} className={className} aria-hidden="true" focusable="false" preserveAspectRatio="none">
      {bars.map((b) => (
        <rect key={b.key} x={b.x} y="0" width={b.w} height="20" fill="currentColor" />
      ))}
    </svg>
  );
}

const THUMB_PATHS: Record<string, { bg: string; shapes: ReactShape[] }> = {
  "geo-a": {
    bg: "#EFECE6",
    shapes: [
      { type: "rect", x: 14, y: 46, w: 72, h: 38, rx: 6 },
      { type: "circle", cx: 50, cy: 34, r: 14 },
      { type: "line", x1: 14, y1: 64, x2: 86, y2: 64 },
    ],
  },
  "geo-b": {
    bg: "#E9EEE9",
    shapes: [
      { type: "rect", x: 20, y: 18, w: 60, h: 66, rx: 4 },
      { type: "line", x1: 20, y1: 38, x2: 80, y2: 38 },
      { type: "line", x1: 20, y1: 58, x2: 80, y2: 58 },
      { type: "line", x1: 20, y1: 78, x2: 80, y2: 78 },
    ],
  },
  "geo-c": {
    bg: "#EDEAE4",
    shapes: [
      { type: "circle", cx: 36, cy: 60, r: 20 },
      { type: "circle", cx: 66, cy: 60, r: 20 },
      { type: "rect", x: 24, y: 24, w: 52, h: 20, rx: 10 },
    ],
  },
  "geo-d": {
    bg: "#ECE8EE",
    shapes: [
      { type: "rect", x: 12, y: 42, w: 76, h: 10, rx: 5 },
      { type: "rect", x: 12, y: 58, w: 76, h: 10, rx: 5 },
      { type: "rect", x: 12, y: 74, w: 76, h: 10, rx: 5 },
    ],
  },
};

type ReactShape =
  | { type: "rect"; x: number; y: number; w: number; h: number; rx: number }
  | { type: "circle"; cx: number; cy: number; r: number }
  | { type: "line"; x1: number; y1: number; x2: number; y2: number };

export function Thumbnail({ variant, className }: { variant: string; className?: string }) {
  const def = THUMB_PATHS[variant] ?? THUMB_PATHS["geo-a"];
  return (
    <svg viewBox="0 0 100 100" className={className} role="img" aria-label="Generative illustration standing in for the listing photo">
      <rect x="0" y="0" width="100" height="100" fill={def.bg} />
      {def.shapes.map((s, i) => {
        if (s.type === "rect") {
          return <rect key={i} x={s.x} y={s.y} width={s.w} height={s.h} rx={s.rx} fill="none" stroke="#15140E" strokeOpacity="0.55" strokeWidth="1.5" />;
        }
        if (s.type === "circle") {
          return <circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill="none" stroke="#15140E" strokeOpacity="0.55" strokeWidth="1.5" />;
        }
        return <line key={i} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke="#15140E" strokeOpacity="0.4" strokeWidth="1.25" />;
      })}
    </svg>
  );
}
