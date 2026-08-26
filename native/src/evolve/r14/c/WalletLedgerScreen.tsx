// native/src/evolve/r14/c/WalletLedgerScreen.tsx — auto-native-r14 candidate c.
// Screen type: Wallet & Transaction History — a read-only ledger, not the payout flow.
// The balance and the full transaction list are the proof and stay visible by default;
// the type filter narrows what's shown without ever hiding the balance card. There is no
// blocked step here (nothing to complete, nothing that can fail), so per native/GENERATION.md
// §3 this screen gets no fixed bottom band — the state-machine band belongs to payout, not to
// a screen whose only job is to show what already happened.
import { useMemo, useState } from "react";
import { View, Text, FlatList, SafeAreaView, StyleSheet } from "react-native";
import { tokens } from "../../../tokens";
import { CURRENT_BALANCE_WON, BALANCE_AS_OF, FILTERS, TRANSACTIONS, type FilterKey, type Transaction } from "./data";
import { BalanceCard, FilterBar, TransactionRow, EmptyState } from "./components";

export function WalletLedgerScreen() {
  const [filter, setFilter] = useState<FilterKey>("all");

  const filtered = useMemo<Transaction[]>(
    () => (filter === "all" ? TRANSACTIONS : TRANSACTIONS.filter((t) => t.type === filter)),
    [filter],
  );

  const activeLabel = FILTERS.find((f) => f.key === filter)?.label ?? "All";

  // No navigation stack exists in this catalog — each screen is rendered standalone by
  // ../../../screens.ts. In a wired app this calls navigation.navigate("payout"); here the
  // button's job is only to exist as a correctly-labeled entry point (see candidates/c.md).
  function handleWithdrawPress() {
    // Intentionally not implemented on this screen — see header comment above.
  }

  return (
    <SafeAreaView style={styles.root}>
      <FlatList
        data={filtered}
        keyExtractor={(t) => t.id}
        renderItem={({ item }) => <TransactionRow item={item} />}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.h1} accessibilityRole="header">
              Wallet
            </Text>
            <Text style={styles.sub}>Your balance and transaction history</Text>

            <View style={styles.balanceWrap}>
              <BalanceCard
                balanceWon={CURRENT_BALANCE_WON}
                asOf={BALANCE_AS_OF}
                onWithdrawPress={handleWithdrawPress}
              />
            </View>

            <Text style={styles.filterHeading} accessibilityRole="header">
              Transactions
            </Text>
            <FilterBar filters={FILTERS} active={filter} onChange={setFilter} />

            <View style={styles.summaryWrap} accessibilityLiveRegion="polite">
              <Text accessibilityRole="alert" style={styles.summaryText}>
                {`Showing ${filtered.length} of ${TRANSACTIONS.length} transactions`}
                {filter !== "all" ? ` — ${activeLabel}` : ""}
              </Text>
            </View>
          </View>
        }
        ListEmptyComponent={<EmptyState filterLabel={activeLabel} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: tokens.color.bg },
  list: { paddingHorizontal: tokens.space(5), paddingBottom: tokens.space(10) },

  header: { paddingTop: tokens.space(8), paddingBottom: tokens.space(2) },
  h1: { fontSize: 28, fontWeight: "800", color: tokens.color.ink, letterSpacing: -0.5 },
  sub: { marginTop: 6, fontSize: 13, color: tokens.color.muted },

  balanceWrap: { marginTop: tokens.space(5) },

  filterHeading: {
    marginTop: tokens.space(7),
    marginBottom: tokens.space(3),
    fontSize: 17,
    fontWeight: "700",
    color: tokens.color.ink,
  },

  summaryWrap: { marginTop: tokens.space(3) },
  summaryText: { fontSize: 12, color: tokens.color.muted, fontVariant: ["tabular-nums"] },
});
