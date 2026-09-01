import { Quote } from "lucide-react";
import { Reveal } from "./Reveal";
import { TESTIMONIALS, TRUST_STATS } from "./data";
import { ACCENT } from "./Hero";

export function SocialProof() {
  return (
    <section className="border-b border-[#1C1C22] bg-[#0B0B0F] px-6 py-20 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-[1280px]">
        <p className="text-[11px] font-semibold uppercase text-[#A1A1AA]" style={{ letterSpacing: "0.28em" }}>
          Fig. 04 — In the field
        </p>

        <div className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-3">
          {TRUST_STATS.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.06}>
              <p
                className="tabular-nums text-white"
                style={{ fontFamily: "var(--font-display-grotesk)", fontWeight: 800, letterSpacing: "-0.02em", fontSize: "clamp(2rem, 1.6vw + 1.6rem, 3rem)" }}
              >
                {stat.value}
              </p>
              <p className="mt-2 text-[12px] font-semibold uppercase text-[#A1A1AA]" style={{ letterSpacing: "0.12em" }}>
                {stat.label}
              </p>
            </Reveal>
          ))}
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.08} className="flex flex-col rounded-2xl border border-[#1C1C22] bg-[#111116] p-6">
              <Quote className="h-5 w-5" style={{ color: ACCENT }} aria-hidden="true" />
              <p className="mt-4 max-w-[300px] flex-1 text-[14px] font-normal leading-[1.6] text-[#D4D4D8]">
                &ldquo;{t.quote}&rdquo;
              </p>
              <p className="mt-5 text-[13px] font-semibold text-white">{t.name}</p>
              <p className="text-[12px] font-normal text-[#A1A1AA]">{t.role}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
