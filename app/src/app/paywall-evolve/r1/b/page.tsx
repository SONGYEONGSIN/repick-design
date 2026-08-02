import type { Metadata } from "next";
import PaywallClient from "./paywall-client";

export const metadata: Metadata = {
  title: "Upgrade to Team — Hopwire",
  description:
    "Hopwire's Starter plan has run out of automation runs for this month. Compare the recommended Team plan, estimate next month's workload, and see the full plan comparison before upgrading.",
};

export default function Page() {
  return <PaywallClient />;
}
