import { Sparkles, BadgeCheck, ShieldCheck, Tag } from "lucide-react";

interface ProofBadgesProps {
  matchPercent: number;
  conditionGrade: string;
  conditionScore: number;
  sellerRating: number;
  sellerSales: number;
  price: number;
  originalPrice: number;
  discountPercent: number;
  size?: "default" | "compact";
}

/**
 * The four required proof points, rendered as a plain pill list — never overlaid on a photo,
 * so a failed image load can never collide with this text.
 */
export default function ProofBadges({
  matchPercent,
  conditionGrade,
  conditionScore,
  sellerRating,
  sellerSales,
  price,
  originalPrice,
  discountPercent,
  size = "default",
}: ProofBadgesProps) {
  const pad = size === "compact" ? "px-2.5 py-1" : "px-3 py-1.5";
  const text = size === "compact" ? "text-[11px]" : "text-xs";

  return (
    <ul role="list" className="flex flex-wrap gap-1.5 sm:gap-2">
      <li
        className={`flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900/80 ${pad} ${text} font-semibold text-zinc-200`}
      >
        <Sparkles aria-hidden="true" className="h-3.5 w-3.5 text-violet-300" />
        <span className="tabular-nums">{matchPercent}% match</span>
      </li>
      <li
        className={`flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900/80 ${pad} ${text} font-semibold text-zinc-200`}
      >
        <BadgeCheck aria-hidden="true" className="h-3.5 w-3.5 text-violet-300" />
        <span>
          {conditionGrade} <span className="tabular-nums text-zinc-400">{conditionScore}/10</span>
        </span>
      </li>
      <li
        className={`flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900/80 ${pad} ${text} font-semibold text-zinc-200`}
      >
        <ShieldCheck aria-hidden="true" className="h-3.5 w-3.5 text-violet-300" />
        <span>
          Verified <span className="tabular-nums text-zinc-400">{sellerRating.toFixed(1)}★ · {sellerSales}</span>
        </span>
      </li>
      <li
        className={`flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900/80 ${pad} ${text} font-semibold text-zinc-200`}
      >
        <Tag aria-hidden="true" className="h-3.5 w-3.5 text-violet-300" />
        <span className="tabular-nums">
          ${price} <span className="text-zinc-400 line-through">${originalPrice}</span> −{discountPercent}%
        </span>
      </li>
    </ul>
  );
}
