import type { Metadata } from "next";
import { VernierClient } from "./VernierClient";

export const metadata: Metadata = {
  title: "Vernier — Flags",
  description:
    "Vernier is a feature-flag rollout console. Its home view leads with a workspace-wide enrollment hero number and a grid of stat tiles, then a sortable, filterable flag table with an independently-scoped detail panel — deliberately no single dominant chart.",
};

export default function Page() {
  return <VernierClient />;
}
