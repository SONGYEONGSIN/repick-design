import type { LucideIcon } from "lucide-react";
import { BarChart3, ClipboardList, Home, LayoutGrid, Layers, Plug, Users } from "lucide-react";

export const BRAND = { name: "Strata", Icon: Layers };

export const WORKSPACES = [
  { id: "hq", name: "Northwind Inc. — HQ", plan: "Finance workspace" },
  { id: "eu", name: "Northwind Inc. — EU", plan: "Finance workspace" },
];

export const CURRENT_USER = { name: "Priya Chen", role: "FP&A Lead", email: "priya.chen@northwind.example" };

export type NavItem = { id: string; label: string; Icon: LucideIcon; active?: boolean; disabled?: boolean };

export const NAV_SECTIONS: { id: string; title: string; items: NavItem[] }[] = [
  {
    id: "plan",
    title: "Plan",
    items: [
      { id: "overview", label: "Overview", Icon: Home },
      { id: "allocation", label: "Allocation Treemap", Icon: LayoutGrid, active: true },
      { id: "headcount", label: "Headcount", Icon: Users },
    ],
  },
  {
    id: "operate",
    title: "Operate",
    items: [
      { id: "requests", label: "Budget Requests", Icon: ClipboardList },
      { id: "reports", label: "Reports", Icon: BarChart3 },
      { id: "integrations", label: "Integrations", Icon: Plug, disabled: true },
    ],
  },
];

export type SearchEntryKind = "department" | "costType" | "lineItem";

export type SearchEntry = {
  id: string;
  kind: SearchEntryKind;
  title: string;
  meta: string;
  Icon: LucideIcon;
};
