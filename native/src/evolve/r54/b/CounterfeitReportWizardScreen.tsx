// native/src/evolve/r54/b/CounterfeitReportWizardScreen.tsx — auto-native-r54
// candidate b.
//
// Report a Counterfeit Item — Guided Evidence Submission. A true ordered
// stepper: exactly one step's content is visible at a time, a persistent
// "Step N of 3" header (+ 3 step dots) always shows WHERE the user is in the
// sequence, and Back/Next are explicit navigation controls — architecturally
// different from a single blocked/ready/done band, which only ever says
// whether the user can proceed, never where they are in an ordered sequence.
// native/GENERATION.md §3's band doctrine (blocked workflow ⇒ state machine)
// is deliberately NOT applied to the step-dots header: that header is
// persistent step-position chrome, always rendered, never conditionally
// withheld. The footer Back/Next row is ordinary stepper navigation, not a
// band that renames itself locked/ready/done — there is no single footer
// element whose own text changes to explain "why you can't proceed"; Next
// simply disables, and the step content itself (radio list / character
// count) already says why.
//
// Nearest neighbors read before building this — none is a one-step-visible
// stepper with real Back navigation:
//   - native/src/authentication/ItemAuthenticationScreen.tsx and
//     native/src/certificate/AuthenticationCertificateScreen.tsx are a
//     pre-listing authentication *submission* (one scrolling checklist +
//     blocked/ready/done band, no Back, no step-of-N header) and a completed
//     *certificate* display (persistent action bar, nothing blocked),
//     respectively — a request flow and a result view, not a guided report.
//   - native/src/evolve/r44/a/AuthenticityEscalationScreen.tsx is the
//     nearest domain neighbor (a buyer disputing a completed order's
//     authenticity) but is a single ScrollView gated by a blocked/ready/done
//     band checking two requirements at once — no step index, no Back, the
//     entire form is visible simultaneously.
//   - native/src/evolve/r49/c/SellerOnboardingChecklistScreen.tsx is the
//     nearest *structural* neighbor (an ordered sequence of steps) but shows
//     every step expanded on one screen at once with no Back and no
//     single-step-at-a-time view. This screen is its structural opposite:
//     exactly one step renders, the rest are deliberately hidden, and moving
//     backward is a first-class action.
//
// Step validity is NOT cached: `isStepComplete` below is a plain function of
// live state (selectedReasonId / noteTrimmedLength), recomputed fresh on
// every render — never stored in a ref or an effect-set value that could go
// stale, per this round's binding directive on blocking conditions.
//
// Accessibility — exactly one live region on screen, the step-content
// container (accessibilityLiveRegion="polite"). Only the "Step N of 3" line
// and the submitted-confirmation headline carry accessibilityRole="alert" —
// those are the points where the user's ability to proceed, or what the
// screen even is, actually changes. The character-count-remaining text in
// step 2 is deliberately NOT a live region of its own (that would be a
// second, nested one on screen at once, which native/GENERATION.md §4 rules
// out): it updates silently on every keystroke and the Next button's
// accessibilityState.disabled is the thing a screen reader user actually
// acts on, so nothing re-announces per character typed.
//
// Surface-transition doctrine, extended: step 3's "Submit Report" flips that
// same step-content area into an in-place "Report submitted" state — no
// native Alert, no navigation away, same container, same live region. This
// doctrine was validated for destructive confirms (cancel/withdraw, where
// something is undone); here it is applied to a *final submit* instead,
// which is a different context (nothing is cancelled or reversed) — called
// out explicitly here and in this round's candidate notes so it is judged as
// a candidate generalization, not assumed equivalent.
import { useState } from "react";
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { tokens } from "../../../tokens";
import {
  CASE_REFERENCE,
  MAX_NOTE_LENGTH,
  MIN_NOTE_LENGTH,
  REPORT_REASONS,
  REPORTED_ITEM,
  SUBMITTED_NOTE,
  WIZARD_STEPS,
  type ReportReason,
  type ReportReasonId,
  type WizardStepId,
} from "./data";

const HIT_SLOP = { top: 10, bottom: 10, left: 10, right: 10 };
const TOTAL_STEPS = WIZARD_STEPS.length;

