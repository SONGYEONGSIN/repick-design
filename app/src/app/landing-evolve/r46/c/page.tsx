import type { Metadata } from "next";
import LandingClient from "./LandingClient";

export const metadata: Metadata = {
  title: "repick — Get paid the moment it sells",
  description:
    "Simulate a sale and watch Instant Payout and Standard Payout race to a finish line at their real relative speeds — repick's seller payout comparison.",
};

export default function Page() {
  return <LandingClient />;
}
