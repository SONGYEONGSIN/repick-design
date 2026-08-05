/**
 * Deterministic monogram mark — no photo, no external image, no Math.random. A fixed two-stop
 * gradient and fixed initials rendered as SVG text so the container never depends on a remote
 * asset resolving.
 */
export default function AvatarMark({ initials, className }: { initials: string; className?: string }) {
  return (
    <svg viewBox="0 0 64 64" role="img" aria-hidden="true" className={className}>
      <defs>
        <linearGradient id="avatar-gradient" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#0891b2" />
          <stop offset="1" stopColor="#22d3ee" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill="url(#avatar-gradient)" />
      <text
        x="32"
        y="40"
        textAnchor="middle"
        fontSize="24"
        fontWeight="600"
        fill="#09090b"
        style={{ fontFamily: "var(--font-display-wide)" }}
      >
        {initials}
      </text>
    </svg>
  );
}
