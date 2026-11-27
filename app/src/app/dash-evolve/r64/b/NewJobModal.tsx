"use client";

import { useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent, type RefObject } from "react";
import { X } from "lucide-react";
import { TECHNICIANS, type Priority, type TechnicianId } from "./data";
import { FOCUS_RING } from "./ui";

/** Real "New job" form — not a decorative stub. Submitting a valid title assigns it to the chosen
 *  technician and pins that technician, which opens the same detail drawer a column/row-header pin
 *  does — so the topbar's primary action actually drives the rest of the console. */
export function NewJobModal({
  open,
  onClose,
  onAssign,
  triggerRef,
}: {
  open: boolean;
  onClose: () => void;
  onAssign: (tech: TechnicianId) => void;
  triggerRef: RefObject<HTMLButtonElement | null>;
}) {
  const [title, setTitle] = useState("");
  const [tech, setTech] = useState<TechnicianId>(TECHNICIANS[0].id);
  const [priority, setPriority] = useState<Priority>("standard");
  const [error, setError] = useState<string | null>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const titleId = useId();

  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setTitle("");
      setTech(TECHNICIANS[0].id);
      setPriority("standard");
      setError(null);
    }
  }

  const wasOpenRef = useRef(false);
  useEffect(() => {
    if (open) {
      wasOpenRef.current = true;
      const frame = requestAnimationFrame(() => titleInputRef.current?.focus());
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
    if (title.trim().length === 0) {
      setError("Job title is required.");
      titleInputRef.current?.focus();
      return;
    }
    onAssign(tech);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <button type="button" aria-label="Close new job form" onClick={onClose} className="absolute inset-0 bg-zinc-900/40" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onKeyDown={handleKeyDown}
        className="relative z-10 w-full min-w-0 max-w-md overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xl"
      >
        <div className="flex h-11 min-w-0 items-center justify-between gap-2 border-b border-zinc-200 px-4">
          <h2 id={titleId} className="truncate text-sm font-semibold text-zinc-900">
            New job
          </h2>
          <button
            type="button"
            aria-label="Close new job form"
            onClick={onClose}
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 ${FOCUS_RING}`}
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 p-4">
          <label className="min-w-0">
            <span className="mb-1 block text-xs font-medium text-zinc-700">Job title</span>
            <input
              ref={titleInputRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Water heater replacement"
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
              <span className="mb-1 block text-xs font-medium text-zinc-700">Technician</span>
              <select
                value={tech}
                onChange={(e) => setTech(e.target.value as TechnicianId)}
                className={`h-11 w-full min-w-0 rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 ${FOCUS_RING}`}
              >
                {TECHNICIANS.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="min-w-0">
              <span className="mb-1 block text-xs font-medium text-zinc-700">Priority</span>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className={`h-11 w-full min-w-0 rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 ${FOCUS_RING}`}
              >
                <option value="standard">Standard</option>
                <option value="urgent">Urgent</option>
              </select>
            </label>
          </div>

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
              className={`flex h-11 shrink-0 items-center rounded-lg bg-green-700 px-4 text-sm font-medium text-white transition-colors hover:bg-green-800 active:bg-green-900 motion-reduce:transition-none ${FOCUS_RING}`}
            >
              Assign job
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
