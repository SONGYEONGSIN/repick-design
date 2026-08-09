'use client'

import { useState } from 'react'
import { Ban, Check } from 'lucide-react'

import {
  ASSET_BY_ID,
  ASSET_ORDER,
  INK_ONLY,
  SURFACE_BY_ID,
  SURFACE_ORDER,
  type AssetId,
  type SurfaceId,
} from './data'
import { AssetArt } from './marks'

const ZOOM_STEPS = [1, 2, 4]

export function MediaKitStage() {
  const [assetId, setAssetId] = useState<AssetId>('lockup-primary')
  const [surfaceId, setSurfaceId] = useState<SurfaceId>('paper')
  const [zoom, setZoom] = useState(1)

  const asset = ASSET_BY_ID[assetId]
  const surface = SURFACE_BY_ID[surfaceId]
  const cleared = asset.approved.includes(surface.id)
  const guideColour = surface.tone === 'dark' ? 'rgba(255,255,255,0.55)' : 'rgba(11,15,20,0.32)'

  return (
    <>
      <section id="stage" aria-labelledby="stage-h" className="border-b border-zinc-200">
        <div className="mx-auto w-full max-w-6xl px-6 py-14 md:px-10 md:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="min-w-0">
              <h2
                id="stage-h"
                className="text-3xl font-medium tracking-tight text-zinc-900 md:text-4xl"
                style={{ fontFamily: 'var(--font-display-wide)' }}
              >
                Surface preview
              </h2>
              <p className="mt-3 max-w-xl font-normal text-zinc-600">
                Each asset is cleared for a named set of surfaces. Move it onto the surface you are actually printing
                or coding against, and the sheet tells you whether it is allowed there.
              </p>
            </div>
            <p
              className="text-sm font-normal tabular-nums text-zinc-600"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              {asset.code} · {asset.file}
            </p>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
            <div className="min-w-0">
              <div
                className="flex h-[300px] items-center justify-center overflow-hidden rounded-2xl border border-zinc-200 transition-colors duration-300 motion-reduce:transition-none sm:h-[380px]"
                style={{ backgroundColor: surface.hex }}
              >
                <div
                  className="transition-transform duration-300 motion-reduce:transition-none"
                  style={{ transform: `scale(${zoom})` }}
                >
                  <div
                    className="border border-dashed p-5"
                    style={{ borderColor: zoom > 1 ? guideColour : 'transparent' }}
                  >
                    <AssetArt
                      id={asset.id}
                      ink={surface.ink}
                      accent={surface.accent}
                      width={asset.width}
                      label={`${asset.name} reproduced on ${surface.name}`}
                    />
                  </div>
                </div>
              </div>
              <p className="mt-3 text-sm font-normal text-zinc-600">
                {zoom === 1
                  ? `Shown at 1x on ${surface.name}. ${surface.role}`
                  : `At ${zoom}x the dashed frame marks the minimum clear space: ${asset.clearSpace.toLowerCase()}.`}
              </p>
            </div>

            <div className="flex min-w-0 flex-col gap-6">
              <div role="group" aria-labelledby="surface-label">
                <p
                  id="surface-label"
                  className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-600"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  Surface
                </p>
                <ul className="mt-3 flex flex-col gap-2">
                  {SURFACE_ORDER.map((id) => {
                    const item = SURFACE_BY_ID[id]
                    const active = id === surfaceId
                    return (
                      <li key={`surface-${id}`} className="min-w-0">
                        <button
                          type="button"
                          aria-pressed={active}
                          onClick={() => setSurfaceId(id)}
                          className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2 text-left transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2 motion-reduce:transition-none ${
                            active ? 'border-blue-700 bg-blue-50' : 'border-zinc-200 bg-white hover:bg-zinc-50'
                          }`}
                        >
                          <span
                            className="h-7 w-7 shrink-0 rounded-md border border-zinc-300"
                            style={{ backgroundColor: item.hex }}
                          />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-medium text-zinc-900">{item.name}</span>
                            <span
                              className="block text-xs font-normal tabular-nums text-zinc-600"
                              style={{ fontFamily: 'var(--font-mono)' }}
                            >
                              {item.hex}
                            </span>
                          </span>
                          {active ? <Check className="h-4 w-4 shrink-0 text-blue-700" aria-hidden="true" /> : null}
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </div>

              <div role="group" aria-labelledby="zoom-label">
                <p
                  id="zoom-label"
                  className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-600"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  Magnification
                </p>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {ZOOM_STEPS.map((step) => {
                    const active = step === zoom
                    return (
                      <button
                        key={`zoom-${step}`}
                        type="button"
                        aria-pressed={active}
                        onClick={() => setZoom(step)}
                        className={`rounded-xl border px-3 py-2 text-sm font-medium tabular-nums transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2 motion-reduce:transition-none ${
                          active
                            ? 'border-blue-700 bg-blue-700 text-white'
                            : 'border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50'
                        }`}
                      >
                        {step}x
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="min-w-0 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                <h3 className="text-base font-semibold text-zinc-900">{asset.name}</h3>
                <dl className="mt-3 space-y-2 text-sm">
                  <div className="flex justify-between gap-3">
                    <dt className="font-normal text-zinc-600">Formats</dt>
                    <dd className="text-right font-medium text-zinc-900">{asset.formats.join(', ')}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="font-normal text-zinc-600">Minimum width</dt>
                    <dd className="text-right font-medium tabular-nums text-zinc-900">{asset.minWidth}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="font-normal text-zinc-600">Clear space</dt>
                    <dd className="text-right font-medium text-zinc-900">{asset.clearSpace}</dd>
                  </div>
                </dl>
                <p className="mt-4 flex items-start gap-2 rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm">
                  {cleared ? (
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-zinc-900" aria-hidden="true" />
                  ) : (
                    <Ban className="mt-0.5 h-4 w-4 shrink-0 text-zinc-900" aria-hidden="true" />
                  )}
                  <span className="min-w-0 font-normal text-zinc-900">
                    <span className="font-medium">{cleared ? 'Cleared' : 'Not cleared'}</span>
                    {cleared ? ` for ${surface.name}.` : ` for ${surface.name}. ${asset.fallback}`}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="manifest" aria-labelledby="manifest-h" className="border-b border-zinc-200 bg-zinc-50">
        <div className="mx-auto w-full max-w-6xl px-6 py-14 md:px-10 md:py-20">
          <h2
            id="manifest-h"
            className="text-3xl font-medium tracking-tight text-zinc-900 md:text-4xl"
            style={{ fontFamily: 'var(--font-display-wide)' }}
          >
            Asset manifest
          </h2>
          <p className="mt-3 max-w-2xl font-normal text-zinc-600">
            Six drawn assets, eighteen files, one archive:{' '}
            <span className="tabular-nums text-zinc-900" style={{ fontFamily: 'var(--font-mono)' }}>
              halyard-brand-kit-4.2.zip
            </span>
            . Choose any asset name to send it to the surface preview above.
          </p>

          <div className="mt-8 overflow-x-auto md:overflow-x-visible">
            <table className="w-full min-w-[46rem] table-fixed border-collapse text-left md:min-w-0">
              <caption className="pb-4 text-left text-sm font-normal text-zinc-600">
                Halyard drawn assets with formats, reproduction limits and cleared surfaces.
              </caption>
              <colgroup>
                <col className="w-[21%]" />
                <col className="w-[16%]" />
                <col className="w-[14%]" />
                <col className="w-[23%]" />
                <col className="w-[26%]" />
              </colgroup>
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="border-b border-zinc-300 pb-3 pr-3 text-xs font-medium uppercase tracking-[0.14em] text-zinc-600"
                  >
                    Asset
                  </th>
                  <th
                    scope="col"
                    className="border-b border-zinc-300 px-3 pb-3 text-xs font-medium uppercase tracking-[0.14em] text-zinc-600"
                  >
                    Formats
                  </th>
                  <th
                    scope="col"
                    className="border-b border-zinc-300 px-3 pb-3 text-xs font-medium uppercase tracking-[0.14em] text-zinc-600"
                  >
                    Minimum
                  </th>
                  <th
                    scope="col"
                    className="border-b border-zinc-300 px-3 pb-3 text-xs font-medium uppercase tracking-[0.14em] text-zinc-600"
                  >
                    Cleared surfaces
                  </th>
                  <th
                    scope="col"
                    className="border-b border-zinc-300 px-3 pb-3 text-xs font-medium uppercase tracking-[0.14em] text-zinc-600"
                  >
                    Use for
                  </th>
                </tr>
              </thead>
              <tbody>
                {ASSET_ORDER.map((id) => {
                  const item = ASSET_BY_ID[id]
                  const active = id === assetId
                  return (
                    <tr key={`row-${id}`} className={active ? 'bg-blue-50' : 'bg-transparent'}>
                      <th scope="row" className="border-b border-zinc-200 py-4 pr-3 align-top font-normal">
                        <button
                          type="button"
                          onClick={() => setAssetId(id)}
                          aria-current={active ? 'true' : undefined}
                          className="block w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2"
                        >
                          <span
                            className="block text-xs font-normal tabular-nums text-zinc-600"
                            style={{ fontFamily: 'var(--font-mono)' }}
                          >
                            {item.code}
                          </span>
                          <span
                            className={`mt-1 block text-sm font-medium ${
                              active ? 'text-blue-800 underline underline-offset-4' : 'text-zinc-900'
                            }`}
                          >
                            {item.name}
                          </span>
                          <span
                            className="mt-1 block break-words text-xs font-normal text-zinc-600"
                            style={{ fontFamily: 'var(--font-mono)' }}
                          >
                            {item.file}
                          </span>
                        </button>
                      </th>
                      <td className="border-b border-zinc-200 px-3 py-4 align-top">
                        <ul className="flex flex-wrap gap-1">
                          {item.formats.map((format) => (
                            <li
                              key={`${item.id}-${format}`}
                              className="rounded border border-zinc-200 bg-white px-1.5 py-0.5 text-xs font-normal tabular-nums text-zinc-600"
                              style={{ fontFamily: 'var(--font-mono)' }}
                            >
                              {format}
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td className="border-b border-zinc-200 px-3 py-4 align-top text-sm font-normal tabular-nums text-zinc-600">
                        {item.minWidth}
                      </td>
                      <td className="border-b border-zinc-200 px-3 py-4 align-top">
                        <ul className="flex flex-wrap gap-1.5">
                          {item.approved.map((sid) => (
                            <li
                              key={`${item.id}-${sid}`}
                              className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-2 py-0.5 text-xs font-normal text-zinc-600"
                            >
                              <span
                                className="h-2.5 w-2.5 rounded-full border border-zinc-300"
                                style={{ backgroundColor: SURFACE_BY_ID[sid].hex }}
                              />
                              {SURFACE_BY_ID[sid].name}
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td className="border-b border-zinc-200 px-3 py-4 align-top text-sm font-normal leading-relaxed text-zinc-600">
                        {item.useFor}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section aria-labelledby="colour-h" className="border-b border-zinc-200">
        <div className="mx-auto w-full max-w-6xl px-6 py-14 md:px-10 md:py-20">
          <h2
            id="colour-h"
            className="text-3xl font-medium tracking-tight text-zinc-900 md:text-4xl"
            style={{ fontFamily: 'var(--font-display-wide)' }}
          >
            Colour
          </h2>
          <p className="mt-3 max-w-2xl font-normal text-zinc-600">
            Five surfaces and one ink. Choosing a surface here also loads it into the preview, so a colour is never
            approved in the abstract, only underneath a specific asset.
          </p>

          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SURFACE_ORDER.map((id) => {
              const item = SURFACE_BY_ID[id]
              const active = id === surfaceId
              return (
                <li key={`swatch-${id}`} className="min-w-0">
                  <button
                    type="button"
                    aria-pressed={active}
                    onClick={() => setSurfaceId(id)}
                    className={`block h-full w-full overflow-hidden rounded-2xl border text-left transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2 motion-reduce:transition-none ${
                      active ? 'border-blue-700' : 'border-zinc-200 hover:border-zinc-400'
                    }`}
                  >
                    <span className="block h-24 w-full border-b border-zinc-200" style={{ backgroundColor: item.hex }} />
                    <span className="block bg-white p-4">
                      <span className="flex items-center justify-between gap-3">
                        <span className="truncate text-sm font-medium text-zinc-900">{item.name}</span>
                        <span
                          className="shrink-0 text-xs font-normal tabular-nums text-zinc-600"
                          style={{ fontFamily: 'var(--font-mono)' }}
                        >
                          {item.hex}
                        </span>
                      </span>
                      <span className="mt-2 block text-sm font-normal leading-relaxed text-zinc-600">{item.role}</span>
                      {active ? (
                        <span className="mt-3 flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.16em] text-blue-800">
                          <Check className="h-3.5 w-3.5" aria-hidden="true" />
                          In the preview
                        </span>
                      ) : null}
                    </span>
                  </button>
                </li>
              )
            })}

            <li className="min-w-0">
              <div className="h-full overflow-hidden rounded-2xl border border-zinc-200">
                <span className="block h-24 w-full border-b border-zinc-200" style={{ backgroundColor: INK_ONLY.hex }} />
                <div className="bg-white p-4">
                  <p className="flex items-center justify-between gap-3">
                    <span className="truncate text-sm font-medium text-zinc-900">{INK_ONLY.name}</span>
                    <span
                      className="shrink-0 text-xs font-normal tabular-nums text-zinc-600"
                      style={{ fontFamily: 'var(--font-mono)' }}
                    >
                      {INK_ONLY.hex}
                    </span>
                  </p>
                  <p className="mt-2 text-sm font-normal leading-relaxed text-zinc-600">{INK_ONLY.role}</p>
                  <p className="mt-3 flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.16em] text-zinc-900">
                    <Ban className="h-3.5 w-3.5" aria-hidden="true" />
                    Not a surface
                  </p>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </section>
    </>
  )
}
