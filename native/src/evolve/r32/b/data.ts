// Deterministic dummy data for the Linked Social Accounts screen.
// No Math.random / Date.now() / bare new Date() anywhere.

export type LinkedAccount = {
  id: string;
  platform: string;
  handle: string;
  metricLabel: string;
  metricValue: number;
  linkedSince: string; // fixed ISO date string, yyyy-mm-dd
  isPrimary: boolean;
};

export const initialLinkedAccounts: LinkedAccount[] = [
  {
    id: "acc-instagram",
    platform: "Instagram",
    handle: "@marareselling",
    metricLabel: "Followers",
    metricValue: 18400,
    linkedSince: "2024-03-12",
    isPrimary: true,
  },
  {
    id: "acc-tiktokshop",
    platform: "TikTok Shop",
    handle: "@marareselling.shop",
    metricLabel: "Followers",
    metricValue: 9200,
    linkedSince: "2024-07-19",
    isPrimary: false,
  },
  {
    id: "acc-storefront",
    platform: "Creator Storefront",
    handle: "linktr.ee/marareselling",
    metricLabel: "Monthly visits",
    metricValue: 3100,
    linkedSince: "2025-01-05",
    isPrimary: false,
  },
];

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Deterministic formatter: parses a fixed "yyyy-mm-dd" string without
// constructing a Date object, so the result never depends on the clock.
export function formatLinkedSince(iso: string): string {
  const parts = iso.split("-");
  const year = parts[0];
  const monthIndex = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  const monthName = MONTH_NAMES[monthIndex] ?? parts[1];
  return `${monthName} ${day}, ${year}`;
}

export function formatCount(value: number): string {
  return value.toLocaleString("en-US");
}
