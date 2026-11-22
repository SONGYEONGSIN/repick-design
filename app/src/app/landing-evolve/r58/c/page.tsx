import type { Metadata } from "next";
import Client from "./Client";

export const metadata: Metadata = {
  title: "Delivery Grid Pick — Reloop",
  description:
    "Pick a shipping speed and insurance combination on the Delivery Grid to see the total landed cost, delivery window, and the two next-best alternatives, recomputed live for a verified resale listing.",
};

export default function Page() {
  return <Client />;
}
