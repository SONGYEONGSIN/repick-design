import type { Metadata } from "next";
import ProductClient from "./product-client";

export const metadata: Metadata = {
  title: "Meridian FE 35mm f/1.4 ASPH — Meridian Exchange",
  description:
    "Meridian Exchange's Meridian FE 35mm f/1.4 ASPH: compare a certified pre-owned copy against a brand-new sealed unit side by side, with a live condition-grade selector, a shared protection plan, and a full specification comparison.",
};

export default function Page() {
  return <ProductClient />;
}
