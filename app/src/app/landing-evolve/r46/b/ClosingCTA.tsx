import { ArrowUpRight } from "lucide-react";
import { CATEGORY_OPTIONS, TONE_OPTIONS, type Category, type GeneratedCopy, type Tone } from "./data";

export function ClosingCTA({
  tone,
  category,
  copy,
}: {
  tone: Tone;
  category: Category;
  copy: GeneratedCopy;
}) {
  const toneLabel = TONE_OPTIONS.find((t) => t.id === tone)?.label ?? tone;
  const categoryLabel = CATEGORY_OPTIONS.find((c) => c.id === category)?.label ?? category;

  return (
    <section id="closing-cta" className="border-t border-zinc-200 px-4 py-24 sm:px-6 sm:py-28 lg:px-10">
      <div className="mx-auto max-w-3xl text-left">
        <h2 className="font-[family-name:var(--font-display-mono)] text-[clamp(1.75rem,4vw,2.5rem)] font-semibold leading-tight text-zinc-950">
          Your {categoryLabel.toLowerCase()} listing, already written.
        </h2>

        <p className="mt-4 max-w-[480px] text-base leading-[1.6] text-zinc-600">
          Above, repick just generated a full {toneLabel.toLowerCase()}-tone description and
          tagline for a sample {categoryLabel.toLowerCase()} listing — &ldquo;{copy.tagline}&rdquo;
          — along with four selling points pulled straight out of that text. Your own items get
          the same treatment the moment you list them.
        </p>

        <a
          href="#listing-generator"
          className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#0f766e] px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-[#0d6961] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f766e]"
        >
          Try another tone or category
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
