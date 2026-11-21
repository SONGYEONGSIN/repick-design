// native/src/evolve/r48/b/data.ts
// Deterministic dummy data for the Shipment Live Tracking screen.
// No Math.random() / Date.now() / bare `new Date()` — every timestamp below
// is a fixed display string, not a computed Date instance.

export type MilestoneStatus = "completed" | "current" | "upcoming";

export interface ShipmentMilestone {
  id: string;
  label: string;
  timestamp: string;
  note?: string;
}

export interface ShipmentTrackingRecord {
  orderRef: string;
  carrierName: string;
  trackingNumber: string;
  estimatedWindowLabel: string;
  originLabel: string;
  destinationLabel: string;
  milestones: ShipmentMilestone[];
  currentMilestoneId: string;
}

export const shipmentTrackingRecord: ShipmentTrackingRecord = {
  orderRef: "Order #RP-20931",
  carrierName: "QuickVan Logistics",
  trackingNumber: "QV48213590KR",
  estimatedWindowLabel: "Today, by 8:00 PM",
  originLabel: "Daejeon Sorting Center",
  destinationLabel: "Your address",
  currentMilestoneId: "out_for_delivery",
  milestones: [
    {
      id: "packed",
      label: "Order packed",
      timestamp: "Oct 30, 9:12 AM",
      note: "Seller confirmed item condition and sealed the package.",
    },
    {
      id: "picked_up",
      label: "Picked up by carrier",
      timestamp: "Oct 30, 2:45 PM",
      note: "QuickVan Logistics collected the package from the seller.",
    },
    {
      id: "in_transit",
      label: "In transit",
      timestamp: "Oct 31, 8:20 AM",
      note: "Package left Daejeon Sorting Center.",
    },
    {
      id: "out_for_delivery",
      label: "Out for delivery",
      timestamp: "Nov 3, 7:05 AM",
      note: "Loaded onto today's delivery route.",
    },
    {
      id: "delivered",
      label: "Delivered",
      timestamp: "Estimated by 8:00 PM",
    },
  ],
};

export function findMilestoneStatus(
  record: ShipmentTrackingRecord,
  milestoneId: string,
): MilestoneStatus {
  const currentIndex = record.milestones.findIndex(
    (entry) => entry.id === record.currentMilestoneId,
  );
  const thisIndex = record.milestones.findIndex((entry) => entry.id === milestoneId);
  if (thisIndex < currentIndex) return "completed";
  if (thisIndex === currentIndex) return "current";
  return "upcoming";
}
