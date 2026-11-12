import Image from "next/image";
import { BadgeCheck } from "lucide-react";
import { LISTINGS } from "./data";
import { discountPct, formatUsd, gradeLabel } from "./score-math";
import { BORDER, SURFACE } from "./theme";
import { Reveal } from "./Reveal";
import { SectionIntro } from "./ui";

/**
 * Section 2 — the full four-listing catalog, each card showing its
 * fully-graded numbers (confidence at reveal = 100). Badges sit in their
 * own row below the photo, never overlaid on it, and the image container
 * reserves a fixed aspect ratio + background color so a failed/slow load
 * never collides with alt text.
 */
export default function ProductPreview() {
  return (
    <section id="preview" className="border-b py-16 sm:py-20" style={{ borderColor: BORDER }}>
      <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8">
        <SectionIntro
          eyebrow="THE CATALOG"
          heading="Every listing gets the same read."
          body="These four are what the divider above is pulled from. Each card shows the fully-graded number — the one the overlay reaches once it's swept all the way across the photo."
        />
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {LISTINGS.map((listing, i) => {
            const grade = gradeLabel(listing.maxConfidence);
            const discount = discountPct(listing);
            return (
              <Reveal key={listing.id} delay={i * 0.06} className="h-full">
                <div
                  className="flex h-full flex-col overflow-hidden rounded-xl border transition-transform duration-200 ease-out hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                  style={{ borderColor: BORDER, backgroundColor: SURFACE }}
                >
                  <div className="relative aspect-[4/3] w-full" style={{ backgroundColor: "#1C1D26" }}>
                    <Image
                      src={`https://images.unsplash.com/photo-${listing.photoId}?auto=format&fit=crop&w=480&q=72`}
                      alt={`${listing.title}, secondhand, ${listing.grade.toLowerCase()} condition`}
                      fill
                      sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 310px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-2 p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#A1A1AA]">
                      {listing.category}
                    </p>
                    <p className="text-sm font-semibold leading-[1.4] text-white">{listing.title}</p>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="text-base font-extrabold tabular-nums text-white">
                        {formatUsd(listing.price)}
                      </span>
                      <span className="text-xs font-normal tabular-nums text-[#A1A1AA] line-through">
                        {formatUsd(listing.originalPrice)}
                      </span>
                    </div>
                    <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-2">
                      <span
                        className="rounded-full border px-2 py-0.5 text-[11px] font-semibold tabular-nums"
                        style={{ borderColor: "rgba(34,211,238,0.3)", color: "#22D3EE" }}
                      >
                        {listing.maxConfidence}% match
                      </span>
                      <span className="rounded-full border px-2 py-0.5 text-[11px] font-normal text-[#A1A1AA]" style={{ borderColor: BORDER }}>
                        {grade}
                      </span>
                      <span className="rounded-full border px-2 py-0.5 text-[11px] font-semibold tabular-nums" style={{ borderColor: BORDER, color: "#A1A1AA" }}>
                        &minus;{discount}%
                      </span>
                    </div>
                    {listing.certified ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-normal text-[#A1A1AA]">
                        <BadgeCheck className="h-3 w-3" style={{ color: "#22D3EE" }} aria-hidden />
                        Authenticity certified
                      </span>
                    ) : (
                      <span className="text-[11px] font-normal text-[#A1A1AA]">Certification pending</span>
                    )}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
