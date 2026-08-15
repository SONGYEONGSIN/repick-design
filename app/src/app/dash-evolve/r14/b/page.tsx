import type { Metadata } from "next";
import ConsoleClient from "./console-client";

export const metadata: Metadata = {
  title: "Rampart — Trust & Safety Operations Console",
  description:
    "Rampart is a trust & safety operations console built around a live moderation activity stream flanked by a performance-vs-target bullet-chart grid and reviewer-capacity rail — every KPI's actual and target print as always-visible text.",
};

export default function Page() {
  return <ConsoleClient />;
}
