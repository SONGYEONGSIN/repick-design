// native/src/evolve/r42/b/ReportBuyerScreen.tsx
//
// Report a Buyer — a seller-facing complaint form, filed about a buyer's
// conduct on a specific past transaction (no-show, non-payment, abusive
// messages). This is the mirror direction of reporting a listing: the
// seller is the complainant here, the buyer is the subject, and the
// taxonomy below is about meetup/payment behavior, not listing content.
//
// Three-step wizard: pick a reason (step 1) -> describe what happened in
// free text with a visible character count (step 2) -> review and submit
// (step 3). The bottom gate band is a blocked/ready state machine: it
// names in one sentence why the current step can't advance yet, and
// pressing it while ready moves forward (or submits, on step 3).
//
// Once submitted, the wizard content and the gate band are both swapped
// out for a local, read-only confirmation panel. A finished report has no
// further gate to clear, so per this codebase's banding doctrine it gets
// no band at all — a workflow band on a completed state would have
// nothing left to gate.

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  ScrollView,
  TextInput,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { tokens } from "../../../tokens";
import {
  reportReasons,
  reportedTransaction,
  DETAILS_MIN_LENGTH,
  DETAILS_MAX_LENGTH,
  submissionReferenceId,
  type ReportReason,
} from "./data";

type FormStep = 1 | 2 | 3;
const TOTAL_STEPS = 3;

function getStepName(step: FormStep): string {
  if (step === 1) return "Reason";
  if (step === 2) return "Incident details";
  return "Review & submit";
}

function getReasonLabel(reasonId: string | null): string {
  if (!reasonId) return "";
  const match = reportReasons.find((reason) => reason.id === reasonId);
  return match ? match.label : "";
}

