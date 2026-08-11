import type { Metadata } from "next";

import HoplineDashboard from "./HoplineDashboard";

export const metadata: Metadata = {
  title: "Hopline — Link analytics",
  description:
    "Short-link analytics that reads as a to-do list: every metric carries the fix it implies.",
};

export default function Page() {
  return <HoplineDashboard />;
}
