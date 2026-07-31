import type { Metadata } from "next";
import NotFoundClient from "./ui";

export const metadata: Metadata = {
  title: "404 — Kiln",
  description: "This page isn't part of any collection. Return to your Kiln workspace.",
};

export default function Page() {
  return <NotFoundClient />;
}
