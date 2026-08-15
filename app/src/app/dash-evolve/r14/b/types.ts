/**
 * Rampart — shared domain types for the Trust &amp; Safety operations console.
 */

export type QueueId = "text" | "image" | "video" | "account";

export type Severity = "low" | "medium" | "high";

export type FeedStatus = "approved" | "removed" | "escalated" | "unassigned" | "reinstated" | "overridden";

export type TimeRange = "1h" | "24h" | "7d";

/** Bullet-chart target direction: `min` = actual should meet/exceed target (throughput, SLA);
 *  `max` = actual should stay at/under target (a ceiling, e.g. reviewer utilization). */
export type Goal = "min" | "max";

export type QueueFilterValue = "all" | QueueId;

export type SortMode = "newest" | "severity";

export type FeedEvent = {
  id: string;
  /** Fixed UTC clock label — never wall-clock (no Date.now/new Date). */
  time: string;
  queue: QueueId;
  severity: Severity;
  status: FeedStatus;
  title: string;
  detail: string;
  actor: string;
};

export type BulletUnit = "rate" | "percent";

export type BulletKpi = {
  id: string;
  label: string;
  queue: QueueId | "platform";
  unit: BulletUnit;
  goal: Goal;
  axisMax: number;
  target: number;
  actualByRange: Record<TimeRange, number>;
};

export type ReviewerCapacity = {
  queue: QueueId;
  label: string;
  active: number;
  capacity: number;
};
