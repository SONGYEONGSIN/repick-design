// native/src/evolve/r8/c/MeetupSlotGridScreen.tsx — auto-native-r8 candidate c.
//
// Meetup Slot Grid: two people picking one time to hand an item over in person. The screen's
// argument is a 2-axis matrix (5 days across × 4 time bands down), not a list, because the
// question is "when do our two calendars overlap" and only a grid answers that at a glance —
// a vertical list of candidate times with radio buttons answers "which one do you prefer",
// which is a different (and already-settled) question.
//
// Encoding: every cell carries the same two-bar glyph — top bar = you, bottom bar = Ilhwa,
// filled = free, hollow = busy. Four states therefore read as four distinct SHAPES
// (■/■, ■/□, □/■, □/□) before any color is involved; the mutual state additionally gets the
// accent fill so overlaps pop while scanning. Nothing here is color-only.
//
// Fixed chrome: none. The last four native rounds all landed on a fixed bottom state-machine
// band, so this candidate deliberately does not use one — the grid itself is the standing proof
// (the overlap count and the earliest overlap are visible on open, before any tap), and the
// panel under the grid is a per-cell inspector that scrolls with the content, not a CTA band.
// Every action lives in that inspector and is scoped to the cell you touched.
//
// Interactions strengthen the proof rather than defer it: saying "I'm free then" on a cell where
// only Ilhwa is free turns that cell into a match, bumps the overlap count, and hands you the
// proposal for it in one step.
import { useMemo, useState } from "react";
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
  BANDS,
  DAYS,
  DEAL_LINE,
  MEETUP_PLACE,
  PARTNER_NAME,
  THEIR_FREE,
  TOTAL_SLOTS,
  WEEK_LABEL,
  YOUR_FREE_INITIAL,
  cellKey,
  parseCellKey,
  type DayColumn,
  type TimeBand,
} from "./data";

type CellState = "both" | "you" | "them" | "none";

interface Slot {
  id: string;
  day: DayColumn;
  band: TimeBand;
}

const STATE_SPOKEN: Record<CellState, string> = {
  both: "Both free",
  you: "Only you are free",
  them: `Only ${PARTNER_NAME} is free`,
  none: "Neither of you is free",
};

/** The shared glyph grammar: top bar = you, bottom bar = the counterparty, filled = free. */
function AvailabilityBars({
  you,
  them,
  onAccent,
  small,
}: {
  you: boolean;
  them: boolean;
  onAccent?: boolean;
  small?: boolean;
}) {
  const base = small ? styles.barSmall : styles.bar;
  const free = onAccent ? styles.barFreeOnAccent : styles.barFree;
  return (
    <View style={small ? styles.barsSmall : styles.bars}>
      <View style={[base, you ? free : styles.barBusy]} />
      <View style={[base, them ? free : styles.barBusy]} />
    </View>
  );
}

/** Vector check (rotated corner) — no emoji, no icon font. Drawn in on-ink white. */
function CheckMark() {
  return (
    <View style={styles.check}>
      <View style={styles.checkArmBottom} />
      <View style={styles.checkArmRight} />
    </View>
  );
}

function LegendItem({
  you,
  them,
  label,
}: {
  you: boolean;
  them: boolean;
  label: string;
}) {
  const mutual = you && them;
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendSwatch, mutual && styles.legendSwatchAccent]}>
        <AvailabilityBars you={you} them={them} onAccent={mutual} small />
      </View>
      <Text style={styles.legendLabel}>{label}</Text>
    </View>
  );
}

function StatusRow({ who, free }: { who: string; free: boolean }) {
  return (
    <View style={styles.statusRow}>
      <View style={[styles.bar, free ? styles.barFree : styles.barBusy]} />
      <Text style={styles.statusWho}>{who}</Text>
      <Text style={[styles.statusWord, free && styles.statusWordFree]}>
        {free ? "free" : "busy"}
      </Text>
    </View>
  );
}

function PrimaryAction({
  label,
  spoken,
  onPress,
}: {
  label: string;
  spoken?: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={spoken ?? label}
      style={({ pressed }) => [styles.primaryBtn, pressed && styles.pressed]}
    >
      <Text style={styles.primaryBtnText}>{label}</Text>
    </Pressable>
  );
}

function SecondaryAction({
  label,
  spoken,
  onPress,
}: {
  label: string;
  spoken?: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={spoken ?? label}
      style={({ pressed }) => [styles.secondaryBtn, pressed && styles.pressed]}
    >
      <Text style={styles.secondaryBtnText}>{label}</Text>
    </Pressable>
  );
}

