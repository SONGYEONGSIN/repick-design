import type { Metadata } from "next";
import F15Client from "./f15-client";

export const metadata: Metadata = {
  title: "MAISON LACUNE — N°0 Silence",
  description:
    "마종 라뀐. 아무것도 더하지 않는 향, 침묵을 파는 하우스. 연 1회, 500병 한정, 예약제로만 공개됩니다.",
};

export default function Landing() {
  return <F15Client />;
}
