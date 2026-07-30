import type { Metadata } from "next";
import MeridianAuth from "./ui";

export const metadata: Metadata = {
  title: "Meridian — Sign in",
  description:
    "Meridian is scheduling software that treats every teammate's timezone as a first-class citizen — sign in or create an account to coordinate meetings that respect everyone's midnight.",
};

export default function Page() {
  return <MeridianAuth />;
}
