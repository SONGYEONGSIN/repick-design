/**
 * Wattline — "Developers" (auto-developers-r1 / candidate c).
 *
 * Wattline is a fictional API for EV charging networks. This page is not the documentation site; it
 * is the doorway to it, and it answers one question — "can I build the thing I have in mind with
 * this, and what does the first call look like".
 *
 * The page's spine is the object map: five resources and the six relationships between them. Every
 * literal here is hand-authored and fixed. No Math.random, no Date.now, no clock read anywhere in
 * the route, so the server and the client render byte-identical output. Every geometry number is an
 * integer in its own viewBox space and every percentage is rounded to two decimals.
 */

export const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950";

export const API = {
  brand: "Wattline",
  tagline: "the charging-network API",
  baseUrl: "https://api.wattline.dev/v1",
  version: "2026-05-14",
  keyPrefix: "wl_live_",
  sandboxPrefix: "wl_test_",
  docsUrl: "https://docs.wattline.dev",
  statusUrl: "https://status.wattline.dev",
  changelogUrl: "https://docs.wattline.dev/changelog",
  openApiUrl: "https://docs.wattline.dev/openapi.json",
};

/* ------------------------------------------------------------------ resources */

export type ResourceId = "site" | "connector" | "session" | "tariff" | "invoice";

export type Field = {
  name: string;
  type: string;
  note: string;
  /** Fields that point at another resource — the map's edges, spelled out in the record. */
  linksTo?: ResourceId;
};

export type Resource = {
  id: ResourceId;
  label: string;
  idPrefix: string;
  oneLine: string;
  /** Why a developer has to hold this object in their head, in the words they would use. */
  why: string;
  fields: Field[];
  events: { name: string; means: string }[];
};

