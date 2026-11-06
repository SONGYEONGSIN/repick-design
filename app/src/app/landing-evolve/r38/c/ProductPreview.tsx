import ItemArt from "./ItemArt";
import Reveal from "./Reveal";
import { AccentBadge, Badge, Eyebrow, GhostNumeral } from "./ui";
import { CONTAINER, CARD_TINT, FOCUS_LIGHT, ACCENT_DEEP, ACCENT_FILL, INK, MUTED_ON_TINT } from "./theme";
import type { ItemPreset } from "./data";

/**
 * The richer product-preview section: three example listings, a toggle
 * row above them that doubles as this route's secondary filter/toggle
 * interaction — selecting a chip changes which item the Hero's compact
 * proof strip (and this grid's highlighted card) reflects.
 */
export default function ProductPreview({
  items,
  selectedId,
  onSelect,
}: {
  items: ItemPreset[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <section id="product-preview" className="border-b border-zinc-200 py-16 lg:py-24">
      <div className={CONTAINER}>
        <div className="flex items-start gap-4">
          <GhostNumeral>01</GhostNumeral>
          <div>
            <Eyebrow>THREE LISTINGS, SAME SIX STAGES</Eyebrow>
            <h2 className="mt-3 text-[clamp(1.5rem,1.2rem+1vw,2.25rem)] font-extrabold leading-tight" style={{ color: INK }}>
              Pick a listing, see its own numbers
            </h2>
          </div>
        </div>

        <div role="group" aria-label="Choose an example listing" className="mt-8 flex flex-wrap gap-2">
          {items.map((item) => {
            const selected = item.id === selectedId;
            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={selected}
                onClick={() => onSelect(item.id)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors motion-reduce:transition-none ${FOCUS_LIGHT} ${
                  selected ? "border-transparent text-white" : "border-zinc-300 text-zinc-600 hover:border-zinc-400"
                }`}
                style={selected ? { backgroundColor: ACCENT_FILL } : undefined}
              >
                {item.name}
              </button>
            );
          })}
        </div>

        <Reveal className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {items.map((item, i) => {
            const selected = item.id === selectedId;
            return (
              <ProductCard key={item.id} item={item} selected={selected} index={i} />
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}

function ProductCard({ item, selected, index }: { item: ItemPreset; selected: boolean; index: number }) {
  return (
    <article
      className="rounded-2xl border p-5 transition-colors motion-reduce:transition-none"
      style={{ borderColor: selected ? ACCENT_DEEP : "#E4E4E7" }}
    >
      <div
        className="aspect-[4/5] w-full overflow-hidden rounded-xl transition-transform duration-200 ease-out hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
        style={{ backgroundColor: CARD_TINT }}
      >
        <ItemArt id={item.id} className="h-full w-full" />
      </div>
      <p className="mt-4 font-semibold leading-snug" style={{ color: INK }}>
        {item.name}
      </p>
      <p className="mt-1 text-sm font-normal" style={{ color: MUTED_ON_TINT }}>
        {item.category}
      </p>
      <p className="mt-2 text-sm font-normal" style={{ color: MUTED_ON_TINT }}>
        <span className="font-mono font-extrabold tabular-nums" style={{ color: INK }}>
          ${item.priceNow}
        </span>{" "}
        <span className="font-mono tabular-nums line-through">${item.priceWas}</span>
      </p>
      <p className="sr-only">Verification badges for {item.name}</p>
      <ul className="mt-3 flex flex-wrap gap-2">
        <Badge>Match {item.match}%</Badge>
        <Badge>Grade {item.grade}</Badge>
        <Badge icon>{item.cert}</Badge>
        <AccentBadge>−{item.discountPct}% vs retail</AccentBadge>
      </ul>
      {selected ? (
        <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: ACCENT_DEEP }}>
          Tracked in the ledger above
        </p>
      ) : (
        <p className="mt-3 text-xs font-normal" style={{ color: MUTED_ON_TINT }} aria-hidden="true">
          Fig. {String(index + 2).padStart(2, "0")}
        </p>
      )}
    </article>
  );
}
