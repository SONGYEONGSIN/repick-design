export type Variant = {
  id: string;
  label: string;
  note: string;
  target: string;
};

export type FieldRow = {
  id: string;
  kindLabel: string;
  lossy: boolean;
  source: { path: string; type: string; sample: string };
  target: { path: string; type: string };
  delivered: string;
  rule: string;
  loses: string[];
  variants?: Variant[];
};

export type BlockedItem = {
  id: string;
  name: string;
  origin: string;
  reason: string;
  detail: string;
  instead: string;
};

export const CONNECTION = {
  product: 'Tessera',
  source: 'Salesforce',
  org: 'Acme Manufacturing, production org 00D5f0000012Xyz',
  direction: 'One way. Salesforce writes into Tessera, Tessera never writes back.',
  cadence: 'Every 15 minutes, plus a full reconcile at 03:00 UTC',
  objects: 'Account, Contact, Opportunity',
  schemaRead: 'Schema read 2026-08-09 06:12 UTC',
} as const;

export const SUMMARY = [
  { value: '9', label: 'fields land in Tessera' },
  { value: '6', label: 'of them change shape on the way' },
  { value: '6', label: 'things stay behind, listed below' },
] as const;

export const RECORD = {
  title: 'Line 3 retrofit, Acme Manufacturing',
  id: 'Opportunity 0065f00000QpL7dAAF',
  received: 'Read 2026-08-09 14:02 UTC',
} as const;

export const FIELD_ROWS: FieldRow[] = [
  {
    id: 'name',
    kindLabel: 'Copied as-is',
    lossy: false,
    source: { path: 'Account.Name', type: 'Text(255)', sample: 'ACME Manufacturing Co.' },
    target: { path: 'customer.legal_name', type: 'string' },
    delivered: 'ACME Manufacturing Co.',
    rule: 'Copied character for character. No trimming, no case folding.',
    loses: [
      'A rename in Salesforce overwrites the Tessera value on the next run. Tessera keeps no record of the previous name.',
    ],
  },
  {
    id: 'revenue',
    kindLabel: 'Converted',
    lossy: false,
    source: { path: 'Account.AnnualRevenue', type: 'Currency(18,0), EUR', sample: '4,200,000 EUR' },
    target: { path: 'customer.annual_revenue_usd', type: 'integer' },
    delivered: '4,536,000 USD',
    rule: 'Multiplied by the rate read at sync time, 1 EUR = 1.08 USD on 2026-08-09, then rounded to whole dollars.',
    loses: [
      'The rate is not stored next to the record. A value delivered last month is never restated when the rate moves.',
      'An empty AnnualRevenue arrives as null, not as zero. Averages in Tessera skip those accounts rather than pull them down.',
    ],
    variants: [
      {
        id: 'usd',
        label: 'Convert to USD at the sync-time rate',
        note: 'One currency across the table, so totals add up.',
        target: '4,536,000 USD',
      },
      {
        id: 'native',
        label: 'Keep the source amount and its currency code',
        note: 'Nothing is converted. Any Tessera report that mixes currencies will not sum.',
        target: '4,200,000 EUR',
      },
    ],
  },
  {
    id: 'closedate',
    kindLabel: 'Normalized',
    lossy: false,
    source: {
      path: 'Opportunity.CloseDate',
      type: 'Date, org tz America/Chicago',
      sample: '2026-03-31',
    },
    target: { path: 'deal.closed_on', type: 'timestamptz' },
    delivered: '2026-03-31T05:00:00Z',
    rule: 'Read as midnight in the Salesforce org timezone, then stored in UTC.',
    loses: [
      'The offset is 5 hours from March to November and 6 hours otherwise. A quarter-end deal can land in the next UTC day, which moves it out of the quarter in Tessera reporting.',
      'Changing the org timezone in Salesforce does not restate rows already delivered.',
    ],
    variants: [
      {
        id: 'utc',
        label: 'Normalize to UTC',
        note: 'Comparable with every other timestamp in Tessera.',
        target: '2026-03-31T05:00:00Z',
      },
      {
        id: 'offset',
        label: 'Keep the Salesforce org offset',
        note: 'The date a seller sees in Salesforce is the date stored in Tessera.',
        target: '2026-03-31T00:00:00-05:00',
      },
    ],
  },
  {
    id: 'address',
    kindLabel: 'Split into 5',
    lossy: true,
    source: {
      path: 'Account.BillingAddress',
      type: 'Compound address',
      sample: '1200 W Fulton Market, Suite 400, Chicago, IL 60607, US',
    },
    target: { path: 'customer.address_*', type: '5 columns' },
    delivered: 'street 1200 W Fulton Market / unit Suite 400 / city Chicago / region IL / postal 60607 / country US',
    rule: 'Split on the Salesforce subfields. The second street line becomes unit.',
    loses: [
      'geocodeAccuracy and the latitude and longitude pair are dropped. Tessera geocodes from the street address on its own, which disagrees with Salesforce for about 3 percent of rows.',
      'A street written across three or more lines keeps only the first two.',
    ],
  },
  {
    id: 'amount',
    kindLabel: 'Rescaled',
    lossy: false,
    source: { path: 'Opportunity.Amount', type: 'Currency(16,2), USD', sample: '18,250.75 USD' },
    target: { path: 'deal.amount_minor', type: 'integer, cents' },
    delivered: '1825075',
    rule: 'Multiplied by 100 and stored as an integer, so that long sums never drift.',
    loses: [
      'Currencies with three decimal places, BHD, KWD and OMR, are rounded to two before scaling. Those records are named in the run log rather than silently rounded.',
    ],
  },
  {
    id: 'industry',
    kindLabel: 'Collapsed, lossy',
    lossy: true,
    source: { path: 'Account.Industry', type: 'Picklist, 34 values', sample: 'Apparel' },
    target: { path: 'customer.segment', type: 'enum, 6 values' },
    delivered: 'retail',
    rule: '34 Salesforce picklist values fold into 6 Tessera segments. Nine of them have no home and become other.',
    loses: [
      'Apparel, Retail and Consumer Goods all become retail. Once delivered, nothing in Tessera can tell them apart.',
      'Any picklist value added in Salesforce after 2026-08-09 becomes other until somebody edits the map.',
    ],
    variants: [
      {
        id: 'collapse',
        label: 'Fold into the 6 Tessera segments',
        note: 'Segment filters work. The original wording is gone.',
        target: 'retail',
      },
      {
        id: 'raw',
        label: 'Fold, and carry the raw value beside it',
        note: 'segment_raw holds the Salesforce string. Filters still run on the 6 segments.',
        target: 'retail, segment_raw = Apparel',
      },
    ],
  },
  {
    id: 'email',
    kindLabel: 'Normalized',
    lossy: true,
    source: { path: 'Contact.Email', type: 'Email(80)', sample: '  Dana.Whitlock@ACME.com  ' },
    target: { path: 'contact.email', type: 'citext' },
    delivered: 'dana.whitlock@acme.com',
    rule: 'Trimmed and lowercased, because Tessera uses email as the identity key for a contact.',
    loses: [
      'Two Salesforce contacts that differ only in letter case collapse into one Tessera contact. The older record wins and the newer one is named in the run log.',
    ],
  },
  {
    id: 'stage',
    kindLabel: 'Mapped',
    lossy: true,
    source: { path: 'Opportunity.StageName', type: 'Picklist, 8 values', sample: 'Negotiation/Review' },
    target: { path: 'deal.stage', type: 'enum, 5 values' },
    delivered: 'negotiation',
    rule: 'Eight sales stages map onto five Tessera stages. An unmapped value falls back to open.',
    loses: [
      'Perception Analysis and Value Proposition both arrive as qualified.',
      'A deal moving backwards through stages is delivered, but Tessera stores only the current stage, not the path.',
    ],
  },
  {
    id: 'owner',
    kindLabel: 'Resolved by lookup',
    lossy: false,
    source: { path: 'Account.OwnerId', type: 'Id(18)', sample: '0055f00000A1b2cAAB' },
    target: { path: 'customer.owner_email', type: 'string' },
    delivered: 'priya.raman@acme.com',
    rule: 'The Salesforce user id is resolved against the User object on every run.',
    loses: [
      'A deactivated user no longer resolves. The field is written as null rather than keeping a name that no longer works.',
      'The lookup spends one extra API call per 200 accounts against the daily limit.',
    ],
  },
];

