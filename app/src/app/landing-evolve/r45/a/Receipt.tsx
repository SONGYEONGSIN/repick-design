"use client";

import { useId, useState } from "react";
import Image from "next/image";
import { ChevronDown, Minus, Plus, ShieldCheck, Wallet } from "lucide-react";
import { ITEM, formatPct, formatUsd, type ConditionGrade, type ReceiptLines } from "./data";
import { BG, CAPTION, CARD_BG, DISPLAY, FOCUS_RING, MUTED_TEXT, ON_ACCENT_LARGE_TEXT } from "./tokens";

/**
 * A punched-paper edge: a thin strip whose own fill is the receipt's card color, with a row of
 * circular holes cut through to the page background behind it. Pure CSS, fixed pixel tooth
 * size tiled with `background-repeat`, so it holds its shape at every viewport width without
 * any JS measurement or layout dependency.
 */
function ScallopEdge({ flip = false }: { flip?: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={flip ? "-mb-px" : "-mt-px"}
      style={{
        height: "10px",
        backgroundColor: CARD_BG,
        backgroundImage: `radial-gradient(circle at 8px 5px, ${BG} 6px, transparent 6.5px)`,
        backgroundSize: "16px 10px",
        backgroundRepeat: "repeat-x",
        backgroundPosition: flip ? "8px 0px" : "0px 0px",
      }}
    />
  );
}

function BarcodeMark() {
  // Fixed, deterministic bar widths — decorative "ticket" texture, not a real barcode and not
  // conveying any information on its own, so it is aria-hidden.
  const widths = [2, 1, 3, 1, 1, 2, 4, 1, 2, 1, 3, 2, 1, 4, 1, 2, 1, 3, 1, 2];
  return (
    <div aria-hidden="true" className="flex h-6 items-stretch gap-[2px] opacity-40">
      {widths.map((w, i) => (
        <span key={i} className="bg-zinc-500" style={{ width: `${w}px` }} />
      ))}
    </div>
  );
}

function LineRow({
  label,
  sublabel,
  sign,
  amount,
  tone = "default",
}: {
  label: string;
  sublabel?: string;
  sign?: "-" | "+";
  amount: number;
  tone?: "default" | "credit";
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <div className="min-w-0">
        <p className="text-sm font-normal text-[#F5F5F7]">{label}</p>
        {sublabel && <p className={`mt-0.5 text-xs font-normal ${MUTED_TEXT}`}>{sublabel}</p>}
      </div>
      <p
        className={`flex shrink-0 items-center gap-1 text-base font-semibold tabular-nums ${
          tone === "credit" ? "text-sky-400" : "text-[#F5F5F7]"
        }`}
      >
        {sign === "-" && <Minus className="h-3 w-3" aria-hidden="true" />}
        {sign === "+" && <Plus className="h-3 w-3" aria-hidden="true" />}
        {formatUsd(amount)}
      </p>
    </div>
  );
}

