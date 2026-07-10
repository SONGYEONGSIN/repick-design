import type { Metadata } from "next";
import F17Client from "./f17-client";

export const metadata: Metadata = {
  title: "QUARTER WASH — 동전 하나로 시작하는 세탁 아케이드",
  description:
    "얼룩은 몬스터, 세탁기는 캐비닛. QUARTER WASH는 코인을 넣고 스타트를 누르는 순간 빨래가 8비트 아케이드 게임이 되는 코인 세탁 서비스입니다.",
};

export default function Landing() {
  return <F17Client />;
}
