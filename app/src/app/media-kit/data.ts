export type CiteFormat = "plain" | "markdown" | "bibtex";

export const COMPANY = "Tolvan Systems, Inc.";
export const SHORT_NAME = "Tolvan Systems";
export const PRESS_URL = "https://tolvansystems.com/press";
export const RECORD_REVIEWED = "March 14, 2026";
export const RECORD_REVIEWED_ISO = "2026-03-14";
export const RECORD_NEXT = "September 15, 2026";
export const CORRECTIONS_EMAIL = "corrections@tolvansystems.com";

export type Fact = {
  id: string;
  citeKey: string;
  label: string;
  value: string;
  detail: string;
  verifiedOn: string;
  verifiedIso: string;
  confirmedBy: string;
};

export const FACTS: Fact[] = [
  {
    id: "legal-name",
    citeKey: "tolvan-legal-name-2026",
    label: "Legal entity name",
    value: "Tolvan Systems, Inc.",
    detail:
      "Spell it in full on first mention, then Tolvan alone. Never Tolvan AI, never Tolvan Systems Ltd.",
    verifiedOn: "January 22, 2026",
    verifiedIso: "2026-01-22",
    confirmedBy: "Owen Brackett, General Counsel",
  },
  {
    id: "founded",
    citeKey: "tolvan-founded-2026",
    label: "Founded",
    value: "2019",
    detail:
      "Incorporated in Delaware on April 8, 2019. First paying terminal went live in November 2020.",
    verifiedOn: "January 22, 2026",
    verifiedIso: "2026-01-22",
    confirmedBy: "Owen Brackett, General Counsel",
  },
  {
    id: "headquarters",
    citeKey: "tolvan-hq-2026",
    label: "Headquarters",
    value: "Pittsburgh, Pennsylvania",
    detail:
      "One other office: Gothenburg, Sweden, opened in 2024. There are no other Tolvan locations, staffed or otherwise.",
    verifiedOn: "May 4, 2026",
    verifiedIso: "2026-05-04",
    confirmedBy: "Dana Whitfield, VP Communications",
  },
  {
    id: "employees",
    citeKey: "tolvan-headcount-2026",
    label: "Employees",
    value: "412",
    detail:
      "Full-time, at the June 30, 2026 payroll close. 61 of them sit in Gothenburg. Contractors are not counted.",
    verifiedOn: "June 30, 2026",
    verifiedIso: "2026-06-30",
    confirmedBy: "Priya Raghunathan, Head of Finance Communications",
  },
  {
    id: "funding-total",
    citeKey: "tolvan-funding-2026",
    label: "Funding to date",
    value: "$186M",
    detail:
      "Seed through Series C, equity only. No debt facility has been announced. Tolvan does not disclose valuation.",
    verifiedOn: "June 30, 2026",
    verifiedIso: "2026-06-30",
    confirmedBy: "Priya Raghunathan, Head of Finance Communications",
  },
  {
    id: "latest-round",
    citeKey: "tolvan-series-c-2026",
    label: "Latest round",
    value: "Series C, $95M",
    detail:
      "Closed March 11, 2026. Led by Redpoint Ventures, with Amplify Partners and Norrsken participating.",
    verifiedOn: "March 11, 2026",
    verifiedIso: "2026-03-11",
    confirmedBy: "Priya Raghunathan, Head of Finance Communications",
  },
  {
    id: "ceo",
    citeKey: "tolvan-ceo-2026",
    label: "Chief Executive Officer",
    value: "Ingrid Salvesen",
    detail:
      "Co-founder and CEO. The surname ends in -sen, not -son. Pronouns: she/her. Title takes no interim qualifier.",
    verifiedOn: "June 1, 2026",
    verifiedIso: "2026-06-01",
    confirmedBy: "Dana Whitfield, VP Communications",
  },
  {
    id: "cto",
    citeKey: "tolvan-cto-2026",
    label: "Chief Technology Officer",
    value: "Marcus Adeyemi-Roche",
    detail:
      "Co-founder and CTO. Hyphenated surname, no space, both parts capitalized. Pronouns: he/him.",
    verifiedOn: "June 1, 2026",
    verifiedIso: "2026-06-01",
    confirmedBy: "Dana Whitfield, VP Communications",
  },
  {
    id: "products",
    citeKey: "tolvan-products-2026",
    label: "Product names",
    value: "Relay, Relay Edge, Fleet API",
    detail:
      "Capital R in Relay. Relay Edge is two words. Fleet API takes no company prefix in body copy.",
    verifiedOn: "April 18, 2026",
    verifiedIso: "2026-04-18",
    confirmedBy: "Dana Whitfield, VP Communications",
  },
  {
    id: "pronunciation",
    citeKey: "tolvan-pronunciation-2026",
    label: "Pronunciation",
    value: "TOLL-vahn",
    detail:
      "Two syllables, stress on the first. Not tol-VAHN. The name comes from a Swedish rail siding, not from an acronym.",
    verifiedOn: "April 18, 2026",
    verifiedIso: "2026-04-18",
    confirmedBy: "Dana Whitfield, VP Communications",
  },
  {
    id: "ownership",
    citeKey: "tolvan-ownership-2026",
    label: "Ownership and ticker",
    value: "Private, no ticker",
    detail:
      "Privately held. Not listed on any exchange and no OTC symbol exists. Any TLVN symbol you find is another issuer.",
    verifiedOn: "June 30, 2026",
    verifiedIso: "2026-06-30",
    confirmedBy: "Priya Raghunathan, Head of Finance Communications",
  },
  {
    id: "customers",
    citeKey: "tolvan-customers-2026",
    label: "Customers",
    value: "38 freight terminals",
    detail:
      "Across 11 operators in North America and the Nordics. Individual customers are named only with their written consent.",
    verifiedOn: "June 30, 2026",
    verifiedIso: "2026-06-30",
    confirmedBy: "Priya Raghunathan, Head of Finance Communications",
  },
];

