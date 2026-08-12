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
  formatUsd,
  handoffChecks,
  handoffDeal,
  type HandoffCheck,
} from "./data";

type CheckState = "unset" | "match" | "differ";
type CheckStateMap = Record<string, CheckState>;

const STATUS_TEXT: Record<CheckState, string> = {
  unset: "Not checked",
  match: "Matches listing",
  differ: "Differs from listing",
};

export function HandoffCheckScreen() {
  const [states, setStates] = useState<CheckStateMap>({});
  const [sent, setSent] = useState(false);
  const listRef = useRef<FlatList<HandoffCheck>>(null);

  const summary = useMemo(() => {
    const pending = handoffChecks.filter(
      (check) => (states[check.id] ?? "unset") === "unset",
    );
    const mismatches = handoffChecks.filter(
      (check) => states[check.id] === "differ",
    );
    const blockers = mismatches.filter((check) => check.blocking);
    const deduction = mismatches.reduce(
      (total, check) => total + check.priceImpact,
      0,
    );
    return {
      pending,
      mismatches,
      blockers,
      deduction,
      revised: handoffDeal.agreedPrice - deduction,
      checked: handoffChecks.length - pending.length,
    };
  }, [states]);

  const setCheck = (id: string, next: CheckState) => {
    setSent(false);
    setStates((prev) => ({
      ...prev,
      [id]: (prev[id] ?? "unset") === next ? "unset" : next,
    }));
  };

  const jumpToPending = () => {
    const first = summary.pending[0];
    if (!first) {
      return;
    }
    const index = handoffChecks.findIndex((check) => check.id === first.id);
    if (index < 0) {
      return;
    }
    listRef.current?.scrollToIndex({
      index,
      viewPosition: 0.25,
      animated: true,
    });
  };

  const action = buildAction(summary, sent);

  const renderItem = ({ item }: { item: HandoffCheck }) => {
    const state = states[item.id] ?? "unset";
    const statusSuffix =
      state === "differ"
        ? item.blocking
          ? " - money cannot fix this"
          : ` - worth ${formatUsd(item.priceImpact)} off`
        : "";

    return (
      <View style={styles.row}>
        <View style={styles.rowTop}>
          <View
            style={[
              styles.marker,
              state === "match" && styles.markerMatch,
              state === "differ" && styles.markerDiffer,
            ]}
          >
            {state === "match" ? <View style={styles.markerDot} /> : null}
            {state === "differ" ? <View style={styles.markerBar} /> : null}
          </View>
          <View style={styles.rowBody}>
            <Text style={styles.rowLabel}>{item.label}</Text>
            <Text style={styles.rowClaim}>Listing: {item.listingClaim}</Text>
            <Text style={styles.rowHow}>{item.how}</Text>
          </View>
        </View>

        <Text
          style={[
            styles.rowStatus,
            state === "match" && styles.rowStatusMatch,
            state === "differ" && styles.rowStatusDiffer,
          ]}
        >
          {STATUS_TEXT[state]}
          {statusSuffix}
        </Text>

        {state === "differ" ? (
          <View style={styles.note}>
            <Text style={styles.noteText}>{item.mismatchNote}</Text>
          </View>
        ) : null}

        <View style={styles.choices}>
          <Pressable
            onPress={() => setCheck(item.id, "match")}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityState={{ selected: state === "match" }}
            accessibilityLabel={`${item.label} matches the listing`}
            accessibilityHint="Press again to clear this answer"
            style={({ pressed }) => [
              styles.choice,
              state === "match" && styles.choiceMatchOn,
              pressed && styles.choicePressed,
            ]}
          >
            <Text
              style={[
                styles.choiceText,
                state === "match" && styles.choiceTextOnAccent,
              ]}
            >
              Matches
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setCheck(item.id, "differ")}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityState={{ selected: state === "differ" }}
            accessibilityLabel={`${item.label} differs from the listing`}
            accessibilityHint="Press again to clear this answer"
            style={({ pressed }) => [
              styles.choice,
              state === "differ" && styles.choiceDifferOn,
              pressed && styles.choicePressed,
            ]}
          >
            <Text
              style={[
                styles.choiceText,
                state === "differ" && styles.choiceTextOnInk,
              ]}
            >
              Differs
            </Text>
          </Pressable>
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
        data={handoffChecks}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        onScrollToIndexFailed={(info) => {
          listRef.current?.scrollToOffset({
            offset: info.averageItemLength * info.index,
            animated: true,
          });
        }}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.kicker}>REPICK PICKUP</Text>
            <Text style={styles.title} accessibilityRole="header">
              Handoff check
            </Text>
            <Text style={styles.lede}>
              The item is in front of you. Answer every line before any money
              moves.
            </Text>

            <View style={styles.deal}>
              <Text style={styles.dealItem}>{handoffDeal.itemTitle}</Text>
              <Text style={styles.dealSpec}>{handoffDeal.itemSpec}</Text>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Agreed</Text>
                <Text style={styles.metaPrice}>
                  {formatUsd(handoffDeal.agreedPrice)}
                </Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Where</Text>
                <Text style={styles.metaValue}>{handoffDeal.place}</Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>When</Text>
                <Text style={styles.metaValue}>{handoffDeal.time}</Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Seller</Text>
                <Text style={styles.metaValue}>
                  {handoffDeal.sellerName}, {handoffDeal.sellerRecord}
                </Text>
              </View>
            </View>

            <View style={styles.progress}>
              <View style={styles.pips}>
                {handoffChecks.map((check) => {
                  const state = states[check.id] ?? "unset";
                  return (
                    <View
                      key={check.id}
                      style={[
                        styles.pip,
                        state === "match" && styles.pipMatch,
                        state === "differ" && styles.pipDiffer,
                      ]}
                    />
                  );
                })}
              </View>
              <Text style={styles.progressText}>
                {summary.checked} of {handoffChecks.length} answered
              </Text>
              <Text style={styles.progressHint}>
                {summary.pending.length > 0
                  ? `Still open: ${summary.pending
                      .map((check) => check.label)
                      .join(", ")}`
                  : "Every line has an answer."}
              </Text>
            </View>

            {summary.mismatches.length > 0 ? (
              <View style={styles.alert}>
                <Text style={styles.alertTitle}>
                  {summary.mismatches.length} mismatch recorded
                </Text>
                <Text style={styles.alertText}>
                  {summary.deduction > 0
                    ? `Agreed ${formatUsd(
                        handoffDeal.agreedPrice,
                      )} would become ${formatUsd(summary.revised)}.`
                    : "No priceable gap yet."}
                  {summary.blockers.length > 0
                    ? ` ${summary.blockers.length} of them cannot be settled with money.`
                    : ""}
                </Text>
              </View>
            ) : null}

            <Text style={styles.sectionTitle} accessibilityRole="header">
              Six lines to answer
            </Text>
            <Text style={styles.sectionHint}>
              Each line takes Matches or Differs. Press the same button again to
              clear it.
            </Text>
          </View>
        }
        ListFooterComponent={
          <View style={styles.report}>
            <Text style={styles.reportTitle} accessibilityRole="header">
              Mismatch report
            </Text>
            {summary.mismatches.length === 0 ? (
              <Text style={styles.reportEmpty}>
                Nothing flagged. Anything you mark as different lands here with
                what it is worth off the agreed price.
              </Text>
            ) : (
              <View style={styles.reportBody}>
                {summary.mismatches.map((check) => (
                  <View key={check.id} style={styles.reportLine}>
                    <Text style={styles.reportLabel}>{check.label}</Text>
                    <Text style={styles.reportValue}>
                      {check.blocking
                        ? "Not priceable"
                        : `${formatUsd(check.priceImpact)} off`}
                    </Text>
                  </View>
                ))}
                <View style={styles.reportTotal}>
                  <Text style={styles.reportTotalLabel}>
                    Agreed {formatUsd(handoffDeal.agreedPrice)}, revised
                  </Text>
                  <Text style={styles.reportTotalValue}>
                    {formatUsd(summary.revised)}
                  </Text>
                </View>
              </View>
            )}
            <Text style={styles.reportNote}>
              Repick keeps this report on the deal for 14 days, so a dispute
              starts from what you saw here.
            </Text>
          </View>
        }
      />

      <View style={styles.band}>
        {sent ? (
          <Text style={styles.bandNote}>
            Sent to {handoffDeal.sellerName} at {handoffDeal.sentAtLabel}. Keep
            this screen open until they answer.
          </Text>
        ) : null}
        <Pressable
          onPress={() => {
            if (summary.pending.length > 0) {
              jumpToPending();
              return;
            }
            setSent(true);
          }}
          accessibilityRole="button"
          accessibilityLabel={action.title}
          accessibilityHint={action.detail}
          style={({ pressed }) => [
            styles.cta,
            action.tone === "waiting" && styles.ctaWaiting,
            action.tone === "stop" && styles.ctaStop,
            action.tone === "revise" && styles.ctaGo,
            action.tone === "ready" && styles.ctaGo,
            pressed && styles.ctaPressed,
          ]}
        >
          <Text
            style={[
              styles.ctaTitle,
              action.tone === "waiting" && styles.ctaTitleWaiting,
              action.tone === "stop" && styles.ctaTitleStop,
            ]}
          >
            {action.title}
          </Text>
          <Text
            style={[
              styles.ctaDetail,
              action.tone === "waiting" && styles.ctaDetailWaiting,
              action.tone === "stop" && styles.ctaDetailStop,
            ]}
          >
            {action.detail}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

