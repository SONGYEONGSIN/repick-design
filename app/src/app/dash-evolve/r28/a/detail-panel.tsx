"use client";

import { Pin, PinOff, Users, MapPin, ArrowRight, CircleDot } from "lucide-react";
import {
  getDay, fmtDateLong, fmtDateShort, fmtCurrency, fmtCompactCurrency,
  type DayRecord,
} from "./data";
import { Card, SectionHeading, ProgressBar, RiskBadge, FOCUS_RING } from "./ui";

export function DayDetailPanel({
  record, previewDate, pinned, onTogglePin, onJumpToTable,
}: {
  record: DayRecord;
  previewDate: string | null;
  pinned: boolean;
  onTogglePin: () => void;
  onJumpToTable: () => void;
}) {
  const preview = previewDate && previewDate !== record.date ? getDay(previewDate) : null;

  return (
    <Card>
      <SectionHeading title="Day detail" />

      <div aria-live="polite" className="mb-3 min-h-[1.5rem]">
        {preview && (
          <p className="flex items-center gap-1.5 rounded-lg border border-dashed border-zinc-300 bg-zinc-50 px-3 py-2 text-xs font-normal text-zinc-600">
            <CircleDot aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-zinc-400" />
            Previewing {fmtDateShort(preview.date)}: {preview.isOpen ? `${preview.utilizationPct}% booked, ${fmtCompactCurrency(preview.revenue)}` : "closed"}
          </p>
        )}
      </div>

      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-base font-bold text-zinc-900">{fmtDateLong(record.date)}</p>
          <p className="text-xs font-normal text-zinc-500">
            {record.isOpen ? `${record.appointmentsCount} appointments booked` : "Closed — no appointments scheduled"}
          </p>
        </div>
        <button
          type="button"
          onClick={onTogglePin}
          aria-pressed={pinned}
          disabled={!record.isOpen}
          className={`flex shrink-0 items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium ${FOCUS_RING} disabled:pointer-events-none disabled:opacity-40 ${
            pinned ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-200 text-zinc-600 hover:bg-zinc-50"
          }`}
        >
          {pinned ? <PinOff aria-hidden="true" className="h-3.5 w-3.5 shrink-0" /> : <Pin aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />}
          {pinned ? "Unpin" : "Pin day"}
        </button>
      </div>

      {!record.isOpen ? (
        <p className="rounded-lg bg-zinc-50 px-3 py-6 text-center text-sm font-normal text-zinc-500">
          BrightPath locations are closed on Sundays.
        </p>
      ) : (
        <div className="space-y-5">
          <div className="grid grid-cols-3 gap-3">
            <Stat label="Booked" value={`${record.utilizationPct}%`} />
            <Stat label="Revenue" value={fmtCompactCurrency(record.revenue)} />
            <Stat label="SLA risk" value={`${record.riskScore}`} />
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between text-xs font-medium text-zinc-600">
              <span>Capacity booked</span>
              <span>{record.utilizationPct}%</span>
            </div>
            <ProgressBar value={record.utilizationPct} />
          </div>

          <RiskBadge level={record.riskLevel} />

          <div>
            <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-zinc-600">
              <Users aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
              Staffing: {record.staffScheduled} of {record.staffNeeded} providers scheduled
            </div>
            {record.staffScheduled < record.staffNeeded && (
              <p className="text-xs font-normal text-orange-800">Understaffed for expected volume today.</p>
            )}
          </div>

          <div>
            <h3 className="mb-2 flex items-center gap-1.5 text-xs font-medium text-zinc-600">
              <MapPin aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
              By location
            </h3>
            <ul className="space-y-2">
              {record.locations.map((loc) => (
                <li key={loc.location} className="flex items-center gap-2.5">
                  <span className="w-16 shrink-0 truncate text-xs font-medium text-zinc-700">{loc.location}</span>
                  <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-100">
                    <span className="block h-full rounded-full bg-orange-400" style={{ width: `${loc.sharePct}%` }} />
                  </span>
                  <span className="w-10 shrink-0 whitespace-nowrap text-right text-xs font-normal text-zinc-500">{loc.bookings}</span>
                  <span className="w-16 shrink-0 whitespace-nowrap text-right text-xs font-normal text-zinc-500">{fmtCurrency(loc.revenue)}</span>
                </li>
              ))}
            </ul>
          </div>

          <button
            type="button"
            onClick={onJumpToTable}
            className={`flex w-full items-center justify-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-2.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 ${FOCUS_RING}`}
          >
            View all {record.appointmentsCount} appointments
            <ArrowRight aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
          </button>
        </div>
      )}
    </Card>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-zinc-50 px-3 py-2.5">
      <p className="text-xs font-normal text-zinc-500">{label}</p>
      <p className="mt-0.5 text-base font-bold text-zinc-900">{value}</p>
    </div>
  );
}

export function PinnedCompareStrip({
  pinnedDates, onRemove, onSelect, selectedDate,
}: {
  pinnedDates: string[];
  onRemove: (date: string) => void;
  onSelect: (date: string) => void;
  selectedDate: string;
}) {
  return (
    <Card>
      <SectionHeading title={`Pinned days (${pinnedDates.length}/3)`} />
      {pinnedDates.length === 0 ? (
        <p className="text-xs font-normal text-zinc-500">
          Pin up to three days from the detail panel above to compare them side by side.
        </p>
      ) : (
        <ul className="space-y-2">
          {pinnedDates.map((date) => {
            const rec = getDay(date);
            return (
              <li key={date}>
                <div
                  className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 ${
                    date === selectedDate ? "border-zinc-900" : "border-zinc-200"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => onSelect(date)}
                    className={`min-w-0 flex-1 text-left ${FOCUS_RING}`}
                  >
                    <span className="block truncate text-sm font-medium text-zinc-900">{fmtDateShort(date)}</span>
                    <span className="block text-xs font-normal text-zinc-500">
                      {rec.utilizationPct}% booked · {fmtCompactCurrency(rec.revenue)} · risk {rec.riskScore}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onRemove(date)}
                    aria-label={`Remove ${fmtDateShort(date)} from comparison`}
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 ${FOCUS_RING}`}
                  >
                    <PinOff aria-hidden="true" className="h-4 w-4" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
