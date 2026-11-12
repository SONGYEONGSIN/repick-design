import type { Metadata } from "next";
import DashboardApp from "./DashboardApp";

export const metadata: Metadata = {
  title: "Reloop — Seller Quality",
  description: "Marketplace seller-performance console correlating return rate against revenue and order volume.",
};

export default function Page() {
  return <DashboardApp />;
}
