"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Heart, RotateCcw, X } from "lucide-react";
import Image from "next/image";

import type { Decision, Listing } from "./lib";
import { CATEGORY_ICON, FOCUS_RING, ProofBadges } from "./ui";

interface DeckCardProps {
  listing: Listing | null;
  position: number;
  total: number;
  matchPct: number;
  reason: string;
  announcement: string;
  onDecide: (id: string, decision: Decision) => void;
  onReset: () => void;
}

export default function DeckCard({
  listing,
  position,
  total,
  matchPct,
  reason,
  announcement,
  onDecide,
  onReset,
}: DeckCardProps) {
  const prefersReducedMotion = useReducedMotion();

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (!listing) return;
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      onDecide(listing.id, "pass");
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      onDecide(listing.id, "like");
    }
  }

  return (
    <div className="w-full">
      <div className="flex items-baseline justify-between">
        <p
          className="text-[12px] font-semibold uppercase text-zinc-500"
          style={{ letterSpacing: "0.16em" }}
        >
          Your deck
        </p>
        <p className="text-[12px] font-normal text-zinc-500 tabular-nums" style={{ letterSpacing: "0.12em" }}>
          {Math.min(position + 1, total)}/{total}
        </p>
      </div>

      <div
        tabIndex={listing ? 0 : -1}
        role="group"
        aria-label={
          listing
            ? `Listing ${Math.min(position + 1, total)} of ${total}: ${listing.title}. Use the Pass and Like buttons, or the left and right arrow keys, to decide.`
            : undefined
        }
        onKeyDown={handleKeyDown}
        className={`mt-2 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 sm:p-5 ${FOCUS_RING}`}
      >
        <AnimatePresence mode="wait" initial={false}>
          {listing ? (
            <motion.div
              key={listing.id}
              initial={prefersReducedMotion ? undefined : { opacity: 0, x: 14 }}
              animate={{ opacity: 1, x: 0 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, x: -14 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.22, ease: "easeOut" }}
            >
              <div className="relative h-40 w-full overflow-hidden rounded-xl bg-zinc-200 sm:h-48">
                <Image
                  src={listing.image}
                  alt={listing.imageAlt}
                  fill
                  sizes="(min-width: 1024px) 420px, 90vw"
                  className="object-cover"
                />
              </div>

              <div className="mt-3 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-[15px] font-semibold text-zinc-900">{listing.title}</p>
                  <p className="truncate text-[12.5px] font-normal text-zinc-500">
                    Sold by {listing.seller}
                  </p>
                </div>
                <CategoryGlyph category={listing.category} />
              </div>

              <div className="mt-3">
                <ProofBadges listing={listing} matchPct={matchPct} reason={reason} />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => onDecide(listing.id, "pass")}
                  aria-label={`Pass on ${listing.title}`}
                  className={`inline-flex items-center justify-center gap-2 rounded-full border border-zinc-300 bg-white px-4 py-2.5 text-[14px] font-semibold text-zinc-700 transition-colors hover:border-zinc-400 hover:bg-zinc-100 ${FOCUS_RING}`}
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                  Pass
                </button>
                <button
                  type="button"
                  onClick={() => onDecide(listing.id, "like")}
                  aria-label={`Like ${listing.title}`}
                  className={`inline-flex items-center justify-center gap-2 rounded-full bg-zinc-900 px-4 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-zinc-800 ${FOCUS_RING}`}
                >
                  <Heart className="h-4 w-4" aria-hidden="true" />
                  Like
                </button>
              </div>
              <p className="mt-2 text-[11.5px] font-normal text-zinc-500">
                Arrow keys work too — left to pass, right to like.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="done"
              initial={prefersReducedMotion ? undefined : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.22, ease: "easeOut" }}
              className="py-6 text-center"
            >
              <p className="text-[15px] font-semibold text-zinc-900">You&apos;ve reviewed every pick.</p>
              <p className="mx-auto mt-1 max-w-[320px] text-[13px] font-normal leading-[1.5] text-zinc-500">
                Your preference profile below reflects all {total} decisions. Start over to build a
                fresh one.
              </p>
              <button
                type="button"
                onClick={onReset}
                className={`mt-4 inline-flex items-center gap-2 rounded-full border border-zinc-300 bg-white px-4 py-2.5 text-[14px] font-semibold text-zinc-700 transition-colors hover:border-zinc-400 hover:bg-zinc-100 ${FOCUS_RING}`}
              >
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                Start over
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p role="status" aria-live="polite" className="sr-only">
        {announcement}
      </p>
    </div>
  );
}

function CategoryGlyph({ category }: { category: Listing["category"] }) {
  const Icon = CATEGORY_ICON[category];
  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-white">
      <Icon className="h-4 w-4 text-zinc-500" aria-hidden="true" />
    </span>
  );
}