export const RESOURCES: Resource[] = [
  {
    id: "site",
    label: "site",
    idPrefix: "ste_",
    oneLine: "An address with power at it.",
    why: "A site is the only object with a street, opening hours and an operator. Everything a driver searches by lives here; nothing a car plugs into does.",
    fields: [
      { name: "id", type: "string", note: "Prefixed ste_. Stable forever, even after a rebuild." },
      { name: "name", type: "string", note: "Operator's public name for the location." },
      { name: "address", type: "object", note: "line1, city, region, postal_code, country (ISO 3166-1 alpha-2)." },
      { name: "coordinates", type: "object", note: "lat and lng, six decimal places. What you search by." },
      { name: "access", type: "enum", note: "public, fleet_only or restricted. Filter on it or drivers arrive at a gate." },
      { name: "status", type: "enum", note: "live, maintenance or planned. planned sites have no connectors yet." },
      { name: "default_tariff_id", type: "string", note: "The price a connector charges unless it overrides it.", linksTo: "tariff" },
      { name: "connector_count", type: "integer", note: "Denormalised so a map pin does not need a second call." },
    ],
    events: [
      { name: "site.status.changed", means: "A site went into maintenance or came back. Drop your pins accordingly." },
      { name: "site.created", means: "A new location was energised. Fired once, after the first connector reports in." },
    ],
  },
  {
    id: "connector",
    label: "connector",
    idPrefix: "cnr_",
    oneLine: "The plug a car actually touches.",
    why: "This is the object that is free or not free. Hardware, cabinets and firmware sit behind it; a session binds to a connector, never to a site, because a site cannot be occupied.",
    fields: [
      { name: "id", type: "string", note: "Prefixed cnr_. Printed on the physical plug as a short code." },
      { name: "site_id", type: "string", note: "The site this plug stands at.", linksTo: "site" },
      { name: "format", type: "enum", note: "ccs2, chademo or type2. A car matches one of them, not a brand." },
      { name: "max_kw", type: "number", note: "Rated ceiling. The car and the cable usually agree on less." },
      { name: "availability", type: "enum", note: "available, occupied, reserved or down. Push-updated, not polled." },
      { name: "firmware", type: "string", note: "Vendor build string. Useful in one support thread a year." },
      { name: "tariff_override_id", type: "string", note: "Set when one plug is priced apart from its site.", linksTo: "tariff" },
      { name: "last_report", type: "string", note: "RFC 3339 heartbeat. Anything older than 6 minutes reads as down." },
    ],
    events: [
      { name: "connector.availability.changed", means: "The single event most integrations subscribe to. Carries the previous value." },
      { name: "connector.down", means: "Missed its heartbeat window. Stop showing it before a driver drives there." },
    ],
  },
  {
    id: "session",
    label: "session",
    idPrefix: "ses_",
    oneLine: "One charge, from plug-in to unplug.",
    why: "A session is the only object that both moves energy and owes money, which is why it points at a connector and a tariff at the same time. Create it, watch it, stop it — that is the whole product for most integrations.",
    fields: [
      { name: "id", type: "string", note: "Prefixed ses_. Returned before the car draws a single watt." },
      { name: "connector_id", type: "string", note: "Required at creation. The plug this charge is bound to.", linksTo: "connector" },
      { name: "driver_ref", type: "string", note: "Your identifier for whoever authorised it. Opaque to Wattline." },
      { name: "tariff_id", type: "string", note: "Frozen at creation, so a price change mid-charge cannot rewrite it.", linksTo: "tariff" },
      { name: "state", type: "enum", note: "pending, active, ended or errored. pending means the cable is not latched yet." },
      { name: "energy_kwh", type: "number", note: "Three decimals, monotonic. Updated on every session.metered event." },
      { name: "cost_minor", type: "integer", note: "Minor units of currency. Never a float, never rounded twice." },
      { name: "started_at", type: "string", note: "RFC 3339, UTC. Null while the session is pending." },
      { name: "ended_at", type: "string", note: "Null until the cable is unlatched or you stop it." },
    ],
    events: [
      { name: "session.started", means: "Current is flowing. The first event with a non-null started_at." },
      { name: "session.metered", means: "Energy and cost moved. Delivered roughly every 30 seconds while active." },
      { name: "session.ended", means: "Final energy_kwh and cost_minor. This is the one to reconcile against." },
      { name: "session.errored", means: "Handshake refused, cable unlatched early, or the connector went down mid-charge." },
    ],
  },
  {
    id: "tariff",
    label: "tariff",
    idPrefix: "trf_",
    oneLine: "How kilowatt-hours turn into money.",
    why: "Tariffs are versioned and never edited in place, because a session that already quoted a price has to keep quoting it. Publishing a new one supersedes the old; it does not mutate it.",
    fields: [
      { name: "id", type: "string", note: "Prefixed trf_. A new id per version, not a new revision on the same id." },
      { name: "version", type: "integer", note: "Increments on publish. Sessions store the id, so history stays readable." },
      { name: "currency", type: "string", note: "ISO 4217. A tariff cannot mix currencies." },
      { name: "per_kwh_minor", type: "integer", note: "Minor units per kWh. The line drivers actually compare." },
      { name: "per_minute_minor", type: "integer", note: "Time component, billed only while state is active." },
      { name: "idle_minor", type: "integer", note: "Per minute after the car is full and still plugged in." },
      { name: "applies_from", type: "string", note: "RFC 3339. Publishing ahead of time is the supported way to change price." },
    ],
    events: [{ name: "tariff.published", means: "A new version is live. Cache it; sessions created after this will quote it." }],
  },
  {
    id: "invoice",
    label: "invoice",
    idPrefix: "inv_",
    oneLine: "What a fleet pays at the end of a month.",
    why: "An invoice holds no prices of its own — it is the sum of sessions over a period, which is why it is the one edge on this map that aggregates rather than references. If a total looks wrong, the sessions are the source of truth, not this object.",
    fields: [
      { name: "id", type: "string", note: "Prefixed inv_. One per account per period." },
      { name: "account_ref", type: "string", note: "Your fleet identifier, the same string you send as driver_ref." },
      { name: "session_ids", type: "array", note: "Every session rolled into this total, in order of start.", linksTo: "session" },
      { name: "period_start", type: "string", note: "Inclusive. RFC 3339, always midnight UTC." },
      { name: "period_end", type: "string", note: "Exclusive. A session that crosses it belongs to the period it started in." },
      { name: "subtotal_minor", type: "integer", note: "Sum of session cost_minor. Recomputed, never stored ahead." },
      { name: "state", type: "enum", note: "draft, issued or paid. draft totals can still move." },
    ],
    events: [
      { name: "invoice.issued", means: "The period closed and the total is final. Draft numbers stop moving here." },
      { name: "invoice.paid", means: "Settlement cleared. Carries the payment reference you sent." },
    ],
  },
];

