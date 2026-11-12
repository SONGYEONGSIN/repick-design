// native/src/evolve/r30/a/SubscriptionPlanScreen.tsx
// Candidate "a" — Subscription Plan Management (seller's paid Pro plan).
// Named export: SubscriptionPlanScreen.
import React, { useState } from "react";
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
  currentPlan,
  planBenefits,
  buildCancellationNotice,
  buildConfirmationPrompt,
  PlanBenefit,
} from "./data";

// Band lifecycle, named for this domain:
//   "steady"      — normal state, single "Cancel Subscription" action
//   "verifying"   — band has flipped into the Cancel / Confirm two-button row
//   "terminated"  — cancellation confirmed, result line shown, no more actions
type BandPhase = "steady" | "verifying" | "terminated";

export function SubscriptionPlanScreen() {
  const [bandPhase, setBandPhase] = useState<BandPhase>("steady");

  const confirmationPrompt = buildConfirmationPrompt(currentPlan.renewalDate);
  const cancellationNotice = buildCancellationNotice(currentPlan.renewalDate);

  const headerStatusLabel =
    bandPhase === "terminated" ? "Cancellation scheduled" : "Active";

  function renderBenefit({ item }: { item: PlanBenefit }) {
    return (
      <View style={styles.benefitRow}>
        <Text style={styles.benefitMark} accessibilityLabel="Included">
          ✓
        </Text>
        <View style={styles.benefitTextGroup}>
          <Text style={styles.benefitLabel}>{item.label}</Text>
          <Text style={styles.benefitDetail}>{item.detail}</Text>
        </View>
      </View>
    );
  }

  function ListHeader() {
    return (
      <View style={styles.headerGroup}>
        <Text style={styles.heading} accessibilityRole="header">
          Pro Seller Plan
        </Text>
        <Text style={styles.subheading}>
          Manage your paid selling plan, billing, and benefits.
        </Text>

        <View style={styles.planCard}>
          <View style={styles.planCardTopRow}>
            <View>
              <Text style={styles.planName}>{currentPlan.planName}</Text>
              <Text style={styles.planTierLabel}>{currentPlan.tierLabel}</Text>
            </View>
            <View
              style={[
                styles.statusBadge,
                bandPhase === "terminated"
                  ? styles.statusBadgeWarning
                  : styles.statusBadgeSuccess,
              ]}
            >
              <Text
                style={[
                  styles.statusBadgeText,
                  bandPhase === "terminated"
                    ? styles.statusBadgeTextWarning
                    : styles.statusBadgeTextSuccess,
                ]}
              >
                {headerStatusLabel}
              </Text>
            </View>
          </View>

          <View style={styles.planCardDivider} />

          <View style={styles.planFactRow}>
            <Text style={styles.planFactLabel}>Price</Text>
            <Text style={styles.planFactValue}>{currentPlan.priceLabel}</Text>
          </View>
          <View style={styles.planFactRow}>
            <Text style={styles.planFactLabel}>Billing cycle</Text>
            <Text style={styles.planFactValue}>
              {currentPlan.billingCycle}
            </Text>
          </View>
          <View style={styles.planFactRow}>
            <Text style={styles.planFactLabel}>Next renewal</Text>
            <Text style={styles.planFactValue}>
              {currentPlan.renewalDate}
            </Text>
          </View>
          <View style={styles.planFactRow}>
            <Text style={styles.planFactLabel}>Member since</Text>
            <Text style={styles.planFactValue}>
              {currentPlan.memberSinceDate}
            </Text>
          </View>
        </View>

        <Text style={styles.benefitsHeading} accessibilityRole="header">
          Plan benefits
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <FlatList
        data={planBenefits}
        keyExtractor={(item) => item.id}
        renderItem={renderBenefit}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.listContent}
        style={styles.list}
      />

      <View
        style={styles.band}
        accessibilityLiveRegion="polite"
      >
        {bandPhase === "steady" && (
          <Pressable
            style={({ pressed }) => [
              styles.bandButtonOutline,
              pressed && styles.bandButtonOutlinePressed,
            ]}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Cancel subscription"
            onPress={() => setBandPhase("verifying")}
          >
            <Text style={styles.bandButtonOutlineText}>
              Cancel Subscription
            </Text>
          </Pressable>
        )}

        {bandPhase === "verifying" && (
          <View>
            <Text
              style={styles.bandAlertText}
              accessibilityRole="alert"
            >
              {confirmationPrompt}
            </Text>
            <View style={styles.bandButtonRow}>
              <Pressable
                style={({ pressed }) => [
                  styles.bandButtonSecondary,
                  pressed && styles.bandButtonSecondaryPressed,
                ]}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="Keep my plan"
                onPress={() => setBandPhase("steady")}
              >
                <Text style={styles.bandButtonSecondaryText}>Keep Plan</Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [
                  styles.bandButtonDanger,
                  pressed && styles.bandButtonDangerPressed,
                ]}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="Confirm cancellation"
                onPress={() => setBandPhase("terminated")}
              >
                <Text style={styles.bandButtonDangerText}>
                  Confirm Cancellation
                </Text>
              </Pressable>
            </View>
          </View>
        )}

        {bandPhase === "terminated" && (
          <Text
            style={styles.bandAlertText}
            accessibilityRole="alert"
          >
            {cancellationNotice}
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: tokens.space(4),
    paddingBottom: tokens.space(6),
  },
  headerGroup: {
    paddingTop: tokens.space(4),
  },
  heading: {
    fontSize: 24,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  subheading: {
    marginTop: tokens.space(1),
    fontSize: 14,
    color: tokens.color.muted,
  },
  planCard: {
    marginTop: tokens.space(5),
    padding: tokens.space(4),
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
  },
  planCardTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  planName: {
    fontSize: 18,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  planTierLabel: {
    marginTop: tokens.space(1),
    fontSize: 13,
    color: tokens.color.faint,
  },
  statusBadge: {
    paddingVertical: tokens.space(1),
    paddingHorizontal: tokens.space(2),
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
  },
  statusBadgeSuccess: {
    backgroundColor: tokens.color.successBg,
    borderColor: tokens.color.successBorder,
  },
  statusBadgeWarning: {
    backgroundColor: tokens.color.warningBg,
    borderColor: tokens.color.warningBorder,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  statusBadgeTextSuccess: {
    color: tokens.color.success,
  },
  statusBadgeTextWarning: {
    color: tokens.color.warning,
  },
  planCardDivider: {
    height: 1,
    backgroundColor: tokens.color.border,
    marginVertical: tokens.space(4),
  },
  planFactRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: tokens.space(1),
  },
  planFactLabel: {
    fontSize: 14,
    color: tokens.color.muted,
  },
  planFactValue: {
    fontSize: 14,
    fontWeight: "600",
    color: tokens.color.ink,
    fontVariant: ["tabular-nums"],
  },
  benefitsHeading: {
    marginTop: tokens.space(6),
    marginBottom: tokens.space(2),
    fontSize: 16,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  benefitRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: tokens.space(2),
    borderBottomWidth: 1,
    borderBottomColor: tokens.color.border,
  },
  benefitMark: {
    width: 20,
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.accent,
  },
  benefitTextGroup: {
    flex: 1,
    marginLeft: tokens.space(2),
  },
  benefitLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: tokens.color.ink,
  },
  benefitDetail: {
    marginTop: tokens.space(1) / 2,
    fontSize: 13,
    color: tokens.color.muted,
  },
  band: {
    padding: tokens.space(4),
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
  },
  bandButtonOutline: {
    minHeight: 44,
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.dangerBorder,
    backgroundColor: tokens.color.dangerBg,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: tokens.space(3),
  },
  bandButtonOutlinePressed: {
    opacity: 0.7,
  },
  bandButtonOutlineText: {
    fontSize: 15,
    fontWeight: "600",
    color: tokens.color.danger,
  },
  bandAlertText: {
    fontSize: 14,
    color: tokens.color.ink2,
    lineHeight: 20,
  },
  bandButtonRow: {
    flexDirection: "row",
    marginTop: tokens.space(3),
    gap: tokens.space(2),
  },
  bandButtonSecondary: {
    flex: 1,
    minHeight: 44,
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    alignItems: "center",
    justifyContent: "center",
  },
  bandButtonSecondaryPressed: {
    backgroundColor: tokens.color.accentBg,
  },
  bandButtonSecondaryText: {
    fontSize: 15,
    fontWeight: "600",
    color: tokens.color.ink,
  },
  bandButtonDanger: {
    flex: 1,
    minHeight: 44,
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.color.danger,
    alignItems: "center",
    justifyContent: "center",
  },
  bandButtonDangerPressed: {
    opacity: 0.85,
  },
  bandButtonDangerText: {
    fontSize: 15,
    fontWeight: "600",
    color: tokens.color.onAccent,
  },
});

export default SubscriptionPlanScreen;
