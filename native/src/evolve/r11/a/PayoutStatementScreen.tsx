import { useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { tokens } from "../../../tokens";
import {
  attributions,
  creditTotal,
  cycle,
  formatWon,
  grossTotal,
  history,
  keptAcrossItems,
  ledger,
  lenses,
  netTotal,
  withheldTotal,
  type Attribution,
  type LedgerLine,
  type LensId,
} from "./data";

type Row =
  | { key: string; kind: "line"; line: LedgerLine; balance: number; last: boolean }
  | { key: string; kind: "sale"; item: Attribution; last: boolean };

const KEPT_PERCENT = 88;
const WITHHELD_PERCENT = 12;

export function PayoutStatementScreen() {
  const [lens, setLens] = useState<LensId>("ledger");
  const [flagged, setFlagged] = useState<string[]>([]);
  const [signed, setSigned] = useState(cycle.releaseReady);
  const [blockerFocused, setBlockerFocused] = useState(false);
  const [compareId, setCompareId] = useState("h3");
  const listRef = useRef<FlatList<Row>>(null);

  const rows = useMemo<Row[]>(() => {
    if (lens === "attribution") {
      return attributions.map((item, i) => ({
        key: item.saleId,
        kind: "sale" as const,
        item,
        last: i === attributions.length - 1,
      }));
    }
    let balance = 0;
    return ledger.map((line, i) => {
      balance = balance + line.amount;
      return {
        key: line.id,
        kind: "line" as const,
        line,
        balance,
        last: i === ledger.length - 1,
      };
    });
  }, [lens]);

  const activeLens = lenses.find((l) => l.id === lens) ?? lenses[0];
  const compared = history.find((h) => h.id === compareId) ?? history[2];
  const current = history[history.length - 1];
  const gapPoints = WITHHELD_PERCENT - compared.withheldPercent;
  const compareSentence =
    gapPoints === 0
      ? `This cycle withheld the same share as ${compared.label}: ${WITHHELD_PERCENT}%.`
      : gapPoints > 0
        ? `This cycle withheld ${gapPoints} points more than ${compared.label} — ${WITHHELD_PERCENT}% against ${compared.withheldPercent}%.`
        : `This cycle withheld ${-gapPoints} points less than ${compared.label} — ${WITHHELD_PERCENT}% against ${compared.withheldPercent}%.`;

  const toggleFlag = (id: string) => {
    setFlagged((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id],
    );
  };

  const goToBlocker = () => {
    setBlockerFocused(true);
    listRef.current?.scrollToEnd({ animated: true });
  };

  const header = (
    <View style={styles.header}>
      <Text style={styles.eyebrow}>Payout cycle {cycle.cycleId}</Text>
      <Text style={styles.h1} accessibilityRole="header">
        {cycle.periodLabel}
      </Text>

      <View style={styles.heroCard}>
        <Text style={styles.heroLabel}>Landing in your account</Text>
        <Text
          style={styles.heroAmount}
          accessibilityLabel="Net payout 1,797,615 won"
        >
          ₩1,797,615
        </Text>

        <View style={styles.derivation}>
          <Text style={styles.amountCell}>{formatWon(grossTotal)}</Text>
          <Text style={styles.derivationOp}>earned, minus</Text>
          <Text style={styles.amountCell}>{formatWon(withheldTotal)}</Text>
          <Text style={styles.derivationOp}>withheld, plus</Text>
          <Text style={styles.amountCell}>{formatWon(creditTotal)}</Text>
          <Text style={styles.derivationOp}>credited back.</Text>
        </View>

        <View style={styles.meter}>
          <View style={[styles.meterFill, styles.meterKept, { flex: KEPT_PERCENT }]} />
          <View
            style={[styles.meterFill, styles.meterTaken, { flex: WITHHELD_PERCENT }]}
          />
        </View>
        <View style={styles.meterLegend}>
          <Text style={styles.meterLegendText}>
            You keep {KEPT_PERCENT}% of what sold
          </Text>
          <Text style={styles.meterLegendText}>
            {WITHHELD_PERCENT}% withheld
          </Text>
        </View>
      </View>

      <View style={styles.lensRow}>
        {lenses.map((l) => {
          const selected = l.id === lens;
          return (
            <Pressable
              key={l.id}
              onPress={() => setLens(l.id)}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              accessibilityLabel={`Show the payout ${l.label.toLowerCase()}`}
              style={[styles.lensTab, selected && styles.lensTabOn]}
            >
              <Text style={[styles.lensTabText, selected && styles.lensTabTextOn]}>
                {l.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <Text style={styles.lensQuestion}>{activeLens.question}</Text>
    </View>
  );

  const renderLine = (row: Extract<Row, { kind: "line" }>) => {
    const { line, balance, last } = row;
    const isFlagged = flagged.includes(line.id);
    const tag =
      line.kind === "gross"
        ? "Earned"
        : line.kind === "credit"
          ? "Credited"
          : "Taken";
    return (
      <View style={styles.railRow}>
        <View style={styles.rail}>
          <View style={[styles.railStem, styles.railStemTop, row.key === ledger[0].id && styles.railStemHidden]} />
          <View
            style={[
              styles.railDot,
              line.kind === "gross" && styles.railDotGross,
              line.kind === "credit" && styles.railDotCredit,
            ]}
          />
          <View style={[styles.railStem, styles.railStemBottom, last && styles.railStemHidden]} />
        </View>

        <View style={styles.lineBody}>
          <View style={styles.lineTop}>
            <View style={styles.lineHeads}>
              <Text style={styles.lineLabel}>{line.label}</Text>
              <Text style={styles.lineTag}>{tag}</Text>
            </View>
            <Text style={styles.amountCell}>
              {line.kind === "credit" ? `+${formatWon(line.amount)}` : formatWon(line.amount)}
            </Text>
          </View>

          <Text style={styles.lineWhy}>{line.why}</Text>
          <Text style={styles.lineBasis}>
            {line.basis} · {line.source}
          </Text>
          <Text style={styles.lineBalance}>
            Running balance {formatWon(balance)}
          </Text>

          {line.disputable ? (
            <View style={styles.flagArea}>
              <Pressable
                onPress={() => toggleFlag(line.id)}
                accessibilityRole="button"
                accessibilityState={{ selected: isFlagged }}
                accessibilityLabel={
                  isFlagged
                    ? `Remove the review flag from ${line.label}`
                    : `Flag ${line.label} for review`
                }
                style={[styles.flagBtn, isFlagged && styles.flagBtnOn]}
              >
                <Text style={[styles.flagBtnText, isFlagged && styles.flagBtnTextOn]}>
                  {isFlagged ? "Flagged for review" : "Flag for review"}
                </Text>
              </Pressable>
              {isFlagged ? (
                <Text style={styles.flagNote}>
                  Reviewed after payout. The amount above does not change.
                </Text>
              ) : null}
            </View>
          ) : null}
        </View>
      </View>
    );
  };

  const renderSale = (row: Extract<Row, { kind: "sale" }>) => {
    const { item } = row;
    return (
      <View style={styles.saleCard}>
        <View style={styles.lineTop}>
          <Text style={styles.saleTitle}>{item.saleTitle}</Text>
          <Text style={styles.amountCell}>{formatWon(item.soldFor)}</Text>
        </View>
        <Text style={styles.lineBasis}>
          Sold price to {item.buyer} · {item.settledOn}
        </Text>

        <View style={styles.saleLines}>
          {item.lines.map((l) => (
            <View key={l.label} style={styles.saleLine}>
              <Text style={styles.saleLineLabel}>{l.label}</Text>
              <Text style={styles.amountCell}>{formatWon(l.amount)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.saleKeptRow}>
          <Text style={styles.saleKeptLabel}>You kept</Text>
          <Text style={styles.amountCell}>{formatWon(item.kept)}</Text>
        </View>
        <View style={styles.meterThin}>
          <View
            style={[styles.meterFill, styles.meterKept, { flex: item.keptPercent }]}
          />
          <View
            style={[
              styles.meterFill,
              styles.meterTaken,
              { flex: 100 - item.keptPercent },
            ]}
          />
        </View>
        <Text style={styles.saleKeptNote}>
          {item.keptPercent}% of the sale price survived to payout · {formatWon(-item.taken)} taken
        </Text>
      </View>
    );
  };

  const footer = (
    <View style={styles.footer}>
      <View style={styles.invariantCard}>
        <Text style={styles.invariantLead}>
          {lens === "ledger"
            ? "Seven lines, one number."
            : "Three items plus one credit, the same number."}
        </Text>
        <View style={styles.invariantRow}>
          <Text style={styles.invariantLabel}>Both views end here</Text>
          <Text style={styles.amountCell}>{formatWon(netTotal)}</Text>
        </View>
        <Text style={styles.invariantNote}>
          {lens === "ledger"
            ? `${formatWon(grossTotal)} in, ${formatWon(withheldTotal)} out, ${formatWon(creditTotal)} back.`
            : `${formatWon(keptAcrossItems)} kept across items, plus the ${formatWon(creditTotal)} protection credit.`}
        </Text>
      </View>

      <Text style={styles.sectionHead} accessibilityRole="header">
        Against earlier cycles
      </Text>
      <Text style={styles.sectionSub}>
        Tap a cycle to compare what was withheld.
      </Text>

      <View style={styles.historyList}>
        {history.map((h) => {
          const selected = h.id === compareId;
          const isCurrent = h.isCurrent;
          return (
            <Pressable
              key={h.id}
              onPress={() => setCompareId(h.id)}
              disabled={isCurrent}
              accessibilityRole="button"
              accessibilityState={{ selected, disabled: isCurrent }}
              accessibilityLabel={`Compare against ${h.label}, ${h.withheldPercent} percent withheld`}
              style={[styles.historyRow, selected && styles.historyRowOn]}
            >
              <View style={styles.historyHead}>
                <Text style={styles.historyLabel}>{h.label}</Text>
                {isCurrent ? (
                  <View style={styles.currentChip}>
                    <Text style={styles.currentChipText}>This cycle</Text>
                  </View>
                ) : selected ? (
                  <Text style={styles.historyPicked}>Comparing</Text>
                ) : null}
              </View>
              <View style={styles.meterThin}>
                <View
                  style={[
                    styles.meterFill,
                    isCurrent ? styles.meterCurrent : styles.meterKept,
                    { flex: 100 - h.withheldPercent },
                  ]}
                />
                <View
                  style={[styles.meterFill, styles.meterTaken, { flex: h.withheldPercent }]}
                />
              </View>
              <View style={styles.historyFoot}>
                <Text style={styles.amountCell}>{formatWon(h.net)}</Text>
                <Text style={styles.historyPct}>{h.withheldPercent}% withheld</Text>
              </View>
            </Pressable>
          );
        })}
      </View>
      <Text style={styles.compareSentence}>{compareSentence}</Text>

      <Text style={styles.sectionHead} accessibilityRole="header">
        Before the transfer runs
      </Text>
      <View
        style={[
          styles.holdCard,
          blockerFocused && !signed && styles.holdCardFocused,
          signed && styles.holdCardDone,
        ]}
      >
        <Text style={styles.holdTitle}>
          {signed ? "Tax residency form — signed" : "Tax residency form — unsigned"}
        </Text>
        <Text style={styles.holdBody}>
          {signed
            ? `Filed for ${current.label}. ${cycle.bankLabel} account ending ${cycle.bankTail} receives the transfer on ${cycle.payoutDate}.`
            : "Korea requires a residency declaration each quarter before funds leave the platform. It takes one tap; nothing about the amounts above changes."}
        </Text>
        {signed ? null : (
          <Pressable
            onPress={() => setSigned(true)}
            accessibilityRole="button"
            accessibilityLabel="Sign the tax residency form and release the payout"
            style={styles.holdBtn}
          >
            <Text style={styles.holdBtnText}>Sign and release</Text>
          </Pressable>
        )}
      </View>

      <Text style={styles.tail}>
        Statement {cycle.cycleId} · {cycle.bankLabel} account ending{" "}
        {cycle.bankTail}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        ref={listRef}
        data={rows}
        extraData={`${lens}|${flagged.join(",")}|${signed}|${compareId}|${blockerFocused}`}
        keyExtractor={(row) => row.key}
        renderItem={({ item }) =>
          item.kind === "line" ? renderLine(item) : renderSale(item)
        }
        ListHeaderComponent={header}
        ListFooterComponent={footer}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.band} accessibilityLiveRegion="polite">
        {signed ? (
          <View style={styles.bandInner}>
            <Text style={styles.bandLead} accessibilityRole="alert">
              Released. {formatWon(netTotal)} transfers to {cycle.bankLabel},
              account ending {cycle.bankTail}, on {cycle.payoutDate}.
            </Text>
            <View style={styles.bandAmountRow}>
              <Text style={styles.bandAmountLabel}>Scheduled</Text>
              <Text style={styles.amountCell}>{formatWon(netTotal)}</Text>
            </View>
          </View>
        ) : (
          <View style={styles.bandInner}>
            <Text style={styles.bandLead}>{cycle.blockerSentence}</Text>
            <Pressable
              onPress={goToBlocker}
              accessibilityRole="button"
              accessibilityLabel="Go to the unsigned tax residency form"
              style={styles.bandBtn}
            >
              <Text style={styles.bandBtnText}>Take me to the form</Text>
            </Pressable>
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
  listContent: {
    paddingBottom: tokens.space(6),
  },

  header: {
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(4),
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    color: tokens.color.faint,
  },
  h1: {
    fontSize: 26,
    fontWeight: "700",
    color: tokens.color.ink,
    marginTop: tokens.space(1),
  },

  heroCard: {
    marginTop: tokens.space(4),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(4),
  },
  heroLabel: {
    fontSize: 13,
    color: tokens.color.muted,
  },
  heroAmount: {
    fontSize: 34,
    fontWeight: "700",
    color: tokens.color.ink,
    fontVariant: ["tabular-nums"],
    marginTop: tokens.space(1),
  },
  derivation: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    marginTop: tokens.space(3),
  },
  derivationOp: {
    fontSize: 13,
    color: tokens.color.muted,
    marginRight: tokens.space(1.5),
    marginLeft: tokens.space(1),
  },

  /** ── controlled cell (r11 experiment) ───────────────────────────── */
  amountCell: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.ink2,
    fontVariant: ["tabular-nums"],
  },

  meter: {
    flexDirection: "row",
    height: 8,
    borderRadius: tokens.radius.sm,
    overflow: "hidden",
    marginTop: tokens.space(4),
    backgroundColor: tokens.color.border,
  },
  meterThin: {
    flexDirection: "row",
    height: 6,
    borderRadius: tokens.radius.sm,
    overflow: "hidden",
    marginTop: tokens.space(2),
    backgroundColor: tokens.color.border,
  },
  meterFill: {
    height: "100%",
  },
  meterKept: {
    backgroundColor: tokens.color.accent,
  },
  meterCurrent: {
    backgroundColor: tokens.color.ink,
  },
  meterTaken: {
    backgroundColor: tokens.color.faint,
  },
  meterLegend: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: tokens.space(2),
  },
  meterLegendText: {
    fontSize: 12,
    color: tokens.color.muted,
  },

  lensRow: {
    flexDirection: "row",
    marginTop: tokens.space(5),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(1),
  },
  lensTab: {
    flex: 1,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: tokens.radius.sm,
  },
  lensTabOn: {
    backgroundColor: tokens.color.ink,
  },
  lensTabText: {
    fontSize: 14,
    fontWeight: "600",
    color: tokens.color.muted,
  },
  lensTabTextOn: {
    color: tokens.color.onInk,
  },
  lensQuestion: {
    fontSize: 13,
    color: tokens.color.muted,
    marginTop: tokens.space(3),
    marginBottom: tokens.space(2),
  },

  railRow: {
    flexDirection: "row",
    paddingHorizontal: tokens.space(5),
  },
  rail: {
    width: 20,
    alignItems: "center",
  },
  railStem: {
    width: 1,
    backgroundColor: tokens.color.border,
  },
  railStemTop: {
    height: tokens.space(4),
  },
  railStemBottom: {
    flex: 1,
  },
  railStemHidden: {
    backgroundColor: tokens.color.bg,
  },
  railDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: tokens.color.faint,
    backgroundColor: tokens.color.bg,
  },
  railDotGross: {
    backgroundColor: tokens.color.ink,
    borderColor: tokens.color.ink,
  },
  railDotCredit: {
    backgroundColor: tokens.color.accent,
    borderColor: tokens.color.accent,
  },

  lineBody: {
    flex: 1,
    paddingLeft: tokens.space(3),
    paddingTop: tokens.space(2),
    paddingBottom: tokens.space(5),
  },
  lineTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  lineHeads: {
    flex: 1,
    paddingRight: tokens.space(3),
  },
  lineLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: tokens.color.ink,
  },
  lineTag: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    color: tokens.color.faint,
    marginTop: tokens.space(0.5),
  },
  lineWhy: {
    fontSize: 13,
    lineHeight: 19,
    color: tokens.color.muted,
    marginTop: tokens.space(2),
  },
  lineBasis: {
    fontSize: 12,
    color: tokens.color.faint,
    marginTop: tokens.space(1),
  },
  lineBalance: {
    fontSize: 12,
    fontWeight: "500",
    color: tokens.color.muted,
    fontVariant: ["tabular-nums"],
    marginTop: tokens.space(2),
  },

  flagArea: {
    marginTop: tokens.space(3),
    alignItems: "flex-start",
  },
  flagBtn: {
    minHeight: 44,
    justifyContent: "center",
    paddingHorizontal: tokens.space(4),
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.border,
  },
  flagBtnOn: {
    borderColor: tokens.color.accent,
  },
  flagBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: tokens.color.muted,
  },
  flagBtnTextOn: {
    color: tokens.color.accent,
  },
  flagNote: {
    fontSize: 12,
    color: tokens.color.faint,
    marginTop: tokens.space(2),
  },

  saleCard: {
    marginHorizontal: tokens.space(5),
    marginBottom: tokens.space(3),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(4),
  },
  saleTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: tokens.color.ink,
    paddingRight: tokens.space(3),
  },
  saleLines: {
    marginTop: tokens.space(3),
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    paddingTop: tokens.space(2),
  },
  saleLine: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: tokens.space(1.5),
  },
  saleLineLabel: {
    fontSize: 13,
    color: tokens.color.muted,
  },
  saleKeptRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: tokens.space(3),
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    paddingTop: tokens.space(3),
  },
  saleKeptLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: tokens.color.ink,
  },
  saleKeptNote: {
    fontSize: 12,
    color: tokens.color.faint,
    marginTop: tokens.space(2),
  },

  footer: {
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(2),
  },
  invariantCard: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(4),
  },
  invariantLead: {
    fontSize: 15,
    fontWeight: "600",
    color: tokens.color.ink,
  },
  invariantRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: tokens.space(3),
  },
  invariantLabel: {
    fontSize: 13,
    color: tokens.color.muted,
  },
  invariantNote: {
    fontSize: 12,
    color: tokens.color.faint,
    marginTop: tokens.space(2),
  },

  sectionHead: {
    fontSize: 18,
    fontWeight: "700",
    color: tokens.color.ink,
    marginTop: tokens.space(7),
  },
  sectionSub: {
    fontSize: 13,
    color: tokens.color.muted,
    marginTop: tokens.space(1),
  },

  historyList: {
    marginTop: tokens.space(3),
  },
  historyRow: {
    minHeight: 44,
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(3),
    marginBottom: tokens.space(2),
  },
  historyRowOn: {
    borderColor: tokens.color.accent,
  },
  historyHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  historyLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: tokens.color.ink,
  },
  historyPicked: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.4,
    textTransform: "uppercase",
    color: tokens.color.accent,
  },
  currentChip: {
    backgroundColor: tokens.color.ink,
    borderRadius: tokens.radius.sm,
    paddingHorizontal: tokens.space(2),
    paddingVertical: tokens.space(1),
  },
  currentChipText: {
    fontSize: 11,
    fontWeight: "600",
    color: tokens.color.onInk,
  },
  historyFoot: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: tokens.space(2),
  },
  historyPct: {
    fontSize: 12,
    color: tokens.color.muted,
  },
  compareSentence: {
    fontSize: 13,
    lineHeight: 19,
    color: tokens.color.muted,
    marginTop: tokens.space(1),
  },

  holdCard: {
    marginTop: tokens.space(3),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(4),
  },
  holdCardFocused: {
    borderColor: tokens.color.accent,
    borderWidth: 2,
  },
  holdCardDone: {
    borderColor: tokens.color.ink,
  },
  holdTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: tokens.color.ink,
  },
  holdBody: {
    fontSize: 13,
    lineHeight: 19,
    color: tokens.color.muted,
    marginTop: tokens.space(2),
  },
  holdBtn: {
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.accent,
    marginTop: tokens.space(4),
  },
  holdBtnText: {
    fontSize: 15,
    fontWeight: "600",
    color: tokens.color.onAccent,
  },
  tail: {
    fontSize: 12,
    color: tokens.color.faint,
    marginTop: tokens.space(6),
  },

  band: {
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(4),
    paddingBottom: tokens.space(4),
  },
  bandInner: {
    gap: tokens.space(3),
  },
  bandLead: {
    fontSize: 13,
    lineHeight: 19,
    color: tokens.color.ink2,
  },
  bandAmountRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  bandAmountLabel: {
    fontSize: 13,
    color: tokens.color.muted,
  },
  bandBtn: {
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.ink,
  },
  bandBtnText: {
    fontSize: 15,
    fontWeight: "600",
    color: tokens.color.onInk,
  },
});
