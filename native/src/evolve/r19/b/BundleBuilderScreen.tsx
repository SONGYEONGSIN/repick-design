// native/src/evolve/r19/b/BundleBuilderScreen.tsx — auto-native-r19 candidate b.
//
// Bundle Listing Builder: a seller picks any number of their own active listings (0, 1, 2, ... —
// no fixed cardinality) to fold into one discounted multi-item bundle listing. There is no
// sequential gate here — nothing is "blocked" in the state-machine sense, so per GENERATION.md §3
// this is the THIRD band form (selection-driven contextual bar), not the blocked-workflow form:
// the bottom bar simply does not exist while nothing is picked, mounts the moment
// pickedCount > 0, and its single live region re-announces the running count together with the
// live-computed bundle price and discount every time the selection changes. It is mutually
// exclusive with any post-action undo affordance — publishing clears the selection and the bar
// unmounts with it, nothing else takes its place.
//
// The discount itself is a real formula (see pricing.ts), not a hardcoded per-count table: it
// grows by a fixed number of points per extra item, capped once the bundle is large enough.
import React, { useCallback, useMemo, useRef, useState } from "react";
import { View, Text, Pressable, FlatList, SafeAreaView, StyleSheet } from "react-native";
import { tokens } from "../../../tokens";
import { ACTIVE_LISTINGS, INITIAL_PUBLISHED_BUNDLES, type ActiveListing, type PublishedBundle } from "./data";
import { computeBundleTotals, discountLadder } from "./pricing";

const HIT_SLOP = { top: 10, bottom: 10, left: 10, right: 10 };
const LADDER = discountLadder(5); // computed rows for 2..5 items, not retyped literals

// Won-sign mitigation choice (a) from GENERATION.md §1: a literal space between ₩ and the digits
// keeps the glyph's stroke from visually running into the adjacent numeral at body-text size.
function formatKrw(n: number): string {
  return `₩ ${n.toLocaleString("en-US")}`;
}

