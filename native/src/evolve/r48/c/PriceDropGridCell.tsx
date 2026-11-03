// native/src/evolve/r48/c/PriceDropGridCell.tsx
// A single grid cell for the Bulk Price Drop screen. Renders one of three
// mutually exclusive visual states for a listing:
//
//   1. default      — not selected, not discounted
//   2. pending       — selected, awaiting a discount (border + check overlay)
//   3. applied       — a discount has been applied: struck-through old price
//                      next to the new price, plus an Undo affordance that
//                      can itself be confirmed or cancelled in place.
//
// "applied" is a persistent third state, not a disappearance of the cell —
// once a discount lands the cell keeps rendering, just with different data.

import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { tokens } from "../../../tokens";
import { ActiveListing, formatCents } from "./data";

export interface AppliedDiscount {
  percentOff: number;
  newPriceCents: number;
}

interface PriceDropGridCellProps {
  listing: ActiveListing;
  isSelected: boolean;
  appliedDiscount: AppliedDiscount | null;
  isRevertPending: boolean;
  onToggleSelected: () => void;
  onRequestRevert: () => void;
  onCancelRevert: () => void;
  onConfirmRevert: () => void;
}

export function PriceDropGridCell(props: PriceDropGridCellProps) {
  const {
    listing,
    isSelected,
    appliedDiscount,
    isRevertPending,
    onToggleSelected,
    onRequestRevert,
    onCancelRevert,
    onConfirmRevert,
  } = props;

  const swatchColor = tokens.color[listing.swatch];

  if (appliedDiscount) {
    return (
      <View style={[styles.cell, styles.cellApplied]}>
        <View style={[styles.thumbnail, { backgroundColor: swatchColor }]} />
        <Text style={styles.titleText} numberOfLines={2}>
          {listing.title}
        </Text>

        <View style={styles.priceRow}>
          <Text style={styles.oldPriceText}>
            {formatCents(listing.originalPriceCents)}
          </Text>
          <Text style={styles.newPriceText}>
            {formatCents(appliedDiscount.newPriceCents)}
          </Text>
        </View>

        <View style={styles.appliedBadge}>
          <Text style={styles.appliedBadgeText}>
            {`-${appliedDiscount.percentOff}% applied`}
          </Text>
        </View>

        {isRevertPending ? (
          <View style={styles.revertConfirmRow}>
            <Pressable
              style={styles.revertConfirmButton}
              accessibilityRole="button"
              accessibilityLabel={`Confirm reverting ${listing.title} to its original price of ${formatCents(
                listing.originalPriceCents
              )}`}
              onPress={onConfirmRevert}
            >
              <Text style={styles.revertConfirmText}>Confirm revert?</Text>
            </Pressable>
            <Pressable
              style={styles.revertCancelButton}
              accessibilityRole="button"
              accessibilityLabel={`Cancel, keep the discount on ${listing.title}`}
              onPress={onCancelRevert}
            >
              <Text style={styles.revertCancelText}>Cancel</Text>
            </Pressable>
          </View>
        ) : (
          <Pressable
            style={styles.undoButton}
            accessibilityRole="button"
            accessibilityLabel={`Undo discount on ${listing.title}`}
            onPress={onRequestRevert}
          >
            <Text style={styles.undoButtonText}>Undo</Text>
          </Pressable>
        )}
      </View>
    );
  }

  return (
    <Pressable
      style={[styles.cell, isSelected ? styles.cellSelected : null]}
      accessibilityRole="button"
      accessibilityLabel={`${listing.title}, ${formatCents(
        listing.originalPriceCents
      )}, ${isSelected ? "selected" : "not selected"}`}
      onPress={onToggleSelected}
    >
      <View style={styles.thumbnailWrap}>
        <View style={[styles.thumbnail, { backgroundColor: swatchColor }]} />
        {isSelected ? (
          <View style={styles.selectedScrim}>
            <View style={styles.checkCircle}>
              <Text style={styles.checkGlyph}>{"✓"}</Text>
            </View>
          </View>
        ) : null}
      </View>
      <Text style={styles.titleText} numberOfLines={2}>
        {listing.title}
      </Text>
      <Text style={styles.priceText}>
        {formatCents(listing.originalPriceCents)}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cell: {
    flex: 1,
    backgroundColor: tokens.color.bg,
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(2),
  },
  cellSelected: {
    borderColor: tokens.color.accent,
    borderWidth: 2,
    backgroundColor: tokens.color.accentBg,
  },
  cellApplied: {
    borderColor: tokens.color.successBorder,
  },
  thumbnailWrap: {
    position: "relative",
    borderRadius: tokens.radius.sm,
    overflow: "hidden",
  },
  thumbnail: {
    width: "100%",
    height: tokens.space(24),
    borderRadius: tokens.radius.sm,
  },
  selectedScrim: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: tokens.color.scrimDark,
    alignItems: "flex-end",
    justifyContent: "flex-start",
    padding: tokens.space(1),
  },
  checkCircle: {
    width: tokens.space(6),
    height: tokens.space(6),
    borderRadius: tokens.space(3),
    backgroundColor: tokens.color.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  checkGlyph: {
    color: tokens.color.onAccent,
    fontSize: 14,
    fontWeight: "700",
  },
  titleText: {
    marginTop: tokens.space(2),
    fontSize: 13,
    fontWeight: "600",
    color: tokens.color.ink,
  },
  priceText: {
    marginTop: tokens.space(1),
    fontSize: 13,
    color: tokens.color.muted,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: tokens.space(1),
    gap: tokens.space(1),
  },
  oldPriceText: {
    fontSize: 12,
    color: tokens.color.faint,
    textDecorationLine: "line-through",
  },
  newPriceText: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.success,
  },
  appliedBadge: {
    alignSelf: "flex-start",
    marginTop: tokens.space(1),
    backgroundColor: tokens.color.successBg,
    borderWidth: 1,
    borderColor: tokens.color.successBorder,
    borderRadius: tokens.radius.sm,
    paddingHorizontal: tokens.space(2),
    paddingVertical: tokens.space(1) / 2,
  },
  appliedBadgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: tokens.color.success,
  },
  undoButton: {
    marginTop: tokens.space(2),
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.sm,
    paddingHorizontal: tokens.space(3),
    paddingVertical: tokens.space(1),
  },
  undoButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: tokens.color.ink2,
  },
  revertConfirmRow: {
    marginTop: tokens.space(2),
    flexDirection: "row",
    gap: tokens.space(2),
  },
  revertConfirmButton: {
    flex: 1,
    backgroundColor: tokens.color.dangerBg,
    borderWidth: 1,
    borderColor: tokens.color.dangerBorder,
    borderRadius: tokens.radius.sm,
    paddingHorizontal: tokens.space(2),
    paddingVertical: tokens.space(1),
    alignItems: "center",
  },
  revertConfirmText: {
    fontSize: 11,
    fontWeight: "700",
    color: tokens.color.danger,
  },
  revertCancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.sm,
    paddingHorizontal: tokens.space(2),
    paddingVertical: tokens.space(1),
    alignItems: "center",
  },
  revertCancelText: {
    fontSize: 11,
    fontWeight: "600",
    color: tokens.color.muted,
  },
});
