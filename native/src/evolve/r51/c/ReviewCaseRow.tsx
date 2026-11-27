// native/src/evolve/r51/c/ReviewCaseRow.tsx
//
// One row of the Authenticator Review Queue. A row is one of three locks:
//   - open:          nobody holds it yet -> "Start review" claims it.
//   - held by me:    this authenticator holds the claim-based lock -> a
//                     "Release case" control that flips, in place, into a
//                     Cancel / Confirm release pair rather than an Alert.
//   - held elsewhere: a teammate already holds it; this is a dead end on
//                     this screen, so the row renders no Pressable for it at
//                     all (nothing here would do anything if tapped).
// A fourth, transient shape appears only on the specific row the
// authenticator just tried (and failed) to claim while already holding a
// different case: an inline "case in the way" choice, never spawned as a
// popup.

import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { tokens } from "../../../tokens";
import { formatWonDigits, type AuthenticatorCase } from "./data";

export type RowLockState = "open" | "held-by-me" | "held-elsewhere";

interface ReviewCaseRowProps {
  item: AuthenticatorCase;
  lockState: RowLockState;
  /** True only for the single row currently showing the Cancel/Confirm release pair. */
  isConfirmingRelease: boolean;
  /** True only for the single row currently showing the "case in the way" choice. */
  isBlockedByOtherClaim: boolean;
  /** Short display id of whichever case this authenticator currently holds, if any. */
  myActiveCaseId: string | null;
  onStartReview: (caseId: string) => void;
  onRequestRelease: (caseId: string) => void;
  onCancelRelease: () => void;
  onConfirmRelease: (caseId: string) => void;
  onDismissBlocked: () => void;
  onReleaseThenClaim: (caseId: string) => void;
}

function PriorityTag({ priority }: { priority: AuthenticatorCase["priority"] }) {
  const isExpedited = priority === "expedited";
  return (
    <View style={[styles.priorityTag, isExpedited && styles.priorityTagExpedited]}>
      <Text
        style={[
          styles.priorityTagText,
          isExpedited && styles.priorityTagTextExpedited,
        ]}
      >
        {isExpedited ? "Expedited" : "Standard"}
      </Text>
    </View>
  );
}

function DeclaredValue({ amount }: { amount: number }) {
  return (
    <View style={styles.valueRow}>
      <Text style={styles.valueLabel}>Declared value</Text>
      <View style={styles.valueAmountRow}>
        {/* The ₩ glyph gets its own Text node with a little marginRight so it
            doesn't crowd the first tabular digit — see data.ts header note /
            the concept note for why this stays a spacing-only treatment. */}
        <Text style={styles.valueSymbol}>₩</Text>
        <Text style={styles.valueDigits}>{formatWonDigits(amount)}</Text>
      </View>
    </View>
  );
}

