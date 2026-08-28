// native/src/evolve/r15/b/BundleOfferBuilderScreen.tsx
// Bundle Offer Builder — select multiple listings from one seller and
// combine them into a single bundled offer instead of negotiating each
// item separately.

import { useMemo, useRef, useState, useCallback } from "react";
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
  listings,
  seller,
  getBundleDiscountPct,
  formatKRW,
  type BundleListing,
} from "./data";

// Derives a translucent tint from an existing token color instead of
// introducing a new hardcoded hex value — keeps every color traceable
// back to `tokens.color.*`.
function withOpacity(hex: string, alpha: number): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function ListingRow({
  item,
  selected,
  onToggle,
}: {
  item: BundleListing;
  selected: boolean;
  onToggle: (id: string) => void;
}) {
  const savings = item.originalPrice - item.price;

  return (
    <Pressable
      onPress={() => onToggle(item.id)}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={`${item.title}, ${formatKRW(item.price)}, ${item.matchPct} percent match, grade ${item.grade}`}
      accessibilityHint={
        selected
          ? "Removes this item from your bundle"
          : "Adds this item to your bundle"
      }
      style={({ pressed }) => [
        styles.row,
        selected && styles.rowSelected,
        pressed && styles.rowPressed,
      ]}
    >
      <View
        style={[styles.checkbox, selected && styles.checkboxChecked]}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        {selected ? <Text style={styles.checkboxMark}>✓</Text> : null}
      </View>

      <View style={styles.rowBody}>
        <Text style={styles.rowTitle}>{item.title}</Text>
        <Text style={styles.rowCategory}>{item.category}</Text>

        <View style={styles.tagRow}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{item.matchPct}% match</Text>
          </View>
          <View style={styles.tag}>
            <Text style={styles.tagText}>Grade {item.grade}</Text>
          </View>
        </View>

        <View style={styles.priceRow}>
          <Text style={styles.priceOriginal}>{formatKRW(item.originalPrice)}</Text>
          <Text style={styles.priceCurrent}>{formatKRW(item.price)}</Text>
          <Text style={styles.priceSavings}>Save {formatKRW(savings)}</Text>
        </View>
      </View>
    </Pressable>
  );
}

