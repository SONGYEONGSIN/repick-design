"use client";

import { ShieldCheck, TrendingUp, UserCheck } from "lucide-react";
import Reveal from "./Reveal";
import { formatPrice } from "./data";

export default function ValueProp({
  filteredCount,
  median,
  min,
  max,
}: {
  filteredCount: number;
  median: number;
  min: number;
  max: number;
}) {
  const columns = [
    {
      icon: ShieldCheck,
      title: "Condition, checked twice",
      body: "Computer vision reads every submitted photo against millions of reference images, then a second, independent grader confirms the call before a listing goes live.",
    },
    {
      icon: TrendingUp,
      title: "Pricing tied to real trades",
      body:
        filteredCount > 0
          ? `Right now, the median price inside your $${min}–$${max} window is ${formatPrice(median)} across ${filteredCount} listing${filteredCount === 1 ? "" : "s"} — pulled from what items like these actually sold for.`
          : `Widen your window above and this line fills in with the median price across whatever falls inside it — pulled from what items like these actually sold for.`,
    },
    {
      icon: UserCheck,
      title: "Sellers who answer for their grade",
      body: "Every verified seller's last twenty grading calls are tracked in the open. Fall short too often and the badge comes off before the next listing goes up.",
    },
  ];

  return (
    <section
      id="value"
      aria-labelledby="value-heading"
      className="border-t border-white/10 px-4 py-24 sm:px-6 lg:px-10 lg:py-32"
    >
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <span className="text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-emerald-400">
            why the numbers hold up
          </span>
          <h2
            id="value-heading"
            className="mt-4 max-w-[26rem] text-3xl font-extrabold leading-[1.1] tracking-[-0.02em] text-white sm:text-4xl"
          >
            What&rsquo;s actually inside your window
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-10 sm:grid-cols-3">
          {columns.map((col, i) => {
            const Icon = col.icon;
            return (
              <Reveal key={col.title} delay={i * 0.08}>
                <div className="flex flex-col gap-3">
                  <Icon className="h-5 w-5 text-emerald-400" aria-hidden="true" />
                  <h3 className="text-base font-semibold tracking-[-0.02em] text-white">{col.title}</h3>
                  <p className="max-w-[22rem] text-sm font-normal leading-[1.6] text-zinc-400">{col.body}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
