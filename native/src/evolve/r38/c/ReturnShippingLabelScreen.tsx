// native/src/evolve/r38/c/ReturnShippingLabelScreen.tsx
//
// Return Shipping Label Generator — a buyer-side multi-step wizard, not a
// flat list. A fixed header keeps a "Step X of 3" indicator + progress dots
// visible at all times; only the current step's pane is ever on screen.
// The bottom band is a Back/Continue state machine: Continue stays disabled
// until the current step's own requirement is met, and the band always
// names that requirement in plain text. Step 3's Continue becomes "Done".

import React, { useCallback, useEffect, useRef, useState } from "react";
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
  returnReasons,
  returnAddress,
  labelInfo,
  carrierInstructions,
  mockBarcodeRows,
  type ReturnReason,
} from "./data";

type StepNumber = 1 | 2 | 3;
const TOTAL_STEPS = 3;

function getStepName(step: StepNumber): string {
  if (step === 1) return "Select a reason";
  if (step === 2) return "Confirm address";
  return "Your return label";
}

// Whether the CURRENT step's own requirement is satisfied, ignoring step 3
// (step 3 has nothing gating it — its Continue turns into "Done" instead).
function canProceedNow(
  step: StepNumber,
  reasonId: string | null,
  addressConfirmed: boolean
): boolean {
  if (step === 1) return Boolean(reasonId);
  if (step === 2) return addressConfirmed;
  return true;
}

