import type { Metadata } from "next";
import Client from "./Client";

export const metadata: Metadata = {
  title: "Provenance — A trust score you can watch being built",
  description:
    "Provenance is a resale marketplace that scores every listing against four independent authenticity checks. Toggle any check and watch the trust score, label, and listing badge recompute live.",
};

export default function Page() {
  return <Client />;
}
