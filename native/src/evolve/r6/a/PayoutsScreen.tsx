// native/src/evolve/r6/a/PayoutsScreen.tsx — auto-native-r6 candidate a.
// A seller ledger screen, not a browse/negotiation/terminal-action screen: the primary job is
// reference (what's my balance right now, what happened, when does money arrive) with one
// repeatable, non-destructive action (request payout) layered on top. Structural choice: a slim
// sticky balance strip (title + available/pending balance + request-payout button + live-updated
// timestamp) stays pinned above a single FlatList — everything else (payout method, period
// filter, transaction history) scrolls together underneath it. That is deliberately narrower than
// the banned "3-band" silhouette (no bottom action bar at all, and the pinned strip is one slim
// block, not header+content+footer) and it earns its place because a balance ledger is exactly
// the case the settings-screen "zero fixed chrome" pattern (auto-native-r2) does NOT fit: unlike a
// preferences screen, there is one number (available balance) the seller wants to keep checking
// against while scrolling transaction history, and "Request payout" is a repeatable, non-terminal
// action (not the confirm/destructive kind r3/r5 gate behind a state-machine band), so a plain
// pinned button is the right weight — no blocking-reason copy or jump-to-unresolved logic needed.
import { useCallback, useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { tokens } from "../../../tokens";
import {
  AVAILABLE_BALANCE_WON,
  LAST_UPDATED_INITIAL,
  LAST_UPDATED_REFRESHED,
  PAYOUT_METHOD,
  PENDING_BALANCE_WON,
  PERIODS,
  PERIOD_LABELS,
  STATUS_TEXT,
  TRANSACTIONS,
  buildRequestedPayoutTxn,
  filterByPeriod,
  formatWon,
  type Period,
  type PayoutTxn,
  type TxnStatus,
} from "./data";

const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };

function TxnGlyph({ status, credit }: { status: TxnStatus; credit: boolean }) {
  const symbol = status === "processing" ? "…" : credit ? "↑" : "↓";
  return (
    <View
      style={[
        styles.txnGlyph,
        credit ? styles.txnGlyphCredit : styles.txnGlyphDebit,
      ]}
    >
      <Text style={styles.txnGlyphText}>{symbol}</Text>
    </View>
  );
}

function StatusPill({ status }: { status: TxnStatus }) {
  return (
    <View
      style={[
        styles.statusPill,
        status === "completed" && styles.statusPillCompleted,
        status === "pending" && styles.statusPillPending,
        status === "processing" && styles.statusPillProcessing,
      ]}
    >
      <Text
        style={[
          styles.statusPillText,
          status === "completed" && styles.statusPillTextCompleted,
          status === "pending" && styles.statusPillTextAccent,
          status === "processing" && styles.statusPillTextOnAccent,
        ]}
      >
        {STATUS_TEXT[status]}
      </Text>
    </View>
  );
}

