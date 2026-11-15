"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { User, Settings, LogOut } from "lucide-react";
import { FOCUS } from "./ui";
import { PERSON_BY_ID } from "./data";

export function UserMenu() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const user = PERSON_BY_ID.get("jordan")!;

  useEffect(() => {
    if (!open) return;
    function onDocPointer(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative flex-shrink-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className={`flex flex-shrink-0 items-center gap-2 rounded-full p-0.5 ${FOCUS}`}
      >
        <span className="sr-only">Open account menu</span>
        <Image
          src={`https://images.unsplash.com/photo-${user.photoId}?q=80&w=96&auto=format&fit=crop`}
          alt={`Portrait of ${user.name}`}
          width={28}
          height={28}
          className="h-7 w-7 flex-shrink-0 rounded-full object-cover"
        />
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Account menu"
          className="absolute right-0 top-full z-40 mt-2 w-52 rounded-lg border border-zinc-200 bg-white p-1.5 shadow-lg"
        >
          <div className="border-b border-zinc-100 px-2.5 py-2">
            <p className="truncate text-sm font-medium text-zinc-900">{user.name}</p>
            <p className="truncate text-xs font-normal text-zinc-500">{user.role}</p>
          </div>
          <button
            type="button"
            role="menuitem"
            onClick={() => setOpen(false)}
            className={`mt-1 flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-sm font-normal text-zinc-700 hover:bg-zinc-50 ${FOCUS}`}
          >
            <User className="h-4 w-4 flex-shrink-0 text-zinc-500" aria-hidden="true" />
            Profile
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() => setOpen(false)}
            className={`flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-sm font-normal text-zinc-700 hover:bg-zinc-50 ${FOCUS}`}
          >
            <Settings className="h-4 w-4 flex-shrink-0 text-zinc-500" aria-hidden="true" />
            Settings
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() => setOpen(false)}
            className={`flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-sm font-normal text-zinc-700 hover:bg-zinc-50 ${FOCUS}`}
          >
            <LogOut className="h-4 w-4 flex-shrink-0 text-zinc-500" aria-hidden="true" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
