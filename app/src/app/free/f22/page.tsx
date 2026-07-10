import type { Metadata } from "next";
import { Bebas_Neue, Gothic_A1, Special_Elite } from "next/font/google";
import F22Landing from "./client";

const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-bebas",
});

const elite = Special_Elite({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-elite",
});

const gothic = Gothic_A1({
  weight: ["400", "500", "700", "900"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-gothic",
});

export const metadata: Metadata = {
  title: "DOSSIER. — 미제사건 원두 수사국",
  description:
    "매달 산지 정보가 삭제된 원두가 도착한다. 커핑 노트만으로 원산지를 추리하는 미제사건 커피 구독, DOSSIER.",
};

export default function Landing() {
  return (
    <F22Landing
      bebasClass={bebas.variable}
      eliteClass={elite.variable}
      gothicClass={gothic.variable}
    />
  );
}
