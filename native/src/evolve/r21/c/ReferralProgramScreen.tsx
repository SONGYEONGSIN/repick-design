// native/src/evolve/r21/c/ReferralProgramScreen.tsx
//
// Concept: "Invite Friends" — a referral growth-loop screen: a personal share code up
// top, a milestone/tier reward ladder as the visual centerpiece (progress toward the
// next unlockable tier, tap a tier to see its reward in full), and a virtualized list
// of invited friends with a per-invite status chip (pending / joined / first sale /
// rewarded). This mechanism — counting qualifying invites toward stacked unlockable
// tiers — does not exist anywhere else in the catalog; membership-tiers is a paid
// pricing comparison (you pay to jump a tier), not a progress ladder you climb by
// inviting people, and nothing else tracks a roster of other people's per-item status.
//
// Band-form choice: NO fixed bottom band. There is no single terminal action this
// screen gates on — sharing a code is not blocked by anything, so a "why can't I
// proceed" state machine (seller-verification / disputes / item-authentication /
// condition-assessment / shipment-pickup) would be invented scaffolding with nothing
// real to say. It is also not a selection-count-driven contextual bar (bulk-relist):
// nothing here is multi-selected. The share actions live inline, in a card near the
// top of the scrolling content, exactly where GENERATION.md's "share-code control up
// top" calls for them — not pinned to the viewport.
//
// Differentiation from named prior screens:
//   - evolve/r20/a/TradeProposalScreen.tsx compares two live *sets* of items between
//     two named parties for a single proposal; this screen has no item sets, no
//     fairness comparison, and no "send" action — it lists an open-ended roster of
//     *people* (invited friends) against a *stacked reward ladder*, not a single deal.
//   - membership-tiers (existing catalog) is a paid pricing table you buy into; this
//     ladder is unlocked by an action count (qualifying invites), never by payment,
//     and each tier's detail is revealed by tapping the tier itself, not by a
//     buy/upgrade control.
//   - wallet-ledger (existing catalog) is a transaction history; the reward tiers here
//     are *prospective* unlocks tied to a progress count, not a ledger of past entries.
//
// Live region: exactly one `accessibilityLiveRegion="polite"` container, wrapping the
// tier-progress summary. It carries two `accessibilityRole="alert"` transition lines —
// current-tier-unlocked-and-what's-next, and the most recent friend status change that
// moved that progress — since both are "milestone/status change" events per
// GENERATION.md §4. This is a static dummy-data screen, so no transition actually fires
// during a screenshot; the region is still correctly structured and would announce a
// real transition (e.g. a friend flipping from "pending" to "joined", or a new tier
// unlocking) if the underlying data were live.

import { useState } from "react";
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
  INVITED_FRIENDS,
  MOST_RECENT_QUALIFYING_FRIEND_ID,
  QUALIFYING_STATUSES,
  REFERRAL_CODE,
  REFERRAL_LINK_LABEL,
  REWARD_TIERS,
} from "./data";
import type { InvitedFriend, InviteStatus, RewardTier } from "./data";

const STATUS_META: Record<InviteStatus, { label: string; glyph: string }> = {
  pending: { label: "Pending", glyph: "○" },
  joined: { label: "Joined", glyph: "●" },
  first_sale: { label: "First Sale", glyph: "✓" },
  rewarded: { label: "Rewarded", glyph: "★" },
};

type TierState = "unlocked" | "next" | "locked";

function StatusChip({ status }: { status: InviteStatus }) {
  const meta = STATUS_META[status];
  return (
    <View style={[styles.statusChip, styles[`statusChip_${status}`]]}>
      <Text style={[styles.statusChipGlyph, styles[`statusChipGlyph_${status}`]]}>
        {meta.glyph}
      </Text>
      <Text style={[styles.statusChipLabel, styles[`statusChipLabel_${status}`]]}>
        {meta.label}
      </Text>
    </View>
  );
}

function FriendRow({ friend }: { friend: InvitedFriend }) {
  const meta = STATUS_META[friend.status];
  return (
    <View
      style={styles.friendRow}
      accessibilityLabel={`${friend.name}, ${friend.invitedDateLabel}, status ${meta.label}`}
    >
      <View style={styles.friendAvatar}>
        <Text style={styles.friendAvatarText}>{friend.initials}</Text>
      </View>
      <View style={styles.friendTextCol}>
        <Text style={styles.friendName}>{friend.name}</Text>
        <Text style={styles.friendDate}>{friend.invitedDateLabel}</Text>
      </View>
      <StatusChip status={friend.status} />
    </View>
  );
}

