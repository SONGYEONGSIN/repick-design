/**
 * Warden — dummy data for the vulnerability remediation console.
 * Entirely deterministic static literals — no Math.random / Date.now / argless new Date().
 * TODAY_ISO is a fictional dataset anchor (matches the session's calendar date but is not read
 * from the system clock). Aggregates (open counts, avg age, SLA breaches…) are computed at
 * render time from the single `findings` array below, so they always stay in sync with it.
 */

export const TODAY_ISO = "2026-08-18";

export type Severity = "critical" | "high" | "medium" | "low";
export type Stage = "backlog" | "triaged" | "assigned" | "remediation" | "verifying" | "resolved";

export const STAGE_ORDER: Stage[] = ["backlog", "triaged", "assigned", "remediation", "verifying", "resolved"];

export const STAGE_META: Record<Stage, { label: string; short: string }> = {
  backlog: { label: "Backlog", short: "New" },
  triaged: { label: "Triaged", short: "Triaged" },
  assigned: { label: "Assigned", short: "Assigned" },
  remediation: { label: "In Remediation", short: "Remediating" },
  verifying: { label: "Verifying", short: "Verifying" },
  resolved: { label: "Resolved", short: "Resolved" },
};

/** Whole-lifecycle SLA target, in days from discovery to resolution, by severity. */
export const SLA_TARGET_DAYS: Record<Severity, number> = {
  critical: 7,
  high: 14,
  medium: 30,
  low: 90,
};

export const SEVERITY_ORDER: Severity[] = ["critical", "high", "medium", "low"];

export const SEVERITY_META: Record<Severity, { label: string }> = {
  critical: { label: "Critical" },
  high: { label: "High" },
  medium: { label: "Medium" },
  low: { label: "Low" },
};

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
}

const AV = (id: string) => `https://images.unsplash.com/photo-${id}?q=80&w=200&auto=format&fit=facearea&facepad=2.5`;

export const CURRENT_USER_ID = "u1";

export const TEAM: TeamMember[] = [
  { id: "u1", name: "Jae-won Yoo", role: "Security Engineer", avatarUrl: AV("1633332755192-727a05c4013d") },
  { id: "u2", name: "Mina Cho", role: "Security Engineer", avatarUrl: AV("1472099645785-5658abf4ff4e") },
  { id: "u3", name: "Daniel Ruiz", role: "AppSec Lead", avatarUrl: AV("1500648767791-00dcc994a43e") },
  { id: "u4", name: "Priya Nair", role: "Security Engineer", avatarUrl: AV("1519244703995-f4e0f30006d5") },
  { id: "u5", name: "Owen Baxter", role: "Platform Engineer", avatarUrl: AV("1544005313-94ddf0286df2") },
  { id: "u6", name: "Sofia Almeida", role: "Security Engineer", avatarUrl: AV("1607746882042-944635dfe10e") },
];

export function getTeamMember(id?: string): TeamMember | undefined {
  return id ? TEAM.find((t) => t.id === id) : undefined;
}

export interface Finding {
  id: string;
  title: string;
  description: string;
  asset: string;
  severity: Severity;
  cvss: number;
  cve?: string;
  source: string;
  assigneeId?: string;
  discoveredISO: string;
  /** Set only once a finding reaches "resolved" — freezes its age. */
  resolvedISO?: string;
  stage: Stage;
  activity: { authorId: string; note: string; daysAgo: number }[];
}

/**
 * Seed findings. `stage` is each card's starting column — the client copies this array into
 * state and mutates only the `stage` field as the user moves cards, so this module stays a pure
 * source of truth. Backlog/Triaged findings are intentionally unassigned — Warden's convention
 * (invented; see candidates/a.md "브리프에 없던 것") is that ownership begins at "Assigned".
 */
