/**
 * Fixtures, arithmetic and code generation for the Bollard developers page.
 *
 * The archetype is "executable first call": the page carries a live request/response pair, and the
 * four parameters at the top rewrite *both* halves at once. That only works if the response is
 * genuinely computed rather than swapped from a lookup table — otherwise "change this and watch that
 * field move" is a claim, not a demonstration.
 *
 * So every figure below is integer arithmetic in cents over published lane constants. No clock is
 * read anywhere in this route: identifiers are FNV-1a hashes of the parameter tuple, which makes the
 * same inputs produce the same bytes on the server and in the browser, and makes the transcript
 * quotable — a reader can copy `rt_...` into a bug report and it still means something.
 *
 * Lines are modelled, not templated into strings. Each line carries the parameter that *drives* it
 * (`d`), which is what lets one selection light up the request line and every response field it
 * produces. That mapping is the page's real subject; the syntax colouring is incidental.
 */

export const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950";

/* ------------------------------------------------------------------ vocabulary */

export type ParamId = "lane" | "weight" | "service" | "insurance";

/**
 * What a line answers to. `sum` is every parameter at once (the total), `chain` is a value that came
 * out of an earlier call rather than out of the controls — the only two markers that are not one of
 * the four inputs, and both earn their place: without `sum` the total would look unowned, and
 * without `chain` the second call's `rate_id` would look like another literal.
 */
export type Driver = ParamId | "sum" | "chain";

export type Lang = "curl" | "js" | "python";
export type ServiceId = "economy" | "express" | "priority";
export type LaneId = "us-ca" | "de-pl" | "sg-au" | "us-br";

export const GUTTER: Record<Driver, string> = {
  lane: "LNE",
  weight: "WGT",
  service: "SVC",
  insurance: "INS",
  sum: "SUM",
  chain: "CHN",
};

export const PARAM_META: { id: ParamId; label: string; short: string }[] = [
  { id: "lane", label: "Lane", short: "LNE" },
  { id: "weight", label: "Weight", short: "WGT" },
  { id: "service", label: "Service", short: "SVC" },
  { id: "insurance", label: "Insurance", short: "INS" },
];

export const LANG_META: { id: Lang; label: string; hint: string }[] = [
  { id: "curl", label: "cURL", hint: "raw HTTP" },
  { id: "js", label: "JavaScript", hint: "@bollard/node" },
  { id: "python", label: "Python", hint: "bollard 3.4" },
];

/* ------------------------------------------------------------------ tokens */

export type TokKind = "key" | "str" | "num" | "punct" | "kw" | "cmt";
export type Tok = { t: string; k?: TokKind };
export type Line = { toks: Tok[]; d?: Driver };

const T = (t: string): Tok => ({ t });
const K = (t: string): Tok => ({ t, k: "key" });
const S = (t: string): Tok => ({ t, k: "str" });
const N = (t: string): Tok => ({ t, k: "num" });
const P = (t: string): Tok => ({ t, k: "punct" });
const KW = (t: string): Tok => ({ t, k: "kw" });
const C = (t: string): Tok => ({ t, k: "cmt" });

/** One source line at `ind` levels of two-space indent. */
const L = (ind: number, toks: Tok[], d?: Driver): Line => ({
  toks: ind > 0 ? [T(" ".repeat(ind * 2)), ...toks] : toks,
  d,
});

type Entry = { toks: Tok[]; d?: Driver };

/** JSON is unforgiving about the trailing comma, and the last entry moves when insurance is off. */
const commas = (ind: number, entries: Entry[]): Line[] =>
  entries.map((e, i) => L(ind, i === entries.length - 1 ? e.toks : [...e.toks, P(",")], e.d));

export function linesToText(lines: Line[]): string {
  return lines.map((line) => line.toks.map((tok) => tok.t).join("")).join("\n");
}

/* ------------------------------------------------------------------ formatting */

/** Hand-rolled grouping: `toLocaleString` reads the host locale, which server and browser disagree on. */
export function groupDigits(value: number): string {
  const digits = Math.abs(Math.trunc(value)).toString();
  let out = "";
  for (let i = 0; i < digits.length; i += 1) {
    if (i > 0 && (digits.length - i) % 3 === 0) out += ",";
    out += digits[i];
  }
  return (value < 0 ? "-" : "") + out;
}

