// native/src/evolve/r23/a/components.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { tokens } from "../../../tokens";
import { ClaimRecord, formatDateIso, formatKrw } from "./data";

type Tone = "success" | "warning" | "neutral" | "danger";

function toneForStatus(status: ClaimRecord["status"]): Tone {
  if (status === "Approved") return "success";
  if (status === "Denied") return "danger";
  return "neutral"; // Submitted / pending review
}

const toneBg: Record<Tone, string> = {
  success: tokens.color.successBg,
  warning: tokens.color.warningBg,
  neutral: tokens.color.border,
  danger: tokens.color.dangerBg,
};

const toneText: Record<Tone, string> = {
  success: tokens.color.success,
  warning: tokens.color.warning,
  neutral: tokens.color.ink2,
  danger: tokens.color.danger,
};

export function StatusChip({ label, tone }: { label: string; tone: Tone }) {
  return (
    <View
      style={[styles.chip, { backgroundColor: toneBg[tone] }]}
      accessibilityLabel={`Status: ${label}`}
    >
      <Text style={[styles.chipText, { color: toneText[tone] }]}>{label}</Text>
    </View>
  );
}

export function ClaimRow({ claim }: { claim: ClaimRecord }) {
  const tone = toneForStatus(claim.status);
  return (
    <View style={styles.row}>
      <View style={styles.rowTop}>
        <Text style={styles.rowIssue}>{claim.issue}</Text>
        <StatusChip label={claim.status} tone={tone} />
      </View>
      <View style={styles.rowBottom}>
        <Text style={styles.rowMeta}>
          {claim.id} · Filed {formatDateIso(claim.dateFiled)}
        </Text>
        <Text style={styles.rowPayout}>
          {claim.payoutKrw !== null ? formatKrw(claim.payoutKrw) : "Pending review"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: tokens.space(2),
    paddingVertical: tokens.space(1),
    borderRadius: tokens.radius.sm,
  },
  chipText: {
    fontSize: 12,
    fontWeight: "700",
  },
  row: {
    paddingVertical: tokens.space(3),
  },
  rowTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: tokens.space(1),
    gap: tokens.space(2),
  },
  rowIssue: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: tokens.color.ink,
  },
  rowBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowMeta: {
    fontSize: 12,
    color: tokens.color.faint,
  },
  rowPayout: {
    fontSize: 13,
    fontWeight: "600",
    color: tokens.color.ink2,
    fontVariant: ["tabular-nums"],
  },
});