export function CounterfeitReportWizardScreen() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selectedReasonId, setSelectedReasonId] = useState<ReportReasonId | null>(
    null,
  );
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const currentStep = WIZARD_STEPS[currentStepIndex];
  const noteTrimmedLength = note.trim().length;
  const remainingChars = Math.max(MIN_NOTE_LENGTH - noteTrimmedLength, 0);

  // Per-step validator — a plain function of live state, recomputed on every
  // render. This is the thing the brief calls a "per-step validator
  // function"; it is intentionally not memoized against anything that could
  // go stale.
  function isStepComplete(stepId: WizardStepId): boolean {
    switch (stepId) {
      case "reason":
        return selectedReasonId !== null;
      case "details":
        return noteTrimmedLength >= MIN_NOTE_LENGTH;
      case "review":
        return true;
      default:
        return false;
    }
  }

  const canAdvance = isStepComplete(currentStep.id);
  const selectedReason =
    REPORT_REASONS.find((reason) => reason.id === selectedReasonId) ?? null;

  const goNext = () => {
    if (!canAdvance) return;
    setCurrentStepIndex((index) => Math.min(index + 1, TOTAL_STEPS - 1));
  };

  const goBack = () => {
    setCurrentStepIndex((index) => Math.max(index - 1, 0));
  };

  const goToStep = (index: number) => {
    // Jumping ahead of the current step is never allowed — only a step
    // already reached (completed or current) can be tapped back to.
    if (index > currentStepIndex) return;
    setCurrentStepIndex(index);
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.kicker}>REPICK TRUST & SAFETY</Text>
        <Text style={styles.title} accessibilityRole="header">
          Report a Counterfeit Item
        </Text>
        <Text style={styles.itemLine} numberOfLines={1}>
          {REPORTED_ITEM.brand} · {REPORTED_ITEM.title} · {REPORTED_ITEM.orderRef}
        </Text>
      </View>

      <StepperHeader
        currentStepIndex={currentStepIndex}
        submitted={submitted}
        onStepPress={goToStep}
      />

      <View style={styles.stepContent} accessibilityLiveRegion="polite">
        {submitted ? (
          <ConfirmationStep />
        ) : (
          <>
            <Text style={styles.stepOfLabel} accessibilityRole="alert">
              Step {currentStepIndex + 1} of {TOTAL_STEPS}
            </Text>
            <Text style={styles.stepTitle} accessibilityRole="header">
              {currentStep.title}
            </Text>

            {currentStep.id === "reason" ? (
              <ReasonStep selectedReasonId={selectedReasonId} onSelect={setSelectedReasonId} />
            ) : null}

            {currentStep.id === "details" ? (
              <DetailsStep
                note={note}
                onChangeNote={setNote}
                remainingChars={remainingChars}
                noteTrimmedLength={noteTrimmedLength}
              />
            ) : null}

            {currentStep.id === "review" ? (
              <ReviewStep selectedReason={selectedReason} note={note.trim()} />
            ) : null}
          </>
        )}
      </View>

      {!submitted ? (
        <View style={styles.footer}>
          <Pressable
            onPress={goBack}
            disabled={currentStepIndex === 0}
            accessibilityRole="button"
            accessibilityLabel="Back"
            accessibilityHint={
              currentStepIndex === 0
                ? undefined
                : `Returns to step ${currentStepIndex} of ${TOTAL_STEPS}`
            }
            accessibilityState={{ disabled: currentStepIndex === 0 }}
            hitSlop={HIT_SLOP}
            style={({ pressed }) => [
              styles.backButton,
              currentStepIndex === 0 && styles.backButtonDisabled,
              pressed && currentStepIndex !== 0 && styles.pressed,
            ]}
          >
            <Text
              style={[
                styles.backButtonText,
                currentStepIndex === 0 && styles.backButtonTextDisabled,
              ]}
            >
              Back
            </Text>
          </Pressable>

          {currentStep.id === "review" ? (
            <Pressable
              onPress={handleSubmit}
              accessibilityRole="button"
              accessibilityLabel={`Submit report for ${REPORTED_ITEM.title}`}
              accessibilityHint="Submits this counterfeit report for review"
              hitSlop={HIT_SLOP}
              style={({ pressed }) => [styles.nextButton, pressed && styles.pressed]}
            >
              <Text style={styles.nextButtonText}>Submit Report</Text>
            </Pressable>
          ) : (
            <Pressable
              onPress={goNext}
              disabled={!canAdvance}
              accessibilityRole="button"
              accessibilityLabel="Next"
              accessibilityHint={
                canAdvance
                  ? `Moves to step ${currentStepIndex + 2} of ${TOTAL_STEPS}`
                  : undefined
              }
              accessibilityState={{ disabled: !canAdvance }}
              hitSlop={HIT_SLOP}
              style={({ pressed }) => [
                styles.nextButton,
                !canAdvance && styles.nextButtonDisabled,
                pressed && canAdvance && styles.pressed,
              ]}
            >
              <Text
                style={[
                  styles.nextButtonText,
                  !canAdvance && styles.nextButtonTextDisabled,
                ]}
              >
                Next
              </Text>
            </Pressable>
          )}
        </View>
      ) : null}
    </SafeAreaView>
  );
}

