// native/src/evolve/r31/a/ExportBand.tsx
// The bottom band for the Account Data Export flow. A genuine three-state
// machine: "drafting" (possibly blocked), "compiling" (processing, no
// affordance to fake), and "packaged" (a real share action).
import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { tokens } from "../../../tokens";

export type ExportPhase = "drafting" | "compiling" | "packaged";

type Props = {
  phase: ExportPhase;
  canSubmit: boolean;
  blockedReason: string | null;
  etaMinutes: number;
  onPressBlocked: () => void;
  onSubmit: () => void;
  onShare: () => void;
};

export function ExportBand({
  phase,
  canSubmit,
  blockedReason,
  etaMinutes,
  onPressBlocked,
  onSubmit,
  onShare,
}: Props) {
  if (phase === "compiling") {
    return (
      <View style={styles.wrap}>
        <View style={styles.statusRow} accessible accessibilityLabel={`Compiling your export, about ${etaMinutes} minute${etaMinutes === 1 ? "" : "s"} remaining`}>
          <View style={styles.dot} />
          <Text style={styles.statusText}>
            {`Compiling your export — about ${etaMinutes} min remaining`}
          </Text>
        </View>
      </View>
    );
  }

  if (phase === "packaged") {
    return (
      <View style={styles.wrap}>
        <Pressable
          style={({ pressed }) => [styles.primaryButton, pressed && styles.primaryButtonPressed]}
          onPress={onShare}
          accessibilityRole="button"
          accessibilityLabel="Share download link"
          accessibilityHint="Opens the share sheet with your export's download link."
          hitSlop={8}
        >
          <Text style={styles.primaryButtonText}>Share Download Link</Text>
        </Pressable>
      </View>
    );
  }

  // phase === "drafting"
  if (canSubmit) {
    return (
      <View style={styles.wrap}>
        <Pressable
          style={({ pressed }) => [styles.primaryButton, pressed && styles.primaryButtonPressed]}
          onPress={onSubmit}
          accessibilityRole="button"
          accessibilityLabel="Request export"
          accessibilityHint="Starts compiling the categories you selected and will send the archive link to your confirmed email."
          hitSlop={8}
        >
          <Text style={styles.primaryButtonText}>Request Export</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.wrap}>
      <Pressable
        style={({ pressed }) => [styles.blockedButton, pressed && styles.blockedButtonPressed]}
        onPress={onPressBlocked}
        accessibilityRole="button"
        accessibilityLabel={blockedReason ?? "Can't request export yet"}
        accessibilityHint="Scrolls to the first thing that needs your attention."
        hitSlop={8}
      >
        <Text style={styles.blockedText}>{blockedReason}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    paddingHorizontal: tokens.space(4),
    paddingTop: tokens.space(3),
    paddingBottom: tokens.space(4),
  },
  primaryButton: {
    minHeight: 48,
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.color.accent,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: tokens.space(4),
  },
  primaryButtonPressed: {
    opacity: 0.85,
  },
  primaryButtonText: {
    color: tokens.color.onAccent,
    fontSize: 16,
    fontWeight: "600",
  },
  blockedButton: {
    minHeight: 48,
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.color.ink2,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: tokens.space(4),
    paddingVertical: tokens.space(2),
  },
  blockedButtonPressed: {
    opacity: 0.85,
  },
  blockedText: {
    color: tokens.color.onInkMuted,
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
  statusRow: {
    minHeight: 48,
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.color.accentBg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: tokens.space(4),
    gap: tokens.space(2),
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: tokens.color.accent,
  },
  statusText: {
    color: tokens.color.ink2,
    fontSize: 14,
    fontWeight: "600",
  },
});
