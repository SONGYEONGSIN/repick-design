import type { Gate, GateState, Terminal } from "./data";

const STATE_META: Record<
  GateState,
  { label: string; dot: string; text: string }
> = {
  OCCUPIED: {
    label: "계류중",
    dot: "bg-amber-400",
    text: "text-amber-300",
  },
  BOARDING: {
    label: "탑승중",
    dot: "bg-emerald-400",
    text: "text-emerald-300",
  },
  CLEANING: {
    label: "청소중",
    dot: "bg-sky-400",
    text: "text-sky-300",
  },
  VACANT: {
    label: "공석",
    dot: "bg-neutral-700",
    text: "text-neutral-500",
  },
};

export function GateMap({
  gates,
  terminal,
  onTerminalChange,
}: {
  gates: Gate[];
  terminal: Terminal;
  onTerminalChange: (t: Terminal) => void;
}) {
  return (
    <section
      id="gatemap"
      aria-labelledby="gatemap-heading"
      className="scroll-mt-24 rounded-lg border border-amber-500/10 bg-neutral-950 p-4"
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2
          id="gatemap-heading"
          className="font-mono text-sm font-bold tracking-[0.15em] text-neutral-200"
        >
          게이트맵
        </h2>
        <fieldset className="flex gap-1.5">
          <legend className="sr-only">터미널 선택</legend>
          {(["T1", "T2"] as const).map((t) => (
            <label key={t} className="cursor-pointer">
              <input
                type="radio"
                name="terminal"
                value={t}
                checked={terminal === t}
                onChange={() => onTerminalChange(t)}
                className="peer sr-only"
              />
              <span className="inline-flex min-h-[36px] min-w-[44px] items-center justify-center rounded-md border border-neutral-800 px-3 font-mono text-xs font-semibold tracking-widest text-neutral-400 transition-colors peer-checked:border-amber-500/60 peer-checked:bg-amber-500/10 peer-checked:text-amber-300 peer-hover:text-neutral-200 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-amber-400">
                {t}
              </span>
            </label>
          ))}
        </fieldset>
      </div>

      <ul
        aria-label={`${terminal} 게이트 현황`}
        className="grid grid-cols-4 gap-2 sm:grid-cols-8"
      >
        {gates.map((gate) => {
          const meta = STATE_META[gate.state];
          return (
            <li key={gate.id}>
              <div className="flex flex-col items-center gap-1.5 rounded-md border border-neutral-800 bg-neutral-900/60 px-2 py-3">
                <span className="font-mono text-sm font-semibold text-neutral-200">
                  {gate.id}
                </span>
                <span className="flex items-center gap-1.5">
                  <span
                    aria-hidden="true"
                    className={`h-2 w-2 rounded-full ${meta.dot}`}
                  />
                  <span className={`text-[10px] tracking-wide ${meta.text}`}>
                    {meta.label}
                  </span>
                </span>
              </div>
            </li>
          );
        })}
      </ul>

      <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5" aria-hidden="true">
        {(Object.keys(STATE_META) as GateState[]).map((state) => (
          <li key={state} className="flex items-center gap-1.5">
            <span
              className={`h-2 w-2 rounded-full ${STATE_META[state].dot}`}
            />
            <span className="text-[10px] tracking-wide text-neutral-500">
              {STATE_META[state].label}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
