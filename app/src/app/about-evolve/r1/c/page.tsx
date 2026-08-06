import type { Metadata } from "next";
import AboutClient from "./about-client";

export const metadata: Metadata = {
  title: "About Northline — Verified sourcing from factory to dock",
  description:
    "Northline connects independent manufacturers with retail and DTC buyers through one audited pipeline: source, verify, match and ship, in that order, every time.",
};

export default function Page() {
  return <AboutClient />;
}
