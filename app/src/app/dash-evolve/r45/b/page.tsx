import type { Metadata } from "next";
import { Dashboard } from "./Dashboard";

export const metadata: Metadata = {
  title: "Kelvin — Revenue Mix Board",
  description:
    "Kelvin is a subscription revenue-mix console for SaaS finance and RevOps teams, built around a Marimekko board of ARR by region and plan tier.",
};

export default function Page() {
  return <Dashboard />;
}
