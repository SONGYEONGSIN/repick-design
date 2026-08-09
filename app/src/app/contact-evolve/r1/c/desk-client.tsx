"use client";

import { useId, useMemo, useState } from "react";
import { ArrowRight, Check, Copy, Mail, Search, X } from "lucide-react";
import {
  CHIPS,
  DAY_NAMES,
  DEFAULT_DAY,
  DEFAULT_HOUR,
  DESKS,
  FOCUS_RING,
  QUARTER,
  RESOLUTIONS,
  TOP_IDS,
  deskById,
  draftFor,
  estimateReply,
  fallbackDesk,
  formatClock,
  formatDuration,
  mailtoFor,
  rank,
  type DeskId,
  type Resolution,
  type Route,
} from "./data";
import { DeskCard, RouteBadge, routeNote } from "./pieces";

type Outcome = "open" | "resolved" | "escalated";

const TOP_THREE: Resolution[] = TOP_IDS.map((id) => RESOLUTIONS.find((r) => r.id === id)).filter(
  (r): r is Resolution => r !== undefined,
);

/**
 * The whole interactive surface of the page, held in one component because the two halves share
 * state: the send-time you pick for the desk board is the same send-time the handoff slip quotes
 * back at you. Four wired interactions — triage query (plus symptom chips), the resolve/escalate
 * decision, the send-time simulator, and copying the prepared message.
 *
 * Deflection-first, but nothing is hidden behind it: the four desk addresses render below at the
 * default zero-interaction state, the escalation path is always one click, and a query that matches
 * nothing skips the deflection step entirely and opens the handoff by itself.
 */
