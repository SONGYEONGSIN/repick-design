"use client";

import { useId, useMemo, useState, type ReactNode } from "react";
import { Ban, Check, CircleCheck, Copy, Link2, TriangleAlert, Wrench } from "lucide-react";
import CodePane from "./code-pane";
import {
  API_KEY,
  DEFAULT_STATE,
  FOCUS_RING,
  LANES,
  LANG_META,
  PARAM_META,
  SERVICES,
  WEIGHT_MAX,
  WEIGHT_MIN,
  WEIGHT_STEP,
  buildQuote,
  groupDigits,
  money,
  rateRequest,
  rateResponse,
  shipmentRequest,
  shipmentResponse,
  webhookDelivery,
  webhookHandler,
  type ConsoleState,
  type Lang,
  type LaneId,
  type Line,
  type ParamId,
} from "./data";

/**
 * The highlight control's options: the four parameters, plus an explicit off switch.
 *
 * Derived from `PARAM_META` rather than retyped, so the gutter legend and this control can never
 * disagree about what a parameter is called. `null` is a real option rather than a "click the active
 * one again" gesture — a radio group has no way to express deselection, and hiding the off switch
 * would leave keyboard users unable to reach the untraced view at all.
 */
const TRACE_OPTIONS: { id: ParamId | null; label: string }[] = [
  ...PARAM_META.map(({ id, label }) => ({ id, label })),
  { id: null, label: "Off" },
];

/**
 * The transcript console.
 *
 * Three things hold this archetype together:
 *
 * 1. **The proof is the resting state.** On load the page is already showing a valid request and a
 *    valid response for a real lane. Nothing has to be clicked to learn what this API looks like;
 *    the controls change the answer rather than reveal it.
 * 2. **One edit moves both halves.** Every control recomputes the request lines *and* the response
 *    fields from the same integer arithmetic, so the relationship between input and output is
 *    demonstrated instead of described.
 * 3. **The calls are chained, not parallel.** `rate_id` in 02 is the identifier 01 returned, and the
 *    webhook in 03 carries the shipment 02 created. When a parameter combination is unserviceable,
 *    01 returns a genuine 422 and 02 and 03 report themselves unreachable — which is the honest
 *    consequence of a dependency, and doubles as the error tour.
 */
