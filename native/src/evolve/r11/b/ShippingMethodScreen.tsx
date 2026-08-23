import { useMemo, useState } from "react";
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
  CARRIERS,
  PROFILES,
  PLATFORM_FEE,
  SALE,
  activeKeys,
  blockedBy,
  coverLabel,
  daysFor,
  daysLabel,
  fareFor,
  totalFor,
  won,
  type Carrier,
  type RiskKey,
} from "./data";

/* ------------------------------------------------------------------ *
 * Skeleton: a cost x speed plot that is always on screen, with each
 * carrier plotted as a tappable dot. Not a ranked list, not a radio
 * stack — the trade-off is the primary object and the parcel profile
 * chips move the dots.
 * ------------------------------------------------------------------ */

const PLOT_H = 188;
const DOT = 46; // touch target >= 44

type Plotted = {
  carrier: Carrier;
  fare: number;
  days: [number, number];
  blocked: string | null;
  x: number; // 0..1 slower -> right
  y: number; // 0..1 pricier -> up
};

function plot(keys: RiskKey[]): Plotted[] {
  const rows = CARRIERS.map((carrier) => {
    const fare = fareFor(carrier, keys);
    const days = daysFor(carrier, keys);
    return { carrier, fare, days, blocked: blockedBy(carrier, keys) };
  });
  const fares = rows.map((r) => r.fare);
  const waits = rows.map((r) => (r.days[0] + r.days[1]) / 2);
  const fareLow = Math.min(...fares);
  const fareHigh = Math.max(...fares);
  const waitLow = Math.min(...waits);
  const waitHigh = Math.max(...waits);
  return rows.map((r, i) => ({
    ...r,
    x: waitHigh === waitLow ? 0.5 : (waits[i] - waitLow) / (waitHigh - waitLow),
    y: fareHigh === fareLow ? 0.5 : (r.fare - fareLow) / (fareHigh - fareLow),
  }));
}