export function money(cents: number): string {
  return `$${groupDigits(Math.trunc(cents / 100))}.${(cents % 100).toString().padStart(2, "0")}`;
}

/* ------------------------------------------------------------------ the network */

export type Lane = {
  id: LaneId;
  code: string;
  label: string;
  carrier: string;
  baseCents: number;
  perHalfKgCents: number;
  fuelPct: number;
  maxG: number;
  /** Priority needs a bonded air corridor. The lane that lacks one is how the 422 becomes real. */
  bondedAir: boolean;
  transit: Record<ServiceId, number>;
  cutoff: string;
};

export const LANES: Lane[] = [
  {
    id: "us-ca",
    code: "USLAX-CAYYZ",
    label: "Los Angeles to Toronto",
    carrier: "Northline Air",
    baseCents: 1450,
    perHalfKgCents: 210,
    fuelPct: 14,
    maxG: 30000,
    bondedAir: true,
    transit: { economy: 5, express: 2, priority: 1 },
    cutoff: "16:00 PT",
  },
  {
    id: "de-pl",
    code: "DEHAM-PLWAW",
    label: "Hamburg to Warsaw",
    carrier: "Vistula Road",
    baseCents: 890,
    perHalfKgCents: 145,
    fuelPct: 9,
    maxG: 20000,
    bondedAir: true,
    transit: { economy: 4, express: 2, priority: 1 },
    cutoff: "18:30 CET",
  },
  {
    id: "sg-au",
    code: "SGSIN-AUSYD",
    label: "Singapore to Sydney",
    carrier: "Coral Freight",
    baseCents: 2180,
    perHalfKgCents: 305,
    fuelPct: 17,
    maxG: 30000,
    bondedAir: true,
    transit: { economy: 9, express: 4, priority: 2 },
    cutoff: "13:00 SGT",
  },
  {
    id: "us-br",
    code: "USLAX-BRGRU",
    label: "Los Angeles to Sao Paulo",
    carrier: "Andes Consolidated",
    baseCents: 2640,
    perHalfKgCents: 380,
    fuelPct: 21,
    maxG: 30000,
    bondedAir: false,
    transit: { economy: 12, express: 6, priority: 6 },
    cutoff: "11:00 PT",
  },
];

export type Service = { id: ServiceId; label: string; upliftPct: number; blurb: string };

export const SERVICES: Service[] = [
  { id: "economy", label: "economy", upliftPct: 0, blurb: "Consolidated, no uplift." },
  { id: "express", label: "express", upliftPct: 25, blurb: "Next available departure." },
  { id: "priority", label: "priority", upliftPct: 60, blurb: "Bonded air corridors only." },
];

export const WEIGHT_MIN = 500;
export const WEIGHT_MAX = 30000;
export const WEIGHT_STEP = 500;
export const DECLARED_VALUE_CENTS = 42000;
/** Basis points of declared value. Published, not negotiated — so it belongs in the fixture. */
export const INSURANCE_BPS = 140;

export const API_KEY = "sk_test_4f1c9a2e7b3d5081";
export const VERSION_PIN = "2026-05-01";

export type ConsoleState = {
  lane: LaneId;
  weightG: number;
  service: ServiceId;
  insured: boolean;
};

export const DEFAULT_STATE: ConsoleState = {
  lane: "us-ca",
  weightG: 8000,
  service: "express",
  insured: true,
};

export function laneOf(id: LaneId): Lane {
  return LANES.find((lane) => lane.id === id) ?? LANES[0];
}

export function serviceOf(id: ServiceId): Service {
  return SERVICES.find((service) => service.id === id) ?? SERVICES[0];
}

/* ------------------------------------------------------------------ identifiers */

