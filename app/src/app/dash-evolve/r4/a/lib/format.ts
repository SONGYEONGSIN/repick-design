import { Issue, PRIORITY_RANK, SortKey } from "./data";

export const numberFormatter = new Intl.NumberFormat("en-US");

const MONTH_INDEX: Record<string, number> = {
  Jan: 0,
  Feb: 1,
  Mar: 2,
  Apr: 3,
  May: 4,
  Jun: 5,
  Jul: 6,
  Aug: 7,
  Sep: 8,
  Oct: 9,
  Nov: 10,
  Dec: 11,
};

// Parses static, pre-authored labels like "Jul 16, 8:30 AM" or "Jun 22" into a
// comparable integer. Pure string/number parsing — no Date object involved,
// so this stays fully deterministic across renders and servers.
export function labelToSortValue(label: string): number {
  const match = label.match(
    /^([A-Za-z]{3})\s+(\d{1,2})(?:,\s*(\d{1,2}):(\d{2})\s*(AM|PM))?/
  );
  if (!match) return 0;
  const month = MONTH_INDEX[match[1]] ?? 0;
  const day = parseInt(match[2], 10);
  let hour = match[3] ? parseInt(match[3], 10) : 0;
  const minute = match[4] ? parseInt(match[4], 10) : 0;
  const meridiem = match[5];
  if (meridiem === "PM" && hour !== 12) hour += 12;
  if (meridiem === "AM" && hour === 12) hour = 0;
  return ((month * 31 + day) * 24 + hour) * 60 + minute;
}

export function idToSortValue(id: string): number {
  const match = id.match(/(\d+)$/);
  return match ? parseInt(match[1], 10) : 0;
}

export function compareIssues(a: Issue, b: Issue, key: SortKey, dir: "asc" | "desc"): number {
  let result = 0;
  switch (key) {
    case "priority":
      result = PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
      break;
    case "created":
      result = labelToSortValue(a.createdLabel) - labelToSortValue(b.createdLabel);
      break;
    case "id":
      result = idToSortValue(a.id) - idToSortValue(b.id);
      break;
    case "updated":
    default:
      result = labelToSortValue(a.updatedLabel) - labelToSortValue(b.updatedLabel);
      break;
  }
  return dir === "asc" ? result : -result;
}
