// native/src/evolve/r25/a/TradeInAppraisalScreen.tsx — auto-native-r25 candidate a.
//
// Trade-In Appraisal: a buyer hands an item to Repick itself for trade-in credit, instead of
// listing it for sale peer-to-peer. This is a genuinely new domain versus the app's other
// screens — it is not `listing` (there is no buyer to find, no price to negotiate, no photo
// capture: photos were already taken elsewhere and only appear here read-only), not `payout`
// (that screen pays out money already earned; this screen is upstream of any credit existing at
// all), and not `certificate`/`verification` (those show or gate a status Repick has already
// decided; here the estimate is still being computed live from the buyer's own answers).
//
// Bottom band form (per GENERATION.md §3): this is a blocked workflow — condition disclosure,
// then drop-off method, then payout preference, in that order — so the fixed bottom bar is a
// real state machine: it names the exact unresolved item in a sentence and, pressed, scrolls to
// that item specifically (down to a single disclosure question, not just "the condition
// section"). Names, styles and control flow below are written fresh for this screen: the docked
// bar is `dockedBar`, its blocked/ready/submitted variants are `dockedBarPending` /
// `dockedBarReady` / `dockedBarLogged` (not `bandBlocked`/`bandReady`/`bandDone`), the block
// reason is `holdUp` (not `blocking`), and scrolling to the offending item is `revealCheckpoint`
// (not `jumpTo`) — resolved via per-item `onLayout` offsets captured in `checkpointY` and a
// direct `ScrollView.scrollTo`, not `FlatList.scrollToIndex`, since a question can sit inside a
// section rather than being a top-level list row.
//
// Withdrawing a filed appraisal is destructive, so per the disputes/payout-establishing pattern
// (never pop a native Alert) the "Withdraw request" control converts the docked bar itself into
// a Cancel/Confirm row, inside the same `accessibilityLiveRegion="polite"` container that already
// carries the block/ready/submitted states — the confirmation prompt is read by that same live
// region, not a second one.
import { useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  type LayoutChangeEvent,
} from "react-native";
import { tokens } from "../../../tokens";
import {
  DISCLOSURE_QUESTIONS,
  HANDOFF_METHODS,
  PAYOUT_METHODS,
  ITEM_PHOTOS,
  ITEM_SUMMARY,
  SUBMISSION,
  estimateRangeKrw,
  formatDigits,
  type DisclosureAnswer,
  type DisclosureQuestion,
} from "./data";

const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };
const SCROLL_MARGIN = 16;
const SWATCHES = [tokens.color.swatch1, tokens.color.swatch2, tokens.color.swatch3];

type Checkpoint = { key: string; reason: string };

function CreditFigure({ lowKrw, highKrw }: { lowKrw: number; highKrw: number }) {
  return (
    <View
      style={styles.creditRow}
      accessible
      accessibilityLabel={`Estimated credit range, ${formatDigits(lowKrw)} to ${formatDigits(highKrw)} won`}
    >
      <Text style={styles.creditWon}>{"₩"}</Text>
      <Text style={styles.creditDigits}>{formatDigits(lowKrw)}</Text>
      <Text style={styles.creditDash}>{" – "}</Text>
      <Text style={styles.creditWon}>{"₩"}</Text>
      <Text style={styles.creditDigits}>{formatDigits(highKrw)}</Text>
    </View>
  );
}

