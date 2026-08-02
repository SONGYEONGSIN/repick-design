import type { Metadata } from "next";
import ProductDetailClient from "./product-detail-client";

export const metadata: Metadata = {
  title: "Fernway — Fieldstone Co. Classic Low-Top Sneakers",
  description:
    "A single authenticated resale listing on Fernway: choose a US size to see its own live price, condition grade, and ship window, then review the full inspection report before you buy.",
};

export default function Page() {
  return <ProductDetailClient />;
}
