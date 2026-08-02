import type { Metadata } from "next";
import PaywallClient from "./paywall-client";

export const metadata: Metadata = {
  title: "Upgrade to Trestle Pro — Trestle",
  description:
    "Trestle Free stops at 3 boards and 2 seats. A single-tier hard-paywall interrupt with a live seat and billing-period calculator, a full comparison of what Pro unlocks, testimonials, and FAQ.",
};

export default function Page() {
  return <PaywallClient />;
}
