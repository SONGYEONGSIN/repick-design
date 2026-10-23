"use client";

import { useId, useMemo, useState } from "react";
import { ShieldCheck, ChevronDown, ArrowRight, Check, Copy } from "lucide-react";
import Reveal from "./Reveal";

const BG = "#0B0B0F";
const FG = "#FFFFFF";
const MUTED = "text-zinc-400"; // 7.66:1 on #0B0B0F
const ACCENT = "#A3E635"; // lime-400 — 13.03:1 on #0B0B0F and on #0B0B0F text
const INK = "#0B0B0F";

const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A3E635]";

/* ───────── deterministic data ───────── */

type Condition = "like-new" | "good" | "fair";

const CONDITION_LABEL: Record<Condition, string> = {
  "like-new": "Like New",
  good: "Good",
  fair: "Fair",
};

type Trade = {
  id: string;
  name: string;
  condition: Condition;
  savings: number;
  match: number;
  seller: string;
  why: string[];
};

const TRADES: Trade[] = [
  {
    id: "1",
    name: "Shell Jacket",
    condition: "like-new",
    savings: 61,
    match: 88,
    seller: "Verified · 320 sales",
    why: ["Seam and cuff wear matched three prior Like New grades from this seller."],
  },
  {
    id: "2",
    name: "Leather Satchel",
    condition: "good",
    savings: 54,
    match: 91,
    seller: "Verified · 140 sales",
    why: ["Corner scuffing visible in photo review falls inside the Good band, not Like New."],
  },
  {
    id: "3",
    name: "Trail Boots",
    condition: "like-new",
    savings: 48,
    match: 90,
    seller: "Verified · 95 sales",
    why: ["Outsole tread depth confirmed against the original retail spec."],
  },
  {
    id: "4",
    name: "Field Watch",
    condition: "fair",
    savings: 67,
    match: 84,
    seller: "Verified · 58 sales",
    why: ["Crystal scratching and case wear were disclosed and priced into the grade, not hidden."],
  },
  {
    id: "5",
    name: "Canvas Tote",
    condition: "good",
    savings: 58,
    match: 93,
    seller: "Verified · 240 sales",
    why: ["Hardware corrosion check passed; strap stitching shows light use consistent with Good."],
  },
  {
    id: "6",
    name: "Wool Overcoat",
    condition: "fair",
    savings: 72,
    match: 86,
    seller: "Verified · 112 sales",
    why: ["Lining repair was disclosed up front and reflected in both the grade and the price."],
  },
];

const FAQS = [
  {
    q: "Why would I want a Fair-condition item?",
    a: "Fair items carry the deepest discount and every flaw is listed before you buy — no surprise when it arrives. Several buyers filter to Fair specifically for the savings.",
  },
  {
    q: "Does the average update if I filter the ledger?",
    a: "Yes. The savings average below reflects only the trades currently shown. Switch the filter and the number recalculates from that subset, not the full ledger.",
  },
];

function average(nums: number[]) {
  if (!nums.length) return 0;
  return Math.round(nums.reduce((a, b) => a + b, 0) / nums.length);
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-white/15 px-2.5 py-1 text-xs font-semibold text-zinc-300">
      {children}
    </span>
  );
}

