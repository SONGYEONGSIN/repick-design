import { ArrowDown, ArrowUp, ChevronDown } from "lucide-react";
import { buildSpecGroups, type SpecRow, type Variant, type VariantId } from "./data";

function formatDelta(delta: number, unit?: string): string {
  const rounded = unit === "kg" ? delta.toFixed(1) : Math.round(delta).toLocaleString("en-US");
  const sign = delta > 0 ? "+" : "";
  return `${sign}${rounded}${unit ? ` ${unit}` : ""}`;
}

function DiffBadge({ primaryLabel, row, secondaryRow }: { primaryLabel: string; row: SpecRow; secondaryRow: SpecRow }) {
  if (row.numeric === undefined || secondaryRow.numeric === undefined) return null;
  const delta = secondaryRow.numeric - row.numeric;
  if (delta === 0) return null;
  const Icon = delta > 0 ? ArrowUp : ArrowDown;
  return (
    <span className="ml-1.5 inline-flex items-center gap-0.5 whitespace-nowrap text-xs font-medium tabular-nums text-blue-700 dark:text-blue-400">
      <Icon className="h-3 w-3 flex-none" aria-hidden="true" />
      {formatDelta(delta, row.unit)}
      <span className="sr-only">
        {delta > 0 ? " higher than " : " lower than "}
        {primaryLabel}
      </span>
    </span>
  );
}

export default function SpecSheet({
  variant,
  compareVariant,
  compareOn,
  onToggleCompare,
  compareOptions,
  compareVariantId,
  onChangeCompareVariant,
}: {
  variant: Variant;
  compareVariant: Variant;
  compareOn: boolean;
  onToggleCompare: () => void;
  compareOptions: Variant[];
  compareVariantId: VariantId;
  onChangeCompareVariant: (id: VariantId) => void;
}) {
  const primaryGroups = buildSpecGroups(variant);
  const secondaryGroups = compareOn ? buildSpecGroups(compareVariant) : null;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 pb-4 dark:border-zinc-800">
        <p className="text-sm font-normal text-zinc-600 dark:text-zinc-400">
          Full spec sheet for{" "}
          <span className="font-mono font-medium text-zinc-900 dark:text-zinc-50">{variant.sku}</span>.
        </p>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            role="switch"
            aria-checked={compareOn}
            onClick={onToggleCompare}
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm font-medium text-zinc-900 transition-colors hover:border-zinc-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:border-zinc-700 dark:focus-visible:ring-offset-zinc-950"
          >
            <span
              aria-hidden="true"
              className={`relative inline-flex h-5 w-9 flex-none items-center rounded-full transition-colors ${
                compareOn ? "bg-blue-600 dark:bg-blue-500" : "bg-zinc-300 dark:bg-zinc-700"
              }`}
            >
              <span
                className={`inline-block h-3.5 w-3.5 flex-none rounded-full bg-white transition-transform ${
                  compareOn ? "translate-x-[1.15rem]" : "translate-x-1"
                }`}
              />
            </span>
            Compare configurations
          </button>
          {compareOn && (
            <div className="flex items-center gap-2">
              <label htmlFor="compare-select" className="text-sm font-normal text-zinc-600 dark:text-zinc-400">
                with
              </label>
              <select
                id="compare-select"
                value={compareVariantId}
                onChange={(e) => onChangeCompareVariant(e.target.value as VariantId)}
                className="rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-sm font-medium text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50"
              >
                {compareOptions.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.sku} ({v.strokeMm} mm)
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      <div className="mt-1 divide-y divide-zinc-200 dark:divide-zinc-800">
        {primaryGroups.map((group, i) => {
          const secondaryRows = secondaryGroups?.find((g) => g.id === group.id)?.rows;
          return (
            <details key={group.id} open={i === 0} className="group py-4 first:pt-4 last:pb-0">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-2 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-blue-600 [&::-webkit-details-marker]:hidden [&::marker]:hidden">
                <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{group.title}</span>
                <ChevronDown
                  className="h-4 w-4 flex-none text-zinc-600 transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none dark:text-zinc-400"
                  aria-hidden="true"
                />
              </summary>
              <div className="mt-3 overflow-x-auto">
                <table className="w-full table-fixed border-collapse text-sm">
                  <caption className="mb-2 text-left text-xs font-normal text-zinc-600 dark:text-zinc-400">
                    {group.title} specifications
                    {compareOn ? ` — ${variant.sku} compared against ${compareVariant.sku}` : ` for ${variant.sku}`}
                  </caption>
                  <thead>
                    <tr className="border-b border-zinc-200 dark:border-zinc-800">
                      <th scope="col" className="w-[36%] py-1.5 pr-2 text-left text-xs font-medium text-zinc-600 dark:text-zinc-400">
                        Spec
                      </th>
                      <th
                        scope="col"
                        className={`${compareOn ? "w-[32%]" : "w-[64%]"} py-1.5 pr-2 text-left font-mono text-xs font-medium text-zinc-900 dark:text-zinc-50`}
                      >
                        {variant.sku}
                      </th>
                      {compareOn && (
                        <th scope="col" className="w-[32%] py-1.5 pr-2 text-left font-mono text-xs font-medium text-zinc-900 dark:text-zinc-50">
                          {compareVariant.sku}
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {group.rows.map((row) => {
                      const secondaryRow = secondaryRows?.find((r) => r.id === row.id);
                      return (
                        <tr key={row.id} className="border-b border-zinc-100 last:border-0 dark:border-zinc-900">
                          <th scope="row" className="py-2 pr-2 text-left text-sm font-normal text-zinc-700 dark:text-zinc-300">
                            {row.label}
                          </th>
                          <td className="py-2 pr-2 text-sm font-medium tabular-nums text-zinc-900 dark:text-zinc-50">
                            {row.value}
                          </td>
                          {compareOn && secondaryRow && (
                            <td className="py-2 pr-2 text-sm font-medium tabular-nums text-zinc-900 dark:text-zinc-50">
                              <span className="inline-flex flex-wrap items-center">
                                {secondaryRow.value}
                                <DiffBadge primaryLabel={variant.sku} row={row} secondaryRow={secondaryRow} />
                              </span>
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </details>
          );
        })}
      </div>
    </div>
  );
}
