import { DISPLAY } from "./data";

/**
 * A hallmark, not a headshot.
 *
 * Photographs of a team are the one asset an about page cannot fake, and reaching for a stock face
 * or a random-avatar host would put a stranger's picture under a real claim of accountability. This
 * draws a maker's mark instead: initials struck into a plate, with a tally along the bottom edge
 * whose length is derived from the name itself. Same name, same mark, forever — no clock, no
 * randomness, no network.
 *
 * `aria-hidden` because the name it stands for is printed immediately beside it; announcing the
 * mark as well would make every card read its person out twice.
 */
function seedFrom(name: string): number {
  let seed = 0;
  for (let i = 0; i < name.length; i++) {
    seed = (seed * 31 + name.charCodeAt(i)) % 100000;
  }
  return seed;
}

export default function TeamMark({
  name,
  initials,
  holds,
  className,
}: {
  name: string;
  initials: string;
  /** Whether this person is answerable for one of the four measures — the bar is struck in the
   *  accent when they are. Never the only signal: the card says so in words too. */
  holds: boolean;
  className?: string;
}) {
  const seed = seedFrom(name);
  const ticks = 3 + (seed % 4);
  const barWidth = 16 + (seed % 5) * 6;

  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" focusable="false" className={className}>
      <rect
        x="0.5"
        y="0.5"
        width="63"
        height="63"
        rx="13.5"
        fill="#ffffff"
        stroke={holds ? "#4d7c0f" : "#d6d3d1"}
      />
      <rect x="11" y="11" width={barWidth} height="3" rx="1.5" fill={holds ? "#4d7c0f" : "#a8a29e"} />
      <text
        x="32"
        y="42"
        textAnchor="middle"
        fontSize="21"
        fontWeight="600"
        fill="#1c1917"
        style={DISPLAY}
      >
        {initials}
      </text>
      {Array.from({ length: ticks }, (_, i) => (
        <rect key={i} x={11 + i * 7} y="51" width="3" height="4" rx="1" fill="#d6d3d1" />
      ))}
    </svg>
  );
}
