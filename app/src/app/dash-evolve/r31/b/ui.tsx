export function cx(...parts: Array<string | false | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function SegmentedControl<T extends string>({
  value,
  onChange,
  options,
  label,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
  label: string;
}) {
  return (
    <div role="group" aria-label={label} className="inline-flex items-center rounded-lg border border-white/10 bg-zinc-900 p-0.5">
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(opt.value)}
            className={cx(
              "rounded-md px-3 py-1.5 text-[13px] font-medium leading-none transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400",
              active ? "bg-indigo-500 text-white" : "text-zinc-400 hover:text-zinc-100"
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export function StatusDot({ status }: { status: "active" | "leave" }) {
  return (
    <span className={cx("inline-flex items-center gap-1.5 text-[11px] font-medium", status === "active" ? "text-emerald-400" : "text-amber-400")}>
      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-current" />
      {status === "active" ? "Active" : "On leave"}
    </span>
  );
}
