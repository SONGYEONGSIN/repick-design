import type { Metadata } from "next";
import DispatchConsole from "./dispatch-console";

export const metadata: Metadata = {
  title: "60HZ — 계통 급전 콘솔",
  description:
    "발전원 믹스, 수요-공급 균형, 계통 주파수, 변전소 부하와 ESS 충방전을 한 화면에서 감시하는 전력망 급전 운영 콘솔.",
};

export default function Page() {
  return <DispatchConsole />;
}
