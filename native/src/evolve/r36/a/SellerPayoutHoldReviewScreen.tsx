// native/src/evolve/r36/a/SellerPayoutHoldReviewScreen.tsx
//
// Seller Payout Hold Review — a blocked-workflow bottom-band state machine.
// The band at the bottom always names the single reason the payout cannot
// release yet. Pressing it jumps attention (via FlatList.scrollToIndex) to
// that unresolved requirement above. Resolving requirements re-narrates the
// band automatically; once every requirement is met, the band resolves into
// a distinct terminal view instead of leaving a dead disabled button.

import React, { useCallback, useEffect, useRef, useState } from "react";
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
  payoutHoldMeta,
  payoutRequirements,
  type PayoutRequirement,
  type RequirementStatus,
} from "./data";

type StatusMap = Record<string, RequirementStatus>;

function buildInitialStatusMap(): StatusMap {
  const map: StatusMap = {};
  for (const requirement of payoutRequirements) {
    map[requirement.id] = requirement.initialStatus;
  }
  return map;
}

export function SellerPayoutHoldReviewScreen() {
  const [statusById, setStatusById] = useState<StatusMap>(buildInitialStatusMap);
  const [spotlightId, setSpotlightId] = useState<string | null>(null);
  const [cueText, setCueText] = useState("");
  const cueTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const listRef = useRef<FlatList<PayoutRequirement>>(null);

  useEffect(() => {
    return () => {
      if (cueTimerRef.current) clearTimeout(cueTimerRef.current);
    };
  }, []);

  // Pattern (1) from the brief: a "just happened" transient message must be
  // actively cleared after a readable interval, or the alert role stays
  // stuck "on" forever after the first change.
  const raiseCue = useCallback((message: string) => {
    if (cueTimerRef.current) clearTimeout(cueTimerRef.current);
    setCueText(message);
    cueTimerRef.current = setTimeout(() => setCueText(""), 4200);
  }, []);

  const resolvedCount = payoutRequirements.filter(
    (r) => statusById[r.id] === "done"
  ).length;
  const totalCount = payoutRequirements.length;
  const nextUnresolved =
    payoutRequirements.find((r) => statusById[r.id] !== "done") ?? null;
  const holdFullyCleared = nextUnresolved === null;

  const handleBandPress = useCallback(() => {
    if (!nextUnresolved) return;
    const index = payoutRequirements.findIndex(
      (r) => r.id === nextUnresolved.id
    );
    setSpotlightId(nextUnresolved.id);
    listRef.current?.scrollToIndex({
      index,
      animated: true,
      viewPosition: 0.08,
    });
    raiseCue(`Jumped to the next blocker: ${nextUnresolved.title}`);
  }, [nextUnresolved, raiseCue]);

  const handleScrollFailure = useCallback(
    (info: { index: number; averageItemLength: number }) => {
      // Add one card-gap's worth of buffer on top of the naive index*averageItemLength
      // estimate, since the card list spacing itself isn't reflected in averageItemLength.
      const cardGapBuffer = tokens.space(3) * info.index;
      listRef.current?.scrollToOffset({
        offset: info.averageItemLength * info.index + cardGapBuffer,
        animated: true,
      });
    },
    []
  );

  const handleResolveRequirement = useCallback(
    (id: string) => {
      setStatusById((prev) => {
        if (prev[id] === "done") return prev;
        return { ...prev, [id]: "done" };
      });
    },
    []
  );

  // Announce the consequence of a resolve action after the status map has
  // actually changed, derived fresh each time rather than hand-tracked.
  const previousResolvedCountRef = useRef(resolvedCount);
  useEffect(() => {
    if (resolvedCount === previousResolvedCountRef.current) return;
    previousResolvedCountRef.current = resolvedCount;
    setSpotlightId(null);
    if (holdFullyCleared) {
      raiseCue("Every requirement is resolved. Your payout is releasing.");
    } else if (nextUnresolved) {
      raiseCue(`Resolved. Next up: ${nextUnresolved.title}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolvedCount]);

  const renderRequirement = useCallback(
    ({ item }: { item: PayoutRequirement }) => {
      const status = statusById[item.id];
      const isDone = status === "done";
      const isSpotlit = spotlightId === item.id && !isDone;
      return (
        <View
          style={[
            styles.requirementCard,
            isDone && styles.requirementCardDone,
            isSpotlit && styles.requirementCardSpotlit,
          ]}
        >
          <View style={styles.requirementTopRow}>
            <View
              style={[
                styles.statusGlyph,
                isDone ? styles.statusGlyphDone : styles.statusGlyphPending,
              ]}
              accessibilityElementsHidden
              importantForAccessibility="no-hide-descendants"
            >
              <Text
                style={
                  isDone ? styles.statusGlyphDoneText : styles.statusGlyphPendingText
                }
              >
                {isDone ? "✓" : "!"}
              </Text>
            </View>
            <Text style={styles.requirementTitle}>{item.title}</Text>
          </View>
          <Text style={styles.requirementDetail}>{item.detail}</Text>
          {isDone ? (
            <View style={styles.requirementResolvedTag}>
              <Text style={styles.requirementResolvedTagText}>Resolved</Text>
            </View>
          ) : (
            <Pressable
              onPress={() => handleResolveRequirement(item.id)}
              accessibilityRole="button"
              accessibilityLabel={item.actionLabel}
              accessibilityHint="Marks this requirement as resolved on this review screen."
              style={({ pressed }) => [
                styles.requirementActionButton,
                pressed && styles.requirementActionButtonPressed,
              ]}
            >
              <Text style={styles.requirementActionLabel}>{item.actionLabel}</Text>
            </Pressable>
          )}
        </View>
      );
    },
    [statusById, spotlightId, handleResolveRequirement]
  );

  const listHeader = (
    <View style={styles.headerBlock}>
      <Text style={styles.headerTitle} accessibilityRole="header">
        Payout On Hold
      </Text>
      <View style={styles.holdAmountCard}>
        <Text style={styles.holdAmountLabel}>Held since {payoutHoldMeta.holdStartedLabel}</Text>
        <Text style={styles.holdAmountValue}>{payoutHoldMeta.amountHeldLabel}</Text>
        <Text style={styles.holdTriggerText}>{payoutHoldMeta.triggerSummary}</Text>
      </View>
      <Text style={styles.sectionLabel} accessibilityRole="header">
        What's needed to release it
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.screenRoot}>
      <FlatList
        ref={listRef}
        data={payoutRequirements}
        keyExtractor={(item) => item.id}
        renderItem={renderRequirement}
        ListHeaderComponent={listHeader}
        onScrollToIndexFailed={handleScrollFailure}
        contentContainerStyle={styles.listContent}
      />

      <View style={styles.announcerWrap} accessibilityLiveRegion="polite">
        {cueText ? (
          <Text accessibilityRole="alert" style={styles.announcerText}>
            {cueText}
          </Text>
        ) : null}
      </View>

      {holdFullyCleared ? (
        <View style={styles.bandWrapResolved}>
          <View style={styles.bandResolvedGlyph}>
            <Text style={styles.bandResolvedGlyphText}>{"✓"}</Text>
          </View>
          <View style={styles.bandResolvedCopyBlock}>
            <Text style={styles.bandResolvedHeadline}>Hold released</Text>
            <Text style={styles.bandResolvedSub}>
              All {totalCount} requirements are resolved. {payoutHoldMeta.amountHeldLabel} will
              arrive in your linked account within 24 hours.
            </Text>
          </View>
        </View>
      ) : (
        <View style={styles.bandWrap}>
          <Text style={styles.progressCaption}>
            {resolvedCount} of {totalCount} requirements resolved
          </Text>
          <Text style={styles.bandNarration}>
            Payout can't release yet — {nextUnresolved?.title.toLowerCase()} is still needed.
          </Text>
          <Pressable
            onPress={handleBandPress}
            accessibilityRole="button"
            accessibilityLabel="Go to the next blocking requirement"
            accessibilityHint="Scrolls the checklist above to the next unresolved requirement."
            style={({ pressed }) => [
              styles.bandButton,
              pressed && styles.bandButtonPressed,
            ]}
          >
            <Text style={styles.bandButtonLabel}>Show me what's blocking it</Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screenRoot: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  listContent: {
    paddingHorizontal: tokens.space(4),
    paddingBottom: tokens.space(6),
  },
  headerBlock: {
    paddingTop: tokens.space(3),
    paddingBottom: tokens.space(2),
  },
  headerTitle: {
    fontSize: 32,
    lineHeight: 50,
    fontWeight: "700",
    color: tokens.color.ink,
    marginBottom: tokens.space(3),
  },
  holdAmountCard: {
    borderWidth: 1,
    borderColor: tokens.color.warningBorder,
    backgroundColor: tokens.color.warningBg,
    borderRadius: tokens.radius.md,
    padding: tokens.space(4),
    marginBottom: tokens.space(5),
  },
  holdAmountLabel: {
    fontSize: 14,
    lineHeight: 21,
    color: tokens.color.warning,
    marginBottom: tokens.space(1),
  },
  holdAmountValue: {
    fontSize: 24,
    lineHeight: 36,
    fontWeight: "700",
    color: tokens.color.ink,
    fontVariant: ["tabular-nums"],
    marginBottom: tokens.space(2),
  },
  holdTriggerText: {
    fontSize: 16,
    lineHeight: 24,
    color: tokens.color.muted,
  },
  sectionLabel: {
    fontSize: 18,
    lineHeight: 27,
    fontWeight: "600",
    color: tokens.color.ink,
    marginBottom: tokens.space(3),
  },
  requirementCard: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(4),
    marginBottom: tokens.space(3),
    backgroundColor: tokens.color.bg,
  },
  requirementCardDone: {
    borderColor: tokens.color.successBorder,
    backgroundColor: tokens.color.successBg,
  },
  requirementCardSpotlit: {
    borderColor: tokens.color.accent,
    backgroundColor: tokens.color.accentBg,
  },
  requirementTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: tokens.space(2),
  },
  statusGlyph: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: tokens.space(2),
    marginTop: 2,
  },
  statusGlyphPending: {
    backgroundColor: tokens.color.warningBg,
    borderWidth: 1,
    borderColor: tokens.color.warningBorder,
  },
  statusGlyphDone: {
    backgroundColor: tokens.color.successBg,
    borderWidth: 1,
    borderColor: tokens.color.successBorder,
  },
  statusGlyphPendingText: {
    fontSize: 14,
    lineHeight: 14,
    fontWeight: "700",
    color: tokens.color.warning,
  },
  statusGlyphDoneText: {
    fontSize: 14,
    lineHeight: 14,
    fontWeight: "700",
    color: tokens.color.success,
  },
  requirementTitle: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
    color: tokens.color.ink,
  },
  requirementDetail: {
    fontSize: 14,
    lineHeight: 21,
    color: tokens.color.muted,
    marginBottom: tokens.space(3),
  },
  requirementActionButton: {
    minHeight: 44,
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.ink,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: tokens.space(4),
  },
  requirementActionButtonPressed: {
    backgroundColor: tokens.color.ink2,
  },
  requirementActionLabel: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
    color: tokens.color.onInk,
  },
  requirementResolvedTag: {
    alignSelf: "flex-start",
    minHeight: 28,
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.successBg,
    borderWidth: 1,
    borderColor: tokens.color.successBorder,
    paddingHorizontal: tokens.space(3),
    alignItems: "center",
    justifyContent: "center",
  },
  requirementResolvedTagText: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "600",
    color: tokens.color.success,
  },
  announcerWrap: {
    paddingHorizontal: tokens.space(4),
  },
  announcerText: {
    fontSize: 12,
    lineHeight: 18,
    color: tokens.color.accent,
    paddingBottom: tokens.space(1),
  },
  bandWrap: {
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    paddingHorizontal: tokens.space(4),
    paddingTop: tokens.space(3),
    paddingBottom: tokens.space(4),
  },
  progressCaption: {
    fontSize: 12,
    lineHeight: 18,
    color: tokens.color.faint,
    marginBottom: tokens.space(1),
    fontVariant: ["tabular-nums"],
  },
  bandNarration: {
    fontSize: 16,
    lineHeight: 24,
    color: tokens.color.ink,
    marginBottom: tokens.space(3),
  },
  bandButton: {
    minHeight: 44,
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  bandButtonPressed: {
    backgroundColor: tokens.color.ink2,
  },
  bandButtonLabel: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
    color: tokens.color.onAccent,
  },
  bandWrapResolved: {
    borderTopWidth: 1,
    borderTopColor: tokens.color.successBorder,
    backgroundColor: tokens.color.successBg,
    paddingHorizontal: tokens.space(4),
    paddingVertical: tokens.space(4),
    flexDirection: "row",
    alignItems: "flex-start",
  },
  bandResolvedGlyph: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: tokens.color.success,
    alignItems: "center",
    justifyContent: "center",
    marginRight: tokens.space(3),
  },
  bandResolvedGlyphText: {
    fontSize: 16,
    lineHeight: 16,
    fontWeight: "700",
    color: tokens.color.onInk,
  },
  bandResolvedCopyBlock: {
    flex: 1,
  },
  bandResolvedHeadline: {
    fontSize: 18,
    lineHeight: 27,
    fontWeight: "700",
    color: tokens.color.success,
    marginBottom: tokens.space(1),
  },
  bandResolvedSub: {
    fontSize: 14,
    lineHeight: 21,
    color: tokens.color.ink2,
  },
});

export default SellerPayoutHoldReviewScreen;
