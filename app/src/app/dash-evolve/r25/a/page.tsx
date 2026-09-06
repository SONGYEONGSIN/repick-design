import type { Metadata } from "next";
import ParityClient from "./ParityClient";

export const metadata: Metadata = {
  title: "Parity — Inventory Reconciliation Console",
  description:
    "Parity is a reconciliation console for repick's warehouse ops: one dense, sortable ledger of expected-vs-scanned inventory lines fills most of the viewport. Pinning a row cross-references it in a tray above without filtering the grid itself; hovering or focusing a SKU opens an ephemeral scan-trail popover that leaves no trace once you look away.",
};

export default function Page() {
  return <ParityClient />;
}
