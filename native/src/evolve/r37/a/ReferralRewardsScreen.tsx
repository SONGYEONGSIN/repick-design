// native/src/evolve/r37/a/ReferralRewardsScreen.tsx
//
// Referral Program & Rewards — an open-ended, nothing-to-block view: a
// share-your-code card up top, a scrollable record of referred friends
// below, and a running store-credit balance. Deliberately has NO fixed
// bottom band (per this round's assignment) — there is nothing here that
// blocks progress and nothing destructive to confirm, so the valid choice
// is no band at all rather than inventing one.

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import {
  referralProfile,
  referralBalance,
  referralFriends,
  referralFilters,
  type ReferralRecord,
  type ReferralFilter,
} from "./data";

export function ReferralRewardsScreen() {
  const [selectedFilter, setSelectedFilter] = useState<ReferralFilter>("all");
  const [cueText, setCueText] = useState("");
  const cueTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (cueTimerRef.current) clearTimeout(cueTimerRef.current);
    };
  }, []);

  // A "just happened" confirmation (share sheet result, resend/reminder tap)
  // must be actively cleared after a readable interval, or the alert role
  // stays stuck "on" after the first event.
  const raiseCue = useCallback((message: string) => {
    if (cueTimerRef.current) clearTimeout(cueTimerRef.current);
    setCueText(message);
    cueTimerRef.current = setTimeout(() => setCueText(""), 4200);
  }, []);

  const filteredFriends = useMemo(() => {
    if (selectedFilter === "all") return referralFriends;
    return referralFriends.filter((f) => f.status === selectedFilter);
  }, [selectedFilter]);

  const handleShare = useCallback(async () => {
    try {
      const result = await Share.share({
        message: `Join me on repick — use my code ${referralProfile.code} (${referralProfile.shareLink}) and we both get store credit.`,
      });
      if (result.action === Share.sharedAction) {
        raiseCue("Invite link shared.");
      } else {
        raiseCue("Share sheet closed without sending.");
      }
    } catch {
      raiseCue("Couldn't open the share sheet. Try again.");
    }
  }, [raiseCue]);

  const handleNudge = useCallback(
    (friend: ReferralRecord) => {
      if (friend.status === "invited") {
        raiseCue(`Invite resent to ${friend.friendLabel}.`);
      } else if (friend.status === "joined") {
        raiseCue(`Reminder sent to ${friend.friendLabel}.`);
      }
    },
    [raiseCue]
  );

  const renderFriend = useCallback(
    ({ item }: { item: ReferralRecord }) => {
      const initial = item.friendLabel.charAt(0);
      return (
        <View style={styles.friendCard}>
          <View style={styles.friendTopRow}>
            <View
              style={styles.friendAvatar}
              accessibilityElementsHidden
              importantForAccessibility="no-hide-descendants"
            >
              <Text style={styles.friendAvatarText}>{initial}</Text>
            </View>
            <View style={styles.friendNameBlock}>
              <Text style={styles.friendName}>{item.friendLabel}</Text>
              <Text style={styles.friendInvitedOn}>
                Invited {item.invitedOnLabel}
              </Text>
            </View>
            <View
              style={[
                styles.statusPill,
                item.status === "invited" && styles.statusPillInvited,
                item.status === "joined" && styles.statusPillJoined,
                item.status === "first_purchase" && styles.statusPillRewarded,
              ]}
            >
              <Text
                style={[
                  styles.statusPillText,
                  item.status === "invited" && styles.statusPillTextInvited,
                  item.status === "joined" && styles.statusPillTextJoined,
                  item.status === "first_purchase" &&
                    styles.statusPillTextRewarded,
                ]}
              >
                {item.status === "invited" && "Invited"}
                {item.status === "joined" && "Joined"}
                {item.status === "first_purchase" && "✓ Rewarded"}
              </Text>
            </View>
          </View>
          <Text style={styles.friendMilestone}>{item.milestoneLabel}</Text>
          <Text style={styles.friendRewardLine}>{item.rewardLineLabel}</Text>
          {item.status !== "first_purchase" ? (
            <Pressable
              onPress={() => handleNudge(item)}
              accessibilityRole="button"
              accessibilityLabel={
                item.status === "invited"
                  ? `Resend invite to ${item.friendLabel}`
                  : `Send a reminder to ${item.friendLabel}`
              }
              accessibilityHint={
                item.status === "invited"
                  ? "Sends another invite reminder to this friend."
                  : "Sends a reminder nudging them toward their first purchase."
              }
              style={({ pressed }) => [
                styles.nudgeButton,
                pressed && styles.nudgeButtonPressed,
              ]}
            >
              <Text style={styles.nudgeButtonLabel}>
                {item.status === "invited" ? "Resend invite" : "Send a reminder"}
              </Text>
            </Pressable>
          ) : (
            <View style={styles.rewardedTag}>
              <Text style={styles.rewardedTagText}>
                {referralProfile.rewardPerFriendLabel} added to your balance
              </Text>
            </View>
          )}
        </View>
      );
    },
    [handleNudge]
  );

  const listHeader = (
    <View style={styles.headerBlock}>
      <Text style={styles.headerTitle} accessibilityRole="header">
        Referral Rewards
      </Text>
      <Text style={styles.headerSubtitle}>
        Invite friends to repick. When a friend you invited makes their first
        purchase, you earn store credit — it's never paid out as cash.
      </Text>

      <View style={styles.inviteCard}>
        <Text style={styles.inviteCodeLabel}>Your referral code</Text>
        <Text style={styles.inviteCodeValue}>{referralProfile.code}</Text>
        <Text style={styles.inviteLinkValue}>{referralProfile.shareLink}</Text>
        <Text style={styles.rewardNoteText}>
          They get {referralProfile.friendWelcomeCreditLabel} welcome credit.
          You get {referralProfile.rewardPerFriendLabel} once they buy.
        </Text>
        <Pressable
          onPress={handleShare}
          accessibilityRole="button"
          accessibilityLabel="Share your invite link"
          accessibilityHint="Opens your device's share sheet with your referral code and link."
          style={({ pressed }) => [
            styles.shareButton,
            pressed && styles.shareButtonPressed,
          ]}
        >
          <Text style={styles.shareButtonLabel}>Share your invite</Text>
        </Pressable>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statTile}>
          <Text style={styles.statValue}>
            {referralBalance.availableCreditLabel}
          </Text>
          <Text style={styles.statCaption}>Store credit earned</Text>
        </View>
        <View style={styles.statTile}>
          <Text style={styles.statValue}>{referralBalance.pendingCount}</Text>
          <Text style={styles.statCaption}>Waiting on first purchase</Text>
        </View>
        <View style={styles.statTile}>
          <Text style={styles.statValue}>
            {referralBalance.invitedOnlyCount}
          </Text>
          <Text style={styles.statCaption}>Invited, not joined</Text>
        </View>
      </View>

      <View style={styles.filterRow}>
        {referralFilters.map((filter) => {
          const isSelected = filter.key === selectedFilter;
          return (
            <Pressable
              key={filter.key}
              onPress={() => setSelectedFilter(filter.key)}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              accessibilityLabel={`${filter.label} friends`}
              style={({ pressed }) => [
                styles.filterChip,
                isSelected && styles.filterChipSelected,
                pressed && styles.filterChipPressed,
              ]}
            >
              <Text
                style={[
                  styles.filterChipLabel,
                  isSelected && styles.filterChipLabelSelected,
                ]}
              >
                {filter.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.screenRoot}>
      <FlatList
        data={filteredFriends}
        keyExtractor={(item) => item.id}
        renderItem={renderFriend}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              No friends in this category yet.
            </Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
      />

      <View style={styles.announcerWrap} accessibilityLiveRegion="polite">
        {cueText ? (
          <Text accessibilityRole="alert" style={styles.announcerText}>
            {cueText}
          </Text>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screenRoot: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  listContent: {
    paddingHorizontal: tokens.space(4),
    paddingBottom: tokens.space(6),
  },
  headerBlock: {
    paddingTop: tokens.space(3),
    paddingBottom: tokens.space(2),
  },
  headerTitle: {
    fontSize: 32,
    lineHeight: 42,
    fontWeight: "700",
    color: tokens.color.ink,
    marginBottom: tokens.space(2),
  },
  headerSubtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: tokens.color.muted,
    marginBottom: tokens.space(4),
  },
  inviteCard: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    borderRadius: tokens.radius.md,
    padding: tokens.space(4),
    marginBottom: tokens.space(4),
  },
  inviteCodeLabel: {
    fontSize: 13,
    lineHeight: 18,
    color: tokens.color.muted,
    marginBottom: tokens.space(1),
  },
  inviteCodeValue: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "700",
    color: tokens.color.accent,
    letterSpacing: 0.5,
    marginBottom: tokens.space(1),
  },
  inviteLinkValue: {
    fontSize: 15,
    lineHeight: 22,
    color: tokens.color.ink2,
    marginBottom: tokens.space(3),
  },
  rewardNoteText: {
    fontSize: 13,
    lineHeight: 19,
    color: tokens.color.muted,
    marginBottom: tokens.space(4),
  },
  shareButton: {
    minHeight: 48,
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  shareButtonPressed: {
    backgroundColor: tokens.color.ink2,
  },
  shareButtonLabel: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
    color: tokens.color.onAccent,
  },
  statsRow: {
    flexDirection: "row",
    marginBottom: tokens.space(4),
    gap: tokens.space(2),
  },
  statTile: {
    flex: 1,
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    paddingVertical: tokens.space(3),
    paddingHorizontal: tokens.space(2),
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "700",
    color: tokens.color.ink,
    marginBottom: tokens.space(1),
    fontVariant: ["tabular-nums"],
  },
  statCaption: {
    fontSize: 12,
    lineHeight: 16,
    color: tokens.color.faint,
    textAlign: "center",
  },
  filterRow: {
    flexDirection: "row",
    marginBottom: tokens.space(3),
    gap: tokens.space(2),
  },
  filterChip: {
    minHeight: 36,
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.border,
    paddingHorizontal: tokens.space(3),
    alignItems: "center",
    justifyContent: "center",
  },
  filterChipSelected: {
    backgroundColor: tokens.color.ink,
    borderColor: tokens.color.ink,
  },
  filterChipPressed: {
    backgroundColor: tokens.color.accentBg,
  },
  filterChipLabel: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "600",
    color: tokens.color.ink2,
  },
  filterChipLabelSelected: {
    color: tokens.color.onInk,
  },
  friendCard: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(4),
    marginBottom: tokens.space(3),
    backgroundColor: tokens.color.bg,
  },
  friendTopRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: tokens.space(2),
  },
  friendAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: tokens.color.ink,
    alignItems: "center",
    justifyContent: "center",
    marginRight: tokens.space(3),
  },
  friendAvatarText: {
    fontSize: 15,
    lineHeight: 15,
    fontWeight: "700",
    color: tokens.color.onInk,
  },
  friendNameBlock: {
    flex: 1,
  },
  friendName: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "600",
    color: tokens.color.ink,
  },
  friendInvitedOn: {
    fontSize: 13,
    lineHeight: 18,
    color: tokens.color.faint,
  },
  statusPill: {
    minHeight: 26,
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    paddingHorizontal: tokens.space(2),
    alignItems: "center",
    justifyContent: "center",
  },
  statusPillInvited: {
    backgroundColor: tokens.color.bg,
    borderColor: tokens.color.border,
  },
  statusPillJoined: {
    backgroundColor: tokens.color.warningBg,
    borderColor: tokens.color.warningBorder,
  },
  statusPillRewarded: {
    backgroundColor: tokens.color.successBg,
    borderColor: tokens.color.successBorder,
  },
  statusPillText: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "600",
    color: tokens.color.muted,
  },
  statusPillTextInvited: {
    color: tokens.color.faint,
  },
  statusPillTextJoined: {
    color: tokens.color.warning,
  },
  statusPillTextRewarded: {
    color: tokens.color.success,
  },
  friendMilestone: {
    fontSize: 14,
    lineHeight: 20,
    color: tokens.color.ink2,
    marginBottom: tokens.space(1),
  },
  friendRewardLine: {
    fontSize: 13,
    lineHeight: 19,
    color: tokens.color.muted,
    marginBottom: tokens.space(3),
  },
  nudgeButton: {
    alignSelf: "flex-start",
    minHeight: 40,
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.border,
    paddingHorizontal: tokens.space(4),
    alignItems: "center",
    justifyContent: "center",
  },
  nudgeButtonPressed: {
    backgroundColor: tokens.color.accentBg,
  },
  nudgeButtonLabel: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600",
    color: tokens.color.accent,
  },
  rewardedTag: {
    alignSelf: "flex-start",
    minHeight: 32,
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.successBg,
    borderWidth: 1,
    borderColor: tokens.color.successBorder,
    paddingHorizontal: tokens.space(3),
    alignItems: "center",
    justifyContent: "center",
  },
  rewardedTagText: {
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "600",
    color: tokens.color.success,
    fontVariant: ["tabular-nums"],
  },
  emptyState: {
    paddingVertical: tokens.space(8),
    alignItems: "center",
  },
  emptyStateText: {
    fontSize: 14,
    lineHeight: 20,
    color: tokens.color.faint,
  },
  announcerWrap: {
    paddingHorizontal: tokens.space(4),
    paddingBottom: tokens.space(2),
  },
  announcerText: {
    fontSize: 12,
    lineHeight: 18,
    color: tokens.color.accent,
  },
});

export default ReferralRewardsScreen;
