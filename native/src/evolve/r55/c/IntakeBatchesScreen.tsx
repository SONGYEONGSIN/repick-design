import { useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
} from "react-native";
import { tokens } from "../../../tokens";
import { intakeBatches, type BatchStageKey, type IntakeBatch } from "./data";

const STAGE_LABEL: Record<BatchStageKey, string> = {
  received: "Received",
  inspected: "Inspected",
  graded: "Graded",
  listed: "Listed",
  paid: "Paid Out",
};

function stageBadgeStyle(stage: BatchStageKey) {
  switch (stage) {
    case "received":
      return styles.badgeNeutral;
    case "inspected":
      return styles.badgeWarning;
    case "graded":
      return styles.badgeAccent;
    case "listed":
    case "paid":
      return styles.badgeSuccess;
    default:
      return styles.badgeNeutral;
  }
}

function stageBadgeTextStyle(stage: BatchStageKey) {
  switch (stage) {
    case "received":
      return styles.badgeTextNeutral;
    case "inspected":
      return styles.badgeTextWarning;
    case "graded":
      return styles.badgeTextAccent;
    case "listed":
    case "paid":
      return styles.badgeTextSuccess;
    default:
      return styles.badgeTextNeutral;
  }
}

function itemStatusGlyph(status: string): string {
  if (status.startsWith("Rejected")) return "!";
  if (status.startsWith("Sold") || status.startsWith("Approved")) return "✓";
  return "•";
}

function itemStatusTextStyle(status: string) {
  if (status.startsWith("Rejected")) return styles.itemStatusDanger;
  if (status.startsWith("Sold") || status.startsWith("Approved")) return styles.itemStatusSuccess;
  return styles.itemStatusMuted;
}

const DISPUTE_ELIGIBLE: BatchStageKey[] = ["graded", "listed", "paid"];

