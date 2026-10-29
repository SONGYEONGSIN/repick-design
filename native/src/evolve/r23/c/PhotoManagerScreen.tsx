// native/src/evolve/r23/c/PhotoManagerScreen.tsx
//
// Listing Photo Manager — reorder/inspect the photo set attached to a
// seller's existing listing, remove unwanted shots, and see the count
// against the upload limit.
//
// Macro band-form: selection-driven contextual bar. selectedCount is a
// *derived* value (photos.filter(selected).length), never a boolean toggle.
// The bar mounts only while selectedCount > 0 and unmounts the instant it
// drops back to 0. A post-delete "undo" strip is the only other bottom
// surface this screen can show, and the two are mutually exclusive: render
// order below guarantees at most one of {bar, undo strip} is ever mounted.
import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { tokens } from "../../../tokens";
import { INITIAL_PHOTOS, LISTING_TITLE, MAX_PHOTOS, type ListingPhoto } from "./data";
import { PhotoCell, AddPhotoCell, ContextualBar, UndoStrip } from "./components";

type GridItem =
  | { kind: "photo"; photo: ListingPhoto }
  | { kind: "add" };

type UndoState = {
  previousPhotos: ListingPhoto[];
  deletedCount: number;
};

function renumber(photos: ListingPhoto[]): ListingPhoto[] {
  return photos.map((p, i) => ({ ...p, order: i + 1 }));
}

export default function PhotoManagerScreen() {
  const [photos, setPhotos] = useState<ListingPhoto[]>(INITIAL_PHOTOS);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [pendingUndo, setPendingUndo] = useState<UndoState | null>(null);
  const [liveMessage, setLiveMessage] = useState<string>("");

  const selectedCount = selectedIds.length;
  const canSetCover =
    selectedCount === 1 &&
    photos.find((p) => p.id === selectedIds[0])?.isCover === false;

  const toggleSelect = (id: string) => {
    setPendingUndo(null); // a fresh selection supersedes a stale undo offer
    setSelectedIds((prev) => {
      const isSelected = prev.includes(id);
      const next = isSelected ? prev.filter((x) => x !== id) : [...prev, id];
      setLiveMessage(
        next.length === 0
          ? "Selection cleared."
          : `${next.length} photo${next.length === 1 ? "" : "s"} selected.`
      );
      return next;
    });
  };

  const cancelSelection = () => {
    setSelectedIds([]);
    setLiveMessage("Selection cleared.");
  };

  const setCoverFromSelection = () => {
    if (selectedCount !== 1) return;
    const targetId = selectedIds[0];
    setPhotos((prev) =>
      prev.map((p) => ({ ...p, isCover: p.id === targetId }))
    );
    setSelectedIds([]);
    setLiveMessage("Cover photo updated.");
  };

  const deleteSelected = () => {
    if (selectedCount === 0) return;
    const previousPhotos = photos;
    const removedHadCover = photos.some(
      (p) => selectedIds.includes(p.id) && p.isCover
    );
    let remaining = photos.filter((p) => !selectedIds.includes(p.id));
    if (removedHadCover && remaining.length > 0) {
      remaining = remaining.map((p, i) => ({ ...p, isCover: i === 0 }));
    }
    remaining = renumber(remaining);

    setPhotos(remaining);
    setPendingUndo({ previousPhotos, deletedCount: selectedIds.length });
    setLiveMessage(
      `${selectedIds.length} photo${selectedIds.length === 1 ? "" : "s"} deleted.`
    );
    setSelectedIds([]); // bar unmounts; undo strip becomes the sole bottom surface
  };

  const undoDelete = () => {
    if (!pendingUndo) return;
    setPhotos(pendingUndo.previousPhotos);
    setPendingUndo(null);
    setLiveMessage("Delete undone.");
  };

  const dismissUndo = () => {
    setPendingUndo(null);
    setLiveMessage("");
  };

  const gridData = useMemo<GridItem[]>(() => {
    const items: GridItem[] = photos.map((photo) => ({ kind: "photo", photo }));
    if (photos.length < MAX_PHOTOS) {
      items.push({ kind: "add" });
    }
    return items;
  }, [photos]);

  const remainingSlots = MAX_PHOTOS - photos.length;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text accessibilityRole="header" style={styles.heading}>
          Manage Photos
        </Text>
        <Text style={styles.subheading} numberOfLines={1}>
          {LISTING_TITLE}
        </Text>
        <Text style={styles.countLine}>
          {`${photos.length} of ${MAX_PHOTOS} photos`}
          {selectedCount === 0 ? " · Tap a photo to select" : ""}
        </Text>
      </View>

      <View accessibilityLiveRegion="polite" style={styles.liveRegion}>
        {liveMessage ? (
          <Text accessibilityRole="alert" style={styles.liveText}>
            {liveMessage}
          </Text>
        ) : null}
      </View>

      <FlatList
        data={gridData}
        keyExtractor={(item) => (item.kind === "photo" ? item.photo.id : "add-cell")}
        numColumns={3}
        contentContainerStyle={styles.gridContent}
        renderItem={({ item }) =>
          item.kind === "photo" ? (
            <PhotoCell
              photo={item.photo}
              selected={selectedIds.includes(item.photo.id)}
              onToggle={toggleSelect}
            />
          ) : (
            <AddPhotoCell remaining={remainingSlots} />
          )
        }
      />

      {selectedCount > 0 ? (
        <ContextualBar
          selectedCount={selectedCount}
          canSetCover={canSetCover}
          onSetCover={setCoverFromSelection}
          onDelete={deleteSelected}
          onCancel={cancelSelection}
        />
      ) : pendingUndo ? (
        <UndoStrip
          count={pendingUndo.deletedCount}
          onUndo={undoDelete}
          onDismiss={dismissUndo}
        />
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  header: {
    paddingHorizontal: tokens.space(4),
    paddingTop: tokens.space(4),
    paddingBottom: tokens.space(2),
  },
  heading: {
    fontSize: 22,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  subheading: {
    fontSize: 14,
    color: tokens.color.muted,
    marginTop: tokens.space(1),
  },
  countLine: {
    fontSize: 13,
    color: tokens.color.faint,
    marginTop: tokens.space(2),
  },
  liveRegion: {
    paddingHorizontal: tokens.space(4),
  },
  liveText: {
    fontSize: 12,
    color: tokens.color.accent,
    fontWeight: "600",
    marginBottom: tokens.space(1),
  },
  gridContent: {
    paddingHorizontal: tokens.space(3),
    paddingBottom: tokens.space(6),
  },
});
