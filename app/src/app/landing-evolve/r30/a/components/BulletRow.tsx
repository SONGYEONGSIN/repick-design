import type { Category } from "./data";
import { bandFor, clearsMedian, pctOf, readoutFor } from "./data";

function CheckIcon() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" className="shrink-0">
      <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path d="M5 8.2 7 10.4 11 5.8" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ShortIcon() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" className="shrink-0">
      <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path d="M5 8h6" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function BulletRow({ cat, price }: { cat: Category; price: number }) {
  const band = bandFor(cat, price);
  const clears = clearsMedian(cat, price);

  const stealPct = pctOf(cat.steal, cat.ceiling);
  const fairPct = pctOf(cat.fair, cat.ceiling);
  const medianLeft = pctOf(cat.median, cat.ceiling);
  const thresholdLeft = pctOf(price, cat.ceiling);

  const segClass = (seg: "steal" | "fair" | "above") =>
    seg === band
      ? "bg-amber-500/30 ring-1 ring-inset ring-amber-400/50"
      : seg === "steal"
        ? "bg-zinc-800"
        : seg === "fair"
          ? "bg-zinc-700"
          : "bg-zinc-600";

  return (
    <li className="border-b border-zinc-800 py-6 last:border-0">
      <div className="flex min-w-0 flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-base font-semibold text-white">{cat.label}</h3>
        <span className="font-[family-name:var(--font-display-mono)] text-xs tracking-[0.12em] text-zinc-400">
          MEDIAN ASK ${cat.median}
        </span>
      </div>

      <div className="relative mt-4 px-1.5">
        <div className="flex h-7 w-full min-w-0 overflow-hidden rounded-sm" aria-hidden="true">
          <div className={`h-full ${segClass("steal")}`} style={{ width: `${stealPct}%` }} />
          <div className={`h-full ${segClass("fair")}`} style={{ width: `${fairPct - stealPct}%` }} />
          <div className={`h-full ${segClass("above")}`} style={{ width: `${100 - fairPct}%` }} />
        </div>

        {/* median asking-price marker */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-0 h-7 w-px -translate-x-1/2 bg-zinc-300/70"
          style={{ left: `${medianLeft}%` }}
        />

        {/* current slider threshold marker */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-1.5 h-3 w-3 -translate-x-1/2 rotate-45 border border-[#0B0B0F] bg-amber-500"
          style={{ left: `${thresholdLeft}%` }}
        />
      </div>

      <div className="mt-2 flex min-w-0 flex-wrap justify-between gap-x-4 gap-y-1 px-1.5 text-[11px] tracking-[0.1em] text-zinc-400">
        <span>STEAL</span>
        <span>FAIR MARKET</span>
        <span>ABOVE MARKET</span>
      </div>

      <p
        className={`mt-5 flex max-w-[27rem] items-start gap-2 text-sm leading-[1.6] ${
          clears ? "text-zinc-200" : "text-zinc-400"
        }`}
      >
        <span className={clears ? "mt-0.5 text-amber-300" : "mt-0.5 text-zinc-500"}>
          {clears ? <CheckIcon /> : <ShortIcon />}
        </span>
        <span>{readoutFor(cat, price)}</span>
      </p>
    </li>
  );
}