export function resourceById(id: ResourceId): Resource {
  const found = RESOURCES.find((r) => r.id === id);
  return found ?? RESOURCES[0];
}

/* ---------------------------------------------------------------------- edges */

/**
 * Three kinds of relationship, and the map draws each with its own stroke pattern as well as its own
 * colour — the legend names the pattern, so nothing on this diagram is carried by hue alone.
 */
export type EdgeKind = "owns" | "references" | "aggregates";

export const EDGE_KINDS: { id: EdgeKind; label: string; dash: string; blurb: string }[] = [
  { id: "owns", label: "has many", dash: "", blurb: "Solid line. The child cannot exist without the parent, and the URL nests." },
  { id: "references", label: "references", dash: "7 5", blurb: "Dashed line. A plain id field. The target is shared and outlives the reference." },
  { id: "aggregates", label: "aggregates", dash: "1 6", blurb: "Dotted line. The source is a sum of the target and stores no figures of its own." },
];

export type Edge = {
  id: string;
  from: ResourceId;
  to: ResourceId;
  kind: EdgeKind;
  /** The field that makes this relationship real, so the picture and the payload agree. */
  field: string;
  reading: string;
};

export const EDGES: Edge[] = [
  { id: "site-connector", from: "site", to: "connector", kind: "owns", field: "connector.site_id", reading: "A site has many connectors. Deleting a site is refused while any of them is live." },
  { id: "connector-session", from: "connector", to: "session", kind: "owns", field: "session.connector_id", reading: "A connector has many sessions, one at a time. This is the binding that makes it occupied." },
  { id: "session-tariff", from: "session", to: "tariff", kind: "references", field: "session.tariff_id", reading: "A session references the tariff version that was live when it was created." },
  { id: "connector-tariff", from: "connector", to: "tariff", kind: "references", field: "connector.tariff_override_id", reading: "A connector may reference its own tariff, overriding the one its site carries." },
  { id: "site-tariff", from: "site", to: "tariff", kind: "references", field: "site.default_tariff_id", reading: "A site references the tariff its connectors inherit." },
  { id: "invoice-session", from: "invoice", to: "session", kind: "aggregates", field: "invoice.session_ids", reading: "An invoice aggregates sessions over a period. Its subtotal is their sum, not a stored price." },
];

export function edgesTouching(id: ResourceId): Edge[] {
  return EDGES.filter((e) => e.from === id || e.to === id);
}

/** The neighbour on the far side of an edge, from the point of view of `id`. */
export function otherEnd(edge: Edge, id: ResourceId): ResourceId {
  return edge.from === id ? edge.to : edge.from;
}

/** How the relation reads when you are standing on `id` and looking down the line. */
export function directionLabel(edge: Edge, id: ResourceId): string {
  const kind = EDGE_KINDS.find((k) => k.id === edge.kind);
  const forward = kind ? kind.label : edge.kind;
  if (edge.from === id) return forward;
  if (edge.kind === "owns") return "belongs to";
  if (edge.kind === "aggregates") return "rolled up by";
  return "referenced by";
}

/* --------------------------------------------------------------------- layout */

