"use client";

import { CircleDot } from "lucide-react";
import Reveal from "./reveal";
import TrajectoryChart from "./trajectory-chart";
import { DISPLAY, MILESTONES, cx, formatValue, member, pillar, type PillarId } from "./data";

const SHELL = "mx-auto w-full max-w-6xl px-5 sm:px-8";

/**
 * Where the history and the numbers are the same object.
 *
 * Every milestone prints the currently selected measure as it read at the end of that year, so the
 * question "when was this earned" is answered in place rather than asserted. And every milestone
 * names the person who did the work — when the selected measure belongs to that person, the entry is
 * marked, which is the shortest path between a figure in the hero and a face further down.
 */
export default function RecordSection({ selected }: { selected: PillarId }) {
  const p = pillar(selected);

  return (
    <section id="record" aria-labelledby="record-heading" className="border-t border-stone-200 py-14 sm:py-20">
      <div className={SHELL}>
        <h2 id="record-heading" className="text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl" style={DISPLAY}>
          Nine years, six moments
        </h2>
        <p className="mt-3 max-w-2xl text-base leading-relaxed font-normal text-stone-600">
          None of the four measures arrived at once. Each entry below prints the measure you are
          tracking as it stood at the end of that year, next to the person whose work moved it.
        </p>

        <div className="mt-8">
          <TrajectoryChart selected={selected} />
        </div>

        <ol className="mt-10">
          {MILESTONES.map((m, index) => {
            const author = member(m.by);
            const isOwnerMoment = m.by === p.owner;

            return (
              <li key={m.year} className="relative pb-8 pl-8 last:pb-0 sm:pl-10">
                <span
                  aria-hidden="true"
                  className={cx(
                    "absolute top-1.5 left-0 h-3.5 w-3.5 rounded-full border-2 bg-white",
                    isOwnerMoment ? "border-lime-700" : "border-stone-300",
                  )}
                />
                {index < MILESTONES.length - 1 ? (
                  <span aria-hidden="true" className="absolute top-6 bottom-0 left-[6px] w-px bg-stone-200" />
                ) : null}

                <Reveal delayMs={index * 60}>
                  <article
                    className={cx(
                      "min-w-0 rounded-2xl border p-4 sm:p-5",
                      isOwnerMoment ? "border-lime-700 bg-lime-50" : "border-stone-200 bg-white",
                    )}
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
                      <p className="text-sm font-medium text-lime-800 tabular-nums" style={DISPLAY}>
                        {m.year}
                      </p>
                      <p className="text-xs font-normal text-stone-600">
                        {p.label} at the end of {m.year}:{" "}
                        <span className="font-medium text-stone-900 tabular-nums" style={DISPLAY}>
                          {formatValue(p, m.readings[selected])}
                        </span>
                      </p>
                    </div>

                    <h3 className="mt-1 text-lg font-medium tracking-tight text-stone-900 sm:text-xl" style={DISPLAY}>
                      {m.title}
                    </h3>
                    <p className="mt-2 max-w-2xl text-sm leading-relaxed font-normal text-stone-600">{m.body}</p>

                    <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-stone-200 pt-3 text-xs font-normal text-stone-600">
                      <span>
                        Done by <span className="font-medium text-stone-900">{author.name}</span>, {author.role}
                      </span>
                      {isOwnerMoment ? (
                        <span className="inline-flex items-center gap-1 font-medium text-lime-800">
                          <CircleDot aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
                          Holds {p.label.toLowerCase()}
                        </span>
                      ) : null}
                    </p>
                  </article>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
