import type { Metadata } from "next";
import LandingClient from "./ui";

export const metadata: Metadata = {
  title: "Assay — Every Listing, Certified by AI",
  description:
    "Assay's AI inspects each secondhand listing against a reference archive and issues a certificate — authenticity, condition grade, match reasoning, and price — before you ever open the item.",
};

export default function Page() {
  return <LandingClient />;
}
