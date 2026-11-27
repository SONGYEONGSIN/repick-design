import { Reveal } from "./reveal";
import { EYEBROW, MUTED_TEXT } from "./tokens";

const QUOTES = [
  {
    quote:
      "I compared the certificate against the seller's own photos line by line before I paid — the checklist caught a mismatched serial I would have missed.",
    name: "Priya N.",
    role: "Buyer, verified purchase",
  },
  {
    quote:
      "Listing with a grade I can defend in writing cut my return rate in half. Buyers stop negotiating once the report is in front of them.",
    name: "Marcus O.",
    role: "Seller, 340+ items listed",
  },
  {
    quote:
      "The fair-price band is the part I screenshot and send to friends. It's the first resale tool that shows its reasoning instead of just a score.",
    name: "Elin K.",
    role: "Buyer, verified purchase",
  },
];

export function SocialProof() {
  return (
    <section id="trust" className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
      <Reveal>
        <p className={`${EYEBROW} text-emerald-700`}>Sellers &amp; buyers</p>
        <h2 className="mt-3 max-w-2xl font-[var(--font-display-wide)] text-3xl font-extrabold leading-[1.08] tracking-[-0.02em] text-[#15140E] sm:text-4xl">
          Read before anyone argues price
        </h2>
      </Reveal>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {QUOTES.map((q, i) => (
          <Reveal key={q.name} delay={i * 0.08}>
            <figure className="min-w-0 rounded-xl border border-[#15140E]/12 p-5">
              <blockquote>
                <p className="max-w-[524px] text-[17px] font-normal leading-[1.6] text-[#15140E]">
                  &ldquo;{q.quote}&rdquo;
                </p>
              </blockquote>
              <figcaption className="mt-4 text-sm font-bold text-[#15140E]">
                {q.name}
                <span className={`ml-2 text-xs font-normal ${MUTED_TEXT}`}>{q.role}</span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.1} className="mt-12 grid grid-cols-1 gap-6 border-t border-[#15140E]/10 pt-10 sm:grid-cols-2">
        <div>
          <p className="font-[var(--font-display-wide)] text-4xl font-extrabold tracking-[-0.02em] text-[#15140E]">
            48,210
          </p>
          <p className={`mt-1 text-sm font-normal ${MUTED_TEXT}`}>certificates issued to date</p>
        </div>
        <div>
          <p className="font-[var(--font-display-wide)] text-4xl font-extrabold tracking-[-0.02em] text-[#15140E]">
            1 in 6
          </p>
          <p className={`mt-1 text-sm font-normal ${MUTED_TEXT}`}>
            listings flagged for reinspection before going live
          </p>
        </div>
      </Reveal>
    </section>
  );
}
