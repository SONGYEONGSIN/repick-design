import Reveal from "./Reveal";
import { STATS, TESTIMONIALS } from "./data";
import { CAPTION, DISPLAY, GHOST_TEXT, MUTED_TEXT, STAT_LABEL } from "./tokens";

export function SocialProof() {
  return (
    <section className="border-t border-white/10 px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
      <div className="mx-auto max-w-[1280px]">
        <p className={`${CAPTION} ${MUTED_TEXT}`}>From sellers who read the receipt first</p>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.id} delay={i * 0.08} className="h-full min-w-0">
              <blockquote className="relative h-full min-w-0 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <span aria-hidden="true" className={`${DISPLAY} absolute right-5 top-3 text-5xl font-extrabold leading-none ${GHOST_TEXT}`}>
                  &rdquo;
                </span>
                <p className="relative max-w-[480px] text-base font-normal leading-[1.6] text-[#F5F5F7]">{t.quote}</p>
                <footer className="relative mt-4">
                  <p className="text-sm font-semibold text-[#F5F5F7]">{t.name}</p>
                  <p className={`text-xs font-normal ${MUTED_TEXT}`}>{t.role}</p>
                </footer>
              </blockquote>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.16} className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {STATS.map((s) => (
              <div key={s.label} className="min-w-0">
                <p className={`${DISPLAY} text-3xl font-extrabold tabular-nums text-[#F5F5F7] sm:text-4xl`}>{s.value}</p>
                <p className={`mt-1 ${STAT_LABEL} ${MUTED_TEXT}`}>{s.label}</p>
              </div>
            ))}
          </div>
          <p className={`mt-6 max-w-[480px] text-[11px] font-normal leading-[1.6] ${MUTED_TEXT}`}>
            These three figures are historical totals, fixed at publish time — only the receipt
            in the section above moves when you change the price or the grade.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
