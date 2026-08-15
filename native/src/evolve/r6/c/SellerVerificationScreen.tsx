// native/src/evolve/r6/c/SellerVerificationScreen.tsx — auto-native-r6 candidate c.
//
// Seller Verification: a 4-step identity/seller-verification flow (identity document capture,
// payout method, required attestations, review + a real terminal "Submit for review" action).
// Distinct shape from the app's other multi-step screen (listing/ListingCreateScreen's tab
// wizard): this screen is a single scrollable accordion of step cards — tap a card's header to
// expand/collapse it in place, rather than swapping the whole body per step. Still a
// terminal-action screen, so per r3 (auto-native-r3, L1, superseded/extended by auto-native-r5,
// L2) the bottom band stays fixed and functions as a state machine, not a static disabled button:
// it names the exact blocker in words and, tapped, jumps + expands the first unresolved step.
// Per r5's specific winning refinement, the blocking status text is promoted to
// accessibilityRole="alert" + the band itself carries accessibilityLiveRegion="polite" so a
// screen reader hears the state change, not just sees it (see styles.band usage below,
// ~line 330, and bandBlockedTitle ~line 345).
import { useMemo, useRef, useState } from "react";
import {
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { tokens } from "../../../tokens";
import {
  ATTESTATION_ITEMS,
  DOCUMENT_ITEMS,
  PAYOUT_ACCOUNT,
  REVIEW_WINDOW_LABEL,
  STEP_META,
  SUBMITTED_AT_LABEL,
  type StepMeta,
} from "./data";

const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };

type Blocking = { step: number; message: string } | null;

