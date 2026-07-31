import type { Metadata } from "next";
import NotFoundClient from "./ui";

export const metadata: Metadata = {
  title: "404 — Rivet",
  description: "This page moved or never existed. Return to your Rivet dashboard.",
};

export default function Page() {
  return <NotFoundClient />;
}
