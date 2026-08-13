"use client";

import { CalendarClock, Eye, EyeOff, Minus, Plus, Target } from "lucide-react";

import {
  CARDS,
  CATEGORY,
  GOALS,
  UI,
  UPCOMING,
  cardOf,
  dateShort,
  formatMoney,
  formatPct,
  formatPp,
  formatSigned,
  goalOf,
  goalPct,
  monthsLeft,
  round2,
  savedTotal,
  upcomingTotal,
  type CardId,
  type CategoryKey,
  type Lang,
  type Slice,
} from "./data";
import { CardMark, HATCH, PANEL, RING, SwatchDot, cx, isHatched, swatchTone } from "./ui";

/* ------------------------------------------------------------------ card */

export function CardPanel({
  lang,
  cardId,
  onCard,
  revealed,
  onReveal,
  outCents,
}: {
  lang: Lang;
  cardId: CardId;
  onCard: (id: CardId) => void;
  revealed: boolean;
  onReveal: () => void;
  outCents: number;
}) {
  const card = cardOf(cardId);
  const spent = Math.round(outCents * card.share);
  const sharePct = round2(card.share * 100);

  return (
    <section
      id="verdant-cards"
      aria-labelledby="verdant-cards-h"
      className={cx(PANEL, "scroll-mt-24 p-4 sm:p-5")}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 id="verdant-cards-h" className="text-sm font-semibold tracking-wide text-zinc-100">
          {UI.card[lang]}
        </h2>
        <div
          role="group"
          aria-label={UI.cardPick[lang]}
          className="flex overflow-hidden rounded-full border border-zinc-700"
        >
          {CARDS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onCard(item.id)}
              aria-pressed={item.id === cardId}
              className={cx(
                "min-h-11 px-3 text-xs motion-safe:transition-colors",
                item.id === cardId
                  ? "bg-lime-300 font-medium text-zinc-950"
                  : "text-zinc-400 hover:text-zinc-100",
                RING,
              )}
            >
              {item.label[lang]}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-3 rounded-2xl border border-zinc-700 bg-zinc-950 p-4">
        <div className="flex items-start justify-between gap-3">
          <CardMark />
          <span className="text-xs text-zinc-400">{card.kind[lang]}</span>
        </div>
        <p className="mt-5 text-xs text-zinc-400">{UI.linked[lang]}</p>
        <p
          className="mt-1 text-lg tracking-wide text-zinc-50 tabular-nums"
          style={{ fontFamily: "var(--font-display-mono)" }}
        >
          {revealed ? card.full : `···· ···· ···· ${card.last4}`}
        </p>
        <p className="mt-3 text-xs text-zinc-400 tabular-nums">
          {`${UI.expires[lang]} ${card.expiry}`}
        </p>
      </div>

      <button
        type="button"
        onClick={onReveal}
        aria-pressed={revealed}
        className={cx(
          "mt-3 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-zinc-700 text-sm text-zinc-100 motion-safe:transition-colors hover:bg-zinc-800",
          RING,
        )}
      >
        {revealed ? (
          <EyeOff className="size-4" aria-hidden="true" />
        ) : (
          <Eye className="size-4" aria-hidden="true" />
        )}
        {revealed ? UI.conceal[lang] : UI.reveal[lang]}
      </button>

      <dl className="mt-4">
        <div>
          <dt className="text-xs text-zinc-400">{UI.spentOnCard[lang]}</dt>
          <dd
            className="mt-1 text-2xl text-zinc-50 tabular-nums"
            style={{ fontFamily: "var(--font-display-grotesk)" }}
          >
            {formatMoney(spent)}
          </dd>
          <dd className="mt-2">
            <span
              aria-hidden="true"
              className="block h-2 w-full overflow-hidden rounded-full bg-zinc-800"
            >
              <span
                className="block h-full rounded-full bg-lime-300"
                style={{ width: `${sharePct}%` }}
              />
            </span>
            <span className="mt-1.5 block text-xs text-zinc-400 tabular-nums">
              {`${formatPct(sharePct)} ${UI.ofSpending[lang]}`}
            </span>
          </dd>
        </div>
      </dl>
    </section>
  );
}

/* ----------------------------------------------------------------- goals */

