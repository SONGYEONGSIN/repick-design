// native/src/evolve/r49/c/SellerOnboardingChecklistScreen.tsx — auto-native-r49
// candidate c.
//
// Seller Onboarding Checklist — a first-run, whole-screen setup tracker for
// a brand-new seller. Distinct from the existing "seller verification
// (submission)" screen (that's just the identity-doc upload flow itself)
// and the existing "pro seller plan" screen (a subscription-tier picker):
// this is a meta-level progress tracker that sits above both of those,
// sequencing identity verification + payout linking + storefront setup +
// first listing into one ordered checklist. There is no bottom band here —
// the checklist rows themselves are the whole screen's structure, so no
// separate state-machine band is layered underneath it.
//
// State model (written fresh for this screen, not reused from any other
// catalog entry):
//   - completedStepIds: the ONLY state. A plain array of step ids the
//     seller has finished. Every row's done/current/locked status is
//     *derived* from this array plus ONBOARDING_STEPS's fixed order in
//     `stepsWithStatus` below — there is no separately-tracked "currentStep
//     index" or union-state value that could drift out of sync with it.
//   - announcementText + a single setTimeout ref: the one live-region
//     message, cleared back to "" a few seconds after it's set so a screen
//     reader doesn't keep re-announcing stale text.
//
// Each row's interactive surface is deliberately split into two SIBLING
// controls (never a Pressable nested inside another Pressable):
//   1. The row's own tap target — real navigation-shaped affordance with
//      nowhere to navigate to in this standalone screen, so it's a no-op
//      Pressable (current step) or a disabled Pressable with a visible,
//      spoken reason (locked step). It carries no accessibilityHint that
//      would promise navigation that doesn't happen.
//   2. A separate "Mark as done" button, present only on the current step,
//      which is this screen's one real interaction: it actually mutates
//      completedStepIds, promotes the next step to "current", and fires
//      the live-region announcement.
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  SafeAreaView,
  StyleSheet,
  GestureResponderEvent,
} from "react-native";
import { tokens } from "../../../tokens";
import { ONBOARDING_STEPS, INITIAL_COMPLETED_STEP_IDS, OnboardingStep } from "./data";
import { OnboardingProgressRing } from "./OnboardingProgressRing";

type StepStatus = "done" | "current" | "locked";

const ANNOUNCEMENT_VISIBLE_MS = 4000;

type StepWithStatus = {
  step: OnboardingStep;
  status: StepStatus;
  stepNumber: number;
  previousStepTitle: string | null;
};

