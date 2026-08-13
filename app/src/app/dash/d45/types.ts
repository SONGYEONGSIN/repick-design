// Portlane — freight & logistics operations console. Shared domain types.

export type Mode = "Ocean" | "Air" | "Rail" | "Truck";

export type ShipmentStatus = "on_time" | "at_risk" | "delayed" | "delivered";

export type Period = "30D" | "60D" | "90D";

export interface TrackingEvent {
  id: string;
  label: string;
  timeLabel: string;
  /** true = already happened, false = upcoming/expected */
  done: boolean;
  icon: "package" | "truck" | "ship" | "plane" | "warehouse" | "check" | "customs";
}

export interface Carrier {
  id: string;
  name: string;
  shortName: string;
  primaryMode: Mode;
}

export interface Shipment {
  id: string;
  originCode: string;
  originCity: string;
  destCode: string;
  destCity: string;
  carrierId: string;
  mode: Mode;
  status: ShipmentStatus;
  scheduledEtaLabel: string;
  predictedEtaLabel: string;
  /** hours vs. schedule — positive = running late, negative = running early */
  etaDeltaHours: number;
  distanceKm: number;
  weightKg: number;
  dispatcher: { name: string; role: string; photoId: string };
  events: TrackingEvent[];
}

export interface SeriesPoint {
  /** days relative to today — 0 = today, negative = past (actual), positive = forecast days ahead */
  offset: number;
  label: string;
  fullLabel: string;
  value: number;
  isForecast: boolean;
  lower?: number;
  upper?: number;
}

export type SortKey = "lane" | "status" | "eta";
export type SortDir = "asc" | "desc";
export type StatusFilter = "all" | ShipmentStatus;
