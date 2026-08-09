"use client";

import { useId, useMemo, useState } from "react";
import {
  Activity,
  ArrowUpRight,
  Briefcase,
  Building2,
  Check,
  Clock,
  Handshake,
  Info,
  Mail,
  Newspaper,
  Phone,
  type LucideIcon,
} from "lucide-react";
import RoutingForm from "./routing-form";
import {
  clockLabel,
  DAYS,
  DEFAULT_DAY,
  DEFAULT_HOUR,
  DEFAULT_ZONE,
  DESKS,
  dispatch,
  durationLabel,
  FOCUS_RING,
  landsAt,
  relativeDayLabel,
  stampLabel,
  toUtcMinuteOfWeek,
  ZONES,
  type Desk,
} from "./data";

const DESK_ICONS: Record<Desk["icon"], LucideIcon> = {
  building: Building2,
  activity: Activity,
  handshake: Handshake,
  briefcase: Briefcase,
  newspaper: Newspaper,
};

const ALTERNATE_ICONS: Record<"link" | "phone" | "mail", LucideIcon> = {
  link: ArrowUpRight,
  phone: Phone,
  mail: Mail,
};

/**
 * The routing board. Three things are true of it at once, and that combination is the archetype:
 *
 * 1. Every desk's answer is on screen before anything is touched — name, owner, hours, direct
 *    address, and a reply-by time computed for all five simultaneously. Nothing about "where do I
 *    write and when do I hear back" hides behind a click.
 * 2. Choosing a desk does not reveal that proof, it *re-aims* it: the required fields, the owner
 *    brief, the wrong-desk redirect and the alternate routes all change, and the form appears as the
 *    consequence rather than the premise.
 * 3. The clock is an input, not a reading. The page never asks the device what time it is; the
 *    visitor states when they would send, and all five reply-by figures recompute together. Drag the
 *    hour past a desk's closing time and you watch that desk roll to the next morning while the
 *    24/7 desk does not move — which is the actual difference between the desks, made visible.
 */