function TradeRow({ trade }: { trade: Trade }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  return (
    <li className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold" style={{ color: FG }}>
            {trade.name}
          </p>
          <div className="mt-1.5 flex flex-wrap gap-2">
            <Badge>
              <ShieldCheck className="h-3.5 w-3.5" style={{ color: ACCENT }} />
              {CONDITION_LABEL[trade.condition]}
            </Badge>
            <Badge>{trade.seller}</Badge>
          </div>
        </div>
        <div className="text-right">
          <p
            className="text-2xl font-extrabold leading-none tabular-nums"
            style={{ color: ACCENT, fontFamily: "var(--font-display-wide)" }}
          >
            −{trade.savings}%
          </p>
          <p className={`mt-1 text-xs font-normal ${MUTED}`}>{trade.match}% match</p>
        </div>
      </div>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
        className={`mt-3 flex w-full items-center justify-between rounded-lg px-1 py-1.5 text-xs font-semibold text-zinc-300 transition-colors motion-reduce:transition-none ${FOCUS_RING}`}
      >
        Evidence
        <ChevronDown
          className={`h-4 w-4 transition-transform motion-reduce:transition-none ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <ul id={panelId} className="mt-2 space-y-1.5 border-t border-white/10 pt-2.5">
          {trade.why.map((w) => (
            <li key={w} className={`text-xs font-normal leading-relaxed ${MUTED}`}>
              {w}
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

function FaqRow({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  return (
    <div className="border-b border-white/10 py-4">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
        className={`flex w-full items-center justify-between gap-4 rounded-md text-left text-sm font-semibold text-zinc-100 ${FOCUS_RING}`}
      >
        {q}
        <ChevronDown
          className={`h-4 w-4 flex-shrink-0 transition-transform motion-reduce:transition-none ${open ? "rotate-180" : ""}`}
          style={{ color: ACCENT }}
        />
      </button>
      {open && (
        <p id={panelId} className={`mt-2 max-w-[460px] text-sm font-normal leading-relaxed ${MUTED}`}>
          {a}
        </p>
      )}
    </div>
  );
}

const FILTERS: Array<Condition | "all"> = ["all", "like-new", "good", "fair"];

export default function Page() {
  const [filter, setFilter] = useState<Condition | "all">("all");
  const [copied, setCopied] = useState(false);

  const visible = useMemo(
    () => TRADES.filter((t) => filter === "all" || t.condition === filter),
    [filter],
  );
  const avgSavings = average(visible.map((t) => t.savings));

  return (
    <main style={{ backgroundColor: BG, color: FG }} className="min-h-screen">
      <div className="mx-auto max-w-[1120px] px-6 pt-10 pb-28 sm:px-10">
        <header className="flex items-center justify-between pb-16">
          <p className="text-sm font-semibold tracking-[0.12em]" style={{ color: FG }}>
            REPICK
          </p>
          <a
            href="#closing"
            className={`rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-zinc-200 ${FOCUS_RING}`}
          >
            Open the ledger
          </a>
        </header>

        <section>
          <p className="text-xs font-semibold tracking-[0.28em]" style={{ color: ACCENT }}>
            THE TRADE LEDGER
          </p>
          <h1
            className="mt-4 max-w-[720px] text-[44px] font-extrabold leading-[1.05] tracking-[-0.02em] sm:text-[64px]"
            style={{ color: FG, fontFamily: "var(--font-display-wide)" }}
          >
            Every flaw, priced out loud.
          </h1>
          <p className={`mt-6 max-w-[460px] text-base font-normal leading-[1.6] ${MUTED}`}>
            Repick doesn&apos;t hide condition behind a single star rating. Filter the
            ledger by grade and the average savings recalculates from what you&apos;re
            actually looking at.
          </p>
          <a
            href="#closing"
            className={`mt-8 inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold ${FOCUS_RING}`}
            style={{ backgroundColor: ACCENT, color: INK }}
          >
            Filter the ledger
            <ArrowRight className="h-4 w-4" />
          </a>

          <ul className="mt-14 grid gap-3 sm:grid-cols-2">
            {TRADES.slice(0, 2).map((trade) => (
              <TradeRow key={trade.id} trade={trade} />
            ))}
          </ul>
        </section>

        <Reveal className="mt-20">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="flex gap-2" role="group" aria-label="Condition filter">
              {FILTERS.map((key) => {
                const active = key === filter;
                return (
                  <button
                    key={key}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setFilter(key)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors motion-reduce:transition-none ${FOCUS_RING} ${
                      active ? "" : "border border-white/15 text-zinc-300"
                    }`}
                    style={active ? { backgroundColor: ACCENT, color: INK } : undefined}
                  >
                    {key === "all" ? "All grades" : CONDITION_LABEL[key]}
                  </button>
                );
              })}
            </div>
            <div className="text-right">
              <p className={`text-xs font-semibold ${MUTED}`}>Avg. savings in this view</p>
              <p
                className="text-4xl font-extrabold leading-none tabular-nums"
                style={{ color: ACCENT, fontFamily: "var(--font-display-wide)" }}
              >
                −{avgSavings}%
              </p>
            </div>
          </div>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {visible.map((trade) => (
              <TradeRow key={trade.id} trade={trade} />
            ))}
          </ul>
        </Reveal>

        <Reveal className="mt-24" delay={0.05}>
          <p className="text-xs font-semibold tracking-[0.28em]" style={{ color: ACCENT }}>
            REFER A TRADER
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <code className={`rounded-lg bg-black/30 px-3 py-2 text-sm font-normal ${MUTED}`}>
              REPICK10
            </code>
            <button
              type="button"
              onClick={() => setCopied((c) => !c)}
              aria-pressed={copied}
              className={`inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-zinc-200 ${FOCUS_RING}`}
            >
              {copied ? <Check className="h-4 w-4" style={{ color: ACCENT }} /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied" : "Copy code"}
            </button>
          </div>
        </Reveal>

        <Reveal className="mt-24" delay={0.05}>
          <h2 className="text-2xl font-extrabold tracking-[-0.02em]" style={{ color: FG }}>
            Questions worth asking
          </h2>
          <div className="mt-4">
            {FAQS.map((f) => (
              <FaqRow key={f.q} q={f.q} a={f.a} />
            ))}
          </div>
        </Reveal>

        <Reveal className="mt-24" delay={0.05}>
          <div id="closing" className="rounded-3xl border border-white/10 bg-white/[0.03] p-10 text-center sm:p-14">
            <p className={`text-sm font-normal ${MUTED}`}>
              Filtered to {filter === "all" ? "all grades" : CONDITION_LABEL[filter]}
            </p>
            <p
              className="mt-2 text-[40px] font-extrabold leading-none tabular-nums"
              style={{ color: FG, fontFamily: "var(--font-display-wide)" }}
            >
              Average savings: {avgSavings}%
            </p>
            <a
              href="#"
              className={`mt-8 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold ${FOCUS_RING}`}
              style={{ backgroundColor: ACCENT, color: INK }}
            >
              Open the ledger
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </Reveal>
      </div>
    </main>
  );
}
