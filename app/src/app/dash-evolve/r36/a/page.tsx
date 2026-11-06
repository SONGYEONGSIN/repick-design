import type { Metadata } from "next";
import { SetpointConsole } from "./setpoint-console";

export const metadata: Metadata = {
  title: "Setpoint — Company OKR Console",
  description:
    "An OKR console whose hero is a grid of hand-built bullet charts, one per department goal, each always showing its current value, target and status as text. Clicking a bullet expands an inline accordion in place with its 8-quarter trend and composition breakdown; a this-quarter/last-quarter toggle recomputes every bullet, a sortable and filterable goals table sits independently below, and ⌘K jumps to and expands any goal by team or metric name.",
};

export default function Page() {
  return <SetpointConsole />;
}
