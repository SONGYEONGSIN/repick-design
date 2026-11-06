import Reveal from "./Reveal";
import { Eyebrow, GhostNumeral } from "./ui";
import { QUOTES } from "./data";
import { CONTAINER, INK, MUTED_ON_PAGE, MUTED_ON_TINT } from "./theme";

export default function SocialProof() {
  return (
    <section className="border-b border-zinc-200 py-16 lg:py-24">
      <div className={CONTAINER}>
        <div className="flex items-start gap-4">
          <GhostNumeral>03</GhostNumeral>
          <div>
            <Eyebrow>READ BY BUYERS, NOT JUST WRITTEN FOR THEM</Eyebrow>
            <h2 className="mt-3 text-[clamp(1.5rem,1.2rem+1vw,2.25rem)] font-extrabold leading-tight" style={{ color: INK }}>
              What people noticed in the ledger
            </h2>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {QUOTES.map((q, i) => (
            <Reveal key={q.name} delay={i * 0.06}>
              <figure className="h-full rounded-2xl border border-zinc-200 p-6">
                <span aria-hidden="true" className="font-mono text-4xl font-extrabold leading-none" style={{ color: MUTED_ON_PAGE }}>
                  “
                </span>
                <blockquote className="mt-2 text-sm font-normal leading-[1.6]" style={{ color: INK }}>
                  {q.quote}
                </blockquote>
                <figcaption className="mt-4 text-sm font-normal" style={{ color: MUTED_ON_TINT }}>
                  <span className="font-semibold" style={{ color: INK }}>
                    {q.name}
                  </span>{" "}
                  · {q.role}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
