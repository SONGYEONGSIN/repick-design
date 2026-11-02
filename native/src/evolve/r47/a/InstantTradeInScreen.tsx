// native/src/evolve/r47/a/InstantTradeInScreen.tsx — auto-native-r47 candidate a.
//
// Instant Trade-In Offer: a marketplace-operated instant buyback, not a
// peer-to-peer trade proposal and not the existing negotiation/offer-thread
// screens. The user answers a short condition questionnaire about an item
// they own, Repick computes a cash offer from a fixed formula the moment
// every question is answered, and the user accepts or declines that exact
// number on the spot — there is no counterparty, no haggling, and (unlike
// evolve/r25/a's TradeInAppraisalScreen) no "submit and wait for review"
// step. The number on screen IS the final offer.
//
// Bottom band (GENERATION.md §3 blocked-workflow state machine) runs three
// genuinely different shapes in sequence, not just a disabled/enabled toggle:
//   1. "blocked"  — one or more condition questions unanswered. The band
//      names the next unanswered question in a sentence, and tapping it
//      really scrolls the list to that row (FlatList.scrollToIndex) AND
//      moves accessibility focus onto it (AccessibilityInfo.setAccessibility-
//      Focus on that row's own node) — not just a label update.
//   2. "primed"   — every question answered, offer computed, but not yet
//      revealed. Tapping "See my offer" reveals the amount above and
//      advances the band to the accept/decline phase.
//   3. "offered" → "accepted" | "declined" — the band itself becomes a
//      two-button Accept/Decline row (per this catalog's convention of
//      turning the band into Cancel/Confirm-style buttons instead of a
//      native Alert), then a terminal confirmation with a "Start over" link.
// Changing any answer after the offer was revealed resets the reveal and
// any decision, since the number it was based on may no longer be current.
//
// Style keys below (offerBand*, questionRow*, optionChip*) are written fresh
// for this screen, not copied from dockedBar*/deadlineDock* elsewhere in the
// catalog, per GENERATION.md's "form choice can be right but code-surface
// copying still loses" rule.
import { useMemo, useRef, useState } from "react";
import {
  AccessibilityInfo,
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  findNodeHandle,
  type ListRenderItem,
} from "react-native";
import { tokens } from "../../../tokens";
import {
  BASE_SUBTOTAL_USD,
  CONDITION_QUESTIONS,
  ITEM,
  MIN_OFFER_USD,
  OFFER_VALID_HOURS,
  computeOfferUsd,
  formatUsd,
  totalDeductionUsd,
  type ConditionQuestion,
} from "./data";

const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };
const FOCUS_DELAY_MS = 260;

type Decision = "accepted" | "declined" | null;
type Phase = "blocked" | "primed" | "offered" | "accepted" | "declined";

