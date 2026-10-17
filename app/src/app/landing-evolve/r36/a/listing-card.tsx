"use client";

import { useState } from "react";
import Image from "next/image";
import { BadgeCheck, ChevronDown, CircleDashed } from "lucide-react";
import { categoryById, computeAiPrice, deltaPct, formatDelta, gradeById, isVerified, money, type Item } from "./data";
import { CAPTION, FOCUS_RING } from "./tokens";

export function ListingCard({ item, preload = false }: { item: Item; preload?: boolean }) {
  const [open, setOpen] = useState(false);
  const category = categoryById(item.categoryId);
  const grade = gradeById(item.gradeId);
  const aiPrice = computeAiPrice(item);
  const delta = deltaPct(item.listedPrice, aiPrice);
  const verified = isVerified(item.gradeId);
  const panelId = `${item.id}-why`;

  return (
    <article className="flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white">
      <div className="relative aspect-[4/3] w-full flex-none bg-zinc-100">
        <Image
          src={`https://images.unsplash.com/photo-${category.photoId}?auto=format&fit=crop&w=640&q=70`}
          alt={`${category.label} comparable, ${grade.label} condition grade`}
          fill
          sizes="(min-width: 1024px) 280px, (min-width: 640px) 45vw, 90vw"
          className="object-cover"
          preload={preload}
        />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className={`${CAPTION} text-zinc-500`}>{category.label}</p>
        <h3 className="mt-1 text-base font-extrabold tracking-[-0.01em] text-zinc-950">{item.short}</h3>

        <div className="mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="text-sm font-normal text-zinc-500 line-through">{money(item.listedPrice)}</span>
          <span className="text-xl font-extrabold text-zinc-950">{money(aiPrice)}</span>
          <span className="text-xs font-semibold text-teal-700">{formatDelta(delta)}</span>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-teal-600 px-2.5 py-1 text-xs font-semibold text-zinc-950">
            {item.matchPct}% match
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-zinc-200 px-2.5 py-1 text-xs font-semibold text-zinc-700">
            Grade {grade.label}
          </span>
          {verified ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-zinc-200 px-2.5 py-1 text-xs font-semibold text-zinc-700">
              <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" strokeWidth={2} />
              Verified
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full border border-zinc-200 px-2.5 py-1 text-xs font-semibold text-zinc-500">
              <CircleDashed className="h-3.5 w-3.5" aria-hidden="true" strokeWidth={2} />
              Pending
            </span>
          )}
        </div>

        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((v) => !v)}
          className={`mt-4 flex min-h-9 items-center gap-1 text-xs font-semibold text-zinc-950 ${FOCUS_RING}`}
        >
          <ChevronDown
            className={`h-3.5 w-3.5 transition-transform motion-reduce:transition-none ${open ? "rotate-180" : ""}`}
            aria-hidden="true"
          />
          What the grade is based on
        </button>
        <p id={panelId} hidden={!open} className="mt-1.5 text-xs font-normal leading-[1.6] text-zinc-600">
          {item.reasonTags.join(" · ")}
        </p>
      </div>
    </article>
  );
}
