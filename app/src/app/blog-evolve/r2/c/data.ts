// app/src/app/blog-evolve/r2/c/data.ts
//
// Keelson — an event-orchestration platform (queues, workflows, retries) for backend teams. The
// name is the nautical structural beam that runs the length of a ship's hull, bolted to the keel to
// reinforce it end to end — the same shape as a release timeline: one spine, every change bolted to
// a point on it. That metaphor is the reason this candidate reaches for a changelog/release-notes
// blog rather than another card grid or article list.
//
// All content is fixed literal data — no Math.random/Date.now/new Date anywhere, per
// page-brief-core §2. Dates are plain display strings, not Date objects, so there is nothing to
// format at render time and no server/client hydration mismatch is possible.

export type ReleaseType = "major" | "minor" | "patch" | "security";

export const RELEASE_TYPE_ORDER: ReleaseType[] = ["major", "minor", "patch", "security"];

export type Release = {
  id: string;
  version: string; // e.g. "v4.2.0"
  type: ReleaseType;
  date: string; // display string, fixed
  title: string;
  summary: string;
  changes: string[]; // full changelog bullets, revealed on expand
  authorName: string;
  authorRole: string;
  tags: string[];
};

// Newest first in source order; the UI can flip this without mutating the source array.
export const RELEASES: Release[] = [
  {
    id: "r-4-2-0",
    version: "v4.2.0",
    type: "major",
    date: "Jul 22, 2026",
    title: "Durable workflows, generally available",
    summary:
      "Multi-step workflows now checkpoint after every task, so a worker crash mid-run resumes from the last completed step instead of the top. Backed by the same replay log we use for retries.",
    changes: [
      "Workflow state now checkpoints to the durable log after every completed task, not only on workflow completion.",
      "New `workflow.resume()` API replays from the last checkpoint on worker restart, with idempotency keys enforced per step.",
      "Dashboard: workflow detail view shows a step-by-step timeline with retry counts and checkpoint markers.",
      "Breaking: `workflow.run()` no longer accepts a bare function — steps must be registered with `workflow.step()` so they are individually checkpointable.",
    ],
    authorName: "Priya Naik",
    authorRole: "Engineering Lead, Workflows",
    tags: ["workflows", "durability", "breaking-change"],
  },
  {
    id: "r-4-1-3",
    version: "v4.1.3",
    type: "security",
    date: "Jul 9, 2026",
    title: "Webhook signature verification hardening",
    summary:
      "Closed a timing side-channel in webhook signature comparison and rotated the default signing algorithm to HMAC-SHA256 for new endpoints. Existing endpoints are unaffected until re-keyed.",
    changes: [
      "Signature comparison now uses a constant-time equality check instead of string equality.",
      "New webhook endpoints default to HMAC-SHA256; SHA1 remains available opt-in for legacy consumers.",
      "Added `signature_algorithm` field to the webhook endpoint API response.",
      "No action required for existing endpoints — the timing side-channel required local network access and no exploitation was observed.",
    ],
    authorName: "Marcus Aldrin",
    authorRole: "Security Engineer",
    tags: ["security", "webhooks"],
  },
  {
    id: "r-4-1-2",
    version: "v4.1.2",
    type: "patch",
    date: "Jun 30, 2026",
    title: "Fix queue depth metric under-counting on fan-out",
    summary:
      "Queues created via fan-out from a parent job were missing from the queue-depth gauge, which made autoscaling under-provision workers during traffic spikes.",
    changes: [
      "Fan-out child queues now register with the metrics collector at creation time instead of on first poll.",
      "Corrected an off-by-one in the depth gauge reset that occurred exactly at queue drain.",
      "Autoscaler now reads depth from the corrected gauge; no config change needed.",
    ],
    authorName: "Sana Okafor",
    authorRole: "Site Reliability Engineer",
    tags: ["bugfix", "metrics", "autoscaling"],
  },
  {
    id: "r-4-1-1",
    version: "v4.1.1",
    type: "patch",
    date: "Jun 18, 2026",
    title: "Retry backoff jitter fix",
    summary:
      "Retry backoff was computing jitter from a shared counter across all workers in a pool, so retries clustered instead of spreading — the opposite of what jitter is for.",
    changes: [
      "Jitter is now seeded per worker process at startup instead of shared across the pool.",
      "Default backoff curve unchanged: base 500ms, factor 2, capped at 30s.",
      "Added a `retry.jitter_ms` field to job event logs for auditing spread.",
    ],
    authorName: "Priya Naik",
    authorRole: "Engineering Lead, Workflows",
    tags: ["bugfix", "retries"],
  },
  {
    id: "r-4-1-0",
    version: "v4.1.0",
    type: "minor",
    date: "Jun 4, 2026",
    title: "Priority lanes for queues",
    summary:
      "Queues can now declare up to four priority lanes so latency-sensitive jobs skip ahead of backfill work without needing a second queue and its own worker pool.",
    changes: [
      "New `queue.lane` option accepts `critical | high | normal | low`; unset jobs default to `normal`.",
      "Workers drain lanes in strict priority order within a queue, with starvation guard: `low` gets a guaranteed 5% of worker time even under sustained `critical` load.",
      "Dashboard: queue detail view adds a per-lane depth breakdown.",
    ],
    authorName: "Dev Ferreira",
    authorRole: "Product Engineer",
    tags: ["queues", "scheduling"],
  },
  {
    id: "r-4-0-0",
    version: "v4.0.0",
    type: "major",
    date: "May 14, 2026",
    title: "Regional queue replicas",
    summary:
      "Queues can now replicate across two regions with leader election, so a regional outage fails over workers to the surviving region instead of pausing all processing.",
    changes: [
      "New `region_replicas` field on queue creation; supports exactly one secondary region per queue in this release.",
      "Leader election uses a lease-based protocol with a 10s lease and 3s renewal interval.",
      "Breaking: queue IDs are now globally namespaced by home region (`use1:orders` rather than `orders`) — existing queue IDs are migrated automatically on upgrade.",
      "Failover typically completes in under 15 seconds from leader-lease expiry; observed in the announcement post's load test.",
    ],
    authorName: "Priya Naik",
    authorRole: "Engineering Lead, Workflows",
    tags: ["reliability", "multi-region", "breaking-change"],
  },
  {
    id: "r-3-6-1",
    version: "v3.6.1",
    type: "security",
    date: "Apr 28, 2026",
    title: "Dependency bump for CVE-2026-31007",
    summary:
      "Updated the bundled TLS termination library to patch a denial-of-service issue in malformed-certificate handling disclosed upstream. No Keelson-specific exploit path was identified.",
    changes: [
      "Bumped the vendored TLS library to the patched release.",
      "Added a fuzz test for malformed client certificates to the security regression suite.",
      "No customer action required — this ships in the standard worker image on next deploy.",
    ],
    authorName: "Marcus Aldrin",
    authorRole: "Security Engineer",
    tags: ["security", "dependencies"],
  },
  {
    id: "r-3-6-0",
    version: "v3.6.0",
    type: "minor",
    date: "Apr 9, 2026",
    title: "Dead-letter queue inspector",
    summary:
      "Failed jobs that exhaust retries now land in a browsable dead-letter queue in the dashboard, with one-click replay against the original queue.",
    changes: [
      "New dashboard panel lists dead-lettered jobs with the failure reason from the last attempt.",
      "`Replay` re-enqueues the job payload unchanged; `Replay with edits` opens the payload in a JSON editor first.",
      "Dead-lettered jobs retain a 30-day TTL before permanent deletion, configurable per queue.",
    ],
    authorName: "Dev Ferreira",
    authorRole: "Product Engineer",
    tags: ["dashboard", "reliability"],
  },
  {
    id: "r-3-5-0",
    version: "v3.5.0",
    type: "minor",
    date: "Mar 19, 2026",
    title: "Scheduled jobs with cron and RRULE",
    summary:
      "Recurring jobs no longer need an external cron trigger — schedule directly against a queue using either cron syntax or an RRULE string for calendar-aware recurrence.",
    changes: [
      "New `schedule.create()` API accepts `cron` or `rrule`; both resolve to the same internal scheduler.",
      "RRULE support covers `FREQ`, `INTERVAL`, `BYDAY`, and `UNTIL` — enough for \"first weekday of the month\" style schedules.",
      "Missed schedules (worker downtime) run once on recovery by default, or can be set to skip via `catchUp: false`.",
    ],
    authorName: "Sana Okafor",
    authorRole: "Site Reliability Engineer",
    tags: ["scheduling"],
  },
  {
    id: "r-3-4-2",
    version: "v3.4.2",
    type: "patch",
    date: "Feb 26, 2026",
    title: "Fix memory growth in long-lived worker connections",
    summary:
      "Workers connected for more than 24 hours accumulated a small per-message buffer that was never released, showing up as slow, steady RSS growth in long-running deployments.",
    changes: [
      "Message buffers are now released after handoff instead of retained for a debug code path that shipped disabled by default.",
      "Verified against a 72-hour soak test; RSS is now flat within measurement noise.",
    ],
    authorName: "Sana Okafor",
    authorRole: "Site Reliability Engineer",
    tags: ["bugfix", "performance"],
  },
];
