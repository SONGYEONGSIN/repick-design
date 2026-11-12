// native/src/evolve/r39/b/VacationModeScreen.tsx
//
// Vacation Mode — a seller settings form, not a list. One toggle ("Pause my
// storefront"), two tappable away-date rows that cycle through a fixed preset
// list, and a multi-line auto-reply message shown to buyers while paused.
//
// Band mechanic: a bottom-fixed "unsaved vacation changes" band that is
// ABSENT whenever the form matches its last-saved snapshot, and APPEARS only
// once `hasUnsavedVacationChanges` (a derived boolean, never hand-flipped)
// becomes true. Saving snaps the snapshot back in sync — which makes the
// band disappear as a side effect of the derivation, not a manual hide — and
// swaps in a brief "saved" confirmation inside the same live region.
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  Switch,
} from "react-native";
import { tokens } from "../../../tokens";
import {
  AWAY_DATE_PRESETS,
  INITIAL_VACATION_SETTINGS,
  vacationSnapshotsEqual,
  type VacationSettingsSnapshot,
} from "./data";

const SAVED_NOTICE_TEXT = "Vacation settings saved.";
const SAVED_NOTICE_DURATION_MS = 2500;

export function VacationModeScreen() {
  const [storefrontPaused, setStorefrontPaused] = useState(INITIAL_VACATION_SETTINGS.paused);
  const [awayStartIndex, setAwayStartIndex] = useState(INITIAL_VACATION_SETTINGS.startDateIndex);
  const [awayEndIndex, setAwayEndIndex] = useState(INITIAL_VACATION_SETTINGS.endDateIndex);
  const [buyerAutoReplyMessage, setBuyerAutoReplyMessage] = useState(
    INITIAL_VACATION_SETTINGS.autoReplyMessage
  );

  const [savedSnapshot, setSavedSnapshot] = useState<VacationSettingsSnapshot>(
    INITIAL_VACATION_SETTINGS
  );
  const [savedNoticeVisible, setSavedNoticeVisible] = useState(false);
  const savedNoticeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (savedNoticeTimer.current) clearTimeout(savedNoticeTimer.current);
    };
  }, []);

  const currentSnapshot: VacationSettingsSnapshot = useMemo(
    () => ({
      paused: storefrontPaused,
      startDateIndex: awayStartIndex,
      endDateIndex: awayEndIndex,
      autoReplyMessage: buyerAutoReplyMessage,
    }),
    [storefrontPaused, awayStartIndex, awayEndIndex, buyerAutoReplyMessage]
  );

  // The single source of truth for whether the save band shows: a real
  // comparison against the last-saved snapshot, recomputed every render.
  const hasUnsavedVacationChanges = !vacationSnapshotsEqual(currentSnapshot, savedSnapshot);

  const dismissSavedNotice = useCallback(() => {
    if (savedNoticeTimer.current) {
      clearTimeout(savedNoticeTimer.current);
      savedNoticeTimer.current = null;
    }
    setSavedNoticeVisible(false);
  }, []);

  const handleTogglePaused = useCallback(
    (next: boolean) => {
      dismissSavedNotice();
      setStorefrontPaused(next);
    },
    [dismissSavedNotice]
  );

  const cycleStartDate = useCallback(() => {
    dismissSavedNotice();
    setAwayStartIndex((i) => (i + 1) % AWAY_DATE_PRESETS.length);
  }, [dismissSavedNotice]);

  const cycleEndDate = useCallback(() => {
    dismissSavedNotice();
    setAwayEndIndex((i) => (i + 1) % AWAY_DATE_PRESETS.length);
  }, [dismissSavedNotice]);

  const handleMessageChange = useCallback(
    (text: string) => {
      dismissSavedNotice();
      setBuyerAutoReplyMessage(text);
    },
    [dismissSavedNotice]
  );

  const handleSaveVacationSettings = useCallback(() => {
    setSavedSnapshot(currentSnapshot);
    setSavedNoticeVisible(true);
    if (savedNoticeTimer.current) clearTimeout(savedNoticeTimer.current);
    savedNoticeTimer.current = setTimeout(() => setSavedNoticeVisible(false), SAVED_NOTICE_DURATION_MS);
  }, [currentSnapshot]);

  const handleDiscardVacationChanges = useCallback(() => {
    dismissSavedNotice();
    setStorefrontPaused(savedSnapshot.paused);
    setAwayStartIndex(savedSnapshot.startDateIndex);
    setAwayEndIndex(savedSnapshot.endDateIndex);
    setBuyerAutoReplyMessage(savedSnapshot.autoReplyMessage);
  }, [savedSnapshot, dismissSavedNotice]);

  const startDateLabel = AWAY_DATE_PRESETS[awayStartIndex];
  const endDateLabel = AWAY_DATE_PRESETS[awayEndIndex];
  const bottomRegionOccupied = hasUnsavedVacationChanges || savedNoticeVisible;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, bottomRegionOccupied && styles.scrollContentPad]}
      >
        <Text accessibilityRole="header" style={styles.title}>
          Vacation Mode
        </Text>
        <Text style={styles.subtitle}>
          Pause your storefront while you&apos;re away. Buyers won&apos;t be able to check out, and
          they&apos;ll see your auto-reply message instead.
        </Text>

        <View style={styles.section}>
          <View style={styles.toggleRow}>
            <View style={styles.toggleTextWrap}>
              <Text style={styles.rowLabel}>Pause my storefront</Text>
              <Text style={styles.rowHint}>
                {storefrontPaused
                  ? "Hidden from buyers right now."
                  : "Visible and active right now."}
              </Text>
            </View>
            <Switch
              value={storefrontPaused}
              onValueChange={handleTogglePaused}
              accessibilityRole="switch"
              accessibilityLabel="Pause my storefront"
              accessibilityValue={{ text: storefrontPaused ? "On" : "Off" }}
              trackColor={{ false: tokens.color.border, true: tokens.color.accent }}
              thumbColor={tokens.color.bg}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Away dates</Text>

          <Pressable
            onPress={cycleStartDate}
            accessibilityRole="button"
            accessibilityLabel="Vacation start date"
            accessibilityValue={{ text: startDateLabel }}
            accessibilityHint="Cycles to the next preset start date"
            style={({ pressed }) => [styles.dateRow, pressed && styles.rowPressed]}
          >
            <Text style={styles.rowLabel}>Starts</Text>
            <Text style={styles.dateValue}>{startDateLabel}</Text>
          </Pressable>

          <Pressable
            onPress={cycleEndDate}
            accessibilityRole="button"
            accessibilityLabel="Vacation end date"
            accessibilityValue={{ text: endDateLabel }}
            accessibilityHint="Cycles to the next preset end date"
            style={({ pressed }) => [styles.dateRow, styles.dateRowLast, pressed && styles.rowPressed]}
          >
            <Text style={styles.rowLabel}>Ends</Text>
            <Text style={styles.dateValue}>{endDateLabel}</Text>
          </Pressable>
        </View>

        <View style={[styles.section, styles.sectionLast]}>
          <Text style={styles.sectionLabel}>Auto-reply to buyers</Text>
          <Text style={styles.rowHint}>
            Shown to buyers who message you or visit your storefront while it&apos;s paused.
          </Text>
          <TextInput
            value={buyerAutoReplyMessage}
            onChangeText={handleMessageChange}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            accessibilityLabel="Auto-reply message to buyers"
            accessibilityHint="Edits the message buyers see while your storefront is paused"
            style={styles.messageInput}
          />
        </View>
      </ScrollView>

      {/* Exactly one live region for the whole screen: it holds whichever
          transient state is current — the unsaved-changes band, the
          post-save confirmation, or neither (fully absent). */}
      <View accessibilityLiveRegion="polite" style={styles.statusRegion}>
        {hasUnsavedVacationChanges ? (
          <View style={styles.unsavedBand}>
            <Text accessibilityRole="alert" style={styles.unsavedBandText}>
              You have unsaved changes to your vacation settings.
            </Text>
            <View style={styles.unsavedBandActions}>
              <Pressable
                onPress={handleDiscardVacationChanges}
                accessibilityRole="button"
                accessibilityLabel="Discard changes"
                accessibilityHint="Reverts the form back to your last saved vacation settings"
                style={({ pressed }) => [
                  styles.bandButton,
                  styles.bandButtonGhost,
                  pressed && styles.bandButtonPressed,
                ]}
              >
                <Text style={styles.bandButtonGhostText}>Discard</Text>
              </Pressable>
              <Pressable
                onPress={handleSaveVacationSettings}
                accessibilityRole="button"
                accessibilityLabel="Save vacation settings"
                accessibilityHint="Saves your pause toggle, away dates, and auto-reply message"
                style={({ pressed }) => [
                  styles.bandButton,
                  styles.bandButtonSolid,
                  pressed && styles.bandButtonPressed,
                ]}
              >
                <Text style={styles.bandButtonSolidText}>Save</Text>
              </Pressable>
            </View>
          </View>
        ) : savedNoticeVisible ? (
          <View style={styles.savedNotice}>
            <Text accessibilityRole="alert" style={styles.savedNoticeText}>
              {SAVED_NOTICE_TEXT}
            </Text>
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

export default VacationModeScreen;

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
    marginBottom: tokens.space(2),
    lineHeight: 18,
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
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: tokens.space(3),
  },
  toggleTextWrap: {
    flex: 1,
    gap: tokens.space(1),
  },
  rowLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: tokens.color.ink,
  },
  rowHint: {
    fontSize: 12,
    color: tokens.color.faint,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 44,
    paddingVertical: tokens.space(2),
    paddingHorizontal: tokens.space(3),
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.border,
  },
  dateRowLast: {
    marginTop: tokens.space(2),
  },
  rowPressed: {
    opacity: 0.7,
  },
  dateValue: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.accent,
  },
  messageInput: {
    minHeight: 100,
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(3),
    fontSize: 14,
    color: tokens.color.ink,
    backgroundColor: tokens.color.bg,
  },
  statusRegion: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
  unsavedBand: {
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.space(3),
    paddingHorizontal: tokens.space(4),
    paddingVertical: tokens.space(3),
    backgroundColor: tokens.color.ink,
    borderTopLeftRadius: tokens.radius.md,
    borderTopRightRadius: tokens.radius.md,
  },
  unsavedBandText: {
    flex: 1,
    color: tokens.color.onInk,
    fontSize: 13,
    fontWeight: "600",
  },
  unsavedBandActions: {
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
  savedNotice: {
    paddingHorizontal: tokens.space(4),
    paddingVertical: tokens.space(3),
    backgroundColor: tokens.color.successBg,
    borderTopWidth: 1,
    borderTopColor: tokens.color.successBorder,
  },
  savedNoticeText: {
    color: tokens.color.success,
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center",
  },
});
