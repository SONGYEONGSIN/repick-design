"use client";

import { useEffect, useState } from "react";
import { ArrowRight, LifeBuoy, Search, Activity } from "lucide-react";

/* ------------------------------------------------------------------ */
/* Typographic archetype — the numerals ARE the page. Zero imagery,   */
/* zero decoration. A single staggered reveal is the only motion, and */
/* it is gated behind prefers-reduced-motion via the mount flag below.*/
/* ------------------------------------------------------------------ */

const DIGITS = ["4", "0", "4"] as const;

const SECONDARY_LINKS = [
  { label: "Search docs", href: "https://docs.rivet.dev/search", icon: Search },
  { label: "Status page", href: "https://status.rivet.dev", icon: Activity },
  { label: "Contact support", href: "mailto:support@rivet.dev", icon: LifeBuoy },
];

export default function NotFoundClient() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex min-h-dvh flex-col bg-neutral-950 text-neutral-100">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-6 sm:px-10">
        <span className="text-sm font-medium tracking-tight text-neutral-100">Rivet</span>
        <nav aria-label="Quick links" className="flex items-center gap-5">
          <a
            href="https://docs.rivet.dev"
            className="text-sm font-normal text-neutral-400 transition-colors hover:text-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 rounded"
          >
            Docs
          </a>
          <a
            href="https://status.rivet.dev"
            className="text-sm font-normal text-neutral-400 transition-colors hover:text-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 rounded"
          >
            Status
          </a>
        </nav>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-6 py-16 text-center sm:px-10">
        <div
          className="flex select-none items-baseline gap-1 font-mono text-[5.5rem] font-semibold leading-none tracking-tighter text-neutral-100 sm:text-[8rem] md:text-[10rem]"
          aria-hidden="true"
        >
          {DIGITS.map((digit, index) => (
            <span
              key={`${digit}-${index}`}
              className={`inline-block tabular-nums transition-all duration-500 ease-out motion-reduce:transition-none motion-reduce:transform-none motion-reduce:opacity-100 ${
                mounted ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
              } ${index === 1 ? "text-amber-400" : ""}`}
              style={{ transitionDelay: mounted ? `${index * 90}ms` : "0ms" }}
            >
              {digit}
            </span>
          ))}
        </div>

        <h1 className="mt-8 text-2xl font-semibold tracking-tight text-neutral-100 sm:text-3xl">
          This page moved or never existed.
        </h1>
        <p className="mt-3 max-w-md text-sm font-normal leading-relaxed text-neutral-400">
          The route you followed doesn&apos;t resolve to anything in Rivet. It may have been
          renamed, or the link was copied from an older release.
        </p>

        <a
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-lg bg-amber-400 px-5 py-2.5 text-sm font-semibold text-neutral-950 shadow-sm transition-colors hover:bg-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
        >
          Back to dashboard
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </a>

        <nav aria-label="Alternative paths" className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
          {SECONDARY_LINKS.map(({ label, href, icon: Icon }) => (
            <a
              key={label}
              href={href}
              className="inline-flex items-center gap-1.5 text-sm font-normal text-neutral-400 transition-colors hover:text-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 rounded"
            >
              <Icon className="h-3.5 w-3.5 flex-none" aria-hidden="true" />
              {label}
            </a>
          ))}
        </nav>
      </main>
    </div>
  );
}
