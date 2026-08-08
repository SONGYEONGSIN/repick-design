"use client";

import { ArrowRight, CalendarClock, Check, Phone, Receipt } from "lucide-react";
import {
  DISPLAY,
  FOCUS,
  cx,
  hardwareNote,
  monthlyLines,
  monthlyNote,
  rolloutNote,
  todayLines,
  todayNote,
  won,
  type LineItem,
  type Quote,
} from "./data";

/** The readout. Two amounts of different natures — capital out of the account today, operating
 *  cost every month after — sit in one slab split by a single hairline, so the reader sees the
 *  separation before reading either number. They are never added together anywhere on the page.
 *  Both come from the same `quote` object the controls below drive, and at 390px they stay
 *  side by side rather than stacking: the split is the point. */
export default function ReadoutRow({ quote }: { quote: Quote }) {
  return (
    <div className="grid gap-3 lg:grid-cols-3">
      <div className="grid min-w-0 animate-[rise_0.45s_ease-out_both] grid-cols-2 rounded-2xl border border-zinc-800 motion-reduce:animate-none lg:col-span-2">
        <MoneyPanel
          id="due-today"
          icon={Receipt}
          title="Due today"
          amount={quote.dueToday}
          accent
          items={todayLines(quote)}
          note={todayNote(quote)}
          className="border-r border-zinc-800"
        />
        <MoneyPanel
          id="every-month"
          icon={CalendarClock}
          title="Every month"
          amount={quote.monthly}
          items={monthlyLines(quote)}
          note={monthlyNote(quote)}
        />
      </div>

      <DecidePanel quote={quote} />
    </div>
  );
}

interface MoneyPanelProps {
  id: string;
  icon: typeof Receipt;
  title: string;
  amount: number;
  accent?: boolean;
  items: LineItem[];
  note: string;
  className?: string;
}

function MoneyPanel({ id, icon: Icon, title, amount, accent, items, note, className }: MoneyPanelProps) {
  const accentShare = amount > 0 ? items.filter((i) => i.tone === "accent").reduce((s, i) => s + i.amount, 0) / amount : 1;

  return (
    <section aria-labelledby={id} className={cx("flex min-w-0 flex-col p-4 sm:p-5", className)}>
      <h2 id={id} className="flex items-center gap-1.5 text-xs font-medium tracking-[0.16em] text-zinc-400 uppercase">
        <Icon className="h-3.5 w-3.5 flex-none" aria-hidden="true" />
        {title}
      </h2>

      <p
        className={cx(
          "mt-2 text-xl font-semibold tracking-tight tabular-nums sm:text-3xl lg:text-4xl",
          accent ? "text-amber-400" : "text-zinc-50",
        )}
        style={DISPLAY}
      >
        {won(amount)}
      </p>

      {/* Composition, as a share rather than a second set of numbers — the amounts are all in the
          list below. Scaled with a transform, not a width, so the change is composited. */}
      <div aria-hidden="true" className="relative mt-3 h-1.5 w-full overflow-hidden rounded-full bg-zinc-600">
        <span
          className="absolute inset-0 origin-left bg-amber-400 transition-transform duration-300 motion-reduce:transition-none"
          style={{ transform: `scaleX(${accentShare.toFixed(4)})` }}
        />
      </div>

      <dl className="mt-3 flex flex-col gap-2">
        {items.map((item) => (
          <div key={item.label} className="flex flex-wrap items-baseline justify-between gap-x-3">
            <dt className="min-w-0 text-xs font-medium text-zinc-50">
              {item.label}
              <span className="block font-normal text-zinc-400 tabular-nums">{item.detail}</span>
            </dt>
            {/* `ml-auto` so the amount stays on the right edge when the label wraps onto its own
                line — at 390px each of these panels is only ~140px wide. */}
            <dd className="ml-auto text-xs font-medium text-zinc-50 tabular-nums" style={DISPLAY}>
              {won(item.amount)}
            </dd>
          </div>
        ))}
      </dl>

      <p className="mt-3 text-xs leading-relaxed font-normal text-zinc-400">{note}</p>
    </section>
  );
}

/** Third panel of the readout row: what the two amounts buy, and the two ways out of the page.
 *  Sits beside the figures rather than under the controls so the reader can act without ever
 *  touching a control — the defaults are a real quote, not a placeholder. */
function DecidePanel({ quote }: { quote: Quote }) {
  const { tier } = quote;

  return (
    <section
      aria-labelledby="recommended"
      className="flex min-w-0 animate-[rise_0.45s_ease-out_both] flex-col rounded-2xl border border-amber-400/40 bg-zinc-900 p-4 motion-reduce:animate-none sm:p-5"
    >
      <h2 id="recommended" className="flex items-center gap-1.5 text-xs font-medium tracking-[0.16em] text-zinc-400 uppercase">
        <Check className="h-3.5 w-3.5 flex-none" aria-hidden="true" />
        Recommended plan
      </h2>

      <p className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <span className="text-2xl font-semibold tracking-tight text-zinc-50" style={DISPLAY}>
          {tier.name}
        </span>
        <span className="text-xs font-normal text-zinc-400 tabular-nums">{won(tier.perTerminal)} per terminal / month</span>
      </p>

      <p className="mt-2 text-xs leading-relaxed font-normal text-zinc-400">
        <span className="font-medium text-zinc-50">{tier.terminal.model}</span> — {tier.terminal.form}. {hardwareNote(quote)}.
      </p>

      <div className="mt-4 flex flex-col gap-2 sm:mt-auto sm:pt-4">
        <button
          type="button"
          className={cx(
            "flex w-full items-center justify-center gap-2 rounded-xl bg-amber-400 px-4 py-3 text-sm font-medium text-zinc-950 transition-colors hover:bg-amber-300",
            FOCUS,
          )}
        >
          <span className="tabular-nums">Start setup — {won(quote.dueToday)} today</span>
          <ArrowRight className="h-4 w-4 flex-none" aria-hidden="true" />
        </button>
        <button
          type="button"
          className={cx(
            "flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-600 px-4 py-2.5 text-sm font-medium text-zinc-50 transition-colors hover:bg-zinc-800",
            FOCUS,
          )}
        >
          <Phone className="h-4 w-4 flex-none" aria-hidden="true" />
          Book a 20-minute walkthrough
        </button>
        <p className="text-xs leading-relaxed font-normal text-zinc-400 tabular-nums">{rolloutNote(quote)}</p>
      </div>
    </section>
  );
}
