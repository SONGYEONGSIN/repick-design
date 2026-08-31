import type { Metadata } from "next";
import { Console } from "./Console";

export const metadata: Metadata = {
  title: "Cases — Harborline",
  description: "Harborline support case console.",
};

export default function Page() {
  return <Console />;
}
