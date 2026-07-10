import type { Metadata } from "next";
import BeeaconDashboard from "./client";

export const metadata: Metadata = {
  title: "관제 개요 | BEEACON",
  description: "BEEACON — 도시 루프탑 양봉 네트워크를 실시간으로 관제하는 대시보드. 벌통 온습도, 꿀 저장량, 채집 활동을 한눈에.",
};

export default function Dashboard() {
  return <BeeaconDashboard />;
}
