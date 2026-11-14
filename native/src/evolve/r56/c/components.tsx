// native/src/evolve/r56/c/components.tsx — auto-native-r56 candidate c
//
// Sibling presentational pieces for SellerTierProgressScreen: the tier
// progress meter (hero section) and a single milestone badge row (FlatList
// renderItem). Written fresh for this screen — no identifiers borrowed from
// other catalog entries.
import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { tokens } from "../../../tokens";
import { MilestoneBadge, MilestoneStatus } from "./data";

export function TierMeter({
  fillRatio,
  trackLabel,
}: {
  fillRatio: number;
  trackLabel: string;
}) {
  const clampedPercent = Math.max(0, Math.min(1, fillRatio)) * 100;
  return (
    <View
      style={styles.meterTrack}
      accessibilityRole="progressbar"
      accessibilityLabel={trackLabel}
      accessibilityValue={{ min: 0, max: 100, now: Math.round(clampedPercent) }}
    >
      <View style={[styles.meterFill, { width: `${clampedPercent}%` }]} />
    </View>
  );
}

export function MilestoneBadgeRow({
  badge,
  expanded,
  onToggleExpanded,
}: {
  badge: MilestoneBadge;
  expanded: boolean;
  onToggleExpanded: (id: string) => void;
}) {
  const detailText =
    badge.status === "achieved" ? badge.achievedDetail : badge.pendingDetail;
  const statusWordText = badge.status === "achieved" ? "Achieved" : "Pending";

  return (
    <Pressable
      onPress={() => onToggleExpanded(badge.id)}
      accessibilityRole="button"
      accessibilityState={{ expanded }}
      accessibilityLabel={`${badge.title}, ${statusWordText.toLowerCase()}. ${
        expanded ? "Double tap to collapse details." : "Double tap to see details."
      }`}
      hitSlop={8}
      style={({ pressed }) => [
        styles.row,
        pressed && styles.rowPressed,
      ]}
    >
      <View style={styles.rowTop}>
        <BadgeGlyphIcon glyph={badge.glyph} status={badge.status} />
        <View style={styles.rowBody}>
          <View style={styles.rowTitleLine}>
            <Text
              style={[
                styles.rowTitle,
                badge.status === "pending" && styles.rowTitlePending,
              ]}
            >
              {badge.title}
            </Text>
            <View
              style={[
                styles.statusChip,
                badge.status === "achieved" ? styles.statusChipAchieved : styles.statusChipPending,
              ]}
            >
              <Text
                style={[
                  styles.statusChipText,
                  badge.status === "achieved"
                    ? styles.statusChipTextAchieved
                    : styles.statusChipTextPending,
                ]}
              >
                {statusWordText}
              </Text>
            </View>
          </View>
          <Text
            style={[
              styles.rowSummary,
              badge.status === "pending" && styles.rowSummaryPending,
            ]}
          >
            {badge.summary}
          </Text>
        </View>
        <View
          style={styles.chevron}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        >
          <Text style={styles.chevronGlyph}>{expanded ? "−" : "+"}</Text>
        </View>
      </View>
      {expanded && detailText ? (
        <View style={styles.rowDetail}>
          <Text style={styles.rowDetailText}>{detailText}</Text>
        </View>
      ) : null}
    </Pressable>
  );
}

function BadgeGlyphIcon({
  glyph,
  status,
}: {
  glyph: string;
  status: MilestoneStatus;
}) {
  return (
    <View
      style={[
        styles.glyphCircle,
        status === "achieved" ? styles.glyphCircleAchieved : styles.glyphCirclePending,
      ]}
    >
      <Text
        style={[
          styles.glyphText,
          status === "achieved" ? styles.glyphTextAchieved : styles.glyphTextPending,
        ]}
      >
        {glyph}
      </Text>
    </View>
  );
}

const GLYPH_SIZE = 36;

const styles = StyleSheet.create({
  meterTrack: {
    height: 10,
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.border,
    overflow: "hidden",
  },
  meterFill: {
    height: "100%",
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.accent,
  },
  row: {
    borderRadius: tokens.radius.md,
    paddingVertical: tokens.space(3),
    paddingHorizontal: tokens.space(3),
    borderWidth: 1,
    borderColor: tokens.color.border,
    marginBottom: tokens.space(3),
    backgroundColor: tokens.color.bg,
  },
  rowPressed: {
    backgroundColor: tokens.color.accentBg,
  },
  rowTop: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  glyphCircle: {
    width: GLYPH_SIZE,
    height: GLYPH_SIZE,
    borderRadius: GLYPH_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
  },
  glyphCircleAchieved: {
    backgroundColor: tokens.color.accent,
    borderColor: tokens.color.accent,
  },
  glyphCirclePending: {
    backgroundColor: tokens.color.bg,
    borderColor: tokens.color.border,
  },
  glyphText: {
    fontSize: 12,
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
  },
  glyphTextAchieved: {
    color: tokens.color.onAccent,
  },
  glyphTextPending: {
    color: tokens.color.faint,
  },
  rowBody: {
    flex: 1,
    marginLeft: tokens.space(3),
  },
  rowTitleLine: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.ink,
    marginRight: tokens.space(2),
  },
  rowTitlePending: {
    color: tokens.color.muted,
  },
  rowSummary: {
    marginTop: tokens.space(1) / 2,
    fontSize: 13,
    color: tokens.color.muted,
    lineHeight: 18,
  },
  rowSummaryPending: {
    color: tokens.color.faint,
  },
  statusChip: {
    paddingHorizontal: tokens.space(2),
    paddingVertical: tokens.space(1) / 2,
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
  },
  statusChipAchieved: {
    backgroundColor: tokens.color.successBg,
    borderColor: tokens.color.successBorder,
  },
  statusChipPending: {
    backgroundColor: tokens.color.bg,
    borderColor: tokens.color.border,
  },
  statusChipText: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  statusChipTextAchieved: {
    color: tokens.color.success,
  },
  statusChipTextPending: {
    color: tokens.color.faint,
  },
  chevron: {
    width: 20,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: tokens.space(1),
  },
  chevronGlyph: {
    fontSize: 16,
    fontWeight: "700",
    color: tokens.color.faint,
  },
  rowDetail: {
    marginTop: tokens.space(2),
    paddingTop: tokens.space(2),
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    marginLeft: GLYPH_SIZE + tokens.space(3),
  },
  rowDetailText: {
    fontSize: 13,
    color: tokens.color.ink2,
    lineHeight: 18,
  },
});
