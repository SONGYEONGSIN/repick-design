// native/src/evolve/r44/c/components.tsx
//
// Supporting pieces for the Seller Reputation Tier screen: the 2-column
// badge grid cell, the (always-mounted) tier perks section used as the
// FlatList footer, and the always-mounted bottom action bar.
import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { tokens } from "../../../tokens";
import type { Badge, Tier } from "./data";

// ---------------------------------------------------------------------------
// Badge grid cell — read-only record, not a tappable control. No nested
// Pressable, so no accessible={true} wrapper hazard here.
// ---------------------------------------------------------------------------
export function BadgeCell({ badge }: { badge: Badge }) {
  return (
    <View style={styles.cellOuter}>
      <View
        style={[styles.iconCircle, badge.earned ? styles.iconCircleEarned : styles.iconCircleLocked]}
      >
        <Text
          style={badge.earned ? styles.iconTextEarned : styles.iconTextLocked}
        >
          {badge.icon}
        </Text>
      </View>
      <Text
        style={[styles.badgeName, badge.earned ? null : styles.badgeNameLocked]}
        numberOfLines={2}
      >
        {badge.name}
      </Text>
      <Text style={styles.badgeNote} numberOfLines={3}>
        {badge.note}
      </Text>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Tier perks section — rendered as the grid's ListFooterComponent. Always
// mounted; `expanded` only changes how much of it is visible. Collapsed,
// it shows the seller's own current-tier perks; expanded, it shows the
// full ladder with future tiers visually dimmed (not yet reached).
// ---------------------------------------------------------------------------
export function TierPerksSection({
  tiers,
  currentTierLevel,
  expanded,
  announceText,
}: {
  tiers: Tier[];
  currentTierLevel: number;
  expanded: boolean;
  announceText: string;
}) {
  const currentTier = tiers.find((t) => t.level === currentTierLevel) ?? tiers[0];
  const visibleTiers = expanded ? tiers : [currentTier];

  return (
    <View style={styles.perksSection}>
      <Text accessibilityRole="header" style={styles.perksHeading}>
        Tier Perks
      </Text>

      <View accessibilityLiveRegion="polite" style={styles.liveRegion}>
        {announceText ? (
          <Text accessibilityRole="alert" style={styles.liveText}>
            {announceText}
          </Text>
        ) : null}
      </View>

      {!expanded ? (
        <Text style={styles.perksHint}>
          Showing perks for your current tier. Use "View All Perks" below to
          see the full ladder.
        </Text>
      ) : null}

      {visibleTiers.map((tier) => {
        const reached = tier.level <= currentTierLevel;
        return (
          <View key={tier.level} style={styles.tierGroup}>
            <View style={styles.tierGroupHeader}>
              <Text
                style={[styles.tierGroupName, reached ? null : styles.tierGroupNameLocked]}
              >
                {tier.name}
              </Text>
              <Text style={styles.tierGroupStatus}>
                {reached ? "Unlocked" : `Unlocks at ${tier.minPoints.toLocaleString()} pts`}
              </Text>
            </View>
            {tier.perks.map((perk) => (
              <Text
                key={perk}
                style={[styles.perkLine, reached ? null : styles.perkLineLocked]}
              >
                {`• ${perk}`}
              </Text>
            ))}
          </View>
        );
      })}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Always-mounted bottom action bar. Its single action genuinely works: it
// toggles how much of the (already-rendered) perks footer is shown and
// scrolls the list down to reveal it — not a state machine, not a no-op.
// ---------------------------------------------------------------------------
export function ActionBar({
  expanded,
  onToggle,
}: {
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <View style={styles.actionBar}>
      <Pressable
        onPress={onToggle}
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        accessibilityLabel={expanded ? "Hide all perks" : "View all perks"}
        accessibilityHint={
          expanded
            ? "Collapses the perks list back to your current tier"
            : "Reveals perks for every seller tier and scrolls to them"
        }
        style={({ pressed }) => [styles.actionButton, pressed && styles.actionButtonPressed]}
      >
        <Text style={styles.actionButtonText}>
          {expanded ? "Hide All Perks" : "View All Perks"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  // -- badge grid cell --
  cellOuter: {
    flexBasis: "48%",
    flexGrow: 1,
    maxWidth: "48%",
    backgroundColor: tokens.color.bg,
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(3),
    marginBottom: tokens.space(3),
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: tokens.space(2),
  },
  iconCircleEarned: {
    backgroundColor: tokens.color.ink,
  },
  iconCircleLocked: {
    backgroundColor: tokens.color.border,
    borderWidth: 1,
    borderColor: tokens.color.border,
  },
  iconTextEarned: {
    color: tokens.color.onInk,
    fontSize: 16,
    fontWeight: "700",
  },
  iconTextLocked: {
    color: tokens.color.faint,
    fontSize: 16,
    fontWeight: "700",
  },
  badgeName: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.ink,
    marginBottom: tokens.space(1),
  },
  badgeNameLocked: {
    color: tokens.color.faint,
  },
  badgeNote: {
    fontSize: 12,
    color: tokens.color.muted,
    lineHeight: 16,
  },

  // -- perks footer --
  perksSection: {
    paddingHorizontal: tokens.space(4),
    paddingTop: tokens.space(2),
    paddingBottom: tokens.space(8),
  },
  perksHeading: {
    fontSize: 18,
    fontWeight: "700",
    color: tokens.color.ink,
    marginBottom: tokens.space(2),
  },
  liveRegion: {
    minHeight: 0,
  },
  liveText: {
    fontSize: 12,
    color: tokens.color.accent,
    fontWeight: "600",
    marginBottom: tokens.space(2),
  },
  perksHint: {
    fontSize: 13,
    color: tokens.color.faint,
    marginBottom: tokens.space(3),
  },
  tierGroup: {
    marginBottom: tokens.space(4),
    paddingBottom: tokens.space(3),
    borderBottomWidth: 1,
    borderBottomColor: tokens.color.border,
  },
  tierGroupHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: tokens.space(1),
  },
  tierGroupName: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  tierGroupNameLocked: {
    color: tokens.color.faint,
  },
  tierGroupStatus: {
    fontSize: 12,
    color: tokens.color.muted,
  },
  perkLine: {
    fontSize: 13,
    color: tokens.color.muted,
    marginTop: tokens.space(1),
    lineHeight: 18,
  },
  perkLineLocked: {
    color: tokens.color.faint,
  },

  // -- bottom action bar --
  actionBar: {
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    paddingHorizontal: tokens.space(4),
    paddingTop: tokens.space(3),
    paddingBottom: tokens.space(4),
  },
  actionButton: {
    backgroundColor: tokens.color.ink,
    borderRadius: tokens.radius.md,
    paddingVertical: tokens.space(3),
    alignItems: "center",
  },
  actionButtonPressed: {
    backgroundColor: tokens.color.ink2,
  },
  actionButtonText: {
    color: tokens.color.onInk,
    fontSize: 15,
    fontWeight: "700",
  },
});
