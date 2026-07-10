import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import F19Landing from "./client";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-glitch-display",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-glitch-mono",
});

export const metadata: Metadata = {
  title: "BITROT — 완벽을 부수는 데이터 부식 스튜디오",
  description:
    "BITROT는 완벽한 디지털 파일을 의도적으로 손상시켜 노이즈와 결함 속에 진짜 순간을 새겨 넣는 데이터 부식 스튜디오입니다.",
};

export default function Landing() {
  return <F19Landing fontClass={`${spaceGrotesk.variable} ${jetbrainsMono.variable}`} />;
}
