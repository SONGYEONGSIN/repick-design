import type { Metadata } from "next";
import ProductClient from "./product-client";

export const metadata: Metadata = {
  title: "No. 4 Chef's Knife — Ferrous & Oak",
  description:
    "Ferrous & Oak's No. 4: a hand-forged San-Mai chef's knife with a live blade-length, handle-wood and edge-finish configurator, a six-chapter forging journal, a full spec sheet, and reviews.",
};

export default function Page() {
  return <ProductClient />;
}
