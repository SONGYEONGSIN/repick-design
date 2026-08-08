"use client";

import { useState } from "react";
import { ChevronDown, CircleDot } from "lucide-react";
import Reveal from "./reveal";
import TeamMark from "./team-mark";
import {
  DISPLAY,
  FOCUS_CARD,
  HEADCOUNT,
  MEMBERS,
  PILLARS,
  PRINCIPLES,
  cx,
  formatValue,
  type MemberId,
  type PillarId,
} from "./data";

const SHELL = "mx-auto w-full max-w-6xl px-5 sm:px-8";

/**
 * The people, arranged so that an organisation reads as an organisation.
 *
 * A profile page has one subject and can afford a sidebar. Six leads cannot be a sidebar, so they are
 * a grid — and the grid earns its place by being the register the rest of the page points into: four
 * of these cards are named in the hero as holding a measure, all six are named in the rules above.
 * Selecting a measure marks the one card answerable for it.
 *
 * Expanding a card is a plain button and a region, not a `details` element with its marker removed.
 * A stripped `summary` with no replacement chevron is content nobody finds; the chevron here is the
 * button's own child and rotates with the state it describes.
 */
export default function TeamSection({ selected }: { selected: PillarId }) {
  const [open, setOpen] = useState<MemberId | null>(null);

  return (
    <section id="people" aria-labelledby="people-heading" className="border-t border-stone-200 py-14 sm:py-20">
      <div className={SHELL}>
        <h2 id="people-heading" className="text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl" style={DISPLAY}>
          The people answerable for it
        </h2>
        <p className="mt-3 max-w-2xl text-base leading-relaxed font-normal text-stone-600">
          Six of the {HEADCOUNT}. They are on this page because every rule above and every measure at
          the top of it is somebody here, by name, rather than a department.
        </p>

        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MEMBERS.map((person, index) => {
            const held = PILLARS.find((p) => p.owner === person.id) ?? null;
            const rule = PRINCIPLES.find((r) => r.owner === person.id) ?? null;
            const active = held !== null && held.id === selected;
            const expanded = open === person.id;
            const regionId = `member-${person.id}`;

            return (
              <li key={person.id} className="min-w-0">
                <Reveal className="h-full" delayMs={index * 50}>
                  <article
                    className={cx(
                      "flex h-full min-w-0 flex-col rounded-2xl border p-5",
                      active ? "border-lime-700 bg-lime-50" : "border-stone-200 bg-white",
                    )}
                  >
                    <div className="flex min-w-0 items-start gap-3">
                      <TeamMark
                        name={person.name}
                        initials={person.initials}
                        holds={held !== null}
                        className="h-14 w-14 shrink-0"
                      />
                      <div className="min-w-0">
                        <h3 className="text-base font-medium tracking-tight text-stone-900" style={DISPLAY}>
                          {person.name}
                        </h3>
                        <p className="mt-0.5 text-sm leading-snug font-normal text-stone-600">{person.role}</p>
                        <p className="mt-0.5 text-xs font-normal text-stone-600">{person.based}</p>
                      </div>
                    </div>

                    <p className="mt-4 text-sm leading-relaxed font-normal text-stone-600">{person.line}</p>

                    {held ? (
                      <p
                        className={cx(
                          "mt-4 inline-flex flex-wrap items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium",
                          active ? "bg-lime-100 text-lime-800" : "bg-stone-100 text-stone-600",
                        )}
                      >
                        {active ? <CircleDot aria-hidden="true" className="h-3.5 w-3.5 shrink-0" /> : null}
                        Holds {held.label.toLowerCase()},{" "}
                        <span className="tabular-nums" style={DISPLAY}>
                          {formatValue(held, held.value)}
                        </span>
                      </p>
                    ) : (
                      <p className="mt-4 inline-flex rounded-lg bg-stone-100 px-2.5 py-1.5 text-xs font-medium text-stone-600">
                        Holds a rule, not a measure
                      </p>
                    )}

                    <button
                      type="button"
                      aria-expanded={expanded}
                      aria-controls={regionId}
                      onClick={() => setOpen(expanded ? null : person.id)}
                      className={cx(
                        "mt-4 inline-flex items-center gap-1.5 self-start rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-xs font-medium text-stone-900 transition-colors hover:bg-stone-100",
                        FOCUS_CARD,
                      )}
                    >
                      <ChevronDown
                        aria-hidden="true"
                        className={cx(
                          "h-3.5 w-3.5 shrink-0 transition-transform duration-200 motion-reduce:transition-none",
                          expanded && "rotate-180",
                        )}
                      />
                      {expanded ? "Hide background" : "Background"}
                    </button>

                    <div id={regionId} hidden={!expanded} className="mt-3 border-t border-stone-200 pt-3">
                      <p className="text-sm leading-relaxed font-normal text-stone-600">{person.background}</p>
                      {rule ? (
                        <p className="mt-3 text-sm leading-relaxed font-normal text-stone-600">
                          <span className="font-medium text-stone-900">The rule they hold: </span>
                          {rule.does}
                        </p>
                      ) : null}
                    </div>
                  </article>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
