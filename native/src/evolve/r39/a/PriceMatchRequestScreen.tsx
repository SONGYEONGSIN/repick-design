// native/src/evolve/r39/a/PriceMatchRequestScreen.tsx
//
// Buyer-facing Price Match Request screen. One scrollable surface: a
// submission form up top (pick a reason, cite a cheaper identical listing
// as evidence, add an optional note) followed on the SAME screen by the
// buyer's past price-match requests and their status. A bottom-fixed action
// band gates submission behind a real, named state machine — it is blocked
// until a reason is chosen AND an evidence reference is non-empty, it says
// in a sentence why it's blocked, and pressing it while enabled moves the
// screen into a submitted/confirmation state rather than firing an alert.

import React, { useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { tokens } from "../../../tokens";
import {
  priceMatchReasonOptions,
  reasonLabelFor,
  pastPriceMatchRequests,
  SUBMISSION_TODAY_LABEL,
  NEXT_SUBMISSION_ID,
  type PriceMatchReasonKey,
  type PriceMatchRequestRecord,
  type PriceMatchRequestStatus,
} from "./data";

// Named states for the submission gate — not a single disabled/enabled
// boolean. Each state has exactly one on-screen sentence and controls
// whether the band's primary control can be pressed at all.
type SubmissionGateState =
  | "needsBothFields"
  | "needsReason"
  | "needsEvidence"
  | "readyToSubmit"
  | "requestConfirmed";

function computeGateState(
  reasonKey: PriceMatchReasonKey | null,
  evidenceText: string,
  hasConfirmed: boolean
): SubmissionGateState {
  if (hasConfirmed) return "requestConfirmed";
  const hasReason = reasonKey !== null;
  const hasEvidence = evidenceText.trim().length > 0;
  if (!hasReason && !hasEvidence) return "needsBothFields";
  if (!hasReason) return "needsReason";
  if (!hasEvidence) return "needsEvidence";
  return "readyToSubmit";
}

function gateStatusSentence(
  state: SubmissionGateState,
  confirmedRecord: PriceMatchRequestRecord | null
): string {
  switch (state) {
    case "needsBothFields":
      return "Select a reason and add a reference to the cheaper listing before you can submit.";
    case "needsReason":
      return "Select a reason for this price match before you can submit.";
    case "needsEvidence":
      return "Add a link or reference to the cheaper listing before you can submit.";
    case "readyToSubmit":
      return "Ready to submit — we'll compare this against the listing you cited.";
    case "requestConfirmed":
      return confirmedRecord
        ? `Request submitted on ${confirmedRecord.submittedOnLabel}. We'll review it and follow up with a decision.`
        : "Request submitted. We'll review it and follow up with a decision.";
  }
}

function statusBadgeStyle(status: PriceMatchRequestStatus) {
  if (status === "approved") return styles.statusBadgeApproved;
  if (status === "denied") return styles.statusBadgeDenied;
  return styles.statusBadgePending;
}

function statusBadgeTextStyle(status: PriceMatchRequestStatus) {
  if (status === "approved") return styles.statusBadgeTextApproved;
  if (status === "denied") return styles.statusBadgeTextDenied;
  return styles.statusBadgeTextPending;
}

function statusLabel(status: PriceMatchRequestStatus): string {
  if (status === "approved") return "Approved";
  if (status === "denied") return "Denied";
  return "Pending review";
}

interface RequestHistoryCardProps {
  record: PriceMatchRequestRecord;
}

function RequestHistoryCard({ record }: RequestHistoryCardProps) {
  return (
    <View style={styles.historyCard}>
      <View style={styles.historyCardTopRow}>
        <Text style={styles.historyReasonText}>{record.reasonLabel}</Text>
        <View style={statusBadgeStyle(record.status)}>
          <Text style={statusBadgeTextStyle(record.status)}>
            {statusLabel(record.status)}
          </Text>
        </View>
      </View>
      <Text style={styles.historyEvidenceText}>{record.evidenceSummary}</Text>
      {record.note ? (
        <Text style={styles.historyNoteText}>{record.note}</Text>
      ) : null}
      {record.status === "denied" && record.denialReason ? (
        <View style={styles.denialReasonBox}>
          <Text style={styles.denialReasonLabel}>Reason for denial</Text>
          <Text style={styles.denialReasonText}>{record.denialReason}</Text>
        </View>
      ) : null}
      <Text style={styles.historyDateText}>
        Submitted {record.submittedOnLabel}
      </Text>
    </View>
  );
}

export function PriceMatchRequestScreen() {
  const [selectedReason, setSelectedReason] =
    useState<PriceMatchReasonKey | null>(null);
  const [evidenceText, setEvidenceText] = useState("");
  const [noteText, setNoteText] = useState("");
  const [hasConfirmed, setHasConfirmed] = useState(false);
  const [confirmedRecord, setConfirmedRecord] =
    useState<PriceMatchRequestRecord | null>(null);
  const [historyRecords, setHistoryRecords] = useState<
    PriceMatchRequestRecord[]
  >(pastPriceMatchRequests);

  const gateState = useMemo(
    () => computeGateState(selectedReason, evidenceText, hasConfirmed),
    [selectedReason, evidenceText, hasConfirmed]
  );

  const statusSentence = useMemo(
    () => gateStatusSentence(gateState, confirmedRecord),
    [gateState, confirmedRecord]
  );

  const handleSelectReason = useCallback((key: PriceMatchReasonKey) => {
    setSelectedReason(key);
  }, []);

  const handleConfirmSubmit = useCallback(() => {
    if (gateState !== "readyToSubmit" || selectedReason === null) return;
    const newRecord: PriceMatchRequestRecord = {
      id: NEXT_SUBMISSION_ID,
      submittedOnLabel: SUBMISSION_TODAY_LABEL,
      reasonLabel: reasonLabelFor(selectedReason),
      evidenceSummary: evidenceText.trim(),
      note: noteText.trim().length > 0 ? noteText.trim() : undefined,
      status: "pending",
    };
    setConfirmedRecord(newRecord);
    setHasConfirmed(true);
    setHistoryRecords((prev) => [newRecord, ...prev]);
  }, [gateState, selectedReason, evidenceText, noteText]);

  const handleStartAnotherRequest = useCallback(() => {
    setSelectedReason(null);
    setEvidenceText("");
    setNoteText("");
    setHasConfirmed(false);
    setConfirmedRecord(null);
  }, []);

  const formSection = (
    <View style={styles.formSection}>
      <Text accessibilityRole="header" style={styles.screenHeading}>
        Price Match Request
      </Text>
      <Text style={styles.screenIntro}>
        Found the exact same item cheaper somewhere else? Cite it below and
        we'll review your request.
      </Text>

      <Text style={styles.fieldGroupLabel}>Reason (required)</Text>
      <View style={styles.reasonOptionList}>
        {priceMatchReasonOptions.map((option) => {
          const isSelected = option.key === selectedReason;
          return (
            <Pressable
              key={option.key}
              onPress={() => handleSelectReason(option.key)}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              accessibilityLabel={option.label}
              accessibilityHint="Selects this as your reason for the price match request."
              style={({ pressed }) => [
                styles.reasonOptionRow,
                isSelected && styles.reasonOptionRowSelected,
                pressed && styles.reasonOptionRowPressed,
              ]}
            >
              <View
                style={[
                  styles.reasonRadioOuter,
                  isSelected && styles.reasonRadioOuterSelected,
                ]}
              >
                {isSelected ? <View style={styles.reasonRadioInner} /> : null}
              </View>
              <View style={styles.reasonOptionTextWrap}>
                <Text
                  style={[
                    styles.reasonOptionLabel,
                    isSelected && styles.reasonOptionLabelSelected,
                  ]}
                >
                  {option.label}
                </Text>
                <Text style={styles.reasonOptionHelper}>
                  {option.helperText}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.fieldGroupLabel}>
        Link or reference to the cheaper listing (required)
      </Text>
      <TextInput
        value={evidenceText}
        onChangeText={setEvidenceText}
        placeholder="Paste a link, or describe a screenshot you have, e.g. cheaper-listing.png"
        placeholderTextColor={tokens.color.faint}
        style={styles.evidenceInput}
        autoCapitalize="none"
        autoCorrect={false}
        accessibilityLabel="Link or reference to the cheaper listing"
        accessibilityHint="Required. Paste a URL or describe where you found the cheaper identical listing."
      />

      <Text style={styles.fieldGroupLabel}>Anything else? (optional)</Text>
      <TextInput
        value={noteText}
        onChangeText={setNoteText}
        placeholder="Add any extra detail that might help us review this faster"
        placeholderTextColor={tokens.color.faint}
        style={styles.noteInput}
        multiline
        textAlignVertical="top"
        accessibilityLabel="Optional note for this price match request"
      />

      <Text accessibilityRole="header" style={styles.historyHeading}>
        Your Price Match Requests
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screenRoot}>
        <FlatList
          data={historyRecords}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <RequestHistoryCard record={item} />}
          ListHeaderComponent={formSection}
          ListEmptyComponent={
            <View style={styles.emptyHistoryState}>
              <Text style={styles.emptyHistoryText}>
                You haven't submitted any price match requests yet.
              </Text>
            </View>
          }
          ListFooterComponent={<View style={styles.listFooterSpacer} />}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.listContent}
        />

        <View
          style={styles.actionBand}
          accessibilityLiveRegion="polite"
        >
          <Text accessibilityRole="alert" style={styles.actionBandSentence}>
            {statusSentence}
          </Text>

          {gateState === "requestConfirmed" ? (
            <View style={styles.confirmedPanel}>
              <View style={styles.confirmedBadge}>
                <Text style={styles.confirmedBadgeText}>
                  Added to your requests below
                </Text>
              </View>
              <Pressable
                onPress={handleStartAnotherRequest}
                accessibilityRole="button"
                accessibilityLabel="Submit another price match request"
                accessibilityHint="Clears the form so you can cite a different listing."
                style={({ pressed }) => [
                  styles.secondaryBandButton,
                  pressed && styles.secondaryBandButtonPressed,
                ]}
              >
                <Text style={styles.secondaryBandButtonText}>
                  Submit Another Request
                </Text>
              </Pressable>
            </View>
          ) : (
            <Pressable
              onPress={handleConfirmSubmit}
              disabled={gateState !== "readyToSubmit"}
              accessibilityRole="button"
              accessibilityState={{ disabled: gateState !== "readyToSubmit" }}
              accessibilityLabel="Submit price match request"
              accessibilityHint={
                gateState === "readyToSubmit"
                  ? "Submits this request for review and adds it to your request list below."
                  : undefined
              }
              style={({ pressed }) => [
                styles.primaryBandButton,
                gateState !== "readyToSubmit" &&
                  styles.primaryBandButtonDisabled,
                pressed &&
                  gateState === "readyToSubmit" &&
                  styles.primaryBandButtonPressed,
              ]}
            >
              <Text
                style={[
                  styles.primaryBandButtonText,
                  gateState !== "readyToSubmit" &&
                    styles.primaryBandButtonTextDisabled,
                ]}
              >
                Submit Request
              </Text>
            </Pressable>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  screenRoot: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  listContent: {
    paddingHorizontal: tokens.space(4),
  },
  formSection: {
    paddingTop: tokens.space(3),
    paddingBottom: tokens.space(2),
  },
  screenHeading: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: "700",
    color: tokens.color.ink,
    marginBottom: tokens.space(2),
  },
  screenIntro: {
    fontSize: 15,
    lineHeight: 22,
    color: tokens.color.muted,
    marginBottom: tokens.space(5),
  },
  fieldGroupLabel: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "600",
    color: tokens.color.ink2,
    textTransform: "uppercase",
    letterSpacing: 0.4,
    marginBottom: tokens.space(2),
  },
  reasonOptionList: {
    gap: tokens.space(2),
    marginBottom: tokens.space(5),
  },
  reasonOptionRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    minHeight: 56,
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    paddingVertical: tokens.space(3),
    paddingHorizontal: tokens.space(3),
  },
  reasonOptionRowSelected: {
    borderColor: tokens.color.accent,
    backgroundColor: tokens.color.accentBg,
  },
  reasonOptionRowPressed: {
    opacity: 0.85,
  },
  reasonRadioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
    marginRight: tokens.space(3),
    marginTop: tokens.space(1),
  },
  reasonRadioOuterSelected: {
    borderColor: tokens.color.accent,
  },
  reasonRadioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: tokens.color.accent,
  },
  reasonOptionTextWrap: {
    flex: 1,
  },
  reasonOptionLabel: {
    fontSize: 15,
    lineHeight: 21,
    fontWeight: "600",
    color: tokens.color.ink,
  },
  reasonOptionLabelSelected: {
    color: tokens.color.ink,
  },
  reasonOptionHelper: {
    marginTop: tokens.space(1),
    fontSize: 13,
    lineHeight: 19,
    color: tokens.color.muted,
  },
  evidenceInput: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.sm,
    paddingHorizontal: tokens.space(3),
    fontSize: 15,
    lineHeight: 21,
    color: tokens.color.ink,
    marginBottom: tokens.space(5),
  },
  noteInput: {
    minHeight: 84,
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.sm,
    paddingHorizontal: tokens.space(3),
    paddingVertical: tokens.space(2),
    fontSize: 15,
    lineHeight: 21,
    color: tokens.color.ink,
    marginBottom: tokens.space(6),
  },
  historyHeading: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: "700",
    color: tokens.color.ink,
    marginBottom: tokens.space(3),
  },
  historyCard: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(4),
    marginBottom: tokens.space(3),
  },
  historyCardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: tokens.space(2),
    marginBottom: tokens.space(2),
  },
  historyReasonText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "600",
    color: tokens.color.ink,
  },
  historyEvidenceText: {
    fontSize: 13,
    lineHeight: 19,
    color: tokens.color.muted,
    marginBottom: tokens.space(1),
  },
  historyNoteText: {
    fontSize: 13,
    lineHeight: 19,
    color: tokens.color.muted,
    marginBottom: tokens.space(1),
  },
  historyDateText: {
    marginTop: tokens.space(2),
    fontSize: 12,
    lineHeight: 18,
    color: tokens.color.faint,
    fontVariant: ["tabular-nums"],
  },
  denialReasonBox: {
    marginTop: tokens.space(2),
    borderWidth: 1,
    borderColor: tokens.color.dangerBorder,
    backgroundColor: tokens.color.dangerBg,
    borderRadius: tokens.radius.sm,
    padding: tokens.space(3),
  },
  denialReasonLabel: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: "700",
    color: tokens.color.danger,
    textTransform: "uppercase",
    letterSpacing: 0.4,
    marginBottom: tokens.space(1),
  },
  denialReasonText: {
    fontSize: 13,
    lineHeight: 19,
    color: tokens.color.ink2,
  },
  statusBadgePending: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: tokens.color.warningBorder,
    backgroundColor: tokens.color.warningBg,
    borderRadius: tokens.radius.sm,
    paddingVertical: tokens.space(1),
    paddingHorizontal: tokens.space(2),
  },
  statusBadgeTextPending: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "700",
    color: tokens.color.warning,
  },
  statusBadgeApproved: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: tokens.color.successBorder,
    backgroundColor: tokens.color.successBg,
    borderRadius: tokens.radius.sm,
    paddingVertical: tokens.space(1),
    paddingHorizontal: tokens.space(2),
  },
  statusBadgeTextApproved: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "700",
    color: tokens.color.success,
  },
  statusBadgeDenied: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: tokens.color.dangerBorder,
    backgroundColor: tokens.color.dangerBg,
    borderRadius: tokens.radius.sm,
    paddingVertical: tokens.space(1),
    paddingHorizontal: tokens.space(2),
  },
  statusBadgeTextDenied: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "700",
    color: tokens.color.danger,
  },
  emptyHistoryState: {
    paddingVertical: tokens.space(8),
    alignItems: "center",
  },
  emptyHistoryText: {
    fontSize: 14,
    lineHeight: 20,
    color: tokens.color.faint,
    textAlign: "center",
    paddingHorizontal: tokens.space(6),
  },
  listFooterSpacer: {
    height: tokens.space(6),
  },
  actionBand: {
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    paddingHorizontal: tokens.space(4),
    paddingTop: tokens.space(4),
    paddingBottom: tokens.space(5),
  },
  actionBandSentence: {
    fontSize: 14,
    lineHeight: 21,
    color: tokens.color.ink2,
    marginBottom: tokens.space(3),
  },
  primaryBandButton: {
    minHeight: 52,
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.color.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBandButtonDisabled: {
    backgroundColor: tokens.color.border,
  },
  primaryBandButtonPressed: {
    opacity: 0.85,
  },
  primaryBandButtonText: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "700",
    color: tokens.color.onAccent,
  },
  primaryBandButtonTextDisabled: {
    color: tokens.color.faint,
  },
  confirmedPanel: {
    gap: tokens.space(3),
  },
  confirmedBadge: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: tokens.color.successBorder,
    backgroundColor: tokens.color.successBg,
    borderRadius: tokens.radius.sm,
    paddingVertical: tokens.space(1),
    paddingHorizontal: tokens.space(3),
  },
  confirmedBadgeText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "700",
    color: tokens.color.success,
  },
  secondaryBandButton: {
    minHeight: 52,
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryBandButtonPressed: {
    backgroundColor: tokens.color.accentBg,
  },
  secondaryBandButtonText: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
    color: tokens.color.ink2,
  },
});

export default PriceMatchRequestScreen;
