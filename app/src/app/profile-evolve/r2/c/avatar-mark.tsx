import { hashString } from "./hash";

// Deterministic generated identity mark — no photo, no third-party image host. The ring angles are
// derived from a stable string hash and rounded to 2dp so the same handle always renders the same
// mark on server and client (no hydration mismatch from float noise).
export default function AvatarMark({
  handle,
  initials,
  className = "h-16 w-16",
}: {
  handle: string;
  initials: string;
  className?: string;
}) {
  const h = hashString(handle);
  const a1 = Math.round(((h % 360) + 360) % 360 * 100) / 100;
  const a2 = Math.round((((h >> 8) % 360) + 360) % 360 * 100) / 100;

  return (
    <div className={`relative shrink-0 overflow-hidden rounded-full bg-blue-700 ${className}`}>
      <svg viewBox="0 0 64 64" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <defs>
          <linearGradient id={`avatar-grad-${handle}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1447e6" />
            <stop offset="100%" stopColor="#155dfc" />
          </linearGradient>
        </defs>
        <rect width="64" height="64" fill={`url(#avatar-grad-${handle})`} />
        <circle cx="32" cy="32" r="26" fill="none" stroke="#bedbff" strokeOpacity="0.35" strokeWidth="1.5" />
        <circle
          cx="32"
          cy="32"
          r="19"
          fill="none"
          stroke="#eff6ff"
          strokeOpacity="0.5"
          strokeWidth="1.5"
          strokeDasharray="3 5"
          transform={`rotate(${a1} 32 32)`}
        />
        <circle
          cx="32"
          cy="32"
          r="12"
          fill="none"
          stroke="#eff6ff"
          strokeOpacity="0.7"
          strokeWidth="1.5"
          transform={`rotate(${a2} 32 32)`}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-lg font-semibold text-white" style={{ fontFamily: "var(--font-display-mono)" }}>
        {initials}
      </span>
    </div>
  );
}
