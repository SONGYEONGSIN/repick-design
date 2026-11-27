import type { Metadata } from "next";

import Client from "./Client";

export const metadata: Metadata = {
  title: "Repick — Scrub the inspection",
  description:
    "Drag a frame scrubber through five inspection checkpoints and watch the running deduction, final price, and overall confidence recompute at every stop, with a human-review toggle that overrides one specific check rather than applying a flat discount.",
};

export default function Page() {
  return <Client />;
}
