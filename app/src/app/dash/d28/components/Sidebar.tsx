"use client";

import { Rocket, LayoutGrid, Waypoints, Radar, Fuel, CloudLightning, History, X } from "lucide-react";
import type { RefObject } from "react";
import { FOCUS } from "./focus";

const NAV_ITEMS = [
  { href: "#overview", label: "Overview", icon: LayoutGrid },
  { href: "#timeline", label: "T-Timeline", icon: Waypoints },
  { href: "#poll-board", label: "Poll Board", icon: Radar },
  { href: "#propellant", label: "Propellant", icon: Fuel },
  { href: "#weather", label: "Weather", icon: CloudLightning },
  { href: "#history", label: "Hold / Recycle Log", icon: History },
];

function BrandMark() {
  return (
    <div className="flex items-center gap-2.5 px-1">
      <span
        aria-hidden="true"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border"
        style={{ borderColor: "var(--hf-border-strong)", background: "var(--hf-panel-2)" }}
      >
        <Rocket className="h-4 w-4" style={{ color: "var(--hf-accent)" }} />
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-mono text-[13px] font-bold uppercase tracking-[0.08em]" style={{ color: "var(--hf-text)" }}>
          Holdfire
        </span>
        <span className="mt-1 text-[10px] uppercase tracking-[0.12em]" style={{ color: "var(--hf-text-3)" }}>
          Launch Ops Console
        </span>
      </span>
    </div>
  );
}

/** Desktop icon rail — persistent primary navigation landmark. */
export function DesktopRail() {
  return (
    <nav
      aria-label="Primary"
      className="hidden w-16 shrink-0 flex-col items-center gap-1 border-r py-4 lg:flex"
      style={{ borderColor: "var(--hf-border)", background: "var(--hf-bg)" }}
    >
      <a
        href="#overview"
        className={`mb-4 flex h-11 w-11 items-center justify-center rounded-md ${FOCUS}`}
        aria-label="Holdfire — jump to overview"
      >
        <Rocket className="h-5 w-5" style={{ color: "var(--hf-accent)" }} aria-hidden="true" />
      </a>
      <ul className="flex flex-col items-center gap-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
          <li key={href}>
            <a
              href={href}
              className={`flex h-11 w-11 items-center justify-center rounded-md border border-transparent transition-colors hover:border-[var(--hf-border-strong)] hover:bg-[var(--hf-panel)] ${FOCUS}`}
              style={{ color: "var(--hf-text-2)" }}
              aria-label={label}
            >
              <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** Mobile navigation drawer — native <dialog> gives focus trap + Escape-to-close for free. */
export function MobileDrawer({ dialogRef }: { dialogRef: RefObject<HTMLDialogElement | null> }) {
  return (
    <dialog
      ref={dialogRef}
      aria-label="Primary navigation"
      className="m-0 h-dvh max-h-none w-72 max-w-[80vw] border-0 p-0 backdrop:bg-black/60"
      style={{ background: "var(--hf-bg)", color: "var(--hf-text)", left: 0, top: 0 }}
    >
      <div className="flex h-full flex-col gap-6 border-r p-4" style={{ borderColor: "var(--hf-border)" }}>
        <div className="flex items-center justify-between">
          <BrandMark />
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-md ${FOCUS}`}
            style={{ color: "var(--hf-text-2)" }}
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <ul className="flex flex-col gap-1">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
            <li key={href}>
              <a
                href={href}
                onClick={() => dialogRef.current?.close()}
                className={`flex min-h-11 items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-[var(--hf-panel)] ${FOCUS}`}
                style={{ color: "var(--hf-text)" }}
              >
                <Icon className="h-[18px] w-[18px] shrink-0" style={{ color: "var(--hf-text-3)" }} aria-hidden="true" />
                {label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </dialog>
  );
}
