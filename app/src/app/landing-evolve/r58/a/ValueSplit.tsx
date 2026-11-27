import { Boxes, ScanLine, ShieldCheck } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "./Reveal";

const VALUES = [
  {
    icon: ScanLine,
    title: "AI pricing, per item",
    body: "Every item in the box gets its own condition scan and its own price — nothing is averaged away.",
  },
  {
    icon: ShieldCheck,
    title: "Verified buyers only",
    body: "Listings only go to buyers who have cleared identity and payment checks, so payouts clear fast.",
  },
  {
    icon: Boxes,
    title: "Bulk tiers, not one price",
    body: "Cross a tier threshold and the per-item average rises for the whole box, not just the new item.",
  },
] as const;

export function ValueSplit() {
  return (
    <section className="border-t border-white/10 bg-[#0b0b0f] px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <h2 className="text-3xl font-extrabold tracking-[-0.02em] text-white sm:text-4xl">
            Value, three ways.
          </h2>
        </Reveal>

        <RevealGroup className="mt-9 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {VALUES.map(({ icon: Icon, title, body }) => (
            <RevealItem key={title} className="min-w-0">
              <div className="min-w-0 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <Icon aria-hidden="true" size={20} className="text-green-400" />
                <h3 className="mt-4 text-base font-extrabold tracking-[-0.02em] text-white">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">{body}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
