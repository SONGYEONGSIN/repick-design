"use client";

import { SEVERITY_ORDER, filterAndSortAlerts, type AlertFilters } from "../lib/data";
import { AlertCard } from "./AlertCard";
import { Card, CardHeader } from "./ui";
import { FilterBar } from "./FilterBar";

/**
 * Builds its own rows from `filters` (period + severity set + status + category + query + sort)
 * — a pure function, not a cache of some other widget's selection. `pinnedId`/`onPin` is the one
 * piece of selection state this component shares with anything else, and it flows in exactly one
 * direction: a click here sets the page's `pinnedId`, which only InspectorPanel reads back.
 */
export function AlertFeed({
  filters,
  onFiltersChange,
  pinnedId,
  onPin,
}: {
  filters: AlertFilters;
  onFiltersChange: (next: AlertFilters) => void;
  pinnedId: string;
  onPin: (id: string) => void;
}) {
  const rows = filterAndSortAlerts(filters);

  function toggleSeverity(s: (typeof SEVERITY_ORDER)[number]) {
    const next = new Set(filters.severities);
    if (next.has(s)) {
      if (next.size > 1) next.delete(s);
    } else {
      next.add(s);
    }
    onFiltersChange({ ...filters, severities: next });
  }

  return (
    <Card className="flex min-w-0 flex-col">
      <CardHeader title="Alert feed" subtitle={`${rows.length} alert${rows.length === 1 ? "" : "s"} match the current filters`} />
      <FilterBar
        query={filters.query}
        onQueryChange={(query) => onFiltersChange({ ...filters, query })}
        severities={filters.severities}
        onToggleSeverity={toggleSeverity}
        status={filters.status}
        onStatusChange={(status) => onFiltersChange({ ...filters, status })}
        category={filters.category}
        onCategoryChange={(category) => onFiltersChange({ ...filters, category })}
        sort={filters.sort}
        onSortChange={(sort) => onFiltersChange({ ...filters, sort })}
      />
      <div className="min-w-0 flex-1 px-3 py-3 sm:px-4">
        {rows.length === 0 ? (
          <p className="px-2 py-8 text-center text-sm text-zinc-500">No alerts match the current filters.</p>
        ) : (
          <ul className="flex min-w-0 flex-col gap-2">
            {rows.map((alert) => (
              <AlertCard key={alert.id} alert={alert} pinned={alert.id === pinnedId} onPin={onPin} />
            ))}
          </ul>
        )}
      </div>
    </Card>
  );
}
