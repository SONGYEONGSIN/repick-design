'use client';

import { useId, useState, type KeyboardEvent } from 'react';
import { MapPin, Search } from 'lucide-react';
import {
  MAP_HEIGHT,
  MAP_VIEWBOX,
  MAP_WIDTH,
  RIVER_PATH,
  type Region,
  type RegionId,
} from './data';

interface RegionMapProps {
  regions: readonly Region[];
  selectedId: RegionId;
  previewId: RegionId | null;
  onSelect: (id: RegionId) => void;
  onPreview: (id: RegionId | null) => void;
}

function pathFill(isSelected: boolean, isPreview: boolean): string {
  if (isSelected) return '#3B82F6';
  if (isPreview) return '#1E2430';
  return '#16171C';
}

function pathFillOpacity(isSelected: boolean): number {
  return isSelected ? 0.28 : 1;
}

function pathStroke(isSelected: boolean, isPreview: boolean): string {
  if (isSelected) return '#3B82F6';
  if (isPreview) return '#3B82F6';
  return '#33353C';
}

export default function RegionMap({
  regions,
  selectedId,
  previewId,
  onSelect,
  onPreview,
}: RegionMapProps) {
  const [query, setQuery] = useState('');
  const searchId = useId();
  const liveRegionId = useId();

  const normalizedQuery = query.trim().toLowerCase();
  const filteredRegions = normalizedQuery
    ? regions.filter((r) => r.name.toLowerCase().includes(normalizedQuery))
    : regions;

  const activeRegion = regions.find((r) => r.id === (previewId ?? selectedId));
  const isPreviewing = previewId !== null && previewId !== selectedId;

  function handleKeyDown(event: KeyboardEvent<SVGPathElement>, id: RegionId) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSelect(id);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40"
        />
        <label htmlFor={searchId} className="sr-only">
          Search neighborhoods
        </label>
        <input
          id={searchId}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search neighborhoods..."
          className="w-full rounded-lg border border-white/10 bg-white/[0.04] py-2 pl-9 pr-3 text-sm font-normal text-white placeholder:text-white/40 outline-none focus-visible:border-[#3B82F6] focus-visible:bg-white/[0.07]"
        />
      </div>

      <div className="relative w-full overflow-hidden rounded-xl border border-white/10 bg-[#0E0F13]">
        <div className="relative" style={{ aspectRatio: `${MAP_WIDTH} / ${MAP_HEIGHT}` }}>
          <svg
            viewBox={MAP_VIEWBOX}
            className="absolute inset-0 h-full w-full"
            role="group"
            aria-label="Select a neighborhood to see its resale activity"
          >
            <path
              d={RIVER_PATH}
              fill="none"
              stroke="#262A33"
              strokeWidth={3}
              aria-hidden="true"
            />
            {regions.map((region) => {
              const isSelected = region.id === selectedId;
              const isPreview = region.id === previewId && !isSelected;
              return (
                <path
                  key={region.id}
                  d={region.path}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isSelected}
                  aria-label={`${region.name} neighborhood${
                    isSelected ? ', selected' : ''
                  }`}
                  onClick={() => onSelect(region.id)}
                  onKeyDown={(e) => handleKeyDown(e, region.id)}
                  onMouseEnter={() => onPreview(region.id)}
                  onMouseLeave={() => onPreview(null)}
                  onFocus={() => onPreview(region.id)}
                  onBlur={() => onPreview(null)}
                  fill={pathFill(isSelected, isPreview)}
                  fillOpacity={pathFillOpacity(isSelected)}
                  stroke={pathStroke(isSelected, isPreview)}
                  strokeWidth={isSelected ? 2.5 : isPreview ? 2 : 1.5}
                  strokeDasharray={isPreview ? '5 4' : undefined}
                  strokeLinejoin="round"
                  style={{ cursor: 'pointer' }}
                />
              );
            })}
            {regions.map((region) => {
              const localX = (region.centroid.x / 100) * MAP_WIDTH;
              const localY = (region.centroid.y / 100) * MAP_HEIGHT - 22;
              return (
                <text
                  key={region.id}
                  x={localX}
                  y={localY}
                  textAnchor="middle"
                  className="pointer-events-none select-none"
                  fill={region.id === selectedId ? '#FFFFFF' : 'rgba(255,255,255,0.8)'}
                  fontSize={9}
                  fontWeight={500}
                >
                  {region.name}
                </text>
              );
            })}
          </svg>

          <div className="pointer-events-none absolute inset-0">
            {regions.map((region) => {
              const isSelected = region.id === selectedId;
              if (!isSelected) return null;
              return (
                <div
                  key={region.id}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: `${region.centroid.x}%`,
                    top: `${region.centroid.y}%`,
                  }}
                >
                  <MapPin
                    className="h-6 w-6 fill-[#3B82F6] text-[#0B0B0F] drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                </div>
              );
            })}
          </div>
        </div>

        <div
          id={liveRegionId}
          aria-live="polite"
          className="border-t border-white/10 bg-white/[0.02] px-4 py-2.5 text-xs font-medium text-white/70"
        >
          {isPreviewing
            ? `Previewing ${activeRegion?.name} — click or press Enter to select`
            : `Showing ${activeRegion?.name}`}
        </div>
      </div>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Jump to a neighborhood">
        {filteredRegions.length === 0 ? (
          <p className="text-sm font-normal text-white/50">No neighborhood matches &ldquo;{query}&rdquo;.</p>
        ) : (
          filteredRegions.map((region) => {
            const isSelected = region.id === selectedId;
            return (
              <button
                key={region.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => onSelect(region.id)}
                onMouseEnter={() => onPreview(region.id)}
                onMouseLeave={() => onPreview(null)}
                onFocus={() => onPreview(region.id)}
                onBlur={() => onPreview(null)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors focus-visible:border-[#3B82F6] focus-visible:bg-[#3B82F6]/15 focus-visible:text-white ${
                  isSelected
                    ? 'border-[#3B82F6] bg-[#3B82F6]/20 text-white'
                    : 'border-white/15 bg-transparent text-white/70 hover:border-white/30 hover:text-white'
                }`}
              >
                {region.name}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
