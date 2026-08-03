import { ChevronDown } from "lucide-react";
import {
  buildSpecGroups,
  type BladeOption,
  type ComputedConfig,
  type FinishOption,
  type WoodOption,
} from "./data";

/**
 * The deepest proof point on the page. Rendered as semantic tables, not definition lists — axe's
 * `definition-list` / `dlitem` audits have caught a dl-nesting bug on this exact page type before
 * (curation-criteria, 2026-08-02), and a table with `caption` + `scope` sidesteps it entirely. The
 * first group ("Blade") is open on load: the deepest spec content never sits behind a click.
 */
export default function SpecTable({
  blade,
  wood,
  finish,
  config,
}: {
  blade: BladeOption;
  wood: WoodOption;
  finish: FinishOption;
  config: ComputedConfig;
}) {
  const groups = buildSpecGroups(blade, wood, finish, config);

  return (
    <div className="mt-1 divide-y divide-zinc-200">
      {groups.map((group, i) => (
        <details key={group.id} open={i === 0} className="group py-4 first:pt-0 last:pb-0">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-2 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-amber-600 [&::-webkit-details-marker]:hidden [&::marker]:hidden">
            <span className="text-sm font-semibold text-zinc-900">{group.title}</span>
            <ChevronDown
              className="h-4 w-4 flex-none text-zinc-600 transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none"
              aria-hidden="true"
            />
          </summary>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full table-fixed border-collapse text-sm">
              <caption className="mb-2 text-left text-xs font-normal text-zinc-600">
                {group.title} specifications for this configuration
              </caption>
              <thead>
                <tr className="border-b border-zinc-200">
                  <th scope="col" className="w-[42%] py-1.5 pr-2 text-left text-xs font-medium text-zinc-600">
                    Spec
                  </th>
                  <th scope="col" className="w-[58%] py-1.5 pr-2 text-left text-xs font-medium text-zinc-600">
                    Value
                  </th>
                </tr>
              </thead>
              <tbody>
                {group.rows.map((row) => (
                  <tr key={row.id} className="border-b border-zinc-100 last:border-0">
                    <th scope="row" className="py-2 pr-2 text-left text-sm font-normal text-zinc-700">
                      {row.label}
                    </th>
                    <td className="py-2 pr-2 text-sm font-medium tabular-nums text-zinc-900">{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      ))}
    </div>
  );
}
