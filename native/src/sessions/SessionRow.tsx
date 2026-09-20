// native/src/sessions/SessionRow.tsx
//
// A single "other session" row. Tapping "Sign out" does not spawn a native
// Alert — the row itself swaps its trailing control for an inline
// Cancel / Confirm-sign-out pair (`status === "confirming"`), then, once
// confirmed, shows a brief "Signed out" acknowledgement (`status ===
// "signedOut"`) before the parent removes it from the list. Both transitions
// are announced through a nested accessibilityRole="alert" inside an
// accessibilityLiveRegion="polite" container.
//
// Deliberately NOT `accessible={true}` anywhere in this file: the row wraps
// its own tappable "Sign out" / "Cancel" / "Confirm sign out" Pressables, and
// collapsing that subtree into one opaque focus unit would make those
// controls unreachable to VoiceOver/TalkBack.

import { Text, View, Pressable, StyleSheet } from "react-native";
import { tokens } from "../tokens";
import { DEVICE_KIND_LABEL, type Session } from "./data";

export type RowStatus = "idle" | "confirming" | "signedOut";

type Props = {
  session: Session;
  status: RowStatus;
  onRequestSignOut: (id: string) => void;
  onCancel: () => void;
  onConfirm: (id: string) => void;
};

export default function SessionRow({
  session,
  status,
  onRequestSignOut,
  onCancel,
  onConfirm,
}: Props) {
  const meta = `${DEVICE_KIND_LABEL[session.deviceKind]} · ${session.location}`;

  return (
    <View style={styles.row}>
      <View style={styles.infoBlock}>
        <Text style={styles.deviceLabel}>{session.deviceLabel}</Text>
        <Text style={styles.metaLine}>{meta}</Text>
        <Text style={[styles.lastActive, styles.tabularNums]}>
          {session.lastActiveLabel}
        </Text>
      </View>

      {status === "idle" && (
        <Pressable
          onPress={() => onRequestSignOut(session.id)}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={`Sign out of ${session.deviceLabel}, ${session.location}`}
          accessibilityHint="Opens a confirmation for this session, in place."
          style={({ pressed }) => [
            styles.signOutButton,
            pressed && styles.signOutButtonPressed,
          ]}
        >
          <Text style={styles.signOutLabel}>Sign out</Text>
        </Pressable>
      )}

      {status === "confirming" && (
        <View
          style={styles.confirmBlock}
          accessibilityLiveRegion="polite"
        >
          <Text
            accessibilityRole="alert"
            style={styles.confirmText}
          >
            {`Sign out of ${session.deviceLabel}? That device will be signed out immediately.`}
          </Text>
          <View style={styles.confirmActions}>
            <Pressable
              onPress={onCancel}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Cancel sign out"
              style={({ pressed }) => [
                styles.cancelButton,
                pressed && styles.cancelButtonPressed,
              ]}
            >
              <Text style={styles.cancelLabel}>Cancel</Text>
            </Pressable>
            <Pressable
              onPress={() => onConfirm(session.id)}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel={`Confirm sign out of ${session.deviceLabel}`}
              accessibilityHint="Ends this session and removes it from the list."
              style={({ pressed }) => [
                styles.confirmButton,
                pressed && styles.confirmButtonPressed,
              ]}
            >
              <Text style={styles.confirmLabel}>Confirm sign out</Text>
            </Pressable>
          </View>
        </View>
      )}

      {status === "signedOut" && (
        <View
          style={styles.signedOutBlock}
          accessibilityLiveRegion="polite"
        >
          <Text accessibilityRole="alert" style={styles.signedOutText}>
            {`Signed out of ${session.deviceLabel}.`}
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
  deviceLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: tokens.color.ink,
  },
  metaLine: {
    fontSize: 13,
    color: tokens.color.muted,
  },
  lastActive: {
    fontSize: 13,
    color: tokens.color.faint,
  },
  tabularNums: {
    fontVariant: ["tabular-nums"],
  },
  signOutButton: {
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
  signOutButtonPressed: {
    backgroundColor: tokens.color.ink2,
  },
  signOutLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.ink2,
    letterSpacing: 0.2,
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
    backgroundColor: tokens.color.ink,
  },
  confirmButtonPressed: {
    backgroundColor: tokens.color.ink2,
  },
  confirmLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.onInk,
  },
  signedOutBlock: {
    minHeight: 44,
    justifyContent: "center",
  },
  signedOutText: {
    fontSize: 14,
    fontWeight: "600",
    color: tokens.color.muted,
  },
});
