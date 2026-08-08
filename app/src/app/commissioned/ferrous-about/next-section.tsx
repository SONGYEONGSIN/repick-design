"use client";

import { useState } from "react";
import { ArrowRight, Briefcase, ChevronDown, MapPin, Store } from "lucide-react";
import { CONTACT, DISPLAY, FOCUS_CARD, PLACES, ROLES, cx } from "./data";

const SHELL = "mx-auto w-full max-w-6xl px-5 sm:px-8";

const FOCUS_LIME =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-900 focus-visible:ring-offset-2 focus-visible:ring-offset-lime-50";

/**
 * Two exits, for the two reasons anyone reads this page to the bottom.
 *
 * The careers half opens the list in place rather than promising a page elsewhere — a reader who has
 * just been told six people are answerable for six rules should be able to see what the seventh
 * would be doing without leaving.
 */
export default function NextSection() {
  const [rolesOpen, setRolesOpen] = useState(false);

  return (
    <section id="next" aria-labelledby="next-heading" className="border-t border-stone-200 py-14 sm:py-20">
      <div className={SHELL}>
        <h2 id="next-heading" className="text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl" style={DISPLAY}>
          Where to go next
        </h2>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="flex min-w-0 flex-col rounded-2xl border border-lime-700 bg-lime-50 p-6">
            <p className="flex items-center gap-1.5 text-xs font-medium tracking-[0.16em] text-lime-800 uppercase">
              <Store aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
              Buy or sell
            </p>
            <h3 className="mt-3 text-xl font-medium tracking-tight text-stone-900 sm:text-2xl" style={DISPLAY}>
              See what is listed today
            </h3>
            <p className="mt-2 text-sm leading-relaxed font-normal text-stone-600">
              Every item on it carries the condition report described on this page, written before the
              listing went up and signed by the floor that wrote it.
            </p>
            <button
              type="button"
              className={cx(
                "mt-6 inline-flex items-center justify-center gap-2 self-start rounded-xl bg-lime-800 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-lime-900",
                FOCUS_LIME,
              )}
            >
              Open the marketplace
              <ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0" />
            </button>
          </div>

          <div className="flex min-w-0 flex-col rounded-2xl border border-stone-200 bg-white p-6">
            <p className="flex items-center gap-1.5 text-xs font-medium tracking-[0.16em] text-stone-600 uppercase">
              <Briefcase aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
              Work here
            </p>
            <h3 className="mt-3 text-xl font-medium tracking-tight text-stone-900 sm:text-2xl" style={DISPLAY}>
              {ROLES.length} roles open, in {PLACES}
            </h3>
            <p className="mt-2 text-sm leading-relaxed font-normal text-stone-600">
              Graders, researchers and engineers. Everyone here grades on their first week, whatever
              they were hired to do.
            </p>

            <button
              type="button"
              aria-expanded={rolesOpen}
              aria-controls="open-roles"
              onClick={() => setRolesOpen((v) => !v)}
              className={cx(
                "mt-6 inline-flex items-center gap-2 self-start rounded-xl border border-stone-300 bg-white px-5 py-3 text-sm font-medium text-stone-900 transition-colors hover:bg-stone-100",
                FOCUS_CARD,
              )}
            >
              <ChevronDown
                aria-hidden="true"
                className={cx(
                  "h-4 w-4 shrink-0 transition-transform duration-200 motion-reduce:transition-none",
                  rolesOpen && "rotate-180",
                )}
              />
              {rolesOpen ? "Hide the list" : "List the roles"}
            </button>

            <ul id="open-roles" hidden={!rolesOpen} className="mt-4 divide-y divide-stone-200 border-t border-stone-200">
              {ROLES.map((role) => (
                <li key={`${role.title}-${role.where}`} className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-1 py-3">
                  <span className="text-sm font-medium text-stone-900">{role.title}</span>
                  <span className="inline-flex items-center gap-1 text-xs font-normal text-stone-600">
                    <MapPin aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
                    {role.where}
                  </span>
                  <span className="text-xs font-normal text-stone-600">{role.team}</span>
                </li>
              ))}
            </ul>

            <p className="mt-4 text-sm leading-relaxed font-normal text-stone-600">
              Nothing that fits? Write to{" "}
              <span className="font-medium text-stone-900">{CONTACT}</span> and say what you would grade.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
