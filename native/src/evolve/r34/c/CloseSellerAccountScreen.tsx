// native/src/evolve/r34/c/CloseSellerAccountScreen.tsx
// Destructive-confirm band, single global action, band self-transforms in place.
import React, { useCallback, useMemo, useState } from "react";
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
  SELLER_ACCOUNT,
  getBlockers,
  isEligibleToClose,
  buildSummaryRows,
  type Blocker,
  type ImpactRow,
  type SummaryRow,
} from "./data";

type BandStage = "idle" | "confirming" | "closed";

function joinWithAnd(parts: string[]): string {
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0];
  if (parts.length === 2) return `${parts[0]} and ${parts[1]}`;
  return `${parts.slice(0, -1).join(", ")}, and ${parts[parts.length - 1]}`;
}

function buildIdleStatus(blockers: Blocker[]): string {
  const unresolved = blockers.filter((b) => !b.resolved);
  if (unresolved.length === 0) {
    return "No blockers. Closing your account is permanent and cannot be undone.";
  }
  const parts = unresolved.map((b) => b.detail);
  return `You have ${joinWithAnd(parts)} — resolve this before closing your account.`;
}

const CONFIRM_STATUS =
  "This will permanently close your account, delist every active listing, and cannot be undone.";
const CLOSED_STATUS = "Account closure confirmed. You will be signed out shortly.";

