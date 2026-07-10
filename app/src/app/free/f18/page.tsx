import type { Metadata } from "next";
import { Noto_Serif_KR } from "next/font/google";
import F18Landing from "./client";

const monument = Noto_Serif_KR({
  weight: ["400", "900"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-monument",
});

export const metadata: Metadata = {
  title: "새김 SAEGIM — 화강암 봉헌 의식",
  description:
    "당신의 한 문장을 화강암에 새겨 지하 봉인고에 안치하고, 100년·300년·1000년 뒤에 다시 엽니다.",
};

export default function Landing() {
  return <F18Landing monumentClass={monument.variable} />;
}
