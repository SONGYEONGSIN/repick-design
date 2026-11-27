import { Package, Sparkles, Wallet, type LucideIcon } from "lucide-react";
import StageTimeline from "./StageTimeline";
import { personaById, stageLabel, type PersonaId } from "./data";
import { ACCENT_BASE, BODY_14, DISPLAY, Eyebrow, Reveal, SectionFolio } from "./ui";

type Column = {
  id: string;
  icon: LucideIcon;
  title: string;
  body: string;
  stageCite: () => string;
};

/**
 * Value-prop 3-way split. Every column's cited number comes from `stageLabel`/`formatDuration`
 * against the SAME `personaId` the Hero's persona select set -- nothing here is a second,
 * independently-typed copy of those numbers. The full stage timeline rendered below the three
 * columns is the one true source; the headline total it prints and the "Payout in N days" chip
 * are restated verbatim (via the same data functions) in the closing CTA further down the page.
 */
export default function ValueSplit({ personaId }: { personaId: PersonaId }) {
  const persona = personaById(personaId);

  const columns: Column[] = [
    {
      id: "list",
      icon: Package,
      title: "Get listed",
      body: "Photos and price run through repick's listing standard before the page goes public.",
      stageCite: () => stageLabel(personaId, "list"),
    },
    {
      id: "match",
      icon: Sparkles,
      title: "Get matched",
      body: "The matcher scores your listing against active buyer searches and surfaces it first to the strongest fit.",
      stageCite: () => stageLabel(personaId, "match"),
    },
    {
      id: "payout",
      icon: Wallet,
      title: "Get paid",
      body: "Buyer verification clears, then funds move from escrow to your linked account.",
      stageCite: () => `${stageLabel(personaId, "verify")} · ${stageLabel(personaId, "payout")}`,
    },
  ];

  return (
    <section id="timeline" className="border-b border-zinc-800 px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
      <div className="mx-auto w-full max-w-[1240px]">
        <Reveal>
          <div className="flex items-start justify-between gap-6">
            <div className="min-w-0">
              <Eyebrow>{persona.label} — this exact path</Eyebrow>
              <h2 className="mt-3 text-[clamp(1.6rem,3vw,2.3rem)] font-bold tracking-[-0.02em] text-zinc-50">
                Three jobs. One recomputed timeline.
              </h2>
              <p className={`mt-4 ${BODY_14}`}>
                Switch the persona in the hero above and every number on this page — the three
                columns below, the bar, and the closing section — recomputes together.
              </p>
            </div>
            <SectionFolio n="03" />
          </div>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {columns.map((col, i) => (
            <Reveal key={col.id} delay={i * 0.08} className="min-w-0">
              <div className="flex h-full min-w-0 flex-col rounded-2xl border border-zinc-800 p-6">
                <col.icon className="h-5 w-5" aria-hidden="true" strokeWidth={2} style={{ color: ACCENT_BASE }} />
                <h3 className="mt-4 text-[17px] font-semibold tracking-[-0.01em] text-zinc-50">
                  {col.title}
                </h3>
                <p className="mt-2 max-w-[360px] flex-1 text-[13px] font-normal leading-[1.6] text-zinc-400">
                  {col.body}
                </p>
                <p className="mt-4 text-[14px] font-semibold tabular-nums text-zinc-50" style={DISPLAY}>
                  {col.stageCite()}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1} className="mt-10 min-w-0">
          <div className="rounded-2xl border border-zinc-800 p-6 sm:p-8" style={{ backgroundColor: "#12141A" }}>
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
              Full selling-journey timeline
            </p>
            <div className="mt-5">
              <StageTimeline personaId={personaId} variant="full" />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
