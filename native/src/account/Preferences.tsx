// native/src/account/Preferences.tsx — auto-native-r2 candidate c.
// A configuration screen, not a browse/detail/negotiation screen: the primary interaction is
// adjusting persistent preferences (toggles, a segmented choice, two live-adjustable numeric
// thresholds) grouped under an identity summary. Every row applies live — there is no deferred,
// full-width bottom "Save" bar (that would recreate round 1's banned 3-band silhouette). The
// whole screen is a single continuous SectionList: identity card and every group scroll together,
// nothing is pinned above or below the content.
import { useState } from "react";
import { View, Text, Pressable, SectionList, SafeAreaView, StyleSheet } from "react-native";
import {
  PROFILE,
  SECTIONS,
  clampStep,
  formatStepperValue,
  initialSettingsState,
  trackFillPct,
  type ActionRow,
  type DisplayRow,
  type SegmentedRow,
  type SettingRow,
  type SettingSection,
  type SettingsState,
  type StepperRow,
  type ToggleRow,
} from "./data";
import { tokens } from "../tokens";

const HIT_SLOP = { top: 10, bottom: 10, left: 10, right: 10 };

/* ───────── identity summary (scrolls with the content — not pinned) ───────── */

function ProfileCard() {
  const spoken = `${PROFILE.name}, ${PROFILE.handle}. ${PROFILE.memberSince}. ${PROFILE.savedCount} saved items, ${PROFILE.activeWatchCount} active price watches.`;
  return (
    <View style={styles.profileCard} accessible accessibilityLabel={spoken}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{PROFILE.initials}</Text>
      </View>
      <View style={styles.profileInfo}>
        <Text style={styles.profileName}>{PROFILE.name}</Text>
        <Text style={styles.profileHandle}>{PROFILE.handle}</Text>
        <Text style={styles.profileMeta}>{PROFILE.memberSince}</Text>
      </View>
      <View style={styles.statCol}>
        <View style={styles.statBlock}>
          <Text style={styles.statValue}>{PROFILE.savedCount}</Text>
          <Text style={styles.statLabel}>Saved</Text>
        </View>
        <View style={styles.statBlock}>
          <Text style={styles.statValue}>{PROFILE.activeWatchCount}</Text>
          <Text style={styles.statLabel}>Watching</Text>
        </View>
      </View>
    </View>
  );
}

function ScreenHeader() {
  return (
    <View style={styles.header}>
      <Text style={styles.h1} accessibilityRole="header">
        Account & Preferences
      </Text>
      <Text style={styles.sub}>Changes apply immediately — nothing here waits for a save button.</Text>
      <ProfileCard />
    </View>
  );
}

/* ───────── applied tag (inline per-row confirmation, not a bottom save bar) ───────── */

function AppliedTag({ text }: { text: string }) {
  return (
    <Text style={styles.appliedTag} accessibilityLabel={`${text}, applied`}>
      {text}
    </Text>
  );
}

/* ───────── row kinds ───────── */

function ToggleRowView({
  row,
  value,
  touched,
  onChange,
}: {
  row: ToggleRow;
  value: boolean;
  touched: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.rowText}>
        <Text style={styles.rowLabel}>{row.label}</Text>
        <Text style={styles.rowDesc}>{row.description}</Text>
        {touched && <AppliedTag text="Applied" />}
      </View>
      <Pressable
        onPress={() => onChange(!value)}
        accessibilityRole="switch"
        accessibilityState={{ checked: value }}
        accessibilityLabel={`${row.label}, ${row.description}`}
        hitSlop={HIT_SLOP}
        style={[styles.track, value ? styles.trackOn : styles.trackOff]}
      >
        <View style={[styles.thumb, value ? styles.thumbOn : styles.thumbOff]} />
      </Pressable>
    </View>
  );
}

