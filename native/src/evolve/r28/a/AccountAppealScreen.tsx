// native/src/evolve/r28/a/AccountAppealScreen.tsx — auto-native-r28 candidate a.
//
// Concept: "Appeal Your Suspension" — a suspended seller/buyer files a
// written appeal against an account suspension. The fixed bottom band is a
// blocked-workflow state machine: it names, in one sentence, exactly what's
// still missing (pick a reason → write enough explanation → nothing else is
// required), and only becomes the real "Submit appeal" action once both are
// satisfied. Evidence references are optional and never gate the band —
// they only move the live case-strength meter.
//
// Band tap is never a dead disabled control: while blocked it scrolls you to
// the section you still need to finish (and focuses the explanation field),
// and once ready it actually files the appeal. Filing is itself undone,
// automatically, the moment the underlying answers no longer match what was
// filed — "isFiled" is a derived comparison every render, not a flag that
// can go stale, so there is never a submitted-looking band sitting on top
// of edited answers.
//
// Accessibility: exactly one accessibilityLiveRegion on the whole screen
// (the band container). Only the band's status sentence carries
// accessibilityRole="alert" — the live case-strength meter next to it is a
// plain, non-live accessibilityLabel so a single edit never fires two
// simultaneous announcements.

import { useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { tokens } from "../../../tokens";
import {
  APPEAL_GROUNDS,
  SUSPENSION_NOTICE,
  EVIDENCE_LIBRARY,
  MAX_EVIDENCE_REFS,
  MIN_STATEMENT_CHARS,
  computeCaseStrength,
  strengthTier,
  buildAppealReference,
  type AppealGroundId,
  type StrengthTone,
} from "./data";

interface Answers {
  groundId: AppealGroundId | null;
  statement: string;
  evidenceRefs: string[];
}

interface Filing {
  reference: string;
  snapshot: Answers;
}

type Lane =
  | { kind: "needGround"; retracted: boolean; priorReference: string | null }
  | {
      kind: "needDetail";
      remaining: number;
      retracted: boolean;
      priorReference: string | null;
    }
  | { kind: "ready"; retracted: boolean; priorReference: string | null }
  | { kind: "filed"; reference: string };

const INITIAL_ANSWERS: Answers = { groundId: null, statement: "", evidenceRefs: [] };

function sameAnswers(a: Answers, b: Answers): boolean {
  return (
    a.groundId === b.groundId &&
    a.statement.trim() === b.statement.trim() &&
    a.evidenceRefs.join("|") === b.evidenceRefs.join("|")
  );
}

// Pure, derived every render from the current answers + the last filing (if
// any) — there is no separate "submitted" boolean that edits could leave
// stale. The moment answers diverge from filing.snapshot, isFiled flips back
// to false on its own.
function deriveLane(answers: Answers, filing: Filing | null): Lane {
  const isStale = filing !== null && !sameAnswers(filing.snapshot, answers);
  if (filing !== null && !isStale) {
    return { kind: "filed", reference: filing.reference };
  }
  const retracted = filing !== null; // filing exists but is stale
  const priorReference = filing ? filing.reference : null;

  if (!answers.groundId) {
    return { kind: "needGround", retracted, priorReference };
  }
  const trimmedLength = answers.statement.trim().length;
  if (trimmedLength < MIN_STATEMENT_CHARS) {
    return {
      kind: "needDetail",
      remaining: MIN_STATEMENT_CHARS - trimmedLength,
      retracted,
      priorReference,
    };
  }
  return { kind: "ready", retracted, priorReference };
}

function describeLane(lane: Lane): {
  message: string;
  actionLabel: string;
  hint: string;
  tone: "blocked" | "ready" | "filed";
} {
  switch (lane.kind) {
    case "needGround": {
      const prefix =
        lane.retracted && lane.priorReference
          ? `Your filed appeal ${lane.priorReference} was withdrawn because you changed it. `
          : "";
      return {
        message: `${prefix}Select the reason that best matches your suspension to continue.`,
        actionLabel: "Go to appeal reason",
        hint: "Scrolls to the appeal reason selection.",
        tone: "blocked",
      };
    }
    case "needDetail": {
      const prefix =
        lane.retracted && lane.priorReference
          ? `Your filed appeal ${lane.priorReference} was withdrawn because you changed it. `
          : "";
      const unit = lane.remaining === 1 ? "character" : "characters";
      return {
        message: `${prefix}Add ${lane.remaining} more ${unit} to your explanation before you can file.`,
        actionLabel: "Go to explanation",
        hint: "Scrolls to the explanation field and focuses it.",
        tone: "blocked",
      };
    }
    case "ready": {
      const verb = lane.retracted ? "Resubmit" : "Submit";
      const message =
        lane.retracted && lane.priorReference
          ? `Your filed appeal ${lane.priorReference} was withdrawn because you changed it. You're ready to refile — review your answers, then tap below.`
          : "Ready to file. Review your answers, then tap below to submit.";
      return {
        message,
        actionLabel: `${verb} appeal for review`,
        hint: "Files your appeal for review by the trust and safety team.",
        tone: "ready",
      };
    }
    case "filed":
      return {
        message: `Appeal ${lane.reference} filed for review. Changing your reason, explanation, or references will withdraw this submission until you refile.`,
        actionLabel: "Back to top",
        hint: "Scrolls back to the top of your filed appeal.",
        tone: "filed",
      };
  }
}

function toneColor(tone: StrengthTone): string {
  switch (tone) {
    case "faint":
      return tokens.color.faint;
    case "warning":
      return tokens.color.warning;
    case "accent":
      return tokens.color.accent;
    case "success":
      return tokens.color.success;
  }
}

export default function AccountAppealScreen() {
  const [answers, setAnswers] = useState<Answers>(INITIAL_ANSWERS);
  const [filing, setFiling] = useState<Filing | null>(null);
  const [groundSectionY, setGroundSectionY] = useState(0);
  const [statementSectionY, setStatementSectionY] = useState(0);

  const scrollRef = useRef<ScrollView>(null);
  const statementInputRef = useRef<TextInput>(null);

  const trimmedLength = answers.statement.trim().length;
  const hasGround = answers.groundId !== null;
  const score = computeCaseStrength(hasGround, trimmedLength, answers.evidenceRefs.length);
  const tier = strengthTier(score);
  const tierColor = toneColor(tier.tone);

  const lane = deriveLane(answers, filing);
  const laneCopy = describeLane(lane);

  const canAddMore =
    answers.evidenceRefs.length < MAX_EVIDENCE_REFS &&
    EVIDENCE_LIBRARY.some((item) => !answers.evidenceRefs.includes(item));

  const addEvidence = () => {
    const next = EVIDENCE_LIBRARY.find((item) => !answers.evidenceRefs.includes(item));
    if (!next || answers.evidenceRefs.length >= MAX_EVIDENCE_REFS) return;
    setAnswers((prev) => ({ ...prev, evidenceRefs: [...prev.evidenceRefs, next] }));
  };

  const removeEvidence = (item: string) => {
    setAnswers((prev) => ({
      ...prev,
      evidenceRefs: prev.evidenceRefs.filter((entry) => entry !== item),
    }));
  };

  const handleBandPress = () => {
    if (lane.kind === "needGround") {
      scrollRef.current?.scrollTo({ y: Math.max(0, groundSectionY - 12), animated: true });
      return;
    }
    if (lane.kind === "needDetail") {
      scrollRef.current?.scrollTo({ y: Math.max(0, statementSectionY - 12), animated: true });
      statementInputRef.current?.focus();
      return;
    }
    if (lane.kind === "ready" && answers.groundId) {
      const reference = buildAppealReference(answers.groundId, trimmedLength);
      setFiling({
        reference,
        snapshot: {
          groundId: answers.groundId,
          statement: answers.statement,
          evidenceRefs: [...answers.evidenceRefs],
        },
      });
      return;
    }
    if (lane.kind === "filed") {
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flexFill}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          ref={scrollRef}
          style={styles.flexFill}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Text accessibilityRole="header" style={styles.title}>
            Appeal Your Suspension
          </Text>
          <Text style={styles.subtitle}>
            Your repick account was suspended. Tell us why you believe this was a
            mistake, and our trust and safety team will review it.
          </Text>

          <View style={styles.noticeCard}>
            <View style={styles.noticeRow}>
              <Text style={styles.noticeLabel}>Case reference</Text>
              <Text style={styles.noticeValue}>{SUSPENSION_NOTICE.caseRef}</Text>
            </View>
            <View style={styles.noticeRow}>
              <Text style={styles.noticeLabel}>Suspended on</Text>
              <Text style={styles.noticeValue}>{SUSPENSION_NOTICE.suspendedOnLabel}</Text>
            </View>
            <View style={styles.noticeRow}>
              <Text style={styles.noticeLabel}>Policy cited</Text>
              <Text style={styles.noticeValue}>{SUSPENSION_NOTICE.policyCited}</Text>
            </View>
            <Text style={styles.noticeWindow}>{SUSPENSION_NOTICE.appealWindowLabel}</Text>
          </View>

          <View
            style={styles.strengthCard}
            accessibilityLabel={`Case strength ${score} out of 100 — ${tier.label}`}
          >
            <View style={styles.strengthHeaderRow}>
              <Text style={styles.sectionLabel}>Case strength</Text>
              <Text style={[styles.strengthScore, styles.tabularNums, { color: tierColor }]}>
                {score}/100
              </Text>
            </View>
            <View style={styles.strengthTrack}>
              <View
                style={[
                  styles.strengthFill,
                  { width: `${score}%`, backgroundColor: tierColor },
                ]}
              />
            </View>
            <Text style={[styles.strengthTierLabel, { color: tierColor }]}>{tier.label}</Text>
            <Text style={styles.strengthHint}>
              Reflects the reason, explanation length, and references below — it
              updates as you fill them in.
            </Text>
          </View>

          <View onLayout={(e) => setGroundSectionY(e.nativeEvent.layout.y)}>
            <Text accessibilityRole="header" style={styles.sectionLabel}>
              Reason for appeal
            </Text>
            <Text style={styles.sectionHelper}>
              Select the one that best matches your situation.
            </Text>
            <View accessibilityRole="radiogroup" style={styles.groundList}>
              {APPEAL_GROUNDS.map((ground) => {
                const selected = answers.groundId === ground.id;
                return (
                  <Pressable
                    key={ground.id}
                    onPress={() => setAnswers((prev) => ({ ...prev, groundId: ground.id }))}
                    accessibilityRole="radio"
                    accessibilityState={{ selected }}
                    accessibilityLabel={ground.label}
                    hitSlop={6}
                    style={({ pressed }) => [
                      styles.groundRow,
                      selected && styles.groundRowSelected,
                      pressed && styles.rowPressed,
                    ]}
                  >
                    <View style={[styles.radioOuter, selected && styles.radioOuterSelected]}>
                      {selected ? <View style={styles.radioInner} /> : null}
                    </View>
                    <View style={styles.groundTextCol}>
                      <Text style={styles.groundLabel}>{ground.label}</Text>
                      <Text style={styles.groundHelper}>{ground.helper}</Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View onLayout={(e) => setStatementSectionY(e.nativeEvent.layout.y)}>
            <Text accessibilityRole="header" style={styles.sectionLabel}>
              Your explanation
            </Text>
            <Text style={styles.sectionHelper}>
              Minimum {MIN_STATEMENT_CHARS} characters. Be specific — vague
              statements are harder to review.
            </Text>
            <TextInput
              ref={statementInputRef}
              value={answers.statement}
              onChangeText={(text) => setAnswers((prev) => ({ ...prev, statement: text }))}
              multiline
              numberOfLines={6}
              placeholder="Explain what happened and why you believe the suspension should be reversed..."
              placeholderTextColor={tokens.color.faint}
              style={styles.statementInput}
              textAlignVertical="top"
              accessibilityLabel="Your explanation"
              accessibilityHint={`Minimum ${MIN_STATEMENT_CHARS} characters required to file.`}
            />
            <Text
              style={[
                styles.charCount,
                styles.tabularNums,
                trimmedLength >= MIN_STATEMENT_CHARS && styles.charCountMet,
              ]}
            >
              {trimmedLength} / {MIN_STATEMENT_CHARS} characters
            </Text>
          </View>

          <View style={styles.evidenceSection}>
            <Text accessibilityRole="header" style={styles.sectionLabel}>
              Supporting references (optional)
            </Text>
            <Text style={styles.sectionHelper}>
              Up to {MAX_EVIDENCE_REFS}. These strengthen your case but aren't
              required to file.
            </Text>
            {answers.evidenceRefs.length > 0 ? (
              <View style={styles.chipRow}>
                {answers.evidenceRefs.map((item) => (
                  <View key={item} style={styles.chip}>
                    <Text style={styles.chipText}>{item}</Text>
                    <Pressable
                      onPress={() => removeEvidence(item)}
                      hitSlop={10}
                      accessibilityRole="button"
                      accessibilityLabel={`Remove reference: ${item}`}
                      style={styles.chipRemove}
                    >
                      <Text style={styles.chipRemoveText}>×</Text>
                    </Pressable>
                  </View>
                ))}
              </View>
            ) : null}
            <Pressable
              onPress={addEvidence}
              disabled={!canAddMore}
              accessibilityRole="button"
              accessibilityLabel="Add reference"
              accessibilityHint={
                canAddMore ? "Adds a suggested reference to your appeal." : undefined
              }
              style={({ pressed }) => [
                styles.addRefButton,
                !canAddMore && styles.addRefButtonDisabled,
                pressed && canAddMore && styles.rowPressed,
              ]}
            >
              <Text style={[styles.addRefText, !canAddMore && styles.addRefTextDisabled]}>
                {canAddMore
                  ? "+ Add reference"
                  : answers.evidenceRefs.length >= MAX_EVIDENCE_REFS
                    ? `Maximum ${MAX_EVIDENCE_REFS} references added`
                    : "No more suggested references"}
              </Text>
            </Pressable>
          </View>
        </ScrollView>

        <View style={styles.band} accessibilityLiveRegion="polite">
          <Text accessibilityRole="alert" style={styles.bandMessage}>
            {laneCopy.message}
          </Text>
          <Pressable
            onPress={handleBandPress}
            accessibilityRole="button"
            accessibilityLabel={laneCopy.actionLabel}
            accessibilityHint={laneCopy.hint}
            hitSlop={6}
            style={({ pressed }) => [
              styles.bandButton,
              laneCopy.tone === "ready" && styles.bandButtonReady,
              laneCopy.tone === "filed" && styles.bandButtonFiled,
              pressed && styles.bandButtonPressed,
            ]}
          >
            <Text
              style={[
                styles.bandButtonText,
                laneCopy.tone === "ready" && styles.bandButtonTextReady,
                laneCopy.tone === "filed" && styles.bandButtonTextFiled,
              ]}
            >
              {laneCopy.actionLabel}
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  flexFill: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(4),
    paddingBottom: tokens.space(8),
    gap: tokens.space(5),
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  subtitle: {
    fontSize: 14,
    color: tokens.color.muted,
    lineHeight: 20,
  },
  noticeCard: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(4),
    gap: tokens.space(2),
  },
  noticeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: tokens.space(2),
  },
  noticeLabel: {
    fontSize: 13,
    color: tokens.color.faint,
  },
  noticeValue: {
    fontSize: 13,
    fontWeight: "600",
    color: tokens.color.ink2,
  },
  noticeWindow: {
    fontSize: 12,
    color: tokens.color.warning,
    marginTop: tokens.space(1),
  },
  strengthCard: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(4),
    gap: tokens.space(2),
  },
  strengthHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  strengthScore: {
    fontSize: 15,
    fontWeight: "700",
  },
  strengthTrack: {
    height: 8,
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.border,
    overflow: "hidden",
  },
  strengthFill: {
    height: 8,
    borderRadius: tokens.radius.sm,
  },
  strengthTierLabel: {
    fontSize: 13,
    fontWeight: "600",
  },
  strengthHint: {
    fontSize: 12,
    color: tokens.color.faint,
    lineHeight: 16,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: tokens.color.faint,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  sectionHelper: {
    fontSize: 13,
    color: tokens.color.muted,
    marginTop: tokens.space(1),
    marginBottom: tokens.space(2),
    lineHeight: 18,
  },
  groundList: {
    gap: tokens.space(2),
  },
  groundRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: tokens.space(3),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(3),
    minHeight: 44,
    backgroundColor: tokens.color.bg,
  },
  groundRowSelected: {
    borderColor: tokens.color.accent,
    backgroundColor: tokens.color.accentBg,
  },
  rowPressed: {
    opacity: 0.7,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  radioOuterSelected: {
    borderColor: tokens.color.accent,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: tokens.color.accent,
  },
  groundTextCol: {
    flex: 1,
    gap: tokens.space(1) / 2,
  },
  groundLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: tokens.color.ink,
  },
  groundHelper: {
    fontSize: 12,
    color: tokens.color.muted,
    lineHeight: 16,
  },
  statementInput: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(3),
    minHeight: 120,
    fontSize: 14,
    color: tokens.color.ink,
  },
  charCount: {
    fontSize: 12,
    color: tokens.color.faint,
    marginTop: tokens.space(1),
    textAlign: "right",
  },
  charCountMet: {
    color: tokens.color.success,
  },
  evidenceSection: {
    gap: tokens.space(1),
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: tokens.space(2),
    marginBottom: tokens.space(2),
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.space(1),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.sm,
    paddingVertical: tokens.space(1),
    paddingHorizontal: tokens.space(2),
    backgroundColor: tokens.color.bg,
  },
  chipText: {
    fontSize: 12,
    color: tokens.color.ink2,
  },
  chipRemove: {
    paddingHorizontal: tokens.space(1),
  },
  chipRemoveText: {
    fontSize: 14,
    color: tokens.color.faint,
    fontWeight: "700",
  },
  addRefButton: {
    borderWidth: 1,
    borderColor: tokens.color.accent,
    borderRadius: tokens.radius.sm,
    paddingVertical: tokens.space(2) + 4,
    paddingHorizontal: tokens.space(3),
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  addRefButtonDisabled: {
    borderColor: tokens.color.border,
  },
  addRefText: {
    fontSize: 13,
    fontWeight: "600",
    color: tokens.color.accent,
  },
  addRefTextDisabled: {
    color: tokens.color.faint,
  },
  band: {
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(3),
    paddingBottom: tokens.space(4),
    gap: tokens.space(2),
  },
  bandMessage: {
    fontSize: 13,
    color: tokens.color.ink2,
    lineHeight: 18,
  },
  bandButton: {
    minHeight: 48,
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    alignItems: "center",
    justifyContent: "center",
  },
  bandButtonReady: {
    borderColor: tokens.color.accent,
    backgroundColor: tokens.color.accent,
  },
  bandButtonFiled: {
    borderColor: tokens.color.successBorder,
    backgroundColor: tokens.color.successBg,
  },
  bandButtonPressed: {
    opacity: 0.85,
  },
  bandButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.ink2,
  },
  bandButtonTextReady: {
    color: tokens.color.onAccent,
  },
  bandButtonTextFiled: {
    color: tokens.color.success,
  },
  tabularNums: {
    fontVariant: ["tabular-nums"],
  },
});
