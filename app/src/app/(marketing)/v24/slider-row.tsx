interface SliderRowProps {
  id: string;
  label: string;
  lowHint: string;
  highHint: string;
  value: number;
  onChange: (value: number) => void;
}

/**
 * A real <input type="range">, fully keyboard-operable (arrow keys, Home/End) with a
 * visible focus-visible ring on the control itself — never a mouse-drag-only widget.
 */
export default function SliderRow({ id, label, lowHint, highHint, value, onChange }: SliderRowProps) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <label htmlFor={id} className="text-xs font-semibold uppercase tracking-[0.1em] text-zinc-500">
          {label}
        </label>
        <span className="text-sm font-extrabold tabular-nums tracking-[-0.02em] text-sky-700">
          {value}%
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={0}
        max={100}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 h-6 w-full cursor-pointer appearance-none rounded-full bg-zinc-200 outline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-700 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-sky-700 [&::-moz-range-thumb]:shadow-[0_1px_3px_rgba(0,0,0,0.35)] [&::-webkit-slider-runnable-track]:h-1.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-zinc-200 [&::-webkit-slider-thumb]:mt-[-7px] [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-sky-700 [&::-webkit-slider-thumb]:shadow-[0_1px_3px_rgba(0,0,0,0.35)]"
      />
      <div className="mt-1.5 flex items-center justify-between text-[11px] font-normal text-zinc-500">
        <span>{lowHint}</span>
        <span>{highHint}</span>
      </div>
    </div>
  );
}
