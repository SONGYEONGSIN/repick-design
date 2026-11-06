// native/src/evolve/r41/c/NotificationPreferencesScreen.tsx — auto-native-r41 candidate c.
//
// Settings screen for which notification categories the account receives (NOT the separate
// activity-feed "Notifications" screen elsewhere in this app — that one lists past notifications;
// this one controls what gets sent).
//
// Bottom-band mechanic assigned to this round: a dirty-state-derived save band, already proven
// in two other domains in this catalog (a settings toggle screen, a list-reordering screen). Per
// the repo rule "reuse the mechanic, never the code surface", every name below is written fresh
// for this screen's own domain — comparing two *preference maps* — rather than reused/renamed
// from either prior screen:
//   - `draftPreferences` / `confirmedPreferences` instead of a generic "working"/"saved" pair
//   - `findChangedPreferenceKeys()` — a pure diff over the two preference maps, by key
//   - `pendingChangeCount` — the derived number the band actually displays
// None of `isDirty`, `hasChanges`, or similar generic flags appear anywhere in this file.
import { useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  Pressable,
  SectionList,
  SafeAreaView,
  StyleSheet,
  Switch,
} from "react-native";
import {
  ALL_PREFERENCE_KEYS,
  PREFERENCE_GROUPS,
  INITIAL_SAVED_PREFERENCES,
  type PreferenceCategoryDef,
  type PreferenceKey,
  type PreferenceSnapshot,
} from "./data";
import { tokens } from "../../../tokens";

const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };

/** Sections for SectionList, built once from the static category catalog. */
const PREFERENCE_SECTIONS = PREFERENCE_GROUPS.map((group) => ({
  key: group.key,
  title: group.title,
  data: group.categories,
}));

/**
 * The dirty-state comparison for this screen: walks every category key and returns the ones
 * where the working map and the saved snapshot disagree. Structural, not a one-way touched flag
 * — toggling a category on and back off removes that key from the result again.
 */
function findChangedPreferenceKeys(
  draft: PreferenceSnapshot,
  confirmed: PreferenceSnapshot
): PreferenceKey[] {
  return ALL_PREFERENCE_KEYS.filter((key) => draft[key] !== confirmed[key]);
}

/* ───────── one category row: label, one-line description, toggle ───────── */

function PreferenceRow({
  category,
  enabled,
  onToggle,
}: {
  category: PreferenceCategoryDef;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.rowTextCol}>
        <Text style={styles.rowLabel}>{category.label}</Text>
        <Text style={styles.rowDescription}>{category.description}</Text>
      </View>
      <Switch
        value={enabled}
        onValueChange={onToggle}
        accessibilityLabel={`${category.label}, ${enabled ? "on" : "off"}`}
        trackColor={{ false: tokens.color.border, true: tokens.color.accent }}
        thumbColor={tokens.color.bg}
        ios_backgroundColor={tokens.color.border}
      />
    </View>
  );
}

/* ───────── section header ───────── */

function GroupHeader({ title }: { title: string }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText} accessibilityRole="header">
        {title}
      </Text>
    </View>
  );
}

/* ───────── screen header (scrolls with the list) ───────── */

function ScreenHeader() {
  return (
    <View style={styles.headerWrap}>
      <Text style={styles.headerTitle} accessibilityRole="header">
        Notification Preferences
      </Text>
      <Text style={styles.headerSubtitle}>
        Choose which updates repick sends you about buying and selling activity.
      </Text>
    </View>
  );
}

/* ───────── bottom band: mounted only while the draft and saved snapshot differ ───────── */

function SaveBand({
  pendingChangeCount,
  onSave,
  onDiscard,
}: {
  pendingChangeCount: number;
  onSave: () => void;
  onDiscard: () => void;
}) {
  const bandHeadline = `Save Changes — ${pendingChangeCount} updated`;
  const updatedWord = pendingChangeCount === 1 ? "category" : "categories";

  return (
    <View style={styles.band}>
      <View style={styles.bandTextCol}>
        <Text style={styles.bandHeadline} accessibilityRole="alert">
          {bandHeadline}
        </Text>
        <Text style={styles.bandSubtext}>
          {pendingChangeCount} {updatedWord} changed from your saved settings.
        </Text>
      </View>
      <View style={styles.bandButtonsRow}>
        <Pressable
          onPress={onDiscard}
          accessibilityRole="button"
          accessibilityLabel="Discard changes and revert to your last saved preferences"
          hitSlop={HIT_SLOP}
          style={({ pressed }) => [styles.bandButtonSecondary, pressed && styles.pressed]}
        >
          <Text style={styles.bandButtonSecondaryLabel}>Discard</Text>
        </Pressable>
        <Pressable
          onPress={onSave}
          accessibilityRole="button"
          accessibilityLabel={`Save changes, ${pendingChangeCount} ${updatedWord} updated`}
          hitSlop={HIT_SLOP}
          style={({ pressed }) => [styles.bandButtonPrimary, pressed && styles.pressed]}
        >
          <Text style={styles.bandButtonPrimaryLabel}>Save Changes</Text>
        </Pressable>
      </View>
    </View>
  );
}

