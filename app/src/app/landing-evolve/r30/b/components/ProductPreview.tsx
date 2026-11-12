"use client";

import Image from "next/image";
import { useId, useState } from "react";

interface Item {
  id: string;
  category: string;
  title: string;
  photo: string;
  alt: string;
  grade: string;
  tier: "Verified Pro" | "ID-Verified" | "New Seller";
  retail: number;
  resale: number;
  matchTags: string[];
  whyMatched: string;
}

const ITEMS: Item[] = [
  {
    id: "sneaker",
    category: "Sneakers",
    title: "Air Max 1 '87 OG",
    photo: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2",
    alt: "A single white and grey low-top sneaker photographed against a plain background",
    grade: "Excellent (9/10)",
    tier: "Verified Pro",
    retail: 230,
    resale: 142,
    matchTags: ["Size 10 in stock", "OG colorway match"],
    whyMatched:
      "Matched on size, colorway and release year against your saved search, then routed to a Verified Pro seller whose last 40 listings all passed in-person authentication.",
  },
  {
    id: "bag",
    category: "Bags",
    title: "Structured tote, grained leather",
    photo: "https://images.unsplash.com/photo-1584917865442-de89df76afd3",
    alt: "A structured brown leather tote bag standing upright against a plain background",
    grade: "Very Good (8/10)",
    tier: "ID-Verified",
    retail: 890,
    resale: 410,
    matchTags: ["Neutral tone match", "Hardware condition photographed"],
    whyMatched:
      "Matched on silhouette and hardware finish. The seller's government ID is on file and the condition photos line up with the grade listed — corners and base shown separately, not just the front.",
  },
  {
    id: "camera",
    category: "Electronics",
    title: "Full-frame mirrorless body, 24MP",
    photo: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f",
    alt: "A mirrorless camera body with lens attached, resting on a plain surface",
    grade: "Good (7/10)",
    tier: "New Seller",
    retail: 1650,
    resale: 690,
    matchTags: ["Shutter count under 8,000", "Battery + charger included"],
    whyMatched:
      "Matched on shutter count and kit completeness. The seller is new to Repick — email-verified only, ID still pending — which is exactly why the badge says so instead of defaulting to a higher tier.",
  },
];

function discountPct(retail: number, resale: number): number {
  return Math.round(((retail - resale) / retail) * 100);
}

const TIER_BADGE_CLASS: Record<Item["tier"], string> = {
  "Verified Pro": "bg-teal-700 text-white",
  "ID-Verified": "bg-teal-400 text-[#0B0B0F]",
  "New Seller": "bg-zinc-700 text-zinc-100",
};

function ProductCard({ item }: { item: Item }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const pct = discountPct(item.retail, item.resale);

  return (
    <div className="flex min-w-0 flex-col rounded-lg border border-zinc-800 bg-zinc-950">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-lg bg-zinc-800">
        <Image
          src={item.photo}
          alt={item.alt}
          fill
          sizes="(min-width: 768px) 33vw, 100vw"
          className="object-cover"
        />
      </div>

      {/* Badges live in their own strip below the photo, never pinned on top of it. */}
      <div className="flex flex-wrap items-center gap-2 border-b border-zinc-800 px-4 py-3">
        <span className={`rounded-sm px-2 py-0.5 text-xs font-semibold ${TIER_BADGE_CLASS[item.tier]}`}>
          {item.tier}
        </span>
        <span className="rounded-sm bg-zinc-800 px-2 py-0.5 text-xs font-semibold text-zinc-200">
          Grade: {item.grade}
        </span>
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-3 px-4 py-4">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-zinc-400">{item.category}</p>
          <h3 className="mt-1 truncate text-base font-bold text-zinc-50">{item.title}</h3>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {item.matchTags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-teal-700/60 px-2 py-0.5 text-[11px] font-semibold text-teal-300"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-baseline gap-2">
          <span className="text-lg font-bold text-zinc-50">${item.resale}</span>
          <span className="text-sm text-zinc-400 line-through">${item.retail}</span>
          <span className="text-xs font-semibold text-teal-300">{pct}% off retail</span>
        </div>

        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((v) => !v)}
          className="self-start text-sm font-semibold text-zinc-300 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-300"
        >
          {open ? "Hide why this matched" : "Why this matched"}
        </button>
        <p
          id={panelId}
          hidden={!open}
          className="max-w-[431px] text-sm leading-relaxed text-zinc-400"
        >
          {item.whyMatched}
        </p>
      </div>
    </div>
  );
}

export function ProductPreview() {
  return (
    <div className="grid gap-5 sm:grid-cols-3">
      {ITEMS.map((item) => (
        <ProductCard key={item.id} item={item} />
      ))}
    </div>
  );
}
