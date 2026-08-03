import type { Metadata } from "next";
import PaywallClient from "./paywall-client";

export const metadata: Metadata = {
  title: "Upgrade to Growth — Fathomline",
  description:
    "Fathomline's Starter plan has run out of tracked events for this month. See exactly why event collection paused, then size the recommended plan to your real usage in real time.",
};

export default function Page() {
  return <PaywallClient />;
}
