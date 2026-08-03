import type { Metadata } from "next";
import PaywallClient from "./paywall-client";

export const metadata: Metadata = {
  title: "Upgrade to Studio — Meridian",
  description:
    "Meridian's Solo plan has run out of bookings for this month. Review the evidence, size a plan to your calendars and booking volume, then confirm your upgrade.",
};

export default function Page() {
  return <PaywallClient />;
}