function TierNode({
  tier,
  state,
  expanded,
  onToggle,
}: {
  tier: RewardTier;
  state: TierState;
  expanded: boolean;
  onToggle: () => void;
}) {
  const indicatorGlyph = state === "unlocked" ? "✓" : `${tier.threshold}`;
  const stateLabel =
    state === "unlocked" ? "Unlocked" : state === "next" ? "In progress" : "Locked";

  return (
    <Pressable
      onPress={onToggle}
      hitSlop={4}
      accessibilityRole="button"
      accessibilityState={{ expanded }}
      accessibilityLabel={`${tier.title}, invite ${tier.threshold} friends, reward ${tier.rewardLabel}, ${stateLabel}`}
      accessibilityHint="Toggles the full reward description for this tier"
      style={({ pressed }) => [
        styles.tierNode,
        state === "next" && styles.tierNodeNext,
        pressed && styles.pressedDim,
      ]}
    >
      <View
        style={[
          styles.tierIndicator,
          state === "unlocked" && styles.tierIndicatorUnlocked,
          state === "next" && styles.tierIndicatorNext,
        ]}
      >
        <Text
          style={[
            styles.tierIndicatorGlyph,
            state === "unlocked" && styles.tierIndicatorGlyphUnlocked,
          ]}
        >
          {indicatorGlyph}
        </Text>
      </View>
      <View style={styles.tierTextCol}>
        <View style={styles.tierTitleRow}>
          <Text style={styles.tierTitle}>
            {tier.title} · Invite {tier.threshold}
          </Text>
          <Text
            style={[
              styles.tierStateLabel,
              state === "unlocked" && styles.tierStateLabelUnlocked,
              state === "next" && styles.tierStateLabelNext,
            ]}
          >
            {stateLabel}
          </Text>
        </View>
        <Text style={styles.tierReward}>{tier.rewardLabel}</Text>
        {expanded ? <Text style={styles.tierDetail}>{tier.rewardDetail}</Text> : null}
      </View>
      <Text style={styles.tierChevron}>{expanded ? "−" : "+"}</Text>
    </Pressable>
  );
}

