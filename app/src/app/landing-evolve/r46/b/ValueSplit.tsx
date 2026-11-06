import type { ReactNode } from "react";
import { Layers, ListChecks, SplitSquareHorizontal } from "lucide-react";
import { Reveal } from "./Reveal";
import { CATEGORY_OPTIONS, GENERIC_BEFORE_DRAFT, type Category, type GeneratedCopy, type Tone } from "./data";

export function ValueSplit({
  tone,
  category,
  copy,
}: {
  tone: Tone;
  category: Category;
  copy: GeneratedCopy;
}) {
  const categoryLabel = CATEGORY_OPTIONS.find((c) => c.id === category)?.label ?? category;
  const firstSentence = copy.paragraph.split(". ")[0] + ".";

  return (
    <section className="px-4 py-24 sm:px-6 sm:py-28 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-[family-name:var(--font-display-mono)] text-[clamp(1.6rem,3vw,2.1rem)] font-semibold text-zinc-950">
          What the generator is actually doing
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
          <Reveal className="min-w-0" delay={0}>
            <ValueCard
              icon={<Layers className="h-5 w-5" aria-hidden="true" />}
              title="Three tones. Same facts."
              body="Concise, Detailed, or Storytelling — switch the control above and the whole description rewrites itself. Grade and measurements stay identical; only the voice changes."
            />
          </Reveal>

          <Reveal className="min-w-0" delay={0.08}>
            <ValueCard
              icon={<ListChecks className="h-5 w-5" aria-hidden="true" />}
              title="Selling points, pulled out for you"
              body="Every generated listing comes with its own keyword chips — phrases lifted straight out of the copy repick just wrote, ready to scan or click to find in the text."
            />
          </Reveal>

          <Reveal className="min-w-0" delay={0.16}>
            <div className="min-w-0 h-full rounded-2xl border border-zinc-200 bg-white p-6">
              <div className="flex items-center gap-2 text-[#0f766e]">
                <SplitSquareHorizontal className="h-5 w-5" aria-hidden="true" />
                <h3 className="text-[15px] font-semibold text-zinc-950">Before repick, after repick</h3>
              </div>

              <div className="mt-4 space-y-3">
                <div className="min-w-0 rounded-lg border border-zinc-200 bg-zinc-50 p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
                    Typical seller draft
                  </p>
                  <p className="mt-1 text-[13px] leading-snug text-zinc-600">
                    &ldquo;{GENERIC_BEFORE_DRAFT}&rdquo;
                  </p>
                </div>

                <div className="min-w-0 rounded-lg border border-[#0f766e]/30 bg-[#0f766e]/5 p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-[#0f766e]">
                    repick, {tone} tone, {categoryLabel.toLowerCase()} — live above
                  </p>
                  <p className="mt-1 text-[13px] leading-snug text-zinc-800">
                    &ldquo;{firstSentence}&rdquo;
                  </p>
                </div>
              </div>

              <p className="mt-3 text-[12px] text-zinc-500">
                Change the tone or category above and this card updates with it.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function ValueCard({
  icon,
  title,
  body,
}: {
  icon: ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="min-w-0 h-full rounded-2xl border border-zinc-200 bg-white p-6">
      <div className="text-[#0f766e]">{icon}</div>
      <h3 className="mt-3 text-[15px] font-semibold text-zinc-950">{title}</h3>
      <p className="mt-2 text-[14px] leading-[1.6] text-zinc-600">{body}</p>
    </div>
  );
}
