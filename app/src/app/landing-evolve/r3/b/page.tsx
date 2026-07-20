import type { Metadata } from "next";
import TranscriptClient from "./components/TranscriptClient";

export const metadata: Metadata = {
  title: "RE:픽 — AI 큐레이터와의 대화",
  description:
    "말 한마디로 시작되는 대화 — AI 큐레이터가 되묻고 근거를 대며 지금 당신에게 맞는 중고 매물을 다시 골라주는 실시간 트랜스크립트를 스크롤로 따라가 보세요.",
};

export default function Page() {
  return <TranscriptClient />;
}
