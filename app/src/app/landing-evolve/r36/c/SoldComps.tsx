"use client";

import { useState } from "react";
import Image from "next/image";
import { BadgeCheck, ChevronDown } from "lucide-react";
import Reveal from "./Reveal";
import { SectionIntro } from "./ui";
import { FOCUS } from "./theme";
import { CATEGORY_ORDER, CATEGORIES, formatUsd, type CategoryId } from "./categories";

interface SoldCompsProps {
  selected: CategoryId[];
}

/**
 * Rich sold-item cards for the categories currently selected above — this
 * route's version of the brief's "product preview" structural element,
 * adapted for a seller audience (a real sold comparable per category
 * instead of a buyer-facing match-% / discount-% card). The accordion
 * disclosure on each card is this route's 4th required interaction.
 *
 * Image containers reserve a fixed `aspect-[4/3]` + background color so a
 * slow or failed image load never collapses the card. The verified-sale
 * badge and payout figure sit in their own row *below* the photo frame,
 * never as an absolute overlay on top of it, so a broken image's alt
 * text never collides with badge text.
 */
export default function SoldComps({ selected }: SoldCompsProps) {
  const [openId, setOpenId] = useState<CategoryId | null>(null);
  const ids = CATEGORY_ORDER.filter((id) => selected.includes(id));

  return (
    <section id="sold" className="border-b border-zinc-200 py-20 sm:py-28">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <SectionIntro
          eyebrow="RECENTLY SOLD, IN YOUR CATEGORIES"
          heading="One real sale per category, not a composite."
          body="A single verified sale per category you've selected above — the exact item, what it sold for, and how its own time-to-sell compared with the category median."
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ids.map((id, i) => {
            const stat = CATEGORIES[id];
            const isOpen = openId === id;
            const panelId = `sold-math-${id}`;
            const delta = stat.example.daysToSell - stat.daysToSell;
            const deltaPhrase =
              delta === 0 ? "right at the" : `${Math.abs(delta)} days ${delta < 0 ? "faster" : "slower"} than the`;

            return (
              <Reveal key={id} delay={i * 0.06} className="min-w-0">
                <div className="flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white">
                  <div className="relative aspect-[4/3] w-full shrink-0 bg-zinc-100">
                    <Image
                      src={`https://images.unsplash.com/photo-${stat.photoId}?w=640&h=480&fit=crop&q=80`}
                      alt={`Sold ${stat.label.toLowerCase()} listing: ${stat.example.item}`}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>

                  <div className="flex flex-1 flex-col p-4">
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-600">{stat.label}</p>
                    <p className="mt-1 truncate text-sm font-extrabold text-zinc-950">{stat.example.item}</p>

                    <div className="mt-3 flex items-center justify-between gap-2">
                      <span className="text-lg font-extrabold tabular-nums text-zinc-950">
                        {formatUsd(stat.example.payout)}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-600/30 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.1em] text-emerald-700">
                        <BadgeCheck className="h-3 w-3" aria-hidden="true" />
                        Verified sale
                      </span>
                    </div>

                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpenId(isOpen ? null : id)}
                      className={`mt-3 flex items-center justify-between gap-2 rounded-lg border border-zinc-200 px-3 py-2 text-left text-xs font-bold text-zinc-700 transition-colors hover:border-zinc-950 hover:text-zinc-950 ${FOCUS}`}
                    >
                      {isOpen ? "Hide the math" : "See the math"}
                      <ChevronDown
                        className={`h-3.5 w-3.5 shrink-0 transition-transform motion-reduce:transition-none ${isOpen ? "rotate-180" : ""}`}
                        aria-hidden="true"
                      />
                    </button>

                    {isOpen ? (
                      <p id={panelId} className="mt-2 max-w-[300px] text-xs font-normal leading-[1.6] text-zinc-600">
                        Sold in {stat.example.daysToSell} days &mdash; {deltaPhrase}{" "}
                        {stat.daysToSell}&#8209;day median across {stat.itemsAnalyzed.toLocaleString("en-US")}{" "}
                        {stat.label.toLowerCase()} sales last quarter.
                      </p>
                    ) : null}
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
