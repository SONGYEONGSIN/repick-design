import type { Metadata } from "next";
import TrusslineClient from "./TrusslineClient";

export const metadata: Metadata = {
  title: "Trussline — Cloud Spend Bridge",
  description:
    "Trussline is a cloud spend reconciliation console. A waterfall bridge carries an opening balance through eight signed drivers to a closing balance, a running-total ledger restates the same arithmetic row by row, and selecting a bar decomposes that driver into its sub-drivers and the invoice lines behind it.",
};

export default function Page() {
  return <TrusslineClient />;
}
