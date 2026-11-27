import React, { useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  TextInput,
} from "react-native";
import { tokens } from "../../../tokens";
import {
  POLICY_GROUNDS,
  REVIEWED_SALE,
  APPEAL_REFERENCE,
  MIN_EXPLANATION_WORDS,
  meetsExplanationBar,
  wordCountOf,
  estimateReviewWindowHours,
  DUMMY_DECISION,
} from "./data";

type CasePhase = "forming" | "withTrustSafety" | "settled";

export default function AppealNegativeReviewScreen() {
  const [phase, setPhase] = useState<CasePhase>("forming");
  const [selectedGroundIds, setSelectedGroundIds] = useState<string[]>([]);
  const [explanation, setExplanation] = useState("");
  const [estimatedHours, setEstimatedHours] = useState<number | null>(null);
  const [withdrawArmed, setWithdrawArmed] = useState(false);
  const [liveMessage, setLiveMessage] = useState("");

  const scrollRef = useRef<ScrollView>(null);
  const explanationInputRef = useRef<TextInput>(null);
  const sectionOffsets = useRef({ grounds: 0, explanation: 0 });

  const hasGround = selectedGroundIds.length > 0;
  const hasExplanation = meetsExplanationBar(explanation);
  const canSubmit = hasGround && hasExplanation;
  const wordCount = wordCountOf(explanation);

  const selectedGrounds = POLICY_GROUNDS.filter((g) =>
    selectedGroundIds.includes(g.id)
  );

  function blockingSentence(): string {
    if (!hasGround && !hasExplanation) {
      return `Pick at least one ground and write a specific account (${MIN_EXPLANATION_WORDS}+ words) before this can reach Trust & Safety.`;
    }
    if (!hasGround) {
      return "Pick at least one ground this review violates before this can reach Trust & Safety.";
    }
    return `Add a fuller account — at least ${MIN_EXPLANATION_WORDS} words about what actually happened — before this can reach Trust & Safety.`;
  }

  function jumpToFirstUnmet() {
    if (!hasGround) {
      scrollRef.current?.scrollTo({
        y: Math.max(sectionOffsets.current.grounds - 12, 0),
        animated: true,
      });
      setLiveMessage("Jumped to the grounds list — at least one is required.");
    } else {
      scrollRef.current?.scrollTo({
        y: Math.max(sectionOffsets.current.explanation - 12, 0),
        animated: true,
      });
      explanationInputRef.current?.focus();
      setLiveMessage(
        "Jumped to your account of what happened — it needs more detail."
      );
    }
  }

  function retractIfNeeded() {
    if (phase !== "forming") {
      setPhase("forming");
      setWithdrawArmed(false);
      setLiveMessage(
        "Your edit changed the appeal, so it's back out of review. Resend it once it's ready."
      );
    }
  }

  function toggleGround(id: string) {
    setSelectedGroundIds((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
    retractIfNeeded();
  }

  function onChangeExplanation(text: string) {
    setExplanation(text);
    retractIfNeeded();
  }

  function submitAppeal() {
    if (!canSubmit) return;
    const hours = estimateReviewWindowHours(
      selectedGroundIds.length,
      explanation.trim().length
    );
    setEstimatedHours(hours);
    setPhase("withTrustSafety");
    setLiveMessage(
      `Appeal sent to Trust & Safety. Estimated review window: about ${hours} hours.`
    );
  }

  function checkForDecision() {
    setPhase("settled");
    setLiveMessage(
      DUMMY_DECISION.outcome === "removed"
        ? `Trust & Safety removed the review. Case ${DUMMY_DECISION.caseNumber}.`
        : `Trust & Safety upheld the review. Case ${DUMMY_DECISION.caseNumber}.`
    );
  }

  function requestWithdraw() {
    setWithdrawArmed(true);
  }

  function cancelWithdraw() {
    setWithdrawArmed(false);
  }

  function confirmWithdraw() {
    setWithdrawArmed(false);
    setPhase("forming");
    setLiveMessage("Appeal withdrawn. Edit it whenever you're ready to resend.");
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.root}>
        <ScrollView
          ref={scrollRef}
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Text accessibilityRole="header" style={styles.title}>
            Appeal This Review
          </Text>
          <Text style={styles.subtitle}>
            Explain why this review shouldn't stand. Trust & Safety reads
            exactly what you select and write below.
          </Text>

          <View style={styles.caseCard}>
            <Text style={styles.caseCardLabel}>Order {REVIEWED_SALE.orderRef}</Text>
            <Text style={styles.caseItemTitle}>{REVIEWED_SALE.itemTitle}</Text>
            <View style={styles.starRow}>
              {[0, 1, 2, 3, 4].map((i) => (
                <Text
                  key={i}
                  style={i < REVIEWED_SALE.starRating ? styles.starFilled : styles.starEmpty}
                >
                  {i < REVIEWED_SALE.starRating ? "★" : "☆"}
                </Text>
              ))}
              <Text style={styles.buyerName}> {REVIEWED_SALE.buyerUsername}</Text>
              <Text style={styles.reviewDate}> · {REVIEWED_SALE.reviewDate}</Text>
            </View>
            <Text style={styles.reviewQuote}>"{REVIEWED_SALE.reviewQuote}"</Text>
            <Text style={styles.soldMeta}>Sold {REVIEWED_SALE.soldDate}</Text>
          </View>

          <View
            onLayout={(e) => {
              sectionOffsets.current.grounds = e.nativeEvent.layout.y;
            }}
          >
            <Text accessibilityRole="header" style={styles.sectionHeading}>
              Select your grounds
            </Text>
            <Text style={styles.sectionHint}>
              Choose every policy this review actually breaks.
            </Text>
            {POLICY_GROUNDS.map((g) => {
              const checked = selectedGroundIds.includes(g.id);
              return (
                <Pressable
                  key={g.id}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked }}
                  accessibilityLabel={g.label}
                  accessibilityHint={g.helper}
                  onPress={() => toggleGround(g.id)}
                  style={[styles.groundRow, checked && styles.groundRowChecked]}
                >
                  <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
                    {checked ? <Text style={styles.checkboxMark}>✓</Text> : null}
                  </View>
                  <View style={styles.groundTextWrap}>
                    <Text style={styles.groundLabel}>{g.label}</Text>
                    <Text style={styles.groundHelper}>{g.helper}</Text>
                  </View>
                </Pressable>
              );
            })}
          </View>

          <View
            onLayout={(e) => {
              sectionOffsets.current.explanation = e.nativeEvent.layout.y;
            }}
          >
            <Text accessibilityRole="header" style={styles.sectionHeading}>
              Your account of what happened
            </Text>
            <TextInput
              ref={explanationInputRef}
              value={explanation}
              onChangeText={onChangeExplanation}
              placeholder="Describe specifically what happened and why this review shouldn't stand..."
              placeholderTextColor={tokens.color.faint}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              style={styles.textArea}
              accessibilityLabel="Your account of what happened"
              accessibilityHint="Trust & Safety reads this alongside the grounds you selected."
            />
            <Text style={styles.counterText}>
              {wordCount} word{wordCount === 1 ? "" : "s"} ·{" "}
              {explanation.trim().length} characters
              {hasExplanation
                ? " — enough detail"
                : ` — needs ${MIN_EXPLANATION_WORDS}+ words`}
            </Text>
          </View>

          <View style={styles.previewCard}>
            <Text style={styles.previewTitle}>What Trust & Safety will see</Text>
            <Text style={styles.previewLine}>
              Flagged grounds:{" "}
              {selectedGrounds.length > 0
                ? selectedGrounds.map((g) => g.label).join("; ") + "."
                : "none selected yet."}
            </Text>
            <Text style={styles.previewLine}>
              Seller's account:{" "}
              {explanation.trim().length > 0
                ? `"${explanation.trim()}"`
                : "(not written yet)"}
            </Text>
          </View>
        </ScrollView>

        <Text
          accessibilityLiveRegion="polite"
          accessibilityRole={liveMessage ? "alert" : undefined}
          style={styles.liveRegion}
        >
          {liveMessage}
        </Text>

        {phase === "forming" ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={canSubmit ? "Send to Trust & Safety" : blockingSentence()}
            accessibilityHint={
              canSubmit
                ? "Submits the appeal to the Trust & Safety team."
                : "Scrolls to the first missing requirement."
            }
            onPress={canSubmit ? submitAppeal : jumpToFirstUnmet}
            style={[styles.band, canSubmit ? styles.bandReady : styles.bandBlocked]}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text
              style={canSubmit ? styles.bandTextReady : styles.bandTextBlocked}
            >
              {canSubmit ? "Send to Trust & Safety" : blockingSentence()}
            </Text>
          </Pressable>
        ) : phase === "withTrustSafety" ? (
          <View style={[styles.band, styles.bandNeutral]}>
            <Text style={styles.bandEyebrow}>WITH TRUST & SAFETY</Text>
            <Text style={styles.bandRefText}>Appeal {APPEAL_REFERENCE}</Text>
            <Text style={styles.bandBodyText}>
              {selectedGroundIds.length} ground
              {selectedGroundIds.length === 1 ? "" : "s"} flagged · estimated
              window ~{estimatedHours}h
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Check for a decision"
              accessibilityHint="Shows whether Trust & Safety has reached a decision on this appeal."
              onPress={checkForDecision}
              style={styles.bandActionBtn}
            >
              <Text style={styles.bandActionText}>Check for a decision</Text>
            </Pressable>
            {!withdrawArmed ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Withdraw appeal"
                onPress={requestWithdraw}
                style={styles.withdrawLink}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={styles.withdrawLinkText}>Withdraw appeal</Text>
              </Pressable>
            ) : (
              <View style={styles.withdrawRow}>
                <Text style={styles.withdrawPrompt}>
                  Withdraw this appeal? The review will stand as-is.
                </Text>
                <View style={styles.withdrawButtons}>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Cancel withdrawal"
                    onPress={cancelWithdraw}
                    style={styles.withdrawCancelBtn}
                  >
                    <Text style={styles.withdrawCancelText}>Cancel</Text>
                  </Pressable>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Confirm withdrawal"
                    onPress={confirmWithdraw}
                    style={styles.withdrawConfirmBtn}
                  >
                    <Text style={styles.withdrawConfirmText}>Confirm</Text>
                  </Pressable>
                </View>
              </View>
            )}
          </View>
        ) : (
          <View
            style={[
              styles.band,
              DUMMY_DECISION.outcome === "removed"
                ? styles.bandSuccess
                : styles.bandWarning,
            ]}
          >
            <Text
              style={
                DUMMY_DECISION.outcome === "removed"
                  ? styles.bandEyebrowSuccess
                  : styles.bandEyebrowWarning
              }
            >
              {DUMMY_DECISION.outcome === "removed"
                ? "REVIEW REMOVED"
                : "REVIEW UPHELD"}
            </Text>
            <Text style={styles.bandBodyText}>{DUMMY_DECISION.decidedNote}</Text>
            <Text style={styles.bandRefText}>
              Case {DUMMY_DECISION.caseNumber} · Appeal {APPEAL_REFERENCE}
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  root: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: tokens.space(4),
    paddingTop: tokens.space(4),
    paddingBottom: tokens.space(6),
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: tokens.color.ink,
    marginBottom: tokens.space(1),
  },
  subtitle: {
    fontSize: 14,
    color: tokens.color.muted,
    marginBottom: tokens.space(4),
  },
  caseCard: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(4),
    marginBottom: tokens.space(5),
  },
  caseCardLabel: {
    fontSize: 12,
    color: tokens.color.faint,
    marginBottom: tokens.space(1),
  },
  caseItemTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: tokens.color.ink,
    marginBottom: tokens.space(2),
  },
  starRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: tokens.space(2),
  },
  starFilled: {
    color: tokens.color.warning,
    fontSize: 14,
  },
  starEmpty: {
    color: tokens.color.border,
    fontSize: 14,
  },
  buyerName: {
    fontSize: 13,
    color: tokens.color.ink2,
    fontWeight: "600",
  },
  reviewDate: {
    fontSize: 13,
    color: tokens.color.faint,
  },
  reviewQuote: {
    fontSize: 14,
    color: tokens.color.ink2,
    fontStyle: "italic",
    marginBottom: tokens.space(2),
  },
  soldMeta: {
    fontSize: 12,
    color: tokens.color.faint,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: "700",
    color: tokens.color.ink,
    marginTop: tokens.space(2),
    marginBottom: tokens.space(1),
  },
  sectionHint: {
    fontSize: 13,
    color: tokens.color.muted,
    marginBottom: tokens.space(3),
  },
  groundRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    minHeight: 44,
    paddingVertical: tokens.space(2),
    paddingHorizontal: tokens.space(3),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    marginBottom: tokens.space(2),
  },
  groundRowChecked: {
    borderColor: tokens.color.accent,
    backgroundColor: tokens.color.accentBg,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
    marginRight: tokens.space(3),
    marginTop: 2,
  },
  checkboxChecked: {
    borderColor: tokens.color.accent,
    backgroundColor: tokens.color.accent,
  },
  checkboxMark: {
    color: tokens.color.onAccent,
    fontSize: 13,
    fontWeight: "700",
  },
  groundTextWrap: {
    flex: 1,
  },
  groundLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: tokens.color.ink,
    marginBottom: 2,
  },
  groundHelper: {
    fontSize: 12,
    color: tokens.color.muted,
  },
  textArea: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(3),
    minHeight: 110,
    fontSize: 14,
    color: tokens.color.ink,
    marginBottom: tokens.space(1),
  },
  counterText: {
    fontSize: 12,
    color: tokens.color.faint,
    marginBottom: tokens.space(4),
  },
  previewCard: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.color.accentBg,
    padding: tokens.space(4),
    marginTop: tokens.space(2),
  },
  previewTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: tokens.color.ink2,
    marginBottom: tokens.space(2),
  },
  previewLine: {
    fontSize: 13,
    color: tokens.color.ink2,
    marginBottom: tokens.space(1),
  },
  liveRegion: {
    fontSize: 12,
    color: tokens.color.muted,
    paddingHorizontal: tokens.space(4),
    paddingTop: tokens.space(1),
    minHeight: 1,
  },
  band: {
    paddingHorizontal: tokens.space(4),
    paddingVertical: tokens.space(4),
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
  },
  bandBlocked: {
    backgroundColor: tokens.color.bg,
  },
  bandReady: {
    backgroundColor: tokens.color.accent,
  },
  bandNeutral: {
    backgroundColor: tokens.color.bg,
  },
  bandSuccess: {
    backgroundColor: tokens.color.successBg,
    borderTopColor: tokens.color.successBorder,
  },
  bandWarning: {
    backgroundColor: tokens.color.warningBg,
    borderTopColor: tokens.color.warningBorder,
  },
  bandTextBlocked: {
    fontSize: 14,
    fontWeight: "600",
    color: tokens.color.muted,
    textAlign: "center",
  },
  bandTextReady: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.onAccent,
    textAlign: "center",
  },
  bandEyebrow: {
    fontSize: 11,
    fontWeight: "700",
    color: tokens.color.faint,
    letterSpacing: 0.5,
    marginBottom: tokens.space(1),
  },
  bandEyebrowSuccess: {
    fontSize: 11,
    fontWeight: "700",
    color: tokens.color.success,
    letterSpacing: 0.5,
    marginBottom: tokens.space(1),
  },
  bandEyebrowWarning: {
    fontSize: 11,
    fontWeight: "700",
    color: tokens.color.warning,
    letterSpacing: 0.5,
    marginBottom: tokens.space(1),
  },
  bandRefText: {
    fontSize: 12,
    color: tokens.color.faint,
    marginBottom: tokens.space(1),
  },
  bandBodyText: {
    fontSize: 14,
    color: tokens.color.ink2,
    marginBottom: tokens.space(3),
  },
  bandActionBtn: {
    minHeight: 44,
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.color.accent,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: tokens.space(2),
  },
  bandActionText: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.onAccent,
  },
  withdrawLink: {
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  withdrawLinkText: {
    fontSize: 13,
    color: tokens.color.danger,
    fontWeight: "600",
  },
  withdrawRow: {
    marginTop: tokens.space(1),
  },
  withdrawPrompt: {
    fontSize: 13,
    color: tokens.color.ink2,
    marginBottom: tokens.space(2),
  },
  withdrawButtons: {
    flexDirection: "row",
  },
  withdrawCancelBtn: {
    flex: 1,
    minHeight: 44,
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
    marginRight: tokens.space(2),
  },
  withdrawCancelText: {
    fontSize: 14,
    fontWeight: "600",
    color: tokens.color.ink2,
  },
  withdrawConfirmBtn: {
    flex: 1,
    minHeight: 44,
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.color.danger,
    alignItems: "center",
    justifyContent: "center",
  },
  withdrawConfirmText: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.onInk,
  },
});
