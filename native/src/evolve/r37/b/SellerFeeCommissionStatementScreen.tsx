// native/src/evolve/r37/b/SellerFeeCommissionStatementScreen.tsx
//
// Seller Fee & Commission Statement — a read-only record, not a workflow.
// A segmented period selector (This Week / This Month / This Quarter) drives
// which fixed set of completed sales is shown and totaled; nothing here is
// blocked or pending, so there is no bottom band, no confirmation, and no
// state machine. The one interaction beyond the selector is per-sale
// disclosure: each row stays collapsed to its headline numbers until tapped,
// then opens to its own commission / processing-fee / promo-credit / net
// breakdown — the statement reads like a receipt stack, not a flat ledger.

import React, { useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { tokens } from "../../../tokens";
import {
  periodOptions,
  salesByPeriod,
  computeFeeBreakdown,
  sumNetPayout,
  sumGross,
  formatKRW,
  type PeriodKey,
  type FeeSaleRecord,
} from "./data";

export function SellerFeeCommissionStatementScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodKey>("week");
  const [expandedIds, setExpandedIds] = useState<ReadonlySet<string>>(
    () => new Set()
  );

  const salesForPeriod = salesByPeriod[selectedPeriod];
  const periodLabel =
    periodOptions.find((option) => option.key === selectedPeriod)?.label ??
    "";

  const totalNetPayout = useMemo(
    () => sumNetPayout(salesForPeriod),
    [salesForPeriod]
  );
  const totalGross = useMemo(() => sumGross(salesForPeriod), [salesForPeriod]);

  const handleSelectPeriod = useCallback((key: PeriodKey) => {
    setSelectedPeriod(key);
    // Collapsed state is per-row-id; starting clean on a new period keeps a
    // row from reopening "pre-expanded" just because an id happened to
    // repeat across periods (e.g. a sale shared by week and month).
    setExpandedIds(new Set());
  }, []);

  const toggleExpanded = useCallback((id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const renderSaleRow = useCallback(
    ({ item }: { item: FeeSaleRecord }) => {
      const breakdown = computeFeeBreakdown(item);
      const isExpanded = expandedIds.has(item.id);
      return (
        <View style={styles.saleCard}>
          <Pressable
            onPress={() => toggleExpanded(item.id)}
            accessibilityRole="button"
            accessibilityState={{ expanded: isExpanded }}
            accessibilityLabel={`${item.itemTitle}, order ${item.orderId}, sold ${item.saleDateLabel}, net payout ${formatKRW(breakdown.netPayoutAmount)}`}
            accessibilityHint={
              isExpanded
                ? "Hides the commission and fee breakdown for this sale."
                : "Shows the commission and fee breakdown for this sale."
            }
            style={({ pressed }) => [
              styles.saleRowHeader,
              pressed && styles.saleRowHeaderPressed,
            ]}
          >
            <View style={styles.saleRowTopLine}>
              <Text style={styles.saleItemTitle} numberOfLines={1}>
                {item.itemTitle}
              </Text>
              <Text
                style={styles.saleDisclosureGlyph}
                accessibilityElementsHidden
                importantForAccessibility="no-hide-descendants"
              >
                {isExpanded ? "▾" : "▸"}
              </Text>
            </View>
            <Text style={styles.saleMetaLine}>
              {item.orderId} · {item.saleDateLabel}
            </Text>
            <View style={styles.saleRowAmountLine}>
              <Text style={styles.saleGrossLabel}>
                Gross {formatKRW(breakdown.grossSaleAmount)}
              </Text>
              <Text style={styles.saleNetAmount}>
                {formatKRW(breakdown.netPayoutAmount)}
              </Text>
            </View>
          </Pressable>

          {isExpanded ? (
            <View style={styles.breakdownPanel}>
              <View style={styles.breakdownLine}>
                <Text style={styles.breakdownLabel}>Gross sale price</Text>
                <Text style={styles.breakdownValue}>
                  {formatKRW(breakdown.grossSaleAmount)}
                </Text>
              </View>
              <View style={styles.breakdownLine}>
                <Text style={styles.breakdownLabel}>
                  Marketplace commission ({item.commissionRatePercent}%)
                </Text>
                <Text style={styles.breakdownValueNegative}>
                  -{formatKRW(breakdown.commissionAmount)}
                </Text>
              </View>
              <View style={styles.breakdownLine}>
                <Text style={styles.breakdownLabel}>
                  Payment processing fee ({item.processingFeeRatePercent}% +{" "}
                  {formatKRW(item.processingFeeFixedAmount)})
                </Text>
                <Text style={styles.breakdownValueNegative}>
                  -{formatKRW(breakdown.processingFeeAmount)}
                </Text>
              </View>
              {breakdown.promoCreditAmount > 0 ? (
                <View style={styles.breakdownLine}>
                  <Text style={styles.breakdownLabel}>
                    Promo credit applied
                  </Text>
                  <Text style={styles.breakdownValuePositive}>
                    +{formatKRW(breakdown.promoCreditAmount)}
                  </Text>
                </View>
              ) : null}
              <View style={styles.breakdownDivider} />
              <View style={styles.breakdownLine}>
                <Text style={styles.breakdownNetLabel}>Net payout</Text>
                <Text style={styles.breakdownNetValue}>
                  {formatKRW(breakdown.netPayoutAmount)}
                </Text>
              </View>
            </View>
          ) : null}
        </View>
      );
    },
    [expandedIds, toggleExpanded]
  );

  const listHeader = (
    <View style={styles.headerBlock}>
      <Text accessibilityRole="header" style={styles.screenTitle}>
        Fee & Commission Statement
      </Text>
      <Text style={styles.screenSubtitle}>
        A line-by-line record of marketplace commission, payment-processing
        fees, and promo credit for your completed sales.
      </Text>

      <View style={styles.segmentedTrack} accessibilityRole="tablist">
        {periodOptions.map((option) => {
          const selected = option.key === selectedPeriod;
          return (
            <Pressable
              key={option.key}
              onPress={() => handleSelectPeriod(option.key)}
              accessibilityRole="tab"
              accessibilityState={{ selected }}
              accessibilityLabel={option.label}
              style={({ pressed }) => [
                styles.segmentButton,
                selected && styles.segmentButtonSelected,
                pressed && !selected && styles.segmentButtonPressed,
              ]}
            >
              <Text
                style={[
                  styles.segmentButtonLabel,
                  selected && styles.segmentButtonLabelSelected,
                ]}
              >
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View
        style={styles.summaryCard}
        accessibilityRole="summary"
        accessibilityLabel={`${periodLabel}: ${salesForPeriod.length} completed ${salesForPeriod.length === 1 ? "sale" : "sales"}, net payout total ${formatKRW(totalNetPayout)}`}
      >
        <Text style={styles.summaryPeriodLabel}>{periodLabel.toUpperCase()}</Text>
        <Text style={styles.summaryTotalValue}>{formatKRW(totalNetPayout)}</Text>
        <Text style={styles.summaryCaption}>
          Net payout across {salesForPeriod.length} completed{" "}
          {salesForPeriod.length === 1 ? "sale" : "sales"} ·{" "}
          {formatKRW(totalGross)} gross
        </Text>
      </View>

      <Text style={styles.listSectionLabel} accessibilityRole="header">
        Completed sales
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.screenRoot}>
      <FlatList
        data={salesForPeriod}
        keyExtractor={(item) => item.id}
        renderItem={renderSaleRow}
        ListHeaderComponent={listHeader}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screenRoot: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  listContent: {
    paddingHorizontal: tokens.space(4),
    paddingBottom: tokens.space(8),
  },
  headerBlock: {
    paddingTop: tokens.space(3),
    paddingBottom: tokens.space(1),
  },
  screenTitle: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: "700",
    color: tokens.color.ink,
    marginBottom: tokens.space(2),
  },
  screenSubtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: tokens.color.muted,
    marginBottom: tokens.space(4),
  },
  segmentedTrack: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(1),
    marginBottom: tokens.space(4),
  },
  segmentButton: {
    flex: 1,
    minHeight: 40,
    borderRadius: tokens.radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  segmentButtonPressed: {
    backgroundColor: tokens.color.accentBg,
  },
  segmentButtonSelected: {
    backgroundColor: tokens.color.accent,
  },
  segmentButtonLabel: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600",
    color: tokens.color.muted,
  },
  segmentButtonLabelSelected: {
    color: tokens.color.onAccent,
  },
  summaryCard: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(4),
    marginBottom: tokens.space(4),
    backgroundColor: tokens.color.bg,
  },
  summaryPeriodLabel: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "700",
    letterSpacing: 0.6,
    color: tokens.color.faint,
    marginBottom: tokens.space(1),
  },
  summaryTotalValue: {
    fontSize: 30,
    lineHeight: 38,
    fontWeight: "800",
    color: tokens.color.ink,
    fontVariant: ["tabular-nums"],
    marginBottom: tokens.space(1),
  },
  summaryCaption: {
    fontSize: 13,
    lineHeight: 19,
    color: tokens.color.muted,
    fontVariant: ["tabular-nums"],
  },
  listSectionLabel: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
    color: tokens.color.ink,
    marginBottom: tokens.space(2),
  },
  saleCard: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    marginBottom: tokens.space(3),
    backgroundColor: tokens.color.bg,
    overflow: "hidden",
  },
  saleRowHeader: {
    minHeight: 44,
    padding: tokens.space(4),
  },
  saleRowHeaderPressed: {
    backgroundColor: tokens.color.accentBg,
  },
  saleRowTopLine: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: tokens.space(1),
  },
  saleItemTitle: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
    color: tokens.color.ink,
    marginRight: tokens.space(2),
  },
  saleDisclosureGlyph: {
    fontSize: 16,
    lineHeight: 16,
    color: tokens.color.faint,
  },
  saleMetaLine: {
    fontSize: 13,
    lineHeight: 19,
    color: tokens.color.faint,
    marginBottom: tokens.space(2),
  },
  saleRowAmountLine: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
  },
  saleGrossLabel: {
    fontSize: 13,
    lineHeight: 19,
    color: tokens.color.muted,
    fontVariant: ["tabular-nums"],
  },
  saleNetAmount: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "700",
    color: tokens.color.ink,
    fontVariant: ["tabular-nums"],
  },
  breakdownPanel: {
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    paddingHorizontal: tokens.space(4),
    paddingVertical: tokens.space(3),
    backgroundColor: tokens.color.bg,
  },
  breakdownLine: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: tokens.space(2),
  },
  breakdownLabel: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
    color: tokens.color.muted,
    marginRight: tokens.space(2),
  },
  breakdownValue: {
    fontSize: 13,
    lineHeight: 19,
    color: tokens.color.ink,
    fontVariant: ["tabular-nums"],
  },
  breakdownValueNegative: {
    fontSize: 13,
    lineHeight: 19,
    color: tokens.color.danger,
    fontVariant: ["tabular-nums"],
  },
  breakdownValuePositive: {
    fontSize: 13,
    lineHeight: 19,
    color: tokens.color.success,
    fontVariant: ["tabular-nums"],
  },
  breakdownDivider: {
    height: 1,
    backgroundColor: tokens.color.border,
    marginBottom: tokens.space(2),
  },
  breakdownNetLabel: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  breakdownNetValue: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "700",
    color: tokens.color.ink,
    fontVariant: ["tabular-nums"],
  },
});

export default SellerFeeCommissionStatementScreen;
