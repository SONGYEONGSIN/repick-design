import { CATEGORY_META, CATEGORY_ORDER, type Category } from "./data";

/**
 * The manipulation control. Toggling a chip recomputes, in the parent: which redline corrections
 * render in the paragraph, which rows appear in the evidence list, and the trust-score number —
 * three proof surfaces off one control. Native <button aria-pressed> so it's a real toggle to
 * assistive tech, not a styled div; aria-label always includes the visible label text verbatim.
 */
export default function CategoryFilters({
  active,
  onToggle,
}: {
  active: ReadonlySet<Category>;
  onToggle: (category: Category) => void;
}) {
  return (
    <div
      role="group"
      aria-label="Filter which claims repick checked"
      className="flex flex-wrap gap-2"
    >
      {CATEGORY_ORDER.map((cat) => {
        const meta = CATEGORY_META[cat];
        const Icon = meta.icon;
        const isActive = active.has(cat);
        return (
          <button
            key={cat}
            type="button"
            aria-pressed={isActive}
            aria-label={`${meta.label} claims — ${isActive ? "shown" : "hidden"}`}
            onClick={() => onToggle(cat)}
            className={
              isActive
                ? "inline-flex items-center gap-1.5 rounded-full border border-[#0369a1] bg-[#f0f9ff] px-3 py-1.5 text-[13px] font-medium text-[#0369a1] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0369a1]"
                : "inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-[13px] font-medium text-zinc-600 transition-colors hover:border-zinc-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0369a1]"
            }
          >
            <Icon className="h-3.5 w-3.5" aria-hidden="true" />
            {meta.label}
          </button>
        );
      })}
    </div>
  );
}