/**
 * Two coordinate sets, because a five-node graph that reads at 1440px does not read at 390px. Each
 * layer renders only at its own breakpoint, so the numbers never have to be recomputed at runtime —
 * they are integers in their own viewBox space, and the percentages below are rounded to two
 * decimals at module load, never per render.
 */
export type LayoutId = "wide" | "narrow";

type Point = { x: number; y: number };

export type MapLayout = {
  id: LayoutId;
  w: number;
  h: number;
  pos: Record<ResourceId, Point>;
};

export const LAYOUTS: Record<LayoutId, MapLayout> = {
  wide: {
    id: "wide",
    w: 1000,
    h: 520,
    pos: {
      site: { x: 140, y: 100 },
      connector: { x: 500, y: 100 },
      session: { x: 860, y: 100 },
      tariff: { x: 320, y: 380 },
      invoice: { x: 860, y: 380 },
    },
  },
  narrow: {
    id: "narrow",
    w: 340,
    h: 640,
    pos: {
      site: { x: 90, y: 60 },
      connector: { x: 250, y: 170 },
      session: { x: 90, y: 300 },
      tariff: { x: 250, y: 430 },
      invoice: { x: 90, y: 560 },
    },
  },
};

/** Two-decimal rounding, applied once here so no coordinate is ever produced at render time. */
export function pct(value: number, total: number): number {
  return Math.round((value / total) * 10000) / 100;
}

export function nodePercent(layout: MapLayout, id: ResourceId): { left: number; top: number } {
  const p = layout.pos[id];
  return { left: pct(p.x, layout.w), top: pct(p.y, layout.h) };
}

/* ------------------------------------------------------------------ endpoints */

export type Lang = "curl" | "node" | "python";

export const LANGS: { id: Lang; label: string }[] = [
  { id: "curl", label: "curl" },
  { id: "node", label: "TypeScript" },
  { id: "python", label: "Python" },
];

export type Endpoint = {
  id: string;
  resource: ResourceId;
  method: "GET" | "POST";
  path: string;
  summary: string;
  /** SDK call path, e.g. sessions.create — used to build the TypeScript and Python snippets. */
  sdk: string;
  /** Arguments, one "key: value" line each, in the language-neutral form the builders rewrite. */
  args: { key: string; value: string; quoted: boolean }[];
  response: string;
};

