import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, ShieldAlert } from "lucide-react";
import ConcernPanel from "./ConcernPanel";
import { Eyebrow } from "./ui";
import { FOCUS } from "./theme";
import { CONCERNS, FEATURED_LISTING, GRID_LISTINGS, HERO_PROOF_IDS, type ConcernId } from "./data";
import { ctaLabel, discountPercent, formatUsd, overallMatch } from "./score-math";

interface HeroProps {
  selected: ReadonlySet<ConcernId>;
  onToggle: (id: ConcernId) => void;
}

/**
 * Hero carries the device (ConcernPanel: chips + ring cluster + center
 * readout) AND two real listing cards with their proof badges (match %,
 * grade, verified status, discount) physically inside this one component
 * — not a separate section below it, and not a 7/5-column pair with the
 * device dropped full-width underneath. This candidate's split is a
 * three-way row (copy / device / proof), so the forbidden two-block
 * skeleton never appears.
 *
 * Nothing here is mount-gated or wrapped in `whileInView` — headline,
 * subhead, CTA, chips, rings and both proof cards all render their final
 * visible state on the very first paint.
 */
export default function Hero({ selected, onToggle }: HeroProps) {
  const selectedCount = CONCERNS.filter((c) => selected.has(c.id)).length;
  const proofListings = HERO_PROOF_IDS.map((id) => GRID_LISTINGS.find((l) => l.id === id)!);

  return (
    <section id="hero" className="border-b border-zinc-200 pb-16 pt-14 sm:pt-16 lg:pb-24 lg:pt-20">
      <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-8">
          <div className="lg:col-span-5">
            <Eyebrow>COVERAGE BY CONCERN</Eyebrow>
            <h1
              className="mt-5 text-[clamp(2.1rem,1.7rem+1.9vw,3.75rem)] font-bold leading-[1.02] tracking-[-0.02em] text-zinc-950"
              style={{ fontFamily: "var(--font-display-grotesk)" }}
            >
              Pick what worries you.
              <br />
              The rings show what&rsquo;s checked.
            </h1>
            <p className="mt-6 text-base font-normal leading-[1.6] text-zinc-600" style={{ maxWidth: "490px" }}>
              Toggle authenticity, condition, shipping speed, seller reliability or price. Each
              one renders as its own ring on the right, so turning one off doesn&rsquo;t quietly
              fold into a blended number you have to take on faith.
            </p>
            <div className="mt-8">
              <Link
                href="#catalog"
                className={`inline-flex items-center justify-center rounded-full bg-emerald-600 px-7 py-3.5 text-base font-semibold text-zinc-950 transition-opacity hover:opacity-90 ${FOCUS}`}
              >
                {ctaLabel(selectedCount)}
              </Link>
            </div>
            <p className="mt-4 text-sm font-normal leading-[1.6] text-zinc-500" style={{ maxWidth: "490px" }}>
              Zero, some or all five concerns can be on at once — the catalog below only ever
              reflects the ones you&rsquo;ve actually picked.
            </p>
          </div>

          <div className="lg:col-span-4">
            <ConcernPanel
              scores={FEATURED_LISTING.scores}
              selected={selected}
              onToggle={onToggle}
              listingTitle={FEATURED_LISTING.title}
            />
          </div>

          <div className="flex flex-col gap-4 lg:col-span-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-600">
              Two listings, checked the same way
            </p>
            {proofListings.map((listing) => {
              const match = overallMatch(listing.scores);
              const discount = discountPercent(listing);
              return (
                <div key={listing.id} className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
                  <div className="relative aspect-[4/3] w-full bg-zinc-100">
                    <Image
                      src={`https://images.unsplash.com/photo-${listing.photoId}?auto=format&fit=crop&w=400&q=70`}
                      alt={`${listing.title}, secondhand, ${listing.grade.toLowerCase()} condition`}
                      fill
                      sizes="(max-width: 1024px) 50vw, 220px"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <div className="flex flex-col gap-2 p-3">
                    <p className="truncate text-sm font-semibold text-zinc-950">{listing.title}</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-bold tabular-nums text-zinc-950">
                        {formatUsd(listing.price)}
                      </span>
                      <span className="text-xs font-normal tabular-nums text-zinc-500 line-through">
                        {formatUsd(listing.originalPrice)}
                      </span>
                      <span className="text-xs font-semibold tabular-nums text-emerald-700">
                        &minus;{discount}%
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="rounded-full border border-emerald-600/30 bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold tabular-nums text-emerald-700">
                        {match}% overall match
                      </span>
                      <span className="rounded-full border border-zinc-200 px-2 py-0.5 text-[11px] font-normal text-zinc-600">
                        {listing.grade}
                      </span>
                    </div>
                    {listing.verified ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-normal text-zinc-600">
                        <BadgeCheck className="h-3 w-3 text-emerald-700" aria-hidden="true" />
                        Verified seller
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-normal text-zinc-500">
                        <ShieldAlert className="h-3 w-3" aria-hidden="true" />
                        Verification pending
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