export function GoalsPanel({
  lang,
  netCents,
  periodLabel,
  goalId,
  onGoal,
}: {
  lang: Lang;
  netCents: number;
  periodLabel: string;
  goalId: string;
  onGoal: (id: string) => void;
}) {
  const chosen = goalOf(goalId);
  const gap = Math.max(chosen.targetCents - chosen.savedCents, 0);
  const left = monthsLeft(chosen);

  return (
    <section
      id="verdant-goals"
      aria-labelledby="verdant-goals-h"
      className={cx(PANEL, "scroll-mt-24 p-4 sm:p-5")}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 id="verdant-goals-h" className="text-sm font-semibold tracking-wide text-zinc-100">
          {UI.goals[lang]}
        </h2>
        <span className="rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-300">
          {periodLabel}
        </span>
      </div>

      <dl className="mt-3">
        <div>
          <dt className="text-xs text-zinc-400">{UI.saved[lang]}</dt>
          <dd
            className="mt-1 text-3xl text-zinc-50 tabular-nums"
            style={{ fontFamily: "var(--font-display-grotesk)" }}
          >
            {formatMoney(savedTotal())}
          </dd>
          <dd className="mt-2 flex flex-wrap items-center gap-2 text-xs text-zinc-400">
            <span
              className={cx(
                "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 tabular-nums",
                netCents >= 0
                  ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-400"
                  : "border-zinc-700 bg-zinc-800 text-zinc-200",
              )}
            >
              {formatSigned(netCents)}
            </span>
            <span>{`${UI.addedThis[lang]} · ${periodLabel}`}</span>
          </dd>
        </div>
      </dl>

      <div role="group" aria-label={UI.goalPick[lang]} className="mt-4 flex flex-col gap-2">
        {GOALS.map((goal) => {
          const pct = goalPct(goal);
          const on = goal.id === goalId;
          return (
            <button
              key={goal.id}
              type="button"
              onClick={() => onGoal(goal.id)}
              aria-pressed={on}
              className={cx(
                "rounded-xl border p-3 text-left motion-safe:transition-colors",
                on
                  ? "border-lime-300/60 bg-lime-300/5"
                  : "border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/40",
                RING,
              )}
            >
              <span className="flex items-start justify-between gap-2">
                <span className="min-w-0">
                  <span className="block truncate text-sm text-zinc-100">{goal.name[lang]}</span>
                  <span className="block truncate text-[11px] text-zinc-400">
                    {`${UI.target[lang]} ${formatMoney(goal.targetCents)}`}
                  </span>
                </span>
                <Target
                  className={cx("size-4 shrink-0", on ? "text-lime-300" : "text-zinc-400")}
                  aria-hidden="true"
                />
              </span>
              <span className="mt-2 block text-sm text-zinc-50 tabular-nums">
                {formatMoney(goal.savedCents)}
              </span>
              <span
                aria-hidden="true"
                className="mt-2 block h-2 w-full overflow-hidden rounded-full bg-zinc-800"
              >
                <span
                  className={cx(
                    "block h-full rounded-full",
                    goal.tone === "lime" ? "bg-lime-300" : "bg-emerald-400",
                  )}
                  style={{ width: `${round2(pct)}%` }}
                />
              </span>
              <span className="mt-1.5 block text-[11px] text-zinc-400 tabular-nums">
                {`${formatPct(pct)} ${UI.funded[lang]}`}
              </span>
            </button>
          );
        })}
      </div>

      <p className="mt-3 text-xs text-zinc-400 tabular-nums" aria-live="polite">
        {lang === "ko"
          ? `${chosen.name.ko}: 월 ${formatMoney(chosen.monthlyCents)}씩이면 ${left}${UI.months.ko} 뒤 도착, ${formatMoney(gap)} ${UI.toGo.ko}`
          : `${chosen.name.en}: ${formatMoney(chosen.monthlyCents)} ${UI.perMonth.en} gets there in ${left} ${UI.months.en}, ${formatMoney(gap)} ${UI.toGo.en}`}
      </p>
    </section>
  );
}

/* -------------------------------------------------------------- spending */

