import type { Metadata } from "next";
import PricingClient from "./pricing-client";

export const metadata: Metadata = {
  title: "Pricing — Tillmark point of sale",
  description:
    "What a Tillmark rollout costs, on one screen: the amount due the day we install and the amount due every month after, recalculated together as you set your store count and choose whether to buy, finance or rent the terminals.",
};

export default function Page() {
  return <PricingClient />;
}
