// native/src/evolve/r45/c/components.tsx
//
// Presentational pieces for the Negotiation History ledger: a status
// badge (color + text label, never color-only), one read-only ledger row,
// and the always-visible bottom action bar.
import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { tokens } from "../../../tokens";
import type { NegotiationRecord, NegotiationStatus } from "./data";

interface StatusMeta {
  label: string;
  bg: string;
  border: string;
  text: string;
}

// Status → token-based color family. "declined" and "expired"/
// "countered-then-expired" intentionally share a color family (danger /
// warning respectively) with "withdrawn" sharing the neutral family —
// each is still disambiguated by its own text label, never by color alone.
const STATUS_META: Record<NegotiationStatus, StatusMeta> = {
  accepted: {
    label: "Accepted",
    bg: tokens.color.successBg,
    border: tokens.color.successBorder,
    text: tokens.color.success,
  },
  declined: {
    label: "Declined",
    bg: tokens.color.dangerBg,
    border: tokens.color.dangerBorder,
    text: tokens.color.danger,
  },
  expired: {
    label: "Expired",
    bg: tokens.color.warningBg,
    border: tokens.color.warningBorder,
    text: tokens.color.warning,
  },
  withdrawn: {
    label: "Withdrawn",
    bg: tokens.color.bg,
    border: tokens.color.border,
    text: tokens.color.muted,
  },
  "countered-then-expired": {
    label: "Countered, then expired",
    bg: tokens.color.warningBg,
    border: tokens.color.warningBorder,
    text: tokens.color.warning,
  },
};

export function StatusBadge({ status }: { status: NegotiationStatus }) {
  const meta = STATUS_META[status];
  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: meta.bg, borderColor: meta.border },
      ]}
    >
      <Text style={[styles.badgeText, { color: meta.text }]}>{meta.label}</Text>
    </View>
  );
}

function formatUsd(amount: number): string {
  return `$${amount.toLocaleString()}`;
}

export function NegotiationRow({ item }: { item: NegotiationRecord }) {
  return (
    <View style={styles.row}>
      <View style={styles.rowTop}>
        <Text style={styles.itemName}>{item.itemName}</Text>
        <StatusBadge status={item.status} />
      </View>

      <View style={styles.amountsBlock}>
        <Text style={styles.amountLine}>
          {"Your offer: "}
          <Text style={[styles.amountValue, styles.tabularNums]}>
            {formatUsd(item.yourOffer)}
          </Text>
        </Text>

        {item.sellerCounter !== null ? (
          <Text style={styles.amountLine}>
            {"Seller countered: "}
            <Text style={[styles.amountValue, styles.tabularNums]}>
              {formatUsd(item.sellerCounter)}
            </Text>
          </Text>
        ) : (
          <Text style={styles.amountLineMuted}>No counteroffer from seller</Text>
        )}

        {item.finalAmount !== null ? (
          <Text style={styles.amountLine}>
            {"Final price: "}
            <Text style={[styles.amountValueAccent, styles.tabularNums]}>
              {formatUsd(item.finalAmount)}
            </Text>
          </Text>
        ) : null}
      </View>

      <Text style={styles.dateLine}>
        {`Offered ${item.offerDateLabel} · Resolved ${item.resolvedDateLabel}`}
      </Text>
    </View>
  );
}

export type SortMode = "recent" | "highestOffer";

interface ActionBarProps {
  sortMode: SortMode;
  onToggleSort: () => void;
}

export function ActionBar({ sortMode, onToggleSort }: ActionBarProps) {
  const isRecent = sortMode === "recent";
  const nextLabel = isRecent ? "Highest offer first" : "Most recent first";
  const currentLabel = isRecent ? "Most recent first" : "Highest offer first";

  return (
    <View style={styles.actionBar}>
      <View style={styles.actionBarTextBlock}>
        <Text style={styles.actionBarCaption}>Sorted by</Text>
        <Text style={styles.actionBarValue}>{currentLabel}</Text>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Sort order: ${currentLabel}`}
        accessibilityHint={`Switches the list to show ${nextLabel.toLowerCase()}.`}
        hitSlop={8}
        onPress={onToggleSort}
        style={({ pressed }) => [
          styles.actionBarButton,
          pressed && styles.actionBarButtonPressed,
        ]}
      >
        <Text style={styles.actionBarButtonText}>{`Switch to: ${nextLabel}`}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(4),
    marginBottom: tokens.space(3),
    backgroundColor: tokens.color.bg,
  },
  rowTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: tokens.space(2),
    gap: tokens.space(2),
  },
  itemName: {
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  badge: {
    borderWidth: 1,
    borderRadius: tokens.radius.sm,
    paddingHorizontal: tokens.space(2),
    paddingVertical: tokens.space(1),
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "700",
  },
  amountsBlock: {
    marginBottom: tokens.space(2),
  },
  amountLine: {
    fontSize: 13,
    color: tokens.color.muted,
    marginBottom: tokens.space(1) / 2,
  },
  amountLineMuted: {
    fontSize: 13,
    color: tokens.color.faint,
    marginBottom: tokens.space(1) / 2,
  },
  amountValue: {
    fontSize: 13,
    fontWeight: "700",
    color: tokens.color.ink2,
  },
  amountValueAccent: {
    fontSize: 13,
    fontWeight: "700",
    color: tokens.color.accent,
  },
  tabularNums: {
    fontVariant: ["tabular-nums"],
  },
  dateLine: {
    fontSize: 12,
    color: tokens.color.faint,
  },
  actionBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    paddingHorizontal: tokens.space(4),
    paddingVertical: tokens.space(3),
    gap: tokens.space(3),
  },
  actionBarTextBlock: {
    flexShrink: 1,
  },
  actionBarCaption: {
    fontSize: 11,
    color: tokens.color.faint,
    marginBottom: tokens.space(1) / 2,
  },
  actionBarValue: {
    fontSize: 13,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  actionBarButton: {
    minHeight: 44,
    minWidth: 44,
    paddingHorizontal: tokens.space(4),
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.color.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  actionBarButtonPressed: {
    opacity: 0.85,
  },
  actionBarButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: tokens.color.onAccent,
  },
});
