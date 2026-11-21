// native/src/evolve/r26/b/SellerRatingSummaryScreen.tsx
// Read-only completed-record screen: a seller's aggregate rating breakdown
// plus the scrollable list of individual written reviews behind it. Nothing
// on this screen is blocked or in-progress, so per the bottom-band doctrine
// it carries a persistent always-visible action bar (not a state machine).
import React, { useMemo, useState } from "react";
import { View, Text, Pressable, FlatList, SafeAreaView, StyleSheet } from "react-native";
import { tokens } from "../../../tokens";
import {
  ratingEntries,
  sellerDisplayName,
  sellerSinceLabel,
  averageForLens,
  distributionForLens,
  SCORE_LENS_LABEL,
  SCORE_LENS_ORDER,
  RatingEntry,
  ScoreLens,
  StarCount,
} from "./data";

type FlagStage = "dormant" | "pending" | "logged";

function StarGlyphRow({ value, size = 16 }: { value: number; size?: number }) {
  const filled = Math.round(value);
  const positions: number[] = [1, 2, 3, 4, 5];
  return (
    <View style={styles.starGlyphRow}>
      {positions.map((p) => (
        <Text
          key={p}
          style={[
            styles.starGlyph,
            { fontSize: size },
            p <= filled ? styles.starGlyphLit : styles.starGlyphDim,
          ]}
        >
          {p <= filled ? "★" : "☆"}
        </Text>
      ))}
    </View>
  );
}

