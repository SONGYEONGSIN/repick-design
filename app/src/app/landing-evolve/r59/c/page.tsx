import type { Metadata } from "next";

import Client from "./Client";

export const metadata: Metadata = {
  title: "Repick — See the trust breakdown",
  description:
    "Toggle any of five inspection categories and switch between Standard and Strict weighting to watch the Trust Score, its per-category point bars, and the closing summary recompute together, with both modes capped at the same 100-point maximum.",
};

export default function Page() {
  return <Client />;
}
