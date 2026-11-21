// native/src/evolve/r54/a/TradeInPayoutEstimatorScreen.tsx — auto-native-r54
// candidate a.
//
// Trade-In Payout Estimator: a continuous, always-interactive calculator.
// There is no bottom band, no workflow gate, no multi-step wizard, and no
// submit/lock/accept action anywhere — the user just plays with three
// inputs (category pill, condition segment, quantity stepper) and a single
// always-visible result card recomputes a full payout breakdown live on
// every change. The result card IS the primary content of the screen, not
// a secondary confirmation surface revealed after some gate clears.
//
// This is deliberately NOT evolve/r47/a/InstantTradeInScreen: that screen
// gates its number behind a condition questionnaire (must answer every
// question before anything is computed), withholds the computed number
// behind an explicit "reveal" tap, and ends in an accept/decline band that
// locks a decision. Here there is no gating condition, no reveal step, and
// no decision to lock — every number is a plain derived value computed
// fresh from current state on every render (see `breakdown` below), and the
// user can change any input indefinitely with no notion of "done".
//
// Style keys below (pill*, segment*, stepper*, result*) are written fresh
// for this screen's own shape, not copied from optionChip*/offerBand* or
// any other catalog screen's naming scheme.

import { useMemo, useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { tokens } from "../../../tokens";
import {
  CATEGORIES,
  CONDITIONS,
  MAX_QTY,
  MIN_QTY,
  computePayout,
  formatUsd,
  type CategoryId,
  type ConditionId,
} from "./data";

const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };

