import Image from "next/image";
import { BadgeCheck, CheckCircle2, Clock, Sparkles } from "lucide-react";
import type { Tier } from "./data";

interface TierCardProps {
  tier: Tier;
  recommended: boolean;
  variant?: "compact" | "full";
}

export default function TierCard({ tier, recommended, variant = "full" }: TierCardProps) {
  const isCompact = variant === "compact";

  return (
    <article
      className={[
        "min-w-0 overflow-hidden rounded-2xl border bg-white transition-colors",
        recommended ? "border-sky-700 ring-1 ring-sky-700/25" : "border-zinc-200",
      ].join(" ")}
    >
      {recommended && (
        <div className="flex items-center gap-1.5 border-b border-sky-700/20 bg-sky-50 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-sky-700">
          <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
          Recommended for you
        </div>
      )}

      <div className={isCompact ? "flex gap-3 p-3" : "p-5"}>
        <div
          className={[
            "relative shrink-0 overflow-hidden rounded-xl bg-zinc-100",
            isCompact ? "aspect-square w-20" : "mb-4 aspect-[4/3] w-full",
          ].join(" ")}
        >
          <Image
            src={`https://images.unsplash.com/photo-${tier.photoId}?auto=format&fit=crop&w=${isCompact ? 200 : 700}&q=70`}
            alt={tier.alt}
            fill
            sizes={isCompact ? "80px" : "(min-width: 1024px) 320px, 90vw"}
            className="object-cover"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-2">
            <p className="text-sm font-extrabold tracking-[-0.02em] text-zinc-900">{tier.name}</p>
            {!isCompact && (
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-sky-700">
                {tier.tagline}
              </p>
            )}
          </div>
          <p className="mt-0.5 truncate text-xs font-normal text-zinc-500">{tier.itemName}</p>

          {!isCompact && (
            <p className="mt-3 max-w-[280px] text-[13px] font-normal leading-[1.6] text-zinc-500">
              {tier.pitch}
            </p>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-full border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[10px] font-semibold text-zinc-600">
              <Sparkles className="h-2.5 w-2.5 text-sky-700" aria-hidden="true" />
              <span className="tabular-nums">{tier.match}%</span> match
            </span>
            <span className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[10px] font-semibold text-zinc-600">
              Grade {tier.condition}
            </span>
            {tier.verified && (
              <span className="inline-flex items-center gap-1 rounded-full border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[10px] font-semibold text-zinc-600">
                <BadgeCheck className="h-2.5 w-2.5 text-sky-700" aria-hidden="true" />
                Verified
              </span>
            )}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-zinc-100 pt-2.5 text-xs font-normal text-zinc-500">
            <span className="inline-flex items-center gap-1 tabular-nums">
              <Clock className="h-3 w-3" aria-hidden="true" />
              {tier.turnaround}
            </span>
            <span className="font-semibold tabular-nums text-zinc-700">{tier.fee}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
