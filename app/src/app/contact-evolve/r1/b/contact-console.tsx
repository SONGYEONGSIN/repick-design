"use client";

import { useId, useMemo, useState } from "react";
import { Clock, Globe, Hourglass } from "lucide-react";
import CoverageRibbon from "./coverage-ribbon";
import ChannelTable from "./channel-table";
import RoutingForm from "./routing-form";
import {
  CHANNELS,
  DAY_NAMES,
  DEFAULT_ZONE_ID,
  DESKS,
  FOCUS_RING,
  REF_LABEL,
  REF_UTC_MIN,
  ZONES,
  assignDesk,
  buildSendContext,
  channelOutcome,
  clock,
  dayLabel,
  duration,
  isDeskOpen,
  minutesOfShiftLeft,
  minutesUntilOpen,
  mod,
} from "./data";

/**
 * Everything on this page that moves, and the two numbers that move it.
 *
 * The reader supplies a UTC offset and an hour; the fixed reference moment supplies the rest. State
 * lives here rather than in each widget because the coverage strip, the channel ranking and the
 * routing panel are three readings of the *same* calculation — splitting the state would let them
 * disagree, which on a page about response times is the one failure that matters.
 *
 * Nothing here gates the proof behind a click. The "on shift right now" band renders four real desk
 * states before any control is touched, and the controls below only move the page from "right now"
 * to "some other hour" — they never reveal what was hidden.
 */
