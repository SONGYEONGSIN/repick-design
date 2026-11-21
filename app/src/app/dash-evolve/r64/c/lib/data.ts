// Deterministic demo data for Vigil, a SOC alert-triage console. Every figure below is
// hand-authored — no Math.random(), no Date.now(), no bare `new Date()`. "Age" is stored as a
// fixed `ageMinutes` offset rather than a timestamp, so relative labels ("4m", "2h", "3d") and
// period filtering never depend on when the page happens to render.

export type AxisId =
  | "exploitability"
  | "blastRadius"
  | "dataSensitivity"
  | "externalExposure"
  | "detectionConfidence"
  | "recurrence";

export interface AxisDef {
  id: AxisId;
  label: string;
  shortLabel: string;
  description: string;
}

// Order here is also the radar's clockwise spoke order, starting at 12 o'clock.
export const AXES: AxisDef[] = [
  {
    id: "exploitability",
    label: "Exploitability",
    shortLabel: "Exploit.",
    description: "How readily this technique can be re-run against the same control gap.",
  },
  {
    id: "blastRadius",
    label: "Blast Radius",
    shortLabel: "Blast Radius",
    description: "Scope of systems or accounts reachable if this alert goes unaddressed.",
  },
  {
    id: "dataSensitivity",
    label: "Data Sensitivity",
    shortLabel: "Data Sens.",
    description: "Classification of the data the affected asset holds or can reach.",
  },
  {
    id: "externalExposure",
    label: "External Exposure",
    shortLabel: "Ext. Exposure",
    description: "How directly the activity touches the public internet or a third party.",
  },
  {
    id: "detectionConfidence",
    label: "Detection Confidence",
    shortLabel: "Detection",
    description: "Confidence that this signal is a true positive, not sensor noise.",
  },
  {
    id: "recurrence",
    label: "Recurrence",
    shortLabel: "Recurrence",
    description: "How often this exact pattern has fired across the fleet in the last 90 days.",
  },
];

export type RiskProfile = Record<AxisId, number>;

export type CategoryId =
  | "credential-access"
  | "lateral-movement"
  | "data-exfiltration"
  | "malware-execution"
  | "privilege-escalation"
  | "anomalous-login"
  | "cloud-misconfig";

export interface CategoryDef {
  id: CategoryId;
  label: string;
  shortLabel: string;
  /** 24h median risk profile for this category — the radar's "baseline" overlay. */
  baseline: RiskProfile;
}

export const CATEGORIES: CategoryDef[] = [
  {
    id: "credential-access",
    label: "Credential Access",
    shortLabel: "Credential Access",
    baseline: { exploitability: 72, blastRadius: 54, dataSensitivity: 61, externalExposure: 58, detectionConfidence: 47, recurrence: 66 },
  },
  {
    id: "lateral-movement",
    label: "Lateral Movement",
    shortLabel: "Lateral Movement",
    baseline: { exploitability: 65, blastRadius: 81, dataSensitivity: 57, externalExposure: 32, detectionConfidence: 41, recurrence: 52 },
  },
  {
    id: "data-exfiltration",
    label: "Data Exfiltration",
    shortLabel: "Data Exfiltration",
    baseline: { exploitability: 58, blastRadius: 70, dataSensitivity: 92, externalExposure: 77, detectionConfidence: 39, recurrence: 35 },
  },
  {
    id: "malware-execution",
    label: "Malware Execution",
    shortLabel: "Malware Execution",
    baseline: { exploitability: 83, blastRadius: 66, dataSensitivity: 48, externalExposure: 29, detectionConfidence: 61, recurrence: 44 },
  },
  {
    id: "privilege-escalation",
    label: "Privilege Escalation",
    shortLabel: "Privilege Escalation",
    baseline: { exploitability: 76, blastRadius: 88, dataSensitivity: 63, externalExposure: 24, detectionConfidence: 44, recurrence: 38 },
  },
  {
    id: "anomalous-login",
    label: "Anomalous Login",
    shortLabel: "Anomalous Login",
    baseline: { exploitability: 41, blastRadius: 36, dataSensitivity: 40, externalExposure: 69, detectionConfidence: 72, recurrence: 81 },
  },
  {
    id: "cloud-misconfig",
    label: "Cloud Misconfiguration",
    shortLabel: "Cloud Misconfig",
    baseline: { exploitability: 54, blastRadius: 73, dataSensitivity: 68, externalExposure: 85, detectionConfidence: 58, recurrence: 57 },
  },
];

