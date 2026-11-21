/**
 * Flagline — feature-flag / experimentation console.
 * Shared domain types. All experiment/flag data is deterministic dummy data defined in data.ts.
 */

export type Environment = "production" | "staging" | "development";
export type FlagStatus = "active" | "paused";
export type MetricKey = "conversion" | "latency" | "error";
export type SortDirection = "asc" | "desc";
export type Direction = "improved" | "regressed";

export interface FeatureFlag {
  id: string;
  key: string;
  name: string;
  environment: Environment;
  status: FlagStatus;
  rollout: number; // 0-100
  ownerName: string;
  ownerPhotoId: string;
  /** Hours since last change — stored, never computed from Date.now, so the dummy data stays deterministic. */
  updatedHoursAgo: number;
  experimentId: string | null;
}

export interface MetricSample {
  before: number;
  after: number;
}

export interface Experiment {
  id: string;
  name: string;
  shortName: string;
  flagKey: string;
  variant: string;
  conversion: MetricSample; // percent
  latency: MetricSample; // milliseconds
  error: MetricSample; // percent
}

/** Fully derived from a MetricSample + its metric's direction — never hand-typed alongside the raw sample. */
export interface MetricResult {
  before: number;
  after: number;
  delta: number;
  pctChange: number;
  direction: Direction;
  significant: boolean;
}

export interface MetricMeta {
  key: MetricKey;
  label: string;
  axisLabel: string;
  unit: string;
  /** "higher" = larger value is the improvement (conversion); "lower" = smaller is the improvement (latency, error). */
  better: "higher" | "lower";
  format: (value: number) => string;
}