export function PayoutsScreen() {
  const [period, setPeriod] = useState<Period>("week");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [methodExpanded, setMethodExpanded] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(LAST_UPDATED_INITIAL);
  const [payoutRequested, setPayoutRequested] = useState(false);

  const availableBalance = payoutRequested ? 0 : AVAILABLE_BALANCE_WON;
  const canRequest = availableBalance > 0 && !payoutRequested;

  const transactions = useMemo(() => {
    const ledger = payoutRequested
      ? [buildRequestedPayoutTxn(AVAILABLE_BALANCE_WON), ...TRANSACTIONS]
      : TRANSACTIONS;
    return filterByPeriod(ledger, period);
  }, [period, payoutRequested]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Fixed 900ms delay to simulate a network round-trip — no Date.now()/Math.random involved,
    // the two labels it toggles between are both fixed literals from data.ts.
    setTimeout(() => {
      setRefreshing(false);
      setLastUpdated((prev) =>
        prev === LAST_UPDATED_INITIAL
          ? LAST_UPDATED_REFRESHED
          : LAST_UPDATED_INITIAL,
      );
    }, 900);
  }, []);

  const onRequestPayout = () => {
    if (!canRequest) return;
    setPayoutRequested(true);
  };

  const balanceSpokenLabel = payoutRequested
    ? `Payout requested. Available balance ₩0. Pending balance ₩${formatWon(PENDING_BALANCE_WON)}.`
    : `Available balance ₩${formatWon(availableBalance)}. Pending balance ₩${formatWon(PENDING_BALANCE_WON)}.`;

  const renderItem = ({ item }: { item: PayoutTxn }) => {
    const expanded = expandedId === item.id;
    const credit = item.amountWon >= 0;
    return (
      <Pressable
        onPress={() => setExpandedId((prev) => (prev === item.id ? null : item.id))}
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        accessibilityLabel={`${item.title}, ${credit ? "credit" : "debit"} ${formatWon(Math.abs(item.amountWon))} won, ${STATUS_TEXT[item.status]}, ${item.dateLabel}`}
        accessibilityHint="Double tap to show transaction detail"
        hitSlop={HIT_SLOP}
        style={({ pressed }) => [styles.txnRow, pressed && styles.txnRowPressed]}
      >
        <TxnGlyph status={item.status} credit={credit} />
        <View style={styles.txnBody}>
          <View style={styles.txnHeadRow}>
            <Text style={styles.txnTitle} numberOfLines={2}>
              {item.title}
            </Text>
            <Text style={[styles.txnAmount, credit ? styles.txnAmountCredit : styles.txnAmountDebit]}>
              {credit ? "+" : "-"}
              <Text style={styles.txnWonSign}>₩</Text>
              {formatWon(Math.abs(item.amountWon))}
            </Text>
          </View>
          <View style={styles.txnMetaRow}>
            <StatusPill status={item.status} />
            <Text style={styles.txnDate}>{item.dateLabel}</Text>
          </View>
          {expanded ? (
            <View style={styles.txnDetail}>
              <Text style={styles.txnDetailText}>{item.detail}</Text>
              <Text style={styles.txnId}>Transaction {item.id.toUpperCase()}</Text>
            </View>
          ) : null}
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.stickyHeader}>
        <Text style={styles.kicker}>REPICK SELLER</Text>
        <Text style={styles.title} accessibilityRole="header">
          Payouts
        </Text>

        <View
          style={styles.balanceRow}
          accessible
          accessibilityLabel={balanceSpokenLabel}
          accessibilityLiveRegion="polite"
        >
          <View style={styles.balanceBlock}>
            <Text style={styles.balanceLabel}>Available</Text>
            <Text style={styles.balanceValue}>
              <Text style={styles.wonSign}>₩</Text>
              {formatWon(availableBalance)}
            </Text>
          </View>
          <View style={styles.balanceDivider} />
          <View style={styles.balanceBlock}>
            <Text style={styles.balanceLabel}>Pending</Text>
            <Text style={styles.balanceValueMuted}>
              <Text style={styles.wonSignMuted}>₩</Text>
              {formatWon(PENDING_BALANCE_WON)}
            </Text>
          </View>
        </View>

        <Pressable
          onPress={onRequestPayout}
          disabled={!canRequest}
          accessibilityRole="button"
          accessibilityState={{ disabled: !canRequest }}
          accessibilityLabel={
            payoutRequested
              ? "Payout requested, processing"
              : availableBalance <= 0
                ? "No available balance to pay out"
                : `Request payout of ₩${formatWon(availableBalance)} to ${PAYOUT_METHOD.bankName} ${PAYOUT_METHOD.accountMasked}`
          }
          hitSlop={HIT_SLOP}
          style={({ pressed }) => [
            styles.requestBtn,
            !canRequest && styles.requestBtnDisabled,
            pressed && canRequest && styles.pressed,
          ]}
        >
          <Text style={[styles.requestBtnText, !canRequest && styles.requestBtnTextDisabled]}>
            {payoutRequested
              ? "Payout requested"
              : availableBalance <= 0
                ? "No balance to pay out"
                : "Request payout"}
          </Text>
        </Pressable>

        <Text style={styles.lastUpdated}>{lastUpdated}</Text>
      </View>

      <FlatList
        style={styles.list}
        contentContainerStyle={styles.listContent}
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={tokens.color.accent}
          />
        }
        ListHeaderComponent={
          <View>
            <Pressable
              onPress={() => setMethodExpanded((prev) => !prev)}
              accessibilityRole="button"
              accessibilityState={{ expanded: methodExpanded }}
              accessibilityLabel={`Payout method, ${PAYOUT_METHOD.bankName} account ending ${PAYOUT_METHOD.accountMasked.replace("•••• ", "")}`}
              accessibilityHint="Double tap to show the account holder name and arrival time"
              hitSlop={HIT_SLOP}
              style={({ pressed }) => [styles.methodCard, pressed && styles.methodCardPressed]}
            >
              <View style={styles.methodTop}>
                <View style={styles.methodIcon}>
                  <View style={styles.methodIconBar} />
                  <View style={[styles.methodIconBar, styles.methodIconBarShort]} />
                </View>
                <View style={styles.methodTextCol}>
                  <Text style={styles.methodBank}>{PAYOUT_METHOD.bankName}</Text>
                  <Text style={styles.methodAccount}>{PAYOUT_METHOD.accountMasked}</Text>
                </View>
                <Text style={styles.methodChevron}>{methodExpanded ? "Hide" : "Details"}</Text>
              </View>
              {methodExpanded ? (
                <View style={styles.methodDetail}>
                  <View style={styles.methodDetailRow}>
                    <Text style={styles.methodDetailLabel}>Account holder</Text>
                    <Text style={styles.methodDetailValue}>{PAYOUT_METHOD.accountHolder}</Text>
                  </View>
                  <View style={styles.methodDetailRow}>
                    <Text style={styles.methodDetailLabel}>Arrival time</Text>
                    <Text style={styles.methodDetailValue}>{PAYOUT_METHOD.arrival}</Text>
                  </View>
                </View>
              ) : null}
            </Pressable>

            <View
              style={styles.periodGroup}
              accessibilityRole="radiogroup"
              accessibilityLabel="Filter transaction history by period"
            >
              {PERIODS.map((p) => {
                const selected = p === period;
                return (
                  <Pressable
                    key={p}
                    onPress={() => setPeriod(p)}
                    accessibilityRole="radio"
                    accessibilityState={{ selected, checked: selected }}
                    accessibilityLabel={PERIOD_LABELS[p]}
                    hitSlop={HIT_SLOP}
                    style={({ pressed }) => [
                      styles.periodOption,
                      selected && styles.periodOptionOn,
                      pressed && styles.pressed,
                    ]}
                  >
                    <Text style={[styles.periodLabel, selected && styles.periodLabelOn]}>
                      {PERIOD_LABELS[p]}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={styles.sectionTitle} accessibilityRole="header">
              Transaction history
            </Text>
            <Text style={styles.sectionHint}>Tap a transaction for more detail.</Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No transactions in this period.</Text>
          </View>
        }
        ListFooterComponent={
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Payouts are sent to the account above after each item&apos;s buyer confirms
              receipt. {PAYOUT_METHOD.arrival}
            </Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

export default PayoutsScreen;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: tokens.color.bg },

  /* ───────── sticky balance strip — the only pinned chrome ───────── */
  stickyHeader: {
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(4),
    paddingBottom: tokens.space(4),
    borderBottomWidth: 1,
    borderBottomColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
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
    fontWeight: "700",
    letterSpacing: -0.4,
    color: tokens.color.ink,
  },
  balanceRow: {
    marginTop: tokens.space(4),
    flexDirection: "row",
    alignItems: "center",
  },
  balanceBlock: { flex: 1 },
  balanceDivider: {
    width: 1,
    alignSelf: "stretch",
    backgroundColor: tokens.color.border,
    marginHorizontal: tokens.space(4),
  },
  balanceLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: tokens.color.faint,
  },
  balanceValue: {
    marginTop: 2,
    fontSize: 24,
    fontWeight: "800",
    color: tokens.color.ink,
    fontVariant: ["tabular-nums"],
  },
  wonSign: {
    fontSize: 17,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  balanceValueMuted: {
    marginTop: 2,
    fontSize: 24,
    fontWeight: "800",
    color: tokens.color.muted,
    fontVariant: ["tabular-nums"],
  },
  wonSignMuted: {
    fontSize: 17,
    fontWeight: "700",
    color: tokens.color.muted,
  },
  requestBtn: {
    marginTop: tokens.space(4),
    minHeight: 48,
    borderRadius: tokens.radius.md,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: tokens.color.accent,
    paddingHorizontal: tokens.space(4),
  },
  requestBtnDisabled: {
    backgroundColor: tokens.color.bg,
    borderWidth: 1,
    borderColor: tokens.color.border,
  },
  requestBtnText: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.onAccent,
  },
  requestBtnTextDisabled: {
    color: tokens.color.faint,
  },
  lastUpdated: {
    marginTop: tokens.space(2),
    fontSize: 11,
    color: tokens.color.faint,
    textAlign: "center",
  },
  pressed: { opacity: 0.85 },

  /* ───────── scrolling body ───────── */
  list: { flex: 1 },
  listContent: {
    paddingHorizontal: tokens.space(5),
    paddingBottom: tokens.space(8),
  },

  /* payout method card */
  methodCard: {
    marginTop: tokens.space(5),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(4),
    minHeight: 44,
  },
  methodCardPressed: { borderColor: tokens.color.accent },
  methodTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.space(3),
  },
  methodIcon: {
    width: 36,
    height: 36,
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.ink2,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },
  methodIconBar: {
    width: 18,
    height: 3,
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.onAccent,
  },
  methodIconBarShort: { width: 12 },
  methodTextCol: { flex: 1, gap: 2 },
  methodBank: { fontSize: 14, fontWeight: "700", color: tokens.color.ink },
  methodAccount: { fontSize: 13, color: tokens.color.muted },
  methodChevron: { fontSize: 13, fontWeight: "700", color: tokens.color.accent },
  methodDetail: {
    marginTop: tokens.space(3),
    paddingTop: tokens.space(3),
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    gap: tokens.space(2),
  },
  methodDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: tokens.space(3),
  },
  methodDetailLabel: { fontSize: 12, color: tokens.color.faint },
  methodDetailValue: { flex: 1, textAlign: "right", fontSize: 12, color: tokens.color.ink2 },

  /* period filter */
  periodGroup: {
    marginTop: tokens.space(4),
    flexDirection: "row",
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: 2,
    gap: 2,
  },
  periodOption: {
    flex: 1,
    minHeight: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: tokens.radius.sm,
  },
  periodOptionOn: { backgroundColor: tokens.color.accent },
  periodLabel: { fontSize: 12, fontWeight: "700", color: tokens.color.muted },
  periodLabelOn: { color: tokens.color.onAccent },

  sectionTitle: {
    marginTop: tokens.space(7),
    fontSize: 18,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  sectionHint: {
    marginTop: tokens.space(1),
    marginBottom: tokens.space(2),
    fontSize: 13,
    lineHeight: 19,
    color: tokens.color.muted,
  },

  /* transaction row */
  txnRow: {
    flexDirection: "row",
    gap: tokens.space(3),
    paddingVertical: tokens.space(3),
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
  },
  txnRowPressed: { opacity: 0.85 },
  txnGlyph: {
    width: 32,
    height: 32,
    borderRadius: tokens.radius.md,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: tokens.color.border,
  },
  txnGlyphCredit: { borderColor: tokens.color.accent },
  txnGlyphDebit: { borderColor: tokens.color.border },
  txnGlyphText: { fontSize: 15, fontWeight: "700", color: tokens.color.ink2 },
  txnBody: { flex: 1, gap: 4 },
  txnHeadRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: tokens.space(3),
  },
  txnTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: tokens.color.ink2,
  },
  txnAmount: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.ink,
    fontVariant: ["tabular-nums"],
  },
  txnAmountCredit: { color: tokens.color.ink },
  txnAmountDebit: { color: tokens.color.muted },
  txnWonSign: { fontSize: 12, fontWeight: "700", color: tokens.color.ink },
  txnMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.space(2),
  },
  txnDate: { fontSize: 12, color: tokens.color.faint },
  statusPill: {
    borderRadius: tokens.radius.sm,
    paddingHorizontal: tokens.space(2),
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: tokens.color.border,
  },
  statusPillCompleted: { borderColor: tokens.color.border, backgroundColor: tokens.color.bg },
  statusPillPending: { borderColor: tokens.color.accent, backgroundColor: tokens.color.bg },
  statusPillProcessing: { borderColor: tokens.color.accent, backgroundColor: tokens.color.accent },
  statusPillText: { fontSize: 10, fontWeight: "700", letterSpacing: 0.3, color: tokens.color.muted },
  statusPillTextCompleted: { color: tokens.color.muted },
  statusPillTextAccent: { color: tokens.color.accent },
  statusPillTextOnAccent: { color: tokens.color.onAccent },
  txnDetail: {
    marginTop: tokens.space(1),
    borderLeftWidth: 3,
    borderLeftColor: tokens.color.accent,
    paddingLeft: tokens.space(3),
    gap: 3,
  },
  txnDetailText: { fontSize: 13, lineHeight: 19, color: tokens.color.ink2 },
  txnId: { fontSize: 11, color: tokens.color.faint },

  empty: { paddingVertical: tokens.space(8), alignItems: "center" },
  emptyText: { fontSize: 13, color: tokens.color.faint },

  footer: {
    marginTop: tokens.space(5),
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    paddingTop: tokens.space(4),
  },
  footerText: {
    fontSize: 12,
    lineHeight: 18,
    color: tokens.color.faint,
  },
});