export default function SellerOnboardingChecklistScreen() {
  const [completedStepIds, setCompletedStepIds] = useState<string[]>(() => [
    ...INITIAL_COMPLETED_STEP_IDS,
  ]);
  const [announcementText, setAnnouncementText] = useState("");
  const announcementTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const totalStepCount = ONBOARDING_STEPS.length;
  const completedStepCount = completedStepIds.length;
  const remainingStepCount = totalStepCount - completedStepCount;
  const progressRatio = completedStepCount / totalStepCount;
  const allStepsComplete = completedStepCount === totalStepCount;

  // Every row's status is derived here, in one place, from completedStepIds
  // — the first step (in ONBOARDING_STEPS order) that isn't yet complete is
  // "current"; everything after it is "locked"; there is no other state
  // this derivation depends on.
  const stepsWithStatus = useMemo<StepWithStatus[]>(() => {
    let currentAlreadyAssigned = false;
    return ONBOARDING_STEPS.map((step, index) => {
      let status: StepStatus;
      if (completedStepIds.includes(step.id)) {
        status = "done";
      } else if (!currentAlreadyAssigned) {
        status = "current";
        currentAlreadyAssigned = true;
      } else {
        status = "locked";
      }
      return {
        step,
        status,
        stepNumber: index + 1,
        previousStepTitle: index > 0 ? ONBOARDING_STEPS[index - 1].title : null,
      };
    });
  }, [completedStepIds]);

  useEffect(() => {
    return () => {
      if (announcementTimerRef.current) {
        clearTimeout(announcementTimerRef.current);
      }
    };
  }, []);

  const markStepAsDone = useCallback((step: OnboardingStep, isLastStep: boolean) => {
    setCompletedStepIds((current) =>
      current.includes(step.id) ? current : [...current, step.id]
    );
    setAnnouncementText(
      isLastStep
        ? `"${step.title}" marked as done. Your shop is now fully set up.`
        : `"${step.title}" marked as done. Moving to the next step.`
    );
    if (announcementTimerRef.current) {
      clearTimeout(announcementTimerRef.current);
    }
    announcementTimerRef.current = setTimeout(() => {
      setAnnouncementText("");
    }, ANNOUNCEMENT_VISIBLE_MS);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <Text accessibilityRole="header" style={styles.heading}>
          Set up your shop to start selling
        </Text>
        <Text style={styles.subheading}>
          Finish these steps in order — your shop goes live once they're all
          done.
        </Text>

        <View style={styles.progressSection}>
          <OnboardingProgressRing
            ratio={progressRatio}
            centerLabel={`${completedStepCount}/${totalStepCount}`}
          />
          <View style={styles.progressTextCol}>
            <Text style={styles.progressHeadline}>
              {completedStepCount} of {totalStepCount} complete
            </Text>
            <Text style={styles.progressSub}>
              {allStepsComplete
                ? "Nice — every setup step is done."
                : `${remainingStepCount} step${remainingStepCount === 1 ? "" : "s"} left.`}
            </Text>
          </View>
        </View>

        <View
          accessibilityLiveRegion="polite"
          style={styles.liveRegionContainer}
        >
          {announcementText ? (
            <Text accessibilityRole="alert" style={styles.liveRegionText}>
              {announcementText}
            </Text>
          ) : null}
        </View>

        <View style={styles.list}>
          {stepsWithStatus.map(({ step, status, stepNumber, previousStepTitle }, index) => (
            <StepRow
              key={step.id}
              step={step}
              status={status}
              stepNumber={stepNumber}
              previousStepTitle={previousStepTitle}
              isLastStep={index === ONBOARDING_STEPS.length - 1}
              onMarkDone={markStepAsDone}
            />
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

function StepRow({
  step,
  status,
  stepNumber,
  previousStepTitle,
  isLastStep,
  onMarkDone,
}: {
  step: OnboardingStep;
  status: StepStatus;
  stepNumber: number;
  previousStepTitle: string | null;
  isLastStep: boolean;
  onMarkDone: (step: OnboardingStep, isLastStep: boolean) => void;
}) {
  const lockedReasonText = previousStepTitle
    ? `Complete "${previousStepTitle}" first.`
    : null;

  const statusLabelText =
    status === "done" ? "Done" : status === "current" ? "In progress" : "Locked";

  const rowContent = (
    <View style={styles.stepRowInner}>
      <StepStatusIcon status={status} stepNumber={stepNumber} />
      <View style={styles.stepBody}>
        <View style={styles.stepTitleLine}>
          <Text
            style={[styles.stepTitle, status === "locked" && styles.stepTextLocked]}
          >
            {step.title}
          </Text>
          <View
            style={[
              styles.statusTag,
              status === "done" && styles.statusTagDone,
              status === "current" && styles.statusTagCurrent,
              status === "locked" && styles.statusTagLocked,
            ]}
          >
            <Text
              style={[
                styles.statusTagText,
                status === "done" && styles.statusTagTextDone,
                status === "current" && styles.statusTagTextCurrent,
                status === "locked" && styles.statusTagTextLocked,
              ]}
            >
              {statusLabelText}
            </Text>
          </View>
        </View>
        <Text
          style={[
            styles.stepDescription,
            status === "locked" && styles.stepTextLocked,
          ]}
        >
          {step.description}
        </Text>
        {status === "locked" && lockedReasonText ? (
          <Text style={styles.lockedReasonText}>{lockedReasonText}</Text>
        ) : null}
      </View>
    </View>
  );

  const noopPress = useCallback((_event: GestureResponderEvent) => {
    // Intentional no-op: this standalone screen has nowhere to navigate to.
    // No accessibilityHint is attached below, since this press does not
    // actually move the seller anywhere — only a visible/tap feedback state.
  }, []);

  return (
    <View style={styles.stepRow}>
      {status === "locked" ? (
        <Pressable
          disabled
          accessibilityRole="button"
          accessibilityState={{ disabled: true }}
          accessibilityLabel={`${step.title}, locked`}
          accessibilityHint={lockedReasonText ?? undefined}
          hitSlop={8}
          style={styles.stepPressable}
        >
          {rowContent}
        </Pressable>
      ) : status === "current" ? (
        <Pressable
          onPress={noopPress}
          accessibilityRole="button"
          accessibilityLabel={`${step.title}, current step`}
          hitSlop={8}
          style={({ pressed }) => [
            styles.stepPressable,
            pressed && styles.stepPressablePressed,
          ]}
        >
          {rowContent}
        </Pressable>
      ) : (
        <View style={styles.stepPressable}>{rowContent}</View>
      )}

      {status === "current" ? (
        <Pressable
          onPress={() => onMarkDone(step, isLastStep)}
          accessibilityRole="button"
          accessibilityLabel={`Mark "${step.title}" as done`}
          accessibilityHint="Updates this checklist's progress"
          hitSlop={8}
          style={({ pressed }) => [
            styles.markDoneButton,
            pressed && styles.markDoneButtonPressed,
          ]}
        >
          <Text style={styles.markDoneButtonText}>Mark as done</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

function StepStatusIcon({
  status,
  stepNumber,
}: {
  status: StepStatus;
  stepNumber: number;
}) {
  if (status === "done") {
    return (
      <View style={[styles.iconCircle, styles.iconCircleDone]}>
        <Text style={styles.iconCheckGlyph}>✓</Text>
      </View>
    );
  }
  if (status === "locked") {
    return (
      <View style={[styles.iconCircle, styles.iconCircleLocked]}>
        <View style={styles.lockShackle} />
        <View style={styles.lockBody} />
      </View>
    );
  }
  return (
    <View style={[styles.iconCircle, styles.iconCircleCurrent]}>
      <Text style={styles.iconCurrentNumberGlyph}>{stepNumber}</Text>
    </View>
  );
}

const ICON_SIZE = 28;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  content: {
    flex: 1,
    paddingHorizontal: tokens.space(4),
    paddingTop: tokens.space(4),
  },
  heading: {
    fontSize: 22,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  subheading: {
    marginTop: tokens.space(1),
    fontSize: 14,
    color: tokens.color.muted,
    lineHeight: 20,
  },
  progressSection: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: tokens.space(5),
    padding: tokens.space(3),
    backgroundColor: tokens.color.accentBg,
    borderRadius: tokens.radius.md,
  },
  progressTextCol: {
    marginLeft: tokens.space(3),
    flex: 1,
  },
  progressHeadline: {
    fontSize: 16,
    fontWeight: "700",
    color: tokens.color.ink,
    fontVariant: ["tabular-nums"],
  },
  progressSub: {
    marginTop: tokens.space(1) / 2,
    fontSize: 13,
    color: tokens.color.muted,
  },
  liveRegionContainer: {
    minHeight: tokens.space(1),
  },
  liveRegionText: {
    marginTop: tokens.space(3),
    fontSize: 13,
    fontWeight: "600",
    color: tokens.color.accent,
  },
  list: {
    marginTop: tokens.space(5),
  },
  stepRow: {
    marginBottom: tokens.space(4),
  },
  stepPressable: {
    borderRadius: tokens.radius.md,
  },
  stepPressablePressed: {
    backgroundColor: tokens.color.accentBg,
  },
  stepRowInner: {
    flexDirection: "row",
    paddingVertical: tokens.space(2),
  },
  iconCircle: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: ICON_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
    marginTop: tokens.space(1) / 2,
  },
  iconCircleDone: {
    backgroundColor: tokens.color.success,
  },
  iconCircleCurrent: {
    backgroundColor: tokens.color.bg,
    borderWidth: 2,
    borderColor: tokens.color.accent,
  },
  iconCircleLocked: {
    backgroundColor: tokens.color.bg,
    borderWidth: 2,
    borderColor: tokens.color.border,
  },
  iconCheckGlyph: {
    color: tokens.color.onAccent,
    fontSize: 15,
    fontWeight: "700",
  },
  iconCurrentNumberGlyph: {
    color: tokens.color.accent,
    fontSize: 13,
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
  },
  lockShackle: {
    position: "absolute",
    top: 5,
    width: 10,
    height: 7,
    borderWidth: 2,
    borderColor: tokens.color.faint,
    borderBottomWidth: 0,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  lockBody: {
    position: "absolute",
    bottom: 6,
    width: 13,
    height: 9,
    borderRadius: 2,
    backgroundColor: tokens.color.faint,
  },
  stepBody: {
    flex: 1,
    marginLeft: tokens.space(3),
  },
  stepTitleLine: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  stepTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: tokens.color.ink,
    marginRight: tokens.space(2),
  },
  stepTextLocked: {
    color: tokens.color.faint,
  },
  stepDescription: {
    marginTop: tokens.space(1) / 2,
    fontSize: 13,
    color: tokens.color.muted,
    lineHeight: 18,
  },
  lockedReasonText: {
    marginTop: tokens.space(1),
    fontSize: 12,
    fontWeight: "600",
    color: tokens.color.faint,
  },
  statusTag: {
    paddingHorizontal: tokens.space(2),
    paddingVertical: tokens.space(1) / 2,
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
  },
  statusTagDone: {
    backgroundColor: tokens.color.successBg,
    borderColor: tokens.color.successBorder,
  },
  statusTagCurrent: {
    backgroundColor: tokens.color.accentBg,
    borderColor: tokens.color.accent,
  },
  statusTagLocked: {
    backgroundColor: tokens.color.bg,
    borderColor: tokens.color.border,
  },
  statusTagText: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  statusTagTextDone: {
    color: tokens.color.success,
  },
  statusTagTextCurrent: {
    color: tokens.color.accent,
  },
  statusTagTextLocked: {
    color: tokens.color.faint,
  },
  markDoneButton: {
    marginLeft: ICON_SIZE + tokens.space(3),
    marginTop: tokens.space(2),
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: tokens.space(4),
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.color.accent,
    alignSelf: "flex-start",
  },
  markDoneButtonPressed: {
    backgroundColor: tokens.color.ink2,
  },
  markDoneButtonText: {
    color: tokens.color.onAccent,
    fontSize: 14,
    fontWeight: "700",
  },
});