export function ShippingMethodScreen() {
  const [profile, setProfile] = useState<Record<RiskKey, boolean>>({
    bulk: true,
    fragile: true,
    recipient: false,
  });
  const [picked, setPicked] = useState<Carrier["id"] | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const keys = useMemo(() => activeKeys(profile), [profile]);
  const points = useMemo(() => plot(keys), [keys]);

  const chosen = points.find((p) => p.carrier.id === picked) ?? null;
  const blockedCount = points.filter((p) => p.blocked !== null).length;

  const status = confirmed
    ? "Booked. " + (chosen ? chosen.carrier.handoff : "")
    : chosen === null
      ? "Pick a dot to see what it costs and when it lands."
      : chosen.blocked !== null
        ? chosen.carrier.name + " cannot take this parcel. " + chosen.blocked
        : "Ready to book " +
          chosen.carrier.name +
          " · arrives in " +
          daysLabel(chosen.days) +
          ".";

  const canBook = chosen !== null && chosen.blocked === null && !confirmed;

  function toggle(key: RiskKey) {
    setProfile((prev) => ({ ...prev, [key]: !prev[key] }));
    setConfirmed(false);
  }

  function choose(id: Carrier["id"]) {
    setPicked(id);
    setConfirmed(false);
  }

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.header}>
        <Text style={s.eyebrow}>Sold {SALE.soldOn}</Text>
        <Text style={s.title} accessibilityRole="header">
          How should it travel?
        </Text>
        <Text style={s.sub}>
          {SALE.item} — to {SALE.buyer}, {SALE.city}
        </Text>
      </View>

      {/* --- parcel profile: reshapes the whole plot --- */}
      <View
        style={s.chipRow}
        accessibilityRole="radiogroup"
        accessibilityLabel="Parcel profile"
      >
        {PROFILES.map((p) => {
          const on = profile[p.key];
          return (
            <Pressable
              key={p.key}
              onPress={() => toggle(p.key)}
              accessibilityRole="button"
              accessibilityState={{ selected: on }}
              accessibilityLabel={
                p.label +
                ", " +
                p.effect +
                ", currently " +
                (on ? "applied" : "off")
              }
              style={[s.chip, on && s.chipOn]}
            >
              <View style={[s.chipMark, on && s.chipMarkOn]}>
                <Text style={[s.chipMarkText, on && s.chipMarkTextOn]}>
                  {on ? p.mark : "·"}
                </Text>
              </View>
              <Text
                style={[s.chipLabel, on && s.chipLabelOn]}
                numberOfLines={1}
              >
                {p.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* --- the always-on proof: cost against wait --- */}
      <View style={s.plotWrap}>
        <Text style={s.axisY}>pricier</Text>
        <View style={s.plot}>
          <View style={[s.rule, { top: PLOT_H * 0.5 }]} />
          <View style={[s.ruleV, { left: "50%" }]} />
          {points.map((pt) => {
            const isPicked = pt.carrier.id === picked;
            const left = 8 + pt.x * 62; // percent
            const bottom = 10 + pt.y * 62; // percent
            return (
              <Pressable
                key={pt.carrier.id}
                onPress={() => choose(pt.carrier.id)}
                accessibilityRole="button"
                accessibilityState={{ selected: isPicked }}
                accessibilityLabel={
                  pt.carrier.name +
                  ", " +
                  won(pt.fare) +
                  ", " +
                  daysLabel(pt.days) +
                  ", " +
                  coverLabel(pt.carrier.cover) +
                  (pt.blocked ? ", unavailable: " + pt.blocked : "")
                }
                style={[
                  s.dot,
                  {
                    left: (left + "%") as unknown as number,
                    bottom: (bottom + "%") as unknown as number,
                  },
                  isPicked && s.dotPicked,
                  pt.blocked !== null && s.dotBlocked,
                ]}
              >
                <Text
                  style={[
                    s.dotFare,
                    isPicked && s.dotFarePicked,
                    pt.blocked !== null && s.dotFareBlocked,
                  ]}
                >
                  {won(pt.fare)}
                </Text>
                <Text
                  style={[
                    s.dotDays,
                    isPicked && s.dotDaysPicked,
                    pt.blocked !== null && s.dotDaysBlocked,
                  ]}
                  numberOfLines={1}
                >
                  {pt.blocked !== null ? "no" : daysLabel(pt.days)}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <View style={s.axisXRow}>
          <Text style={s.axisX}>arrives sooner</Text>
          <Text style={s.axisX}>later</Text>
        </View>
      </View>

      {/* --- ledger for whichever dot is live --- */}
      <FlatList
        style={s.ledger}
        contentContainerStyle={s.ledgerInner}
        data={points}
        keyExtractor={(p) => p.carrier.id}
        ListHeaderComponent={
          <Text style={s.ledgerHead}>
            {keys.length === 0
              ? "Plain parcel — base fares"
              : keys.length + " profile added — fares adjusted"}
          </Text>
        }
        renderItem={({ item }) => {
          const isPicked = item.carrier.id === picked;
          const gone = item.blocked !== null;
          return (
            <Pressable
              onPress={() => choose(item.carrier.id)}
              accessibilityRole="button"
              accessibilityState={{ selected: isPicked }}
              accessibilityLabel={
                "Select " + item.carrier.name + ". " + item.carrier.character
              }
              style={[s.row, isPicked && s.rowPicked]}
            >
              <View style={s.rowLead}>
                <View style={[s.tick, isPicked && s.tickOn, gone && s.tickOff]}>
                  <Text style={[s.tickText, isPicked && s.tickTextOn]}>
                    {gone ? "✕" : isPicked ? "✓" : ""}
                  </Text>
                </View>
                <View style={s.rowBody}>
                  <Text style={s.rowName}>{item.carrier.name}</Text>
                  <Text style={s.rowMeta} numberOfLines={1}>
                    {gone
                      ? item.blocked
                      : daysLabel(item.days) +
                        " · " +
                        coverLabel(item.carrier.cover)}
                  </Text>
                </View>
              </View>
              <Text style={gone ? s.rowFareOff : s.rowFare}>
                {gone ? "—" : won(item.fare)}
              </Text>
            </Pressable>
          );
        }}
      />

      {/* --- state machine band --- */}
      <View style={s.band} accessibilityLiveRegion="polite">
        <View style={s.bandText}>
          <Text style={s.bandLine} accessibilityRole="alert">
            {status}
          </Text>
          {chosen !== null && chosen.blocked === null ? (
            <View style={s.bandSum}>
              <Text style={s.bandSumLabel}>
                fare + {won(PLATFORM_FEE)} fee
              </Text>
              <Text style={s.bandTotal}>{won(totalFor(chosen.carrier, keys))}</Text>
            </View>
          ) : (
            <Text style={s.bandHint}>
              {blockedCount > 0
                ? blockedCount +
                  " of " +
                  CARRIERS.length +
                  " ruled out by the profile above"
                : "All four accept this parcel"}
            </Text>
          )}
        </View>
        <Pressable
          disabled={!canBook}
          onPress={() => {
            if (canBook) setConfirmed(true);
            else if (chosen !== null && chosen.blocked !== null) setPicked(null);
          }}
          accessibilityRole="button"
          accessibilityState={{ disabled: !canBook }}
          accessibilityLabel={
            confirmed
              ? "Booked"
              : canBook
                ? "Book " + (chosen ? chosen.carrier.name : "")
                : "Choose an available method first"
          }
          style={[s.cta, !canBook && s.ctaOff]}
        >
          <Text style={[s.ctaText, !canBook && s.ctaTextOff]}>
            {confirmed ? "Booked" : "Book"}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: tokens.color.bg },

  header: {
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(3),
    paddingBottom: tokens.space(3),
  },
  eyebrow: {
    fontSize: 11,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: tokens.color.faint,
    fontWeight: "600",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: tokens.color.ink,
    marginTop: tokens.space(1),
  },
  sub: {
    fontSize: 13,
    color: tokens.color.muted,
    marginTop: tokens.space(1),
  },

  chipRow: {
    flexDirection: "row",
    gap: tokens.space(2),
    paddingHorizontal: tokens.space(5),
    paddingBottom: tokens.space(3),
  },
  chip: {
    flex: 1,
    minHeight: 46,
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.border,
    paddingHorizontal: tokens.space(2),
    paddingVertical: tokens.space(2),
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.space(2),
  },
  chipOn: { borderColor: tokens.color.accent, backgroundColor: tokens.color.bg },
  chipMark: {
    width: 22,
    height: 22,
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
  },
  chipMarkOn: {
    backgroundColor: tokens.color.accent,
    borderColor: tokens.color.accent,
  },
  chipMarkText: { fontSize: 11, fontWeight: "700", color: tokens.color.faint },
  chipMarkTextOn: { color: tokens.color.onAccent },
  chipLabel: { flex: 1, fontSize: 11, color: tokens.color.muted },
  chipLabelOn: { color: tokens.color.ink2, fontWeight: "600" },

  plotWrap: {
    marginHorizontal: tokens.space(5),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(3),
  },
  axisY: {
    fontSize: 10,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    color: tokens.color.faint,
  },
  plot: { height: PLOT_H, marginTop: tokens.space(1) },
  rule: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: tokens.color.border,
  },
  ruleV: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: tokens.color.border,
  },
  dot: {
    position: "absolute",
    minWidth: 74,
    minHeight: DOT,
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    paddingHorizontal: tokens.space(2),
    paddingVertical: tokens.space(1),
    justifyContent: "center",
  },
  dotPicked: {
    borderColor: tokens.color.ink,
    backgroundColor: tokens.color.ink,
  },
  dotBlocked: {
    borderStyle: "dashed",
    borderColor: tokens.color.border,
  },
  /* CONTROLLED CELL — ₩ amount */
  dotFare: {
    fontSize: 15,
    fontWeight: "800",
    color: tokens.color.ink2,
    fontVariant: ["tabular-nums"],
  },
  dotFarePicked: { color: tokens.color.onInk },
  dotFareBlocked: { color: tokens.color.faint },
  dotDays: { fontSize: 10, color: tokens.color.muted, marginTop: 2 },
  dotDaysPicked: { color: tokens.color.onInkMuted },
  dotDaysBlocked: { color: tokens.color.faint },
  axisXRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: tokens.space(1),
  },
  axisX: {
    fontSize: 10,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    color: tokens.color.faint,
  },

  ledger: { flex: 1, marginTop: tokens.space(3) },
  ledgerInner: { paddingHorizontal: tokens.space(5), paddingBottom: tokens.space(3) },
  ledgerHead: {
    fontSize: 11,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: tokens.color.faint,
    fontWeight: "600",
    marginBottom: tokens.space(2),
  },
  row: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: tokens.space(2),
    paddingHorizontal: tokens.space(2),
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.bg,
    gap: tokens.space(2),
  },
  rowPicked: { borderColor: tokens.color.border },
  rowLead: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.space(2),
  },
  tick: {
    width: 20,
    height: 20,
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
  },
  tickOn: { backgroundColor: tokens.color.ink, borderColor: tokens.color.ink },
  tickOff: { borderStyle: "dashed" },
  tickText: { fontSize: 11, color: tokens.color.faint },
  tickTextOn: { color: tokens.color.onInk },
  rowBody: { flex: 1 },
  rowName: { fontSize: 13, fontWeight: "600", color: tokens.color.ink },
  rowMeta: { fontSize: 11, color: tokens.color.muted, marginTop: 2 },
  /* CONTROLLED CELL — ₩ amount */
  rowFare: {
    fontSize: 15,
    fontWeight: "800",
    color: tokens.color.ink2,
    fontVariant: ["tabular-nums"],
  },
  rowFareOff: { fontSize: 15, fontWeight: "800", color: tokens.color.faint },

  band: {
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(3),
    paddingBottom: tokens.space(3),
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.space(3),
  },
  bandText: { flex: 1 },
  bandLine: { fontSize: 12, color: tokens.color.ink2, lineHeight: 17 },
  bandHint: { fontSize: 11, color: tokens.color.faint, marginTop: tokens.space(1) },
  bandSum: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: tokens.space(2),
    marginTop: tokens.space(1),
  },
  bandSumLabel: { fontSize: 11, color: tokens.color.faint },
  /* CONTROLLED CELL — ₩ amount */
  bandTotal: {
    fontSize: 15,
    fontWeight: "800",
    color: tokens.color.ink2,
    fontVariant: ["tabular-nums"],
  },
  cta: {
    minWidth: 88,
    minHeight: 46,
    paddingHorizontal: tokens.space(4),
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.color.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaOff: {
    backgroundColor: tokens.color.bg,
    borderWidth: 1,
    borderColor: tokens.color.border,
  },
  ctaText: { fontSize: 14, fontWeight: "700", color: tokens.color.onAccent },
  ctaTextOff: { color: tokens.color.faint },
});
