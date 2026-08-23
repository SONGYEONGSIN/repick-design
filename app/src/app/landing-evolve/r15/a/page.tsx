"use client";

import { useMemo, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { LISTINGS, discountPct, money, type Listing, type StyleId } from "./data";
import {
  ListingTabs,
  OutcomeCard,
  StyleToggle,
  TargetStepper,
  TranscriptThread,
  buildTranscript,
} from "./Negotiation";

const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6EE7B7]";
const EYEBROW = "text-[11px] font-medium tracking-[0.28em] text-[#6EE7B7]";
const CAPTION = "text-[11px] font-normal tracking-[0.16em] text-[#A1A1AA]";
const STAT_LABEL = "text-[10px] font-medium tracking-[0.12em] text-[#A1A1AA]";
const DISPLAY = { fontFamily: "var(--font-display-mono)" } as const;

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
      viewport={{ once: true, amount: 0, margin: "220px 0px 220px 0px" }}
      transition={{ duration: 0.22, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function ProofRow({ listing }: { listing: Listing }) {
  const items = [
    `${listing.matchPct}% comp match`,
    `Grade ${listing.grade}`,
    listing.verified,
    `-${discountPct(listing)}% vs retail`,
  ];
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((it) => (
        <li
          key={it}
          className="rounded-md border border-white/12 bg-white/[0.04] px-2.5 py-1 text-[11px] font-normal leading-tight text-[#6EE7B7]"
        >
          {it}
        </li>
      ))}
    </ul>
  );
}

function GlyphPanel({ listing }: { listing: Listing }) {
  return (
    <div
      className="relative flex aspect-[16/10] w-full items-center justify-center overflow-hidden rounded-xl border border-white/10"
      style={{
        background:
          "radial-gradient(120% 140% at 15% 0%, rgba(4,120,87,0.28) 0%, rgba(11,11,15,0) 55%), linear-gradient(155deg, #14141b 0%, #0B0B0F 70%)",
      }}
    >
      <span
        aria-hidden="true"
        className="select-none text-[3.4rem] font-extrabold leading-none tracking-[-0.02em] text-white"
        style={DISPLAY}
      >
        {listing.glyph}
      </span>
      <span
        aria-hidden="true"
        className="absolute bottom-3 left-4 text-[10px] font-medium tracking-[0.16em] text-[#A1A1AA]"
      >
        {listing.category.toUpperCase()}
      </span>
    </div>
  );
}