export default function ReferralProgramScreen() {
  const [expandedTierId, setExpandedTierId] = useState<string | null>(null);
  const [codeAction, setCodeAction] = useState<"idle" | "copied" | "shared">("idle");

  const qualifiedCount = INVITED_FRIENDS.filter((f) =>
    QUALIFYING_STATUSES.includes(f.status),
  ).length;

  const unlockedTiers = REWARD_TIERS.filter((t) => qualifiedCount >= t.threshold);
  const currentTier: RewardTier | null =
    unlockedTiers.length > 0 ? unlockedTiers[unlockedTiers.length - 1] : null;
  const nextTier: RewardTier | null =
    REWARD_TIERS.find((t) => qualifiedCount < t.threshold) ?? null;

  const progressText = (() => {
    if (currentTier && nextTier) {
      const remaining = nextTier.threshold - qualifiedCount;
      return `${currentTier.title} unlocked — ${remaining} more qualifying invite${
        remaining === 1 ? "" : "s"
      } to reach ${nextTier.title}.`;
    }
    if (!currentTier && nextTier) {
      const remaining = nextTier.threshold - qualifiedCount;
      return `${qualifiedCount} of ${nextTier.threshold} qualifying invites — ${remaining} more to reach ${nextTier.title}.`;
    }
    if (currentTier && !nextTier) {
      return `${currentTier.title} unlocked — every reward tier is complete.`;
    }
    return "Invite friends to start climbing the reward ladder.";
  })();

  const recentFriend = INVITED_FRIENDS.find(
    (f) => f.id === MOST_RECENT_QUALIFYING_FRIEND_ID,
  );
  const recentStatusText = recentFriend
    ? `${recentFriend.name} most recently reached "${STATUS_META[recentFriend.status].label}" status.`
    : null;

  const toggleTier = (id: string) => {
    setExpandedTierId((prev) => (prev === id ? null : id));
  };

  const header = (
    <View>
      <Text accessibilityRole="header" style={styles.title}>
        Invite Friends
      </Text>
      <Text style={styles.subtitle}>
        Share your code. Earn rewards as friends join and sell on repick.
      </Text>

      <View style={styles.codeCard}>
        <Text style={styles.codeCardLabel}>Your referral code</Text>
        <Text style={styles.codeValue}>{REFERRAL_CODE}</Text>
        <Text style={styles.linkValue}>{REFERRAL_LINK_LABEL}</Text>
        <View style={styles.codeActionsRow}>
          <Pressable
            onPress={() => setCodeAction("copied")}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={`Copy referral code ${REFERRAL_CODE}`}
            style={({ pressed }) => [
              styles.codeActionButton,
              styles.codeActionButtonPrimary,
              pressed && styles.pressedDim,
            ]}
          >
            <Text style={styles.codeActionButtonTextPrimary}>
              {codeAction === "copied" ? "Copied" : "Copy Code"}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setCodeAction("shared")}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={`Share your referral link ${REFERRAL_LINK_LABEL}`}
            style={({ pressed }) => [
              styles.codeActionButton,
              styles.codeActionButtonSecondary,
              pressed && styles.pressedDim,
            ]}
          >
            <Text style={styles.codeActionButtonTextSecondary}>
              {codeAction === "shared" ? "Ready to Share" : "Share Link"}
            </Text>
          </Pressable>
        </View>
      </View>

      <Text style={styles.sectionLabel}>Reward tiers</Text>

      <View style={styles.progressLiveWrap} accessibilityLiveRegion="polite">
        <View style={styles.ladderTrack}>
          {REWARD_TIERS.map((tier, i) => {
            const filled = qualifiedCount >= tier.threshold;
            return (
              <View
                key={tier.id}
                style={[
                  styles.ladderSegment,
                  filled && styles.ladderSegmentFilled,
                  i > 0 && styles.ladderSegmentGap,
                ]}
              />
            );
          })}
        </View>
        <Text accessibilityRole="alert" style={styles.progressText}>
          {progressText}
        </Text>
        {recentStatusText ? (
          <Text accessibilityRole="alert" style={styles.recentText}>
            {recentStatusText}
          </Text>
        ) : null}
      </View>

      <View style={styles.tierList}>
        {REWARD_TIERS.map((tier) => {
          const state: TierState =
            qualifiedCount >= tier.threshold
              ? "unlocked"
              : nextTier?.id === tier.id
                ? "next"
                : "locked";
          return (
            <TierNode
              key={tier.id}
              tier={tier}
              state={state}
              expanded={expandedTierId === tier.id}
              onToggle={() => toggleTier(tier.id)}
            />
          );
        })}
      </View>

      <Text style={styles.tierFootnote}>
        A friend counts toward your tier once they join repick with your code —
        rewards are credited within 3 business days of unlocking a tier.
      </Text>

      <Text style={styles.sectionLabel}>
        Invited friends ({INVITED_FRIENDS.length})
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={INVITED_FRIENDS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <FriendRow friend={item} />}
        ListHeaderComponent={header}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              Invite your first friend to start earning.
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
    paddingHorizontal: tokens.space(4),
    paddingBottom: tokens.space(8),
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: tokens.color.ink,
    marginTop: tokens.space(3),
  },
  subtitle: {
    fontSize: 14,
    color: tokens.color.muted,
    marginTop: tokens.space(1.5),
    lineHeight: 20,
  },
  codeCard: {
    marginTop: tokens.space(4),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(4),
  },
  codeCardLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: tokens.color.faint,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  codeValue: {
    fontSize: 22,
    fontWeight: "700",
    color: tokens.color.ink,
    marginTop: tokens.space(1.5),
    letterSpacing: 1,
  },
  linkValue: {
    fontSize: 13,
    color: tokens.color.accent,
    marginTop: tokens.space(1),
  },
  codeActionsRow: {
    flexDirection: "row",
    gap: tokens.space(2.5),
    marginTop: tokens.space(3.5),
  },
  codeActionButton: {
    flex: 1,
    minHeight: 44,
    borderRadius: tokens.radius.md,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: tokens.space(2),
  },
  codeActionButtonPrimary: {
    backgroundColor: tokens.color.accent,
  },
  codeActionButtonSecondary: {
    borderWidth: 1,
    borderColor: tokens.color.border,
  },
  codeActionButtonTextPrimary: {
    color: tokens.color.onAccent,
    fontSize: 14,
    fontWeight: "700",
  },
  codeActionButtonTextSecondary: {
    color: tokens.color.ink,
    fontSize: 14,
    fontWeight: "700",
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: tokens.color.ink2,
    marginTop: tokens.space(6),
    marginBottom: tokens.space(2.5),
  },
  progressLiveWrap: {
    marginBottom: tokens.space(3.5),
  },
  ladderTrack: {
    flexDirection: "row",
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  ladderSegment: {
    flex: 1,
    backgroundColor: tokens.color.border,
  },
  ladderSegmentFilled: {
    backgroundColor: tokens.color.accent,
  },
  ladderSegmentGap: {
    marginLeft: 3,
  },
  progressText: {
    fontSize: 14,
    fontWeight: "600",
    color: tokens.color.ink,
    marginTop: tokens.space(2.5),
    lineHeight: 20,
  },
  recentText: {
    fontSize: 12,
    color: tokens.color.faint,
    marginTop: tokens.space(1),
  },
  tierList: {
    gap: tokens.space(2.5),
  },
  tierNode: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(3),
    minHeight: 44,
    gap: tokens.space(2.5),
  },
  tierNodeNext: {
    borderColor: tokens.color.accent,
  },
  tierIndicator: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginTop: 1,
  },
  tierIndicatorUnlocked: {
    backgroundColor: tokens.color.accent,
    borderColor: tokens.color.accent,
  },
  tierIndicatorNext: {
    borderColor: tokens.color.accent,
  },
  tierIndicatorGlyph: {
    fontSize: 12,
    fontWeight: "700",
    color: tokens.color.faint,
  },
  tierIndicatorGlyphUnlocked: {
    color: tokens.color.onAccent,
  },
  tierTextCol: {
    flex: 1,
  },
  tierTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: tokens.space(2),
  },
  tierTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  tierStateLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: tokens.color.faint,
  },
  tierStateLabelUnlocked: {
    color: tokens.color.accent,
  },
  tierStateLabelNext: {
    color: tokens.color.ink2,
  },
  tierReward: {
    fontSize: 13,
    color: tokens.color.muted,
    marginTop: tokens.space(0.5),
    fontVariant: ["tabular-nums"],
  },
  tierDetail: {
    fontSize: 12,
    color: tokens.color.faint,
    marginTop: tokens.space(2),
    lineHeight: 17,
  },
  tierChevron: {
    fontSize: 18,
    fontWeight: "700",
    color: tokens.color.faint,
    marginTop: 1,
  },
  tierFootnote: {
    fontSize: 12,
    color: tokens.color.faint,
    marginTop: tokens.space(3),
    lineHeight: 17,
  },
  friendRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    paddingVertical: tokens.space(2.5),
    paddingHorizontal: tokens.space(2.5),
    minHeight: 44,
    gap: tokens.space(2.5),
    marginBottom: tokens.space(2),
  },
  friendAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: tokens.color.ink,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  friendAvatarText: {
    color: tokens.color.onInk,
    fontSize: 12,
    fontWeight: "700",
  },
  friendTextCol: {
    flex: 1,
  },
  friendName: {
    fontSize: 14,
    fontWeight: "600",
    color: tokens.color.ink,
  },
  friendDate: {
    fontSize: 12,
    color: tokens.color.faint,
    marginTop: 1,
  },
  statusChip: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: tokens.radius.sm,
    paddingHorizontal: tokens.space(2),
    paddingVertical: tokens.space(1),
    gap: tokens.space(1),
    borderWidth: 1,
  },
  statusChip_pending: {
    backgroundColor: tokens.color.bg,
    borderColor: tokens.color.border,
  },
  statusChip_joined: {
    backgroundColor: tokens.color.bg,
    borderColor: tokens.color.ink2,
  },
  statusChip_first_sale: {
    backgroundColor: tokens.color.bg,
    borderColor: tokens.color.accent,
  },
  statusChip_rewarded: {
    backgroundColor: tokens.color.accent,
    borderColor: tokens.color.accent,
  },
  statusChipGlyph: {
    fontSize: 11,
    fontWeight: "700",
  },
  statusChipGlyph_pending: {
    color: tokens.color.faint,
  },
  statusChipGlyph_joined: {
    color: tokens.color.ink2,
  },
  statusChipGlyph_first_sale: {
    color: tokens.color.accent,
  },
  statusChipGlyph_rewarded: {
    color: tokens.color.onAccent,
  },
  statusChipLabel: {
    fontSize: 11,
    fontWeight: "700",
  },
  statusChipLabel_pending: {
    color: tokens.color.faint,
  },
  statusChipLabel_joined: {
    color: tokens.color.ink2,
  },
  statusChipLabel_first_sale: {
    color: tokens.color.accent,
  },
  statusChipLabel_rewarded: {
    color: tokens.color.onAccent,
  },
  emptyState: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(6),
    alignItems: "center",
  },
  emptyStateText: {
    fontSize: 14,
    color: tokens.color.muted,
    textAlign: "center",
  },
  pressedDim: {
    opacity: 0.7,
  },
});
