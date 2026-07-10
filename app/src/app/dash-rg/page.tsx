import type { Metadata } from "next";
import DashboardClient from "./dashboard-client";

export const metadata: Metadata = {
  title: "Ridge — 자금 현황 개요",
  description: "Ridge에서 잔고, 현금흐름, 예산, 거래 내역을 한눈에 확인하세요.",
};

export default function Dashboard() {
  return <DashboardClient />;
}
