'use client';

import { BadgeCheck, DollarSign, Layers, TrendingUp } from 'lucide-react';
import type { Region } from './data';

const CHART_WIDTH = 280;
const CHART_HEIGHT = 64;
const BAR_GAP = 8;
const WEEK_LABELS = ['6w ago', '5w', '4w', '3w', '2w', 'Now'] as const;

interface StatsPanelProps {
  region: Region;
}

export default function StatsPanel({ region }: StatsPanelProps) {
  const { stats } = region;
  const maxValue = Math.max(...stats.weeklyTrend);
  const barWidth = (CHART_WIDTH - BAR_GAP * (stats.weeklyTrend.length - 1)) / stats.weeklyTrend.length;

  return (
    <div className="flex flex-col gap-5 rounded-xl border border-white/10 bg-white/[0.03] p-5">
      <dl className="grid grid-cols-2 gap-x-5 gap-y-4">
        <div>
          <dt className="flex items-center gap-1.5 text-xs font-medium text-white/55">
            <Layers className="h-3.5 w-3.5 text-[#3B82F6]" aria-hidden="true" />
            <span>Active listings</span>
          </dt>
          <dd
            className="mt-1 text-2xl font-semibold text-white"
            style={{ fontFamily: 'var(--font-display-mono)' }}
          >
            {stats.activeListings.toLocaleString('en-US')}
          </dd>
        </div>
        <div>
          <dt className="flex items-center gap-1.5 text-xs font-medium text-white/55">
            <DollarSign className="h-3.5 w-3.5 text-[#3B82F6]" aria-hidden="true" />
            <span>Avg. resale price</span>
          </dt>
          <dd
            className="mt-1 text-2xl font-semibold text-white"
            style={{ fontFamily: 'var(--font-display-mono)' }}
          >
            ${stats.avgPrice}
          </dd>
        </div>
        <div>
          <dt className="flex items-center gap-1.5 text-xs font-medium text-white/55">
            <TrendingUp className="h-3.5 w-3.5 text-[#3B82F6]" aria-hidden="true" />
            <span>Top category</span>
          </dt>
          <dd className="mt-1 text-lg font-semibold text-white">{stats.topCategory}</dd>
        </div>
        <div>
          <dt className="flex items-center gap-1.5 text-xs font-medium text-white/55">
            <BadgeCheck className="h-3.5 w-3.5 text-[#3B82F6]" aria-hidden="true" />
            <span>AI-verified sellers</span>
          </dt>
          <dd className="mt-1 text-lg font-semibold text-white">{stats.verifiedSellers} nearby</dd>
        </div>
      </dl>

      <figure>
        <figcaption className="mb-2 text-xs font-medium text-white/55">
          6-week listing trend in {region.name}
        </figcaption>
        <svg
          viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT + 16}`}
          className="w-full"
          role="img"
          aria-label={`Weekly active listings in ${region.name}, over the last six weeks: ${stats.weeklyTrend.join(
            ', '
          )}, ending at ${stats.activeListings} today.`}
        >
          {stats.weeklyTrend.map((value, index) => {
            const barHeight = Math.max(4, (value / maxValue) * CHART_HEIGHT);
            const x = index * (barWidth + BAR_GAP);
            const y = CHART_HEIGHT - barHeight;
            const isLast = index === stats.weeklyTrend.length - 1;
            return (
              <g key={WEEK_LABELS[index]}>
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  rx={2}
                  fill={isLast ? '#3B82F6' : 'rgba(59,130,246,0.35)'}
                />
                <text
                  x={x + barWidth / 2}
                  y={CHART_HEIGHT + 13}
                  textAnchor="middle"
                  fontSize={8}
                  fontWeight={400}
                  fill="rgba(255,255,255,0.65)"
                >
                  {WEEK_LABELS[index]}
                </text>
              </g>
            );
          })}
        </svg>
      </figure>
    </div>
  );
}