function ReviewRow({
  entry,
  flagStage,
  onFlagStart,
  onFlagCancel,
  onFlagLog,
}: {
  entry: RatingEntry;
  flagStage: FlagStage;
  onFlagStart: () => void;
  onFlagCancel: () => void;
  onFlagLog: () => void;
}) {
  return (
    <View style={styles.reviewCard}>
      <View style={styles.reviewHeaderRow}>
        <View style={styles.reviewHeaderText}>
          <Text style={styles.reviewAuthor}>{entry.buyerLabel}</Text>
          <Text style={styles.reviewMeta}>{entry.gearContext}</Text>
        </View>
        <StarGlyphRow value={entry.overallStars} />
      </View>
      <Text style={styles.reviewMeta}>{entry.postedLabel}</Text>
      <Text style={styles.reviewBody}>{entry.body}</Text>

      <View style={styles.reviewTagRow}>
        <Text style={styles.reviewTag}>Item {entry.categoryStars.itemAsDescribed}★</Text>
        <Text style={styles.reviewTag}>Shipping {entry.categoryStars.shippingSpeed}★</Text>
        <Text style={styles.reviewTag}>Comms {entry.categoryStars.communication}★</Text>
      </View>

      <View style={styles.reviewFooterRow}>
        <Text style={styles.usefulText}>{entry.usefulVotes} buyers found this useful</Text>

        {flagStage === "dormant" && (
          <Pressable
            onPress={onFlagStart}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={styles.flagTrigger}
            accessibilityRole="button"
            accessibilityLabel={`Flag review from ${entry.buyerLabel} for moderator review`}
          >
            <Text style={styles.flagTriggerText}>Flag</Text>
          </Pressable>
        )}

        {flagStage === "logged" && (
          <View style={styles.flagLoggedBadge}>
            <Text style={styles.flagLoggedText}>Flagged — pending moderation</Text>
          </View>
        )}
      </View>

      {flagStage === "pending" && (
        <View style={styles.flagConfirmBlock} accessibilityLiveRegion="polite">
          <Text style={styles.flagConfirmPrompt} accessibilityRole="alert">
            Send this review to moderation? Your seller account stays attached to the report.
          </Text>
          <View style={styles.flagConfirmRow}>
            <Pressable
              onPress={onFlagCancel}
              style={styles.flagCancelButton}
              accessibilityRole="button"
              accessibilityLabel="Cancel flagging this review"
            >
              <Text style={styles.flagCancelButtonText}>Cancel</Text>
            </Pressable>
            <Pressable
              onPress={onFlagLog}
              style={styles.flagConfirmButton}
              accessibilityRole="button"
              accessibilityLabel="Confirm flag for moderation"
            >
              <Text style={styles.flagConfirmButtonText}>Confirm flag</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

export function SellerRatingSummaryScreen() {
  const [activeLens, setActiveLens] = useState<ScoreLens>("overall");
  const [flagStages, setFlagStages] = useState<Record<string, FlagStage>>({});
  const [shareEchoOpen, setShareEchoOpen] = useState(false);

  const totalReviews = ratingEntries.length;
  const lensAverage = useMemo(() => averageForLens(ratingEntries, activeLens), [activeLens]);
  const lensDistribution = useMemo(
    () => distributionForLens(ratingEntries, activeLens),
    [activeLens]
  );
  const maxBucketCount = useMemo(
    () => Math.max(...(Object.values(lensDistribution) as number[]), 1),
    [lensDistribution]
  );

  function stageFor(id: string): FlagStage {
    return flagStages[id] ?? "dormant";
  }

  function handleFlagStart(id: string) {
    setFlagStages((prev) => ({ ...prev, [id]: "pending" }));
  }
  function handleFlagCancel(id: string) {
    setFlagStages((prev) => ({ ...prev, [id]: "dormant" }));
  }
  function handleFlagLog(id: string) {
    setFlagStages((prev) => ({ ...prev, [id]: "logged" }));
  }

  function handleShareToggle() {
    setShareEchoOpen((v) => !v);
  }

  const shareEchoLine = `Share preview ready — ${sellerDisplayName} · ${SCORE_LENS_LABEL[activeLens]} ${lensAverage.toFixed(
    1
  )}★ from ${totalReviews} reviews · link copied to clipboard.`;

  const listHeader = (
    <View>
      <Text style={styles.screenHeading} accessibilityRole="header">
        Seller Rating Summary
      </Text>
      <Text style={styles.sellerName}>{sellerDisplayName}</Text>
      <Text style={styles.sellerSince}>{sellerSinceLabel}</Text>

      <View style={styles.heroCard}>
        <View accessibilityLiveRegion="polite">
          <Text style={styles.heroScore}>{lensAverage.toFixed(1)}</Text>
        </View>
        <StarGlyphRow value={lensAverage} size={22} />
        <Text style={styles.heroSubline}>
          {SCORE_LENS_LABEL[activeLens]} · {totalReviews} written reviews
        </Text>
      </View>

      <View style={styles.lensChipRow}>
        {SCORE_LENS_ORDER.map((lens) => {
          const active = lens === activeLens;
          return (
            <Pressable
              key={lens}
              onPress={() => setActiveLens(lens)}
              style={[styles.lensChip, active && styles.lensChipActive]}
              accessibilityRole="button"
              accessibilityLabel={`View ${SCORE_LENS_LABEL[lens]} breakdown`}
              accessibilityState={{ selected: active }}
            >
              <Text style={[styles.lensChipText, active && styles.lensChipTextActive]}>
                {SCORE_LENS_LABEL[lens]}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.sectionHeading} accessibilityRole="header">
        Rating breakdown
      </Text>
      <View style={styles.distributionBlock}>
        {([5, 4, 3, 2, 1] as StarCount[]).map((bucket) => {
          const count = lensDistribution[bucket];
          const pct = Math.round((count / maxBucketCount) * 100);
          return (
            <View key={bucket} style={styles.distributionRow}>
              <Text style={styles.distributionLabel}>{bucket}★</Text>
              <View style={styles.distributionTrack}>
                <View style={[styles.distributionFill, { width: `${pct}%` }]} />
              </View>
              <Text style={styles.distributionCount}>{count}</Text>
            </View>
          );
        })}
      </View>

      <Text style={styles.sectionHeading} accessibilityRole="header">
        Category scores
      </Text>
      <View style={styles.subScoreGrid}>
        {(["itemAsDescribed", "shippingSpeed", "communication"] as ScoreLens[]).map((lens) => (
          <View key={lens} style={styles.subScoreCell}>
            <Text style={styles.subScoreValue}>
              {averageForLens(ratingEntries, lens).toFixed(1)}
            </Text>
            <Text style={styles.subScoreLabel}>{SCORE_LENS_LABEL[lens]}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.sectionHeading} accessibilityRole="header">
        Individual reviews
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={ratingEntries}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={listHeader}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <ReviewRow
            entry={item}
            flagStage={stageFor(item.id)}
            onFlagStart={() => handleFlagStart(item.id)}
            onFlagCancel={() => handleFlagCancel(item.id)}
            onFlagLog={() => handleFlagLog(item.id)}
          />
        )}
      />

      <View style={styles.actionBar}>
        {shareEchoOpen && (
          <View style={styles.shareEchoPanel} accessibilityLiveRegion="polite">
            <Text style={styles.shareEchoText} accessibilityRole="alert">
              {shareEchoLine}
            </Text>
          </View>
        )}
        <View style={styles.actionBarRow}>
          <View style={styles.actionBarSummary}>
            <Text style={styles.actionBarSummaryScore}>{lensAverage.toFixed(1)}★</Text>
            <Text style={styles.actionBarSummaryCount}>{totalReviews} reviews</Text>
          </View>
          <Pressable
            onPress={handleShareToggle}
            style={styles.shareButton}
            accessibilityRole="button"
            accessibilityLabel={
              shareEchoOpen ? "Hide rating summary share preview" : "Share rating summary"
            }
          >
            <Text style={styles.shareButtonText}>
              {shareEchoOpen ? "Hide preview" : "Share rating summary"}
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default SellerRatingSummaryScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  listContent: {
    paddingHorizontal: tokens.space(4),
    paddingBottom: tokens.space(10),
  },
  screenHeading: {
    fontSize: 24,
    fontWeight: "700",
    color: tokens.color.ink,
    marginTop: tokens.space(4),
  },
  sellerName: {
    fontSize: 16,
    fontWeight: "600",
    color: tokens.color.ink2,
    marginTop: tokens.space(3),
  },
  sellerSince: {
    fontSize: 13,
    color: tokens.color.faint,
    marginTop: tokens.space(1),
    marginBottom: tokens.space(4),
  },
  heroCard: {
    backgroundColor: tokens.color.accentBg,
    borderRadius: tokens.radius.md,
    paddingVertical: tokens.space(5),
    paddingHorizontal: tokens.space(4),
    alignItems: "center",
  },
  heroScore: {
    fontSize: 44,
    fontWeight: "700",
    color: tokens.color.ink,
    fontVariant: ["tabular-nums"],
  },
  heroSubline: {
    fontSize: 13,
    color: tokens.color.muted,
    marginTop: tokens.space(2),
  },
  starGlyphRow: {
    flexDirection: "row",
    marginTop: tokens.space(1),
  },
  starGlyph: {
    marginHorizontal: 1,
  },
  starGlyphLit: {
    color: tokens.color.accent,
  },
  starGlyphDim: {
    color: tokens.color.border,
  },
  lensChipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: tokens.space(4),
    gap: tokens.space(2),
  },
  lensChip: {
    minHeight: 44,
    paddingHorizontal: tokens.space(3),
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
  },
  lensChipActive: {
    backgroundColor: tokens.color.accent,
    borderColor: tokens.color.accent,
  },
  lensChipText: {
    fontSize: 13,
    fontWeight: "600",
    color: tokens.color.ink2,
  },
  lensChipTextActive: {
    color: tokens.color.onAccent,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: "700",
    color: tokens.color.ink,
    marginTop: tokens.space(6),
    marginBottom: tokens.space(3),
  },
  distributionBlock: {
    gap: tokens.space(2),
  },
  distributionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.space(2),
  },
  distributionLabel: {
    width: 28,
    fontSize: 13,
    color: tokens.color.muted,
    fontVariant: ["tabular-nums"],
  },
  distributionTrack: {
    flex: 1,
    height: 8,
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.border,
    overflow: "hidden",
  },
  distributionFill: {
    height: 8,
    backgroundColor: tokens.color.accent,
    borderRadius: tokens.radius.sm,
  },
  distributionCount: {
    width: 30,
    fontSize: 13,
    color: tokens.color.muted,
    textAlign: "right",
    fontVariant: ["tabular-nums"],
  },
  subScoreGrid: {
    flexDirection: "row",
    gap: tokens.space(3),
  },
  subScoreCell: {
    flex: 1,
    backgroundColor: tokens.color.bg,
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    paddingVertical: tokens.space(3),
    alignItems: "center",
  },
  subScoreValue: {
    fontSize: 20,
    fontWeight: "700",
    color: tokens.color.ink,
    fontVariant: ["tabular-nums"],
  },
  subScoreLabel: {
    fontSize: 12,
    color: tokens.color.faint,
    marginTop: tokens.space(1),
    textAlign: "center",
  },
  reviewCard: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(4),
    marginBottom: tokens.space(3),
  },
  reviewHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: tokens.space(2),
  },
  reviewHeaderText: {
    flex: 1,
  },
  reviewAuthor: {
    fontSize: 14,
    fontWeight: "600",
    color: tokens.color.ink,
  },
  reviewMeta: {
    fontSize: 12,
    color: tokens.color.faint,
    marginTop: tokens.space(1),
  },
  reviewBody: {
    fontSize: 14,
    color: tokens.color.ink2,
    marginTop: tokens.space(2),
    lineHeight: 20,
  },
  reviewTagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: tokens.space(2),
    marginTop: tokens.space(3),
  },
  reviewTag: {
    fontSize: 11,
    fontWeight: "600",
    color: tokens.color.muted,
    backgroundColor: tokens.color.accentBg,
    paddingHorizontal: tokens.space(2),
    paddingVertical: tokens.space(1),
    borderRadius: tokens.radius.sm,
    overflow: "hidden",
  },
  reviewFooterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: tokens.space(3),
  },
  usefulText: {
    fontSize: 12,
    color: tokens.color.faint,
  },
  flagTrigger: {
    minHeight: 44,
    minWidth: 44,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: tokens.space(2),
  },
  flagTriggerText: {
    fontSize: 13,
    fontWeight: "600",
    color: tokens.color.danger,
  },
  flagLoggedBadge: {
    backgroundColor: tokens.color.warningBg,
    borderWidth: 1,
    borderColor: tokens.color.warningBorder,
    borderRadius: tokens.radius.sm,
    paddingHorizontal: tokens.space(2),
    paddingVertical: tokens.space(1),
  },
  flagLoggedText: {
    fontSize: 12,
    fontWeight: "600",
    color: tokens.color.warning,
  },
  flagConfirmBlock: {
    marginTop: tokens.space(3),
    backgroundColor: tokens.color.dangerBg,
    borderWidth: 1,
    borderColor: tokens.color.dangerBorder,
    borderRadius: tokens.radius.sm,
    padding: tokens.space(3),
  },
  flagConfirmPrompt: {
    fontSize: 13,
    color: tokens.color.danger,
    lineHeight: 18,
  },
  flagConfirmRow: {
    flexDirection: "row",
    gap: tokens.space(3),
    marginTop: tokens.space(3),
  },
  flagCancelButton: {
    flex: 1,
    minHeight: 44,
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
  },
  flagCancelButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: tokens.color.ink2,
  },
  flagConfirmButton: {
    flex: 1,
    minHeight: 44,
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.danger,
    alignItems: "center",
    justifyContent: "center",
  },
  flagConfirmButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: tokens.color.onInk,
  },
  actionBar: {
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    paddingHorizontal: tokens.space(4),
    paddingTop: tokens.space(3),
    paddingBottom: tokens.space(4),
  },
  actionBarRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: tokens.space(3),
  },
  actionBarSummary: {
    flexShrink: 1,
  },
  actionBarSummaryScore: {
    fontSize: 16,
    fontWeight: "700",
    color: tokens.color.ink,
    fontVariant: ["tabular-nums"],
  },
  actionBarSummaryCount: {
    fontSize: 12,
    color: tokens.color.faint,
    marginTop: 2,
  },
  shareButton: {
    minHeight: 44,
    paddingHorizontal: tokens.space(4),
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  shareButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.onAccent,
  },
  shareEchoPanel: {
    backgroundColor: tokens.color.accentBg,
    borderRadius: tokens.radius.sm,
    padding: tokens.space(3),
    marginBottom: tokens.space(3),
  },
  shareEchoText: {
    fontSize: 12,
    color: tokens.color.ink2,
    lineHeight: 17,
  },
});
