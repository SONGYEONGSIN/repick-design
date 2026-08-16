export type Corridor = "west" | "central" | "east";
export type Status = "on-track" | "at-risk" | "delayed";
export type PeriodId = "7" | "14" | "30";

export interface Hub {
  id: string;
  code: string;
  name: string;
  corridor: Corridor;
  /** Fixed schematic-map coordinates, viewBox units (0–1000 x, 0–460 y). */
  x: number;
  y: number;
  /** Average parcels moved per day. */
  volume: number;
  transitHours: number;
  capacityPct: number;
  /** On-time rate baseline over the trailing 30 days. */
  onTime30: number;
  /** Change applied for the 14-day window (30d baseline + delta14). */
  delta14: number;
  /** Additional change applied for the 7-day window (+ delta14 + delta7). */
  delta7: number;
}

/** Undirected lane between two hub ids — the connecting lines on the network map. */
export type Lane = readonly [string, string];

export interface SeriesPoint {
  idx: number;
  value: number;
  isToday: boolean;
}
