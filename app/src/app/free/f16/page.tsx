import type { Metadata } from "next";
import F16Client from "./f16-client";

export const metadata: Metadata = {
  title: "몽상은행 — 당신의 꿈을 예치하세요",
  description:
    "몽상은행은 잠과 낮잠, 백일몽을 예금으로 받는 대한민국 유일의 무형자산 전문 저축은행입니다. 꿈을 맡기면 몽상이자가 붙습니다.",
};

export default function Landing() {
  return <F16Client />;
}