type ActionTone = "waiting" | "stop" | "revise" | "ready";

function buildAction(
  summary: {
    pending: HandoffCheck[];
    mismatches: HandoffCheck[];
    blockers: HandoffCheck[];
    deduction: number;
    revised: number;
  },
  sent: boolean,
): { title: string; detail: string; tone: ActionTone } {
  if (summary.pending.length > 0) {
    const next = summary.pending[0];
    return {
      tone: "waiting",
      title: `${summary.pending.length} lines left before you can pay`,
      detail: `Next one is ${next.label}. Press to jump straight to it.`,
    };
  }

  if (summary.blockers.length > 0) {
    return {
      tone: "stop",
      title: "Hold the handoff",
      detail: `${summary.blockers[0].label} does not match, and no discount makes that safe. Ask the seller or walk away.`,
    };
  }

  if (summary.mismatches.length > 0) {
    return {
      tone: "revise",
      title: sent
        ? `Revised offer sent, ${formatUsd(summary.revised)}`
        : `Send revised offer, ${formatUsd(summary.revised)}`,
      detail: `${summary.mismatches.length} mismatch takes ${formatUsd(
        summary.deduction,
      )} off. The seller accepts before you pay.`,
    };
  }

  return {
    tone: "ready",
    title: sent
      ? `Handoff confirmed, ${formatUsd(handoffDeal.agreedPrice)}`
      : `Confirm handoff, ${formatUsd(handoffDeal.agreedPrice)}`,
    detail: `All ${handoffChecks.length} lines match the listing. Payment releases to the seller.`,
  };
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
  deal: {
    marginTop: tokens.space(5),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(4),
    gap: tokens.space(2),
  },
  dealItem: {
    fontSize: 17,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  dealSpec: {
    fontSize: 13,
    color: tokens.color.muted,
    marginBottom: tokens.space(1),
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: tokens.space(3),
  },
  metaLabel: {
    width: 64,
    fontSize: 12,
    fontWeight: "600",
    color: tokens.color.faint,
    paddingTop: 2,
  },
  metaValue: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: tokens.color.ink2,
  },
  metaPrice: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    color: tokens.color.ink,
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
  pipMatch: {
    backgroundColor: tokens.color.accent,
  },
  pipDiffer: {
    backgroundColor: tokens.color.ink,
  },
  progressText: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  progressHint: {
    fontSize: 13,
    lineHeight: 19,
    color: tokens.color.muted,
  },
  alert: {
    marginTop: tokens.space(4),
    borderWidth: 1,
    borderColor: tokens.color.ink,
    borderRadius: tokens.radius.md,
    padding: tokens.space(3),
    gap: tokens.space(1),
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  alertText: {
    fontSize: 13,
    lineHeight: 19,
    color: tokens.color.ink2,
  },
  sectionTitle: {
    marginTop: tokens.space(7),
    fontSize: 18,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  sectionHint: {
    marginTop: tokens.space(1),
    marginBottom: tokens.space(3),
    fontSize: 13,
    lineHeight: 19,
    color: tokens.color.muted,
  },
  row: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(4),
    marginBottom: tokens.space(3),
    gap: tokens.space(3),
  },
  rowTop: {
    flexDirection: "row",
    gap: tokens.space(3),
  },
  marker: {
    width: 24,
    height: 24,
    borderRadius: tokens.radius.sm,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: tokens.color.faint,
    backgroundColor: tokens.color.bg,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  markerMatch: {
    borderStyle: "solid",
    borderColor: tokens.color.accent,
    backgroundColor: tokens.color.accent,
  },
  markerDiffer: {
    borderStyle: "solid",
    borderColor: tokens.color.ink,
    backgroundColor: tokens.color.bg,
  },
  markerDot: {
    width: 8,
    height: 8,
    borderRadius: 2,
    backgroundColor: tokens.color.onAccent,
  },
  markerBar: {
    width: 14,
    height: 3,
    backgroundColor: tokens.color.ink,
  },
  rowBody: {
    flex: 1,
    gap: 3,
  },
  rowLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  rowClaim: {
    fontSize: 13,
    lineHeight: 19,
    color: tokens.color.ink2,
  },
  rowHow: {
    fontSize: 12,
    lineHeight: 18,
    color: tokens.color.faint,
  },
  rowStatus: {
    fontSize: 13,
    fontWeight: "700",
    color: tokens.color.faint,
  },
  rowStatusMatch: {
    color: tokens.color.accent,
  },
  rowStatusDiffer: {
    color: tokens.color.ink,
  },
  note: {
    borderLeftWidth: 3,
    borderLeftColor: tokens.color.ink,
    paddingLeft: tokens.space(3),
  },
  noteText: {
    fontSize: 13,
    lineHeight: 19,
    color: tokens.color.ink2,
  },
  choices: {
    flexDirection: "row",
    gap: tokens.space(2),
  },
  choice: {
    flex: 1,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    paddingHorizontal: tokens.space(3),
  },
  choiceMatchOn: {
    backgroundColor: tokens.color.accent,
    borderColor: tokens.color.accent,
  },
  choiceDifferOn: {
    backgroundColor: tokens.color.ink,
    borderColor: tokens.color.ink,
  },
  choicePressed: {
    opacity: 0.7,
    borderColor: tokens.color.ink2,
  },
  choiceText: {
    fontSize: 14,
    fontWeight: "600",
    color: tokens.color.ink2,
  },
  choiceTextOnAccent: {
    color: tokens.color.onAccent,
  },
  choiceTextOnInk: {
    color: tokens.color.bg,
  },
  report: {
    marginTop: tokens.space(3),
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    paddingTop: tokens.space(4),
    gap: tokens.space(2),
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  reportEmpty: {
    fontSize: 13,
    lineHeight: 20,
    color: tokens.color.muted,
  },
  reportBody: {
    gap: tokens.space(2),
  },
  reportLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: tokens.space(3),
  },
  reportLabel: {
    flex: 1,
    fontSize: 14,
    color: tokens.color.ink2,
  },
  reportValue: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  reportTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: tokens.space(3),
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    paddingTop: tokens.space(2),
  },
  reportTotalLabel: {
    flex: 1,
    fontSize: 13,
    color: tokens.color.muted,
  },
  reportTotalValue: {
    fontSize: 16,
    fontWeight: "700",
    color: tokens.color.accent,
  },
  reportNote: {
    marginTop: tokens.space(1),
    fontSize: 12,
    lineHeight: 18,
    color: tokens.color.faint,
  },
  band: {
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(3),
    paddingBottom: tokens.space(3),
    gap: tokens.space(2),
  },
  bandNote: {
    fontSize: 12,
    lineHeight: 18,
    color: tokens.color.muted,
  },
  cta: {
    minHeight: 56,
    justifyContent: "center",
    borderRadius: tokens.radius.md,
    paddingHorizontal: tokens.space(4),
    paddingVertical: tokens.space(3),
    gap: 3,
  },
  ctaWaiting: {
    backgroundColor: tokens.color.bg,
    borderWidth: 1.5,
    borderColor: tokens.color.ink2,
  },
  ctaStop: {
    backgroundColor: tokens.color.ink,
  },
  ctaGo: {
    backgroundColor: tokens.color.accent,
  },
  ctaPressed: {
    opacity: 0.78,
  },
  ctaTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: tokens.color.onAccent,
  },
  ctaTitleWaiting: {
    color: tokens.color.ink,
  },
  ctaTitleStop: {
    color: tokens.color.bg,
  },
  ctaDetail: {
    fontSize: 12,
    lineHeight: 17,
    color: tokens.color.onAccent,
  },
  ctaDetailWaiting: {
    color: tokens.color.muted,
  },
  ctaDetailStop: {
    color: tokens.color.bg,
  },
});
