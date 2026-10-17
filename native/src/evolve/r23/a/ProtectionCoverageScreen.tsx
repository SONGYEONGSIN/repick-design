// native/src/evolve/r23/a/ProtectionCoverageScreen.tsx
//
// Domain: Buyer Protection Coverage — a read-only completed-record screen
// (GENERATION.md §3, second documented band form) showing the status of a
// purchase-protection plan already attached to a past order: coverage dates,
// what's covered, and claim eligibility.
//
// Band choice: this is NOT a blocked multi-step workflow, so there is no
// "why can't I proceed" state machine here. The bottom band is only ever
// mounted when there is a real, currently-available action ("File a Claim"),
// and it disappears entirely once that action has been used up — "no band"
// is the natural resting state for a plan with zero remaining claims, not a
// disabled leftover button.
import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  ScrollView,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { tokens } from "../../../tokens";
import {
  item,
  plan,
  coveredItems,
  notCoveredItems,
  initialClaims,
  TODAY_ISO,
  daysBetweenIso,
  formatDateIso,
  formatKrw,
  ClaimRecord,
} from "./data";
import { ClaimRow, StatusChip } from "./components";

const EXPIRING_SOON_THRESHOLD_DAYS = 30;

type CoverageTone = "success" | "warning" | "neutral";

