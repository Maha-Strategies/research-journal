'use client';

// Form primitives for the builder.
//
// Client components only so that useActionState can render a validation failure
// beside the field that caused it. All validation happens on the server — these
// render results, they do not decide them.
//
// The visual language matches the public atlas pages rather than a generic
// admin theme: same borders, same mono labels, same restraint. The builder is
// where editorial judgement happens, and a calm surface is part of that.

import { useActionState } from 'react';
import type { ReactNode } from 'react';

import type { ActionResult } from './actions';

export const LABEL = 'block font-mono text-[10px] uppercase tracking-widest text-zinc-600';
export const INPUT =
  'mt-2 w-full border border-zinc-800 bg-[#121214] px-3 py-2 text-sm text-zinc-200 outline-none focus:border-cyan-800';
export const CARD = 'border border-zinc-800 bg-[#121214] p-5';
export const SECTION_HEADING =
  'border-b border-zinc-800 pb-3 font-mono text-[10px] uppercase tracking-widest text-zinc-500';

/** A labelled field with an optional note explaining what the field is for. */
export function Field({
  name,
  label,
  note,
  children,
}: {
  name: string;
  label: string;
  note?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={name} className={LABEL}>
        {label}
      </label>
      {children}
      {note ? <p className="mt-2 text-xs leading-relaxed text-zinc-600">{note}</p> : null}
    </div>
  );
}

export function TextField({
  name,
  label,
  note,
  defaultValue = '',
  required = false,
  placeholder,
  type = 'text',
}: {
  name: string;
  label: string;
  note?: string;
  defaultValue?: string;
  required?: boolean;
  placeholder?: string;
  type?: string;
}) {
  return (
    <Field name={name} label={label} note={note}>
      <input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
        placeholder={placeholder}
        className={INPUT}
      />
    </Field>
  );
}

export function TextArea({
  name,
  label,
  note,
  defaultValue = '',
  required = false,
  rows = 3,
  placeholder,
}: {
  name: string;
  label: string;
  note?: string;
  defaultValue?: string;
  required?: boolean;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <Field name={name} label={label} note={note}>
      <textarea
        id={name}
        name={name}
        rows={rows}
        defaultValue={defaultValue}
        required={required}
        placeholder={placeholder}
        className={`${INPUT} font-sans leading-relaxed`}
      />
    </Field>
  );
}

export function SelectField({
  name,
  label,
  note,
  options,
  defaultValue,
}: {
  name: string;
  label: string;
  note?: string;
  options: readonly string[];
  defaultValue?: string;
}) {
  return (
    <Field name={name} label={label} note={note}>
      <select id={name} name={name} defaultValue={defaultValue} className={INPUT}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </Field>
  );
}

/**
 * A form bound to a server action, rendering its result inline.
 *
 * `resetOnSuccess` remounts the fields after a successful submit by keying on
 * the result, so the "add a source" form empties itself rather than leaving the
 * previous entry in place to be submitted twice.
 */
export function ActionForm({
  action,
  submitLabel,
  children,
  resetOnSuccess = false,
  danger = false,
}: {
  action: (prev: ActionResult | null, formData: FormData) => Promise<ActionResult>;
  submitLabel: string;
  children: ReactNode;
  resetOnSuccess?: boolean;
  danger?: boolean;
}) {
  const [result, formAction, pending] = useActionState<ActionResult | null, FormData>(action, null);
  const successCount = result?.ok ? 1 : 0;

  return (
    <form action={formAction} key={resetOnSuccess ? successCount : undefined} className="grid gap-5">
      {children}

      {result ? (
        <div
          className={`border p-4 text-sm ${
            result.ok
              ? 'border-cyan-900/60 bg-cyan-950/20 text-cyan-200'
              : 'border-amber-900/60 bg-amber-950/20 text-amber-200'
          }`}
        >
          <p>{result.message}</p>
          {result.errors && result.errors.length > 0 ? (
            <ul className="mt-3 space-y-1">
              {result.errors.map((error) => (
                <li key={error} className="font-mono text-xs leading-relaxed">
                  — {error}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className={`justify-self-start border px-5 py-2.5 font-mono text-[10px] uppercase tracking-widest disabled:opacity-50 ${
          danger
            ? 'border-amber-900 bg-amber-950/30 text-amber-300 hover:bg-amber-950/60'
            : 'border-cyan-900 bg-cyan-950/30 text-cyan-300 hover:bg-cyan-950/60'
        }`}
      >
        {pending ? 'Working…' : submitLabel}
      </button>
    </form>
  );
}