export function BundleBuilderScreen() {
  const [pickedIds, setPickedIds] = useState<Set<string>>(new Set());
  const [bundles, setBundles] = useState<PublishedBundle[]>(INITIAL_PUBLISHED_BUNDLES);
  const bundleSeq = useRef(INITIAL_PUBLISHED_BUNDLES.length);

  const pickedCount = pickedIds.size;

  const pickedListings = useMemo(
    () => ACTIVE_LISTINGS.filter((l) => pickedIds.has(l.id)),
    [pickedIds]
  );

  const totals = useMemo(
    () => computeBundleTotals(pickedListings.map((l) => l.priceKrw)),
    [pickedListings]
  );

  const togglePick = useCallback((id: string) => {
    setPickedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const clearPicks = useCallback(() => setPickedIds(new Set()), []);

  const canPublish = pickedCount >= 2;

  const publishBundle = useCallback(() => {
    if (!canPublish) return;
    bundleSeq.current += 1;
    const newBundle: PublishedBundle = {
      id: `pb${bundleSeq.current}`,
      title: `${totals.itemCount}-Item Bundle ${bundleSeq.current}`,
      itemCount: totals.itemCount,
      totalKrw: totals.total,
      discountPercent: totals.discountPercent,
    };
    setBundles((prev) => [newBundle, ...prev]);
    setPickedIds(new Set());
  }, [canPublish, totals]);

  const barVisible = pickedCount > 0;

  const summaryText = useMemo(() => {
    if (pickedCount === 0) return "";
    if (pickedCount === 1) {
      return "1 item selected. Add one more item to unlock a bundle discount.";
    }
    return (
      `${pickedCount} items selected. Bundle total ${formatKrw(totals.total)} — ` +
      `${totals.discountPercent}% off, save ${formatKrw(totals.discountAmount)}.`
    );
  }, [pickedCount, totals]);

  const renderItem = useCallback(
    ({ item }: { item: ActiveListing }) => {
      const isPicked = pickedIds.has(item.id);
      const stateLabel = isPicked ? "in bundle" : "not in bundle";
      return (
        <Pressable
          onPress={() => togglePick(item.id)}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: isPicked }}
          accessibilityLabel={`${item.title}, ${formatKrw(item.priceKrw)}, ${stateLabel}`}
          style={({ pressed }) => [
            styles.row,
            isPicked && styles.rowPicked,
            pressed && styles.rowPressed,
          ]}
        >
          <View style={[styles.checkbox, isPicked && styles.checkboxChecked]}>
            {isPicked ? <Text style={styles.checkmark}>{"✓"}</Text> : null}
          </View>

          <View style={styles.thumb}>
            <Text style={styles.thumbLabel}>{item.thumbLabel}</Text>
          </View>

          <View style={styles.rowBody}>
            <Text style={styles.rowTitle} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={styles.rowMeta}>{item.category}</Text>
          </View>

          <Text style={styles.rowPrice}>{formatKrw(item.priceKrw)}</Text>
        </Pressable>
      );
    },
    [pickedIds, togglePick]
  );

  const listHeader = (
    <View style={styles.intro}>
      <Text accessibilityRole="header" style={styles.title}>
        Build a Bundle
      </Text>
      <Text style={styles.subtitle}>
        Select any number of your active listings below to combine them into one discounted
        bundle listing. The more items you add, the bigger the discount.
      </Text>

      <View style={styles.ladderCard}>
        <Text style={styles.ladderLabel}>Discount grows with item count</Text>
        <View style={styles.ladderRow}>
          {LADDER.map((rung, i) => (
            <View key={rung.count} style={styles.ladderCell}>
              <Text style={styles.ladderCount}>
                {i === LADDER.length - 1 ? `${rung.count}+` : `${rung.count}`}
              </Text>
              <Text style={styles.ladderPercent}>−{rung.percent}%</Text>
            </View>
          ))}
        </View>
      </View>

      <Text style={styles.sectionLabel}>Your active listings</Text>
    </View>
  );

  const listFooter = (
    <View style={styles.footer}>
      <Text style={styles.sectionLabel}>Published bundles</Text>
      {bundles.length === 0 ? (
        <Text style={styles.emptyText}>No bundles published yet.</Text>
      ) : (
        bundles.map((b) => (
          <View key={b.id} style={styles.bundleCard}>
            <View style={styles.bundleBody}>
              <Text style={styles.bundleTitle}>{b.title}</Text>
              <Text style={styles.bundleMeta}>
                {b.itemCount} items · −{b.discountPercent}% bundle discount
              </Text>
            </View>
            <Text style={styles.bundlePrice}>{formatKrw(b.totalKrw)}</Text>
          </View>
        ))
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        data={ACTIVE_LISTINGS}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={listHeader}
        ListFooterComponent={listFooter}
        style={styles.list}
        contentContainerStyle={[styles.listContent, barVisible && styles.listContentPad]}
      />

      {barVisible ? (
        <View style={styles.bar}>
          <View accessibilityLiveRegion="polite" style={styles.barSummaryWrap}>
            <Text accessibilityRole="alert" style={styles.barSummaryText}>
              {summaryText}
            </Text>
          </View>
          <View style={styles.barActions}>
            <Pressable
              onPress={clearPicks}
              hitSlop={HIT_SLOP}
              accessibilityRole="button"
              accessibilityLabel="Clear bundle selection"
              style={styles.barClear}
            >
              <Text style={styles.barClearText}>{"✕"}</Text>
            </Pressable>
            <Pressable
              onPress={publishBundle}
              disabled={!canPublish}
              accessibilityRole="button"
              accessibilityState={{ disabled: !canPublish }}
              accessibilityLabel={
                canPublish
                  ? `Publish bundle of ${pickedCount} items for ${formatKrw(totals.total)}`
                  : "Publish Bundle, select at least one more item first"
              }
              accessibilityHint={canPublish ? "Adds this bundle to your published bundles below" : undefined}
              style={({ pressed }) => [
                styles.publishButton,
                !canPublish && styles.publishButtonDisabled,
                pressed && canPublish && styles.publishButtonPressed,
              ]}
            >
              <Text style={[styles.publishButtonText, !canPublish && styles.publishButtonTextDisabled]}>
                Publish Bundle
              </Text>
            </Pressable>
          </View>
        </View>
      ) : null}
    </SafeAreaView>
  );
}

export default BundleBuilderScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: tokens.space(6),
  },
  listContentPad: {
    paddingBottom: tokens.space(30),
  },
  intro: {
    paddingHorizontal: tokens.space(4),
    paddingTop: tokens.space(2),
    paddingBottom: tokens.space(3),
    gap: tokens.space(2),
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  subtitle: {
    fontSize: 13,
    color: tokens.color.muted,
    lineHeight: 18,
  },
  ladderCard: {
    marginTop: tokens.space(2),
    padding: tokens.space(3),
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.border,
    gap: tokens.space(2),
  },
  ladderLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: tokens.color.faint,
  },
  ladderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  ladderCell: {
    alignItems: "center",
    gap: 2,
  },
  ladderCount: {
    fontSize: 11,
    color: tokens.color.muted,
    fontVariant: ["tabular-nums"],
  },
  ladderPercent: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.accent,
    fontVariant: ["tabular-nums"],
  },
  sectionLabel: {
    marginTop: tokens.space(3),
    fontSize: 13,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.space(3),
    marginHorizontal: tokens.space(4),
    marginBottom: tokens.space(2),
    padding: tokens.space(3),
    borderRadius: tokens.radius.md,
    borderWidth: 1.5,
    borderColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    minHeight: 44,
  },
  rowPicked: {
    borderColor: tokens.color.accent,
    borderWidth: 2,
  },
  rowPressed: {
    opacity: 0.85,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: tokens.radius.sm,
    borderWidth: 1.5,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: tokens.color.bg,
  },
  checkboxChecked: {
    borderColor: tokens.color.accent,
    backgroundColor: tokens.color.accent,
  },
  checkmark: {
    color: tokens.color.onAccent,
    fontSize: 14,
    fontWeight: "700",
  },
  thumb: {
    width: 44,
    height: 44,
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
  },
  thumbLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: tokens.color.faint,
  },
  rowBody: {
    flex: 1,
    gap: 2,
  },
  rowTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: tokens.color.ink,
  },
  rowMeta: {
    fontSize: 12,
    color: tokens.color.faint,
  },
  rowPrice: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.ink,
    fontVariant: ["tabular-nums"],
  },
  footer: {
    paddingHorizontal: tokens.space(4),
    paddingTop: tokens.space(2),
    paddingBottom: tokens.space(4),
  },
  emptyText: {
    fontSize: 13,
    color: tokens.color.faint,
    marginTop: tokens.space(1),
  },
  bundleCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: tokens.space(2),
    padding: tokens.space(3),
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
  },
  bundleBody: {
    flex: 1,
    gap: 2,
  },
  bundleTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: tokens.color.ink,
  },
  bundleMeta: {
    fontSize: 12,
    color: tokens.color.muted,
  },
  bundlePrice: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.ink,
    fontVariant: ["tabular-nums"],
  },
  bar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.space(3),
    paddingHorizontal: tokens.space(4),
    paddingVertical: tokens.space(3),
    backgroundColor: tokens.color.ink,
    borderTopLeftRadius: tokens.radius.md,
    borderTopRightRadius: tokens.radius.md,
  },
  barSummaryWrap: {
    flex: 1,
  },
  barSummaryText: {
    color: tokens.color.onInk,
    fontSize: 13,
    fontWeight: "600",
    fontVariant: ["tabular-nums"],
  },
  barActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.space(2),
  },
  barClear: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  barClearText: {
    color: tokens.color.onInkMuted,
    fontSize: 16,
  },
  publishButton: {
    minHeight: 44,
    paddingHorizontal: tokens.space(4),
    borderRadius: tokens.radius.sm,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: tokens.color.accent,
  },
  publishButtonDisabled: {
    backgroundColor: tokens.color.ink2,
  },
  publishButtonPressed: {
    opacity: 0.85,
  },
  publishButtonText: {
    color: tokens.color.onAccent,
    fontSize: 13,
    fontWeight: "700",
  },
  publishButtonTextDisabled: {
    color: tokens.color.onInkMuted,
  },
});