export default function ProtectionCoverageScreen() {
  const [claims, setClaims] = useState<ClaimRecord[]>(initialClaims);
  const [filerOpen, setFilerOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null);
  const [liveMessage, setLiveMessage] = useState("");

  const isActive =
    TODAY_ISO >= plan.coverageStartIso && TODAY_ISO <= plan.coverageEndIso;
  const isExpired = TODAY_ISO > plan.coverageEndIso;
  const daysRemaining = daysBetweenIso(TODAY_ISO, plan.coverageEndIso);
  const isExpiringSoon =
    isActive && daysRemaining >= 0 && daysRemaining <= EXPIRING_SOON_THRESHOLD_DAYS;

  let statusLabel: string;
  let statusTone: CoverageTone;
  if (isExpired) {
    statusLabel = "Expired";
    statusTone = "neutral";
  } else if (isExpiringSoon) {
    statusLabel = "Expiring Soon";
    statusTone = "warning";
  } else if (isActive) {
    statusLabel = "Active";
    statusTone = "success";
  } else {
    statusLabel = "Not Yet Active";
    statusTone = "neutral";
  }

  const remainingClaims = plan.maxClaims - claims.length;
  const canFile = isActive && remainingClaims > 0;

  function openFiler() {
    setFilerOpen(true);
    setSelectedIssue(null);
  }

  function cancelFiler() {
    setFilerOpen(false);
    setSelectedIssue(null);
  }

  function submitClaim() {
    if (!selectedIssue) return;
    const newClaim: ClaimRecord = {
      id: `CLM-${1042 + claims.length}`,
      dateFiled: TODAY_ISO,
      issue: selectedIssue,
      status: "Submitted",
      payoutKrw: null,
    };
    const nextClaims = [newClaim, ...claims];
    const nextRemaining = plan.maxClaims - nextClaims.length;
    setClaims(nextClaims);
    setFilerOpen(false);
    setSelectedIssue(null);
    setLiveMessage(
      `Claim ${newClaim.id} submitted for review: ${newClaim.issue}. ` +
        `${nextRemaining} claim${nextRemaining === 1 ? "" : "s"} remaining this coverage term.`
    );
  }

  const showBand = canFile || filerOpen;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text accessibilityRole="header" style={styles.title}>
          Protection Coverage
        </Text>
        <Text style={styles.subtitle}>
          Purchase-protection plan attached to this order
        </Text>

        <View style={styles.itemCard}>
          <View style={styles.itemThumb}>
            <Text style={styles.itemThumbGlyph}>{item.brand.charAt(0)}</Text>
          </View>
          <View style={styles.itemInfo}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemMeta}>
              Order {item.orderId} · Purchased {formatDateIso(item.purchaseDateIso)}
            </Text>
            <Text style={styles.itemPrice}>{formatKrw(item.purchasePriceKrw)}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.statusRow}>
            <StatusChip label={statusLabel} tone={statusTone} />
            {isExpiringSoon && (
              <Text style={styles.expiringNote}>{daysRemaining} days left</Text>
            )}
          </View>
          <Text style={styles.cardLabel}>Coverage window</Text>
          <Text style={styles.cardValue}>
            {formatDateIso(plan.coverageStartIso)} – {formatDateIso(plan.coverageEndIso)}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Plan</Text>
          <Text style={styles.cardValue}>
            {plan.planName} · {plan.tierLabel}
          </Text>
          <View style={styles.planGrid}>
            <View style={styles.planGridItem}>
              <Text style={styles.cardLabel}>Max claim value</Text>
              <Text style={styles.cardValueSmall}>{formatKrw(plan.maxClaimValueKrw)}</Text>
            </View>
            <View style={styles.planGridItem}>
              <Text style={styles.cardLabel}>Deductible</Text>
              <Text style={styles.cardValueSmall}>{formatKrw(plan.deductibleKrw)}</Text>
            </View>
            <View style={styles.planGridItem}>
              <Text style={styles.cardLabel}>Claims used</Text>
              <Text style={styles.cardValueSmall}>
                {claims.length} of {plan.maxClaims}
              </Text>
            </View>
          </View>
        </View>

        <Text accessibilityRole="header" style={styles.sectionHeader}>
          What&apos;s Covered
        </Text>
        <View style={styles.card}>
          {coveredItems.map((c, i) => (
            <View
              key={c}
              style={[styles.listRow, i === coveredItems.length - 1 && styles.listRowLast]}
            >
              <Text style={styles.checkGlyph}>✓</Text>
              <Text style={styles.listText}>{c}</Text>
            </View>
          ))}
        </View>

        <Text accessibilityRole="header" style={styles.sectionHeader}>
          What&apos;s Not Covered
        </Text>
        <View style={styles.card}>
          {notCoveredItems.map((c, i) => (
            <View
              key={c}
              style={[styles.listRow, i === notCoveredItems.length - 1 && styles.listRowLast]}
            >
              <Text style={styles.dashGlyph}>–</Text>
              <Text style={styles.listTextMuted}>{c}</Text>
            </View>
          ))}
        </View>

        <Text accessibilityRole="header" style={styles.sectionHeader}>
          Claim History
        </Text>
        {claims.length === 0 ? (
          <View style={styles.card}>
            <Text style={styles.emptyText}>No claims filed on this plan yet.</Text>
          </View>
        ) : (
          <View style={styles.card}>
            <FlatList
              data={claims}
              keyExtractor={(c) => c.id}
              scrollEnabled={false}
              renderItem={({ item: claim }) => <ClaimRow claim={claim} />}
              ItemSeparatorComponent={() => <View style={styles.claimSep} />}
            />
          </View>
        )}

        {showBand && (
          <View style={{ height: filerOpen ? tokens.space(24) * 3 : tokens.space(24) }} />
        )}
      </ScrollView>

      {showBand && (
        <View style={styles.actionBar} accessibilityLiveRegion="polite">
          {liveMessage.length > 0 && (
            <Text accessibilityRole="alert" style={styles.liveMessage}>
              {liveMessage}
            </Text>
          )}

          {!filerOpen ? (
            <Pressable
              onPress={openFiler}
              style={({ pressed }) => [styles.fileButton, pressed && styles.fileButtonPressed]}
              accessibilityRole="button"
              accessibilityLabel="File a claim for this item"
              accessibilityHint="Opens a short form to choose the issue and submit a claim"
            >
              <Text style={styles.fileButtonText}>File a Claim</Text>
            </Pressable>
          ) : (
            <View>
              <Text style={styles.filerPrompt}>What happened?</Text>
              {coveredItems.map((reason) => {
                const selected = selectedIssue === reason;
                return (
                  <Pressable
                    key={reason}
                    onPress={() => setSelectedIssue(reason)}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: selected }}
                    accessibilityLabel={reason}
                    style={[styles.reasonRow, selected && styles.reasonRowSelected]}
                  >
                    <View style={[styles.radioOuter, selected && styles.radioOuterSelected]}>
                      {selected && <View style={styles.radioInner} />}
                    </View>
                    <Text style={styles.reasonText}>{reason}</Text>
                  </Pressable>
                );
              })}
              <View style={styles.filerButtonRow}>
                <Pressable
                  onPress={cancelFiler}
                  style={({ pressed }) => [styles.cancelButton, pressed && styles.cancelButtonPressed]}
                  accessibilityRole="button"
                  accessibilityLabel="Cancel filing a claim"
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </Pressable>
                <Pressable
                  onPress={submitClaim}
                  disabled={!selectedIssue}
                  style={({ pressed }) => [
                    styles.submitButton,
                    !selectedIssue && styles.submitButtonDisabled,
                    pressed && !!selectedIssue && styles.submitButtonPressed,
                  ]}
                  accessibilityRole="button"
                  accessibilityState={{ disabled: !selectedIssue }}
                  accessibilityLabel="Submit claim"
                  {...(selectedIssue
                    ? { accessibilityHint: "Files this claim for review and adds it to your claim history" }
                    : {})}
                >
                  <Text
                    style={[styles.submitButtonText, !selectedIssue && styles.submitButtonTextDisabled]}
                  >
                    Submit Claim
                  </Text>
                </Pressable>
              </View>
            </View>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  scrollContent: {
    paddingHorizontal: tokens.space(4),
    paddingTop: tokens.space(4),
    paddingBottom: tokens.space(6),
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  subtitle: {
    fontSize: 13,
    color: tokens.color.muted,
    marginTop: tokens.space(1),
    marginBottom: tokens.space(4),
  },
  itemCard: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(3),
    marginBottom: tokens.space(3),
    gap: tokens.space(3),
  },
  itemThumb: {
    width: 48,
    height: 48,
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.ink,
    alignItems: "center",
    justifyContent: "center",
  },
  itemThumbGlyph: {
    color: tokens.color.onInk,
    fontSize: 18,
    fontWeight: "700",
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 15,
    fontWeight: "600",
    color: tokens.color.ink,
    marginBottom: tokens.space(1),
  },
  itemMeta: {
    fontSize: 12,
    color: tokens.color.muted,
    marginBottom: tokens.space(1),
  },
  itemPrice: {
    fontSize: 13,
    fontWeight: "600",
    color: tokens.color.ink2,
    fontVariant: ["tabular-nums"],
  },
  card: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(3),
    marginBottom: tokens.space(3),
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: tokens.space(3),
    gap: tokens.space(2),
  },
  expiringNote: {
    fontSize: 12,
    color: tokens.color.warning,
    fontWeight: "600",
  },
  cardLabel: {
    fontSize: 11,
    color: tokens.color.faint,
    textTransform: "uppercase",
    letterSpacing: 0.4,
    marginBottom: tokens.space(1),
  },
  cardValue: {
    fontSize: 15,
    fontWeight: "600",
    color: tokens.color.ink,
  },
  cardValueSmall: {
    fontSize: 13,
    fontWeight: "600",
    color: tokens.color.ink,
    fontVariant: ["tabular-nums"],
  },
  planGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: tokens.space(3),
    gap: tokens.space(3),
  },
  planGridItem: {
    minWidth: "40%",
    flexGrow: 1,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.ink,
    marginBottom: tokens.space(2),
    marginTop: tokens.space(1),
  },
  listRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: tokens.space(2),
    borderBottomWidth: 1,
    borderBottomColor: tokens.color.border,
    gap: tokens.space(2),
  },
  listRowLast: {
    borderBottomWidth: 0,
  },
  checkGlyph: {
    color: tokens.color.success,
    fontSize: 14,
    fontWeight: "700",
    width: 16,
  },
  dashGlyph: {
    color: tokens.color.faint,
    fontSize: 14,
    fontWeight: "700",
    width: 16,
  },
  listText: {
    flex: 1,
    fontSize: 13,
    color: tokens.color.ink2,
    lineHeight: 18,
  },
  listTextMuted: {
    flex: 1,
    fontSize: 13,
    color: tokens.color.muted,
    lineHeight: 18,
  },
  claimSep: {
    height: 1,
    backgroundColor: tokens.color.border,
  },
  emptyText: {
    fontSize: 13,
    color: tokens.color.muted,
  },
  actionBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: tokens.color.bg,
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    padding: tokens.space(4),
  },
  liveMessage: {
    fontSize: 12,
    color: tokens.color.success,
    marginBottom: tokens.space(2),
  },
  fileButton: {
    backgroundColor: tokens.color.accent,
    borderRadius: tokens.radius.md,
    paddingVertical: tokens.space(3),
    alignItems: "center",
  },
  fileButtonPressed: {
    opacity: 0.85,
  },
  fileButtonText: {
    color: tokens.color.onAccent,
    fontSize: 15,
    fontWeight: "700",
  },
  filerPrompt: {
    fontSize: 13,
    fontWeight: "600",
    color: tokens.color.ink,
    marginBottom: tokens.space(2),
  },
  reasonRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: tokens.space(2),
    gap: tokens.space(2),
  },
  reasonRowSelected: {
    backgroundColor: tokens.color.accentBg,
    borderRadius: tokens.radius.sm,
  },
  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
  },
  radioOuterSelected: {
    borderColor: tokens.color.accent,
  },
  radioInner: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: tokens.color.accent,
  },
  reasonText: {
    flex: 1,
    fontSize: 13,
    color: tokens.color.ink2,
  },
  filerButtonRow: {
    flexDirection: "row",
    marginTop: tokens.space(3),
    gap: tokens.space(3),
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    paddingVertical: tokens.space(3),
    alignItems: "center",
  },
  cancelButtonPressed: {
    backgroundColor: tokens.color.border,
  },
  cancelButtonText: {
    color: tokens.color.ink2,
    fontSize: 14,
    fontWeight: "600",
  },
  submitButton: {
    flex: 1,
    backgroundColor: tokens.color.accent,
    borderRadius: tokens.radius.md,
    paddingVertical: tokens.space(3),
    alignItems: "center",
  },
  submitButtonPressed: {
    opacity: 0.85,
  },
  submitButtonDisabled: {
    backgroundColor: tokens.color.border,
  },
  submitButtonText: {
    color: tokens.color.onAccent,
    fontSize: 14,
    fontWeight: "700",
  },
  submitButtonTextDisabled: {
    color: tokens.color.faint,
  },
});