export function ReturnShippingLabelScreen() {
  const [currentStep, setCurrentStep] = useState<StepNumber>(1);
  const [selectedReasonId, setSelectedReasonId] = useState<string | null>(null);
  const [addressConfirmed, setAddressConfirmed] = useState(false);
  const [labelAcknowledged, setLabelAcknowledged] = useState(false);
  const [announcementText, setAnnouncementText] = useState("");

  const announcementTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevStepRef = useRef<StepNumber>(1);
  const prevCanProceedRef = useRef(canProceedNow(1, null, false));

  useEffect(() => {
    return () => {
      if (announcementTimerRef.current) clearTimeout(announcementTimerRef.current);
    };
  }, []);

  // Single live-region + alert pairing for every transient announcement on
  // this screen (step changes, and in-step blocked<->possible flips). Always
  // self-clears so it never gets stuck "on" after the first event.
  const announce = useCallback((message: string) => {
    if (announcementTimerRef.current) clearTimeout(announcementTimerRef.current);
    setAnnouncementText(message);
    announcementTimerRef.current = setTimeout(() => setAnnouncementText(""), 4200);
  }, []);

  // Watches for the current step's requirement flipping blocked<->possible
  // WITHOUT a step change (selecting a reason, toggling the address check).
  // Step changes announce themselves explicitly in the handlers below, so
  // this intentionally skips any render where the step itself just moved.
  useEffect(() => {
    const nowCanProceed = canProceedNow(currentStep, selectedReasonId, addressConfirmed);
    const stepUnchanged = prevStepRef.current === currentStep;
    if (stepUnchanged && nowCanProceed !== prevCanProceedRef.current) {
      if (currentStep === 1) {
        announce(
          nowCanProceed
            ? "Reason selected. You can continue."
            : "Reason cleared. Select a reason to continue."
        );
      } else if (currentStep === 2) {
        announce(
          nowCanProceed
            ? "Address confirmed. You can continue."
            : "Address no longer confirmed. Confirm it to continue."
        );
      }
    }
    prevStepRef.current = currentStep;
    prevCanProceedRef.current = nowCanProceed;
  }, [currentStep, selectedReasonId, addressConfirmed, announce]);

  const handleSelectReason = useCallback((id: string) => {
    setSelectedReasonId(id);
  }, []);

  const handleToggleAddressConfirm = useCallback(() => {
    setAddressConfirmed((prev) => !prev);
  }, []);

  const handleBackPress = useCallback(() => {
    if (currentStep === 1) return;
    const previousStep = (currentStep - 1) as StepNumber;
    setCurrentStep(previousStep);
    announce(`Step ${previousStep} of ${TOTAL_STEPS}: ${getStepName(previousStep)}.`);
  }, [currentStep, announce]);

  const handleContinuePress = useCallback(() => {
    if (currentStep === 1) {
      if (!selectedReasonId) return;
      setCurrentStep(2);
      announce(`Step 2 of ${TOTAL_STEPS}: ${getStepName(2)}.`);
      return;
    }
    if (currentStep === 2) {
      if (!addressConfirmed) return;
      setCurrentStep(3);
      announce(`Step 3 of ${TOTAL_STEPS}: ${getStepName(3)}.`);
      return;
    }
    if (labelAcknowledged) return;
    setLabelAcknowledged(true);
    announce(
      "Return label saved. Show this screen at drop-off, or keep the tracking number for your records."
    );
  }, [currentStep, selectedReasonId, addressConfirmed, labelAcknowledged, announce]);

  const isContinueDisabled = (): boolean => {
    if (currentStep === 1) return !selectedReasonId;
    if (currentStep === 2) return !addressConfirmed;
    return labelAcknowledged;
  };

  const getContinueLabel = (): string => {
    if (currentStep !== 3) return "Continue";
    return labelAcknowledged ? "Saved" : "Done";
  };

  const getBandStatusText = (): string => {
    if (currentStep === 1) {
      return selectedReasonId
        ? "Reason selected. Ready to continue."
        : "Select a reason for your return before continuing.";
    }
    if (currentStep === 2) {
      return addressConfirmed
        ? "Address confirmed. Ready to continue."
        : "Confirm the address above is correct before continuing.";
    }
    return labelAcknowledged
      ? "Saved. Keep the tracking number above for your records."
      : "Review your label below, then mark it done when you're ready to ship.";
  };

  const renderReasonRow = useCallback(
    ({ item }: { item: ReturnReason }) => {
      const isSelected = selectedReasonId === item.id;
      return (
        <Pressable
          onPress={() => handleSelectReason(item.id)}
          accessibilityRole="radio"
          accessibilityState={{ checked: isSelected }}
          accessibilityLabel={`${item.label}. ${item.detail}`}
          style={({ pressed }) => [
            styles.reasonRow,
            isSelected && styles.reasonRowSelected,
            pressed && styles.reasonRowPressed,
          ]}
        >
          <View
            style={[styles.reasonRadioOuter, isSelected && styles.reasonRadioOuterSelected]}
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
          >
            {isSelected ? <View style={styles.reasonRadioInner} /> : null}
          </View>
          <View style={styles.reasonTextBlock}>
            <Text style={styles.reasonLabel}>{item.label}</Text>
            <Text style={styles.reasonDetail}>{item.detail}</Text>
          </View>
        </Pressable>
      );
    },
    [selectedReasonId, handleSelectReason]
  );

  const stepOnePane = (
    <FlatList
      data={returnReasons}
      keyExtractor={(item) => item.id}
      renderItem={renderReasonRow}
      ListHeaderComponent={
        <Text style={styles.stepInstructionText}>
          Choose the reason that best matches your return. This helps the seller
          process it correctly.
        </Text>
      }
      style={styles.stepPaneFlex}
      contentContainerStyle={styles.stepPaneContent}
    />
  );

  const stepTwoPane = (
    <View style={[styles.stepPaneFlex, styles.stepPaneContent]}>
      <Text style={styles.stepInstructionText}>
        Your return ships back to this address. It's pre-filled and can't be
        edited here.
      </Text>
      <View style={styles.addressCard}>
        <Text style={styles.addressLineStrong}>{returnAddress.fullName}</Text>
        <Text style={styles.addressLineMuted}>{returnAddress.streetLine1}</Text>
        <Text style={styles.addressLineMuted}>{returnAddress.streetLine2}</Text>
        <Text style={styles.addressLineMuted}>{returnAddress.cityStateZip}</Text>
        <Text style={styles.addressLineMuted}>{returnAddress.country}</Text>
      </View>
      <Pressable
        onPress={handleToggleAddressConfirm}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: addressConfirmed }}
        accessibilityLabel="Confirm this return address is correct"
        accessibilityHint="Required before you can continue to the next step."
        style={({ pressed }) => [
          styles.addressConfirmRow,
          pressed && styles.addressConfirmRowPressed,
        ]}
      >
        <View
          style={[
            styles.addressConfirmBoxOuter,
            addressConfirmed && styles.addressConfirmBoxChecked,
          ]}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        >
          {addressConfirmed ? (
            <Text style={styles.addressConfirmCheckGlyph}>{"✓"}</Text>
          ) : null}
        </View>
        <Text style={styles.addressConfirmLabel}>
          This is the correct return address
        </Text>
      </Pressable>
    </View>
  );

  const stepThreePane = (
    <ScrollView
      style={styles.stepPaneFlex}
      contentContainerStyle={styles.stepPaneContent}
    >
      <Text style={styles.stepInstructionText}>
        Your prepaid return label is ready. Attach it to the package and drop
        it off using any option below.
      </Text>
      <View style={styles.labelPreviewCard}>
        <View
          style={styles.barcodeGrid}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        >
          {mockBarcodeRows.map((row, rowIndex) => (
            <View key={`barcode-row-${rowIndex}`} style={styles.barcodeRow}>
              {row.map((filled, colIndex) => (
                <View
                  key={`barcode-cell-${rowIndex}-${colIndex}`}
                  style={filled ? styles.barcodeCellFilled : styles.barcodeCellEmpty}
                />
              ))}
            </View>
          ))}
        </View>
        <Text style={styles.trackingNumberCaption}>Tracking number</Text>
        <Text style={styles.trackingNumberValue}>{labelInfo.trackingNumber}</Text>
        <Text style={styles.carrierNameText}>
          {labelInfo.carrierName} {"·"} {labelInfo.serviceLevel}
        </Text>
      </View>
      <Text style={styles.instructionsSectionTitle}>Drop-off instructions</Text>
      <FlatList
        data={carrierInstructions}
        keyExtractor={(_, index) => `instruction-${index}`}
        scrollEnabled={false}
        renderItem={({ item, index }) => (
          <View style={styles.instructionRow}>
            <Text style={styles.instructionIndex}>{index + 1}</Text>
            <Text style={styles.instructionText}>{item}</Text>
          </View>
        )}
      />
    </ScrollView>
  );

  const continueDisabled = isContinueDisabled();

  return (
    <SafeAreaView style={styles.wizardRoot}>
      <View style={styles.wizardHeader}>
        <Text style={styles.wizardTitle} accessibilityRole="header">
          Return Shipping Label
        </Text>
        <View style={styles.stepIndicatorRow}>
          <Text style={styles.stepIndicatorCaption}>
            Step {currentStep} of {TOTAL_STEPS}: {getStepName(currentStep)}
          </Text>
          <View style={styles.stepDotsRow}>
            <View
              style={[
                styles.stepDot,
                currentStep >= 1 && styles.stepDotFilled,
                currentStep === 1 && styles.stepDotCurrent,
              ]}
            />
            <View
              style={[
                styles.stepDot,
                currentStep >= 2 && styles.stepDotFilled,
                currentStep === 2 && styles.stepDotCurrent,
              ]}
            />
            <View
              style={[
                styles.stepDot,
                currentStep >= 3 && styles.stepDotFilled,
                currentStep === 3 && styles.stepDotCurrent,
              ]}
            />
          </View>
        </View>
      </View>

      <View style={styles.stepPaneWrap}>
        {currentStep === 1 ? stepOnePane : currentStep === 2 ? stepTwoPane : stepThreePane}
      </View>

      <View style={styles.announcerRegion} accessibilityLiveRegion="polite">
        {announcementText ? (
          <Text accessibilityRole="alert" style={styles.announcerText}>
            {announcementText}
          </Text>
        ) : null}
      </View>

      <View style={styles.bottomBand}>
        <Text style={styles.bottomBandStatusText}>{getBandStatusText()}</Text>
        <View style={styles.bottomBandButtonRow}>
          {currentStep > 1 ? (
            <Pressable
              onPress={handleBackPress}
              accessibilityRole="button"
              accessibilityLabel="Back"
              accessibilityHint="Returns to the previous step."
              style={({ pressed }) => [styles.backButton, pressed && styles.backButtonPressed]}
            >
              <Text style={styles.backButtonLabel}>Back</Text>
            </Pressable>
          ) : (
            <View style={styles.backButtonSpacer} />
          )}
          <Pressable
            onPress={handleContinuePress}
            disabled={continueDisabled}
            accessibilityRole="button"
            accessibilityLabel={getContinueLabel()}
            accessibilityState={{ disabled: continueDisabled }}
            accessibilityHint={
              currentStep === 3
                ? "Marks this return label as saved for your records."
                : "Moves to the next step of the return process."
            }
            style={({ pressed }) => [
              styles.continueButton,
              continueDisabled && styles.continueButtonDisabled,
              pressed && !continueDisabled && styles.continueButtonPressed,
            ]}
          >
            <Text
              style={[
                styles.continueButtonLabel,
                continueDisabled && styles.continueButtonLabelDisabled,
              ]}
            >
              {getContinueLabel()}
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wizardRoot: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  wizardHeader: {
    paddingHorizontal: tokens.space(4),
    paddingTop: tokens.space(3),
    paddingBottom: tokens.space(3),
    borderBottomWidth: 1,
    borderBottomColor: tokens.color.border,
  },
  wizardTitle: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: "700",
    color: tokens.color.ink,
    marginBottom: tokens.space(3),
  },
  stepIndicatorRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  stepIndicatorCaption: {
    flex: 1,
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "600",
    color: tokens.color.muted,
    marginRight: tokens.space(3),
  },
  stepDotsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  stepDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    marginLeft: tokens.space(2),
  },
  stepDotFilled: {
    backgroundColor: tokens.color.accent,
    borderColor: tokens.color.accent,
  },
  stepDotCurrent: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  stepPaneWrap: {
    flex: 1,
  },
  stepPaneFlex: {
    flex: 1,
  },
  stepPaneContent: {
    paddingHorizontal: tokens.space(4),
    paddingTop: tokens.space(4),
    paddingBottom: tokens.space(6),
  },
  stepInstructionText: {
    fontSize: 15,
    lineHeight: 22,
    color: tokens.color.muted,
    marginBottom: tokens.space(4),
  },
  // Step 1 — reason list
  reasonRow: {
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
  reasonRowSelected: {
    borderColor: tokens.color.accent,
    backgroundColor: tokens.color.accentBg,
  },
  reasonRowPressed: {
    backgroundColor: tokens.color.accentBg,
  },
  reasonRadioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
    marginRight: tokens.space(3),
    marginTop: 2,
  },
  reasonRadioOuterSelected: {
    borderColor: tokens.color.accent,
  },
  reasonRadioInner: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: tokens.color.accent,
  },
  reasonTextBlock: {
    flex: 1,
  },
  reasonLabel: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
    color: tokens.color.ink,
    marginBottom: tokens.space(1),
  },
  reasonDetail: {
    fontSize: 14,
    lineHeight: 20,
    color: tokens.color.muted,
  },
  // Step 2 — address confirmation
  addressCard: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(4),
    backgroundColor: tokens.color.bg,
    marginBottom: tokens.space(4),
  },
  addressLineStrong: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "700",
    color: tokens.color.ink,
    marginBottom: tokens.space(1),
  },
  addressLineMuted: {
    fontSize: 15,
    lineHeight: 22,
    color: tokens.color.muted,
  },
  addressConfirmRow: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 44,
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    paddingHorizontal: tokens.space(4),
    paddingVertical: tokens.space(3),
    backgroundColor: tokens.color.bg,
  },
  addressConfirmRowPressed: {
    backgroundColor: tokens.color.accentBg,
  },
  addressConfirmBoxOuter: {
    width: 22,
    height: 22,
    borderRadius: tokens.radius.sm,
    borderWidth: 2,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
    marginRight: tokens.space(3),
  },
  addressConfirmBoxChecked: {
    borderColor: tokens.color.accent,
    backgroundColor: tokens.color.accent,
  },
  addressConfirmCheckGlyph: {
    fontSize: 13,
    lineHeight: 13,
    fontWeight: "700",
    color: tokens.color.onAccent,
  },
  addressConfirmLabel: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "600",
    color: tokens.color.ink,
  },
  // Step 3 — generated label
  labelPreviewCard: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(4),
    backgroundColor: tokens.color.bg,
    marginBottom: tokens.space(5),
    alignItems: "center",
  },
  barcodeGrid: {
    marginBottom: tokens.space(4),
  },
  barcodeRow: {
    flexDirection: "row",
  },
  barcodeCellFilled: {
    width: 6,
    height: 18,
    marginRight: 2,
    marginBottom: 2,
    backgroundColor: tokens.color.ink,
  },
  barcodeCellEmpty: {
    width: 6,
    height: 18,
    marginRight: 2,
    marginBottom: 2,
    backgroundColor: tokens.color.bg,
  },
  trackingNumberCaption: {
    fontSize: 13,
    lineHeight: 18,
    color: tokens.color.faint,
    marginBottom: tokens.space(1),
  },
  trackingNumberValue: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: "700",
    color: tokens.color.ink,
    letterSpacing: 1,
    fontVariant: ["tabular-nums"],
    marginBottom: tokens.space(2),
  },
  carrierNameText: {
    fontSize: 14,
    lineHeight: 21,
    color: tokens.color.muted,
  },
  instructionsSectionTitle: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
    color: tokens.color.ink,
    marginBottom: tokens.space(3),
  },
  instructionRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: tokens.space(3),
  },
  instructionIndex: {
    width: 22,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "700",
    color: tokens.color.accent,
    fontVariant: ["tabular-nums"],
  },
  instructionText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    color: tokens.color.ink2,
  },
  // Live-region announcer
  announcerRegion: {
    paddingHorizontal: tokens.space(4),
    minHeight: 0,
  },
  announcerText: {
    fontSize: 12,
    lineHeight: 18,
    color: tokens.color.accent,
    paddingBottom: tokens.space(1),
  },
  // Bottom band — blocked-workflow state machine over step progression
  bottomBand: {
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    paddingHorizontal: tokens.space(4),
    paddingTop: tokens.space(3),
    paddingBottom: tokens.space(4),
  },
  bottomBandStatusText: {
    fontSize: 14,
    lineHeight: 21,
    color: tokens.color.muted,
    marginBottom: tokens.space(3),
  },
  bottomBandButtonRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButtonSpacer: {
    flex: 1,
  },
  backButton: {
    flex: 1,
    minHeight: 44,
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
    marginRight: tokens.space(3),
  },
  backButtonPressed: {
    backgroundColor: tokens.color.accentBg,
  },
  backButtonLabel: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
    color: tokens.color.ink,
  },
  continueButton: {
    flex: 2,
    minHeight: 44,
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  continueButtonPressed: {
    backgroundColor: tokens.color.ink2,
  },
  continueButtonDisabled: {
    backgroundColor: tokens.color.border,
  },
  continueButtonLabel: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
    color: tokens.color.onAccent,
  },
  continueButtonLabelDisabled: {
    color: tokens.color.faint,
  },
});

export default ReturnShippingLabelScreen;
