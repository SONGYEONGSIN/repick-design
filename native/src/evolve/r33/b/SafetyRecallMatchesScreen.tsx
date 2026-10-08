// native/src/evolve/r33/b/SafetyRecallMatchesScreen.tsx
//
// Safety Recall Matches — a seller-facing compliance queue. repick's trust
// & safety system cross-references a seller's own live listings against
// public product-safety recall notices and surfaces the hits here. This is
// NOT buyer-side reporting (see "Report a Listing") and NOT a dispute over
// a transaction (see "Disputes & Returns") — it is the seller being told
// "one of your own listings matches an official recall" and needing to act
// on their own catalog.
//
// Band form: selection-driven contextual bar. Absent while selectedIds is
// empty; mounts only once selectedCount > 0. A single live-region container
// inside the bar carries both the running-selection-count announcement and
// any confirmation copy — never a second, competing live region, and never
// a toast/undo surface alongside it.
//
// Real domain logic beyond plain multi-select:
//   1. Two bulk actions, gated by different business rules:
//      - "Remove from Marketplace" works on ANY pending match regardless of
//        confidence — a seller can always pull a listing down. Because it
//        is destructive (buyers lose visibility immediately), pressing it
//        does not open a native Alert: the bar itself swaps its action row
//        for a Cancel / Yes, Remove pair, announced through the same live
//        region as the selection count.
//      - "Dispute Match" only applies to "possible" (fuzzy) matches, never
//        "confirmed" (verified) ones — a seller cannot dispute their way
//        out of a confirmed recall. A mixed selection disputes only the
//        eligible items and leaves the confirmed ones selected with an
//        honest inline reason, instead of silently no-opping or pretending
//        the whole batch was filed.
//   2. The header's "N of M still need action" stat, the confirmed/possible
//      breakdown beneath it, and the per-button counts are all derived via
//      useMemo/filter over the same `matches` state the two actions mutate
//      — nothing here is a separately hand-tracked counter.
import React, { useEffect, useMemo, useRef, useState } from "react";
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
  RecallMatch,
  initialRecallMatches,
  formatPrice,
  confidenceLabel,
  statusLabel,
  swatchIndexFor,
} from "./data";

type RemoveStep = "idle" | "confirming";

const SWATCHES = [tokens.color.swatch1, tokens.color.swatch2, tokens.color.swatch3] as const;