export const ENDPOINTS: Endpoint[] = [
  {
    id: "sites.list",
    resource: "site",
    method: "GET",
    path: "/v1/sites",
    summary: "Sites inside a radius, newest energisation first.",
    sdk: "sites.list",
    args: [
      { key: "near", value: "52.520008,13.404954", quoted: true },
      { key: "radius_km", value: "5", quoted: false },
      { key: "access", value: "public", quoted: true },
    ],
    response: `{
  "object": "list",
  "has_more": true,
  "next_cursor": "cur_8Ftq2",
  "data": [
    {
      "id": "ste_4KQ1mzr",
      "name": "Ostbahnhof Deck 2",
      "access": "public",
      "status": "live",
      "coordinates": { "lat": 52.510421, "lng": 13.434551 },
      "default_tariff_id": "trf_9wZ4",
      "connector_count": 12
    }
  ]
}`,
  },
  {
    id: "sites.get",
    resource: "site",
    method: "GET",
    path: "/v1/sites/{id}",
    summary: "One site, with its address block expanded.",
    sdk: "sites.get",
    args: [{ key: "id", value: "ste_4KQ1mzr", quoted: true }],
    response: `{
  "id": "ste_4KQ1mzr",
  "name": "Ostbahnhof Deck 2",
  "address": {
    "line1": "Koppenstrasse 8",
    "city": "Berlin",
    "postal_code": "10243",
    "country": "DE"
  },
  "access": "public",
  "status": "live",
  "default_tariff_id": "trf_9wZ4",
  "connector_count": 12
}`,
  },
  {
    id: "connectors.list",
    resource: "connector",
    method: "GET",
    path: "/v1/connectors",
    summary: "The plugs at a site, filtered to what a car can actually use.",
    sdk: "connectors.list",
    args: [
      { key: "site_id", value: "ste_4KQ1mzr", quoted: true },
      { key: "format", value: "ccs2", quoted: true },
      { key: "availability", value: "available", quoted: true },
    ],
    response: `{
  "object": "list",
  "has_more": false,
  "data": [
    {
      "id": "cnr_R7t0",
      "site_id": "ste_4KQ1mzr",
      "format": "ccs2",
      "max_kw": 150,
      "availability": "available",
      "tariff_override_id": null,
      "last_report": "2026-05-14T08:59:12Z"
    }
  ]
}`,
  },
  {
    id: "connectors.get",
    resource: "connector",
    method: "GET",
    path: "/v1/connectors/{id}",
    summary: "One plug, including the firmware string support will ask for.",
    sdk: "connectors.get",
    args: [{ key: "id", value: "cnr_R7t0", quoted: true }],
    response: `{
  "id": "cnr_R7t0",
  "site_id": "ste_4KQ1mzr",
  "format": "ccs2",
  "max_kw": 150,
  "availability": "occupied",
  "firmware": "vx-2.9.4",
  "tariff_override_id": null,
  "last_report": "2026-05-14T09:41:02Z"
}`,
  },
  {
    id: "sessions.create",
    resource: "session",
    method: "POST",
    path: "/v1/sessions",
    summary: "Bind a driver to a plug. Returns before any current flows.",
    sdk: "sessions.create",
    args: [
      { key: "connector_id", value: "cnr_R7t0", quoted: true },
      { key: "driver_ref", value: "fleet_9021:card_44", quoted: true },
      { key: "max_kwh", value: "60", quoted: false },
    ],
    response: `{
  "id": "ses_2Nb8xQ",
  "connector_id": "cnr_R7t0",
  "driver_ref": "fleet_9021:card_44",
  "tariff_id": "trf_9wZ4",
  "state": "pending",
  "energy_kwh": 0,
  "cost_minor": 0,
  "currency": "EUR",
  "started_at": null,
  "ended_at": null
}`,
  },
  {
    id: "sessions.stop",
    resource: "session",
    method: "POST",
    path: "/v1/sessions/{id}/stop",
    summary: "Cut current. Safe to call twice; the second call is a no-op.",
    sdk: "sessions.stop",
    args: [{ key: "id", value: "ses_2Nb8xQ", quoted: true }],
    response: `{
  "id": "ses_2Nb8xQ",
  "state": "ended",
  "energy_kwh": 41.226,
  "cost_minor": 1731,
  "currency": "EUR",
  "started_at": "2026-05-14T09:41:22Z",
  "ended_at": "2026-05-14T10:22:05Z"
}`,
  },
  {
    id: "sessions.get",
    resource: "session",
    method: "GET",
    path: "/v1/sessions/{id}",
    summary: "The reconciled figures, with the tariff that produced them.",
    sdk: "sessions.get",
    args: [
      { key: "id", value: "ses_2Nb8xQ", quoted: true },
      { key: "expand", value: "tariff", quoted: true },
    ],
    response: `{
  "id": "ses_2Nb8xQ",
  "connector_id": "cnr_R7t0",
  "state": "ended",
  "energy_kwh": 41.226,
  "cost_minor": 1731,
  "tariff": {
    "id": "trf_9wZ4",
    "version": 7,
    "currency": "EUR",
    "per_kwh_minor": 39,
    "per_minute_minor": 2
  }
}`,
  },
  {
    id: "tariffs.get",
    resource: "tariff",
    method: "GET",
    path: "/v1/tariffs/{id}",
    summary: "The price a driver will be quoted before they drive over.",
    sdk: "tariffs.get",
    args: [{ key: "id", value: "trf_9wZ4", quoted: true }],
    response: `{
  "id": "trf_9wZ4",
  "version": 7,
  "currency": "EUR",
  "per_kwh_minor": 39,
  "per_minute_minor": 2,
  "idle_minor": 25,
  "applies_from": "2026-04-01T00:00:00Z"
}`,
  },
  {
    id: "tariffs.create",
    resource: "tariff",
    method: "POST",
    path: "/v1/tariffs",
    summary: "Publish the next version. The previous one keeps answering.",
    sdk: "tariffs.create",
    args: [
      { key: "currency", value: "EUR", quoted: true },
      { key: "per_kwh_minor", value: "42", quoted: false },
      { key: "applies_from", value: "2026-06-01T00:00:00Z", quoted: true },
    ],
    response: `{
  "id": "trf_C1m6",
  "version": 8,
  "supersedes": "trf_9wZ4",
  "currency": "EUR",
  "per_kwh_minor": 42,
  "per_minute_minor": 2,
  "applies_from": "2026-06-01T00:00:00Z"
}`,
  },
  {
    id: "invoices.list",
    resource: "invoice",
    method: "GET",
    path: "/v1/invoices",
    summary: "Every period for one account, draft periods included.",
    sdk: "invoices.list",
    args: [
      { key: "account_ref", value: "fleet_9021", quoted: true },
      { key: "state", value: "issued", quoted: true },
    ],
    response: `{
  "object": "list",
  "has_more": false,
  "data": [
    {
      "id": "inv_Pd31",
      "account_ref": "fleet_9021",
      "period_start": "2026-04-01T00:00:00Z",
      "period_end": "2026-05-01T00:00:00Z",
      "subtotal_minor": 418260,
      "state": "issued"
    }
  ]
}`,
  },
  {
    id: "invoices.get",
    resource: "invoice",
    method: "GET",
    path: "/v1/invoices/{id}",
    summary: "The total with the session ids it was summed from.",
    sdk: "invoices.get",
    args: [
      { key: "id", value: "inv_Pd31", quoted: true },
      { key: "expand", value: "sessions", quoted: true },
    ],
    response: `{
  "id": "inv_Pd31",
  "account_ref": "fleet_9021",
  "period_start": "2026-04-01T00:00:00Z",
  "period_end": "2026-05-01T00:00:00Z",
  "session_ids": ["ses_2Nb8xQ", "ses_2Nc0rT"],
  "subtotal_minor": 418260,
  "tax_minor": 79469,
  "state": "issued"
}`,
  },
];

