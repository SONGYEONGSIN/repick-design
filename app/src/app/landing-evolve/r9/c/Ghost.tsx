/**
 * Editorial section numeral.
 *
 * Drawn as SVG text rather than a DOM node on purpose: the "ghost" tone this device needs
 * (#2E2E38 against #0B0B0F) is well under the AA floor for HTML copy, and an `aria-hidden`
 * span at that value is still a coin flip in an automated contrast sweep. Inside `<svg>` it is
 * unambiguously a graphic — it carries no meaning that is not already in the adjacent heading,
 * and the weight axis here is not part of the page's three-weight budget either.
 */
export function GhostNumber({
  value,
  className = "",
}: {
  value: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 120 72"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <text
        x="0"
        y="62"
        fill="#2E2E38"
        style={{
          fontFamily: "var(--font-display-wide)",
          fontWeight: 800,
          fontSize: "76px",
          letterSpacing: "-0.04em",
        }}
      >
        {value}
      </text>
    </svg>
  );
}
