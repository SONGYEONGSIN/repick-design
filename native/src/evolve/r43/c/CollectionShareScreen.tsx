// native/src/evolve/r43/c/CollectionShareScreen.tsx — auto-native-r43 candidate c.
//
// Collaborative Watchlist Share: a card grid of the buyer's saved collections.
// Each card names the friend it is already shared with, a two-way permission
// toggle (View only / Can edit), and a Share Link action that reveals the
// fixed link currently in effect for that collection.
//
// Macro layout is a card grid (FlatList, numColumns=2) — distinct from both a
// roster list and a single-focus card.
//
// Bottom-band mechanic assigned to this round: the dirty-state/snapshot-diff
// band, already proven elsewhere in this catalog on *other* domains (a
// preference map, a reordered list). Per the repo rule "reuse the mechanic,
// never the code surface", every name below is written fresh for this
// screen's own comparison — a *shared-permission* map, not a generic
// isDirty/hasChanges flag:
//   - `draftSharePermissions` / `permissionsSharedLast` instead of a generic
//     "working"/"saved" pair (the names describe what they hold: what the
//     toggles currently show vs. what the live links actually grant)
//   - `findUnsyncedCollectionIds()` — a pure diff over the two permission
//     maps, by collection id
//   - `pendingSyncIds.length` — the derived number the band displays
//   - style keys below all use a `shareSync*` root, never `band*`/`unsavedBand*`
//     and never the blocked/ready/done family from verification/disputes.
//
// This screen also needed the OTHER half of the band contract the brief
// calls out: a transient "just happened" confirmation after a sync, which is
// NOT re-derived (unlike the pending count) and so must be actively cleared.
// `justSyncedMessage` carries that text, gets `accessibilityRole="alert"`
// only while non-empty, and is cleared back to "" by a cancellable timeout
// (cleaned up on unmount) a few seconds after a sync. The pending-sync band
// and the post-sync confirmation render into the *same* always-mounted
// `accessibilityLiveRegion="polite"` wrapper and are mutually exclusive, so
// the screen never carries more than one live region and never announces
// two things at once.
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import {
  ALL_COLLECTION_IDS,
  COLLECTIONS,
  PERMISSIONS_SHARED_LAST,
  type CollectionDef,
  type Permission,
  type PermissionMap,
} from "./data";
import { tokens } from "../../../tokens";

const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };
const JUST_SYNCED_DISPLAY_MS = 4000;

/**
 * The dirty-state comparison for this screen: every collection whose working
 * toggle disagrees with what its live link currently grants. Structural, not
 * a one-way touched flag — toggling back to the live value removes that id
 * from the result again.
 */
function findUnsyncedCollectionIds(
  draft: PermissionMap,
  liveLast: PermissionMap
): string[] {
  return ALL_COLLECTION_IDS.filter((id) => draft[id] !== liveLast[id]);
}

function permissionLabel(permission: Permission): string {
  return permission === "edit" ? "Can edit" : "View only";
}

/* ───────── screen header (scrolls with the grid) ───────── */

function ScreenHeader() {
  return (
    <View style={styles.headerWrap}>
      <Text style={styles.headerTitle} accessibilityRole="header">
        Shared Collections
      </Text>
      <Text style={styles.headerSubtitle}>
        Set who can add or remove items, then sync to update each friend's
        link.
      </Text>
    </View>
  );
}

/* ───────── one collection card ───────── */

