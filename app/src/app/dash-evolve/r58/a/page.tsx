import type { Metadata } from "next";
import { GrainhouseClient } from "./GrainhouseClient";

export const metadata: Metadata = {
  title: "Grainhouse — Schedule",
  description:
    "Grainhouse is a production-studio booking console. Its home view centers on a resource-by-hour availability grid for photo/video studios, edit bays, and equipment.",
};

export default function Page() {
  return <GrainhouseClient />;
}
