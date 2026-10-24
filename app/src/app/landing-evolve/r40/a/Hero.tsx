import Image from "next/image";
import { ArrowRight, ShieldCheck, BadgeCheck } from "lucide-react";
import { DISPLAY_FONT, FOCUS_RING, MUTED, PROSE_WIDTH, ROSE_600, ROSE_700 } from "./theme";

type HeroCard = {
  id: string;
  name: string;
  category: string;
  photoId: string;
  alt: string;
  price: number;
  originalPrice: number;
  condition: string;
  match: number;
  verified: boolean;
};

const HERO_CARDS: HeroCard[] = [
  {
    id: "sneakers",
    name: "Low-Top Court Sneakers",
    category: "Sneakers",
    photoId: "1549298916-b41d501d3772",
    alt: "White low-top court sneakers against a plain background",
    price: 72,
    originalPrice: 150,
    condition: "Like New",
    match: 96,
    verified: true,
  },
  {
    id: "jacket",
    name: "Waxed Leather Field Jacket",
    category: "Outerwear",
    photoId: "1441986300917-64674bd600d8",
    alt: "Brown waxed leather field jacket laid flat against a plain background",
    price: 118,
    originalPrice: 260,
    condition: "Good",
    match: 91,
    verified: true,
  },
];

function discountPct(card: HeroCard): number {
  return Math.round(((card.originalPrice - card.price) / card.originalPrice) * 100);
}

// Section 1 — headline, subhead, single primary CTA, AND the product proof
// (match %, condition grade, verification, discount) all live in this one
// component so the proof renders above the fold with the headline, not in
// a separate section further down the page.
export default function Hero() {
  return (
    <section className="pt-10 pb-20 sm:pt-14 sm:pb-24">
      <p className="text-xs font-semibold tracking-[0.28em]" style={{ color: ROSE_700 }}>
        AI-MATCHED RESALE
      </p>
      <h1
        className={`mt-5 max-w-[720px] text-[clamp(2.25rem,9vw,3.25rem)] font-extrabold leading-[1.05] tracking-[-0.02em] text-zinc-950 lg:text-[clamp(3rem,5vw,5.25rem)] ${DISPLAY_FONT}`}
      >
        Rank it your way — the matches reorder around you.
      </h1>
      <p className={`mt-6 text-base font-normal leading-[1.6] ${MUTED} ${PROSE_WIDTH}`}>
        Repick scores every secondhand listing on condition, seller trust, speed to ship, and price — then lets you
        decide which signal leads, so the order you see always matches what you actually care about.
      </p>
      <a
        href="#rank-shuffle"
        className={`mt-8 inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white ${FOCUS_RING}`}
        style={{ backgroundColor: ROSE_700 }}
      >
        See your top match
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </a>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 sm:max-w-[640px]">
        {HERO_CARDS.map((card) => (
          <div key={card.id} className="rounded-2xl border border-zinc-200 bg-white p-4">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-zinc-100">
              <Image
                src={`https://images.unsplash.com/photo-${card.photoId}?auto=format&fit=crop&w=480&q=72`}
                alt={card.alt}
                fill
                sizes="(max-width: 640px) 90vw, 300px"
                className="object-cover"
              />
            </div>
            <div className="mt-3 flex items-start justify-between gap-2">
              <div>
                <p className="text-xs font-normal tracking-[0.12em] text-zinc-500">{card.category.toUpperCase()}</p>
                <p className="mt-0.5 text-sm font-semibold text-zinc-950">{card.name}</p>
              </div>
              <span className="flex items-baseline gap-1 whitespace-nowrap">
                <span className="text-sm font-extrabold tabular-nums text-zinc-950">${card.price}</span>
                <span className="text-xs font-normal tabular-nums text-zinc-500 line-through">
                  ${card.originalPrice}
                </span>
              </span>
            </div>
            {/* badge row sits below the photo, never overlaid on it */}
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              <span
                className="rounded-full px-2 py-0.5 text-[11px] font-semibold tabular-nums text-white"
                style={{ backgroundColor: ROSE_700 }}
              >
                {card.match}% match
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-zinc-200 px-2 py-0.5 text-[11px] font-normal text-zinc-600">
                <ShieldCheck className="h-3 w-3" style={{ color: ROSE_600 }} aria-hidden="true" />
                {card.condition}
              </span>
              {card.verified && (
                <span className="inline-flex items-center gap-1 rounded-full border border-zinc-200 px-2 py-0.5 text-[11px] font-normal text-zinc-600">
                  <BadgeCheck className="h-3 w-3" style={{ color: ROSE_600 }} aria-hidden="true" />
                  Verified seller
                </span>
              )}
              <span className="rounded-full border border-zinc-200 px-2 py-0.5 text-[11px] font-semibold tabular-nums text-zinc-600">
                &minus;{discountPct(card)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