function CollectionCard({
  collection,
  draftPermission,
  livePermission,
  isLinkRevealed,
  onSetPermission,
  onToggleLinkReveal,
}: {
  collection: CollectionDef;
  draftPermission: Permission;
  livePermission: Permission;
  isLinkRevealed: boolean;
  onSetPermission: (permission: Permission) => void;
  onToggleLinkReveal: () => void;
}) {
  const isUnsynced = draftPermission !== livePermission;

  return (
    <View style={styles.collectionCard}>
      <Text style={styles.cardTitle}>{collection.name}</Text>
      <Text style={styles.cardMeta}>{collection.itemCount} items</Text>

      <View style={styles.friendRow}>
        <View style={styles.friendAvatar}>
          <Text style={styles.friendAvatarText}>{collection.friendInitials}</Text>
        </View>
        <Text style={styles.friendNameText} numberOfLines={1}>
          Shared with {collection.friendName}
        </Text>
      </View>

      <View style={styles.permissionToggleRow}>
        <Pressable
          onPress={() => onSetPermission("view")}
          accessibilityRole="radio"
          accessibilityState={{ selected: draftPermission === "view", checked: draftPermission === "view" }}
          accessibilityLabel={`View only, ${collection.name}`}
          hitSlop={HIT_SLOP}
          style={({ pressed }) => [
            styles.permissionOption,
            styles.permissionOptionLeft,
            draftPermission === "view" && styles.permissionOptionSelected,
            pressed && styles.pressed,
          ]}
        >
          <Text
            style={[
              styles.permissionOptionLabel,
              draftPermission === "view" && styles.permissionOptionLabelSelected,
            ]}
          >
            View only
          </Text>
        </Pressable>
        <Pressable
          onPress={() => onSetPermission("edit")}
          accessibilityRole="radio"
          accessibilityState={{ selected: draftPermission === "edit", checked: draftPermission === "edit" }}
          accessibilityLabel={`Can edit, ${collection.name}`}
          hitSlop={HIT_SLOP}
          style={({ pressed }) => [
            styles.permissionOption,
            styles.permissionOptionRight,
            draftPermission === "edit" && styles.permissionOptionSelected,
            pressed && styles.pressed,
          ]}
        >
          <Text
            style={[
              styles.permissionOptionLabel,
              draftPermission === "edit" && styles.permissionOptionLabelSelected,
            ]}
          >
            Can edit
          </Text>
        </Pressable>
      </View>

      {isUnsynced && (
        <Text style={styles.cardUnsyncedNote}>Changed — sync to update the link</Text>
      )}

      <Pressable
        onPress={onToggleLinkReveal}
        accessibilityRole="button"
        accessibilityLabel={
          isLinkRevealed
            ? `Hide share link for ${collection.name}`
            : `Show share link for ${collection.name}`
        }
        hitSlop={HIT_SLOP}
        style={({ pressed }) => [styles.linkRevealButton, pressed && styles.pressed]}
      >
        <Text style={styles.linkRevealGlyph}>↗</Text>
        <Text style={styles.linkRevealLabel}>{isLinkRevealed ? "Hide Link" : "Share Link"}</Text>
      </Pressable>

      {isLinkRevealed && (
        <View style={styles.linkPreviewRow}>
          <Text style={styles.linkPreviewText} numberOfLines={1}>
            {collection.linkUrl}
          </Text>
          <Text style={styles.linkPreviewPermission}>{permissionLabel(livePermission)}</Text>
        </View>
      )}
    </View>
  );
}

/* ───────── bottom band: mounted only while any toggle differs from its live link ───────── */

function ShareSyncBar({
  pendingCount,
  pendingNamesPreview,
  onSync,
  onDiscard,
}: {
  pendingCount: number;
  pendingNamesPreview: string;
  onSync: () => void;
  onDiscard: () => void;
}) {
  const noun = pendingCount === 1 ? "collection" : "collections";

  return (
    <View style={styles.shareSyncBar}>
      <View style={styles.shareSyncTextCol}>
        <Text style={styles.shareSyncHeadline} accessibilityRole="alert">
          {`Pending Share Updates — ${pendingCount}`}
        </Text>
        <Text style={styles.shareSyncDetail}>
          {pendingNamesPreview} not yet synced to {pendingCount === 1 ? "its" : "their"} link.
        </Text>
      </View>
      <View style={styles.shareSyncActions}>
        <Pressable
          onPress={onDiscard}
          accessibilityRole="button"
          accessibilityLabel="Discard permission changes and revert to the last shared settings"
          hitSlop={HIT_SLOP}
          style={({ pressed }) => [styles.shareSyncRevertButton, pressed && styles.pressed]}
        >
          <Text style={styles.shareSyncRevertLabel}>Discard</Text>
        </Pressable>
        <Pressable
          onPress={onSync}
          accessibilityRole="button"
          accessibilityLabel={`Sync share settings, ${pendingCount} ${noun} updated`}
          hitSlop={HIT_SLOP}
          style={({ pressed }) => [styles.shareSyncConfirmButton, pressed && styles.pressed]}
        >
          <Text style={styles.shareSyncConfirmLabel}>Sync & Share</Text>
        </Pressable>
      </View>
    </View>
  );
}