export function categoryOf(id: CategoryId): CategoryDef {
  return CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[0];
}

export type Severity = "critical" | "high" | "medium" | "low";

// Index = sort rank, most severe first. Shared by every sort and SLA lookup so the ranking is
// defined exactly once.
export const SEVERITY_ORDER: Severity[] = ["critical", "high", "medium", "low"];

export const SEVERITY_LABEL: Record<Severity, string> = {
  critical: "Critical",
  high: "High",
  medium: "Medium",
  low: "Low",
};

// Minutes-to-acknowledge target per severity, used for the SLA burn-down bars.
export const SLA_TARGET_MINUTES: Record<Severity, number> = {
  critical: 30,
  high: 120,
  medium: 480,
  low: 1440,
};

export type AlertStatus = "open" | "investigating" | "resolved" | "suppressed";

export const STATUS_LABEL: Record<AlertStatus, string> = {
  open: "Open",
  investigating: "Investigating",
  resolved: "Resolved",
  suppressed: "Suppressed",
};

/** An alert counts against SLA burn only while it is still being worked. */
export function isActiveStatus(status: AlertStatus): boolean {
  return status === "open" || status === "investigating";
}

export type AnalystId = "n-ferreira" | "m-zhao" | "d-okafor" | "s-ibrahim" | "t-bergstrom";

export interface AnalystDef {
  id: AnalystId;
  name: string;
  initials: string;
  onCall: boolean;
}

export const ANALYSTS: AnalystDef[] = [
  { id: "n-ferreira", name: "Noah Ferreira", initials: "NF", onCall: true },
  { id: "m-zhao", name: "Mei-Lin Zhao", initials: "ML", onCall: true },
  { id: "d-okafor", name: "Dante Okafor", initials: "DO", onCall: false },
  { id: "s-ibrahim", name: "Sana Ibrahim", initials: "SI", onCall: false },
  { id: "t-bergstrom", name: "Theo Bergström", initials: "TB", onCall: true },
];

export function analystOf(id: AnalystId | null): AnalystDef | null {
  if (id === null) return null;
  return ANALYSTS.find((a) => a.id === id) ?? null;
}

export interface Alert {
  id: string;
  title: string;
  category: CategoryId;
  severity: Severity;
  status: AlertStatus;
  asset: string;
  source: string;
  analystId: AnalystId | null;
  /** Minutes since the alert fired, fixed per record — never computed from the clock. */
  ageMinutes: number;
  profile: RiskProfile;
  summary: string;
  recommendedAction: string;
}

