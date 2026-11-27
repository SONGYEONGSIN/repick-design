// native/src/evolve/r56/c/SellerTierProgressScreen.tsx — auto-native-r56
// candidate c.
//
// Seller tier progress & milestones — a read-only-ish record screen: a
// fixed hero block shows the seller's current tier and a progress meter
// toward the next tier, followed by a FlatList of milestone badges (some
// achieved, some pending with a short note on what's left). A persistent
// bottom bar offers one real action: sharing the current tier to the
// seller's public profile, which is a one-time, non-reversible-in-this-UI
// transition — so the bar's label and accessibility label both change the
// instant it happens, rather than just dimming.
//
// State model (written fresh for this screen):
//   - filterKey: "all" | "achieved" | "pending" — the ONLY thing that
//     decides which rows the FlatList renders. Row status itself is never
//     duplicated into separate state; it's read straight off each badge
//     record in data.ts.
//   - expandedBadgeIds: a Set<string> of badge ids currently showing their
//     detail line. Purely a display toggle, independent of filterKey.
//   - tierShared: boolean — whether the "Share my tier" action has been
//     used yet. This is the one piece of state the bottom bar owns, and it
//     is also what the live region announces the instant it flips.
import React, { useCallback, useMemo, useState } from "react";
import { View, Text, Pressable, FlatList, SafeAreaView, StyleSheet } from "react-native";
import { tokens } from "../../../tokens";
import { MILESTONE_BADGES, MilestoneBadge, SELLER_SNAPSHOT, TIER_SEQUENCE } from "./data";
import { MilestoneBadgeRow, TierMeter } from "./components";

type FilterKey = "all" | "achieved" | "pending";

const FILTER_OPTIONS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "achieved", label: "Achieved" },
  { key: "pending", label: "Pending" },
];

