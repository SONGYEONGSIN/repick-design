/**
 * Reframe's mark — a six-bladed aperture seen head on.
 *
 * The hexagon is not decoration: it is the same figure the scene's point sprites are, because a
 * six-bladed lens renders every out-of-focus highlight as a small hexagon. The brand and the field
 * are the same idea at two scales rather than two ideas sharing a page.
 */
export default function Mark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      focusable="false"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
      strokeLinecap="round"
    >
      <path d="M20.23 7.25 L12 2.5 L3.77 7.25 L3.77 16.75 L12 21.5 L20.23 16.75 Z" />
      <path d="M20.23 7.25 L15.12 10.2" />
      <path d="M3.77 7.25 L8.88 10.2" />
      <path d="M12 21.5 L12 15.6" />
      <path
        d="M15.6 12 L13.8 8.88 L10.2 8.88 L8.4 12 L10.2 15.12 L13.8 15.12 Z"
        fill="#38BDF8"
        stroke="none"
      />
    </svg>
  );
}