export const FORMATS: { id: CiteFormat; name: string; hint: string }[] = [
  { id: "plain", name: "Plain text", hint: "For email, notes, and CMS fields that strip markup." },
  { id: "markdown", name: "Markdown", hint: "For docs, tickets, and static site copy." },
  { id: "bibtex", name: "BibTeX", hint: "For papers, reports, and reference managers." },
];

function sourceLine(iso: string): string {
  return `Verified ${iso}. Source: ${COMPANY} press record, ${PRESS_URL}`;
}

export function formatFact(fact: Fact, format: CiteFormat): string {
  if (format === "markdown") {
    return [
      `**${fact.label}:** ${fact.value}`,
      "",
      fact.detail,
      "",
      `_Verified ${fact.verifiedIso} by ${fact.confirmedBy} — [${SHORT_NAME} press record](${PRESS_URL})_`,
    ].join("\n");
  }
  if (format === "bibtex") {
    return [
      `@misc{${fact.citeKey},`,
      `  author       = {{${COMPANY}}},`,
      `  title        = {${SHORT_NAME} — ${fact.label}},`,
      `  note         = {${fact.value}. ${fact.detail}},`,
      `  howpublished = {Press record},`,
      `  url          = {${PRESS_URL}},`,
      `  urldate      = {${fact.verifiedIso}},`,
      `  year         = {${fact.verifiedIso.slice(0, 4)}}`,
      `}`,
    ].join("\n");
  }
  return [
    `${fact.label}: ${fact.value}`,
    fact.detail,
    `${sourceLine(fact.verifiedIso)}. Confirmed by ${fact.confirmedBy}.`,
  ].join("\n");
}

export function formatRecord(format: CiteFormat): string {
  const body = FACTS.map((fact) => formatFact(fact, format)).join("\n\n");
  if (format === "bibtex") return body;
  if (format === "markdown") {
    return [
      `# ${COMPANY} — press record`,
      "",
      `Reviewed in full on ${RECORD_REVIEWED_ISO}. Next scheduled review ${RECORD_NEXT}.`,
      "",
      body,
    ].join("\n");
  }
  return [
    `${COMPANY} — press record`,
    `Reviewed in full on ${RECORD_REVIEWED_ISO}. Next scheduled review ${RECORD_NEXT}.`,
    "",
    body,
  ].join("\n");
}

export type Boilerplate = {
  id: string;
  name: string;
  fitFor: string;
  text: string;
};

export const BOILERPLATES: Boilerplate[] = [
  {
    id: "short",
    name: "Short",
    fitFor: "Wire copy, event programs, and the last paragraph of a news story.",
    text: "Tolvan Systems builds fleet coordination software for autonomous yard trucks at freight terminals. Founded in 2019 and based in Pittsburgh, the company serves 38 terminals across North America and the Nordics.",
  },
  {
    id: "standard",
    name: "Standard",
    fitFor: "Press releases, partner announcements, and speaker bios.",
    text: "Tolvan Systems builds fleet coordination software for autonomous yard trucks at freight terminals. Its products — Relay, Relay Edge, and the Fleet API — coordinate mixed fleets of autonomous and human-driven vehicles inside a yard, cutting dwell time without new trackside hardware. Founded in 2019 and based in Pittsburgh, Tolvan serves 38 terminals across North America and the Nordics and has raised $186M to date, most recently a $95M Series C led by Redpoint Ventures.",
  },
  {
    id: "full",
    name: "Full",
    fitFor: "Analyst briefings, award submissions, and long-form profiles.",
    text: "Tolvan Systems builds fleet coordination software for autonomous yard trucks at freight terminals. Its products — Relay, Relay Edge, and the Fleet API — coordinate mixed fleets of autonomous and human-driven vehicles inside a yard, cutting dwell time without new trackside hardware. The company was founded in 2019 by Ingrid Salvesen and Marcus Adeyemi-Roche, who met while rebuilding scheduling systems for a Nordic rail operator, and shipped its first paying deployment in November 2020. Tolvan employs 412 people across Pittsburgh and Gothenburg, serves 38 terminals under 11 operators in North America and the Nordics, and has raised $186M from Redpoint Ventures, Amplify Partners, and Norrsken, most recently a $95M Series C that closed in March 2026. The company is privately held and does not disclose valuation.",
  },
];