export default function IntakeBatchesScreen() {
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [disputedBatches, setDisputedBatches] = useState<Record<string, boolean>>({});
  const [disputeConfirmFor, setDisputeConfirmFor] = useState<string | null>(null);
  const [supportRequested, setSupportRequested] = useState<Record<string, boolean>>({});

  const focusedBatch = useMemo<IntakeBatch | null>(
    () => intakeBatches.find((b) => b.id === focusedId) ?? null,
    [focusedId]
  );

  const handleOpenBatch = useCallback((id: string) => {
    setFocusedId(id);
    setDisputeConfirmFor(null);
  }, []);

  const handleBack = useCallback(() => {
    setFocusedId(null);
    setDisputeConfirmFor(null);
  }, []);

  const handleRequestSupport = useCallback((batchId: string) => {
    setSupportRequested((prev) => ({ ...prev, [batchId]: true }));
  }, []);

  const handleStartDispute = useCallback((batchId: string) => {
    setDisputeConfirmFor(batchId);
  }, []);

  const handleCancelDispute = useCallback(() => {
    setDisputeConfirmFor(null);
  }, []);

  const handleConfirmDispute = useCallback((batchId: string) => {
    setDisputedBatches((prev) => ({ ...prev, [batchId]: true }));
    setDisputeConfirmFor(null);
  }, []);

  const renderBatchRow = useCallback(
    ({ item }: { item: IntakeBatch }) => {
      const stageLabel = STAGE_LABEL[item.currentStage];
      return (
        <Pressable
          onPress={() => handleOpenBatch(item.id)}
          style={styles.row}
          accessibilityRole="button"
          accessibilityLabel={`Batch ${item.id}, ${item.items.length} items, status ${stageLabel}. Opens batch detail.`}
          hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
        >
          <View style={styles.rowTopLine}>
            <Text style={styles.rowId}>{item.id}</Text>
            <Text style={styles.rowChevron}>{"›"}</Text>
          </View>
          <Text style={styles.rowLocation}>{item.location}</Text>
          <View style={styles.rowMetaLine}>
            <Text style={styles.rowDate}>{item.submittedDate}</Text>
            <Text style={styles.rowDot}>{"·"}</Text>
            <Text style={[styles.rowCount, styles.tabularNums]}>{item.items.length} items</Text>
            <View style={[styles.badge, stageBadgeStyle(item.currentStage)]}>
              <Text style={[styles.badgeText, stageBadgeTextStyle(item.currentStage)]}>
                {stageLabel}
              </Text>
            </View>
          </View>
        </Pressable>
      );
    },
    [handleOpenBatch]
  );

  const headingText = focusedBatch ? `Batch ${focusedBatch.id}` : "Intake Batches";
  const isDisputeEligible = focusedBatch
    ? DISPUTE_ELIGIBLE.indexOf(focusedBatch.currentStage) !== -1
    : false;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View accessibilityLiveRegion="polite" style={styles.liveRegionContainer}>
        <Text
          accessibilityRole="alert"
          style={focusedBatch ? styles.detailTitle : styles.listTitle}
        >
          {headingText}
        </Text>
      </View>

      {focusedBatch ? (
        <View style={styles.detailContainer}>
          <Pressable
            onPress={handleBack}
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel="Back to batch list"
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          >
            <Text style={styles.backButtonText}>{"‹"} Back to Batches</Text>
          </Pressable>

          <ScrollView
            style={styles.detailScroll}
            contentContainerStyle={styles.detailScrollContent}
          >
            <View style={styles.card}>
              <Text style={styles.cardLabel}>Drop-off Location</Text>
              <Text style={styles.cardValue}>{focusedBatch.location}</Text>
              <View style={styles.summaryRow}>
                <View style={styles.summaryCell}>
                  <Text style={styles.summaryCellLabel}>Submitted</Text>
                  <Text style={styles.summaryCellValue}>{focusedBatch.submittedDate}</Text>
                </View>
                <View style={styles.summaryCell}>
                  <Text style={styles.summaryCellLabel}>Items</Text>
                  <Text style={[styles.summaryCellValue, styles.tabularNums]}>
                    {focusedBatch.items.length}
                  </Text>
                </View>
                <View style={styles.summaryCell}>
                  <Text style={styles.summaryCellLabel}>Current Stage</Text>
                  <Text style={styles.summaryCellValue}>
                    {STAGE_LABEL[focusedBatch.currentStage]}
                  </Text>
                </View>
              </View>
            </View>

            <Text accessibilityRole="header" style={styles.sectionHeading}>
              Processing Timeline
            </Text>
            <View style={styles.card}>
              {focusedBatch.stages.map((stage) => (
                <View key={stage.key} style={styles.timelineRow}>
                  <Text
                    style={stage.done ? styles.timelineGlyphDone : styles.timelineGlyphPending}
                  >
                    {stage.done ? "●" : "○"}
                  </Text>
                  <View style={styles.timelinePair}>
                    <Text style={styles.timelineTerm}>{stage.label}</Text>
                    <Text
                      style={stage.done ? styles.timelineValueDone : styles.timelineValuePending}
                    >
                      {stage.date ?? "Pending"}
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            <Text accessibilityRole="header" style={styles.sectionHeading}>
              Items in This Batch
            </Text>
            <View style={styles.card}>
              {focusedBatch.items.map((batchItem, index) => (
                <View
                  key={batchItem.id}
                  style={[
                    styles.itemRow,
                    index === focusedBatch.items.length - 1 && styles.itemRowLast,
                  ]}
                >
                  <Text style={[styles.itemGlyph, itemStatusTextStyle(batchItem.status)]}>
                    {itemStatusGlyph(batchItem.status)}
                  </Text>
                  <View style={styles.itemPair}>
                    <Text style={styles.itemTerm}>{batchItem.title}</Text>
                    <Text style={styles.itemSubterm}>
                      {batchItem.category} {"·"} {batchItem.conditionGrade}
                    </Text>
                    <Text style={itemStatusTextStyle(batchItem.status)}>{batchItem.status}</Text>
                  </View>
                </View>
              ))}
            </View>

            {isDisputeEligible && (
              <View style={styles.card}>
                <Text accessibilityRole="header" style={styles.sectionHeading}>
                  Dispute This Grading
                </Text>
                {disputedBatches[focusedBatch.id] ? (
                  <Text style={styles.disputeConfirmedText}>
                    A re-inspection request has been filed for {focusedBatch.id}. Our team will
                    review within 2 business days.
                  </Text>
                ) : disputeConfirmFor === focusedBatch.id ? (
                  <View>
                    <Text style={styles.confirmPrompt}>
                      Request re-inspection of this batch&apos;s grading? This flags every item in
                      the batch for manual review.
                    </Text>
                    <View style={styles.confirmButtonRow}>
                      <Pressable
                        onPress={handleCancelDispute}
                        style={styles.cancelButton}
                        accessibilityRole="button"
                        accessibilityLabel="Cancel dispute request"
                      >
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                      </Pressable>
                      <Pressable
                        onPress={() => handleConfirmDispute(focusedBatch.id)}
                        style={styles.confirmButton}
                        accessibilityRole="button"
                        accessibilityLabel="Confirm dispute request"
                      >
                        <Text style={styles.confirmButtonText}>Confirm</Text>
                      </Pressable>
                    </View>
                  </View>
                ) : (
                  <Pressable
                    onPress={() => handleStartDispute(focusedBatch.id)}
                    style={styles.disputeButton}
                    accessibilityRole="button"
                    accessibilityLabel={`Dispute grading result for batch ${focusedBatch.id}`}
                  >
                    <Text style={styles.disputeButtonText}>Dispute Grading Result</Text>
                  </Pressable>
                )}
              </View>
            )}
          </ScrollView>

          <View style={styles.bottomBand}>
            <Pressable
              onPress={() => handleRequestSupport(focusedBatch.id)}
              style={styles.bottomBandButton}
              accessibilityRole="button"
              accessibilityLabel={
                supportRequested[focusedBatch.id]
                  ? `Support request already sent for batch ${focusedBatch.id}`
                  : `Contact intake support about batch ${focusedBatch.id}`
              }
              accessibilityHint="Logs a support request for this batch with the intake team"
            >
              <Text style={styles.bottomBandButtonText}>
                {supportRequested[focusedBatch.id]
                  ? "Support Request Sent"
                  : "Contact Intake Support"}
              </Text>
            </Pressable>
            {supportRequested[focusedBatch.id] ? (
              <Text style={styles.bottomBandConfirmText}>
                We will follow up on {focusedBatch.id} within one business day.
              </Text>
            ) : null}
          </View>
        </View>
      ) : (
        <View style={styles.listContainer}>
          <Text style={styles.listSubtitle}>
            Track every item batch from drop-off through payout.
          </Text>
          <FlatList
            data={intakeBatches}
            keyExtractor={(item) => item.id}
            renderItem={renderBatchRow}
            contentContainerStyle={styles.listContent}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  liveRegionContainer: {
    paddingHorizontal: tokens.space(4),
    paddingTop: tokens.space(4),
  },
  listTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  detailTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  listContainer: {
    flex: 1,
  },
  listSubtitle: {
    fontSize: 14,
    color: tokens.color.muted,
    paddingHorizontal: tokens.space(4),
    paddingTop: tokens.space(1),
    paddingBottom: tokens.space(2),
  },
  listContent: {
    paddingHorizontal: tokens.space(4),
    paddingBottom: tokens.space(6),
  },
  row: {
    minHeight: 44,
    paddingVertical: tokens.space(3),
    paddingHorizontal: tokens.space(3),
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.border,
    marginBottom: tokens.space(3),
    backgroundColor: tokens.color.bg,
  },
  rowTopLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rowId: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  rowChevron: {
    fontSize: 18,
    color: tokens.color.accent,
  },
  rowLocation: {
    fontSize: 13,
    color: tokens.color.muted,
    marginTop: tokens.space(1),
  },
  rowMetaLine: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: tokens.space(2),
    flexWrap: "wrap",
  },
  rowDate: {
    fontSize: 12,
    color: tokens.color.faint,
  },
  rowDot: {
    fontSize: 12,
    color: tokens.color.faint,
    marginHorizontal: tokens.space(1),
  },
  rowCount: {
    fontSize: 12,
    color: tokens.color.faint,
    marginRight: tokens.space(2),
  },
  tabularNums: {
    fontVariant: ["tabular-nums"],
  },
  badge: {
    paddingHorizontal: tokens.space(2),
    paddingVertical: tokens.space(1) / 2,
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "600",
  },
  badgeNeutral: {
    backgroundColor: tokens.color.bg,
    borderColor: tokens.color.border,
  },
  badgeTextNeutral: {
    color: tokens.color.muted,
  },
  badgeWarning: {
    backgroundColor: tokens.color.warningBg,
    borderColor: tokens.color.warningBorder,
  },
  badgeTextWarning: {
    color: tokens.color.warning,
  },
  badgeAccent: {
    backgroundColor: tokens.color.accentBg,
    borderColor: tokens.color.accent,
  },
  badgeTextAccent: {
    color: tokens.color.accent,
  },
  badgeSuccess: {
    backgroundColor: tokens.color.successBg,
    borderColor: tokens.color.successBorder,
  },
  badgeTextSuccess: {
    color: tokens.color.success,
  },
  detailContainer: {
    flex: 1,
  },
  backButton: {
    minHeight: 44,
    paddingHorizontal: tokens.space(4),
    paddingVertical: tokens.space(2),
    alignSelf: "flex-start",
    justifyContent: "center",
  },
  backButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: tokens.color.accent,
  },
  detailScroll: {
    flex: 1,
  },
  detailScrollContent: {
    paddingHorizontal: tokens.space(4),
    paddingBottom: tokens.space(8),
  },
  card: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(4),
    marginBottom: tokens.space(4),
    backgroundColor: tokens.color.bg,
  },
  cardLabel: {
    fontSize: 12,
    color: tokens.color.faint,
    marginBottom: tokens.space(1),
  },
  cardValue: {
    fontSize: 16,
    fontWeight: "600",
    color: tokens.color.ink,
  },
  summaryRow: {
    flexDirection: "row",
    marginTop: tokens.space(4),
  },
  summaryCell: {
    flex: 1,
  },
  summaryCellLabel: {
    fontSize: 11,
    color: tokens.color.faint,
    marginBottom: tokens.space(1) / 2,
  },
  summaryCellValue: {
    fontSize: 15,
    fontWeight: "600",
    color: tokens.color.ink2,
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.ink,
    marginBottom: tokens.space(2),
    marginTop: tokens.space(1),
  },
  timelineRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: tokens.space(3),
  },
  timelineGlyphDone: {
    fontSize: 14,
    color: tokens.color.accent,
    width: tokens.space(5),
  },
  timelineGlyphPending: {
    fontSize: 14,
    color: tokens.color.border,
    width: tokens.space(5),
  },
  timelinePair: {
    flex: 1,
  },
  timelineTerm: {
    fontSize: 14,
    fontWeight: "600",
    color: tokens.color.ink2,
  },
  timelineValueDone: {
    fontSize: 13,
    color: tokens.color.muted,
    marginTop: tokens.space(1) / 2,
  },
  timelineValuePending: {
    fontSize: 13,
    color: tokens.color.faint,
    marginTop: tokens.space(1) / 2,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingBottom: tokens.space(3),
    marginBottom: tokens.space(3),
    borderBottomWidth: 1,
    borderBottomColor: tokens.color.border,
  },
  itemRowLast: {
    borderBottomWidth: 0,
    marginBottom: 0,
    paddingBottom: 0,
  },
  itemGlyph: {
    fontSize: 15,
    fontWeight: "700",
    width: tokens.space(5),
  },
  itemPair: {
    flex: 1,
  },
  itemTerm: {
    fontSize: 14,
    fontWeight: "600",
    color: tokens.color.ink2,
  },
  itemSubterm: {
    fontSize: 12,
    color: tokens.color.faint,
    marginTop: tokens.space(1) / 2,
    marginBottom: tokens.space(1) / 2,
  },
  itemStatusSuccess: {
    fontSize: 12,
    color: tokens.color.success,
    fontWeight: "600",
  },
  itemStatusDanger: {
    fontSize: 12,
    color: tokens.color.danger,
    fontWeight: "600",
  },
  itemStatusMuted: {
    fontSize: 12,
    color: tokens.color.muted,
    fontWeight: "600",
  },
  disputeButton: {
    minHeight: 44,
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.danger,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: tokens.space(3),
  },
  disputeButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: tokens.color.danger,
  },
  confirmPrompt: {
    fontSize: 13,
    color: tokens.color.muted,
    marginBottom: tokens.space(3),
  },
  confirmButtonRow: {
    flexDirection: "row",
  },
  cancelButton: {
    flex: 1,
    minHeight: 44,
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
    marginRight: tokens.space(2),
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: tokens.color.ink2,
  },
  confirmButton: {
    flex: 1,
    minHeight: 44,
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.danger,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: tokens.color.onInk,
  },
  disputeConfirmedText: {
    fontSize: 13,
    color: tokens.color.muted,
  },
  bottomBand: {
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    paddingHorizontal: tokens.space(4),
    paddingTop: tokens.space(3),
    paddingBottom: tokens.space(4),
    backgroundColor: tokens.color.bg,
  },
  bottomBandButton: {
    minHeight: 44,
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.color.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  bottomBandButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.onAccent,
  },
  bottomBandConfirmText: {
    fontSize: 12,
    color: tokens.color.muted,
    marginTop: tokens.space(2),
    textAlign: "center",
  },
});
