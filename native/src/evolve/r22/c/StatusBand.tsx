// native/src/evolve/r22/c/StatusBand.tsx
// The bottom-band blocked-workflow state machine for this screen: it explains
// in a real sentence why confirmation can't happen yet, jumps to whichever
// step is unresolved when tapped, and turns into the actual "Confirm
// drop-off" action once both a location and a slot are picked.
import React from "react";
import { Pressable, Text, View, StyleSheet } from "react-native";
import { tokens } from "../../../tokens";

export type SchedulePhase = "needsLocation" | "needsSlot" | "readyToConfirm" | "confirmed";

interface StatusBandProps {
  phase: SchedulePhase;
  locationName: string | null;
  slotLabel: string | null;
  confirmationCode: string | null;
  onPress: () => void;
}

export function StatusBand({
  phase,
  locationName,
  slotLabel,
  confirmationCode,
  onPress,
}: StatusBandProps) {
  let headline: string;
  let detail: string | null = null;
  let hint: string | undefined;

  if (phase === "needsLocation") {
    headline = "Pick a partner store before this can be confirmed.";
    hint = "Jumps back up to the store list.";
  } else if (phase === "needsSlot") {
    headline = `${locationName ?? "This store"} is set — pick an open time to continue.`;
    hint = "Jumps down to the time grid for this store.";
  } else if (phase === "readyToConfirm") {
    headline = "Confirm drop-off";
    detail = `${locationName ?? ""} · ${slotLabel ?? ""}`;
    hint = "Locks in this appointment and reveals your confirmation code.";
  } else {
    headline = "Drop-off confirmed";
    detail = `Code ${confirmationCode ?? ""} · ${locationName ?? ""} · ${slotLabel ?? ""}`;
  }

  const interactive = phase !== "confirmed";

  return (
    <View style={styles.wrap} accessibilityLiveRegion="polite">
      <Pressable
        onPress={interactive ? onPress : undefined}
        disabled={!interactive}
        accessibilityRole="button"
        accessibilityLabel={headline}
        accessibilityHint={hint}
        style={({ pressed }) => [
          styles.touchable,
          phase === "readyToConfirm" && styles.touchableReady,
          phase === "confirmed" && styles.touchableDone,
          pressed && interactive && styles.touchablePressed,
        ]}
      >
        <Text
          accessibilityRole="alert"
          style={[
            styles.headline,
            (phase === "readyToConfirm" || phase === "confirmed") && styles.headlineEmphasis,
          ]}
        >
          {headline}
        </Text>
        {detail ? (
          <Text
            style={[styles.detail, phase === "readyToConfirm" && styles.detailOnAccent]}
          >
            {detail}
          </Text>
        ) : null}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
  },
  touchable: {
    minHeight: 56,
    paddingVertical: tokens.space(3),
    paddingHorizontal: tokens.space(4),
    justifyContent: "center",
  },
  touchableReady: {
    backgroundColor: tokens.color.accent,
  },
  touchableDone: {
    backgroundColor: tokens.color.ink,
  },
  touchablePressed: {
    opacity: 0.85,
  },
  headline: {
    fontSize: 15,
    fontWeight: "600",
    color: tokens.color.ink,
  },
  headlineEmphasis: {
    color: tokens.color.onAccent,
    fontSize: 16,
  },
  detail: {
    marginTop: tokens.space(1),
    fontSize: 13,
    color: tokens.color.onInkMuted,
    fontVariant: ["tabular-nums"],
  },
  detailOnAccent: {
    color: tokens.color.onAccent,
  },
});
