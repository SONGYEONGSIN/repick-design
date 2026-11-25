import { FOCUS_RING_INSET } from "./focus";

export default function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
}: {
  options: Array<{ value: T; label: string }>;
  value: T;
  onChange: (v: T) => void;
  ariaLabel: string;
}) {
  return (
    <div role="group" aria-label={ariaLabel} className="flex shrink-0 gap-1 rounded-lg border border-white/10 bg-white/5 p-1">
      {options.map((opt) => {
        const pressed = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={pressed}
            onClick={() => onChange(opt.value)}
            className={`h-9 min-w-11 rounded-md px-3 text-sm font-medium tabular-nums transition-colors motion-reduce:transition-none ${FOCUS_RING_INSET} ${
              pressed ? "bg-indigo-400 text-zinc-950" : "text-zinc-300 hover:bg-white/10"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