export function SellerVerificationScreen() {
  const [documentConfirmed, setDocumentConfirmed] = useState<
    Record<string, boolean>
  >({});
  const [payoutConfirmed, setPayoutConfirmed] = useState(false);
  const [attestations, setAttestations] = useState<Record<string, boolean>>(
    {},
  );
  const [expandedStep, setExpandedStep] = useState<number | null>(0);
  const [submitted, setSubmitted] = useState(false);
  const listRef = useRef<FlatList<StepMeta>>(null);

  const documentDoneCount = DOCUMENT_ITEMS.filter(
    (item) => documentConfirmed[item.id],
  ).length;
  const step1Valid = documentDoneCount === DOCUMENT_ITEMS.length;
  const step2Valid = payoutConfirmed;
  const attestationDoneCount = ATTESTATION_ITEMS.filter(
    (item) => attestations[item.id],
  ).length;
  const step3Valid = attestationDoneCount === ATTESTATION_ITEMS.length;

  const blocking: Blocking = useMemo(() => {
    if (!step1Valid) {
      const left = DOCUMENT_ITEMS.length - documentDoneCount;
      return {
        step: 0,
        message: `${left} identity item${left === 1 ? "" : "s"} left to confirm`,
      };
    }
    if (!step2Valid) {
      return { step: 1, message: "Confirm your payout account" };
    }
    if (!step3Valid) {
      const left = ATTESTATION_ITEMS.length - attestationDoneCount;
      return {
        step: 2,
        message: `${left} attestation${left === 1 ? "" : "s"} left to agree to`,
      };
    }
    return null;
  }, [
    step1Valid,
    step2Valid,
    step3Valid,
    documentDoneCount,
    attestationDoneCount,
  ]);

  const stepDone = [step1Valid, step2Valid, step3Valid, submitted];
  const completedStepCount = stepDone.filter(Boolean).length;

  const markEdited = () => {
    if (submitted) setSubmitted(false);
  };

  const toggleDocument = (id: string) => {
    markEdited();
    setDocumentConfirmed((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const togglePayout = () => {
    markEdited();
    setPayoutConfirmed((prev) => !prev);
  };

  const toggleAttestation = (id: string) => {
    markEdited();
    setAttestations((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const jumpTo = (index: number) => {
    setExpandedStep(index);
    listRef.current?.scrollToIndex({ index, viewPosition: 0.05, animated: true });
  };

  const toggleExpand = (index: number) => {
    setExpandedStep((prev) => (prev === index ? null : index));
  };

  const handleSubmit = () => {
    if (blocking) {
      jumpTo(blocking.step);
      return;
    }
    setSubmitted(true);
    setExpandedStep(3);
  };

  const renderStepBody = (index: number) => {
    if (index === 0) {
      return (
        <View style={styles.cardBody}>
          {DOCUMENT_ITEMS.map((item) => {
            const confirmed = !!documentConfirmed[item.id];
            return (
              <Pressable
                key={item.id}
                onPress={() => toggleDocument(item.id)}
                accessibilityRole="button"
                accessibilityState={{ selected: confirmed }}
                accessibilityLabel={`${item.label}, ${confirmed ? "confirmed" : "not confirmed"}`}
                accessibilityHint="Press again to clear this confirmation"
                hitSlop={HIT_SLOP}
                style={({ pressed }) => [
                  styles.itemRow,
                  confirmed && styles.itemRowDone,
                  pressed && styles.itemRowPressed,
                ]}
              >
                <View style={styles.itemThumb}>
                  <View
                    style={[
                      styles.marker,
                      confirmed && styles.markerDone,
                    ]}
                  >
                    {confirmed ? (
                      <Text style={styles.markerCheck}>✓</Text>
                    ) : null}
                  </View>
                </View>
                <View style={styles.itemBody}>
                  <Text style={styles.itemLabel}>{item.label}</Text>
                  <Text style={styles.itemHint}>{item.hint}</Text>
                  <Text
                    style={[
                      styles.itemStatus,
                      confirmed && styles.itemStatusDone,
                    ]}
                  >
                    {confirmed ? "Confirmed" : "Not confirmed — tap to confirm"}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      );
    }

    if (index === 1) {
      return (
        <View style={styles.cardBody}>
          <View style={styles.payoutCard}>
            <View style={styles.payoutRow}>
              <Text style={styles.payoutLabel}>Bank</Text>
              <Text style={styles.payoutValue}>{PAYOUT_ACCOUNT.bankLabel}</Text>
            </View>
            <View style={styles.payoutRow}>
              <Text style={styles.payoutLabel}>Account</Text>
              <Text style={styles.payoutValue}>
                {PAYOUT_ACCOUNT.accountMasked}
              </Text>
            </View>
            <View style={styles.payoutRow}>
              <Text style={styles.payoutLabel}>Holder</Text>
              <Text style={styles.payoutValue}>{PAYOUT_ACCOUNT.holderName}</Text>
            </View>
            <View style={[styles.payoutRow, styles.payoutRowLast]}>
              <Text style={styles.payoutLabel}>Type</Text>
              <Text style={styles.payoutValue}>{PAYOUT_ACCOUNT.accountType}</Text>
            </View>
          </View>
          <Pressable
            onPress={togglePayout}
            accessibilityRole="button"
            accessibilityState={{ selected: payoutConfirmed }}
            accessibilityLabel={`This is my payout account, ${payoutConfirmed ? "confirmed" : "not confirmed"}`}
            accessibilityHint="Press again to clear this confirmation"
            hitSlop={HIT_SLOP}
            style={({ pressed }) => [
              styles.itemRow,
              payoutConfirmed && styles.itemRowDone,
              pressed && styles.itemRowPressed,
            ]}
          >
            <View
              style={[styles.marker, payoutConfirmed && styles.markerDone]}
            >
              {payoutConfirmed ? (
                <Text style={styles.markerCheck}>✓</Text>
              ) : null}
            </View>
            <View style={styles.itemBody}>
              <Text style={styles.itemLabel}>This is my payout account</Text>
              <Text style={styles.itemHint}>
                Sale proceeds go here after a buyer confirms handoff.
              </Text>
            </View>
          </Pressable>
        </View>
      );
    }

    if (index === 2) {
      return (
        <View style={styles.cardBody}>
          {ATTESTATION_ITEMS.map((item) => {
            const checked = !!attestations[item.id];
            return (
              <Pressable
                key={item.id}
                onPress={() => toggleAttestation(item.id)}
                accessibilityRole="checkbox"
                accessibilityState={{ checked }}
                accessibilityLabel={item.label}
                accessibilityHint="Press again to clear this attestation"
                hitSlop={HIT_SLOP}
                style={({ pressed }) => [
                  styles.attestRow,
                  pressed && styles.itemRowPressed,
                ]}
              >
                <View style={[styles.checkbox, checked && styles.checkboxOn]}>
                  {checked ? (
                    <Text style={styles.markerCheck}>✓</Text>
                  ) : null}
                </View>
                <Text style={styles.attestLabel}>{item.label}</Text>
              </Pressable>
            );
          })}
        </View>
      );
    }

    return (
      <View style={styles.cardBody}>
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryLeft}>
              <Text style={styles.summaryLabel}>Identity document</Text>
              <Text style={styles.summaryValue}>
                {documentDoneCount} of {DOCUMENT_ITEMS.length} confirmed
              </Text>
            </View>
            <Pressable
              onPress={() => jumpTo(0)}
              accessibilityRole="button"
              accessibilityLabel="Edit identity document"
              hitSlop={HIT_SLOP}
              style={styles.editBtn}
            >
              <Text style={styles.editBtnText}>Edit</Text>
            </Pressable>
          </View>
          <View style={styles.summaryRow}>
            <View style={styles.summaryLeft}>
              <Text style={styles.summaryLabel}>Payout method</Text>
              <Text style={styles.summaryValue}>
                {payoutConfirmed
                  ? PAYOUT_ACCOUNT.accountMasked
                  : "Not confirmed"}
              </Text>
            </View>
            <Pressable
              onPress={() => jumpTo(1)}
              accessibilityRole="button"
              accessibilityLabel="Edit payout method"
              hitSlop={HIT_SLOP}
              style={styles.editBtn}
            >
              <Text style={styles.editBtnText}>Edit</Text>
            </Pressable>
          </View>
          <View style={[styles.summaryRow, styles.summaryRowLast]}>
            <View style={styles.summaryLeft}>
              <Text style={styles.summaryLabel}>Attestations</Text>
              <Text style={styles.summaryValue}>
                {attestationDoneCount} of {ATTESTATION_ITEMS.length} agreed
              </Text>
            </View>
            <Pressable
              onPress={() => jumpTo(2)}
              accessibilityRole="button"
              accessibilityLabel="Edit attestations"
              hitSlop={HIT_SLOP}
              style={styles.editBtn}
            >
              <Text style={styles.editBtnText}>Edit</Text>
            </Pressable>
          </View>
        </View>
        {submitted ? (
          <View style={styles.submittedNote}>
            <Text style={styles.submittedNoteText}>
              Submitted at {SUBMITTED_AT_LABEL}. Repick usually finishes review
              within {REVIEW_WINDOW_LABEL}. You can leave this screen — your
              submission is saved.
            </Text>
          </View>
        ) : (
          <Text style={styles.footerNote}>
            Submitting sends this application to Repick's trust and safety
            team. You cannot list items for sale until it is approved.
          </Text>
        )}
      </View>
    );
  };

  const renderItem = ({ item, index }: { item: StepMeta; index: number }) => {
    const expanded = expandedStep === index;
    const done = stepDone[index];
    const current = !done && (blocking ? blocking.step === index : false);
    const statusLabel = done ? "Complete" : current ? "In progress" : "Not started";

    return (
      <View style={styles.card}>
        <Pressable
          onPress={() => toggleExpand(index)}
          accessibilityRole="button"
          accessibilityState={{ expanded }}
          accessibilityLabel={`${item.title}, ${statusLabel}${expanded ? ", expanded" : ", collapsed"}`}
          hitSlop={HIT_SLOP}
          style={({ pressed }) => [
            styles.cardHeader,
            pressed && styles.cardHeaderPressed,
          ]}
        >
          <View
            style={[
              styles.stepMarker,
              done && styles.stepMarkerDone,
              current && styles.stepMarkerCurrent,
            ]}
          >
            {done ? (
              <Text style={styles.stepMarkerCheck}>✓</Text>
            ) : (
              <Text
                style={[
                  styles.stepMarkerNum,
                  current && styles.stepMarkerNumCurrent,
                ]}
              >
                {index + 1}
              </Text>
            )}
          </View>
          <View style={styles.cardHeaderBody}>
            <Text style={styles.cardKicker}>{item.kicker}</Text>
            <Text style={styles.cardTitle} accessibilityRole="header">
              {item.title}
            </Text>
          </View>
          <View style={styles.cardHeaderRight}>
            <Text
              style={[
                styles.cardStatus,
                done && styles.cardStatusDone,
                current && styles.cardStatusCurrent,
              ]}
            >
              {statusLabel}
            </Text>
            <Text style={styles.chevron}>{expanded ? "▾" : "▸"}</Text>
          </View>
        </Pressable>
        {expanded ? (
          <>
            <Text style={styles.cardLede}>{item.lede}</Text>
            {renderStepBody(index)}
          </>
        ) : null}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.screen}>
      <FlatList
        ref={listRef}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        data={STEP_META as StepMeta[]}
        keyExtractor={(step) => step.id}
        renderItem={renderItem}
        onScrollToIndexFailed={(info) => {
          listRef.current?.scrollToOffset({
            offset: info.averageItemLength * info.index,
            animated: true,
          });
        }}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.kicker}>REPICK SELLER</Text>
            <Text style={styles.title} accessibilityRole="header">
              Seller verification
            </Text>
            <Text style={styles.lede}>
              Verify your identity and payout details before you can list
              items for sale. Tap a section to review it.
            </Text>

            <View style={styles.progress}>
              <View style={styles.pips}>
                {STEP_META.map((step, index) => (
                  <View
                    key={step.id}
                    style={[styles.pip, stepDone[index] && styles.pipDone]}
                  />
                ))}
              </View>
              <Text style={styles.progressText}>
                {completedStepCount} of {STEP_META.length} steps complete
              </Text>
            </View>
          </View>
        }
      />

      <View style={styles.band} accessibilityLiveRegion="polite">
        {blocking ? (
          <Pressable
            onPress={() => jumpTo(blocking.step)}
            accessibilityRole="button"
            accessibilityLabel={`${blocking.message}. Tap to go to that step.`}
            hitSlop={HIT_SLOP}
            style={({ pressed }) => [
              styles.bandBlocked,
              pressed && styles.bandPressed,
            ]}
          >
            <Text style={styles.bandBlockedTitle} accessibilityRole="alert">
              {blocking.message}
            </Text>
            <Text style={styles.bandBlockedHint}>Tap to go there</Text>
          </Pressable>
        ) : submitted ? (
          <View style={styles.bandDone}>
            <Text style={styles.bandDoneTitle}>Submitted for review</Text>
            <Text style={styles.bandDoneHint}>
              Sent at {SUBMITTED_AT_LABEL} · usually {REVIEW_WINDOW_LABEL}
            </Text>
          </View>
        ) : (
          <Pressable
            onPress={handleSubmit}
            accessibilityRole="button"
            accessibilityLabel="Submit for review"
            hitSlop={HIT_SLOP}
            style={({ pressed }) => [
              styles.bandReady,
              pressed && styles.bandPressed,
            ]}
          >
            <Text style={styles.bandReadyTitle}>Submit for review</Text>
            <Text style={styles.bandReadyHint}>
              All {STEP_META.length} steps complete
            </Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}

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
  progress: {
    marginTop: tokens.space(5),
    gap: tokens.space(2),
  },
  pips: {
    flexDirection: "row",
    gap: tokens.space(1),
  },
  pip: {
    flex: 1,
    height: 6,
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.border,
  },
  pipDone: {
    backgroundColor: tokens.color.accent,
  },
  progressText: {
    fontSize: 13,
    fontWeight: "700",
    color: tokens.color.ink,
  },

  card: {
    marginTop: tokens.space(3),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    overflow: "hidden",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.space(3),
    minHeight: 44,
    paddingHorizontal: tokens.space(4),
    paddingVertical: tokens.space(3),
    backgroundColor: tokens.color.bg,
  },
  cardHeaderPressed: {
    opacity: 0.8,
  },
  stepMarker: {
    width: 28,
    height: 28,
    borderRadius: tokens.radius.sm,
    borderWidth: 1.5,
    borderColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    alignItems: "center",
    justifyContent: "center",
  },
  stepMarkerCurrent: {
    borderColor: tokens.color.ink2,
  },
  stepMarkerDone: {
    borderColor: tokens.color.accent,
    backgroundColor: tokens.color.accent,
  },
  stepMarkerNum: {
    fontSize: 13,
    fontWeight: "700",
    color: tokens.color.faint,
  },
  stepMarkerNumCurrent: {
    color: tokens.color.ink,
  },
  stepMarkerCheck: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.onAccent,
  },
  cardHeaderBody: {
    flex: 1,
    gap: 2,
  },
  cardKicker: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    color: tokens.color.faint,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  cardHeaderRight: {
    alignItems: "flex-end",
    gap: 2,
  },
  cardStatus: {
    fontSize: 12,
    fontWeight: "700",
    color: tokens.color.faint,
  },
  cardStatusDone: {
    color: tokens.color.accent,
  },
  cardStatusCurrent: {
    color: tokens.color.ink,
  },
  chevron: {
    fontSize: 13,
    color: tokens.color.faint,
  },
  cardLede: {
    paddingHorizontal: tokens.space(4),
    paddingTop: 0,
    paddingBottom: tokens.space(2),
    fontSize: 13,
    lineHeight: 19,
    color: tokens.color.muted,
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    marginTop: 0,
  },
  cardBody: {
    paddingHorizontal: tokens.space(4),
    paddingBottom: tokens.space(4),
    gap: tokens.space(2),
  },

  itemRow: {
    flexDirection: "row",
    gap: tokens.space(3),
    minHeight: 44,
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(3),
    backgroundColor: tokens.color.bg,
  },
  itemRowDone: {
    borderColor: tokens.color.accent,
  },
  itemRowPressed: {
    opacity: 0.75,
  },
  itemThumb: {
    alignItems: "center",
    justifyContent: "center",
  },
  marker: {
    width: 24,
    height: 24,
    borderRadius: tokens.radius.sm,
    borderWidth: 1.5,
    borderColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    alignItems: "center",
    justifyContent: "center",
  },
  markerDone: {
    borderColor: tokens.color.accent,
    backgroundColor: tokens.color.accent,
  },
  markerCheck: {
    fontSize: 12,
    fontWeight: "700",
    color: tokens.color.onAccent,
  },
  itemBody: {
    flex: 1,
    gap: 2,
  },
  itemLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: tokens.color.ink,
  },
  itemHint: {
    fontSize: 12,
    lineHeight: 17,
    color: tokens.color.faint,
  },
  itemStatus: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: "700",
    color: tokens.color.faint,
  },
  itemStatusDone: {
    color: tokens.color.accent,
  },

  payoutCard: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    paddingHorizontal: tokens.space(4),
  },
  payoutRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: tokens.space(3),
    paddingVertical: tokens.space(3),
    borderBottomWidth: 1,
    borderBottomColor: tokens.color.border,
  },
  payoutRowLast: {
    borderBottomWidth: 0,
  },
  payoutLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: tokens.color.faint,
  },
  payoutValue: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.ink,
  },

  attestRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: tokens.space(3),
    minHeight: 44,
    paddingVertical: tokens.space(2),
  },
  checkbox: {
    width: 22,
    height: 22,
    marginTop: 1,
    borderRadius: tokens.radius.sm,
    borderWidth: 1.5,
    borderColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxOn: {
    borderColor: tokens.color.accent,
    backgroundColor: tokens.color.accent,
  },
  attestLabel: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
    color: tokens.color.ink2,
  },

  summaryCard: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    paddingHorizontal: tokens.space(4),
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: tokens.space(3),
    paddingVertical: tokens.space(3),
    borderBottomWidth: 1,
    borderBottomColor: tokens.color.border,
  },
  summaryRowLast: {
    borderBottomWidth: 0,
  },
  summaryLeft: {
    flex: 1,
    gap: 2,
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: tokens.color.faint,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  editBtn: {
    minHeight: 44,
    minWidth: 44,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  editBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: tokens.color.accent,
  },
  footerNote: {
    marginTop: tokens.space(1),
    fontSize: 12,
    lineHeight: 18,
    color: tokens.color.faint,
  },
  submittedNote: {
    marginTop: tokens.space(1),
    borderWidth: 1,
    borderColor: tokens.color.accent,
    borderRadius: tokens.radius.md,
    padding: tokens.space(3),
  },
  submittedNoteText: {
    fontSize: 13,
    lineHeight: 19,
    color: tokens.color.ink,
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
