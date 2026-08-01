import type { Metadata } from "next";
import { CatalogClient } from "./catalog-client";

export const metadata: Metadata = {
  title: "Overlook — An Archive of Independent Reporting",
  description:
    "Overlook is an independent research and culture archive. A top filter bar narrows a magazine-style grid of uneven-sized dispatch cards by topic, format and access, with a live result count, sortable order, a grid/list toggle, and load-more pagination.",
};

export default function Page() {
  return (
    <div className="flex min-h-dvh flex-col bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800">
        <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-4 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber-300">Independent since 2019</p>
          <h1 className="font-[family-name:var(--font-display-wide)] text-4xl font-semibold tracking-tight text-zinc-50 sm:text-5xl">
            Overlook
          </h1>
          <p className="max-w-xl text-sm font-normal leading-relaxed text-zinc-400 sm:text-base">
            Long-form reporting, essays and data stories on technology, culture, business, science, design and
            politics — filed by a small, independent newsroom with no ads and no algorithm.
          </p>
        </div>
      </header>

      <CatalogClient />
    </div>
  );
}
