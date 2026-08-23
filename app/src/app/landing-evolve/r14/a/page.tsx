"use client";

import { useMemo, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  GROUPS,
  ITEMS,
  FEE,
  confidenceOf,
  contributions,
  estimate,
  labelOf,
  money,
  pctText,
  type Estimate,
  type GroupId,
  type Item,
  type Selection,
} from "./data";

const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A5C0FF]";

const EYEBROW = "text-[11px] font-medium tracking-[0.28em] text-[#A5C0FF]";
const CAPTION = "text-[11px] font-normal tracking-[0.16em] text-[#A1A1AA]";
const STAT_LABEL = "text-[10px] font-medium tracking-[0.12em] text-[#A1A1AA]";

function clamp01(n: number) {
  return Math.min(1, Math.max(0, n));
}

function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0, margin: "240px 0px 240px 0px" }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function Page() {
  const reduce = useReducedMotion();

  const [itemId, setItemId] = useState<string>(ITEMS[0].id);
  const [sel, setSel] = useState<Selection>({});
  const [preview, setPreview] = useState<{ group: GroupId; option: string } | null>(null);

  const item: Item = ITEMS.find((i) => i.id === itemId) ?? ITEMS[0];
  const est = useMemo(() => estimate(item, sel), [item, sel]);
  const conf = confidenceOf(est.spread);
  const contrib = useMemo(() => contributions(sel), [sel]);
  const answered = GROUPS.filter((g) => sel[g.id]).length;

  const previewEst: Estimate | null = useMemo(() => {
    if (!preview) return null;
    if (sel[preview.group] === preview.option) return null;
    return estimate(item, { ...sel, [preview.group]: preview.option });
  }, [item, sel, preview]);

  const comps = useMemo(() => {
    const open = GROUPS.filter((g) => sel[g.id]);
    return item.comps.map((c) => {
      const hits = open.filter((g) => c[g.id] === sel[g.id]).length;
      return {
        ...c,
        hits,
        asked: open.length,
        inBand: c.price >= est.low && c.price <= est.high,
        gap: Math.abs(c.price - est.mid),
      };
    });
  }, [item, sel, est]);

  const inBand = comps.filter((c) => c.inBand).length;

  const span = item.retail - item.axisMin;
  const pos = (v: number) => clamp01((v - item.axisMin) / span) * 100;

  const bandLeft = pos(est.low);
  const bandWidth = Math.max(0.6, pos(est.high) - pos(est.low));
  const ghostLeft = previewEst ? pos(previewEst.low) : 0;
  const ghostWidth = previewEst ? Math.max(0.6, pos(previewEst.high) - pos(previewEst.low)) : 0;

  function toggle(group: GroupId, option: string) {
    setSel((prev) => {
      const next: Selection = { ...prev };
      if (next[group] === option) delete next[group];
      else next[group] = option;
      return next;
    });
  }

  const heroIn = reduce
    ? {}
    : {
        initial: { opacity: 0, y: 18 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
      };

  return (
    <main className="min-h-dvh overflow-x-clip bg-[#0B0B0F] font-normal text-white antialiased">
      {/* ---------------------------------------------------------------- HERO */}
      <section className="border-b border-white/10 px-5 pt-20 pb-16 sm:px-8 lg:px-12 lg:pt-28 lg:pb-24">
        <div className="mx-auto w-full max-w-[1240px]">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
            {/* left rail */}
            <motion.div className="lg:col-span-5" {...heroIn}>
              <p className={EYEBROW}>SELLER-SIDE APPRAISAL</p>
              <h1
                className="mt-5 text-[clamp(2.4rem,7.6vw,3.8rem)] font-extrabold leading-[0.98] tracking-[-0.02em]"
                style={{ fontFamily: "var(--font-display-wide)" }}
              >
                What would
                <span className="block">yours fetch?</span>
              </h1>
              <p
                className="mt-6 max-w-[520px] text-[19px] font-extrabold leading-[1.35] tracking-[-0.02em]"
                style={{ fontFamily: "var(--font-display-wide)" }}
              >
                It is a range. The width is the honesty.
              </p>
              <p className="mt-4 max-w-[520px] text-[17px] font-normal leading-[1.6] text-[#A1A1AA]">
                Repick prices from the side of the person selling. We open with the widest
                defensible band for your model, then take width out of it for every trait you
                confirm. Nothing is hidden behind a form.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href="#appraise"
                  className={`inline-flex rounded-full bg-[#2563EB] px-7 py-3.5 text-[15px] font-medium text-white transition-colors hover:bg-[#1B49CC] ${FOCUS}`}
                >
                  Narrow my range
                </a>
                <span className={STAT_LABEL}>NO SIGN-UP TO SEE THE BAND</span>
              </div>

              <p className={`mt-10 ${CAPTION}`}>
                Fig. 01 — Opening band, model level, before any trait is known
              </p>
            </motion.div>

            {/* instrument */}
            <motion.div className="lg:col-span-7" {...heroIn}>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <p className={CAPTION}>Fig. 02 — Pick what you would put up</p>
                  <p className={STAT_LABEL}>3 SAMPLE ITEMS</p>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
                  {ITEMS.map((it) => {
                    const on = it.id === item.id;
                    return (
                      <button
                        key={it.id}
                        type="button"
                        aria-pressed={on}
                        onClick={() => setItemId(it.id)}
                        className={`rounded-xl border p-4 text-left transition-colors ${FOCUS} ${
                          on
                            ? "border-[#2563EB] bg-[#2563EB]/15"
                            : "border-white/12 bg-white/[0.02] hover:border-white/30 hover:bg-white/[0.05]"
                        }`}
                      >
                        <span className="flex items-baseline justify-between gap-2">
                          <span className={STAT_LABEL}>{on ? "SELECTED" : "SELECT"}</span>
                          <span className={STAT_LABEL}>{money(it.retail)} NEW</span>
                        </span>
                        <span className="mt-3 block text-[15px] font-medium leading-tight">
                          {it.name}
                        </span>
                        <span className="mt-1 block text-[12px] font-normal text-[#A1A1AA]">
                          {it.category}
                        </span>
                        <span className="mt-3 grid grid-cols-1 gap-1">
                          {[it.tags.match, it.tags.grade, it.tags.verified, it.tags.discount].map(
                            (tag) => (
                              <span
                                key={tag}
                                className="block rounded-md border border-white/12 bg-white/[0.04] px-2 py-1 text-[10px] font-normal leading-tight text-[#A5C0FF]"
                              >
                                {tag}
                              </span>
                            ),
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* live band */}
                <div className="mt-6 rounded-xl border border-white/10 bg-[#0B0B0F] p-4 sm:p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className={STAT_LABEL}>ESTIMATED SELLING RANGE</p>
                    <motion.span
                      key={conf.tier}
                      initial={reduce ? false : { opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="rounded-full border border-[#2563EB]/60 bg-[#2563EB]/20 px-3 py-1 text-[11px] font-medium tracking-[0.12em] text-[#A5C0FF]"
                    >
                      {conf.tier.toUpperCase()} · {answered} OF 4 TRAITS
                    </motion.span>
                  </div>

                  <div
                    className="mt-4 grid grid-cols-2 gap-4 tabular-nums"
                    aria-live="polite"
                    aria-atomic="true"
                  >
                    <div>
                      <p className={STAT_LABEL}>LOW</p>
                      <p
                        className="mt-1 text-[clamp(1.7rem,5.4vw,2.6rem)] font-extrabold leading-none tracking-[-0.02em]"
                        style={{ fontFamily: "var(--font-display-wide)" }}
                      >
                        {money(est.low)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={STAT_LABEL}>HIGH</p>
                      <p
                        className="mt-1 text-[clamp(1.7rem,5.4vw,2.6rem)] font-extrabold leading-none tracking-[-0.02em]"
                        style={{ fontFamily: "var(--font-display-wide)" }}
                      >
                        {money(est.high)}
                      </p>
                    </div>
                  </div>

                  <div className="relative mt-4 h-16 w-full overflow-hidden rounded-lg border border-white/10 bg-white/[0.03]">
                    <div
                      aria-hidden="true"
                      className="absolute inset-y-0 left-1/4 w-px bg-white/[0.07]"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-y-0 left-1/2 w-px bg-white/[0.07]"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-y-0 left-3/4 w-px bg-white/[0.07]"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-y-0 border-x-2 border-[#2563EB] bg-[#2563EB]/25 transition-[left,width] duration-500 ease-out motion-reduce:transition-none"
                      style={{ left: `${bandLeft}%`, width: `${bandWidth}%` }}
                    />
                    {comps.map((c) => (
                      <span
                        key={c.id}
                        aria-hidden="true"
                        className={`absolute bottom-2 w-[2px] -translate-x-1/2 ${
                          c.inBand ? "h-6 bg-[#A5C0FF]" : "h-3 bg-white/25"
                        }`}
                        style={{ left: `${pos(c.price)}%` }}
                      />
                    ))}
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <span className={CAPTION}>{money(item.axisMin)}</span>
                    <span className={CAPTION}>{money(item.retail)} RETAIL</span>
                  </div>

                  <dl className="mt-5 grid grid-cols-1 gap-3 border-t border-white/10 pt-4 tabular-nums sm:grid-cols-3">
                    <div>
                      <dt className={STAT_LABEL}>SPREAD</dt>
                      <dd className="mt-1 text-[16px] font-medium">
                        plus or minus {money(est.half)}
                      </dd>
                      <dd className="text-[13px] font-normal text-[#A1A1AA]">
                        {pctText(est.spread)}% of the midpoint
                      </dd>
                    </div>
                    <div>
                      <dt className={STAT_LABEL}>COMPS INSIDE</dt>
                      <dd className="mt-1 text-[16px] font-medium">
                        {inBand} of {item.comps.length}
                      </dd>
                      <dd className="text-[13px] font-normal text-[#A1A1AA]">
                        recent sales of this model
                      </dd>
                    </div>
                    <div>
                      <dt className={STAT_LABEL}>YOU RECEIVE</dt>
                      <dd className="mt-1 text-[16px] font-medium">
                        {money(est.low * (1 - FEE))} to {money(est.high * (1 - FEE))}
                      </dd>
                      <dd className="text-[13px] font-normal text-[#A1A1AA]">
                        after the {Math.round(FEE * 100)}% Repick fee
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ NARROW IT */}
      <section
        id="appraise"
        className="border-b border-white/10 px-5 py-24 sm:px-8 lg:px-12 lg:py-28"
      >
        <div className="mx-auto w-full max-w-[1240px]">
          <Reveal>
            <div className="flex items-end gap-5">
              <span
                aria-hidden="true"
                className="select-none text-[clamp(2rem,3.2vw,2.5rem)] font-medium leading-[0.9] tracking-[0.12em] text-[#6B6B78]"
                style={{ fontFamily: "var(--font-display-wide)" }}
              >
                02
              </span>
              <div>
                <p className={EYEBROW}>NARROWING</p>
                <h2
                  className="mt-3 max-w-[720px] text-[clamp(1.7rem,4.4vw,2.9rem)] font-extrabold leading-[1.05] tracking-[-0.02em]"
                  style={{ fontFamily: "var(--font-display-wide)" }}
                >
                  Every answer takes width out of the band.
                </h2>
              </div>
            </div>
            <p className="mt-5 max-w-[488px] text-[16px] font-normal leading-[1.6] text-[#A1A1AA]">
              Hover an answer to see the band it would produce before you commit. Tap it again to
              take the answer back and watch the band widen.
            </p>
          </Reveal>

          {/* mobile sticky readout */}
          <div className="sticky top-0 z-20 -mx-5 mt-8 border-y border-white/10 bg-[#0B0B0F]/95 px-5 py-3 backdrop-blur lg:hidden">
            <div className="flex items-baseline justify-between tabular-nums">
              <span className="text-[19px] font-medium">{money(est.low)}</span>
              <span className={STAT_LABEL}>
                {conf.tier.toUpperCase()} · {pctText(est.spread)}%
              </span>
              <span className="text-[19px] font-medium">{money(est.high)}</span>
            </div>
            <div className="relative mt-2 h-2 w-full overflow-hidden rounded-full bg-white/10">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 rounded-full bg-[#2563EB] transition-[left,width] duration-500 ease-out motion-reduce:transition-none"
                style={{ left: `${bandLeft}%`, width: `${bandWidth}%` }}
              />
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
            {/* questions */}
            <div className="lg:col-span-6">
              <div className="flex flex-col gap-8">
                {GROUPS.map((g) => {
                  const chosen = sel[g.id];
                  return (
                    <div key={g.id} className="border-t border-white/10 pt-5">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <h3 className="text-[15px] font-medium tracking-[-0.02em]">
                          <span className={`mr-3 ${STAT_LABEL}`}>{g.index}</span>
                          {g.label}
                        </h3>
                        <span className={STAT_LABEL}>{chosen ? "ANSWERED" : "OPEN"}</span>
                      </div>
                      <p className="mt-1 text-[13px] font-normal leading-[1.6] text-[#A1A1AA]">
                        {g.ask}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {g.options.map((o) => {
                          const on = chosen === o.id;
                          return (
                            <button
                              key={o.id}
                              type="button"
                              aria-pressed={on}
                              onClick={() => toggle(g.id, o.id)}
                              onMouseEnter={() => setPreview({ group: g.id, option: o.id })}
                              onMouseLeave={() => setPreview(null)}
                              onFocus={() => setPreview({ group: g.id, option: o.id })}
                              onBlur={() => setPreview(null)}
                              className={`min-w-0 rounded-xl border px-3.5 py-2.5 text-left transition-colors ${FOCUS} ${
                                on
                                  ? "border-[#2563EB] bg-[#2563EB] text-white"
                                  : "border-white/15 bg-white/[0.02] hover:border-[#A5C0FF]/60 hover:bg-white/[0.06]"
                              }`}
                            >
                              <span className="block text-[13px] font-medium leading-tight">
                                {o.label}
                              </span>
                              <span
                                className={`mt-0.5 block text-[11px] font-normal leading-tight ${
                                  on ? "text-white" : "text-[#A1A1AA]"
                                }`}
                              >
                                {o.note}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}

                <div className="flex flex-wrap items-center gap-4 border-t border-white/10 pt-5">
                  <button
                    type="button"
                    onClick={() => setSel({})}
                    className={`rounded-full border border-white/20 px-5 py-2.5 text-[13px] font-medium text-white transition-colors hover:border-white/45 hover:bg-white/[0.06] ${FOCUS}`}
                  >
                    Clear every answer
                  </button>
                  <span className="text-[13px] font-normal text-[#A1A1AA]">
                    Widening is allowed. An honest range beats a flattering one.
                  </span>
                </div>
              </div>
            </div>

            {/* live evidence */}
            <div className="lg:col-span-6">
              <div className="lg:sticky lg:top-8">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
                  <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <p className={CAPTION}>Fig. 03 — Live band, {item.name}</p>
                    <p className={STAT_LABEL}>{conf.tier.toUpperCase()}</p>
                  </div>

                  <div
                    className="mt-4 flex items-end justify-between gap-4 tabular-nums"
                    aria-live="polite"
                    aria-atomic="true"
                  >
                    <p
                      className="text-[clamp(1.6rem,4.6vw,2.4rem)] font-extrabold leading-none tracking-[-0.02em]"
                      style={{ fontFamily: "var(--font-display-wide)" }}
                    >
                      {money(est.low)}
                    </p>
                    <p className="pb-1 text-[13px] font-normal text-[#A1A1AA]">to</p>
                    <p
                      className="text-[clamp(1.6rem,4.6vw,2.4rem)] font-extrabold leading-none tracking-[-0.02em]"
                      style={{ fontFamily: "var(--font-display-wide)" }}
                    >
                      {money(est.high)}
                    </p>
                  </div>

                  <div className="relative mt-4 h-24 w-full overflow-hidden rounded-lg border border-white/10 bg-white/[0.03]">
                    <div
                      aria-hidden="true"
                      className="absolute inset-y-0 left-1/4 w-px bg-white/[0.07]"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-y-0 left-1/2 w-px bg-white/[0.07]"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-y-0 left-3/4 w-px bg-white/[0.07]"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-y-0 border-x-2 border-[#2563EB] bg-[#2563EB]/25 transition-[left,width] duration-500 ease-out motion-reduce:transition-none"
                      style={{ left: `${bandLeft}%`, width: `${bandWidth}%` }}
                    />
                    {previewEst ? (
                      <div
                        aria-hidden="true"
                        className="absolute inset-y-1.5 rounded-md border-2 border-dashed border-[#A5C0FF]"
                        style={{ left: `${ghostLeft}%`, width: `${ghostWidth}%` }}
                      />
                    ) : null}
                    {comps.map((c) => (
                      <span
                        key={c.id}
                        aria-hidden="true"
                        className={`absolute bottom-3 w-[2px] -translate-x-1/2 ${
                          c.inBand ? "h-9 bg-[#A5C0FF]" : "h-4 bg-white/25"
                        }`}
                        style={{ left: `${pos(c.price)}%` }}
                      />
                    ))}
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <span className={CAPTION}>{money(item.axisMin)}</span>
                    <span className={CAPTION}>{money(item.retail)} RETAIL</span>
                  </div>

                  <p
                    className="mt-4 min-h-[2.75rem] border-t border-white/10 pt-3 text-[13px] font-normal leading-[1.6] text-[#A1A1AA]"
                    aria-live="polite"
                  >
                    {previewEst
                      ? `Preview: ${money(previewEst.low)} to ${money(previewEst.high)}, spread ${pctText(
                          previewEst.spread,
                        )}%. Click to keep it.`
                      : `Each tick is one of the ${item.comps.length} completed sales listed below. ${inBand} of them land inside your band right now.`}
                  </p>

                  {/* uncertainty decomposition */}
                  <div className="mt-4 border-t border-white/10 pt-4">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <p className={STAT_LABEL}>WHERE THE WIDTH WENT</p>
                      <p className="text-[13px] font-medium tabular-nums">
                        {Math.round(contrib.cut * 100)}% removed
                      </p>
                    </div>
                    <div className="mt-3 flex h-3 w-full overflow-hidden rounded-full border border-white/10 bg-white/[0.04]">
                      {contrib.parts.map((p, i) => (
                        <span
                          key={p.id}
                          aria-hidden="true"
                          className={`h-full transition-[width] duration-500 ease-out motion-reduce:transition-none ${
                            i % 2 === 0 ? "bg-[#2563EB]" : "bg-[#A5C0FF]"
                          }`}
                          style={{ width: `${p.width}%` }}
                        />
                      ))}
                      <span
                        aria-hidden="true"
                        className="h-full bg-transparent transition-[width] duration-500 ease-out motion-reduce:transition-none"
                        style={{ width: `${contrib.open}%` }}
                      />
                    </div>
                    <p className="mt-3 text-[13px] font-normal leading-[1.6] text-[#A1A1AA]">
                      {contrib.parts.length === 0
                        ? "Nothing removed yet. The whole bar is still unknown, which is exactly why the band is this wide."
                        : contrib.parts
                            .map((p) => `${p.label} ${Math.round(p.width)}%`)
                            .join(" · ") + ` · still open ${Math.round(contrib.open)}%`}
                    </p>
                  </div>
                </div>

                <p className={`mt-4 ${CAPTION}`}>{conf.blurb}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- COMPARABLES */}
      <section className="border-b border-white/10 px-5 py-24 sm:px-8 lg:px-12 lg:py-28">
        <div className="mx-auto w-full max-w-[1240px]">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
            <Reveal className="lg:col-span-4">
              <div className="flex items-end gap-5">
                <span
                  aria-hidden="true"
                  className="select-none text-[clamp(2rem,3.2vw,2.5rem)] font-medium leading-[0.9] tracking-[0.12em] text-[#6B6B78]"
                  style={{ fontFamily: "var(--font-display-wide)" }}
                >
                  03
                </span>
                <div>
                  <p className={EYEBROW}>THE EVIDENCE</p>
                  <h2
                    className="mt-3 text-[clamp(1.7rem,4.4vw,2.6rem)] font-extrabold leading-[1.05] tracking-[-0.02em]"
                    style={{ fontFamily: "var(--font-display-wide)" }}
                  >
                    Sales, not opinions.
                  </h2>
                </div>
              </div>
              <p className="mt-5 max-w-[488px] text-[16px] font-normal leading-[1.6] text-[#A1A1AA]">
                These are the last twelve completed sales of the {item.name}. Your band is drawn
                around them, so the count that falls inside is the fastest test of whether the band
                is still honest.
              </p>
              <p className="mt-6 text-[15px] font-medium tabular-nums">
                {inBand} of {item.comps.length} sit inside your band
              </p>
              <p className={`mt-6 ${CAPTION}`}>Fig. 04 — Completed sales, last 30 days</p>
            </Reveal>

            <div className="lg:col-span-8">
              <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {comps.map((c) => (
                  <li
                    key={c.id}
                    className={`rounded-xl border-l-2 border-y border-r px-4 py-3 transition-colors ${
                      c.inBand
                        ? "border-l-[#2563EB] border-y-white/12 border-r-white/12 bg-[#2563EB]/[0.08]"
                        : "border-l-white/20 border-y-white/8 border-r-white/8 bg-white/[0.02]"
                    }`}
                  >
                    <div className="flex items-baseline justify-between gap-3">
                      <span
                        className={`text-[19px] font-medium tabular-nums ${
                          c.inBand ? "text-white" : "text-[#A1A1AA]"
                        }`}
                      >
                        {money(c.price)}
                      </span>
                      <span
                        className={`text-[10px] font-medium tracking-[0.12em] ${
                          c.inBand ? "text-[#A5C0FF]" : "text-[#A1A1AA]"
                        }`}
                      >
                        {c.inBand ? "IN BAND" : "OUTSIDE"}
                      </span>
                    </div>
                    <p className="mt-1 text-[12px] font-normal leading-[1.6] text-[#A1A1AA]">
                      {labelOf("condition", c.condition)} · {labelOf("kit", c.kit)} ·{" "}
                      {labelOf("age", c.age)} · {labelOf("use", c.use)} use
                    </p>
                    <p className="mt-1 text-[12px] font-normal tabular-nums text-[#A1A1AA]">
                      {c.place} · {c.days} days ago ·{" "}
                      {c.asked === 0
                        ? "no traits confirmed yet"
                        : `${c.hits} of ${c.asked} traits match yours`}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------- THREE UPS */}
      <section className="border-b border-white/10 px-5 py-24 sm:px-8 lg:px-12 lg:py-28">
        <div className="mx-auto w-full max-w-[1240px]">
          <Reveal>
            <p className={EYEBROW}>WHY A BAND</p>
            <h2
              className="mt-4 max-w-[820px] text-[clamp(1.7rem,4.4vw,2.9rem)] font-extrabold leading-[1.05] tracking-[-0.02em]"
              style={{ fontFamily: "var(--font-display-wide)" }}
            >
              A single number hides what nobody knows yet.
            </h2>
          </Reveal>

          <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
            {[
              {
                idx: "01",
                title: "The answer is two numbers",
                value: `${money(est.low)} to ${money(est.high)}`,
                copy: "Any seller quoting one number is quietly picking a point inside a band they did not show you.",
              },
              {
                idx: "02",
                title: "Width is confidence",
                value: `plus or minus ${pctText(est.spread)}%`,
                copy: `Right now this reads ${conf.tier.toLowerCase()}. It moves the instant you confirm or retract a trait.`,
              },
              {
                idx: "03",
                title: "Comps carry the weight",
                value: `${inBand} of ${item.comps.length} inside`,
                copy: "The band is only as good as the sales it wraps. When too few land inside, the band is wrong, not the market.",
              },
            ].map((card, i) => (
              <Reveal key={card.idx} delay={i * 0.06}>
                <div className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                  <span
                    aria-hidden="true"
                    className="block select-none text-[1.75rem] font-medium leading-none tracking-[0.12em] text-[#6B6B78]"
                    style={{ fontFamily: "var(--font-display-wide)" }}
                  >
                    {card.idx}
                  </span>
                  <h3 className="mt-5 text-[15px] font-medium tracking-[-0.02em]">{card.title}</h3>
                  <p
                    className="mt-3 text-[clamp(1.3rem,3vw,1.7rem)] font-extrabold leading-tight tracking-[-0.02em] tabular-nums"
                    style={{ fontFamily: "var(--font-display-wide)" }}
                  >
                    {card.value}
                  </p>
                  <p className="mt-4 max-w-[440px] text-[15px] font-normal leading-[1.6] text-[#A1A1AA]">
                    {card.copy}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------- SOCIAL PROOF */}
      <section className="border-b border-white/10 px-5 py-24 sm:px-8 lg:px-12 lg:py-28">
        <div className="mx-auto w-full max-w-[1240px]">
          <Reveal>
            <p className={EYEBROW}>SELLERS</p>
            <h2
              className="mt-4 max-w-[720px] text-[clamp(1.7rem,4.4vw,2.6rem)] font-extrabold leading-[1.05] tracking-[-0.02em]"
              style={{ fontFamily: "var(--font-display-wide)" }}
            >
              They stopped defending a number.
            </h2>
          </Reveal>

          <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
            {[
              {
                q: "I had priced it off a forum thread. Repick opened twice as wide, then closed to eleven percent after four questions. The wide part was the useful part.",
                who: "Nils Aberg",
                what: "Sold a Ridge 14",
              },
              {
                q: "The band told me which detail was actually worth photographing. I found the box in a closet and the low end moved more than a week of haggling would have.",
                who: "Ivy Sorensen",
                what: "Sold a compact camera",
              },
              {
                q: "Buyers argue inside a range and argue about a number. Since I started sending the band with the listing, the messages got shorter.",
                who: "Teo Marchetti",
                what: "Sold 14 items",
              },
            ].map((t, i) => (
              <Reveal key={t.who} delay={i * 0.06}>
                <figure className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                  <span
                    aria-hidden="true"
                    className="block select-none text-[3rem] font-extrabold leading-[0.6] text-[#2563EB]"
                    style={{ fontFamily: "var(--font-display-wide)" }}
                  >
                    &ldquo;
                  </span>
                  <blockquote className="mt-4 max-w-[440px] text-[15px] font-normal leading-[1.6]">
                    {t.q}
                  </blockquote>
                  <figcaption className="mt-5 border-t border-white/10 pt-4">
                    <span className="block text-[13px] font-medium">{t.who}</span>
                    <span className="mt-1 block text-[12px] font-normal text-[#A1A1AA]">
                      {t.what}
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <dl className="mt-10 grid grid-cols-1 gap-6 border-t border-white/10 pt-8 tabular-nums sm:grid-cols-3">
              {[
                { k: "ITEMS APPRAISED", v: "31,402", n: "since launch" },
                { k: "MEDIAN SPREAD AT LISTING", v: "11.4%", n: "after four traits" },
                { k: "MEDIAN TIME TO SOLD", v: "6.2 days", n: "listed inside band" },
              ].map((s) => (
                <div key={s.k}>
                  <dt className={STAT_LABEL}>{s.k}</dt>
                  <dd
                    className="mt-2 text-[clamp(1.5rem,3.4vw,2rem)] font-extrabold leading-none tracking-[-0.02em]"
                    style={{ fontFamily: "var(--font-display-wide)" }}
                  >
                    {s.v}
                  </dd>
                  <dd className="mt-1 text-[13px] font-normal text-[#A1A1AA]">{s.n}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      {/* ---------------------------------------------------------- CLOSING CTA */}
      <section className="px-5 py-24 sm:px-8 lg:px-12 lg:py-28">
        <div className="mx-auto w-full max-w-[1240px]">
          <Reveal>
            <p className={EYEBROW}>PUT IT UP</p>
            <h2
              className="mt-5 max-w-[900px] text-[clamp(2rem,6.4vw,3.6rem)] font-extrabold leading-[1.02] tracking-[-0.02em]"
              style={{ fontFamily: "var(--font-display-wide)" }}
            >
              Bring the thing. Leave with a band you can defend.
            </h2>
            <p className="mt-6 max-w-[520px] text-[17px] font-normal leading-[1.6] text-[#A1A1AA]">
              Four questions, no account, no photo upload. The band you see is the band we publish
              with your listing, and it stays visible to the buyer.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <a
                href="#appraise"
                className={`inline-flex rounded-full bg-[#2563EB] px-8 py-4 text-[15px] font-medium text-white transition-colors hover:bg-[#1B49CC] ${FOCUS}`}
              >
                Appraise my item
              </a>
              <span className="text-[13px] font-normal text-[#A1A1AA] tabular-nums">
                Currently reading {money(est.low)} to {money(est.high)} for the {item.name}
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      <footer className="border-t border-white/10 px-5 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto flex w-full max-w-[1240px] flex-wrap items-center justify-between gap-4">
          <span className="text-[13px] font-medium tracking-[-0.02em]">Repick</span>
          <span className={CAPTION}>SELLER-SIDE APPRAISAL · SAMPLE DATA</span>
        </div>
      </footer>
    </main>
  );
}
