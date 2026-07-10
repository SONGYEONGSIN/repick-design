import type { Metadata } from "next";
import { Nanum_Myeongjo, Cormorant_Garamond, Special_Elite } from "next/font/google";
import F20Landing from "./client";

const nanumMyeongjo = Nanum_Myeongjo({
  subsets: ["latin"],
  weight: ["400", "700", "800"],
  display: "swap",
  variable: "--font-f20-serif-kr",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-f20-latin",
});

const specialElite = Special_Elite({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-f20-label",
});

export const metadata: Metadata = {
  title: "FLORA CODEX — 계절을 채집하여 향으로 압화하다",
  description:
    "플로라 코덱스는 매달 한 종의 식물을 표본으로 기록하고 그 향을 병에 눌러 담아 보내드리는 허바리움 향수 구독입니다.",
};

export default function Landing() {
  return (
    <F20Landing
      fontClass={`${nanumMyeongjo.variable} ${cormorant.variable} ${specialElite.variable}`}
    />
  );
}