export function Receipt({
  price,
  grade,
  receipt,
}: {
  price: number;
  grade: ConditionGrade;
  receipt: ReceiptLines;
}) {
  const [expanded, setExpanded] = useState(false);
  const detailId = useId();

  return (
    <div
      className="w-full min-w-0 overflow-hidden rounded-2xl shadow-[0_18px_60px_-20px_rgba(0,0,0,0.65)]"
      style={{ backgroundColor: CARD_BG }}
    >
      <div className="rounded-t-2xl px-5 pb-0 pt-5 sm:px-6">
        <div className="flex items-baseline justify-between gap-3">
          <p className={`${CAPTION} text-sky-400`}>Payout receipt</p>
          <p className={`${CAPTION} ${MUTED_TEXT} tabular-nums`}>No. {ITEM.receiptNo}</p>
        </div>

        {/* Item being sold — the listing-card proof that anchors the receipt to a real item.
            Thumbnail has a fixed aspect ratio + reserved background, and the badges sit in
            their own row below it rather than as overlays on the photo. */}
        <div className="mt-4 flex gap-3 border-b border-dashed border-white/15 pb-4">
          <div className="relative aspect-[4/3] w-20 shrink-0 overflow-hidden rounded-lg bg-zinc-800 sm:w-24">
            <Image src={ITEM.image} alt={ITEM.alt} fill sizes="120px" className="object-cover" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-[#F5F5F7]">{ITEM.title}</p>
            <p className={`truncate text-xs font-normal ${MUTED_TEXT}`}>{ITEM.brand}</p>
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <span className="inline-flex items-center rounded-full border border-sky-400/40 px-2 py-0.5 text-[11px] font-semibold text-sky-400">
                Grade {grade.label}
              </span>
              {ITEM.verified && (
                <span className="inline-flex items-center gap-1 rounded-full border border-white/15 px-2 py-0.5 text-[11px] font-semibold text-[#F5F5F7]">
                  <ShieldCheck className="h-3 w-3" aria-hidden="true" />
                  Verified
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 sm:px-6">
        <div className="divide-y divide-dashed divide-white/15">
          <LineRow label="Listed price" amount={receipt.listedPrice} />

          <div className="py-3">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-normal text-[#F5F5F7]">Condition deduction</p>
                <p className={`mt-0.5 text-xs font-normal ${MUTED_TEXT}`}>
                  {grade.label} · −{formatPct(grade.deductionRate)}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <p className="flex items-center gap-1 text-base font-semibold tabular-nums text-[#F5F5F7]">
                  <Minus className="h-3 w-3" aria-hidden="true" />
                  {formatUsd(receipt.conditionDeduction)}
                </p>
                <button
                  type="button"
                  aria-expanded={expanded}
                  aria-controls={detailId}
                  onClick={() => setExpanded((v) => !v)}
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/15 text-[#F5F5F7] transition-colors duration-200 hover:border-white/35 ${FOCUS_RING}`}
                >
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
                    aria-hidden="true"
                  />
                  <span className="sr-only">
                    {expanded ? "Hide why this grade deducts this amount" : "Show why this grade deducts this amount"}
                  </span>
                </button>
              </div>
            </div>
            <p
              id={detailId}
              className={`text-xs font-normal leading-[1.6] ${MUTED_TEXT} transition-[max-height,opacity,margin] duration-200 ease-out overflow-hidden ${
                expanded ? "mt-2 max-h-20 opacity-100" : "mt-0 max-h-0 opacity-0"
              }`}
            >
              {grade.detail}
            </p>
          </div>

          <LineRow label="Platform fee" sublabel="9% flat, after the condition deduction" sign="-" amount={receipt.platformFee} />
          <LineRow label="Shipping credit" sublabel="Prepaid label, credited back to you" sign="+" amount={receipt.shippingCredit} tone="credit" />
        </div>

        <div className="mt-2 flex items-center justify-between gap-4 rounded-xl bg-sky-400 px-4 py-4 sm:px-5 sm:py-5">
          <div className="flex min-w-0 items-center gap-2.5">
            <Wallet className={`h-5 w-5 shrink-0 ${ON_ACCENT_LARGE_TEXT}`} aria-hidden="true" />
            <p className={`${CAPTION} ${ON_ACCENT_LARGE_TEXT}`}>Net payout</p>
          </div>
          <p
            aria-live="polite"
            className={`${DISPLAY} shrink-0 text-[clamp(1.9rem,4vw,2.75rem)] font-extrabold leading-none tabular-nums ${ON_ACCENT_LARGE_TEXT}`}
          >
            {formatUsd(receipt.netPayout)}
          </p>
        </div>
      </div>

      <div className="mt-1 flex items-center justify-between gap-4 px-5 pb-5 sm:px-6">
        <p className={`text-[11px] font-normal tabular-nums ${MUTED_TEXT}`}>
          On {formatUsd(price)} listed · {grade.label} grade
        </p>
        <BarcodeMark />
      </div>

      <ScallopEdge flip />
    </div>
  );
}
