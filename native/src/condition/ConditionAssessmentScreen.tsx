// native/src/condition/ConditionAssessmentScreen.tsx — auto-native-r18 candidate c.
//
// Item Condition Self-Assessment: a seller works through five independent condition criteria
// for an item (fabric wear, stitching, odor, visible flaws, original tags/accessories) and picks
// one mutually-exclusive level per criterion. A real pure function (computeGrade, in ./data.ts)
// derives a live overall grade from those selections as they're made — this is a genuinely
// different shape of "computed output" from the app's price-suggestion screen, which computes
// from static market comps rather than the viewer's own live choices.
//
// Bottom-band decision: rating an item before listing it is a genuine blocked workflow (the
// terminal action can't run until all five criteria have an answer), so per GENERATION.md §3
// this screen keeps a fixed bottom band that behaves as a state machine rather than a plain
// disabled button — while criteria are missing it names exactly which ones in a sentence and,
// on press, scrolls to and highlights the first unanswered one; once every criterion has an
// answer the same control becomes the real "Confirm grade & continue" action, and after
// confirming it becomes a static summary (editing any rating afterward un-confirms it, since the
// confirmed grade would otherwise go stale). The band's state is one `bandState` discriminated
// union rather than several independent booleans, and criteria render as flat, always-visible
// cards with a segmented level control — not a collapsible accordion of steps — so the specific
// shape here is deliberately its own, even though the blocked/ready state-machine principle is
// shared with verification/SellerVerificationScreen and disputes/DisputeCenterScreen.
//
// A11y: exactly one accessibilityLiveRegion="polite" container (the band itself). The one piece
// of text that changes at each state boundary — the blocked sentence, the ready headline, and
// the confirmed headline — each carries accessibilityRole="alert" so a screen reader hears the
// transition, never more than one such text mounted at a time. No accessibilityHint is attached
// anywhere here: every affordance on this screen (rating a level, tapping the band) performs a
// real, local state change, so there is nothing a hint would need to promise.
import { useCallback, useMemo, useRef, useState } from "react";
import {
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { tokens } from "../tokens";
import {
  CRITERIA,
  computeGrade,
  describeUnresolved,
  INITIAL_SELECTIONS,
  LEVEL_OPTIONS,
  type Criterion,
  type CriterionId,
  type GradeResult,
  type LevelId,
  type Selections,
} from "./data";

const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };

type BandState =
  | { kind: "blocked"; message: string; targetId: CriterionId }
  | { kind: "ready"; grade: GradeResult }
  | { kind: "confirmed"; grade: GradeResult };

