"use client";

import { useId, useState } from "react";
import { ShieldCheck, BadgeCheck, ChevronDown, ArrowRight, Sparkles } from "lucide-react";
import Reveal from "./Reveal";

const BG = "#FFFFFF";
const FG = "#0B0B0F";
const MUTED = "text-zinc-500"; // #71717A — 4.83:1 on white, AA body-safe
const ACCENT = "#C2410C"; // orange-700 — 5.18:1 on white, AA body-safe
const ACCENT_STRONG = "#9A3412"; // orange-800 — 7.31:1 on white

const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C2410C]";

/* ───────── deterministic data ───────── */

type Category = "sneakers" | "bags" | "watches";

const CATEGORY_STATS: Record<Category, { label: string; avgResale: number; verifyHours: number; avgSavings: number }> = {
  sneakers: { label: "Sneakers", avgResale: 72, verifyHours: 3, avgSavings: 54 },
  bags: { label: "Bags", avgResale: 68, verifyHours: 5, avgSavings: 61 },
  watches: { label: "Watches", avgResale: 81, verifyHours: 8, avgSavings: 47 },
};

type Item = {
  id: string;
  name: string;
  category: string;
  match: number;
  condition: string;
  seller: string;
  discount: number;
  why: string[];
};

const ITEMS: Item[] = [
  {
    id: "bag",
    name: "Canvas Tote, Field Edition",
    category: "Bags",
    match: 93,
    condition: "Like New",
    seller: "Verified · 240 sales",
    discount: 58,
    why: [
      "Hardware corrosion check passed against 900 reference photos of this strap clasp.",
      "Seller's last 14 condition calls on this model were all confirmed on arrival.",
    ],
  },
  {
    id: "watch",
    name: "Field Chronograph 40mm",
    category: "Watches",
    match: 89,
    condition: "Very Good",
    seller: "Verified · 76 sales",
    discount: 44,
    why: [
      "Crystal scratch pattern measured from photo falls inside the Very Good band.",
      "Movement service record matches the seller's disclosed last-serviced date.",
    ],
  },
];

const FAQS = [
  {
    q: "Why does the savings number change by category?",
    a: "Each category has its own resale curve — watches hold value longer than sneakers, so the average discount off retail differs. The number you see reflects the category you're browsing, not a blanket claim.",
  },
  {
    q: "Who verifies the condition grade?",
    a: "A second independent reviewer re-grades every listing before it's priced. The seller's original grade and the reviewer's grade both have to agree within one band.",
  },
];

