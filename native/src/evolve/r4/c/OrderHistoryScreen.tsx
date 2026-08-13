import { useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { tokens } from "../../../tokens";
import {
  COMPLETED_COUNT,
  ORDERS,
  STATUS_FILTERS,
  STATUS_META,
  TOTAL_ORDERS,
  TOTAL_SPENT,
  formatKRW,
  type Order,
  type OrderStatus,
  type SortDirection,
} from "./data";

type StatusFilter = OrderStatus | "all";

type Row =
  | { kind: "month"; key: string; label: string }
  | { kind: "order"; key: string; order: Order };

function StatusMark({ status }: { status: OrderStatus }) {
  const markStyle =
    status === "ordered"
      ? styles.markOrdered
      : status === "scheduled"
        ? styles.markScheduled
        : status === "completed"
          ? styles.markCompleted
          : styles.markCancelled;

  return (
    <View style={[styles.mark, markStyle]}>
      {status === "completed" ? (
        <View style={styles.checkWrap}>
          <View style={styles.checkShort} />
          <View style={styles.checkLong} />
        </View>
      ) : null}
      {status === "cancelled" ? (
        <View style={styles.xWrap}>
          <View style={styles.xBarA} />
          <View style={styles.xBarB} />
        </View>
      ) : null}
      {status === "scheduled" ? <View style={styles.scheduleDot} /> : null}
    </View>
  );
}

export function OrderHistoryScreen() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortDir, setSortDir] = useState<SortDirection>("newest");
  const [expanded, setExpanded] = useState<string[]>([]);

  const toggleExpand = (id: string) => {
    setExpanded((current) =>
      current.includes(id)
        ? current.filter((entry) => entry !== id)
        : [...current, id],
    );
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return ORDERS.filter((order) => {
      const matchesStatus =
        statusFilter === "all" || order.status === statusFilter;
      const matchesSearch =
        q.length === 0 || order.itemName.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [search, statusFilter]);

  const sorted = useMemo(() => {
    const copy = [...filtered];
    copy.sort((a, b) =>
      sortDir === "newest" ? b.dateSort - a.dateSort : a.dateSort - b.dateSort,
    );
    return copy;
  }, [filtered, sortDir]);

  const rows = useMemo(() => {
    const out: Row[] = [];
    let lastMonth: string | null = null;
    for (const order of sorted) {
      if (order.monthLabel !== lastMonth) {
        out.push({
          kind: "month",
          key: `month-${order.monthLabel}`,
          label: order.monthLabel,
        });
        lastMonth = order.monthLabel;
      }
      out.push({ kind: "order", key: order.id, order });
    }
    return out;
  }, [sorted]);

  const activeFilterLabel =
    STATUS_FILTERS.find((f) => f.id === statusFilter)?.label ?? "All";

  const renderItem = ({ item }: { item: Row }) => {
    if (item.kind === "month") {
      return (
        <Text style={styles.monthHeader} accessibilityRole="header">
          {item.label}
        </Text>
      );
    }

    const order = item.order;
    const isExpanded = expanded.includes(order.id);
    const meta = STATUS_META[order.status];

    return (
      <Pressable
        onPress={() => toggleExpand(order.id)}
        accessibilityRole="button"
        accessibilityState={{ expanded: isExpanded }}
        accessibilityLabel={`${order.itemName}, ${meta.label}, ${formatKRW(
          order.pricePaid,
        )}, sold by ${order.seller}, ${order.dateLabel}. ${
          isExpanded ? "Tap to collapse details." : "Tap to view details."
        }`}
        style={({ pressed }) => [
          styles.card,
          pressed && styles.cardPressed,
        ]}
      >
        <View style={styles.cardTop}>
          <View style={styles.thumbBox}>
            <View
              style={[
                styles.thumbShape,
                {
                  width: order.shape.w,
                  height: order.shape.h,
                  borderRadius:
                    order.shape.r === "md" ? tokens.radius.md : tokens.radius.sm,
                },
              ]}
            >
              {order.shape.inner === "dot" ? (
                <View style={styles.thumbDot} />
              ) : null}
              {order.shape.inner === "bar" ? (
                <View style={styles.thumbBar} />
              ) : null}
            </View>
          </View>

          <View style={styles.cardBody}>
            <Text style={styles.itemName} numberOfLines={2}>
              {order.itemName}
            </Text>
            <Text style={styles.itemCategory}>{order.category}</Text>
          </View>

          <Text style={styles.itemPrice} numberOfLines={1}>
            {formatKRW(order.pricePaid)}
          </Text>
        </View>

        <View style={styles.statusRow}>
          <StatusMark status={order.status} />
          <Text style={styles.statusLabel}>{meta.label}</Text>
          <Text style={styles.statusSub} numberOfLines={1}>
            {meta.short}
          </Text>
        </View>

        <View style={styles.footerRow}>
          <Text style={styles.sellerText} numberOfLines={1}>
            Sold by {order.seller} · {order.dateLabel}
          </Text>
          <Text style={styles.chevron}>{isExpanded ? "▴" : "▾"}</Text>
        </View>

        {isExpanded ? (
          <View style={styles.detail}>
            <View style={styles.detailDivider} />
            <DetailRow label="Order number" value={order.orderNumber} />
            <DetailRow label="Exact date" value={order.dateLabel} />
            <DetailRow label="Condition" value={order.condition} />
            <DetailRow label="Seller rating" value={order.sellerRating} />
            {order.status === "scheduled" || order.status === "completed" ? (
              <>
                <DetailRow
                  label="Handoff location"
                  value={order.handoffLocation ?? "-"}
                />
                <DetailRow
                  label="Handoff time"
                  value={order.handoffTimeLabel ?? "-"}
                />
              </>
            ) : null}
            {order.status === "cancelled" ? (
              <View style={styles.reasonBox}>
                <Text style={styles.reasonLabel}>Cancellation reason</Text>
                <Text style={styles.reasonText}>{order.cancelReason}</Text>
              </View>
            ) : null}
            {order.status === "ordered" ? (
              <Text style={styles.pendingNote}>
                You will get a notification once the seller confirms and a
                handoff is scheduled.
              </Text>
            ) : null}
          </View>
        ) : null}
      </Pressable>
    );
  };

  const header = (
    <View style={styles.header}>
      <Text style={styles.kicker}>YOUR PURCHASES</Text>
      <Text style={styles.title} accessibilityRole="header">
        Order History
      </Text>
      <Text style={styles.subtitle}>
        Every purchase you have made on repick, from placed to completed.
      </Text>

      <View style={styles.statRow}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{TOTAL_ORDERS}</Text>
          <Text style={styles.statLabel}>Orders</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{formatKRW(TOTAL_SPENT)}</Text>
          <Text style={styles.statLabel}>Total spent</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{COMPLETED_COUNT}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
      </View>

      <TextInput
        value={search}
        onChangeText={setSearch}
        placeholder="Search purchases by item name"
        placeholderTextColor={tokens.color.faint}
        accessibilityLabel="Search purchases by item name"
        style={styles.search}
      />

      <Text style={styles.sectionLabel} accessibilityRole="header">
        Filter by status
      </Text>
      <View style={styles.chipRow}>
        {STATUS_FILTERS.map((filter) => {
          const selected = filter.id === statusFilter;
          return (
            <Pressable
              key={filter.id}
              onPress={() => setStatusFilter(filter.id)}
              hitSlop={6}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              accessibilityLabel={`Filter: ${filter.label}`}
              style={({ pressed }) => [
                styles.chip,
                selected && styles.chipOn,
                pressed && styles.chipPressed,
              ]}
            >
              <Text style={[styles.chipText, selected && styles.chipTextOn]}>
                {filter.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.sectionLabel} accessibilityRole="header">
        Sort
      </Text>
      <View style={styles.sortRow}>
        <Pressable
          onPress={() => setSortDir("newest")}
          accessibilityRole="button"
          accessibilityState={{ selected: sortDir === "newest" }}
          accessibilityLabel="Sort by newest first"
          style={({ pressed }) => [
            styles.sortSeg,
            sortDir === "newest" && styles.sortSegOn,
            pressed && styles.sortSegPressed,
          ]}
        >
          <Text
            style={[
              styles.sortSegText,
              sortDir === "newest" && styles.sortSegTextOn,
            ]}
          >
            Newest first
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setSortDir("oldest")}
          accessibilityRole="button"
          accessibilityState={{ selected: sortDir === "oldest" }}
          accessibilityLabel="Sort by oldest first"
          style={({ pressed }) => [
            styles.sortSeg,
            sortDir === "oldest" && styles.sortSegOn,
            pressed && styles.sortSegPressed,
          ]}
        >
          <Text
            style={[
              styles.sortSegText,
              sortDir === "oldest" && styles.sortSegTextOn,
            ]}
          >
            Oldest first
          </Text>
        </Pressable>
      </View>

      <Text style={styles.resultCount}>
        Showing {filtered.length} of {TOTAL_ORDERS} orders
        {statusFilter !== "all" ? ` · ${activeFilterLabel}` : ""}
        {search.trim().length > 0 ? ` · matching "${search.trim()}"` : ""}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.screen}>
      <FlatList
        data={rows}
        keyExtractor={(row) => row.key}
        renderItem={renderItem}
        contentContainerStyle={styles.content}
        ListHeaderComponent={header}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No orders match this view</Text>
            <Text style={styles.emptyText}>
              Try a different status filter or clear the search text.
            </Text>
          </View>
        }
        ListFooterComponent={
          rows.length > 0 ? (
            <Text style={styles.footer}>
              repick keeps a full record of every purchase, including
              cancelled orders, so a dispute always has history behind it.
            </Text>
          ) : null
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  content: {
    paddingHorizontal: tokens.space(5),
    paddingBottom: tokens.space(10),
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
  subtitle: {
    marginTop: tokens.space(2),
    fontSize: 14,
    lineHeight: 21,
    color: tokens.color.muted,
  },
  statRow: {
    marginTop: tokens.space(5),
    flexDirection: "row",
    gap: tokens.space(3),
  },
  stat: {
    flex: 1,
    paddingVertical: tokens.space(3),
    paddingHorizontal: tokens.space(3),
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.border,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "700",
    color: tokens.color.ink,
    fontVariant: ["tabular-nums"],
  },
  statLabel: {
    marginTop: tokens.space(1),
    fontSize: 11,
    color: tokens.color.faint,
  },
  search: {
    marginTop: tokens.space(5),
    minHeight: 44,
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    paddingHorizontal: tokens.space(4),
    fontSize: 14,
    color: tokens.color.ink,
    backgroundColor: tokens.color.bg,
  },
  sectionLabel: {
    marginTop: tokens.space(5),
    marginBottom: tokens.space(2),
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.4,
    color: tokens.color.faint,
    textTransform: "uppercase",
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: tokens.space(2),
  },
  chip: {
    minHeight: 44,
    justifyContent: "center",
    paddingHorizontal: tokens.space(4),
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
  },
  chipOn: {
    backgroundColor: tokens.color.accent,
    borderColor: tokens.color.accent,
  },
  chipPressed: {
    borderColor: tokens.color.ink2,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "600",
    color: tokens.color.ink2,
  },
  chipTextOn: {
    color: tokens.color.onAccent,
  },
  sortRow: {
    flexDirection: "row",
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.border,
    overflow: "hidden",
  },
  sortSeg: {
    flex: 1,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: tokens.color.bg,
  },
  sortSegOn: {
    backgroundColor: tokens.color.ink,
  },
  sortSegPressed: {
    opacity: 0.85,
  },
  sortSegText: {
    fontSize: 13,
    fontWeight: "600",
    color: tokens.color.ink2,
  },
  sortSegTextOn: {
    color: tokens.color.bg,
  },
  resultCount: {
    marginTop: tokens.space(4),
    marginBottom: tokens.space(3),
    fontSize: 12,
    color: tokens.color.muted,
  },
  monthHeader: {
    marginTop: tokens.space(5),
    marginBottom: tokens.space(2),
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.3,
    color: tokens.color.ink2,
  },
  card: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(4),
    marginBottom: tokens.space(3),
    gap: tokens.space(3),
  },
  cardPressed: {
    borderColor: tokens.color.ink2,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: tokens.space(3),
  },
  thumbBox: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.bg,
  },
  thumbShape: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: tokens.color.border,
  },
  thumbDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: tokens.color.bg,
  },
  thumbBar: {
    width: "55%",
    height: 4,
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.bg,
  },
  cardBody: {
    flex: 1,
    gap: 3,
  },
  itemName: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  itemCategory: {
    fontSize: 12,
    color: tokens.color.faint,
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.ink,
    fontVariant: ["tabular-nums"],
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.space(2),
  },
  statusLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  statusSub: {
    flex: 1,
    fontSize: 12,
    color: tokens.color.muted,
    textAlign: "right",
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: tokens.space(2),
  },
  sellerText: {
    flex: 1,
    fontSize: 12,
    color: tokens.color.muted,
  },
  chevron: {
    fontSize: 12,
    color: tokens.color.faint,
  },
  detail: {
    gap: tokens.space(2),
  },
  detailDivider: {
    height: 1,
    backgroundColor: tokens.color.border,
    marginBottom: tokens.space(1),
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: tokens.space(3),
  },
  detailLabel: {
    fontSize: 12,
    color: tokens.color.faint,
  },
  detailValue: {
    flex: 1,
    textAlign: "right",
    fontSize: 12,
    fontWeight: "600",
    color: tokens.color.ink2,
  },
  reasonBox: {
    marginTop: tokens.space(1),
    borderLeftWidth: 3,
    borderLeftColor: tokens.color.ink,
    paddingLeft: tokens.space(3),
    gap: 2,
  },
  reasonLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  reasonText: {
    fontSize: 12,
    lineHeight: 18,
    color: tokens.color.ink2,
  },
  pendingNote: {
    marginTop: tokens.space(1),
    fontSize: 12,
    lineHeight: 18,
    color: tokens.color.muted,
  },
  empty: {
    marginTop: tokens.space(6),
    alignItems: "center",
    gap: tokens.space(1),
    paddingHorizontal: tokens.space(4),
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  emptyText: {
    fontSize: 13,
    lineHeight: 19,
    color: tokens.color.muted,
    textAlign: "center",
  },
  footer: {
    marginTop: tokens.space(3),
    fontSize: 12,
    lineHeight: 18,
    color: tokens.color.faint,
  },
  mark: {
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: tokens.radius.sm,
    borderWidth: 1.5,
  },
  markOrdered: {
    borderStyle: "dashed",
    borderColor: tokens.color.faint,
    backgroundColor: tokens.color.bg,
  },
  markScheduled: {
    borderStyle: "solid",
    borderColor: tokens.color.ink2,
    backgroundColor: tokens.color.bg,
  },
  markCompleted: {
    borderStyle: "solid",
    borderColor: tokens.color.accent,
    backgroundColor: tokens.color.accent,
  },
  markCancelled: {
    borderStyle: "solid",
    borderColor: tokens.color.ink,
    backgroundColor: tokens.color.bg,
  },
  scheduleDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: tokens.color.ink2,
  },
  checkWrap: {
    width: 12,
    height: 12,
  },
  checkShort: {
    position: "absolute",
    width: 5,
    height: 2,
    borderRadius: 1,
    backgroundColor: tokens.color.onAccent,
    left: 0,
    top: 6,
    transform: [{ rotate: "45deg" }],
  },
  checkLong: {
    position: "absolute",
    width: 9,
    height: 2,
    borderRadius: 1,
    backgroundColor: tokens.color.onAccent,
    left: 3,
    top: 5,
    transform: [{ rotate: "-45deg" }],
  },
  xWrap: {
    width: 12,
    height: 12,
  },
  xBarA: {
    position: "absolute",
    width: 13,
    height: 1.6,
    borderRadius: 1,
    backgroundColor: tokens.color.ink,
    left: -0.5,
    top: 5.2,
    transform: [{ rotate: "45deg" }],
  },
  xBarB: {
    position: "absolute",
    width: 13,
    height: 1.6,
    borderRadius: 1,
    backgroundColor: tokens.color.ink,
    left: -0.5,
    top: 5.2,
    transform: [{ rotate: "-45deg" }],
  },
});