export function MeetupSlotGridScreen() {
  // Their side is fixed data; your side is the editable axis of the grid.
  const [yourFree, setYourFree] = useState<string[]>(YOUR_FREE_INITIAL);
  const [inspected, setInspected] = useState<string | null>(null);
  const [sentId, setSentId] = useState<string | null>(null);

  const theirSet = useMemo(() => new Set(THEIR_FREE), []);
  const yourSet = useMemo(() => new Set(yourFree), [yourFree]);

  const stateOf = (id: string): CellState => {
    const you = yourSet.has(id);
    const them = theirSet.has(id);
    if (you && them) return "both";
    if (you) return "you";
    if (them) return "them";
    return "none";
  };

  // Day-major, then band — so index 0 is genuinely the earliest overlap in the window.
  const mutual = useMemo<Slot[]>(() => {
    const found: Slot[] = [];
    for (const day of DAYS) {
      for (const band of BANDS) {
        const id = cellKey(day.id, band.id);
        if (yourSet.has(id) && theirSet.has(id)) found.push({ id, day, band });
      }
    }
    return found;
  }, [yourSet, theirSet]);

  const earliest = mutual.length > 0 ? mutual[0] : null;

  const dayCounts = useMemo<Record<string, number>>(() => {
    const counts: Record<string, number> = {};
    for (const day of DAYS) counts[day.id] = 0;
    for (const slot of mutual) counts[slot.day.id] = (counts[slot.day.id] ?? 0) + 1;
    return counts;
  }, [mutual]);

  const markFree = (id: string) => {
    setYourFree((prev) => (prev.includes(id) ? prev : [...prev, id]));
    setInspected(id);
  };

  const markBusy = (id: string) => {
    setYourFree((prev) => prev.filter((x) => x !== id));
    if (sentId === id) setSentId(null);
  };

  const showEarliest = () => {
    if (earliest) setInspected(earliest.id);
  };

  const renderHeader = (
    <View>
      <View style={styles.header}>
        <Text style={styles.kicker}>REPICK MEETUP</Text>
        <Text style={styles.title} accessibilityRole="header">
          Find a time with {PARTNER_NAME}
        </Text>
        {/* Plain Text, no fontVariant, and no tabular-nums Text above it — the ₩ glyph stays
            out of every tabular subtree on this screen. */}
        <Text style={styles.contextLine}>{DEAL_LINE}</Text>
        <Text style={styles.contextLine}>{MEETUP_PLACE}</Text>
      </View>

      <View style={styles.proof}>
        <View
          style={[
            styles.proofCountBox,
            mutual.length === 0 && styles.proofCountBoxEmpty,
          ]}
        >
          <Text
            style={[
              styles.proofCount,
              mutual.length === 0 && styles.proofCountEmpty,
            ]}
          >
            {mutual.length}
          </Text>
        </View>
        <View style={styles.proofBody}>
          <Text style={styles.proofTitle}>
            {mutual.length === 1
              ? "time works for both of you"
              : "times work for both of you"}
          </Text>
          <Text style={styles.proofSub}>
            {earliest
              ? `Earliest — ${earliest.day.abbr} ${earliest.band.compact}`
              : `Nothing overlaps yet — open a slot ${PARTNER_NAME} already has`}
          </Text>
          <Text style={styles.proofMeta}>
            of {TOTAL_SLOTS} slots · {WEEK_LABEL}
          </Text>
        </View>
      </View>

      <View style={styles.legend}>
        <Text style={styles.legendCaption}>
          Top bar = you · bottom bar = {PARTNER_NAME} · filled = free
        </Text>
        <View style={styles.legendRow}>
          <LegendItem you them label="Both" />
          <LegendItem you them={false} label="You only" />
          <LegendItem you={false} them label={`${PARTNER_NAME} only`} />
          <LegendItem you={false} them={false} label="Neither" />
        </View>
      </View>

      <View style={styles.headRow}>
        <View style={styles.gutter} />
        {DAYS.map((day) => {
          const count = dayCounts[day.id] ?? 0;
          return (
            <View
              key={day.id}
              style={styles.headCell}
              accessible
              accessibilityLabel={`${day.spoken}, ${count} shared ${
                count === 1 ? "time" : "times"
              }`}
            >
              <Text style={styles.headShort}>{day.short}</Text>
              <View style={styles.headNumRow}>
                <Text style={styles.headNum}>{day.dayNum}</Text>
                {count > 0 ? (
                  <View style={styles.headPill}>
                    <Text style={styles.headPillText}>{count}</Text>
                  </View>
                ) : null}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );

  const renderBand = ({ item: band }: { item: TimeBand }) => (
    <View style={styles.row}>
      <View style={styles.gutter}>
        <Text style={styles.gutterRange}>{band.range}</Text>
        <Text style={styles.gutterName}>{band.name}</Text>
      </View>
      {DAYS.map((day) => {
        const id = cellKey(day.id, band.id);
        const state = stateOf(id);
        const isSent = id === sentId;
        const isInspected = id === inspected;
        const isDraft = isInspected && state === "both" && !isSent;
        const dark = isSent || isDraft;
        return (
          <Pressable
            key={id}
            onPress={() => setInspected((prev) => (prev === id ? null : id))}
            accessibilityRole="button"
            accessibilityState={{ selected: isInspected }}
            accessibilityLabel={`${day.spoken}, ${band.spoken}. ${
              STATE_SPOKEN[state]
            }.${isSent ? " Proposal sent." : ""}`}
            accessibilityHint={
              state === "both"
                ? "Opens this time as your proposal"
                : "Opens details for this time"
            }
            style={({ pressed }) => [
              styles.cell,
              state === "both" && styles.cellBoth,
              isInspected && state !== "both" && styles.cellInspected,
              isDraft && styles.cellDraft,
              isSent && styles.cellSent,
              pressed && styles.pressed,
            ]}
          >
            {dark ? (
              <CheckMark />
            ) : (
              <AvailabilityBars
                you={yourSet.has(id)}
                them={theirSet.has(id)}
                onAccent={state === "both"}
              />
            )}
            {isSent ? <View style={styles.sentUnderline} /> : null}
          </Pressable>
        );
      })}
    </View>
  );

  const renderReadout = () => {
    const parsed = inspected ? parseCellKey(inspected) : null;

    if (!inspected || !parsed) {
      return (
        <>
          <Text style={styles.readoutKicker}>MUTUAL TIMES</Text>
          {mutual.length === 0 ? (
            <>
              <Text style={styles.readoutTitle}>Nothing overlaps yet</Text>
              <Text style={styles.readoutMessage}>
                Tap any cell where {PARTNER_NAME} is already free (bottom bar
                filled) and say you can make it.
              </Text>
            </>
          ) : (
            <>
              <Text style={styles.readoutTitle}>
                {mutual.length === 1
                  ? "One time fits both calendars"
                  : `${mutual.length} times fit both calendars`}
              </Text>
              <Text style={styles.readoutLine}>
                {mutual
                  .map((slot) => `${slot.day.abbr} ${slot.band.compact}`)
                  .join("  ·  ")}
              </Text>
              <Text style={styles.readoutHint}>
                Tap one in the grid above to turn it into a proposal.
              </Text>
              {earliest ? (
                <PrimaryAction
                  label={`Open the earliest — ${earliest.day.abbr} ${earliest.band.compact}`}
                  spoken={`Open the earliest shared time, ${earliest.day.spoken}, ${earliest.band.spoken}`}
                  onPress={showEarliest}
                />
              ) : null}
            </>
          )}
        </>
      );
    }

    const { day, band } = parsed;
    const state = stateOf(inspected);
    const youFree = yourSet.has(inspected);
    const themFree = theirSet.has(inspected);
    const isSent = inspected === sentId;

    return (
      <>
        <Text style={styles.readoutKicker}>{day.header}</Text>
        <Text style={styles.readoutTitle}>
          {band.compact} · {band.name}
        </Text>

        <View style={styles.statusList}>
          <StatusRow who="You" free={youFree} />
          <StatusRow who={PARTNER_NAME} free={themFree} />
        </View>

        {isSent ? (
          <>
            <Text style={styles.readoutAlert} accessibilityRole="alert">
              Proposal sent — {day.abbr} {band.compact}
            </Text>
            <Text style={styles.readoutMessage}>
              {PARTNER_NAME} gets a notification now. Her answer lands on this
              grid, and the slot stays held until she replies.
            </Text>
            <SecondaryAction
              label="Change the time"
              spoken="Change the proposed time"
              onPress={() => setSentId(null)}
            />
          </>
        ) : state === "both" ? (
          <>
            <Text style={styles.readoutMessage}>
              You are both free. Meet at {MEETUP_PLACE}.
            </Text>
            <PrimaryAction
              label={`Send this time to ${PARTNER_NAME}`}
              spoken={`Send ${day.spoken}, ${band.spoken}, to ${PARTNER_NAME}`}
              onPress={() => setSentId(inspected)}
            />
            <SecondaryAction
              label="Actually, I am busy then"
              spoken="Remove your availability for this time"
              onPress={() => markBusy(inspected)}
            />
          </>
        ) : state === "them" ? (
          <>
            <Text style={styles.readoutMessage}>
              {PARTNER_NAME} already holds this slot. Say you can make it and it
              turns into a match — {mutual.length + 1} in total.
            </Text>
            <PrimaryAction
              label="I can make it"
              spoken={`Mark yourself free on ${day.spoken}, ${band.spoken}`}
              onPress={() => markFree(inspected)}
            />
          </>
        ) : state === "you" ? (
          <>
            <Text style={styles.readoutMessage}>
              Only you are open here — {PARTNER_NAME} has not offered this slot,
              so proposing it would stall.
            </Text>
            {earliest ? (
              <PrimaryAction
                label={`Go to the earliest match — ${earliest.day.abbr} ${earliest.band.compact}`}
                spoken={`Go to the earliest shared time, ${earliest.day.spoken}, ${earliest.band.spoken}`}
                onPress={showEarliest}
              />
            ) : null}
            <SecondaryAction
              label="Actually, I am busy then"
              spoken="Remove your availability for this time"
              onPress={() => markBusy(inspected)}
            />
          </>
        ) : (
          <>
            <Text style={styles.readoutMessage}>
              Neither of you is open here. Opening it alone will not make a
              match — {PARTNER_NAME} has to hold it too.
            </Text>
            {earliest ? (
              <PrimaryAction
                label={`Go to the earliest match — ${earliest.day.abbr} ${earliest.band.compact}`}
                spoken={`Go to the earliest shared time, ${earliest.day.spoken}, ${earliest.band.spoken}`}
                onPress={showEarliest}
              />
            ) : null}
          </>
        )}
      </>
    );
  };

  return (
    <SafeAreaView style={styles.screen}>
      <FlatList
        style={styles.list}
        contentContainerStyle={styles.listContent}
        data={BANDS}
        keyExtractor={(band) => band.id}
        renderItem={renderBand}
        extraData={{ inspected, sentId, yourFree }}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={
          <View style={styles.readout} accessibilityLiveRegion="polite">
            {renderReadout()}
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

export default MeetupSlotGridScreen;

const CELL_HEIGHT = 56;
const GUTTER_WIDTH = 56;

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: tokens.color.bg },
  list: { flex: 1 },
  listContent: {
    paddingHorizontal: tokens.space(4),
    paddingBottom: tokens.space(6),
  },

  header: { paddingTop: tokens.space(4) },
  kicker: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.6,
    color: tokens.color.faint,
  },
  title: {
    marginTop: tokens.space(2),
    fontSize: 26,
    fontWeight: "700",
    letterSpacing: -0.4,
    color: tokens.color.ink,
  },
  contextLine: {
    marginTop: tokens.space(1),
    fontSize: 13,
    lineHeight: 19,
    color: tokens.color.muted,
  },

  proof: {
    marginTop: tokens.space(4),
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.space(3),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(3),
  },
  proofCountBox: {
    width: 52,
    height: 52,
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.color.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  proofCountBoxEmpty: {
    backgroundColor: tokens.color.bg,
    borderWidth: 1.5,
    borderColor: tokens.color.ink2,
  },
  proofCount: {
    fontSize: 26,
    fontWeight: "700",
    color: tokens.color.onAccent,
    fontVariant: ["tabular-nums"],
  },
  proofCountEmpty: { color: tokens.color.ink },
  proofBody: { flex: 1, gap: 2 },
  proofTitle: { fontSize: 15, fontWeight: "700", color: tokens.color.ink },
  proofSub: { fontSize: 13, fontWeight: "600", color: tokens.color.ink2 },
  proofMeta: { fontSize: 11, color: tokens.color.faint },

  legend: { marginTop: tokens.space(3), gap: tokens.space(2) },
  legendCaption: { fontSize: 11, lineHeight: 16, color: tokens.color.faint },
  legendRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: tokens.space(2),
  },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 5 },
  legendSwatch: {
    width: 26,
    height: 20,
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
  },
  legendSwatchAccent: {
    backgroundColor: tokens.color.accent,
    borderColor: tokens.color.accent,
  },
  legendLabel: { fontSize: 11, fontWeight: "600", color: tokens.color.ink2 },

  headRow: {
    marginTop: tokens.space(3),
    flexDirection: "row",
    alignItems: "flex-end",
    gap: tokens.space(1),
  },
  headCell: { flex: 1, alignItems: "center", gap: 2 },
  headShort: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.8,
    color: tokens.color.faint,
  },
  headNumRow: { flexDirection: "row", alignItems: "center", gap: 3 },
  headNum: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.ink,
    fontVariant: ["tabular-nums"],
  },
  headPill: {
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    paddingHorizontal: 3,
    backgroundColor: tokens.color.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  headPillText: {
    fontSize: 10,
    fontWeight: "700",
    color: tokens.color.onAccent,
    fontVariant: ["tabular-nums"],
  },

  row: {
    marginTop: tokens.space(1),
    flexDirection: "row",
    gap: tokens.space(1),
  },
  gutter: { width: GUTTER_WIDTH, justifyContent: "center" },
  gutterRange: {
    fontSize: 13,
    fontWeight: "700",
    color: tokens.color.ink2,
    fontVariant: ["tabular-nums"],
  },
  gutterName: { fontSize: 10, color: tokens.color.faint },

  // flex:1 spreads the five day columns across the row; on a 390pt screen that is 56.4pt wide
  // against a 56pt tall cell, so every target clears the 44×44 minimum without hitSlop
  // (hitSlop on adjacent grid cells would overlap and steal each other's taps).
  cell: {
    flex: 1,
    height: CELL_HEIGHT,
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  cellBoth: {
    backgroundColor: tokens.color.accent,
    borderColor: tokens.color.accent,
  },
  cellInspected: { borderWidth: 2, borderColor: tokens.color.ink2 },
  cellDraft: {
    backgroundColor: tokens.color.ink,
    borderColor: tokens.color.ink,
    borderWidth: 2,
  },
  cellSent: {
    backgroundColor: tokens.color.ink,
    borderColor: tokens.color.accent,
    borderWidth: 2,
  },
  sentUnderline: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 4,
    backgroundColor: tokens.color.accent,
  },
  pressed: { opacity: 0.75 },

  bars: { gap: 4, alignItems: "center" },
  barsSmall: { gap: 3, alignItems: "center" },
  bar: { width: 22, height: 6, borderRadius: 2, borderWidth: 1 },
  barSmall: { width: 14, height: 4, borderRadius: 2, borderWidth: 1 },
  barFree: {
    backgroundColor: tokens.color.ink2,
    borderColor: tokens.color.ink2,
  },
  barFreeOnAccent: {
    backgroundColor: tokens.color.onAccent,
    borderColor: tokens.color.onAccent,
  },
  barBusy: { borderColor: tokens.color.faint },

  check: { width: 9, height: 15, transform: [{ rotate: "45deg" }] },
  checkArmBottom: {
    position: "absolute",
    left: 0,
    bottom: 0,
    width: 9,
    height: 2.5,
    borderRadius: 1,
    backgroundColor: tokens.color.onInk,
  },
  checkArmRight: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: 2.5,
    height: 15,
    borderRadius: 1,
    backgroundColor: tokens.color.onInk,
  },

  readout: {
    marginTop: tokens.space(4),
    minHeight: 164,
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(4),
    gap: tokens.space(2),
  },
  readoutKicker: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.2,
    color: tokens.color.faint,
  },
  readoutTitle: { fontSize: 18, fontWeight: "700", color: tokens.color.ink },
  readoutLine: {
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 19,
    color: tokens.color.ink2,
    fontVariant: ["tabular-nums"],
  },
  readoutHint: { fontSize: 12, lineHeight: 17, color: tokens.color.faint },
  readoutMessage: { fontSize: 13, lineHeight: 19, color: tokens.color.muted },
  readoutAlert: { fontSize: 15, fontWeight: "700", color: tokens.color.accent },

  statusList: { gap: tokens.space(1), marginTop: tokens.space(1) },
  statusRow: { flexDirection: "row", alignItems: "center", gap: tokens.space(2) },
  statusWho: { fontSize: 13, fontWeight: "600", color: tokens.color.ink },
  statusWord: { fontSize: 13, color: tokens.color.muted },
  statusWordFree: { fontWeight: "600", color: tokens.color.accent },

  primaryBtn: {
    marginTop: tokens.space(2),
    minHeight: 48,
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.color.accent,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: tokens.space(4),
    paddingVertical: tokens.space(3),
  },
  primaryBtnText: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.onAccent,
    textAlign: "center",
  },
  secondaryBtn: {
    minHeight: 44,
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: tokens.space(4),
    paddingVertical: tokens.space(2),
  },
  secondaryBtnText: { fontSize: 13, fontWeight: "600", color: tokens.color.ink2 },
});
