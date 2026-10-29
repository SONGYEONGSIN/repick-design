"use client";

import { useEffect, useState, type FormEvent } from "react";
import { X } from "lucide-react";
import { SERVICE_CATALOG, type Category, type Service } from "./data";

const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600";

export type NewReleaseInput = { title: string; env: "production" | "staging"; service: Omit<Service, "id"> };

/** The header's primary action button opens this real dialog and, on submit, actually prepends a
 *  new pending release to the queue (via onCreate, handled in the page) — not a dead CTA. */
export function NewReleaseDialog({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (input: NewReleaseInput) => void;
}) {
  const [title, setTitle] = useState("");
  const [serviceName, setServiceName] = useState(SERVICE_CATALOG[0].name);
  const [env, setEnv] = useState<"production" | "staging">("production");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    function onKey(ev: KeyboardEvent) {
      if (ev.key === "Escape" && open) onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!title.trim()) return;
    const svc = SERVICE_CATALOG.find((s) => s.name === serviceName) ?? SERVICE_CATALOG[0];
    onCreate({
      title: title.trim(),
      env,
      service: {
        name: svc.name,
        category: svc.category as Category,
        blastRadiusPct: svc.blastRadiusPct,
        riskScore: svc.riskScore,
        dependentsTouched: svc.dependentsTouched,
      },
    });
    setSubmitted(true);
  }

  function handleClose() {
    setSubmitted(false);
    setTitle("");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={handleClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="New release request"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-xl border border-zinc-200 bg-white p-5 shadow-xl"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-zinc-900">New release request</h2>
          <button type="button" onClick={handleClose} aria-label="Close" className={`flex-shrink-0 rounded p-1 text-zinc-500 hover:text-zinc-600 ${FOCUS_RING}`}>
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {submitted ? (
          <div className="mt-4">
            <p className="text-sm font-normal text-zinc-700">Request submitted and added to the pending queue for review.</p>
            <button
              type="button"
              onClick={handleClose}
              className={`mt-4 w-full rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white hover:bg-blue-700 ${FOCUS_RING}`}
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-3">
            <div>
              <label htmlFor="rel-title" className="text-xs font-medium text-zinc-700">
                Title
              </label>
              <input
                id="rel-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="e.g. Checkout flow — refund API fix"
                className={`mt-1 w-full rounded-lg border border-zinc-200 px-2.5 py-2 text-sm font-normal text-zinc-900 placeholder:text-zinc-500 ${FOCUS_RING}`}
              />
            </div>
            <div>
              <label htmlFor="rel-service" className="text-xs font-medium text-zinc-700">
                Primary service
              </label>
              <select
                id="rel-service"
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                className={`mt-1 w-full rounded-lg border border-zinc-200 px-2.5 py-2 text-sm font-normal text-zinc-900 ${FOCUS_RING}`}
              >
                {SERVICE_CATALOG.map((s) => (
                  <option key={s.name} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="rel-env" className="text-xs font-medium text-zinc-700">
                Environment
              </label>
              <select
                id="rel-env"
                value={env}
                onChange={(e) => setEnv(e.target.value as "production" | "staging")}
                className={`mt-1 w-full rounded-lg border border-zinc-200 px-2.5 py-2 text-sm font-normal text-zinc-900 ${FOCUS_RING}`}
              >
                <option value="production">Production</option>
                <option value="staging">Staging</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button type="button" onClick={handleClose} className={`rounded-lg px-3 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50 ${FOCUS_RING}`}>
                Cancel
              </button>
              <button type="submit" className={`rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white hover:bg-blue-700 ${FOCUS_RING}`}>
                Submit request
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
