import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  SafeAreaView,
  StyleSheet,
  AccessibilityInfo,
  findNodeHandle,
  type ListRenderItem,
} from "react-native";
import { tokens } from "../../../tokens";
import {
  INITIAL_STEPS,
  CASE_ID,
  BLOCK_REASON,
  RESOLVED_MESSAGE,
  type ReverificationStep,
} from "./data";

const HIGHLIGHT_DURATION_MS = 1600;
const FOCUS_SETTLE_DELAY_MS = 350;

// Pure derivation — no hidden state. Given the checklist, says which step
// (if any) is the one currently blocking progress.
function nextBlockingStep(
  steps: ReverificationStep[],
): ReverificationStep | null {
  return steps.find((step) => step.status === "pending") ?? null;
}

function remainingCount(steps: ReverificationStep[]): number {
  return steps.filter((step) => step.status === "pending").length;
}

function bandSentence(steps: ReverificationStep[]): string {
  const remaining = remainingCount(steps);
  if (remaining === 0) {
    return RESOLVED_MESSAGE;
  }
  const next = nextBlockingStep(steps);
  const noun = remaining === 1 ? "step" : "steps";
  return `${remaining} of ${steps.length} ${noun} remaining — next: ${next?.actionLabel}`;
}

export function IdentityReverificationScreen() {
  const [steps, setSteps] = useState<ReverificationStep[]>(INITIAL_STEPS);
  const [highlightedStepId, setHighlightedStepId] = useState<string | null>(
    null,
  );

  const listRef = useRef<FlatList<ReverificationStep>>(null);
  const stepNodeRefs = useRef(new Map<string, View | null>());
  const highlightTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const focusTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (highlightTimer.current) clearTimeout(highlightTimer.current);
      if (focusTimer.current) clearTimeout(focusTimer.current);
    };
  }, []);

  const remaining = remainingCount(steps);
  const next = nextBlockingStep(steps);
  const sentence = bandSentence(steps);

  function markSubmitted(stepId: string) {
    setSteps((prev) =>
      prev.map((step) =>
        step.id === stepId
          ? { ...step, status: "done" as const, completedOn: "Today" }
          : step,
      ),
    );
  }

  function jumpToNextStep() {
    if (!next) return;
    const index = steps.findIndex((step) => step.id === next.id);
    if (index === -1) return;

    listRef.current?.scrollToIndex({
      index,
      animated: true,
      viewPosition: 0.15,
    });

    setHighlightedStepId(next.id);
    if (highlightTimer.current) clearTimeout(highlightTimer.current);
    highlightTimer.current = setTimeout(
      () => setHighlightedStepId(null),
      HIGHLIGHT_DURATION_MS,
    );

    if (focusTimer.current) clearTimeout(focusTimer.current);
    focusTimer.current = setTimeout(() => {
      const node = stepNodeRefs.current.get(next.id);
      const handle = node ? findNodeHandle(node) : null;
      if (handle) {
        AccessibilityInfo.setAccessibilityFocus(handle);
      }
    }, FOCUS_SETTLE_DELAY_MS);
  }

  const renderStep: ListRenderItem<ReverificationStep> = ({ item }) => {
    const isDone = item.status === "done";
    const isHighlighted = highlightedStepId === item.id;
    return (
      <View
        ref={(node) => {
          stepNodeRefs.current.set(item.id, node);
        }}
        style={[styles.stepCard, isHighlighted && styles.stepCardHighlighted]}
      >
        <View style={styles.stepTopRow}>
          <Text style={styles.stepTitle}>{item.title}</Text>
          <View
            style={[
              styles.statusPill,
              isDone ? styles.statusPillDone : styles.statusPillPending,
            ]}
          >
            <Text
              style={[
                styles.statusPillText,
                isDone
                  ? styles.statusPillTextDone
                  : styles.statusPillTextPending,
              ]}
            >
              {isDone ? "Submitted" : "Action needed"}
            </Text>
          </View>
        </View>

        <Text style={styles.stepDescription}>{item.description}</Text>

        {isDone ? (
          <Text style={styles.stepMeta}>Submitted {item.completedOn}</Text>
        ) : (
          <Pressable
            onPress={() => markSubmitted(item.id)}
            accessibilityRole="button"
            accessibilityLabel={`Mark "${item.title}" as submitted`}
            accessibilityHint="Marks this step as submitted and complete."
            hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
            style={({ pressed }) => [
              styles.submitButton,
              pressed && styles.submitButtonPressed,
            ]}
          >
            <Text style={styles.submitButtonText}>Mark as submitted</Text>
          </Pressable>
        )}
      </View>
    );
  };

  const listHeader = (
    <View style={styles.headerBlock}>
      <Text style={styles.heading} accessibilityRole="header">
        Identity Re-verification
      </Text>
      <Text style={styles.subheading}>
        Case {CASE_ID} · Seller payouts on hold
      </Text>

      <View style={styles.reasonCard}>
        <Text style={styles.reasonLabel}>Why payouts are paused</Text>
        <Text style={styles.reasonText}>{BLOCK_REASON}</Text>
      </View>

      <Text style={styles.sectionTitle} accessibilityRole="header">
        Re-verification checklist
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        ref={listRef}
        data={steps}
        keyExtractor={(step) => step.id}
        renderItem={renderStep}
        ListHeaderComponent={listHeader}
        ListFooterComponent={<View style={styles.footerSpacer} />}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.stepGap} />}
        onScrollToIndexFailed={({ index, averageItemLength }) => {
          listRef.current?.scrollToOffset({
            offset: index * averageItemLength,
            animated: true,
          });
          setTimeout(() => {
            listRef.current?.scrollToIndex({ index, animated: true });
          }, 60);
        }}
      />

      <View style={styles.band} accessibilityLiveRegion="polite">
        <Text
          style={[
            styles.bandSentence,
            remaining === 0 && styles.bandSentenceResolved,
          ]}
          accessibilityRole="alert"
        >
          {sentence}
        </Text>

        {next ? (
          <Pressable
            onPress={jumpToNextStep}
            accessibilityRole="button"
            accessibilityLabel={`Go to next step: ${next.actionLabel}`}
            accessibilityHint="Scrolls the checklist to the step that still needs action."
            style={({ pressed }) => [
              styles.bandButton,
              pressed && styles.bandButtonPressed,
            ]}
          >
            <Text style={styles.bandButtonText}>Go to next step</Text>
          </Pressable>
        ) : (
          <View style={styles.bandResolvedPill}>
            <Text style={styles.bandResolvedPillText}>
              Checklist complete
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: tokens.color.bg },
  listContent: {
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(5),
  },
  headerBlock: {
    marginBottom: tokens.space(3),
  },
  heading: {
    fontSize: 24,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  subheading: {
    fontSize: 13,
    color: tokens.color.muted,
    marginTop: tokens.space(2),
  },
  reasonCard: {
    marginTop: tokens.space(5),
    padding: tokens.space(4),
    borderWidth: 1,
    borderColor: tokens.color.warningBorder,
    backgroundColor: tokens.color.warningBg,
    borderRadius: tokens.radius.md,
    gap: tokens.space(1),
  },
  reasonLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: tokens.color.warning,
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  reasonText: {
    fontSize: 13,
    color: tokens.color.warning,
    lineHeight: 19,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: tokens.color.ink,
    marginTop: tokens.space(7),
  },
  stepGap: { height: tokens.space(3) },
  stepCard: {
    padding: tokens.space(4),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    gap: tokens.space(2),
  },
  stepCardHighlighted: {
    borderColor: tokens.color.accent,
    borderWidth: 2,
  },
  stepTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: tokens.space(3),
  },
  stepTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  statusPill: {
    paddingHorizontal: tokens.space(2),
    paddingVertical: tokens.space(1),
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
  },
  statusPillDone: {
    backgroundColor: tokens.color.successBg,
    borderColor: tokens.color.successBorder,
  },
  statusPillPending: {
    backgroundColor: tokens.color.warningBg,
    borderColor: tokens.color.warningBorder,
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: "700",
  },
  statusPillTextDone: {
    color: tokens.color.success,
  },
  statusPillTextPending: {
    color: tokens.color.warning,
  },
  stepDescription: {
    fontSize: 13,
    color: tokens.color.muted,
    lineHeight: 19,
  },
  stepMeta: {
    fontSize: 12,
    color: tokens.color.faint,
  },
  submitButton: {
    alignSelf: "flex-start",
    minHeight: 44,
    paddingHorizontal: tokens.space(4),
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  submitButtonPressed: {
    backgroundColor: tokens.color.accentBg,
  },
  submitButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: tokens.color.accent,
  },
  footerSpacer: { height: tokens.space(10) },
  band: {
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(3),
    paddingBottom: tokens.space(5),
    gap: tokens.space(3),
  },
  bandSentence: {
    fontSize: 13,
    fontWeight: "600",
    color: tokens.color.ink2,
  },
  bandSentenceResolved: {
    color: tokens.color.success,
  },
  bandButton: {
    minHeight: 48,
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.color.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  bandButtonPressed: {
    opacity: 0.85,
  },
  bandButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.onAccent,
  },
  bandResolvedPill: {
    minHeight: 48,
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.color.successBg,
    borderWidth: 1,
    borderColor: tokens.color.successBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  bandResolvedPillText: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.success,
  },
});

export default IdentityReverificationScreen;
