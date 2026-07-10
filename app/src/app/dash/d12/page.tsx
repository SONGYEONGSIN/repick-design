import type { Metadata } from "next";
import { Orbitron, Rajdhani } from "next/font/google";
import DashboardClient from "./dashboard-client";

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
  variable: "--font-display-d12",
  display: "swap",
});

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-hud-d12",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ops Deck | QUARTERDECK",
  description:
    "QUARTERDECK — 라이브 서비스 게임 NEONSPIRE의 인게임 경제, 길드 영토, e스포츠 스카우팅을 한 화면에서 지휘하는 라이브옵스 관제 콘솔.",
};

export default function Page() {
  return (
    <DashboardClient
      displayFontVariable={orbitron.variable}
      hudFontVariable={rajdhani.variable}
    />
  );
}
