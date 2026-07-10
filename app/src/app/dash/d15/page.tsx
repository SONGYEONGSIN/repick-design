import type { Metadata } from "next";
import MatchConsole from "./MatchConsole";

export const metadata: Metadata = {
  title: "BOXOUT — 매치 콘솔",
  description: "농구 코칭스태프를 위한 라이브 경기 전술·박스스코어·선수 컨디션 로드 콘솔.",
};

export default function Dashboard() {
  return <MatchConsole />;
}
