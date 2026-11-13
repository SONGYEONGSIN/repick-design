import type { Metadata } from "next";
import Client from "./Client";

export const metadata: Metadata = {
  title: "repick — Price and condition, plotted together",
  description:
    "Pick a point on repick's price-versus-condition plot to open its full match proof -- grade, verification, and discount against retail.",
};

export default function Page() {
  return <Client />;
}
