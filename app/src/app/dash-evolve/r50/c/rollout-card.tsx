"use client";

import type { Environment, FeatureFlag } from "./types";
import { ENVIRONMENT_LABEL } from "./data";
import { ProgressBar } from "./ui";

const ENV_ORDER: Environment[] = ["production", "staging", "development"];
const ENV_BAR_CLASS: Record<Environment, string> = {
  production: "bg-emerald-600",
  staging: "bg-emerald-400",
  development: "bg-zinc-400",
};

/** Flag counts and average rollout, grouped by environment — both derived from `flags`, so the count column and the progress-bar % can never disagree. */
export function RolloutCard({ flags }: { flags: FeatureFlag[] }) {
  const groups = ENV_ORDER.map((env) => {
    const rows = flags.filter((f) => f.environment === env);
    const avgRollout = rows.length === 0 ? 0 : Math.round(rows.reduce((sum, f) => sum + f.rollout, 0) / rows.length);
    return { env, count: rows.length, avgRollout };
  });
  const totalFlags = flags.length;

  return (
    <div className="px-4 py-4 sm:px-5">
      <p className="text-[11px] font-normal text-zinc-500">
        {totalFlags} flags across {groups.filter((g) => g.count > 0).length} environments, by average rollout.
      </p>
      <ul className="mt-3 space-y-3.5">
        {groups.map((g) => (
          <li key={g.env}>
            <div className="mb-1 flex items-baseline justify-between">
              <span className="text-[12px] font-semibold text-zinc-700">{ENVIRONMENT_LABEL[g.env]}</span>
              <span className="text-[11px] font-normal text-zinc-500 tabular-nums">
                {g.count} flag{g.count === 1 ? "" : "s"} · {g.avgRollout}% avg
              </span>
            </div>
            <ProgressBar value={g.avgRollout} barClassName={ENV_BAR_CLASS[g.env]} label={`${ENVIRONMENT_LABEL[g.env]} average rollout`} />
          </li>
        ))}
      </ul>
    </div>
  );
}