function DisclosureRow({
  question,
  answer,
  flagged,
  onAnswer,
  onLayout,
}: {
  question: DisclosureQuestion;
  answer: DisclosureAnswer | undefined;
  flagged: boolean;
  onAnswer: (value: DisclosureAnswer) => void;
  onLayout: (e: LayoutChangeEvent) => void;
}) {
  const unfavorable = !!answer && answer !== question.favorableAnswer;
  return (
    <View
      onLayout={onLayout}
      style={[styles.disclosureRow, flagged && styles.disclosureRowFlagged]}
    >
      <Text style={styles.disclosureLead}>{question.prompt}</Text>
      <Text style={styles.disclosureDetail}>{question.detail}</Text>
      <View style={styles.disclosureChoices}>
        {(["yes", "no"] as const).map((choice) => {
          const selected = answer === choice;
          const choiceLabel = choice === "yes" ? "Yes" : "No";
          return (
            <Pressable
              key={choice}
              onPress={() => onAnswer(choice)}
              hitSlop={HIT_SLOP}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              accessibilityLabel={`${question.prompt} — ${choiceLabel}`}
              style={({ pressed }) => [
                styles.choiceBtn,
                selected && styles.choiceBtnSelected,
                pressed && styles.pressedDim,
              ]}
            >
              <Text
                style={[
                  styles.choiceBtnText,
                  selected && styles.choiceBtnTextSelected,
                ]}
              >
                {choiceLabel}
              </Text>
            </Pressable>
          );
        })}
      </View>
      {unfavorable ? (
        <Text style={styles.disclosureAdjust}>
          Estimated adjustment: −KRW {formatDigits(question.deductionKrw)}
        </Text>
      ) : null}
    </View>
  );
}

function ChoiceCard({
  label,
  detail,
  meta,
  selected,
  onPress,
}: {
  label: string;
  detail: string;
  meta: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={`${label}. ${detail}`}
      style={({ pressed }) => [
        styles.choiceCard,
        selected && styles.choiceCardSelected,
        pressed && styles.pressedDim,
      ]}
    >
      <View style={[styles.choiceMarker, selected && styles.choiceMarkerOn]}>
        {selected ? <Text style={styles.choiceMarkerDot} /> : null}
      </View>
      <View style={styles.choiceBody}>
        <Text style={styles.choiceLabel}>{label}</Text>
        <Text style={styles.choiceDetail}>{detail}</Text>
        <Text style={styles.choiceMeta}>{meta}</Text>
      </View>
    </Pressable>
  );
}

