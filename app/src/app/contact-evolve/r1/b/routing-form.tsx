"use client";

import { useId, useState } from "react";
import { Check, Send, Users } from "lucide-react";
import {
  FOCUS_RING,
  TOPICS,
  assignDesk,
  clock,
  dayLabel,
  duration,
  mod,
  ticketRef,
  topicOutcome,
  type SendContext,
} from "./data";

type Receipt = {
  reference: string;
  owner: string;
  deskName: string;
  deskCity: string;
  waitMin: number;
  totalMin: number;
  replyAbsLocal: number;
};

type Errors = { email?: string; extra?: string; message?: string };

const EMAIL_SHAPE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const FIELD =
  "w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm font-normal text-zinc-50 placeholder:text-zinc-400";

/**
 * The form, and the only part of the page that is subordinate to it: the routing panel above the
 * fields.
 *
 * Picking a subject does not merely tag the message — it names the person who will read it, and
 * then runs that person's desk against the hour chosen higher up the page. So the same control that
 * moves the coverage strip also moves the sentence telling you when Dara or Kenji will see this.
 * When their desk is shut but another one is on shift, the panel says so and names the alternative
 * rather than leaving the reader to work it out from the strip.
 *
 * The receipt is a snapshot taken at submit, not a live view: nudging the hour afterwards must not
 * silently rewrite a promise that has already been made.
 */