function Badge({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "accent" }) {
  if (tone === "accent") {
    return (
      <span
        className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold tabular-nums text-white"
        style={{ backgroundColor: ACCENT }}
      >
        {children}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs font-semibold text-zinc-700">
      {children}
    </span>
  );
}

function ItemArt({ seed }: { seed: number }) {
  const rows = [0.3, 0.55, 0.42, 0.68].map((v, i) => v + ((seed + i) % 3) * 0.05);
  return (
    <svg viewBox="0 0 160 100" className="h-full w-full" aria-hidden="true">
      <rect x="0" y="0" width="160" height="100" fill="#F4F4F5" />
      {rows.map((v, i) => (
        <circle
          key={i}
          cx={30 + i * 34}
          cy={50}
          r={v * 34}
          fill={i === 1 ? ACCENT : "#D4D4D8"}
        />
      ))}
    </svg>
  );
}

function ProductCard({ item }: { item: Item }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  return (
    <div className="flex-1 rounded-2xl border border-zinc-200 bg-zinc-50/60 p-4">
      <div className="aspect-[16/10] overflow-hidden rounded-xl">
        <ItemArt seed={item.name.length} />
      </div>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold" style={{ color: FG }}>
            {item.name}
          </p>
          <p className={`text-xs font-normal ${MUTED}`}>{item.category}</p>
        </div>
        <Badge tone="accent">{item.match}% match</Badge>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <Badge>
          <ShieldCheck className="h-3.5 w-3.5" style={{ color: ACCENT_STRONG }} />
          {item.condition}
        </Badge>
        <Badge>
          <BadgeCheck className="h-3.5 w-3.5" style={{ color: ACCENT_STRONG }} />
          {item.seller}
        </Badge>
        <Badge>−{item.discount}% vs retail</Badge>
      </div>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
        className={`mt-4 flex w-full items-center justify-between rounded-lg px-1 py-1.5 text-xs font-semibold text-zinc-700 transition-colors motion-reduce:transition-none ${FOCUS_RING}`}
      >
        Why this price
        <ChevronDown
          className={`h-4 w-4 transition-transform motion-reduce:transition-none ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <ul id={panelId} className="mt-2 space-y-1.5 border-t border-zinc-200 pt-2.5">
          {item.why.map((w) => (
            <li key={w} className={`text-xs font-normal leading-relaxed ${MUTED}`}>
              {w}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function FaqRow({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  return (
    <div className="border-b border-zinc-200 py-4">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
        className={`flex w-full items-center justify-between gap-4 rounded-md text-left text-sm font-semibold text-zinc-900 ${FOCUS_RING}`}
      >
        {q}
        <ChevronDown
          className={`h-4 w-4 flex-shrink-0 transition-transform motion-reduce:transition-none ${open ? "rotate-180" : ""}`}
          style={{ color: ACCENT_STRONG }}
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

/* ───────── page ───────── */

const ORDER: Category[] = ["sneakers", "bags", "watches"];

export default function Page() {
  const [category, setCategory] = useState<Category>("sneakers");
  const stats = CATEGORY_STATS[category];

  return (
    <main style={{ backgroundColor: BG, color: FG }} className="min-h-screen">
      <div className="mx-auto max-w-[1120px] px-6 pt-10 pb-28 sm:px-10">
        <header className="flex items-center justify-between pb-16">
          <p className="text-sm font-semibold tracking-[0.12em]" style={{ color: FG }}>
            REPICK
          </p>
          <a
            href="#closing"
            className={`rounded-full border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-800 ${FOCUS_RING}`}
          >
            Get matched
          </a>
        </header>

        <section>
          <p className="text-xs font-semibold tracking-[0.28em]" style={{ color: ACCENT }}>
            TRANSPARENT MARKDOWNS
          </p>
          <h1
            className="mt-4 max-w-[720px] text-[44px] font-extrabold leading-[1.05] tracking-[-0.02em] sm:text-[64px]"
            style={{ color: FG, fontFamily: "var(--font-display-mono)" }}
          >
            The discount shows its work.
          </h1>
          <p className={`mt-6 max-w-[460px] text-base font-normal leading-[1.6] ${MUTED}`}>
            Every price on Repick is a markdown from a resale curve we publish, not a
            number someone picked. Pick a category below and watch the curve change.
          </p>
          <a
            href="#closing"
            className={`mt-8 inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white ${FOCUS_RING}`}
            style={{ backgroundColor: ACCENT }}
          >
            Browse markdowns
            <ArrowRight className="h-4 w-4" />
          </a>

          <div className="mt-14 flex flex-col gap-4 sm:flex-row">
            {ITEMS.map((item) => (
              <ProductCard key={item.id} item={item} />
            ))}
          </div>
        </section>

        <Reveal className="mt-28">
          <p className="text-xs font-semibold tracking-[0.28em]" style={{ color: ACCENT }}>
            THE RESALE CURVE
          </p>
          <h2 className="mt-3 max-w-[560px] text-2xl font-extrabold leading-[1.15] tracking-[-0.02em] sm:text-3xl">
            Three categories, three curves.
          </h2>
          <div className="mt-8 flex gap-2" role="group" aria-label="Category">
            {ORDER.map((key) => {
              const active = key === category;
              return (
                <button
                  key={key}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setCategory(key)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors motion-reduce:transition-none ${FOCUS_RING} ${
                    active ? "text-white" : "border border-zinc-300 text-zinc-700"
                  }`}
                  style={active ? { backgroundColor: ACCENT } : undefined}
                >
                  {CATEGORY_STATS[key].label}
                </button>
              );
            })}
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50/60 p-5">
              <p className={`text-xs font-semibold ${MUTED}`}>Avg. resale of retail</p>
              <p className="mt-2 text-3xl font-extrabold tabular-nums" style={{ color: FG }}>
                {stats.avgResale}%
              </p>
            </div>
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50/60 p-5">
              <p className={`text-xs font-semibold ${MUTED}`}>Avg. verification time</p>
              <p className="mt-2 text-3xl font-extrabold tabular-nums" style={{ color: FG }}>
                {stats.verifyHours}h
              </p>
            </div>
            <div className="rounded-2xl border p-5" style={{ backgroundColor: "#FFF7ED", borderColor: "#FDBA74" }}>
              <p className="text-xs font-semibold" style={{ color: ACCENT_STRONG }}>
                Avg. savings vs. new
              </p>
              <p
                className="mt-2 text-3xl font-extrabold tabular-nums"
                style={{ color: ACCENT_STRONG, fontFamily: "var(--font-display-mono)" }}
              >
                {stats.avgSavings}%
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal className="mt-24" delay={0.05}>
          <p className="text-xs font-semibold tracking-[0.28em]" style={{ color: ACCENT }}>
            VERIFIED BUYERS
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              { name: "J. Alvarez", text: "I finally believed a discount percentage. It matched the curve." },
              { name: "M. Okafor", text: "Verification took under a day on a watch I was nervous about." },
              { name: "T. Lindqvist", text: "The bag graded Like New arrived exactly as described." },
            ].map((q) => (
              <div key={q.name} className="rounded-2xl border border-zinc-200 bg-zinc-50/60 p-5">
                <Sparkles className="h-4 w-4" style={{ color: ACCENT_STRONG }} />
                <p className="mt-3 text-sm font-normal leading-relaxed text-zinc-700">
                  &ldquo;{q.text}&rdquo;
                </p>
                <p className="mt-3 text-xs font-semibold text-zinc-500">{q.name}</p>
              </div>
            ))}
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
          <div
            id="closing"
            className="rounded-3xl border p-10 text-center sm:p-14"
            style={{ backgroundColor: "#FFF7ED", borderColor: "#FDBA74" }}
          >
            <p className="text-sm font-normal text-zinc-600">Right now, in {stats.label}</p>
            <p
              className="mt-2 text-[40px] font-extrabold leading-none tabular-nums"
              style={{ color: ACCENT_STRONG, fontFamily: "var(--font-display-mono)" }}
            >
              Buyers save {stats.avgSavings}% on average
            </p>
            <a
              href="#"
              className={`mt-8 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white ${FOCUS_RING}`}
              style={{ backgroundColor: ACCENT }}
            >
              Browse {stats.label}
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </Reveal>
      </div>
    </main>
  );
}