export function endpointsFor(id: ResourceId): Endpoint[] {
  return ENDPOINTS.filter((e) => e.resource === id);
}

export function endpointById(id: string): Endpoint {
  const found = ENDPOINTS.find((e) => e.id === id);
  return found ?? ENDPOINTS[0];
}

/* ------------------------------------------------------------------- snippets */

function jsonArgs(endpoint: Endpoint, indent: string): string {
  return endpoint.args
    .map((a) => `${indent}"${a.key}": ${a.quoted ? `"${a.value}"` : a.value}`)
    .join(",\n");
}

function pathWithId(endpoint: Endpoint): string {
  const idArg = endpoint.args.find((a) => a.key === "id");
  return idArg ? endpoint.path.replace("{id}", idArg.value) : endpoint.path;
}

function queryString(endpoint: Endpoint): string {
  const pairs = endpoint.args.filter((a) => a.key !== "id");
  if (pairs.length === 0) return "";
  return `?${pairs.map((a) => `${a.key}=${a.value}`).join("&")}`;
}

/**
 * Snippets are built, not stored, so the request pane can never drift from the endpoint table above
 * it. Pure string work over fixed inputs — the same endpoint and language always produce the same
 * characters, on the server and in the browser.
 */
export function snippetFor(endpoint: Endpoint, lang: Lang): string {
  if (lang === "curl") {
    const url = `${API.baseUrl.replace("/v1", "")}${pathWithId(endpoint)}`;
    const head = [
      `curl -X ${endpoint.method} \\`,
      `  ${url}${endpoint.method === "GET" ? queryString(endpoint) : ""} \\`,
      `  -H "Authorization: Bearer $WATTLINE_KEY" \\`,
      `  -H "Wattline-Version: ${API.version}"`,
    ];
    if (endpoint.method === "GET") return head.join("\n");
    const body = endpoint.args.filter((a) => a.key !== "id");
    if (body.length === 0) return head.join("\n");
    return [
      ...head.slice(0, head.length - 1),
      `  -H "Wattline-Version: ${API.version}" \\`,
      `  -H "Content-Type: application/json" \\`,
      `  -d '{`,
      jsonArgs({ ...endpoint, args: body }, "    "),
      `  }'`,
    ].join("\n");
  }
  if (lang === "node") {
    const call = endpoint.args
      .map((a) => (a.quoted ? `  ${a.key}: "${a.value}",` : `  ${a.key}: ${a.value},`))
      .join("\n");
    return [
      `import { Wattline } from "@wattline/node";`,
      ``,
      `const wattline = new Wattline(process.env.WATTLINE_KEY);`,
      ``,
      `const result = await wattline.${endpoint.sdk}({`,
      call,
      `});`,
    ].join("\n");
  }
  const call = endpoint.args
    .map((a) => (a.quoted ? `    ${a.key}="${a.value}",` : `    ${a.key}=${a.value},`))
    .join("\n");
  return [
    `import os`,
    `from wattline import Wattline`,
    ``,
    `wattline = Wattline(os.environ["WATTLINE_KEY"])`,
    ``,
    `result = wattline.${endpoint.sdk}(`,
    call,
    `)`,
  ].join("\n");
}

