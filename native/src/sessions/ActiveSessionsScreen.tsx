// native/src/sessions/ActiveSessionsScreen.tsx
//
// Concept: "Active Sessions" — an account-security device manager. The
// current device is pinned above a virtualized FlatList of every OTHER
// signed-in session (device name, approximate location, last-active time).
// The current device has no sign-out control — you cannot remotely end the
// session you're reading this on. Every other row can be signed out, and
// tapping "Sign out" never opens a native Alert: it converts that row, in
// place, into an inline Cancel / Confirm-sign-out pair.
//
// Band-form choice: there is NO fixed bottom band anywhere on this screen.
// The current device is rendered via FlatList's own ListHeaderComponent, so
// it scrolls together with the rest of the sessions inside one FlatList —
// there is no second ScrollView and no persistent chrome pinned outside the
// list. The destructive-confirm surface lives locally in the row that
// triggered it, not in a global bar.
//
// Differentiation from named prior screens: this is not the read-only "My
// Impact" stats screen (nothing here is passive display — every other row is
// a live security control). It is not the saved-searches/price-alerts
// manager either: that screen's per-row control is an immediate-apply
// toggle with no confirmation step; this screen's per-row control is a
// deliberately gated destructive action that must be confirmed in place
// before anything happens.

import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { tokens } from "../tokens";
import SessionRow, { type RowStatus } from "./SessionRow";
import {
  CURRENT_SESSION,
  DEVICE_KIND_LABEL,
  INITIAL_OTHER_SESSIONS,
  type Session,
} from "./data";

// How long the inline "Signed out" acknowledgement stays visible in the row
// before it's actually removed from the list. Fixed and deterministic — not
// derived from any clock.
const SIGN_OUT_ACK_MS = 900;

export default function ActiveSessionsScreen() {
  const [otherSessions, setOtherSessions] = useState<Session[]>(
    INITIAL_OTHER_SESSIONS,
  );
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeStatus, setActiveStatus] = useState<
    Exclude<RowStatus, "idle"> | null
  >(null);
  const removalTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearRemovalTimer = () => {
    if (removalTimer.current !== null) {
      clearTimeout(removalTimer.current);
      removalTimer.current = null;
    }
  };

  useEffect(() => clearRemovalTimer, []);

  // Only one row may be non-idle (confirming OR mid sign-out) at a time, so
  // exactly one accessibilityLiveRegion is ever live on this screen. If a
  // second row's "Sign out" is tapped while the first is still finishing its
  // "Signed out" acknowledgement, that first removal is finalized right away
  // and the new row takes over the single active slot.
  const requestSignOut = (id: string) => {
    if (activeId !== null && activeId !== id && activeStatus === "signedOut") {
      clearRemovalTimer();
      const finishedId = activeId;
      setOtherSessions((prev) => prev.filter((s) => s.id !== finishedId));
    }
    setActiveId(id);
    setActiveStatus("confirming");
  };

  const cancelSignOut = () => {
    setActiveId(null);
    setActiveStatus(null);
  };

  const confirmSignOut = (id: string) => {
    setActiveStatus("signedOut");
    clearRemovalTimer();
    removalTimer.current = setTimeout(() => {
      setOtherSessions((prev) => prev.filter((s) => s.id !== id));
      setActiveId(null);
      setActiveStatus(null);
      removalTimer.current = null;
    }, SIGN_OUT_ACK_MS);
  };

  const rowStatus = (id: string): RowStatus =>
    activeId === id && activeStatus ? activeStatus : "idle";

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={otherSessions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SessionRow
            session={item}
            status={rowStatus(item.id)}
            onRequestSignOut={requestSignOut}
            onCancel={cancelSignOut}
            onConfirm={confirmSignOut}
          />
        )}
        ListHeaderComponent={
          <View style={styles.headerArea}>
            <Text accessibilityRole="header" style={styles.title}>
              Active Sessions
            </Text>
            <Text style={styles.subtitle}>
              Devices currently signed in to your repick account. Sign out of
              any device you don't recognize.
            </Text>

            <Text accessibilityRole="header" style={styles.sectionLabel}>
              This device
            </Text>
            <View style={styles.currentRow}>
              <View style={styles.currentInfo}>
                <View style={styles.currentTitleLine}>
                  <Text style={styles.deviceLabel}>
                    {CURRENT_SESSION.deviceLabel}
                  </Text>
                  <View style={styles.currentBadge}>
                    <Text style={styles.currentBadgeText}>This device</Text>
                  </View>
                </View>
                <Text style={styles.metaLine}>
                  {`${DEVICE_KIND_LABEL[CURRENT_SESSION.deviceKind]} · ${CURRENT_SESSION.location}`}
                </Text>
                <Text style={[styles.lastActive, styles.tabularNums]}>
                  {CURRENT_SESSION.lastActiveLabel}
                </Text>
                <Text style={styles.currentNote}>
                  You're using this device right now, so it can't be signed
                  out remotely.
                </Text>
              </View>
            </View>

            <Text accessibilityRole="header" style={styles.sectionLabel}>
              Other sessions
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              No other sessions are signed in right now. When you sign in
              from another device, it will appear here.
            </Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: tokens.space(8),
  },
  headerArea: {
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(4),
    gap: tokens.space(2),
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  subtitle: {
    fontSize: 14,
    color: tokens.color.muted,
    lineHeight: 20,
    marginBottom: tokens.space(2),
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: tokens.color.faint,
    textTransform: "uppercase",
    letterSpacing: 0.4,
    marginTop: tokens.space(3),
  },
  currentRow: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(4),
  },
  currentInfo: {
    gap: tokens.space(1),
  },
  currentTitleLine: {
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.space(2),
    flexWrap: "wrap",
  },
  deviceLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: tokens.color.ink,
  },
  currentBadge: {
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.accent,
    paddingHorizontal: tokens.space(2),
    paddingVertical: tokens.space(1) / 2,
  },
  currentBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: tokens.color.onAccent,
    textTransform: "uppercase",
    letterSpacing: 0.4,
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
  currentNote: {
    fontSize: 12,
    color: tokens.color.faint,
    marginTop: tokens.space(1),
    lineHeight: 16,
  },
  emptyState: {
    paddingHorizontal: tokens.space(5),
    paddingVertical: tokens.space(6),
  },
  emptyText: {
    fontSize: 14,
    color: tokens.color.muted,
    lineHeight: 20,
  },
});
