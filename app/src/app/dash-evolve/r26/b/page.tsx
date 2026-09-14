import type { Metadata } from "next";
import AuditlaneClient from "./AuditlaneClient";

export const metadata: Metadata = {
  title: "Auditlane — Supplier Quality Console",
  description:
    "Auditlane is a supplier-quality inspection console. A supplier cohort rail on the left is a pure master; the detail pane on the right is its sole consumer — a Tukey box plot of defect-severity scores with every quartile printed as standing text, a status-mix breakdown, and a sortable, filterable inspection ledger. Hovering a rail row opens a purely local, ephemeral preview; only a click pins a supplier and swaps the detail pane.",
};

export default function Page() {
  return <AuditlaneClient />;
}