export function TradeInAppraisalScreen() {
  const [answers, setAnswers] = useState<Partial<Record<string, DisclosureAnswer>>>({});
  const [handoffId, setHandoffId] = useState<string | null>(null);
  const [payoutId, setPayoutId] = useState<string | null>(null);
  const [filed, setFiled] = useState(false);
  const [retracting, setRetracting] = useState(false);

  const scrollRef = useRef<ScrollView>(null);
  const checkpointY = useRef<Record<string, number>>({});

  const registerCheckpoint = (key: string) => (e: LayoutChangeEvent) => {
    checkpointY.current[key] = e.nativeEvent.layout.y;
  };

  const revealCheckpoint = (key: string) => {
    const y = checkpointY.current[key] ?? 0;
    scrollRef.current?.scrollTo({ y: Math.max(y - SCROLL_MARGIN, 0), animated: true });
  };

  const answeredCount = DISCLOSURE_QUESTIONS.filter((q) => answers[q.id]).length;
  const unresolvedQuestion = DISCLOSURE_QUESTIONS.find((q) => !answers[q.id]);
  const handoff = HANDOFF_METHODS.find((m) => m.id === handoffId) ?? null;
  const payout = PAYOUT_METHODS.find((p) => p.id === payoutId) ?? null;

  const deductions = DISCLOSURE_QUESTIONS.filter(
    (q) => answers[q.id] && answers[q.id] !== q.favorableAnswer,
  ).map((q) => q.deductionKrw);
  const { lowKrw, highKrw } = useMemo(
    () => estimateRangeKrw(deductions, payout ? payout.multiplier : 1),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [answers, payoutId],
  );

  const holdUp: Checkpoint | null = useMemo(() => {
    if (unresolvedQuestion) {
      return {
        key: `condition-${unresolvedQuestion.id}`,
        reason: `Answer "${unresolvedQuestion.prompt}" so we can finish your estimate.`,
      };
    }
    if (!handoff) {
      return {
        key: "handoff",
        reason: "Choose a drop-off method — mail-in kit or store drop-off — before you submit.",
      };
    }
    if (!payout) {
      return {
        key: "payout",
        reason: "Pick a payout preference — store credit or bank transfer — before you submit.",
      };
    }
    return null;
  }, [unresolvedQuestion, handoff, payout]);

  const retractFiling = () => {
    if (filed) {
      setFiled(false);
      setRetracting(false);
    }
  };

  const setAnswer = (id: string, value: DisclosureAnswer) => {
    retractFiling();
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const chooseHandoff = (id: string) => {
    retractFiling();
    setHandoffId(id);
  };

  const choosePayout = (id: string) => {
    retractFiling();
    setPayoutId(id);
  };

  const handleDockPress = () => {
    if (holdUp) {
      revealCheckpoint(holdUp.key);
      return;
    }
    setFiled(true);
    setRetracting(false);
  };

  const heroCaption = unresolvedQuestion
    ? "This range will narrow as you finish the condition disclosure below."
    : !payout
      ? "Choose a payout method below — store credit adds a 10% bonus."
      : "Locked in once you submit. Repick confirms the final offer after inspecting the item.";

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.kicker}>REPICK TRADE-IN</Text>
        <Text style={styles.h1} accessibilityRole="header">
          Trade-In Appraisal
        </Text>
        <Text style={styles.lede}>
          Submit this item for Repick's own trade-in credit instead of listing it for sale. Your
          photos are already saved — just confirm its condition and how you want it handled.
        </Text>

        <View style={styles.heroCard}>
          <Text style={styles.heroLabel}>Estimated Credit</Text>
          <CreditFigure lowKrw={lowKrw} highKrw={highKrw} />
          <Text style={styles.heroCaption}>{heroCaption}</Text>
        </View>

        <Text style={styles.sectionHead} accessibilityRole="header">
          Item Snapshot
        </Text>
        <View style={styles.itemCard}>
          <Text style={styles.itemTitle}>{ITEM_SUMMARY.title}</Text>
          <Text style={styles.itemMeta}>
            {ITEM_SUMMARY.brand} · {ITEM_SUMMARY.categoryLabel}
          </Text>
        </View>
        <FlatList
          data={ITEM_PHOTOS}
          horizontal
          keyExtractor={(photo) => photo.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.photoStrip}
          renderItem={({ item }) => (
            <View style={styles.photoThumb}>
              <View
                style={[
                  styles.photoSwatch,
                  { backgroundColor: SWATCHES[item.swatchIndex % SWATCHES.length] },
                ]}
              />
              <Text style={styles.photoLabel} numberOfLines={1}>
                {item.label}
              </Text>
            </View>
          )}
        />
        <Text style={styles.photoSourceNote}>{ITEM_SUMMARY.photoSourceLabel}</Text>

        <Text style={styles.sectionHead} accessibilityRole="header">
          Condition Disclosure
        </Text>
        <Text style={styles.sectionSub}>
          {answeredCount} of {DISCLOSURE_QUESTIONS.length} questions answered
        </Text>
        {DISCLOSURE_QUESTIONS.map((question) => (
          <DisclosureRow
            key={question.id}
            question={question}
            answer={answers[question.id]}
            flagged={holdUp?.key === `condition-${question.id}`}
            onAnswer={(value) => setAnswer(question.id, value)}
            onLayout={registerCheckpoint(`condition-${question.id}`)}
          />
        ))}

        <Text style={styles.sectionHead} accessibilityRole="header">
          Drop-off Method
        </Text>
        <View
          onLayout={registerCheckpoint("handoff")}
          style={[styles.choiceGroup, holdUp?.key === "handoff" && styles.choiceGroupFlagged]}
        >
          {HANDOFF_METHODS.map((method) => (
            <ChoiceCard
              key={method.id}
              label={method.label}
              detail={method.detail}
              meta={method.turnaroundLabel}
              selected={handoffId === method.id}
              onPress={() => chooseHandoff(method.id)}
            />
          ))}
        </View>

        <Text style={styles.sectionHead} accessibilityRole="header">
          Payout Preference
        </Text>
        <View
          onLayout={registerCheckpoint("payout")}
          style={[styles.choiceGroup, holdUp?.key === "payout" && styles.choiceGroupFlagged]}
        >
          {PAYOUT_METHODS.map((method) => (
            <ChoiceCard
              key={method.id}
              label={method.label}
              detail={method.detail}
              meta={method.arrivalLabel}
              selected={payoutId === method.id}
              onPress={() => choosePayout(method.id)}
            />
          ))}
        </View>
      </ScrollView>

      <View style={styles.dockedBar} accessibilityLiveRegion="polite">
        {holdUp ? (
          <Pressable
            onPress={handleDockPress}
            hitSlop={HIT_SLOP}
            accessibilityRole="button"
            accessibilityLabel={`${holdUp.reason} Tap to go there.`}
            style={({ pressed }) => [styles.dockedBarPending, pressed && styles.dockedBarPressed]}
          >
            <Text style={styles.dockedBarPendingLead} accessibilityRole="alert">
              {holdUp.reason}
            </Text>
            <Text style={styles.dockedBarPendingNote}>Tap to go there</Text>
          </Pressable>
        ) : filed ? (
          retracting ? (
            <View style={styles.dockedBarConfirmRow}>
              <Text style={styles.dockedBarConfirmPrompt} accessibilityRole="alert">
                Withdraw this appraisal request? Your photos and answers stay saved.
              </Text>
              <View style={styles.dockedBarConfirmButtons}>
                <Pressable
                  onPress={cancelRetractFor(setRetracting)}
                  hitSlop={HIT_SLOP}
                  accessibilityRole="button"
                  accessibilityLabel="Keep this appraisal request"
                  style={({ pressed }) => [
                    styles.dockedBarConfirmKeep,
                    pressed && styles.dockedBarPressed,
                  ]}
                >
                  <Text style={styles.dockedBarConfirmKeepText}>Keep it</Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    setFiled(false);
                    setRetracting(false);
                  }}
                  hitSlop={HIT_SLOP}
                  accessibilityRole="button"
                  accessibilityLabel="Confirm withdrawing this appraisal request"
                  style={({ pressed }) => [
                    styles.dockedBarConfirmWithdraw,
                    pressed && styles.dockedBarPressed,
                  ]}
                >
                  <Text style={styles.dockedBarConfirmWithdrawText}>Withdraw</Text>
                </Pressable>
              </View>
            </View>
          ) : (
            <View style={styles.dockedBarLogged}>
              <Text style={styles.dockedBarLoggedLead} accessibilityRole="alert">
                Appraisal request sent — Ref {SUBMISSION.referenceId}
              </Text>
              <Text style={styles.dockedBarLoggedNote}>
                {SUBMISSION.submittedAtLabel} · decision in {SUBMISSION.reviewWindowLabel}
              </Text>
              <Pressable
                onPress={() => setRetracting(true)}
                hitSlop={HIT_SLOP}
                accessibilityRole="button"
                accessibilityLabel="Withdraw appraisal request"
                style={styles.dockedBarWithdrawLink}
              >
                <Text style={styles.dockedBarWithdrawLinkText}>Withdraw request</Text>
              </Pressable>
            </View>
          )
        ) : (
          <Pressable
            onPress={handleDockPress}
            hitSlop={HIT_SLOP}
            accessibilityRole="button"
            accessibilityLabel={`Submit appraisal request. Estimated credit ${formatDigits(lowKrw)} to ${formatDigits(highKrw)} won.`}
            style={({ pressed }) => [styles.dockedBarReady, pressed && styles.dockedBarPressed]}
          >
            <Text style={styles.dockedBarReadyLead} accessibilityRole="alert">
              Submit appraisal request
            </Text>
            <Text style={styles.dockedBarReadyNote}>
              Estimated credit: KRW {formatDigits(lowKrw)}–{formatDigits(highKrw)}
            </Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}

