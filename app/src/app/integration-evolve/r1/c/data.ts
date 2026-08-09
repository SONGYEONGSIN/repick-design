export type Access = 'read' | 'write';

export type ScopeRow = {
  id: string;
  name: string;
  label: string;
  access: Access;
  summary: string;
  fields: string[];
  retention: string;
  retentionNote: string;
  adminApproval: boolean;
  defaultOn: boolean;
};

export type Feature = {
  id: string;
  name: string;
  note: string;
  requires: string[];
};

export const scopes: ScopeRow[] = [
  {
    id: 's-deals-read',
    name: 'crm.objects.deals.read',
    label: 'Deals',
    access: 'read',
    summary:
      'Open and closed deal records in the pipelines you nominate. No deal notes, no attachments, no email bodies.',
    fields: ['dealname', 'amount', 'dealstage', 'closedate', 'pipeline', 'hs_deal_stage_probability'],
    retention: '13 months',
    retentionNote: 'rolling window',
    adminApproval: false,
    defaultOn: true,
  },
  {
    id: 's-companies-read',
    name: 'crm.objects.companies.read',
    label: 'Companies',
    access: 'read',
    summary:
      'Firmographics used to group deals: name, domain, industry, headcount band. No billing records or signed contracts.',
    fields: ['name', 'domain', 'industry', 'numberofemployees'],
    retention: '13 months',
    retentionNote: 'rolling window',
    adminApproval: false,
    defaultOn: true,
  },
  {
    id: 's-contacts-read',
    name: 'crm.objects.contacts.read',
    label: 'Contacts',
    access: 'read',
    summary:
      'Role and lifecycle stage only, so buying groups can be counted. Email arrives hashed at ingest and is never persisted in the clear.',
    fields: ['jobtitle', 'lifecyclestage', 'hs_email_domain', 'email → SHA-256 digest'],
    retention: '90 days',
    retentionNote: 'digest only',
    adminApproval: false,
    defaultOn: true,
  },
  {
    id: 's-schema-read',
    name: 'crm.schemas.deals.read',
    label: 'Deal properties',
    access: 'read',
    summary:
      'The shape of your deal object — property names, types and picklist options — so custom fields map to the right column. Values are not returned by this scope.',
    fields: ['property.name', 'property.type', 'property.options[]'],
    retention: 'Mirrored',
    retentionNote: 'no history kept',
    adminApproval: false,
    defaultOn: true,
  },
  {
    id: 's-owners-read',
    name: 'crm.objects.owners.read',
    label: 'Owners',
    access: 'read',
    summary:
      'Which rep owns which deal. Names and HubSpot user ids. No login data, no seat or permission records.',
    fields: ['owner.id', 'owner.firstName', 'owner.lastName'],
    retention: '13 months',
    retentionNote: 'rolling window',
    adminApproval: false,
    defaultOn: true,
  },
  {
    id: 's-deals-write',
    name: 'crm.objects.deals.write',
    label: 'Deal writeback',
    access: 'write',
    summary:
      'Writes two Tidemark-owned properties and nothing else. Amount, stage and close date remain read-only to Tidemark forever.',
    fields: ['tidemark_forecast_category', 'tidemark_risk_flag'],
    retention: 'Not stored',
    retentionNote: 'write path only',
    adminApproval: true,
    defaultOn: true,
  },
  {
    id: 's-timeline-write',
    name: 'timeline',
    label: 'Timeline events',
    access: 'write',
    summary:
      'Appends a Tidemark card to a deal timeline when a forecast changes. Cannot edit or delete an event it did not create.',
    fields: ['event.tidemark_signal'],
    retention: 'Not stored',
    retentionNote: 'write path only',
    adminApproval: true,
    defaultOn: true,
  },
  {
    id: 's-automation',
    name: 'automation',
    label: 'Workflow enrollment',
    access: 'write',
    summary:
      'Enrolls at-risk deals into the one workflow you nominate. Cannot create, edit or delete workflows. Off until you switch it on.',
    fields: ['workflow.enrollment'],
    retention: 'Not stored',
    retentionNote: 'write path only',
    adminApproval: true,
    defaultOn: false,
  },
];

