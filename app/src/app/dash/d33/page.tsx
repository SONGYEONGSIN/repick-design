import type { Metadata } from "next";
import { BoardApp } from "./board-app";

export const metadata: Metadata = {
  title: "Keel — Sales Pipeline",
  description:
    "Keel is a B2B sales pipeline workspace that manages deal flow from lead to negotiation on a kanban board, tracking weighted forecast and win rate in a single view.",
};

export default function Page() {
  return <BoardApp />;
}
