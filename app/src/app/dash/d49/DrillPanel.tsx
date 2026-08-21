"use client";

import { Check, CornerDownRight } from "lucide-react";
import type { Bridge, BridgeRow } from "./data";
import { formatPct, formatSignedUSD, formatUSD } from "./data";
import { ACCENT_TEXT, BORDER, CHART, NUM, SURFACE_INSET, TEXT_AUX, TEXT_PRIMARY, TEXT_SECONDARY, cx } from "./tokens";
import { Badge, Card, CardHead, DirectionMark, Eyebrow, r2 } from "./ui";

/**
 * Decomposition of exactly one bar. Two stacked proofs:
 *   · sub-drivers — a diverging bar set around a zero rule, every one labelled and signed;
 *   · line items — the three largest invoice lines by name plus a derived remainder row, so the
 *     column foots to the driver total instead of merely gesturing at it.
 * Both totals are computed from their own children, then compared against the driver's amount and
 * the result is printed. If they ever disagreed the panel would say so.
 */

function SubDriverBars({ row }: { row: BridgeRow }) {
  const maxAbs = Math.max(...row.subs.map((s) => Math.abs(s.amount)));

  return (
    <ul className="mt-2.5 flex flex-col gap-2">
      {row.subs.map((sub) => {
        const w = r2((Math.abs(sub.amount) / maxAbs) * 50);
        const down = sub.amount < 0;
        return (
          <li key={sub.label}>
            <div className="flex items-baseline justify-between gap-3">
              <span className={cx("min-w-0 truncate text-xs font-medium", TEXT_SECONDARY)}>{sub.label}</span>
              <span className={cx("flex shrink-0 items-center gap-1 text-xs font-semibold", NUM, TEXT_PRIMARY)}>
                <DirectionMark amount={sub.amount} size={11} />
                {formatSignedUSD(sub.amount)}
              </span>
            </div>
            {/* Diverging track: decreases run left of the zero rule, increases run right. */}
            <div className={cx("relative mt-1 h-2 w-full overflow-hidden rounded-full", SURFACE_INSET)}>
              <span
                className="absolute top-0 h-full rounded-full"
                style={{
                  left: down ? `${r2(50 - w)}%` : "50%",
                  width: `${Math.max(1.5, w)}%`,
                  backgroundColor: down ? CHART.decrease : CHART.increase,
                }}
              />
              <span aria-hidden="true" className="absolute inset-y-0 left-1/2 w-px bg-white/25" />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default function DrillPanel({ bridge, row }: { bridge: Bridge; row: BridgeRow }) {
  const subMatches = row.subTotal === row.amount;
  const namedTotal = row.lineItems.reduce((a, l) => a + l.amount, 0);
  const lineMatches = namedTotal + row.otherAmount === row.amount;

  return (
    <Card id="drill-card" className="flex min-w-0 flex-col">
      <CardHead
        title="Driver decomposition"
        hint={`Selected from the bridge — ${bridge.basis.full.toLowerCase()}. Arrow keys move between bars; the ledger row highlights in step.`}
      />

      <div className={cx("mt-3 rounded-xl border p-3.5", BORDER, SURFACE_INSET)}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className={cx("grid h-9 w-9 shrink-0 place-items-center rounded-xl border", BORDER, "bg-lime-400/10")}>
              <row.Icon size={17} aria-hidden="true" className="text-lime-300" />
            </span>
            <div className="min-w-0">
              <p className={cx("truncate text-sm font-semibold", TEXT_PRIMARY)}>{row.label}</p>
              <p className={cx("truncate text-[11px] font-normal", TEXT_AUX)}>{row.owner}</p>
            </div>
          </div>
          <div className="shrink-0 text-right">
            <p className={cx("flex items-center justify-end gap-1 text-lg font-semibold leading-tight", NUM, TEXT_PRIMARY)}>
              <DirectionMark amount={row.amount} size={15} />
              {formatSignedUSD(row.amount)}
            </p>
            <p className={cx("text-[11px] font-normal", NUM, TEXT_AUX)}>{`${formatPct(row.share)} of gross variance`}</p>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <Badge>{row.type}</Badge>
          <Badge>{`${row.lineCount} line items`}</Badge>
          <Badge>{`Running ${formatUSD(row.runningTotal)}`}</Badge>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-baseline justify-between gap-2">
          <Eyebrow>Sub-drivers</Eyebrow>
          <span className={cx("text-[11px] font-normal", TEXT_AUX)}>{`${row.subs.length} components`}</span>
        </div>
        <SubDriverBars row={row} />
        <p className={cx("mt-2.5 flex items-center gap-1.5 text-[11px] font-medium", subMatches ? ACCENT_TEXT : TEXT_PRIMARY)}>
          <Check size={12} aria-hidden="true" strokeWidth={2.5} />
          {subMatches
            ? `Sub-drivers sum to ${formatSignedUSD(row.subTotal)} — matches the driver exactly.`
            : `Sub-drivers sum to ${formatSignedUSD(row.subTotal)}, driver is ${formatSignedUSD(row.amount)}.`}
        </p>
      </div>

      <div className="mt-4 min-w-0">
        <Eyebrow>Line items behind it</Eyebrow>
        <div className={cx("mt-2 rounded-xl border", BORDER)}>
          <table className="w-full table-fixed text-left text-xs">
            <caption className={cx("px-3 pt-2.5 text-left text-[11px] font-normal", TEXT_AUX)}>
              {`Largest billed lines inside ${row.label}, with the remaining ${row.otherCount} lines collapsed into one derived row.`}
            </caption>
            <colgroup>
              <col style={{ width: "58%" }} />
              <col style={{ width: "42%" }} />
            </colgroup>
            <thead>
              <tr className={cx("border-b", BORDER)}>
                <th scope="col" className={cx("px-3 py-2 text-[11px] font-medium uppercase tracking-[0.08em]", TEXT_AUX)}>
                  Resource
                </th>
                <th scope="col" className={cx("px-3 py-2 text-right text-[11px] font-medium uppercase tracking-[0.08em]", TEXT_AUX)}>
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.07]">
              {row.lineItems.map((item) => (
                <tr key={item.id}>
                  <td className="px-3 py-2">
                    <span className={cx("block truncate text-xs font-medium", TEXT_PRIMARY)}>{item.resource}</span>
                    <span className={cx("block truncate text-[11px] font-normal", TEXT_AUX)}>{`${item.account} · ${item.service}`}</span>
                  </td>
                  <td className={cx("whitespace-nowrap px-3 py-2 text-right align-middle text-xs font-medium", NUM, TEXT_PRIMARY)}>
                    <span className="inline-flex items-center justify-end gap-1">
                      <DirectionMark amount={item.amount} size={11} />
                      {formatSignedUSD(item.amount)}
                    </span>
                  </td>
                </tr>
              ))}
              <tr>
                <td className="px-3 py-2">
                  <span className={cx("flex items-center gap-1.5 truncate text-xs font-normal", TEXT_AUX)}>
                    <CornerDownRight size={12} aria-hidden="true" />
                    {`Other ${row.otherCount} line items`}
                  </span>
                </td>
                <td className={cx("whitespace-nowrap px-3 py-2 text-right text-xs font-medium", NUM, TEXT_SECONDARY)}>{formatSignedUSD(row.otherAmount)}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr className={cx("border-t", BORDER, SURFACE_INSET)}>
                <th scope="row" className={cx("px-3 py-2 text-left text-xs font-semibold", TEXT_PRIMARY)}>
                  {lineMatches ? "Foots to driver" : "Does not foot"}
                </th>
                <td className={cx("whitespace-nowrap px-3 py-2 text-right text-xs font-semibold", NUM, TEXT_PRIMARY)}>{formatSignedUSD(namedTotal + row.otherAmount)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </Card>
  );
}
