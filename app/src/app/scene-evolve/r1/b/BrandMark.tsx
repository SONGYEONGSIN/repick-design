/**
 * Second's mark — a case, a chapter ring and two hands at the same 10:09 the scene's dial state
 * parks on, so the logo and the field are one idea rather than two.
 */
export default function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      focusable="false"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    >
      <circle cx="12" cy="12" r="8.2" />
      {/* Lug stubs — what makes it a wrist watch instead of a clock face. */}
      <path d="M9.4 4.2 9.9 2M14.6 4.2 14.1 2M9.4 19.8 9.9 22M14.6 19.8 14.1 22" />
      {/* Hands at 10:09, and the crown at three. */}
      <path d="M12 12 7.9 9.7M12 12 15.8 9.4" />
      <path d="M20.2 12h1.4" />
      <circle cx="12" cy="12" r="1.15" fill="#FF6A93" stroke="none" />
    </svg>
  );
}