// Kept outside the component body (stable identity not required here since it's only used from
// one inline Pressable) but named as a function, not inlined twice, so the Cancel action reads
// clearly next to its Confirm sibling above.
function cancelRetractFor(setRetracting: (value: boolean) => void) {
  return () => setRetracting(false);
}

export default TradeInAppraisalScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  scrollContent: {
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(6),
    paddingBottom: tokens.space(8),
  },

  kicker: {
    fontSize: 11,
    letterSpacing: 1.6,
    fontWeight: "700",
    color: tokens.color.faint,
  },
  h1: {
    marginTop: tokens.space(2),
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.5,
    color: tokens.color.ink,
  },
  lede: {
    marginTop: tokens.space(2),
    fontSize: 14,
    lineHeight: 21,
    color: tokens.color.muted,
  },

  heroCard: {
    marginTop: tokens.space(5),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(4),
    gap: tokens.space(1),
  },
  heroLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    color: tokens.color.faint,
    textTransform: "uppercase",
  },
  creditRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: tokens.space(1),
  },
  creditWon: {
    fontSize: 18,
    fontWeight: "700",
    color: tokens.color.ink,
    marginRight: 3,
  },
  creditDigits: {
    fontSize: 26,
    fontWeight: "800",
    color: tokens.color.ink,
    fontVariant: ["tabular-nums"],
  },
  creditDash: {
    fontSize: 20,
    fontWeight: "700",
    color: tokens.color.faint,
  },
  heroCaption: {
    marginTop: tokens.space(1),
    fontSize: 12,
    lineHeight: 18,
    color: tokens.color.faint,
  },

  sectionHead: {
    fontSize: 16,
    fontWeight: "700",
    color: tokens.color.ink,
    marginTop: tokens.space(6),
    marginBottom: tokens.space(2),
  },
  sectionSub: {
    fontSize: 12,
    fontWeight: "600",
    color: tokens.color.faint,
    marginBottom: tokens.space(3),
  },

  itemCard: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(3),
    gap: 2,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  itemMeta: {
    fontSize: 12,
    color: tokens.color.faint,
  },

  photoStrip: {
    gap: tokens.space(3),
    paddingTop: tokens.space(3),
  },
  photoThumb: {
    width: 76,
    alignItems: "center",
    gap: tokens.space(1),
  },
  photoSwatch: {
    width: 76,
    height: 76,
    borderRadius: tokens.radius.sm,
  },
  photoLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: tokens.color.muted,
  },
  photoSourceNote: {
    marginTop: tokens.space(2),
    fontSize: 11,
    color: tokens.color.faint,
  },

  disclosureRow: {
    borderWidth: 1.5,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(3),
    marginBottom: tokens.space(3),
    gap: tokens.space(2),
  },
  disclosureRowFlagged: {
    borderColor: tokens.color.ink2,
  },
  disclosureLead: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.ink,
    lineHeight: 20,
  },
  disclosureDetail: {
    fontSize: 12,
    lineHeight: 17,
    color: tokens.color.faint,
  },
  disclosureChoices: {
    flexDirection: "row",
    gap: tokens.space(2),
  },
  choiceBtn: {
    minWidth: 64,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.border,
  },
  choiceBtnSelected: {
    backgroundColor: tokens.color.ink,
    borderColor: tokens.color.ink,
  },
  choiceBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: tokens.color.ink2,
  },
  choiceBtnTextSelected: {
    color: tokens.color.onInk,
  },
  disclosureAdjust: {
    fontSize: 12,
    fontWeight: "600",
    color: tokens.color.warning,
  },
  pressedDim: {
    opacity: 0.75,
  },

  choiceGroup: {
    gap: tokens.space(3),
    borderWidth: 1.5,
    borderColor: "transparent",
    borderRadius: tokens.radius.md,
  },
  choiceGroupFlagged: {
    borderColor: tokens.color.ink2,
    padding: tokens.space(2),
  },
  choiceCard: {
    flexDirection: "row",
    gap: tokens.space(3),
    minHeight: 44,
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(3),
  },
  choiceCardSelected: {
    borderColor: tokens.color.accent,
    backgroundColor: tokens.color.accentBg,
  },
  choiceMarker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  choiceMarkerOn: {
    borderColor: tokens.color.accent,
  },
  choiceMarkerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: tokens.color.accent,
  },
  choiceBody: {
    flex: 1,
    gap: 2,
  },
  choiceLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  choiceDetail: {
    fontSize: 12,
    lineHeight: 17,
    color: tokens.color.muted,
  },
  choiceMeta: {
    fontSize: 11,
    fontWeight: "600",
    color: tokens.color.faint,
  },

  dockedBar: {
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(3),
    paddingBottom: tokens.space(3),
  },
  dockedBarPressed: {
    opacity: 0.85,
  },
  dockedBarPending: {
    minHeight: 56,
    justifyContent: "center",
    borderRadius: tokens.radius.md,
    borderWidth: 1.5,
    borderColor: tokens.color.ink2,
    paddingHorizontal: tokens.space(4),
    paddingVertical: tokens.space(3),
    gap: 2,
  },
  dockedBarPendingLead: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.ink,
    lineHeight: 20,
  },
  dockedBarPendingNote: {
    fontSize: 12,
    color: tokens.color.muted,
  },
  dockedBarReady: {
    minHeight: 56,
    justifyContent: "center",
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.color.accent,
    paddingHorizontal: tokens.space(4),
    paddingVertical: tokens.space(3),
    gap: 2,
  },
  dockedBarReadyLead: {
    fontSize: 16,
    fontWeight: "700",
    color: tokens.color.onAccent,
  },
  dockedBarReadyNote: {
    fontSize: 12,
    color: tokens.color.onAccent,
  },
  dockedBarLogged: {
    minHeight: 56,
    justifyContent: "center",
    borderRadius: tokens.radius.md,
    borderWidth: 1.5,
    borderColor: tokens.color.accent,
    paddingHorizontal: tokens.space(4),
    paddingVertical: tokens.space(3),
    gap: 2,
  },
  dockedBarLoggedLead: {
    fontSize: 16,
    fontWeight: "700",
    color: tokens.color.accent,
  },
  dockedBarLoggedNote: {
    fontSize: 12,
    color: tokens.color.muted,
  },
  dockedBarWithdrawLink: {
    marginTop: tokens.space(1),
    minHeight: 44,
    justifyContent: "center",
    alignSelf: "flex-start",
  },
  dockedBarWithdrawLinkText: {
    fontSize: 12,
    fontWeight: "700",
    color: tokens.color.danger,
    textDecorationLine: "underline",
  },
  dockedBarConfirmRow: {
    minHeight: 56,
    justifyContent: "center",
    gap: tokens.space(2),
  },
  dockedBarConfirmPrompt: {
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20,
    color: tokens.color.ink,
  },
  dockedBarConfirmButtons: {
    flexDirection: "row",
    gap: tokens.space(3),
  },
  dockedBarConfirmKeep: {
    flex: 1,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.border,
  },
  dockedBarConfirmKeepText: {
    fontSize: 13,
    fontWeight: "700",
    color: tokens.color.ink2,
  },
  dockedBarConfirmWithdraw: {
    flex: 1,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.danger,
  },
  dockedBarConfirmWithdrawText: {
    fontSize: 13,
    fontWeight: "700",
    color: tokens.color.onInk,
  },
});
