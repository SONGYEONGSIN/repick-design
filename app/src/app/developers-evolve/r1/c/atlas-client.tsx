"use client";

import { useState } from "react";
import { ArrowRight, ArrowUpRight, Check, Circle, Waypoints } from "lucide-react";
import {
  API,
  DEFAULT_ENDPOINT,
  DEFAULT_GOAL,
  DEFAULT_RESOURCE,
  EDGES,
  EDGE_KINDS,
  FOCUS_RING,
  GOALS,
  LANGS,
  LAYOUTS,
  RESOURCES,
  directionLabel,
  edgesTouching,
  endpointById,
  endpointsFor,
  nodePercent,
  otherEnd,
  resourceById,
  snippetFor,
  stepIndexFor,
  type Edge,
  type Goal,
  type Lang,
  type MapLayout,
  type ResourceId,
} from "./data";

/* ------------------------------------------------------------------ map layer */

type MapProps = {
  layout: MapLayout;
  className: string;
  nodeWidth: string;
  selected: ResourceId;
  goal: Goal;
  onSelect: (id: ResourceId) => void;
};

function edgeClass(edge: Edge, selected: ResourceId, goal: Goal): string {
  if (goal.edges.includes(edge.id)) return "stroke-emerald-400";
  if (edge.from === selected || edge.to === selected) return "stroke-zinc-300";
  return "stroke-zinc-600";
}

function edgeWidth(edge: Edge, selected: ResourceId, goal: Goal): number {
  if (goal.edges.includes(edge.id)) return 3.5;
  if (edge.from === selected || edge.to === selected) return 2.5;
  return 1.5;
}

/**
 * One coordinate set per breakpoint, each rendered as its own layer and hidden with `display:none`
 * at the other size — so the hidden layer is out of the tab order and out of the accessibility tree
 * rather than duplicated into it. The lines are `aria-hidden`: they are the picture of a topology
 * that is also stated in words, in the list below the map and in the "Edges from here" column of the
 * open record. Nothing here is reachable only by looking.
 */
