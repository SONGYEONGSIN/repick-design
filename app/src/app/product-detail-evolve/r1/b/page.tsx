import type { Metadata } from "next";
import ProductClient from "./product-client";

export const metadata: Metadata = {
  title: "Aria II — Fenwick Audio",
  description:
    "Fenwick Audio's Aria II: a bus-powered 2-in / 2-out USB-C audio interface with Class-A discrete preamps, a milled aluminum chassis, finish and bundle selection, a full spec sheet, a tier comparison matrix, and reviews.",
};

export default function Page() {
  return <ProductClient />;
}
