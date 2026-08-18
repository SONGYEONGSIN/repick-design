import type { Metadata } from "next";
import { WardenClient } from "./WardenClient";

export const metadata: Metadata = {
  title: "Warden — Vulnerability Remediation Console",
  description:
    "Warden is an application-security operations console whose centerpiece is a six-stage remediation board (Backlog through Resolved). Every card carries a bullet-style SLA bar — days open vs. a severity-based target — as the single, instantly-readable dominant visualization repeated board-wide, with a keyboard-accessible tooltip for the underlying dates. Selecting a card opens a slide-over with full finding detail, a stage-duration breakdown, and real move-to-next/previous-stage controls.",
};

export default function Page() {
  return <WardenClient />;
}
