import type { Metadata } from "next";
import PilotClient from "./pilot-client";

// Feasibility probe (not a catalog work): can dala-grade scroll/pointer choreography clear the
// existing hard gate unchanged? Deliberately unlisted in works.ts — it is a measurement, not a specimen.
export const metadata: Metadata = {
  title: "Motion pilot — pointer-driven choreography",
  description:
    "A feasibility probe for rich scroll and pointer interaction under the existing craft gate: no time-based or random values, so static checks pass and screenshots stay reproducible.",
};

export default function MotionPilotPage() {
  return <PilotClient />;
}
