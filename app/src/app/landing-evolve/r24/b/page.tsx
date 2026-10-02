import type { Metadata } from "next";
import TrustWebLanding from "./client";

export const metadata: Metadata = {
  title: "repick — Trust Web",
  description:
    "Toggle the verification layers behind a real repick listing and watch the trust graph, and its confidence score, recompute live.",
};

export default function Page() {
  return <TrustWebLanding />;
}
