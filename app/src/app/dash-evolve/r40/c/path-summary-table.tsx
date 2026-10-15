import { AlertTriangle } from "lucide-react";
import { EDGE_GEOMETRY, EDGE_STATS, bottleneckFor, edgeLabel, type PeriodId } from "./data";

const numberFormat = new Intl.NumberFormat("en-US");

export default function PathSummaryTable({ period }: { period: PeriodId }) {
  const stats = EDGE_STATS[period];
  const bottleneck = bottleneckFor(period);
  const rows = EDGE_GEOMETRY.map((edge) => {
    const s = stats.find((x) => x.id === edge.id)!;
    const fromLabel = edgeLabel(edge.id).split(" → ")[0]!;
    const toLabel = edgeLabel(edge.id).split(" → ")[1]!;
    return { id: edge.id, fromLabel, toLabel, volume: s.volume, avgWaitHours: s.avgWaitHours };
  });

  return (
    <div className="rounded-xl border border-white/10 bg-zinc-900 p-4 sm:p-5">
      <h2 className="font-semibold text-lg text-zinc-50">Transition volumes</h2>
      <p className="mt-0.5 font-normal text-sm text-zinc-400">
        Every path in the flow above, as a plain table — the accessible companion to the diagram.
      </p>
      <p className="mt-2 flex items-start gap-1.5 font-normal text-sm text-zinc-50">
        <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-400" aria-hidden="true" />
        <span>
          Top bottleneck: <span className="font-medium">{edgeLabel(bottleneck.id)}</span> at{" "}
          {bottleneck.avgWaitHours.toFixed(1)}h average wait.
        </span>
      </p>

      {/* Desktop/tablet: real table, percentage columns, no horizontal scroll. */}
      <table className="mt-4 hidden w-full table-fixed border-collapse md:table">
        <caption className="sr-only">
          Transition volumes and average wait time by path, for the selected period, with the bottleneck path
          flagged.
        </caption>
        <colgroup>
          <col style={{ width: "30%" }} />
          <col style={{ width: "30%" }} />
          <col style={{ width: "18%" }} />
          <col style={{ width: "22%" }} />
        </colgroup>
        <thead>
          <tr className="border-b border-white/10">
            <th scope="col" className="py-2 text-left font-medium text-xs text-zinc-400 uppercase tracking-wide">
              From
            </th>
            <th scope="col" className="py-2 text-left font-medium text-xs text-zinc-400 uppercase tracking-wide">
              To
            </th>
            <th scope="col" className="py-2 text-right font-medium text-xs text-zinc-400 uppercase tracking-wide">
              Volume
            </th>
            <th scope="col" className="py-2 text-right font-medium text-xs text-zinc-400 uppercase tracking-wide">
              Avg wait
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-white/5 last:border-0">
              <td className="py-2 font-normal text-sm text-zinc-50">{row.fromLabel}</td>
              <td className="py-2 font-normal text-sm text-zinc-50">
                <span className="inline-flex items-center gap-1.5">
                  {row.toLabel}
                  {row.id === bottleneck.id ? (
                    <span className="inline-flex h-5 items-center gap-1 whitespace-nowrap rounded-full border border-red-400/30 bg-red-400/10 px-1.5 font-medium text-[10px] text-red-300">
                      <AlertTriangle className="h-2.5 w-2.5 shrink-0" aria-hidden="true" />
                      Bottleneck
                    </span>
                  ) : null}
                </span>
              </td>
              <td className="py-2 whitespace-nowrap text-right font-normal text-sm text-zinc-50 tabular-nums">
                {numberFormat.format(row.volume)}
              </td>
              <td className="py-2 whitespace-nowrap text-right font-normal text-sm text-zinc-50 tabular-nums">
                {row.avgWaitHours.toFixed(1)}h
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile: stacked cards instead of a cramped table. */}
      <ul className="mt-4 space-y-2 md:hidden">
        {rows.map((row) => (
          <li key={row.id} className="rounded-lg border border-white/10 p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="min-w-0 truncate font-medium text-sm text-zinc-50">
                {row.fromLabel} <span aria-hidden="true">&#8594;</span> {row.toLabel}
              </p>
              {row.id === bottleneck.id ? (
                <span className="inline-flex h-5 shrink-0 items-center gap-1 whitespace-nowrap rounded-full border border-red-400/30 bg-red-400/10 px-1.5 font-medium text-[10px] text-red-300">
                  <AlertTriangle className="h-2.5 w-2.5 shrink-0" aria-hidden="true" />
                  Bottleneck
                </span>
              ) : null}
            </div>
            <dl className="mt-1.5 flex items-center gap-4">
              <div className="flex items-baseline gap-1.5">
                <dt className="font-normal text-xs text-zinc-400">Volume</dt>
                <dd className="font-medium text-sm text-zinc-50 tabular-nums">{numberFormat.format(row.volume)}</dd>
              </div>
              <div className="flex items-baseline gap-1.5">
                <dt className="font-normal text-xs text-zinc-400">Avg wait</dt>
                <dd className="font-medium text-sm text-zinc-50 tabular-nums">{row.avgWaitHours.toFixed(1)}h</dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>
    </div>
  );
}
