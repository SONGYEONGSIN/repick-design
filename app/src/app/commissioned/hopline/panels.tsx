"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpDown,
  ArrowUpRight,
  Check,
  Minus,
  Monitor,
  Pause,
  Smartphone,
  Tablet,
} from "lucide-react";

import { Donut, FlowSvg, Sparkline } from "./charts";
import type { Dict } from "./copy";
import {
  BASE_TOTAL,
  BROWSERS,
  DEVICES,
  HEAT,
  HEAT_AVG,
  HEAT_MAX,
  HEAT_PEAK,
  OPERATING,
  REFERRER_DELTA,
  REFERRER_DOMAIN,
  buildFlow,
  fmtDelta,
  fmtInt,
  fmtPct,
  heatAt,
  heatRatio,
  hourRange,
  r2,
  scaleLinks,
  sortLinks,
  type LinkStatus,
  type Period,
  type SortDir,
  type SortKey,
} from "./data";

export function DeltaTag({
  value,
  t,
  className = "text-sm",
  note = true,
}: {
  value: number;
  t: Dict;
  className?: string;
  // The direction word is dropped inside horizontally scrolling containers:
  // an absolutely positioned sr-only span there paints at unscrolled
  // coordinates and pollutes document.scrollWidth at 390px. The explicit
  // +/- sign and the arrow icon still carry the meaning without colour.
  note?: boolean;
}) {
  const flat = value === 0;
  const rising = value > 0;
  const Icon = flat ? Minus : rising ? ArrowUpRight : ArrowDownRight;
  const tone = flat
    ? "text-zinc-600"
    : rising
      ? "text-emerald-700"
      : "text-red-700";
  return (
    <span
      className={`inline-flex items-center gap-1 font-medium ${tone} ${className}`}
    >
      <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span className="tabular-nums" style={{ fontFamily: "var(--font-display-mono)"}}>
        {fmtDelta(value)}
      </span>
      {note ? (
        <span className="sr-only">
          {flat ? t.common.flat : rising ? t.common.up : t.common.down}
        </span>
      ) : null}
    </span>
  );
}

const DEVICE_ICON: Record<string, typeof Smartphone> = {
  mobile: Smartphone,
  desktop: Monitor,
  tablet: Tablet,
};

/* ---------------------------------------------------------------- */
/* 4. Audience                                                       */
/* ---------------------------------------------------------------- */

