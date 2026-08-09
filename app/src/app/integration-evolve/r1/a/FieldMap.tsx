'use client';

import { Fragment, useState } from 'react';
import { Ban, ChevronRight, TriangleAlert } from 'lucide-react';
import type { FieldRow } from './data';
import { RECORD } from './data';

type Props = { rows: FieldRow[] };

function RowDetail({
  row,
  choiceId,
  onChoose,
}: {
  row: FieldRow;
  choiceId: string;
  onChoose: (variantId: string) => void;
}) {
  const variants = row.variants;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-wider text-zinc-600">Rule applied on the way</p>
        <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-800">{row.rule}</p>

        {variants ? (
          <fieldset className="mt-5">
            <legend className="text-xs uppercase tracking-wider text-zinc-600">
              How this one field converts
            </legend>
            <div className="mt-3 space-y-3">
              {variants.map((variant) => (
                <label
                  key={variant.id}
                  className="flex cursor-pointer items-start gap-3 rounded-md bg-white px-3 py-2.5 ring-1 ring-zinc-200 transition-colors hover:ring-violet-400 motion-reduce:transition-none"
                >
                  <input
                    type="radio"
                    name={`variant-${row.id}`}
                    value={variant.id}
                    checked={choiceId === variant.id}
                    onChange={() => onChoose(variant.id)}
                    className="mt-1 size-4 shrink-0 accent-violet-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:ring-offset-2"
                  />
                  <span className="min-w-0">
                    <span className="block text-sm font-medium leading-6 text-zinc-900">
                      {variant.label}
                    </span>
                    <span className="mt-0.5 block text-xs leading-5 text-zinc-600">{variant.note}</span>
                    <span
                      className="mt-1 block break-words text-xs text-violet-800"
                      style={{ fontFamily: 'var(--font-mono)' }}
                    >
                      {variant.target}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        ) : null}
      </div>

      <div className="min-w-0">
        <p className="text-xs uppercase tracking-wider text-zinc-600">What does not survive the trip</p>
        <ul className="mt-2 space-y-3">
          {row.loses.map((item) => (
            <li key={item} className="flex items-start gap-2">
              <TriangleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-violet-700" />
              <span className="min-w-0 max-w-xl text-sm leading-6 text-zinc-800">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function FieldMap({ rows }: Props) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [switchedOff, setSwitchedOff] = useState<string[]>([]);
  const [choices, setChoices] = useState<Record<string, string>>({});

  const isOn = (id: string) => !switchedOff.includes(id);

  const chosenVariantId = (row: FieldRow) =>
    choices[row.id] ?? (row.variants ? row.variants[0].id : '');

  const deliveredOf = (row: FieldRow) => {
    const variants = row.variants;
    if (!variants) return row.delivered;
    const picked = variants.find((variant) => variant.id === chosenVariantId(row));
    return picked ? picked.target : row.delivered;
  };

  const toggleRow = (id: string) => setOpenId((prev) => (prev === id ? null : id));

  const toggleSwitch = (id: string) =>
    setSwitchedOff((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));

  const onCount = rows.length - switchedOff.length;

  return (
    <>
      <section aria-labelledby="field-map-heading" className="mt-16">
        <h2
          id="field-map-heading"
          className="text-xl font-semibold tracking-tight md:text-2xl"
          style={{ fontFamily: 'var(--font-display-mono)' }}
        >
          Field map
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-700">
          Left is the Salesforce field, right is where it lands. The middle column is the part that is
          easy to miss: the value rarely arrives as it left. Open a row for the rule and its edge cases.
          Every control here touches one field and nothing else.
        </p>
        <p className="mt-4 text-sm tabular-nums text-zinc-700">
          <span className="font-medium">{onCount}</span> of {rows.length} fields switched on
        </p>

        <div className="mt-4 overflow-x-auto rounded-lg border border-zinc-200 md:overflow-x-visible">
          <table className="w-full min-w-[760px] table-fixed border-collapse text-left md:min-w-0">
            <caption className="border-b border-zinc-200 bg-zinc-50 px-4 py-3 text-left text-xs leading-5 text-zinc-600">
              Field map for the Salesforce to Tessera connection: source field, the rule applied on the
              way, the destination field, and the value carried for one sample Opportunity.
            </caption>
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase tracking-wider text-zinc-600">
                <th scope="col" className="w-[27%] px-4 py-3 font-medium">
                  Salesforce field
                </th>
                <th scope="col" className="w-[19%] px-4 py-3 font-medium">
                  On the way
                </th>
                <th scope="col" className="w-[22%] px-4 py-3 font-medium">
                  Tessera field
                </th>
                <th scope="col" className="w-[24%] px-4 py-3 font-medium">
                  This record
                </th>
                <th scope="col" className="w-[8%] px-3 py-3 text-center font-medium">
                  On
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const expanded = openId === row.id;
                const on = isOn(row.id);
                const detailId = `field-detail-${row.id}`;

                return (
                  <Fragment key={row.id}>
                    <tr
                      className={`border-b border-zinc-200 align-top ${on ? 'bg-white' : 'bg-zinc-50'}`}
                    >
                      <th scope="row" className="px-2 py-3 font-normal">
                        <button
                          type="button"
                          onClick={() => toggleRow(row.id)}
                          aria-expanded={expanded}
                          aria-controls={detailId}
                          className="flex w-full items-start gap-2 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-violet-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-600 motion-reduce:transition-none"
                        >
                          <ChevronRight
                            aria-hidden="true"
                            className={`mt-0.5 size-4 shrink-0 text-violet-600 transition-transform motion-reduce:transition-none ${
                              expanded ? 'rotate-90' : ''
                            }`}
                          />
                          <span className="min-w-0">
                            <span
                              className="block break-words text-[13px] leading-5 text-zinc-900"
                              style={{ fontFamily: 'var(--font-mono)' }}
                            >
                              {row.source.path}
                            </span>
                            <span className="mt-1 block text-xs leading-5 text-zinc-600">
                              {row.source.type}
                            </span>
                          </span>
                        </button>
                      </th>

                      <td className="px-4 py-4">
                        <span
                          className={`inline-block rounded-md px-2 py-1 text-xs font-medium ${
                            row.lossy ? 'bg-violet-100 text-violet-900' : 'bg-zinc-100 text-zinc-700'
                          }`}
                        >
                          {row.kindLabel}
                        </span>
                        {row.lossy ? (
                          <span className="mt-2 flex items-start gap-1.5 text-xs leading-5 text-zinc-700">
                            <TriangleAlert
                              aria-hidden="true"
                              className="mt-0.5 size-3.5 shrink-0 text-violet-700"
                            />
                            Not reversible
                          </span>
                        ) : null}
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className="block break-words text-[13px] leading-5 text-zinc-900"
                          style={{ fontFamily: 'var(--font-mono)' }}
                        >
                          {row.target.path}
                        </span>
                        <span className="mt-1 block text-xs leading-5 text-zinc-600">
                          {row.target.type}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        {on ? (
                          <>
                            <span className="block break-words text-sm leading-6 text-zinc-900">
                              {deliveredOf(row)}
                            </span>
                            <span className="mt-1 block break-words text-xs leading-5 text-zinc-600">
                              read as {row.source.sample}
                            </span>
                          </>
                        ) : (
                          <span className="flex items-start gap-1.5 text-sm leading-6 text-zinc-700">
                            <Ban aria-hidden="true" className="mt-1 size-3.5 shrink-0" />
                            Not sent
                          </span>
                        )}
                      </td>

                      <td className="px-3 py-4 text-center">
                        <input
                          type="checkbox"
                          checked={on}
                          onChange={() => toggleSwitch(row.id)}
                          aria-label={`Send ${row.source.path} to ${row.target.path}`}
                          className="size-4 accent-violet-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:ring-offset-2"
                        />
                      </td>
                    </tr>

                    <tr id={detailId} hidden={!expanded} className="border-b border-zinc-200 bg-violet-50">
                      <td colSpan={5} className="px-4 py-6">
                        <RowDetail
                          row={row}
                          choiceId={chosenVariantId(row)}
                          onChoose={(variantId) =>
                            setChoices((prev) => ({ ...prev, [row.id]: variantId }))
                          }
                        />
                      </td>
                    </tr>
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="record-heading" className="mt-16">
        <h2
          id="record-heading"
          className="text-xl font-semibold tracking-tight md:text-2xl"
          style={{ fontFamily: 'var(--font-display-mono)' }}
        >
          One record, end to end
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-700">
          {RECORD.title}, {RECORD.id}. {RECORD.received}. Left is what the connection read, right is what
          Tessera stored. The two columns are not the same text, and that difference is the connection.
        </p>

        <div className="mt-5 grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-zinc-200 bg-zinc-200 md:grid-cols-2">
          <div className="min-w-0 bg-white p-5">
            <p className="text-xs uppercase tracking-wider text-zinc-600">Read from Salesforce</p>
            <dl className="mt-4 space-y-4">
              {rows.map((row) => (
                <div key={row.id} className="min-w-0">
                  <dt
                    className="break-words text-xs leading-5 text-zinc-600"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    {row.source.path}
                  </dt>
                  <dd className="mt-0.5 break-words text-sm leading-6 text-zinc-900">
                    {row.source.sample}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="min-w-0 bg-white p-5">
            <p className="text-xs uppercase tracking-wider text-violet-800">Stored by Tessera</p>
            <dl className="mt-4 space-y-4">
              {rows.map((row) => {
                const on = isOn(row.id);
                return (
                  <div key={row.id} className="min-w-0">
                    <dt
                      className="break-words text-xs leading-5 text-zinc-600"
                      style={{ fontFamily: 'var(--font-mono)' }}
                    >
                      {row.target.path}
                    </dt>
                    {on ? (
                      <dd className="mt-0.5 break-words text-sm leading-6 text-zinc-900">
                        {deliveredOf(row)}
                      </dd>
                    ) : (
                      <dd className="mt-0.5 flex items-start gap-1.5 text-sm leading-6 text-zinc-700">
                        <Ban aria-hidden="true" className="mt-1 size-3.5 shrink-0" />
                        Not sent, this field is switched off
                      </dd>
                    )}
                  </div>
                );
              })}
            </dl>
            <p className="mt-5 border-t border-zinc-200 pt-4 text-xs leading-5 text-zinc-600">
              Nothing from the next section ever appears in this column.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