export default CounterfeitReportWizardScreen;

// ---- Stepper header ---------------------------------------------------

function StepperHeader({
  currentStepIndex,
  submitted,
  onStepPress,
}: {
  currentStepIndex: number;
  submitted: boolean;
  onStepPress: (index: number) => void;
}) {
  return (
    <View style={styles.stepperSection}>
      <View style={styles.stepperDotsRow}>
        {WIZARD_STEPS.map((step, index) => {
          const isCompleted = submitted || index < currentStepIndex;
          const isCurrent = !submitted && index === currentStepIndex;
          const isReachable = index <= currentStepIndex && !submitted;
          const stateWord = isCompleted
            ? "completed"
            : isCurrent
              ? "current step"
              : "not yet reached";

          return (
            <View key={step.id} style={styles.stepperSegment}>
              <Pressable
                onPress={() => onStepPress(index)}
                disabled={!isReachable}
                accessibilityRole="button"
                accessibilityLabel={`${step.shortLabel}, step ${index + 1} of ${TOTAL_STEPS}, ${stateWord}`}
                accessibilityHint={
                  isReachable && !isCurrent ? `Returns to step ${index + 1} of ${TOTAL_STEPS}` : undefined
                }
                accessibilityState={{ disabled: !isReachable, selected: isCurrent }}
                hitSlop={HIT_SLOP}
                style={[
                  styles.stepDot,
                  isCompleted && styles.stepDotCompleted,
                  isCurrent && styles.stepDotCurrent,
                ]}
              >
                {isCompleted ? (
                  <Text style={styles.stepDotGlyphOn}>{"✓"}</Text>
                ) : (
                  <Text
                    style={[styles.stepDotGlyph, isCurrent && styles.stepDotGlyphCurrent]}
                  >
                    {index + 1}
                  </Text>
                )}
              </Pressable>
              {index < WIZARD_STEPS.length - 1 ? (
                <View style={[styles.stepConnector, isCompleted && styles.stepConnectorDone]} />
              ) : null}
            </View>
          );
        })}
      </View>
      <View style={styles.stepperLabelsRow}>
        {WIZARD_STEPS.map((step, index) => {
          const isActive = submitted || index <= currentStepIndex;
          return (
            <Text
              key={step.id}
              style={[styles.stepDotLabel, isActive && styles.stepDotLabelActive]}
              numberOfLines={1}
            >
              {step.shortLabel}
            </Text>
          );
        })}
      </View>
    </View>
  );
}

// ---- Step 1: reason -----------------------------------------------------

