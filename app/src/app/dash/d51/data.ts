import {
  Activity,
  Bell,
  Database,
  Download,
  Globe,
  KeyRound,
  Plug,
  Radio,
  Settings2,
  ShieldAlert,
  ShieldCheck,
  UserCog,
  Users,
} from "lucide-react";
import type { EventCategory, Outcome, Severity } from "./tokens";

export const BRAND = { name: "Redoubt", Icon: ShieldAlert };

export const WORKSPACES = [
  { id: "ws-prod", name: "Repick Security", plan: "Enterprise · prod" },
  { id: "ws-sandbox", name: "Repick Sandbox", plan: "Trial · staging" },
];

// Reused Unsplash photo IDs (already vetted in this repo's dash catalogue for stable delivery).
const AVATAR = {
  priya: "1494790108377-be9c29b29330",
  jonas: "1438761681033-6461ffad8d80",
  elena: "1502685104226-ee32379fefbe",
  marcus: "1472099645785-5658abf4ff4e",
};

export const CURRENT_USER = {
  name: "Priya Anand",
  role: "Security Lead",
  email: "priya.anand@repick.io",
  avatarId: AVATAR.priya,
};

export const NAV_SECTIONS = [
  {
    id: "monitor",
    title: "Monitor",
    items: [
      { id: "stream", label: "Event stream", Icon: Radio, active: true },
      { id: "alerts", label: "Live alerts", Icon: Bell },
      { id: "digest", label: "Anomaly digest", Icon: Activity, disabled: true },
    ],
  },
  {
    id: "access",
    title: "Access",
    items: [
      { id: "actors", label: "Actors & roles", Icon: Users },
      { id: "policies", label: "Policies", Icon: ShieldCheck },
      { id: "keys", label: "API keys", Icon: KeyRound },
    ],
  },
  {
    id: "workspace",
    title: "Workspace",
    items: [
      { id: "integrations", label: "Integrations", Icon: Plug },
      { id: "exports", label: "Audit exports", Icon: Download },
      { id: "settings", label: "Settings", Icon: Settings2 },
    ],
  },
];

export type ActorKind = "human" | "service" | "unknown";
export interface Actor {
  id: string;
  name: string;
  kind: ActorKind;
  title: string;
  avatarId?: string;
  Icon: typeof UserCog;
}

export const ACTORS: Actor[] = [
  { id: "priya.anand", name: "Priya Anand", kind: "human", title: "Security Lead", avatarId: AVATAR.priya, Icon: UserCog },
  { id: "jonas.berg", name: "Jonas Berg", kind: "human", title: "Platform Engineer", avatarId: AVATAR.jonas, Icon: UserCog },
  { id: "elena.cho", name: "Elena Cho", kind: "human", title: "IAM Admin", avatarId: AVATAR.elena, Icon: UserCog },
  { id: "marcus.webb", name: "Marcus Webb", kind: "human", title: "Support Engineer", avatarId: AVATAR.marcus, Icon: UserCog },
  { id: "svc-billing-worker", name: "svc-billing-worker", kind: "service", title: "Billing worker", Icon: Settings2 },
  { id: "svc-etl-pipeline", name: "svc-etl-pipeline", kind: "service", title: "ETL pipeline", Icon: Database },
  { id: "ci-deploy-bot", name: "ci-deploy-bot", kind: "service", title: "CI/CD deploy bot", Icon: Plug },
  { id: "unknown-203-0-113-44", name: "Unattributed · 203.0.113.44", kind: "unknown", title: "No matching session", Icon: Globe },
];

export function actorById(id: string): Actor {
  return ACTORS.find((a) => a.id === id) ?? ACTORS[ACTORS.length - 1];
}

export interface AuditEvent {
  id: string;
  ts: string; // ISO 8601, always constructed from a literal string — never Date.now()/new Date()
  actorId: string;
  category: EventCategory;
  type: string;
  severity: Severity;
  outcome: Outcome;
  resource: string;
  ip: string;
  location: string;
  summary: string;
  detail: string;
  requestId: string;
  sessionId: string;
  userAgent: string;
  relatedIds?: string[];
}

