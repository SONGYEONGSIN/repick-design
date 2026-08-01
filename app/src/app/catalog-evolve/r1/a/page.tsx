import type { Metadata } from "next";
import CatalogClient from "./catalog-client";

export const metadata: Metadata = {
  title: "Loopwire — Integrations marketplace",
  description:
    "Loopwire is a workflow-automation platform's integrations marketplace: a left filter rail plus a dense result grid for browsing, filtering, and installing third-party apps by category, pricing, and rating.",
};

export default function Page() {
  return <CatalogClient />;
}