/* ---------------------------------------------------------------- build paths */

export type Step =
  | { kind: "call"; endpointId: string; note: string }
  | { kind: "event"; event: string; resource: ResourceId; note: string };

export type Goal = {
  id: string;
  title: string;
  question: string;
  /** Edges the map lights up while this path is chosen — the route through the model. */
  edges: string[];
  /** The nodes that route walks, in order. Drives the numbered badges drawn on the map. */
  nodes: ResourceId[];
  steps: Step[];
  /** The honest limit. A doorway that only lists what works is a brochure. */
  caveat: string;
};

export const GOALS: Goal[] = [
  {
    id: "find",
    title: "Find a plug that is free right now",
    question: "Can I put working chargers on a map without polling every device?",
    edges: ["site-connector", "site-tariff"],
    nodes: ["site", "connector", "tariff"],
    steps: [
      { kind: "call", endpointId: "sites.list", note: "Search by coordinates and radius. Sites carry the address; they never carry availability." },
      { kind: "call", endpointId: "connectors.list", note: "Availability lives one level down. Filter by format so a chademo car is not sent to a ccs2 stall." },
      { kind: "event", event: "connector.availability.changed", resource: "connector", note: "Subscribe once instead of polling. The event carries the previous value, so you can diff without a read." },
      { kind: "call", endpointId: "tariffs.get", note: "Show the price before the drive, not after. The site's default unless the connector overrides it." },
    ],
    caveat: "There is no distance sort across sites and connectors in one call. You sort site ids client-side, then fan out.",
  },
  {
    id: "charge",
    title: "Start a charge and meter it to the cent",
    question: "Can I run the whole charge from my own app, and will the money add up?",
    edges: ["connector-session", "session-tariff"],
    nodes: ["connector", "session", "tariff"],
    steps: [
      { kind: "call", endpointId: "sessions.create", note: "One call, one connector, your own driver reference. The tariff is frozen onto the session here." },
      { kind: "event", event: "session.metered", resource: "session", note: "Energy and cost arrive about every 30 seconds. This is what a live progress bar reads from." },
      { kind: "call", endpointId: "sessions.stop", note: "Idempotent. Calling it on an already-ended session returns the same body rather than an error." },
      { kind: "call", endpointId: "sessions.get", note: "Expand the tariff to show the arithmetic. cost_minor is integer minor units, computed once." },
    ],
    caveat: "Wattline does not take the payment. It produces the figure; your processor charges it.",
  },
  {
    id: "bill",
    title: "Bill a fleet at the end of the month",
    question: "Can finance reconcile this against what the drivers actually did?",
    edges: ["invoice-session", "session-tariff"],
    nodes: ["invoice", "session", "tariff"],
    steps: [
      { kind: "call", endpointId: "invoices.list", note: "One invoice per account per period. Draft periods are readable while they are still moving." },
      { kind: "event", event: "invoice.issued", resource: "invoice", note: "The period closed and the subtotal is final. Nothing after this changes the number." },
      { kind: "call", endpointId: "invoices.get", note: "session_ids is the audit trail. Every figure on the invoice is the sum of those sessions." },
      { kind: "call", endpointId: "sessions.get", note: "Drill into any disputed line. The session holds the tariff version that priced it." },
    ],
    caveat: "Tax is calculated for EU and UK registrations only. Everywhere else, tax_minor comes back as 0 and it is yours to apply.",
  },
];

