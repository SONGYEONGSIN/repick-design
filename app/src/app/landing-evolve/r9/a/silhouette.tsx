import type { Category } from "./data";

/**
 * Solid-mass product silhouettes, not line art — the blueprint look is banned by the landing DNA,
 * and r7 taught that photography must never be the proof. These are decorative: every claim a card
 * makes lives in its text and figures, so the SVG is `aria-hidden` and the card reads identically
 * with images off.
 */
export function Silhouette({ category }: { category: Category }) {
  return (
    <svg viewBox="0 0 120 90" aria-hidden="true" focusable="false" className="h-full w-full">
      {category === "film camera" ? (
        <g>
          <rect x="16" y="30" width="88" height="44" rx="9" fill="#DCDCE3" />
          <rect x="44" y="21" width="30" height="10" rx="3" fill="#DCDCE3" />
          <rect x="22" y="23" width="13" height="7" rx="2" fill="#DCDCE3" />
          <circle cx="60" cy="52" r="18" fill="#0B0B0F" />
          <circle cx="60" cy="52" r="12" fill="#6E56CF" />
          <circle cx="55" cy="47" r="4" fill="#DCDCE3" />
          <rect x="86" y="37" width="11" height="6" rx="2" fill="#0B0B0F" />
        </g>
      ) : null}

      {category === "road bike" ? (
        <g>
          <path
            fillRule="evenodd"
            d="M30 40a20 20 0 1 0 0 40 20 20 0 1 0 0-40Zm0 6a14 14 0 1 1 0 28 14 14 0 1 1 0-28Z"
            fill="#DCDCE3"
          />
          <path
            fillRule="evenodd"
            d="M90 40a20 20 0 1 0 0 40 20 20 0 1 0 0-40Zm0 6a14 14 0 1 1 0 28 14 14 0 1 1 0-28Z"
            fill="#DCDCE3"
          />
          <path d="M30 60 L52 30 L82 30 L90 60 L78 60 L72 36 L56 36 Z" fill="#DCDCE3" />
          <rect x="46" y="23" width="18" height="5" rx="2.5" fill="#DCDCE3" />
          <rect x="76" y="21" width="18" height="5" rx="2.5" fill="#DCDCE3" />
          <rect x="82" y="24" width="5" height="12" rx="2" fill="#DCDCE3" />
          <circle cx="30" cy="60" r="5" fill="#6E56CF" />
          <circle cx="90" cy="60" r="5" fill="#6E56CF" />
        </g>
      ) : null}

      {category === "wool overcoat" ? (
        <g>
          <path
            d="M60 12 L46 17 L28 26 L33 46 L42 42 L40 80 L80 80 L78 42 L87 46 L92 26 L74 17 Z"
            fill="#DCDCE3"
          />
          <path d="M60 14 L51 22 L60 44 L69 22 Z" fill="#0B0B0F" />
          <circle cx="60" cy="52" r="3" fill="#6E56CF" />
          <circle cx="60" cy="63" r="3" fill="#6E56CF" />
        </g>
      ) : null}
    </svg>
  );
}
