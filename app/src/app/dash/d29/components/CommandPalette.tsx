"use client";

import { useEffect, useRef, useState } from "react";
import { CheckSquare, FolderKanban, Search, Users } from "lucide-react";
import { members, projects, tasks } from "../data";

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setQuery("");
      const id = window.setTimeout(() => inputRef.current?.focus(), 0);
      return () => window.clearTimeout(id);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !dialogRef.current) return;
      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'input, button, [href], [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
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
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const q = query.trim().toLowerCase();
  const matchedProjects = q ? projects.filter((p) => p.name.toLowerCase().includes(q)) : projects.slice(0, 4);
  const matchedTasks = q ? tasks.filter((t) => t.title.toLowerCase().includes(q)).slice(0, 5) : [];
  const matchedMembers = q ? members.filter((m) => m.name.toLowerCase().includes(q)) : [];
  const hasResults = matchedProjects.length + matchedTasks.length + matchedMembers.length > 0;

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center bg-zinc-900/40 px-4 pt-24 sm:pt-32">
      <button
        type="button"
        aria-label="Close command palette"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Quick search"
        className="relative w-full max-w-lg overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xl"
      >
        <div className="flex h-12 items-center gap-2.5 border-b border-zinc-100 px-4">
          <Search className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects, tasks, people…"
            aria-label="Search query"
            className="h-full flex-1 border-0 bg-transparent text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none"
          />
          <kbd className="shrink-0 rounded border border-zinc-200 px-1.5 py-0.5 text-[10px] font-medium text-zinc-400">
            ESC
          </kbd>
        </div>

        <div className="max-h-80 overflow-y-auto p-2">
          {!hasResults ? (
            <p className="px-3 py-6 text-center text-sm text-zinc-500">No results found.</p>
          ) : (
            <>
              {matchedProjects.length > 0 ? (
                <ResultGroup label="Projects">
                  {matchedProjects.map((p) => (
                    <ResultItem key={p.id} icon={FolderKanban} label={p.name} onClose={onClose} />
                  ))}
                </ResultGroup>
              ) : null}
              {matchedTasks.length > 0 ? (
                <ResultGroup label="Tasks">
                  {matchedTasks.map((t) => (
                    <ResultItem key={t.id} icon={CheckSquare} label={t.title} onClose={onClose} />
                  ))}
                </ResultGroup>
              ) : null}
              {matchedMembers.length > 0 ? (
                <ResultGroup label="People">
                  {matchedMembers.map((m) => (
                    <ResultItem key={m.id} icon={Users} label={`${m.name} · ${m.role}`} onClose={onClose} />
                  ))}
                </ResultGroup>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function ResultGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-1">
      <p className="px-3 py-1 text-[11px] font-semibold tracking-wide text-zinc-400 uppercase">{label}</p>
      <ul>{children}</ul>
    </div>
  );
}

function ResultItem({
  icon: Icon,
  label,
  onClose,
}: {
  icon: typeof FolderKanban;
  label: string;
  onClose: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onClose}
        className="flex min-h-[44px] w-full items-center gap-2.5 rounded-lg px-3 text-left text-sm text-zinc-700 hover:bg-zinc-50 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none"
      >
        <Icon className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
        <span className="truncate">{label}</span>
      </button>
    </li>
  );
}