export const DEFAULT_GOAL = "charge";
export const DEFAULT_RESOURCE: ResourceId = "session";
export const DEFAULT_ENDPOINT = "sessions.create";

/** Where a node sits on the chosen route, or null if the route never walks through it. */
export function stepIndexFor(goal: Goal, resource: ResourceId): number | null {
  const index = goal.nodes.indexOf(resource);
  return index === -1 ? null : index + 1;
}

/* ---------------------------------------------------------------- page tables */

export const ERRORS: { status: string; code: string; means: string; fix: string }[] = [
  {
    status: "409",
    code: "connector_occupied",
    means: "Another session already holds this plug, ours or a roaming partner's.",
    fix: "Re-read the connector. availability tells you whether to queue or send the driver to the next stall.",
  },
  {
    status: "409",
    code: "tariff_superseded",
    means: "You quoted a version that a newer publish replaced before the session was created.",
    fix: "Read the site's default_tariff_id again and requote. Sessions already created keep their frozen price.",
  },
  {
    status: "422",
    code: "connector_unreachable",
    means: "The plug has missed its heartbeat window, so we will not promise it will latch.",
    fix: "Treat it as down for six minutes. connector.down fires the moment we decide the same thing.",
  },
  {
    status: "429",
    code: "rate_limited",
    means: "More than 120 requests in a rolling minute on this key.",
    fix: "Read Retry-After, in whole seconds. Bursting on a fresh key is fine; sustained polling is what trips it.",
  },
];

export const PRE_FLIGHT: { term: string; detail: string }[] = [
  {
    term: "A key, no application form",
    detail: `Test keys start ${API.sandboxPrefix} and are issued the moment you sign in. They talk to a full simulator with four sites and eighteen connectors that report real state machines, including failures.`,
  },
  {
    term: "A version header, pinned",
    detail: `Send Wattline-Version: ${API.version}. Omit it and you get the version your key was created against, which is stable but silent — pinning is what makes an upgrade a decision rather than a surprise.`,
  },
  {
    term: "An idempotency key on every POST",
    detail: "Idempotency-Key is a header you choose. Replaying a session create with the same key returns the original session instead of energising a second one, for 24 hours.",
  },
  {
    term: "One webhook endpoint",
    detail: "Everything above is readable by polling and none of it should be. Events are signed with an HMAC over the raw body and retried for 72 hours with the same event id.",
  },
];

export const SDKS: { name: string; install: string; href: string }[] = [
  { name: "TypeScript", install: "npm i @wattline/node", href: "https://docs.wattline.dev/sdk/node" },
  { name: "Python", install: "pip install wattline", href: "https://docs.wattline.dev/sdk/python" },
  { name: "Go", install: "go get dev.wattline/go", href: "https://docs.wattline.dev/sdk/go" },
  { name: "OpenAPI 3.1", install: "curl -O openapi.json", href: "https://docs.wattline.dev/openapi.json" },
];
