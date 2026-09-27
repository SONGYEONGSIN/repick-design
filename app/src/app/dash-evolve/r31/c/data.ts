// Deterministic dummy data — no Math.random / Date.now / argument-less new Date().

export interface Leaf {
  id: string;
  name: string;
  count: number;
  lastSeen: string;
  trend: "up" | "down" | "flat";
}

export interface Subcategory {
  id: string;
  name: string;
  leaves: Leaf[];
}

export interface Category {
  id: string;
  name: string;
  subcategories: Subcategory[];
}

export const TREE: Category[] = [
  {
    id: "billing",
    name: "Billing",
    subcategories: [
      {
        id: "billing-charges",
        name: "Unexpected charges",
        leaves: [
          { id: "billing-charges-proration", name: "Mid-cycle plan proration", count: 84, lastSeen: "2d ago", trend: "up" },
          { id: "billing-charges-tax", name: "Regional tax miscalculation", count: 31, lastSeen: "6d ago", trend: "flat" },
        ],
      },
      {
        id: "billing-refunds",
        name: "Refund delays",
        leaves: [
          { id: "billing-refunds-bank", name: "Bank processing window", count: 46, lastSeen: "1d ago", trend: "down" },
          { id: "billing-refunds-manual", name: "Manual review queue backlog", count: 22, lastSeen: "4d ago", trend: "up" },
        ],
      },
    ],
  },
  {
    id: "bug",
    name: "Bug reports",
    subcategories: [
      {
        id: "bug-sync",
        name: "Sync failures",
        leaves: [
          { id: "bug-sync-conflict", name: "Offline edit conflict", count: 63, lastSeen: "3h ago", trend: "up" },
          { id: "bug-sync-timeout", name: "Upload timeout on slow networks", count: 28, lastSeen: "1d ago", trend: "flat" },
        ],
      },
      {
        id: "bug-render",
        name: "Rendering glitches",
        leaves: [{ id: "bug-render-export", name: "PDF export layout shift", count: 19, lastSeen: "5d ago", trend: "down" }],
      },
    ],
  },
  {
    id: "onboarding",
    name: "Onboarding",
    subcategories: [
      {
        id: "onboarding-sso",
        name: "SSO setup",
        leaves: [
          { id: "onboarding-sso-domain", name: "Domain verification stuck", count: 37, lastSeen: "12h ago", trend: "up" },
          { id: "onboarding-sso-mapping", name: "Role mapping mismatch", count: 24, lastSeen: "3d ago", trend: "flat" },
        ],
      },
      {
        id: "onboarding-import",
        name: "Data import",
        leaves: [{ id: "onboarding-import-csv", name: "CSV column mismatch", count: 41, lastSeen: "2d ago", trend: "down" }],
      },
    ],
  },
  {
    id: "integration",
    name: "Integrations",
    subcategories: [
      {
        id: "integration-webhook",
        name: "Webhook delivery",
        leaves: [
          { id: "integration-webhook-retry", name: "Retry backoff too aggressive", count: 29, lastSeen: "8h ago", trend: "up" },
          { id: "integration-webhook-auth", name: "Signature verification failure", count: 17, lastSeen: "6d ago", trend: "flat" },
        ],
      },
    ],
  },
];

export function categoryCount(cat: Category): number {
  return cat.subcategories.reduce((s, sc) => s + sc.leaves.reduce((s2, l) => s2 + l.count, 0), 0);
}

export function subcategoryCount(sc: Subcategory): number {
  return sc.leaves.reduce((s, l) => s + l.count, 0);
}

export function grandTotal(): number {
  return TREE.reduce((s, c) => s + categoryCount(c), 0);
}

export function findLeaf(leafId: string): { cat: Category; sub: Subcategory; leaf: Leaf } | null {
  for (const cat of TREE) {
    for (const sub of cat.subcategories) {
      const leaf = sub.leaves.find((l) => l.id === leafId);
      if (leaf) return { cat, sub, leaf };
    }
  }
  return null;
}

export function topLeaf(): Leaf {
  return TREE.flatMap((c) => c.subcategories.flatMap((s) => s.leaves)).reduce((best, l) => (l.count > best.count ? l : best));
}

export interface Ticket {
  id: string;
  subject: string;
  opened: string;
  status: "open" | "pending" | "resolved";
}

const TICKET_DATES = ["Jun 02", "Jun 05", "Jun 09", "Jun 14", "Jun 18", "Jun 21"];

export function ticketsFor(leafId: string): Ticket[] {
  const found = findLeaf(leafId);
  if (!found) return [];
  return TICKET_DATES.map((date, i) => {
    const wobble = (i * 7 + leafId.length * 3) % 3;
    const status: Ticket["status"] = wobble === 0 ? "resolved" : wobble === 1 ? "pending" : "open";
    return {
      id: `${found.leaf.id}-${i + 1}`,
      subject: `${found.leaf.name} — case ${i + 1}`,
      opened: date,
      status,
    };
  });
}
