import type { Metadata } from "next";
import { QueueConsole } from "./QueueConsole";

export const metadata: Metadata = {
  title: "Quorum — Trust & Safety 심사 큐",
  description:
    "신고된 콘텐츠를 세로 결정 스트림 하나로 처리하는 모더레이션 콘솔. 결정을 내리면 큐가 전진한다.",
};

export default function Page() {
  return <QueueConsole />;
}
