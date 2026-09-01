import type { Metadata } from "next";
import DossierLanding from "./client";

export const metadata: Metadata = {
  title: "repick — The Case File, Not Just the Listing",
  description:
    "repick reviews condition, provenance and comparable sales before a price appears, then shows you the same evidence it used.",
};

export default function Page() {
  return <DossierLanding />;
}
