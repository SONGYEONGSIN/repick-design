import Reveal from "./Reveal";
import { TESTIMONIALS } from "./data";
import { BODY_WIDTH_BASE, CAPTION, DISPLAY, GHOST_TEXT, MUTED_TEXT, STAT_LABEL } from "./tokens";

const STATS = [
  { value: "3,100", label: "shoppers who finished all three questions" },
  { value: "27", label: "fixed branches the tree can resolve to" },
  { value: "9d", label: "median days-to-sale across matched archetypes" },
];

export function SocialProof() {
  return (
    <section className="border-t border-white/10 px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
      <div className="mx-auto max-w-[1280px]">
        <p className={`${CAPTION} ${MUTED_TEXT}`}>From people who ran the tree first</p>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.id} delay={i * 0.08} className="min-w-0 h-full">
              <blockquote className="relative h-full rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                <span aria-hidden="true" className={`${DISPLAY} absolute right-5 top-3 text-5xl font-extrabold leading-none ${GHOST_TEXT}`}>
                  &rdquo;
                </span>
                <p className={`relative text-base font-normal leading-[1.6] text-[#F5F5F6] ${BODY_WIDTH_BASE}`}>{t.quote}</p>
                <footer className="relative mt-4">
                  <p className="text-sm font-semibold text-[#F5F5F6]">{t.name}</p>
                  <p className={`text-xs font-normal ${MUTED_TEXT}`}>{t.role}</p>
                </footer>
              </blockquote>
            </Reveal>
          ))}
        </div>

        <Reveal
          delay={0.16}
          className="mt-10 grid grid-cols-1 gap-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:grid-cols-3 sm:p-8"
        >
          {STATS.map((s) => (
            <div key={s.label} className="min-w-0">
              <p className={`${DISPLAY} text-3xl font-extrabold tabular-nums text-[#F5F5F6] sm:text-4xl`}>{s.value}</p>
              <p className={`mt-1 ${STAT_LABEL} ${MUTED_TEXT}`}>{s.label}</p>
            </div>
          ))}
        </Reveal>
        <p className={`mt-3 text-xs font-normal ${MUTED_TEXT}`}>
          These three figures are historical snapshots — they do not move when you click the tree above.
        </p>
      </div>
    </section>
  );
}
