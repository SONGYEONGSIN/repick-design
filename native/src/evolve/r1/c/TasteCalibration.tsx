// native/src/evolve/r1/c/TasteCalibration.tsx — auto-native-r1 candidate c.
//
// Screen type: taste calibration. The other repick screens assume the system already knows
// the user; this one shows the system learning. One lot is in focus at a time, two explicit
// buttons record the judgment, and a pinned panel at the bottom of the screen re-states the
// inferred profile after every tap — readouts, meters, the evidence behind each belief, and
// one sentence naming which signal moved and why. The panel is populated from the signup
// seed before the first judgment, so the proof is a default, not a reward for interacting.
import { useState } from "react";
import { View, Text, Pressable, FlatList, StyleSheet } from "react-native";
import { DECK, formatWon, readCalibration, type Decision, type SignalRow } from "./data";
import { tokens } from "../../../tokens";

function deltaSpeech(delta: number): string {
  if (delta === 0) return "no recent change";
  return delta > 0 ? `up ${delta} points` : `down ${Math.abs(delta)} points`;
}

/** One inferred signal: belief, evidence, meter, and the change the last judgment caused. */
function SignalMeter({ row }: { row: SignalRow }) {
  const rising = row.delta > 0;
  return (
    <View
      style={styles.signal}
      accessible
      accessibilityLabel={`${row.label}: ${row.readout}. Strength ${row.strength} of 100, ${deltaSpeech(row.delta)}. ${row.hint}.`}
    >
      <View style={styles.signalTop}>
        <Text style={styles.signalLabel} numberOfLines={1}>
          {row.label}
        </Text>
        <Text style={styles.signalReadout} numberOfLines={1}>
          {row.readout}
        </Text>
        {row.delta !== 0 ? (
          <View style={[styles.deltaChip, rising ? styles.deltaChipUp : styles.deltaChipDown]}>
            {/* Sign carries the direction — the chip never relies on colour alone. */}
            <Text style={[styles.deltaChipText, rising ? styles.deltaChipTextUp : styles.deltaChipTextDown]}>
              {rising ? `+${row.delta}` : `-${Math.abs(row.delta)}`}
            </Text>
          </View>
        ) : null}
      </View>
      <View style={styles.meter}>
        <View style={[styles.meterFill, { flexGrow: row.strength }]} />
        <View style={[styles.meterRest, { flexGrow: 100 - row.strength }]} />
      </View>
      <Text style={styles.signalHint} numberOfLines={1}>
        {row.hint}
      </Text>
    </View>
  );
}

