import type { Metadata } from "next";
import Client from "./Client";

export const metadata: Metadata = {
  title: "repick — Get a real price, not a guess",
  description:
    "Answer four questions about your item and watch repick's AI recompute a real price band, confidence score, and comparable sale count live.",
};

export default function Page() {
  return <Client />;
}
