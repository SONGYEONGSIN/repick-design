// native/src/evolve/r56/b/PriceDropAlertSettingsScreen.tsx
//
// Price drop alert settings — a plain settings form (no list, no FlatList):
// a threshold rule (percent-off or dollar-off, adjusted with a stepper), a
// set of notification-channel switches, and a quiet-hours window built from
// two rows of fixed time chips.
//
// Band mechanic: the bottom save band is derived, every render, from
// comparing the working draft against the last-saved baseline
// (`draftMatchesBaseline`). Equal → the band is not in the tree at all.
// Different → it appears with a Save action, or, if the draft isn't
// savable yet (no channel picked), with an explanation instead of a
// button. After a successful save the baseline is set to the draft, which
// makes the band fall out of the "dirty" branch on its own; a short "saved"
// confirmation holds that spot until the next edit replaces it — no timer
// drives any of this, it is all recomputed from state.
import React, { useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
} from "react-native";
import { tokens } from "../../../tokens";
import {
  CHANNEL_DEFINITIONS,
  INITIAL_ALERT_PREFERENCES,
  LAST_SAVED_AT_LABEL,
  QUIET_HOURS_END_OPTIONS,
  QUIET_HOURS_START_OPTIONS,
  THRESHOLD_MODE_RULES,
  clampThresholdValue,
  draftIsSavable,
  draftMatchesBaseline,
  type AlertPreferencesDraft,
  type DropThresholdMode,
} from "./data";

const SAVED_CONFIRMATION_TEXT = "Alert settings saved.";
const BLOCKED_EXPLANATION_TEXT =
  "Turn on at least one notification channel below before saving.";

