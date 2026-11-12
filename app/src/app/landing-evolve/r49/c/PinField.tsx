"use client";

import { Check, Clock3, MapPin } from "lucide-react";
import { DROP_POINTS, ZONE_PATH_D, FIELD_VIEW_W, FIELD_VIEW_H, statusFor, type Category, type DropPoint } from "./data";
import { ACCENT_FILL, FOCUS_RING, ON_ACCENT_FILL_TEXT, SURFACE_BORDER } from "./tokens";

/**
 * The hero's core device: an abstract, stylized field of individually-selectable location pins
 * (never a map SDK or tile image -- the background is one hand-drawn, flat-filled organic blob,
 * no roads/grid/coastline). Each pin is a real <button>, independently reachable by Tab, with
 * its own visible focus ring. Hover, focus, AND click/Enter/Space all set the same "active
 * point" state, so keyboard users get the identical live update that mouse users get.
 */
export default function PinField({
  activeId,
  onActivate,
  categoryFilter,
}: {
  activeId: string;
  onActivate: (id: string) => void;
  categoryFilter: Category | null;
}) {
  return (
    <div className="relative h-[168px] w-full rounded-2xl bg-white sm:h-[180px]">
      <svg
        viewBox={`0 0 ${FIELD_VIEW_W} ${FIELD_VIEW_H}`}
        preserveAspectRatio="none"
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
      >
        <path d={ZONE_PATH_D} fill="#FBEAEC" stroke="#F3D6DA" strokeWidth={0.6} />
      </svg>

      <div className="absolute inset-0">
        {DROP_POINTS.map((point) => (
          <Pin
            key={point.id}
            point={point}
            isActive={point.id === activeId}
            isDimmed={categoryFilter !== null && !point.categories.includes(categoryFilter)}
            onActivate={onActivate}
          />
        ))}
      </div>
    </div>
  );
}

function Pin({
  point,
  isActive,
  isDimmed,
  onActivate,
}: {
  point: DropPoint;
  isActive: boolean;
  isDimmed: boolean;
  onActivate: (id: string) => void;
}) {
  const status = statusFor(point);
  const StatusIcon = status === "busy" ? Clock3 : Check;

  return (
    <div
      className="group absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${point.x}%`, top: `${point.y}%` }}
    >
      <button
        type="button"
        aria-pressed={isActive}
        aria-label={`${point.name}, ${point.verified ? "verified partner" : "verification pending"}, ${status === "busy" ? "busy queue" : "available now"}${isDimmed ? ", does not accept the selected category" : ""}`}
        onMouseEnter={() => onActivate(point.id)}
        onFocus={() => onActivate(point.id)}
        onClick={() => onActivate(point.id)}
        className={`relative flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-200 motion-reduce:transition-none ${FOCUS_RING} ${
          isActive ? `scale-125 border-transparent ${ACCENT_FILL}` : `scale-100 ${SURFACE_BORDER} bg-white hover:scale-110 hover:border-[#F43F5E]`
        } ${isDimmed && !isActive ? "opacity-35" : "opacity-100"}`}
      >
        <MapPin className={`h-4 w-4 ${isActive ? ON_ACCENT_FILL_TEXT : "text-[#171717]"}`} aria-hidden="true" />
        <span
          className={`absolute -bottom-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full border bg-white ${
            status === "busy" ? "border-[#BE123C]" : "border-zinc-400"
          }`}
        >
          <StatusIcon className={`h-2 w-2 ${status === "busy" ? "text-[#BE123C]" : "text-zinc-600"}`} aria-hidden="true" />
        </span>
      </button>

      <span
        role="presentation"
        className={`pointer-events-none absolute left-1/2 top-full z-10 mt-1.5 -translate-x-1/2 whitespace-nowrap rounded-md border border-[#E7E3E3] bg-white px-2 py-0.5 text-[10px] font-semibold text-[#171717] opacity-0 shadow-sm transition-opacity duration-150 motion-reduce:transition-none group-hover:opacity-100 group-focus-within:opacity-100 ${
          isActive ? "opacity-100" : ""
        }`}
      >
        {point.name}
      </span>
    </div>
  );
}