export default function Console() {
  const [state, setState] = useState<ConsoleState>(DEFAULT_STATE);
  const [lang, setLang] = useState<Lang>("curl");
  const [trace, setTrace] = useState<ParamId | null>("weight");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const laneFieldId = useId();
  const weightFieldId = useId();
  const insuranceFieldId = useId();

  /** Editing a parameter also traces it: the point of the edit is to see what it moved. */
  const update = (patch: Partial<ConsoleState>, source: ParamId) => {
    setState((previous) => ({ ...previous, ...patch }));
    setTrace(source);
    setCopiedId(null);
  };

  const copy = (id: string, text: string) => {
    navigator.clipboard?.writeText(text).catch(() => undefined);
    setCopiedId(id);
  };

  const quote = useMemo(() => buildQuote(state), [state]);

  const panes = useMemo(() => {
    const rateReq = rateRequest(lang, state);
    const rateRes = rateResponse(quote);
    if (!quote.ok) {
      return { rateReq, rateRes, shipReq: null, shipRes: null, hookIn: null, handler: null };
    }
    return {
      rateReq,
      rateRes,
      shipReq: shipmentRequest(lang, quote),
      shipRes: shipmentResponse(quote),
      hookIn: webhookDelivery(quote),
      handler: webhookHandler(lang),
    };
  }, [lang, state, quote]);

  const readout = useMemo(() => {
    if (trace === null) return "Highlighting is off — pick a parameter to follow it through all three calls.";
    const hits = (lines: Line[] | null) =>
      lines ? lines.filter((line) => line.d === trace || line.d === "sum").length : 0;
    const written = hits(panes.rateReq) + hits(panes.shipReq);
    const returned = hits(panes.rateRes) + hits(panes.shipRes) + hits(panes.hookIn);
    const label = PARAM_META.find((param) => param.id === trace)?.label ?? "";
    const plural = (count: number, noun: string) => `${count} ${noun}${count === 1 ? "" : "s"}`;
    return `${label} drives ${plural(written, "line")} you write and ${plural(returned, "field")} Bollard returns.`;
  }, [trace, panes]);

  const laneLabel = quote.lane.label;

  return (
    <>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-5 border-t border-zinc-800 pt-6">
          <div className="min-w-0">
            <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-400">
              Sandbox key, already live
            </span>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <code className="break-all font-mono text-sm font-normal text-zinc-100">{API_KEY}</code>
              <button
                type="button"
                onClick={() => copy("key", API_KEY)}
                className={`inline-flex items-center gap-1.5 rounded-md border border-zinc-700 px-2 py-1 text-xs font-semibold text-zinc-300 transition-colors hover:border-cyan-400 hover:text-cyan-300 motion-reduce:transition-none ${FOCUS_RING}`}
              >
                {copiedId === "key" ? (
                  <Check aria-hidden="true" className="h-3.5 w-3.5 flex-none text-cyan-300" />
                ) : (
                  <Copy aria-hidden="true" className="h-3.5 w-3.5 flex-none" />
                )}
                {copiedId === "key" ? "Copied" : "Copy"}
              </button>
            </div>
          </div>

          <fieldset className="min-w-0">
            <legend className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-400">
              Read it in
            </legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {LANG_META.map((option) => {
                const active = option.id === lang;
                return (
                  <label
                    key={option.id}
                    className={`cursor-pointer rounded-lg border px-3 py-2 text-sm transition-colors focus-within:ring-2 focus-within:ring-cyan-400 focus-within:ring-offset-2 focus-within:ring-offset-zinc-950 motion-reduce:transition-none ${
                      active
                        ? "border-cyan-400 bg-cyan-950 font-semibold text-cyan-100"
                        : "border-zinc-700 bg-zinc-900 font-normal text-zinc-300 hover:border-zinc-600"
                    }`}
                  >
                    <input
                      type="radio"
                      name="transcript-language"
                      value={option.id}
                      checked={active}
                      onChange={() => {
                        setLang(option.id);
                        setCopiedId(null);
                      }}
                      className="sr-only"
                    />
                    {option.label}
                    <span className="ml-2 font-normal text-zinc-400">{option.hint}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        </div>
      </div>

      {/* The control band. Sticky from lg up, where it costs ~120px and buys the whole point of the
          page: you can be looking at call 03 and still move the weight that produced it. Below lg it
          stays put, because a stacked band would eat a phone screen. */}
      <div className="z-20 mt-6 border-y border-zinc-800 bg-zinc-950 lg:sticky lg:top-0">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
          <div className="flex flex-wrap items-start gap-x-8 gap-y-4">
            <div className="min-w-0">
              <label
                htmlFor={laneFieldId}
                className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-400"
              >
                Lane
              </label>
              <select
                id={laneFieldId}
                value={state.lane}
                onChange={(event) => update({ lane: event.target.value as LaneId }, "lane")}
                className={`mt-2 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm font-normal text-zinc-100 sm:w-72 ${FOCUS_RING}`}
              >
                {LANES.map((lane) => (
                  <option key={lane.id} value={lane.id}>
                    {lane.label} · {lane.code}
                  </option>
                ))}
              </select>
            </div>

            <fieldset className="min-w-0">
              <legend className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-400">
                Service
              </legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {SERVICES.map((service) => {
                  const active = service.id === state.service;
                  return (
                    <label
                      key={service.id}
                      className={`cursor-pointer rounded-lg border px-3 py-2 text-sm transition-colors focus-within:ring-2 focus-within:ring-cyan-400 focus-within:ring-offset-2 focus-within:ring-offset-zinc-950 motion-reduce:transition-none ${
                        active
                          ? "border-cyan-400 bg-cyan-950 font-semibold text-cyan-100"
                          : "border-zinc-700 bg-zinc-900 font-normal text-zinc-300 hover:border-zinc-600"
                      }`}
                    >
                      <input
                        type="radio"
                        name="service-level"
                        value={service.id}
                        checked={active}
                        onChange={() => update({ service: service.id }, "service")}
                        className="sr-only"
                      />
                      {service.label}
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <div className="min-w-0">
              <label
                htmlFor={weightFieldId}
                className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-400"
              >
                Parcel weight
              </label>
              <div className="mt-2 flex items-center gap-3">
                <input
                  id={weightFieldId}
                  type="range"
                  min={WEIGHT_MIN}
                  max={WEIGHT_MAX}
                  step={WEIGHT_STEP}
                  value={state.weightG}
                  onChange={(event) => update({ weightG: Number(event.target.value) }, "weight")}
                  className={`h-2 w-40 accent-cyan-400 sm:w-48 ${FOCUS_RING}`}
                />
                <output
                  htmlFor={weightFieldId}
                  className="w-20 flex-none text-sm font-semibold tabular-nums text-cyan-300"
                >
                  {groupDigits(state.weightG)} g
                </output>
              </div>
            </div>

            <div className="min-w-0">
              <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-400">
                Insurance
              </span>
              <label
                htmlFor={insuranceFieldId}
                className={`mt-2 flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors focus-within:ring-2 focus-within:ring-cyan-400 focus-within:ring-offset-2 focus-within:ring-offset-zinc-950 motion-reduce:transition-none ${
                  state.insured
                    ? "border-cyan-400 bg-cyan-950 font-semibold text-cyan-100"
                    : "border-zinc-700 bg-zinc-900 font-normal text-zinc-300"
                }`}
              >
                <input
                  id={insuranceFieldId}
                  type="checkbox"
                  checked={state.insured}
                  onChange={(event) => update({ insured: event.target.checked }, "insurance")}
                  className="h-4 w-4 flex-none accent-cyan-400"
                />
                Declare <span className="tabular-nums">$420.00</span>
              </label>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-zinc-800 pt-3">
            <fieldset className="min-w-0">
              <legend className="sr-only">Highlight what a parameter drives</legend>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-400">
                  Highlight
                </span>
                {TRACE_OPTIONS.map((option) => {
                  const active = option.id === trace;
                  return (
                    <label
                      key={option.label}
                      className={`cursor-pointer rounded-md border px-2.5 py-1 text-xs transition-colors focus-within:ring-2 focus-within:ring-cyan-400 focus-within:ring-offset-2 focus-within:ring-offset-zinc-950 motion-reduce:transition-none ${
                        active
                          ? "border-cyan-400 bg-cyan-950 font-semibold text-cyan-100"
                          : "border-zinc-700 font-normal text-zinc-300 hover:border-zinc-600"
                      }`}
                    >
                      <input
                        type="radio"
                        name="trace-parameter"
                        checked={active}
                        onChange={() => setTrace(option.id)}
                        className="sr-only"
                      />
                      {option.label}
                    </label>
                  );
                })}
              </div>
            </fieldset>
            <p aria-live="polite" className="min-w-0 text-sm font-normal text-zinc-300">
              {readout}
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-14 sm:px-6 sm:pb-16">
        <p className="mt-5 text-xs font-normal leading-relaxed text-zinc-400">
          Gutter tags: <span className="font-mono text-zinc-300">LNE</span> lane ·{" "}
          <span className="font-mono text-zinc-300">WGT</span> weight ·{" "}
          <span className="font-mono text-zinc-300">SVC</span> service ·{" "}
          <span className="font-mono text-zinc-300">INS</span> insurance ·{" "}
          <span className="font-mono text-zinc-300">SUM</span> every parameter at once ·{" "}
          <span className="font-mono text-cyan-300">CHN</span> a value carried over from an earlier call.
        </p>

        <Cell
          index="01"
          method="POST"
          path="/v1/rates"
          title="Price the parcel"
          blurb={`One lane, one parcel, one service. ${laneLabel} at the weight you set on the left.`}
        >
          <CodePane
            label={`Request · ${LANG_META.find((option) => option.id === lang)?.label ?? ""}`}
            direction="out"
            lines={panes.rateReq}
            trace={trace}
            copyId="rate-request"
            copiedId={copiedId}
            onCopy={copy}
          />
          <CodePane
            label="Response"
            direction="in"
            lines={panes.rateRes}
            trace={trace}
            copyId="rate-response"
            copiedId={copiedId}
            onCopy={copy}
            tone={quote.ok ? "ok" : "error"}
            meta={
              quote.ok ? (
                <StatusChip tone="ok" code="200 OK" note="sandbox p50 41 ms" />
              ) : (
                <StatusChip tone="error" code="422 Unprocessable" note={quote.code} />
              )
            }
          />
        </Cell>

        {quote.ok ? (
          <p className="mt-3 text-sm font-normal leading-relaxed text-zinc-400">
            Total <span className="font-semibold tabular-nums text-zinc-100">{money(quote.total)}</span> for{" "}
            <span className="tabular-nums text-zinc-100">{groupDigits(quote.billableG)} g</span> billable on{" "}
            {quote.lane.carrier}, landing in{" "}
            <span className="tabular-nums text-zinc-100">{quote.transitDays}</span> business days. Weight is
            billed in half-kilo steps, which is why the response echoes a rounded{" "}
            <code className="font-mono text-zinc-300">billable_weight_g</code> rather than yours.
          </p>
        ) : (
          <div className="mt-3 rounded-xl border border-rose-400/50 bg-rose-950/30 p-4">
            <p className="flex items-start gap-2 text-sm font-semibold text-rose-200">
              <TriangleAlert aria-hidden="true" className="mt-0.5 h-4 w-4 flex-none" />
              {quote.message}
            </p>
            <p className="mt-2 text-sm font-normal leading-relaxed text-zinc-300">{quote.fix.explain}</p>
            <button
              type="button"
              onClick={() =>
                update(quote.fix.patch, quote.code === "service_not_on_lane" ? "service" : "weight")
              }
              className={`mt-3 inline-flex items-center gap-2 rounded-lg bg-cyan-400 px-3 py-2 text-sm font-semibold text-zinc-950 transition-colors hover:bg-cyan-300 motion-reduce:transition-none ${FOCUS_RING}`}
            >
              <Wrench aria-hidden="true" className="h-4 w-4 flex-none" />
              {quote.fix.label}
            </button>
          </div>
        )}

        <Cell
          index="02"
          method="POST"
          path="/v1/shipments"
          title="Buy the rate, queue the label"
          blurb="The only thing this call needs from the last one is its identifier."
        >
          {panes.shipReq && panes.shipRes && quote.ok ? (
            <>
              <CodePane
                label={`Request · ${LANG_META.find((option) => option.id === lang)?.label ?? ""}`}
                direction="out"
                lines={panes.shipReq}
                trace={trace}
                copyId="ship-request"
                copiedId={copiedId}
                onCopy={copy}
              />
              <CodePane
                label="Response"
                direction="in"
                lines={panes.shipRes}
                trace={trace}
                copyId="ship-response"
                copiedId={copiedId}
                onCopy={copy}
                meta={<StatusChip tone="ok" code="201 Created" note="sandbox p50 63 ms" />}
              />
            </>
          ) : (
            <Blocked reason="No rate exists to buy — 01 returned 422, so there is no rate_id for this body." />
          )}
        </Cell>

        {quote.ok ? (
          <p className="mt-3 flex flex-wrap items-center gap-2 text-sm font-normal leading-relaxed text-zinc-400">
            <Link2 aria-hidden="true" className="h-4 w-4 flex-none text-cyan-400" />
            <span className="min-w-0">
              <code className="font-mono text-cyan-300">{quote.rateId}</code> is the identifier 01 returned.
              It is the only thing linking these two calls — there is no session, no cart, no server-side
              draft.
            </span>
          </p>
        ) : null}

        <Cell
          index="03"
          method="POST"
          path="https://api.yourapp.com/hooks/bollard"
          title="Take delivery of the label"
          blurb="This is the one message you do not send. It arrives when the carrier returns the label."
        >
          {panes.hookIn && panes.handler ? (
            <>
              <CodePane
                label="Delivered to your endpoint"
                direction="in"
                lines={panes.hookIn}
                trace={trace}
                copyId="hook-delivery"
                copiedId={copiedId}
                onCopy={copy}
                meta={<StatusChip tone="ok" code="signed" note="HMAC-SHA256" />}
              />
              <CodePane
                label={`Your handler · ${LANG_META.find((option) => option.id === lang)?.label ?? ""}`}
                direction="out"
                lines={panes.handler}
                trace={trace}
                copyId="hook-handler"
                copiedId={copiedId}
                onCopy={copy}
              />
            </>
          ) : (
            <Blocked reason="Nothing was booked, so nothing will be delivered. Fix 01 and this call comes back." />
          )}
        </Cell>
      </div>
    </>
  );
}

function StatusChip({ tone, code, note }: { tone: "ok" | "error"; code: string; note: string }) {
  const Icon = tone === "ok" ? CircleCheck : TriangleAlert;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-semibold tabular-nums ${
        tone === "ok" ? "border-cyan-400/40 text-cyan-300" : "border-rose-400/50 text-rose-200"
      }`}
    >
      <Icon aria-hidden="true" className="h-3.5 w-3.5 flex-none" />
      {code}
      <span className="font-normal text-zinc-400">{note}</span>
    </span>
  );
}

function Blocked({ reason }: { reason: string }) {
  return (
    <div className="rounded-xl border border-dashed border-zinc-700 bg-zinc-900/40 p-5 lg:col-span-2">
      <p className="flex items-start gap-2 text-sm font-semibold text-zinc-100">
        <Ban aria-hidden="true" className="mt-0.5 h-4 w-4 flex-none text-zinc-400" />
        Not reached
      </p>
      <p className="mt-2 text-sm font-normal leading-relaxed text-zinc-400">{reason}</p>
    </div>
  );
}

function Cell({
  index,
  method,
  path,
  title,
  blurb,
  children,
}: {
  index: string;
  method: string;
  path: string;
  title: string;
  blurb: string;
  children: ReactNode;
}) {
  return (
    <article className="mt-8 first:mt-6">
      {/* 이 절을 감싸는 헤딩은 페이지 h1(console-heading)이다. h3 로 두면 레벨을 건너뛴다. */}
      <h2 className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span
          className="text-xl font-bold tabular-nums text-cyan-400"
          style={{ fontFamily: "var(--font-display-mono)" }}
        >
          {index}
        </span>
        <span className="text-lg font-semibold tracking-tight text-zinc-100">{title}</span>
        <span className="min-w-0 font-mono text-xs font-normal text-zinc-400">
          <span className="text-cyan-300">{method}</span> {path}
        </span>
      </h2>
      <p className="mt-1.5 max-w-2xl text-sm font-normal leading-relaxed text-zinc-400">{blurb}</p>
      <div className="mt-4 grid gap-3 lg:grid-cols-2">{children}</div>
    </article>
  );
}