function MapLayer({ layout, className, nodeWidth, selected, goal, onSelect }: MapProps) {
  return (
    <div className={className}>
      <svg
        aria-hidden="true"
        viewBox={`0 0 ${layout.w} ${layout.h}`}
        className="absolute inset-0 h-full w-full"
      >
        {EDGES.map((edge) => {
          const a = layout.pos[edge.from];
          const b = layout.pos[edge.to];
          const kind = EDGE_KINDS.find((k) => k.id === edge.kind);
          return (
            <line
              key={edge.id}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              strokeWidth={edgeWidth(edge, selected, goal)}
              strokeDasharray={kind && kind.dash ? kind.dash : undefined}
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              className={`${edgeClass(edge, selected, goal)} transition-[stroke] duration-200 motion-reduce:transition-none`}
            />
          );
        })}
      </svg>

      {RESOURCES.map((resource) => {
        const at = nodePercent(layout, resource.id);
        const isSelected = resource.id === selected;
        const step = stepIndexFor(goal, resource.id);
        const tone = isSelected
          ? "border-emerald-300 bg-emerald-500 text-zinc-900"
          : step !== null
            ? "border-emerald-500 bg-zinc-900 text-zinc-100 hover:border-emerald-300"
            : "border-zinc-700 bg-zinc-900 text-zinc-100 hover:border-zinc-500";
        return (
          <button
            key={`${layout.id}-${resource.id}`}
            type="button"
            onClick={() => onSelect(resource.id)}
            aria-pressed={isSelected}
            style={{ left: `${at.left}%`, top: `${at.top}%` }}
            className={`absolute ${nodeWidth} -translate-x-1/2 -translate-y-1/2 rounded-xl border px-2.5 py-2.5 text-left transition-colors duration-150 motion-reduce:transition-none ${tone} ${FOCUS_RING}`}
          >
            <span className="flex items-center justify-between gap-1.5">
              <span className="min-w-0 truncate font-mono text-sm font-semibold tracking-tight">{resource.label}</span>
              {step !== null ? (
                <span
                  aria-hidden="true"
                  className={`inline-flex h-5 w-5 flex-none items-center justify-center rounded-full text-xs font-semibold tabular-nums ${
                    isSelected ? "bg-zinc-900 text-emerald-300" : "bg-emerald-500 text-zinc-900"
                  }`}
                >
                  {step}
                </span>
              ) : null}
            </span>
            <span className={`mt-1 block text-xs font-normal tabular-nums ${isSelected ? "text-zinc-800" : "text-zinc-400"}`}>
              {resource.fields.length} fields · {endpointsFor(resource.id).length} endpoints
            </span>
            {step !== null ? (
              <span className="sr-only">Stop {step} on the selected route.</span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

/* --------------------------------------------------------------------- atlas */

export default function AtlasClient() {
  const [resourceId, setResourceId] = useState<ResourceId>(DEFAULT_RESOURCE);
  const [endpointId, setEndpointId] = useState<string>(DEFAULT_ENDPOINT);
  const [goalId, setGoalId] = useState<string>(DEFAULT_GOAL);
  const [lang, setLang] = useState<Lang>("curl");

  const resource = resourceById(resourceId);
  const endpoint = endpointById(endpointId);
  const goal = GOALS.find((g) => g.id === goalId) ?? GOALS[0];
  const relations = edgesTouching(resourceId);

  /** Moving to a resource always opens a valid endpoint on it, so the console is never stale. */
  function selectResource(id: ResourceId) {
    setResourceId(id);
    const first = endpointsFor(id)[0];
    if (first) setEndpointId(first.id);
  }

  function selectGoal(id: string) {
    setGoalId(id);
    const next = GOALS.find((g) => g.id === id);
    if (!next) return;
    const firstCall = next.steps.find((s) => s.kind === "call");
    if (firstCall && firstCall.kind === "call") {
      setEndpointId(firstCall.endpointId);
      setResourceId(endpointById(firstCall.endpointId).resource);
    }
  }

  function selectEndpoint(id: string) {
    setEndpointId(id);
    setResourceId(endpointById(id).resource);
  }

  return (
    <>
      {/* --------------------------------------------------------------- map */}
      <section aria-labelledby="map-heading" className="border-b border-zinc-800">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-emerald-400">
            <Waypoints aria-hidden="true" className="h-4 w-4" />
            The object map
          </p>
          <h2
            id="map-heading"
            className="mt-4 max-w-3xl text-3xl font-bold leading-tight tracking-tight text-zinc-50 sm:text-4xl"
            style={{ fontFamily: "var(--font-display-wide)" }}
          >
            Five objects, six relationships. Everything else is a field.
          </h2>
          <p className="mt-5 max-w-2xl text-base font-normal leading-relaxed text-zinc-300">
            Endpoint lists tell you what calls exist. They do not tell you why a charge binds to a
            plug and not to a building, which is the thing that decides how your schema looks. Pick a
            node and its whole record opens below; follow a line and you land on the object at the
            other end.
          </p>

          <h3 className="mt-10 text-sm font-semibold uppercase tracking-[0.14em] text-zinc-400">
            Reading the lines
          </h3>
          <ul className="mt-4 grid gap-3 sm:grid-cols-3">
            {EDGE_KINDS.map((kind) => (
              <li key={kind.id} className="min-w-0 rounded-xl border border-zinc-800 bg-zinc-900 p-4">
                <span className="flex items-center gap-2.5">
                  <svg aria-hidden="true" viewBox="0 0 40 8" className="h-2 w-10 flex-none">
                    <line
                      x1="0"
                      y1="4"
                      x2="40"
                      y2="4"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeDasharray={kind.dash || undefined}
                      className="stroke-emerald-400"
                    />
                  </svg>
                  <span className="font-mono text-sm font-semibold text-zinc-100">{kind.label}</span>
                </span>
                <span className="mt-2 block text-sm font-normal leading-relaxed text-zinc-400">{kind.blurb}</span>
              </li>
            ))}
          </ul>

          <div className="relative mt-6 rounded-2xl border border-zinc-800 bg-zinc-950 p-2 sm:p-6">
            <MapLayer
              layout={LAYOUTS.narrow}
              className="relative aspect-[340/640] w-full sm:hidden"
              nodeWidth="w-[44%]"
              selected={resourceId}
              goal={goal}
              onSelect={selectResource}
            />
            <MapLayer
              layout={LAYOUTS.wide}
              className="relative hidden aspect-[1000/520] w-full sm:block"
              nodeWidth="w-[17%]"
              selected={resourceId}
              goal={goal}
              onSelect={selectResource}
            />
          </div>

          <div className="relative">
            <ul className="sr-only">
              {EDGES.map((edge) => {
                const kind = EDGE_KINDS.find((k) => k.id === edge.kind);
                return (
                  <li key={`text-${edge.id}`}>
                    {edge.from} {kind ? kind.label : edge.kind} {edge.to}, through the field {edge.field}. {edge.reading}
                  </li>
                );
              })}
            </ul>
            <p role="status" aria-live="polite" className="sr-only">
              Open record: {resource.label}. Console showing {endpoint.method} {endpoint.path}.
            </p>
          </div>

          <p className="mt-4 max-w-3xl text-sm font-normal leading-relaxed text-zinc-400">
            Open: <span className="font-mono font-semibold text-emerald-400">{resource.label}</span>,{" "}
            {relations.length} relationships. Numbered nodes are the stops on the route chosen below,
            and the thicker lines are the edges that route walks. Every relationship is also written
            out in words in the <span className="font-semibold text-zinc-100">Edges from here</span>{" "}
            column of the record.
          </p>
        </div>
      </section>

      {/* ------------------------------------------------------------- paths */}
      <section aria-labelledby="paths-heading" className="border-b border-zinc-800 bg-zinc-900">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <h2
            id="paths-heading"
            className="text-2xl font-bold tracking-tight text-zinc-50 sm:text-3xl"
            style={{ fontFamily: "var(--font-display-wide)" }}
          >
            Three routes through the model
          </h2>
          <p className="mt-4 max-w-2xl text-base font-normal leading-relaxed text-zinc-300">
            Each one lights its edges on the map above and lists the calls in order. Every step is a
            button: pressing it opens that object&apos;s record and loads that request into the console.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {GOALS.map((option) => {
              const active = option.id === goal.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => selectGoal(option.id)}
                  aria-pressed={active}
                  className={`min-w-0 rounded-xl border p-5 text-left transition-colors duration-150 motion-reduce:transition-none ${FOCUS_RING} ${
                    active
                      ? "border-emerald-400 bg-emerald-500 text-zinc-900"
                      : "border-zinc-700 bg-zinc-950 text-zinc-100 hover:border-zinc-500"
                  }`}
                >
                  <span className="flex items-start gap-2">
                    {active ? (
                      <Check aria-hidden="true" className="mt-0.5 h-4 w-4 flex-none" />
                    ) : (
                      <Circle aria-hidden="true" className="mt-0.5 h-4 w-4 flex-none text-zinc-400" />
                    )}
                    <span className="min-w-0 text-base font-semibold leading-snug">{option.title}</span>
                  </span>
                  <span className={`mt-2 block text-sm font-normal leading-relaxed ${active ? "text-zinc-800" : "text-zinc-400"}`}>
                    {option.question}
                  </span>
                </button>
              );
            })}
          </div>

          <ol className="mt-8 grid gap-4 lg:grid-cols-4">
            {goal.steps.map((step, index) => {
              const targetResource =
                step.kind === "call" ? endpointById(step.endpointId).resource : step.resource;
              const title =
                step.kind === "call"
                  ? `${endpointById(step.endpointId).method} ${endpointById(step.endpointId).path}`
                  : step.event;
              const isOpen = step.kind === "call" && step.endpointId === endpoint.id;
              return (
                <li key={`${goal.id}-${index}`} className="min-w-0">
                  <button
                    type="button"
                    onClick={() => {
                      if (step.kind === "call") selectEndpoint(step.endpointId);
                      else selectResource(step.resource);
                    }}
                    aria-pressed={isOpen}
                    className={`h-full w-full rounded-xl border p-4 text-left transition-colors duration-150 motion-reduce:transition-none ${FOCUS_RING} ${
                      isOpen
                        ? "border-emerald-400 bg-zinc-950"
                        : "border-zinc-800 bg-zinc-950 hover:border-zinc-600"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span
                        aria-hidden="true"
                        className="inline-flex h-6 w-6 flex-none items-center justify-center rounded-full bg-emerald-500 text-sm font-semibold tabular-nums text-zinc-900"
                      >
                        {index + 1}
                      </span>
                      <span className="min-w-0 break-words font-mono text-sm font-semibold text-zinc-100">
                        {title}
                      </span>
                    </span>
                    <span className="mt-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-emerald-400">
                      {step.kind === "call" ? "request" : "webhook event"} · {targetResource}
                    </span>
                    <span className="mt-2 block text-sm font-normal leading-relaxed text-zinc-400">{step.note}</span>
                  </button>
                </li>
              );
            })}
          </ol>

          <p className="mt-6 flex max-w-3xl items-start gap-2.5 rounded-xl border border-zinc-700 bg-zinc-950 p-4 text-sm font-normal leading-relaxed text-zinc-300">
            <ArrowRight aria-hidden="true" className="mt-0.5 h-4 w-4 flex-none text-emerald-400" />
            <span className="min-w-0">
              <span className="font-semibold text-zinc-100">Where this path stops.</span> {goal.caveat}
            </span>
          </p>
        </div>
      </section>

      {/* ------------------------------------------------------------ record */}
      <section aria-labelledby="record-heading" className="border-b border-zinc-800">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <p className="font-mono text-sm font-semibold uppercase tracking-[0.18em] text-emerald-400">
            {resource.idPrefix}
          </p>
          <h2
            id="record-heading"
            className="mt-3 text-2xl font-bold tracking-tight text-zinc-50 sm:text-3xl"
            style={{ fontFamily: "var(--font-display-wide)" }}
          >
            {resource.label} — {resource.oneLine}
          </h2>
          <p className="mt-4 max-w-3xl text-base font-normal leading-relaxed text-zinc-300">{resource.why}</p>

          <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="min-w-0">
              <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-zinc-400">
                Shape · {resource.fields.length} fields
              </h3>
              <ul className="mt-4 space-y-3 border-t border-zinc-800 pt-4">
                {resource.fields.map((field) => (
                  <li key={field.name} className="min-w-0">
                    <span className="flex flex-wrap items-baseline gap-x-2">
                      <span className="break-words font-mono text-sm font-semibold text-zinc-100">{field.name}</span>
                      <span className="font-mono text-xs font-normal text-emerald-400">{field.type}</span>
                    </span>
                    <span className="mt-1 block text-sm font-normal leading-relaxed text-zinc-400">{field.note}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="min-w-0">
              <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-zinc-400">
                Endpoints · {endpointsFor(resource.id).length}
              </h3>
              <ul className="mt-4 space-y-3 border-t border-zinc-800 pt-4">
                {endpointsFor(resource.id).map((option) => {
                  const active = option.id === endpoint.id;
                  return (
                    <li key={option.id} className="min-w-0">
                      <button
                        type="button"
                        onClick={() => selectEndpoint(option.id)}
                        aria-pressed={active}
                        className={`w-full rounded-lg border p-3 text-left transition-colors duration-150 motion-reduce:transition-none ${FOCUS_RING} ${
                          active ? "border-emerald-400 bg-zinc-900" : "border-zinc-800 bg-zinc-900 hover:border-zinc-600"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="font-mono text-xs font-semibold uppercase text-emerald-400">{option.method}</span>
                          {active ? <Check aria-hidden="true" className="h-3.5 w-3.5 flex-none text-emerald-400" /> : null}
                        </span>
                        <span className="mt-1 block break-words font-mono text-sm font-normal text-zinc-100">{option.path}</span>
                        <span className="mt-1.5 block text-sm font-normal leading-relaxed text-zinc-400">{option.summary}</span>
                        {active ? <span className="sr-only">Currently loaded in the console below.</span> : null}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="min-w-0">
              <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-zinc-400">
                Webhook events · {resource.events.length}
              </h3>
              <ul className="mt-4 space-y-3 border-t border-zinc-800 pt-4">
                {resource.events.map((event) => (
                  <li key={event.name} className="min-w-0">
                    <span className="block break-words font-mono text-sm font-semibold text-zinc-100">{event.name}</span>
                    <span className="mt-1 block text-sm font-normal leading-relaxed text-zinc-400">{event.means}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="min-w-0">
              <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-zinc-400">
                Edges from here · {relations.length}
              </h3>
              <ul className="mt-4 space-y-3 border-t border-zinc-800 pt-4">
                {relations.map((edge) => {
                  const neighbour = otherEnd(edge, resource.id);
                  return (
                    <li key={`rel-${edge.id}`} className="min-w-0">
                      <button
                        type="button"
                        onClick={() => selectResource(neighbour)}
                        className={`w-full rounded-lg border border-zinc-800 bg-zinc-900 p-3 text-left transition-colors duration-150 hover:border-emerald-400 motion-reduce:transition-none ${FOCUS_RING}`}
                      >
                        <span className="flex items-center gap-1.5">
                          <span className="text-sm font-normal text-zinc-400">{directionLabel(edge, resource.id)}</span>
                          <ArrowRight aria-hidden="true" className="h-3.5 w-3.5 flex-none text-emerald-400" />
                          <span className="min-w-0 truncate font-mono text-sm font-semibold text-zinc-100">{neighbour}</span>
                        </span>
                        <span className="mt-1 block break-words font-mono text-xs font-normal text-emerald-400">{edge.field}</span>
                        <span className="mt-1.5 block text-sm font-normal leading-relaxed text-zinc-400">{edge.reading}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ console */}
      <section aria-labelledby="call-heading" className="border-b border-zinc-800 bg-zinc-900">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="min-w-0">
              <h2
                id="call-heading"
                className="text-2xl font-bold tracking-tight text-zinc-50 sm:text-3xl"
                style={{ fontFamily: "var(--font-display-wide)" }}
              >
                The call, and what comes back
              </h2>
              <p className="mt-3 max-w-2xl text-base font-normal leading-relaxed text-zinc-300">
                Live against the sandbox with a{" "}
                <span className="font-mono text-emerald-400">{API.sandboxPrefix}</span> key. Same
                payload shape as production, same state machines, no card on file.
              </p>
            </div>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Snippet language">
              {LANGS.map((option) => {
                const active = option.id === lang;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setLang(option.id)}
                    aria-pressed={active}
                    className={`rounded-lg border px-4 py-2 text-sm font-semibold transition-colors duration-150 motion-reduce:transition-none ${FOCUS_RING} ${
                      active
                        ? "border-emerald-400 bg-emerald-500 text-zinc-900"
                        : "border-zinc-700 bg-zinc-950 text-zinc-300 hover:border-zinc-500"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="min-w-0 rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
              <h3 className="flex flex-wrap items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-zinc-400">
                Request
                <span className="font-mono text-xs font-semibold text-emerald-400">
                  {endpoint.method} {endpoint.path}
                </span>
              </h3>
              <pre className="mt-4 whitespace-pre-wrap break-words font-mono text-xs font-normal leading-relaxed text-zinc-100 sm:text-sm">
                <code>{snippetFor(endpoint, lang)}</code>
              </pre>
            </div>

            <div className="min-w-0 rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
              <h3 className="flex flex-wrap items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-zinc-400">
                Response
                <span className="font-mono text-xs font-semibold text-emerald-400">
                  200 · application/json
                </span>
              </h3>
              <pre className="mt-4 whitespace-pre-wrap break-words font-mono text-xs font-normal leading-relaxed text-zinc-100 sm:text-sm">
                <code>{endpoint.response}</code>
              </pre>
            </div>
          </div>

          <p className="mt-6 text-sm font-normal leading-relaxed text-zinc-400">
            Every id in that payload is a node on the map. Press one in the{" "}
            <span className="font-semibold text-zinc-100">Edges from here</span> column to open the
            object it points at.{" "}
            <a
              href={`${API.docsUrl}/reference/${resource.label}`}
              className={`inline-flex items-center gap-1 rounded font-semibold text-emerald-400 underline underline-offset-4 hover:text-emerald-300 ${FOCUS_RING}`}
            >
              Full {resource.label} reference
              <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
            </a>
          </p>
        </div>
      </section>
    </>
  );
}
