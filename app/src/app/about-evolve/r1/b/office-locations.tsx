"use client";

import { useState } from "react";
import { List, Map as MapIcon, MapPin, Users } from "lucide-react";
import { OFFICES } from "./data";

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2 focus-visible:ring-offset-white";

type ViewMode = "list" | "map";

export function OfficeLocations() {
  const [view, setView] = useState<ViewMode>("list");
  const pinned = OFFICES.filter((o) => !o.isRemote);
  const remote = OFFICES.find((o) => o.isRemote);

  return (
    <div>
      <div
        role="group"
        aria-label="Office view"
        className="mb-6 inline-flex rounded-full border border-zinc-300 bg-zinc-100 p-1"
      >
        <button
          type="button"
          aria-pressed={view === "list"}
          onClick={() => setView("list")}
          className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${FOCUS_RING} ${
            view === "list"
              ? "bg-white text-zinc-900 shadow-sm"
              : "text-zinc-600 hover:text-zinc-900"
          }`}
        >
          <List className="h-4 w-4" aria-hidden="true" />
          List
        </button>
        <button
          type="button"
          aria-pressed={view === "map"}
          onClick={() => setView("map")}
          className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${FOCUS_RING} ${
            view === "map"
              ? "bg-white text-zinc-900 shadow-sm"
              : "text-zinc-600 hover:text-zinc-900"
          }`}
        >
          <MapIcon className="h-4 w-4" aria-hidden="true" />
          Map
        </button>
      </div>

      {view === "list" ? (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {OFFICES.map((office) => (
            <li
              key={office.id}
              className="min-w-0 rounded-2xl border border-zinc-200 bg-white p-5"
            >
              <div className="flex items-center gap-2 text-zinc-900">
                <MapPin className="h-4 w-4 shrink-0 text-teal-700" aria-hidden="true" />
                <h3 className="font-medium">{office.city}</h3>
              </div>
              <p className="mt-1 text-sm text-zinc-600">{office.region}</p>
              <p className="mt-3 text-sm font-normal leading-relaxed text-zinc-700">{office.note}</p>
              <p className="mt-3 flex items-center gap-1.5 text-sm text-zinc-600">
                <Users className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span className="tabular-nums">{office.headcount}</span> people
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <div>
          <div className="aspect-[16/9] w-full min-w-0 overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50 sm:aspect-[2/1]">
            <svg
              viewBox="0 0 100 56"
              className="h-full w-full"
              role="img"
              aria-label="Schematic map showing Tallwood office locations in Boston, Lisbon and Singapore"
            >
              <title>Tallwood office locations (schematic, not to scale)</title>
              {Array.from({ length: 6 }).map((_, i) => (
                <line
                  key={`v-${i}`}
                  x1={(i + 1) * 14.28}
                  y1="0"
                  x2={(i + 1) * 14.28}
                  y2="56"
                  stroke="#e4e4e7"
                  strokeWidth="0.4"
                />
              ))}
              {Array.from({ length: 3 }).map((_, i) => (
                <line
                  key={`h-${i}`}
                  x1="0"
                  y1={(i + 1) * 14}
                  x2="100"
                  y2={(i + 1) * 14}
                  stroke="#e4e4e7"
                  strokeWidth="0.4"
                />
              ))}
              {pinned.map((office) => {
                const cx = office.x;
                const cy = office.y * 0.56;
                return (
                  <g key={office.id}>
                    <circle cx={cx} cy={cy} r="1.6" fill="#0f766e" />
                    <circle
                      cx={cx}
                      cy={cy}
                      r="3.4"
                      fill="none"
                      stroke="#0f766e"
                      strokeWidth="0.3"
                      opacity="0.5"
                    />
                    <text
                      x={cx}
                      y={cy - 4}
                      textAnchor="middle"
                      fontSize="3.2"
                      fill="#18181b"
                      fontFamily="var(--font-sans)"
                      fontWeight="500"
                    >
                      {office.city.split(",")[0]}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
          <p className="mt-2 text-xs text-zinc-600">
            Schematic layout, not a precise map projection.
          </p>
          {remote ? (
            <p className="mt-4 flex items-center gap-1.5 text-sm text-zinc-700">
              <Users className="h-4 w-4 shrink-0 text-teal-700" aria-hidden="true" />
              Plus{" "}
              <span className="tabular-nums font-medium text-zinc-900">
                {remote.headcount}
              </span>{" "}
              {remote.note.toLowerCase()}
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
}
