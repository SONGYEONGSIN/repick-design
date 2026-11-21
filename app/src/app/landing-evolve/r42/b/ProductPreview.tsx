"use client";

import { ArrowRight } from "lucide-react";
import Reveal from "./Reveal";
import {
  formatPrice,
  priceScore,
  shipScore,
  DISPLAY,
  LISTINGS,
  type LeaderId,
} from "./data";

const L = LISTINGS.left;
const R = LISTINGS.right;

function EdgeCell({ winner }: { winner: "left" | "right" }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-600">
      Favors {winner === "left" ? "Listing A" : "Listing B"}
    </span>
  );
}

export default function ProductPreview({
  scoreLeft,
  scoreRight,
  leaderId,
}: {
  scoreLeft: number;
  scoreRight: number;
  leaderId: LeaderId;
}) {
  return (
    <section
      id="breakdown"
      aria-labelledby="breakdown-heading"
      className="border-t border-zinc-100 bg-zinc-50 px-4 py-20 sm:px-6 lg:px-10 lg:py-28"
    >
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <span className="text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-[#15803d]">
            the full breakdown
          </span>
          <h2
            id="breakdown-heading"
            className="mt-4 max-w-[30rem] text-3xl font-extrabold leading-[1.1] tracking-[-0.02em] text-zinc-950 sm:text-4xl"
          >
            Four fixed facts, one moving total.
          </h2>
          <p className="mt-5 max-w-[32rem] text-base font-normal leading-[1.6] text-zinc-600">
            The first four rows below are fixed — neither listing&rsquo;s price, grade, ship
            time or seller history changes. Only the last row, the weighted score, recalculates
            from the priorities you set in the hero above.
          </p>
        </Reveal>

        <Reveal delay={0.08} className="mt-10 overflow-x-auto rounded-2xl border border-zinc-200 bg-white">
          <table className="w-full min-w-[560px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-100">
                <th scope="col" className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-600">
                  Attribute
                </th>
                <th scope="col" className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-600">
                  Listing A — {L.seller}
                </th>
                <th scope="col" className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-600">
                  Listing B — {R.seller}
                </th>
                <th scope="col" className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-600">
                  Edge
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-zinc-100">
                <th scope="row" className="px-5 py-4 font-semibold text-zinc-950">Price</th>
                <td className="px-5 py-4 tabular-nums text-zinc-700">
                  {formatPrice(L.price)} <span className="text-zinc-500">· score {priceScore(L)}</span>
                </td>
                <td className="px-5 py-4 tabular-nums text-zinc-700">
                  {formatPrice(R.price)} <span className="text-zinc-500">· score {priceScore(R)}</span>
                </td>
                <td className="px-5 py-4"><EdgeCell winner="left" /></td>
              </tr>
              <tr className="border-b border-zinc-100">
                <th scope="row" className="px-5 py-4 font-semibold text-zinc-950">Condition</th>
                <td className="px-5 py-4 tabular-nums text-zinc-700">
                  {L.conditionGrade} <span className="text-zinc-500">· score {L.conditionScore}</span>
                </td>
                <td className="px-5 py-4 tabular-nums text-zinc-700">
                  {R.conditionGrade} <span className="text-zinc-500">· score {R.conditionScore}</span>
                </td>
                <td className="px-5 py-4"><EdgeCell winner="right" /></td>
              </tr>
              <tr className="border-b border-zinc-100">
                <th scope="row" className="px-5 py-4 font-semibold text-zinc-950">Ship speed</th>
                <td className="px-5 py-4 tabular-nums text-zinc-700">
                  {L.shipDays} day <span className="text-zinc-500">· score {shipScore(L)}</span>
                </td>
                <td className="px-5 py-4 tabular-nums text-zinc-700">
                  {R.shipDays} days <span className="text-zinc-500">· score {shipScore(R)}</span>
                </td>
                <td className="px-5 py-4"><EdgeCell winner="left" /></td>
              </tr>
              <tr className="border-b border-zinc-100">
                <th scope="row" className="px-5 py-4 font-semibold text-zinc-950">Seller trust</th>
                <td className="px-5 py-4 tabular-nums text-zinc-700">
                  {L.trustScore}/100 <span className="text-zinc-500">· {L.salesCount} sales</span>
                </td>
                <td className="px-5 py-4 tabular-nums text-zinc-700">
                  {R.trustScore}/100 <span className="text-zinc-500">· {R.salesCount} sales</span>
                </td>
                <td className="px-5 py-4"><EdgeCell winner="right" /></td>
              </tr>
              <tr>
                <th scope="row" className="px-5 py-4 font-semibold text-zinc-950">
                  Weighted score
                  <span className="mt-0.5 block text-[11px] font-normal text-zinc-500">updates with your weights</span>
                </th>
                <td className={`px-5 py-4 text-lg font-extrabold tabular-nums ${leaderId === "left" ? "text-[#15803d]" : "text-zinc-950"}`} style={DISPLAY}>
                  {scoreLeft.toFixed(1)}
                </td>
                <td className={`px-5 py-4 text-lg font-extrabold tabular-nums ${leaderId === "right" ? "text-[#15803d]" : "text-zinc-950"}`} style={DISPLAY}>
                  {scoreRight.toFixed(1)}
                </td>
                <td className="px-5 py-4">
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#15803d]">
                    {leaderId === "tie" ? "Currently tied" : leaderId === "left" ? "Listing A leads" : "Listing B leads"}
                    <ArrowRight className="h-3 w-3" aria-hidden="true" />
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </Reveal>
      </div>
    </section>
  );
}