export default function SafetyRecallMatchesScreen() {
  const [matches, setMatches] = useState<RecallMatch[]>(initialRecallMatches);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [removeStep, setRemoveStep] = useState<RemoveStep>("idle");

  // Transient announcement text for the single live region. It is the
  // state that gates accessibilityRole="alert" below, so it is cleared
  // back to "" a few seconds after every change — otherwise the alert
  // role would stay stuck on past the first real event.
  const [liveMessage, setLiveMessage] = useState("");
  const clearTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (clearTimerRef.current) clearTimeout(clearTimerRef.current);
    };
  }, []);

  function announce(text: string) {
    if (clearTimerRef.current) clearTimeout(clearTimerRef.current);
    setLiveMessage(text);
    clearTimerRef.current = setTimeout(() => setLiveMessage(""), 5000);
  }

  const pendingMatches = useMemo(() => matches.filter((m) => m.status === "pending"), [matches]);
  const pendingCount = pendingMatches.length;
  const confirmedPendingCount = useMemo(
    () => pendingMatches.filter((m) => m.confidence === "confirmed").length,
    [pendingMatches]
  );
  const possiblePendingCount = pendingCount - confirmedPendingCount;

  const selectedCount = selectedIds.size;
  const selectedMatches = useMemo(
    () => matches.filter((m) => selectedIds.has(m.id)),
    [matches, selectedIds]
  );
  const disputeEligibleSelected = useMemo(
    () => selectedMatches.filter((m) => m.confidence === "possible"),
    [selectedMatches]
  );
  const disputeIneligibleCount = selectedCount - disputeEligibleSelected.length;
  const canDisputeSome = disputeEligibleSelected.length > 0;
  const allSelectedDisputable = selectedCount > 0 && disputeIneligibleCount === 0;
  const listingWord = selectedCount === 1 ? "listing" : "listings";

  function toggleSelected(id: string) {
    const match = matches.find((m) => m.id === id);
    if (!match || match.status !== "pending") return;
    setRemoveStep("idle");
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
    if (next.size > 0) {
      announce(`${next.size} ${next.size === 1 ? "listing" : "listings"} selected`);
    }
  }

  function selectAllPending() {
    const ids = new Set(pendingMatches.map((m) => m.id));
    setSelectedIds(ids);
    setRemoveStep("idle");
    if (ids.size > 0) {
      announce(`${ids.size} ${ids.size === 1 ? "listing" : "listings"} selected`);
    }
  }

  function clearSelection() {
    setSelectedIds(new Set());
    setRemoveStep("idle");
  }

  function requestRemove() {
    setRemoveStep("confirming");
    announce(
      `Remove ${selectedCount} ${listingWord} from the marketplace now? Buyers won't see them again until you relist.`
    );
  }

  function cancelRemove() {
    setRemoveStep("idle");
    announce(`Cancelled. ${selectedCount} ${listingWord} still selected.`);
  }

  function confirmRemove() {
    const removedIds = new Set(selectedIds);
    setMatches((prev) =>
      prev.map((m) => (removedIds.has(m.id) ? { ...m, status: "removed" as const } : m))
    );
    setSelectedIds(new Set());
    setRemoveStep("idle");
  }

  function disputeSelected() {
    if (!canDisputeSome) return;
    const eligibleIds = new Set(disputeEligibleSelected.map((m) => m.id));
    const eligibleCount = eligibleIds.size;
    setMatches((prev) =>
      prev.map((m) => (eligibleIds.has(m.id) ? { ...m, status: "disputed" as const } : m))
    );
    const remaining = Array.from(selectedIds).filter((id) => !eligibleIds.has(id));
    setSelectedIds(new Set(remaining));
    setRemoveStep("idle");
    if (remaining.length > 0) {
      const skipped = remaining.length;
      announce(
        `Flagged ${eligibleCount} ${eligibleCount === 1 ? "match" : "matches"} for review. ${skipped} confirmed ${
          skipped === 1 ? "match stays" : "matches stay"
        } selected — those can only be removed.`
      );
    }
  }

  function renderItem({ item, index }: { item: RecallMatch; index: number }) {
    const checked = selectedIds.has(item.id);
    const resolved = item.status !== "pending";
    const pillLabel = item.status === "pending" ? confidenceLabel(item.confidence) : statusLabel(item.status);
    const pillStyle =
      item.status === "removed"
        ? [styles.pill, styles.pillRemoved]
        : item.status === "disputed"
          ? [styles.pill, styles.pillDisputed]
          : item.confidence === "confirmed"
            ? [styles.pill, styles.pillConfirmed]
            : [styles.pill, styles.pillPossible];
    const pillTextStyle =
      item.status === "removed"
        ? styles.pillTextRemoved
        : item.status === "disputed"
          ? styles.pillTextDisputed
          : item.confidence === "confirmed"
            ? styles.pillTextConfirmed
            : styles.pillTextPossible;

    const rowA11yLabel = `${item.listingTitle}, ${formatPrice(item.priceCents)}, ${pillLabel}${
      resolved ? "" : ", select to include in a bulk action"
    }`;

    return (
      <View style={styles.card}>
        <Pressable
          onPress={() => toggleSelected(item.id)}
          disabled={resolved}
          accessibilityRole="checkbox"
          accessibilityState={{ checked, disabled: resolved }}
          accessibilityLabel={rowA11yLabel}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          style={({ pressed }) => [
            styles.toggleCircle,
            checked && styles.toggleCircleOn,
            resolved && styles.toggleCircleDisabled,
            pressed && !resolved && styles.toggleCirclePressed,
          ]}
        >
          {checked ? <Text style={styles.tickGlyph}>{"✓"}</Text> : null}
        </Pressable>

        <View style={[styles.thumbBox, { backgroundColor: SWATCHES[swatchIndexFor(index)] }]}>
          <Text style={styles.thumbGlyph}>{item.category.charAt(0)}</Text>
        </View>

        <View style={styles.cardMain}>
          <View style={styles.cardHeadRow}>
            <Text style={styles.cardTitle} numberOfLines={1}>
              {item.listingTitle}
            </Text>
          </View>

          <View style={pillStyle}>
            <Text style={[styles.pillText, pillTextStyle]}>{pillLabel}</Text>
          </View>

          <Text style={styles.cardReason} numberOfLines={2}>
            {item.recallReason}
          </Text>

          <Text style={styles.cardMeta} numberOfLines={1}>
            {item.category} {"·"} {item.listingRef} {"·"} {formatPrice(item.priceCents)}
          </Text>

          <Text style={styles.cardFooter} numberOfLines={1}>
            {item.recallId} {"·"} {item.matchedLabel}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerBlock}>
        <Text accessibilityRole="header" style={styles.headerTitle}>
          Safety Recall Matches
        </Text>
        <Text style={styles.headerSubtitle}>
          Your listings are checked against public product-safety recall notices.
          Review each match and decide whether it comes down or goes to review.
        </Text>
        <Text style={styles.headerStat}>
          {pendingCount} of {matches.length} flagged listing{matches.length === 1 ? "" : "s"} still need action
        </Text>
        {pendingCount > 0 ? (
          <Text style={styles.headerStatSub}>
            {confirmedPendingCount} confirmed {"·"} {possiblePendingCount} possible, pending review
          </Text>
        ) : null}

        {pendingCount > 0 ? (
          <View style={styles.quickSelectRow}>
            {selectedCount < pendingCount ? (
              <Pressable
                onPress={selectAllPending}
                accessibilityRole="button"
                accessibilityLabel={`Select all ${pendingCount} pending ${pendingCount === 1 ? "listing" : "listings"}`}
                hitSlop={{ top: 15, bottom: 15, left: 8, right: 15 }}
              >
                <Text style={styles.quickSelectLink}>Select all pending</Text>
              </Pressable>
            ) : null}
            {selectedCount > 0 ? (
              <Pressable
                onPress={clearSelection}
                accessibilityRole="button"
                accessibilityLabel="Clear selection"
                hitSlop={{ top: 15, bottom: 15, left: 15, right: 8 }}
              >
                <Text style={styles.quickSelectLink}>Clear selection</Text>
              </Pressable>
            ) : null}
          </View>
        ) : null}
      </View>

      <FlatList
        data={matches}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listBody}
        ListEmptyComponent={
          <Text style={styles.emptyNote}>No recall matches on file right now.</Text>
        }
      />

      {selectedCount > 0 ? (
        <View style={styles.contextBar}>
          <View accessibilityLiveRegion="polite" style={styles.liveRegionBox}>
            <Text
              accessibilityRole={liveMessage ? "alert" : undefined}
              style={styles.liveRegionText}
            >
              {liveMessage}
            </Text>
          </View>

          {removeStep === "confirming" ? (
            <View style={styles.decisionActions}>
              <Pressable
                onPress={cancelRemove}
                accessibilityRole="button"
                accessibilityLabel="Cancel, keep reviewing the selection"
                style={({ pressed }) => [
                  styles.decisionBtn,
                  styles.decisionBtnCancel,
                  pressed && styles.decisionBtnCancelPressed,
                ]}
              >
                <Text style={styles.decisionBtnLabel}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={confirmRemove}
                accessibilityRole="button"
                accessibilityLabel={`Confirm removing ${selectedCount} ${listingWord} from the marketplace`}
                accessibilityHint="Removes the selected listings from the marketplace immediately"
                style={({ pressed }) => [
                  styles.decisionBtn,
                  styles.decisionBtnConfirm,
                  pressed && styles.decisionBtnConfirmPressed,
                ]}
              >
                <Text style={styles.decisionBtnLabelOnConfirm}>Yes, Remove</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.barActions}>
              <View style={styles.barButtonRow}>
                <Pressable
                  onPress={requestRemove}
                  accessibilityRole="button"
                  accessibilityLabel={`Remove ${selectedCount} selected ${listingWord} from the marketplace`}
                  accessibilityHint="Opens a confirmation step before removing the selected listings from the marketplace"
                  style={({ pressed }) => [
                    styles.barBtn,
                    styles.barBtnRemove,
                    pressed && styles.barBtnRemovePressed,
                  ]}
                >
                  <Text style={[styles.barBtnLabel, styles.barBtnLabelOnFill]} numberOfLines={1}>
                    Remove from Marketplace
                  </Text>
                  <View style={styles.countPillOnFill}>
                    <Text style={styles.countPillTextOnFill}>{selectedCount}</Text>
                  </View>
                </Pressable>

                <Pressable
                  onPress={disputeSelected}
                  disabled={!canDisputeSome}
                  accessibilityRole="button"
                  accessibilityState={{ disabled: !canDisputeSome }}
                  accessibilityLabel={
                    allSelectedDisputable
                      ? `Dispute ${selectedCount} selected ${listingWord}`
                      : canDisputeSome
                        ? `Dispute ${disputeEligibleSelected.length} possible ${disputeEligibleSelected.length === 1 ? "match" : "matches"}, skipping ${disputeIneligibleCount} confirmed`
                        : "Dispute match, disabled because none of the selected listings are eligible"
                  }
                  accessibilityHint={
                    canDisputeSome
                      ? "Flags the eligible possible matches for manual review; they stay visible to buyers while under review"
                      : undefined
                  }
                  style={({ pressed }) => [
                    styles.barBtn,
                    styles.barBtnDispute,
                    !canDisputeSome && styles.barBtnDisabled,
                    pressed && canDisputeSome && styles.barBtnDisputePressed,
                  ]}
                >
                  <Text
                    style={[
                      styles.barBtnLabel,
                      styles.barBtnLabelOnOutline,
                      !canDisputeSome && styles.barBtnLabelDisabled,
                    ]}
                    numberOfLines={1}
                  >
                    Dispute Match
                  </Text>
                  <View
                    style={[styles.countPillOnOutline, !canDisputeSome && styles.countPillDisabled]}
                  >
                    <Text
                      style={[
                        styles.countPillTextOnOutline,
                        !canDisputeSome && styles.countPillTextDisabled,
                      ]}
                    >
                      {disputeEligibleSelected.length}
                    </Text>
                  </View>
                </Pressable>
              </View>

              {canDisputeSome && !allSelectedDisputable ? (
                <Text style={styles.inlineReason}>
                  {disputeIneligibleCount} confirmed{" "}
                  {disputeIneligibleCount === 1 ? "match" : "matches"} in this selection can only
                  be removed, not disputed.
                </Text>
              ) : null}
              {!canDisputeSome ? (
                <Text style={styles.inlineReason}>
                  Confirmed matches can't be disputed — remove them instead.
                </Text>
              ) : null}
            </View>
          )}
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  headerBlock: {
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(4),
    paddingBottom: tokens.space(3),
    borderBottomWidth: 1,
    borderBottomColor: tokens.color.border,
    gap: tokens.space(1),
  },
  headerTitle: {
    fontSize: 21,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  headerSubtitle: {
    fontSize: 13,
    color: tokens.color.muted,
    lineHeight: 18,
    marginTop: tokens.space(1),
  },
  headerStat: {
    fontSize: 13,
    fontWeight: "600",
    color: tokens.color.ink2,
    marginTop: tokens.space(2),
  },
  headerStatSub: {
    fontSize: 12,
    color: tokens.color.faint,
  },
  quickSelectRow: {
    flexDirection: "row",
    gap: tokens.space(5),
    marginTop: tokens.space(2),
  },
  quickSelectLink: {
    fontSize: 13,
    fontWeight: "600",
    color: tokens.color.accent,
  },
  listBody: {
    paddingHorizontal: tokens.space(5),
    paddingVertical: tokens.space(4),
    gap: tokens.space(3),
  },
  emptyNote: {
    fontSize: 13,
    color: tokens.color.faint,
    textAlign: "center",
    paddingVertical: tokens.space(8),
  },
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: tokens.space(3),
    paddingVertical: tokens.space(3),
    paddingHorizontal: tokens.space(3),
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    minHeight: 44,
  },
  toggleCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
    marginTop: tokens.space(1) - 2,
  },
  toggleCircleOn: {
    borderColor: tokens.color.accent,
    backgroundColor: tokens.color.accent,
  },
  toggleCircleDisabled: {
    borderColor: tokens.color.border,
    backgroundColor: tokens.color.border,
  },
  toggleCirclePressed: {
    opacity: 0.7,
  },
  tickGlyph: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.onAccent,
  },
  thumbBox: {
    width: 48,
    height: 48,
    borderRadius: tokens.radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  thumbGlyph: {
    fontSize: 18,
    fontWeight: "700",
    color: tokens.color.ink2,
  },
  cardMain: {
    flex: 1,
    gap: tokens.space(1),
  },
  cardHeadRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: tokens.color.ink,
  },
  pill: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderRadius: tokens.radius.sm,
    paddingHorizontal: tokens.space(2),
    paddingVertical: 2,
    marginTop: 2,
  },
  pillConfirmed: {
    backgroundColor: tokens.color.dangerBg,
    borderColor: tokens.color.dangerBorder,
  },
  pillPossible: {
    backgroundColor: tokens.color.warningBg,
    borderColor: tokens.color.warningBorder,
  },
  pillDisputed: {
    backgroundColor: tokens.color.successBg,
    borderColor: tokens.color.successBorder,
  },
  pillRemoved: {
    backgroundColor: tokens.color.bg,
    borderColor: tokens.color.border,
  },
  pillText: {
    fontSize: 11,
    fontWeight: "700",
  },
  pillTextConfirmed: {
    color: tokens.color.danger,
  },
  pillTextPossible: {
    color: tokens.color.warning,
  },
  pillTextDisputed: {
    color: tokens.color.success,
  },
  pillTextRemoved: {
    color: tokens.color.faint,
  },
  cardReason: {
    fontSize: 13,
    color: tokens.color.ink2,
    lineHeight: 17,
    marginTop: tokens.space(1),
  },
  cardMeta: {
    fontSize: 12,
    color: tokens.color.muted,
    marginTop: tokens.space(1),
  },
  cardFooter: {
    fontSize: 11,
    color: tokens.color.faint,
    fontVariant: ["tabular-nums"],
  },
  contextBar: {
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(3),
    paddingBottom: tokens.space(5),
    gap: tokens.space(3),
  },
  liveRegionBox: {
    minHeight: 18,
  },
  liveRegionText: {
    fontSize: 13,
    fontWeight: "700",
    color: tokens.color.ink,
    lineHeight: 18,
  },
  barActions: {
    gap: tokens.space(2),
  },
  barButtonRow: {
    flexDirection: "row",
    gap: tokens.space(3),
  },
  barBtn: {
    flex: 1,
    minHeight: 46,
    borderRadius: tokens.radius.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: tokens.space(2),
    paddingHorizontal: tokens.space(3),
  },
  barBtnRemove: {
    backgroundColor: tokens.color.danger,
  },
  barBtnRemovePressed: {
    opacity: 0.85,
  },
  barBtnDisabled: {
    backgroundColor: tokens.color.bg,
    borderWidth: 1,
    borderColor: tokens.color.border,
  },
  barBtnDispute: {
    backgroundColor: tokens.color.bg,
    borderWidth: 1,
    borderColor: tokens.color.accent,
  },
  barBtnDisputePressed: {
    backgroundColor: tokens.color.accentBg,
  },
  barBtnLabel: {
    fontSize: 14,
    fontWeight: "700",
    flexShrink: 1,
  },
  barBtnLabelOnFill: {
    color: tokens.color.onAccent,
  },
  barBtnLabelDisabled: {
    color: tokens.color.faint,
  },
  barBtnLabelOnOutline: {
    color: tokens.color.accent,
  },
  countPillOnFill: {
    minWidth: 20,
    height: 20,
    paddingHorizontal: tokens.space(1),
    borderRadius: 10,
    backgroundColor: tokens.color.scrimLight,
    alignItems: "center",
    justifyContent: "center",
  },
  countPillTextOnFill: {
    fontSize: 12,
    fontWeight: "700",
    color: tokens.color.ink,
    fontVariant: ["tabular-nums"],
  },
  countPillOnOutline: {
    minWidth: 20,
    height: 20,
    paddingHorizontal: tokens.space(1),
    borderRadius: 10,
    backgroundColor: tokens.color.accentBg,
    alignItems: "center",
    justifyContent: "center",
  },
  countPillTextOnOutline: {
    fontSize: 12,
    fontWeight: "700",
    color: tokens.color.accent,
    fontVariant: ["tabular-nums"],
  },
  countPillDisabled: {
    backgroundColor: tokens.color.border,
  },
  countPillTextDisabled: {
    color: tokens.color.faint,
  },
  inlineReason: {
    fontSize: 12,
    color: tokens.color.muted,
    lineHeight: 16,
  },
  decisionActions: {
    flexDirection: "row",
    gap: tokens.space(3),
  },
  decisionBtn: {
    flex: 1,
    minHeight: 46,
    borderRadius: tokens.radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  decisionBtnCancel: {
    backgroundColor: tokens.color.bg,
    borderWidth: 1,
    borderColor: tokens.color.border,
  },
  decisionBtnCancelPressed: {
    backgroundColor: tokens.color.accentBg,
  },
  decisionBtnConfirm: {
    backgroundColor: tokens.color.danger,
  },
  decisionBtnConfirmPressed: {
    opacity: 0.85,
  },
  decisionBtnLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: tokens.color.ink,
  },
  decisionBtnLabelOnConfirm: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.onAccent,
  },
});

export { SafetyRecallMatchesScreen };
