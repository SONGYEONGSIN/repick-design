import type { Metadata } from "next";
import { OpsProvider } from "./context";
import { Shell } from "./components/Shell";
import { ShipmentRail } from "./components/ShipmentRail";
import { EtaTrendCard } from "./components/EtaTrendCard";
import { CarrierScorecard } from "./components/CarrierScorecard";
import { ShipmentDetailPanel } from "./components/ShipmentDetailPanel";
import { EventFeed } from "./components/EventFeed";

export const metadata: Metadata = {
  title: "Portlane — Freight Operations Console",
  description: "A freight & logistics operations console for tracking shipments, forecasting fleet on-time performance, and comparing carrier reliability in one view",
};

export default function Page() {
  return (
    <OpsProvider>
      <Shell>
        {/* Visually silent — the shipment ID inside the detail panel and the big on-time
            readout function as this page's visible headline (single h1, no skipped levels). */}
        <h1 className="sr-only">Portlane Freight Operations Console</h1>

        <div className="mx-auto flex w-full max-w-[1920px] flex-col gap-4 xl:flex-row xl:items-start xl:gap-4">
          <ShipmentRail />

          <div className="flex min-w-0 flex-1 flex-col gap-4">
            <EtaTrendCard />
            <CarrierScorecard />
          </div>

          <div className="flex w-full shrink-0 flex-col gap-4 xl:w-[320px] 2xl:w-[360px]">
            <ShipmentDetailPanel />
            <EventFeed />
          </div>
        </div>
      </Shell>
    </OpsProvider>
  );
}
