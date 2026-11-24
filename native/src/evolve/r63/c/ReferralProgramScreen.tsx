// native/src/evolve/r63/c/ReferralProgramScreen.tsx — auto-native-r63 candidate c.
//
// Referral Program — a read-only record of who the user has already invited,
// plus their one standing, always-available invite link. There is no blocked
// step anywhere on this screen: nobody is mid-workflow, nothing is "not
// ready yet." Per GENERATION.md §3 that rules out a blocked/ready/done
// state-machine band. The fitting form is the persistent, always-mounted
// action bar with exactly one real action underneath it.
//
// That one action is "Share Invite Link," wired to React Native's built-in
// `Share.share()` (core API, no extra dependency — confirmed present in
// node_modules/react-native/index.js; no clipboard package is listed in
// native/package.json, and nothing was installed to get one). The bar's
// confirmation is NOT a timer-faked toast: `Share.share()` resolves with an
// `action` field, and only `Share.sharedAction` flips the bar into its
// confirmed state. A user backing out of the native share sheet resolves
// with `dismissedAction`, which this screen reports honestly as "nothing
// shared" rather than pretending success — and a thrown rejection (e.g. the
// share sheet failing to open) reports as a distinct failure sentence. None
// of the three outcomes is on a timer; each is the direct, awaited result of
// the one real call the button makes, so the state showing on screen always
// matches what actually happened last.
//
// Data integrity: `friendsJoinedCount`, `creditedTotal`, and `pendingCount`
// are all derived from the same `referralEntries` array the FlatList renders
// (see the three reduce/filter lines in the component body) — there are no
// separate hardcoded summary numbers to drift out of sync with the list, and
// a "pending" referral's credit is deliberately excluded from the earned
// total until its status flips to "credited".

import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Share,
} from "react-native";
import { tokens } from "../../../tokens";
import { referralEntries, referralProgram } from "./data";
import type { ReferralEntry } from "./data";

type ShareOutcome = "unattempted" | "shared" | "cancelled" | "failed";

export function ReferralProgramScreen() {
  const [shareOutcome, setShareOutcome] = useState<ShareOutcome>("unattempted");

  // Derivation lives here, computed from the one source array — never typed
  // in twice. Joining counts a friend regardless of credit status (they did
  // join); the dollar total only counts entries whose status is "credited".
  const friendsJoinedCount = referralEntries.length;
  const creditedTotal = referralEntries.reduce(
    (sum, entry) => (entry.status === "credited" ? sum + entry.creditAmount : sum),
    0,
  );
  const pendingCount = referralEntries.filter((entry) => entry.status === "pending").length;

  async function handleSharePress() {
    try {
      const result = await Share.share({
        message: `Join repick with my invite link and we both get credit: ${referralProgram.inviteLink}`,
      });
      if (result.action === Share.sharedAction) {
        setShareOutcome("shared");
      } else if (result.action === Share.dismissedAction) {
        setShareOutcome("cancelled");
      }
    } catch (_err) {
      setShareOutcome("failed");
    }
  }

  const statusLine =
    shareOutcome === "shared"
      ? "Invite link shared."
      : shareOutcome === "cancelled"
        ? "Share sheet closed — nothing was shared."
        : shareOutcome === "failed"
          ? "Couldn't open the share sheet. Try again."
          : "Share your invite link — you both earn credit when a friend joins.";

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList<ReferralEntry>
        data={referralEntries}
        keyExtractor={(entry) => entry.id}
        ListHeaderComponent={
          <ProgramHeader
            friendsJoinedCount={friendsJoinedCount}
            creditedTotal={creditedTotal}
            pendingCount={pendingCount}
          />
        }
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.rowSeparator} />}
        renderItem={({ item }) => <ReferralRow entry={item} />}
      />

      <View style={styles.inviteBar}>
        <View style={styles.inviteBarStatusRegion} accessibilityLiveRegion="polite">
          <Text style={styles.inviteBarStatusText} accessibilityRole="alert">
            {statusLine}
          </Text>
        </View>
        <Pressable
          onPress={handleSharePress}
          accessibilityRole="button"
          accessibilityLabel="Share invite link"
          accessibilityHint="Opens the share sheet with your personal invite link."
          style={({ pressed }) => [styles.shareButton, pressed && styles.shareButtonPressed]}
        >
          <Text style={styles.shareButtonLabel}>Share Invite Link</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function ProgramHeader({
  friendsJoinedCount,
  creditedTotal,
  pendingCount,
}: {
  friendsJoinedCount: number;
  creditedTotal: number;
  pendingCount: number;
}) {
  return (
    <View style={styles.headerBlock}>
      <Text accessibilityRole="header" style={styles.title}>
        Referral Program
      </Text>
      <Text style={styles.creditRuleNote}>{referralProgram.creditRuleNote}</Text>

      <View style={styles.inviteCodeCard}>
        <Text style={styles.inviteCodeLabel}>Your invite link</Text>
        <Text style={styles.inviteCodeValue} selectable allowFontScaling>
          {referralProgram.inviteLink}
        </Text>
        <Text style={styles.inviteCodeSub}>Code: {referralProgram.inviteCode}</Text>
      </View>

      <View style={styles.statRow}>
        <View style={styles.statTile}>
          <Text style={[styles.statTileValue, styles.tabularNums]}>
            {friendsJoinedCount}
          </Text>
          <Text style={styles.statTileLabel}>Friends joined</Text>
        </View>
        <View style={styles.statTile}>
          <Text style={[styles.statTileValue, styles.tabularNums]}>
            ${creditedTotal}
          </Text>
          <Text style={styles.statTileLabel}>
            Credits earned{pendingCount > 0 ? ` · ${pendingCount} pending` : ""}
          </Text>
        </View>
      </View>

      <Text accessibilityRole="header" style={styles.sectionHeading}>
        Your Referrals
      </Text>
    </View>
  );
}