/* ───────── screen ───────── */

export function CollectionShareScreen() {
  // `draftSharePermissions` is what the segmented toggles currently show.
  // `permissionsSharedLast` is the last-saved snapshot — what each friend's
  // live link actually grants right now — and only ever moves when the user
  // taps Sync & Share.
  const [draftSharePermissions, setDraftSharePermissions] = useState<PermissionMap>(
    PERMISSIONS_SHARED_LAST
  );
  const [permissionsSharedLast, setPermissionsSharedLast] = useState<PermissionMap>(
    PERMISSIONS_SHARED_LAST
  );
  const [revealedLinkIds, setRevealedLinkIds] = useState<ReadonlySet<string>>(new Set());

  // Transient post-sync confirmation. Unlike pendingSyncIds (re-derived every
  // render, never stale), this is a "just happened" announcement: it must be
  // actively cleared or the alert role would stay latched on forever.
  const [justSyncedMessage, setJustSyncedMessage] = useState("");
  const clearSyncedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (clearSyncedTimerRef.current) clearTimeout(clearSyncedTimerRef.current);
    };
  }, []);

  const pendingSyncIds = useMemo(
    () => findUnsyncedCollectionIds(draftSharePermissions, permissionsSharedLast),
    [draftSharePermissions, permissionsSharedLast]
  );
  const pendingCount = pendingSyncIds.length;

  const pendingNamesPreview = useMemo(() => {
    if (pendingCount === 0) return "";
    const names = pendingSyncIds.map(
      (id) => COLLECTIONS.find((c) => c.id === id)?.name ?? id
    );
    const shown = names.slice(0, 2).join(", ");
    return names.length > 2 ? `${shown}, +${names.length - 2} more` : shown;
  }, [pendingSyncIds, pendingCount]);

  const setPermission = useCallback((id: string, permission: Permission) => {
    setDraftSharePermissions((prev) =>
      prev[id] === permission ? prev : { ...prev, [id]: permission }
    );
  }, []);

  const toggleLinkReveal = useCallback((id: string) => {
    setRevealedLinkIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const syncShareSettings = useCallback(() => {
    const count = pendingSyncIds.length;
    if (count === 0) return;
    setPermissionsSharedLast(draftSharePermissions);

    if (clearSyncedTimerRef.current) clearTimeout(clearSyncedTimerRef.current);
    setJustSyncedMessage(
      `Share settings updated — ${count} ${count === 1 ? "collection" : "collections"} synced.`
    );
    clearSyncedTimerRef.current = setTimeout(() => {
      setJustSyncedMessage("");
    }, JUST_SYNCED_DISPLAY_MS);
  }, [draftSharePermissions, pendingSyncIds]);

  const discardChanges = useCallback(() => {
    setDraftSharePermissions(permissionsSharedLast);
  }, [permissionsSharedLast]);

  return (
    <SafeAreaView style={styles.root}>
      <FlatList
        data={COLLECTIONS}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.gridRow}
        ListHeaderComponent={ScreenHeader}
        renderItem={({ item }) => (
          <CollectionCard
            collection={item}
            draftPermission={draftSharePermissions[item.id]}
            livePermission={permissionsSharedLast[item.id]}
            isLinkRevealed={revealedLinkIds.has(item.id)}
            onSetPermission={(permission) => setPermission(item.id, permission)}
            onToggleLinkReveal={() => toggleLinkReveal(item.id)}
          />
        )}
        contentContainerStyle={[
          styles.gridContent,
          pendingCount > 0 && styles.gridContentWithBand,
        ]}
        showsVerticalScrollIndicator={false}
      />

      {/* Always mounted so the live region persists across the band/toast
          appearing and disappearing; only its content changes. At most one
          live region on this screen, and the two children below never both
          render at once. */}
      <View style={styles.shareSyncRegion} accessibilityLiveRegion="polite">
        {pendingCount > 0 ? (
          <ShareSyncBar
            pendingCount={pendingCount}
            pendingNamesPreview={pendingNamesPreview}
            onSync={syncShareSettings}
            onDiscard={discardChanges}
          />
        ) : justSyncedMessage ? (
          <View style={styles.shareSyncToast}>
            <Text
              style={styles.shareSyncToastText}
              accessibilityRole={justSyncedMessage ? "alert" : undefined}
            >
              {justSyncedMessage}
            </Text>
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: tokens.color.bg },

  gridContent: { paddingHorizontal: tokens.space(4), paddingBottom: tokens.space(8) },
  gridContentWithBand: { paddingBottom: tokens.space(32) },
  gridRow: { gap: tokens.space(3) },

  headerWrap: { paddingTop: tokens.space(10), paddingBottom: tokens.space(5) },
  headerTitle: { fontSize: 28, fontWeight: "800", color: tokens.color.ink, letterSpacing: -0.5 },
  headerSubtitle: { marginTop: 6, fontSize: 13, color: tokens.color.faint, lineHeight: 18 },

  collectionCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(3),
    marginBottom: tokens.space(3),
    gap: tokens.space(2),
  },
  cardTitle: { fontSize: 14, fontWeight: "700", color: tokens.color.ink },
  cardMeta: { fontSize: 12, color: tokens.color.faint, marginTop: -4 },

  friendRow: { flexDirection: "row", alignItems: "center", gap: tokens.space(2) },
  friendAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: tokens.color.accentBg,
    alignItems: "center",
    justifyContent: "center",
  },
  friendAvatarText: { fontSize: 10, fontWeight: "800", color: tokens.color.accent },
  friendNameText: { flex: 1, fontSize: 12, color: tokens.color.muted },

  permissionToggleRow: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.sm,
    overflow: "hidden",
    marginTop: tokens.space(1),
  },
  permissionOption: {
    flex: 1,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: tokens.space(2),
  },
  permissionOptionLeft: { borderRightWidth: 1, borderRightColor: tokens.color.border },
  permissionOptionRight: {},
  permissionOptionSelected: { backgroundColor: tokens.color.accent },
  permissionOptionLabel: { fontSize: 12, fontWeight: "700", color: tokens.color.muted },
  permissionOptionLabelSelected: { color: tokens.color.onAccent },

  cardUnsyncedNote: { fontSize: 11, fontWeight: "600", color: tokens.color.warning },

  linkRevealButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: tokens.space(1),
    minHeight: 44,
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.border,
    marginTop: tokens.space(1),
  },
  linkRevealGlyph: { fontSize: 13, fontWeight: "700", color: tokens.color.accent },
  linkRevealLabel: { fontSize: 12, fontWeight: "700", color: tokens.color.accent },

  linkPreviewRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: tokens.space(2),
    backgroundColor: tokens.color.accentBg,
    borderRadius: tokens.radius.sm,
    paddingHorizontal: tokens.space(2),
    paddingVertical: tokens.space(2),
  },
  linkPreviewText: { flex: 1, fontSize: 11, color: tokens.color.ink2 },
  linkPreviewPermission: { fontSize: 10, fontWeight: "700", color: tokens.color.accent },

  pressed: { opacity: 0.85 },

  /* bottom band — always-mounted live-region wrapper; band or toast conditional inside it */
  shareSyncRegion: { position: "absolute", left: 0, right: 0, bottom: 0 },
  shareSyncBar: {
    backgroundColor: tokens.color.bg,
    borderTopWidth: 1,
    borderColor: tokens.color.border,
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(4),
    paddingBottom: tokens.space(6),
    gap: tokens.space(3),
  },
  shareSyncTextCol: { gap: 2 },
  shareSyncHeadline: { fontSize: 15, fontWeight: "800", color: tokens.color.ink },
  shareSyncDetail: { fontSize: 12, color: tokens.color.faint },
  shareSyncActions: { flexDirection: "row", gap: tokens.space(3) },

  shareSyncConfirmButton: {
    flex: 1,
    minHeight: 44,
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.color.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  shareSyncConfirmLabel: { fontSize: 14, fontWeight: "700", color: tokens.color.onAccent },

  shareSyncRevertButton: {
    minHeight: 44,
    paddingHorizontal: tokens.space(4),
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
  },
  shareSyncRevertLabel: { fontSize: 14, fontWeight: "700", color: tokens.color.muted },

  shareSyncToast: {
    backgroundColor: tokens.color.successBg,
    borderTopWidth: 1,
    borderColor: tokens.color.successBorder,
    paddingHorizontal: tokens.space(5),
    paddingVertical: tokens.space(4),
  },
  shareSyncToastText: { fontSize: 13, fontWeight: "700", color: tokens.color.success },
});

export default CollectionShareScreen;
