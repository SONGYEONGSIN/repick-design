// native/src/evolve/r59/a/CampaignListingRow.tsx
// One listing row in the Bulk Discount Campaign screen. A single leaf
// Pressable (no interactive children nested inside it) so VoiceOver/
// TalkBack can focus it directly — accessibilityLabel carries the full
// row summary instead of wrapping it in accessible={true}.

import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { tokens } from "../../../tokens";
import { CampaignListing, discountedPriceCents, formatWholeDollars } from "./data";

interface CampaignListingRowProps {
  listing: CampaignListing;
  isSelected: boolean;
  discountPercent: number;
  locked: boolean;
  onToggle: (id: string) => void;
}

export function CampaignListingRow(props: CampaignListingRowProps) {
  const { listing, isSelected, discountPercent, locked, onToggle } = props;
  const discountedCents = discountedPriceCents(listing.priceCents, discountPercent);

  const selectionWord = isSelected ? "selected" : "not selected";
  const previewPhrase =
    isSelected && discountPercent > 0
      ? `, previewing ${formatWholeDollars(discountedCents)} at ${discountPercent} percent off`
      : "";
  const lockedPhrase = locked ? (isSelected ? ", locked in this campaign" : ", locked out of this campaign") : "";

  return (
    <Pressable
      disabled={locked}
      onPress={() => onToggle(listing.id)}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: isSelected, disabled: locked }}
      accessibilityLabel={`${listing.title}, ${listing.category}, ${formatWholeDollars(
        listing.priceCents
      )}, ${selectionWord}${previewPhrase}${lockedPhrase}`}
      style={[styles.row, isSelected ? styles.rowSelected : null, locked ? styles.rowLocked : null]}
    >
      <View style={[styles.checkMark, isSelected ? styles.checkMarkOn : null]}>
        {isSelected ? <Text style={styles.checkGlyph}>{"✓"}</Text> : null}
      </View>

      <View style={styles.rowBody}>
        <Text style={styles.rowTitle} numberOfLines={1}>
          {listing.title}
        </Text>
        <Text style={styles.rowCategory}>{listing.category}</Text>

        {isSelected ? (
          <Text style={styles.rowPreviewLine}>
            {formatWholeDollars(listing.priceCents)}
            {" → "}
            {formatWholeDollars(discountedCents)}
            {` at ${discountPercent}% off`}
          </Text>
        ) : (
          <Text style={styles.rowPriceLine}>{formatWholeDollars(listing.priceCents)}</Text>
        )}
      </View>

      {locked && isSelected ? <Text style={styles.rowCampaignTag}>In campaign</Text> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    minHeight: tokens.space(11),
    paddingVertical: tokens.space(3),
    paddingHorizontal: tokens.space(4),
    backgroundColor: tokens.color.bg,
  },
  rowSelected: {
    backgroundColor: tokens.color.accentBg,
  },
  rowLocked: {
    opacity: 0.85,
  },
  checkMark: {
    width: tokens.space(5),
    height: tokens.space(5),
    borderRadius: tokens.radius.sm,
    borderWidth: 2,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
    marginRight: tokens.space(3),
    marginTop: tokens.space(1) / 2,
  },
  checkMarkOn: {
    borderColor: tokens.color.accent,
    backgroundColor: tokens.color.accent,
  },
  checkGlyph: {
    color: tokens.color.onAccent,
    fontSize: 13,
    fontWeight: "700",
  },
  rowBody: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: tokens.color.ink,
  },
  rowCategory: {
    marginTop: tokens.space(1) / 2,
    fontSize: 12,
    color: tokens.color.faint,
  },
  rowPriceLine: {
    marginTop: tokens.space(1),
    fontSize: 14,
    color: tokens.color.muted,
    fontVariant: ["tabular-nums"],
  },
  rowPreviewLine: {
    marginTop: tokens.space(1),
    fontSize: 14,
    fontWeight: "600",
    color: tokens.color.accent,
    fontVariant: ["tabular-nums"],
  },
  rowCampaignTag: {
    marginLeft: tokens.space(2),
    alignSelf: "flex-start",
    fontSize: 11,
    fontWeight: "700",
    color: tokens.color.success,
  },
});