export function ConditionAssessmentScreen() {
  const [selections, setSelections] = useState<Selections>(INITIAL_SELECTIONS);
  const [confirmed, setConfirmed] = useState(false);
  const [highlightedId, setHighlightedId] = useState<CriterionId | null>(null);
  const listRef = useRef<FlatList<Criterion>>(null);

  const unresolved = useMemo(
    () => CRITERIA.filter((c) => selections[c.id] === undefined),
    [selections],
  );
  // Non-null once unresolved is empty — computeGrade's own guard requires every criterion.
  const grade = useMemo(() => computeGrade(selections), [selections]);
  const answeredCount = CRITERIA.length - unresolved.length;

  const bandState: BandState = useMemo(() => {
    if (unresolved.length > 0) {
      return {
        kind: "blocked",
        message: describeUnresolved(unresolved),
        targetId: unresolved[0].id,
      };
    }
    return confirmed
      ? { kind: "confirmed", grade: grade as GradeResult }
      : { kind: "ready", grade: grade as GradeResult };
  }, [unresolved, confirmed, grade]);

  const selectLevel = useCallback((criterionId: CriterionId, level: LevelId) => {
    setSelections((prev) => ({ ...prev, [criterionId]: level }));
    // Any edit invalidates a prior confirmation — the confirmed grade would otherwise go stale.
    setConfirmed(false);
    setHighlightedId((prev) => (prev === criterionId ? null : prev));
  }, []);

  const scrollToCriterion = useCallback((criterionId: CriterionId) => {
    const index = CRITERIA.findIndex((c) => c.id === criterionId);
    if (index < 0) return;
    setHighlightedId(criterionId);
    listRef.current?.scrollToIndex({ index, viewPosition: 0.15, animated: true });
  }, []);

  const handleBandPress = () => {
    if (bandState.kind === "blocked") {
      scrollToCriterion(bandState.targetId);
      return;
    }
    if (bandState.kind === "ready") {
      // Stand-in for handing off into the listing flow: this screen's job ends at recording the
      // confirmed grade in local state.
      setConfirmed(true);
    }
    // "confirmed" band renders as a static, non-pressable summary — see render below.
  };

  const renderCriterion = ({ item }: { item: Criterion }) => {
    const selectedLevel = selections[item.id];
    const selectedOption = LEVEL_OPTIONS.find((o) => o.id === selectedLevel);
    const isHighlighted = highlightedId === item.id;

    return (
      <View style={[styles.card, isHighlighted && styles.cardHighlighted]}>
        <View style={styles.cardHead}>
          <Text style={styles.cardTitle} accessibilityRole="header">
            {item.title}
          </Text>
          <Text
            style={[styles.cardStatus, selectedOption && styles.cardStatusDone]}
          >
            {selectedOption ? selectedOption.label : "Not yet rated"}
          </Text>
        </View>
        <Text style={styles.cardHint}>{item.hint}</Text>
        <View
          style={styles.levelGrid}
          accessibilityRole="radiogroup"
          accessibilityLabel={`${item.title} condition level`}
        >
          {LEVEL_OPTIONS.map((option) => {
            const isSelected = selectedLevel === option.id;
            return (
              <Pressable
                key={option.id}
                onPress={() => selectLevel(item.id, option.id)}
                accessibilityRole="radio"
                accessibilityState={{ selected: isSelected, checked: isSelected }}
                accessibilityLabel={`${option.label}, ${item.title}`}
                hitSlop={HIT_SLOP}
                style={({ pressed }) => [
                  styles.levelChip,
                  isSelected && styles.levelChipOn,
                  pressed && styles.pressed,
                ]}
              >
                <Text
                  style={[styles.levelChipText, isSelected && styles.levelChipTextOn]}
                >
                  {isSelected ? `✓ ${option.chipLabel}` : option.chipLabel}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.screen}>
      <FlatList
        ref={listRef}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        data={CRITERIA}
        keyExtractor={(c) => c.id}
        renderItem={renderCriterion}
        onScrollToIndexFailed={(info) => {
          listRef.current?.scrollToOffset({
            offset: info.averageItemLength * info.index,
            animated: true,
          });
        }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.kicker}>REPICK · LISTING TOOLS</Text>
            <Text style={styles.title} accessibilityRole="header">
              Condition Assessment
            </Text>
            <Text style={styles.lede}>
              Rate each criterion honestly. Repick computes an overall grade from
              your answers and shows it to buyers on the listing.
            </Text>

            <View style={styles.progressRow}>
              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${(answeredCount / CRITERIA.length) * 100}%` },
                  ]}
                />
              </View>
              <Text style={styles.progressText}>
                {answeredCount} of {CRITERIA.length} rated
              </Text>
            </View>

            <View style={styles.gradeCard}>
              {grade ? (
                <>
                  <View style={styles.gradeBadge}>
                    <Text style={styles.gradeBadgeText}>{grade.grade}</Text>
                  </View>
                  <View style={styles.gradeBody}>
                    <Text style={styles.gradeLabel}>{grade.label}</Text>
                    <View style={styles.meterTrack}>
                      <View
                        style={[styles.meterFill, { width: `${grade.score}%` }]}
                      />
                    </View>
                    <Text style={styles.gradeNote}>
                      {grade.capped
                        ? "Capped by one Heavy Wear rating below."
                        : `Computed from all ${CRITERIA.length} criteria.`}
                    </Text>
                  </View>
                </>
              ) : (
                <>
                  <View style={styles.gradeBadgePlaceholder}>
                    <Text style={styles.gradeBadgePlaceholderText}>—</Text>
                  </View>
                  <View style={styles.gradeBody}>
                    <Text style={styles.gradeLabel}>Grade pending</Text>
                    <Text style={styles.gradeNote}>
                      Rate every criterion below to see your computed grade.
                    </Text>
                  </View>
                </>
              )}
            </View>
          </View>
        }
      />

      <View style={styles.band} accessibilityLiveRegion="polite">
        {bandState.kind === "blocked" ? (
          <Pressable
            onPress={handleBandPress}
            accessibilityRole="button"
            accessibilityLabel={`${bandState.message} Tap to go to the next criterion.`}
            hitSlop={HIT_SLOP}
            style={({ pressed }) => [styles.bandBlocked, pressed && styles.bandPressed]}
          >
            <Text style={styles.bandBlockedTitle} accessibilityRole="alert">
              {bandState.message}
            </Text>
            <Text style={styles.bandBlockedHint}>Tap to go there</Text>
          </Pressable>
        ) : bandState.kind === "ready" ? (
          <Pressable
            onPress={handleBandPress}
            accessibilityRole="button"
            accessibilityLabel={`Confirm grade and continue. Computed grade ${bandState.grade.grade}, ${bandState.grade.label}.`}
            hitSlop={HIT_SLOP}
            style={({ pressed }) => [styles.bandReady, pressed && styles.bandPressed]}
          >
            <Text style={styles.bandReadyTitle} accessibilityRole="alert">
              Confirm grade & continue
            </Text>
            <Text style={styles.bandReadyHint}>
              Computed grade: {bandState.grade.grade} · {bandState.grade.label}
            </Text>
          </Pressable>
        ) : (
          <View style={styles.bandDone}>
            <Text style={styles.bandDoneTitle} accessibilityRole="alert">
              Grade confirmed: {bandState.grade.grade}
            </Text>
            <Text style={styles.bandDoneHint}>
              Ready to list · change any rating above to re-confirm.
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

export default ConditionAssessmentScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: tokens.space(5),
    paddingBottom: tokens.space(6),
  },

  header: {
    paddingTop: tokens.space(4),
    paddingBottom: tokens.space(2),
  },
  kicker: {
    fontSize: 11,
    letterSpacing: 1.6,
    fontWeight: "700",
    color: tokens.color.faint,
  },
  title: {
    marginTop: tokens.space(2),
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: -0.4,
    color: tokens.color.ink,
  },
  lede: {
    marginTop: tokens.space(2),
    fontSize: 14,
    lineHeight: 21,
    color: tokens.color.muted,
  },

  progressRow: {
    marginTop: tokens.space(5),
    gap: tokens.space(2),
  },
  progressTrack: {
    height: 6,
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.border,
    overflow: "hidden",
  },
  progressFill: {
    height: 6,
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.accent,
  },
  progressText: {
    fontSize: 13,
    fontWeight: "700",
    color: tokens.color.ink,
  },

  gradeCard: {
    marginTop: tokens.space(4),
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.space(4),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(4),
  },
  gradeBadge: {
    width: 56,
    height: 56,
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.color.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  gradeBadgeText: {
    fontSize: 20,
    fontWeight: "700",
    color: tokens.color.onAccent,
  },
  gradeBadgePlaceholder: {
    width: 56,
    height: 56,
    borderRadius: tokens.radius.md,
    borderWidth: 1.5,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
  },
  gradeBadgePlaceholderText: {
    fontSize: 20,
    fontWeight: "700",
    color: tokens.color.faint,
  },
  gradeBody: {
    flex: 1,
    gap: tokens.space(1),
  },
  gradeLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  meterTrack: {
    height: 5,
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.border,
    overflow: "hidden",
  },
  meterFill: {
    height: 5,
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.accent,
  },
  gradeNote: {
    fontSize: 12,
    lineHeight: 17,
    color: tokens.color.faint,
  },

  card: {
    marginTop: tokens.space(3),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(4),
    gap: tokens.space(2),
  },
  cardHighlighted: {
    borderWidth: 1.5,
    borderColor: tokens.color.accent,
    padding: tokens.space(4) - 0.5,
  },
  cardHead: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: tokens.space(3),
  },
  cardTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  cardStatus: {
    fontSize: 12,
    fontWeight: "700",
    color: tokens.color.faint,
  },
  cardStatusDone: {
    color: tokens.color.accent,
  },
  cardHint: {
    fontSize: 12,
    lineHeight: 17,
    color: tokens.color.muted,
  },

  levelGrid: {
    marginTop: tokens.space(1),
    flexDirection: "row",
    flexWrap: "wrap",
    gap: tokens.space(2),
  },
  levelChip: {
    flexBasis: "47%",
    flexGrow: 1,
    minHeight: 44,
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: tokens.space(2),
  },
  levelChipOn: {
    borderColor: tokens.color.accent,
    backgroundColor: tokens.color.accent,
  },
  levelChipText: {
    fontSize: 13,
    fontWeight: "600",
    color: tokens.color.ink2,
  },
  levelChipTextOn: {
    color: tokens.color.onAccent,
    fontWeight: "700",
  },
  pressed: {
    opacity: 0.8,
  },

  band: {
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(3),
    paddingBottom: tokens.space(3),
  },
  bandPressed: {
    opacity: 0.85,
  },
  bandBlocked: {
    minHeight: 56,
    justifyContent: "center",
    borderRadius: tokens.radius.md,
    borderWidth: 1.5,
    borderColor: tokens.color.ink2,
    paddingHorizontal: tokens.space(4),
    paddingVertical: tokens.space(3),
    gap: 2,
  },
  bandBlockedTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  bandBlockedHint: {
    fontSize: 12,
    color: tokens.color.muted,
  },
  bandReady: {
    minHeight: 56,
    justifyContent: "center",
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.color.accent,
    paddingHorizontal: tokens.space(4),
    paddingVertical: tokens.space(3),
    gap: 2,
  },
  bandReadyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: tokens.color.onAccent,
  },
  bandReadyHint: {
    fontSize: 12,
    color: tokens.color.onAccent,
  },
  bandDone: {
    minHeight: 56,
    justifyContent: "center",
    borderRadius: tokens.radius.md,
    borderWidth: 1.5,
    borderColor: tokens.color.accent,
    paddingHorizontal: tokens.space(4),
    paddingVertical: tokens.space(3),
    gap: 2,
  },
  bandDoneTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: tokens.color.accent,
  },
  bandDoneHint: {
    fontSize: 12,
    color: tokens.color.muted,
  },
});
