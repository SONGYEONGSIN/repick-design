import type { Metadata } from "next";
import F1Client from "./f1-client";

export const metadata: Metadata = {
  title: "여운 YEOUN — 못다한 말을, 성층권으로",
  description:
    "여운은 부치지 못한 편지를 캡슐에 봉인해 기상 관측 풍선에 실어 성층권 32km까지 올려보내는 편지 발사 의식 서비스입니다.",
};

export default function Landing() {
  return <F1Client />;
}
