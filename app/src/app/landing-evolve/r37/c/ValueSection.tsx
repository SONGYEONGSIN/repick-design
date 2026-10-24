import { Sparkles, BadgeCheck, ShieldCheck } from "lucide-react";
import Reveal from "./Reveal";
import { ACCENT_FILL, ACCENT_TINT } from "./theme";
import { TOTAL_HOTSPOTS, confidenceFromFound, gradeFromConfidence, matchPctFromConfidence } from "./hotspots";

/**
 * Three pillars, all genuinely recomputed from the same `found` set the
 * hero device writes to — not three static illustrations of a concept.
 * Moving the lens above changes every number in this section.
 */
export default function ValueSection({ found }: { found: ReadonlySet<string> }) {
  const confidence = confidenceFromFound(found.size);
  const matchPct = matchPctFromConfidence(confidence);
  const grade = gradeFromConfidence(confidence);
  const gradeScore = (confidence / 10).toFixed(1);

  const pillars = [
    {
      Icon: Sparkles,
      label: "AI match",
      value: `${matchPct}%`,
      body: "How closely this listing fits what you've been searching for — it climbs as more of the scan below confirms the item is what it claims to be.",
    },
    {
      Icon: BadgeCheck,
      label: "Condition grade",
      value: grade,
      body: `Scored ${gradeScore} / 10 right now, from the same five-point scan — not a seller's self-reported rating.`,
    },
    {
      Icon: ShieldCheck,
      label: "Authentication",
      value: `${found.size} / ${TOTAL_HOTSPOTS}`,
      body: "Markers verified so far. Every listing on repick carries this exact breakdown, not just a pass/fail badge.",
    },
  ];

  return (
    <section id="value" className="border-b border-white/10 py-20 sm:py-28">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <Reveal>
          <h2 className="max-w-[640px] text-[clamp(1.75rem,1.45rem+1.3vw,2.75rem)] font-extrabold leading-[1.08] tracking-[-0.02em] text-white">
            Every number here moves with your scan.
          </h2>
          <p className="mt-4 max-w-[520px] text-base leading-[1.6] text-zinc-300">
            The confidence score above isn&rsquo;t decorative. It rewrites the match
            percentage, the condition grade, and the verification count below —
            on this page, live, before you&rsquo;ve clicked anything else.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-3">
          {pillars.map(({ Icon, label, value, body }, i) => (
            <Reveal key={label} delay={i * 0.08}>
              <div className="h-full rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                <span
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full"
                  style={{ backgroundColor: ACCENT_FILL }}
                >
                  <Icon className="h-5 w-5 text-white" aria-hidden="true" />
                </span>
                <p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-400">{label}</p>
                <p className="mt-2 text-3xl font-extrabold tabular-nums leading-none text-white">{value}</p>
                <p className="mt-3 text-sm leading-[1.6] text-zinc-300">{body}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="mt-4 text-xs leading-[1.6]" style={{ color: ACCENT_TINT }}>
          Scroll back up and move the lens to see it happen.
        </p>
      </div>
    </section>
  );
}
