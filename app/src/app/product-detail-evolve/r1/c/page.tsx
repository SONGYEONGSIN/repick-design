import type { Metadata } from "next";
import ProductClient from "./product-client";

export const metadata: Metadata = {
  title: "Torvex LA-640 Series — Precision Linear Actuator",
  description:
    "Torvex LA-640 series linear actuator: a configuration rail for five stroke lengths drives a live datasheet with specifications, documentation, controller compatibility and reviews.",
};

export default function Page() {
  return <ProductClient />;
}
