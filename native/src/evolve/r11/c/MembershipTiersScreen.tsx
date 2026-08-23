import { useMemo, useState } from "react";
import type { ReactNode } from "react";
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
  BANDS,
  DEFAULT_STEP_INDEX,
  FLIP_POINTS,
  INITIAL_PLAN_ID,
  MARKER_LEFT,
  TIERS,
  VOLUME_STEPS,
  formatWon,
  monthlyCost,
  rankAtVolume,
  tierById,
} from "./data";
import type { TierId } from "./data";

type Stage = "settled" | "reveal" | "adopt" | "override";

export function MembershipTiersScreen() {
  const [stepIndex, setStepIndex] = useState<number>(DEFAULT_STEP_INDEX);
  const [inspectedId, setInspectedId] = useState<TierId | null>(null);
  const [planId, setPlanId] = useState<TierId>(INITIAL_PLAN_ID);

  const volume = VOLUME_STEPS[stepIndex];
  const ranked = useMemo(() => rankAtVolume(volume), [volume]);
  const best = ranked[0];
  const runnerUp = ranked[1];

  const plan = tierById(planId);
  const planCost = monthlyCost(plan, volume);
  const alreadyBest = planId === best.tier.id;
  const rivalName = alreadyBest ? runnerUp.tier.name : plan.name;
  const rivalCost = alreadyBest ? runnerUp.cost : planCost;
  const headlineGap = rivalCost - best.cost;
  const planGap = planCost - best.cost;

  const selected = inspectedId === null ? best.tier : tierById(inspectedId);
  const selectedCost = monthlyCost(selected, volume);
  const selectedGap = selectedCost - best.cost;

  const nextFlip = FLIP_POINTS.find((flip) => flip.at > volume);
  const passed = FLIP_POINTS.filter((flip) => flip.at <= volume);
  const lastFlip = passed.length > 0 ? passed[passed.length - 1] : null;

  const canLower = stepIndex > 0;
  const canRaise = stepIndex < VOLUME_STEPS.length - 1;

  const stage: Stage =
    selected.id === planId
      ? selected.id === best.tier.id
        ? "settled"
        : "reveal"
      : selected.id === best.tier.id
        ? "adopt"
        : "override";

  const primaryLabel =
    stage === "reveal"
      ? "Show " + best.tier.name
      : stage === "adopt"
        ? "Switch to " + best.tier.name
        : "Switch to " + selected.name + " anyway";

  function lowerVolume() {
    setStepIndex((index) => (index > 0 ? index - 1 : index));
  }

  function raiseVolume() {
    setStepIndex((index) => (index < VOLUME_STEPS.length - 1 ? index + 1 : index));
  }

  function runPrimary() {
    if (stage === "reveal") {
      setInspectedId(best.tier.id);
      return;
    }
    if (stage === "adopt") {
      setPlanId(best.tier.id);
      setInspectedId(null);
      return;
    }
    setPlanId(selected.id);
  }

  const status: ReactNode =
    stage === "settled" ? (
      <>
        {plan.name} is active and still the cheapest at{" "}
        <Text style={styles.money}>{formatWon(volume)}</Text> a month. Nothing left to switch.
      </>
    ) : stage === "reveal" ? (
      <>
        You are on {plan.name}. {best.tier.name} would run{" "}
        <Text style={styles.money}>{formatWon(planGap)}</Text> a month lighter at this volume.
      </>
    ) : stage === "adopt" ? (
      <>
        {best.tier.name} saves <Text style={styles.money}>{formatWon(planGap)}</Text> a month
        against your {plan.name} plan.
      </>
    ) : (
      <>
        {selected.name} costs <Text style={styles.money}>{formatWon(selectedGap)}</Text> a month
        more than {best.tier.name} at this volume.
      </>
    );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.root}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollBody}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.eyebrow}>Seller membership</Text>
          <Text style={styles.title} accessibilityRole="header">
            Priced against what you actually sell
          </Text>

          <View style={styles.verdict}>
            <Text style={styles.verdictKicker}>Cheapest for you right now</Text>
            <Text style={styles.verdictName} accessibilityRole="header">
              {best.tier.name}
            </Text>
            <Text style={styles.verdictLine}>
              At <Text style={styles.money}>{formatWon(volume)}</Text> in monthly sales you hand
              over <Text style={styles.money}>{formatWon(best.cost)}</Text> in fees —{" "}
              <Text style={styles.money}>{formatWon(headlineGap)}</Text> under {rivalName}.
            </Text>
          </View>

          <View style={styles.dial}>
            <View style={styles.dialHead}>
              <Text style={styles.sectionLabel}>Your monthly sales</Text>
              <Text style={styles.money}>{formatWon(volume)}</Text>
            </View>

            <View style={styles.dialRow}>
              <Pressable
                onPress={lowerVolume}
                disabled={!canLower}
                accessibilityRole="button"
                accessibilityLabel="Lower monthly sales estimate by 400,000 won"
                accessibilityState={{ disabled: !canLower }}
                style={({ pressed }) => [
                  styles.stepButton,
                  !canLower && styles.stepButtonOff,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={styles.stepGlyph}>−</Text>
              </Pressable>

              <View
                style={styles.railWrap}
                accessible
                accessibilityLabel={
                  "Volume ladder. Basic is cheapest up to " +
                  formatWon(FLIP_POINTS[0].at) +
                  ", Plus up to " +
                  formatWon(FLIP_POINTS[1].at) +
                  ", Elite above that. You are at " +
                  formatWon(volume) +
                  "."
                }
              >
                <View style={styles.rail}>
                  {BANDS.map((band, index) => (
                    <View
                      key={band.id}
                      style={[
                        styles.bandCell,
                        { flex: band.steps },
                        index > 0 && styles.bandDivider,
                        band.id === best.tier.id && styles.bandCellOn,
                      ]}
                    />
                  ))}
                </View>

                <View style={[styles.marker, { left: MARKER_LEFT[stepIndex] }]} />

                <View style={styles.railLabels}>
                  {BANDS.map((band) => (
                    <View key={band.id} style={{ flex: band.steps }}>
                      <Text
                        numberOfLines={1}
                        style={[
                          styles.railLabel,
                          band.id === best.tier.id && styles.railLabelOn,
                        ]}
                      >
                        {band.name}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>

              <Pressable
                onPress={raiseVolume}
                disabled={!canRaise}
                accessibilityRole="button"
                accessibilityLabel="Raise monthly sales estimate by 400,000 won"
                accessibilityState={{ disabled: !canRaise }}
                style={({ pressed }) => [
                  styles.stepButton,
                  !canRaise && styles.stepButtonOff,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={styles.stepGlyph}>+</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.flip}>
            <Text style={styles.sectionLabel}>Where it flips</Text>
            {nextFlip ? (
              <Text style={styles.flipLine}>
                Add <Text style={styles.money}>{formatWon(nextFlip.at - volume)}</Text> a month and{" "}
                {nextFlip.toName} overtakes {nextFlip.fromName} at{" "}
                <Text style={styles.money}>{formatWon(nextFlip.at)}</Text>.
              </Text>
            ) : (
              <Text style={styles.flipLine}>
                Nothing overtakes {best.tier.name} above{" "}
                <Text style={styles.money}>{formatWon(FLIP_POINTS[1].at)}</Text>. This is the floor.
              </Text>
            )}
            {lastFlip ? (
              <Text style={styles.flipLineSub}>
                You sit <Text style={styles.money}>{formatWon(volume - lastFlip.at)}</Text> past the
                line where {lastFlip.toName} took over from {lastFlip.fromName}.
              </Text>
            ) : (
              <Text style={styles.flipLineSub}>
                Below every switch point — paying nothing monthly still wins.
              </Text>
            )}
          </View>

          <View style={styles.segments}>
            {TIERS.map((tier, index) => {
              const isSelected = tier.id === selected.id;
              const isBest = tier.id === best.tier.id;
              return (
                <Pressable
                  key={tier.id}
                  onPress={() => setInspectedId(tier.id)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}
                  accessibilityLabel={
                    isBest ? tier.name + ", cheapest at your volume" : tier.name + " terms"
                  }
                  style={({ pressed }) => [
                    styles.segment,
                    index > 0 && styles.segmentDivider,
                    isSelected && styles.segmentOn,
                    pressed && styles.pressed,
                  ]}
                >
                  <Text style={[styles.segmentText, isSelected && styles.segmentTextOn]}>
                    {tier.name}
                  </Text>
                  {isBest ? (
                    <Text style={[styles.segmentTag, isSelected && styles.segmentTagOn]}>
                      CHEAPEST
                    </Text>
                  ) : null}
                </Pressable>
              );
            })}
          </View>

          <View style={styles.card}>
            <View style={styles.cardHead}>
              <Text style={styles.cardTitle} accessibilityRole="header">
                {selected.name}
              </Text>
              {selected.id === planId ? <Text style={styles.pill}>CURRENT PLAN</Text> : null}
            </View>
            <Text style={styles.cardBlurb}>{selected.blurb}</Text>

            <View style={styles.statRow}>
              <View style={styles.stat}>
                <Text style={styles.statLabel}>Selling fee</Text>
                <Text style={styles.statValue}>{selected.feeLabel}</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statLabel}>Payout</Text>
                <Text style={styles.statValue}>{selected.payoutLabel}</Text>
              </View>
            </View>

            <View style={styles.statRow}>
              <View style={styles.stat}>
                <Text style={styles.statLabel}>Cover per deal</Text>
                <Text style={styles.money}>{formatWon(selected.guaranteeCap)}</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statLabel}>Membership</Text>
                <Text style={styles.money}>{formatWon(selected.monthlyFee)}</Text>
              </View>
            </View>

            <View style={styles.cardFoot}>
              {selectedGap === 0 ? (
                <Text style={styles.cardFootLine}>
                  At your volume this runs{" "}
                  <Text style={styles.money}>{formatWon(selectedCost)}</Text> a month — the lowest
                  of the three.
                </Text>
              ) : (
                <Text style={styles.cardFootLine}>
                  At your volume this runs{" "}
                  <Text style={styles.money}>{formatWon(selectedCost)}</Text> a month —{" "}
                  <Text style={styles.money}>{formatWon(selectedGap)}</Text> over {best.tier.name}.
                </Text>
              )}
            </View>
          </View>
        </ScrollView>

        <View style={styles.dock} accessibilityLiveRegion="polite">
          <Text style={styles.dockStatus} accessibilityRole="alert">
            {status}
          </Text>

          {stage === "settled" ? null : (
            <View style={styles.dockActions}>
              {stage === "override" ? (
                <Pressable
                  onPress={() => setInspectedId(best.tier.id)}
                  accessibilityRole="button"
                  accessibilityLabel={"Go back to " + best.tier.name}
                  style={({ pressed }) => [styles.ghostButton, pressed && styles.pressed]}
                >
                  <Text style={styles.ghostText}>Back to {best.tier.name}</Text>
                </Pressable>
              ) : null}

              <Pressable
                onPress={runPrimary}
                accessibilityRole="button"
                accessibilityLabel={primaryLabel}
                style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}
              >
                <Text style={styles.primaryText}>{primaryLabel}</Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  root: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollBody: {
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(4),
    paddingBottom: tokens.space(7),
  },
  eyebrow: {
    fontSize: 11,
    letterSpacing: 1.2,
    fontWeight: "700",
    color: tokens.color.faint,
    textTransform: "uppercase",
  },
  title: {
    marginTop: tokens.space(2),
    fontSize: 24,
    lineHeight: 30,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  sectionLabel: {
    fontSize: 12,
    letterSpacing: 0.8,
    fontWeight: "700",
    color: tokens.color.muted,
    textTransform: "uppercase",
  },

  verdict: {
    marginTop: tokens.space(5),
    padding: tokens.space(4),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
  },
  verdictKicker: {
    fontSize: 11,
    letterSpacing: 1,
    fontWeight: "700",
    color: tokens.color.accent,
    textTransform: "uppercase",
  },
  verdictName: {
    marginTop: tokens.space(1),
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "800",
    color: tokens.color.ink,
  },
  verdictLine: {
    marginTop: tokens.space(2),
    fontSize: 14,
    lineHeight: 22,
    color: tokens.color.muted,
  },

  dial: {
    marginTop: tokens.space(6),
  },
  dialHead: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginBottom: tokens.space(3),
  },
  dialRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  stepButton: {
    width: 56,
    height: 56,
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
  },
  stepButtonOff: {
    opacity: 0.35,
  },
  stepGlyph: {
    fontSize: 22,
    lineHeight: 26,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  railWrap: {
    flex: 1,
    marginHorizontal: tokens.space(3),
  },
  rail: {
    flexDirection: "row",
    height: 12,
    borderRadius: tokens.radius.sm,
    overflow: "hidden",
  },
  bandCell: {
    height: "100%",
    backgroundColor: tokens.color.border,
  },
  bandCellOn: {
    backgroundColor: tokens.color.accent,
  },
  bandDivider: {
    borderLeftWidth: 2,
    borderLeftColor: tokens.color.bg,
  },
  marker: {
    position: "absolute",
    top: -6,
    width: 3,
    height: 24,
    borderRadius: 2,
    backgroundColor: tokens.color.ink,
  },
  railLabels: {
    flexDirection: "row",
    marginTop: tokens.space(4),
  },
  railLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: tokens.color.faint,
  },
  railLabelOn: {
    fontWeight: "800",
    color: tokens.color.ink,
  },

  flip: {
    marginTop: tokens.space(6),
    padding: tokens.space(4),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
  },
  flipLine: {
    marginTop: tokens.space(2),
    fontSize: 14,
    lineHeight: 22,
    color: tokens.color.ink,
  },
  flipLineSub: {
    marginTop: tokens.space(2),
    fontSize: 13,
    lineHeight: 20,
    color: tokens.color.muted,
  },

  segments: {
    flexDirection: "row",
    marginTop: tokens.space(6),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    overflow: "hidden",
  },
  segment: {
    flex: 1,
    minHeight: 56,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: tokens.space(1),
  },
  segmentDivider: {
    borderLeftWidth: 1,
    borderLeftColor: tokens.color.border,
  },
  segmentOn: {
    backgroundColor: tokens.color.accent,
  },
  segmentText: {
    fontSize: 15,
    fontWeight: "600",
    color: tokens.color.ink,
  },
  segmentTextOn: {
    fontWeight: "800",
    color: tokens.color.onAccent,
  },
  segmentTag: {
    marginTop: 3,
    fontSize: 9,
    letterSpacing: 1,
    fontWeight: "800",
    color: tokens.color.accent,
  },
  segmentTagOn: {
    color: tokens.color.onAccent,
  },

  card: {
    marginTop: tokens.space(4),
    padding: tokens.space(4),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
  },
  cardHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  pill: {
    fontSize: 10,
    letterSpacing: 1,
    fontWeight: "800",
    color: tokens.color.muted,
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.sm,
    paddingHorizontal: tokens.space(2),
    paddingVertical: tokens.space(1),
    overflow: "hidden",
  },
  cardBlurb: {
    marginTop: tokens.space(2),
    fontSize: 13,
    lineHeight: 19,
    color: tokens.color.muted,
  },
  statRow: {
    flexDirection: "row",
    marginTop: tokens.space(4),
  },
  stat: {
    flex: 1,
  },
  statLabel: {
    marginBottom: tokens.space(1),
    fontSize: 11,
    fontWeight: "600",
    color: tokens.color.faint,
  },
  statValue: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  cardFoot: {
    marginTop: tokens.space(4),
    paddingTop: tokens.space(3),
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
  },
  cardFootLine: {
    fontSize: 13,
    lineHeight: 20,
    color: tokens.color.muted,
  },

  dock: {
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(4),
    paddingBottom: tokens.space(4),
  },
  dockStatus: {
    fontSize: 14,
    lineHeight: 21,
    color: tokens.color.ink,
  },
  dockActions: {
    flexDirection: "row",
    marginTop: tokens.space(3),
  },
  ghostButton: {
    flex: 1,
    minHeight: 52,
    marginRight: tokens.space(3),
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: tokens.space(2),
  },
  ghostText: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  primaryButton: {
    flex: 1.6,
    minHeight: 52,
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.color.accent,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: tokens.space(3),
  },
  primaryText: {
    fontSize: 15,
    fontWeight: "800",
    color: tokens.color.onAccent,
  },
  pressed: {
    opacity: 0.72,
  },

  money: {
    fontSize: 14,
    fontWeight: "800",
    color: tokens.color.ink2,
    fontVariant: ["tabular-nums"],
  },
});