function polar(radius: number, degrees: number): { x: number; y: number } {
  const radians = (degrees * Math.PI) / 180;
  return {
    x: round2(80 + radius * Math.cos(radians)),
    y: round2(80 + radius * Math.sin(radians)),
  };
}

function arcPath(radius: number, from: number, to: number): string {
  const start = polar(radius, from);
  const end = polar(radius, to);
  const large = to - from > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${large} 1 ${end.x} ${end.y}`;
}

export function SpendingPanel({
  lang,
  slices,
  outCents,
  activeCat,
  onCat,
  showAllCats,
  onShowAllCats,
}: {
  lang: Lang;
  slices: readonly Slice[];
  outCents: number;
  activeCat: CategoryKey | null;
  onCat: (key: CategoryKey) => void;
  showAllCats: boolean;
  onShowAllCats: (next: boolean) => void;
}) {
  const total = outCents === 0 ? 1 : outCents;
  const chosen = slices.find((slice) => slice.key === activeCat) ?? null;
  const rising = [...slices].sort((a, b) => b.deltaPp - a.deltaPp)[0] ?? null;
  const listed = showAllCats ? slices : slices.slice(0, 4);

  const arcs = slices.map((slice, index) => {
    // Start angle is the sum of everything drawn before it, so nothing outside
    // this callback is mutated while rendering.
    let start = -90;
    for (let i = 0; i < index; i += 1) {
      start += ((slices[i]?.cents ?? 0) / total) * 360;
    }
    const sweep = (slice.cents / total) * 360;
    return {
      key: slice.key,
      from: start + 1.6,
      to: start + sweep - 1.6,
      swatch: slice.swatch,
      drawn: sweep > 3.2,
    };
  });

  return (
    <section
      id="verdant-spending"
      aria-labelledby="verdant-spending-h"
      className={cx(PANEL, "scroll-mt-24 p-4 sm:p-5")}
    >
      <h2 id="verdant-spending-h" className="text-sm font-semibold tracking-wide text-zinc-100">
        {UI.spending[lang]}
      </h2>

      <div className="relative mx-auto mt-4 size-56">
        <svg viewBox="0 0 160 160" className="size-56" aria-hidden="true" focusable="false">
          <defs>
            <pattern
              id="verdant-hatch-lime"
              patternUnits="userSpaceOnUse"
              width="6"
              height="6"
              patternTransform="rotate(45)"
              className="text-lime-300"
            >
              <rect width="6" height="6" className="fill-zinc-900" />
              <rect width="3" height="6" fill="currentColor" />
            </pattern>
            <pattern
              id="verdant-hatch-emerald"
              patternUnits="userSpaceOnUse"
              width="6"
              height="6"
              patternTransform="rotate(45)"
              className="text-emerald-400"
            >
              <rect width="6" height="6" className="fill-zinc-900" />
              <rect width="3" height="6" fill="currentColor" />
            </pattern>
          </defs>
          {arcs.map((arc) =>
            arc.drawn ? (
              <path
                key={arc.key}
                d={arcPath(62, arc.from, arc.to)}
                fill="none"
                stroke={
                  arc.swatch === "limeHatch"
                    ? "url(#verdant-hatch-lime)"
                    : arc.swatch === "emeraldHatch"
                      ? "url(#verdant-hatch-emerald)"
                      : "currentColor"
                }
                className={swatchTone(arc.swatch)}
                strokeWidth={activeCat === arc.key ? 28 : 20}
                strokeLinecap="butt"
              />
            ) : null,
          )}
        </svg>
        <span className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <span
            className="text-xl text-zinc-50 tabular-nums"
            style={{ fontFamily: "var(--font-display-grotesk)" }}
          >
            {formatMoney(chosen === null ? outCents : chosen.cents)}
          </span>
          <span className="mt-1 line-clamp-2 text-[11px] text-zinc-400">
            {chosen === null ? UI.totalSpent[lang] : chosen.label[lang]}
          </span>
        </span>
      </div>

      <ul className="mt-4 flex flex-col gap-1">
        {listed.map((slice) => {
          const on = slice.key === activeCat;
          return (
            <li key={slice.key}>
              <button
                type="button"
                onClick={() => onCat(slice.key)}
                aria-pressed={on}
                className={cx(
                  "flex min-h-11 w-full items-center gap-2.5 rounded-lg border px-2 text-left motion-safe:transition-colors",
                  on ? "border-lime-300/60 bg-lime-300/5" : "border-transparent hover:bg-zinc-800/60",
                  RING,
                )}
              >
                <SwatchDot swatch={slice.swatch} />
                <span className="min-w-0 flex-1 truncate text-sm text-zinc-100">
                  {slice.label[lang]}
                </span>
                <span className="shrink-0 text-xs text-zinc-400 tabular-nums">
                  {formatMoney(slice.cents)}
                </span>
                <span className="w-12 shrink-0 text-right text-xs text-zinc-100 tabular-nums">
                  {formatPct(slice.share)}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <button
        type="button"
        onClick={() => onShowAllCats(!showAllCats)}
        aria-expanded={showAllCats}
        className={cx(
          "mt-2 flex min-h-11 w-full items-center justify-between gap-2 rounded-xl border border-zinc-800 px-3 text-sm text-zinc-100 motion-safe:transition-colors hover:bg-zinc-800",
          RING,
        )}
      >
        {showAllCats ? UI.showTopCats[lang] : UI.showAllCats[lang]}
        {showAllCats ? (
          <Minus className="size-4 shrink-0 text-lime-300" aria-hidden="true" />
        ) : (
          <Plus className="size-4 shrink-0 text-lime-300" aria-hidden="true" />
        )}
      </button>

      {rising !== null ? (
        <p className="mt-3 text-xs text-zinc-400" aria-live="polite">
          <span
            aria-hidden="true"
            className={cx(
              "mr-2 inline-block size-2.5 rounded-[2px] align-middle",
              swatchTone(rising.swatch),
              isHatched(rising.swatch) ? "border border-current" : "bg-current",
            )}
            style={isHatched(rising.swatch) ? HATCH : undefined}
          />
          {`${rising.label[lang]} ${formatPp(rising.deltaPp)}${UI.vsPrevPp[lang]}`}
        </p>
      ) : null}
    </section>
  );
}

/* -------------------------------------------------------------- upcoming */

export function UpcomingPanel({ lang, netCents }: { lang: Lang; netCents: number }) {
  const due = upcomingTotal();
  const after = netCents - due;

  return (
    <section
      id="verdant-upcoming"
      aria-labelledby="verdant-upcoming-h"
      className={cx(PANEL, "scroll-mt-24 p-4 sm:p-5")}
    >
      <h2 id="verdant-upcoming-h" className="text-sm font-semibold tracking-wide text-zinc-100">
        {UI.upcoming[lang]}
      </h2>

      <ul className="mt-3 flex flex-col gap-2">
        {UPCOMING.map((item) => (
          <li
            key={item.id}
            className="flex items-center gap-3 rounded-xl border border-zinc-800 p-2.5"
          >
            <CalendarClock className="size-4 shrink-0 text-zinc-400" aria-hidden="true" />
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-sm text-zinc-100">{item.label[lang]}</span>
              <span className="truncate text-[11px] text-zinc-400 tabular-nums">
                {`${CATEGORY[item.cat][lang]} · ${dateShort(-item.inDays, lang)}`}
              </span>
            </span>
            <span className="shrink-0 text-sm text-zinc-100 tabular-nums">
              {formatMoney(item.cents)}
            </span>
          </li>
        ))}
      </ul>

      <dl className="mt-3 flex items-center justify-between gap-3 border-t border-zinc-800 pt-3">
        <div className="min-w-0">
          <dt className="text-xs text-zinc-400">{UI.afterThese[lang]}</dt>
          <dd
            className={cx(
              "mt-1 text-xl tabular-nums",
              after >= 0 ? "text-lime-300" : "text-zinc-100",
            )}
            style={{ fontFamily: "var(--font-display-grotesk)" }}
          >
            {formatSigned(after)}
          </dd>
        </div>
        <div className="shrink-0 text-right">
          <dt className="text-xs text-zinc-400">{UI.moneyOut[lang]}</dt>
          <dd className="mt-1 text-sm text-zinc-100 tabular-nums">{formatMoney(due)}</dd>
        </div>
      </dl>
    </section>
  );
}
