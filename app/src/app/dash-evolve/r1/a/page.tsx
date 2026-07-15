import type { Metadata } from "next";
import DashboardClient from "./components/dashboard-client";

export const metadata: Metadata = {
  title: "Rivet — 실시간 이벤트 인텔리전스",
  description:
    "Rivet은 웹·앱·서버 전반의 고객 이벤트를 실시간으로 수집·분석하는 CDP/프로덕트 애널리틱스 대시보드입니다.",
};

export default function Page() {
  return <DashboardClient />;
}
