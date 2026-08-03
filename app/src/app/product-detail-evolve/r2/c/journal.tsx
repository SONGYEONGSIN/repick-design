import Image from "next/image";
import {
  DISPLAY_FONT,
  JOURNAL_CHAPTERS,
  cx,
  type FinishOption,
  type WoodOption,
} from "./data";

/**
 * The editorial spine of the page — six chapters run top to bottom as the primary content, in
 * place of a hero/buy-box split or a tabbed data sheet. Two chapters end on a line that reads the
 * live configuration (edge finish, handle wood) rather than a fixed sentence, so picking an option
 * in the floating card changes prose here, not only numbers in a table.
 */
export default function Journal({ finish, wood }: { finish: FinishOption; wood: WoodOption }) {
  return (
    <section aria-labelledby="journal-heading" className="mt-16 border-t border-zinc-200 pt-12 sm:mt-20 sm:pt-16">
      <h2 id="journal-heading" style={DISPLAY_FONT} className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
        The making of this knife
      </h2>
      <p className="mt-2 max-w-prose text-sm font-normal leading-relaxed text-zinc-600">
        Every No. 4 passes through the same six stages on the same bench. What follows is that
        process, in order, with the two steps your current configuration actually changes.
      </p>

      <ol role="list" className="mt-10 flex flex-col gap-14 sm:gap-20">
        {JOURNAL_CHAPTERS.map((chapter, i) => {
          const reversed = i % 2 === 1;
          return (
            <li key={chapter.id} className="grid grid-cols-1 items-center gap-6 lg:grid-cols-2 lg:gap-10">
              <div
                className={cx(
                  "relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100",
                  reversed && "lg:order-2",
                )}
              >
                <Image
                  src={`https://picsum.photos/seed/${chapter.imageSeed}/900/675`}
                  alt={chapter.imageAlt}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>

              <div className={cx("min-w-0", reversed && "lg:order-1")}>
                <p className="text-xs font-medium tracking-wide text-amber-700 uppercase">{chapter.number}</p>
                <h3 style={DISPLAY_FONT} className="mt-1.5 text-xl font-semibold tracking-tight text-zinc-900 sm:text-2xl">
                  {chapter.title}
                </h3>
                <p className="mt-3 max-w-prose text-sm font-normal leading-relaxed text-zinc-600">{chapter.body}</p>

                {chapter.dynamic === "finish" && (
                  <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-sm font-normal leading-relaxed text-zinc-700">
                    <span className="font-medium text-amber-800">As configured — </span>
                    your selected {finish.label.toLowerCase()} finish sets the edge at{" "}
                    <span className="font-medium tabular-nums text-zinc-900">{finish.edgeAngleDeg}°</span> per side.{" "}
                    {finish.useNote}
                  </p>
                )}
                {chapter.dynamic === "wood" && (
                  <p className="mt-3 flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-sm font-normal leading-relaxed text-zinc-700">
                    <span aria-hidden="true" className="mt-1 h-3 w-3 flex-none rounded-full border border-black/10" style={{ backgroundColor: wood.swatch }} />
                    <span>
                      <span className="font-medium text-amber-800">As configured — </span>
                      you&apos;re viewing <span className="font-medium text-zinc-900">{wood.label}</span>, the wood pinned to
                      this handle block.
                    </span>
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
