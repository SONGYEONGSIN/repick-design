"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import { useMemo, useState } from "react";
import { DEVICES, formatCount, formatPp, formatPct, segmentRows, type DeviceId, type PeriodId } from "./data";
import { BORDER, DIVIDE, FOCUS_RING, HOVER_ROW, NUM, TEXT_CAPTION, TEXT_PRIMARY, TEXT_SECONDARY, TRANSITION, cx } from "./tokens";
import { Badge, Card, CardHeader, SegmentedControl, SortableTh, type SortDir } from "./ui";

type SortKey = "label" | "sessions" | "cart" | "checkout" | "purchase";

export default function SegmentTable({
  period,
  device,
  onDeviceChange,
  selectedSegmentId,
  onSelectSegment,
}: {
  period: PeriodId;
  device: DeviceId;
  onDeviceChange: (d: DeviceId) => void;
  selectedSegmentId: string | null;
  onSelectSegment: (id: string) => void;
}) {
  const [sortKey, setSortKey] = useState<SortKey>("sessions");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const rows = useMemo(() => {
    const list = segmentRows(period, device);
    list.sort((a, b) => {
      let cmp = 0;
      if (sortKey === "label") cmp = a.label.localeCompare(b.label);
      else if (sortKey === "sessions") cmp = a.sessions - b.sessions;
      else if (sortKey === "cart") cmp = a.addToCartRateAdj - b.addToCartRateAdj;
      else if (sortKey === "checkout") cmp = a.checkoutStartRateAdj - b.checkoutStartRateAdj;
      else cmp = a.purchaseRateAdj - b.purchaseRateAdj;
      return sortDir === "asc" ? cmp : -cmp;
    });
    return list;
  }, [period, device, sortKey, sortDir]);

  const totalSessions = rows.reduce((a, r) => a + r.sessions, 0);

  function onSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "label" ? "asc" : "desc");
    }
  }

  return (
    <Card padded={false}>
      <div className="p-4 sm:p-5">
        <CardHeader
          title="Traffic segment performance"
          titleId="segment-heading"
          description={`${rows.length} channels · sortable · filter by device recomputes sessions and rates`}
          action={<SegmentedControl ariaLabel="Filter by device" options={DEVICES} value={device} onChange={onDeviceChange} size="sm" />}
        />
      </div>

      <div className={cx("border-t", BORDER)}>
        <div className="overflow-x-auto [scrollbar-width:thin]">
          <div className="min-w-[640px] lg:min-w-0">
            <table className="w-full table-fixed border-collapse text-sm" aria-labelledby="segment-heading">
              <caption className="sr-only">
                Checkout funnel performance by traffic segment. Sortable by sessions, add-to-cart rate, checkout-start rate, and purchase rate.
              </caption>
              <colgroup>
                <col style={{ width: "26%" }} />
                <col style={{ width: "18%" }} />
                <col style={{ width: "18%" }} />
                <col style={{ width: "18%" }} />
                <col style={{ width: "20%" }} />
              </colgroup>
              <thead>
                <tr className={cx("border-b", BORDER)}>
                  <SortableTh columnKey="label" activeKey={sortKey} dir={sortDir} onSort={onSort}>
                    Channel
                  </SortableTh>
                  <SortableTh columnKey="sessions" activeKey={sortKey} dir={sortDir} onSort={onSort} align="right">
                    Sessions
                  </SortableTh>
                  <SortableTh columnKey="cart" activeKey={sortKey} dir={sortDir} onSort={onSort} align="right">
                    Add to Cart
                  </SortableTh>
                  <SortableTh columnKey="checkout" activeKey={sortKey} dir={sortDir} onSort={onSort} align="right">
                    Checkout
                  </SortableTh>
                  <SortableTh columnKey="purchase" activeKey={sortKey} dir={sortDir} onSort={onSort} align="right">
                    Purchase
                  </SortableTh>
                </tr>
              </thead>
              <tbody className={cx("divide-y", DIVIDE)}>
                {rows.map((r) => {
                  const selected = r.id === selectedSegmentId;
                  const DeltaIcon = r.purchaseDeltaPp >= 0 ? TrendingUp : TrendingDown;
                  return (
                    <tr key={r.id} className={cx(HOVER_ROW, TRANSITION, selected && "bg-violet-50/70 dark:bg-violet-500/10")}>
                      <td className="py-2 pl-3 text-left">
                        <button
                          type="button"
                          onClick={() => onSelectSegment(r.id)}
                          aria-pressed={selected}
                          className={cx("group flex min-w-0 max-w-full items-center gap-2 rounded text-left", FOCUS_RING)}
                        >
                          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300">
                            <r.Icon size={13} aria-hidden="true" />
                          </span>
                          <span className={cx("truncate text-sm font-medium group-hover:underline", TEXT_PRIMARY)}>{r.label}</span>
                        </button>
                      </td>
                      <td className={cx("py-2 pr-3 text-right text-sm whitespace-nowrap", NUM, TEXT_SECONDARY)}>{formatCount(r.sessions)}</td>
                      <td className={cx("py-2 pr-3 text-right text-sm whitespace-nowrap", NUM, TEXT_SECONDARY)}>{formatPct(r.addToCartRateAdj)}</td>
                      <td className={cx("py-2 pr-3 text-right text-sm whitespace-nowrap", NUM, TEXT_SECONDARY)}>{formatPct(r.checkoutStartRateAdj)}</td>
                      <td className="py-2 pr-3 text-right">
                        <span className={cx("inline-flex items-center justify-end gap-1.5 whitespace-nowrap", NUM)}>
                          <span className={cx("text-sm font-semibold", TEXT_PRIMARY)}>{formatPct(r.purchaseRateAdj)}</span>
                          <Badge tone={r.purchaseDeltaPp >= 0 ? "up" : "down"} Icon={DeltaIcon}>
                            {formatPp(r.purchaseDeltaPp)}
                          </Badge>
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className={cx("border-t", BORDER)}>
                  <td className={cx("py-2 pl-3 text-left text-xs font-semibold uppercase tracking-wide", TEXT_CAPTION)}>Total</td>
                  <td className={cx("py-2 pr-3 text-right text-sm font-semibold whitespace-nowrap", NUM, TEXT_PRIMARY)}>{formatCount(totalSessions)}</td>
                  <td colSpan={3} className="py-2 pr-3" />
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </Card>
  );
}
