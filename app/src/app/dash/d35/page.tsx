import type { Metadata } from "next";
import Cockpit from "./cockpit";

export const metadata: Metadata = {
  title: "Tessera — Asset Allocation Treemap Cockpit",
  description:
    "Tessera is a wealth management dashboard that monitors personal asset allocation through a large treemap. Tile size encodes market value, and tone encodes P&L direction and strength; selecting a holding syncs the detail panel and holdings table.",
};

export default function Page() {
  return <Cockpit />;
}