function ReasonStep({
  selectedReasonId,
  onSelect,
}: {
  selectedReasonId: ReportReasonId | null;
  onSelect: (id: ReportReasonId) => void;
}) {
  return (
    <View style={styles.reasonList}>
      {REPORT_REASONS.map((reason) => {
        const checked = selectedReasonId === reason.id;
        return (
          <Pressable
            key={reason.id}
            onPress={() => onSelect(reason.id)}
            accessibilityRole="radio"
            accessibilityState={{ checked }}
            accessibilityLabel={reason.label}
            accessibilityHint="Selects this as the reason for your report"
            hitSlop={HIT_SLOP}
            style={({ pressed }) => [
              styles.reasonRow,
              checked && styles.reasonRowChecked,
              pressed && styles.pressed,
            ]}
          >
            <View style={[styles.radioOuter, checked && styles.radioOuterChecked]}>
              {checked ? <View style={styles.radioInner} /> : null}
            </View>
            <View style={styles.reasonBody}>
              <Text style={[styles.reasonLabel, checked && styles.reasonLabelChecked]}>
                {reason.label}
              </Text>
              <Text style={styles.reasonHelp}>{reason.helpText}</Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

// ---- Step 2: details ------------------------------------------------------

function DetailsStep({
  note,
  onChangeNote,
  remainingChars,
  noteTrimmedLength,
}: {
  note: string;
  onChangeNote: (value: string) => void;
  remainingChars: number;
  noteTrimmedLength: number;
}) {
  const meetsMinimum = remainingChars === 0;
  return (
    <View style={styles.detailsWrap}>
      <Text style={styles.detailsHint}>
        Tell us specifically what looks wrong — stitching, hardware, markings,
        packaging, anything unusual.
      </Text>
      <TextInput
        value={note}
        onChangeText={onChangeNote}
        placeholder="e.g. The zipper pull has a different logo stamp than the authentic reference, and the lining fabric feels thinner."
        placeholderTextColor={tokens.color.faint}
        multiline
        numberOfLines={6}
        maxLength={MAX_NOTE_LENGTH}
        accessibilityLabel="Describe what you found"
        accessibilityHint={`Write at least ${MIN_NOTE_LENGTH} characters`}
        style={styles.noteInput}
      />
      {/* Deliberately silent — see the file header note on live regions.
         This is a visual-only live count; screen reader users act on the
         Next button's disabled accessibilityState instead. */}
      <Text style={[styles.remainingText, meetsMinimum && styles.remainingTextMet]}>
        {meetsMinimum
          ? `${noteTrimmedLength} characters — minimum met`
          : `${remainingChars} more character${remainingChars === 1 ? "" : "s"} needed`}
      </Text>
    </View>
  );
}

// ---- Step 3: review -------------------------------------------------------

function ReviewStep({
  selectedReason,
  note,
}: {
  selectedReason: ReportReason | null;
  note: string;
}) {
  return (
    <View style={styles.reviewWrap}>
      <View style={styles.reviewBlock}>
        <Text style={styles.reviewLabel}>Reason</Text>
        <Text style={styles.reviewValue}>{selectedReason?.label ?? "—"}</Text>
      </View>
      <View style={styles.reviewBlock}>
        <Text style={styles.reviewLabel}>Your note</Text>
        <Text style={styles.reviewValue}>{note}</Text>
      </View>
      <Text style={styles.reviewFootnote}>
        This goes to repick&apos;s Trust &amp; Safety team along with the order
        record above. You can still go back and change anything before
        submitting.
      </Text>
    </View>
  );
}

// ---- Confirmation ----------------------------------------------------------

function ConfirmationStep() {
  return (
    <View style={styles.confirmWrap}>
      <View
        style={styles.confirmBadge}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        <Text style={styles.confirmBadgeGlyph}>{"✓"}</Text>
      </View>
      <Text style={styles.confirmHeadline} accessibilityRole="alert">
        Report submitted
      </Text>
      <Text style={styles.confirmReference}>Reference {CASE_REFERENCE}</Text>
      <Text style={styles.confirmNote}>{SUBMITTED_NOTE}</Text>
    </View>
  );
}

const DOT_SIZE = 32;

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: tokens.color.bg },

  header: {
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(4),
    paddingBottom: tokens.space(3),
    gap: tokens.space(1),
  },
  kicker: { fontSize: 11, letterSpacing: 1.6, fontWeight: "700", color: tokens.color.faint },
  title: {
    fontSize: 24,
    fontWeight: "700",
    letterSpacing: -0.3,
    color: tokens.color.ink,
  },
  itemLine: { fontSize: 12, color: tokens.color.muted },

  // -- stepper header --
  stepperSection: {
    paddingHorizontal: tokens.space(5),
    paddingBottom: tokens.space(4),
    borderBottomWidth: 1,
    borderBottomColor: tokens.color.border,
    gap: tokens.space(1),
  },
  stepperDotsRow: { flexDirection: "row", alignItems: "center" },
  stepperSegment: { flex: 1, flexDirection: "row", alignItems: "center" },
  stepDot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    borderWidth: 1.5,
    borderColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    alignItems: "center",
    justifyContent: "center",
  },
  stepDotCurrent: {
    borderColor: tokens.color.accent,
    backgroundColor: tokens.color.accentBg,
    borderWidth: 2,
  },
  stepDotCompleted: {
    borderColor: tokens.color.accent,
    backgroundColor: tokens.color.accent,
  },
  stepDotGlyph: {
    fontSize: 13,
    fontWeight: "700",
    color: tokens.color.faint,
    fontVariant: ["tabular-nums"],
  },
  stepDotGlyphCurrent: { color: tokens.color.accent },
  stepDotGlyphOn: { fontSize: 14, fontWeight: "700", color: tokens.color.onAccent },
  stepConnector: {
    flex: 1,
    height: 2,
    marginHorizontal: tokens.space(1),
    backgroundColor: tokens.color.border,
    borderRadius: 1,
  },
  stepConnectorDone: { backgroundColor: tokens.color.accent },
  stepperLabelsRow: { flexDirection: "row" },
  stepDotLabel: {
    flex: 1,
    fontSize: 11,
    fontWeight: "600",
    color: tokens.color.faint,
  },
  stepDotLabelActive: { color: tokens.color.ink2 },

  // -- step content --
  stepContent: {
    flex: 1,
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(4),
    gap: tokens.space(1),
  },
  stepOfLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.4,
    color: tokens.color.accent,
    textTransform: "uppercase",
  },
  stepTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: tokens.color.ink,
    marginBottom: tokens.space(3),
  },

  // -- step 1: reason --
  reasonList: { gap: tokens.space(3) },
  reasonRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: tokens.space(3),
    minHeight: 44,
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(3),
  },
  reasonRowChecked: {
    borderColor: tokens.color.accent,
    backgroundColor: tokens.color.accentBg,
  },
  radioOuter: {
    width: 22,
    height: 22,
    marginTop: 1,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
  },
  radioOuterChecked: { borderColor: tokens.color.accent },
  radioInner: {
    width: 11,
    height: 11,
    borderRadius: 5.5,
    backgroundColor: tokens.color.accent,
  },
  reasonBody: { flex: 1, gap: 2 },
  reasonLabel: { fontSize: 14, fontWeight: "600", color: tokens.color.ink },
  reasonLabelChecked: { color: tokens.color.accent },
  reasonHelp: { fontSize: 12, lineHeight: 17, color: tokens.color.muted },

  // -- step 2: details --
  detailsWrap: { gap: tokens.space(2) },
  detailsHint: { fontSize: 13, lineHeight: 19, color: tokens.color.muted },
  noteInput: {
    minHeight: 140,
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(3),
    fontSize: 14,
    lineHeight: 20,
    color: tokens.color.ink,
    textAlignVertical: "top",
  },
  remainingText: { fontSize: 12, fontWeight: "600", color: tokens.color.faint },
  remainingTextMet: { color: tokens.color.success },

  // -- step 3: review --
  reviewWrap: { gap: tokens.space(4) },
  reviewBlock: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(3),
    gap: 3,
  },
  reviewLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.4,
    textTransform: "uppercase",
    color: tokens.color.faint,
  },
  reviewValue: { fontSize: 14, lineHeight: 20, color: tokens.color.ink2 },
  reviewFootnote: { fontSize: 12, lineHeight: 18, color: tokens.color.faint },

  // -- confirmation --
  confirmWrap: { alignItems: "center", paddingTop: tokens.space(8), gap: tokens.space(2) },
  confirmBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: tokens.color.accent,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: tokens.space(2),
  },
  confirmBadgeGlyph: { fontSize: 26, fontWeight: "700", color: tokens.color.onAccent },
  confirmHeadline: { fontSize: 20, fontWeight: "700", color: tokens.color.ink },
  confirmReference: {
    fontSize: 13,
    fontWeight: "700",
    color: tokens.color.accent,
    fontVariant: ["tabular-nums"],
  },
  confirmNote: {
    fontSize: 13,
    lineHeight: 19,
    color: tokens.color.muted,
    textAlign: "center",
    paddingHorizontal: tokens.space(6),
    marginTop: tokens.space(1),
  },

  // -- footer nav --
  footer: {
    flexDirection: "row",
    gap: tokens.space(3),
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(3),
    paddingBottom: tokens.space(4),
  },
  pressed: { opacity: 0.8 },
  backButton: {
    minHeight: 48,
    minWidth: 88,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.border,
    paddingHorizontal: tokens.space(4),
  },
  backButtonDisabled: { borderColor: tokens.color.border, opacity: 0.4 },
  backButtonText: { fontSize: 15, fontWeight: "700", color: tokens.color.ink2 },
  backButtonTextDisabled: { color: tokens.color.faint },
  nextButton: {
    flex: 1,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.color.accent,
    paddingHorizontal: tokens.space(4),
  },
  nextButtonDisabled: { backgroundColor: tokens.color.border },
  nextButtonText: { fontSize: 15, fontWeight: "700", color: tokens.color.onAccent },
  nextButtonTextDisabled: { color: tokens.color.faint },
});
