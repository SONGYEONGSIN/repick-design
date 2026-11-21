// Deterministic, hand-authored dummy data for the Ledgerline variance
// decomposition console. All values are fixed constants — no Math.random(),
// no Date.now(), no `new Date()` with no argument — so output never changes
// between renders and never causes a hydration mismatch.
//
// Every parent node's value equals the exact sum of its children's values,
// and every group of sibling `pctOfParent` values sums to exactly 100.

export interface VarianceNode {
  id: string;
  /** Always English, used as the full visible label for this node. */
  label: string;
  /** Signed variance in $K. Negative = shortfall/unfavorable, positive = overspend. */
  value: number;
  /** Percent of the immediate parent's absolute value. `null` only for the root. */
  pctOfParent: number | null;
  children?: VarianceNode[];
}

export interface KpiDefinition {
  id: string;
  label: string;
  category: string;
  periodLabel: string;
  trend: "down" | "up";
  root: VarianceNode;
}

export const KPIS: KpiDefinition[] = [
  {
    id: "net-revenue",
    label: "Net Revenue Variance",
    category: "Revenue",
    periodLabel: "Q3 FY26 vs Plan",
    trend: "down",
    root: {
      id: "net-revenue-root",
      label: "Net Revenue Variance",
      value: -500,
      pctOfParent: null,
      children: [
        {
          id: "net-revenue-enterprise",
          label: "Enterprise Segment",
          value: -300,
          pctOfParent: 60,
          children: [
            { id: "net-revenue-enterprise-newlogo", label: "New Logo ARR Shortfall", value: -150, pctOfParent: 50 },
            { id: "net-revenue-enterprise-expansion", label: "Expansion ARR Shortfall", value: -90, pctOfParent: 30 },
            { id: "net-revenue-enterprise-churn", label: "Churn & Contraction", value: -60, pctOfParent: 20 },
          ],
        },
        {
          id: "net-revenue-midmarket",
          label: "Mid-Market Segment",
          value: -125,
          pctOfParent: 25,
          children: [
            { id: "net-revenue-midmarket-newlogo", label: "New Logo ARR Shortfall", value: -60, pctOfParent: 48 },
            { id: "net-revenue-midmarket-expansion", label: "Expansion ARR Shortfall", value: -40, pctOfParent: 32 },
            { id: "net-revenue-midmarket-churn", label: "Churn & Contraction", value: -25, pctOfParent: 20 },
          ],
        },
        {
          id: "net-revenue-smb",
          label: "SMB Segment",
          value: -75,
          pctOfParent: 15,
          children: [
            { id: "net-revenue-smb-newlogo", label: "New Logo ARR Shortfall", value: -45, pctOfParent: 60 },
            { id: "net-revenue-smb-expansion", label: "Expansion ARR Shortfall", value: -18, pctOfParent: 24 },
            { id: "net-revenue-smb-churn", label: "Churn & Contraction", value: -12, pctOfParent: 16 },
          ],
        },
      ],
    },
  },
  {
    id: "gross-margin",
    label: "Gross Margin Variance",
    category: "Margin",
    periodLabel: "Q3 FY26 vs Plan",
    trend: "down",
    root: {
      id: "gross-margin-root",
      label: "Gross Margin Variance",
      value: -200,
      pctOfParent: null,
      children: [
        {
          id: "gross-margin-cogs",
          label: "COGS Inflation",
          value: -120,
          pctOfParent: 60,
          children: [
            { id: "gross-margin-cogs-freight", label: "Freight & Logistics", value: -60, pctOfParent: 50 },
            { id: "gross-margin-cogs-materials", label: "Raw Materials", value: -36, pctOfParent: 30 },
            { id: "gross-margin-cogs-labor", label: "Labor Cost", value: -24, pctOfParent: 20 },
          ],
        },
        {
          id: "gross-margin-discounts",
          label: "Pricing Discounts",
          value: -60,
          pctOfParent: 30,
          children: [
            { id: "gross-margin-discounts-promo", label: "Promotional Discounts", value: -36, pctOfParent: 60 },
            { id: "gross-margin-discounts-rebates", label: "Volume Rebates", value: -15, pctOfParent: 25 },
            { id: "gross-margin-discounts-terms", label: "Early-Payment Terms", value: -9, pctOfParent: 15 },
          ],
        },
        {
          id: "gross-margin-mix",
          label: "Mix Shift",
          value: -20,
          pctOfParent: 10,
          children: [
            { id: "gross-margin-mix-sku", label: "Low-Margin SKU Growth", value: -14, pctOfParent: 70 },
            { id: "gross-margin-mix-channel", label: "Channel Mix Shift", value: -6, pctOfParent: 30 },
          ],
        },
      ],
    },
  },
  {
    id: "customer-churn",
    label: "Customer Churn Variance",
    category: "Retention",
    periodLabel: "Q3 FY26 vs Plan",
    trend: "down",
    root: {
      id: "customer-churn-root",
      label: "Customer Churn Variance",
      value: -400,
      pctOfParent: null,
      children: [
        {
          id: "customer-churn-nonrenewal",
          label: "Contract Non-Renewal",
          value: -200,
          pctOfParent: 50,
          children: [
            { id: "customer-churn-nonrenewal-budget", label: "Budget Cuts", value: -90, pctOfParent: 45 },
            { id: "customer-churn-nonrenewal-vendor", label: "Vendor Consolidation", value: -70, pctOfParent: 35 },
            { id: "customer-churn-nonrenewal-fit", label: "Product Fit Gaps", value: -40, pctOfParent: 20 },
          ],
        },
        {
          id: "customer-churn-downgrade",
          label: "Downgrade & Contraction",
          value: -120,
          pctOfParent: 30,
          children: [
            { id: "customer-churn-downgrade-seats", label: "Seat Reduction", value: -60, pctOfParent: 50 },
            { id: "customer-churn-downgrade-usage", label: "Usage Decline", value: -36, pctOfParent: 30 },
            { id: "customer-churn-downgrade-tier", label: "Tier Downgrade", value: -24, pctOfParent: 20 },
          ],
        },
        {
          id: "customer-churn-competitive",
          label: "Competitive Losses",
          value: -80,
          pctOfParent: 20,
          children: [
            { id: "customer-churn-competitive-pricing", label: "Pricing Undercut", value: -48, pctOfParent: 60 },
            { id: "customer-churn-competitive-feature", label: "Feature Gap", value: -32, pctOfParent: 40 },
          ],
        },
      ],
    },
  },
  {
    id: "operating-spend",
    label: "Operating Spend Variance",
    category: "Spend",
    periodLabel: "Q3 FY26 vs Plan",
    trend: "up",
    root: {
      id: "operating-spend-root",
      label: "Operating Spend Variance",
      value: 150,
      pctOfParent: null,
      children: [
        {
          id: "operating-spend-headcount",
          label: "Headcount & Contractor Spend",
          value: 60,
          pctOfParent: 40,
          children: [
            { id: "operating-spend-headcount-contractor", label: "Contractor Overrun", value: 30, pctOfParent: 50 },
            { id: "operating-spend-headcount-backfill", label: "Backfill Hiring", value: 18, pctOfParent: 30 },
            { id: "operating-spend-headcount-overtime", label: "Overtime Premium", value: 12, pctOfParent: 20 },
          ],
        },
        {
          id: "operating-spend-cloud",
          label: "Cloud Infrastructure Spend",
          value: 60,
          pctOfParent: 40,
          children: [
            { id: "operating-spend-cloud-compute", label: "Compute Overprovisioning", value: 30, pctOfParent: 50 },
            { id: "operating-spend-cloud-storage", label: "Storage Growth", value: 18, pctOfParent: 30 },
            { id: "operating-spend-cloud-egress", label: "Data Egress Fees", value: 12, pctOfParent: 20 },
          ],
        },
        {
          id: "operating-spend-marketing",
          label: "Marketing & Tooling Spend",
          value: 30,
          pctOfParent: 20,
          children: [
            { id: "operating-spend-marketing-saas", label: "SaaS Tool Sprawl", value: 18, pctOfParent: 60 },
            { id: "operating-spend-marketing-media", label: "Paid Media Overrun", value: 12, pctOfParent: 40 },
          ],
        },
      ],
    },
  },
];

/** Largest absolute root value across all KPIs, used to scale the rail's magnitude bars. */
export const MAX_ABS_ROOT_VALUE = 500;

export const CURRENT_USER = {
  name: "Maya Chen",
  email: "maya.chen@northline.io",
  initials: "MC",
};

export const WORKSPACE_LABEL = "Northline Retail · Q3 FY26";
