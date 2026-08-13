import type { Metadata } from "next";
import ConsoleClient from "./components/ConsoleClient";

export const metadata: Metadata = {
  title: "Runsheet — Editorial Operations Console",
  description:
    "Runsheet is an editorial content-calendar console built around a real month-view grid — deterministic per-day channel indicators, a filterable draft queue rail, month navigation, and a command palette.",
};

export default function Page() {
  return <ConsoleClient />;
}
