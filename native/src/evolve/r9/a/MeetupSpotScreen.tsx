// native/src/evolve/r8/a/MeetupSpotScreen.tsx — auto-native-r8 candidate a.
//
// Meetup spot picker: two strangers finishing a deal have to agree on WHERE to hand the item
// over, and the only thing that makes that negotiation hard is fairness — nobody wants to be
// the one who crosses the city. So the screen's argument is spatial, and the skeleton follows
// it: a query header (who is leaving from where, and when), a map canvas that answers it, and
// a bottom sheet that carries the selected place. The proof lives on the canvas, always on:
// every candidate wears its own two walk times, and the shaded band is the region where the
// two walks are within three minutes of each other. Nothing has to be opened to see it.
//
// Deliberately NOT the fixed bottom state-machine band that won r3/r5/r6/r7. There is no
// blocking condition to narrate here: a spot is always selected (the recommendation, until you
// pick another one), so a band that names a blocker would have nothing to say. The one
// commitment control lives inside the sheet, next to the thing it commits to, and is always
// live. The sheet is a content surface, not a state machine.
//
// No map SDK — no new dependency and nothing that phones home. The city is a fixed coordinate
// system drawn with react-native-svg (already used by src/charts), and every walk figure is
// computed from those coordinates, so the picture and the numbers are the same claim. See
// data.ts for the geometry, including why the "even for both" region is a hyperbola.
//
// (`fontVariant: ["tabular-nums"]` is used on the minute readouts. The known RN Web cascade
// trap — a ₩ glyph nested under a tabular-nums Text picking up strike-through artifacts — is
// inert here because this screen prints no currency at all: a meetup place has no price. The
// order line names the item, not its cost.)
import { useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import Svg, { Line, Path, Polygon, Rect } from "react-native-svg";
import { tokens } from "../../../tokens";
import {
  CITY_BLOCKS,
  DEFAULT_ORIGIN,
  DEFAULT_SLOT,
  EVEN_GAP,
  MEET_DATE,
  ORDER_REF,
  ORIGINS,
  ORIGIN_BY_ID,
  PARK,
  PEER_AREA,
  PEER_NAME,
  PEER_POINT,
  PEER_SHORT,
  SLOTS,
  SLOT_BY_ID,
  SPOTS,
  fairBandOutline,
  readAll,
  recommend,
  type OriginId,
  type Point,
  type SlotId,
  type SpotReading,
} from "./data";

const HIT = { top: 10, bottom: 10, left: 10, right: 10 };

/** Fraction of the unit square that must stay on screen, plus its centre. */
const CONTENT_W = 0.85;
const CONTENT_H = 0.77;
const CONTENT_CX = 0.475;
const CONTENT_CY = 0.465;

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

type SegmentOption<T extends string> = { id: T; label: string; a11yLabel: string };

function Segmented<T extends string>({
  options,
  value,
  onChange,
  groupLabel,
}: {
  options: SegmentOption<T>[];
  value: T;
  onChange: (id: T) => void;
  groupLabel: string;
}) {
  return (
    <View style={styles.segment} accessibilityRole="radiogroup" accessibilityLabel={groupLabel}>
      {options.map((option) => {
        const active = option.id === value;
        return (
          <Pressable
            key={option.id}
            onPress={() => onChange(option.id)}
            hitSlop={HIT}
            accessibilityRole="radio"
            accessibilityState={{ checked: active }}
            accessibilityLabel={option.a11yLabel}
            style={({ pressed }) => [
              styles.segmentBtn,
              active && styles.segmentBtnActive,
              pressed && !active && styles.segmentBtnPressed,
            ]}
          >
            <Text style={[styles.segmentText, active && styles.segmentTextActive]}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function Chevron({ up }: { up: boolean }) {
  return (
    <View
      style={styles.chevron}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <Svg width={12} height={8}>
        <Path
          d={up ? "M1 7 L6 2 L11 7" : "M1 1 L6 6 L11 1"}
          fill="none"
          stroke={tokens.color.ink}
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
}

/** Two proportional segments with a tick at dead centre: how lopsided this spot is. */
function SplitBar({ you, peer }: { you: number; peer: number }) {
  return (
    <View
      style={styles.bar}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <View style={[styles.barYou, { flex: you }]} />
      <View style={[styles.barPeer, { flex: peer }]} />
      <View style={styles.barMid} />
    </View>
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

export function MeetupSpotScreen() {
  const { width: winW, height: winH } = useWindowDimensions();
  const [originId, setOriginId] = useState<OriginId>(DEFAULT_ORIGIN);
  const [slotId, setSlotId] = useState<SlotId>(DEFAULT_SLOT);
  const [pickedId, setPickedId] = useState<string | null>(null); // null = follow the recommendation
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [proposed, setProposed] = useState(false);

  const origin = ORIGIN_BY_ID[originId];
  const slot = SLOT_BY_ID[slotId];

  const readings = useMemo(() => readAll(origin.point, slotId), [origin, slotId]);
  const best = useMemo(() => recommend(readings), [readings]);
  const selected = readings.find((r) => r.spot.id === pickedId) ?? best ?? readings[0];

  // Any change to the question invalidates an answer already sent to the other person.
  const pickSpot = (id: string) => {
    setPickedId(id);
    setProposed(false);
  };
  const pickOrigin = (id: OriginId) => {
    setOriginId(id);
    setProposed(false);
  };
  const pickSlot = (id: SlotId) => {
    setSlotId(id);
    setProposed(false);
  };

  const mapH =
    Math.round(Math.max(Math.min(winH * 0.46, 470), 300)) - (detailsOpen ? 56 : 0);

  const geo = useMemo(() => {
    // Uniform fit: the same scale on both axes, so the map never stretches.
    const scale = Math.max(
      Math.min((winW - 32) / CONTENT_W, (mapH - 32) / CONTENT_H),
      180,
    );
    return {
      scale,
      ox: winW / 2 - CONTENT_CX * scale,
      oy: mapH / 2 - CONTENT_CY * scale,
    };
  }, [winW, mapH]);

  const project = (p: Point) => ({
    x: round2(geo.ox + p.x * geo.scale),
    y: round2(geo.oy + p.y * geo.scale),
  });

  const band = useMemo(() => fairBandOutline(origin.point, PEER_POINT), [origin]);
  const bandPoints = band
    .map((p) => {
      const q = project(p);
      return `${q.x},${q.y}`;
    })
    .join(" ");

  const youAt = project(origin.point);
  const peerAt = project(PEER_POINT);
  const selectedAt = project(selected.spot.point);
  const parkTop = round2(geo.oy + PARK.y * geo.scale);
  const parkHeight = Math.max(round2(PARK.h * geo.scale), 6);

  const openEven = readings.filter((r) => r.open && r.even).length;
  const closedCount = readings.filter((r) => !r.open).length;
  const summary =
    `${openEven} of ${SPOTS.length} spots are even for both at ${slot.label}` +
    (closedCount > 0 ? ` · ${closedCount} closed` : "");

  const isBest = best !== undefined && best.spot.id === selected.spot.id;
  const recovery = selected.open ? undefined : best;
  const gapText = selected.even
    ? selected.gap === 0
      ? "dead even"
      : `${selected.gap} min apart — even for both`
    : `${selected.gap} min apart — leans ${
        selected.you < selected.peer ? "your way" : `${PEER_SHORT}'s way`
      }`;
  const whyText = selected.even
    ? `Least total walking (${selected.total} min) among the spots that are even for both, leaving from ${origin.label} in ${origin.area}.`
    : `You walk ${selected.you} min from ${origin.area} and ${PEER_SHORT} walks ${selected.peer} min from ${PEER_AREA}. That is ${selected.gap} minutes apart, outside the ${EVEN_GAP} minute band.`;

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title} accessibilityRole="header">
          Pick a meetup spot
        </Text>
        <Text style={styles.subtitle}>
          {ORDER_REF} · with {PEER_NAME}
        </Text>

        <View style={styles.queryRow}>
          <Text style={styles.queryLabel}>Leaving from</Text>
          <Segmented
            options={ORIGINS.map((o) => ({
              id: o.id,
              label: o.label,
              a11yLabel: `Leaving from ${o.label}, ${o.area}`,
            }))}
            value={originId}
            onChange={pickOrigin}
            groupLabel="Where you are leaving from"
          />
        </View>

        <View style={styles.queryRow}>
          <Text style={styles.queryLabel}>Meeting</Text>
          <Text style={styles.queryValue}>{MEET_DATE}</Text>
          <Segmented
            options={SLOTS.map((s) => ({ id: s.id, label: s.label, a11yLabel: s.long }))}
            value={slotId}
            onChange={pickSlot}
            groupLabel="Meeting time"
          />
        </View>
      </View>

      <View style={[styles.map, { height: mapH }]}>
        <View
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        >
          <Svg width={winW} height={mapH}>
            {CITY_BLOCKS.map((b) => {
              const at = project({ x: b.x, y: b.y });
              return (
                <Rect
                  key={b.id}
                  x={at.x}
                  y={at.y}
                  width={round2(b.size * geo.scale)}
                  height={round2(b.size * geo.scale)}
                  rx={3}
                  fill={tokens.color.border}
                />
              );
            })}
            <Rect
              x={round2(geo.ox + PARK.x * geo.scale)}
              y={parkTop}
              width={round2(PARK.w * geo.scale)}
              height={parkHeight}
              fill={tokens.color.accent}
              fillOpacity={0.12}
            />
            {band.length > 0 ? (
              <Polygon
                points={bandPoints}
                fill={tokens.color.accent}
                fillOpacity={0.07}
                stroke={tokens.color.accent}
                strokeOpacity={0.5}
                strokeWidth={1}
                strokeDasharray="6 5"
              />
            ) : null}
            <Line
              x1={youAt.x}
              y1={youAt.y}
              x2={selectedAt.x}
              y2={selectedAt.y}
              stroke={tokens.color.accent}
              strokeWidth={2}
              strokeDasharray="7 5"
              strokeLinecap="round"
            />
            <Line
              x1={peerAt.x}
              y1={peerAt.y}
              x2={selectedAt.x}
              y2={selectedAt.y}
              stroke={tokens.color.ink2}
              strokeWidth={2}
              strokeDasharray="2 6"
              strokeLinecap="round"
            />
          </Svg>
        </View>

        <Text style={[styles.parkLabel, { top: parkTop + parkHeight / 2 - 8 }]}>
          {PARK.label}
        </Text>

        <View
          style={[styles.pinSlot, { left: peerAt.x, top: peerAt.y }]}
          pointerEvents="none"
        >
          <View style={styles.peerPin}>
            <Text style={styles.peerPinText} numberOfLines={1}>
              {PEER_SHORT} · {PEER_AREA}
            </Text>
          </View>
        </View>

        <View
          style={[styles.pinSlot, { left: youAt.x, top: youAt.y }]}
          pointerEvents="none"
        >
          <View style={styles.youPin}>
            <Text style={styles.youPinText} numberOfLines={1}>
              You · {origin.label}
            </Text>
          </View>
        </View>

        {readings.map((r) => {
          const at = project(r.spot.point);
          const isSelected = r.spot.id === selected.spot.id;
          return (
            <View
              key={r.spot.id}
              style={[styles.markerSlot, { left: at.x, top: at.y, zIndex: isSelected ? 4 : 3 }]}
              pointerEvents="box-none"
            >
              <Pressable
                onPress={() => pickSpot(r.spot.id)}
                hitSlop={HIT}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                accessibilityLabel={markerLabel(r, slot.label)}
                style={({ pressed }) => [
                  styles.marker,
                  r.even && styles.markerEven,
                  !r.open && styles.markerClosed,
                  isSelected && styles.markerSelected,
                  pressed && styles.markerPressed,
                ]}
              >
                {r.open ? (
                  <Text
                    style={[
                      styles.markerMinutes,
                      !r.even && styles.markerMinutesUneven,
                      isSelected && styles.markerTextSelected,
                    ]}
                  >
                    {r.you}·{r.peer}
                  </Text>
                ) : (
                  <Text
                    style={[styles.markerShut, isSelected && styles.markerTextSelected]}
                  >
                    Closed
                  </Text>
                )}
              </Pressable>
              {r.even || isSelected ? (
                <Text
                  style={[styles.markerName, isSelected && styles.markerNameSelected]}
                  numberOfLines={1}
                >
                  {r.spot.short}
                </Text>
              ) : null}
            </View>
          );
        })}

        <View style={styles.legend} pointerEvents="none">
          <View style={styles.legendRow}>
            <View style={styles.legendSwatch} />
            <Text style={styles.legendText}>even for both (within {EVEN_GAP} min)</Text>
          </View>
          <Text style={styles.legendText}>
            8·9 = walk minutes, you · {PEER_SHORT}
          </Text>
        </View>
      </View>

      <View style={styles.sheet}>
        <Pressable
          onPress={() => setDetailsOpen((v) => !v)}
          hitSlop={HIT}
          accessibilityRole="button"
          accessibilityState={{ expanded: detailsOpen }}
          accessibilityLabel={detailsOpen ? "Collapse spot details" : "Expand spot details"}
          style={styles.grabberHit}
        >
          <View style={styles.grabber} />
        </Pressable>

        <ScrollView
          style={styles.sheetScroll}
          contentContainerStyle={styles.sheetBody}
          showsVerticalScrollIndicator={false}
        >
          <Text
            style={styles.summary}
            accessibilityRole="alert"
            accessibilityLiveRegion="polite"
          >
            {summary}
          </Text>

          <View style={styles.card}>
            <View style={styles.cardHead}>
              <View style={styles.cardHeadText}>
                <Text style={styles.spotName} accessibilityRole="header">
                  {selected.spot.name}
                </Text>
                <Text style={styles.spotKind}>
                  {selected.spot.kind} · {selected.spot.hoursLabel}
                </Text>
              </View>
              {isBest ? (
                <View style={styles.tag}>
                  <Text style={styles.tagText}>Best match</Text>
                </View>
              ) : null}
            </View>

            {selected.open ? (
              <View style={styles.splitBlock}>
                <SplitBar you={selected.you} peer={selected.peer} />
                <View style={styles.splitLegend}>
                  <Text style={styles.splitYou}>You {selected.you} min</Text>
                  <Text style={styles.splitPeer}>
                    {PEER_SHORT} {selected.peer} min
                  </Text>
                </View>
                <Text style={styles.splitVerdict}>{gapText}</Text>
              </View>
            ) : (
              <View style={styles.shutNotice}>
                <Text style={styles.shutTitle}>Closed at {slot.label}</Text>
                <Text style={styles.shutBody}>{selected.note}</Text>
              </View>
            )}

            <FlatList
              horizontal
              data={selected.spot.attributes}
              keyExtractor={(item) => item}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chipRow}
              renderItem={({ item }) => (
                <View style={styles.chip}>
                  <Text style={styles.chipText}>{item}</Text>
                </View>
              )}
            />

            {detailsOpen ? (
              <View style={styles.details}>
                <DetailRow label="Address" value={selected.spot.address} />
                <DetailRow label="Where exactly" value={selected.spot.landmark} />
                <DetailRow label={`At ${slot.label}`} value={selected.note} />
                <DetailRow label="Why this one" value={whyText} />
              </View>
            ) : null}
          </View>

          {!proposed && best && best.spot.id !== selected.spot.id && selected.open ? (
            <View style={styles.hint}>
              <Text style={styles.hintText}>
                {best.spot.short} is more even from {origin.label} — {best.you}·{best.peer} min,{" "}
                {best.total} min of walking between you.
              </Text>
              <Pressable
                onPress={() => pickSpot(best.spot.id)}
                hitSlop={HIT}
                accessibilityRole="button"
                accessibilityLabel={`Switch to ${best.spot.name}`}
                style={({ pressed }) => [styles.hintBtn, pressed && styles.hintBtnPressed]}
              >
                <Text style={styles.hintBtnText}>Switch</Text>
              </Pressable>
            </View>
          ) : null}

          {proposed ? (
            <View style={styles.proposed}>
              <Text
                style={styles.proposedTitle}
                accessibilityRole="alert"
                accessibilityLiveRegion="polite"
              >
                Proposed to {PEER_SHORT}
              </Text>
              <Text style={styles.proposedBody}>
                {selected.spot.name} · {MEET_DATE} at {slot.label}. {PEER_SHORT} has to accept
                before it is set — you will hear back either way.
              </Text>
              <Pressable
                onPress={() => setProposed(false)}
                hitSlop={HIT}
                accessibilityRole="button"
                accessibilityLabel="Withdraw the proposal and pick another spot"
                style={({ pressed }) => [styles.ghostBtn, pressed && styles.ghostBtnPressed]}
              >
                <Text style={styles.ghostBtnText}>Pick another spot</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.actions}>
              <Pressable
                onPress={() => (recovery ? pickSpot(recovery.spot.id) : setProposed(true))}
                accessibilityRole="button"
                accessibilityLabel={
                  recovery
                    ? `Switch to ${recovery.spot.name}, open at ${slot.label}`
                    : `Propose ${selected.spot.name} to ${PEER_SHORT} on ${MEET_DATE} at ${slot.label}`
                }
                style={({ pressed }) => [styles.primary, pressed && styles.primaryPressed]}
              >
                <Text style={styles.primaryText}>
                  {recovery ? `Pick ${recovery.spot.short} instead` : "Propose this spot"}
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setDetailsOpen((v) => !v)}
                accessibilityRole="button"
                accessibilityState={{ expanded: detailsOpen }}
                accessibilityLabel={detailsOpen ? "Hide spot details" : "Show spot details"}
                style={({ pressed }) => [styles.secondary, pressed && styles.secondaryPressed]}
              >
                <Text style={styles.secondaryText}>Details</Text>
                <Chevron up={detailsOpen} />
              </Pressable>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

function markerLabel(r: SpotReading, slotLabel: string): string {
  const head = `${r.spot.name}, ${r.spot.kind}.`;
  if (!r.open) return `${head} Closed at ${slotLabel}.`;
  const verdict = r.even
    ? "Even for both."
    : `${r.gap} minutes apart, ${r.you < r.peer ? "shorter for you" : `shorter for ${PEER_SHORT}`}.`;
  return `${head} ${r.you} minute walk for you, ${r.peer} for ${PEER_SHORT}. ${verdict}`;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: tokens.color.bg },

  header: {
    paddingHorizontal: tokens.space(4),
    paddingTop: tokens.space(2),
    paddingBottom: tokens.space(3),
    gap: tokens.space(1),
  },
  title: { fontSize: 21, fontWeight: "700", color: tokens.color.ink },
  subtitle: { fontSize: 13, fontWeight: "400", color: tokens.color.muted },
  queryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.space(2),
    marginTop: tokens.space(1),
  },
  queryLabel: { fontSize: 13, fontWeight: "400", color: tokens.color.faint },
  queryValue: {
    fontSize: 13,
    fontWeight: "600",
    color: tokens.color.ink2,
    fontVariant: ["tabular-nums"],
  },
  segment: {
    flexDirection: "row",
    backgroundColor: tokens.color.border,
    borderRadius: tokens.radius.sm + 3,
    padding: 3,
    gap: 3,
    marginLeft: "auto",
  },
  segmentBtn: {
    minHeight: 32,
    paddingHorizontal: tokens.space(3),
    justifyContent: "center",
    borderRadius: tokens.radius.sm,
  },
  segmentBtnActive: { backgroundColor: tokens.color.bg },
  segmentBtnPressed: { opacity: 0.6 },
  segmentText: { fontSize: 13, fontWeight: "600", color: tokens.color.muted },
  segmentTextActive: { color: tokens.color.ink },

  map: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    overflow: "hidden",
  },
  parkLabel: {
    position: "absolute",
    right: tokens.space(3),
    fontSize: 12,
    fontWeight: "600",
    color: tokens.color.muted,
  },

  pinSlot: {
    position: "absolute",
    width: 160,
    marginLeft: -80,
    marginTop: -15,
    alignItems: "center",
    zIndex: 2,
  },
  youPin: {
    height: 30,
    justifyContent: "center",
    paddingHorizontal: tokens.space(3),
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.color.ink,
  },
  youPinText: { fontSize: 13, fontWeight: "600", color: tokens.color.onInk },
  peerPin: {
    height: 30,
    justifyContent: "center",
    paddingHorizontal: tokens.space(3),
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.color.bg,
    borderWidth: 1.5,
    borderColor: tokens.color.ink2,
  },
  peerPinText: { fontSize: 13, fontWeight: "600", color: tokens.color.ink },

  markerSlot: {
    position: "absolute",
    width: 124,
    marginLeft: -62,
    marginTop: -16,
    alignItems: "center",
  },
  marker: {
    minHeight: 32,
    minWidth: 56,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: tokens.space(2),
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
  },
  markerEven: { borderColor: tokens.color.ink2, borderWidth: 1.5 },
  markerClosed: { borderStyle: "dashed", backgroundColor: tokens.color.bg },
  markerSelected: {
    backgroundColor: tokens.color.accent,
    borderColor: tokens.color.accent,
    borderWidth: 1.5,
  },
  markerPressed: { opacity: 0.7 },
  markerMinutes: {
    fontSize: 14,
    fontWeight: "600",
    color: tokens.color.ink,
    fontVariant: ["tabular-nums"],
  },
  markerMinutesUneven: { color: tokens.color.muted },
  markerShut: { fontSize: 12, fontWeight: "600", color: tokens.color.muted },
  markerTextSelected: { color: tokens.color.onAccent },
  markerName: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "600",
    color: tokens.color.muted,
    textAlign: "center",
  },
  markerNameSelected: { color: tokens.color.ink },

  legend: {
    position: "absolute",
    left: tokens.space(3),
    bottom: 22,
    gap: 3,
  },
  legendRow: { flexDirection: "row", alignItems: "center", gap: tokens.space(2) },
  legendSwatch: {
    width: 18,
    height: 10,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: tokens.color.accent,
    backgroundColor: tokens.color.accent,
    opacity: 0.3,
  },
  legendText: { fontSize: 12, fontWeight: "400", color: tokens.color.muted },

  sheet: {
    flex: 1,
    marginTop: -14,
    backgroundColor: tokens.color.bg,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 1,
    borderColor: tokens.color.border,
    shadowColor: tokens.color.ink,
    shadowOpacity: 0.07,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: -3 },
    elevation: 10,
  },
  grabberHit: { paddingTop: tokens.space(2), paddingBottom: tokens.space(1), alignItems: "center" },
  grabber: {
    width: 38,
    height: 5,
    borderRadius: 3,
    backgroundColor: tokens.color.border,
  },
  sheetScroll: { flex: 1 },
  sheetBody: {
    paddingHorizontal: tokens.space(4),
    paddingTop: tokens.space(1),
    paddingBottom: tokens.space(6),
    gap: tokens.space(3),
  },
  summary: {
    fontSize: 15,
    fontWeight: "600",
    color: tokens.color.ink,
    fontVariant: ["tabular-nums"],
  },

  card: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(4),
    gap: tokens.space(3),
  },
  cardHead: { flexDirection: "row", alignItems: "flex-start", gap: tokens.space(2) },
  cardHeadText: { flex: 1, gap: 2 },
  spotName: { fontSize: 17, fontWeight: "700", color: tokens.color.ink },
  spotKind: { fontSize: 13, fontWeight: "400", color: tokens.color.muted },
  tag: {
    paddingHorizontal: tokens.space(2),
    paddingVertical: 4,
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.accent,
  },
  tagText: { fontSize: 12, fontWeight: "600", color: tokens.color.onAccent },

  splitBlock: { gap: tokens.space(2) },
  bar: {
    flexDirection: "row",
    height: 10,
    borderRadius: 5,
    overflow: "hidden",
    backgroundColor: tokens.color.border,
  },
  barYou: { backgroundColor: tokens.color.accent },
  barPeer: { backgroundColor: tokens.color.ink2 },
  barMid: {
    position: "absolute",
    left: "50%",
    marginLeft: -1,
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: tokens.color.bg,
  },
  splitLegend: { flexDirection: "row", justifyContent: "space-between" },
  splitYou: {
    fontSize: 15,
    fontWeight: "600",
    color: tokens.color.accent,
    fontVariant: ["tabular-nums"],
  },
  splitPeer: {
    fontSize: 15,
    fontWeight: "600",
    color: tokens.color.ink2,
    fontVariant: ["tabular-nums"],
  },
  splitVerdict: { fontSize: 14, fontWeight: "400", color: tokens.color.muted },

  shutNotice: {
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.ink2,
    padding: tokens.space(3),
    gap: 4,
  },
  shutTitle: { fontSize: 15, fontWeight: "600", color: tokens.color.ink },
  shutBody: { fontSize: 14, fontWeight: "400", color: tokens.color.muted },

  chipRow: { gap: tokens.space(2), paddingRight: tokens.space(2) },
  chip: {
    height: 28,
    justifyContent: "center",
    paddingHorizontal: tokens.space(3),
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.border,
  },
  chipText: { fontSize: 12, fontWeight: "600", color: tokens.color.muted },

  details: {
    gap: tokens.space(3),
    borderTopWidth: 1,
    borderColor: tokens.color.border,
    paddingTop: tokens.space(3),
  },
  detailRow: { gap: 2 },
  detailLabel: { fontSize: 12, fontWeight: "600", color: tokens.color.faint },
  detailValue: { fontSize: 14, fontWeight: "400", color: tokens.color.ink2 },

  hint: {
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.space(3),
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.border,
    paddingVertical: tokens.space(3),
    paddingHorizontal: tokens.space(3),
  },
  hintText: { flex: 1, fontSize: 14, fontWeight: "400", color: tokens.color.ink2 },
  hintBtn: {
    minHeight: 36,
    justifyContent: "center",
    paddingHorizontal: tokens.space(3),
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.accent,
  },
  hintBtnPressed: { opacity: 0.6 },
  hintBtnText: { fontSize: 14, fontWeight: "600", color: tokens.color.accent },

  actions: { flexDirection: "row", gap: tokens.space(2) },
  primary: {
    flex: 1,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.color.accent,
  },
  primaryPressed: { opacity: 0.85 },
  primaryText: { fontSize: 16, fontWeight: "600", color: tokens.color.onAccent },
  secondary: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.space(2),
    paddingHorizontal: tokens.space(4),
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.border,
  },
  secondaryPressed: { backgroundColor: tokens.color.border },
  secondaryText: { fontSize: 16, fontWeight: "600", color: tokens.color.ink },
  chevron: { alignItems: "center", justifyContent: "center" },

  proposed: {
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.color.ink,
    padding: tokens.space(4),
    gap: tokens.space(2),
  },
  proposedTitle: { fontSize: 16, fontWeight: "700", color: tokens.color.onInk },
  proposedBody: { fontSize: 14, fontWeight: "400", color: tokens.color.onInkMuted },
  ghostBtn: {
    alignSelf: "flex-start",
    minHeight: 40,
    justifyContent: "center",
    paddingHorizontal: tokens.space(4),
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.onInkMuted,
    marginTop: tokens.space(1),
  },
  ghostBtnPressed: { opacity: 0.7 },
  ghostBtnText: { fontSize: 14, fontWeight: "600", color: tokens.color.onInk },
});