export const ALERTS: Alert[] = [
  {
    id: "a1",
    title: "Impossible-travel login followed by MFA-fatigue push burst",
    category: "anomalous-login",
    severity: "critical",
    status: "open",
    asset: "okta:ops-team@vigil",
    source: "IdP — Okta Logs",
    analystId: "n-ferreira",
    ageMinutes: 4,
    profile: { exploitability: 58, blastRadius: 44, dataSensitivity: 52, externalExposure: 88, detectionConfidence: 81, recurrence: 90 },
    summary: "Login from Lagos six minutes after a Toronto session, then 14 rapid MFA push prompts to the same device.",
    recommendedAction: "Force a session revoke and step-up re-auth; correlate the device ID against the last 30 days of pushes.",
  },
  {
    id: "a2",
    title: "Outbound beacon from finance VPC to known C2 range",
    category: "malware-execution",
    severity: "high",
    status: "investigating",
    asset: "vpc-fin-prod / i-0a71c",
    source: "EDR — CrowdWatch",
    analystId: "m-zhao",
    ageMinutes: 11,
    profile: { exploitability: 86, blastRadius: 61, dataSensitivity: 55, externalExposure: 34, detectionConfidence: 63, recurrence: 29 },
    summary: "Periodic 60-second callbacks to an IP on this week's threat-intel blocklist.",
    recommendedAction: "Isolate the host from the network, snapshot memory, and open a malware case.",
  },
  {
    id: "a3",
    title: "Service account escalated to domain admin outside change window",
    category: "privilege-escalation",
    severity: "critical",
    status: "open",
    asset: "svc-backup-sync",
    source: "SIEM — Rule R-212",
    analystId: "d-okafor",
    ageMinutes: 23,
    profile: { exploitability: 79, blastRadius: 93, dataSensitivity: 66, externalExposure: 21, detectionConfidence: 52, recurrence: 31 },
    summary: "svc-backup-sync was added to Domain Admins at 02:14 UTC with no linked change ticket.",
    recommendedAction: "Revert the group membership, rotate the credential, and review the Group Policy audit trail.",
  },
  {
    id: "a4",
    title: "Bulk export of customer PII table flagged by DLP",
    category: "data-exfiltration",
    severity: "medium",
    status: "open",
    asset: "warehouse:customers_v2",
    source: "DLP — Export Guard",
    analystId: "s-ibrahim",
    ageMinutes: 47,
    profile: { exploitability: 49, blastRadius: 58, dataSensitivity: 95, externalExposure: 62, detectionConfidence: 55, recurrence: 24 },
    summary: "412k rows exported to a personal-Drive-linked connector during business hours.",
    recommendedAction: "Confirm the export was an approved analytics job; quarantine the sharing link if it was not.",
  },
  {
    id: "a5",
    title: "Repeated failed SSH attempts against the build fleet",
    category: "credential-access",
    severity: "high",
    status: "investigating",
    asset: "ci-runner-pool",
    source: "EDR — CrowdWatch",
    analystId: "n-ferreira",
    ageMinutes: 95,
    profile: { exploitability: 74, blastRadius: 48, dataSensitivity: 40, externalExposure: 71, detectionConfidence: 46, recurrence: 69 },
    summary: "312 failed key-based attempts from 3 IPs in 18 minutes; one runner was briefly unreachable.",
    recommendedAction: "Rotate exposed deploy keys, confirm the bastion allowlist, and watch for lockout retries.",
  },
  {
    id: "a6",
    title: "Ransomware-pattern file-rename burst on the file server",
    category: "malware-execution",
    severity: "critical",
    status: "investigating",
    asset: "fs-corp-02",
    source: "EDR — CrowdWatch",
    analystId: "m-zhao",
    ageMinutes: 180,
    profile: { exploitability: 91, blastRadius: 84, dataSensitivity: 70, externalExposure: 18, detectionConfidence: 74, recurrence: 22 },
    summary: "1,840 files renamed with a lockbit-style extension in under 90 seconds on a finance share.",
    recommendedAction: "Kill the process tree, disconnect the share, and validate the last clean backup snapshot.",
  },
  {
    id: "a7",
    title: "New inbound rule opens RDP to 0.0.0.0/0 on the staging subnet",
    category: "cloud-misconfig",
    severity: "medium",
    status: "open",
    asset: "sg-staging-web",
    source: "CloudTrail — Config Drift",
    analystId: "d-okafor",
    ageMinutes: 340,
    profile: { exploitability: 62, blastRadius: 69, dataSensitivity: 51, externalExposure: 97, detectionConfidence: 60, recurrence: 48 },
    summary: "sg-staging-web now accepts RDP from any source, added from the console rather than IaC.",
    recommendedAction: "Revert the rule, trace the console session, and confirm no inbound connections landed.",
  },
  {
    id: "a8",
    title: "Shared password reused across three service logins",
    category: "credential-access",
    severity: "low",
    status: "resolved",
    asset: "svc-reporting",
    source: "IdP — Okta Logs",
    analystId: "s-ibrahim",
    ageMinutes: 560,
    profile: { exploitability: 38, blastRadius: 30, dataSensitivity: 34, externalExposure: 22, detectionConfidence: 68, recurrence: 40 },
    summary: "Credential-stuffing detector flagged an identical password hash across three low-privilege accounts.",
    recommendedAction: "All three credentials were rotated; closed with no evidence of external use.",
  },
  {
    id: "a9",
    title: "Lateral RDP hop from the marketing subnet into the finance VLAN",
    category: "lateral-movement",
    severity: "high",
    status: "open",
    asset: "ws-mkt-114 → fin-vlan",
    source: "SIEM — Rule R-087",
    analystId: "t-bergstrom",
    ageMinutes: 910,
    profile: { exploitability: 68, blastRadius: 87, dataSensitivity: 60, externalExposure: 19, detectionConfidence: 49, recurrence: 33 },
    summary: "A workstation with no finance-access history opened an RDP session into the finance VLAN.",
    recommendedAction: "Validate the ticket for cross-VLAN access; isolate the workstation pending confirmation.",
  },
  {
    id: "a10",
    title: "Legacy SMBv1 probe against the print server, policy-suppressed",
    category: "lateral-movement",
    severity: "medium",
    status: "suppressed",
    asset: "print-svc-03",
    source: "EDR — CrowdWatch",
    analystId: null,
    ageMinutes: 1320,
    profile: { exploitability: 45, blastRadius: 40, dataSensitivity: 28, externalExposure: 15, detectionConfidence: 77, recurrence: 86 },
    summary: "Known-benign vulnerability-scanner sweep; matches suppression rule SUP-14.",
    recommendedAction: "No action — auto-suppressed by rule SUP-14; reviewed weekly for drift.",
  },
  {
    id: "a11",
    title: "DNS-tunneling exfiltration attempt blocked at egress",
    category: "data-exfiltration",
    severity: "critical",
    status: "resolved",
    asset: "edge-fw-02",
    source: "WAF — Egress Filter",
    analystId: "m-zhao",
    ageMinutes: 2150,
    profile: { exploitability: 71, blastRadius: 75, dataSensitivity: 89, externalExposure: 80, detectionConfidence: 83, recurrence: 19 },
    summary: "41MB encoded into TXT-record queries to a single apex domain, blocked by egress policy.",
    recommendedAction: "Confirmed blocked at the edge; host reimaged as a precaution, domain added to the blocklist.",
  },
  {
    id: "a12",
    title: "Admin console access from an unmanaged personal device",
    category: "credential-access",
    severity: "high",
    status: "investigating",
    asset: "console.vigil.internal",
    source: "IdP — Okta Logs",
    analystId: "n-ferreira",
    ageMinutes: 3400,
    profile: { exploitability: 63, blastRadius: 56, dataSensitivity: 58, externalExposure: 64, detectionConfidence: 51, recurrence: 57 },
    summary: "Admin session from a device with no MDM enrollment; geo is consistent with the employee.",
    recommendedAction: "Confirm with the employee directly; require device enrollment before the next session.",
  },
  {
    id: "a13",
    title: "Scheduled task syncs data off-hours to an external bucket",
    category: "data-exfiltration",
    severity: "medium",
    status: "resolved",
    asset: "job-scheduler-04",
    source: "SIEM — Rule R-140",
    analystId: "s-ibrahim",
    ageMinutes: 4700,
    profile: { exploitability: 52, blastRadius: 61, dataSensitivity: 84, externalExposure: 72, detectionConfidence: 58, recurrence: 27 },
    summary: "A task synced analytics exports to a bucket outside the approved account, daily at 02:00.",
    recommendedAction: "Confirmed an approved vendor migration; closed after the contract reference was verified.",
  },
  {
    id: "a14",
    title: "Expired TLS cert silently fell back to self-signed on the gateway",
    category: "cloud-misconfig",
    severity: "low",
    status: "suppressed",
    asset: "gw-api-eu",
    source: "CloudTrail — Config Drift",
    analystId: null,
    ageMinutes: 6200,
    profile: { exploitability: 22, blastRadius: 33, dataSensitivity: 29, externalExposure: 48, detectionConfidence: 70, recurrence: 61 },
    summary: "The certificate renewal job failed silently three cycles ago; the fallback cert has no CT log entry.",
    recommendedAction: "Suppressed pending the next maintenance window; renewal ticket OPS-5521 tracks the fix.",
  },
  {
    id: "a15",
    title: "Privileged query exported the full audit_log table to CSV",
    category: "data-exfiltration",
    severity: "high",
    status: "resolved",
    asset: "warehouse:audit_log",
    source: "DLP — Export Guard",
    analystId: "t-bergstrom",
    ageMinutes: 8100,
    profile: { exploitability: 55, blastRadius: 64, dataSensitivity: 90, externalExposure: 48, detectionConfidence: 66, recurrence: 21 },
    summary: "A compliance analyst exported the full audit table for the Q3 external audit, as scheduled.",
    recommendedAction: "Confirmed against the audit calendar; no further action needed.",
  },
  {
    id: "a16",
    title: "Brute-force credential stuffing against the partner API gateway",
    category: "credential-access",
    severity: "critical",
    status: "resolved",
    asset: "api-partners-gw",
    source: "WAF — Egress Filter",
    analystId: "d-okafor",
    ageMinutes: 9700,
    profile: { exploitability: 80, blastRadius: 52, dataSensitivity: 46, externalExposure: 91, detectionConfidence: 72, recurrence: 64 },
    summary: "214,000 credential pairs were attempted against the partner gateway in nine minutes, auto-blocked.",
    recommendedAction: "Confirmed blocked by the rate-limit rule; rotated the partner API keys as a precaution.",
  },
];

