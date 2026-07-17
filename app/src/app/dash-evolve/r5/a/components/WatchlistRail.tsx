"use client";

import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import { useMemo } from "react";
import { generateSeries, INSTRUMENTS, type Instrument } from "../lib/data";
import { formatPct, formatRate } from "../lib/format";
import { BORDER, DIVIDE, FOCUS_RING_INSET, NUM, TEXT_CAPTION, TEXT_PRIMARY, TRANSITION, cx } from "../lib/tokens";
import { Badge, Card, CardHeader, Sparkline } from "./ui";

function changeFor(instrument: Instrument): { pct: number; abs: number } {
  const series = generateSeries(instrument, "1M");
  const first = series[0].value;
  const last = series[series.length - 1].value;
  return { pct: ((last - first) / first) * 100, abs: last - first };
}

function WatchlistRow({
  instrument,
  selected,
  onSelect,
}: {
  instrument: Instrument;
  selected: boolean;
  onSelect: () => void;
}) {
  const { pct } = changeFor(instrument);
  const sparkData = useMemo(() => generateSeries(instrument, "1M").slice(-14).map((p) => p.value), [instrument]);
  const tone = pct > 0.01 ? "positive" : pct < -0.01 ? "negative" : "neutral";
  const Icon = pct > 0.01 ? TrendingUp : pct < -0.01 ? TrendingDown : Minus;

  return (
    <li>
      <button
        type="button"
        onClick={onSelect}
        aria-current={selected ? "true" : undefined}
        className={cx(
          "flex w-full items-center gap-3 px-3 py-2.5 text-left",
          TRANSITION,
          FOCUS_RING_INSET,
          selected ? "bg-blue-50 dark:bg-blue-500/10" : "hover:bg-zinc-50 dark:hover:bg-white/[0.03]",
        )}
      >
        <span className="min-w-0 flex-1">
          <span className={cx("flex items-center gap-1.5 truncate text-sm font-semibold", TEXT_PRIMARY)}>
            {instrument.pair}
            {selected ? <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600 dark:bg-blue-400" aria-hidden="true" /> : null}
          </span>
          <span
            className={cx(
              "mt-0.5 flex items-center gap-1 truncate text-xs",
              NUM,
              selected ? "text-zinc-600 dark:text-zinc-300" : TEXT_CAPTION,
            )}
          >
            <Icon size={11} aria-hidden="true" />
            {formatPct(pct, true)}
          </span>
        </span>

        <Sparkline data={sparkData} tone={tone} />

        <span className="w-[76px] shrink-0 text-right">
          <span className={cx("block text-sm font-semibold", NUM, TEXT_PRIMARY)}>{formatRate(instrument.last, instrument)}</span>
          <span className="mt-0.5 block">
            {instrument.exposure === "Flat" ? (
              <Badge tone="neutral">평가만</Badge>
            ) : (
              <Badge tone={instrument.exposure === "Long" ? "positive" : "warning"}>{instrument.exposure === "Long" ? "매입 노출" : "매도 노출"}</Badge>
            )}
          </span>
        </span>
      </button>
    </li>
  );
}

export default function WatchlistRail({
  selectedId,
  onSelect,
}: {
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <Card padded={false} className="flex h-[380px] w-full shrink-0 flex-col overflow-hidden lg:h-full lg:w-72">
      <div className={cx("shrink-0 border-b px-4 py-3", BORDER)}>
        <CardHeader title="워치리스트" description={`${INSTRUMENTS.length}개 통화쌍 · 그룹 익스포저`} />
      </div>
      <ul className={cx("min-h-0 flex-1 divide-y overflow-y-auto [scrollbar-width:thin]", DIVIDE)}>
        {INSTRUMENTS.map((inst) => (
          <WatchlistRow key={inst.id} instrument={inst} selected={inst.id === selectedId} onSelect={() => onSelect(inst.id)} />
        ))}
      </ul>
    </Card>
  );
}
