// native/src/evolve/r14/b/InviteRewardsScreen.tsx
//
// Referral & Rewards — growth rewards earned by inviting friends, not a paid membership tier.
// The domain line under the heading exists specifically to keep that distinction legible: this
// screen's rewards are unlocked by invite count, membership's are unlocked by a subscription fee.
//
// This is not a blocked workflow, so per GENERATION.md §3 there is no bottom state-machine band —
// the invite count, the reward ladder, and every earned/locked state are always-on proof, visible
// without any interaction. The only action ("Share invite code" / "Copy") amplifies that proof, it
// never gates it: the ladder and progress bar render fully before either button is ever pressed.
import { useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { tokens } from "../../../tokens";
import {
  COPY_FEEDBACK,
  CURRENT_INVITES,
  INVITE_CODE,
  MILESTONES,
  SHARE_FEEDBACK,
  badgesEarnedSoFar,
  creditEarnedSoFar,
  formatWon,
  nextMilestoneOf,
  statusFor,
} from "./data";
import type { MilestoneStatus } from "./data";

const nextMilestone = nextMilestoneOf(CURRENT_INVITES);
const nextId = nextMilestone ? nextMilestone.id : null;
const creditSoFar = creditEarnedSoFar(CURRENT_INVITES);
const badgesSoFar = badgesEarnedSoFar(CURRENT_INVITES);

function statusLabel(status: MilestoneStatus, threshold: number, invites: number): string {
  if (status === "achieved") return "Unlocked";
  if (status === "next") return `${threshold - invites} invite${threshold - invites === 1 ? "" : "s"} to go`;
  return `Unlocks at ${threshold} invites`;
}

export function InviteRewardsScreen() {
  const [feedback, setFeedback] = useState<string | null>(null);

  function handleShare() {
    // Native Share sheet trigger is a no-op here — this candidate simulates the confirmation
    // rather than calling the platform Share API, matching the proven pattern in
    // native/src/certificate/AuthenticationCertificateScreen.tsx (state-driven feedback, no
    // native module dependency the web/iframe render gate can't satisfy).
    setFeedback(SHARE_FEEDBACK);
  }

  function handleCopy() {
    setFeedback(COPY_FEEDBACK);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollBody}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.eyebrow}>Referral rewards</Text>
        <Text style={styles.title} accessibilityRole="header">
          Invite friends, earn rewards
        </Text>
        <Text style={styles.domainNote}>
          Growth rewards, not membership: everything below comes from friends you invite, not from
          any paid plan.
        </Text>

        <View style={styles.codeCard}>
          <Text style={styles.sectionLabel}>Your invite code</Text>
          <View style={styles.codeRow}>
            <Text style={styles.codeText} selectable>
              {INVITE_CODE}
            </Text>
            <Pressable
              onPress={handleCopy}
              accessibilityRole="button"
              accessibilityLabel={`Copy invite code ${INVITE_CODE}`}
              style={({ pressed }) => [styles.copyButton, pressed && styles.pressed]}
            >
              <Text style={styles.copyText}>Copy</Text>
            </Pressable>
          </View>

          <Pressable
            onPress={handleShare}
            accessibilityRole="button"
            accessibilityLabel={`Share invite code ${INVITE_CODE}`}
            style={({ pressed }) => [styles.shareButton, pressed && styles.pressed]}
          >
            <Text style={styles.shareText}>Share invite code</Text>
          </Pressable>

          <View style={styles.feedbackSlot} accessibilityLiveRegion="polite">
            {feedback ? (
              <Text style={styles.feedbackText} accessibilityRole="alert">
                {feedback}
              </Text>
            ) : null}
          </View>
        </View>

        <View style={styles.summaryRow}>
          <View style={styles.summaryStat}>
            <Text style={styles.summaryValue}>{CURRENT_INVITES}</Text>
            <Text style={styles.summaryLabel}>Friends invited</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryStat}>
            <Text style={styles.summaryValue}>{formatWon(creditSoFar)}</Text>
            <Text style={styles.summaryLabel}>Credit earned</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryStat}>
            <Text style={styles.summaryValue}>{badgesSoFar}</Text>
            <Text style={styles.summaryLabel}>
              Badge{badgesSoFar === 1 ? "" : "s"} earned
            </Text>
          </View>
        </View>

        {nextMilestone ? (
          <View style={styles.progressBlock}>
            <View style={styles.progressHead}>
              <Text style={styles.sectionLabel}>Next reward</Text>
              <Text style={styles.progressCount}>
                {CURRENT_INVITES} / {nextMilestone.threshold} invites
              </Text>
            </View>
            <View
              style={styles.progressTrack}
              accessibilityRole="progressbar"
              accessibilityLabel={`Progress toward ${nextMilestone.title}`}
              accessibilityValue={{
                min: 0,
                max: nextMilestone.threshold,
                now: CURRENT_INVITES,
              }}
            >
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${Math.min(100, (CURRENT_INVITES / nextMilestone.threshold) * 100)}%`,
                  },
                ]}
              />
            </View>
            <Text style={styles.progressLine}>
              {nextMilestone.threshold - CURRENT_INVITES} more invite
              {nextMilestone.threshold - CURRENT_INVITES === 1 ? "" : "s"} unlocks{" "}
              <Text style={styles.progressLineStrong}>{nextMilestone.title}</Text> —{" "}
              {nextMilestone.detail}.
            </Text>
          </View>
        ) : (
          <View style={styles.progressBlock}>
            <Text style={styles.sectionLabel}>Next reward</Text>
            <Text style={styles.progressLine}>
              Every reward on the ladder is unlocked. Nice work.
            </Text>
          </View>
        )}

        <Text style={[styles.sectionLabel, styles.ladderLabel]}>Reward ladder</Text>
        <View style={styles.ladder}>
          {MILESTONES.map((milestone, index) => {
            const status = statusFor(milestone, CURRENT_INVITES, nextId);
            const isLast = index === MILESTONES.length - 1;
            const label = statusLabel(status, milestone.threshold, CURRENT_INVITES);
            return (
              <View
                key={milestone.id}
                style={styles.rung}
                accessible
                accessibilityLabel={`${milestone.threshold} invites: ${milestone.title}. ${milestone.detail}. ${label}.`}
              >
                <View style={styles.rail}>
                  <View
                    style={[
                      styles.node,
                      status === "achieved" && styles.nodeAchieved,
                      status === "next" && styles.nodeNext,
                    ]}
                  >
                    <Text
                      style={[
                        styles.nodeText,
                        status === "achieved" && styles.nodeTextAchieved,
                        status === "next" && styles.nodeTextNext,
                      ]}
                    >
                      {status === "achieved" ? "✓" : milestone.threshold}
                    </Text>
                  </View>
                  {!isLast ? (
                    <View
                      style={[
                        styles.connector,
                        status === "achieved" && styles.connectorAchieved,
                      ]}
                    />
                  ) : null}
                </View>

                <View style={styles.rungBody}>
                  <View style={styles.rungHead}>
                    <Text
                      style={[
                        styles.rungTitle,
                        status === "locked" && styles.rungTitleLocked,
                      ]}
                    >
                      {milestone.title}
                    </Text>
                    <Text
                      style={[
                        styles.rungStatus,
                        status === "achieved" && styles.rungStatusAchieved,
                        status === "next" && styles.rungStatusNext,
                      ]}
                    >
                      {label}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.rungDetail,
                      status === "locked" && styles.rungDetailLocked,
                    ]}
                  >
                    {milestone.detail}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  scroll: {
    flex: 1,
  },
  scrollBody: {
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(4),
    paddingBottom: tokens.space(8),
  },
  eyebrow: {
    fontSize: 11,
    letterSpacing: 1.2,
    fontWeight: "700",
    color: tokens.color.faint,
    textTransform: "uppercase",
  },
  title: {
    marginTop: tokens.space(2),
    fontSize: 24,
    lineHeight: 30,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  domainNote: {
    marginTop: tokens.space(2),
    fontSize: 13,
    lineHeight: 19,
    color: tokens.color.muted,
  },
  sectionLabel: {
    fontSize: 12,
    letterSpacing: 0.8,
    fontWeight: "700",
    color: tokens.color.muted,
    textTransform: "uppercase",
  },

  codeCard: {
    marginTop: tokens.space(6),
    padding: tokens.space(4),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
  },
  codeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: tokens.space(2),
  },
  codeText: {
    flex: 1,
    fontSize: 20,
    lineHeight: 26,
    fontWeight: "800",
    letterSpacing: 1,
    color: tokens.color.ink,
    fontVariant: ["tabular-nums"],
  },
  copyButton: {
    minWidth: 64,
    minHeight: 44,
    paddingHorizontal: tokens.space(3),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  copyText: {
    fontSize: 13,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  shareButton: {
    marginTop: tokens.space(3),
    minHeight: 48,
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.color.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  shareText: {
    fontSize: 15,
    fontWeight: "800",
    color: tokens.color.onAccent,
  },
  feedbackSlot: {
    minHeight: 20,
    marginTop: tokens.space(2),
  },
  feedbackText: {
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "600",
    color: tokens.color.accent,
  },

  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: tokens.space(5),
    paddingVertical: tokens.space(4),
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: tokens.color.border,
  },
  summaryStat: {
    flex: 1,
    alignItems: "center",
  },
  summaryDivider: {
    width: 1,
    height: 32,
    backgroundColor: tokens.color.border,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: "800",
    color: tokens.color.ink,
    fontVariant: ["tabular-nums"],
  },
  summaryLabel: {
    marginTop: tokens.space(1),
    fontSize: 11,
    fontWeight: "600",
    color: tokens.color.faint,
    textAlign: "center",
  },

  progressBlock: {
    marginTop: tokens.space(6),
  },
  progressHead: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  progressCount: {
    fontSize: 13,
    fontWeight: "700",
    color: tokens.color.ink,
    fontVariant: ["tabular-nums"],
  },
  progressTrack: {
    marginTop: tokens.space(3),
    height: 10,
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.border,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.accent,
  },
  progressLine: {
    marginTop: tokens.space(3),
    fontSize: 13,
    lineHeight: 20,
    color: tokens.color.muted,
  },
  progressLineStrong: {
    fontWeight: "700",
    color: tokens.color.ink,
  },

  ladderLabel: {
    marginTop: tokens.space(7),
    marginBottom: tokens.space(3),
  },
  ladder: {},
  rung: {
    flexDirection: "row",
  },
  rail: {
    width: 40,
    alignItems: "center",
  },
  node: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: tokens.color.bg,
  },
  nodeAchieved: {
    borderColor: tokens.color.accent,
    backgroundColor: tokens.color.accent,
  },
  nodeNext: {
    borderColor: tokens.color.accent,
    backgroundColor: tokens.color.bg,
  },
  nodeText: {
    fontSize: 11,
    fontWeight: "800",
    color: tokens.color.faint,
    fontVariant: ["tabular-nums"],
  },
  nodeTextAchieved: {
    color: tokens.color.onAccent,
  },
  nodeTextNext: {
    color: tokens.color.accent,
  },
  connector: {
    flex: 1,
    minHeight: tokens.space(6),
    width: 2,
    marginTop: tokens.space(1),
    marginBottom: tokens.space(1),
    backgroundColor: tokens.color.border,
  },
  connectorAchieved: {
    backgroundColor: tokens.color.accent,
  },
  rungBody: {
    flex: 1,
    paddingBottom: tokens.space(5),
  },
  rungHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rungTitle: {
    flexShrink: 1,
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  rungTitleLocked: {
    color: tokens.color.muted,
  },
  rungStatus: {
    marginLeft: tokens.space(2),
    fontSize: 11,
    fontWeight: "700",
    color: tokens.color.faint,
  },
  rungStatusAchieved: {
    color: tokens.color.accent,
  },
  rungStatusNext: {
    color: tokens.color.ink,
  },
  rungDetail: {
    marginTop: tokens.space(1),
    fontSize: 13,
    lineHeight: 19,
    color: tokens.color.muted,
  },
  rungDetailLocked: {
    // Body copy stays at `muted` even when locked — `faint` is reserved for large/decorative
    // text per GENERATION.md's UX-catalog note, not for a sentence someone has to read.
    color: tokens.color.muted,
  },
  pressed: {
    opacity: 0.72,
  },
});
