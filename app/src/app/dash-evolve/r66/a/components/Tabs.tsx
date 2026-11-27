import { FOCUS_RING_INSET } from "./focus";

export default function Tabs<T extends string>({
  tabs,
  activeId,
  onChange,
  ariaLabel,
}: {
  tabs: Array<{ id: T; label: string; count?: number }>;
  activeId: T;
  onChange: (id: T) => void;
  ariaLabel: string;
}) {
  return (
    <div role="tablist" aria-label={ariaLabel} className="flex gap-1 border-b border-white/10 px-2">
      {tabs.map((tab) => {
        const active = tab.id === activeId;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(tab.id)}
            onKeyDown={(e) => {
              if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
              e.preventDefault();
              const idx = tabs.findIndex((t) => t.id === activeId);
              const next = e.key === "ArrowRight" ? (idx + 1) % tabs.length : (idx - 1 + tabs.length) % tabs.length;
              onChange(tabs[next].id);
              const nextEl = e.currentTarget.parentElement?.children[next];
              if (nextEl instanceof HTMLElement) nextEl.focus();
            }}
            className={`relative flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium ${FOCUS_RING_INSET} ${
              active ? "text-zinc-50" : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[11px] tabular-nums text-zinc-300">
                {tab.count}
              </span>
            )}
            {active && <span aria-hidden="true" className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-indigo-400" />}
          </button>
        );
      })}
    </div>
  );
}
