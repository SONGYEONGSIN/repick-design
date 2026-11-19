// native/src/evolve/r59/a/BulkDiscountCampaignScreen.tsx
//
// Bulk Discount Campaign — a seller multi-selects any number of their
// active listings with per-row checkboxes, dials one shared discount
// percentage with a bounded +/- stepper (no drag gesture, so it stays
// keyboard/switch-control operable), and sees every selected row's new
// price recompute live. A selection-count-derived contextual bar appears
// once 1+ rows are checked, stating both the count and the real total
// dollar amount that discount would save right now; pressing its action
// commits the campaign into a local "applied" confirmation state.
//
// State model (three independent pieces, nothing duplicated):
//   - selectedIds: Set<string> of checked listing ids. `selectedCount` is
//     read straight off its size every render, never tracked as a
//     separate boolean — this is what makes the contextual bar a
//     selection-count-derived form rather than a toggle.
//   - discountPercent: the one shared stepper value (5% steps, 0-50%)
//     every selected row's live preview and the bar's total-savings line
//     both recompute from, so the bar can never show a number the rows
//     don't individually back up.
//   - phase: "building" | "applied" — the single step transition on this
//     screen. Applying never clears selectedIds (rows stay visible and
//     lock in place with an "In campaign" tag); "Done" on the
//     confirmation resets all three pieces for a fresh campaign.
//
// Accessibility: one `accessibilityLiveRegion="polite"` container
// (`statusRegion`) is mounted unconditionally for the life of the screen.
// Only its *children* swap between nothing / the selection bar / the
// confirmation panel, so the count updating, the bar first appearing, and
// the apply transition are all read by assistive tech as updates to an
// existing region, never as a freshly-inserted node. Exactly one
// `accessibilityRole="alert"` text is ever present inside it at a time.

import React, { useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  SafeAreaView,
  StyleSheet,
  ListRenderItemInfo,
} from "react-native";
import { tokens } from "../../../tokens";
import {
  CAMPAIGN_LISTINGS,
  CampaignListing,
  DISCOUNT_STEP_PERCENT,
  DISCOUNT_MIN_PERCENT,
  DISCOUNT_MAX_PERCENT,
  DEFAULT_DISCOUNT_PERCENT,
  discountedPriceCents,
  formatWholeDollars,
} from "./data";
import { CampaignListingRow } from "./CampaignListingRow";

type CampaignPhase = "building" | "applied";

interface AppliedSnapshot {
  count: number;
  totalSavedCents: number;
  percent: number;
}

