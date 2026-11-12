"use client";

import { BadgeCheck, Check, Clock3, ShieldAlert, Users } from "lucide-react";
import { statusFor, type DropPoint } from "./data";
import { ACCENT_TEXT, MUTED_TEXT, STAT_LABEL } from "./tokens";

/**
 * The live proof panel a selected pin reveals: processing time, categories accepted, current
 * queue length, and a trust/verification badge. `aria-live="polite"` sits directly on this
 * container (not a hidden duplicate) so a screen-reader user tabbing through the pin field hears
 * the new location's detail the moment focus lands on a different pin -- not a silent DOM swap.
 */
export default function LocationPanel({ point }: { point: DropPoint }) {
  const status = statusFor(point);
  const StatusIcon = status === "busy" ? Clock3 : Check;

  return (
    <div aria-live="polite" className="rounded-xl border border-[#E7E3E3] bg-white p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-extrabold leading-tight text-[#171717]">{point.name}</p>
        <span
          className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.06em] ${
            point.verified ? `border-[#F3D6DA] ${ACCENT_TEXT}` : "border-zinc-300 text-zinc-600"
          }`}
        >
          {point.verified ? <BadgeCheck className="h-3 w-3" aria-hidden="true" /> : <ShieldAlert className="h-3 w-3" aria-hidden="true" />}
          {point.verified ? "Verified partner" : "Verification pending"}
        </span>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5">
        <span className="flex items-center gap-1 text-xs font-semibold text-[#171717]">
          <Clock3 className="h-3.5 w-3.5 shrink-0 text-zinc-500" aria-hidden="true" />
          <span className="tabular-nums">{point.processingHours}h</span> typical processing
        </span>
        <span className="flex items-center gap-1 text-xs font-semibold text-[#171717]">
          <Users className="h-3.5 w-3.5 shrink-0 text-zinc-500" aria-hidden="true" />
          <span className="tabular-nums">{point.queueAhead}</span> ahead in queue
        </span>
        <span className={`flex items-center gap-1 text-xs font-semibold ${status === "busy" ? "text-[#BE123C]" : "text-zinc-600"}`}>
          <StatusIcon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {status === "busy" ? "Busy right now" : "Available now"}
        </span>
      </div>

      <div className="mt-2">
        <p className={`${STAT_LABEL} ${MUTED_TEXT}`}>Accepted here</p>
        <div className="mt-1 flex flex-wrap gap-1">
          {point.categories.map((c) => (
            <span key={c} className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-semibold text-[#171717]">
              {c}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