function ReferralRow({ entry }: { entry: ReferralEntry }) {
  const isCredited = entry.status === "credited";
  return (
    <View
      style={styles.row}
      accessible
      accessibilityLabel={`${entry.friendName}, joined ${entry.joinedDateLabel}, ${
        isCredited ? `credited $${entry.creditAmount}` : "pending, credit not yet applied"
      }`}
    >
      <View style={styles.rowTextColumn}>
        <Text style={styles.rowName}>{entry.friendName}</Text>
        <Text style={styles.rowDate}>Joined {entry.joinedDateLabel}</Text>
      </View>
      <View style={styles.rowRightColumn}>
        <Text
          style={[styles.rowAmount, styles.tabularNums, !isCredited && styles.rowAmountPending]}
        >
          ${entry.creditAmount}
        </Text>
        <View style={[styles.statusChip, isCredited ? styles.statusChipCredited : styles.statusChipPending]}>
          <Text
            style={[
              styles.statusChipText,
              isCredited ? styles.statusChipTextCredited : styles.statusChipTextPending,
            ]}
          >
            {isCredited ? "Credited" : "Pending"}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  listContent: {
    paddingBottom: tokens.space(4),
  },
  headerBlock: {
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(5),
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: tokens.color.ink,
    marginBottom: tokens.space(2),
  },
  creditRuleNote: {
    fontSize: 14,
    color: tokens.color.muted,
    lineHeight: 20,
    marginBottom: tokens.space(4),
  },
  inviteCodeCard: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    backgroundColor: tokens.color.accentBg,
    borderRadius: tokens.radius.md,
    paddingHorizontal: tokens.space(4),
    paddingVertical: tokens.space(3),
    marginBottom: tokens.space(5),
  },
  inviteCodeLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: tokens.color.accent,
    letterSpacing: 0.4,
    textTransform: "uppercase",
    marginBottom: tokens.space(1),
  },
  inviteCodeValue: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.ink,
    marginBottom: tokens.space(1),
  },
  inviteCodeSub: {
    fontSize: 12,
    color: tokens.color.muted,
  },
  statRow: {
    flexDirection: "row",
    gap: tokens.space(3),
    marginBottom: tokens.space(6),
  },
  statTile: {
    flex: 1,
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    paddingHorizontal: tokens.space(3),
    paddingVertical: tokens.space(3),
  },
  statTileValue: {
    fontSize: 20,
    fontWeight: "700",
    color: tokens.color.ink,
    marginBottom: tokens.space(1),
  },
  statTileLabel: {
    fontSize: 12,
    color: tokens.color.muted,
  },
  tabularNums: {
    fontVariant: ["tabular-nums"],
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.ink,
    marginBottom: tokens.space(1),
  },
  rowSeparator: {
    height: 1,
    backgroundColor: tokens.color.border,
    marginHorizontal: tokens.space(5),
  },
  // Row touch-target math (computed, per GENERATION.md §4): rows are
  // non-interactive display content (no Pressable), but the row still sets
  // minHeight 44 as a legibility/consistency floor — paddingVertical
  // tokens.space(3)=12 top+bottom (24) plus two stacked text lines
  // (name lineHeight 19 + date lineHeight 16 = 35) already clears it at 47pt
  // without the explicit floor, which is kept as a second guarantee.
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 44,
    paddingHorizontal: tokens.space(5),
    paddingVertical: tokens.space(3),
  },
  rowTextColumn: {
    flex: 1,
    paddingRight: tokens.space(3),
  },
  rowName: {
    fontSize: 15,
    fontWeight: "600",
    color: tokens.color.ink,
    lineHeight: 19,
  },
  rowDate: {
    fontSize: 13,
    color: tokens.color.faint,
    lineHeight: 16,
    marginTop: tokens.space(1),
  },
  rowRightColumn: {
    alignItems: "flex-end",
  },
  rowAmount: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.ink,
    marginBottom: tokens.space(1),
  },
  rowAmountPending: {
    color: tokens.color.faint,
  },
  statusChip: {
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    paddingHorizontal: tokens.space(2),
    paddingVertical: 2,
  },
  statusChipCredited: {
    backgroundColor: tokens.color.successBg,
    borderColor: tokens.color.successBorder,
  },
  statusChipPending: {
    backgroundColor: tokens.color.warningBg,
    borderColor: tokens.color.warningBorder,
  },
  statusChipText: {
    fontSize: 11,
    fontWeight: "700",
  },
  statusChipTextCredited: {
    color: tokens.color.success,
  },
  statusChipTextPending: {
    color: tokens.color.warning,
  },
  // Share button touch-target math: paddingVertical tokens.space(4)=16
  // top+bottom (32) plus label lineHeight 20 = 52pt total, clearing the 44pt
  // floor on its own.
  inviteBar: {
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(3),
    paddingBottom: tokens.space(5),
  },
  inviteBarStatusRegion: {
    marginBottom: tokens.space(3),
  },
  inviteBarStatusText: {
    fontSize: 13,
    color: tokens.color.muted,
  },
  shareButton: {
    minHeight: 44,
    backgroundColor: tokens.color.accent,
    borderRadius: tokens.radius.md,
    paddingVertical: tokens.space(4),
    alignItems: "center",
    justifyContent: "center",
  },
  shareButtonPressed: {
    opacity: 0.85,
  },
  shareButtonLabel: {
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 20,
    color: tokens.color.onAccent,
  },
});

export default ReferralProgramScreen;
