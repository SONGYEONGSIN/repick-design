// native/src/evolve/r31/b/SecurityActivityLogScreen.tsx
//
// Security Activity Log — an append-only, read-only record of account
// security events (sign-ins, failed attempts, device verifications,
// password changes). This is deliberately NOT a "manage your sessions"
// screen: rows are history, not a live list you can delete entries from.
//
// The action bar at the bottom is a persistent, always-visible bar (not a
// step-by-step workflow) that does two genuinely wired things:
//   1. "Sign Out Other Devices" — stamps every other-device sign-in row as
//      ended, after an in-place Cancel/Confirm step.
//   2. "Report Suspicious Activity" — stamps every flagged (warning/danger)
//      row as reported to the security team.
// Both effects are visible immediately in the list below and echoed through
// a single polite live region.

import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { tokens } from "../../../tokens";
import {
  ACTION_NOW_DISPLAY,
  ACTION_NOW_ISO,
  ActivityEntry,
  EntrySeverity,
  INITIAL_ENTRIES,
} from "./data";

const SEVERITY_LOOK: Record<
  EntrySeverity,
  { bg: string; border: string; ink: string; dot: string; tag: string }
> = {
  neutral: {
    bg: tokens.color.bg,
    border: tokens.color.border,
    ink: tokens.color.ink2,
    dot: tokens.color.faint,
    tag: "Normal",
  },
  success: {
    bg: tokens.color.successBg,
    border: tokens.color.successBorder,
    ink: tokens.color.success,
    dot: tokens.color.success,
    tag: "Account change",
  },
  warning: {
    bg: tokens.color.warningBg,
    border: tokens.color.warningBorder,
    ink: tokens.color.warning,
    dot: tokens.color.warning,
    tag: "Flagged",
  },
  danger: {
    bg: tokens.color.dangerBg,
    border: tokens.color.dangerBorder,
    ink: tokens.color.danger,
    dot: tokens.color.danger,
    tag: "Flagged",
  },
};

function countLabel(count: number, singular: string, plural: string): string {
  return `${count} ${count === 1 ? singular : plural}`;
}

