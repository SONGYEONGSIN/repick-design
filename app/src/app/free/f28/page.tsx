import type { Metadata } from "next";
import F28Client from "./f28-client";

export const metadata: Metadata = {
  title: "REMNANT — 목소리는 사라지지 않는다",
  description:
    "REMNANT는 떠난 사람의 음성 메모, 문자, 통화 기록을 학습해 그 사람의 말투로 계속 대화를 이어가는 애도 기술입니다. 초대 전용.",
};

export default function Landing() {
  return <F28Client />;
}