export default function Page() {
  const reduce = useReducedMotion();

  const [listingId, setListingId] = useState<string>(LISTINGS[0].id);
  const listing = LISTINGS.find((l) => l.id === listingId) ?? LISTINGS[0];

  const [targets, setTargets] = useState<Record<string, number>>(() =>
    Object.fromEntries(LISTINGS.map((l) => [l.id, l.targetDefault])),
  );
  const target = targets[listing.id];
  const setTarget = (v: number) => setTargets((prev) => ({ ...prev, [listing.id]: v }));

  const [style, setStyle] = useState<StyleId>("patient");

  function selectListing(id: string) {
    setListingId(id);
  }

  const { messages, outcome } = useMemo(
    () => buildTranscript(listing, target, style),
    [listing, target, style],
  );

  const heroIn = reduce
    ? {}
    : {
        initial: { opacity: 0, y: 18 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
      };

  return (
    <main className="min-h-dvh overflow-x-clip bg-[#0B0B0F] font-normal text-white antialiased">
      {/* ---------------------------------------------------------------- HERO */}
      <section className="border-b border-white/10 px-5 pt-20 pb-16 sm:px-8 lg:px-12 lg:pt-24 lg:pb-24">
        <div className="mx-auto w-full max-w-[1240px]">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
            {/* left rail */}
            <motion.div className="lg:col-span-5" {...heroIn}>
              <p className={EYEBROW}>AI BUYER-AGENT</p>
              <h1 className="mt-5 font-extrabold leading-[0.98] tracking-[-0.02em] text-[clamp(2.3rem,9vw,3.7rem)] lg:text-[clamp(2.6rem,4.6vw,3.7rem)]">
                Say your ceiling.
                <span className="block">The agent does the talking.</span>
              </h1>
              <p className="mt-6 max-w-[520px] text-[17px] font-normal leading-[1.6] text-[#A1A1AA]">
                Repick opens a real negotiation with the seller on your behalf — anchored to
                comparable sales, never crossing the number you set. Change your ceiling below and
                watch the whole transcript renegotiate itself.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href="#negotiation"
                  className={`inline-flex rounded-full bg-[#047857] px-7 py-3.5 text-[15px] font-medium text-white transition-colors hover:bg-[#036049] ${FOCUS}`}
                >
                  Read the full transcript
                </a>
                <span className={STAT_LABEL}>NO ACCOUNT TO WATCH IT WORK</span>
              </div>
            </motion.div>

            {/* instrument */}
            <motion.div className="lg:col-span-7" {...heroIn}>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <p className={CAPTION}>Live listing</p>
                  <p className={STAT_LABEL}>3 SAMPLE ITEMS</p>
                </div>
                <div className="mt-3">
                  <ListingTabs activeId={listing.id} onSelect={selectListing} />
                </div>

                <div className="mt-4 flex flex-wrap items-baseline justify-between gap-2">
                  <div>
                    <h2 className="text-[17px] font-medium tracking-[-0.02em]">{listing.name}</h2>
                    <p className="text-[13px] font-normal text-[#A1A1AA]">{listing.category}</p>
                  </div>
                  <span className={`${STAT_LABEL} tabular-nums`}>
                    {money(listing.ask)} ASKING
                  </span>
                </div>
                <div className="mt-3">
                  <ProofRow listing={listing} />
                </div>

                <div className="mt-5 grid grid-cols-1 gap-4 border-t border-white/10 pt-5 sm:grid-cols-2">
                  <TargetStepper listing={listing} value={target} onChange={setTarget} />
                  <StyleToggle value={style} onChange={setStyle} />
                </div>

                <div className="mt-5 rounded-xl border border-white/10 bg-[#0B0B0F] p-4 sm:p-5">
                  <p className={`${CAPTION} mb-3`}>Transcript · {listing.name}</p>
                  <TranscriptThread messages={messages} compact />
                  <div className="mt-4">
                    <OutcomeCard outcome={outcome} listing={listing} />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- PRODUCT PREVIEW */}
      <section id="listings" className="border-b border-white/10 px-5 py-24 sm:px-8 lg:px-12 lg:py-28">
        <div className="mx-auto w-full max-w-[1240px]">
          <Reveal>
            <p className={EYEBROW}>THE LISTINGS</p>
            <h2 className="mt-4 max-w-[720px] text-[clamp(1.7rem,4.4vw,2.6rem)] font-extrabold leading-[1.05] tracking-[-0.02em]">
              Three items, three open negotiations.
            </h2>
            <p className="mt-5 max-w-[488px] text-[16px] font-normal leading-[1.6] text-[#A1A1AA]">
              Every listing here is comp-matched, condition-graded, and identity-verified before an
              agent ever opens a conversation. Pick one to negotiate.
            </p>
          </Reveal>

          <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
            {LISTINGS.map((l, i) => {
              const discount = discountPct(l);
              return (
                <Reveal key={l.id} delay={i * 0.06}>
                  <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
                    <GlyphPanel listing={l} />
                    <div className="mt-4 flex items-baseline justify-between gap-2">
                      <h3 className="text-[16px] font-medium tracking-[-0.02em]">{l.name}</h3>
                      <span className="text-[13px] font-normal tabular-nums text-[#A1A1AA]">
                        {money(l.ask)}
                      </span>
                    </div>
                    <p className="mt-1 text-[13px] font-normal text-[#A1A1AA]">{l.category}</p>
                    <p className="mt-3 max-w-[440px] text-[13px] font-normal leading-[1.6] text-[#A1A1AA]">
                      {l.condition}. Ships with {l.kit}.
                    </p>

                    <ul className="mt-4 flex flex-wrap gap-1.5">
                      {[
                        `${l.matchPct}% match`,
                        `Grade ${l.grade}`,
                        l.verified,
                        `-${discount}% retail`,
                      ].map((tag) => (
                        <li
                          key={tag}
                          className="rounded-md border border-white/12 bg-white/[0.04] px-2 py-1 text-[10px] font-normal leading-tight text-[#6EE7B7]"
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-5">
                      <a
                        href="#negotiation"
                        onClick={() => selectListing(l.id)}
                        className={`inline-flex w-full items-center justify-center rounded-full border px-4 py-2.5 text-[13px] font-medium transition-colors ${FOCUS} ${
                          l.id === listing.id
                            ? "border-[#047857] bg-[#047857] text-white"
                            : "border-white/20 text-white hover:border-white/40 hover:bg-white/[0.06]"
                        }`}
                      >
                        {l.id === listing.id ? "Currently negotiating" : "Negotiate this"}
                      </a>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- NEGOTIATION */}
      <section id="negotiation" className="border-b border-white/10 px-5 py-24 sm:px-8 lg:px-12 lg:py-28">
        <div className="mx-auto w-full max-w-[1240px]">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
            <Reveal className="lg:col-span-5">
              <p className={EYEBROW}>THE FULL EXCHANGE</p>
              <h2 className="mt-4 max-w-[560px] text-[clamp(1.7rem,4.4vw,2.6rem)] font-extrabold leading-[1.05] tracking-[-0.02em]">
                Every offer, every counter, in order.
              </h2>
              <p className="mt-5 max-w-[488px] text-[16px] font-normal leading-[1.6] text-[#A1A1AA]">
                Tap &ldquo;why this number&rdquo; under any agent message to see the reasoning
                behind it. Adjust the ceiling or the style below — the whole exchange rewrites
                itself.
              </p>

              <div className="mt-8 flex flex-col gap-5 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <TargetStepper
                  id="target-input-full"
                  listing={listing}
                  value={target}
                  onChange={setTarget}
                />
                <StyleToggle value={style} onChange={setStyle} />
                <div className="border-t border-white/10 pt-4">
                  <OutcomeCard outcome={outcome} listing={listing} />
                </div>
              </div>
            </Reveal>

            <Reveal className="lg:col-span-7" delay={0.08}>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <p className={CAPTION}>
                    Full transcript · {listing.name} · {style === "patient" ? "Patient" : "Fast close"}
                  </p>
                  <p className={STAT_LABEL}>{messages.length} MESSAGES</p>
                </div>
                <div className="mt-5">
                  <TranscriptThread messages={messages} />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------- THREE UPS */}
      <section className="border-b border-white/10 px-5 py-24 sm:px-8 lg:px-12 lg:py-28">
        <div className="mx-auto w-full max-w-[1240px]">
          <Reveal>
            <p className={EYEBROW}>WHY IT WORKS</p>
            <h2 className="mt-4 max-w-[820px] text-[clamp(1.7rem,4.4vw,2.9rem)] font-extrabold leading-[1.05] tracking-[-0.02em]">
              An agent that argues from evidence, not emotion.
            </h2>
          </Reveal>

          <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
            {[
              {
                idx: "01",
                title: "Anchored in data",
                value: `${listing.compCount} comps`,
                copy: `Every opening offer starts from ${listing.compCount} comparable sales of the ${listing.name}, not a gut feeling about what it's worth.`,
              },
              {
                idx: "02",
                title: "Bounded by your ceiling",
                value: money(target),
                copy: `The agent will negotiate up to ${money(
                  target,
                )} and stop. It never asks permission to go higher.`,
              },
              {
                idx: "03",
                title: "Never emotional",
                value: outcome.dealMade ? `${outcome.ceilingHeadroomPct}% headroom left` : "Walks away",
                copy: outcome.dealMade
                  ? `This round settled with ${outcome.ceilingHeadroomPct}% of your ceiling unspent — the agent stopped once the price was fair, not once it hit your limit.`
                  : `When the seller's floor sits above your ceiling, the agent says so and stops. It does not stretch the number to close.`,
              },
            ].map((card, i) => (
              <Reveal key={card.idx} delay={i * 0.06}>
                <div className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                  <span
                    aria-hidden="true"
                    className="block select-none text-[1.75rem] font-medium leading-none tracking-[0.12em] text-[#6B6B78]"
                    style={DISPLAY}
                  >
                    {card.idx}
                  </span>
                  <h3 className="mt-5 text-[15px] font-medium tracking-[-0.02em]">{card.title}</h3>
                  <p
                    className="mt-3 text-[clamp(1.25rem,2.8vw,1.6rem)] font-extrabold leading-tight tracking-[-0.02em] tabular-nums"
                    style={DISPLAY}
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
            <p className={EYEBROW}>BUYERS</p>
            <h2 className="mt-4 max-w-[720px] text-[clamp(1.7rem,4.4vw,2.6rem)] font-extrabold leading-[1.05] tracking-[-0.02em]">
              They stopped writing the first message.
            </h2>
          </Reveal>

          <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
            {[
              {
                q: "I set a ceiling I was actually comfortable with instead of a wishful one, and the agent still closed nine percent under it. I would not have offered that little.",
                who: "Dana Whitfield",
                what: "Bought a Continuum 14",
              },
              {
                q: "Fast close felt blunt reading it back, but it landed within a day. Patient mode on the next item took longer and closed lower. Now I pick per item.",
                who: "Ravi Kunta",
                what: "Bought two items",
              },
              {
                q: "It told me straight that my ceiling was under the seller's floor instead of pretending to negotiate. I raised it forty dollars and it closed the same afternoon.",
                who: "Priya Osei",
                what: "Bought a Basalt Turntable",
              },
            ].map((t, i) => (
              <Reveal key={t.who} delay={i * 0.06}>
                <figure className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                  <span
                    aria-hidden="true"
                    className="block select-none text-[3rem] font-extrabold leading-[0.6] text-[#047857]"
                    style={DISPLAY}
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
                { k: "NEGOTIATIONS OPENED", v: "44,910", n: "since launch" },
                { k: "MEDIAN CLOSE UNDER ASK", v: "14.6%", n: "across all listings" },
                { k: "MEDIAN CEILING UNSPENT", v: "8.2%", n: "at settlement" },
              ].map((s) => (
                <div key={s.k}>
                  <dt className={STAT_LABEL}>{s.k}</dt>
                  <dd
                    className="mt-2 text-[clamp(1.5rem,3.4vw,2rem)] font-extrabold leading-none tracking-[-0.02em]"
                    style={DISPLAY}
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
            <p className={EYEBROW}>START A NEGOTIATION</p>
            <h2 className="mt-5 max-w-[900px] text-[clamp(2rem,6.4vw,3.6rem)] font-extrabold leading-[1.02] tracking-[-0.02em]">
              Set a ceiling. Let the agent make the first move.
            </h2>
            <p className="mt-6 max-w-[520px] text-[17px] font-normal leading-[1.6] text-[#A1A1AA]">
              No account, no back-and-forth in your own inbox. You state a number once, and the
              transcript stays visible the whole way through.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <a
                href="#negotiation"
                className={`inline-flex rounded-full bg-[#047857] px-8 py-4 text-[15px] font-medium text-white transition-colors hover:bg-[#036049] ${FOCUS}`}
              >
                Open the transcript
              </a>
              <span className="text-[13px] font-normal tabular-nums text-[#A1A1AA]">
                Right now, for the {listing.name}: {outcome.note}
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      <footer className="border-t border-white/10 px-5 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto flex w-full max-w-[1240px] flex-wrap items-center justify-between gap-4">
          <span className="text-[13px] font-medium tracking-[-0.02em]">Repick</span>
          <span className={CAPTION}>AI BUYER-AGENT · SAMPLE DATA</span>
        </div>
      </footer>
    </main>
  );
}
