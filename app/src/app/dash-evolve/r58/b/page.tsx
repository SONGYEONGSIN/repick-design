import type { Metadata } from "next";
import { SignalwatchClient } from "./SignalwatchClient";

export const metadata: Metadata = {
  title: "Signalwatch — Incidents",
  description:
    "Signalwatch is a security/reliability operations console. Its home view centers on a live, filterable incident activity feed with a severity rail and a pinnable inspector.",
};

export default function Page() {
  return <SignalwatchClient />;
}
