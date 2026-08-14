import { LAYERS, type Layer, type LayerId } from "./data";

/**
 * Finding-text panel — one line per active layer, listing exactly what it found. Placed as its own
 * grid item (see `HeroFold`) so on a phone it can sit *after* the mandatory product cards in
 * document order without duplicating the toggle state, while on desktop it still sits directly
 * under the device, unbroken. With every layer off it still reads as a real, legible state instead
 * of leaving a gap.
 */
export default function InspectorFindings({ active }: { active: LayerId[] }) {
  const activeLayers: Layer[] = LAYERS.filter((l) => active.includes(l.id));

  return (
    <div className="border-t border-white/10 pt-4">
      {activeLayers.length > 0 ? (
        <ul className="flex flex-col gap-2.5">
          {activeLayers.map((layer) => (
            <li key={layer.id} className="text-sm font-normal leading-[1.6] text-[#A1A1AA]">
              <span className="font-semibold text-white">{layer.short}: </span>
              {layer.finding}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm font-normal leading-[1.6] text-[#A1A1AA]">
          No layers are on right now — the coat above is unscanned. Toggle condition, authenticity
          or price fairness to see the AI&rsquo;s reasoning appear here.
        </p>
      )}
    </div>
  );
}
