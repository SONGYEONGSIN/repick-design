import type { Metadata } from "next";
import VantageClient from "./VantageClient";

export const metadata: Metadata = {
  title: "Vantage — Vendor Risk Register",
  description:
    "Vantage is a vendor risk case register. A filterable case list on the left is a pure master; the detail pane on the right is its sole consumer — a five-axis risk radar with every score printed as text, a case timeline, and a findings table with its own severity sort and open/all toggle, none of which threads back into the list.",
};

export default function Page() {
  return <VantageClient />;
}
