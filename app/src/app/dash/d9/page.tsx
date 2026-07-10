import type { Metadata } from "next";
import DashboardClient from "./dashboard-client";

export const metadata: Metadata = {
  title: "STELE — Archive Operations Console",
  description:
    "Digitization, review, and translation pipeline console for endangered-language field archives.",
};

export default function Page() {
  return <DashboardClient />;
}
