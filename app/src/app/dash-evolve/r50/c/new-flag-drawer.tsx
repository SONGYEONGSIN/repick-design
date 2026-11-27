"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import type { Environment, FeatureFlag } from "./types";
import { CURRENT_USER, ENVIRONMENT_LABEL } from "./data";
import { FOCUS_RING, SegmentedControl } from "./ui";

const ENV_OPTIONS: { value: Environment; label: string }[] = [
  { value: "production", label: ENVIRONMENT_LABEL.production },
  { value: "staging", label: ENVIRONMENT_LABEL.staging },
  { value: "development", label: ENVIRONMENT_LABEL.development },
];

/**
 * The topbar's primary action. It opens a real form and, on submit, inserts a genuine new flag
 * into the dashboard's flags state (visible immediately at the top of the flags table) — not an
 * inert button with no handler.
 */
export function NewFlagDrawer({
  open,
  onClose,
  onCreate,
  nextId,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (flag: FeatureFlag) => void;
  nextId: number;
}) {
  const [name, setName] = useState("");
  const [key, setKey] = useState("");
  const [environment, setEnvironment] = useState<Environment>("staging");
  const [rollout, setRollout] = useState(10);
  const [error, setError] = useState<string | null>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => nameRef.current?.focus(), 0);
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  function slugify(value: string): string {
    return value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function handleTab(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key !== "Tab") return;
    const focusable = panelRef.current?.querySelectorAll<HTMLElement>("input, button, select");
    if (!focusable || focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("Give the flag a name.");
      return;
    }
    const finalKey = key.trim() ? slugify(key) : slugify(trimmedName);
    onCreate({
      id: `flag-new-${nextId}`,
      key: finalKey,
      name: trimmedName,
      environment,
      status: "active",
      rollout,
      ownerName: CURRENT_USER.name,
      ownerPhotoId: CURRENT_USER.photoId,
      updatedHoursAgo: 0,
      experimentId: null,
    });
    setName("");
    setKey("");
    setEnvironment("staging");
    setRollout(10);
    setError(null);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end" onKeyDown={handleTab}>
      <button type="button" aria-label="Close new flag panel" onClick={onClose} className="absolute inset-0 bg-zinc-900/40" />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-flag-title"
        className="relative flex h-full w-full max-w-sm flex-col bg-white shadow-2xl motion-safe:animate-[rise_200ms_ease-out]"
      >
        <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4">
          <h2 id="new-flag-title" className="text-[15px] font-semibold text-zinc-900">
            New feature flag
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className={`flex h-9 w-9 items-center justify-center rounded-lg text-zinc-500 transition-colors duration-150 ease-out hover:bg-zinc-100 ${FOCUS_RING}`}
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-4 overflow-y-auto px-5 py-5">
          <label className="block">
            <span className="mb-1.5 block text-[11px] font-semibold tracking-wide text-zinc-500 uppercase">Name</span>
            <input
              ref={nameRef}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Checkout CTA green accent"
              className={`h-10 w-full rounded-lg border border-zinc-200 px-3 text-[13px] font-normal text-zinc-900 placeholder:text-zinc-400 ${FOCUS_RING}`}
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-[11px] font-semibold tracking-wide text-zinc-500 uppercase">Flag key</span>
            <input
              type="text"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="auto-generated from name if left blank"
              className={`h-10 w-full rounded-lg border border-zinc-200 px-3 text-[13px] font-normal text-zinc-900 placeholder:text-zinc-400 ${FOCUS_RING}`}
            />
          </label>

          <div>
            <span className="mb-1.5 block text-[11px] font-semibold tracking-wide text-zinc-500 uppercase">Environment</span>
            <SegmentedControl options={ENV_OPTIONS} value={environment} onChange={setEnvironment} ariaLabel="Environment" />
          </div>

          <label className="block">
            <span className="mb-1.5 flex items-baseline justify-between text-[11px] font-semibold tracking-wide text-zinc-500 uppercase">
              <span>Initial rollout</span>
              <span className="font-normal text-zinc-700 tabular-nums normal-case">{rollout}%</span>
            </span>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={rollout}
              onChange={(e) => setRollout(Number(e.target.value))}
              className={`h-2 w-full cursor-pointer accent-emerald-600 ${FOCUS_RING}`}
            />
          </label>

          {error && <p className="text-[12px] font-normal text-rose-700">{error}</p>}

          <div className="mt-auto flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className={`h-10 flex-1 rounded-lg border border-zinc-200 text-[13px] font-semibold text-zinc-700 transition-colors duration-150 ease-out hover:bg-zinc-50 ${FOCUS_RING}`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`h-10 flex-1 rounded-lg bg-emerald-700 text-[13px] font-semibold text-white transition-colors duration-150 ease-out hover:bg-emerald-800 ${FOCUS_RING}`}
            >
              Create flag
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
