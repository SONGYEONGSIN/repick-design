import type { Metadata } from "next";
import NotFoundClient from "./ui";

export const metadata: Metadata = {
  title: "404 — Harbor",
  description: "We couldn't find that listing. Search Harbor or head back to the marketplace.",
};

export default function Page() {
  return <NotFoundClient />;
}