export function TasteCalibration() {
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [confirmReset, setConfirmReset] = useState(false);

  const state = readCalibration(decisions);
  const index = decisions.length;
  const remaining = DECK.length - index;
  const subject = index < DECK.length ? DECK[index] : null;
  const canUndo = index > 0;

  const judge = (decision: Decision) => {
    setConfirmReset(false);
    setDecisions((prev) => (prev.length >= DECK.length ? prev : [...prev, decision]));
  };
  const undo = () => {
    setConfirmReset(false);
    setDecisions((prev) => prev.slice(0, -1));
  };

  return (
    <View style={styles.root}>
      <View style={styles.column}>
        <Text style={styles.h1} accessibilityRole="header">
          Taste Calibration
        </Text>
        <Text style={styles.sub}>
          Judge one lot at a time. The profile pinned below rewrites itself after every choice.
        </Text>

        <View style={styles.progress}>
          <View
            style={styles.track}
            accessible
            accessibilityRole="progressbar"
            accessibilityLabel="Calibration progress"
            accessibilityValue={{ min: 0, max: DECK.length, now: index, text: `${index} of ${DECK.length} judged` }}
          >
            <View style={[styles.trackFill, { flexGrow: index }]} />
            <View style={[styles.trackRest, { flexGrow: remaining }]} />
          </View>
          <Text style={styles.progressText}>{`${index} / ${DECK.length}`}</Text>
        </View>

        {subject !== null ? (
          <View style={styles.card}>
            <View style={styles.cardHead}>
              <Text style={styles.brand}>{subject.brand}</Text>
              <View style={styles.gradePill}>
                <Text style={styles.gradePillText}>{`Grade ${subject.grade}`}</Text>
              </View>
            </View>
            <Text style={styles.cardTitle} numberOfLines={2}>
              {subject.title}
            </Text>
            <Text style={styles.cardPrice}>{formatWon(subject.price)}</Text>
            <Text style={styles.cardTraits} numberOfLines={1}>
              {subject.traits.join(" · ")}
            </Text>
            <Text style={styles.cardNote} numberOfLines={2}>
              {subject.gradeNote}
            </Text>
          </View>
        ) : (
          <View style={styles.card}>
            <Text style={styles.brand}>Calibration complete</Text>
            <Text style={styles.cardTitle}>
              {confirmReset ? "Discard all 8 judgments?" : `${DECK.length} of ${DECK.length} lots judged`}
            </Text>
            <Text style={styles.doneBody}>
              {confirmReset ? "The profile below falls back to your signup answers." : state.summary}
            </Text>
          </View>
        )}

        {subject !== null ? (
          <View style={styles.actions}>
            <Pressable
              onPress={() => judge("pass")}
              style={({ pressed }) => [styles.btn, styles.btnGhost, pressed && styles.btnGhostPressed]}
              accessibilityRole="button"
              accessibilityLabel={`Not for me: ${subject.title}`}
            >
              <Text style={styles.btnGhostText}>Not for me</Text>
            </Pressable>
            <Pressable
              onPress={() => judge("fit")}
              style={({ pressed }) => [styles.btn, styles.btnSolid, pressed && styles.btnSolidPressed]}
              accessibilityRole="button"
              accessibilityLabel={`Fits me: ${subject.title}`}
            >
              <Text style={styles.btnSolidText}>Fits me</Text>
            </Pressable>
          </View>
        ) : confirmReset ? (
          <View style={styles.actions}>
            <Pressable
              onPress={() => setConfirmReset(false)}
              style={({ pressed }) => [styles.btn, styles.btnSolid, pressed && styles.btnSolidPressed]}
              accessibilityRole="button"
              accessibilityLabel="Keep my results"
            >
              <Text style={styles.btnSolidText}>Keep results</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                setConfirmReset(false);
                setDecisions([]);
              }}
              style={({ pressed }) => [styles.btn, styles.btnGhost, pressed && styles.btnGhostPressed]}
              accessibilityRole="button"
              accessibilityLabel="Discard all judgments and start over"
            >
              <Text style={styles.btnGhostText}>Discard</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.actions}>
            <Pressable
              onPress={() => setConfirmReset(true)}
              style={({ pressed }) => [styles.btn, styles.btnGhost, pressed && styles.btnGhostPressed]}
              accessibilityRole="button"
              accessibilityLabel="Start the calibration over"
            >
              <Text style={styles.btnGhostText}>Start over</Text>
            </Pressable>
          </View>
        )}

        {/* Pinned proof panel — always on screen, at every step, including step zero. */}
        <View style={styles.panel}>
          <View style={styles.panelHead}>
            <Text style={styles.panelTitle} accessibilityRole="header">
              Inferred taste profile
            </Text>
            <Pressable
              onPress={undo}
              disabled={!canUndo}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={({ pressed }) => [
                styles.undoBtn,
                !canUndo && styles.undoBtnOff,
                canUndo && pressed && styles.undoBtnPressed,
              ]}
              accessibilityRole="button"
              accessibilityState={{ disabled: !canUndo }}
              accessibilityLabel={canUndo ? `Undo the judgment on ${state.lastPick}` : "Undo, nothing judged yet"}
            >
              <Text style={[styles.undoText, !canUndo && styles.undoTextOff]}>Undo</Text>
            </Pressable>
          </View>
          <Text style={styles.panelMeta}>{`Rebuilt from ${index} of ${DECK.length} judgments`}</Text>

          <View style={styles.signalWrap}>
            <FlatList
              data={state.rows}
              keyExtractor={(row) => row.key}
              renderItem={({ item }) => <SignalMeter row={item} />}
              contentContainerStyle={styles.signalList}
              scrollEnabled={false}
            />
          </View>

          <View style={styles.noteBlock}>
            <Text style={styles.noteCaption} numberOfLines={1}>
              {state.caption}
            </Text>
            <Text style={styles.noteText} accessibilityLiveRegion="polite">
              {state.note}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: tokens.color.bg, alignItems: "center" },
  // Phone-width reading column: identical to the other screens on a handset, and it keeps
  // the layout a mobile screen instead of a stretched sheet on a wide preview surface.
  column: {
    flex: 1,
    width: "100%",
    maxWidth: 480,
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(14),
  },

  h1: { fontSize: 28, fontWeight: "800", color: tokens.color.ink, letterSpacing: -0.5 },
  sub: { marginTop: 6, fontSize: 13, color: tokens.color.faint, lineHeight: 19 },

  // Progress: proportional fill built from flex ratios (no percentage strings, no animation).
  progress: { marginTop: tokens.space(4), flexDirection: "row", alignItems: "center", gap: tokens.space(3) },
  track: {
    flex: 1,
    flexDirection: "row",
    height: 6,
    borderRadius: tokens.radius.sm,
    overflow: "hidden",
    backgroundColor: tokens.color.border,
  },
  trackFill: { flexBasis: 0, backgroundColor: tokens.color.accent },
  trackRest: { flexBasis: 0, backgroundColor: tokens.color.border },
  progressText: { fontSize: 12, fontWeight: "700", color: tokens.color.muted, fontVariant: ["tabular-nums"] },

  // Single lot in focus — the judgment subject, not a list row.
  card: {
    marginTop: tokens.space(4),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(4),
    backgroundColor: tokens.color.bg,
  },
  cardHead: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: tokens.space(2) },
  brand: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: tokens.color.faint,
  },
  gradePill: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.sm,
    paddingHorizontal: tokens.space(2),
    paddingVertical: 2,
  },
  gradePillText: { fontSize: 11, fontWeight: "700", color: tokens.color.ink2 },
  cardTitle: { marginTop: 10, fontSize: 18, fontWeight: "700", color: tokens.color.ink, lineHeight: 24, letterSpacing: -0.2 },
  cardPrice: {
    marginTop: 8,
    fontSize: 24,
    fontWeight: "800",
    color: tokens.color.ink,
    letterSpacing: -0.5,
    fontVariant: ["tabular-nums"],
  },
  cardTraits: { marginTop: 8, fontSize: 13, color: tokens.color.muted },
  cardNote: { marginTop: 4, fontSize: 13, color: tokens.color.faint, lineHeight: 18 },
  doneBody: { marginTop: 8, fontSize: 14, color: tokens.color.ink2, lineHeight: 20 },

  // Explicit buttons only — nothing on this screen is reachable by gesture alone.
  actions: { marginTop: tokens.space(3), flexDirection: "row", gap: tokens.space(3) },
  btn: {
    flex: 1,
    minHeight: 52,
    borderRadius: tokens.radius.md,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: tokens.space(4),
  },
  btnSolid: { backgroundColor: tokens.color.accent },
  btnSolidPressed: { opacity: 0.84 },
  btnSolidText: { fontSize: 15, fontWeight: "700", color: tokens.color.onAccent },
  btnGhost: { borderWidth: 1, borderColor: tokens.color.border, backgroundColor: tokens.color.bg },
  btnGhostPressed: { borderColor: tokens.color.ink2 },
  btnGhostText: { fontSize: 15, fontWeight: "700", color: tokens.color.ink2 },

  // Proof panel: full-bleed within the column, separated by a hairline. Deliberately flows
  // right under the actions instead of pinning to the bottom — it has to stay inside the
  // first screenful at every viewport height, since it is the evidence the screen exists for.
  panel: {
    marginTop: tokens.space(5),
    marginHorizontal: -tokens.space(5),
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(4),
    paddingBottom: tokens.space(5),
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
  },
  panelHead: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: tokens.space(3) },
  panelTitle: {
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    color: tokens.color.ink2,
  },
  undoBtn: {
    minHeight: 36,
    justifyContent: "center",
    paddingHorizontal: tokens.space(3),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.sm,
  },
  undoBtnPressed: { borderColor: tokens.color.ink2 },
  undoBtnOff: { opacity: 0.45 },
  undoText: { fontSize: 13, fontWeight: "700", color: tokens.color.ink2 },
  undoTextOff: { color: tokens.color.faint },
  panelMeta: { marginTop: 6, fontSize: 12, color: tokens.color.faint, fontVariant: ["tabular-nums"] },

  signalWrap: { marginTop: tokens.space(3) },
  signalList: { gap: tokens.space(3) },
  signal: { gap: 6 },
  signalTop: { flexDirection: "row", alignItems: "center", gap: tokens.space(2) },
  signalLabel: { flex: 1, fontSize: 13, color: tokens.color.muted },
  signalReadout: { flexShrink: 1, fontSize: 15, fontWeight: "700", color: tokens.color.ink },
  deltaChip: { borderRadius: tokens.radius.sm, paddingHorizontal: 6, paddingVertical: 2 },
  deltaChipUp: { backgroundColor: tokens.color.accent },
  deltaChipDown: { borderWidth: 1, borderColor: tokens.color.border, backgroundColor: tokens.color.bg },
  deltaChipText: { fontSize: 11, fontWeight: "800", fontVariant: ["tabular-nums"] },
  deltaChipTextUp: { color: tokens.color.onAccent },
  deltaChipTextDown: { color: tokens.color.ink2 },
  meter: {
    flexDirection: "row",
    height: 6,
    borderRadius: tokens.radius.sm,
    overflow: "hidden",
    backgroundColor: tokens.color.border,
  },
  meterFill: { flexBasis: 0, backgroundColor: tokens.color.accent },
  meterRest: { flexBasis: 0, backgroundColor: tokens.color.border },
  signalHint: { fontSize: 12, color: tokens.color.faint },

  noteBlock: {
    marginTop: tokens.space(4),
    borderLeftWidth: 2,
    borderLeftColor: tokens.color.accent,
    paddingLeft: tokens.space(3),
  },
  noteCaption: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    color: tokens.color.faint,
  },
  noteText: { marginTop: 4, fontSize: 14, color: tokens.color.ink2, lineHeight: 20 },
});
