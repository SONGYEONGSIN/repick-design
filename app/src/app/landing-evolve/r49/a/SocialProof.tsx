import { Star, Users } from "lucide-react";
import Reveal from "./Reveal";
import { TESTIMONIALS } from "./data";
import { HEADLINE_FONT, MUTED_TEXT, PANEL_BORDER } from "./tokens";

/**
 * Section 4: social proof. Quote container width: 16px body text -> 0.44 * 16 =
 * 7.04px/char -> max-w-[480px] -> 480 / 7.04 ≈ 68.2 chars/line.
 */
export default function SocialProof() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
      <Reveal>
        <h2
          className="text-[26px] font-extrabold leading-[1.2] tracking-[-0.01em] text-white sm:text-[30px]"
          style={HEADLINE_FONT}
        >
          Sellers who ran their own search first
        </h2>
        <div className="mt-6 flex flex-wrap items-center gap-6">
          <span className="tabular-nums flex items-center gap-2 text-[14px] font-semibold text-white">
            <Users className="h-4 w-4 text-[#BCA7F3]" aria-hidden="true" />
            29,000+ active sellers
          </span>
          <span className="tabular-nums flex items-center gap-2 text-[14px] font-semibold text-white">
            <Star className="h-4 w-4 text-[#BCA7F3]" aria-hidden="true" />
            4.8 average seller rating
          </span>
        </div>
      </Reveal>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {TESTIMONIALS.map((t, i) => (
          <Reveal key={t.name} delay={i * 0.08} className="min-w-0">
            <figure className={`min-w-0 rounded-2xl border ${PANEL_BORDER} bg-[#15141C] p-6`}>
              <blockquote className="max-w-[480px] text-[16px] font-normal leading-[1.55] text-white">
                “{t.quote}”
              </blockquote>
              <figcaption className={`tabular-nums mt-4 text-[13px] font-semibold ${MUTED_TEXT}`}>
                {t.name} <span className="font-normal">· {t.role}</span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
