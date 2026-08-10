"use client";

import { useId, useMemo, useState } from "react";
import {
  CheckCircle2,
  Mail,
  MessageCircle,
  Phone,
  PhoneCall,
  ShieldAlert,
  Timer,
  UserCheck,
  Users,
} from "lucide-react";
import { FOCUS_RING, SITUATIONS, TIERS, type IconKey, type TierId } from "./data";

const ICONS: Record<IconKey, typeof MessageCircle> = {
  MessageCircle,
  UserCheck,
  ShieldAlert,
  PhoneCall,
};

/**
 * The page's single interactive device: a row of issue-type chips that narrows which rung of the
 * ladder applies. Selecting a chip never hides, filters, or gates any tier — every tier and its
 * mailto:/tel: link is already rendered before this component ever mounts. Selecting a chip only
 * adds a "Matches your situation" callout to the one tier that owns it, so the device narrows
 * attention, not access.
 */
export default function EscalationClient() {
  const [selected, setSelected] = useState<string | null>(null);
  const groupLabelId = useId();

  const matchedTierId: TierId | null = useMemo(() => {
    if (!selected) return null;
    return SITUATIONS.find((s) => s.id === selected)?.tierId ?? null;
  }, [selected]);

  const matchedSituationLabel = useMemo(
    () => (selected ? SITUATIONS.find((s) => s.id === selected)?.label ?? null : null),
    [selected],
  );

  const matchedTier = useMemo(
    () => (matchedTierId ? TIERS.find((t) => t.id === matchedTierId) ?? null : null),
    [matchedTierId],
  );

  return (
    <div>
      <section aria-labelledby={groupLabelId}>
        <h2 id={groupLabelId} className="text-lg font-bold text-zinc-900 sm:text-xl">
          What&apos;s going on?
        </h2>
        <p className="mt-2 max-w-2xl text-sm font-normal leading-relaxed text-zinc-700">
          Pick the situation closest to yours — the ladder below highlights the rung that handles
          it. Nothing is hidden either way: every tier&apos;s address stays visible whether you pick one
          or not.
        </p>
        <div role="group" aria-label="Highlight the matching tier by situation" className="mt-4 flex flex-wrap gap-2">
          {SITUATIONS.map((s) => {
            const isSelected = selected === s.id;
            return (
              <button
                key={s.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setSelected(isSelected ? null : s.id)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-left text-sm ${FOCUS_RING} ${
                  isSelected
                    ? "border-blue-700 bg-blue-700 font-semibold text-white"
                    : "border-zinc-300 bg-white font-normal text-zinc-700 hover:border-blue-700 hover:text-blue-800"
                }`}
              >
                {isSelected ? (
                  <CheckCircle2 aria-hidden="true" className="h-4 w-4 shrink-0" />
                ) : (
                  <span aria-hidden="true" className="h-4 w-4 shrink-0" />
                )}
                {s.label}
              </button>
            );
          })}
        </div>
        <div aria-live="polite" className="sr-only">
          {matchedTier
            ? `${matchedSituationLabel} matches Tier ${matchedTier.level}, ${matchedTier.label}.`
            : "No situation selected. All four tiers remain visible below."}
        </div>
      </section>

      <ol className="mt-10 list-none">
        {TIERS.map((tier, i) => {
          const Icon = ICONS[tier.icon];
          const isMatch = matchedTierId === tier.id;
          const next = TIERS[i + 1];
          return (
            <li key={tier.id} className="relative flex gap-4 pb-8 last:pb-0 sm:gap-6">
              <div className="flex flex-col items-center">
                <span
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 text-base font-bold tabular-nums ${
                    isMatch
                      ? "border-blue-700 bg-blue-700 text-white"
                      : "border-zinc-300 bg-white text-zinc-700"
                  }`}
                >
                  {tier.level}
                </span>
                {next && <span aria-hidden="true" className="mt-1 w-px flex-1 bg-zinc-300" />}
              </div>

              <div
                className={`min-w-0 flex-1 rounded-2xl border p-4 sm:p-5 ${
                  isMatch ? "border-blue-700 bg-blue-50" : "border-zinc-200 bg-white"
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <h3 className="flex min-w-0 items-center gap-2 text-base font-bold text-zinc-900 sm:text-lg">
                    <Icon
                      aria-hidden="true"
                      className={`h-5 w-5 shrink-0 ${isMatch ? "text-blue-700" : "text-zinc-600"}`}
                    />
                    <span className="min-w-0">
                      <span className="font-normal text-zinc-600">Tier {tier.level} — </span>
                      {tier.label}
                    </span>
                  </h3>
                  {isMatch && (
                    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-blue-700 px-3 py-1 text-xs font-semibold text-white">
                      <CheckCircle2 aria-hidden="true" className="h-3.5 w-3.5" />
                      Matches your situation
                    </span>
                  )}
                </div>

                <p className="mt-2 text-sm font-normal leading-relaxed text-zinc-700">{tier.summary}</p>

                <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">
                  <a
                    href={`mailto:${tier.email}`}
                    className={`inline-flex min-w-0 items-center gap-1.5 rounded text-sm font-semibold text-blue-800 underline decoration-blue-800/40 underline-offset-2 hover:text-blue-900 ${FOCUS_RING}`}
                  >
                    <Mail aria-hidden="true" className="h-4 w-4 shrink-0" />
                    <span className="break-all">{tier.email}</span>
                  </a>
                  {tier.phone && (
                    <a
                      href={`tel:${tier.phone}`}
                      className={`inline-flex items-center gap-1.5 rounded text-sm font-semibold tabular-nums text-blue-800 underline decoration-blue-800/40 underline-offset-2 hover:text-blue-900 ${FOCUS_RING}`}
                    >
                      <Phone aria-hidden="true" className="h-4 w-4 shrink-0" />
                      {tier.phoneLabel}
                    </a>
                  )}
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5">
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-900">
                    <Timer aria-hidden="true" className="h-4 w-4 shrink-0 text-zinc-600" />
                    {tier.slaLabel}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-sm font-normal text-zinc-600">
                    <Users aria-hidden="true" className="h-4 w-4 shrink-0 text-zinc-600" />
                    {tier.queueLabel}
                  </span>
                </div>

                <p className="mt-3 text-sm font-normal leading-relaxed text-zinc-700">
                  <span className="font-semibold text-zinc-900">{tier.owner}</span> — {tier.ownerRole}.{" "}
                  {tier.ownerNote}
                </p>

                <p className="mt-3 border-t border-zinc-200 pt-3 text-xs font-normal leading-relaxed text-zinc-600">
                  <span className="font-semibold text-zinc-700">Breaks when: </span>
                  {tier.breaksWhen}
                </p>

                {next && (
                  <p className="mt-3 text-xs font-normal text-zinc-600">
                    Past that window without an answer? Go to{" "}
                    <span className="font-semibold text-zinc-700">
                      Tier {next.level} — {next.label}
                    </span>
                    , not back to this desk.
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
