import type { Metadata } from "next";
import { Dashboard } from "./Dashboard";

export const metadata: Metadata = {
  title: "Ridgeline — Revenue overview",
  description:
    "Ridgeline is a revenue operations dashboard for subscription businesses, built around an ARR bridge waterfall and account-level movement detail.",
};

export default function Page() {
  return <Dashboard />;
}
