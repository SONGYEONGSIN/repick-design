import Image from "next/image";
import { BadgeCheck } from "lucide-react";
import { SOLD_COMPS } from "./data";
import { SectionIntro } from "./ui";

export function RecentSold() {
  return (
    <section id="sold" className="border-t border-white/10 py-20 sm:py-28">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <SectionIntro
          eyebrow="PRICED AGAINST REAL SALES"
          heading="Items like yours, sold recently."
          body="The estimate above is not a guess — it is pulled from the same comparable sales shown here, re-weighted for the category, condition and brand tier you pick."
        />

        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SOLD_COMPS.map((comp) => (
            <li key={comp.id} className="flex min-w-0 flex-col rounded-2xl border border-white/10 bg-white/[0.02]">
              <div className="relative aspect-[4/5] overflow-hidden rounded-t-2xl bg-zinc-900">
                <Image
                  src={`https://images.unsplash.com/photo-${comp.photoId}?auto=format&fit=crop&w=480&q=80`}
                  alt={comp.name}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              {/* Sold badge lives in its own row below the photo, never overlaid on it. */}
              <div className="flex flex-1 flex-col p-4">
                <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-300">
                  <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
                  Sold
                </span>
                <h3 className="mt-2.5 text-sm font-bold text-white">{comp.name}</h3>
                <p className="mt-1 text-[12px] text-zinc-400">{comp.meta}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[12px] font-semibold text-zinc-300">Grade {comp.grade}</span>
                  <span className="text-base font-bold tabular-nums text-white">${comp.soldPrice}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
