import type { Metadata } from "next";
import { Cormorant_Garamond, Noto_Serif_KR } from "next/font/google";
import DashboardClient from "./DashboardClient";

const decoLatin = Cormorant_Garamond({
  variable: "--font-deco-latin",
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
});

const decoKr = Noto_Serif_KR({
  variable: "--font-deco-kr",
  weight: ["500", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "지식재산 관제탑 — SEAL IP Console",
  description: "특허·상표·소송 자산을 하나의 관제 화면에서 감시하는 지식재산 포트폴리오 콘솔.",
};

export default function Dashboard() {
  return (
    <div className={`${decoLatin.variable} ${decoKr.variable}`}>
      <DashboardClient />
    </div>
  );
}
