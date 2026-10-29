"use client";

import { useId, useState } from "react";
import { ShieldCheck, BadgeCheck, ChevronDown, ArrowRight, Sparkles } from "lucide-react";
import Reveal from "./Reveal";

const BG = "#0B0B0F";
const FG = "#FFFFFF";
const MUTED = "text-zinc-400";
const ACCENT = "#0EA5E9"; // sky-500 — 7.09:1 on #0B0B0F, safe for body-size text
const ACCENT_TINT = "#7DD3FC"; // sky-300 — decorative only
const INK = "#0B0B0F";

const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0EA5E9]";

/* ───────── deterministic data ───────── */

type Item = {
  id: string;
  name: string;
  category: string;
  photoScore: number;
  historyScore: number;
  condition: string;
  seller: string;
  discount: number;
  why: string[];
};

const ITEMS: Item[] = [
  {
    id: "jacket",
    name: "Alpine Shell Jacket",
    category: "Outerwear",
    photoScore: 88,
    historyScore: 95,
    condition: "Excellent",
    seller: "Verified · 412 sales",
    discount: 61,
    why: [
      "Seam wear matches 3 prior listings from this seller, all graded Excellent on arrival.",
      "Zipper and cuff photos cross-checked against 1,840 reference images of this model.",
    ],
  },
  {
    id: "boots",
    name: "Trail Runner Boots",
    category: "Footwear",
    photoScore: 91,
    historyScore: 90,
    condition: "Very Good",
    seller: "Verified · 128 sales",
    discount: 48,
    why: [
      "Outsole tread depth measured from photo matches 6-month-old resale, not new stock.",
      "Seller's last 9 grading calls were confirmed accurate by independent buyer review.",
    ],
  },
];

const FAQS = [
  {
    q: "What happens if the item doesn't match the grade?",
    a: "Every order carries a 48-hour grade-match guarantee. If the condition grade doesn't hold up on arrival, the sale reverses automatically — no dispute form.",
  },
  {
    q: "How is the match score actually computed?",
    a: "Two independent signals — computer-vision photo analysis and the seller's verified grading history — are blended. You control the weighting below; the catalog default is an even split.",
  },
];

function round(n: number) {
  return Math.round(n);
}

/* ───────── small building blocks ───────── */

