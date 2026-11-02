import { GitCompareArrows, Percent, SplitSquareHorizontal } from "lucide-react";
import Reveal from "./Reveal";
import { DISCOUNT_MAX, DISCOUNT_MIN } from "./data";
import { EYEBROW, GHOST_TEXT, MUTED_TEXT } from "./tokens";

const FEATURES = [
  {
    icon: SplitSquareHorizontal,
    title: "One discount, every price",
    body:
      "The overcoat, the sneakers, the tote, the denim jacket — all four recompute from the exact same percent the moment the line moves. Nothing on either side is typed in separately.",
  },
  {
    icon: Percent,
    title: `Bounded ${DISCOUNT_MIN}%–${DISCOUNT_MAX}%`,
    body:
      "The line can't be dragged to a discount nobody would actually see — the range is set by what resale items on repick have closed at, not by a round number that looks dramatic.",
  },
  {
    icon: GitCompareArrows,
    title: "The gap doesn't reset at the fold",
    body:
      "Scroll down and the savings figure you set above is the same one quoted in the closing line — not a separate example that stays put while you keep dragging.",
  },
];

export function ValueSplit() {
  return (
    <section id="value" className="border-t border-white/10 px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
      <div className="mx-auto max-w-[1280px]">
        <div className="relative grid grid-cols-1 gap-y-6 lg:grid-cols-12">
          <Reveal className="min-w-0 lg:col-span-6">
            <p className={`${EYEBROW} text-[#BEF264]`}>How the line is drawn</p>
            <h2 className="mt-3 max-w-[480px] text-3xl font-extrabold leading-[1.1] tracking-[-0.02em] text-[#F4F4F5] sm:text-4xl">
              The boundary moves. The math underneath doesn&rsquo;t.
            </h2>
            <p className={`mt-4 max-w-[480px] text-base font-normal leading-[1.6] ${MUTED_TEXT}`}>
              Three fixed rules sit behind the line above. Only the discount you set by dragging
              it changes — the rules that turn that number into dollars never do.
            </p>
          </Reveal>

          <div aria-hidden="true" className="pointer-events-none hidden select-none items-start justify-end lg:col-span-6 lg:flex">
            <span
              className={`font-extrabold leading-none tracking-[-0.02em] ${GHOST_TEXT}`}
              style={{ fontSize: "clamp(5rem,9vw,8rem)" }}
            >
              {DISCOUNT_MIN}–{DISCOUNT_MAX}%
            </span>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <Reveal key={f.title} delay={i * 0.08} className="h-full">
                <div className="flex h-full flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <Icon className="h-5 w-5 text-[#BEF264]" aria-hidden="true" />
                  <h3 className="text-base font-extrabold leading-[1.2] text-[#F4F4F5]">{f.title}</h3>
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