function QuestionRow({
  question,
  selectedId,
  flagged,
  onSelect,
  setRowRef,
}: {
  question: ConditionQuestion;
  selectedId: string | undefined;
  flagged: boolean;
  onSelect: (optionId: string) => void;
  setRowRef: (node: View | null) => void;
}) {
  return (
    <View ref={setRowRef} style={[styles.questionRow, flagged && styles.questionRowFlagged]}>
      <Text style={styles.questionPrompt}>{question.prompt}</Text>
      <Text style={styles.questionDetail}>{question.detail}</Text>
      <View
        style={styles.optionGroup}
        accessibilityRole="radiogroup"
        accessibilityLabel={question.prompt}
      >
        {question.options.map((option) => {
          const selected = selectedId === option.id;
          return (
            <Pressable
              key={option.id}
              onPress={() => onSelect(option.id)}
              hitSlop={HIT_SLOP}
              accessibilityRole="radio"
              accessibilityState={{ selected, checked: selected }}
              accessibilityLabel={option.label}
              style={({ pressed }) => [
                styles.optionChip,
                selected && styles.optionChipSelected,
                pressed && styles.pressedDim,
              ]}
            >
              <View style={[styles.optionMarker, selected && styles.optionMarkerOn]}>
                {selected ? <View style={styles.optionMarkerDot} /> : null}
              </View>
              <Text style={[styles.optionChipText, selected && styles.optionChipTextSelected]}>
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export function InstantTradeInScreen() {
  const [answers, setAnswers] = useState<Partial<Record<string, string>>>({});
  const [revealed, setRevealed] = useState(false);
  const [decision, setDecision] = useState<Decision>(null);

  const listRef = useRef<FlatList<ConditionQuestion>>(null);
  const rowRefs = useRef<Record<string, View | null>>({});

  const firstUnanswered = CONDITION_QUESTIONS.find((q) => !answers[q.id]);
  const answeredCount = CONDITION_QUESTIONS.filter((q) => answers[q.id]).length;
  const allAnswered = !firstUnanswered;

  const deductionUsd = totalDeductionUsd(answers);
  const offerUsd = computeOfferUsd(answers);
  const atFloor = BASE_SUBTOTAL_USD - deductionUsd < MIN_OFFER_USD;

  const phase: Phase = useMemo(() => {
    if (decision === "accepted") return "accepted";
    if (decision === "declined") return "declined";
    if (revealed) return "offered";
    if (allAnswered) return "primed";
    return "blocked";
  }, [decision, revealed, allAnswered]);

  const jumpToQuestion = (id: string) => {
    const index = CONDITION_QUESTIONS.findIndex((q) => q.id === id);
    if (index < 0) return;
    listRef.current?.scrollToIndex({ index, animated: true, viewPosition: 0.2 });
    setTimeout(() => {
      const node = rowRefs.current[id];
      const tag = node ? findNodeHandle(node) : null;
      if (tag) AccessibilityInfo.setAccessibilityFocus(tag);
    }, FOCUS_DELAY_MS);
  };

  const selectOption = (questionId: string, optionId: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
    // The offer this was based on may no longer be current — require a
    // fresh reveal and decision rather than silently honoring a stale one.
    if (revealed) setRevealed(false);
    if (decision) setDecision(null);
  };

  const startOver = () => {
    setAnswers({});
    setRevealed(false);
    setDecision(null);
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  const handleBandPress = () => {
    if (phase === "blocked") {
      if (firstUnanswered) jumpToQuestion(firstUnanswered.id);
      return;
    }
    if (phase === "primed") {
      setRevealed(true);
      listRef.current?.scrollToOffset({ offset: 0, animated: true });
    }
  };

  const renderItem: ListRenderItem<ConditionQuestion> = ({ item }) => (
    <QuestionRow
      question={item}
      selectedId={answers[item.id]}
      flagged={phase === "blocked" && firstUnanswered?.id === item.id}
      onSelect={(optionId) => selectOption(item.id, optionId)}
      setRowRef={(node) => {
        rowRefs.current[item.id] = node;
      }}
    />
  );

  const header = (
    <View>
      <Text style={styles.kicker}>REPICK INSTANT BUYBACK</Text>
      <Text style={styles.title} accessibilityRole="header">
        Get Your Instant Trade-In Offer
      </Text>
      <Text style={styles.lede}>
        Answer a few quick questions about your item and get a real cash
        offer right now — no listing, no waiting for a buyer to show up.
      </Text>

      <View style={styles.itemCard}>
        <Text style={styles.itemTitle}>{ITEM.title}</Text>
        <Text style={styles.itemMeta}>
          {ITEM.brand} · {ITEM.categoryLabel}
        </Text>
      </View>

      {phase === "offered" || phase === "accepted" || phase === "declined" ? (
        <View style={styles.offerCard}>
          <Text style={styles.offerLabel}>Your Instant Offer</Text>
          <Text style={styles.offerAmount} accessibilityLabel={`Instant offer of ${formatUsd(offerUsd)}`}>
            {formatUsd(offerUsd)}
          </Text>
          <Text style={styles.offerSub}>
            {deductionUsd > 0
              ? `Base buyback price minus ${formatUsd(deductionUsd)} for condition.`
              : "Base buyback price — no condition deductions."}
            {atFloor ? " Minimum guaranteed offer applied." : ""}
          </Text>
          {phase === "accepted" ? (
            <Text style={styles.offerStatusNote}>
              Locked in — good for {OFFER_VALID_HOURS} hours while you ship it in.
            </Text>
          ) : phase === "declined" ? (
            <Text style={styles.offerStatusNote}>Declined — no trade-in was created.</Text>
          ) : null}
        </View>
      ) : (
        <View style={styles.offerPlaceholder}>
          <Text style={styles.offerPlaceholderText}>
            Finish the condition check below to see your instant offer.
          </Text>
        </View>
      )}

      <Text style={styles.sectionHead} accessibilityRole="header">
        Condition Check
      </Text>
      <Text style={styles.sectionSub}>
        {answeredCount} of {CONDITION_QUESTIONS.length} questions answered
      </Text>
    </View>
  );

  const footer = (
    <Text style={styles.footerNote}>
      This offer is based only on your answers above. If the item doesn't
      match your answers once it arrives, Repick may adjust the amount before
      paying out.
    </Text>
  );

  return (
    <SafeAreaView style={styles.screen}>
      <FlatList
        ref={listRef}
        data={CONDITION_QUESTIONS}
        keyExtractor={(q) => q.id}
        renderItem={renderItem}
        ListHeaderComponent={header}
        ListFooterComponent={footer}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        onScrollToIndexFailed={(info) => {
          listRef.current?.scrollToOffset({
            offset: info.averageItemLength * info.index,
            animated: true,
          });
        }}
      />

      <View style={styles.offerBand} accessibilityLiveRegion="polite">
        {phase === "blocked" ? (
          <Pressable
            onPress={handleBandPress}
            hitSlop={HIT_SLOP}
            accessibilityRole="button"
            accessibilityLabel={`${
              firstUnanswered ? `Answer "${firstUnanswered.prompt}"` : "Finish the condition check"
            } to see your offer. Tap to jump there.`}
            style={({ pressed }) => [styles.offerBandBlocked, pressed && styles.offerBandPressed]}
          >
            <Text style={styles.offerBandBlockedLead} accessibilityRole="alert">
              {firstUnanswered
                ? `Answer "${firstUnanswered.prompt}" to see your offer`
                : "Finish the condition check to see your offer"}
            </Text>
            <Text style={styles.offerBandBlockedHint}>Tap to jump there</Text>
          </Pressable>
        ) : phase === "primed" ? (
          <Pressable
            onPress={handleBandPress}
            hitSlop={HIT_SLOP}
            accessibilityRole="button"
            accessibilityLabel={`See my offer. Estimated ${formatUsd(offerUsd)}.`}
            style={({ pressed }) => [styles.offerBandPrimed, pressed && styles.offerBandPressed]}
          >
            <Text style={styles.offerBandPrimedLead} accessibilityRole="alert">
              See my offer
            </Text>
            <Text style={styles.offerBandPrimedHint}>All questions answered</Text>
          </Pressable>
        ) : phase === "offered" ? (
          <View style={styles.offerBandOffered}>
            <Text style={styles.offerBandOfferedLead} accessibilityRole="alert">
              Your instant offer: {formatUsd(offerUsd)}
            </Text>
            <Text style={styles.offerBandOfferedHint}>
              Accept to lock it in, or decline if it's not for you.
            </Text>
            <View style={styles.offerBandButtons}>
              <Pressable
                onPress={() => setDecision("declined")}
                hitSlop={HIT_SLOP}
                accessibilityRole="button"
                accessibilityLabel="Decline this instant offer"
                style={({ pressed }) => [
                  styles.offerBandDeclineBtn,
                  pressed && styles.offerBandPressed,
                ]}
              >
                <Text style={styles.offerBandDeclineText}>Decline</Text>
              </Pressable>
              <Pressable
                onPress={() => setDecision("accepted")}
                hitSlop={HIT_SLOP}
                accessibilityRole="button"
                accessibilityLabel={`Accept offer of ${formatUsd(offerUsd)}`}
                style={({ pressed }) => [
                  styles.offerBandAcceptBtn,
                  pressed && styles.offerBandPressed,
                ]}
              >
                <Text style={styles.offerBandAcceptText}>Accept offer</Text>
              </Pressable>
            </View>
          </View>
        ) : phase === "accepted" ? (
          <View style={styles.offerBandAccepted}>
            <Text style={styles.offerBandAcceptedLead} accessibilityRole="alert">
              Offer accepted — {formatUsd(offerUsd)}
            </Text>
            <Text style={styles.offerBandAcceptedHint}>
              We'll email shipping instructions shortly.
            </Text>
            <Pressable
              onPress={startOver}
              hitSlop={HIT_SLOP}
              accessibilityRole="button"
              accessibilityLabel="Start a new trade-in"
              style={styles.offerBandStartOver}
            >
              <Text style={styles.offerBandStartOverText}>Start over</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.offerBandDeclined}>
            <Text style={styles.offerBandDeclinedLead} accessibilityRole="alert">
              Offer declined
            </Text>
            <Text style={styles.offerBandDeclinedHint}>
              You can restart anytime if you change your mind.
            </Text>
            <Pressable
              onPress={startOver}
              hitSlop={HIT_SLOP}
              accessibilityRole="button"
              accessibilityLabel="Start a new trade-in"
              style={styles.offerBandStartOver}
            >
              <Text style={styles.offerBandStartOverText}>Start over</Text>
            </Pressable>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

export default InstantTradeInScreen;

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: tokens.color.bg },
  listContent: {
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
  title: {
    marginTop: tokens.space(2),
    fontSize: 26,
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

  itemCard: {
    marginTop: tokens.space(5),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(3),
    gap: tokens.space(1),
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

  offerPlaceholder: {
    marginTop: tokens.space(4),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    borderStyle: "dashed",
    padding: tokens.space(4),
  },
  offerPlaceholderText: {
    fontSize: 13,
    lineHeight: 19,
    color: tokens.color.faint,
    textAlign: "center",
  },

  offerCard: {
    marginTop: tokens.space(4),
    borderWidth: 1.5,
    borderColor: tokens.color.accent,
    borderRadius: tokens.radius.md,
    padding: tokens.space(4),
    gap: tokens.space(1),
    backgroundColor: tokens.color.accentBg,
  },
  offerLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
    color: tokens.color.muted,
  },
  offerAmount: {
    marginTop: tokens.space(1),
    fontSize: 40,
    fontWeight: "800",
    letterSpacing: -0.5,
    color: tokens.color.ink,
    fontVariant: ["tabular-nums"],
  },
  offerSub: {
    fontSize: 12,
    lineHeight: 18,
    color: tokens.color.muted,
  },
  offerStatusNote: {
    marginTop: tokens.space(1),
    fontSize: 12,
    fontWeight: "700",
    color: tokens.color.accent,
  },

  sectionHead: {
    fontSize: 16,
    fontWeight: "700",
    color: tokens.color.ink,
    marginTop: tokens.space(6),
    marginBottom: tokens.space(1),
  },
  sectionSub: {
    fontSize: 12,
    fontWeight: "600",
    color: tokens.color.faint,
    marginBottom: tokens.space(3),
  },

  questionRow: {
    borderWidth: 1.5,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(3),
    marginBottom: tokens.space(3),
    gap: tokens.space(2),
  },
  questionRowFlagged: {
    borderColor: tokens.color.ink2,
  },
  questionPrompt: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.ink,
    lineHeight: 20,
  },
  questionDetail: {
    fontSize: 12,
    lineHeight: 17,
    color: tokens.color.faint,
  },
  optionGroup: {
    gap: tokens.space(2),
    marginTop: tokens.space(1),
  },
  optionChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.space(2),
    minHeight: 44,
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.sm,
    paddingHorizontal: tokens.space(3),
    paddingVertical: tokens.space(2),
  },
  optionChipSelected: {
    borderColor: tokens.color.accent,
    backgroundColor: tokens.color.accentBg,
  },
  optionMarker: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
  },
  optionMarkerOn: {
    borderColor: tokens.color.accent,
  },
  optionMarkerDot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: tokens.color.accent,
  },
  optionChipText: {
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
    color: tokens.color.ink2,
  },
  optionChipTextSelected: {
    color: tokens.color.ink,
    fontWeight: "700",
  },
  pressedDim: { opacity: 0.8 },

  footerNote: {
    marginTop: tokens.space(3),
    fontSize: 12,
    lineHeight: 18,
    color: tokens.color.faint,
  },

  offerBand: {
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(3),
    paddingBottom: tokens.space(3),
  },
  offerBandPressed: { opacity: 0.85 },

  offerBandBlocked: {
    minHeight: 56,
    justifyContent: "center",
    borderRadius: tokens.radius.md,
    borderWidth: 1.5,
    borderColor: tokens.color.ink2,
    paddingHorizontal: tokens.space(4),
    paddingVertical: tokens.space(3),
    gap: 2,
  },
  offerBandBlockedLead: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.ink,
    lineHeight: 20,
  },
  offerBandBlockedHint: {
    fontSize: 12,
    color: tokens.color.muted,
  },

  offerBandPrimed: {
    minHeight: 56,
    justifyContent: "center",
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.color.accent,
    paddingHorizontal: tokens.space(4),
    paddingVertical: tokens.space(3),
    gap: 2,
  },
  offerBandPrimedLead: {
    fontSize: 16,
    fontWeight: "700",
    color: tokens.color.onAccent,
  },
  offerBandPrimedHint: {
    fontSize: 12,
    color: tokens.color.onAccent,
  },

  offerBandOffered: {
    paddingVertical: tokens.space(1),
    gap: tokens.space(1),
  },
  offerBandOfferedLead: {
    fontSize: 16,
    fontWeight: "800",
    color: tokens.color.ink,
  },
  offerBandOfferedHint: {
    fontSize: 12,
    color: tokens.color.muted,
  },
  offerBandButtons: {
    flexDirection: "row",
    gap: tokens.space(3),
    marginTop: tokens.space(2),
  },
  offerBandDeclineBtn: {
    flex: 1,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.border,
  },
  offerBandDeclineText: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.ink2,
  },
  offerBandAcceptBtn: {
    flex: 1,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.accent,
  },
  offerBandAcceptText: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.onAccent,
  },

  offerBandAccepted: {
    paddingVertical: tokens.space(1),
    gap: tokens.space(1),
  },
  offerBandAcceptedLead: {
    fontSize: 16,
    fontWeight: "800",
    color: tokens.color.accent,
  },
  offerBandAcceptedHint: {
    fontSize: 12,
    color: tokens.color.muted,
  },

  offerBandDeclined: {
    paddingVertical: tokens.space(1),
    gap: tokens.space(1),
  },
  offerBandDeclinedLead: {
    fontSize: 16,
    fontWeight: "800",
    color: tokens.color.ink,
  },
  offerBandDeclinedHint: {
    fontSize: 12,
    color: tokens.color.muted,
  },

  offerBandStartOver: {
    marginTop: tokens.space(1),
    minHeight: 44,
    justifyContent: "center",
    alignSelf: "flex-start",
  },
  offerBandStartOverText: {
    fontSize: 12,
    fontWeight: "700",
    color: tokens.color.accent,
    textDecorationLine: "underline",
  },
});
