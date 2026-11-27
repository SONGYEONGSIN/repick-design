import type { Metadata } from "next";
import Client from "./Client";

export const metadata: Metadata = {
  title: "FOCAL — Rank what matters, we surface the match",
  description:
    "Verified camera and lens resale. Drag four priorities into order — Price, Condition, Speed of delivery, Seller trust score — and FOCAL recomputes the top match live, with a plain-language sentence explaining exactly why.",
};

export default function Page() {
  return <Client />;
}
