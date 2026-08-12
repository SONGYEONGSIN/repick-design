"use client";

import { motion } from "framer-motion";
import { Check, Minus, ShieldCheck, Tag, X } from "lucide-react";
import { Silhouette } from "./silhouette";
import { GRADE_META, money, type Scored } from "./data";

/**
 * Every badge sits in its own row below the image frame, never on top of it: an overlay badge
 * collides with alt text the moment an image fails, and the grade / verification / discount are the
 * part of this card that must survive that failure.
 */
export default function ListingCard({
  scored,
  rank,
  reduced,
}: {
  scored: Scored;
  rank: number;
  reduced: boolean;
}) {
  const { listing, score, discount, tags } = scored;
  const grade = GRADE_META[listing.grade];

  return (
    <motion.li
      layout
      exit={{ opacity: 0 }}
      transition={{ duration: reduced ? 0 : 0.42, ease: [0.22, 1, 0.36, 1] }}
      className="min-w-0"
    >
      <article className="flex h-full flex-col rounded-2xl border border-[#232329] bg-[#101015] p-4 transition-colors duration-200 hover:border-[#4A3F73]">
        <div className="flex items-center justify-between gap-2">
          <span
            className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#A1A1AA]"
            style={{ fontFamily: "var(--font-display-mono)" }}
          >
            Rank {rank}
          </span>
          <span
            className="rounded-full border border-[#6E56CF] bg-[#6E56CF]/20 px-2 py-0.5 text-[11px] font-semibold tracking-[0.12em] text-[#D5CBF6] tabular-nums"
            style={{ fontFamily: "var(--font-display-mono)" }}
          >
            {score}% MATCH
          </span>
        </div>

        <div className="mt-3 aspect-[5/3] w-full rounded-xl bg-[#17171E] p-3">
          <Silhouette category={listing.category} />
        </div>

        <h3 className="mt-4 text-[16px] font-semibold leading-[1.35] text-white">{listing.name}</h3>
        <p className="mt-1 text-[13px] leading-[1.5] text-[#A1A1AA]">
          {listing.seller} · {listing.spec}
        </p>

        <ul className="mt-3 flex flex-wrap gap-1.5">
          <li className="inline-flex items-center gap-1 rounded-md border border-[#2E2E38] px-2 py-1 text-[11px] font-semibold tracking-[0.06em] text-[#E7E7EC]">
            Grade {grade.code} · {grade.label}
          </li>
          <li className="inline-flex items-center gap-1 rounded-md border border-[#2E2E38] px-2 py-1 text-[11px] font-semibold tracking-[0.06em] text-[#E7E7EC]">
            {listing.verified ? (
              <ShieldCheck aria-hidden="true" className="size-3.5 text-[#B6A6F2]" />
            ) : (
              <X aria-hidden="true" className="size-3.5 text-[#E8A87C]" />
            )}
            {listing.verified ? "ID-verified" : "Unverified"}
          </li>
          <li className="inline-flex items-center gap-1 rounded-md border border-[#2E2E38] px-2 py-1 text-[11px] font-semibold tracking-[0.06em] text-[#E7E7EC]">
            <Tag aria-hidden="true" className="size-3.5 text-[#B6A6F2]" />
            <span className="tabular-nums">{discount}% off</span>
          </li>
        </ul>

        <p className="mt-3 flex flex-wrap items-baseline gap-2">
          <span
            className="text-2xl font-extrabold tabular-nums text-white"
            style={{ fontFamily: "var(--font-display-mono)", letterSpacing: "-0.02em" }}
          >
            {money(listing.price)}
          </span>
          <span className="text-[13px] text-[#A1A1AA]">
            was <span className="tabular-nums line-through">{money(listing.listPrice)}</span>
          </span>
        </p>

        <div className="mt-4">
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#A1A1AA]">
              Match to the brief
            </span>
            <span
              className="text-[13px] font-semibold tabular-nums text-[#D5CBF6]"
              style={{ fontFamily: "var(--font-display-mono)" }}
            >
              {score}%
            </span>
          </div>
          <div aria-hidden="true" className="mt-1.5 h-1 w-full rounded-full bg-[#26262E]">
            <motion.div
              initial={false}
              animate={{ scaleX: score / 100 }}
              transition={{ duration: reduced ? 0 : 0.42, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: "left" }}
              className="h-full w-full rounded-full bg-[#6E56CF]"
            />
          </div>
        </div>

        <ul className="mt-4 flex flex-col gap-1.5">
          {tags.map((tag) => (
            <li key={tag.text} className="flex gap-2 text-[12px] leading-[1.5] text-[#A1A1AA]">
              {tag.tone === "match" ? (
                <Check aria-hidden="true" className="mt-0.5 size-3.5 shrink-0 text-[#B6A6F2]" />
              ) : (
                <Minus aria-hidden="true" className="mt-0.5 size-3.5 shrink-0 text-[#E8A87C]" />
              )}
              <span>{tag.text}</span>
            </li>
          ))}
        </ul>
      </article>
    </motion.li>
  );
}
