import type { Metadata } from "next";

import Client from "./Client";

export const metadata: Metadata = {
  title: "Repick — Coverage named by combination, not count",
  description:
    "Toggle three independent add-ons — Shield Guard, Loss Watch, Resale Lock — and watch a combination-keyed tier name and itemized price breakdown recompute live, with Shield+Resale Lock resolving to a different tier than Shield+Loss Watch even though both are two of three on.",
};

export default function Page() {
  return <Client />;
}
