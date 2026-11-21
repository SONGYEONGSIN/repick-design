import type { Metadata } from "next";
import { DockwiseClient } from "./DockwiseClient";

export const metadata: Metadata = {
  title: "Dockwise — Overview",
  description:
    "Dockwise is a warehouse fulfillment-ops console. Its home view leads with a live inventory-value headline and a ranked, stacked bar of value by zone, backed by a replenishment queue and receipts log.",
};

export default function Page() {
  return <DockwiseClient />;
}
