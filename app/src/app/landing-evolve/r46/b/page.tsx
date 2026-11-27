import type { Metadata } from "next";
import { LandingClient } from "./LandingClient";

export const metadata: Metadata = {
  title: "repick — the listing writes itself",
  description:
    "Pick a tone and a category and watch repick generate a complete, ready-to-post secondhand listing in real time.",
};

export default function Page() {
  return (
    <>
      {/* Safety net for prefers-reduced-motion: Reveal.tsx already gates its own animation
          props through a mount-correct useSyncExternalStore hook, but that still needs one
          React render to resolve. This plain CSS media query is evaluated at paint time, before
          any JavaScript runs, so a reduced-motion visitor never sees even a brief flash of
          opacity: 0 while the page hydrates. */}
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          [data-reveal] {
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>
      <LandingClient />
    </>
  );
}
