// native/src/evolve/r61/c/DisputeResolutionOutcomeScreen.tsx
//
// Dispute Resolution Outcome — a read-only record of a buyer/seller dispute
// that has already concluded. There is no blocked step to unblock here: the
// case is closed, the decision is final, and the screen's job is to show
// what happened and let the reader pull the paper trail.
//
// Bottom-band form: per GENERATION.md §3, a finished-result record screen
// does not get the blocked/ready/done state-machine band (there is no "why
// can't I proceed" sentence to say, because nothing here is pending). It
// gets a persistent, always-available action bar with exactly one real
// action: "Download Decision PDF". Pressing it is not a no-op — it flips
// local state to a confirmed "Downloaded" bar that does not silently reset,
// and the confirmation sentence is announced through a single live region.
// Everything above the bar is strictly non-interactive (no tabs, no
// expand/collapse, no row-level actions) so the one action bar stays the
// only control on the whole screen.

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
import { disputeOutcome } from "./data";
import type { TimelineStep } from "./data";

type ReceiptState = "available" | "retrieved";

export function DisputeResolutionOutcomeScreen() {
  const [receiptState, setReceiptState] = useState<ReceiptState>("available");

  function handleDownloadPress() {
    // Guard so a second tap on the now-confirmed state is a true no-op with
    // nothing left to promise — the transition only ever runs once.
    if (receiptState === "available") {
      setReceiptState("retrieved");
    }
  }

  const barSentence =
    receiptState === "retrieved"
      ? "Decision PDF saved to this device."
      : "A PDF copy of this decision is available any time.";

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={disputeOutcome.timeline}
        keyExtractor={(step) => step.id}
        ListHeaderComponent={<CaseSummary />}
        contentContainerStyle={styles.listContent}
        renderItem={({ item, index }) => (
          <TimelineRow step={item} isLast={index === disputeOutcome.timeline.length - 1} />
        )}
      />

      <View style={styles.actionBar} accessibilityLiveRegion="polite">
        <Text
          style={styles.actionBarSentence}
          accessibilityRole="alert"
        >
          {barSentence}
        </Text>
        {receiptState === "available" ? (
          <Pressable
            onPress={handleDownloadPress}
            accessibilityRole="button"
            accessibilityLabel="Download decision PDF"
            accessibilityHint="Saves a PDF copy of this case decision to your device."
            style={({ pressed }) => [
              styles.actionButton,
              pressed && styles.actionButtonPressed,
            ]}
          >
            <Text style={styles.actionButtonLabel}>Download Decision PDF</Text>
          </Pressable>
        ) : (
          <View
            style={styles.actionButtonDone}
            accessibilityRole="text"
            accessibilityLabel="Decision PDF downloaded"
          >
            <Text style={styles.actionButtonDoneLabel}>Downloaded</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

function CaseSummary() {
  return (
    <View style={styles.headerBlock}>
      <Text style={styles.caseId}>{disputeOutcome.caseId}</Text>
      <Text accessibilityRole="header" style={styles.title}>
        Dispute Resolution Outcome
      </Text>

      <View style={styles.statusChip}>
        <Text style={styles.statusChipText}>{disputeOutcome.statusLabel}</Text>
      </View>

      <Text style={styles.decisionSummary}>{disputeOutcome.decisionSummary}</Text>

      <View style={styles.factCard}>
        <FactRow label="Item" value={disputeOutcome.itemTitle} />
        <FactRow label="Order" value={disputeOutcome.orderId} />
        <FactRow label="Disputed amount" value={disputeOutcome.disputeAmount} />
        <FactRow label="Refund issued" value={disputeOutcome.refundAmount} emphasize />
        <FactRow label="Filed" value={disputeOutcome.filedDate} />
        <FactRow label="Resolved" value={disputeOutcome.resolvedDate} last />
      </View>

      <Text accessibilityRole="header" style={styles.sectionHeading}>
        Decision Rationale
      </Text>
      <Text style={styles.rationale}>{disputeOutcome.rationale}</Text>

      <Text accessibilityRole="header" style={styles.sectionHeading}>
        Case Timeline
      </Text>
    </View>
  );
}

function FactRow({
  label,
  value,
  emphasize,
  last,
}: {
  label: string;
  value: string;
  emphasize?: boolean;
  last?: boolean;
}) {
  return (
    <View style={[styles.factRow, last && styles.factRowLast]}>
      <Text style={styles.factLabel}>{label}</Text>
      <Text
        style={[styles.factValue, emphasize && styles.factValueEmphasis]}
        // tabular-nums keeps the dollar figures aligned on the colon —
        // unrelated to the ₩ glyph caveat, this is plain USD.
        allowFontScaling
      >
        {value}
      </Text>
    </View>
  );
}

function TimelineRow({ step, isLast }: { step: TimelineStep; isLast: boolean }) {
  return (
    <View style={styles.timelineRow}>
      <View style={styles.timelineMarkerColumn}>
        <View style={styles.timelineDot} />
        {!isLast ? <View style={styles.timelineConnector} /> : null}
      </View>
      <View style={styles.timelineTextColumn}>
        <View style={styles.timelineHeadRow}>
          <Text style={styles.timelineLabel}>{step.label}</Text>
          <Text style={styles.timelineDate}>{step.date}</Text>
        </View>
        <Text style={styles.timelineDetail}>{step.detail}</Text>
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
    paddingBottom: tokens.space(8),
  },
  headerBlock: {
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(5),
  },
  caseId: {
    fontSize: 12,
    fontWeight: "600",
    color: tokens.color.faint,
    letterSpacing: 0.4,
    textTransform: "uppercase",
    fontVariant: ["tabular-nums"],
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: tokens.color.ink,
    marginTop: tokens.space(1),
    marginBottom: tokens.space(3),
  },
  statusChip: {
    alignSelf: "flex-start",
    backgroundColor: tokens.color.successBg,
    borderColor: tokens.color.successBorder,
    borderWidth: 1,
    borderRadius: tokens.radius.sm,
    paddingHorizontal: tokens.space(3),
    paddingVertical: tokens.space(1),
    marginBottom: tokens.space(3),
  },
  statusChipText: {
    fontSize: 13,
    fontWeight: "700",
    color: tokens.color.success,
  },
  decisionSummary: {
    fontSize: 17,
    fontWeight: "600",
    color: tokens.color.ink,
    lineHeight: 23,
    marginBottom: tokens.space(4),
  },
  factCard: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    paddingHorizontal: tokens.space(4),
    paddingVertical: tokens.space(1),
    marginBottom: tokens.space(5),
  },
  factRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: tokens.space(3),
    borderBottomWidth: 1,
    borderBottomColor: tokens.color.border,
  },
  factRowLast: {
    borderBottomWidth: 0,
  },
  factLabel: {
    fontSize: 14,
    color: tokens.color.muted,
  },
  factValue: {
    fontSize: 14,
    fontWeight: "600",
    color: tokens.color.ink,
    fontVariant: ["tabular-nums"],
  },
  factValueEmphasis: {
    color: tokens.color.success,
    fontWeight: "700",
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.ink,
    marginBottom: tokens.space(2),
  },
  rationale: {
    fontSize: 14,
    color: tokens.color.ink2,
    lineHeight: 21,
    marginBottom: tokens.space(5),
  },
  timelineRow: {
    flexDirection: "row",
    paddingHorizontal: tokens.space(5),
  },
  timelineMarkerColumn: {
    width: tokens.space(5),
    alignItems: "center",
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: tokens.color.accent,
    marginTop: 4,
  },
  timelineConnector: {
    width: 2,
    flex: 1,
    backgroundColor: tokens.color.border,
    marginTop: tokens.space(1),
  },
  timelineTextColumn: {
    flex: 1,
    paddingBottom: tokens.space(5),
    paddingLeft: tokens.space(3),
  },
  timelineHeadRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  timelineLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  timelineDate: {
    fontSize: 12,
    color: tokens.color.faint,
    fontVariant: ["tabular-nums"],
  },
  timelineDetail: {
    fontSize: 13,
    color: tokens.color.muted,
    lineHeight: 18,
    marginTop: tokens.space(1),
  },
  actionBar: {
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(3),
    paddingBottom: tokens.space(5),
  },
  actionBarSentence: {
    fontSize: 13,
    color: tokens.color.muted,
    marginBottom: tokens.space(3),
  },
  actionButton: {
    backgroundColor: tokens.color.accent,
    borderRadius: tokens.radius.md,
    paddingVertical: tokens.space(4),
    alignItems: "center",
  },
  actionButtonPressed: {
    opacity: 0.85,
  },
  actionButtonLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: tokens.color.onAccent,
  },
  actionButtonDone: {
    backgroundColor: tokens.color.successBg,
    borderColor: tokens.color.successBorder,
    borderWidth: 1,
    borderRadius: tokens.radius.md,
    paddingVertical: tokens.space(4),
    alignItems: "center",
  },
  actionButtonDoneLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: tokens.color.success,
  },
});

export default DisputeResolutionOutcomeScreen;
