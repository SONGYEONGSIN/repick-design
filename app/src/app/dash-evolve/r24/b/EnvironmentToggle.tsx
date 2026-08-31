"use client";

import { ENVIRONMENTS, type Env } from "./data";

export default function EnvironmentToggle({ value, onChange }: { value: Env; onChange: (env: Env) => void }) {
  function onKeyDown(e: React.KeyboardEvent, i: number) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const dir = e.key === "ArrowRight" ? 1 : -1;
    const next = ENVIRONMENTS[(i + dir + ENVIRONMENTS.length) % ENVIRONMENTS.length];
    onChange(next.id);
    document.getElementById(`env-tab-${next.id}`)?.focus();
  }

  return (
    <div role="radiogroup" aria-label="Environment" className="inline-flex rounded-lg border border-white/10 bg-white/[0.03] p-0.5">
      {ENVIRONMENTS.map((env, i) => {
        const active = env.id === value;
        return (
          <button
            key={env.id}
            id={`env-tab-${env.id}`}
            type="button"
            role="radio"
            aria-checked={active}
            tabIndex={active ? 0 : -1}
            onKeyDown={(e) => onKeyDown(e, i)}
            onClick={() => onChange(env.id)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 ${
              active ? "bg-sky-400 text-zinc-950" : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {env.label}
          </button>
        );
      })}
    </div>
  );
}