export default function DispatchConsole() {
  const [deskId, setDeskId] = useState<Desk["id"]>("sales");
  const [day, setDay] = useState(DEFAULT_DAY);
  const [hour, setHour] = useState(DEFAULT_HOUR);
  const [zoneId, setZoneId] = useState(DEFAULT_ZONE);

  const dayId = useId();
  const hourId = useId();
  const zoneSelectId = useId();

  const zone = ZONES.find((candidate) => candidate.id === zoneId) ?? ZONES[0];

  const rows = useMemo(() => {
    const sendLocal = day * 1440 + hour * 60;
    const sendUtc = toUtcMinuteOfWeek(sendLocal, zone.offsetMinutes);
    return DESKS.map((desk) => {
      const result = dispatch(sendUtc, desk);
      return { desk, ...result, stamp: landsAt(sendLocal, result.waitMinutes) };
    });
  }, [day, hour, zone]);

  const active = rows.find((row) => row.desk.id === deskId) ?? rows[0];
  const desk = active.desk;
  const ActiveIcon = DESK_ICONS[desk.icon];
  const replySummary = `Reply by ${stampLabel(active.stamp)} in ${zone.short}, ${durationLabel(
    active.waitMinutes,
  )} after you send.`;

  return (
    <>
      <section aria-labelledby="board-heading" className="mx-auto max-w-6xl px-4 pb-4 sm:px-6">
        <h2 id="board-heading" className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
          Five desks. Five different clocks.
        </h2>
        <p className="mt-3 max-w-2xl text-base font-normal leading-relaxed text-zinc-700">
          Every reply-by time below is computed from the desk&rsquo;s published hours and the moment you say you&rsquo;d
          send. Nothing here reads your device clock, so the numbers are the same for you as for us.
        </p>

        {/* The clock: an input, not a reading. */}
        <div className="mt-8 rounded-2xl border border-zinc-300 bg-zinc-50 p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-600">If you sent it at</p>
          <div className="mt-4 grid gap-5 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.4fr)_minmax(0,1fr)] lg:items-end">
            <div className="min-w-0">
              <label htmlFor={dayId} className="block text-sm font-semibold text-zinc-900">
                Day
              </label>
              <select
                id={dayId}
                value={day}
                onChange={(event) => setDay(Number(event.target.value))}
                className={`mt-2 w-full rounded-lg border border-zinc-400 bg-white px-3 py-2.5 text-sm font-normal text-zinc-900 ${FOCUS_RING}`}
              >
                {DAYS.map((name, index) => (
                  <option key={name} value={index}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            <div className="min-w-0">
              <label htmlFor={hourId} className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="text-sm font-semibold text-zinc-900">Hour, your time</span>
                <span className="text-sm font-bold tabular-nums text-emerald-800">{clockLabel(hour, 0)}</span>
              </label>
              <input
                id={hourId}
                type="range"
                min={0}
                max={23}
                step={1}
                value={hour}
                aria-valuetext={`${clockLabel(hour, 0)} in ${zone.short}`}
                onChange={(event) => setHour(Number(event.target.value))}
                className={`mt-3 w-full accent-emerald-700 ${FOCUS_RING}`}
              />
              <div className="mt-1 flex justify-between text-xs font-normal tabular-nums text-zinc-600">
                <span>00:00</span>
                <span>12:00</span>
                <span>23:00</span>
              </div>
            </div>

            <div className="min-w-0">
              <label htmlFor={zoneSelectId} className="block text-sm font-semibold text-zinc-900">
                Your time zone
              </label>
              <select
                id={zoneSelectId}
                value={zone.id}
                onChange={(event) => setZoneId(event.target.value)}
                className={`mt-2 w-full rounded-lg border border-zinc-400 bg-white px-3 py-2.5 text-sm font-normal text-zinc-900 ${FOCUS_RING}`}
              >
                {ZONES.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <p
            aria-live="polite"
            className="mt-5 border-t border-zinc-300 pt-4 text-sm font-normal leading-relaxed text-zinc-800"
          >
            Sent <span className="font-semibold tabular-nums">{DAYS[day]} {clockLabel(hour, 0)}</span> in {zone.short},
            a message to <span className="font-semibold">{desk.name}</span> is answered by{" "}
            <span className="font-semibold tabular-nums">{stampLabel(active.stamp)}</span> —{" "}
            <span className="tabular-nums">{durationLabel(active.waitMinutes)}</span> later.
          </p>
        </div>

        {/* The board itself. Radios, so a keyboard gets arrow-key traversal for free. */}
        <fieldset className="mt-6">
          <legend className="sr-only">Choose the desk that should handle your message</legend>
          <ul className="space-y-3">
            {rows.map(({ desk: row, waitMinutes, queueMinutes, stamp }) => {
              const selected = row.id === desk.id;
              const RowIcon = DESK_ICONS[row.icon];
              return (
                <li
                  key={row.id}
                  className={`grid gap-4 rounded-2xl border p-4 transition-colors duration-150 motion-reduce:transition-none sm:p-5 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)_minmax(0,1.05fr)] lg:items-start ${
                    selected ? "border-emerald-700 bg-emerald-50" : "border-zinc-300 bg-white hover:border-zinc-500"
                  }`}
                >
                  <label htmlFor={`desk-${row.id}`} className="flex min-w-0 cursor-pointer items-start gap-3">
                    <input
                      id={`desk-${row.id}`}
                      type="radio"
                      name="dispatch-desk"
                      value={row.id}
                      checked={selected}
                      onChange={() => setDeskId(row.id)}
                      className={`mt-1 h-4 w-4 flex-none accent-emerald-700 ${FOCUS_RING}`}
                    />
                    <span className="min-w-0">
                      <span className="flex items-center gap-2 text-base font-semibold text-zinc-900">
                        <RowIcon aria-hidden="true" className="h-4 w-4 flex-none text-emerald-800" />
                        {row.name}
                      </span>
                      <span className="mt-1 block text-sm font-normal leading-relaxed text-zinc-700">
                        {row.belongsHere}
                      </span>
                      {selected && (
                        <span className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800">
                          <Check aria-hidden="true" className="h-3.5 w-3.5 flex-none" />
                          Selected — brief and form below
                        </span>
                      )}
                    </span>
                  </label>

                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wide text-zinc-600">Desk hours</p>
                    <p className="mt-1 text-sm font-normal leading-relaxed text-zinc-800">{row.coverageLabel}</p>
                    <p className="mt-2 text-sm font-normal text-zinc-700">
                      {row.owner} · {row.ownerRole}
                    </p>
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wide text-zinc-600">Reply by</p>
                    <p className="mt-1 text-2xl font-bold tabular-nums tracking-tight text-zinc-900">
                      {stampLabel(stamp)}
                    </p>
                    <p className="mt-1 text-sm font-normal tabular-nums text-zinc-700">
                      {durationLabel(waitMinutes)} later · {relativeDayLabel(stamp.daysAhead)}
                    </p>
                    <p className="mt-1.5 flex items-start gap-1.5 text-xs font-normal leading-relaxed text-zinc-700">
                      <Clock aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 flex-none" />
                      {queueMinutes > 0
                        ? `Shut when you send — the clock starts ${durationLabel(queueMinutes)} later`
                        : `Open when you send — ${row.slaLabel}`}
                    </p>
                    <a
                      href={`mailto:${row.email}`}
                      className={`mt-2.5 inline-flex items-center gap-1.5 break-all rounded text-sm font-semibold text-emerald-800 underline underline-offset-2 hover:text-emerald-900 ${FOCUS_RING}`}
                    >
                      <Mail aria-hidden="true" className="h-3.5 w-3.5 flex-none" />
                      {row.email}
                    </a>
                  </div>
                </li>
              );
            })}
          </ul>
        </fieldset>
      </section>

      <section aria-labelledby="brief-heading" className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
        <h2 id="brief-heading" className="flex flex-wrap items-center gap-2.5 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
          <ActiveIcon aria-hidden="true" className="h-6 w-6 flex-none text-emerald-800" />
          Writing to {desk.name}
        </h2>
        <p className="mt-3 max-w-2xl text-base font-normal leading-relaxed text-zinc-700">{replySummary}</p>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-10">
          <div className="min-w-0 space-y-6">
            <div className="rounded-2xl border border-zinc-300 bg-zinc-50 p-5 sm:p-6">
              <h3 className="text-base font-semibold text-zinc-900">{desk.owner}</h3>
              <p className="mt-0.5 text-sm font-normal text-zinc-700">{desk.ownerRole}</p>
              <p className="mt-3 text-sm font-normal leading-relaxed text-zinc-700">{desk.ownerNote}</p>
              <p className="mt-4 border-t border-zinc-300 pt-4 text-sm font-normal leading-relaxed text-zinc-800">
                <span className="font-semibold">{desk.coverageLabel}</span>, answering {desk.slaLabel}.
              </p>
            </div>

            <div>
              <h3 className="text-base font-semibold text-zinc-900">What this desk needs from you</h3>
              <ul className="mt-3 space-y-2">
                {desk.fields
                  .filter((field) => field.required)
                  .map((field) => (
                    <li key={field.name} className="flex items-start gap-2.5">
                      <Check aria-hidden="true" className="mt-0.5 h-4 w-4 flex-none text-emerald-800" />
                      <span className="min-w-0 text-sm font-normal leading-relaxed text-zinc-800">{field.label}</span>
                    </li>
                  ))}
              </ul>
            </div>

            <p className="flex items-start gap-2.5 rounded-xl border border-zinc-300 bg-white p-4 text-sm font-normal leading-relaxed text-zinc-800">
              <Info aria-hidden="true" className="mt-0.5 h-4 w-4 flex-none text-zinc-700" />
              {desk.wrongDesk}
            </p>

            <div>
              <h3 className="text-base font-semibold text-zinc-900">Routes around this form</h3>
              <ul className="mt-3 space-y-3">
                {desk.alternates.map((alternate) => {
                  const AlternateIcon = ALTERNATE_ICONS[alternate.kind];
                  return (
                    <li key={alternate.href} className="min-w-0">
                      <a
                        href={alternate.href}
                        className={`inline-flex items-center gap-1.5 break-words rounded text-sm font-semibold text-emerald-800 underline underline-offset-2 hover:text-emerald-900 ${FOCUS_RING}`}
                      >
                        <AlternateIcon aria-hidden="true" className="h-4 w-4 flex-none" />
                        {alternate.label}
                      </a>
                      <p className="mt-1 text-sm font-normal leading-relaxed text-zinc-700">{alternate.detail}</p>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <div className="min-w-0">
            <RoutingForm key={desk.id} desk={desk} replySummary={replySummary} />
          </div>
        </div>
      </section>
    </>
  );
}