function Badge({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "accent" }) {
  if (tone === "accent") {
    return (
      <span
        className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold tabular-nums"
        style={{ backgroundColor: ACCENT, color: INK }}
      >
        {children}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-white/15 px-2.5 py-1 text-xs font-semibold text-zinc-300">
      {children}
    </span>
  );
}

function ItemArt({ seed }: { seed: number }) {
  // Deterministic generative mark — flat geometric shapes, no gradients, no photos.
  const bars = [0.4, 0.65, 0.5, 0.82, 0.58].map((v, i) => v + ((seed + i) % 3) * 0.04);
  return (
    <svg viewBox="0 0 160 100" className="h-full w-full" aria-hidden="true">
      <rect x="0" y="0" width="160" height="100" fill="#15151c" />
      {bars.map((v, i) => (
        <rect
          key={i}
          x={14 + i * 28}
          y={100 - v * 72 - 10}
          width="18"
          height={v * 72}
          fill={i === 2 ? ACCENT : "#2b2b35"}
        />
      ))}
    </svg>
  );
}

function ProductCard({ item }: { item: Item }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  return (
    <div className="flex-1 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
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
        <Badge tone="accent">
          {item.photoScore}% match
        </Badge>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <Badge>
          <ShieldCheck className="h-3.5 w-3.5" style={{ color: ACCENT_TINT }} />
          {item.condition}
        </Badge>
        <Badge>
          <BadgeCheck className="h-3.5 w-3.5" style={{ color: ACCENT_TINT }} />
          {item.seller}
        </Badge>
        <Badge>−{item.discount}% vs retail</Badge>
      </div>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
        className={`mt-4 flex w-full items-center justify-between rounded-lg px-1 py-1.5 text-xs font-semibold text-zinc-300 transition-colors motion-reduce:transition-none ${FOCUS_RING}`}
      >
        Why this matched
        <ChevronDown
          className={`h-4 w-4 transition-transform motion-reduce:transition-none ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <ul id={panelId} className="mt-2 space-y-1.5 border-t border-white/10 pt-2.5">
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

function FaqRow({ q, a, defaultOpen = false }: { q: string; a: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
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
          style={{ color: ACCENT_TINT }}
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

export default function Page() {
  const [weight, setWeight] = useState(50);
  const focal = ITEMS[0];
  const blended = round(focal.photoScore * (1 - weight / 100) + focal.historyScore * (weight / 100));
  const sliderId = useId();

  return (
    <main style={{ backgroundColor: BG, color: FG }} className="min-h-screen">
      <div className="mx-auto max-w-[1120px] px-6 pt-10 pb-28 sm:px-10">
        {/* header */}
        <header className="flex items-center justify-between pb-16">
          <p className="text-sm font-semibold tracking-[0.12em]" style={{ color: FG }}>
            REPICK
          </p>
          <a
            href="#closing"
            className={`rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-zinc-200 ${FOCUS_RING}`}
          >
            Get matched
          </a>
        </header>

        {/* hero — headline, subhead, CTA, and product proof all in one component */}
        <section>
          <p
            className="text-xs font-semibold tracking-[0.28em]"
            style={{ color: ACCENT }}
          >
            AI-VERIFIED RESALE
          </p>
          <h1
            className="mt-4 max-w-[720px] text-[44px] font-extrabold leading-[1.05] tracking-[-0.02em] sm:text-[64px]"
            style={{ color: FG, fontFamily: "var(--font-display-grotesk)" }}
          >
            Every match ships with the receipt.
          </h1>
          <p className={`mt-6 max-w-[460px] text-base font-normal leading-[1.6] ${MUTED}`}>
            Repick blends computer-vision photo analysis with each seller&apos;s verified
            grading history, so the match score on screen is the same one your item has
            to earn.
          </p>
          <a
            href="#closing"
            className={`mt-8 inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold ${FOCUS_RING}`}
            style={{ backgroundColor: ACCENT, color: INK }}
          >
            See today&apos;s matches
            <ArrowRight className="h-4 w-4" />
          </a>

          <div className="mt-14 flex flex-col gap-4 sm:flex-row">
            {ITEMS.map((item) => (
              <ProductCard key={item.id} item={item} />
            ))}
          </div>
        </section>

        {/* value: live manipulation */}
        <Reveal className="mt-28">
          <p className="text-xs font-semibold tracking-[0.28em]" style={{ color: ACCENT }}>
            HOW WE SCORE
          </p>
          <h2
            className="mt-3 max-w-[560px] text-2xl font-extrabold leading-[1.15] tracking-[-0.02em] sm:text-3xl"
            style={{ color: FG }}
          >
            Weight the two signals yourself.
          </h2>
          <div className="mt-8 grid gap-10 sm:grid-cols-[1fr_260px] sm:items-center">
            <div>
              <label htmlFor={sliderId} className="flex items-center justify-between text-xs font-semibold text-zinc-300">
                <span>AI photo analysis</span>
                <span>Seller history</span>
              </label>
              <input
                id={sliderId}
                type="range"
                min={0}
                max={100}
                step={1}
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className={`mt-3 h-2 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-[#0EA5E9] ${FOCUS_RING}`}
              />
              <p className={`mt-3 text-xs font-normal ${MUTED}`}>
                Dragging recomputes {focal.name}&apos;s blended match score on the right —
                and the number below carries into the offer at the bottom of this page.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center">
              <p className={`text-xs font-semibold ${MUTED}`}>Blended match score</p>
              <p
                className="mt-2 text-[56px] font-extrabold leading-none tabular-nums"
                style={{ color: ACCENT, fontFamily: "var(--font-display-grotesk)" }}
              >
                {blended}%
              </p>
              <p className="mt-2 text-xs font-normal text-zinc-500">{focal.name}</p>
            </div>
          </div>
        </Reveal>

        {/* social proof */}
        <Reveal className="mt-24" delay={0.05}>
          <p className="text-xs font-semibold tracking-[0.28em]" style={{ color: ACCENT }}>
            VERIFIED BUYERS
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              { name: "D. Calloway", text: "Grade matched exactly. The score wasn't marketing." },
              { name: "R. Mbeki", text: "Returned once — refund hit before I finished writing the note." },
              { name: "S. Patel", text: "I can see why a jacket scored high instead of just trusting it." },
            ].map((q) => (
              <div key={q.name} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <Sparkles className="h-4 w-4" style={{ color: ACCENT_TINT }} />
                <p className="mt-3 text-sm font-normal leading-relaxed text-zinc-300">
                  &ldquo;{q.text}&rdquo;
                </p>
                <p className="mt-3 text-xs font-semibold text-zinc-500">{q.name}</p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* FAQ */}
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

        {/* closing CTA — reuses the live blended score */}
        <Reveal className="mt-24" delay={0.05}>
          <div id="closing" className="rounded-3xl border border-white/10 bg-white/[0.03] p-10 text-center sm:p-14">
            <p className={`text-sm font-normal ${MUTED}`}>At your current weighting</p>
            <p
              className="mt-2 text-[40px] font-extrabold leading-none tabular-nums"
              style={{ color: FG, fontFamily: "var(--font-display-grotesk)" }}
            >
              {focal.name} scores {blended}%
            </p>
            <a
              href="#"
              className={`mt-8 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold ${FOCUS_RING}`}
              style={{ backgroundColor: ACCENT, color: INK }}
            >
              Claim this match
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </Reveal>
      </div>
    </main>
  );
}
