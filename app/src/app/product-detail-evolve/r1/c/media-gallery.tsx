import Image from "next/image";
import { type MediaItem } from "./data";

/**
 * A compact media switcher, not a hero. The main frame reserves its aspect ratio and background
 * before the image resolves (page-brief-core §4), and the thumbnail strip is the gallery's
 * navigation interaction — each thumbnail is a real, focusable button, not a hover-only affordance.
 */
export default function MediaGallery({
  items,
  activeId,
  onSelect,
  sku,
}: {
  items: MediaItem[];
  activeId: string;
  onSelect: (id: string) => void;
  sku: string;
}) {
  const active = items.find((m) => m.id === activeId) ?? items[0];

  return (
    <div className="w-full sm:w-56 lg:w-64">
      <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900">
        <Image
          key={active.id}
          src={`https://picsum.photos/seed/${active.seed}/640/640`}
          alt={active.altFor(sku)}
          fill
          sizes="(min-width: 1024px) 256px, (min-width: 640px) 224px, 100vw"
          className="object-cover"
        />
      </div>
      <ul role="list" className="mt-2.5 grid grid-cols-3 gap-2">
        {items.map((item) => {
          const selected = item.id === activeId;
          return (
            <li key={item.id}>
              <button
                type="button"
                aria-pressed={selected}
                onClick={() => onSelect(item.id)}
                className={`relative aspect-square w-full overflow-hidden rounded-md border bg-zinc-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:bg-zinc-900 dark:focus-visible:ring-offset-zinc-950 ${
                  selected
                    ? "border-blue-600 dark:border-blue-500"
                    : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700"
                }`}
              >
                <Image
                  src={`https://picsum.photos/seed/${item.seed}/160/160`}
                  alt=""
                  fill
                  sizes="80px"
                  className="object-cover"
                />
                <span className="sr-only">
                  Show {item.label}
                  {selected ? " (currently shown)" : ""}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <p className="mt-1.5 text-center text-xs font-normal text-zinc-600 dark:text-zinc-400 sm:text-left">
        {active.label}
      </p>
    </div>
  );
}
