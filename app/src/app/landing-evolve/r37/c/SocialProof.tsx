import { Quote } from "lucide-react";
import Reveal from "./Reveal";
import { ACCENT_TINT } from "./theme";

interface Testimonial {
  initials: string;
  name: string;
  role: string;
  quote: string;
  stat: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    initials: "MK",
    name: "Maya K.",
    role: "Verified buyer, 14 orders",
    quote:
      "I checked the serial tag myself before I paid, not after. That's the part that made this different from every other resale app I've used.",
    stat: "Bought 3 pairs this year",
  },
  {
    initials: "DT",
    name: "Devon T.",
    role: "Verified buyer, 6 orders",
    quote:
      "The grade matched what showed up at my door, down to the stitching note. First platform where the description wasn't optimistic marketing.",
    stat: "9.2 avg grade received",
  },
  {
    initials: "RP",
    name: "Riya P.",
    role: "Verified buyer, 22 orders",
    quote:
      "Watching the confidence score fill in while I checked each spot made the authentication feel real instead of just a badge in a corner.",
    stat: "22 verified purchases",
  },
];

export default function SocialProof() {
  return (
    <section id="proof" className="border-b border-white/10 py-20 sm:py-28">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <Reveal>
          <h2 className="max-w-[640px] text-[clamp(1.75rem,1.45rem+1.3vw,2.75rem)] font-extrabold leading-[1.08] tracking-[-0.02em] text-white">
            Buyers check the proof before they trust it.
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.08}>
              <figure className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                <Quote className="h-5 w-5" style={{ color: ACCENT_TINT }} aria-hidden="true" />
                <blockquote className="mt-4 flex-1 text-sm leading-[1.6] text-zinc-300">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3">
                  <svg viewBox="0 0 40 40" className="h-9 w-9 shrink-0" aria-hidden="true">
                    <circle cx="20" cy="20" r="20" fill="#27272A" />
                    <text
                      x="20"
                      y="25"
                      textAnchor="middle"
                      fontSize="13"
                      fontWeight="700"
                      fill="#D4D4D8"
                      fontFamily="var(--font-sans)"
                    >
                      {t.initials}
                    </text>
                  </svg>
                  <span>
                    <span className="block text-sm font-semibold text-white">{t.name}</span>
                    <span className="block text-xs text-zinc-400">{t.role}</span>
                  </span>
                </figcaption>
                <p className="mt-3 text-xs font-semibold tabular-nums" style={{ color: ACCENT_TINT }}>
                  {t.stat}
                </p>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
