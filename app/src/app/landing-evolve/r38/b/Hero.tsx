import Image from "next/image";
import { BadgeCheck } from "lucide-react";
import SplitDevice from "./SplitDevice";
import { Eyebrow } from "./ui";
import { ACCENT_FILL, BORDER, FOCUS, SURFACE } from "./theme";
import { LISTINGS } from "./data";
import { confidenceAt, discountPct, formatUsd, gradeLabel } from "./score-math";

/**
 * Hero carries the device (SplitDevice: tabs + drag-divider + live stats)
 * AND the product-preview proof cards (match %, grade, certification,
 * discount) physically inside this one component's own grid — a 5/7
 * copy/device split on row one, then a full-width proof row underneath,
 * never a separate section below the fold. The left proof card always
 * tracks whichever listing is currently selected in the device (live,
 * labeled "Live read"); the other two are the remaining listings at their
 * own fully-graded numbers (labeled "Fully graded"), so the row never
 * shows the same listing twice.
 */
export default function Hero({
  selectedId,
  onSelect,
  reveal,
  onRevealChange,
}: {
  selectedId: string;
  onSelect: (id: string) => void;
  reveal: number;
  onRevealChange: (n: number) => void;
}) {
  const liveListing = LISTINGS.find((l) => l.id === selectedId) ?? LISTINGS[0];
  const liveConfidence = confidenceAt(liveListing, reveal);
  const others = LISTINGS.filter((l) => l.id !== selectedId).slice(0, 2);

  return (
    <section className="border-b pt-14 pb-16 sm:pt-16 lg:pb-24 lg:pt-20" style={{ borderColor: BORDER }}>
      <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start lg:gap-10">
          <div className="lg:col-span-5">
            <Eyebrow>LIVE AI GRADING</Eyebrow>
            <h1
              className="mt-5 text-[clamp(2.2rem,1.7rem+2.2vw,4rem)] font-extrabold leading-[1.03] tracking-[-0.02em] text-white"
              style={{ fontFamily: "var(--font-display-grotesk)" }}
            >
              Drag the line.
              <br />
              Watch the grade move.
            </h1>
            <p className="mt-6 text-lg font-normal leading-[1.6] text-white/80" style={{ maxWidth: "540px" }}>
              Every repick listing ships with this exact readout. Pull the divider across the photo on
              the right and the confidence score, the fair-price estimate and the checks found all
              update before you let go.
            </p>
            <div className="mt-8">
              <a
                href="#preview"
                className={`inline-flex items-center justify-center rounded-full px-7 py-3.5 text-base font-semibold text-white transition-opacity duration-200 hover:opacity-90 motion-reduce:transition-none ${FOCUS}`}
                style={{ backgroundColor: ACCENT_FILL }}
              >
                Open today&rsquo;s graded catalog
              </a>
            </div>
            <p className="mt-4 text-sm font-normal leading-[1.6] text-[#A1A1AA]" style={{ maxWidth: "480px" }}>
              Four real listings, one divider. Switching listings changes the starting and ending
              confidence too — it isn&rsquo;t the same curve stretched over a different photo.
            </p>
          </div>

          <div className="lg:col-span-7">
            <SplitDevice selectedId={selectedId} onSelect={onSelect} reveal={reveal} onRevealChange={onRevealChange} />
          </div>

          <div className="lg:col-span-12">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#A1A1AA]">
              Proof, not a promise
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <ProofCard listing={liveListing} match={liveConfidence} live />
              {others.map((l) => (
                <ProofCard key={l.id} listing={l} match={l.maxConfidence} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProofCard({
  listing,
  match,
  live,
}: {
  listing: (typeof LISTINGS)[number];
  match: number;
  live?: boolean;
}) {
  const grade = gradeLabel(match);
  const discount = discountPct(listing);
  return (
    <div className="overflow-hidden rounded-xl border" style={{ borderColor: BORDER, backgroundColor: SURFACE }}>
      <div className="relative aspect-[4/3] w-full" style={{ backgroundColor: "#1C1D26" }}>
        <Image
          src={`https://images.unsplash.com/photo-${listing.photoId}?auto=format&fit=crop&w=400&q=70`}
          alt={`${listing.title}, secondhand, ${listing.grade.toLowerCase()} condition`}
          fill
          sizes="(max-width: 1024px) 50vw, 300px"
          className="object-cover"
        />
      </div>
      <div className="flex flex-col gap-2 p-3">
        <p className="truncate text-sm font-semibold text-white">{listing.title}</p>
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-extrabold tabular-nums text-white">{formatUsd(listing.price)}</span>
          <span className="text-xs font-normal tabular-nums text-[#A1A1AA] line-through">
            {formatUsd(listing.originalPrice)}
          </span>
          <span className="text-xs font-semibold tabular-nums" style={{ color: "#22D3EE" }}>
            &minus;{discount}%
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <span
            className="rounded-full border px-2 py-0.5 text-[11px] font-semibold tabular-nums"
            style={{ borderColor: "rgba(34,211,238,0.3)", color: "#22D3EE" }}
          >
            {match}% match{live ? " — live" : ""}
          </span>
          <span className="rounded-full border px-2 py-0.5 text-[11px] font-normal text-[#A1A1AA]" style={{ borderColor: BORDER }}>
            {grade}
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
  );
}
