import { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  SafeAreaView,
  StyleSheet,
  type ListRenderItem,
} from "react-native";
import { tokens } from "../../../tokens";
import {
  RECHECK_STEPS,
  INITIAL_COMPLETION,
  CASE_REFERENCE,
  INTRO_SENTENCE,
  READY_SENTENCE,
  SUBMITTED_SENTENCE,
  type StepId,
  type RecheckStepDef,
} from "./data";

type StepRow = RecheckStepDef & { complete: boolean };
type BandState = "blocked" | "ready" | "submitted";

const HIGHLIGHT_MS = 1400;

// Pure derivation: given the 4 steps' completion booleans, which single step
// is the one currently blocking submission? Reads real state only — no
// hardcoded order of completion is enforced, this just picks which one
// sentence to show when more than one is still incomplete.
function findBlockingStep(rows: StepRow[]): StepRow | null {
  return rows.find((row) => !row.complete) ?? null;
}

export default function SellerIdentityRecheckScreen() {
  const [completion, setCompletion] =
    useState<Record<StepId, boolean>>(INITIAL_COMPLETION);
  const [submitted, setSubmitted] = useState(false);
  const [highlightedId, setHighlightedId] = useState<StepId | null>(null);

  const listRef = useRef<FlatList<StepRow>>(null);
  const highlightTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (highlightTimer.current) clearTimeout(highlightTimer.current);
    };
  }, []);

  const rows: StepRow[] = useMemo(
    () => RECHECK_STEPS.map((step) => ({ ...step, complete: completion[step.id] })),
    [completion],
  );

  const blockingStep = findBlockingStep(rows);
  const allComplete = blockingStep === null;

  const bandState: BandState = submitted
    ? "submitted"
    : allComplete
    ? "ready"
    : "blocked";

  const bandSentence =
    bandState === "submitted"
      ? SUBMITTED_SENTENCE
      : bandState === "ready"
      ? READY_SENTENCE
      : `You still need to ${blockingStep!.blockingPhrase} before you can submit for review.`;

  function markStepComplete(id: StepId) {
    if (submitted) return;
    setCompletion((prev) => (prev[id] ? prev : { ...prev, [id]: true }));
  }

  function jumpToBlockingStep() {
    if (!blockingStep) return;
    const index = rows.findIndex((row) => row.id === blockingStep.id);
    if (index === -1) return;

    listRef.current?.scrollToIndex({ index, animated: true, viewPosition: 0.2 });

    setHighlightedId(blockingStep.id);
    if (highlightTimer.current) clearTimeout(highlightTimer.current);
    highlightTimer.current = setTimeout(() => setHighlightedId(null), HIGHLIGHT_MS);
  }

  function handleBandPress() {
    if (bandState === "blocked") {
      jumpToBlockingStep();
    } else if (bandState === "ready") {
      setSubmitted(true);
    }
  }

  const renderStep: ListRenderItem<StepRow> = ({ item }) => {
    const highlighted = highlightedId === item.id;
    return (
      <View style={[styles.stepCard, highlighted && styles.stepCardHighlighted]}>
        <View style={styles.stepHeadRow}>
          <Text style={styles.stepTitleText}>{item.title}</Text>
          <View
            style={[
              styles.stepStatusChip,
              item.complete ? styles.stepStatusChipDone : styles.stepStatusChipPending,
            ]}
          >
            <Text
              style={[
                styles.stepStatusChipText,
                item.complete
                  ? styles.stepStatusChipTextDone
                  : styles.stepStatusChipTextPending,
              ]}
            >
              {item.complete ? "Complete" : "Needs action"}
            </Text>
          </View>
        </View>

        <Text style={styles.stepDetailText}>{item.detail}</Text>

        {item.complete ? (
          <Text style={styles.stepDoneLabel}>{"✓ "}{item.actionLabel} — done</Text>
        ) : (
          <Pressable
            onPress={() => markStepComplete(item.id)}
            disabled={submitted}
            hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
            accessibilityRole="button"
            accessibilityLabel={item.actionLabel}
            accessibilityHint={item.actionHint}
            style={({ pressed }) => [
              styles.stepActionButton,
              pressed && styles.stepActionButtonPressed,
            ]}
          >
            <Text style={styles.stepActionButtonText}>{item.actionLabel}</Text>
          </Pressable>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.screenRoot}>
      <View style={styles.topHeader}>
        <Text accessibilityRole="header" style={styles.headerHeading}>
          Identity Re-verification
        </Text>
        <Text style={styles.headerCaseRef}>Case {CASE_REFERENCE}</Text>
        <Text style={styles.headerLede}>{INTRO_SENTENCE}</Text>
      </View>

      <FlatList
        ref={listRef}
        data={rows}
        keyExtractor={(row) => row.id}
        renderItem={renderStep}
        contentContainerStyle={styles.stepListContent}
        ItemSeparatorComponent={() => <View style={styles.stepGap} />}
        ListFooterComponent={<View style={styles.stepListFooterSpacer} />}
        onScrollToIndexFailed={({ index, averageItemLength }) => {
          listRef.current?.scrollToOffset({
            offset: index * Math.max(averageItemLength, 1),
            animated: true,
          });
        }}
      />

      <View style={styles.footerBand} accessibilityLiveRegion="polite">
        <Text
          accessibilityRole="alert"
          style={[
            styles.footerBandSentence,
            bandState === "ready" && styles.footerBandSentenceReady,
            bandState === "submitted" && styles.footerBandSentenceSubmitted,
          ]}
        >
          {bandSentence}
        </Text>

        {bandState === "submitted" ? (
          <View style={styles.footerBandDonePill}>
            <Text style={styles.footerBandDonePillText}>Submitted</Text>
          </View>
        ) : (
          <Pressable
            onPress={handleBandPress}
            accessibilityRole="button"
            accessibilityLabel={
              bandState === "ready"
                ? "Submit for review"
                : `Go to step: ${blockingStep!.title}`
            }
            accessibilityHint={
              bandState === "ready"
                ? "Submits your identity re-verification for review."
                : "Scrolls the list to the step that still needs action."
            }
            style={({ pressed }) => [
              styles.footerBandCta,
              bandState === "ready" && styles.footerBandCtaReady,
              pressed && styles.footerBandCtaPressed,
            ]}
          >
            <Text
              style={[
                styles.footerBandCtaText,
                bandState === "ready" && styles.footerBandCtaTextReady,
              ]}
            >
              {bandState === "ready" ? "Submit for Review" : "Go to step"}
            </Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}

export { SellerIdentityRecheckScreen };

const styles = StyleSheet.create({
  screenRoot: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  topHeader: {
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(4),
    paddingBottom: tokens.space(4),
    borderBottomWidth: 1,
    borderBottomColor: tokens.color.border,
  },
  headerHeading: {
    fontSize: 22,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  headerCaseRef: {
    marginTop: tokens.space(1),
    fontSize: 12,
    fontWeight: "500",
    color: tokens.color.faint,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  headerLede: {
    marginTop: tokens.space(3),
    fontSize: 14,
    fontWeight: "400",
    color: tokens.color.muted,
    lineHeight: 20,
  },
  stepListContent: {
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(4),
  },
  stepGap: {
    height: tokens.space(3),
  },
  stepListFooterSpacer: {
    height: tokens.space(8),
  },
  stepCard: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(4),
    backgroundColor: tokens.color.bg,
    gap: tokens.space(2),
  },
  stepCardHighlighted: {
    borderColor: tokens.color.accent,
    borderWidth: 2,
  },
  stepHeadRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: tokens.space(3),
  },
  stepTitleText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  stepStatusChip: {
    paddingHorizontal: tokens.space(2),
    paddingVertical: tokens.space(1),
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
  },
  stepStatusChipDone: {
    backgroundColor: tokens.color.successBg,
    borderColor: tokens.color.successBorder,
  },
  stepStatusChipPending: {
    backgroundColor: tokens.color.warningBg,
    borderColor: tokens.color.warningBorder,
  },
  stepStatusChipText: {
    fontSize: 11,
    fontWeight: "700",
  },
  stepStatusChipTextDone: {
    color: tokens.color.success,
  },
  stepStatusChipTextPending: {
    color: tokens.color.warning,
  },
  stepDetailText: {
    fontSize: 13,
    fontWeight: "400",
    color: tokens.color.muted,
    lineHeight: 19,
  },
  stepDoneLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: tokens.color.success,
  },
  stepActionButton: {
    alignSelf: "flex-start",
    minHeight: 44,
    paddingHorizontal: tokens.space(4),
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  stepActionButtonPressed: {
    backgroundColor: tokens.color.accentBg,
  },
  stepActionButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: tokens.color.accent,
  },
  footerBand: {
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(3),
    paddingBottom: tokens.space(5),
    gap: tokens.space(3),
  },
  footerBandSentence: {
    fontSize: 13,
    fontWeight: "600",
    color: tokens.color.warning,
  },
  footerBandSentenceReady: {
    color: tokens.color.ink2,
  },
  footerBandSentenceSubmitted: {
    color: tokens.color.success,
  },
  footerBandCta: {
    minHeight: 48,
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  footerBandCtaPressed: {
    backgroundColor: tokens.color.accentBg,
  },
  footerBandCtaReady: {
    backgroundColor: tokens.color.accent,
    borderColor: tokens.color.accent,
  },
  footerBandCtaText: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.accent,
  },
  footerBandCtaTextReady: {
    color: tokens.color.onAccent,
  },
  footerBandDonePill: {
    minHeight: 48,
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.color.successBg,
    borderWidth: 1,
    borderColor: tokens.color.successBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  footerBandDonePillText: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.success,
  },
});