export default function DeskClient() {
  const [query, setQuery] = useState("");
  const [outcome, setOutcome] = useState<Outcome>("open");
  const [deskOverride, setDeskOverride] = useState<DeskId | null>(null);
  const [sendDay, setSendDay] = useState(DEFAULT_DAY);
  const [sendHour, setSendHour] = useState(DEFAULT_HOUR);
  const [copyState, setCopyState] = useState<{ draft: string; ok: boolean } | null>(null);

  const searchId = useId();
  const dayId = useId();
  const hourId = useId();
  const targetId = useId();

  const trimmed = query.trim();
  const hasText = trimmed.length > 0;
  /** Three characters is where the corpus can say anything useful; below it the slip stays idle
   *  rather than flashing "nothing matches" at every keystroke of a word being typed. */
  const hasQuery = trimmed.length >= 3;

  const matches = useMemo(() => rank(query), [query]);
  const primary = hasQuery && matches.length > 0 ? matches[0].resolution : null;
  const secondary = hasQuery && matches.length > 1 ? matches[1].resolution : null;
  const noMatch = hasQuery && matches.length === 0;

  const route: Route = primary ? primary.route : "human";
  const routedDeskId = primary ? primary.deskId : fallbackDesk(query);
  const desk = deskById(deskOverride ?? routedDeskId);

  const showHandoff = noMatch || outcome === "escalated";
  const draft = useMemo(() => draftFor(desk, query, primary), [desk, query, primary]);
  const estimate = estimateReply(desk, sendDay, sendHour);
  const dayWord = estimate.dayOffset === 0 ? "the same day" : estimate.dayOffset === 1 ? "the next day" : `in ${estimate.dayOffset} days`;

  function updateQuery(next: string) {
    setQuery(next);
    setOutcome("open");
    setDeskOverride(null);
  }

  function copyDraft() {
    navigator.clipboard.writeText(draft).then(
      () => setCopyState({ draft, ok: true }),
      () => setCopyState({ draft, ok: false }),
    );
  }

  /** Tied to the draft string itself, so editing the query silently retires a stale confirmation. */
  const copyMessage =
    copyState && copyState.draft === draft
      ? copyState.ok
        ? "Copied to your clipboard."
        : "Your browser blocked the clipboard — select the text above and copy it."
      : "";

  const slipKey = hasQuery ? primary?.id ?? "no-match" : "idle";

  return (
    <>
      {/* ------------------------------------------------ triage console */}
      <section aria-labelledby="triage-heading" className="border-t border-zinc-200 bg-zinc-50">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <h2 id="triage-heading" className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl" style={{ fontFamily: "var(--font-display-wide)" }}>
            Say what is happening
          </h2>
          <p className="mt-3 max-w-2xl text-base font-normal leading-relaxed text-zinc-700">
            One box. It checks the status page, the docs and the answers the desks have already
            written, and shows you the single best one. If none of them fit, it stops trying and hands
            you to a named desk with your words already in the message.
          </p>

          <div className="mt-7 max-w-3xl">
            <label htmlFor={searchId} className="block text-sm font-semibold text-zinc-900">
              What are you seeing?
            </label>
            <div className="relative mt-2">
              <Search aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-600" />
              <input
                id={searchId}
                type="search"
                value={query}
                onChange={(e) => updateQuery(e.target.value)}
                placeholder="webhooks are late, invoice looks wrong, 401 from the API…"
                className={`w-full rounded-xl border border-zinc-300 bg-white py-3.5 pl-11 pr-11 text-base font-normal text-zinc-900 placeholder:text-zinc-600 ${FOCUS_RING}`}
              />
              {hasText && (
                <button
                  type="button"
                  onClick={() => updateQuery("")}
                  className={`absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 ${FOCUS_RING}`}
                >
                  <X aria-hidden="true" className="h-4 w-4" />
                  <span className="sr-only">Clear what you typed</span>
                </button>
              )}
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-sm font-normal text-zinc-700">Common ones:</span>
              {CHIPS.map((chip) => (
                <button
                  key={chip.label}
                  type="button"
                  onClick={() => updateQuery(chip.query)}
                  className={`rounded-full border border-zinc-300 bg-white px-3 py-1.5 text-sm font-normal text-zinc-800 transition-colors duration-150 hover:border-rose-400 hover:text-rose-800 motion-reduce:transition-none ${FOCUS_RING}`}
                >
                  {chip.label}
                </button>
              ))}
            </div>

            <p className="mt-4 text-sm font-normal leading-relaxed text-zinc-700">
              Not in the mood to be triaged?{" "}
              <a href="#desks" className={`rounded font-semibold text-rose-800 underline underline-offset-2 ${FOCUS_RING}`}>
                Skip to the four addresses
              </a>
              . They are printed in full, nothing is gated behind this box.
            </p>
          </div>

          {/* ----------------------------------------------- routing slip */}
          <p aria-live="polite" className="mt-9 text-sm font-normal text-zinc-700">
            {hasQuery
              ? `Routed to ${desk.name} · median first reply ${formatDuration(desk.medianMinutes)}`
              : `Nothing typed. Last quarter ${QUARTER.selfResolved}% of visitors here never needed to write to us.`}
          </p>

          <div
            key={slipKey}
            className="mt-3 animate-[rise_240ms_ease-out] rounded-2xl border border-zinc-300 bg-white motion-reduce:animate-none"
          >
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-zinc-200 px-5 py-4 sm:px-6">
              <div className="min-w-0">
                <p className="text-xs font-normal uppercase tracking-wide text-zinc-600">Symptom</p>
                <p className="mt-1 break-words text-base font-semibold text-zinc-900">
                  {hasQuery ? trimmed : "Nothing yet"}
                </p>
              </div>
              {hasQuery && <RouteBadge route={route} />}
            </div>

            <div className="px-5 py-6 sm:px-6">
              {!hasQuery && (
                <div>
                  <h3 className="text-base font-semibold text-zinc-900">
                    The three that close the most messages before they are sent
                  </h3>
                  <p className="mt-1.5 text-sm font-normal leading-relaxed text-zinc-700">
                    Pick one to load it, or type above. Either way the desks below stay exactly where
                    they are.
                  </p>
                  <ul className="mt-4 grid gap-3 sm:grid-cols-3">
                    {TOP_THREE.map((item) => (
                      <li key={item.id} className="min-w-0">
                        <button
                          type="button"
                          onClick={() => updateQuery(item.keywords.slice(0, 3).join(" "))}
                          className={`flex h-full w-full flex-col items-start gap-2 rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-left transition-colors duration-150 hover:border-rose-300 hover:bg-rose-50 motion-reduce:transition-none ${FOCUS_RING}`}
                        >
                          <span className="text-sm font-semibold text-zinc-900">{item.title}</span>
                          <span className="text-xs font-normal tabular-nums text-zinc-700">
                            Closed it for {item.resolvedShare}% who tried
                          </span>
                          <span className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-rose-800">
                            Load this
                            <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {primary && (
                <div>
                  <h3 className="text-lg font-semibold tracking-tight text-zinc-900">{primary.title}</h3>
                  <p className="mt-1 text-sm font-normal text-zinc-700">{primary.source}</p>
                  <p className="mt-4 max-w-3xl text-base font-normal leading-relaxed text-zinc-800">{primary.lead}</p>
                  <ol className="mt-5 max-w-3xl space-y-3">
                    {primary.steps.map((step, i) => (
                      <li key={step} className="flex items-start gap-3">
                        <span className="mt-0.5 inline-flex h-6 w-6 flex-none items-center justify-center rounded-full bg-rose-100 text-xs font-bold tabular-nums text-rose-900">
                          {i + 1}
                        </span>
                        <span className="min-w-0 text-sm font-normal leading-relaxed text-zinc-800">{step}</span>
                      </li>
                    ))}
                  </ol>
                  <p className="mt-5 text-sm font-normal tabular-nums text-zinc-700">
                    {routeNote(route)} Reported as resolved by {primary.resolvedShare}% of the people
                    it was shown to.
                  </p>
                  {secondary && (
                    <p className="mt-3 text-sm font-normal text-zinc-700">
                      Close second:{" "}
                      <button
                        type="button"
                        onClick={() => updateQuery(secondary.keywords.slice(0, 3).join(" "))}
                        className={`rounded font-semibold text-rose-800 underline underline-offset-2 ${FOCUS_RING}`}
                      >
                        {secondary.title}
                      </button>
                    </p>
                  )}
                </div>
              )}

              {noMatch && (
                <div>
                  <h3 className="text-lg font-semibold tracking-tight text-zinc-900">
                    Nothing on file matches that
                  </h3>
                  <p className="mt-3 max-w-3xl text-base font-normal leading-relaxed text-zinc-800">
                    We are not going to make you read three articles that do not apply. This one goes
                    straight to a person — the message below is already addressed and already carries
                    what you typed.
                  </p>
                </div>
              )}
            </div>

            {/* -------------------------------------- resolve or escalate */}
            {primary && outcome === "open" && (
              <div className="flex flex-wrap items-center gap-3 border-t border-zinc-200 bg-zinc-50 px-5 py-4 sm:px-6">
                <p className="text-sm font-semibold text-zinc-900">Did that answer it?</p>
                <button
                  type="button"
                  onClick={() => setOutcome("resolved")}
                  className={`inline-flex items-center gap-1.5 rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-900 transition-colors duration-150 hover:border-zinc-400 motion-reduce:transition-none ${FOCUS_RING}`}
                >
                  <Check aria-hidden="true" className="h-4 w-4" />
                  Yes, that was it
                </button>
                <button
                  type="button"
                  onClick={() => setOutcome("escalated")}
                  className={`inline-flex items-center gap-1.5 rounded-full bg-rose-700 px-4 py-2 text-sm font-semibold text-white transition-colors duration-150 hover:bg-rose-800 motion-reduce:transition-none ${FOCUS_RING}`}
                >
                  No, put me through to a person
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </button>
              </div>
            )}

            {primary && outcome === "resolved" && (
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-zinc-200 bg-zinc-50 px-5 py-4 sm:px-6">
                <p className="text-sm font-normal text-zinc-800">
                  <span className="font-semibold text-zinc-900">Good — nothing else needed.</span> If it
                  comes back, {desk.name} owns it at {desk.email}.
                </p>
                <button
                  type="button"
                  onClick={() => setOutcome("escalated")}
                  className={`rounded text-sm font-semibold text-rose-800 underline underline-offset-2 ${FOCUS_RING}`}
                >
                  Actually, put me through
                </button>
              </div>
            )}

            {showHandoff && (
              <div
                key={`handoff-${desk.id}`}
                className="animate-[rise_240ms_ease-out] border-t border-zinc-200 bg-rose-50 px-5 py-6 sm:px-6 motion-reduce:animate-none"
              >
                <h3 className="text-base font-semibold text-zinc-900">Your message, ready to send</h3>

                <div className="mt-4 flex flex-wrap items-end gap-4">
                  <div className="w-full min-w-0 sm:w-auto">
                    <label htmlFor={targetId} className="block text-sm font-semibold text-zinc-900">
                      Going to
                    </label>
                    <select
                      id={targetId}
                      value={desk.id}
                      onChange={(e) => setDeskOverride(e.target.value as DeskId)}
                      className={`mt-1.5 w-full rounded-lg border border-zinc-300 bg-white py-2 pl-3 pr-8 text-sm font-normal text-zinc-900 sm:w-auto ${FOCUS_RING}`}
                    >
                      {DESKS.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name} — {d.email}
                        </option>
                      ))}
                    </select>
                  </div>
                  <p className="text-sm font-normal leading-relaxed text-zinc-800">
                    Sent {DAY_NAMES[sendDay]} at{" "}
                    <span className="tabular-nums">{formatClock(sendHour * 60)} UTC</span>, first reply{" "}
                    {dayWord} around{" "}
                    <span className="font-semibold tabular-nums text-zinc-900">
                      {formatClock(estimate.replyMinuteOfDay)} UTC
                    </span>
                    .
                  </p>
                </div>

                <div className="mt-4 rounded-xl border border-rose-200 bg-white p-4">
                  <p className="whitespace-pre-wrap break-words text-sm font-normal leading-relaxed text-zinc-800">
                    {draft}
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <a
                    href={mailtoFor(desk, query, primary)}
                    className={`inline-flex items-center gap-2 rounded-full bg-rose-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-150 hover:bg-rose-800 motion-reduce:transition-none ${FOCUS_RING}`}
                  >
                    <Mail aria-hidden="true" className="h-4 w-4" />
                    Open this in your email client
                  </a>
                  <button
                    type="button"
                    onClick={copyDraft}
                    className={`inline-flex items-center gap-2 rounded-full border border-zinc-300 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-900 transition-colors duration-150 hover:border-zinc-400 motion-reduce:transition-none ${FOCUS_RING}`}
                  >
                    <Copy aria-hidden="true" className="h-4 w-4" />
                    Copy the text
                  </button>
                  <span role="status" className="text-sm font-normal text-zinc-800">
                    {copyMessage}
                  </span>
                </div>

                <p className="mt-4 text-sm font-normal leading-relaxed text-zinc-800">
                  Or ignore all of this and write to{" "}
                  <a href={`mailto:${desk.email}`} className={`rounded font-semibold text-rose-800 underline underline-offset-2 ${FOCUS_RING}`}>
                    {desk.email}
                  </a>{" "}
                  in your own words. The draft is a convenience, never a requirement.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------- the desk board */}
      <section id="desks" aria-labelledby="desks-heading" className="border-t border-zinc-200">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <h2 id="desks-heading" className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl" style={{ fontFamily: "var(--font-display-wide)" }}>
            Four desks, four addresses, four sets of hours
          </h2>
          <p className="mt-3 max-w-2xl text-base font-normal leading-relaxed text-zinc-700">
            Published in full whether or not you use the box above. Every figure is the trailing
            twelve months, measured on first human reply — not on an autoresponder.
          </p>

          <div className="mt-7 rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
            <fieldset>
              <legend className="text-sm font-semibold text-zinc-900">
                Send it at this moment, and you hear back when?
              </legend>
              <p className="mt-1.5 text-sm font-normal leading-relaxed text-zinc-700">
                Pick a moment. Every card recalculates against that desk&rsquo;s real staffed window,
                counting only the minutes somebody is actually on it.
              </p>
              <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-end">
                <div className="min-w-0">
                  <label htmlFor={dayId} className="block text-sm font-semibold text-zinc-900">
                    Day
                  </label>
                  <select
                    id={dayId}
                    value={sendDay}
                    onChange={(e) => setSendDay(Number(e.target.value))}
                    className={`mt-1.5 w-full rounded-lg border border-zinc-300 bg-white py-2 pl-3 pr-8 text-sm font-normal text-zinc-900 sm:w-auto ${FOCUS_RING}`}
                  >
                    {DAY_NAMES.map((name, i) => (
                      <option key={name} value={i}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="min-w-0 flex-1">
                  <label htmlFor={hourId} className="block text-sm font-semibold text-zinc-900">
                    Hour, UTC —{" "}
                    <span className="tabular-nums text-rose-800">{formatClock(sendHour * 60)}</span>
                  </label>
                  <input
                    id={hourId}
                    type="range"
                    min={0}
                    max={23}
                    step={1}
                    value={sendHour}
                    aria-valuetext={`${formatClock(sendHour * 60)} UTC`}
                    onChange={(e) => setSendHour(Number(e.target.value))}
                    className={`mt-3 w-full accent-rose-700 ${FOCUS_RING}`}
                  />
                </div>
              </div>
            </fieldset>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {DESKS.map((d) => (
              <DeskCard
                key={d.id}
                desk={d}
                sendDay={sendDay}
                sendHour={sendHour}
                routed={hasQuery && d.id === desk.id}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
