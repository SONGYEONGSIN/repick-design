import type { Metadata } from "next";
import OutlayClient from "./OutlayClient";

export const metadata: Metadata = {
  title: "Outlay — Cloud Cost Allocation",
  description:
    "Outlay is a cloud cost-allocation console for engineering orgs. A sunburst at its center breaks down org spend into cost-center teams and the cloud services behind them, backed by a keyboard-reachable hierarchy list and always-visible total, delta and top-mover figures.",
};

export default function Page() {
  return <OutlayClient />;
}
