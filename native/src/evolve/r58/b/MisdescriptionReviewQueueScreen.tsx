// native/src/evolve/r58/b/MisdescriptionReviewQueueScreen.tsx
//
// Candidate b — "Mis-description Review Queue"
// Macro shape: sticky TOP progress counter, no bottom band at all.
// Each row is an independent, row-scoped destructive confirmation
// (Cancel/Confirm flips the row itself in place — never a native Alert).

import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { tokens } from "../../../tokens";
import { flaggedListings, FlaggedListing } from "./data";

type RowStatus = "needs_review" | "confirming_relist" | "dismissed" | "relisted";
type RowStateMap = Record<string, RowStatus>;

function buildInitialRowState(items: FlaggedListing[]): RowStateMap {
  const initial: RowStateMap = {};
  for (const item of items) {
    initial[item.id] = "needs_review";
  }
  return initial;
}

export default function MisdescriptionReviewQueueScreen() {
  const [rowState, setRowState] = useState<RowStateMap>(() =>
    buildInitialRowState(flaggedListings)
  );

  // Single pass over the live state shape, recomputed fresh every render —
  // never a separately-incremented counter variable.
  const reviewedCount = useMemo(() => {
    let count = 0;
    for (const status of Object.values(rowState)) {
      if (status === "dismissed" || status === "relisted") count += 1;
    }
    return count;
  }, [rowState]);

  const total = flaggedListings.length;
  const allReviewed = reviewedCount === total;
  const counterText = allReviewed
    ? "All reviewed"
    : `${reviewedCount} of ${total} reviewed`;

  const handleDismiss = (id: string) => {
    setRowState((prev) => ({ ...prev, [id]: "dismissed" }));
  };

  const handleStartRelist = (id: string) => {
    setRowState((prev) => ({ ...prev, [id]: "confirming_relist" }));
  };

  const handleCancelRelist = (id: string) => {
    setRowState((prev) => ({ ...prev, [id]: "needs_review" }));
  };

  const handleConfirmRelist = (id: string) => {
    setRowState((prev) => ({ ...prev, [id]: "relisted" }));
  };

  const renderItem = ({ item }: { item: FlaggedListing }) => {
    const status = rowState[item.id];

    return (
      <View
        style={styles.rowCard}
        // Row-scoped live region: only this row's confirmation text is
        // announced when it changes, not the whole screen.
        accessibilityLiveRegion="polite"
      >
        <Text style={styles.rowTitle}>{item.title}</Text>
        <Text style={styles.rowPrice}>{item.priceLabel}</Text>
        <Text style={styles.rowReason}>&ldquo;{item.reasonSnippet}&rdquo;</Text>
        <Text style={styles.rowMeta}>Flagged {item.flaggedOnLabel}</Text>

        {status === "needs_review" && (
          <View style={styles.actionRow}>
            <Pressable
              style={styles.secondaryButton}
              accessibilityRole="button"
              accessibilityLabel={`Dismiss flag for ${item.title}`}
              accessibilityHint="Marks this flag as reviewed. No changes are made to the listing."
              onPress={() => handleDismiss(item.id)}
            >
              <Text style={styles.secondaryButtonText}>Dismiss</Text>
            </Pressable>
            <Pressable
              style={styles.primaryButton}
              accessibilityRole="button"
              accessibilityLabel={`Relist ${item.title} with corrections`}
              accessibilityHint="Opens a confirmation before archiving the listing."
              onPress={() => handleStartRelist(item.id)}
            >
              <Text style={styles.primaryButtonText}>Relist with corrections</Text>
            </Pressable>
          </View>
        )}

        {status === "confirming_relist" && (
          <View style={styles.confirmBlock}>
            <Text style={styles.confirmText} accessibilityRole="alert">
              Archiving this listing is permanent — it will be removed from
              sale and marked for recreation with corrected details.
            </Text>
            <View style={styles.actionRow}>
              <Pressable
                style={styles.secondaryButton}
                accessibilityRole="button"
                accessibilityLabel={`Cancel relist for ${item.title}`}
                onPress={() => handleCancelRelist(item.id)}
              >
                <Text style={styles.secondaryButtonText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={styles.dangerButton}
                accessibilityRole="button"
                accessibilityLabel={`Confirm relist for ${item.title}`}
                accessibilityHint="Archives the current listing and marks it for recreation."
                onPress={() => handleConfirmRelist(item.id)}
              >
                <Text style={styles.dangerButtonText}>Confirm</Text>
              </Pressable>
            </View>
          </View>
        )}

        {status === "dismissed" && (
          <View
            style={styles.resolvedBadgeNeutral}
            accessibilityLabel={`Resolved: ${item.title} dismissed, listing considered accurate`}
          >
            <Text style={styles.resolvedTextNeutral}>
              Dismissed — listing considered accurate
            </Text>
          </View>
        )}

        {status === "relisted" && (
          <View
            style={styles.resolvedBadgeAccent}
            accessibilityLabel={`Resolved: ${item.title} archived for relist`}
          >
            <Text style={styles.resolvedTextAccent}>
              Archived — pending recreation with corrections
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerBlock}>
        <Text accessibilityRole="header" style={styles.screenTitle}>
          Mis-description Review Queue
        </Text>
        <Text style={styles.screenSubtitle}>
          Buyers flagged these listings as not matching their description.
        </Text>
      </View>

      {/* Sticky top progress counter — sits under the title, never scrolls,
          and is not a bottom band of any kind. There is no screen-level
          terminal action: once every row is reviewed the counter simply
          reports that fact, with nothing left to press. */}
      <View style={styles.counterBand}>
        <Text style={styles.counterText}>{counterText}</Text>
      </View>

      <FlatList
        data={flaggedListings}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  headerBlock: {
    paddingHorizontal: tokens.space(4),
    paddingTop: tokens.space(4),
    paddingBottom: tokens.space(2),
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  screenSubtitle: {
    marginTop: tokens.space(1),
    fontSize: 14,
    color: tokens.color.muted,
  },
  counterBand: {
    paddingHorizontal: tokens.space(4),
    paddingVertical: tokens.space(3),
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
  },
  counterText: {
    fontSize: 14,
    fontWeight: "600",
    color: tokens.color.ink2,
    fontVariant: ["tabular-nums"],
  },
  listContent: {
    paddingHorizontal: tokens.space(4),
    paddingTop: tokens.space(3),
    paddingBottom: tokens.space(6),
  },
  rowCard: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(4),
    marginBottom: tokens.space(3),
    backgroundColor: tokens.color.bg,
  },
  rowTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: tokens.color.ink,
  },
  rowPrice: {
    marginTop: tokens.space(1),
    fontSize: 13,
    color: tokens.color.muted,
    fontVariant: ["tabular-nums"],
  },
  rowReason: {
    marginTop: tokens.space(2),
    fontSize: 14,
    color: tokens.color.ink2,
  },
  rowMeta: {
    marginTop: tokens.space(1),
    fontSize: 12,
    color: tokens.color.faint,
  },
  actionRow: {
    flexDirection: "row",
    marginTop: tokens.space(3),
    gap: tokens.space(2),
  },
  secondaryButton: {
    flex: 1,
    minHeight: 44,
    borderRadius: tokens.radius.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: tokens.space(3),
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: tokens.color.ink,
  },
  primaryButton: {
    flex: 1,
    minHeight: 44,
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.accent,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: tokens.space(3),
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: tokens.color.onAccent,
  },
  confirmBlock: {
    marginTop: tokens.space(3),
  },
  confirmText: {
    fontSize: 13,
    color: tokens.color.danger,
  },
  dangerButton: {
    flex: 1,
    minHeight: 44,
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.danger,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: tokens.space(3),
  },
  dangerButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: tokens.color.onAccent,
  },
  resolvedBadgeNeutral: {
    marginTop: tokens.space(3),
    borderRadius: tokens.radius.sm,
    paddingVertical: tokens.space(2),
    paddingHorizontal: tokens.space(3),
    backgroundColor: tokens.color.successBg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: tokens.color.successBorder,
  },
  resolvedTextNeutral: {
    fontSize: 13,
    fontWeight: "600",
    color: tokens.color.success,
  },
  resolvedBadgeAccent: {
    marginTop: tokens.space(3),
    borderRadius: tokens.radius.sm,
    paddingVertical: tokens.space(2),
    paddingHorizontal: tokens.space(3),
    backgroundColor: tokens.color.dangerBg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: tokens.color.dangerBorder,
  },
  resolvedTextAccent: {
    fontSize: 13,
    fontWeight: "600",
    color: tokens.color.danger,
  },
});
