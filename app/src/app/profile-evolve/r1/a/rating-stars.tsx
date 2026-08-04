import { Star } from "lucide-react";

/** Whole-star rating (1–5). Icons are decorative; the numeric rating is conveyed as real text. */
export default function RatingStars({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) {
  const dim = size === "md" ? "h-4 w-4" : "h-3.5 w-3.5";
  const rounded = Math.round(rating);
  return (
    <span className="inline-flex items-center gap-0.5" aria-hidden="true">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          strokeWidth={1.5}
          className={`${dim} ${i < rounded ? "fill-rose-400 text-rose-400" : "fill-transparent text-zinc-600"}`}
        />
      ))}
    </span>
  );
}
