import type { Metadata } from "next";
import F25Client from "./f25-client";

export const metadata: Metadata = {
  title: "몬스터파킹 — 오늘 밤, 침대 밑 괴물에게 주차권을 드려요",
  description:
    "몬스터파킹은 아이가 무서워하는 침대 밑 괴물을 그리고, 이름 짓고, 정식으로 '주차'시켜주는 잠자리 의식 서비스입니다.",
};

export default function Landing() {
  return <F25Client />;
}