// 48 events across the last ~44h (2026-08-28 through 2026-08-30 morning), hand-authored so the
// severity/outcome/actor mix reads as a plausible incident narrative rather than shuffled noise.
export const EVENTS: AuditEvent[] = [
  { id: "ev-048", ts: "2026-08-30T09:52:04", actorId: "priya.anand", category: "admin", type: "admin.audit_log_exported", severity: "medium", outcome: "success", resource: "audit-log/2026-08", ip: "10.4.2.11", location: "Seoul, KR", summary: "Exported August audit log to CSV", detail: "Full-month export requested from the Audit Exports panel, 6,214 rows, scoped to workspace ws-prod.", requestId: "req-9f21ac", sessionId: "sess-88b1", userAgent: "Chrome 128 · macOS", relatedIds: [] },
  { id: "ev-047", ts: "2026-08-30T09:41:12", actorId: "unknown-203-0-113-44", category: "auth", type: "auth.login_failed", severity: "high", outcome: "failed", resource: "session/login", ip: "203.0.113.44", location: "Unresolved · Tor exit", summary: "5th failed login for jonas.berg in 4 minutes", detail: "Password attempt rejected. Origin IP has no prior session history on this workspace. Account auto-locked after this attempt.", requestId: "req-6c40e2", sessionId: "—", userAgent: "curl/8.4.0", relatedIds: ["ev-046", "ev-045", "ev-044"] },
  { id: "ev-046", ts: "2026-08-30T09:40:31", actorId: "unknown-203-0-113-44", category: "auth", type: "auth.login_failed", severity: "high", outcome: "failed", resource: "session/login", ip: "203.0.113.44", location: "Unresolved · Tor exit", summary: "4th failed login for jonas.berg", detail: "Password attempt rejected.", requestId: "req-6c40d1", sessionId: "—", userAgent: "curl/8.4.0", relatedIds: ["ev-047", "ev-045"] },
  { id: "ev-045", ts: "2026-08-30T09:39:58", actorId: "unknown-203-0-113-44", category: "auth", type: "auth.login_failed", severity: "medium", outcome: "failed", resource: "session/login", ip: "203.0.113.44", location: "Unresolved · Tor exit", summary: "3rd failed login for jonas.berg", detail: "Password attempt rejected.", requestId: "req-6c40c0", sessionId: "—", userAgent: "curl/8.4.0", relatedIds: ["ev-047"] },
  { id: "ev-044", ts: "2026-08-30T09:38:20", actorId: "unknown-203-0-113-44", category: "network", type: "network.rate_limit_triggered", severity: "medium", outcome: "blocked", resource: "api/auth", ip: "203.0.113.44", location: "Unresolved · Tor exit", summary: "Rate limit tripped on /api/auth", detail: "12 requests/second sustained for 8 seconds, throttled at the edge before reaching the auth service.", requestId: "req-6c409a", sessionId: "—", userAgent: "curl/8.4.0", relatedIds: ["ev-047"] },
  { id: "ev-043", ts: "2026-08-30T08:55:47", actorId: "elena.cho", category: "access", type: "access.role_elevated", severity: "high", outcome: "success", resource: "role/billing-admin", ip: "10.4.2.30", location: "Seoul, KR", summary: "Elevated marcus.webb to billing-admin", detail: "Temporary elevation, expires in 8h. Approved via two-person change ticket CHG-1188.", requestId: "req-5a11ef", sessionId: "sess-71c4", userAgent: "Firefox 130 · Windows", relatedIds: [] },
  { id: "ev-042", ts: "2026-08-30T08:40:03", actorId: "svc-billing-worker", category: "data", type: "data.export", severity: "high", outcome: "success", resource: "invoices/2026-Q3", ip: "10.6.0.4", location: "us-east-1 (internal)", summary: "Bulk export of 2,140 Q3 invoices", detail: "Scheduled export to the finance data warehouse. Matches recurring job schedule sched-invoices-q3.", requestId: "req-4d0a19", sessionId: "svc-job-2214", userAgent: "internal-worker/2.9", relatedIds: [] },
  { id: "ev-041", ts: "2026-08-30T08:12:55", actorId: "marcus.webb", category: "auth", type: "auth.login", severity: "info", outcome: "success", resource: "session/login", ip: "172.16.9.4", location: "Austin, US", summary: "Signed in with SSO + hardware key", detail: "WebAuthn challenge satisfied on first attempt.", requestId: "req-3b9c02", sessionId: "sess-90f2", userAgent: "Safari 18 · macOS", relatedIds: [] },
  { id: "ev-040", ts: "2026-08-30T07:58:14", actorId: "jonas.berg", category: "config", type: "config.mfa_policy_updated", severity: "high", outcome: "success", resource: "policy/mfa-required", ip: "10.4.2.19", location: "Berlin, DE", summary: "Tightened MFA policy to require hardware keys", detail: "Policy now rejects SMS as a second factor for roles above viewer. Rolls out to all sessions on next login.", requestId: "req-2f7710", sessionId: "sess-65a0", userAgent: "Chrome 128 · Linux", relatedIds: [] },
  { id: "ev-039", ts: "2026-08-30T07:30:41", actorId: "svc-etl-pipeline", category: "data", type: "data.record_viewed", severity: "info", outcome: "success", resource: "customer-records/batch-2214", ip: "10.6.0.9", location: "us-east-1 (internal)", summary: "Read 3,402 customer records for nightly sync", detail: "Scheduled ETL read, no export or download attached.", requestId: "req-1e6688", sessionId: "svc-job-2213", userAgent: "internal-worker/2.9", relatedIds: [] },
  { id: "ev-038", ts: "2026-08-30T06:44:09", actorId: "ci-deploy-bot", category: "admin", type: "admin.api_key_created", severity: "medium", outcome: "success", resource: "api-key/deploy-prod-08", ip: "10.6.0.2", location: "us-east-1 (internal)", summary: "New deploy key issued for prod pipeline", detail: "Scoped to deploy:write only, 90-day expiry, rotates ci-deploy-key-07.", requestId: "req-0a5521", sessionId: "svc-ci-4421", userAgent: "github-actions/2.318", relatedIds: [] },
  { id: "ev-037", ts: "2026-08-30T05:12:37", actorId: "priya.anand", category: "auth", type: "auth.login", severity: "info", outcome: "success", resource: "session/login", ip: "10.4.2.11", location: "Seoul, KR", summary: "Signed in with SSO", detail: "Routine morning sign-in from a known device.", requestId: "req-f92e40", sessionId: "sess-52c9", userAgent: "Chrome 128 · macOS", relatedIds: [] },
  { id: "ev-036", ts: "2026-08-30T02:03:55", actorId: "unknown-203-0-113-44", category: "auth", type: "auth.login_failed", severity: "low", outcome: "failed", resource: "session/login", ip: "198.51.100.7", location: "Unresolved", summary: "Failed login for a deleted account", detail: "Username no longer exists on this workspace; likely stale credential from a phishing list.", requestId: "req-e81a02", sessionId: "—", userAgent: "python-requests/2.31", relatedIds: [] },
  { id: "ev-035", ts: "2026-08-30T00:47:18", actorId: "svc-etl-pipeline", category: "config", type: "config.changed", severity: "low", outcome: "success", resource: "job/nightly-sync", ip: "10.6.0.9", location: "us-east-1 (internal)", summary: "Adjusted nightly sync batch size", detail: "Batch size raised from 500 to 750 records to shorten the sync window.", requestId: "req-d70df1", sessionId: "svc-job-2210", userAgent: "internal-worker/2.9", relatedIds: [] },
  { id: "ev-034", ts: "2026-08-30T00:14:29", actorId: "elena.cho", category: "admin", type: "admin.impersonation_started", severity: "critical", outcome: "success", resource: "user/customer-42881", ip: "10.4.2.30", location: "Seoul, KR", summary: "Started support impersonation session", detail: "Impersonating customer-42881 to reproduce a billing defect. Session capped at 30 minutes, auto-logged to the support ticket.", requestId: "req-c60ab8", sessionId: "sess-imp-118", userAgent: "Firefox 130 · Windows", relatedIds: ["ev-033"] },
  { id: "ev-033", ts: "2026-08-30T00:44:02", actorId: "elena.cho", category: "admin", type: "admin.impersonation_started", severity: "info", outcome: "success", resource: "user/customer-42881", ip: "10.4.2.30", location: "Seoul, KR", summary: "Ended support impersonation session", detail: "Session closed after 29m41s, within policy limit.", requestId: "req-c60c19", sessionId: "sess-imp-118", userAgent: "Firefox 130 · Windows", relatedIds: ["ev-034"] },
  { id: "ev-032", ts: "2026-08-29T23:58:41", actorId: "jonas.berg", category: "data", type: "data.bulk_delete", severity: "critical", outcome: "success", resource: "storage-bucket/archive-2023", ip: "10.4.2.19", location: "Berlin, DE", summary: "Deleted 1,880 archived objects", detail: "Retention policy cleanup for the 2023 archive bucket, pre-approved in change ticket CHG-1174. Objects were already past the 3-year retention window.", requestId: "req-b41220", sessionId: "sess-65a0", userAgent: "Chrome 128 · Linux", relatedIds: [] },
  { id: "ev-031", ts: "2026-08-29T22:31:15", actorId: "marcus.webb", category: "access", type: "access.denied", severity: "high", outcome: "blocked", resource: "billing/refunds", ip: "172.16.9.4", location: "Austin, US", summary: "Denied access to refunds console", detail: "Role support-engineer lacks refunds:write. Attempted a manual refund outside policy; escalated to Elena Cho for review.", requestId: "req-a30e97", sessionId: "sess-90f2", userAgent: "Safari 18 · macOS", relatedIds: [] },
  { id: "ev-030", ts: "2026-08-29T21:05:52", actorId: "priya.anand", category: "network", type: "network.firewall_blocked", severity: "high", outcome: "blocked", resource: "vpc/prod-db", ip: "45.33.22.11", location: "Unresolved", summary: "Firewall blocked inbound scan on prod-db subnet", detail: "Port sweep across 1,024 ports in 40 seconds, matched the known-scanner signature and dropped at the edge.", requestId: "req-9910c4", sessionId: "—", userAgent: "masscan/1.3.2", relatedIds: [] },
  { id: "ev-029", ts: "2026-08-29T20:12:08", actorId: "svc-billing-worker", category: "data", type: "data.export", severity: "medium", outcome: "success", resource: "payouts/2026-08", ip: "10.6.0.4", location: "us-east-1 (internal)", summary: "Exported monthly payout report", detail: "Scheduled export to the accounting SFTP drop.", requestId: "req-88d701", sessionId: "svc-job-2201", userAgent: "internal-worker/2.9", relatedIds: [] },
  { id: "ev-028", ts: "2026-08-29T19:44:37", actorId: "elena.cho", category: "access", type: "access.permission_granted", severity: "medium", outcome: "success", resource: "workspace/ws-sandbox", ip: "10.4.2.30", location: "Seoul, KR", summary: "Granted jonas.berg editor on ws-sandbox", detail: "Onboarding grant for the Q3 sandbox migration project.", requestId: "req-77c990", sessionId: "sess-71c4", userAgent: "Firefox 130 · Windows", relatedIds: [] },
  { id: "ev-027", ts: "2026-08-29T18:20:19", actorId: "ci-deploy-bot", category: "config", type: "config.changed", severity: "medium", outcome: "success", resource: "feature-flag/new-checkout", ip: "10.6.0.2", location: "us-east-1 (internal)", summary: "Flipped new-checkout flag to 100% rollout", detail: "Gradual rollout completed without error-rate regression; promoted from 25% to full.", requestId: "req-66aa11", sessionId: "svc-ci-4408", userAgent: "github-actions/2.318", relatedIds: [] },
  { id: "ev-026", ts: "2026-08-29T17:02:44", actorId: "marcus.webb", category: "auth", type: "auth.mfa_challenge", severity: "info", outcome: "success", resource: "session/mfa", ip: "172.16.9.4", location: "Austin, US", summary: "MFA challenge satisfied", detail: "TOTP code accepted on first entry.", requestId: "req-559b70", sessionId: "sess-90f2", userAgent: "Safari 18 · macOS", relatedIds: [] },
  { id: "ev-025", ts: "2026-08-29T16:11:03", actorId: "unknown-203-0-113-44", category: "network", type: "network.rate_limit_triggered", severity: "low", outcome: "blocked", resource: "api/public", ip: "198.51.100.22", location: "Unresolved", summary: "Public API rate limit reached", detail: "Anonymous client exceeded 60 requests/minute on the public read-only endpoint.", requestId: "req-441c8e", sessionId: "—", userAgent: "python-requests/2.31", relatedIds: [] },
  { id: "ev-024", ts: "2026-08-29T15:38:26", actorId: "jonas.berg", category: "admin", type: "admin.api_key_revoked", severity: "low", outcome: "success", resource: "api-key/deploy-prod-06", ip: "10.4.2.19", location: "Berlin, DE", summary: "Revoked stale deploy key", detail: "Key had not been used in 47 days; revoked as part of quarterly key hygiene.", requestId: "req-33ef50", sessionId: "sess-65a0", userAgent: "Chrome 128 · Linux", relatedIds: [] },
  { id: "ev-023", ts: "2026-08-29T15:02:59", actorId: "priya.anand", category: "access", type: "access.permission_revoked", severity: "medium", outcome: "success", resource: "role/finance-viewer", ip: "10.4.2.11", location: "Seoul, KR", summary: "Revoked finance-viewer from a contractor account", detail: "Contract ended; access removed same day per offboarding checklist.", requestId: "req-22c0a1", sessionId: "sess-52c9", userAgent: "Chrome 128 · macOS", relatedIds: [] },
  { id: "ev-022", ts: "2026-08-29T14:47:12", actorId: "svc-etl-pipeline", category: "data", type: "data.record_viewed", severity: "info", outcome: "success", resource: "customer-records/batch-2209", ip: "10.6.0.9", location: "us-east-1 (internal)", summary: "Read 2,918 customer records for nightly sync", detail: "Scheduled ETL read.", requestId: "req-119a4c", sessionId: "svc-job-2196", userAgent: "internal-worker/2.9", relatedIds: [] },
  { id: "ev-021", ts: "2026-08-29T13:59:40", actorId: "elena.cho", category: "auth", type: "auth.password_reset", severity: "medium", outcome: "success", resource: "session/password", ip: "10.4.2.30", location: "Seoul, KR", summary: "Reset own password after routine rotation prompt", detail: "90-day rotation policy prompt, completed within the grace window.", requestId: "req-0057de", sessionId: "sess-71c4", userAgent: "Firefox 130 · Windows", relatedIds: [] },
  { id: "ev-020", ts: "2026-08-29T13:15:07", actorId: "marcus.webb", category: "data", type: "data.export", severity: "medium", outcome: "success", resource: "tickets/closed-q3", ip: "172.16.9.4", location: "Austin, US", summary: "Exported closed-ticket CSV for QBR", detail: "412 rows, scoped to Q3 closed tickets only.", requestId: "req-fe4a90", sessionId: "sess-90f2", userAgent: "Safari 18 · macOS", relatedIds: [] },
  { id: "ev-019", ts: "2026-08-29T12:30:51", actorId: "unknown-203-0-113-44", category: "auth", type: "auth.login_failed", severity: "medium", outcome: "failed", resource: "session/login", ip: "203.0.113.91", location: "Unresolved", summary: "Failed login, unrecognized username", detail: "No matching account for the attempted username.", requestId: "req-d21b30", sessionId: "—", userAgent: "python-requests/2.31", relatedIds: [] },
  { id: "ev-018", ts: "2026-08-29T11:48:22", actorId: "jonas.berg", category: "network", type: "network.vpn_connected", severity: "info", outcome: "success", resource: "vpn/eu-tunnel-2", ip: "10.4.2.19", location: "Berlin, DE", summary: "Connected to eu-tunnel-2", detail: "Standard workday VPN session start.", requestId: "req-c88801", sessionId: "sess-65a0", userAgent: "Chrome 128 · Linux", relatedIds: [] },
  { id: "ev-017", ts: "2026-08-29T10:59:38", actorId: "priya.anand", category: "config", type: "config.changed", severity: "low", outcome: "success", resource: "policy/session-timeout", ip: "10.4.2.11", location: "Seoul, KR", summary: "Shortened idle session timeout to 20 minutes", detail: "Reduced from 45 minutes as part of the Q3 hardening pass.", requestId: "req-b0f712", sessionId: "sess-52c9", userAgent: "Chrome 128 · macOS", relatedIds: [] },
  { id: "ev-016", ts: "2026-08-29T10:04:15", actorId: "svc-billing-worker", category: "config", type: "config.changed", severity: "low", outcome: "success", resource: "job/invoice-retry", ip: "10.6.0.4", location: "us-east-1 (internal)", summary: "Increased invoice retry attempts to 5", detail: "Reduces false-positive payment failures on transient gateway errors.", requestId: "req-a49c88", sessionId: "svc-job-2189", userAgent: "internal-worker/2.9", relatedIds: [] },
  { id: "ev-015", ts: "2026-08-29T09:22:47", actorId: "elena.cho", category: "access", type: "access.role_elevated", severity: "high", outcome: "success", resource: "role/iam-admin", ip: "10.4.2.30", location: "Seoul, KR", summary: "Elevated own role during on-call rotation", detail: "Break-glass elevation for the on-call IAM window, auto-expires in 4h, dual-logged per policy.", requestId: "req-9d1145", sessionId: "sess-71c4", userAgent: "Firefox 130 · Windows", relatedIds: [] },
  { id: "ev-014", ts: "2026-08-29T08:41:03", actorId: "ci-deploy-bot", category: "admin", type: "admin.api_key_created", severity: "medium", outcome: "success", resource: "api-key/staging-01", ip: "10.6.0.2", location: "us-east-1 (internal)", summary: "New staging key issued", detail: "Scoped to staging environment only, 30-day expiry.", requestId: "req-8ecb70", sessionId: "svc-ci-4390", userAgent: "github-actions/2.318", relatedIds: [] },
  { id: "ev-013", ts: "2026-08-29T07:55:29", actorId: "marcus.webb", category: "auth", type: "auth.login", severity: "info", outcome: "success", resource: "session/login", ip: "172.16.9.4", location: "Austin, US", summary: "Signed in with SSO + hardware key", detail: "Routine sign-in.", requestId: "req-7a3320", sessionId: "sess-88a1", userAgent: "Safari 18 · macOS", relatedIds: [] },
  { id: "ev-012", ts: "2026-08-29T07:10:44", actorId: "jonas.berg", category: "data", type: "data.record_viewed", severity: "info", outcome: "success", resource: "customer-records/cust-8821", ip: "10.4.2.19", location: "Berlin, DE", summary: "Viewed a single customer record", detail: "Opened while investigating a support escalation.", requestId: "req-64f209", sessionId: "sess-65a0", userAgent: "Chrome 128 · Linux", relatedIds: [] },
  { id: "ev-011", ts: "2026-08-29T06:33:12", actorId: "svc-etl-pipeline", category: "network", type: "network.vpn_connected", severity: "info", outcome: "success", resource: "vpn/internal-mesh", ip: "10.6.0.9", location: "us-east-1 (internal)", summary: "Internal mesh session established", detail: "Scheduled job start.", requestId: "req-51ab90", sessionId: "svc-job-2180", userAgent: "internal-worker/2.9", relatedIds: [] },
  { id: "ev-010", ts: "2026-08-29T06:02:57", actorId: "priya.anand", category: "admin", type: "admin.audit_log_exported", severity: "low", outcome: "success", resource: "audit-log/2026-07", ip: "10.4.2.11", location: "Seoul, KR", summary: "Exported July audit log", detail: "Routine monthly archive, 5,802 rows.", requestId: "req-40e112", sessionId: "sess-52c9", userAgent: "Chrome 128 · macOS", relatedIds: [] },
  { id: "ev-009", ts: "2026-08-29T05:18:35", actorId: "unknown-203-0-113-44", category: "network", type: "network.firewall_blocked", severity: "medium", outcome: "blocked", resource: "vpc/prod-api", ip: "185.220.101.4", location: "Unresolved · Tor exit", summary: "Firewall blocked probe against prod-api", detail: "Single blocked request, no follow-up traffic from this address in the next hour.", requestId: "req-2fd881", sessionId: "—", userAgent: "curl/8.4.0", relatedIds: [] },
  { id: "ev-008", ts: "2026-08-29T04:47:09", actorId: "elena.cho", category: "access", type: "access.permission_granted", severity: "low", outcome: "success", resource: "workspace/ws-prod", ip: "10.4.2.30", location: "Seoul, KR", summary: "Granted marcus.webb read access to billing", detail: "Standard support-tier read grant.", requestId: "req-1c9902", sessionId: "sess-71c4", userAgent: "Firefox 130 · Windows", relatedIds: [] },
  { id: "ev-007", ts: "2026-08-29T03:55:41", actorId: "svc-billing-worker", category: "data", type: "data.export", severity: "low", outcome: "success", resource: "receipts/2026-08-28", ip: "10.6.0.4", location: "us-east-1 (internal)", summary: "Exported daily receipts batch", detail: "Scheduled export to storage bucket.", requestId: "req-0b7712", sessionId: "svc-job-2172", userAgent: "internal-worker/2.9", relatedIds: [] },
  { id: "ev-006", ts: "2026-08-29T02:40:18", actorId: "jonas.berg", category: "config", type: "config.changed", severity: "low", outcome: "success", resource: "job/log-retention", ip: "10.4.2.19", location: "Berlin, DE", summary: "Extended log retention to 180 days", detail: "Compliance request, applies to all new logs going forward.", requestId: "req-f61c04", sessionId: "sess-64e0", userAgent: "Chrome 128 · Linux", relatedIds: [] },
  { id: "ev-005", ts: "2026-08-29T01:22:52", actorId: "priya.anand", category: "auth", type: "auth.login", severity: "info", outcome: "success", resource: "session/login", ip: "10.4.2.11", location: "Seoul, KR", summary: "Signed in with SSO", detail: "Late-night incident follow-up.", requestId: "req-e51a70", sessionId: "sess-50b1", userAgent: "Chrome 128 · macOS", relatedIds: [] },
  { id: "ev-004", ts: "2026-08-29T00:44:29", actorId: "unknown-203-0-113-44", category: "auth", type: "auth.login_failed", severity: "low", outcome: "failed", resource: "session/login", ip: "203.0.113.44", location: "Unresolved · Tor exit", summary: "1st failed login for jonas.berg", detail: "Password attempt rejected. First sighting of this IP against this workspace.", requestId: "req-c33c10", sessionId: "—", userAgent: "curl/8.4.0", relatedIds: ["ev-047"] },
  { id: "ev-003", ts: "2026-08-28T23:10:07", actorId: "elena.cho", category: "access", type: "access.denied", severity: "medium", outcome: "blocked", resource: "billing/refunds", ip: "10.4.2.30", location: "Seoul, KR", summary: "Denied own attempt to bypass approval step", detail: "System blocked a refund submission missing the required second approver.", requestId: "req-a9e401", sessionId: "sess-71c4", userAgent: "Firefox 130 · Windows", relatedIds: [] },
  { id: "ev-002", ts: "2026-08-28T21:58:33", actorId: "ci-deploy-bot", category: "config", type: "config.changed", severity: "medium", outcome: "success", resource: "feature-flag/new-checkout", ip: "10.6.0.2", location: "us-east-1 (internal)", summary: "Raised new-checkout flag to 25% rollout", detail: "Second stage of the gradual rollout plan.", requestId: "req-8813c9", sessionId: "svc-ci-4381", userAgent: "github-actions/2.318", relatedIds: [] },
  { id: "ev-001", ts: "2026-08-28T20:31:16", actorId: "marcus.webb", category: "auth", type: "auth.mfa_challenge", severity: "info", outcome: "success", resource: "session/mfa", ip: "172.16.9.4", location: "Austin, US", summary: "MFA challenge satisfied", detail: "TOTP code accepted.", requestId: "req-77f200", sessionId: "sess-88a1", userAgent: "Safari 18 · macOS", relatedIds: [] },
];