export default function CloseSellerAccountScreen() {
  const [stage, setStage] = useState<BandStage>("idle");

  const blockers = useMemo(() => getBlockers(SELLER_ACCOUNT), []);
  const eligible = useMemo(() => isEligibleToClose(SELLER_ACCOUNT), []);
  const rows = useMemo(() => buildSummaryRows(SELLER_ACCOUNT), []);

  const handleStartClose = useCallback(() => {
    if (!eligible) return;
    setStage("confirming");
  }, [eligible]);

  const handleCancel = useCallback(() => {
    setStage("idle");
  }, []);

  const handleConfirm = useCallback(() => {
    setStage("closed");
  }, []);

  const bandStatusText =
    stage === "idle"
      ? buildIdleStatus(blockers)
      : stage === "confirming"
        ? CONFIRM_STATUS
        : CLOSED_STATUS;

  const renderItem = useCallback(({ item }: { item: SummaryRow }) => {
    if (item.kind === "section") {
      return (
        <Text accessibilityRole="header" style={styles.sectionTitle}>
          {item.title}
        </Text>
      );
    }
    if (item.kind === "blocker") {
      return <BlockerRow blocker={item.blocker} />;
    }
    return <ImpactRowView impact={item.impact} />;
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        style={styles.list}
        contentContainerStyle={styles.listContent}
        data={rows}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text accessibilityRole="header" style={styles.title}>
              Close Seller Account
            </Text>
            <Text style={styles.subtitle}>
              {SELLER_ACCOUNT.sellerHandle}
              {" · selling on repick since "}
              {SELLER_ACCOUNT.memberSinceISO}
            </Text>
            <Text style={styles.intro}>
              {
                "Closing your seller account removes your storefront and listings from repick. This is a one-way action — it cannot be reopened once confirmed."
              }
            </Text>
          </View>
        }
      />

      <View style={styles.band} accessibilityLiveRegion="polite">
        <Text accessibilityRole="alert" style={styles.bandStatus}>
          {bandStatusText}
        </Text>

        {stage === "idle" ? (
          <Pressable
            onPress={handleStartClose}
            disabled={!eligible}
            accessibilityRole="button"
            accessibilityLabel="Close account"
            accessibilityHint={
              eligible
                ? "Opens a confirmation step before permanently closing your account."
                : undefined
            }
            accessibilityState={{ disabled: !eligible }}
            style={({ pressed }) => [
              styles.primaryButton,
              !eligible && styles.primaryButtonDisabled,
              pressed && eligible && styles.primaryButtonPressed,
            ]}
          >
            <Text
              style={[
                styles.primaryButtonLabel,
                !eligible && styles.primaryButtonLabelDisabled,
              ]}
            >
              Close account
            </Text>
          </Pressable>
        ) : null}

        {stage === "confirming" ? (
          <View style={styles.confirmRow}>
            <Pressable
              onPress={handleCancel}
              accessibilityRole="button"
              accessibilityLabel="Cancel"
              accessibilityHint="Returns without closing your account."
              style={({ pressed }) => [
                styles.secondaryButton,
                pressed && styles.secondaryButtonPressed,
              ]}
            >
              <Text style={styles.secondaryButtonLabel}>Cancel</Text>
            </Pressable>
            <Pressable
              onPress={handleConfirm}
              accessibilityRole="button"
              accessibilityLabel="Confirm closure"
              accessibilityHint="Permanently closes your account. This cannot be undone."
              style={({ pressed }) => [
                styles.confirmButton,
                pressed && styles.confirmButtonPressed,
              ]}
            >
              <Text style={styles.confirmButtonLabel}>Confirm closure</Text>
            </Pressable>
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

function BlockerRow({ blocker }: { blocker: Blocker }) {
  return (
    <View style={styles.row}>
      <View style={styles.rowTextGroup}>
        <Text style={styles.rowLabel}>{blocker.label}</Text>
        <Text style={styles.rowDetail}>{blocker.detail}</Text>
      </View>
      <View
        style={[
          styles.badge,
          blocker.resolved ? styles.badgeSuccess : styles.badgeDanger,
        ]}
      >
        <Text
          style={[
            styles.badgeLabel,
            blocker.resolved ? styles.badgeLabelSuccess : styles.badgeLabelDanger,
          ]}
        >
          {blocker.resolved ? "Resolved" : "Needs action"}
        </Text>
      </View>
    </View>
  );
}

function ImpactRowView({ impact }: { impact: ImpactRow }) {
  return (
    <View style={styles.row}>
      <View style={styles.rowTextGroup}>
        <Text style={styles.rowLabel}>{impact.label}</Text>
        <Text style={styles.rowDetail}>{impact.detail}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: tokens.space(8),
  },
  header: {
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(5),
    paddingBottom: tokens.space(3),
    gap: tokens.space(2),
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  subtitle: {
    fontSize: 13,
    color: tokens.color.faint,
  },
  intro: {
    fontSize: 15,
    lineHeight: 21,
    color: tokens.color.muted,
    marginTop: tokens.space(1),
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: tokens.color.ink2,
    textTransform: "uppercase",
    letterSpacing: 0.4,
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(5),
    paddingBottom: tokens.space(2),
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: tokens.space(5),
    paddingVertical: tokens.space(3),
    borderBottomWidth: 1,
    borderBottomColor: tokens.color.border,
    gap: tokens.space(3),
  },
  rowTextGroup: {
    flex: 1,
    gap: tokens.space(1),
  },
  rowLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: tokens.color.ink,
  },
  rowDetail: {
    fontSize: 13,
    color: tokens.color.muted,
  },
  badge: {
    paddingHorizontal: tokens.space(2),
    paddingVertical: tokens.space(1),
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
  },
  badgeSuccess: {
    backgroundColor: tokens.color.successBg,
    borderColor: tokens.color.successBorder,
  },
  badgeDanger: {
    backgroundColor: tokens.color.dangerBg,
    borderColor: tokens.color.dangerBorder,
  },
  badgeLabel: {
    fontSize: 12,
    fontWeight: "700",
  },
  badgeLabelSuccess: {
    color: tokens.color.success,
  },
  badgeLabelDanger: {
    color: tokens.color.danger,
  },
  band: {
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(4),
    paddingBottom: tokens.space(5),
    gap: tokens.space(3),
  },
  bandStatus: {
    fontSize: 14,
    lineHeight: 20,
    color: tokens.color.ink2,
  },
  primaryButton: {
    minHeight: 48,
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.dangerBorder,
    backgroundColor: tokens.color.dangerBg,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonPressed: {
    backgroundColor: tokens.color.danger,
    borderColor: tokens.color.danger,
  },
  primaryButtonDisabled: {
    backgroundColor: tokens.color.bg,
    borderColor: tokens.color.border,
  },
  primaryButtonLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: tokens.color.danger,
  },
  primaryButtonLabelDisabled: {
    color: tokens.color.faint,
  },
  confirmRow: {
    flexDirection: "row",
    gap: tokens.space(3),
  },
  secondaryButton: {
    flex: 1,
    minHeight: 48,
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonPressed: {
    backgroundColor: tokens.color.accentBg,
  },
  secondaryButtonLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: tokens.color.ink,
  },
  confirmButton: {
    flex: 1,
    minHeight: 48,
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.color.danger,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmButtonPressed: {
    opacity: 0.85,
  },
  confirmButtonLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: tokens.color.onInk,
  },
});
