import type { Metadata } from "next";
import { Song_Myung } from "next/font/google";
import LandingF10Client from "./f10-client";

const songMyung = Song_Myung({
  weight: "400",
  variable: "--font-song",
  display: "swap",
});

export const metadata: Metadata = {
  title: "결 GYEOL — 소리를 만지는 공감각 웨어러블",
  description:
    "결은 속삭임, 빗소리, 종이 넘기는 소리를 촉감과 색으로 번역하는 공감각 웨어러블입니다. 듣는 것을 넘어, 만지고 보는 감각으로.",
};

export default function Landing() {
  return <LandingF10Client fontVariable={songMyung.variable} />;
}
