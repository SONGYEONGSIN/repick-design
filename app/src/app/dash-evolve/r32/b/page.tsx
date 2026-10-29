import type { Metadata } from "next";
import Census from "./client";

export const metadata: Metadata = {
  title: "repick — Census",
  description:
    "Support-ticket triage console for the repick ops team: a waffle grid reads the backlog's category mix at a glance, with a slide-over drilldown into any category's tickets.",
};

export default function Page() {
  return <Census />;
}
