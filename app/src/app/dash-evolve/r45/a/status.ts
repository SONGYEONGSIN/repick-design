import { RISK_FLAG_THRESHOLD, type Period, type Vendor } from "./data";

export type VendorStatus = "stable" | "at-risk";

/** Single shared threshold so the table's status column, the KPI "flagged" count, and the
 *  comparison panel's headline all agree on exactly which vendors count as at-risk. */
export function statusFor(vendor: Vendor, period: Period): VendorStatus {
  return vendor.metrics[period].riskScore >= RISK_FLAG_THRESHOLD ? "at-risk" : "stable";
}
