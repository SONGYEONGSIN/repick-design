"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, BadgeCheck, ChevronDown, ChevronUp, ShieldCheck, Sparkle, Tag } from "lucide-react";

import {
  CRITERIA_BY_ID,
  DEFAULT_ORDER,
  GhostNumber,
  ListingMark,
  POSITION_SHARES,
  PRESETS,
  type CriterionId,
  leadReason,
  money,
  movement,
  rankListings,
  reasonTag,
  weightAt,
} from "./parts";

export default function RankingBoard() {
  const reduceMotion = useReducedMotion();
  const [order, setOrder] = useState<CriterionId[]>(DEFAULT_ORDER);
  const [pickedId, setPickedId] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState("");

  const ranked = useMemo(() => rankListings(order), [order]);
  const leader = ranked[0];
  const reason = leadReason(ranked, order);
  const moves = movement(ranked);
  const focusId = pickedId ?? leader.listing.id;
  const focused = ranked.find((row) => row.listing.id === focusId) ?? leader;

  const rail = order.map((id, i) => ({
    crit: CRITERIA_BY_ID[id],
    weight: weightAt(i),
    position: i + 1,
    share: POSITION_SHARES[i],
  }));
  const [first, second, third, fourth, fifth] = rail;

  // Position changes are transform-only and short; data rows get a plain ease-out tween rather
  // than a spring, because overshoot on a ranked list reads as sloppy.
  const tween = { type: "tween" as const, duration: reduceMotion ? 0 : 0.3, ease: "easeOut" as const };

  function describe(nextOrder: CriterionId[], prefix: string) {
    const nextRanked = rankListings(nextOrder);
    const top = nextRanked[0];
    return `${prefix} Top pick is now ${top.listing.title} at ${top.pct} percent match.`;
  }

  function move(id: CriterionId, direction: -1 | 1) {
    const from = order.indexOf(id);
    const to = from + direction;
    if (to < 0 || to > order.length - 1) return;
    const next = order.filter((entry) => entry !== id);
    next.splice(to, 0, id);
    setOrder(next);
    setAnnouncement(
      describe(next, `${CRITERIA_BY_ID[id].name} moved to position ${to + 1}.`),
    );
  }

  function applyPreset(label: string, next: CriterionId[]) {
    setOrder(next);
    setAnnouncement(describe(next, `${label} order applied.`));
  }

  function pick(id: string, title: string) {
    setPickedId(id);
    setAnnouncement(`Score breakdown now showing ${title}.`);
  }

  return (
    <>
      <section aria-labelledby="hero-title">
        <div className="mx-auto w-full max-w-[1120px] px-5 py-14 md:px-8 md:py-24">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-12">
            {/* Rail — the input side of the page. */}
            <div className="min-w-0 animate-[rise_0.5s_ease-out_backwards] lg:col-span-5 motion-reduce:animate-none">
              <p className="text-xs font-normal uppercase tracking-[0.28em] text-zinc-600">
                repick · AI-picked secondhand
              </p>
              <h1
                id="hero-title"
                className="mt-5 text-[clamp(2.5rem,6.2vw,4.5rem)] font-extrabold leading-[0.95] tracking-[-0.02em]"
                style={{ fontFamily: "var(--font-display-grotesk)" }}
              >
                Order your priorities.
                <br />
                The picks re-rank.
              </h1>
              <p className="mt-6 max-w-[54ch] text-base font-normal leading-[1.6] text-zinc-600">
                repick scores every listing against five criteria. There are no sliders and no
                percentages to guess — put the five in the order you care about, and the ranking,
                the points behind it and the reasoning all recompute in front of you.
              </p>
              <a
                href="#picks"
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#6E56CF] px-6 py-3 text-sm font-semibold text-white transition-transform duration-200 ease-out hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6E56CF] focus-visible:ring-offset-2 motion-reduce:transition-none"
              >
                See tonight&rsquo;s ranked picks
                <ArrowRight aria-hidden="true" className="size-4" />
              </a>

              <div className="mt-12 border-t border-zinc-200 pt-6">
                <GhostNumber value="01" />
                <p className="mt-1 text-xs font-normal uppercase tracking-[0.16em] text-zinc-600">
                  Fig. 01 — Criteria, in the order you set
                </p>
                <h2 className="mt-3 text-xl font-semibold tracking-[-0.02em]">
                  Move a criterion up and it weighs more.
                </h2>

                <ol className="mt-5 flex flex-col gap-2">
                  {rail.map((row, i) => (
                    <motion.li
                      key={row.crit.id}
                      layout
                      transition={tween}
                      className="flex min-w-0 items-start gap-3 border border-zinc-200 bg-white p-3"
                    >
                      <span className="w-4 shrink-0 pt-0.5 text-sm font-semibold tabular-nums">
                        {row.position}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold tracking-[-0.02em]">
                          {row.crit.name}
                        </span>
                        <span className="mt-0.5 block text-xs font-normal leading-[1.5] text-zinc-600">
                          {row.crit.blurb}
                        </span>
                      </span>
                      <span
                        className={
                          i === 0
                            ? "shrink-0 rounded-full bg-[#6E56CF] px-2 py-1 text-xs font-semibold tabular-nums text-white"
                            : "shrink-0 rounded-full bg-zinc-100 px-2 py-1 text-xs font-semibold tabular-nums text-zinc-600"
                        }
                      >
                        &times;{row.weight}
                      </span>
                      <span className="flex shrink-0 gap-1">
                        <button
                          type="button"
                          aria-disabled={i === 0}
                          aria-label={
                            i === 0
                              ? `${row.crit.name} is already the top criterion`
                              : `Move ${row.crit.name} up to position ${row.position - 1}`
                          }
                          onClick={() => move(row.crit.id, -1)}
                          className="inline-flex size-8 items-center justify-center rounded-sm border border-zinc-300 text-zinc-600 transition-colors duration-150 hover:border-[#0B0B0F] hover:text-[#0B0B0F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6E56CF] focus-visible:ring-offset-2 aria-disabled:opacity-30 aria-disabled:hover:border-zinc-300 aria-disabled:hover:text-zinc-600"
                        >
                          <ChevronUp aria-hidden="true" className="size-4" />
                        </button>
                        <button
                          type="button"
                          aria-disabled={i === rail.length - 1}
                          aria-label={
                            i === rail.length - 1
                              ? `${row.crit.name} is already the last criterion`
                              : `Move ${row.crit.name} down to position ${row.position + 1}`
                          }
                          onClick={() => move(row.crit.id, 1)}
                          className="inline-flex size-8 items-center justify-center rounded-sm border border-zinc-300 text-zinc-600 transition-colors duration-150 hover:border-[#0B0B0F] hover:text-[#0B0B0F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6E56CF] focus-visible:ring-offset-2 aria-disabled:opacity-30 aria-disabled:hover:border-zinc-300 aria-disabled:hover:text-zinc-600"
                        >
                          <ChevronDown aria-hidden="true" className="size-4" />
                        </button>
                      </span>
                    </motion.li>
                  ))}
                </ol>

                <div
                  role="group"
                  aria-label="Preset orders"
                  className="mt-5 flex flex-wrap gap-1 rounded-full bg-zinc-100 p-1"
                >
                  {PRESETS.map((preset) => {
                    const active = preset.order.join("|") === order.join("|");
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        aria-pressed={active}
                        onClick={() => applyPreset(preset.label, preset.order)}
                        className={
                          active
                            ? "rounded-full bg-[#0B0B0F] px-3 py-1.5 text-xs font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6E56CF] focus-visible:ring-offset-2"
                            : "rounded-full px-3 py-1.5 text-xs font-semibold text-zinc-600 transition-colors duration-150 hover:text-[#0B0B0F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6E56CF] focus-visible:ring-offset-2"
                        }
                      >
                        {preset.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Results — the output side. Everything here is already populated on first paint. */}
            <div
              id="picks"
              className="relative min-w-0 animate-[rise_0.5s_ease-out_0.08s_backwards] scroll-mt-24 lg:col-span-7 motion-reduce:animate-none"
            >
              <p aria-live="polite" className="sr-only">
                {announcement}
              </p>

              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-xs font-normal uppercase tracking-[0.16em] text-zinc-600">
                    Fig. 02 — Tonight&rsquo;s shortlist, re-scored live
                  </p>
                  <h2 className="mt-2 text-xl font-semibold tracking-[-0.02em]">
                    Four listings, ranked by your order
                  </h2>
                </div>
                <GhostNumber value="02" />
              </div>

              <p className="mt-4 max-w-[62ch] text-lg font-normal leading-[1.5]">
                Ranked mostly by{" "}
                <span className="font-semibold text-[#6E56CF]">{first.crit.name.toLowerCase()}</span>
                , then <span className="font-semibold">{second.crit.name.toLowerCase()}</span>.{" "}
                <span className="text-zinc-600">
                  {third.crit.name.toLowerCase()}, {fourth.crit.name.toLowerCase()} and{" "}
                  {fifth.crit.name.toLowerCase()} only break ties.
                </span>
              </p>

              <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-2 border-y border-zinc-200 py-3">
                {rail.map((row) => (
                  <li
                    key={row.crit.id}
                    className="flex items-center gap-2 text-xs font-normal text-zinc-600"
                  >
                    <span
                      aria-hidden="true"
                      className="size-3 shrink-0 rounded-[2px] border border-zinc-300"
                      style={{ background: row.crit.fill }}
                    />
                    <span className="uppercase tracking-[0.12em]">{row.crit.abbr}</span>
                    <span>{row.crit.name}</span>
                  </li>
                ))}
              </ul>

              <ol className="mt-5 flex flex-col gap-3">
                {ranked.map((row, i) => {
                  const isLeader = i === 0;
                  const isFocused = row.listing.id === focusId;
                  const barLabel = `Point contribution for ${row.listing.title}: ${row.contributions
                    .map((c) => `${CRITERIA_BY_ID[c.id].name} ${c.share} percent`)
                    .join(", ")}.`;
                  return (
                    <motion.li key={row.listing.id} layout transition={tween} className="min-w-0">
                      <article
                        className={`relative flex min-w-0 flex-col gap-4 border p-4 sm:grid sm:grid-cols-[104px_minmax(0,1fr)] sm:gap-5 ${
                          isLeader
                            ? "border-[#6E56CF] bg-[#6E56CF]/5"
                            : isFocused
                              ? "border-[#0B0B0F] bg-white"
                              : "border-zinc-200 bg-white"
                        }`}
                      >
                        <div className="w-24 min-w-0 sm:w-auto">
                          <ListingMark id={row.listing.id} />
                          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] tabular-nums">
                            {i + 1} of {ranked.length}
                          </p>
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              {isLeader ? (
                                <p className="inline-flex items-center gap-1 rounded-full bg-[#6E56CF] px-2 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-white">
                                  Top pick
                                </p>
                              ) : null}
                              <h3 className="mt-1.5 text-base font-semibold tracking-[-0.02em] sm:text-lg">
                                {row.listing.title}
                              </h3>
                              <p className="mt-1 text-xs font-normal leading-[1.5] text-zinc-600">
                                {row.listing.meta}
                              </p>
                              <p className="mt-0.5 text-xs font-normal leading-[1.5] text-zinc-600">
                                Seller: {row.listing.seller}
                              </p>
                            </div>
                            <p className="shrink-0 text-right">
                              <span
                                className="block text-2xl font-extrabold leading-none tracking-[-0.02em] tabular-nums sm:text-3xl"
                                style={{ fontFamily: "var(--font-display-grotesk)" }}
                              >
                                {row.pct}%
                              </span>
                              <span className="mt-1 block text-xs font-normal uppercase tracking-[0.12em] text-zinc-600">
                                match
                              </span>
                            </p>
                          </div>

                          <ul className="mt-3 flex flex-wrap gap-1.5">
                            <li className="inline-flex max-w-full items-center gap-1 rounded-full border border-zinc-300 bg-white px-2 py-1 text-xs font-normal text-zinc-600">
                              <BadgeCheck aria-hidden="true" className="size-3.5 shrink-0" />
                              Grade {row.listing.grade} · {row.listing.gradeNote}
                            </li>
                            <li className="inline-flex max-w-full items-center gap-1 rounded-full border border-zinc-300 bg-white px-2 py-1 text-xs font-normal text-zinc-600">
                              <ShieldCheck aria-hidden="true" className="size-3.5 shrink-0" />
                              ID-verified seller
                            </li>
                            <li className="inline-flex max-w-full items-center gap-1 rounded-full border border-zinc-300 bg-white px-2 py-1 text-xs font-normal tabular-nums text-zinc-600">
                              <Tag aria-hidden="true" className="size-3.5 shrink-0" />
                              {row.listing.off}% off
                            </li>
                            <li className="inline-flex max-w-full items-center gap-1 rounded-full border border-zinc-300 bg-white px-2 py-1 text-xs font-normal text-zinc-600">
                              <Sparkle aria-hidden="true" className="size-3.5 shrink-0" />
                              {reasonTag(row.listing, order)}
                            </li>
                          </ul>

                          <p className="mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                            <span className="sr-only">Was </span>
                            <s className="text-sm font-normal tabular-nums text-zinc-600">
                              {money(row.listing.was)}
                            </s>
                            <span className="sr-only">now </span>
                            <span className="text-lg font-semibold tracking-[-0.02em] tabular-nums">
                              {money(row.listing.now)}
                            </span>
                            <span className="text-xs font-normal uppercase tracking-[0.12em] text-zinc-600">
                              below the 90-day median
                            </span>
                          </p>

                          <div className="mt-4">
                            <div
                              role="img"
                              aria-label={barLabel}
                              className="flex h-2.5 w-full overflow-hidden rounded-full bg-zinc-100"
                            >
                              {row.contributions.map((c) => (
                                <motion.span
                                  key={c.id}
                                  layout
                                  transition={tween}
                                  className="block h-full"
                                  style={{
                                    flexGrow: c.share,
                                    flexBasis: 0,
                                    background: CRITERIA_BY_ID[c.id].fill,
                                  }}
                                />
                              ))}
                            </div>
                            <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs font-normal tabular-nums text-zinc-600">
                              {row.contributions.map((c) => (
                                <span key={c.id}>
                                  <span className="uppercase tracking-[0.12em]">
                                    {CRITERIA_BY_ID[c.id].abbr}
                                  </span>{" "}
                                  {c.points} pts · {c.share}%
                                </span>
                              ))}
                            </p>
                          </div>

                          {isLeader ? (
                            <p className="mt-3 border-t border-zinc-300 pt-3 text-sm font-normal leading-[1.6]">
                              <span className="font-semibold">Why it leads — </span>
                              {reason}
                            </p>
                          ) : null}

                          <button
                            type="button"
                            aria-pressed={isFocused}
                            onClick={() => pick(row.listing.id, row.listing.title)}
                            className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.12em] underline underline-offset-4 transition-colors duration-150 hover:text-[#6E56CF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6E56CF] focus-visible:ring-offset-2"
                          >
                            {isFocused ? "Shown in the breakdown" : "Break this one down"}
                            <ArrowRight aria-hidden="true" className="size-3.5" />
                          </button>
                        </div>
                      </article>
                    </motion.li>
                  );
                })}
              </ol>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="value-title" className="border-t border-zinc-200 bg-zinc-50">
        <div className="mx-auto w-full max-w-[1120px] px-5 py-16 md:px-8 md:py-24">
          <div className="max-w-[62ch]">
            <GhostNumber value="03" />
            <p className="mt-1 text-xs font-normal uppercase tracking-[0.16em] text-zinc-600">
              Fig. 03 — The model, in the open
            </p>
            <h2
              id="value-title"
              className="mt-3 text-[clamp(1.9rem,3.4vw,2.9rem)] font-extrabold leading-[1.03] tracking-[-0.02em]"
              style={{ fontFamily: "var(--font-display-grotesk)" }}
            >
              Order is the whole model.
            </h2>
            <p className="mt-4 text-base font-normal leading-[1.6] text-zinc-600">
              These three panels are wired to the same list you just rearranged. Move anything on
              the left and all three change with it — no expander, no second click.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <section className="min-w-0 border border-zinc-200 bg-white p-5">
              <h3 className="text-sm font-semibold uppercase tracking-[0.12em]">
                1 — Position sets the weight
              </h3>
              <p className="mt-2 text-sm font-normal leading-[1.6] text-zinc-600">
                Five positions, weights ×5 to ×1, always summing to 15. That is the entire formula.
              </p>
              <ol className="mt-4 flex flex-col gap-2">
                {rail.map((row) => (
                  <motion.li
                    key={row.crit.id}
                    layout
                    transition={tween}
                    className="flex min-w-0 items-baseline justify-between gap-3 border-b border-zinc-200 pb-2 text-sm font-normal"
                  >
                    <span className="min-w-0 truncate">
                      <span className="tabular-nums text-zinc-600">{row.position}.</span>{" "}
                      {row.crit.name}
                    </span>
                    <span className="shrink-0 tabular-nums text-zinc-600">
                      &times;{row.weight} · {row.share}%
                    </span>
                  </motion.li>
                ))}
              </ol>
            </section>

            <section className="min-w-0 border border-zinc-200 bg-white p-5">
              <h3 className="text-sm font-semibold uppercase tracking-[0.12em]">
                2 — Every pick is decomposed
              </h3>
              <p className="mt-2 text-sm font-normal leading-[1.6] text-zinc-600">
                Score times weight, criterion by criterion. Pick any listing above to swap this
                table to it.
              </p>
              <table className="mt-4 w-full table-fixed border-collapse">
                <caption className="mb-2 text-left text-xs font-normal uppercase tracking-[0.12em] text-zinc-600">
                  {focused.listing.title}
                </caption>
                <colgroup>
                  <col className="w-[40%]" />
                  <col className="w-[18%]" />
                  <col className="w-[18%]" />
                  <col className="w-[24%]" />
                </colgroup>
                <thead>
                  <tr className="border-b border-zinc-300">
                    <th
                      scope="col"
                      className="py-2 text-left text-xs font-semibold uppercase tracking-[0.12em] text-zinc-600"
                    >
                      Criterion
                    </th>
                    <th
                      scope="col"
                      className="py-2 text-right text-xs font-semibold uppercase tracking-[0.12em] text-zinc-600"
                    >
                      Score
                    </th>
                    <th
                      scope="col"
                      className="py-2 text-right text-xs font-semibold uppercase tracking-[0.12em] text-zinc-600"
                    >
                      Wt.
                    </th>
                    <th
                      scope="col"
                      className="py-2 text-right text-xs font-semibold uppercase tracking-[0.12em] text-zinc-600"
                    >
                      Points
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {focused.contributions.map((c) => (
                    <tr key={c.id} className="border-b border-zinc-200">
                      <th scope="row" className="py-2 text-left text-sm font-normal">
                        {CRITERIA_BY_ID[c.id].name}
                      </th>
                      <td className="py-2 text-right text-sm font-normal tabular-nums text-zinc-600">
                        {focused.listing.scores[c.id]}
                      </td>
                      <td className="py-2 text-right text-sm font-normal tabular-nums text-zinc-600">
                        &times;{c.weight}
                      </td>
                      <td className="py-2 text-right text-sm font-semibold tabular-nums">
                        {c.points}
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <th scope="row" className="pt-3 text-left text-sm font-semibold">
                      Total
                    </th>
                    <td
                      colSpan={2}
                      className="pt-3 text-right text-xs font-normal uppercase tracking-[0.12em] text-zinc-600"
                    >
                      of 1500
                    </td>
                    <td className="pt-3 text-right text-sm font-semibold tabular-nums">
                      {focused.total}
                    </td>
                  </tr>
                </tbody>
              </table>
            </section>

            <section className="min-w-0 border border-zinc-200 bg-white p-5">
              <h3 className="text-sm font-semibold uppercase tracking-[0.12em]">
                3 — Re-ranking is visible
              </h3>
              <p className="mt-2 text-sm font-normal leading-[1.6] text-zinc-600">
                Measured against the default order, so you can always see what your change did.
              </p>
              <dl className="mt-4 flex flex-col gap-3">
                <div className="flex items-baseline justify-between gap-3 border-b border-zinc-200 pb-2">
                  <dt className="text-sm font-normal text-zinc-600">Positions changed</dt>
                  <dd className="shrink-0 text-sm font-semibold tabular-nums">
                    {moves.changed} of {ranked.length}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-3 border-b border-zinc-200 pb-2">
                  <dt className="min-w-0 text-sm font-normal text-zinc-600">Biggest move</dt>
                  <dd className="min-w-0 text-right text-sm font-semibold">
                    {moves.biggest.delta === 0
                      ? "None yet"
                      : `${moves.biggest.title} · ${moves.biggest.delta > 0 ? `up ${moves.biggest.delta}` : `down ${-moves.biggest.delta}`}`}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-3 border-b border-zinc-200 pb-2">
                  <dt className="min-w-0 text-sm font-normal text-zinc-600">Top pick</dt>
                  <dd className="min-w-0 text-right text-sm font-semibold">
                    {leader.listing.title}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-3">
                  <dt className="text-sm font-normal text-zinc-600">Lead over second</dt>
                  <dd className="shrink-0 text-sm font-semibold tabular-nums">
                    {leader.total - ranked[1].total} pts
                  </dd>
                </div>
              </dl>
            </section>
          </div>
        </div>
      </section>
    </>
  );
}
