import type { Metadata } from "next";
import "./hadal.css";
import DashboardClient from "./dashboard-client";

export const metadata: Metadata = {
  title: "HADAL — Subsea Fleet Console",
  description: "심해 탐사 ROV 플릿의 수심·소나·텔레메트리를 실시간으로 관제하는 서브씨 오퍼레이션 콘솔.",
};

export default function Page() {
  return <DashboardClient />;
}
