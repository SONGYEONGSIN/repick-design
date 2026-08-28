// native/src/wallet/components.tsx — presentational pieces for the Wallet ledger screen.
import { View, Text, Pressable, StyleSheet } from "react-native";
import { tokens } from "../tokens";
import {
  TYPE_META,
  formatWon,
  formatSignedWon,
  type FilterKey,
  type Transaction,
} from "./data";

const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };

/* ───────── balance summary card ───────── */

export function BalanceCard({
  balanceWon,
  asOf,
  onWithdrawPress,
}: {
  balanceWon: number;
  asOf: string;
  onWithdrawPress: () => void;
}) {
  return (
    <View style={styles.balanceCard}>
      <View style={styles.balanceTopRow}>
        <View style={styles.balanceTextCol}>
          <Text style={styles.balanceLabel}>Available balance</Text>
          <Text style={styles.balanceAmount}>{formatWon(balanceWon)}</Text>
          <Text style={styles.balanceAsOf}>As of {asOf}</Text>
        </View>
        <Pressable
          onPress={onWithdrawPress}
          hitSlop={HIT_SLOP}
          accessibilityRole="button"
          accessibilityLabel="Withdraw funds"
          accessibilityHint="Opens the payout screen to send your balance to your bank account"
          style={({ pressed }) => [
            styles.withdrawBtn,
            pressed && styles.withdrawBtnPressed,
          ]}
        >
          <Text style={styles.withdrawBtnText}>Withdraw</Text>
          <Text style={styles.withdrawBtnChevron} accessibilityElementsHidden importantForAccessibility="no">
            {"›"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

/* ───────── filter chip row (transaction type) ───────── */

export function FilterBar({
  filters,
  active,
  onChange,
}: {
  filters: { key: FilterKey; label: string }[];
  active: FilterKey;
  onChange: (key: FilterKey) => void;
}) {
  return (
    <View
      style={styles.filterRow}
      accessibilityRole="tablist"
      accessibilityLabel="Filter transactions by type"
    >
      {filters.map((f) => {
        const selected = f.key === active;
        return (
          <Pressable
            key={f.key}
            onPress={() => onChange(f.key)}
            hitSlop={HIT_SLOP}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            accessibilityLabel={`${f.label}${selected ? ", selected" : ""}`}
            style={({ pressed }) => [
              styles.filterChip,
              selected && styles.filterChipOn,
              pressed && styles.pressed,
            ]}
          >
            <Text style={[styles.filterChipText, selected && styles.filterChipTextOn]}>
              {f.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

/* ───────── one transaction row ───────── */

function TypeBadge({ type }: { type: Transaction["type"] }) {
  const meta = TYPE_META[type];
  return (
    <View style={styles.badge} accessible={false}>
      <Text style={styles.badgeText}>{meta.monogram}</Text>
    </View>
  );
}

export function TransactionRow({ item }: { item: Transaction }) {
  const meta = TYPE_META[item.type];
  const positive = item.amountWon >= 0;
  const spoken = `${meta.label}, ${positive ? "plus" : "minus"} ${formatWon(
    Math.abs(item.amountWon),
  )}. ${item.title}. ${item.detail}. ${item.date}.`;
  return (
    <View
      style={styles.row}
      accessible
      accessibilityLabel={spoken}
    >
      <TypeBadge type={item.type} />
      <View style={styles.rowBody}>
        <View style={styles.rowTopLine}>
          <Text style={styles.typeLabel}>{meta.label}</Text>
          <Text style={styles.date}>{item.date}</Text>
        </View>
        <Text style={styles.title} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.detail} numberOfLines={2}>
          {item.detail}
        </Text>
      </View>
      <Text
        style={[styles.amount, positive ? styles.amountIn : styles.amountOut]}
      >
        {formatSignedWon(item.amountWon)}
      </Text>
    </View>
  );
}

/* ───────── empty state (filter matches nothing) ───────── */

export function EmptyState({ filterLabel }: { filterLabel: string }) {
  return (
    <View
      style={styles.empty}
      accessible
      accessibilityLabel={`No ${filterLabel.toLowerCase()} transactions yet`}
    >
      <Text style={styles.emptyTitle}>No transactions here</Text>
      <Text style={styles.emptyBody}>
        {filterLabel === "All"
          ? "Your transaction history will show up here once something happens."
          : `You don't have any ${filterLabel.toLowerCase()} yet. Try “All” to see everything.`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  /* balance card */
  balanceCard: {
    padding: tokens.space(5),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
  },
  balanceTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: tokens.space(3),
  },
  balanceTextCol: { flex: 1 },
  balanceLabel: { fontSize: 13, color: tokens.color.muted },
  balanceAmount: {
    fontSize: 32,
    fontWeight: "800",
    color: tokens.color.ink,
    marginTop: tokens.space(1),
    fontVariant: ["tabular-nums"],
  },
  balanceAsOf: {
    fontSize: 12,
    color: tokens.color.muted,
    marginTop: tokens.space(2),
  },
  withdrawBtn: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    paddingHorizontal: tokens.space(4),
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.accent,
  },
  withdrawBtnPressed: { backgroundColor: tokens.color.border },
  withdrawBtnText: { fontSize: 13, fontWeight: "700", color: tokens.color.accent },
  withdrawBtnChevron: { fontSize: 15, fontWeight: "700", color: tokens.color.accent },

  /* filter bar */
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: tokens.space(2),
  },
  filterChip: {
    minHeight: 44,
    paddingHorizontal: tokens.space(4),
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: tokens.color.bg,
  },
  filterChipOn: { backgroundColor: tokens.color.accent, borderColor: tokens.color.accent },
  pressed: { opacity: 0.85 },
  filterChipText: { fontSize: 13, fontWeight: "600", color: tokens.color.ink2 },
  filterChipTextOn: { color: tokens.color.onAccent },

  /* transaction row */
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: tokens.space(3),
    paddingVertical: tokens.space(4),
    borderBottomWidth: 1,
    borderBottomColor: tokens.color.border,
    minHeight: 44,
  },
  badge: {
    width: 36,
    height: 36,
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: { fontSize: 12, fontWeight: "800", color: tokens.color.ink2 },
  rowBody: { flex: 1, gap: 3 },
  rowTopLine: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  typeLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: tokens.color.muted,
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  date: { fontSize: 11, color: tokens.color.muted, fontVariant: ["tabular-nums"] },
  title: { fontSize: 15, fontWeight: "700", color: tokens.color.ink },
  detail: { fontSize: 12, color: tokens.color.muted, lineHeight: 16 },
  amount: {
    fontSize: 15,
    fontWeight: "800",
    fontVariant: ["tabular-nums"],
    textAlign: "right",
    minWidth: 96,
  },
  amountIn: { color: tokens.color.ink },
  amountOut: { color: tokens.color.ink2 },

  /* empty state */
  empty: { paddingVertical: tokens.space(14), alignItems: "center", gap: tokens.space(2) },
  emptyTitle: { fontSize: 15, fontWeight: "700", color: tokens.color.ink2 },
  emptyBody: {
    fontSize: 13,
    color: tokens.color.muted,
    textAlign: "center",
    paddingHorizontal: tokens.space(8),
    lineHeight: 18,
  },
});
