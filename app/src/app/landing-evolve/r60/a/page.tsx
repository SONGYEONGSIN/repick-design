import type { Metadata } from "next";

import Client from "./Client";

export const metadata: Metadata = {
  title: "Repick — Time your resale",
  description:
    "Drag one dial across a 180-day window and watch a deterministic price-decay curve redraw live, with a named peak window, a recommendation sentence, and a verified-condition-certificate toggle that rescales the entire projection.",
};

export default function Page() {
  return <Client />;
}
