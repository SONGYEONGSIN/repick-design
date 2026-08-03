import type { Metadata } from "next";
import ProductClient from "./product-client";

export const metadata: Metadata = {
  title: "Anvil TKL-75 — Anvil Type Co.",
  description:
    "Anvil TKL-75: a certified-refurbished 75% mechanical keyboard with a hot-swap PCB. Choose a condition grade and switch feel in a live configuration console — feel, fulfillment, specifications and reviews update together.",
};

export default function Page() {
  return <ProductClient />;
}