export function ReviewCaseRow({
  item,
  lockState,
  isConfirmingRelease,
  isBlockedByOtherClaim,
  myActiveCaseId,
  onStartReview,
  onRequestRelease,
  onCancelRelease,
  onConfirmRelease,
  onDismissBlocked,
  onReleaseThenClaim,
}: ReviewCaseRowProps) {
  return (
    <View
      style={[
        styles.card,
        lockState === "held-by-me" && styles.cardHeldByMe,
        lockState === "held-elsewhere" && styles.cardHeldElsewhere,
      ]}
    >
      <View style={styles.topRow}>
        <PriorityTag priority={item.priority} />
        <Text style={styles.caseId}>{item.id}</Text>
      </View>

      <Text
        style={styles.itemTitle}
        accessibilityLabel={`${item.title}, case ${item.id}, submitted by ${item.submittedBy}, ${item.submittedLabel.toLowerCase()}`}
      >
        {item.title}
      </Text>
      <Text style={styles.metaLine}>
        {item.category} · Submitted by {item.submittedBy} · {item.submittedLabel}
      </Text>
      <Text style={styles.conditionNote}>{item.conditionNote}</Text>

      <View style={styles.statRow}>
        <Text style={styles.photosCount}>
          {item.photosCount} {item.photosCount === 1 ? "photo" : "photos"} submitted
        </Text>
        <DeclaredValue amount={item.declaredValueWon} />
      </View>

      {lockState === "held-elsewhere" ? (
        <View style={styles.lockChip}>
          <Text style={styles.lockChipText}>
            Locked by {item.lockedByOtherName}
          </Text>
        </View>
      ) : null}

      {lockState === "held-by-me" && !isConfirmingRelease ? (
        <View style={styles.lockChipMine}>
          <Text style={styles.lockChipMineText}>Locked to you</Text>
        </View>
      ) : null}

      {lockState === "open" && isBlockedByOtherClaim ? (
        <View style={styles.blockedWrap}>
          <Text style={styles.blockedText}>
            You already hold case {myActiveCaseId}. Release it before starting
            this one.
          </Text>
          <View style={styles.blockedButtonRow}>
            <Pressable
              onPress={onDismissBlocked}
              accessibilityRole="button"
              accessibilityLabel="Keep browsing the queue"
              style={({ pressed }) => [
                styles.secondaryButton,
                pressed && styles.secondaryButtonPressed,
              ]}
            >
              <Text style={styles.secondaryButtonText}>Keep browsing</Text>
            </Pressable>
            <Pressable
              onPress={() => onReleaseThenClaim(item.id)}
              accessibilityRole="button"
              accessibilityLabel={`Release case ${myActiveCaseId} and start reviewing case ${item.id} instead`}
              accessibilityHint="Releases your current claim and immediately claims this case instead."
              style={({ pressed }) => [
                styles.primaryButton,
                styles.blockedChoiceButton,
                pressed && styles.primaryButtonPressed,
              ]}
            >
              <Text style={styles.primaryButtonText}>Release & claim this</Text>
            </Pressable>
          </View>
        </View>
      ) : null}

      {lockState === "open" && !isBlockedByOtherClaim ? (
        <Pressable
          onPress={() => onStartReview(item.id)}
          accessibilityRole="button"
          accessibilityLabel={`Start review on case ${item.id}`}
          accessibilityHint="Claims this case and locks it to you for review."
          style={({ pressed }) => [
            styles.primaryButton,
            pressed && styles.primaryButtonPressed,
          ]}
        >
          <Text style={styles.primaryButtonText}>Start review</Text>
        </Pressable>
      ) : null}

      {lockState === "held-by-me" && !isConfirmingRelease ? (
        <Pressable
          onPress={() => onRequestRelease(item.id)}
          accessibilityRole="button"
          accessibilityLabel={`Release case ${item.id}`}
          accessibilityHint="Unlocks this case so it returns to the open queue."
          style={({ pressed }) => [
            styles.releaseButton,
            pressed && styles.releaseButtonPressed,
          ]}
        >
          <Text style={styles.releaseButtonText}>Release case</Text>
        </Pressable>
      ) : null}

      {lockState === "held-by-me" && isConfirmingRelease ? (
        <View style={styles.confirmWrap}>
          <Text style={styles.confirmText}>
            Release case {item.id}? Any in-progress notes stay with the case,
            but it goes back into the open queue for anyone to claim.
          </Text>
          <View style={styles.confirmButtonRow}>
            <Pressable
              onPress={onCancelRelease}
              accessibilityRole="button"
              accessibilityLabel="Cancel release"
              style={({ pressed }) => [
                styles.secondaryButton,
                pressed && styles.secondaryButtonPressed,
              ]}
            >
              <Text style={styles.secondaryButtonText}>Cancel</Text>
            </Pressable>
            <Pressable
              onPress={() => onConfirmRelease(item.id)}
              accessibilityRole="button"
              accessibilityLabel={`Confirm release of case ${item.id}`}
              style={({ pressed }) => [
                styles.confirmButton,
                pressed && styles.confirmButtonPressed,
              ]}
            >
              <Text style={styles.confirmButtonText}>Confirm release</Text>
            </Pressable>
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.color.bg,
    padding: tokens.space(4),
    marginBottom: tokens.space(3),
  },
  cardHeldByMe: {
    borderColor: tokens.color.accent,
    borderWidth: 1.5,
  },
  cardHeldElsewhere: {
    backgroundColor: tokens.color.accentBg,
    opacity: 0.85,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: tokens.space(2),
  },
  priorityTag: {
    minHeight: 22,
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.border,
    paddingHorizontal: tokens.space(2),
    alignItems: "center",
    justifyContent: "center",
  },
  priorityTagExpedited: {
    backgroundColor: tokens.color.warningBg,
    borderColor: tokens.color.warningBorder,
  },
  priorityTagText: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: "700",
    color: tokens.color.muted,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  priorityTagTextExpedited: {
    color: tokens.color.warning,
  },
  caseId: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "600",
    color: tokens.color.faint,
    fontVariant: ["tabular-nums"],
  },
  itemTitle: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "700",
    color: tokens.color.ink,
    marginBottom: tokens.space(1),
  },
  metaLine: {
    fontSize: 13,
    lineHeight: 18,
    color: tokens.color.muted,
    marginBottom: tokens.space(2),
  },
  conditionNote: {
    fontSize: 13,
    lineHeight: 19,
    color: tokens.color.ink2,
    marginBottom: tokens.space(3),
  },
  statRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginBottom: tokens.space(3),
  },
  photosCount: {
    fontSize: 12,
    lineHeight: 16,
    color: tokens.color.faint,
  },
  valueRow: {
    alignItems: "flex-end",
  },
  valueLabel: {
    fontSize: 11,
    lineHeight: 14,
    color: tokens.color.faint,
    marginBottom: 2,
  },
  valueAmountRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  valueSymbol: {
    fontSize: 14,
    lineHeight: 18,
    color: tokens.color.ink2,
    fontWeight: "600",
    marginRight: 3,
  },
  valueDigits: {
    fontSize: 15,
    lineHeight: 19,
    color: tokens.color.ink,
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
  },
  lockChip: {
    alignSelf: "flex-start",
    minHeight: 28,
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.border,
    paddingHorizontal: tokens.space(3),
    alignItems: "center",
    justifyContent: "center",
  },
  lockChipText: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "600",
    color: tokens.color.faint,
  },
  lockChipMine: {
    alignSelf: "flex-start",
    minHeight: 28,
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.accentBg,
    paddingHorizontal: tokens.space(3),
    alignItems: "center",
    justifyContent: "center",
    marginBottom: tokens.space(3),
  },
  lockChipMineText: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "700",
    color: tokens.color.accent,
  },
  primaryButton: {
    minHeight: 44,
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.accent,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: tokens.space(4),
  },
  primaryButtonPressed: {
    opacity: 0.85,
  },
  primaryButtonText: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "700",
    color: tokens.color.onAccent,
  },
  releaseButton: {
    minHeight: 44,
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.accent,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: tokens.space(4),
  },
  releaseButtonPressed: {
    backgroundColor: tokens.color.accentBg,
  },
  releaseButtonText: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "700",
    color: tokens.color.accent,
  },
  confirmWrap: {
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    paddingTop: tokens.space(3),
    marginTop: tokens.space(1),
  },
  confirmText: {
    fontSize: 13,
    lineHeight: 19,
    color: tokens.color.ink2,
    marginBottom: tokens.space(3),
  },
  confirmButtonRow: {
    flexDirection: "row",
    gap: tokens.space(2),
  },
  secondaryButton: {
    flex: 1,
    minHeight: 44,
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonPressed: {
    backgroundColor: tokens.color.accentBg,
  },
  secondaryButtonText: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "600",
    color: tokens.color.ink2,
  },
  confirmButton: {
    flex: 1,
    minHeight: 44,
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.danger,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmButtonPressed: {
    opacity: 0.85,
  },
  confirmButtonText: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "700",
    color: tokens.color.onAccent,
  },
  blockedWrap: {
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    paddingTop: tokens.space(3),
    marginTop: tokens.space(1),
  },
  blockedText: {
    fontSize: 13,
    lineHeight: 19,
    color: tokens.color.warning,
    marginBottom: tokens.space(3),
  },
  blockedButtonRow: {
    flexDirection: "row",
    gap: tokens.space(2),
  },
  blockedChoiceButton: {
    flex: 1,
  },
});

export default ReviewCaseRow;