// Independent aggregate — deliberately hand-authored per window rather than derived by filtering
// EVENTS, so the Actor Risk Index panel's own period toggle never shares state or a recompute path
// with the event-stream filters (see the "partial recompute vs. independent widget" split in
// RedoubtClient.tsx). Totals are internally consistent within each window (critical <= events).
export type ActorWindow = "24h" | "7d" | "30d";
export interface ActorRisk {
  actorId: string;
  events: Record<ActorWindow, number>;
  critical: Record<ActorWindow, number>;
  risk: Record<ActorWindow, number>; // 0-100 composite score shown by the panel
  lastSeen: string;
}

export const ACTOR_RISK: ActorRisk[] = [
  { actorId: "unknown-203-0-113-44", events: { "24h": 6, "7d": 11, "30d": 18 }, critical: { "24h": 0, "7d": 0, "30d": 1 }, risk: { "24h": 78, "7d": 72, "30d": 61 }, lastSeen: "4m ago" },
  { actorId: "elena.cho", events: { "24h": 3, "7d": 9, "30d": 27 }, critical: { "24h": 1, "7d": 2, "30d": 4 }, risk: { "24h": 54, "7d": 47, "30d": 41 }, lastSeen: "51m ago" },
  { actorId: "jonas.berg", events: { "24h": 3, "7d": 8, "30d": 22 }, critical: { "24h": 0, "7d": 1, "30d": 2 }, risk: { "24h": 38, "7d": 35, "30d": 30 }, lastSeen: "1h ago" },
  { actorId: "svc-billing-worker", events: { "24h": 2, "7d": 6, "30d": 24 }, critical: { "24h": 0, "7d": 0, "30d": 0 }, risk: { "24h": 12, "7d": 11, "30d": 10 }, lastSeen: "1h ago" },
  { actorId: "priya.anand", events: { "24h": 2, "7d": 6, "30d": 19 }, critical: { "24h": 0, "7d": 0, "30d": 0 }, risk: { "24h": 9, "7d": 9, "30d": 8 }, lastSeen: "9m ago" },
  { actorId: "svc-etl-pipeline", events: { "24h": 2, "7d": 5, "30d": 21 }, critical: { "24h": 0, "7d": 0, "30d": 0 }, risk: { "24h": 7, "7d": 7, "30d": 6 }, lastSeen: "2h ago" },
  { actorId: "ci-deploy-bot", events: { "24h": 1, "7d": 4, "30d": 15 }, critical: { "24h": 0, "7d": 0, "30d": 0 }, risk: { "24h": 6, "7d": 6, "30d": 5 }, lastSeen: "3h ago" },
  { actorId: "marcus.webb", events: { "24h": 1, "7d": 5, "30d": 16 }, critical: { "24h": 0, "7d": 0, "30d": 0 }, risk: { "24h": 15, "7d": 13, "30d": 11 }, lastSeen: "1h ago" },
];

export function formatInt(n: number): string {
  return new Intl.NumberFormat("en-US").format(n);
}

export function formatTime(iso: string): string {
  return new Intl.DateTimeFormat("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }).format(new Date(iso));
}

export function formatDayLabel(iso: string): string {
  return new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "numeric" }).format(new Date(iso));
}

export function dayKey(iso: string): string {
  return iso.slice(0, 10);
}