export function BundleOfferBuilderScreen() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [reviewConfirmed, setReviewConfirmed] = useState(false);
  const listRef = useRef<FlatList<BundleListing>>(null);

  const toggleItem = useCallback((id: string) => {
    setReviewConfirmed(false);
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }, []);

  const summary = useMemo(() => {
    const selected = listings.filter((l) => selectedIds.includes(l.id));
    const itemCount = selected.length;
    const subtotal = selected.reduce((sum, l) => sum + l.price, 0);
    const discountPct = getBundleDiscountPct(itemCount);
    const discountAmount = Math.round((subtotal * discountPct) / 100);
    const bundlePrice = subtotal - discountAmount;
    return { itemCount, subtotal, discountPct, discountAmount, bundlePrice };
  }, [selectedIds]);

  const isBlocked = summary.itemCount === 0;

  const scrollToTop = useCallback(() => {
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, []);

  const handleReview = useCallback(() => {
    setReviewConfirmed(true);
  }, []);

  const handleEditSelection = useCallback(() => {
    setReviewConfirmed(false);
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: BundleListing }) => (
      <ListingRow
        item={item}
        selected={selectedIds.includes(item.id)}
        onToggle={toggleItem}
      />
    ),
    [selectedIds, toggleItem]
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text
          accessibilityRole="header"
          style={styles.heading}
        >
          Build a bundle offer
        </Text>
        <Text style={styles.subheading}>
          {seller.name}
          {seller.verified ? " · Verified seller" : ""} · {seller.itemCount} items
          available
        </Text>
        <Text style={styles.instructions}>
          Select two or more items to combine them into one bundled offer with
          a single negotiated price.
        </Text>
      </View>

      <FlatList
        ref={listRef}
        data={listings}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListHeaderComponent={
          <Text style={styles.sectionLabel}>Available items</Text>
        }
      />

      {/* Fixed bottom band — a state machine tracking bundle-selection progress. */}
      <View style={styles.band} accessibilityLiveRegion="polite">
        {isBlocked ? (
          <Pressable
            onPress={scrollToTop}
            accessibilityRole="button"
            accessibilityLabel="Scroll to item list"
            accessibilityHint="Scrolls to the top of the item list so you can select items"
            style={({ pressed }) => [
              styles.bandBlocked,
              pressed && styles.bandPressed,
            ]}
          >
            <Text style={styles.bandBlockedIcon}>—</Text>
            <Text style={styles.bandBlockedText} accessibilityRole="alert">
              Select at least one item to build a bundle
            </Text>
          </Pressable>
        ) : reviewConfirmed ? (
          <View style={styles.bandReady}>
            <Text style={styles.bandConfirmText} accessibilityRole="alert">
              Bundle offer drafted: {summary.itemCount}{" "}
              {summary.itemCount === 1 ? "item" : "items"} at{" "}
              {formatKRW(summary.bundlePrice)}. The seller will see this as one
              combined offer.
            </Text>
            <Pressable
              onPress={handleEditSelection}
              accessibilityRole="button"
              accessibilityLabel="Edit selection"
              accessibilityHint="Returns to the bundle summary so you can change your selected items"
              style={({ pressed }) => [
                styles.secondaryButton,
                pressed && styles.bandPressed,
              ]}
            >
              <Text style={styles.secondaryButtonText}>Edit selection</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.bandReady}>
            <View style={styles.summaryTextBlock}>
              <Text style={styles.bandSummaryText} accessibilityRole="alert">
                {summary.itemCount} {summary.itemCount === 1 ? "item" : "items"}{" "}
                · {formatKRW(summary.subtotal)}
                {summary.discountPct > 0
                  ? ` → ${formatKRW(summary.bundlePrice)} (${summary.discountPct}% bundle discount)`
                  : ""}
              </Text>
            </View>
            <Pressable
              onPress={handleReview}
              accessibilityRole="button"
              accessibilityLabel={`Review bundle offer for ${summary.itemCount} items at ${formatKRW(summary.bundlePrice)}`}
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.primaryButtonPressed,
              ]}
            >
              <Text style={styles.primaryButtonText}>Review bundle offer</Text>
            </Pressable>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  header: {
    paddingHorizontal: tokens.space(4),
    paddingTop: tokens.space(4),
    paddingBottom: tokens.space(2),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: tokens.color.border,
  },
  heading: {
    fontSize: 22,
    fontWeight: "700",
    color: tokens.color.ink,
    marginBottom: tokens.space(1),
  },
  subheading: {
    fontSize: 14,
    color: tokens.color.muted,
    marginBottom: tokens.space(2),
  },
  instructions: {
    fontSize: 13,
    color: tokens.color.faint,
    lineHeight: 18,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: tokens.color.faint,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    paddingHorizontal: tokens.space(4),
    paddingTop: tokens.space(3),
    paddingBottom: tokens.space(1),
  },
  listContent: {
    paddingBottom: tokens.space(6),
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: tokens.color.border,
    marginLeft: tokens.space(4),
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: tokens.space(4),
    paddingVertical: tokens.space(3),
    minHeight: 44,
    gap: tokens.space(3),
  },
  rowSelected: {
    backgroundColor: withOpacity(tokens.color.accent, 0.06),
  },
  rowPressed: {
    backgroundColor: withOpacity(tokens.color.ink, 0.04),
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: tokens.radius.sm,
    borderWidth: 2,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  checkboxChecked: {
    borderColor: tokens.color.accent,
    backgroundColor: tokens.color.accent,
  },
  checkboxMark: {
    color: tokens.color.onAccent,
    fontSize: 14,
    fontWeight: "700",
  },
  rowBody: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: tokens.color.ink,
    marginBottom: 2,
  },
  rowCategory: {
    fontSize: 12,
    color: tokens.color.faint,
    marginBottom: tokens.space(1),
  },
  tagRow: {
    flexDirection: "row",
    gap: tokens.space(1),
    marginBottom: tokens.space(1),
  },
  tag: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.sm,
    paddingHorizontal: tokens.space(1.5),
    paddingVertical: 2,
  },
  tagText: {
    fontSize: 11,
    fontWeight: "600",
    color: tokens.color.ink2,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    flexWrap: "wrap",
    gap: tokens.space(2),
  },
  priceOriginal: {
    fontSize: 13,
    color: tokens.color.faint,
    textDecorationLine: "line-through",
  },
  priceCurrent: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.ink,
    fontVariant: ["tabular-nums"],
  },
  priceSavings: {
    fontSize: 12,
    color: tokens.color.accent,
    fontWeight: "600",
  },
  band: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    paddingHorizontal: tokens.space(4),
    paddingVertical: tokens.space(3),
  },
  bandPressed: {
    opacity: 0.7,
  },
  bandBlocked: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 44,
    gap: tokens.space(2),
  },
  bandBlockedIcon: {
    fontSize: 16,
    color: tokens.color.faint,
    fontWeight: "700",
  },
  bandBlockedText: {
    fontSize: 14,
    color: tokens.color.muted,
    flexShrink: 1,
  },
  bandReady: {
    gap: tokens.space(2),
  },
  summaryTextBlock: {
    marginBottom: tokens.space(1),
  },
  bandSummaryText: {
    fontSize: 15,
    color: tokens.color.ink,
    fontWeight: "600",
    fontVariant: ["tabular-nums"],
  },
  bandConfirmText: {
    fontSize: 14,
    color: tokens.color.ink,
    lineHeight: 20,
    fontVariant: ["tabular-nums"],
  },
  primaryButton: {
    backgroundColor: tokens.color.accent,
    borderRadius: tokens.radius.md,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: tokens.space(4),
  },
  primaryButtonPressed: {
    opacity: 0.85,
  },
  primaryButtonText: {
    color: tokens.color.onAccent,
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: tokens.space(4),
    alignSelf: "flex-start",
  },
  secondaryButtonText: {
    color: tokens.color.ink2,
    fontSize: 14,
    fontWeight: "600",
  },
});

export default BundleOfferBuilderScreen;