export const BOILERPLATE_APPROVED_ISO = "2026-03-14";
export const BOILERPLATE_APPROVED = "March 14, 2026";

export function wordCount(text: string): number {
  return text.trim().split(/\s+/).length;
}

export function formatBoilerplate(bp: Boilerplate, format: CiteFormat): string {
  if (format === "markdown") {
    return [
      `> ${bp.text}`,
      "",
      `_Approved boilerplate (${bp.name}, ${wordCount(bp.text)} words). ${COMPANY}, approved ${BOILERPLATE_APPROVED_ISO}. [Press record](${PRESS_URL})_`,
    ].join("\n");
  }
  if (format === "bibtex") {
    return [
      `@misc{tolvan-boilerplate-${bp.id}-2026,`,
      `  author       = {{${COMPANY}}},`,
      `  title        = {${SHORT_NAME} — approved boilerplate (${bp.name})},`,
      `  note         = {${bp.text}},`,
      `  howpublished = {Press record},`,
      `  url          = {${PRESS_URL}},`,
      `  urldate      = {${BOILERPLATE_APPROVED_ISO}},`,
      `  year         = {2026}`,
      `}`,
    ].join("\n");
  }
  return [
    bp.text,
    "",
    `Approved boilerplate (${bp.name}, ${wordCount(bp.text)} words). ${COMPANY}, approved ${BOILERPLATE_APPROVED_ISO}. ${PRESS_URL}`,
  ].join("\n");
}

export type StyleRule = { id: string; write: string; notThis: string; why: string };

export const STYLE_RULES: StyleRule[] = [
  {
    id: "entity",
    write: "Tolvan Systems, Inc.",
    notThis: "Tolvan Systems Ltd.",
    why: "A Delaware C corporation. Ltd., LLC, and GmbH are all wrong, including in the Swedish edition.",
  },
  {
    id: "no-ai",
    write: "Tolvan",
    notThis: "Tolvan AI",
    why: "The name has never carried AI in it. This is the second most common error in published coverage.",
  },
  {
    id: "relay-edge",
    write: "Relay Edge",
    notThis: "RelayEdge",
    why: "Two words, both capitalized. The compound form is a different product from a different vendor.",
  },
  {
    id: "salvesen",
    write: "Ingrid Salvesen",
    notThis: "Ingrid Salveson",
    why: "Ends in -sen. The most common error in coverage, and the one we ask to have corrected most often.",
  },
  {
    id: "adeyemi-roche",
    write: "Marcus Adeyemi-Roche",
    notThis: "Marcus Adeyemi Roche",
    why: "Hyphenated, no space. Adeyemi alone is not the surname.",
  },
  {
    id: "round-not-valuation",
    write: "a $95M Series C",
    notThis: "a $95M valuation",
    why: "The round size is public. The valuation is not, and no figure attributed to us exists.",
  },
];

// `swatch` 유틸리티 클래스를 뺐다 — 색은 `hex` 하나에서만 나온다. 두 필드가 있던 동안
// 4색 중 2색이 갈라졌다(2026-08-14 실측). 렌더는 `KitBody` 가 `hex` 로 직접 칠한다.
export type BrandColor = { id: string; name: string; hex: string; use: string };

export const BRAND_COLORS: BrandColor[] = [
  {
    id: "amber",
    name: "Tolvan Amber",
    hex: "#D97706",
    use: "The mark and one accent per layout. Never as text below 16px.",
  },
  {
    id: "black",
    name: "Yard Black",
    hex: "#18181B",
    use: "Wordmark, headings, and body text. The default, not the exception.",
  },
  {
    id: "paper",
    name: "Terminal Paper",
    hex: "#FAFAF9",
    use: "Backgrounds. The mark sits on this or on white, never on a photograph.",
  },
  {
    id: "rust",
    name: "Signal Rust",
    hex: "#9A3412",
    use: "Fault states inside the product only. Not a marketing color.",
  },
];

export type Contact = {
  id: string;
  name: string;
  role: string;
  email: string;
  covers: string;
  turnaround: string;
};

export const CONTACTS: Contact[] = [
  {
    id: "dana",
    name: "Dana Whitfield",
    role: "VP Communications",
    email: "press@tolvansystems.com",
    covers:
      "Company facts, leadership names and titles, product naming, pronunciation, interview requests.",
    turnaround: "One business day, 09:00 to 18:00 ET.",
  },
  {
    id: "priya",
    name: "Priya Raghunathan",
    role: "Head of Finance Communications",
    email: "finance.press@tolvansystems.com",
    covers:
      "Funding figures, headcount, customer counts, anything in this record with a number in it.",
    turnaround: "Two business days.",
  },
  {
    id: "owen",
    name: "Owen Brackett",
    role: "General Counsel",
    email: "legal@tolvansystems.com",
    covers:
      "Legal entity name, trademark use, logo licensing, corrections, and retraction requests.",
    turnaround: "Three business days.",
  },
];