/** FNV-1a. Stable across runtimes, which is the whole requirement — nothing here needs to be secret. */
function hash32(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function token(input: string, len: number): string {
  return hash32(input).toString(36).toUpperCase().padStart(len, "0").slice(-len);
}

/* ------------------------------------------------------------------ the quote */

export type BreakdownRow = { kind: string; cents: number; d: Driver };

export type QuoteOk = {
  ok: true;
  lane: Lane;
  service: Service;
  billableG: number;
  halfKiloUnits: number;
  base: number;
  weightCents: number;
  uplift: number;
  fuel: number;
  insurance: number;
  total: number;
  transitDays: number;
  breakdown: BreakdownRow[];
  rateId: string;
  shipmentId: string;
  eventId: string;
  tracking: string;
};

export type QuoteErr = {
  ok: false;
  lane: Lane;
  service: Service;
  status: 422;
  code: "parcel_over_limit" | "service_not_on_lane";
  param: string;
  message: string;
  /** Plain-language repair, plus the exact state change that performs it. */
  fix: { label: string; explain: string; patch: Partial<ConsoleState> };
};

export type Quote = QuoteOk | QuoteErr;

const pct = (base: number, percent: number): number => Math.round((base * percent) / 100);

/**
 * Validation order is physical first: a 24 kg parcel is over the limit whatever service you name, so
 * reporting the service error there would send a reader to change the wrong control.
 */
export function buildQuote(state: ConsoleState): Quote {
  const lane = laneOf(state.lane);
  const service = serviceOf(state.service);

  if (state.weightG > lane.maxG) {
    return {
      ok: false,
      lane,
      service,
      status: 422,
      code: "parcel_over_limit",
      param: "parcel.weight_g",
      message: `${state.weightG} g exceeds the ${lane.maxG} g single-parcel limit on ${lane.code}.`,
      fix: {
        label: `Set weight to ${groupDigits(lane.maxG)} g`,
        explain: `${lane.carrier} caps a single parcel at ${groupDigits(lane.maxG)} g on this lane. Split the shipment or drop the weight.`,
        patch: { weightG: lane.maxG },
      },
    };
  }

  if (service.id === "priority" && !lane.bondedAir) {
    return {
      ok: false,
      lane,
      service,
      status: 422,
      code: "service_not_on_lane",
      param: "service",
      message: `priority is not carried on ${lane.code}.`,
      fix: {
        label: "Switch to express",
        explain: `${lane.code} moves by surface consolidation, so there is no bonded air corridor to buy. Express is the fastest thing this lane sells.`,
        patch: { service: "express" },
      },
    };
  }

  const halfKiloUnits = Math.ceil(state.weightG / 500);
  const billableG = halfKiloUnits * 500;
  const base = lane.baseCents;
  const weightCents = halfKiloUnits * lane.perHalfKgCents;
  const subtotal = base + weightCents;
  const uplift = pct(subtotal, service.upliftPct);
  const fuel = pct(subtotal, lane.fuelPct);
  const insurance = state.insured ? Math.round((DECLARED_VALUE_CENTS * INSURANCE_BPS) / 10000) : 0;
  const total = base + weightCents + uplift + fuel + insurance;

  const seed = `${lane.code}|${billableG}|${service.id}|${state.insured ? "ins" : "bare"}`;
  const rateId = `rt_${token(seed, 6)}`;
  const shipmentId = `shp_${token(`ship|${seed}`, 6)}`;
  const eventId = `evt_${token(`event|${seed}`, 6)}`;
  const tracking = `BLD${((hash32(`trk|${seed}`) % 900000000) + 100000000).toString()}`;

  const breakdown: BreakdownRow[] = [
    { kind: "base", cents: base, d: "lane" },
    { kind: "weight", cents: weightCents, d: "weight" },
    ...(uplift > 0 ? [{ kind: "service_uplift", cents: uplift, d: "service" as Driver }] : []),
    { kind: "fuel", cents: fuel, d: "lane" },
    ...(insurance > 0 ? [{ kind: "insurance", cents: insurance, d: "insurance" as Driver }] : []),
  ];

  return {
    ok: true,
    lane,
    service,
    billableG,
    halfKiloUnits,
    base,
    weightCents,
    uplift,
    fuel,
    insurance,
    total,
    transitDays: lane.transit[service.id],
    breakdown,
    rateId,
    shipmentId,
    eventId,
    tracking,
  };
}

/* ------------------------------------------------------------------ call 01 — rate */

const AUTH_HEADER = '"Authorization: Bearer $BOLLARD_TEST_KEY"';

export function rateRequest(lang: Lang, state: ConsoleState): Line[] {
  const lane = laneOf(state.lane);
  const weight = String(state.weightG);
  const declared = String(DECLARED_VALUE_CENTS);

  if (lang === "curl") {
    const body: Entry[] = [
      { toks: [K('"lane"'), P(": "), S(`"${lane.code}"`)], d: "lane" },
      { toks: [K('"parcel"'), P(": { "), K('"weight_g"'), P(": "), N(weight), P(" }")], d: "weight" },
      { toks: [K('"service"'), P(": "), S(`"${state.service}"`)], d: "service" },
    ];
    if (state.insured) {
      body.push({
        toks: [K('"insurance"'), P(": { "), K('"declared_value_cents"'), P(": "), N(declared), P(" }")],
        d: "insurance",
      });
    }
    return [
      L(0, [KW("curl"), T(" -X POST "), S("https://api.bollard.io/v1/rates"), T(" \\")]),
      L(1, [T("-H "), S(AUTH_HEADER), T(" \\")]),
      L(1, [T("-H "), S('"Content-Type: application/json"'), T(" \\")]),
      L(1, [T("-d "), P("'{")]),
      ...commas(2, body),
      L(1, [P("}'")]),
    ];
  }

  if (lang === "js") {
    const body: Entry[] = [
      { toks: [K("lane"), P(": "), S(`"${lane.code}"`)], d: "lane" },
      { toks: [K("parcel"), P(": { "), K("weight_g"), P(": "), N(weight), P(" }")], d: "weight" },
      { toks: [K("service"), P(": "), S(`"${state.service}"`)], d: "service" },
    ];
    if (state.insured) {
      body.push({
        toks: [K("insurance"), P(": { "), K("declared_value_cents"), P(": "), N(declared), P(" }")],
        d: "insurance",
      });
    }
    return [
      L(0, [KW("import"), T(" Bollard "), KW("from"), T(" "), S('"@bollard/node"'), P(";")]),
      L(0, [KW("const"), T(" bollard "), P("= "), KW("new"), T(" Bollard(process.env.BOLLARD_TEST_KEY)"), P(";")]),
      L(0, []),
      L(0, [KW("const"), T(" rate "), P("= "), KW("await"), T(" bollard.rates.create("), P("{")]),
      ...body.map((entry) => L(1, [...entry.toks, P(",")], entry.d)),
      L(0, [P("});")]),
    ];
  }

  const body: Entry[] = [
    { toks: [K("lane"), P("="), S(`"${lane.code}"`)], d: "lane" },
    { toks: [K("parcel"), P("={"), S('"weight_g"'), P(": "), N(weight), P("}")], d: "weight" },
    { toks: [K("service"), P("="), S(`"${state.service}"`)], d: "service" },
  ];
  if (state.insured) {
    body.push({
      toks: [K("insurance"), P("={"), S('"declared_value_cents"'), P(": "), N(declared), P("}")],
      d: "insurance",
    });
  }
  return [
    L(0, [KW("import"), T(" os")]),
    L(0, [KW("import"), T(" bollard")]),
    L(0, []),
    L(0, [T("client "), P("= "), T("bollard.Client(os.environ["), S('"BOLLARD_TEST_KEY"'), P("])")]),
    L(0, [T("rate "), P("= "), T("client.rates.create(")]),
    ...body.map((entry) => L(2, [...entry.toks, P(",")], entry.d)),
    L(0, [P(")")]),
  ];
}

export function rateResponse(quote: Quote): Line[] {
  if (!quote.ok) {
    const detail: Entry[] =
      quote.code === "service_not_on_lane"
        ? [
            { toks: [K('"supported"'), P(": ["), S('"economy"'), P(", "), S('"express"'), P("]")], d: "lane" },
          ]
        : [{ toks: [K('"limit_g"'), P(": "), N(String(quote.lane.maxG))], d: "lane" }];

    return [
      L(0, [P("{")]),
      L(1, [K('"error"'), P(": {")]),
      ...commas(2, [
        { toks: [K('"type"'), P(": "), S('"invalid_request_error"')] },
        { toks: [K('"code"'), P(": "), S(`"${quote.code}"`)], d: quote.code === "service_not_on_lane" ? "service" : "weight" },
        { toks: [K('"param"'), P(": "), S(`"${quote.param}"`)], d: quote.code === "service_not_on_lane" ? "service" : "weight" },
        { toks: [K('"message"'), P(": "), S(`"${quote.message}"`)], d: "sum" },
        ...detail,
        { toks: [K('"doc_url"'), P(": "), S(`"https://docs.bollard.io/e/${quote.code}"`)] },
      ]),
      L(1, [P("}")]),
      L(0, [P("}")]),
    ];
  }

  return [
    L(0, [P("{")]),
    ...commas(1, [
      { toks: [K('"id"'), P(": "), S(`"${quote.rateId}"`)], d: "chain" },
      { toks: [K('"object"'), P(": "), S('"rate"')] },
      { toks: [K('"lane"'), P(": "), S(`"${quote.lane.code}"`)], d: "lane" },
      { toks: [K('"carrier"'), P(": "), S(`"${quote.lane.carrier}"`)], d: "lane" },
      { toks: [K('"service"'), P(": "), S(`"${quote.service.id}"`)], d: "service" },
      { toks: [K('"billable_weight_g"'), P(": "), N(String(quote.billableG))], d: "weight" },
      { toks: [K('"currency"'), P(": "), S('"USD"')] },
      { toks: [K('"amount_cents"'), P(": "), N(String(quote.total))], d: "sum" },
      { toks: [K('"breakdown"'), P(": [")] },
    ]),
    ...quote.breakdown.map((row, i) =>
      L(
        2,
        [
          P("{ "),
          K('"kind"'),
          P(": "),
          S(`"${row.kind}"`),
          P(", "),
          K('"cents"'),
          P(": "),
          N(String(row.cents)),
          P(i === quote.breakdown.length - 1 ? " }" : " },"),
        ],
        row.d,
      ),
    ),
    L(1, [P("],")]),
    ...commas(1, [
      { toks: [K('"transit_days"'), P(": "), N(String(quote.transitDays))], d: "service" },
      { toks: [K('"expires_in_s"'), P(": "), N("900")] },
    ]),
    L(0, [P("}")]),
  ];
}

/* ------------------------------------------------------------------ call 02 — shipment */

export function shipmentRequest(lang: Lang, quote: QuoteOk): Line[] {
  if (lang === "curl") {
    return [
      L(0, [KW("curl"), T(" -X POST "), S("https://api.bollard.io/v1/shipments"), T(" \\")]),
      L(1, [T("-H "), S(AUTH_HEADER), T(" \\")]),
      L(1, [T("-H "), S('"Idempotency-Key: order-8841"'), T(" \\")]),
      L(1, [T("-d "), P("'{")]),
      ...commas(2, [
        { toks: [K('"rate_id"'), P(": "), S(`"${quote.rateId}"`)], d: "chain" },
        { toks: [K('"reference"'), P(": "), S('"order-8841"')] },
        { toks: [K('"label_format"'), P(": "), S('"pdf_4x6"')] },
      ]),
      L(1, [P("}'")]),
    ];
  }

  if (lang === "js") {
    return [
      L(0, [KW("const"), T(" shipment "), P("= "), KW("await"), T(" bollard.shipments.create("), P("{")]),
      L(1, [K("rate_id"), P(": "), T("rate.id"), P(","), T("  "), C(`// ${quote.rateId}`)], "chain"),
      L(1, [K("reference"), P(": "), S('"order-8841"'), P(",")]),
      L(1, [K("label_format"), P(": "), S('"pdf_4x6"'), P(",")]),
      L(0, [P("}, {"), T(" idempotencyKey"), P(": "), S('"order-8841"'), P(" });")]),
    ];
  }

  return [
    L(0, [T("shipment "), P("= "), T("client.shipments.create(")]),
    L(2, [K("rate_id"), P("="), T("rate.id"), P(","), T("  "), C(`# ${quote.rateId}`)], "chain"),
    L(2, [K("reference"), P("="), S('"order-8841"'), P(",")]),
    L(2, [K("label_format"), P("="), S('"pdf_4x6"'), P(",")]),
    L(2, [K("idempotency_key"), P("="), S('"order-8841"'), P(",")]),
    L(0, [P(")")]),
  ];
}

export function shipmentResponse(quote: QuoteOk): Line[] {
  return [
    L(0, [P("{")]),
    ...commas(1, [
      { toks: [K('"id"'), P(": "), S(`"${quote.shipmentId}"`)], d: "chain" },
      { toks: [K('"object"'), P(": "), S('"shipment"')] },
      { toks: [K('"rate_id"'), P(": "), S(`"${quote.rateId}"`)], d: "chain" },
      { toks: [K('"reference"'), P(": "), S('"order-8841"')] },
      { toks: [K('"status"'), P(": "), S('"label_pending"')] },
      { toks: [K('"carrier"'), P(": "), S(`"${quote.lane.carrier}"`)], d: "lane" },
      { toks: [K('"tracking_code"'), P(": "), S(`"${quote.tracking}"`)], d: "chain" },
      { toks: [K('"eta_business_days"'), P(": "), N(String(quote.transitDays))], d: "service" },
      { toks: [K('"charged_cents"'), P(": "), N(String(quote.total))], d: "sum" },
      { toks: [K('"label_url"'), P(": "), KW("null")] },
    ]),
    L(0, [P("}")]),
  ];
}

/* ------------------------------------------------------------------ call 03 — webhook */

/**
 * Deliberately raw HTTP in every language: this is the one message the reader does not send, and
 * dressing it as an SDK call would misrepresent what actually arrives at their endpoint.
 */
export function webhookDelivery(quote: QuoteOk): Line[] {
  return [
    L(0, [KW("POST"), T(" /hooks/bollard HTTP/1.1")]),
    L(0, [K("Host"), P(": "), T("api.yourapp.com")]),
    L(0, [K("Bollard-Signature"), P(": "), T("v1=9f2c4ab1; ts=1746091200")]),
    L(0, [K("Bollard-Version"), P(": "), T(VERSION_PIN)]),
    L(0, []),
    L(0, [P("{")]),
    ...commas(1, [
      { toks: [K('"id"'), P(": "), S(`"${quote.eventId}"`)], d: "chain" },
      { toks: [K('"type"'), P(": "), S('"shipment.label_ready"')] },
      { toks: [K('"data"'), P(": {")] },
    ]),
    ...commas(2, [
      { toks: [K('"shipment_id"'), P(": "), S(`"${quote.shipmentId}"`)], d: "chain" },
      { toks: [K('"tracking_code"'), P(": "), S(`"${quote.tracking}"`)], d: "chain" },
      { toks: [K('"carrier"'), P(": "), S(`"${quote.lane.carrier}"`)], d: "lane" },
      { toks: [K('"charged_cents"'), P(": "), N(String(quote.total))], d: "sum" },
      { toks: [K('"label_url"'), P(": "), S(`"https://labels.bollard.io/l/${quote.shipmentId}.pdf"`)], d: "chain" },
    ]),
    L(1, [P("}")]),
    L(0, [P("}")]),
  ];
}

export function webhookHandler(lang: Lang): Line[] {
  if (lang === "curl") {
    return [
      L(0, [KW("HTTP/1.1"), T(" 204 No Content")]),
      L(0, []),
      L(0, [C("# Any 2xx inside 5s counts as delivered.")]),
      L(0, [C("# Anything else retries at 5s, 30s, 2m,")]),
      L(0, [C("# 10m, 1h, then hourly for 24h.")]),
      L(0, []),
      L(0, [C("# Replay by hand while you build:")]),
      L(0, [KW("bollard"), T(" events replay "), S("evt_...")]),
    ];
  }

  if (lang === "js") {
    return [
      L(0, [T("app.post("), S('"/hooks/bollard"'), P(", ("), T("req, res"), P(") => {")]),
      L(1, [KW("const"), T(" event "), P("= "), T("bollard.webhooks.verify(")]),
      L(2, [T("req.rawBody"), P(",")]),
      L(2, [T("req.headers["), S('"bollard-signature"'), P("],")]),
      L(2, [T("process.env.BOLLARD_WEBHOOK_SECRET"), P(",")]),
      L(1, [P(");")]),
      L(1, [KW("if"), T(" (event.type "), P("=== "), S('"shipment.label_ready"'), P(") {")]),
      L(2, [KW("await"), T(" store.attachLabel(event.data)"), P(";")]),
      L(1, [P("}")]),
      L(1, [T("res.sendStatus("), N("204"), P(");")]),
      L(0, [P("});")]),
    ];
  }

  return [
    L(0, [P("@"), T("app.post("), S('"/hooks/bollard"'), P(")")]),
    L(0, [KW("def"), T(" hooks(request)"), P(":")]),
    L(2, [T("event "), P("= "), T("bollard.webhooks.verify(")]),
    L(4, [T("request.data"), P(",")]),
    L(4, [T("request.headers["), S('"Bollard-Signature"'), P("],")]),
    L(4, [T("os.environ["), S('"BOLLARD_WEBHOOK_SECRET"'), P("],")]),
    L(2, [P(")")]),
    L(2, [KW("if"), T(" event.type "), P("== "), S('"shipment.label_ready"'), P(":")]),
    L(4, [T("store.attach_label(event.data)")]),
    L(2, [KW("return"), T(" "), S('""'), P(", "), N("204")]),
  ];
}

