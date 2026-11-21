// native/src/evolve/r44/c/SellerBadgeTrackerScreen.tsx
//
// Seller Reputation Tier — a read-only record screen showing the seller's
// current reputation tier, progress toward the next tier, and a grid of
// earned/locked achievement badges. Distinct from `membership-tiers`
// (buyer-facing paid subscription picker) and `loyalty-points` (a points
// ledger/transaction history): nothing here is purchasable and nothing
// here is a transaction log — it is a snapshot of standing already earned.
//
// Band-form note (GENERATION.md §3): this screen has no blocked workflow
// to unblock, so it does NOT use the statusFor()/jumpTo() blocked→ready→done
// state-machine band those screens use. The bottom bar here is an
// always-mounted action bar with one genuinely working action — it
// toggles and scrolls to an already-rendered perks section — never a
// no-op, never state-machine styled key names.
//
// Macro layout: 2-column FlatList grid for the badge collection, with a
// summary header above it (tier name, progress bar, points-to-next-tier).
// Grid-first, not the sticky-header+rail-of-rows macro used elsewhere in
// this catalog.
import React, { useMemo, useRef, useState } from "react";
import { View, Text, FlatList, SafeAreaView, StyleSheet } from "react-native";
import { tokens } from "../../../tokens";
import { BADGES, CURRENT_POINTS, TIERS, type Badge } from "./data";
import { ActionBar, BadgeCell, TierPerksSection } from "./components";

export default function SellerBadgeTrackerScreen() {
  const [perksExpanded, setPerksExpanded] = useState(false);
  const [announceText, setAnnounceText] = useState("");
  const listRef = useRef<FlatList<Badge>>(null);

  const { currentTier, nextTier, progressFraction, pointsToNext } = useMemo(() => {
    const sorted = [...TIERS].sort((a, b) => a.minPoints - b.minPoints);
    let current = sorted[0];
    for (const tier of sorted) {
      if (CURRENT_POINTS >= tier.minPoints) current = tier;
    }
    const next = sorted.find((t) => t.minPoints > current.minPoints) ?? null;
    const fraction = next
      ? (CURRENT_POINTS - current.minPoints) / (next.minPoints - current.minPoints)
      : 1;
    const toNext = next ? next.minPoints - CURRENT_POINTS : 0;
    return { currentTier: current, nextTier: next, progressFraction: fraction, pointsToNext: toNext };
  }, []);

  const earnedCount = useMemo(() => BADGES.filter((b) => b.earned).length, []);
  const progressPercent = Math.round(progressFraction * 100);

  const handleToggle = () => {
    const next = !perksExpanded;
    setPerksExpanded(next);
    setAnnounceText(
      next
        ? "Showing perks for every tier."
        : "Showing only your current tier's perks."
    );
    if (next) {
      requestAnimationFrame(() => {
        listRef.current?.scrollToEnd({ animated: true });
      });
    }
  };

  const header = (
    <View style={styles.header}>
      <Text accessibilityRole="header" style={styles.heading}>
        Seller Reputation Tier
      </Text>

      <View style={styles.tierCard}>
        <View style={styles.tierChip}>
          <Text style={styles.tierChipLevel}>{`LEVEL ${currentTier.level}`}</Text>
          <Text style={styles.tierChipName}>{currentTier.name}</Text>
        </View>

        <View
          accessibilityRole="progressbar"
          accessibilityValue={{ min: 0, max: 100, now: progressPercent }}
          accessibilityLabel={
            nextTier
              ? `${progressPercent}% of the way to ${nextTier.name}`
              : "Highest tier reached"
          }
          style={styles.progressTrack}
        >
          <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
        </View>

        <Text style={[styles.progressLabel, styles.tabularNums]}>
          {nextTier
            ? `${CURRENT_POINTS.toLocaleString()} / ${nextTier.minPoints.toLocaleString()} pts to ${nextTier.name}`
            : `${CURRENT_POINTS.toLocaleString()} pts — highest tier reached`}
        </Text>
        {nextTier ? (
          <Text style={styles.progressSubLabel}>
            {`${pointsToNext.toLocaleString()} points to go`}
          </Text>
        ) : null}
      </View>

      <Text style={styles.earnedSummary}>
        {`${earnedCount} of ${BADGES.length} badges earned`}
      </Text>

      <Text accessibilityRole="header" style={styles.badgesHeading}>
        Badges
      </Text>
    </View>
  );

  const footer = (
    <TierPerksSection
      tiers={TIERS}
      currentTierLevel={currentTier.level}
      expanded={perksExpanded}
      announceText={announceText}
    />
  );

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        ref={listRef}
        data={BADGES}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        ListHeaderComponent={header}
        ListFooterComponent={footer}
        contentContainerStyle={styles.gridContent}
        renderItem={({ item }) => <BadgeCell badge={item} />}
      />
      <ActionBar expanded={perksExpanded} onToggle={handleToggle} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  gridContent: {
    paddingHorizontal: tokens.space(4),
    paddingBottom: tokens.space(2),
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  header: {
    paddingTop: tokens.space(4),
    paddingBottom: tokens.space(2),
  },
  heading: {
    fontSize: 22,
    fontWeight: "700",
    color: tokens.color.ink,
    marginBottom: tokens.space(3),
  },
  tierCard: {
    borderWidth: 1,
    borderColor: tokens.color.accent,
    borderRadius: tokens.radius.md,
    padding: tokens.space(4),
    marginBottom: tokens.space(4),
  },
  tierChip: {
    marginBottom: tokens.space(3),
  },
  tierChipLevel: {
    fontSize: 11,
    fontWeight: "700",
    color: tokens.color.accent,
    letterSpacing: 0.5,
    marginBottom: tokens.space(1),
  },
  tierChipName: {
    fontSize: 18,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  progressTrack: {
    height: 8,
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.border,
    overflow: "hidden",
    marginBottom: tokens.space(2),
  },
  progressFill: {
    height: 8,
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.accent,
  },
  progressLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: tokens.color.ink2,
  },
  tabularNums: {
    fontVariant: ["tabular-nums"],
  },
  progressSubLabel: {
    fontSize: 12,
    color: tokens.color.muted,
    marginTop: tokens.space(1),
  },
  earnedSummary: {
    fontSize: 13,
    color: tokens.color.muted,
    marginBottom: tokens.space(3),
  },
  badgesHeading: {
    fontSize: 16,
    fontWeight: "700",
    color: tokens.color.ink,
    marginBottom: tokens.space(2),
  },
});