// The alert pinned in the inspector on first paint — the single open, unassigned-SLA-clock
// critical alert, so the inspector never opens on an empty or already-closed story.
export const DEFAULT_PINNED_ID = "a1";

export function alertOf(id: string): Alert {
  return ALERTS.find((a) => a.id === id) ?? ALERTS[0];
}

export type Period = "1h" | "24h" | "7d";

export const PERIOD_OPTIONS: { value: Period; label: string }[] = [
  { value: "1h", label: "1h" },
  { value: "24h", label: "24h" },
  { value: "7d", label: "7d" },
];

export const PERIOD_MINUTES: Record<Period, number> = { "1h": 60, "24h": 1440, "7d": 10080 };

export function alertsWithinPeriod(period: Period): Alert[] {
  const ceiling = PERIOD_MINUTES[period];
  return ALERTS.filter((a) => a.ageMinutes <= ceiling);
}

/** Reduced from the same filtered list it summarizes, so the four counts always sum to its
 * length — there is no separately hand-entered total to drift out of sync. */
export function severityCounts(alerts: Alert[]): Record<Severity, number> {
  const counts: Record<Severity, number> = { critical: 0, high: 0, medium: 0, low: 0 };
  for (const a of alerts) counts[a.severity] += 1;
  return counts;
}

