import type { Metadata } from "next";
import CausewayClient from "./CausewayClient";

export const metadata: Metadata = {
  title: "Harborline — Support Console",
  description:
    "Harborline is a master/detail B2B support-ticket console — a filterable, sortable ticket queue rail next to a full-context detail pane with a per-account SLA compliance and first-response trend chart, a live conversation thread, and a sortable related-tickets table.",
};

export default function Page() {
  return <CausewayClient />;
}