export function TradeInPayoutEstimatorScreen() {
  const [categoryId, setCategoryId] = useState<CategoryId>(CATEGORIES[0].id);
  const [conditionId, setConditionId] = useState<ConditionId>(CONDITIONS[0].id);
  const [quantity, setQuantity] = useState(1);

  // Every displayed number is derived fresh from current state on every
  // render — nothing here is set once in an effect and left stale.
  const breakdown = useMemo(
    () => computePayout(categoryId, conditionId, quantity),
    [categoryId, conditionId, quantity]
  );

  const atMin = quantity <= MIN_QTY;
  const atMax = quantity >= MAX_QTY;

  const decrement = () => setQuantity((q) => Math.max(MIN_QTY, q - 1));
  const increment = () => setQuantity((q) => Math.min(MAX_QTY, q + 1));

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.kicker}>REPICK TRADE-IN</Text>
        <Text style={styles.title} accessibilityRole="header">
          Trade-In Payout Estimator
        </Text>
        <Text style={styles.lede}>
          Adjust the category, condition and quantity to see what a trade-in
          would pay out right now. Nothing here is final — explore as much
          as you like.
        </Text>

        <View style={styles.resultCard} accessibilityLiveRegion="polite">
          <Text style={styles.resultLabel}>Estimated Payout</Text>
          <Text
            style={styles.resultTotal}
            accessibilityRole="alert"
            accessibilityLabel={`Estimated payout: ${formatUsd(breakdown.totalUsd)}`}
          >
            {formatUsd(breakdown.totalUsd)}
          </Text>
          <Text style={styles.resultSub}>
            {breakdown.quantity} × {breakdown.category.label} · {breakdown.condition.shortLabel}
          </Text>

          <View style={styles.resultDivider} />

          <View style={styles.resultLine}>
            <Text style={styles.resultLineLabel}>Base value (per item)</Text>
            <Text style={styles.resultLineValue}>
              {formatUsd(breakdown.category.baseValueUsd)}
            </Text>
          </View>
          <View style={styles.resultLine}>
            <Text style={styles.resultLineLabel}>
              Condition adjustment ({breakdown.condition.label})
            </Text>
            <Text style={styles.resultLineValue}>
              ×{breakdown.condition.multiplier.toFixed(2)}
            </Text>
          </View>
          <View style={styles.resultLine}>
            <Text style={styles.resultLineLabel}>
              Subtotal ({breakdown.quantity} item{breakdown.quantity === 1 ? "" : "s"})
            </Text>
            <Text style={styles.resultLineValue}>
              {formatUsd(breakdown.subtotalUsd)}
            </Text>
          </View>
          <View style={styles.resultLine}>
            <Text style={styles.resultLineLabel}>{breakdown.bulkTier.label}</Text>
            <Text
              style={[
                styles.resultLineValue,
                breakdown.bulkBonusUsd > 0 && styles.resultLineValuePositive,
              ]}
            >
              {breakdown.bulkBonusUsd > 0
                ? `+${formatUsd(breakdown.bulkBonusUsd)}`
                : formatUsd(0)}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionHead} accessibilityRole="header">
          Category
        </Text>
        <View
          style={styles.pillRow}
          accessibilityRole="radiogroup"
          accessibilityLabel="Item category"
        >
          {CATEGORIES.map((category) => {
            const active = category.id === categoryId;
            return (
              <Pressable
                key={category.id}
                onPress={() => setCategoryId(category.id)}
                hitSlop={HIT_SLOP}
                accessibilityRole="radio"
                accessibilityState={{ selected: active, checked: active }}
                accessibilityLabel={`${category.label}, base value ${formatUsd(category.baseValueUsd)}`}
                style={({ pressed }) => [
                  styles.pill,
                  active && styles.pillActive,
                  pressed && styles.pressedDim,
                ]}
              >
                <Text style={[styles.pillText, active && styles.pillTextActive]}>
                  {category.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.sectionHead} accessibilityRole="header">
          Condition
        </Text>
        <View
          style={styles.segmentRow}
          accessibilityRole="radiogroup"
          accessibilityLabel="Item condition"
        >
          {CONDITIONS.map((condition, index) => {
            const active = condition.id === conditionId;
            return (
              <Pressable
                key={condition.id}
                onPress={() => setConditionId(condition.id)}
                hitSlop={HIT_SLOP}
                accessibilityRole="radio"
                accessibilityState={{ selected: active, checked: active }}
                accessibilityLabel={`${condition.label}, pays ${Math.round(condition.multiplier * 100)} percent of base value`}
                style={({ pressed }) => [
                  styles.segment,
                  index > 0 && styles.segmentDivider,
                  active && styles.segmentActive,
                  pressed && styles.pressedDim,
                ]}
              >
                <Text style={[styles.segmentText, active && styles.segmentTextActive]}>
                  {condition.shortLabel}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.sectionHead} accessibilityRole="header">
          Quantity
        </Text>
        <View style={styles.stepperRow}>
          <Pressable
            onPress={decrement}
            disabled={atMin}
            hitSlop={HIT_SLOP}
            accessibilityRole="button"
            accessibilityLabel="Decrease quantity"
            accessibilityState={{ disabled: atMin }}
            accessibilityHint={atMin ? undefined : "Lowers the quantity by one item."}
            style={({ pressed }) => [
              styles.stepperButton,
              atMin && styles.stepperButtonDisabled,
              pressed && !atMin && styles.pressedDim,
            ]}
          >
            <Text style={[styles.stepperButtonText, atMin && styles.stepperButtonTextDisabled]}>
              −
            </Text>
          </Pressable>

          <View style={styles.stepperValueBox}>
            <Text style={styles.stepperValue}>{quantity}</Text>
            <Text style={styles.stepperValueCaption}>
              item{quantity === 1 ? "" : "s"}
            </Text>
          </View>

          <Pressable
            onPress={increment}
            disabled={atMax}
            hitSlop={HIT_SLOP}
            accessibilityRole="button"
            accessibilityLabel="Increase quantity"
            accessibilityState={{ disabled: atMax }}
            accessibilityHint={atMax ? undefined : "Raises the quantity by one item."}
            style={({ pressed }) => [
              styles.stepperButton,
              atMax && styles.stepperButtonDisabled,
              pressed && !atMax && styles.pressedDim,
            ]}
          >
            <Text style={[styles.stepperButtonText, atMax && styles.stepperButtonTextDisabled]}>
              +
            </Text>
          </Pressable>
        </View>
        <Text style={styles.stepperHint}>
          Up to {MAX_QTY} items per estimate. Bulk bonuses apply at 3, 6 and 10 items.
        </Text>

        <Text style={styles.footerNote}>
          This is an estimate only, based on the inputs above. The final
          payout for a real trade-in is confirmed after Repick inspects the
          item in hand.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

export default TradeInPayoutEstimatorScreen;

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: tokens.color.bg },
  scrollContent: {
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(6),
    paddingBottom: tokens.space(10),
  },

  kicker: {
    fontSize: 11,
    letterSpacing: 1.6,
    fontWeight: "700",
    color: tokens.color.faint,
  },
  title: {
    marginTop: tokens.space(2),
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: -0.5,
    color: tokens.color.ink,
  },
  lede: {
    marginTop: tokens.space(2),
    fontSize: 14,
    lineHeight: 21,
    color: tokens.color.muted,
  },

  resultCard: {
    marginTop: tokens.space(5),
    borderWidth: 1.5,
    borderColor: tokens.color.accent,
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.color.accentBg,
    padding: tokens.space(4),
  },
  resultLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
    color: tokens.color.muted,
  },
  resultTotal: {
    marginTop: tokens.space(1),
    fontSize: 40,
    fontWeight: "800",
    letterSpacing: -0.5,
    color: tokens.color.ink,
    fontVariant: ["tabular-nums"],
  },
  resultSub: {
    marginTop: tokens.space(0.5),
    fontSize: 12,
    color: tokens.color.muted,
  },
  resultDivider: {
    height: 1,
    backgroundColor: tokens.color.border,
    marginVertical: tokens.space(3),
  },
  resultLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: tokens.space(1),
  },
  resultLineLabel: {
    flex: 1,
    paddingRight: tokens.space(2),
    fontSize: 13,
    color: tokens.color.ink2,
  },
  resultLineValue: {
    fontSize: 13,
    fontWeight: "700",
    color: tokens.color.ink,
    fontVariant: ["tabular-nums"],
  },
  resultLineValuePositive: {
    color: tokens.color.success,
  },

  sectionHead: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.ink,
    marginTop: tokens.space(6),
    marginBottom: tokens.space(2.5),
  },

  pillRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: tokens.space(2),
  },
  pill: {
    minHeight: 44,
    justifyContent: "center",
    paddingHorizontal: tokens.space(4),
    borderRadius: 999,
    borderWidth: 1,
    borderColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
  },
  pillActive: {
    borderColor: tokens.color.accent,
    backgroundColor: tokens.color.accent,
  },
  pillText: {
    fontSize: 13,
    fontWeight: "600",
    color: tokens.color.ink2,
  },
  pillTextActive: {
    color: tokens.color.onAccent,
    fontWeight: "700",
  },

  segmentRow: {
    flexDirection: "row",
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.border,
    overflow: "hidden",
  },
  segment: {
    flex: 1,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: tokens.space(1),
  },
  segmentDivider: {
    borderLeftWidth: 1,
    borderLeftColor: tokens.color.border,
  },
  segmentActive: {
    backgroundColor: tokens.color.accentBg,
  },
  segmentText: {
    fontSize: 12,
    fontWeight: "600",
    color: tokens.color.muted,
    textAlign: "center",
  },
  segmentTextActive: {
    color: tokens.color.accent,
    fontWeight: "700",
  },

  stepperRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.space(4),
  },
  stepperButton: {
    width: 44,
    height: 44,
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
  },
  stepperButtonDisabled: {
    borderColor: tokens.color.border,
    opacity: 0.4,
  },
  stepperButtonText: {
    fontSize: 20,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  stepperButtonTextDisabled: {
    color: tokens.color.faint,
  },
  stepperValueBox: {
    minWidth: 72,
    alignItems: "center",
  },
  stepperValue: {
    fontSize: 24,
    fontWeight: "800",
    color: tokens.color.ink,
    fontVariant: ["tabular-nums"],
  },
  stepperValueCaption: {
    fontSize: 11,
    color: tokens.color.faint,
  },
  stepperHint: {
    marginTop: tokens.space(2),
    fontSize: 12,
    color: tokens.color.faint,
  },
  pressedDim: { opacity: 0.8 },

  footerNote: {
    marginTop: tokens.space(7),
    fontSize: 12,
    lineHeight: 18,
    color: tokens.color.faint,
  },
});