/** Null once an alert is resolved or suppressed — its SLA clock has stopped. */
export function slaBurnPercent(alert: Alert): number | null {
  if (!isActiveStatus(alert.status)) return null;
  const target = SLA_TARGET_MINUTES[alert.severity];
  return Math.min(100, Math.round((alert.ageMinutes / target) * 100));
}

export interface AnalystWorkloadRow {
  analyst: AnalystDef;
  openCount: number;
  avgQueueMinutes: number;
}

/** Built entirely from the period-filtered alert list passed in — every row's count is a
 * reduction over real records, never a hand-entered figure. */
export function analystWorkload(alerts: Alert[]): AnalystWorkloadRow[] {
  return ANALYSTS.map((analyst) => {
    const assigned = alerts.filter((a) => a.analystId === analyst.id && isActiveStatus(a.status));
    const avg = assigned.length === 0 ? 0 : assigned.reduce((sum, a) => sum + a.ageMinutes, 0) / assigned.length;
    return { analyst, openCount: assigned.length, avgQueueMinutes: Math.round(avg) };
  });
}

export type SortMode = "newest" | "severity";

export interface AlertFilters {
  period: Period;
  severities: Set<Severity>;
  status: AlertStatus | "all";
  category: CategoryId | "all";
  query: string;
  sort: SortMode;
}

export function filterAndSortAlerts(filters: AlertFilters): Alert[] {
  const q = filters.query.trim().toLowerCase();
  const base = alertsWithinPeriod(filters.period).filter((a) => {
    if (!filters.severities.has(a.severity)) return false;
    if (filters.status !== "all" && a.status !== filters.status) return false;
    if (filters.category !== "all" && a.category !== filters.category) return false;
    if (q && !(a.title.toLowerCase().includes(q) || a.asset.toLowerCase().includes(q) || a.source.toLowerCase().includes(q))) return false;
    return true;
  });
  const sorted = [...base];
  if (filters.sort === "severity") {
    sorted.sort((a, b) => {
      const rank = SEVERITY_ORDER.indexOf(a.severity) - SEVERITY_ORDER.indexOf(b.severity);
      return rank !== 0 ? rank : a.ageMinutes - b.ageMinutes;
    });
  } else {
    sorted.sort((a, b) => a.ageMinutes - b.ageMinutes);
  }
  return sorted;
}

// 7-day daily alert-volume trend behind the queue summary's sparkline, oldest first. A fixed
// series, not derived from ALERTS, since it represents a longer history than the 16 sample rows
// above model in detail.
export const DAILY_VOLUME_7D = [31, 27, 44, 38, 52, 46, 35];

export const WORKSPACES = ["Core Infrastructure SOC", "Payments Fraud SOC", "Corporate IT SOC"];

export const CURRENT_USER = {
  name: "Imogen Carter",
  role: "SOC Shift Lead",
  photoId: "1494790108377-be9c29b29330",
};

export const NOTIFICATIONS = [
  { id: "n1", title: "Critical alert a1 auto-assigned to Noah Ferreira", time: "4m ago" },
  { id: "n2", title: "SLA burn warning: a9 is past 60% of its target window", time: "40m ago" },
  { id: "n3", title: "Weekly threat digest is ready for the Payments Fraud SOC", time: "1d ago" },
];
