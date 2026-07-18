import type { Metadata } from "next";
import { DashboardClient } from "./components/dashboard-client";

export const metadata: Metadata = {
  title: "Foothold — 코호트 리텐션",
  description: "가입 코호트별 재방문율을 기간에 따라 추적하는 제품 분석 대시보드",
};

export default function Page() {
  return <DashboardClient />;
}
