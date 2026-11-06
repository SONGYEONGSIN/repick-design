import { CalendarRange, GitCompareArrows, SlidersHorizontal } from "lucide-react";
import Reveal from "./Reveal";
import { WINDOW_MIN_DAYS, type WindowStats, windowLabel } from "./data";
import { EYEBROW, GHOST_TEXT, MUTED_TEXT } from "./tokens";

export function ValueSplit({ start, end, stats }: { start: number; end: number; stats: WindowStats }) {
  const features = [
    {
      icon: SlidersHorizontal,
      title: "One window, every surface",
      body:
        "The chart's accent segment, the headline stat, every listing's “typically sells in” line, and the closing line below all read the same pair of handle positions — nothing recomputes on a delay.",
    },
    {
      icon: CalendarRange,
      title: `Bounded ${WINDOW_MIN_DAYS}–90 days`,
      body:
        "The window can't collapse to a single day or stretch past the 90 days actually on file — the limits come from how much trend history exists, not a round number chosen to look dramatic.",
    },
    {
      icon: GitCompareArrows,
      title: "The comparison moves with you",
      body: `Right now, for ${windowLabel(start, end).toLowerCase()}, that's an average of ${stats.avgDays} days to sell. Drag either handle and this sentence is the first thing that changes.`,
    },
  ];

  return (
    <section className="border-t border-[#E4E4E7] px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
      <div className="mx-auto max-w-[1280px]">
        <div className="relative grid grid-cols-1 gap-y-6 lg:grid-cols-12">
          <Reveal className="min-w-0 lg:col-span-6">
            <p className={`${EYEBROW} text-[#047857]`}>How the window is read</p>
            <h2 className="mt-3 max-w-[480px] text-3xl font-extrabold leading-[1.1] tracking-[-0.02em] text-[#09090B] sm:text-4xl">
              The handles move. The math underneath doesn&rsquo;t.
            </h2>
            <p className={`mt-4 max-w-[480px] text-base font-normal leading-[1.6] ${MUTED_TEXT}`}>
              Three fixed rules sit behind the timeline above. Only the window you select by dragging it
              changes — the 90 days of trend data and the rules that slice it never do.
            </p>
          </Reveal>

          <div aria-hidden="true" className="pointer-events-none hidden select-none items-start justify-end lg:col-span-6 lg:flex">
            <span className={`font-extrabold leading-none tracking-[-0.02em] ${GHOST_TEXT}`} style={{ fontSize: "clamp(5rem,9vw,8rem)" }}>
              {WINDOW_MIN_DAYS}–90d
            </span>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <Reveal key={f.title} delay={i * 0.08} className="h-full min-w-0">
                <div className="flex h-full flex-col gap-3 rounded-2xl border border-[#E4E4E7] bg-white p-5">
                  <Icon className="h-5 w-5 text-[#047857]" aria-hidden="true" />
                  <h3 className="text-base font-extrabold leading-[1.2] text-[#09090B]">{f.title}</h3>
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