export const BLOCKED: BlockedItem[] = [
  {
    id: 'description',
    name: 'Account.Description',
    origin: 'Long text, up to 32,000 characters',
    reason: 'No Tessera field holds it, and a quiet truncation would read like the whole note.',
    detail:
      'The widest Tessera text column is 2,000 characters. Cutting at the limit would leave half a sentence that looks complete, so the connection skips the field rather than deliver something misleading.',
    instead: 'The note stays in Salesforce. Every Tessera customer row links back to the source record.',
  },
  {
    id: 'formula',
    name: 'Formula and roll-up summary fields',
    origin: 'Open_Pipeline__c, Days_Since_Contact__c and 11 more',
    reason: 'Salesforce computes them at read time, so a copy is already stale when it lands.',
    detail:
      'A roll-up recalculates whenever a child record moves. Delivered on a 15 minute cadence, the value would disagree with Salesforce for most of the day and nobody could tell which one was wrong.',
    instead: 'Tessera recomputes pipeline from deal.amount_minor and deal.stage, which it already receives.',
  },
  {
    id: 'files',
    name: 'Files and attachments',
    origin: 'ContentDocument, ContentVersion',
    reason: 'Binary payloads are out of scope for this connection.',
    detail:
      'A signed contract would have to be re-hosted, versioned and permission checked inside Tessera. That is a second system of record for the same document, which is how two versions of a contract start to exist.',
    instead: 'Tessera stores the Salesforce file link. Access is still decided by Salesforce sharing rules.',
  },
  {
    id: 'person',
    name: 'Person accounts',
    origin: '214 records where IsPersonAccount is true',
    reason: 'The Tessera customer object requires a legal entity, and a person account is not one.',
    detail:
      'A person account merges Account and Contact into a single Salesforce record. Tessera keeps the two apart because invoices attach to the entity and consent attaches to the person. Merging them would put a personal email on a billing record.',
    instead: 'Convert them in Salesforce, or leave them out. All 214 are listed in the nightly run log.',
  },
  {
    id: 'deletes',
    name: 'Deletes',
    origin: 'Change feed events of type deleted',
    reason: 'Deleting in Salesforce does not delete in Tessera.',
    detail:
      'The connection sees the delete and writes archived_at on the Tessera row instead of removing it, so that invoices and reports already issued against that customer still resolve.',
    instead: 'Archived customers are hidden from lists by default and can be removed by hand in Tessera.',
  },
  {
    id: 'writeback',
    name: 'Anything corrected inside Tessera',
    origin: 'Tessera edits on mapped fields',
    reason: 'This connection runs one way. Nothing travels back to Salesforce.',
    detail:
      'A segment fixed by hand in Tessera survives until the Salesforce value changes, and then it is overwritten without warning. The mapped fields belong to Salesforce for as long as they are mapped.',
    instead: 'Fix the value in Salesforce, or switch the field off in the map above so that Tessera owns it.',
  },
];
