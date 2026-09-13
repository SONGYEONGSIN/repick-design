"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import type { Listing } from "./data";
import { unsplashUrl } from "./data";
import { ACCENT_BRIGHT_HEX, ACCENT_HEX, cx, NUM, PEER_FOCUS } from "./tokens";

interface ListingChipProps {
  listing: Listing;
  selected: boolean;
  disabled: boolean;
  disabledReason?: string;
  onToggle: () => void;
}

/**
 * A selectable listing card backed by a real, always-in-the-DOM checkbox: the input carries the
 * actual role/name/state (visually `sr-only`, never `display:none`, so it stays in the accessibility
 * tree and focusable), and the surrounding label is what's painted — including the focus ring, via
 * `peer-focus-visible:` on the visible wrapper, since the input itself is never seen to focus on.
 * Selected / disabled visuals are driven straight off props rather than `:checked`/`:disabled`
 * pseudo-classes, since the parent already computes both and this avoids depending on `:has()`.
 */
export default function ListingChip({
  listing,
  selected,
  disabled,
  disabledReason,
  onToggle,
}: ListingChipProps) {
  const reduceMotion = useReducedMotion();
  const hintId = `chip-hint-${listing.id}`;

  return (
    <label
      className={cx(
        "relative flex min-w-0 flex-col",
        disabled ? "cursor-not-allowed" : "cursor-pointer",
      )}
    >
      {/* The real control: sr-only, never display:none, so it stays focusable and in the a11y tree.
          Its sibling below reacts to `:focus-visible` on this input via `peer-focus-visible:` —
          `peer` must sit on the element that gets focus, and the styled node must be its sibling,
          not an ancestor, which is why the visual card is a separate div rather than the label itself. */}
      <input
        type="checkbox"
        className="peer sr-only"
        checked={selected}
        disabled={disabled}
        onChange={onToggle}
        aria-describedby={hintId}
      />

      <motion.div
        whileHover={reduceMotion || disabled ? undefined : { y: -3 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className={cx(
          "flex min-w-0 flex-col rounded-2xl border p-3 transition-colors duration-150",
          disabled && "opacity-50",
          selected ? "bg-white/[0.04]" : "bg-transparent",
          !selected && !disabled && "hover:border-white/20",
          PEER_FOCUS,
        )}
        style={{ borderColor: selected ? ACCENT_HEX : "#27272E" }}
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-zinc-800">
          <Image
            src={unsplashUrl(listing.photoId, 400)}
            alt={listing.alt}
            fill
            sizes="(min-width: 640px) 200px, 45vw"
            className="object-cover"
          />
        </div>

        {/* Badges live in their own row below the photo frame — never absolute-positioned on top of it. */}
        <div className="mt-2.5 flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-[12.5px] font-semibold text-white">{listing.title}</p>
            <p className="mt-0.5 truncate text-[11px] font-normal text-zinc-400">{listing.seller}</p>
          </div>
          <span
            aria-hidden="true"
            className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors duration-150"
            style={{
              borderColor: selected ? ACCENT_HEX : "#3F3F46",
              backgroundColor: selected ? ACCENT_HEX : "transparent",
            }}
          >
            {selected && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />}
          </span>
        </div>

        <div
          className={cx(NUM, "mt-2 flex items-center gap-1 text-[11px] font-semibold")}
          style={{ color: ACCENT_BRIGHT_HEX }}
        >
          <Sparkles className="h-3 w-3" aria-hidden="true" />
          {listing.matchPct}% match
        </div>
      </motion.div>

      <p id={hintId} className="sr-only font-normal">
        {disabledReason ??
          (selected ? "Selected — in your comparison table" : "Add to comparison table")}
      </p>
    </label>
  );
}
