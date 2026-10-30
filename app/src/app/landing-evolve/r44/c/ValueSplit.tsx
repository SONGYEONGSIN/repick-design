import { TrendingDown, CalendarRange, Calculator } from "lucide-react";
import Reveal from "./Reveal";
import { DISPLAY, EYEBROW, GHOST_TEXT, MUTED_TEXT } from "./tokens";
import { HORIZON_DAYS } from "./data";

const FEATURES = [
  {
    icon: TrendingDown,
    title: "The demand curve is fixed",
    body:
      "Every list price runs through the same elasticity formula. List high and the daily sell rate falls; list low and it climbs — no randomness, no hidden test running behind it.",
  },
  {
    icon: CalendarRange,
    title: `${HORIZON_DAYS} days, every time`,
    body:
      "The horizon never moves. Comparing $60 against $180 means comparing the same window, not two tests of different lengths.",
  },
  {
    icon: Calculator,
    title: "The headline is derived, not typed",
    body:
      "Sells-out-in-N and percent-sold are read straight off the curve above — the same read that reaches the closing section below.",
  },
];

export function ValueSplit() {
  return (
    <section className="border-t border-[#121212]/10 px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
      <div className="mx-auto max-w-[1280px]">
        <div className="relative grid grid-cols-1 gap-y-6 lg:grid-cols-12">
          <Reveal className="min-w-0 lg:col-span-6">
            <p className={`${EYEBROW} text-emerald-700`}>How the projection works</p>
            <h2 className={`${DISPLAY} mt-3 max-w-[480px] text-3xl font-extrabold leading-[1.1] tracking-[-0.02em] text-[#121212] sm:text-4xl`}>
              Three fixed assumptions, one live price.
            </h2>
            <p className={`mt-4 max-w-[496px] text-base font-normal leading-[1.6] ${MUTED_TEXT}`}>
              Only the price you set moves. The lot size, the horizon, and the formula that
              turns price into a sell rate all stay exactly where they started.
            </p>
          </Reveal>

          <div aria-hidden="true" className="pointer-events-none hidden select-none items-start justify-end lg:col-span-6 lg:flex">
            <span className={`${DISPLAY} font-extrabold leading-none tracking-[-0.02em] ${GHOST_TEXT}`} style={{ fontSize: "clamp(6rem,11vw,9rem)" }}>
              {HORIZON_DAYS}
            </span>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <Reveal key={f.title} delay={i * 0.08} className="h-full">
                <div className="flex h-full flex-col gap-3 rounded-2xl border border-[#121212]/10 bg-[#121212]/[0.02] p-5">
                  <Icon className="h-5 w-5 text-emerald-700" aria-hidden="true" />
                  <h3 className="text-base font-extrabold leading-[1.2] text-[#121212]">{f.title}</h3>
                  <p className={`max-w-[300px] text-sm font-normal leading-[1.6] ${MUTED_TEXT}`}>{f.body}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
