import Reveal from "./Reveal";
import { TESTIMONIALS } from "./data";
import { CAPTION, DISPLAY, GHOST_TEXT, MUTED_TEXT, STAT_LABEL } from "./tokens";

const STATS = [
  { value: "2,400", label: "lots priced this year" },
  { value: "11d", label: "median days to clear" },
  { value: "94%", label: "sellers who re-list with it" },
];

export function SocialProof() {
  return (
    <section className="border-t border-[#121212]/10 px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
      <div className="mx-auto max-w-[1280px]">
        <p className={`${CAPTION} ${MUTED_TEXT}`}>From sellers who ran the numbers first</p>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.id} delay={i * 0.08} className="h-full">
              <blockquote className="relative h-full rounded-2xl border border-[#121212]/10 bg-[#121212]/[0.02] p-6">
                <span aria-hidden="true" className={`${DISPLAY} absolute right-5 top-3 text-5xl font-extrabold leading-none ${GHOST_TEXT}`}>
                  &rdquo;
                </span>
                <p className="relative max-w-[480px] text-base font-normal leading-[1.6] text-[#121212]">{t.quote}</p>
                <footer className="relative mt-4">
                  <p className="text-sm font-bold text-[#121212]">{t.name}</p>
                  <p className={`text-xs font-normal ${MUTED_TEXT}`}>{t.role}</p>
                </footer>
              </blockquote>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.16} className="mt-10 grid grid-cols-1 gap-6 rounded-2xl border border-[#121212]/10 bg-white p-6 sm:grid-cols-3 sm:p-8">
          {STATS.map((s) => (
            <div key={s.label}>
              <p className={`${DISPLAY} text-3xl font-extrabold tabular-nums text-[#121212] sm:text-4xl`}>{s.value}</p>
              <p className={`mt-1 ${STAT_LABEL} ${MUTED_TEXT}`}>{s.label}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
