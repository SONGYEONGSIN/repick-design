import type { Metadata } from "next";
import DashboardClient from "./components/dashboard-client";

export const metadata: Metadata = {
  title: "Parallax — 주간 제품 리포트",
  description:
    "제품 애널리틱스 지표를 여러 위젯으로 구성한 리포트 캔버스입니다. 좌측 아웃라인에서 기간·세그먼트를 바꾸면 모든 위젯이 함께 갱신됩니다.",
};

export default function Page() {
  return <DashboardClient />;
}