export function AudiencePanel({ t }: { t: Dict }) {
  const [tech, setTech] = useState<"browser" | "os">("browser");
  const [picked, setPicked] = useState({
    d: HEAT_PEAK.day,
    h: HEAT_PEAK.hour,
  });
  const [preview, setPreview] = useState<{ d: number; h: number } | null>(null);

  const active = preview ?? picked;
  const activeValue = heatAt(active.d, active.h);
  const isPeak = active.d === HEAT_PEAK.day && active.h === HEAT_PEAK.hour;
  const list = tech === "browser" ? BROWSERS : OPERATING;
  const terms = t.audience.terms as Record<string, string>;

  return (
    <section aria-labelledby="hopline-audience" className="mt-10">
      <h2
        id="hopline-audience"
        className="text-lg font-semibold tracking-tight text-zinc-900"
      >
        {t.audience.h2}
      </h2>
      <p className="mt-1 max-w-2xl text-sm text-zinc-600">{t.audience.lede}</p>

      <div className="mt-4 grid gap-4 lg:grid-cols-12">
        <div className="min-w-0 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm lg:col-span-4">
          <h3 className="text-sm font-medium text-zinc-900">
            {t.audience.deviceTitle}
          </h3>
          <p className="mt-0.5 text-xs text-zinc-500">
            {t.audience.deviceHelp}
          </p>
          <div className="mt-4 flex items-center gap-5">
            <Donut slices={DEVICES} />
            <table className="w-full table-fixed text-sm">
              <caption className="sr-only">{t.audience.srDevice}</caption>
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="w-3/5 pb-1 text-left text-[11px] font-medium tracking-wide text-zinc-500 uppercase"
                  >
                    {t.audience.name}
                  </th>
                  <th
                    scope="col"
                    className="pb-1 text-right text-[11px] font-medium tracking-wide text-zinc-500 uppercase"
                  >
                    {t.audience.share}
                  </th>
                </tr>
              </thead>
              <tbody>
                {DEVICES.map((s) => {
                  const Icon = DEVICE_ICON[s.id] ?? Smartphone;
                  return (
                    <tr key={s.id}>
                      <th
                        scope="row"
                        className="py-1 text-left font-normal text-zinc-700"
                      >
                        <span className="flex items-center gap-1.5">
                          <Icon
                            className="h-3.5 w-3.5 shrink-0 text-zinc-500"
                            aria-hidden="true"
                          />
                          <span className="truncate">{terms[s.id] ?? s.id}</span>
                        </span>
                      </th>
                      <td
                        className="py-1 text-right tabular-nums"
                        style={{ fontFamily: "var(--font-display-mono)"}}
                      >
                        {fmtPct(s.pct)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex items-center justify-between gap-3">
            <h3 className="text-sm font-medium text-zinc-900">
              {t.audience.techTitle}
            </h3>
            <div
              className="inline-flex rounded-lg border border-zinc-200 bg-white"
              role="group"
              aria-label={t.audience.techTitle}
            >
              {(["browser", "os"] as const).map((id) => (
                <button
                  key={id}
                  type="button"
                  aria-pressed={tech === id}
                  onClick={() => setTech(id)}
                  className={`h-9 rounded-[7px] px-3 text-xs font-medium transition-colors motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 ${
                    tech === id
                      ? "bg-zinc-900 text-white"
                      : "text-zinc-600 hover:text-zinc-900"
                  }`}
                >
                  {id === "browser" ? t.audience.browserTab : t.audience.osTab}
                </button>
              ))}
            </div>
          </div>
          <ul className="mt-3 space-y-2">
            {list.map((s) => (
              <li key={s.id} className="flex items-center gap-3">
                <span className="w-16 shrink-0 truncate text-xs text-zinc-600">
                  {terms[s.id] ?? s.id}
                </span>
                <span className="h-2 min-w-0 flex-1 rounded-full bg-zinc-100">
                  <span
                    className="block h-2 rounded-full bg-orange-600"
                    style={{ width: `${s.pct}%` }}
                  />
                </span>
                <span
                  className="w-12 shrink-0 text-right text-xs tabular-nums text-zinc-700"
                  style={{ fontFamily: "var(--font-display-mono)"}}
                >
                  {fmtPct(s.pct)}
                </span>
              </li>
            ))}
          </ul>
          <p className="sr-only">{t.audience.srTech}</p>
        </div>

        <div className="min-w-0 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm lg:col-span-8">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="text-sm font-medium text-zinc-900">
              {t.audience.heatTitle}
            </h3>
            <p className="text-xs text-zinc-500">
              {t.audience.avgLabel}{" "}
              <span className="tabular-nums" style={{ fontFamily: "var(--font-display-mono)"}}>
                {fmtInt(HEAT_AVG)}
              </span>
            </p>
          </div>
          <p className="mt-0.5 text-xs text-zinc-500">{t.audience.heatHelp}</p>

          <p
            aria-live="polite"
            className="mt-3 rounded-lg bg-orange-50 px-3 py-2 text-sm text-zinc-800"
          >
            <span className="font-medium text-orange-700">
              {isPeak ? t.audience.peakPrefix : `${t.audience.heatReading}:`}
            </span>{" "}
            {t.audience.conclusion(
              t.audience.days[active.d] ?? "",
              hourRange(active.h),
              fmtInt(activeValue),
              heatRatio(activeValue),
            )}
          </p>

          <div className="mt-4 overflow-x-auto md:overflow-x-visible">
            <div className="min-w-[520px] md:min-w-0">
              <div className="flex items-center gap-2">
                <span className="w-8 shrink-0" />
                <div className="grid flex-1 grid-cols-12 gap-1">
                  {HEAT[0]?.map((_, hi) => (
                    <span
                      key={`hour-${hi}`}
                      className="text-center text-[10px] tabular-nums text-zinc-500"
                      style={{ fontFamily: "var(--font-display-mono)"}}
                    >
                      {`${hi * 2}`.padStart(2, "0")}
                    </span>
                  ))}
                </div>
              </div>
              {HEAT.map((row, di) => (
                <div
                  key={`row-${di}`}
                  className="mt-1 flex items-center gap-2"
                >
                  <span className="w-8 shrink-0 text-[11px] text-zinc-600">
                    {t.audience.days[di] ?? ""}
                  </span>
                  <div className="grid flex-1 grid-cols-12 gap-1">
                    {row.map((v, hi) => {
                      const on = picked.d === di && picked.h === hi;
                      return (
                        <button
                          key={`cell-${di}-${hi}`}
                          type="button"
                          aria-pressed={on}
                          aria-label={t.audience.cellLabel(
                            t.audience.days[di] ?? "",
                            hourRange(hi),
                            fmtInt(v),
                          )}
                          onClick={() => setPicked({ d: di, h: hi })}
                          onMouseEnter={() => setPreview({ d: di, h: hi })}
                          onMouseLeave={() => setPreview(null)}
                          onFocus={() => setPreview({ d: di, h: hi })}
                          onBlur={() => setPreview(null)}
                          className={`h-7 rounded-[3px] border transition-colors motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 ${
                            on ? "border-zinc-900" : "border-transparent"
                          }`}
                          style={{
                            backgroundColor: `rgba(234, 88, 12, ${r2(0.06 + (v / HEAT_MAX) * 0.84)})`,
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- */
/* 5. Sources -> links                                               */
/* ---------------------------------------------------------------- */

export function FlowPanel({ t, period }: { t: Dict; period: Period }) {
  const layout = useMemo(
    () => buildFlow(period.total / BASE_TOTAL),
    [period.total],
  );
  const terms = t.flow.terms as Record<string, string>;
  const ranked = useMemo(
    () => [...layout.sources].sort((a, b) => b.total - a.total),
    [layout.sources],
  );

  return (
    <section aria-labelledby="hopline-flow" className="mt-10">
      <h2
        id="hopline-flow"
        className="text-lg font-semibold tracking-tight text-zinc-900"
      >
        {t.flow.h2}
      </h2>
      <p className="mt-1 max-w-2xl text-sm text-zinc-600">{t.flow.lede}</p>

      <div className="mt-4 grid gap-4 lg:grid-cols-12">
        <div className="min-w-0 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm lg:col-span-7">
          <div className="flex items-center justify-between text-[11px] font-medium tracking-wide text-zinc-500 uppercase">
            <span>{t.flow.sources}</span>
            <span>{t.flow.links}</span>
          </div>
          <div className="relative mt-3 h-[320px] w-full overflow-hidden">
            <FlowSvg layout={layout} />
            {layout.sources.map((node) => (
              <span
                key={`sl-${node.id}`}
                className="absolute left-0 w-[29%] -translate-y-1/2 truncate text-[10px] text-zinc-700 sm:text-[11px]"
                style={{ top: `${r2((node.center / 320) * 100)}%` }}
              >
                {terms[node.id] ?? node.id}{" "}
                <span className="tabular-nums" style={{ fontFamily: "var(--font-display-mono)"}}>
                  {fmtInt(node.total)}
                </span>
              </span>
            ))}
            {layout.links.map((node) => (
              <span
                key={`ll-${node.id}`}
                className="absolute right-0 w-[29%] -translate-y-1/2 truncate text-right text-[10px] text-zinc-700 sm:text-[11px]"
                style={{ top: `${r2((node.center / 320) * 100)}%` }}
              >
                <span style={{ fontFamily: "var(--font-display-mono)"}}>{node.id}</span>{" "}
                <span className="tabular-nums" style={{ fontFamily: "var(--font-display-mono)"}}>
                  {fmtInt(node.total)}
                </span>
              </span>
            ))}
          </div>
          <p className="mt-3 text-sm text-zinc-600">
            {t.flow.attributed(
              fmtInt(layout.total),
              fmtInt(period.total),
              fmtPct((layout.total / period.total) * 100),
            )}
          </p>
          <div className="sr-only">
            <table>
              <caption>{t.flow.srFlow}</caption>
              <thead>
                <tr>
                  <th scope="col" className="font-medium">
                    {t.flow.source}
                  </th>
                  <th scope="col" className="font-medium">
                    {t.flow.link}
                  </th>
                  <th scope="col" className="font-medium">
                    {t.flow.clicks}
                  </th>
                </tr>
              </thead>
              <tbody>
                {layout.ribbons.map((rib) => (
                  <tr key={`sr-${rib.key}`}>
                    <td>{terms[rib.s] ?? rib.s}</td>
                    <td>{rib.l}</td>
                    <td>{fmtInt(rib.value)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="min-w-0 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm lg:col-span-5">
          <h3 className="text-sm font-medium text-zinc-900">
            {t.flow.domainsTitle}
          </h3>
          <p className="mt-0.5 text-xs text-zinc-500">{t.flow.domainsHelp}</p>
          <table className="mt-4 w-full table-fixed text-sm">
            <caption className="sr-only">{t.flow.domainsTitle}</caption>
            <colgroup>
              <col className="w-[48%]" />
              <col className="w-[26%]" />
              <col className="w-[26%]" />
            </colgroup>
            <thead>
              <tr className="border-b border-zinc-200">
                <th
                  scope="col"
                  className="pb-2 text-left text-[11px] font-medium tracking-wide text-zinc-500 uppercase"
                >
                  {t.flow.domain}
                </th>
                <th
                  scope="col"
                  className="pb-2 text-right text-[11px] font-medium tracking-wide text-zinc-500 uppercase"
                >
                  {t.flow.clicks}
                </th>
                <th
                  scope="col"
                  className="pb-2 text-right text-[11px] font-medium tracking-wide text-zinc-500 uppercase"
                >
                  {t.flow.change}
                </th>
              </tr>
            </thead>
            <tbody>
              {ranked.map((node) => (
                <tr key={`dom-${node.id}`} className="border-b border-zinc-100">
                  <th
                    scope="row"
                    className="py-2.5 text-left font-normal text-zinc-800"
                  >
                    <span
                      className="block truncate"
                      style={{ fontFamily: "var(--font-display-mono)"}}
                    >
                      {REFERRER_DOMAIN[node.id] ?? node.id}
                    </span>
                  </th>
                  <td
                    className="py-2.5 text-right tabular-nums text-zinc-900"
                    style={{ fontFamily: "var(--font-display-mono)"}}
                  >
                    {fmtInt(node.total)}
                  </td>
                  <td className="py-2.5 text-right">
                    <DeltaTag
                      value={REFERRER_DELTA[node.id] ?? 0}
                      t={t}
                      className="text-xs"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- */
/* 6. Link table                                                     */
/* ---------------------------------------------------------------- */

const STATUS_STYLE: Record<LinkStatus, string> = {
  live: "border-emerald-200 bg-emerald-50 text-emerald-700",
  broken: "border-red-200 bg-red-50 text-red-700",
  paused: "border-zinc-200 bg-zinc-100 text-zinc-600",
};

const STATUS_ICON: Record<LinkStatus, typeof Check> = {
  live: Check,
  broken: AlertTriangle,
  paused: Pause,
};

export function LinkTable({ t, period }: { t: Dict; period: Period }) {
  const [sortKey, setSortKey] = useState<SortKey>("c");
  const [dir, setDir] = useState<SortDir>("desc");

  const { rows, other } = useMemo(() => scaleLinks(period), [period]);
  const sorted = useMemo(
    () => sortLinks(rows, sortKey, dir),
    [rows, sortKey, dir],
  );

  const toggle = (key: SortKey) => {
    if (key === sortKey) {
      setDir(dir === "desc" ? "asc" : "desc");
      return;
    }
    setSortKey(key);
    setDir("desc");
  };

  const headers: { key: SortKey; label: string }[] = [
    { key: "c", label: t.table.cols.clicks },
    { key: "u", label: t.table.cols.unique },
    { key: "mobilePct", label: t.table.cols.mobile },
  ];

  const sortState = (key: SortKey): "ascending" | "descending" | "none" =>
    sortKey === key ? (dir === "asc" ? "ascending" : "descending") : "none";

  return (
    <section aria-labelledby="hopline-links" className="mt-10 pb-16">
      <h2
        id="hopline-links"
        className="text-lg font-semibold tracking-tight text-zinc-900"
      >
        {t.table.h2}
      </h2>
      <p className="mt-1 max-w-2xl text-sm text-zinc-600">{t.table.lede}</p>

      <div className="mt-4 rounded-xl border border-zinc-200 bg-white shadow-sm">
        <div className="overflow-x-auto md:overflow-x-visible">
          <table className="w-full min-w-[640px] table-fixed text-sm md:min-w-0">
            <caption className="px-5 pt-4 text-left text-xs text-zinc-500">
              {t.table.caption}
            </caption>
            <colgroup>
              <col className="w-[28%]" />
              <col className="w-[15%]" />
              <col className="w-[15%]" />
              <col className="w-[12%]" />
              <col className="w-[12%]" />
              <col className="w-[18%]" />
            </colgroup>
            <thead>
              <tr className="border-b border-zinc-200">
                <th
                  scope="col"
                  className="px-5 py-3 text-left text-[11px] font-medium tracking-wide text-zinc-500 uppercase"
                >
                  {t.table.cols.slug}
                </th>
                {headers.map((h) => (
                  <th
                    key={h.key}
                    scope="col"
                    aria-sort={sortState(h.key)}
                    className="px-3 py-3 text-right text-[11px] font-medium tracking-wide text-zinc-500 uppercase"
                  >
                    <button
                      type="button"
                      onClick={() => toggle(h.key)}
                      className="inline-flex w-full items-center justify-end gap-1 rounded transition-colors motion-reduce:transition-none hover:text-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
                    >
                      {h.label}
                      <ArrowUpDown
                        className={`h-3 w-3 shrink-0 ${sortKey === h.key ? "text-orange-700" : "text-zinc-500"}`}
                        aria-hidden="true"
                      />
                    </button>
                  </th>
                ))}
                <th
                  scope="col"
                  className="px-3 py-3 text-left text-[11px] font-medium tracking-wide text-zinc-500 uppercase"
                >
                  {t.table.cols.status}
                </th>
                <th
                  scope="col"
                  aria-sort={sortState("deltaPct")}
                  className="px-5 py-3 text-right text-[11px] font-medium tracking-wide text-zinc-500 uppercase"
                >
                  <button
                    type="button"
                    onClick={() => toggle("deltaPct")}
                    className="inline-flex w-full items-center justify-end gap-1 rounded transition-colors motion-reduce:transition-none hover:text-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
                  >
                    {t.table.cols.delta}
                    <ArrowUpDown
                      className={`h-3 w-3 shrink-0 ${sortKey === "deltaPct" ? "text-orange-700" : "text-zinc-500"}`}
                      aria-hidden="true"
                    />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((row) => {
                const Icon = STATUS_ICON[row.status];
                return (
                  <tr
                    key={row.slug}
                    className="border-b border-zinc-100 transition-colors motion-reduce:transition-none hover:bg-zinc-50"
                  >
                    <th
                      scope="row"
                      className="px-5 py-3 text-left font-normal whitespace-nowrap text-zinc-900"
                    >
                      <span
                        className="block truncate"
                        style={{ fontFamily: "var(--font-display-mono)"}}
                      >
                        {row.slug}
                      </span>
                    </th>
                    <td
                      className="px-3 py-3 text-right tabular-nums whitespace-nowrap text-zinc-900"
                      style={{ fontFamily: "var(--font-display-mono)"}}
                    >
                      {fmtInt(row.c)}
                    </td>
                    <td
                      className="px-3 py-3 text-right tabular-nums whitespace-nowrap text-zinc-600"
                      style={{ fontFamily: "var(--font-display-mono)"}}
                    >
                      {fmtInt(row.u)}
                    </td>
                    <td
                      className="px-3 py-3 text-right tabular-nums whitespace-nowrap text-zinc-600"
                      style={{ fontFamily: "var(--font-display-mono)"}}
                    >
                      {fmtPct(row.mobilePct)}
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium whitespace-nowrap ${STATUS_STYLE[row.status]}`}
                      >
                        <Icon className="h-3 w-3 shrink-0" aria-hidden="true" />
                        {t.table.status[row.status]}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="flex items-center justify-end gap-2">
                        <span className="w-10 shrink-0">
                          <Sparkline
                            values={row.spark}
                            rising={row.deltaPct >= 0}
                          />
                        </span>
                        <DeltaTag
                          value={row.deltaPct}
                          t={t}
                          className="text-xs"
                          note={false}
                        />
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-b border-zinc-100 bg-zinc-50">
                <th
                  scope="row"
                  className="px-5 py-3 text-left font-normal text-zinc-600"
                >
                  {t.table.other(fmtInt(period.activeLinks - rows.length))}
                </th>
                <td
                  className="px-3 py-3 text-right tabular-nums whitespace-nowrap text-zinc-600"
                  style={{ fontFamily: "var(--font-display-mono)"}}
                >
                  {fmtInt(other)}
                </td>
                <td className="px-3 py-3" />
                <td className="px-3 py-3" />
                <td className="px-3 py-3" />
                <td className="px-5 py-3 text-right text-xs text-zinc-500">
                  {t.table.otherNote}
                </td>
              </tr>
              <tr className="bg-zinc-50">
                <th
                  scope="row"
                  className="px-5 py-3 text-left font-medium text-zinc-900"
                >
                  {t.table.totalRow}
                </th>
                <td
                  className="px-3 py-3 text-right font-medium tabular-nums whitespace-nowrap text-zinc-900"
                  style={{ fontFamily: "var(--font-display-mono)"}}
                >
                  {fmtInt(period.total)}
                </td>
                <td className="px-3 py-3" />
                <td className="px-3 py-3" />
                <td className="px-3 py-3" />
                <td className="px-5 py-3 text-right">
                  <DeltaTag
                    value={period.deltaPct}
                    t={t}
                    className="text-xs"
                    note={false}
                  />
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </section>
  );
}