export const findings: Finding[] = [
  // ── Backlog (6) ──────────────────────────────────────────────────────────
  {
    id: "VULN-1042",
    title: "Reflected XSS in support ticket search field",
    description:
      "The support-console search box echoes the raw query string back into the results heading without encoding, allowing a crafted link to execute script in an agent's session.",
    asset: "admin-console",
    severity: "medium",
    cvss: 6.1,
    source: "Burp Suite",
    discoveredISO: "2026-08-16",
    stage: "backlog",
    activity: [{ authorId: "u3", note: "Confirmed reproducible on staging.", daysAgo: 1 }],
  },
  {
    id: "VULN-1043",
    title: "Missing rate limiting on password reset endpoint",
    description:
      "POST /auth/password-reset accepts unlimited requests per account, allowing an attacker to enumerate valid emails via response-time differences and to exhaust the reset-email quota.",
    asset: "auth-service",
    severity: "high",
    cvss: 7.5,
    source: "Manual Pentest",
    discoveredISO: "2026-08-14",
    stage: "backlog",
    activity: [],
  },
  {
    id: "VULN-1044",
    title: "Verbose stack trace exposed on 500 errors",
    description:
      "Unhandled exceptions on the billing API return the full Java stack trace and internal package names to the client, aiding an attacker in fingerprinting the stack.",
    asset: "billing-service",
    severity: "low",
    cvss: 3.7,
    source: "OWASP ZAP",
    discoveredISO: "2026-08-12",
    stage: "backlog",
    activity: [],
  },
  {
    id: "VULN-1045",
    title: "Deserialization RCE in outdated jackson-databind",
    description:
      "partner-webhook-gateway ships jackson-databind 2.9.8, vulnerable to polymorphic-type deserialization RCE when handling untrusted partner payloads.",
    asset: "partner-webhook-gateway",
    severity: "critical",
    cvss: 9.8,
    cve: "CVE-2025-41213",
    source: "Dependabot",
    discoveredISO: "2026-08-10",
    stage: "backlog",
    activity: [{ authorId: "u3", note: "Escalated — SLA already at risk while in backlog.", daysAgo: 2 }],
  },
  {
    id: "VULN-1046",
    title: "GraphQL introspection enabled in production",
    description:
      "The mobile BFF's GraphQL endpoint serves full schema introspection in prod, exposing internal field and mutation names not referenced by the shipped app.",
    asset: "mobile-bff",
    severity: "medium",
    cvss: 5.3,
    source: "Nuclei",
    discoveredISO: "2026-08-09",
    stage: "backlog",
    activity: [],
  },
  {
    id: "VULN-1047",
    title: "Wildcard CORS policy on public search API",
    description:
      "search-index responds with Access-Control-Allow-Origin: * on endpoints that also accept an authenticated session cookie, allowing cross-origin credentialed reads.",
    asset: "search-index",
    severity: "high",
    cvss: 7.1,
    source: "Semgrep",
    discoveredISO: "2026-08-05",
    stage: "backlog",
    activity: [],
  },

  // ── Triaged (5) ──────────────────────────────────────────────────────────
  {
    id: "VULN-1031",
    title: "IDOR on /api/orders/{id} allows cross-tenant access",
    description:
      "Order lookups only check the requesting user's session, not tenant ownership — any authenticated user can read another company's order by guessing the numeric id.",
    asset: "checkout-api",
    severity: "critical",
    cvss: 9.1,
    source: "Manual Pentest",
    discoveredISO: "2026-08-07",
    stage: "triaged",
    activity: [
      { authorId: "u3", note: "Triaged as critical — cross-tenant data exposure confirmed.", daysAgo: 8 },
    ],
  },
  {
    id: "VULN-1032",
    title: "Hardcoded AWS access key in build script",
    description:
      "A long-lived IAM access key is committed in notification-worker's deploy/publish.sh, granting SNS publish and S3 write from any checkout of the repo.",
    asset: "notification-worker",
    severity: "high",
    cvss: 8.1,
    source: "Semgrep",
    discoveredISO: "2026-08-03",
    stage: "triaged",
    activity: [{ authorId: "u3", note: "Key rotation requested from platform team.", daysAgo: 6 }],
  },
  {
    id: "VULN-1033",
    title: "SSRF via unvalidated webhook callback URL",
    description:
      "The partner webhook-registration form accepts any URL, including internal-network hosts, and the gateway will fetch it server-side to \"verify\" it.",
    asset: "partner-webhook-gateway",
    severity: "medium",
    cvss: 6.5,
    source: "Manual Pentest",
    discoveredISO: "2026-08-01",
    stage: "triaged",
    activity: [],
  },
  {
    id: "VULN-1034",
    title: "Session cookie missing Secure and SameSite flags",
    description:
      "user-profile-svc sets its session cookie without Secure or SameSite=Lax, leaving it exposed over plain HTTP on internal staging hosts and to basic CSRF.",
    asset: "user-profile-svc",
    severity: "low",
    cvss: 4.3,
    source: "OWASP ZAP",
    discoveredISO: "2026-07-30",
    stage: "triaged",
    activity: [],
  },
  {
    id: "VULN-1035",
    title: "Broken access control lets viewers edit invoices",
    description:
      "The invoice PATCH endpoint checks only that a session exists, not the caller's role — a workspace \"viewer\" can edit and delete invoices via the API directly.",
    asset: "billing-service",
    severity: "high",
    cvss: 7.7,
    source: "Manual Pentest",
    discoveredISO: "2026-08-08",
    stage: "triaged",
    activity: [],
  },

  // ── Assigned (4) ─────────────────────────────────────────────────────────
  {
    id: "VULN-1020",
    title: "Auth bypass via forged JWT with alg:none",
    description:
      "auth-service accepts JWTs with the alg header set to \"none\" and skips signature verification entirely, allowing a forged token for any user id.",
    asset: "auth-service",
    severity: "critical",
    cvss: 9.4,
    source: "Manual Pentest",
    assigneeId: "u3",
    discoveredISO: "2026-08-12",
    stage: "assigned",
    activity: [
      { authorId: "u3", note: "Triaged and assigned to myself — patching JWT library config today.", daysAgo: 2 },
    ],
  },
  {
    id: "VULN-1021",
    title: "SQL injection in order search filter",
    description:
      "The `status` query parameter on GET /api/orders is concatenated directly into the WHERE clause, allowing boolean- and time-based blind SQL injection.",
    asset: "checkout-api",
    severity: "medium",
    cvss: 6.8,
    source: "Burp Suite",
    assigneeId: "u4",
    discoveredISO: "2026-07-28",
    stage: "assigned",
    activity: [{ authorId: "u4", note: "Reproduced locally, writing a parameterized-query fix.", daysAgo: 4 }],
  },
  {
    id: "VULN-1022",
    title: "Path traversal in receipt PDF export",
    description:
      "The `template` parameter used to render a receipt PDF is passed to the filesystem loader unsanitized, permitting `../` traversal to read arbitrary server files.",
    asset: "billing-service",
    severity: "high",
    cvss: 7.9,
    source: "Burp Suite",
    assigneeId: "u5",
    discoveredISO: "2026-08-06",
    stage: "assigned",
    activity: [],
  },
  {
    id: "VULN-1023",
    title: "Missing HSTS header on marketing subdomain",
    description:
      "promo.example subdomain serves over HTTPS but never sends Strict-Transport-Security, leaving first-visit users open to SSL-stripping downgrade.",
    asset: "admin-console",
    severity: "low",
    cvss: 3.1,
    source: "OWASP ZAP",
    assigneeId: "u6",
    discoveredISO: "2026-07-25",
    stage: "assigned",
    activity: [],
  },

  // ── In Remediation (6) ──────────────────────────────────────────────────
  {
    id: "VULN-1010",
    title: "Insecure direct object reference on file download",
    description:
      "GET /files/{id} serves any uploaded file to any authenticated user, regardless of the workspace that uploaded it, via sequential numeric ids.",
    asset: "user-profile-svc",
    severity: "high",
    cvss: 7.4,
    source: "Manual Pentest",
    assigneeId: "u2",
    discoveredISO: "2026-08-09",
    stage: "remediation",
    activity: [{ authorId: "u2", note: "Switching file ids to per-workspace UUIDs with an ownership check.", daysAgo: 3 }],
  },
  {
    id: "VULN-1011",
    title: "Privilege escalation via unchecked role field in profile update",
    description:
      "PATCH /api/users/{id} silently accepts a `role` field from the request body, letting a standard member promote themself to workspace admin.",
    asset: "user-profile-svc",
    severity: "critical",
    cvss: 8.8,
    source: "Manual Pentest",
    assigneeId: "u3",
    discoveredISO: "2026-08-13",
    stage: "remediation",
    activity: [{ authorId: "u3", note: "Role field now stripped server-side; adding a regression test.", daysAgo: 1 }],
  },
  {
    id: "VULN-1012",
    title: "Insecure deserialization of cached session objects",
    description:
      "Session objects are cached via Java native serialization keyed by a predictable Redis key, letting a compromised cache entry trigger gadget-chain RCE on read.",
    asset: "auth-service",
    severity: "medium",
    cvss: 6.9,
    source: "Trivy",
    assigneeId: "u4",
    discoveredISO: "2026-07-22",
    stage: "remediation",
    activity: [],
  },
  {
    id: "VULN-1013",
    title: "Plaintext API keys stored in database",
    description:
      "Partner API keys are stored as plaintext columns rather than hashed, so a database read (backup leak, injection) discloses live credentials directly.",
    asset: "partner-webhook-gateway",
    severity: "medium",
    cvss: 6.2,
    source: "Manual Pentest",
    assigneeId: "u5",
    discoveredISO: "2026-08-04",
    stage: "remediation",
    activity: [],
  },
  {
    id: "VULN-1014",
    title: "Unrestricted file upload allows executable content type",
    description:
      "The avatar-upload endpoint accepts any content type and stores it under the original filename with no re-encoding, allowing a `.svg` with embedded script to be served back.",
    asset: "user-profile-svc",
    severity: "high",
    cvss: 7.6,
    source: "Manual Pentest",
    assigneeId: "u6",
    discoveredISO: "2026-07-31",
    stage: "remediation",
    activity: [{ authorId: "u6", note: "Adding server-side re-encode + content-type allowlist.", daysAgo: 5 }],
  },
  {
    id: "VULN-1015",
    title: "Outdated TLS 1.0/1.1 still accepted on legacy load balancer",
    description:
      "The legacy ingress load balancer for mobile-bff still negotiates TLS 1.0 and 1.1, both deprecated and vulnerable to BEAST/POODLE-class downgrade attacks.",
    asset: "mobile-bff",
    severity: "low",
    cvss: 4.8,
    source: "Nuclei",
    assigneeId: "u2",
    discoveredISO: "2026-07-16",
    stage: "remediation",
    activity: [],
  },

  // ── Verifying (3) ────────────────────────────────────────────────────────
  {
    id: "VULN-1002",
    title: "CSRF on notification preference form",
    description:
      "The notification-preferences form has no anti-CSRF token, letting a malicious page silently opt a logged-in user out of billing alerts.",
    asset: "notification-worker",
    severity: "high",
    cvss: 6.5,
    source: "OWASP ZAP",
    assigneeId: "u4",
    discoveredISO: "2026-08-07",
    stage: "verifying",
    activity: [{ authorId: "u4", note: "Fix deployed to staging — pentest re-check scheduled.", daysAgo: 2 }],
  },
  {
    id: "VULN-1003",
    title: "Log injection allows forged audit trail entries",
    description:
      "User-supplied display names are written into the audit log without newline stripping, letting an attacker forge fake log lines that appear as separate events.",
    asset: "admin-console",
    severity: "medium",
    cvss: 5.9,
    source: "Semgrep",
    assigneeId: "u5",
    discoveredISO: "2026-07-27",
    stage: "verifying",
    activity: [{ authorId: "u5", note: "Sanitization patch merged, awaiting scanner re-run.", daysAgo: 3 }],
  },
  {
    id: "VULN-1004",
    title: "Race condition allows duplicate coupon redemption",
    description:
      "Concurrent redemption requests for the same single-use coupon are not serialized, allowing the same code to be applied twice before the row lock commits.",
    asset: "checkout-api",
    severity: "critical",
    cvss: 7.2,
    source: "Manual Pentest",
    assigneeId: "u6",
    discoveredISO: "2026-08-14",
    stage: "verifying",
    activity: [{ authorId: "u6", note: "Row-level lock added around redemption; load-testing the fix now.", daysAgo: 1 }],
  },

  // ── Resolved (6) — resolvedISO freezes their age ────────────────────────
  {
    id: "VULN-0981",
    title: "Session fixation on SSO callback",
    description:
      "The SSO callback reused the pre-login session id instead of rotating it, allowing an attacker who fixed a victim's session id to inherit their authenticated session.",
    asset: "auth-service",
    severity: "high",
    cvss: 7.0,
    source: "Manual Pentest",
    assigneeId: "u3",
    discoveredISO: "2026-07-20",
    resolvedISO: "2026-08-05",
    stage: "resolved",
    activity: [
      { authorId: "u3", note: "Session id now rotated on every successful SSO callback.", daysAgo: 13 },
      { authorId: "u1", note: "Verified with a fresh pentest — closing.", daysAgo: 13 },
    ],
  },
  {
    id: "VULN-0982",
    title: "Exposed .env file on static asset host",
    description:
      "A build artifact accidentally published billing-service's .env (including a database password) to the public static-asset bucket for eleven hours.",
    asset: "billing-service",
    severity: "critical",
    cvss: 8.6,
    source: "Nuclei",
    assigneeId: "u2",
    discoveredISO: "2026-08-03",
    resolvedISO: "2026-08-09",
    stage: "resolved",
    activity: [
      { authorId: "u2", note: "File removed, secret rotated, build pipeline now excludes dotfiles.", daysAgo: 9 },
    ],
  },
  {
    id: "VULN-0983",
    title: "XXE in legacy XML invoice importer",
    description:
      "The bulk invoice importer parsed uploaded XML with external entity resolution enabled, allowing local file disclosure via a crafted DOCTYPE.",
    asset: "billing-service",
    severity: "medium",
    cvss: 6.4,
    source: "Trivy",
    assigneeId: "u4",
    discoveredISO: "2026-06-23",
    resolvedISO: "2026-07-20",
    stage: "resolved",
    activity: [{ authorId: "u4", note: "External entity resolution disabled parser-wide.", daysAgo: 29 }],
  },
  {
    id: "VULN-0984",
    title: "Weak password hashing (unsalted MD5) on legacy accounts",
    description:
      "Accounts migrated from the pre-2024 system still authenticate against an unsalted MD5 hash before falling back to bcrypt, weakening offline cracking resistance.",
    asset: "auth-service",
    severity: "low",
    cvss: 5.0,
    source: "Manual Pentest",
    assigneeId: "u5",
    discoveredISO: "2026-05-20",
    resolvedISO: "2026-07-30",
    stage: "resolved",
    activity: [{ authorId: "u5", note: "All legacy hashes force-migrated to bcrypt on next login; MD5 path removed.", daysAgo: 19 }],
  },
  {
    id: "VULN-0985",
    title: "Unvalidated redirect after logout",
    description:
      "The `next` parameter on the logout flow redirected without an allowlist, letting a crafted link send a just-logged-out user to an attacker-controlled phishing page.",
    asset: "auth-service",
    severity: "high",
    cvss: 6.1,
    source: "OWASP ZAP",
    assigneeId: "u6",
    discoveredISO: "2026-06-09",
    resolvedISO: "2026-06-30",
    stage: "resolved",
    activity: [{ authorId: "u6", note: "Redirect target now validated against an allowlist of internal paths.", daysAgo: 49 }],
  },
  {
    id: "VULN-0986",
    title: "Missing input length validation causing memory-exhaustion DoS",
    description:
      "The bulk CSV import accepted files of unbounded size and loaded them fully into memory, allowing a single request to exhaust worker memory.",
    asset: "notification-worker",
    severity: "medium",
    cvss: 5.5,
    source: "Semgrep",
    assigneeId: "u2",
    discoveredISO: "2026-06-04",
    resolvedISO: "2026-06-24",
    stage: "resolved",
    activity: [{ authorId: "u2", note: "Import now streams with a 25MB cap and rejects oversized files early.", daysAgo: 55 }],
  },
];
