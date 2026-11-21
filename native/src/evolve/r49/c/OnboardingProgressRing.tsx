// native/src/evolve/r49/c/OnboardingProgressRing.tsx
// Small circular progress indicator for the Seller Onboarding Checklist.
// Purely presentational and fully driven by the `ratio` prop the parent
// screen computes from its own state (completedCount / totalCount) — this
// component has no state and touches no random/time source itself.
//
// The ring is decorative sugar on top of the "N of M complete" text the
// parent screen renders beside it, so it is hidden from assistive tech
// (importantForAccessibility="no-hide-descendants") rather than being
// announced twice.
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { tokens } from "../../../tokens";

const RING_SIZE = 64;
const STROKE_WIDTH = 6;
const RING_RADIUS = (RING_SIZE - STROKE_WIDTH) / 2;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

export function OnboardingProgressRing({
  ratio,
  centerLabel,
}: {
  ratio: number;
  centerLabel: string;
}) {
  const clampedRatio = Math.max(0, Math.min(1, ratio));
  const filledArcLength = RING_CIRCUMFERENCE * clampedRatio;
  const remainderArcLength = RING_CIRCUMFERENCE - filledArcLength;

  return (
    <View
      style={styles.wrap}
      importantForAccessibility="no-hide-descendants"
    >
      <Svg width={RING_SIZE} height={RING_SIZE}>
        <Circle
          cx={RING_SIZE / 2}
          cy={RING_SIZE / 2}
          r={RING_RADIUS}
          stroke={tokens.color.border}
          strokeWidth={STROKE_WIDTH}
          fill="none"
        />
        <Circle
          cx={RING_SIZE / 2}
          cy={RING_SIZE / 2}
          r={RING_RADIUS}
          stroke={tokens.color.accent}
          strokeWidth={STROKE_WIDTH}
          fill="none"
          strokeDasharray={`${filledArcLength}, ${remainderArcLength}`}
          strokeLinecap="round"
          rotation={-90}
          originX={RING_SIZE / 2}
          originY={RING_SIZE / 2}
        />
      </Svg>
      <View style={styles.centerOverlay} pointerEvents="none">
        <Text style={styles.centerLabelText}>{centerLabel}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: RING_SIZE,
    height: RING_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  centerOverlay: {
    position: "absolute",
    width: RING_SIZE,
    height: RING_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  centerLabelText: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.ink,
    fontVariant: ["tabular-nums"],
  },
});
