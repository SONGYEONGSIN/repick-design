"use client";

import Image from "next/image";
import {
  ArrowLeft,
  BookmarkPlus,
  CircleCheck,
  CircleDashed,
  Clock,
  Download,
  Film,
  Image as ImageIcon,
  PanelRightOpen,
  Square,
  TriangleAlert,
  RectangleHorizontal,
  RectangleVertical,
} from "lucide-react";
import type { Asset, AssetStatus, AssetType, Orientation } from "./data";
import { assetImageUrl } from "./data";

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white";

const STATUS_ICON: Record<AssetStatus, typeof CircleCheck> = {
  Licensed: CircleCheck,
  Restricted: TriangleAlert,
  Available: CircleDashed,
};
const STATUS_LABEL: Record<AssetStatus, string> = {
  Licensed: "Licensed by your team",
  Restricted: "Restricted — request access",
  Available: "Available to license",
};
const STATUS_TONE: Record<AssetStatus, string> = {
  Licensed: "text-emerald-700",
  Restricted: "text-orange-700",
  Available: "text-zinc-500",
};

const ORIENTATION_ICON: Record<Orientation, typeof RectangleHorizontal> = {
  Landscape: RectangleHorizontal,
  Portrait: RectangleVertical,
  Square: Square,
};

const TYPE_ICON: Record<AssetType, typeof Film> = {
  Photo: ImageIcon,
  Video: Film,
};

interface PreviewPaneProps {
  asset: Asset | null;
  onBack: () => void;
}

export default function PreviewPane({ asset, onBack }: PreviewPaneProps) {
  return (
    <div className="flex h-full min-h-0 flex-col bg-zinc-50">
      <div className="flex shrink-0 items-center gap-3 border-b border-zinc-200 bg-white p-4 md:hidden">
        <button
          type="button"
          onClick={onBack}
          className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 ${FOCUS_RING}`}
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to results
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {asset ? (
          <PreviewContent asset={asset} />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 p-10 text-center">
            <PanelRightOpen className="size-8 text-zinc-300" aria-hidden="true" />
            <p className="text-sm font-medium text-zinc-900">Select an asset to preview</p>
            <p className="max-w-xs text-sm text-zinc-500">
              Choose any row from the results list — full metadata, rights and license options
              will open here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function PreviewContent({ asset }: { asset: Asset }) {
  const StatusIcon = STATUS_ICON[asset.status];
  const OrientationIcon = ORIENTATION_ICON[asset.orientation];
  const TypeIcon = TYPE_ICON[asset.type];

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 p-4 sm:p-6">
      <div className="relative aspect-[3/2] w-full min-w-0 shrink-0 overflow-hidden rounded-xl bg-zinc-100 ring-1 ring-zinc-200">
        <Image
          fill
          src={assetImageUrl(asset.imageId, { w: 1200, h: 800 })}
          alt={`${asset.title}, from the ${asset.collection} collection, by ${asset.creator}`}
          sizes="(min-width: 768px) 640px, 100vw"
          className="object-cover"
        />
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-zinc-600">
        <span className="inline-flex items-center gap-1.5">
          <TypeIcon className="size-3.5 text-zinc-400" aria-hidden="true" />
          {asset.type}
          {asset.duration ? ` · ${asset.duration}` : ""}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <OrientationIcon className="size-3.5 text-zinc-400" aria-hidden="true" />
          {asset.orientation}
        </span>
        <span className={`inline-flex items-center gap-1.5 font-medium ${STATUS_TONE[asset.status]}`}>
          <StatusIcon className="size-3.5" aria-hidden="true" />
          {STATUS_LABEL[asset.status]}
        </span>
      </div>

      <div className="min-w-0">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900">{asset.title}</h2>
        <p className="mt-1 text-sm text-zinc-500">
          {asset.collection} · shot by {asset.creator}
        </p>
      </div>

      <dl className="grid grid-cols-2 gap-x-4 gap-y-4 rounded-lg border border-zinc-200 bg-white p-4 text-sm sm:grid-cols-3">
        <div>
          <dt className="text-xs text-zinc-500">Dimensions</dt>
          <dd className="mt-0.5 tabular-nums text-zinc-900">{asset.dimensions}</dd>
        </div>
        <div>
          <dt className="text-xs text-zinc-500">File size</dt>
          <dd className="mt-0.5 tabular-nums text-zinc-900">{asset.fileSize}</dd>
        </div>
        <div>
          <dt className="text-xs text-zinc-500">License</dt>
          <dd className="mt-0.5 text-zinc-900">{asset.license}</dd>
        </div>
        <div>
          <dt className="text-xs text-zinc-500">Downloads</dt>
          <dd className="mt-0.5 tabular-nums text-zinc-900">{asset.downloads.toLocaleString("en-US")}</dd>
        </div>
        <div>
          <dt className="text-xs text-zinc-500">Added</dt>
          <dd className="mt-0.5 flex items-center gap-1 tabular-nums text-zinc-900">
            <Clock className="size-3 text-zinc-400" aria-hidden="true" />
            {asset.addedLabel}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-zinc-500">Price</dt>
          <dd className="mt-0.5 tabular-nums font-semibold text-rose-700">{asset.credits} credits</dd>
        </div>
      </dl>

      <div className="flex flex-wrap gap-2">
        {asset.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-xs text-zinc-600"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 border-t border-zinc-200 pt-5">
        <button
          type="button"
          className={`inline-flex items-center gap-2 rounded-md bg-rose-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-rose-800 active:bg-rose-900 ${FOCUS_RING}`}
        >
          <Download className="size-4" aria-hidden="true" />
          License asset — {asset.credits} credits
        </button>
        <button
          type="button"
          className={`inline-flex items-center gap-2 rounded-md border border-zinc-300 px-4 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 ${FOCUS_RING}`}
        >
          <BookmarkPlus className="size-4" aria-hidden="true" />
          Add to board
        </button>
      </div>
    </div>
  );
}
