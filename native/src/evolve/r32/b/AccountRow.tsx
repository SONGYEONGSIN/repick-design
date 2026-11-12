import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { tokens } from "../../../tokens";
import { LinkedAccount, formatCount, formatLinkedSince } from "./data";

export type AccountRowState = "normal" | "confirming" | "locked";

type Props = {
  account: LinkedAccount;
  rowState: AccountRowState;
  onUnlinkPress: (account: LinkedAccount) => void;
  onCancelPress: (account: LinkedAccount) => void;
  onConfirmPress: (account: LinkedAccount) => void;
  onMakePrimaryPress: (account: LinkedAccount) => void;
};

export function AccountRow({
  account,
  rowState,
  onUnlinkPress,
  onCancelPress,
  onConfirmPress,
  onMakePrimaryPress,
}: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.infoBlock}>
        <View style={styles.titleRow}>
          <Text style={styles.platform}>{account.platform}</Text>
          {rowState === "locked" ? (
            <View style={styles.primaryBadge}>
              <Text style={styles.primaryBadgeText}>Primary</Text>
            </View>
          ) : null}
        </View>
        <Text style={styles.handle}>{account.handle}</Text>
        <Text style={styles.metaLine}>
          {formatCount(account.metricValue)} {account.metricLabel} · Linked since{" "}
          {formatLinkedSince(account.linkedSince)}
        </Text>
      </View>

      {rowState === "locked" ? (
        <Text style={styles.lockedNote}>
          This is your primary storefront link, so it can&apos;t be unlinked
          directly. Use &quot;Make primary&quot; on another account to replace
          it first.
        </Text>
      ) : null}

      {rowState === "confirming" ? (
        <View style={styles.actionRow}>
          <Pressable
            onPress={() => onCancelPress(account)}
            accessibilityRole="button"
            accessibilityLabel={`Cancel unlinking ${account.platform}`}
            accessibilityHint="Keeps this account linked and closes the confirmation step"
            hitSlop={8}
            style={({ pressed }) => [
              styles.secondaryButton,
              pressed && styles.secondaryButtonPressed,
            ]}
          >
            <Text style={styles.secondaryButtonText}>Cancel</Text>
          </Pressable>
          <Pressable
            onPress={() => onConfirmPress(account)}
            accessibilityRole="button"
            accessibilityLabel={`Confirm unlinking ${account.platform}`}
            accessibilityHint="Removes this account from your linked accounts"
            hitSlop={8}
            style={({ pressed }) => [
              styles.dangerButton,
              pressed && styles.dangerButtonPressed,
            ]}
          >
            <Text style={styles.dangerButtonText}>Confirm unlink</Text>
          </Pressable>
        </View>
      ) : null}

      {rowState === "normal" ? (
        <View style={styles.actionRow}>
          <Pressable
            onPress={() => onMakePrimaryPress(account)}
            accessibilityRole="button"
            accessibilityLabel={`Make ${account.platform} your primary storefront link`}
            accessibilityHint="Sets this account as primary and removes primary status from the current one"
            hitSlop={8}
            style={({ pressed }) => [
              styles.secondaryButton,
              pressed && styles.secondaryButtonPressed,
            ]}
          >
            <Text style={styles.secondaryButtonText}>Make primary</Text>
          </Pressable>
          <Pressable
            onPress={() => onUnlinkPress(account)}
            accessibilityRole="button"
            accessibilityLabel={`Unlink ${account.platform}`}
            accessibilityHint="Opens a confirmation step before removing this account"
            hitSlop={8}
            style={({ pressed }) => [
              styles.outlineButton,
              pressed && styles.outlineButtonPressed,
            ]}
          >
            <Text style={styles.outlineButtonText}>Unlink</Text>
          </Pressable>
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
    padding: tokens.space(4),
    backgroundColor: tokens.color.bg,
    gap: tokens.space(3),
  },
  infoBlock: {
    gap: tokens.space(1),
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.space(2),
  },
  platform: {
    fontSize: 16,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  handle: {
    fontSize: 14,
    color: tokens.color.muted,
  },
  metaLine: {
    fontSize: 12,
    color: tokens.color.faint,
    marginTop: tokens.space(1),
  },
  primaryBadge: {
    backgroundColor: tokens.color.accentBg,
    borderRadius: tokens.radius.sm,
    paddingHorizontal: tokens.space(2),
    paddingVertical: tokens.space(1),
  },
  primaryBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: tokens.color.accent,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  lockedNote: {
    fontSize: 12,
    color: tokens.color.muted,
    lineHeight: 17,
  },
  actionRow: {
    flexDirection: "row",
    gap: tokens.space(2),
  },
  outlineButton: {
    flex: 1,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.dangerBorder,
    backgroundColor: tokens.color.bg,
    paddingHorizontal: tokens.space(3),
  },
  outlineButtonPressed: {
    backgroundColor: tokens.color.dangerBg,
  },
  outlineButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: tokens.color.danger,
  },
  secondaryButton: {
    flex: 1,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    paddingHorizontal: tokens.space(3),
  },
  secondaryButtonPressed: {
    backgroundColor: tokens.color.accentBg,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: tokens.color.ink2,
  },
  dangerButton: {
    flex: 1,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.danger,
    paddingHorizontal: tokens.space(3),
  },
  dangerButtonPressed: {
    opacity: 0.85,
  },
  dangerButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.onAccent,
  },
});
