// native/src/evolve/r47/c/RewardRow.tsx
//
// A single redeemable reward. Tapping "Redeem" never opens a native Alert:
// the row's own trailing control swaps for an inline Cancel / Confirm pair
// (`phase === "confirm"`), and once confirmed it shows a brief "Redeemed…"
// acknowledgement (`phase === "done"`) that also states the resulting
// balance, before the parent returns the row to its idle control. Both
// transitions are announced through a nested accessibilityRole="alert" text
// inside an accessibilityLiveRegion="polite" container — and because the
// "done" sentence folds the new balance into the same sentence as the
// redemption acknowledgement, a single live region covers both the row's
// own state change and the points-balance change it caused, instead of
// opening a second live region alongside it.
//
// A reward whose cost exceeds the current balance renders no Pressable at
// all for "Redeem" — it's a disabled control with its own "need N more
// points" caption, not a dimmed copy of the working button, so it can never
// be tapped into the confirm phase.
//
// Deliberately NOT `accessible={true}` anywhere in this file: the row holds
// its own tappable Redeem / Cancel / Confirm Pressables, and collapsing that
// subtree into one opaque focus unit would make those controls unreachable
// to VoiceOver/TalkBack.

import { Text, View, Pressable, StyleSheet } from "react-native";
import { tokens } from "../../../tokens";
import { CATEGORY_LABEL, formatPoints, type Reward } from "./data";

export type RewardRowPhase = "idle" | "confirm" | "done";

type Props = {
  reward: Reward;
  phase: RewardRowPhase;
  balance: number;
  onRequestRedeem: (id: string) => void;
  onCancel: () => void;
  onConfirm: (id: string) => void;
};

export default function RewardRow({
  reward,
  phase,
  balance,
  onRequestRedeem,
  onCancel,
  onConfirm,
}: Props) {
  const affordable = balance >= reward.costPoints;
  const shortfall = reward.costPoints - balance;

  return (
    <View style={styles.row}>
      <View style={styles.infoBlock}>
        <Text style={styles.categoryTag}>{CATEGORY_LABEL[reward.category]}</Text>
        <Text style={styles.title}>{reward.title}</Text>
        <Text style={styles.description}>{reward.description}</Text>
        <Text style={[styles.cost, styles.tabularNums]}>
          {`${formatPoints(reward.costPoints)} pts`}
        </Text>
      </View>

      {phase === "idle" && affordable && (
        <Pressable
          onPress={() => onRequestRedeem(reward.id)}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={`Redeem ${reward.title} for ${formatPoints(reward.costPoints)} points`}
          accessibilityHint="Opens a confirmation for this redemption, in place."
          style={({ pressed }) => [
            styles.redeemButton,
            pressed && styles.redeemButtonPressed,
          ]}
        >
          <Text style={styles.redeemLabel}>Redeem</Text>
        </Pressable>
      )}

      {phase === "idle" && !affordable && (
        <Pressable
          disabled
          accessibilityRole="button"
          accessibilityState={{ disabled: true }}
          accessibilityLabel={`Redeem ${reward.title}, unavailable. You need ${formatPoints(shortfall)} more points.`}
          style={styles.disabledButton}
        >
          <Text style={styles.disabledLabel}>Redeem</Text>
          <Text style={styles.disabledSub}>{`Need ${formatPoints(shortfall)} more`}</Text>
        </Pressable>
      )}

      {phase === "confirm" && (
        <View style={styles.confirmBlock} accessibilityLiveRegion="polite">
          <Text accessibilityRole="alert" style={styles.confirmText}>
            {`Redeem ${reward.title} for ${formatPoints(reward.costPoints)} points? This spends your points and can't be undone.`}
          </Text>
          <View style={styles.confirmActions}>
            <Pressable
              onPress={onCancel}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Cancel redemption"
              style={({ pressed }) => [
                styles.cancelButton,
                pressed && styles.cancelButtonPressed,
              ]}
            >
              <Text style={styles.cancelLabel}>Cancel</Text>
            </Pressable>
            <Pressable
              onPress={() => onConfirm(reward.id)}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel={`Confirm redeeming ${reward.title}`}
              accessibilityHint="Spends the points shown and applies this reward."
              style={({ pressed }) => [
                styles.confirmButton,
                pressed && styles.confirmButtonPressed,
              ]}
            >
              <Text style={styles.confirmLabel}>Confirm</Text>
            </Pressable>
          </View>
        </View>
      )}

      {phase === "done" && (
        <View style={styles.doneBlock} accessibilityLiveRegion="polite">
          <Text accessibilityRole="alert" style={styles.doneText}>
            {`Redeemed ${reward.title} for ${formatPoints(reward.costPoints)} points. Your balance is now ${formatPoints(balance)} points.`}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingVertical: tokens.space(4),
    paddingHorizontal: tokens.space(5),
    borderBottomWidth: 1,
    borderBottomColor: tokens.color.border,
    gap: tokens.space(3),
  },
  infoBlock: {
    gap: tokens.space(1),
  },
  categoryTag: {
    fontSize: 11,
    fontWeight: "700",
    color: tokens.color.faint,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: tokens.color.ink,
  },
  description: {
    fontSize: 13,
    color: tokens.color.muted,
    lineHeight: 18,
  },
  cost: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.accent,
    marginTop: tokens.space(1),
  },
  tabularNums: {
    fontVariant: ["tabular-nums"],
  },
  redeemButton: {
    alignSelf: "flex-start",
    minHeight: 44,
    minWidth: 44,
    paddingHorizontal: tokens.space(4),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.ink2,
  },
  redeemButtonPressed: {
    backgroundColor: tokens.color.ink2,
  },
  redeemLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.ink2,
    letterSpacing: 0.2,
  },
  disabledButton: {
    alignSelf: "flex-start",
    minHeight: 44,
    minWidth: 44,
    paddingHorizontal: tokens.space(4),
    paddingVertical: tokens.space(2),
    justifyContent: "center",
    alignItems: "flex-start",
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    gap: tokens.space(1) / 2,
  },
  disabledLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.faint,
    letterSpacing: 0.2,
  },
  disabledSub: {
    fontSize: 11,
    color: tokens.color.faint,
  },
  confirmBlock: {
    gap: tokens.space(3),
  },
  confirmText: {
    fontSize: 14,
    color: tokens.color.ink,
    lineHeight: 20,
  },
  confirmActions: {
    flexDirection: "row",
    gap: tokens.space(3),
  },
  cancelButton: {
    minHeight: 44,
    minWidth: 44,
    paddingHorizontal: tokens.space(4),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.border,
  },
  cancelButtonPressed: {
    backgroundColor: tokens.color.border,
  },
  cancelLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: tokens.color.muted,
  },
  confirmButton: {
    flex: 1,
    minHeight: 44,
    paddingHorizontal: tokens.space(4),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.accent,
  },
  confirmButtonPressed: {
    backgroundColor: tokens.color.ink,
  },
  confirmLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.onAccent,
  },
  doneBlock: {
    minHeight: 44,
    justifyContent: "center",
  },
  doneText: {
    fontSize: 14,
    fontWeight: "600",
    color: tokens.color.success,
  },
});
