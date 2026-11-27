// native/src/evolve/r52/b/FeaturableListingRow.tsx
//
// One active-listing row. Unlike a plain checkbox row, this one can host up
// to three independent controls at once (feature toggle, move up, move
// down), so — deliberately unlike a single-Pressable checkbox row — the
// outer container here is a plain View, never `accessible` and never
// itself a Pressable. Each control is its own leaf Pressable with its own
// full accessibilityLabel, so none of them gets swallowed into one opaque
// focus unit and the up/down buttons stay independently reachable.

import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { tokens } from "../../../tokens";
import { formatWon, type ActiveListing } from "./data";

const REORDER_HIT_SLOP = { top: 10, bottom: 10, left: 10, right: 10 };

type Props = {
  listing: ActiveListing;
  /** Null when this listing is not currently featured. */
  rank: number | null;
  /** True when this listing is not featured and the cap blocks adding it. */
  blockedByCap: boolean;
  isFirstFeatured: boolean;
  isLastFeatured: boolean;
  onToggleFeatured: (id: string) => void;
  onMoveFeatured: (id: string, direction: -1 | 1) => void;
};

export function FeaturableListingRow({
  listing,
  rank,
  blockedByCap,
  isFirstFeatured,
  isLastFeatured,
  onToggleFeatured,
  onMoveFeatured,
}: Props) {
  const isFeatured = rank !== null;

  // The rank chip next to this button is visual-only (hidden from the a11y
  // tree below), so the same rank number is folded into this label instead
  // — a screen reader user gets the ordinal position from the one control
  // that's actually focusable here, not from a decorative badge.
  const toggleLabel = isFeatured
    ? `Remove ${listing.title} from featured. Currently rank ${rank} in the featured order.`
    : blockedByCap
      ? `Feature ${listing.title}. Disabled — featured limit reached.`
      : `Feature ${listing.title}`;

  return (
    <View style={[styles.row, isFeatured && styles.rowFeatured]}>
      <View style={[styles.swatch, swatchFill(listing.swatchTone)]} />

      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={2}>
          {listing.title}
        </Text>
        <Text style={styles.meta}>
          {listing.categoryLabel} · {listing.conditionLabel}
        </Text>
        <Text style={styles.price}>{formatWon(listing.priceWon)}</Text>
      </View>

      {isFeatured ? (
        <View style={styles.reorderGroup}>
          <Pressable
            onPress={() => onMoveFeatured(listing.id, -1)}
            disabled={isFirstFeatured}
            hitSlop={REORDER_HIT_SLOP}
            accessibilityRole="button"
            accessibilityLabel={`Move ${listing.title} up in featured order`}
            accessibilityState={{ disabled: isFirstFeatured }}
            style={({ pressed }) => [
              styles.reorderButton,
              isFirstFeatured && styles.reorderButtonDisabled,
              pressed && !isFirstFeatured && styles.reorderButtonPressed,
            ]}
          >
            <Text style={[styles.reorderGlyph, isFirstFeatured && styles.reorderGlyphDisabled]}>
              {"↑"}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => onMoveFeatured(listing.id, 1)}
            disabled={isLastFeatured}
            hitSlop={REORDER_HIT_SLOP}
            accessibilityRole="button"
            accessibilityLabel={`Move ${listing.title} down in featured order`}
            accessibilityState={{ disabled: isLastFeatured }}
            style={({ pressed }) => [
              styles.reorderButton,
              isLastFeatured && styles.reorderButtonDisabled,
              pressed && !isLastFeatured && styles.reorderButtonPressed,
            ]}
          >
            <Text style={[styles.reorderGlyph, isLastFeatured && styles.reorderGlyphDisabled]}>
              {"↓"}
            </Text>
          </Pressable>
        </View>
      ) : null}

      <View style={styles.toggleColumn}>
        {isFeatured ? (
          <View style={styles.rankChip} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
            <Text style={styles.rankChipText}>{rank}</Text>
          </View>
        ) : null}
        <Pressable
          onPress={blockedByCap ? undefined : () => onToggleFeatured(listing.id)}
          disabled={blockedByCap}
          accessibilityRole="button"
          accessibilityLabel={toggleLabel}
          accessibilityState={{ selected: isFeatured, disabled: blockedByCap }}
          // Only promise the behavior the handler actually performs — a
          // cap-blocked toggle never fires onToggleFeatured, so it gets no hint.
          accessibilityHint={
            blockedByCap
              ? undefined
              : isFeatured
                ? "Removes this listing from your storefront's featured row."
                : "Adds this listing to your storefront's featured row."
          }
          style={({ pressed }) => [
            styles.toggleButton,
            isFeatured && styles.toggleButtonOn,
            blockedByCap && styles.toggleButtonDisabled,
            pressed && !blockedByCap && styles.toggleButtonPressed,
          ]}
        >
          <Text
            style={[
              styles.toggleButtonText,
              isFeatured && styles.toggleButtonTextOn,
              blockedByCap && styles.toggleButtonTextDisabled,
            ]}
          >
            {isFeatured ? "Featured" : "Feature"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

function swatchFill(tone: 1 | 2 | 3) {
  if (tone === 1) return { backgroundColor: tokens.color.swatch1 };
  if (tone === 2) return { backgroundColor: tokens.color.swatch2 };
  return { backgroundColor: tokens.color.swatch3 };
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(3),
    marginBottom: tokens.space(3),
    backgroundColor: tokens.color.bg,
  },
  rowFeatured: {
    borderColor: tokens.color.accent,
    backgroundColor: tokens.color.accentBg,
  },
  swatch: {
    width: 52,
    height: 52,
    borderRadius: tokens.radius.sm,
    marginRight: tokens.space(3),
  },
  body: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    lineHeight: 21,
    fontWeight: "600",
    color: tokens.color.ink,
    marginBottom: tokens.space(1),
  },
  meta: {
    fontSize: 12,
    lineHeight: 17,
    color: tokens.color.faint,
  },
  price: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "700",
    color: tokens.color.ink2,
    marginTop: tokens.space(1),
    fontVariant: ["tabular-nums"],
  },
  reorderGroup: {
    marginRight: tokens.space(2),
  },
  reorderButton: {
    minWidth: 44,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    marginBottom: tokens.space(1),
  },
  reorderButtonDisabled: {
    opacity: 0.4,
  },
  reorderButtonPressed: {
    backgroundColor: tokens.color.border,
  },
  reorderGlyph: {
    fontSize: 16,
    fontWeight: "700",
    color: tokens.color.ink2,
  },
  reorderGlyphDisabled: {
    color: tokens.color.faint,
  },
  toggleColumn: {
    alignItems: "center",
  },
  rankChip: {
    minWidth: 22,
    height: 22,
    paddingHorizontal: 5,
    borderRadius: 11,
    backgroundColor: tokens.color.accent,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: tokens.space(1),
  },
  rankChipText: {
    fontSize: 12,
    fontWeight: "700",
    color: tokens.color.onAccent,
    fontVariant: ["tabular-nums"],
  },
  toggleButton: {
    minWidth: 44,
    minHeight: 44,
    paddingHorizontal: tokens.space(2),
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
  },
  toggleButtonOn: {
    borderColor: tokens.color.accent,
    backgroundColor: tokens.color.accent,
  },
  toggleButtonDisabled: {
    opacity: 0.45,
  },
  toggleButtonPressed: {
    backgroundColor: tokens.color.border,
  },
  toggleButtonText: {
    fontSize: 12,
    fontWeight: "700",
    color: tokens.color.ink2,
  },
  toggleButtonTextOn: {
    color: tokens.color.onAccent,
  },
  toggleButtonTextDisabled: {
    color: tokens.color.faint,
  },
});

export default FeaturableListingRow;
