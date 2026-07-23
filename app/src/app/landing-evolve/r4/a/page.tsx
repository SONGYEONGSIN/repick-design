import type { Metadata } from "next";
import LandingClient from "./ui";

export const metadata: Metadata = {
  title: "RE:픽 — 카드를 넘길 때마다 좁혀지는 AI 매칭",
  description:
    "AI가 고른 매물을 카드 스택으로 넘겨보세요. 매칭률·컨디션 등급·판매자 인증·할인율이 드래그하는 동안에도 카드 정면에 항상 보입니다.",
};

export default function Page() {
  return <LandingClient />;
}
