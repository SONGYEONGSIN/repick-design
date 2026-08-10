"use client";

import { useId, useState } from "react";
import { CheckCircle2, Info, Mail, Phone } from "lucide-react";
import {
  CHANNELS,
  FOCUS_RING,
  GOOD_TO_KNOW,
  PEER_FOCUS_RING,
  TIERS,
  groupThousands,
  type TierId,
} from "./data";

/**
 * The structural pivot. This is not a filter switch sitting beside a static table — changing the
 * tier reorders which `<li>` renders first in the DOM (via `visible.sort`), swaps the "Matched to
 * <tier>" channel entirely, and rewrites both column headings and the "Good to know" list. Nothing
 * here reads a clock: the axis is *who the reader is*, not *what time it is*.
 *
 * Built on native radio inputs (`role` is implicit) inside a `fieldset`/`legend` rather than a
 * div-based segmented control, so arrow-key navigation between the three tiers and screen-reader
 * group semantics come from the browser for free instead of being reimplemented.
 */
export default function TierConsole() {
  const [tier, setTier] = useState<TierId>("guest");
  const groupId = useId();
  const activeTier = TIERS.find((t) => t.id === tier) ?? TIERS[0];

  const visible = CHANNELS.filter((c) => c.tiers.includes(tier)).sort(
    (a, b) => (a.priority[tier] ?? 99) - (b.priority[tier] ?? 99),
  );
  const bullets = GOOD_TO_KNOW[tier];

  return (
    <div className="mt-8">
      <fieldset>
        <legend className="text-sm font-medium text-zinc-700">
          Which one are you? Selecting a tier reorders the channels below to match it.
        </legend>
        <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-3 sm:gap-3">
          {TIERS.map((t) => {
            const Icon = t.icon;
            const checked = t.id === tier;
            const inputId = `${groupId}-${t.id}`;
            return (
              <div key={t.id} className="min-w-0">
                <input
                  type="radio"
                  id={inputId}
                  name={`${groupId}-tier`}
                  value={t.id}
                  checked={checked}
                  onChange={() => setTier(t.id)}
                  className="peer sr-only"
                />
                <label
                  htmlFor={inputId}
                  className={`flex min-w-0 cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-colors ${PEER_FOCUS_RING} ${
                    checked
                      ? "border-blue-600 bg-blue-50"
                      : "border-zinc-200 bg-white hover:border-zinc-300"
                  }`}
                >
                  <span
                    className={`flex h-9 w-9 flex-none items-center justify-center rounded-full ${
                      checked ? "bg-blue-600 text-white" : "bg-zinc-100 text-zinc-600"
                    }`}
                  >
                    <Icon aria-hidden="true" className="h-4 w-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-zinc-950">{t.label}</span>
                    <span className="block truncate text-xs font-normal text-zinc-600">
                      {t.hint}
                    </span>
                  </span>
                  {checked && (
                    <CheckCircle2
                      aria-hidden="true"
                      className="ml-auto h-4 w-4 flex-none text-blue-600"
                    />
                  )}
                </label>
              </div>
            );
          })}
        </div>
      </fieldset>

      <div aria-live="polite" className="sr-only">
        Showing channels matched to {activeTier.label}.
      </div>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[3fr_2fr]">
        <div className="min-w-0">
          <h3 className="text-lg font-semibold tracking-tight text-zinc-950">
            Priority channels — {activeTier.label}
          </h3>
          <ul className="mt-4 space-y-3">
            {visible.map((c) => {
              const Icon = c.icon;
              const matched = c.tiers.length === 1;
              return (
                <li
                  key={c.id}
                  className={`min-w-0 rounded-xl border p-4 sm:p-5 ${
                    matched ? "border-blue-600 bg-blue-50" : "border-zinc-200 bg-white"
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
                    <div className="flex min-w-0 items-start gap-3">
                      <span
                        className={`mt-0.5 flex h-9 w-9 flex-none items-center justify-center rounded-full ${
                          matched ? "bg-blue-600 text-white" : "bg-zinc-100 text-zinc-700"
                        }`}
                      >
                        <Icon aria-hidden="true" className="h-4 w-4" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-base font-semibold text-zinc-950">{c.label}</p>
                        <p className="mt-0.5 text-sm font-normal text-zinc-600">
                          {c.description}
                        </p>
                      </div>
                    </div>
                    {matched && (
                      <span className="inline-flex flex-none items-center gap-1.5 rounded-full bg-blue-600 px-2.5 py-1 text-xs font-medium text-white">
                        <CheckCircle2 aria-hidden="true" className="h-3.5 w-3.5" />
                        Matched to {activeTier.label}
                      </span>
                    )}
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-2.5">
                    <a
                      href={c.primary.href}
                      className={`inline-flex items-center gap-2 rounded-lg bg-zinc-950 px-3.5 py-2 text-sm font-medium tabular-nums text-white hover:bg-zinc-800 ${FOCUS_RING}`}
                    >
                      {c.primary.kind === "email" ? (
                        <Mail aria-hidden="true" className="h-4 w-4 flex-none" />
                      ) : (
                        <Phone aria-hidden="true" className="h-4 w-4 flex-none" />
                      )}
                      {c.primary.display}
                    </a>
                    {c.secondary && (
                      <a
                        href={c.secondary.href}
                        className={`inline-flex items-center gap-2 rounded-lg border border-zinc-300 px-3.5 py-2 text-sm font-medium tabular-nums text-zinc-800 hover:border-zinc-400 ${FOCUS_RING}`}
                      >
                        {c.secondary.kind === "email" ? (
                          <Mail aria-hidden="true" className="h-4 w-4 flex-none" />
                        ) : (
                          <Phone aria-hidden="true" className="h-4 w-4 flex-none" />
                        )}
                        {c.secondary.display}
                      </a>
                    )}
                  </div>

                  <dl className="mt-4 grid grid-cols-1 gap-x-6 gap-y-2 border-t border-zinc-200 pt-3 text-xs font-normal text-zinc-600 sm:grid-cols-2">
                    <div className="flex items-baseline justify-between gap-2 sm:block">
                      <dt className="sm:font-medium sm:text-zinc-700">Median reply</dt>
                      <dd className="tabular-nums sm:mt-0.5">
                        {c.medianReply} · {groupThousands(c.volume)}/mo
                      </dd>
                    </div>
                    <div className="flex items-baseline justify-between gap-2 sm:block">
                      <dt className="sm:font-medium sm:text-zinc-700">Breaks when</dt>
                      <dd className="tabular-nums sm:mt-0.5">{c.breaksWhen}</dd>
                    </div>
                  </dl>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="min-w-0 rounded-xl bg-zinc-50 p-5 sm:p-6">
          <h3 className="text-lg font-semibold tracking-tight text-zinc-950">
            Good to know — {activeTier.label}
          </h3>
          <ul className="mt-4 space-y-3">
            {bullets.map((line) => (
              <li key={line} className="flex min-w-0 items-start gap-2.5">
                <Info aria-hidden="true" className="mt-0.5 h-4 w-4 flex-none text-blue-600" />
                <span className="text-sm font-normal leading-relaxed text-zinc-700">{line}</span>
              </li>
            ))}
          </ul>
          <p className="mt-5 border-t border-zinc-200 pt-4 text-xs font-normal leading-relaxed text-zinc-600">
            Picked wrong? Nothing above is locked in — switch tiers any time, or use the two lines
            everyone gets at the top of this page.
          </p>
        </div>
      </div>
    </div>
  );
}
