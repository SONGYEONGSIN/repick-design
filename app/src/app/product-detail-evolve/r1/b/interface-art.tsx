import type { Finish, GalleryViewId } from "./data";

/**
 * Fenwick renders its own gallery instead of photographing a fictional SKU: four deterministic
 * SVG "spec-diagram" views (front / rear / top / desk) whose chassis color is driven directly by
 * the selected finish, so switching Graphite/Silver repaints the same geometry instantly instead
 * of swapping in a different photo. No trigonometry is used for coordinates — the one rotated
 * element uses SVG's `rotate()` transform with a fixed integer angle, not a computed sine/cosine.
 */

const ACCENT = "#C2410C"; // orange-700 — matches the on-white text/button accent used elsewhere
const ACCENT_SOFT = "#FDBA74"; // orange-300 — meter/LED highlight only, never carries text

function Backdrop() {
  return (
    <>
      <defs>
        <linearGradient id="fenwick-backdrop" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F4F4F5" />
          <stop offset="100%" stopColor="#E4E4E7" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="400" height="300" fill="url(#fenwick-backdrop)" />
      <ellipse cx="200" cy="248" rx="128" ry="14" fill="#000000" opacity="0.1" />
    </>
  );
}

function Knob({ cx, cy, panel, angle }: { cx: number; cy: number; panel: string; angle: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r="30" fill={panel} stroke="#00000026" strokeWidth="1.5" />
      <circle cx={cx} cy={cy} r="30" fill="none" stroke={ACCENT} strokeWidth="2" strokeDasharray="4 3" opacity="0.5" />
      <line
        x1={cx}
        y1={cy}
        x2={cx}
        y2={cy - 22}
        stroke="#FAFAFA"
        strokeWidth="2.5"
        strokeLinecap="round"
        transform={`rotate(${angle} ${cx} ${cy})`}
      />
      <circle cx={cx} cy={cy} r="4" fill="#FAFAFA" opacity="0.85" />
    </g>
  );
}

function Ladder({ x, y }: { x: number; y: number }) {
  const heights = [7, 9, 11, 13, 15, 17];
  return (
    <g>
      {heights.map((h, i) => (
        <rect
          key={i}
          x={x}
          y={y - h}
          width="6"
          height={h}
          rx="1.5"
          fill={i >= 4 ? ACCENT_SOFT : "#A1A1AA"}
          opacity={i >= 4 ? 0.9 : 0.55}
        />
      ))}
    </g>
  );
}

function FrontView({ finish }: { finish: Finish }) {
  return (
    <svg viewBox="0 0 400 300" className="h-full w-full" role="img" aria-labelledby="art-front-title">
      <title id="art-front-title">Front panel of the Aria II, showing twin gain knobs and paired LED meter ladders</title>
      <Backdrop />
      <rect x="52" y="72" width="296" height="148" rx="16" fill={finish.chassis} stroke="#00000030" strokeWidth="1.5" />
      <rect x="52" y="72" width="296" height="10" rx="5" fill="#FFFFFF" opacity="0.08" />
      <Ladder x={96} y={176} />
      <Knob cx={148} cy={146} panel={finish.panel} angle={-35} />
      <Ladder x={292} y={176} />
      <Knob cx={252} cy={146} panel={finish.panel} angle={20} />
      <circle cx="322" cy="196" r="7" fill="#18181B" stroke="#00000030" />
      <rect x="128" y="192" width="40" height="4" rx="2" fill="#FAFAFA" opacity="0.35" />
      <rect x="232" y="192" width="40" height="4" rx="2" fill="#FAFAFA" opacity="0.35" />
    </svg>
  );
}

function RearView({ finish }: { finish: Finish }) {
  return (
    <svg viewBox="0 0 400 300" className="h-full w-full" role="img" aria-labelledby="art-rear-title">
      <title id="art-rear-title">Rear panel of the Aria II, showing combo XLR inputs, balanced outputs, and the USB-C port</title>
      <Backdrop />
      <rect x="52" y="90" width="296" height="112" rx="16" fill={finish.chassis} stroke="#00000030" strokeWidth="1.5" />
      <rect x="52" y="90" width="296" height="8" rx="4" fill="#FFFFFF" opacity="0.08" />
      {[112, 172].map((cx) => (
        <g key={`in-${cx}`}>
          <circle cx={cx} cy={146} r="17" fill="#0F0F11" stroke="#00000040" />
          <circle cx={cx} cy={146} r="5" fill="#3F3F46" />
          <rect x={cx - 2} y={131} width="4" height="9" fill="#3F3F46" />
        </g>
      ))}
      {[236, 284].map((cx) => (
        <rect key={`out-${cx}`} x={cx - 9} y={135} width="18" height="22" rx="4" fill="#0F0F11" stroke="#00000040" />
      ))}
      <rect x="318" y="138" width="20" height="10" rx="3" fill="#0F0F11" stroke="#00000040" />
      <rect x="94" y="180" width="16" height="12" rx="2" fill="#0F0F11" opacity="0.85" />
      <rect x="174" y="180" width="16" height="12" rx="2" fill="#0F0F11" opacity="0.85" />
    </svg>
  );
}

function TopView({ finish }: { finish: Finish }) {
  return (
    <svg viewBox="0 0 400 300" className="h-full w-full" role="img" aria-labelledby="art-top-title">
      <title id="art-top-title">Top-down view of the Aria II chassis, showing its slim aluminum profile</title>
      <Backdrop />
      <rect x="44" y="104" width="312" height="92" rx="18" fill={finish.chassis} stroke="#00000030" strokeWidth="1.5" />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x="70" y={122 + i * 14} width="260" height="2" fill="#FFFFFF" opacity="0.06" />
      ))}
      {[[66, 116], [334, 116], [66, 184], [334, 184]].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="3" fill="#00000040" />
      ))}
      <circle cx={148} cy={150} r="16" fill={finish.panel} stroke="#00000026" />
      <circle cx={252} cy={150} r="16" fill={finish.panel} stroke="#00000026" />
    </svg>
  );
}

function DeskView({ finish }: { finish: Finish }) {
  return (
    <svg viewBox="0 0 400 300" className="h-full w-full" role="img" aria-labelledby="art-desk-title">
      <title id="art-desk-title">The Aria II staged on a desk beside a laptop, showing its footprint relative to a keyboard deck</title>
      <Backdrop />
      <rect x="30" y="150" width="150" height="8" rx="3" fill="#D4D4D8" opacity="0.7" />
      <path d="M40 150 L54 96 L166 96 L180 150 Z" fill="#E4E4E7" stroke="#00000020" />
      <rect x="60" y="100" width="100" height="46" rx="2" fill="#A1A1AA" opacity="0.6" />
      <rect x="230" y="160" width="120" height="58" rx="12" fill={finish.chassis} stroke="#00000030" strokeWidth="1.5" />
      <circle cx="264" cy="189" r="12" fill={finish.panel} />
      <circle cx="316" cy="189" r="12" fill={finish.panel} />
      <path d="M180 148 C 205 148, 205 176, 230 176" fill="none" stroke="#71717A" strokeWidth="2.5" strokeLinecap="round" />
      <ellipse cx="290" cy="228" rx="70" ry="8" fill="#000000" opacity="0.08" />
    </svg>
  );
}

export default function InterfaceArt({ view, finish }: { view: GalleryViewId; finish: Finish }) {
  switch (view) {
    case "front":
      return <FrontView finish={finish} />;
    case "rear":
      return <RearView finish={finish} />;
    case "top":
      return <TopView finish={finish} />;
    case "desk":
      return <DeskView finish={finish} />;
  }
}
