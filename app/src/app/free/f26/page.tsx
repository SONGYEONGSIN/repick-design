import type { Metadata, Viewport } from "next";
import F26Landing from "./f26-client";

export const metadata: Metadata = {
  title: "여백 YEOBAEK — 아무것도 하지 않는 연습",
  description:
    "알림 없는 25분의 침묵, 실물 향으로 재는 시간, 기록하지 않는 기록. 여백은 아무것도 하지 않기 위한 가장 정교한 도구입니다.",
};

export const viewport: Viewport = {
  colorScheme: "light",
};

export default function Landing() {
  return <F26Landing />;
}
