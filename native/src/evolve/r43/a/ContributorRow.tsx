// native/src/evolve/r43/a/ContributorRow.tsx
//
// One roster row. For the five fixed contributors it is pure display: name,
// avatar initial, pledged amount, and a status line. For "You" it also
// carries a live +/- stepper that edits the one piece of state this screen
// mutates. The stepper is rendered (not hidden) even after the purchase is
// locked in — it just goes disabled, dimmed, with a hint that tells the
// truth about why ("locked, can't be changed") rather than describing a
// decrease/increase that would no longer happen (see GENERATION.md §4 on
// accessibilityHint never promising an outcome the handler won't deliver).
//
// Deliberately no `accessible={true}` anywhere on the row wrapper: the You
// row nests two independent Pressable steppers, and collapsing the subtree
// would make them unreachable to VoiceOver/TalkBack. Decorative bits
// (the avatar initial) are hidden from the accessibility tree instead.

import { Pressable, Text, View, StyleSheet } from "react-native";
import { tokens } from "../../../tokens";
import { formatKRW } from "./data";

const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };

type Props = {
  name: string;
  initial: string;
  amount: number;
  statusLabel: string;
  statusTone?: "neutral" | "pledged" | "waiting";
  isYou?: boolean;
  disabled?: boolean;
  canIncrease?: boolean;
  canDecrease?: boolean;
  onIncrease?: () => void;
  onDecrease?: () => void;
};

export default function ContributorRow({
  name,
  initial,
  amount,
  statusLabel,
  statusTone = "neutral",
  isYou = false,
  disabled = false,
  canIncrease = true,
  canDecrease = true,
  onIncrease,
  onDecrease,
}: Props) {
  return (
    <View style={styles.row}>
      <View
        style={styles.avatar}
        importantForAccessibility="no-hide-descendants"
      >
        <Text style={styles.avatarText}>{initial}</Text>
      </View>

      <View style={styles.infoBlock}>
        <View style={styles.nameLine}>
          <Text style={styles.name}>{name}</Text>
          {isYou ? (
            <View style={styles.youBadge}>
              <Text style={styles.youBadgeText}>You</Text>
            </View>
          ) : null}
        </View>
        <Text
          style={[
            styles.status,
            statusTone === "pledged" && styles.statusPledged,
            statusTone === "waiting" && styles.statusWaiting,
          ]}
        >
          {statusLabel}
        </Text>
      </View>

      <View style={styles.amountBlock}>
        <Text
          style={[styles.amount, styles.tabularNums]}
          accessibilityLabel={`${isYou ? "Your pledge" : `${name}'s pledge`}, ${formatKRW(amount)}`}
        >
          {formatKRW(amount)}
        </Text>

        {isYou ? (
          <View style={styles.stepper}>
            <Pressable
              onPress={onDecrease}
              disabled={disabled || !canDecrease}
              hitSlop={HIT_SLOP}
              accessibilityRole="button"
              accessibilityLabel="Decrease your pledge"
              accessibilityHint={
                disabled
                  ? "Your pledge is locked now that the purchase has been locked in."
                  : "Lowers your pledge by fifty thousand won."
              }
              accessibilityState={{ disabled: disabled || !canDecrease }}
              style={({ pressed }) => [
                styles.stepperButton,
                pressed && !disabled && canDecrease && styles.stepperButtonPressed,
                (disabled || !canDecrease) && styles.stepperButtonDisabled,
              ]}
            >
              <Text style={styles.stepperGlyph}>−</Text>
            </Pressable>
            <Pressable
              onPress={onIncrease}
              disabled={disabled || !canIncrease}
              hitSlop={HIT_SLOP}
              accessibilityRole="button"
              accessibilityLabel="Increase your pledge"
              accessibilityHint={
                disabled
                  ? "Your pledge is locked now that the purchase has been locked in."
                  : "Raises your pledge by fifty thousand won."
              }
              accessibilityState={{ disabled: disabled || !canIncrease }}
              style={({ pressed }) => [
                styles.stepperButton,
                pressed && !disabled && canIncrease && styles.stepperButtonPressed,
                (disabled || !canIncrease) && styles.stepperButtonDisabled,
              ]}
            >
              <Text style={styles.stepperGlyph}>+</Text>
            </Pressable>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: tokens.space(3),
    paddingHorizontal: tokens.space(5),
    paddingVertical: tokens.space(4),
    borderBottomWidth: 1,
    borderBottomColor: tokens.color.border,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.color.accentBg,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.accent,
  },
  infoBlock: {
    flex: 1,
    gap: 2,
    paddingTop: 2,
  },
  nameLine: {
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.space(2),
    flexWrap: "wrap",
  },
  name: {
    fontSize: 15,
    fontWeight: "600",
    color: tokens.color.ink,
  },
  youBadge: {
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.accentBg,
    paddingHorizontal: tokens.space(2),
    paddingVertical: 1,
  },
  youBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: tokens.color.accent,
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  status: {
    fontSize: 12,
    color: tokens.color.faint,
  },
  statusPledged: {
    color: tokens.color.success,
  },
  statusWaiting: {
    color: tokens.color.warning,
  },
  amountBlock: {
    alignItems: "flex-end",
    gap: tokens.space(2),
  },
  amount: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  tabularNums: {
    fontVariant: ["tabular-nums"],
  },
  stepper: {
    flexDirection: "row",
    gap: tokens.space(2),
  },
  stepperButton: {
    minWidth: 44,
    minHeight: 44,
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
  },
  stepperButtonPressed: {
    backgroundColor: tokens.color.accentBg,
  },
  stepperButtonDisabled: {
    opacity: 0.4,
  },
  stepperGlyph: {
    fontSize: 18,
    fontWeight: "700",
    color: tokens.color.ink,
  },
});
