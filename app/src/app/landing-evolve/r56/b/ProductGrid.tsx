"use client";

import { AnimatePresence } from "framer-motion";
import ProductCard from "./ProductCard";
import type { Listing } from "./zones";

export default function ProductGrid({ listings }: { listings: Listing[] }) {
  return (
    <ul
      className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 sm:grid sm:snap-none sm:grid-cols-2 sm:gap-4 sm:overflow-visible lg:grid-cols-4"
      aria-label="Available listings for the selected pickup zone"
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {listings.map((listing) => (
          <ProductCard key={listing.id} listing={listing} />
        ))}
      </AnimatePresence>
    </ul>
  );
}