export function ReportBuyerScreen() {
  const [step, setStep] = useState<FormStep>(1);
  const [selectedReasonId, setSelectedReasonId] = useState<string | null>(null);
  const [incidentDetails, setIncidentDetails] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [liveMessage, setLiveMessage] = useState("");

  const liveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (liveTimerRef.current) clearTimeout(liveTimerRef.current);
    };
  }, []);

  // Single live region for the whole screen. Every transition that changes
  // what the user can do next — a step advance or the final submission —
  // routes through this one function so only one region ever speaks.
  const announce = useCallback((message: string) => {
    if (liveTimerRef.current) clearTimeout(liveTimerRef.current);
    setLiveMessage(message);
    liveTimerRef.current = setTimeout(() => setLiveMessage(""), 4500);
  }, []);

  const trimmedDetailsLength = incidentDetails.trim().length;

  const isStepReady = useCallback(
    (checkStep: FormStep): boolean => {
      if (checkStep === 1) return Boolean(selectedReasonId);
      if (checkStep === 2) return trimmedDetailsLength >= DETAILS_MIN_LENGTH;
      return true;
    },
    [selectedReasonId, trimmedDetailsLength]
  );

  const handleSelectReason = useCallback(
    (reasonId: string) => {
      setSelectedReasonId(reasonId);
    },
    []
  );

  const handleBack = useCallback(() => {
    if (step === 1) return;
    const previousStep = (step - 1) as FormStep;
    setStep(previousStep);
    announce(`Step ${previousStep} of ${TOTAL_STEPS}: ${getStepName(previousStep)}.`);
  }, [step, announce]);

  const handleGatePress = useCallback(() => {
    if (step === 1) {
      if (!isStepReady(1)) return;
      setStep(2);
      announce(`Step 2 of ${TOTAL_STEPS}: ${getStepName(2)}.`);
      return;
    }
    if (step === 2) {
      if (!isStepReady(2)) return;
      setStep(3);
      announce(`Step 3 of ${TOTAL_STEPS}: ${getStepName(3)}.`);
      return;
    }
    // Step 3: submit.
    setSubmitted(true);
    announce(
      `Report submitted. Reference ${submissionReferenceId}. Our trust & safety team will review it within 2 business days.`
    );
  }, [step, isStepReady, announce]);

  const getGateMessage = (): string => {
    if (step === 1) {
      return selectedReasonId
        ? "Reason selected. Ready to continue."
        : "Select a reason to continue.";
    }
    if (step === 2) {
      if (trimmedDetailsLength >= DETAILS_MIN_LENGTH) {
        return "Details added. Ready to continue.";
      }
      const remaining = DETAILS_MIN_LENGTH - trimmedDetailsLength;
      return `Add at least ${remaining} more character${remaining === 1 ? "" : "s"} to continue.`;
    }
    return "Review your report below, then submit when you're ready.";
  };

  const getGateButtonLabel = (): string => {
    if (step === 3) return "Submit Report";
    return "Continue";
  };

  const gateReady = isStepReady(step);

  const renderReasonRow = useCallback(
    ({ item }: { item: ReportReason }) => {
      const isSelected = selectedReasonId === item.id;
      return (
        <Pressable
          onPress={() => handleSelectReason(item.id)}
          accessibilityRole="radio"
          accessibilityState={{ checked: isSelected }}
          accessibilityLabel={`${item.label}. ${item.helperText}`}
          style={({ pressed }) => [
            styles.reasonCard,
            isSelected && styles.reasonCardSelected,
            pressed && styles.reasonCardPressed,
          ]}
        >
          <View
            style={[styles.reasonMark, isSelected && styles.reasonMarkSelected]}
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
          >
            {isSelected ? <Text style={styles.reasonMarkGlyph}>{"✓"}</Text> : null}
          </View>
          <View style={styles.reasonTextColumn}>
            <Text style={styles.reasonLabel}>{item.label}</Text>
            <Text style={styles.reasonHelperText}>{item.helperText}</Text>
          </View>
        </Pressable>
      );
    },
    [selectedReasonId, handleSelectReason]
  );

  const transactionContextCard = (
    <View style={styles.contextCard}>
      <Text style={styles.contextCaption}>Reporting a transaction with</Text>
      <Text style={styles.contextBuyerName}>
        {reportedTransaction.buyerName}{" "}
        <Text style={styles.contextBuyerHandle}>{reportedTransaction.buyerHandle}</Text>
      </Text>
      <View style={styles.contextRow}>
        <Text style={styles.contextLabel}>Order</Text>
        <Text style={styles.contextValue}>{reportedTransaction.orderId}</Text>
      </View>
      <View style={styles.contextRow}>
        <Text style={styles.contextLabel}>Listing</Text>
        <Text style={styles.contextValue}>{reportedTransaction.listingTitle}</Text>
      </View>
      <View style={styles.contextRow}>
        <Text style={styles.contextLabel}>Date</Text>
        <Text style={styles.contextValue}>{reportedTransaction.transactionDateLabel}</Text>
      </View>
    </View>
  );

  const stepOnePane = (
    <FlatList
      data={reportReasons}
      keyExtractor={(item) => item.id}
      renderItem={renderReasonRow}
      ListHeaderComponent={
        <View>
          {transactionContextCard}
          <Text style={styles.paneIntroText}>
            Choose the category that best matches what happened with this buyer.
          </Text>
        </View>
      }
      style={styles.paneScroll}
      contentContainerStyle={styles.paneContent}
    />
  );

  const stepTwoPane = (
    <ScrollView style={styles.paneScroll} contentContainerStyle={styles.paneContent}>
      <Text style={styles.paneIntroText}>
        Describe what happened with {reportedTransaction.buyerName}. Include dates,
        messages, or anything else that helps our team understand the situation.
      </Text>
      <TextInput
        value={incidentDetails}
        onChangeText={setIncidentDetails}
        multiline
        maxLength={DETAILS_MAX_LENGTH}
        placeholder="Describe the incident in your own words..."
        placeholderTextColor={tokens.color.faint}
        accessibilityLabel={`Incident details, up to ${DETAILS_MAX_LENGTH} characters`}
        style={styles.detailsInput}
        textAlignVertical="top"
      />
      <Text
        style={[
          styles.charCountText,
          trimmedDetailsLength < DETAILS_MIN_LENGTH && styles.charCountTextLow,
        ]}
      >
        {incidentDetails.length} / {DETAILS_MAX_LENGTH}
      </Text>
    </ScrollView>
  );

  const stepThreePane = (
    <ScrollView style={styles.paneScroll} contentContainerStyle={styles.paneContent}>
      <Text style={styles.paneIntroText}>
        Review everything below before you submit. You can go back to make changes.
      </Text>
      {transactionContextCard}
      <View style={styles.reviewBlock}>
        <Text style={styles.reviewBlockLabel}>Reason</Text>
        <Text style={styles.reviewBlockValue}>{getReasonLabel(selectedReasonId)}</Text>
      </View>
      <View style={styles.reviewBlock}>
        <Text style={styles.reviewBlockLabel}>Incident details</Text>
        <Text style={styles.reviewBlockValue}>{incidentDetails}</Text>
      </View>
    </ScrollView>
  );

  const confirmationPanel = (
    <ScrollView style={styles.paneScroll} contentContainerStyle={styles.paneContent}>
      <View style={styles.confirmationCard}>
        <View style={styles.confirmationMark}>
          <Text style={styles.confirmationMarkGlyph}>{"✓"}</Text>
        </View>
        <Text style={styles.confirmationTitle} accessibilityRole="header">
          Report submitted
        </Text>
        <Text style={styles.confirmationBody}>
          Our trust & safety team will review this within 2 business days. You'll
          get a notification once there's an update.
        </Text>
        <View style={styles.confirmationDivider} />
        <View style={styles.reviewBlock}>
          <Text style={styles.reviewBlockLabel}>Reference number</Text>
          <Text style={styles.reviewBlockValueStrong}>{submissionReferenceId}</Text>
        </View>
        <View style={styles.reviewBlock}>
          <Text style={styles.reviewBlockLabel}>Reported buyer</Text>
          <Text style={styles.reviewBlockValue}>
            {reportedTransaction.buyerName} ({reportedTransaction.buyerHandle})
          </Text>
        </View>
        <View style={styles.reviewBlock}>
          <Text style={styles.reviewBlockLabel}>Reason</Text>
          <Text style={styles.reviewBlockValue}>{getReasonLabel(selectedReasonId)}</Text>
        </View>
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.rootContainer}>
      <View style={styles.headerSection}>
        <Text style={styles.screenHeading} accessibilityRole="header">
          Report a Buyer
        </Text>
        {!submitted ? (
          <View style={styles.progressRow}>
            <Text style={styles.progressCaption}>
              Step {step} of {TOTAL_STEPS} · {getStepName(step)}
            </Text>
            <View style={styles.progressTrack}>
              <View
                style={[styles.progressSegment, step >= 1 && styles.progressSegmentFilled]}
              />
              <View
                style={[styles.progressSegment, step >= 2 && styles.progressSegmentFilled]}
              />
              <View
                style={[styles.progressSegment, step >= 3 && styles.progressSegmentFilled]}
              />
            </View>
          </View>
        ) : null}
      </View>

      <View style={styles.paneWrap}>
        {submitted
          ? confirmationPanel
          : step === 1
          ? stepOnePane
          : step === 2
          ? stepTwoPane
          : stepThreePane}
      </View>

      <View style={styles.liveRegionContainer} accessibilityLiveRegion="polite">
        {liveMessage ? (
          <Text accessibilityRole="alert" style={styles.liveRegionText}>
            {liveMessage}
          </Text>
        ) : null}
      </View>

      {!submitted ? (
        <View style={styles.gateBand}>
          <Text style={styles.gateBandMessage}>{getGateMessage()}</Text>
          <View style={styles.gateBandActions}>
            {step > 1 ? (
              <Pressable
                onPress={handleBack}
                accessibilityRole="button"
                accessibilityLabel="Back"
                accessibilityHint="Returns to the previous step."
                style={({ pressed }) => [
                  styles.gateBackButton,
                  pressed && styles.gateBackButtonPressed,
                ]}
              >
                <Text style={styles.gateBackButtonLabel}>Back</Text>
              </Pressable>
            ) : (
              <View style={styles.gateBackButtonSpacer} />
            )}
            <Pressable
              onPress={handleGatePress}
              disabled={!gateReady}
              accessibilityRole="button"
              accessibilityLabel={getGateButtonLabel()}
              accessibilityState={{ disabled: !gateReady }}
              accessibilityHint={
                step === 3
                  ? "Submits this report for review."
                  : "Moves to the next step of this report."
              }
              style={({ pressed }) => [
                styles.gatePrimaryButton,
                step === 3 && styles.gatePrimaryButtonDanger,
                !gateReady && styles.gatePrimaryButtonDisabled,
                pressed && gateReady && styles.gatePrimaryButtonPressed,
              ]}
            >
              <Text
                style={[
                  styles.gatePrimaryButtonLabel,
                  !gateReady && styles.gatePrimaryButtonLabelDisabled,
                ]}
              >
                {getGateButtonLabel()}
              </Text>
            </Pressable>
          </View>
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  headerSection: {
    paddingHorizontal: tokens.space(4),
    paddingTop: tokens.space(3),
    paddingBottom: tokens.space(3),
    borderBottomWidth: 1,
    borderBottomColor: tokens.color.border,
  },
  screenHeading: {
    fontSize: 26,
    lineHeight: 34,
    fontWeight: "700",
    color: tokens.color.ink,
    marginBottom: tokens.space(3),
  },
  progressRow: {
    gap: tokens.space(2),
  },
  progressCaption: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "600",
    color: tokens.color.muted,
  },
  progressTrack: {
    flexDirection: "row",
    gap: tokens.space(1),
  },
  progressSegment: {
    flex: 1,
    height: 4,
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.border,
  },
  progressSegmentFilled: {
    backgroundColor: tokens.color.accent,
  },
  paneWrap: {
    flex: 1,
  },
  paneScroll: {
    flex: 1,
  },
  paneContent: {
    paddingHorizontal: tokens.space(4),
    paddingTop: tokens.space(4),
    paddingBottom: tokens.space(6),
  },
  paneIntroText: {
    fontSize: 15,
    lineHeight: 22,
    color: tokens.color.muted,
    marginBottom: tokens.space(4),
  },
  // Transaction context card, reused on step 1 and step 3.
  contextCard: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(4),
    backgroundColor: tokens.color.accentBg,
    marginBottom: tokens.space(4),
  },
  contextCaption: {
    fontSize: 12,
    lineHeight: 16,
    color: tokens.color.faint,
    marginBottom: tokens.space(1),
  },
  contextBuyerName: {
    fontSize: 17,
    lineHeight: 24,
    fontWeight: "700",
    color: tokens.color.ink,
    marginBottom: tokens.space(2),
  },
  contextBuyerHandle: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "400",
    color: tokens.color.muted,
  },
  contextRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: tokens.space(1),
  },
  contextLabel: {
    fontSize: 13,
    lineHeight: 19,
    color: tokens.color.faint,
  },
  contextValue: {
    fontSize: 13,
    lineHeight: 19,
    color: tokens.color.ink2,
    fontWeight: "600",
    flexShrink: 1,
    textAlign: "right",
    marginLeft: tokens.space(3),
  },
  // Step 1 — reason list
  reasonCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(4),
    marginBottom: tokens.space(3),
    backgroundColor: tokens.color.bg,
    minHeight: 44,
  },
  reasonCardSelected: {
    borderColor: tokens.color.accent,
    backgroundColor: tokens.color.accentBg,
  },
  reasonCardPressed: {
    backgroundColor: tokens.color.accentBg,
  },
  reasonMark: {
    width: 22,
    height: 22,
    borderRadius: tokens.radius.sm,
    borderWidth: 2,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
    marginRight: tokens.space(3),
    marginTop: 2,
  },
  reasonMarkSelected: {
    borderColor: tokens.color.accent,
    backgroundColor: tokens.color.accent,
  },
  reasonMarkGlyph: {
    fontSize: 13,
    lineHeight: 13,
    fontWeight: "700",
    color: tokens.color.onAccent,
  },
  reasonTextColumn: {
    flex: 1,
  },
  reasonLabel: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
    color: tokens.color.ink,
    marginBottom: tokens.space(1),
  },
  reasonHelperText: {
    fontSize: 14,
    lineHeight: 20,
    color: tokens.color.muted,
  },
  // Step 2 — incident details
  detailsInput: {
    minHeight: 160,
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(4),
    fontSize: 15,
    lineHeight: 22,
    color: tokens.color.ink,
    backgroundColor: tokens.color.bg,
  },
  charCountText: {
    fontSize: 13,
    lineHeight: 18,
    color: tokens.color.faint,
    textAlign: "right",
    marginTop: tokens.space(2),
    fontVariant: ["tabular-nums"],
  },
  charCountTextLow: {
    color: tokens.color.muted,
  },
  // Step 3 — review, and the confirmation panel after submit
  reviewBlock: {
    marginBottom: tokens.space(4),
  },
  reviewBlockLabel: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "600",
    color: tokens.color.faint,
    marginBottom: tokens.space(1),
  },
  reviewBlockValue: {
    fontSize: 15,
    lineHeight: 22,
    color: tokens.color.ink2,
  },
  reviewBlockValueStrong: {
    fontSize: 17,
    lineHeight: 24,
    fontWeight: "700",
    color: tokens.color.ink,
    fontVariant: ["tabular-nums"],
  },
  confirmationCard: {
    borderWidth: 1,
    borderColor: tokens.color.successBorder,
    backgroundColor: tokens.color.successBg,
    borderRadius: tokens.radius.md,
    padding: tokens.space(5),
  },
  confirmationMark: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: tokens.color.success,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: tokens.space(3),
  },
  confirmationMarkGlyph: {
    fontSize: 18,
    lineHeight: 18,
    fontWeight: "700",
    color: tokens.color.onAccent,
  },
  confirmationTitle: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: "700",
    color: tokens.color.ink,
    marginBottom: tokens.space(2),
  },
  confirmationBody: {
    fontSize: 15,
    lineHeight: 22,
    color: tokens.color.ink2,
    marginBottom: tokens.space(4),
  },
  confirmationDivider: {
    height: 1,
    backgroundColor: tokens.color.successBorder,
    marginBottom: tokens.space(4),
  },
  // Live region announcer — the single live region on this screen.
  liveRegionContainer: {
    paddingHorizontal: tokens.space(4),
    minHeight: 0,
  },
  liveRegionText: {
    fontSize: 12,
    lineHeight: 18,
    color: tokens.color.accent,
    paddingBottom: tokens.space(1),
  },
  // Gate band — blocked/ready state machine over step progression. Hidden
  // entirely once submitted; a finished report has nothing left to gate.
  gateBand: {
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    paddingHorizontal: tokens.space(4),
    paddingTop: tokens.space(3),
    paddingBottom: tokens.space(4),
  },
  gateBandMessage: {
    fontSize: 14,
    lineHeight: 21,
    color: tokens.color.muted,
    marginBottom: tokens.space(3),
  },
  gateBandActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  gateBackButtonSpacer: {
    flex: 1,
  },
  gateBackButton: {
    flex: 1,
    minHeight: 44,
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
    marginRight: tokens.space(3),
  },
  gateBackButtonPressed: {
    backgroundColor: tokens.color.accentBg,
  },
  gateBackButtonLabel: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
    color: tokens.color.ink,
  },
  gatePrimaryButton: {
    flex: 2,
    minHeight: 44,
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  gatePrimaryButtonDanger: {
    backgroundColor: tokens.color.danger,
  },
  gatePrimaryButtonPressed: {
    backgroundColor: tokens.color.ink2,
  },
  gatePrimaryButtonDisabled: {
    backgroundColor: tokens.color.border,
  },
  gatePrimaryButtonLabel: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
    color: tokens.color.onAccent,
  },
  gatePrimaryButtonLabelDisabled: {
    color: tokens.color.faint,
  },
});

export default ReportBuyerScreen;
