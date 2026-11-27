// native/src/evolve/r54/c/data.ts
//
// Deterministic dummy data for SellerPerformanceBreakdownScreen. No
// Math.random / Date.now / argument-less `new Date()` — every number below
// is a fixed figure and the "as of" line is a fixed string, not a computed
// timestamp.

export type MetricDirection = "higherIsBetter" | "lowerIsBetter";

export type PerformanceMetric = {
  id: string;
  label: string;
  /** Headline figure exactly as shown on the always-visible row, e.g. "94%". */
  displayValue: string;
  /** Same figure as a plain number, for threshold comparison. */
  value: number;
  /** The value a metric must clear (direction-dependent) to count as healthy. */
  healthyThreshold: number;
  /** Human reading of the threshold, e.g. "90% or higher". */
  thresholdLabel: string;
  direction: MetricDirection;
  /** One-line summary of the calculation, shown first when expanded. */
  detailHeadline: string;
  /** Supporting breakdown lines, shown under detailHeadline when expanded. */
  detailLines: string[];
};

export const SCORE_PERIOD_LABEL = "Last 90 days · snapshot from Nov 3, 2026";

export const PERFORMANCE_METRICS: PerformanceMetric[] = [
  {
    id: "on-time-shipping",
    label: "On-Time Shipping Rate",
    displayValue: "94%",
    value: 94,
    healthyThreshold: 90,
    thresholdLabel: "90% or higher",
    direction: "higherIsBetter",
    detailHeadline: "32 of 34 orders shipped within 2 business days",
    detailLines: [
      "Orders placed in the last 90 days: 34",
      "Shipped within 2 business days: 32",
      "Shipped later than 2 business days: 2",
      "Healthy threshold: 90% or higher",
    ],
  },
  {
    id: "average-response-time",
    label: "Average Response Time",
    displayValue: "5.2h",
    value: 5.2,
    healthyThreshold: 24,
    thresholdLabel: "24 hours or less",
    direction: "lowerIsBetter",
    detailHeadline: "Average first-reply time across 41 buyer messages",
    detailLines: [
      "Buyer messages received: 41",
      "Average time to first reply: 5.2 hours",
      "Slowest single reply this period: 18.4 hours",
      "Healthy threshold: 24 hours or less",
    ],
  },
  {
    id: "buyer-rating",
    label: "Buyer Rating",
    displayValue: "4.6/5",
    value: 4.6,
    healthyThreshold: 4.5,
    thresholdLabel: "4.5 or higher",
    direction: "higherIsBetter",
    detailHeadline: "Average of 58 buyer ratings this period",
    detailLines: [
      "5-star ratings: 54",
      "4-star ratings: 3",
      "3-star ratings: 1",
      "Healthy threshold: 4.5 or higher",
    ],
  },
  {
    id: "cancellation-rate",
    label: "Cancellation Rate",
    displayValue: "7.1%",
    value: 7.1,
    healthyThreshold: 3,
    thresholdLabel: "3% or lower",
    direction: "lowerIsBetter",
    detailHeadline: "5 of 71 orders cancelled by the seller after purchase",
    detailLines: [
      "Orders placed in the last 90 days: 71",
      "Cancelled by the seller: 5",
      "Cancelled by the buyer (not counted here): 3",
      "Healthy threshold: 3% or lower",
    ],
  },
];

/** True when a metric clears its healthy threshold, given its direction. */
export function isMetricHealthy(metric: PerformanceMetric): boolean {
  return metric.direction === "higherIsBetter"
    ? metric.value >= metric.healthyThreshold
    : metric.value <= metric.healthyThreshold;
}
