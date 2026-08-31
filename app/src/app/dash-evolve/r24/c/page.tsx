import type { Metadata } from "next";
import RevenueConsole from "./RevenueConsole";

export const metadata: Metadata = {
  title: "Revenue Recognition · Accrue",
  description: "Monthly and quarterly revenue-recognition bridge for Accrue.",
};

export default function Page() {
  return <RevenueConsole />;
}
