"use client";

import { Ban, Check, CircleDot } from "lucide-react";
import Reveal from "./reveal";
import { DISPLAY, PRINCIPLES, cx, formatValue, member, pillar, type PillarId } from "./data";

const SHELL = "mx-auto w-full max-w-6xl px-5 sm:px-8";

/**
 * Six rules, each printed twice: once as what it commits us to, once as what it forbids.
 *
 * The refusals are set in the negative — white plate on the left, struck plate on the right — because
 * a values section that only lists virtues is a brochure. What a company will not do is the only half
 * of the pair that costs it anything, so it gets the ink.
 *
 * The strip under each pair is the load-bearing line of this page: it names the person answerable for
 * the rule and, for four of the six, the measure that rule produces. That is what stops the numbers
 * upstairs and the faces downstairs from being two unrelated sections.
 */
export default function PrinciplesSection({ selected }: { selected: PillarId }) {
  return (
    <section id="principles" aria-labelledby="principles-heading" className="border-t border-stone-200 py-14 sm:py-20">
      <div className={SHELL}>
        <h2
          id="principles-heading"
          className="text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl"
          style={DISPLAY}
        >
          What we do, and what we refuse
        </h2>
        <p className="mt-3 max-w-2xl text-base leading-relaxed font-normal text-stone-600">
          Six rules. Each one has a person who is answerable for it, and four of them are the reason a
          measure at the top of this page reads the way it does.
        </p>

        <ul className="mt-8 flex flex-col gap-4">
          {PRINCIPLES.map((rule, index) => {
            const owner = member(rule.owner);
            const linked = rule.pillar !== null;
            const active = linked && rule.pillar === selected;
            const measure = linked ? pillar(rule.pillar as PillarId) : null;

            return (
              <li key={rule.id} className="min-w-0">
                <Reveal delayMs={index * 50}>
                  <div
                    className={cx(
                      "grid min-w-0 gap-px overflow-hidden rounded-2xl border bg-stone-200 md:grid-cols-2",
                      active ? "border-lime-700" : "border-stone-200",
                    )}
                  >
                    <div className="min-w-0 bg-white p-5">
                      <p className="flex items-center gap-1.5 text-xs font-medium tracking-[0.16em] text-lime-800 uppercase">
                        <Check aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
                        We do
                      </p>
                      <h3 className="mt-2 text-base leading-snug font-medium text-stone-900 sm:text-lg" style={DISPLAY}>
                        {rule.does}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed font-normal text-stone-600">{rule.because}</p>
                    </div>

                    <div className="min-w-0 bg-stone-900 p-5 text-stone-100">
                      <p className="flex items-center gap-1.5 text-xs font-medium tracking-[0.16em] text-stone-300 uppercase">
                        <Ban aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
                        We refuse
                      </p>
                      <p className="mt-2 text-base leading-snug font-normal text-stone-100 sm:text-lg" style={DISPLAY}>
                        {rule.refuses}
                      </p>
                    </div>

                    <div
                      className={cx(
                        "col-span-full flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 px-5 py-3 text-xs font-normal",
                        active ? "bg-lime-50 text-stone-600" : "bg-stone-50 text-stone-600",
                      )}
                    >
                      <span>
                        Answerable: <span className="font-medium text-stone-900">{owner.name}</span>, {owner.role}
                      </span>
                      {measure ? (
                        <span
                          className={cx(
                            "inline-flex items-center gap-1",
                            active ? "font-medium text-lime-800" : "text-stone-600",
                          )}
                        >
                          {active ? <CircleDot aria-hidden="true" className="h-3.5 w-3.5 shrink-0" /> : null}
                          Shows up as {measure.label.toLowerCase()},{" "}
                          <span className="tabular-nums" style={DISPLAY}>
                            {formatValue(measure, measure.value)}
                          </span>
                        </span>
                      ) : (
                        <span>Carries no measure — this one is a promise, not a reading</span>
                      )}
                    </div>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
