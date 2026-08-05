import { TRACK_RECORD, formatCount } from "./data";

const TOTAL_ENGAGEMENTS = TRACK_RECORD.reduce((sum, row) => sum + row.engagements, 0);

/**
 * Career-wide coverage table — always rendered, never behind a tab or an expand. It reinforces the
 * sticky identity bar's headline numbers with the breakdown behind them, which is the "let interaction
 * reinforce rather than gate the core proof" pattern: the filterable log below lets a visitor slice
 * recent work, but this table's totals never change with those filters, so the base claim is never
 * only as complete as whatever filter happens to be selected.
 */
export default function TrackRecordTable() {
  return (
    <section aria-labelledby="track-record-heading" className="mx-auto max-w-6xl px-4 pb-8 sm:px-6">
      <h2 id="track-record-heading" className="text-lg font-semibold text-zinc-900">
        Track record by protocol type
      </h2>
      <p className="mt-1 text-sm font-normal text-zinc-600">Career totals, all engagements to date.</p>

      <div className="mt-4 overflow-x-auto rounded-xl border border-zinc-200">
        <table className="w-full table-fixed border-collapse text-left text-sm">
          <caption className="sr-only">
            Career audit coverage by protocol type, with engagement count, critical findings, and share of practice
          </caption>
          <colgroup>
            <col className="w-[34%]" />
            <col className="w-[22%]" />
            <col className="w-[22%]" />
            <col className="w-[22%]" />
          </colgroup>
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50">
              <th scope="col" className="px-4 py-2.5 font-medium text-zinc-700">
                Protocol type
              </th>
              <th scope="col" className="px-4 py-2.5 text-right font-medium text-zinc-700">
                Engagements
              </th>
              <th scope="col" className="px-4 py-2.5 text-right font-medium text-zinc-700">
                Critical findings
              </th>
              <th scope="col" className="px-4 py-2.5 text-right font-medium text-zinc-700">
                Share of practice
              </th>
            </tr>
          </thead>
          <tbody>
            {TRACK_RECORD.map((row) => {
              const share = (row.engagements / TOTAL_ENGAGEMENTS) * 100;
              return (
                <tr key={row.scope} className="border-b border-zinc-100 last:border-0">
                  <td className="px-4 py-2.5 font-normal text-zinc-800">{row.scope}</td>
                  <td className="px-4 py-2.5 text-right font-normal tabular-nums text-zinc-800">
                    {formatCount(row.engagements)}
                  </td>
                  <td className="px-4 py-2.5 text-right font-normal tabular-nums text-zinc-800">
                    {formatCount(row.criticalFindings)}
                  </td>
                  <td className="px-4 py-2.5 text-right font-normal tabular-nums text-zinc-800">
                    {share.toFixed(1)}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
