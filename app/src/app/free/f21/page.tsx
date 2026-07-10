import type { Metadata } from "next";
import { Anton, Do_Hyeon, Oswald } from "next/font/google";
import SurgeLanding from "./client";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-anton",
});

const doHyeon = Do_Hyeon({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dohyeon",
});

const oswald = Oswald({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-oswald",
});

export const metadata: Metadata = {
  title: "SURGE — 터지는 순간을 증명하다",
  description:
    "스프린트, 점프, 방향전환의 찰나를 와트와 반응속도로 기록하는 손목형 익스플로시브 파워 트래커, SURGE. 얼리버드 프리오더 20% 할인 진행 중.",
};

export default function Landing() {
  return (
    <SurgeLanding
      antonClass={anton.variable}
      doHyeonClass={doHyeon.variable}
      oswaldClass={oswald.variable}
    />
  );
}