export default function RoutingForm({ ctx, sendHour }: { ctx: SendContext; sendHour: number }) {
  const [topicId, setTopicId] = useState(TOPICS[0].id);
  const [email, setEmail] = useState("");
  const [extra, setExtra] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [receipt, setReceipt] = useState<Receipt | null>(null);

  const topicFieldId = useId();
  const emailId = useId();
  const extraId = useId();
  const messageId = useId();

  const topic = TOPICS.find((t) => t.id === topicId) ?? TOPICS[0];
  const outcome = topicOutcome(topic, ctx);
  const onShift = assignDesk(ctx.sendUtcMin);
  const soonerDeskAvailable =
    outcome.waitMin > 0 && onShift.waitMin === 0 && onShift.desk.id !== outcome.desk.id;
  const firstName = topic.owner.split(" ")[0];

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next: Errors = {};
    if (!EMAIL_SHAPE.test(email.trim())) {
      next.email = "Enter an address we can reply to, in the form you@company.com.";
    }
    if (topic.extraField && extra.trim().length === 0) {
      next.extra = `${topic.extraField.label} is needed before this reaches ${firstName}.`;
    }
    if (message.trim().length < 12) {
      next.message = "A sentence at minimum. One word takes longer to answer, not less.";
    }
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    setReceipt({
      reference: ticketRef(topic, ctx, sendHour),
      owner: topic.owner,
      deskName: outcome.desk.name,
      deskCity: outcome.desk.city,
      waitMin: outcome.waitMin,
      totalMin: outcome.totalMin,
      replyAbsLocal: outcome.replyAbsLocal,
    });
  }

  function writeAnother() {
    setReceipt(null);
    setEmail("");
    setExtra("");
    setMessage("");
    setErrors({});
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
        <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-amber-300">
          <Users aria-hidden="true" className="h-4 w-4 flex-none" />
          Who reads this
        </h3>
        <p className="mt-4 text-xl font-semibold text-zinc-50" style={{ fontFamily: "var(--font-display-mono)" }}>
          {topic.owner}
        </p>
        <p className="mt-1 text-sm font-normal text-zinc-300">{topic.ownerRole}</p>
        <p className="mt-4 text-sm font-normal leading-relaxed text-zinc-300">
          {outcome.waitMin === 0
            ? `${outcome.desk.name} is on shift at ${clock(mod(ctx.sendAbsLocal, 1440))}, so this is read as it arrives.`
            : `${outcome.desk.name} is shut at ${clock(mod(ctx.sendAbsLocal, 1440))}. This sits ${duration(outcome.waitMin)} until ${outcome.desk.city} opens.`}
        </p>
        <p className="mt-4 border-t border-zinc-800 pt-4 text-sm font-normal text-zinc-300">
          First reply expected{" "}
          <span className="font-semibold tabular-nums text-amber-300" style={{ fontFamily: "var(--font-display-mono)" }}>
            {clock(mod(outcome.replyAbsLocal, 1440))} {dayLabel(outcome.replyAbsLocal, ctx.nowAbsLocal)}
          </span>{" "}
          <span className="tabular-nums text-zinc-400">
            ({ctx.zone.short}, about {duration(outcome.totalMin)} after you send)
          </span>
        </p>
        {soonerDeskAvailable && (
          <p className="mt-4 rounded-lg border border-amber-400/40 bg-amber-400/10 p-3 text-sm font-normal leading-relaxed text-zinc-100">
            Need it sooner? {onShift.desk.name} in {onShift.desk.city} is on shift now and can take a
            first pass through chat before {firstName} picks it up.
          </p>
        )}
        <p className="mt-4 text-xs font-normal leading-relaxed text-zinc-400">{topic.note}</p>
      </div>

      <div>
        {receipt ? (
          <div
            role="status"
            className="rounded-2xl border border-amber-400/50 bg-zinc-900 p-6 animate-[rise_220ms_ease-out] motion-reduce:animate-none"
          >
            <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-amber-300">
              <Check aria-hidden="true" className="h-4 w-4 flex-none" />
              Queued for a person
            </p>
            <p
              className="mt-4 text-2xl font-bold tabular-nums text-zinc-50"
              style={{ fontFamily: "var(--font-display-mono)" }}
            >
              {receipt.reference}
            </p>
            <p className="mt-3 text-sm font-normal leading-relaxed text-zinc-300">
              {receipt.owner} on the {receipt.deskName} owns it.{" "}
              {receipt.waitMin === 0
                ? `${receipt.deskCity} was on shift when you sent it.`
                : `It waits ${duration(receipt.waitMin)} for ${receipt.deskCity} to open.`}{" "}
              First reply expected{" "}
              <span className="font-semibold tabular-nums text-amber-300">
                {clock(mod(receipt.replyAbsLocal, 1440))}{" "}
                {dayLabel(receipt.replyAbsLocal, ctx.nowAbsLocal)}
              </span>{" "}
              in {ctx.zone.short}, about {duration(receipt.totalMin)} from sending.
            </p>
            <p className="mt-3 text-xs font-normal leading-relaxed text-zinc-400">
              A copy is on its way to {email.trim()}. Reply to that thread rather than opening a
              second one — a second one starts at the back of the same queue.
            </p>
            <button
              type="button"
              onClick={writeAnother}
              className={`mt-6 inline-flex items-center gap-2 rounded-full border border-zinc-600 px-4 py-2 text-sm font-semibold text-zinc-100 hover:border-amber-400 hover:text-amber-300 ${FOCUS_RING}`}
            >
              Write another
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate className="space-y-5">
            <div>
              <label htmlFor={topicFieldId} className="block text-sm font-semibold text-zinc-100">
                What is this about?
              </label>
              <select
                id={topicFieldId}
                value={topicId}
                onChange={(event) => setTopicId(event.target.value)}
                className={`mt-1.5 ${FIELD} ${FOCUS_RING}`}
              >
                {TOPICS.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
              <p className="mt-1.5 text-xs font-normal text-zinc-400">
                This picks the desk, not just a label. The panel on the left updates with it.
              </p>
            </div>

            <div>
              <label htmlFor={emailId} className="block text-sm font-semibold text-zinc-100">
                Your email <span className="font-normal text-zinc-400">(required)</span>
              </label>
              <input
                id={emailId}
                type="email"
                inputMode="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@company.com"
                aria-invalid={errors.email ? true : undefined}
                aria-describedby={errors.email ? `${emailId}-error` : undefined}
                className={`mt-1.5 ${FIELD} ${FOCUS_RING} ${errors.email ? "border-amber-400" : ""}`}
              />
              {errors.email && (
                <p id={`${emailId}-error`} role="alert" className="mt-1.5 text-xs font-semibold text-amber-300">
                  {errors.email}
                </p>
              )}
            </div>

            {topic.extraField && (
              <div>
                <label htmlFor={extraId} className="block text-sm font-semibold text-zinc-100">
                  {topic.extraField.label} <span className="font-normal text-zinc-400">(required)</span>
                </label>
                <input
                  id={extraId}
                  type="text"
                  value={extra}
                  onChange={(event) => setExtra(event.target.value)}
                  placeholder={topic.extraField.placeholder}
                  aria-invalid={errors.extra ? true : undefined}
                  aria-describedby={errors.extra ? `${extraId}-error` : `${extraId}-hint`}
                  className={`mt-1.5 ${FIELD} ${FOCUS_RING} ${errors.extra ? "border-amber-400" : ""}`}
                />
                {errors.extra ? (
                  <p id={`${extraId}-error`} role="alert" className="mt-1.5 text-xs font-semibold text-amber-300">
                    {errors.extra}
                  </p>
                ) : (
                  <p id={`${extraId}-hint`} className="mt-1.5 text-xs font-normal text-zinc-400">
                    {topic.extraField.hint}
                  </p>
                )}
              </div>
            )}

            <div>
              <label htmlFor={messageId} className="block text-sm font-semibold text-zinc-100">
                What happened <span className="font-normal text-zinc-400">(required)</span>
              </label>
              <textarea
                id={messageId}
                rows={5}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="What you expected, what you saw, and when it started."
                aria-invalid={errors.message ? true : undefined}
                aria-describedby={errors.message ? `${messageId}-error` : undefined}
                className={`mt-1.5 ${FIELD} ${FOCUS_RING} ${errors.message ? "border-amber-400" : ""}`}
              />
              {errors.message && (
                <p id={`${messageId}-error`} role="alert" className="mt-1.5 text-xs font-semibold text-amber-300">
                  {errors.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className={`inline-flex items-center gap-2 rounded-full bg-amber-400 px-5 py-2.5 text-sm font-semibold text-zinc-950 hover:bg-amber-300 ${FOCUS_RING}`}
            >
              <Send aria-hidden="true" className="h-4 w-4 flex-none" />
              Send to {firstName}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
