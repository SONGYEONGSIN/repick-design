import type { Metadata } from "next";
import { Dashboard } from "./Dashboard";

export const metadata: Metadata = {
  title: "Thrum — Reliability Operations",
  description: "Service health, incidents, deploys and spend for engineering operations, at a glance.",
};

export default function Page() {
  return <Dashboard />;
}