/* ───────── screen ───────── */

export function NotificationPreferencesScreen() {
  // `draftPreferences` is what the switches currently show. `confirmedPreferences` is the
  // last-saved snapshot, captured once at mount (per screen-mount session) and only ever
  // replaced by an explicit Save.
  const [draftPreferences, setDraftPreferences] = useState<PreferenceSnapshot>(
    INITIAL_SAVED_PREFERENCES
  );
  const [confirmedPreferences, setConfirmedPreferences] = useState<PreferenceSnapshot>(
    INITIAL_SAVED_PREFERENCES
  );

  const changedPreferenceKeys = useMemo(
    () => findChangedPreferenceKeys(draftPreferences, confirmedPreferences),
    [draftPreferences, confirmedPreferences]
  );
  const pendingChangeCount = changedPreferenceKeys.length;

  const toggleCategory = useCallback((key: PreferenceKey) => {
    setDraftPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const commitDraftPreferences = useCallback(() => {
    setConfirmedPreferences(draftPreferences);
  }, [draftPreferences]);

  const discardDraftPreferences = useCallback(() => {
    setDraftPreferences(confirmedPreferences);
  }, [confirmedPreferences]);

  return (
    <SafeAreaView style={styles.root}>
      <SectionList
        sections={PREFERENCE_SECTIONS}
        keyExtractor={(item) => item.key}
        stickySectionHeadersEnabled={false}
        renderSectionHeader={({ section }) => <GroupHeader title={section.title} />}
        renderItem={({ item }) => (
          <PreferenceRow
            category={item}
            enabled={draftPreferences[item.key]}
            onToggle={() => toggleCategory(item.key)}
          />
        )}
        ListHeaderComponent={ScreenHeader}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        SectionSeparatorComponent={() => <View style={styles.sectionSeparator} />}
        contentContainerStyle={[
          styles.listContent,
          pendingChangeCount > 0 && styles.listContentWithBand,
        ]}
        showsVerticalScrollIndicator={false}
      />

      {/* Always mounted so the live region persists across the band appearing/disappearing;
          only its content (and hence what gets announced) changes. At most one live region
          on this screen. */}
      <View style={styles.bandRegion} accessibilityLiveRegion="polite">
        {pendingChangeCount > 0 && (
          <SaveBand
            pendingChangeCount={pendingChangeCount}
            onSave={commitDraftPreferences}
            onDiscard={discardDraftPreferences}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: tokens.color.bg },

  listContent: { paddingHorizontal: tokens.space(5), paddingBottom: tokens.space(10) },
  listContentWithBand: { paddingBottom: tokens.space(32) },

  headerWrap: { paddingTop: tokens.space(10), paddingBottom: tokens.space(4) },
  headerTitle: { fontSize: 28, fontWeight: "800", color: tokens.color.ink, letterSpacing: -0.5 },
  headerSubtitle: { marginTop: 6, fontSize: 13, color: tokens.color.faint, lineHeight: 18 },

  sectionHeader: { paddingTop: tokens.space(6), paddingBottom: tokens.space(2) },
  sectionHeaderText: {
    fontSize: 12,
    fontWeight: "700",
    color: tokens.color.muted,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  sectionSeparator: { height: tokens.space(1) },

  separator: { height: tokens.space(3) },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.space(3),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    paddingVertical: tokens.space(3),
    paddingHorizontal: tokens.space(4),
    minHeight: 56,
  },
  rowTextCol: { flex: 1, gap: 2 },
  rowLabel: { fontSize: 15, fontWeight: "700", color: tokens.color.ink },
  rowDescription: { fontSize: 13, color: tokens.color.muted, lineHeight: 18 },

  pressed: { opacity: 0.85 },

  /* bottom band — always-mounted live-region wrapper, band itself conditional inside it */
  bandRegion: { position: "absolute", left: 0, right: 0, bottom: 0 },
  band: {
    backgroundColor: tokens.color.bg,
    borderTopWidth: 1,
    borderColor: tokens.color.border,
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(4),
    paddingBottom: tokens.space(6),
    gap: tokens.space(3),
  },
  bandTextCol: { gap: 2 },
  bandHeadline: { fontSize: 15, fontWeight: "800", color: tokens.color.ink },
  bandSubtext: { fontSize: 12, color: tokens.color.faint },
  bandButtonsRow: { flexDirection: "row", gap: tokens.space(3) },

  bandButtonPrimary: {
    flex: 1,
    minHeight: 44,
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.color.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  bandButtonPrimaryLabel: { fontSize: 14, fontWeight: "700", color: tokens.color.onAccent },

  bandButtonSecondary: {
    minHeight: 44,
    paddingHorizontal: tokens.space(4),
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
  },
  bandButtonSecondaryLabel: { fontSize: 14, fontWeight: "700", color: tokens.color.muted },
});
