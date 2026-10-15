import {
  Activity,
  ArrowRightLeft,
  Cpu,
  Database,
  HardDrive,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import type { CategoryId } from "./data";

export const CATEGORY_ICON: Record<CategoryId, LucideIcon> = {
  compute: Cpu,
  storage: HardDrive,
  "data-transfer": ArrowRightLeft,
  databases: Database,
  observability: Activity,
  networking: ShieldCheck,
};
