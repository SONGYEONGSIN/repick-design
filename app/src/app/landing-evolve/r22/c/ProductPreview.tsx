"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Award, BadgeCheck, ChevronDown, Sparkles, Tag } from "lucide-react";
import { discountPct, LISTINGS, unsplashUrl } from "./data";
import { ACCENT_BRIGHT_HEX, cx, FOCUS, MUTED, NUM, PARA_WIDTH_16, TRACK_EYEBROW } from "./tokens";

/**
 * Section 2 — every listing's proof laid out in full, badges kept in their own row below the photo
 * (never overlaid on it, so a slow-loading image never collides with alt text). The expandable
 * "Why this match" panel is this section's own interaction: it reveals the AI's actual matching
 * rationale rather than asserting a match score with nothing behind it.
 */
export default function ProductPreview() {
  const reduceMotion = useReducedMotion();
  const [openId, setOpenId] = useState<string | null>(LISTINGS[0].id);

  const fadeUp: Variants = reduceMotion
    ? { hidden: { opacity: 1, y: 0 }, show: { opacity: 1, y: 0 } }
    : { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

  return (
    <section id="preview" className="border-t border-[#1C1C22] bg-[#0B0B0F] px-6 py-20 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-[1280px]">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          transition={{ duration: 0.5 }}
        >
          <p className={cx("text-[11px] font-semibold uppercase", TRACK_EYEBROW)} style={{ color: ACCENT_BRIGHT_HEX }}>
            Fig. 02 — matched listings
          </p>
          <h2
            className="mt-3 text-[clamp(1.75rem,1.6vw+1.3rem,2.5rem)] font-extrabold leading-[1.1] tracking-[-0.02em] text-white"
          >
            Every match, shown its work.
          </h2>
          <p className={cx("mt-4 text-[16px] font-normal leading-[1.6]", MUTED, PARA_WIDTH_16)}>
            These are the same four listings feeding the comparison table above. Grade,
            verification and discount sit in their own row under each photo &mdash; open a card to
            see exactly why the AI matched it to you.
          </p>
        </motion.div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {LISTINGS.map((listing, i) => {
            const open = openId === listing.id;
            const panelId = `rationale-panel-${listing.id}`;
            const btnId = `rationale-trigger-${listing.id}`;
            const pct = discountPct(listing.originalPrice, listing.price);
            return (
              <motion.article
                key={listing.id}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-60px" }}
                variants={fadeUp}
                transition={{ duration: 0.45, delay: reduceMotion ? 0 : Math.min(i, 3) * 0.07 }}
                whileHover={reduceMotion ? undefined : { y: -4 }}
                className="min-w-0 overflow-hidden rounded-2xl border border-[#1C1C22] bg-[#111116]"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-800">
                  <Image
                    src={unsplashUrl(listing.photoId, 500)}
                    alt={listing.alt}
                    fill
                    sizes="(min-width: 1024px) 300px, (min-width: 640px) 45vw, 90vw"
                    className="object-cover"
                  />
                </div>

                <div className="p-4">
                  <p className="truncate text-[10.5px] font-semibold uppercase tracking-[0.1em] text-zinc-400">
                    {listing.seller}
                  </p>
                  <h3 className="mt-1 text-[14px] font-semibold leading-[1.3] text-white">
                    {listing.title}
                  </h3>

                  {/* Badge row — separate from the photo frame, never an overlay. */}
                  <div className="mt-3 flex flex-wrap items-center gap-1.5">
                    <span className="inline-flex items-center gap-1 rounded-full border border-[#27272E] px-2 py-0.5 text-[10px] font-semibold text-zinc-300">
                      <Award className="h-3 w-3" style={{ color: ACCENT_BRIGHT_HEX }} aria-hidden="true" />
                      Grade {listing.conditionGrade}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full border border-[#27272E] px-2 py-0.5 text-[10px] font-semibold text-zinc-300">
                      <BadgeCheck className="h-3 w-3" style={{ color: ACCENT_BRIGHT_HEX }} aria-hidden="true" />
                      {listing.verificationLabel}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full border border-[#27272E] px-2 py-0.5 text-[10px] font-semibold text-zinc-300">
                      <Tag className="h-3 w-3" style={{ color: ACCENT_BRIGHT_HEX }} aria-hidden="true" />
                      <span className={NUM}>-{pct}%</span>
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap items-baseline gap-x-2">
                    <span className={cx(NUM, "text-[13px] font-normal text-zinc-400 line-through")}>
                      ${listing.originalPrice.toLocaleString()}
                    </span>
                    <span className={cx(NUM, "text-[17px] font-extrabold text-white")}>
                      ${listing.price.toLocaleString()}
                    </span>
                  </div>

                  <span className={cx(NUM, "mt-2 flex items-center gap-1 text-[11px] font-semibold")} style={{ color: ACCENT_BRIGHT_HEX }}>
                    <Sparkles className="h-3 w-3" aria-hidden="true" />
                    {listing.matchPct}% AI match
                  </span>

                  <button
                    id={btnId}
                    type="button"
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => setOpenId(open ? null : listing.id)}
                    className={cx(
                      "mt-3 flex w-full items-center justify-between gap-2 rounded-lg border border-[#27272E] px-3 py-2 text-left text-[11.5px] font-semibold text-zinc-200 transition-colors duration-150 hover:border-white/25",
                      FOCUS,
                    )}
                  >
                    Why this match
                    <ChevronDown
                      className={cx("h-3.5 w-3.5 shrink-0 transition-transform duration-200 motion-reduce:transition-none", open && "rotate-180")}
                      aria-hidden="true"
                    />
                  </button>

                  <div
                    aria-hidden={!open}
                    className={cx(
                      "grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none",
                      open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                    )}
                  >
                    <div className="overflow-hidden">
                      <ul id={panelId} aria-labelledby={btnId} className="mt-2 flex flex-col gap-1.5 pl-0.5">
                        {listing.matchTags.map((tag) => (
                          <li key={tag} className="flex items-start gap-1.5 text-[11.5px] font-normal leading-[1.5] text-zinc-400">
                            <span
                              aria-hidden="true"
                              className="mt-1.5 h-1 w-1 shrink-0 rounded-full"
                              style={{ backgroundColor: ACCENT_BRIGHT_HEX }}
                            />
                            {tag}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