export default function ContactConsole() {
  const [zoneId, setZoneId] = useState(DEFAULT_ZONE_ID);
  const [sendHour, setSendHour] = useState(14);

  const zoneFieldId = useId();
  const hourFieldId = useId();

  const ctx = useMemo(() => buildSendContext(zoneId, sendHour), [zoneId, sendHour]);
  const rows = useMemo(
    () => CHANNELS.map((channel) => ({ channel, outcome: channelOutcome(channel, ctx) })),
    [ctx],
  );

  const nowLocalMin = mod(ctx.nowAbsLocal, 1440);
  const nowLocalDay = DAY_NAMES[mod(Math.floor(ctx.nowAbsLocal / 1440), 7)];
  const nowHour = Math.floor(nowLocalMin / 60);
  const sendLocalMin = mod(ctx.sendAbsLocal, 1440);
  const sendPhrase = ctx.isNow
    ? `right now, ${clock(sendLocalMin)}`
    : `${clock(sendLocalMin)} ${ctx.isTomorrow ? "tomorrow" : "today"}`;

  const assigned = assignDesk(ctx.sendUtcMin);
  const fastest = rows.reduce(
    (best, row) => (row.outcome.totalMin < best.outcome.totalMin ? row : best),
    rows[0],
  );

  return (
    <div className="space-y-16 sm:space-y-20">
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-5 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 sm:p-6">
        <div className="min-w-0">
          <label
            htmlFor={zoneFieldId}
            className="flex items-center gap-2 text-sm font-semibold text-zinc-100"
          >
            <Globe aria-hidden="true" className="h-4 w-4 flex-none text-amber-300" />
            Show every time on this page in
          </label>
          <select
            id={zoneFieldId}
            value={zoneId}
            onChange={(event) => setZoneId(event.target.value)}
            className={`mt-2 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm font-normal text-zinc-50 sm:w-80 ${FOCUS_RING}`}
          >
            {ZONES.map((zone) => (
              <option key={zone.id} value={zone.id}>
                {zone.label}
              </option>
            ))}
          </select>
        </div>
        <p className="max-w-md text-sm font-normal leading-relaxed text-zinc-300">
          <Clock aria-hidden="true" className="mr-1.5 inline h-4 w-4 align-[-0.2em] text-amber-300" />
          It is{" "}
          <span className="font-semibold tabular-nums text-zinc-50" style={{ fontFamily: "var(--font-display-mono)" }}>
            {clock(nowLocalMin)} {nowLocalDay}
          </span>{" "}
          where you are, which is {REF_LABEL}. Every countdown below is measured from that one
          moment.
        </p>
      </div>

      <section aria-labelledby="now-heading">
        <h2 id="now-heading" className="text-2xl font-bold tracking-tight text-zinc-50 sm:text-3xl">
          On shift right now
        </h2>
        <p className="mt-3 max-w-2xl text-base font-normal leading-relaxed text-zinc-300">
          Four desks, three of them with hours. No click reveals this — it is what the page says when
          you arrive.
        </p>

        <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {DESKS.map((desk) => {
            const openNow = isDeskOpen(desk, REF_UTC_MIN);
            const shiftLeft = minutesOfShiftLeft(desk, REF_UTC_MIN);
            const untilOpen = minutesUntilOpen(desk, REF_UTC_MIN);
            const localOpen = clock(mod(desk.openUtc + ctx.offsetMin, 1440));
            const localClose = clock(mod(desk.closeUtc + ctx.offsetMin, 1440));

            return (
              <li
                key={desk.id}
                className="flex min-w-0 flex-col rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5"
              >
                <div className="flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className={
                      desk.alwaysOn
                        ? "h-2.5 w-2.5 flex-none rounded-full bg-amber-200"
                        : openNow
                          ? "h-2.5 w-2.5 flex-none rounded-full bg-amber-400 animate-pulse motion-reduce:animate-none"
                          : "h-2.5 w-2.5 flex-none rounded-full border border-zinc-500"
                    }
                  />
                  <span
                    className={`text-xs font-semibold uppercase tracking-wide ${
                      desk.alwaysOn ? "text-amber-200" : openNow ? "text-amber-300" : "text-zinc-400"
                    }`}
                  >
                    {desk.alwaysOn ? "Always on" : openNow ? "On shift" : "Closed"}
                  </span>
                </div>

                <h3 className="mt-3 text-lg font-semibold text-zinc-50">{desk.name}</h3>
                <p className="mt-0.5 text-sm font-normal text-zinc-300">
                  {desk.city} <span className="tabular-nums text-zinc-400">{desk.utcLabel}</span>
                </p>

                <p
                  className="mt-4 text-base font-semibold tabular-nums text-amber-300"
                  style={{ fontFamily: "var(--font-display-mono)" }}
                >
                  {desk.alwaysOn
                    ? "No open, no close"
                    : openNow
                      ? `Closes in ${duration(shiftLeft)}`
                      : `Opens in ${duration(untilOpen)}`}
                </p>
                <p className="mt-1 text-xs font-normal tabular-nums text-zinc-400">
                  {desk.alwaysOn
                    ? `${desk.roster} engineers paged in rotation`
                    : `${localOpen} to ${localClose} your time · ${desk.homeWindow}`}
                </p>

                <p className="mt-4 border-t border-zinc-800 pt-4 text-sm font-normal text-zinc-300">
                  {desk.roster} on the roster
                  <span className="text-zinc-400">{" · "}</span>
                  {desk.lead}
                </p>
                <p className="mt-1 text-xs font-normal text-zinc-400">{desk.languages}</p>
                <p className="mt-3 text-xs font-normal leading-relaxed text-zinc-300">{desk.note}</p>
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="plan-heading">
        <h2 id="plan-heading" className="text-2xl font-bold tracking-tight text-zinc-50 sm:text-3xl">
          Try another hour
        </h2>
        <p className="mt-3 max-w-2xl text-base font-normal leading-relaxed text-zinc-300">
          Most people are not writing at the moment they read this. Move the hour and every desk,
          every channel and the routing panel further down recompute against it.
        </p>

        <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 sm:p-6">
          <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
            <div className="min-w-0">
              <label
                htmlFor={hourFieldId}
                className="flex items-center gap-2 text-sm font-semibold text-zinc-100"
              >
                <Hourglass aria-hidden="true" className="h-4 w-4 flex-none text-amber-300" />
                If you write at
              </label>
              <p
                className="mt-2 text-4xl font-bold tabular-nums text-amber-300"
                style={{ fontFamily: "var(--font-display-mono)" }}
              >
                {clock(sendHour * 60)}
              </p>
              <p className="mt-1 text-xs font-normal tabular-nums text-zinc-400">
                {ctx.zone.short} · reads as {sendPhrase}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSendHour(nowHour)}
              disabled={ctx.isNow}
              className={`inline-flex items-center gap-2 rounded-full border border-zinc-600 px-4 py-2 text-sm font-semibold text-zinc-100 hover:border-amber-400 hover:text-amber-300 disabled:cursor-not-allowed disabled:border-zinc-800 disabled:text-zinc-400 disabled:hover:border-zinc-800 disabled:hover:text-zinc-400 ${FOCUS_RING}`}
            >
              <Clock aria-hidden="true" className="h-4 w-4 flex-none" />
              {ctx.isNow ? "Matched to right now" : "Match to right now"}
            </button>
          </div>

          <input
            id={hourFieldId}
            type="range"
            min={0}
            max={23}
            step={1}
            value={sendHour}
            onChange={(event) => setSendHour(Number(event.target.value))}
            aria-valuetext={`${clock(sendHour * 60)} ${ctx.isTomorrow ? "tomorrow" : "today"} in ${ctx.zone.short}`}
            className={`mt-6 w-full accent-amber-400 ${FOCUS_RING}`}
          />
          <div
            aria-hidden="true"
            className="mt-1 flex justify-between text-[11px] font-normal tabular-nums text-zinc-400"
          >
            <span>00</span>
            <span>06</span>
            <span>12</span>
            <span>18</span>
            <span>23</span>
          </div>

          <p
            aria-live="polite"
            className="mt-6 border-t border-zinc-800 pt-5 text-base font-normal leading-relaxed text-zinc-100"
          >
            Write {sendPhrase} and{" "}
            {assigned.waitMin === 0
              ? `the ${assigned.desk.name} in ${assigned.desk.city} is on shift, with ${duration(minutesOfShiftLeft(assigned.desk, ctx.sendUtcMin))} of the shift left.`
              : `no regional desk is on shift — ${assigned.desk.city} opens in ${duration(assigned.waitMin)}, and the Sev-1 bridge covers the seam.`}{" "}
            Soonest first reply:{" "}
            <span className="font-semibold text-amber-300">{fastest.channel.name}</span>, about{" "}
            <span className="tabular-nums">{duration(fastest.outcome.totalMin)}</span>, landing{" "}
            <span className="tabular-nums">
              {clock(mod(fastest.outcome.replyAbsLocal, 1440))}{" "}
              {dayLabel(fastest.outcome.replyAbsLocal, ctx.nowAbsLocal)}
            </span>
            .
          </p>
        </div>

        <div className="mt-10">
          <h3 className="text-lg font-semibold text-zinc-50">The day, desk by desk</h3>
          <div className="mt-5 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 sm:p-6">
            <CoverageRibbon ctx={ctx} />
          </div>
        </div>

        <div className="mt-10">
          <h3 className="text-lg font-semibold text-zinc-50">Channels, ranked for that hour</h3>
          <div className="mt-5 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 sm:p-6">
            <ChannelTable rows={rows} ctx={ctx} />
          </div>
        </div>
      </section>

      <section aria-labelledby="route-heading">
        <h2 id="route-heading" className="text-2xl font-bold tracking-tight text-zinc-50 sm:text-3xl">
          Send it to a named person
        </h2>
        <p className="mt-3 max-w-2xl text-base font-normal leading-relaxed text-zinc-300">
          The subject decides the desk, the desk decides the wait, and the hour you picked above
          decides the rest. You can see all three before you type a word.
        </p>
        <div className="mt-8">
          <RoutingForm ctx={ctx} sendHour={sendHour} />
        </div>
      </section>
    </div>
  );
}