export const features: Feature[] = [
  {
    id: 'f-forecast',
    name: 'Pipeline forecast',
    note: 'Weighted commit by rep and segment, recomputed nightly.',
    requires: ['s-deals-read', 's-owners-read'],
  },
  {
    id: 'f-cohorts',
    name: 'Win-rate cohorts',
    note: 'Win rate split by industry and headcount band.',
    requires: ['s-deals-read', 's-companies-read'],
  },
  {
    id: 'f-coverage',
    name: 'Buying-group coverage',
    note: 'Flags deals with a single contact and no economic buyer.',
    requires: ['s-contacts-read'],
  },
  {
    id: 'f-mapping',
    name: 'Custom field mapping',
    note: 'Binds your renamed stages and custom properties to Tidemark columns.',
    requires: ['s-schema-read'],
  },
  {
    id: 'f-scorecards',
    name: 'Rep scorecards',
    note: 'Per-owner attainment, slip rate and cycle length.',
    requires: ['s-deals-read', 's-owners-read'],
  },
  {
    id: 'f-writeback',
    name: 'Forecast writeback',
    note: 'Pushes the Tidemark category back onto the deal record.',
    requires: ['s-deals-write'],
  },
  {
    id: 'f-timeline',
    name: 'Timeline notes',
    note: 'Drops a dated risk card on the deal your rep already has open.',
    requires: ['s-timeline-write'],
  },
  {
    id: 'f-enroll',
    name: 'At-risk auto-enroll',
    note: 'Sends slipping deals into your save play automatically.',
    requires: ['s-automation'],
  },
];

export const neverRequested: { name: string; reason: string }[] = [
  { name: 'crm.objects.quotes.*', reason: 'Pricing documents never leave HubSpot.' },
  { name: 'files', reason: 'No attachments, no signed contracts.' },
  { name: 'tickets', reason: 'Support conversations are out of scope.' },
  { name: 'settings.users.write', reason: 'Tidemark cannot change seats or roles.' },
  { name: 'crm.export', reason: 'No bulk export capability is requested.' },
];

export type ResidencyTab = {
  id: string;
  label: string;
  blurb: string;
  rows: { item: string; detail: string }[];
};

export const residency: ResidencyTab[] = [
  {
    id: 'stored',
    label: 'Stored in Tidemark',
    blurb: 'Three record classes persist. Everything else is transient by construction.',
    rows: [
      {
        item: 'Deal and company records',
        detail: 'eu-central-1, AES-256 at rest, 13-month rolling window, tenant-scoped keys.',
      },
      {
        item: 'Derived forecasts and scorecards',
        detail: 'Aggregates keyed by HubSpot object id. Rebuildable, never re-exported.',
      },
      {
        item: 'Contact identifiers',
        detail: 'SHA-256 digest with a per-tenant salt, 90 days. No plaintext email or phone.',
      },
    ],
  },
  {
    id: 'transit',
    label: 'Passes through only',
    blurb: 'Held in memory for the length of one request, then dropped.',
    rows: [
      {
        item: 'OAuth refresh token',
        detail: 'Sealed in an AWS KMS envelope, decrypted per call, never written to logs.',
      },
      {
        item: 'Webhook payloads',
        detail: 'Signature-verified, mapped to internal ids, discarded within 60 seconds.',
      },
      {
        item: 'Writeback request bodies',
        detail: 'Two property names logged; values are redacted before the log line is written.',
      },
    ],
  },
  {
    id: 'never',
    label: 'Never collected',
    blurb: 'Dropped at the ingest boundary or refused by HubSpot because the scope is absent.',
    rows: [
      {
        item: 'Plaintext email and phone',
        detail: 'Hashed in the ingest worker before any write path is reachable.',
      },
      {
        item: 'Attachments, quotes, tickets',
        detail: 'The scope is not requested, so the HubSpot API answers 403 to Tidemark.',
      },
      {
        item: 'HubSpot credentials',
        detail: 'OAuth only. No password, SSO assertion or session cookie ever transits Tidemark.',
      },
    ],
  },
];

export const revocation: { title: string; detail: string; window: string }[] = [
  {
    title: 'Disconnect at HubSpot',
    detail:
      'Settings → Connected Apps → Tidemark → Disconnect. The refresh token is invalidated by HubSpot, not by us, so it works even if Tidemark is down.',
    window: 'Effective in 60 seconds',
  },
  {
    title: 'Derived data purge',
    detail:
      'Forecasts, cohorts and scorecards built from HubSpot objects are deleted, along with the identifier digests.',
    window: 'Within 24 hours',
  },
  {
    title: 'Raw record cache',
    detail:
      'The 13-month deal and company cache expires on its own schedule, or immediately on a written deletion request from an admin.',
    window: 'Within 30 days',
  },
];
