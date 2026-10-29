import { CATALOG_STATS, QUOTES } from "./data";
import { BORDER, SURFACE } from "./theme";
import { Reveal } from "./Reveal";
import { SectionIntro, STAT_LABEL } from "./ui";

export default function SocialProof() {
  return (
    <section id="proof" className="border-b py-16 sm:py-20" style={{ borderColor: BORDER }}>
      <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8">
        <SectionIntro
          eyebrow="FROM PEOPLE WHO DRAGGED IT"
          heading="Nobody stops at the base read."
          body="The confidence number people act on is almost never the one the overlay opens with. These are the ones who kept going."
        />
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {QUOTES.map((q, i) => (
            <Reveal key={q.name} delay={i * 0.06}>
              <figure className="flex h-full flex-col gap-4 rounded-xl border p-6" style={{ borderColor: BORDER, backgroundColor: SURFACE }}>
                <blockquote className="text-sm font-normal leading-[1.6] text-white/90">
                  &ldquo;{q.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-auto text-sm font-normal text-[#A1A1AA]">
                  <span className="font-semibold text-white">{q.name}</span> &mdash; {q.role}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {CATALOG_STATS.map((s) => (
            <div key={s.label} className="rounded-xl border p-6" style={{ borderColor: BORDER, backgroundColor: SURFACE }}>
              <p className="text-3xl font-extrabold tabular-nums text-white">{s.value}</p>
              <p className={`mt-2 ${STAT_LABEL}`} style={{ color: "#A1A1AA" }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
