import type { Metadata } from "next";

import Client from "./Client";

export const metadata: Metadata = {
  title: "Repick — Trade-in triage",
  description:
    "Two sequential branching questions, where the second genuinely depends on the first, light up a live path through a fixed triage tree, ending in a channel and price range that a third toggle (urgency) can swap.",
};

export default function Page() {
  return <Client />;
}