export default function SecurityActivityLogScreen() {
  const [entries, setEntries] = useState<ActivityEntry[]>(INITIAL_ENTRIES);
  const [confirmingSignOut, setConfirmingSignOut] = useState(false);
  const [otherDevicesEnded, setOtherDevicesEnded] = useState(false);
  const [activityReported, setActivityReported] = useState(false);
  const [liveMessage, setLiveMessage] = useState("");

  const otherActiveDevices = useMemo(
    () =>
      entries.filter(
        (e) => e.kind === "signIn" && !e.isCurrentDevice && !e.sessionEndedIso
      ),
    [entries]
  );
  const unreportedFlagged = useMemo(
    () =>
      entries.filter(
        (e) =>
          (e.severity === "warning" || e.severity === "danger") &&
          !e.reportedIso
      ),
    [entries]
  );

  const otherActiveCount = otherActiveDevices.length;
  const unreportedFlaggedCount = unreportedFlagged.length;

  function handleSignOutPress() {
    if (otherDevicesEnded || otherActiveCount === 0) return;
    setConfirmingSignOut(true);
    setLiveMessage(
      `Sign out ${countLabel(
        otherActiveCount,
        "other device",
        "other devices"
      )}? Their active sessions will end right away.`
    );
  }

  function handleCancelSignOut() {
    setConfirmingSignOut(false);
    setLiveMessage("Sign-out cancelled. Other devices remain signed in.");
  }

  function handleConfirmSignOut() {
    const endIds = new Set(otherActiveDevices.map((e) => e.id));
    setEntries((prev) =>
      prev.map((e) =>
        endIds.has(e.id)
          ? {
              ...e,
              sessionEndedIso: ACTION_NOW_ISO,
              sessionEndedDisplay: ACTION_NOW_DISPLAY,
            }
          : e
      )
    );
    setConfirmingSignOut(false);
    setOtherDevicesEnded(true);
    setLiveMessage(
      `Done. ${countLabel(
        otherActiveCount,
        "other device",
        "other devices"
      )} signed out at ${ACTION_NOW_DISPLAY}.`
    );
  }

  function handleReportPress() {
    if (activityReported || unreportedFlaggedCount === 0) return;
    const reportIds = new Set(unreportedFlagged.map((e) => e.id));
    setEntries((prev) =>
      prev.map((e) =>
        reportIds.has(e.id)
          ? {
              ...e,
              reportedIso: ACTION_NOW_ISO,
              reportedDisplay: ACTION_NOW_DISPLAY,
            }
          : e
      )
    );
    setActivityReported(true);
    setLiveMessage(
      `Reported. Security will review ${countLabel(
        unreportedFlaggedCount,
        "flagged entry",
        "flagged entries"
      )} from this log.`
    );
  }

  const flaggedTotal = entries.filter(
    (e) => e.severity === "warning" || e.severity === "danger"
  ).length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text accessibilityRole="header" style={styles.title}>
          Security Activity Log
        </Text>
        <Text style={styles.subtitle}>
          A running record of sign-ins, device verifications, and account
          changes. This history cannot be edited or deleted.
        </Text>
        <Text style={styles.statsLine}>
          {countLabel(entries.length, "entry", "entries")}
          {"  ·  "}
          {countLabel(flaggedTotal, "flagged entry", "flagged entries")}
        </Text>
      </View>

      <View
        accessibilityLiveRegion="polite"
        style={styles.liveRegion}
      >
        <Text
          accessibilityRole={liveMessage ? "alert" : undefined}
          style={liveMessage ? styles.liveTextActive : styles.liveTextIdle}
        >
          {liveMessage ||
            "No pending security alerts. Current activity is shown below."}
        </Text>
      </View>

      <FlatList
        style={styles.list}
        contentContainerStyle={styles.listContent}
        data={entries}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <LogRow entry={item} />}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      <View style={styles.band}>
        {!confirmingSignOut ? (
          <View style={styles.bandRow}>
            <Pressable
              onPress={handleSignOutPress}
              disabled={otherDevicesEnded || otherActiveCount === 0}
              accessibilityRole="button"
              accessibilityLabel={
                otherDevicesEnded
                  ? "Other devices already signed out"
                  : `Sign out ${countLabel(
                      otherActiveCount,
                      "other device",
                      "other devices"
                    )}`
              }
              accessibilityHint={
                otherDevicesEnded || otherActiveCount === 0
                  ? undefined
                  : "Opens a confirmation step before ending other devices' sessions."
              }
              style={({ pressed }) => [
                styles.bandButton,
                styles.bandButtonPrimary,
                (otherDevicesEnded || otherActiveCount === 0) &&
                  styles.bandButtonDisabled,
                pressed &&
                  !(otherDevicesEnded || otherActiveCount === 0) &&
                  styles.bandButtonPressed,
              ]}
            >
              <Text
                style={[
                  styles.bandButtonTextPrimary,
                  (otherDevicesEnded || otherActiveCount === 0) &&
                    styles.bandButtonTextDisabled,
                ]}
              >
                {otherDevicesEnded
                  ? "Other Devices Signed Out"
                  : `Sign Out Other Devices (${otherActiveCount})`}
              </Text>
            </Pressable>

            <Pressable
              onPress={handleReportPress}
              disabled={activityReported || unreportedFlaggedCount === 0}
              accessibilityRole="button"
              accessibilityLabel={
                activityReported
                  ? "Suspicious activity already reported"
                  : "Report suspicious activity"
              }
              accessibilityHint={
                activityReported || unreportedFlaggedCount === 0
                  ? undefined
                  : "Marks every flagged entry in this log as reported to the security team."
              }
              style={({ pressed }) => [
                styles.bandButton,
                styles.bandButtonSecondary,
                (activityReported || unreportedFlaggedCount === 0) &&
                  styles.bandButtonDisabled,
                pressed &&
                  !(activityReported || unreportedFlaggedCount === 0) &&
                  styles.bandButtonPressed,
              ]}
            >
              <Text
                style={[
                  styles.bandButtonTextSecondary,
                  (activityReported || unreportedFlaggedCount === 0) &&
                    styles.bandButtonTextDisabled,
                ]}
              >
                {activityReported ? "Reported" : "Report Suspicious Activity"}
              </Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.bandRow}>
            <Pressable
              onPress={handleCancelSignOut}
              accessibilityRole="button"
              accessibilityLabel="Cancel sign-out"
              style={({ pressed }) => [
                styles.bandButton,
                styles.bandButtonSecondary,
                pressed && styles.bandButtonPressed,
              ]}
            >
              <Text style={styles.bandButtonTextSecondary}>Cancel</Text>
            </Pressable>

            <Pressable
              onPress={handleConfirmSignOut}
              accessibilityRole="button"
              accessibilityLabel="Confirm sign-out of other devices"
              accessibilityHint="Ends every other active session now. This can't be undone."
              style={({ pressed }) => [
                styles.bandButton,
                styles.bandButtonDanger,
                pressed && styles.bandButtonPressed,
              ]}
            >
              <Text style={styles.bandButtonTextPrimary}>
                Confirm Sign-Out
              </Text>
            </Pressable>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

function LogRow({ entry }: { entry: ActivityEntry }) {
  const look = SEVERITY_LOOK[entry.severity];
  const isFlagged = entry.severity === "warning" || entry.severity === "danger";

  const parts = [
    entry.deviceName,
    entry.location,
    entry.displayTime,
    entry.summary,
  ];
  if (entry.isCurrentDevice) parts.push("This device");
  if (entry.sessionEndedDisplay)
    parts.push(`Session ended ${entry.sessionEndedDisplay}`);
  if (entry.reportedDisplay)
    parts.push(`Reported ${entry.reportedDisplay}`);

  return (
    <View
      accessible
      accessibilityLabel={parts.join(". ")}
      style={[
        styles.row,
        { backgroundColor: look.bg, borderColor: look.border },
      ]}
    >
      <View style={styles.rowTopLine}>
        <View style={styles.rowTitleGroup}>
          <View style={[styles.dot, { backgroundColor: look.dot }]} />
          <Text style={styles.deviceName}>{entry.deviceName}</Text>
        </View>
        <Text style={[styles.tag, { color: look.ink }]}>{look.tag}</Text>
      </View>

      <Text style={styles.metaText}>
        {entry.location} · {entry.displayTime}
      </Text>

      <Text style={[styles.summaryText, isFlagged && { color: look.ink }]}>
        {entry.summary}
      </Text>

      {entry.isCurrentDevice && (
        <Text style={styles.currentBadge}>This device</Text>
      )}
      {entry.sessionEndedDisplay && (
        <Text style={styles.endedText}>
          Session ended {entry.sessionEndedDisplay}
        </Text>
      )}
      {entry.reportedDisplay && (
        <Text style={styles.reportedText}>
          Reported to security team {entry.reportedDisplay}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  header: {
    paddingHorizontal: tokens.space(4),
    paddingTop: tokens.space(4),
    paddingBottom: tokens.space(2),
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  subtitle: {
    marginTop: tokens.space(1),
    fontSize: 13,
    lineHeight: 18,
    color: tokens.color.muted,
  },
  statsLine: {
    marginTop: tokens.space(2),
    fontSize: 12,
    fontWeight: "600",
    color: tokens.color.faint,
  },
  liveRegion: {
    marginHorizontal: tokens.space(4),
    marginTop: tokens.space(2),
    marginBottom: tokens.space(1),
    paddingVertical: tokens.space(2),
    paddingHorizontal: tokens.space(3),
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.accentBg,
  },
  liveTextIdle: {
    fontSize: 12,
    color: tokens.color.muted,
  },
  liveTextActive: {
    fontSize: 13,
    fontWeight: "600",
    color: tokens.color.ink,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: tokens.space(4),
    paddingTop: tokens.space(2),
    paddingBottom: tokens.space(4),
  },
  separator: {
    height: tokens.space(3),
  },
  row: {
    borderWidth: 1,
    borderRadius: tokens.radius.md,
    padding: tokens.space(3),
  },
  rowTopLine: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowTitleGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.space(2),
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  deviceName: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  tag: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  metaText: {
    marginTop: tokens.space(1),
    fontSize: 12,
    color: tokens.color.faint,
  },
  summaryText: {
    marginTop: tokens.space(1),
    fontSize: 13,
    color: tokens.color.ink2,
  },
  currentBadge: {
    marginTop: tokens.space(2),
    fontSize: 11,
    fontWeight: "700",
    color: tokens.color.accent,
  },
  endedText: {
    marginTop: tokens.space(2),
    fontSize: 12,
    color: tokens.color.muted,
  },
  reportedText: {
    marginTop: tokens.space(2),
    fontSize: 12,
    color: tokens.color.muted,
  },
  band: {
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    paddingHorizontal: tokens.space(4),
    paddingVertical: tokens.space(3),
    backgroundColor: tokens.color.bg,
  },
  bandRow: {
    flexDirection: "row",
    gap: tokens.space(3),
  },
  bandButton: {
    flex: 1,
    minHeight: 44,
    borderRadius: tokens.radius.md,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: tokens.space(3),
    paddingVertical: tokens.space(3),
    borderWidth: 1,
  },
  bandButtonPrimary: {
    backgroundColor: tokens.color.ink,
    borderColor: tokens.color.ink,
  },
  bandButtonSecondary: {
    backgroundColor: tokens.color.bg,
    borderColor: tokens.color.border,
  },
  bandButtonDanger: {
    backgroundColor: tokens.color.danger,
    borderColor: tokens.color.danger,
  },
  bandButtonDisabled: {
    backgroundColor: tokens.color.bg,
    borderColor: tokens.color.border,
  },
  bandButtonPressed: {
    opacity: 0.85,
  },
  bandButtonTextPrimary: {
    fontSize: 13,
    fontWeight: "700",
    color: tokens.color.onInk,
    textAlign: "center",
  },
  bandButtonTextSecondary: {
    fontSize: 13,
    fontWeight: "700",
    color: tokens.color.ink,
    textAlign: "center",
  },
  bandButtonTextDisabled: {
    color: tokens.color.faint,
  },
});
