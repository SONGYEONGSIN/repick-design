import type { Metadata } from "next";
import { CtcConsole } from "./ctc-console";

export const metadata: Metadata = {
  title: "ASPECT — CTC 관제 콘솔",
  description:
    "메리디안 본선 중앙집중식 열차제어(CTC) 관제 콘솔 — 선로 계통도, 운행선도, 신호 현시, 지연 파급 경로를 한 화면에서 확인합니다.",
};

export default function Page() {
  return <CtcConsole />;
}
