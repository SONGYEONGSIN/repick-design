import type { Metadata } from "next";
import PaywallClient from "./paywall-client";

export const metadata: Metadata = {
  title: "Upgrade to Growth — Postrail",
  description:
    "Postrail's Starter plan has run out of monthly email sends. See exactly what's queued, right-size your plan against your own volume, and compare tiers independently before upgrading.",
};

export default function Page() {
  return <PaywallClient />;
}