export default function BulkDiscountCampaignScreen() {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [discountPercent, setDiscountPercent] = useState<number>(DEFAULT_DISCOUNT_PERCENT);
  const [phase, setPhase] = useState<CampaignPhase>("building");
  const [appliedSnapshot, setAppliedSnapshot] = useState<AppliedSnapshot | null>(null);

  const isBuilding = phase === "building";
  const selectedCount = selectedIds.size;

  const totalSavedCents = useMemo(() => {
    let sum = 0;
    for (const listing of CAMPAIGN_LISTINGS) {
      if (!selectedIds.has(listing.id)) continue;
      sum += listing.priceCents - discountedPriceCents(listing.priceCents, discountPercent);
    }
    return sum;
  }, [selectedIds, discountPercent]);

  const toggleListing = useCallback(
    (id: string) => {
      if (!isBuilding) return;
      setSelectedIds((current) => {
        const next = new Set(current);
        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
        }
        return next;
      });
    },
    [isBuilding]
  );

  const decrementDiscount = useCallback(() => {
    if (!isBuilding) return;
    setDiscountPercent((current) => Math.max(DISCOUNT_MIN_PERCENT, current - DISCOUNT_STEP_PERCENT));
  }, [isBuilding]);

  const incrementDiscount = useCallback(() => {
    if (!isBuilding) return;
    setDiscountPercent((current) => Math.min(DISCOUNT_MAX_PERCENT, current + DISCOUNT_STEP_PERCENT));
  }, [isBuilding]);

  const applyCampaign = useCallback(() => {
    if (!isBuilding || selectedCount === 0) return;
    setAppliedSnapshot({ count: selectedCount, totalSavedCents, percent: discountPercent });
    setPhase("applied");
  }, [isBuilding, selectedCount, totalSavedCents, discountPercent]);

  const startNewCampaign = useCallback(() => {
    setPhase("building");
    setSelectedIds(new Set());
    setDiscountPercent(DEFAULT_DISCOUNT_PERCENT);
    setAppliedSnapshot(null);
  }, []);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<CampaignListing>) => (
      <CampaignListingRow
        listing={item}
        isSelected={selectedIds.has(item.id)}
        discountPercent={discountPercent}
        locked={phase === "applied"}
        onToggle={toggleListing}
      />
    ),
    [selectedIds, discountPercent, phase, toggleListing]
  );

  const atMinDiscount = discountPercent <= DISCOUNT_MIN_PERCENT;
  const atMaxDiscount = discountPercent >= DISCOUNT_MAX_PERCENT;
  const showSelectionPanel = isBuilding && selectedCount > 0;
  const showConfirmationPanel = phase === "applied" && appliedSnapshot !== null;
  const reserveBottomSpace = showSelectionPanel || showConfirmationPanel;

  return (
    <SafeAreaView style={styles.campaignScreen}>
      <View style={styles.campaignHeader}>
        <Text style={styles.campaignHeaderTitle} accessibilityRole="header">
          Bulk Discount Campaign
        </Text>
        <Text style={styles.campaignHeaderSubtitle}>
          Check the listings to include, set one discount, then apply it everywhere at once.
        </Text>
      </View>

      <View style={styles.discountPanel}>
        <Text style={styles.discountPanelLabel}>Campaign discount</Text>
        <View style={styles.discountStepperRow}>
          <Pressable
            disabled={!isBuilding || atMinDiscount}
            onPress={decrementDiscount}
            accessibilityRole="button"
            accessibilityLabel={`Decrease campaign discount by ${DISCOUNT_STEP_PERCENT} percent`}
            accessibilityState={{ disabled: !isBuilding || atMinDiscount }}
            style={[styles.stepperButton, (!isBuilding || atMinDiscount) ? styles.stepperButtonDisabled : null]}
          >
            <Text style={styles.stepperGlyph}>{"−"}</Text>
          </Pressable>

          <Text style={styles.discountValueText}>{`${discountPercent}%`}</Text>

          <Pressable
            disabled={!isBuilding || atMaxDiscount}
            onPress={incrementDiscount}
            accessibilityRole="button"
            accessibilityLabel={`Increase campaign discount by ${DISCOUNT_STEP_PERCENT} percent`}
            accessibilityState={{ disabled: !isBuilding || atMaxDiscount }}
            style={[styles.stepperButton, (!isBuilding || atMaxDiscount) ? styles.stepperButtonDisabled : null]}
          >
            <Text style={styles.stepperGlyph}>{"+"}</Text>
          </Pressable>
        </View>
        <Text style={styles.discountPanelHint}>
          {`Steps of ${DISCOUNT_STEP_PERCENT} points, ${DISCOUNT_MIN_PERCENT}-${DISCOUNT_MAX_PERCENT}% — applies to every checked listing below.`}
        </Text>
      </View>

      <FlatList
        data={CAMPAIGN_LISTINGS}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.rowSeparator} />}
        contentContainerStyle={[styles.listContent, reserveBottomSpace ? styles.listContentReserved : null]}
      />

      <View style={styles.statusRegion} accessibilityLiveRegion="polite">
        {showConfirmationPanel && appliedSnapshot ? (
          <View style={styles.confirmationPanel}>
            <Text style={styles.confirmationText} accessibilityRole="alert">
              {`Campaign applied to ${appliedSnapshot.count} listing${
                appliedSnapshot.count === 1 ? "" : "s"
              } at ${appliedSnapshot.percent}% off — total savings ${formatWholeDollars(
                appliedSnapshot.totalSavedCents
              )}.`}
            </Text>
            <Pressable
              onPress={startNewCampaign}
              accessibilityRole="button"
              accessibilityLabel="Start a new discount campaign and clear this one"
              style={styles.confirmationDoneButton}
            >
              <Text style={styles.confirmationDoneText}>Start New Campaign</Text>
            </Pressable>
          </View>
        ) : showSelectionPanel ? (
          <View style={styles.selectionPanel}>
            <Text style={styles.selectionSummaryText} accessibilityRole="alert">
              {`${selectedCount} listing${selectedCount === 1 ? "" : "s"} selected — save ${formatWholeDollars(
                totalSavedCents
              )} total at ${discountPercent}% off.`}
            </Text>
            <Pressable
              onPress={applyCampaign}
              accessibilityRole="button"
              accessibilityLabel={`Apply ${discountPercent} percent discount to ${selectedCount} selected listings, saving ${formatWholeDollars(
                totalSavedCents
              )} total`}
              style={styles.applyCampaignButton}
            >
              <Text style={styles.applyCampaignButtonText}>Apply Campaign</Text>
            </Pressable>
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  campaignScreen: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  campaignHeader: {
    paddingHorizontal: tokens.space(4),
    paddingTop: tokens.space(4),
    paddingBottom: tokens.space(2),
  },
  campaignHeaderTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  campaignHeaderSubtitle: {
    marginTop: tokens.space(1),
    fontSize: 13,
    color: tokens.color.muted,
  },
  discountPanel: {
    marginHorizontal: tokens.space(4),
    marginBottom: tokens.space(3),
    padding: tokens.space(3),
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
  },
  discountPanelLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: tokens.color.faint,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  discountStepperRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: tokens.space(2),
    gap: tokens.space(4),
  },
  stepperButton: {
    width: tokens.space(11),
    height: tokens.space(11),
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  stepperButtonDisabled: {
    borderColor: tokens.color.border,
  },
  stepperGlyph: {
    fontSize: 20,
    fontWeight: "700",
    color: tokens.color.accent,
  },
  discountValueText: {
    minWidth: tokens.space(14),
    textAlign: "center",
    fontSize: 24,
    fontWeight: "700",
    color: tokens.color.ink,
    fontVariant: ["tabular-nums"],
  },
  discountPanelHint: {
    marginTop: tokens.space(2),
    fontSize: 11,
    color: tokens.color.faint,
    textAlign: "center",
  },
  listContent: {
    paddingBottom: tokens.space(6),
  },
  listContentReserved: {
    paddingBottom: tokens.space(34),
  },
  rowSeparator: {
    height: 1,
    marginLeft: tokens.space(4),
    backgroundColor: tokens.color.border,
  },
  statusRegion: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
  selectionPanel: {
    backgroundColor: tokens.color.ink,
    borderTopLeftRadius: tokens.radius.md,
    borderTopRightRadius: tokens.radius.md,
    paddingHorizontal: tokens.space(4),
    paddingTop: tokens.space(3),
    paddingBottom: tokens.space(5),
  },
  selectionSummaryText: {
    fontSize: 14,
    fontWeight: "600",
    color: tokens.color.onInk,
    fontVariant: ["tabular-nums"],
  },
  applyCampaignButton: {
    marginTop: tokens.space(3),
    backgroundColor: tokens.color.accent,
    borderRadius: tokens.radius.sm,
    paddingVertical: tokens.space(3),
    alignItems: "center",
  },
  applyCampaignButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.onAccent,
  },
  confirmationPanel: {
    backgroundColor: tokens.color.successBg,
    borderTopWidth: 1,
    borderColor: tokens.color.successBorder,
    paddingHorizontal: tokens.space(4),
    paddingTop: tokens.space(3),
    paddingBottom: tokens.space(5),
  },
  confirmationText: {
    fontSize: 14,
    fontWeight: "600",
    color: tokens.color.success,
    fontVariant: ["tabular-nums"],
  },
  confirmationDoneButton: {
    marginTop: tokens.space(3),
    borderWidth: 1,
    borderColor: tokens.color.success,
    borderRadius: tokens.radius.sm,
    paddingVertical: tokens.space(2),
    alignItems: "center",
  },
  confirmationDoneText: {
    fontSize: 13,
    fontWeight: "700",
    color: tokens.color.success,
  },
});
