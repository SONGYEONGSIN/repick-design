import { Quote } from "lucide-react";

const monoFont = { fontFamily: "var(--font-display-mono)" };

const QUOTES = [
  {
    initials: "R.A.",
    name: "R. Alvarez",
    role: "Watch collector, 6 purchases",
    quote:
      "I turn seller history off on purpose — I want to know if the watch itself holds up, not whether the seller is chatty.",
  },
  {
    initials: "T.B.",
    name: "T. Byun",
    role: "Seller, Trusted tier",
    quote:
      "My price fairness check failed twice before I relisted lower. Annoying in the moment, correct in hindsight.",
  },
  {
    initials: "M.O.",
    name: "M. Okafor",
    role: "Camera buyer",
    quote: "The rangefinder I bought was held on authenticity for a day. Better a held listing than a fake one.",
  },
];

const STATS = [
  { value: "48,200", label: "Listings assayed to date" },
  { value: "1,240", label: "Authenticity holds resolved" },
  { value: "3.8 hrs", label: "Median time in review" },
  { value: "0", label: "Checks that fail without a written reason" },
];

export default function SocialProof() {
  return (
    <section className="border-b border-zinc-800/80 px-6 py-20 sm:px-10 lg:px-16 lg:py-28">
      <div className="mx-auto max-w-[1280px]">
        <p className="text-[12px] font-semibold uppercase text-amber-300" style={{ letterSpacing: "0.28em", ...monoFont }}>
          Heard on the pipeline
        </p>
        <h2 className="mt-3 text-[28px] font-extrabold tracking-tight text-white sm:text-[34px]">
          People who read the steps, not just the score.
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
          {QUOTES.map((q) => (
            <figure key={q.initials} className="flex flex-col rounded-2xl border border-zinc-800 bg-zinc-950/50 p-6">
              <Quote className="h-5 w-5 text-amber-300" aria-hidden="true" />
              <blockquote className="mt-4 max-w-[340px] text-[14.5px] leading-[1.6] text-zinc-300">
                &ldquo;{q.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3 border-t border-zinc-800/80 pt-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-[12px] font-semibold text-zinc-100">
                  {q.initials}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-[13px] font-semibold text-white">{q.name}</span>
                  <span className="block truncate text-[12px] text-zinc-400">{q.role}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>

        <dl className="mt-14 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-zinc-800/80 pt-10 sm:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label}>
              <dt className="text-[13px] text-zinc-400">{s.label}</dt>
              <dd className="mt-1 text-[26px] font-extrabold text-white" style={monoFont}>
                {s.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
