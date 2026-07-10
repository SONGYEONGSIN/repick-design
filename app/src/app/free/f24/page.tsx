import { Anton, Black_Han_Sans, Gothic_A1 } from "next/font/google";
import LandingClient from "./LandingClient";

const blackHanSans = Black_Han_Sans({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const gothicA1 = Gothic_A1({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  display: "swap",
});

const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export default function Landing() {
  return (
    <LandingClient
      fontDisplayKr={blackHanSans.className}
      fontBodyKr={gothicA1.className}
      fontDisplayEn={anton.className}
    />
  );
}
