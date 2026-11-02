"use client";

import { PriceSlider } from "./PriceSlider";
import { GradeSelector } from "./GradeSelector";
import { Receipt } from "./Receipt";
import { gradeById, type ConditionGradeId, type ReceiptLines } from "./data";
import { DISPLAY, EYEBROW, MUTED_TEXT } from "./tokens";

export function Hero({
  price,
  onPriceChange,
  gradeId,
  onGradeChange,
  receipt,
}: {
  price: number;
  onPriceChange: (next: number) => void;
  gradeId: ConditionGradeId;
  onGradeChange: (next: ConditionGradeId) => void;
  receipt: ReceiptLines;
}) {
  const grade = gradeById(gradeId);

  return (
    <section id="payout-receipt" className="mx-auto max-w-[1440px] px-4 pb-14 pt-10 sm:px-6 sm:pt-14 lg:px-10 lg:pb-20 lg:pt-16">
      <p className={`${EYEBROW} text-sky-400`}>Price it. Grade it. See the receipt.</p>
      <h1
        className={`${DISPLAY} mt-3 max-w-3xl text-[clamp(2.25rem,4.2vw+1rem,4.75rem)] font-extrabold leading-[1.03] tracking-[-0.02em] text-[#F5F5F7]`}
      >
        Every line of your payout, before you ever hit list.
      </h1>
      <p className="mt-5 max-w-[500px] text-lg font-normal leading-[1.6] text-[#F5F5F7]">
        Drag the price, pick a condition grade, and watch an itemized receipt total your exact
        payout — deduction, fee, and shipping credit included, live.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-x-10">
        {/* Controls: the two live inputs that drive every number on the receipt to the right. */}
        <div className="min-w-0 flex flex-col gap-6 lg:col-span-5">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
            <PriceSlider price={price} onChange={onPriceChange} />
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
            <p className="text-sm font-semibold tracking-[0.02em] text-[#F5F5F7]">Condition grade</p>
            <div className="mt-4">
              <GradeSelector selectedId={gradeId} onChange={onGradeChange} />
            </div>
            <p className={`mt-3 max-w-[320px] text-xs font-normal leading-[1.6] ${MUTED_TEXT}`}>
              Every grade's deduction rate is fixed and shown above — nothing here is a guess
              made after you list.
            </p>
          </div>

          <p className="sr-only">
            This receipt recalculates every line from the listed price and the selected
            condition grade using a fixed formula — the same two inputs always produce the same
            five figures.
          </p>
        </div>

        {/* Product proof: the itemized receipt, inline in the hero, not pushed below the fold. */}
        <div className="min-w-0 lg:col-span-7">
          <Receipt price={price} grade={grade} receipt={receipt} />
        </div>
      </div>
    </section>
  );
}
