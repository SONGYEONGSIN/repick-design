"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CheckCircle2, X } from "lucide-react";
import { FOCUS } from "./ui";

export interface Toast {
  id: number;
  message: string;
}

export function ToastStack({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: number) => void }) {
  const reduceMotion = useReducedMotion();
  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-4 bottom-4 z-[80] flex flex-col items-stretch gap-2 sm:inset-x-auto sm:right-4 sm:items-end"
    >
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduceMotion ? 0 : 10 }}
            transition={{ duration: reduceMotion ? 0 : 0.18 }}
            className="pointer-events-auto flex w-full min-w-0 max-w-sm items-start gap-2.5 rounded-xl border border-white/10 bg-zinc-900 p-3 shadow-2xl shadow-black/50"
          >
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-violet-500" aria-hidden="true" />
            <p className="min-w-0 flex-1 text-sm font-normal text-zinc-50">{t.message}</p>
            <button
              type="button"
              onClick={() => onDismiss(t.id)}
              aria-label="Dismiss notification"
              className={`${FOCUS} flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-zinc-400 hover:text-zinc-50`}
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