function SegmentedRowView({
  row,
  value,
  touched,
  onChange,
}: {
  row: SegmentedRow;
  value: number;
  touched: boolean;
  onChange: (next: number) => void;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.rowText}>
        <Text style={styles.rowLabel}>{row.label}</Text>
        <Text style={styles.rowDesc}>{row.description}</Text>
        {touched && <AppliedTag text="Applied" />}
      </View>
      <View style={styles.segmentGroup} accessibilityRole="radiogroup" accessibilityLabel={row.label}>
        {row.options.map((option, i) => {
          const selected = i === value;
          return (
            <Pressable
              key={option}
              onPress={() => onChange(i)}
              accessibilityRole="radio"
              accessibilityState={{ selected, checked: selected }}
              accessibilityLabel={option}
              hitSlop={HIT_SLOP}
              style={({ pressed }) => [
                styles.segmentOption,
                selected && styles.segmentOptionOn,
                pressed && styles.pressed,
              ]}
            >
              <Text style={[styles.segmentLabel, selected && styles.segmentLabelOn]}>{option}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

// The differentiating centerpiece: a live-adjustable numeric threshold whose current value is
// visible by default (not hidden behind a tap) and updates in place as it is stepped.
function StepperRowView({
  row,
  value,
  touched,
  onChange,
}: {
  row: StepperRow;
  value: number;
  touched: boolean;
  onChange: (next: number) => void;
}) {
  const atMin = value <= row.min;
  const atMax = value >= row.max;
  const display = formatStepperValue(row, value);
  const fillPct = trackFillPct(value, row);
  return (
    <View style={styles.rowStack}>
      <View style={styles.stepperHead}>
        <Text style={styles.rowLabel}>{row.label}</Text>
        <Text style={styles.stepperValue} accessibilityLiveRegion="polite">
          {display}
        </Text>
      </View>
      <Text style={styles.rowDesc}>{row.description}</Text>
      <View style={styles.trackOuter}>
        <View style={[styles.trackFill, { width: `${fillPct}%` }]} />
      </View>
      <View style={styles.stepperControls}>
        <Pressable
          onPress={() => onChange(clampStep(value - row.step, row))}
          disabled={atMin}
          accessibilityRole="button"
          accessibilityLabel={`Decrease ${row.label} by ${row.unit === "%" ? `${row.step}%` : formatStepperValue(row, row.step)}`}
          accessibilityState={{ disabled: atMin }}
          hitSlop={HIT_SLOP}
          style={({ pressed }) => [styles.step, atMin && styles.stepDisabled, pressed && !atMin && styles.pressed]}
        >
          <Text style={styles.stepGlyph}>−</Text>
        </Pressable>
        <Text style={styles.stepperRange}>
          {row.unit === "%" ? `${row.min}%` : formatStepperValue(row, row.min)} – {row.unit === "%" ? `${row.max}%` : formatStepperValue(row, row.max)}
        </Text>
        <Pressable
          onPress={() => onChange(clampStep(value + row.step, row))}
          disabled={atMax}
          accessibilityRole="button"
          accessibilityLabel={`Increase ${row.label} by ${row.unit === "%" ? `${row.step}%` : formatStepperValue(row, row.step)}`}
          accessibilityState={{ disabled: atMax }}
          hitSlop={HIT_SLOP}
          style={({ pressed }) => [styles.step, atMax && styles.stepDisabled, pressed && !atMax && styles.pressed]}
        >
          <Text style={styles.stepGlyph}>+</Text>
        </Pressable>
      </View>
      {touched && <AppliedTag text="Updated" />}
    </View>
  );
}

function DisplayRowView({ row }: { row: DisplayRow }) {
  return (
    <View style={styles.row} accessible accessibilityLabel={`${row.label}, ${row.value}`}>
      <Text style={styles.rowLabel}>{row.label}</Text>
      <Text style={styles.displayValue}>{row.value}</Text>
    </View>
  );
}

// Destructive action gets a two-tap confirm inline in the row itself (consistent with the
// catalog's "confirm before destructive actions" rule) and settles into a terminal state — no
// dead end, the screen explains what happened and why nothing else can be tapped.
function SignOutRowView({
  row,
  stage,
  onRequestConfirm,
  onCancel,
  onConfirm,
}: {
  row: ActionRow;
  stage: "idle" | "confirm" | "done";
  onRequestConfirm: () => void;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  if (stage === "done") {
    return (
      <View style={styles.rowStack} accessible accessibilityLabel="Signed out of this device. Open the app again to sign in.">
        <Text style={styles.rowLabelMuted}>Signed out</Text>
        <Text style={styles.rowDesc}>Open the app again to sign in.</Text>
      </View>
    );
  }
  if (stage === "confirm") {
    return (
      <View style={styles.rowStack}>
        <Text style={styles.rowLabel}>Sign out of this device?</Text>
        <Text style={styles.rowDesc}>{row.description}</Text>
        <View style={styles.confirmRow}>
          <Pressable
            onPress={onConfirm}
            accessibilityRole="button"
            accessibilityLabel="Confirm sign out"
            hitSlop={HIT_SLOP}
            style={({ pressed }) => [styles.confirmBtn, styles.confirmBtnStrong, pressed && styles.pressed]}
          >
            <Text style={styles.confirmBtnLabelOn}>Confirm sign out</Text>
          </Pressable>
          <Pressable
            onPress={onCancel}
            accessibilityRole="button"
            accessibilityLabel="Cancel"
            hitSlop={HIT_SLOP}
            style={({ pressed }) => [styles.confirmBtn, styles.confirmBtnGhost, pressed && styles.pressed]}
          >
            <Text style={styles.confirmBtnLabelGhost}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    );
  }
  return (
    <Pressable
      onPress={onRequestConfirm}
      accessibilityRole="button"
      accessibilityLabel={`${row.label}. ${row.description}`}
      style={({ pressed }) => [styles.rowStack, pressed && styles.pressed]}
    >
      <Text style={styles.rowLabelDestructive}>{row.label}</Text>
      <Text style={styles.rowDesc}>{row.description}</Text>
    </Pressable>
  );
}

/* ───────── section chrome ───────── */

function SectionHeaderView({ title }: { title: string }) {
  return (
    <Text style={styles.sectionTitle} accessibilityRole="header">
      {title}
    </Text>
  );
}

function SectionFooterView({ footer }: { footer: string }) {
  return <Text style={styles.sectionFooter}>{footer}</Text>;
}

/* ───────── screen ───────── */

export function Preferences() {
  const [values, setValues] = useState<SettingsState>(() => initialSettingsState());
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [signOutStage, setSignOutStage] = useState<"idle" | "confirm" | "done">("idle");

  const setValue = (id: string, next: boolean | number) => {
    setValues((prev) => ({ ...prev, [id]: next }));
    setTouched((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <SafeAreaView style={styles.root}>
      <SectionList<SettingRow, SettingSection>
        sections={SECTIONS}
        keyExtractor={(row) => row.id}
        stickySectionHeadersEnabled={false}
        ListHeaderComponent={ScreenHeader}
        renderSectionHeader={({ section }) => <SectionHeaderView title={section.title} />}
        renderSectionFooter={({ section }) => <SectionFooterView footer={section.footer} />}
        renderItem={({ item, index, section }) => (
          <View
            style={[
              styles.rowWrap,
              index > 0 && styles.rowDivider,
              index === 0 && styles.rowFirst,
              index === section.data.length - 1 && styles.rowLast,
            ]}
          >
            {item.kind === "toggle" && (
              <ToggleRowView
                row={item}
                value={!!values[item.id]}
                touched={!!touched[item.id]}
                onChange={(next) => setValue(item.id, next)}
              />
            )}
            {item.kind === "segmented" && (
              <SegmentedRowView
                row={item}
                value={typeof values[item.id] === "number" ? (values[item.id] as number) : item.initial}
                touched={!!touched[item.id]}
                onChange={(next) => setValue(item.id, next)}
              />
            )}
            {item.kind === "stepper" && (
              <StepperRowView
                row={item}
                value={typeof values[item.id] === "number" ? (values[item.id] as number) : item.initial}
                touched={!!touched[item.id]}
                onChange={(next) => setValue(item.id, next)}
              />
            )}
            {item.kind === "display" && <DisplayRowView row={item} />}
            {item.kind === "action" && (
              <SignOutRowView
                row={item}
                stage={signOutStage}
                onRequestConfirm={() => setSignOutStage("confirm")}
                onCancel={() => setSignOutStage("idle")}
                onConfirm={() => setSignOutStage("done")}
              />
            )}
          </View>
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: tokens.color.bg },
  list: { paddingHorizontal: tokens.space(5), paddingBottom: tokens.space(10) },

  /* header + identity card — scrolls with everything else, nothing pinned */
  header: { paddingTop: tokens.space(10), paddingBottom: tokens.space(2) },
  h1: { fontSize: 28, fontWeight: "800", color: tokens.color.ink, letterSpacing: -0.5 },
  sub: { marginTop: 6, fontSize: 13, color: tokens.color.faint, lineHeight: 18 },

  profileCard: {
    marginTop: tokens.space(4),
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.space(3),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(4),
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.color.ink2,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: 16, fontWeight: "800", color: tokens.color.onAccent },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 16, fontWeight: "700", color: tokens.color.ink },
  profileHandle: { marginTop: 2, fontSize: 13, color: tokens.color.muted },
  profileMeta: { marginTop: 2, fontSize: 12, color: tokens.color.faint },
  statCol: { flexDirection: "row", gap: tokens.space(3) },
  statBlock: { alignItems: "center", minWidth: 44 },
  statValue: { fontSize: 17, fontWeight: "800", color: tokens.color.ink, fontVariant: ["tabular-nums"] },
  statLabel: { marginTop: 1, fontSize: 10, color: tokens.color.faint },

  /* section chrome */
  sectionTitle: {
    marginTop: tokens.space(6),
    marginBottom: tokens.space(2),
    fontSize: 12,
    fontWeight: "700",
    color: tokens.color.muted,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  sectionFooter: { marginTop: tokens.space(2), fontSize: 12, color: tokens.color.faint, lineHeight: 16 },

  /* grouped row card */
  rowWrap: {
    backgroundColor: tokens.color.bg,
    borderWidth: 1,
    borderColor: tokens.color.border,
    paddingHorizontal: tokens.space(4),
    paddingVertical: tokens.space(3),
  },
  rowDivider: { borderTopWidth: 0, marginTop: -1 },
  rowFirst: { borderTopLeftRadius: tokens.radius.md, borderTopRightRadius: tokens.radius.md },
  rowLast: { borderBottomLeftRadius: tokens.radius.md, borderBottomRightRadius: tokens.radius.md },

  row: { gap: 4, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  rowStack: { gap: 4, width: "100%" },
  rowText: { flex: 1, gap: 2, paddingRight: tokens.space(3) },
  rowLabel: { fontSize: 15, fontWeight: "600", color: tokens.color.ink2 },
  rowLabelMuted: { fontSize: 15, fontWeight: "600", color: tokens.color.faint },
  rowLabelDestructive: { fontSize: 15, fontWeight: "700", color: tokens.color.ink },
  rowDesc: { fontSize: 12, color: tokens.color.faint, lineHeight: 16 },
  displayValue: { fontSize: 14, color: tokens.color.muted, fontVariant: ["tabular-nums"] },

  appliedTag: { marginTop: 2, fontSize: 11, fontWeight: "700", color: tokens.color.accent },

  /* toggle switch — track (radius.md → pill) + thumb (radius.sm → circle), token radii only */
  track: {
    width: 40,
    height: 24,
    borderRadius: tokens.radius.md,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: tokens.space(1),
  },
  trackOn: { backgroundColor: tokens.color.accent, justifyContent: "flex-end" },
  trackOff: {
    backgroundColor: tokens.color.bg,
    borderWidth: 1,
    borderColor: tokens.color.border,
    justifyContent: "flex-start",
  },
  thumb: { width: 12, height: 12, borderRadius: tokens.radius.sm },
  thumbOn: { backgroundColor: tokens.color.onAccent },
  thumbOff: { backgroundColor: tokens.color.faint },

  /* segmented control */
  segmentGroup: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: 2,
    gap: 2,
  },
  segmentOption: {
    minHeight: 32,
    paddingHorizontal: tokens.space(2),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: tokens.radius.sm,
  },
  segmentOptionOn: { backgroundColor: tokens.color.accent },
  segmentLabel: { fontSize: 12, fontWeight: "700", color: tokens.color.muted },
  segmentLabelOn: { color: tokens.color.onAccent },

  /* stepper — the live-adjustable threshold rows */
  stepperHead: { flexDirection: "row", alignItems: "baseline", justifyContent: "space-between", width: "100%" },
  stepperValue: { fontSize: 18, fontWeight: "800", color: tokens.color.ink, fontVariant: ["tabular-nums"] },
  trackOuter: {
    marginTop: tokens.space(2),
    width: "100%",
    height: 4,
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.border,
    overflow: "hidden",
  },
  trackFill: { height: 4, borderRadius: tokens.radius.sm, backgroundColor: tokens.color.accent },
  stepperControls: {
    marginTop: tokens.space(3),
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  step: {
    width: 44,
    height: 44,
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
  },
  stepDisabled: { opacity: 0.4 },
  stepGlyph: { fontSize: 20, fontWeight: "700", color: tokens.color.ink2, lineHeight: 22 },
  stepperRange: { fontSize: 11, color: tokens.color.faint, fontVariant: ["tabular-nums"] },

  /* sign-out inline confirm */
  confirmRow: { marginTop: tokens.space(2), flexDirection: "row", gap: tokens.space(2), width: "100%" },
  confirmBtn: {
    flexGrow: 1,
    flexBasis: 0,
    minHeight: 44,
    borderRadius: tokens.radius.md,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: tokens.space(2),
  },
  confirmBtnStrong: { backgroundColor: tokens.color.ink2 },
  confirmBtnGhost: { borderWidth: 1, borderColor: tokens.color.border, backgroundColor: tokens.color.bg },
  confirmBtnLabelOn: { fontSize: 13, fontWeight: "700", color: tokens.color.onAccent },
  confirmBtnLabelGhost: { fontSize: 13, fontWeight: "700", color: tokens.color.ink2 },

  pressed: { opacity: 0.85 },
});
