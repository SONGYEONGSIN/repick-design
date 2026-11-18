"use client";

import { useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent, type RefObject } from "react";
import { X } from "lucide-react";
import { DAYS_IN_MONTH, ROOMS, TODAY_DAY, type RoomId } from "./data";
import { FOCUS_RING } from "./ui";

/** Real "New booking" form — not a decorative stub. Submitting a valid event name jumps the whole
 *  page's selected day to the chosen date (the same `selectedDay` every other widget reads), so
 *  the topbar's primary action actually drives the rest of the console instead of doing nothing. */
export function NewBookingModal({
  open,
  onClose,
  onCreate,
  triggerRef,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (day: number) => void;
  triggerRef: RefObject<HTMLButtonElement | null>;
}) {
  const [eventName, setEventName] = useState("");
  const [day, setDay] = useState<number>(TODAY_DAY);
  const [roomId, setRoomId] = useState<RoomId>(ROOMS[0].id);
  const [guests, setGuests] = useState(2);
  const [error, setError] = useState<string | null>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const titleId = useId();

  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setEventName("");
      setDay(TODAY_DAY);
      setRoomId(ROOMS[0].id);
      setGuests(2);
      setError(null);
    }
  }

  const wasOpenRef = useRef(false);
  useEffect(() => {
    if (open) {
      wasOpenRef.current = true;
      const frame = requestAnimationFrame(() => nameInputRef.current?.focus());
      return () => cancelAnimationFrame(frame);
    }
    if (wasOpenRef.current) {
      wasOpenRef.current = false;
      triggerRef.current?.focus();
    }
  }, [open, triggerRef]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (eventName.trim().length === 0) {
      setError("Event name is required.");
      nameInputRef.current?.focus();
      return;
    }
    onCreate(day);
    onClose();
  }

  const dayOptions = Array.from({ length: DAYS_IN_MONTH }, (_, i) => i + 1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <button type="button" aria-label="Close new booking form" onClick={onClose} className="absolute inset-0 bg-zinc-900/40" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onKeyDown={handleKeyDown}
        className="relative z-10 w-full min-w-0 max-w-md overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xl"
      >
        <div className="flex h-11 min-w-0 items-center justify-between gap-2 border-b border-zinc-200 px-4">
          <h2 id={titleId} className="truncate text-sm font-semibold text-zinc-900">
            New booking
          </h2>
          <button
            type="button"
            aria-label="Close new booking form"
            onClick={onClose}
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 ${FOCUS_RING}`}
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 p-4">
          <label className="min-w-0">
            <span className="mb-1 block text-xs font-medium text-zinc-700">Event name</span>
            <input
              ref={nameInputRef}
              type="text"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="e.g. Hendricks Wedding Reception"
              aria-invalid={error ? "true" : undefined}
              aria-describedby={error ? `${titleId}-error` : undefined}
              className={`h-11 w-full min-w-0 rounded-lg border bg-white px-3 text-sm text-zinc-900 placeholder:text-zinc-500 ${FOCUS_RING} ${
                error ? "border-red-300" : "border-zinc-200"
              }`}
            />
            {error ? (
              <span id={`${titleId}-error`} className="mt-1 block text-xs text-red-700">
                {error}
              </span>
            ) : null}
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="min-w-0">
              <span className="mb-1 block text-xs font-medium text-zinc-700">Date</span>
              <select
                value={day}
                onChange={(e) => setDay(Number(e.target.value))}
                className={`h-11 w-full min-w-0 rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 ${FOCUS_RING}`}
              >
                {dayOptions.map((d) => (
                  <option key={d} value={d}>
                    November {d}
                  </option>
                ))}
              </select>
            </label>
            <label className="min-w-0">
              <span className="mb-1 block text-xs font-medium text-zinc-700">Room</span>
              <select
                value={roomId}
                onChange={(e) => setRoomId(e.target.value as RoomId)}
                className={`h-11 w-full min-w-0 rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 ${FOCUS_RING}`}
              >
                {ROOMS.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="min-w-0 max-w-[140px]">
            <span className="mb-1 block text-xs font-medium text-zinc-700">Guest count</span>
            <input
              type="number"
              min={1}
              max={300}
              value={guests}
              onChange={(e) => setGuests(Math.max(1, Math.min(300, Number(e.target.value) || 1)))}
              className={`h-11 w-full min-w-0 rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 [font-feature-settings:'tnum'] tabular-nums ${FOCUS_RING}`}
            />
          </label>

          <div className="mt-1 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className={`flex h-11 shrink-0 items-center rounded-lg border border-zinc-200 px-4 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 motion-reduce:transition-none ${FOCUS_RING}`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`flex h-11 shrink-0 items-center rounded-lg bg-orange-700 px-4 text-sm font-medium text-white transition-colors hover:bg-orange-800 active:bg-orange-900 motion-reduce:transition-none ${FOCUS_RING}`}
            >
              Create booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
