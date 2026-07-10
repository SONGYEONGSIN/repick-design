import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import DashboardClient from "./dashboard-client";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display-d2",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Comet — 크리에이터 성장 대시보드",
  description:
    "인스타그램, 틱톡, 유튜브, X를 한 화면에서 추적하는 크리에이터 성장 분석 도구, Comet.",
};

export default function Page() {
  return <DashboardClient displayFontVariable={spaceGrotesk.variable} />;
}