export function PriceDropAlertSettingsScreen() {
  const [draft, setDraft] = useState<AlertPreferencesDraft>(INITIAL_ALERT_PREFERENCES);
  const [savedBaseline, setSavedBaseline] = useState<AlertPreferencesDraft>(
    INITIAL_ALERT_PREFERENCES
  );
  // Armed right after a save, cleared by the very next edit. There is no
  // timer anywhere in this file — this flag is just more state, and the
  // band's branch is recomputed from it and from `isDirty` every render.
  const [justSaved, setJustSaved] = useState(false);

  const isDirty = !draftMatchesBaseline(draft, savedBaseline);
  const isSavable = draftIsSavable(draft);

  const applyEdit = useCallback((updater: (prev: AlertPreferencesDraft) => AlertPreferencesDraft) => {
    setJustSaved(false);
    setDraft(updater);
  }, []);

  const setThresholdMode = useCallback(
    (mode: DropThresholdMode) => {
      applyEdit((prev) => ({
        ...prev,
        threshold: { mode, value: clampThresholdValue(mode, prev.threshold.value) },
      }));
    },
    [applyEdit]
  );

  const stepThreshold = useCallback(
    (direction: 1 | -1) => {
      applyEdit((prev) => {
        const rule = THRESHOLD_MODE_RULES[prev.threshold.mode];
        const next = clampThresholdValue(prev.threshold.mode, prev.threshold.value + direction * rule.step);
        return { ...prev, threshold: { ...prev.threshold, value: next } };
      });
    },
    [applyEdit]
  );

  const toggleChannel = useCallback(
    (key: "push" | "email" | "inApp", next: boolean) => {
      applyEdit((prev) => ({ ...prev, channels: { ...prev.channels, [key]: next } }));
    },
    [applyEdit]
  );

  const toggleQuietHours = useCallback(
    (next: boolean) => {
      applyEdit((prev) => ({ ...prev, quietHours: { ...prev.quietHours, enabled: next } }));
    },
    [applyEdit]
  );

  const setQuietHoursStart = useCallback(
    (startLabel: string) => {
      applyEdit((prev) => ({ ...prev, quietHours: { ...prev.quietHours, startLabel } }));
    },
    [applyEdit]
  );

  const setQuietHoursEnd = useCallback(
    (endLabel: string) => {
      applyEdit((prev) => ({ ...prev, quietHours: { ...prev.quietHours, endLabel } }));
    },
    [applyEdit]
  );

  const revertToSaved = useCallback(() => {
    setJustSaved(false);
    setDraft(savedBaseline);
  }, [savedBaseline]);

  const handleSave = useCallback(() => {
    if (!isSavable) return;
    setSavedBaseline(draft);
    setJustSaved(true);
  }, [draft, isSavable]);

  const rule = THRESHOLD_MODE_RULES[draft.threshold.mode];
  const thresholdReadout = useMemo(() => rule.format(draft.threshold.value), [rule, draft.threshold.value]);
  const atMin = draft.threshold.value <= rule.min;
  const atMax = draft.threshold.value >= rule.max;

  const bandMode: "dirty-blocked" | "dirty-ready" | "confirmation" | "none" = isDirty
    ? isSavable
      ? "dirty-ready"
      : "dirty-blocked"
    : justSaved
    ? "confirmation"
    : "none";

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, bandMode !== "none" && styles.scrollContentPad]}
      >
        <Text accessibilityRole="header" style={styles.title}>
          Price drop alerts
        </Text>
        <Text style={styles.subtitle}>
          Choose how big a price drop has to be before we tell you about it, where we tell
          you, and when we should hold off.
        </Text>
        <Text style={styles.lastSavedLabel}>{LAST_SAVED_AT_LABEL}</Text>

        <View style={styles.section}>
          <Text accessibilityRole="header" style={styles.sectionLabel}>
            Notify me when the price drops by at least
          </Text>

          <View style={styles.modeRow}>
            {(Object.keys(THRESHOLD_MODE_RULES) as DropThresholdMode[]).map((mode) => {
              const selected = draft.threshold.mode === mode;
              return (
                <Pressable
                  key={mode}
                  onPress={() => setThresholdMode(mode)}
                  accessibilityRole="radio"
                  accessibilityState={{ selected }}
                  accessibilityLabel={THRESHOLD_MODE_RULES[mode].title}
                  style={({ pressed }) => [
                    styles.modeChip,
                    selected && styles.modeChipSelected,
                    pressed && styles.rowPressed,
                  ]}
                >
                  <Text style={[styles.modeChipText, selected && styles.modeChipTextSelected]}>
                    {THRESHOLD_MODE_RULES[mode].title}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.stepperRow}>
            <Pressable
              onPress={() => stepThreshold(-1)}
              disabled={atMin}
              accessibilityRole="button"
              accessibilityLabel="Decrease threshold"
              accessibilityState={{ disabled: atMin }}
              accessibilityHint="Lowers the price-drop threshold by one step"
              style={({ pressed }) => [
                styles.stepperButton,
                atMin && styles.stepperButtonDisabled,
                pressed && !atMin && styles.rowPressed,
              ]}
            >
              <Text style={[styles.stepperButtonText, atMin && styles.stepperButtonTextDisabled]}>
                {"−"}
              </Text>
            </Pressable>
            <Text style={styles.thresholdReadout}>{thresholdReadout}</Text>
            <Pressable
              onPress={() => stepThreshold(1)}
              disabled={atMax}
              accessibilityRole="button"
              accessibilityLabel="Increase threshold"
              accessibilityState={{ disabled: atMax }}
              accessibilityHint="Raises the price-drop threshold by one step"
              style={({ pressed }) => [
                styles.stepperButton,
                atMax && styles.stepperButtonDisabled,
                pressed && !atMax && styles.rowPressed,
              ]}
            >
              <Text style={[styles.stepperButtonText, atMax && styles.stepperButtonTextDisabled]}>
                {"+"}
              </Text>
            </Pressable>
          </View>
          <Text style={styles.rowHint}>
            Range: {rule.format(rule.min)} to {rule.format(rule.max)}.
          </Text>
        </View>

        <View style={styles.section}>
          <Text accessibilityRole="header" style={styles.sectionLabel}>
            Where to notify me
          </Text>
          {CHANNEL_DEFINITIONS.map((channel, index) => (
            <View
              key={channel.key}
              style={[styles.channelRow, index === CHANNEL_DEFINITIONS.length - 1 && styles.channelRowLast]}
            >
              <View style={styles.channelTextWrap}>
                <Text style={styles.rowLabel}>{channel.label}</Text>
                <Text style={styles.rowHint}>{channel.hint}</Text>
              </View>
              <Switch
                value={draft.channels[channel.key]}
                onValueChange={(next) => toggleChannel(channel.key, next)}
                accessibilityRole="switch"
                accessibilityLabel={channel.label}
                accessibilityState={{ checked: draft.channels[channel.key] }}
                trackColor={{ false: tokens.color.border, true: tokens.color.accent }}
                thumbColor={tokens.color.bg}
              />
            </View>
          ))}
        </View>

        <View style={[styles.section, styles.sectionLast]}>
          <View style={styles.toggleRow}>
            <View style={styles.channelTextWrap}>
              <Text accessibilityRole="header" style={styles.sectionLabel}>
                Quiet hours
              </Text>
              <Text style={styles.rowHint}>
                Pause alerts overnight — they still arrive once quiet hours end.
              </Text>
            </View>
            <Switch
              value={draft.quietHours.enabled}
              onValueChange={toggleQuietHours}
              accessibilityRole="switch"
              accessibilityLabel="Enable quiet hours"
              accessibilityState={{ checked: draft.quietHours.enabled }}
              trackColor={{ false: tokens.color.border, true: tokens.color.accent }}
              thumbColor={tokens.color.bg}
            />
          </View>

          <Text style={styles.quietHoursSubLabel}>Starts at</Text>
          <View style={styles.chipRow}>
            {QUIET_HOURS_START_OPTIONS.map((label) => {
              const selected = draft.quietHours.startLabel === label;
              return (
                <Pressable
                  key={label}
                  onPress={() => setQuietHoursStart(label)}
                  disabled={!draft.quietHours.enabled}
                  accessibilityRole="radio"
                  accessibilityState={{ selected, disabled: !draft.quietHours.enabled }}
                  accessibilityLabel={`Quiet hours start at ${label}`}
                  style={({ pressed }) => [
                    styles.timeChip,
                    selected && styles.timeChipSelected,
                    !draft.quietHours.enabled && styles.timeChipDisabled,
                    pressed && draft.quietHours.enabled && styles.rowPressed,
                  ]}
                >
                  <Text
                    style={[
                      styles.timeChipText,
                      selected && styles.timeChipTextSelected,
                      !draft.quietHours.enabled && styles.timeChipTextDisabled,
                    ]}
                  >
                    {label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.quietHoursSubLabel}>Ends at</Text>
          <View style={styles.chipRow}>
            {QUIET_HOURS_END_OPTIONS.map((label) => {
              const selected = draft.quietHours.endLabel === label;
              return (
                <Pressable
                  key={label}
                  onPress={() => setQuietHoursEnd(label)}
                  disabled={!draft.quietHours.enabled}
                  accessibilityRole="radio"
                  accessibilityState={{ selected, disabled: !draft.quietHours.enabled }}
                  accessibilityLabel={`Quiet hours end at ${label}`}
                  style={({ pressed }) => [
                    styles.timeChip,
                    selected && styles.timeChipSelected,
                    !draft.quietHours.enabled && styles.timeChipDisabled,
                    pressed && draft.quietHours.enabled && styles.rowPressed,
                  ]}
                >
                  <Text
                    style={[
                      styles.timeChipText,
                      selected && styles.timeChipTextSelected,
                      !draft.quietHours.enabled && styles.timeChipTextDisabled,
                    ]}
                  >
                    {label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          {!draft.quietHours.enabled ? (
            <Text style={styles.rowHint}>Turn on quiet hours to choose a start and end time.</Text>
          ) : null}
        </View>
      </ScrollView>

      {/* One live region for the whole screen, holding whichever transient
          state is current — the dirty band (ready or blocked), the saved
          confirmation, or nothing (fully unmounted when clean). */}
      {bandMode !== "none" ? (
        <View accessibilityLiveRegion="polite" style={styles.bandRegion}>
          {bandMode === "confirmation" ? (
            <View style={styles.confirmationBand}>
              <Text accessibilityRole="alert" style={styles.confirmationText}>
                {SAVED_CONFIRMATION_TEXT}
              </Text>
            </View>
          ) : (
            <View style={styles.dirtyBand}>
              <Text accessibilityRole="alert" style={styles.dirtyBandText}>
                {bandMode === "dirty-blocked"
                  ? BLOCKED_EXPLANATION_TEXT
                  : "You have unsaved alert setting changes."}
              </Text>
              <View style={styles.dirtyBandActions}>
                <Pressable
                  onPress={revertToSaved}
                  accessibilityRole="button"
                  accessibilityLabel="Revert changes"
                  accessibilityHint="Resets this form back to your last saved alert settings"
                  style={({ pressed }) => [
                    styles.bandButton,
                    styles.bandButtonGhost,
                    pressed && styles.bandButtonPressed,
                  ]}
                >
                  <Text style={styles.bandButtonGhostText}>Revert</Text>
                </Pressable>
                {bandMode === "dirty-ready" ? (
                  <Pressable
                    onPress={handleSave}
                    accessibilityRole="button"
                    accessibilityLabel="Save alert settings"
                    accessibilityHint="Saves your threshold, channel, and quiet hours choices"
                    style={({ pressed }) => [
                      styles.bandButton,
                      styles.bandButtonSolid,
                      pressed && styles.bandButtonPressed,
                    ]}
                  >
                    <Text style={styles.bandButtonSolidText}>Save</Text>
                  </Pressable>
                ) : null}
              </View>
            </View>
          )}
        </View>
      ) : null}
    </SafeAreaView>
  );
}

export default PriceDropAlertSettingsScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: tokens.space(4),
    gap: tokens.space(1),
  },
  scrollContentPad: {
    paddingBottom: tokens.space(30),
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  subtitle: {
    fontSize: 13,
    color: tokens.color.muted,
    marginTop: tokens.space(1),
    lineHeight: 18,
  },
  lastSavedLabel: {
    fontSize: 11,
    color: tokens.color.faint,
    marginTop: tokens.space(2),
    marginBottom: tokens.space(1),
  },
  section: {
    paddingVertical: tokens.space(4),
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    gap: tokens.space(2),
  },
  sectionLast: {
    paddingBottom: tokens.space(2),
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: tokens.color.faint,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  modeRow: {
    flexDirection: "row",
    gap: tokens.space(2),
  },
  modeChip: {
    flex: 1,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: tokens.space(2),
    paddingHorizontal: tokens.space(2),
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.border,
  },
  modeChipSelected: {
    borderColor: tokens.color.accent,
    backgroundColor: tokens.color.accentBg,
  },
  modeChipText: {
    fontSize: 13,
    fontWeight: "600",
    color: tokens.color.muted,
  },
  modeChipTextSelected: {
    color: tokens.color.accent,
  },
  rowPressed: {
    opacity: 0.7,
  },
  stepperRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: tokens.space(4),
    paddingVertical: tokens.space(1),
  },
  stepperButton: {
    width: 44,
    height: 44,
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
  },
  stepperButtonDisabled: {
    borderColor: tokens.color.faint,
    opacity: 0.4,
  },
  stepperButtonText: {
    fontSize: 20,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  stepperButtonTextDisabled: {
    color: tokens.color.faint,
  },
  thresholdReadout: {
    minWidth: 96,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "700",
    color: tokens.color.ink,
    fontVariant: ["tabular-nums"],
  },
  rowHint: {
    fontSize: 12,
    color: tokens.color.faint,
  },
  channelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: tokens.space(3),
    paddingVertical: tokens.space(1),
  },
  channelRowLast: {
    paddingBottom: 0,
  },
  channelTextWrap: {
    flex: 1,
    gap: tokens.space(1),
  },
  rowLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: tokens.color.ink,
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: tokens.space(3),
  },
  quietHoursSubLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: tokens.color.muted,
    marginTop: tokens.space(2),
  },
  chipRow: {
    flexDirection: "row",
    gap: tokens.space(2),
  },
  timeChip: {
    flex: 1,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: tokens.space(2),
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.border,
  },
  timeChipSelected: {
    borderColor: tokens.color.accent,
    backgroundColor: tokens.color.accentBg,
  },
  timeChipDisabled: {
    opacity: 0.45,
  },
  timeChipText: {
    fontSize: 13,
    fontWeight: "600",
    color: tokens.color.muted,
    fontVariant: ["tabular-nums"],
  },
  timeChipTextSelected: {
    color: tokens.color.accent,
  },
  timeChipTextDisabled: {
    color: tokens.color.faint,
  },
  bandRegion: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
  dirtyBand: {
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.space(3),
    paddingHorizontal: tokens.space(4),
    paddingVertical: tokens.space(3),
    backgroundColor: tokens.color.ink,
    borderTopLeftRadius: tokens.radius.md,
    borderTopRightRadius: tokens.radius.md,
  },
  dirtyBandText: {
    flex: 1,
    color: tokens.color.onInk,
    fontSize: 13,
    fontWeight: "600",
  },
  dirtyBandActions: {
    flexDirection: "row",
    gap: tokens.space(2),
  },
  bandButton: {
    minHeight: 44,
    paddingHorizontal: tokens.space(3),
    borderRadius: tokens.radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  bandButtonGhost: {
    borderWidth: 1,
    borderColor: tokens.color.onInkMuted,
  },
  bandButtonSolid: {
    backgroundColor: tokens.color.accent,
  },
  bandButtonPressed: {
    opacity: 0.75,
  },
  bandButtonGhostText: {
    color: tokens.color.onInk,
    fontSize: 13,
    fontWeight: "600",
  },
  bandButtonSolidText: {
    color: tokens.color.onAccent,
    fontSize: 13,
    fontWeight: "700",
  },
  confirmationBand: {
    paddingHorizontal: tokens.space(4),
    paddingVertical: tokens.space(3),
    backgroundColor: tokens.color.successBg,
    borderTopWidth: 1,
    borderTopColor: tokens.color.successBorder,
  },
  confirmationText: {
    color: tokens.color.success,
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center",
  },
});