export default function SellerTierProgressScreen() {
  const [filterKey, setFilterKey] = useState<FilterKey>("all");
  const [expandedBadgeIds, setExpandedBadgeIds] = useState<Set<string>>(new Set());
  const [tierShared, setTierShared] = useState(false);

  // Derive current tier / next tier / progress ratio from the fixed
  // threshold list plus the one snapshot number, instead of storing any of
  // those as separate state that could drift.
  const { currentTier, nextTier, progressRatio, salesIntoNextTier, salesNeededForNextTier } =
    useMemo(() => {
      let current = TIER_SEQUENCE[0];
      let next = TIER_SEQUENCE[TIER_SEQUENCE.length - 1];
      for (let i = 0; i < TIER_SEQUENCE.length; i++) {
        if (SELLER_SNAPSHOT.completedSales >= TIER_SEQUENCE[i].salesThreshold) {
          current = TIER_SEQUENCE[i];
          next = TIER_SEQUENCE[i + 1] ?? TIER_SEQUENCE[i];
        }
      }
      const atMaxTier = current.id === TIER_SEQUENCE[TIER_SEQUENCE.length - 1].id;
      const spanSales = next.salesThreshold - current.salesThreshold;
      const intoSpan = SELLER_SNAPSHOT.completedSales - current.salesThreshold;
      return {
        currentTier: current,
        nextTier: atMaxTier ? null : next,
        progressRatio: atMaxTier || spanSales <= 0 ? 1 : Math.max(0, Math.min(1, intoSpan / spanSales)),
        salesIntoNextTier: intoSpan,
        salesNeededForNextTier: atMaxTier ? 0 : Math.max(0, next.salesThreshold - SELLER_SNAPSHOT.completedSales),
      };
    }, []);

  const achievedCount = useMemo(
    () => MILESTONE_BADGES.filter((badge) => badge.status === "achieved").length,
    []
  );
  const pendingCount = MILESTONE_BADGES.length - achievedCount;

  const visibleBadges = useMemo(() => {
    if (filterKey === "all") return MILESTONE_BADGES;
    return MILESTONE_BADGES.filter((badge) => badge.status === filterKey);
  }, [filterKey]);

  const toggleExpanded = useCallback((id: string) => {
    setExpandedBadgeIds((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const handleShareTier = useCallback(() => {
    setTierShared(true);
  }, []);

  const renderBadgeRow = useCallback(
    ({ item }: { item: MilestoneBadge }) => (
      <MilestoneBadgeRow
        badge={item}
        expanded={expandedBadgeIds.has(item.id)}
        onToggleExpanded={toggleExpanded}
      />
    ),
    [expandedBadgeIds, toggleExpanded]
  );

  const filterCountFor = (key: FilterKey) =>
    key === "all" ? MILESTONE_BADGES.length : key === "achieved" ? achievedCount : pendingCount;

  const meterLabel = nextTier
    ? `Progress toward ${nextTier.label} tier: ${Math.round(progressRatio * 100)} percent, ${salesNeededForNextTier} sales to go.`
    : `${currentTier.label} is the highest tier — progress complete.`;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <Text accessibilityRole="header" style={styles.heading}>
          Your seller tier
        </Text>

        <View style={styles.heroCard}>
          <View style={styles.heroTopRow}>
            <View style={styles.tierNameBlock}>
              <Text style={styles.tierNameLabel}>Current tier</Text>
              <Text style={styles.tierNameValue}>{currentTier.label}</Text>
            </View>
            <View style={styles.tierPerkBlock}>
              <Text style={styles.tierPerkText}>{currentTier.perk}</Text>
            </View>
          </View>

          <View style={styles.meterBlock}>
            <TierMeter fillRatio={progressRatio} trackLabel={meterLabel} />
            <View style={styles.meterCaptionRow}>
              <Text style={styles.meterCaptionText}>
                {nextTier
                  ? `${salesIntoNextTier} of ${nextTier.salesThreshold} sales toward ${nextTier.label}`
                  : "Top tier reached"}
              </Text>
              <Text style={styles.meterPercentText}>{Math.round(progressRatio * 100)}%</Text>
            </View>
            {nextTier ? (
              <Text style={styles.meterSubText}>
                {salesNeededForNextTier} more sale{salesNeededForNextTier === 1 ? "" : "s"} to reach {nextTier.label}.
              </Text>
            ) : (
              <Text style={styles.meterSubText}>You've reached the highest tier available.</Text>
            )}
          </View>
        </View>

        <View style={styles.listHeaderRow}>
          <Text accessibilityRole="header" style={styles.listHeading}>
            Milestones
          </Text>
          <View style={styles.filterGroup} accessibilityRole="tablist">
            {FILTER_OPTIONS.map((option) => {
              const selected = option.key === filterKey;
              return (
                <Pressable
                  key={option.key}
                  onPress={() => setFilterKey(option.key)}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  accessibilityLabel={`Filter: ${option.label} (${filterCountFor(option.key)}).${
                    selected ? " Currently selected." : ""
                  }`}
                  hitSlop={6}
                  style={[styles.filterChip, selected && styles.filterChipSelected]}
                >
                  <Text
                    style={[styles.filterChipText, selected && styles.filterChipTextSelected]}
                  >
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <FlatList
          data={visibleBadges}
          keyExtractor={(item) => item.id}
          renderItem={renderBadgeRow}
          contentContainerStyle={styles.listContent}
          style={styles.list}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No milestones match this filter.</Text>
          }
        />
      </View>

      <View style={styles.actionBar}>
        <View style={styles.actionBarTextCol}>
          <Text style={styles.actionBarTitle}>
            {tierShared ? "Shared to your profile" : "Share your tier status"}
          </Text>
          <Text
            accessibilityLiveRegion="polite"
            accessibilityRole="alert"
            style={styles.actionBarSubtitle}
          >
            {tierShared
              ? `Your ${currentTier.label} tier badge is now visible on your public profile.`
              : "Let buyers see your current tier on your public profile."}
          </Text>
        </View>
        <Pressable
          onPress={handleShareTier}
          disabled={tierShared}
          accessibilityRole="button"
          accessibilityState={{ disabled: tierShared }}
          accessibilityLabel={
            tierShared
              ? `Tier status already shared. Your ${currentTier.label} tier badge is visible on your public profile.`
              : `Share your ${currentTier.label} tier status to your public profile.`
          }
          style={({ pressed }) => [
            styles.shareButton,
            tierShared && styles.shareButtonDone,
            pressed && !tierShared && styles.shareButtonPressed,
          ]}
        >
          <Text style={[styles.shareButtonText, tierShared && styles.shareButtonTextDone]}>
            {tierShared ? "Shared" : "Share"}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  content: {
    flex: 1,
    paddingHorizontal: tokens.space(4),
    paddingTop: tokens.space(4),
  },
  heading: {
    fontSize: 22,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  heroCard: {
    marginTop: tokens.space(4),
    padding: tokens.space(4),
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.color.accentBg,
  },
  heroTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  tierNameBlock: {},
  tierNameLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: tokens.color.muted,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  tierNameValue: {
    marginTop: tokens.space(1) / 2,
    fontSize: 24,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  tierPerkBlock: {
    maxWidth: "50%",
  },
  tierPerkText: {
    fontSize: 12,
    color: tokens.color.muted,
    textAlign: "right",
    lineHeight: 16,
  },
  meterBlock: {
    marginTop: tokens.space(4),
  },
  meterCaptionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: tokens.space(2),
  },
  meterCaptionText: {
    fontSize: 13,
    color: tokens.color.muted,
    flex: 1,
    marginRight: tokens.space(2),
  },
  meterPercentText: {
    fontSize: 13,
    fontWeight: "700",
    color: tokens.color.accent,
    fontVariant: ["tabular-nums"],
  },
  meterSubText: {
    marginTop: tokens.space(1),
    fontSize: 12,
    color: tokens.color.faint,
  },
  listHeaderRow: {
    marginTop: tokens.space(5),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  listHeading: {
    fontSize: 17,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  filterGroup: {
    flexDirection: "row",
    backgroundColor: tokens.color.bg,
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.border,
    padding: 2,
  },
  filterChip: {
    paddingVertical: tokens.space(1),
    paddingHorizontal: tokens.space(2),
    borderRadius: tokens.radius.sm,
    minHeight: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  filterChipSelected: {
    backgroundColor: tokens.color.accent,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: "600",
    color: tokens.color.muted,
  },
  filterChipTextSelected: {
    color: tokens.color.onAccent,
  },
  list: {
    flex: 1,
    marginTop: tokens.space(3),
  },
  listContent: {
    paddingBottom: tokens.space(4),
  },
  emptyText: {
    marginTop: tokens.space(4),
    fontSize: 13,
    color: tokens.color.faint,
    textAlign: "center",
  },
  actionBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: tokens.space(4),
    paddingVertical: tokens.space(3),
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
  },
  actionBarTextCol: {
    flex: 1,
    marginRight: tokens.space(3),
  },
  actionBarTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  actionBarSubtitle: {
    marginTop: tokens.space(1) / 2,
    fontSize: 12,
    color: tokens.color.muted,
    lineHeight: 16,
  },
  shareButton: {
    minHeight: 44,
    minWidth: 92,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: tokens.space(4),
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.color.accent,
  },
  shareButtonPressed: {
    backgroundColor: tokens.color.ink2,
  },
  shareButtonDone: {
    backgroundColor: tokens.color.bg,
    borderWidth: 1,
    borderColor: tokens.color.successBorder,
  },
  shareButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.onAccent,
  },
  shareButtonTextDone: {
    color: tokens.color.success,
  },
});
