'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';

import {
  getArtifactType,
  type ArtifactTypeDescriptor,
  type RegistryArtifact,
} from '@/lib/registry';

type Capability = 'machine-readable' | 'doi';

const CAPABILITY_LABELS: { id: Capability; label: string }[] = [
  { id: 'machine-readable', label: 'Machine-readable endpoints' },
  { id: 'doi', label: 'Archived with a DOI' },
];

/**
 * The full artifact list renders on the server, so every card is present in the
 * HTML for crawlers and for readers without JavaScript. The filters below only
 * narrow what is already there.
 */
export default function RegistryList({
  artifacts,
  types,
  topics,
}: {
  artifacts: RegistryArtifact[];
  types: ArtifactTypeDescriptor[];
  topics: string[];
}) {
  const [type, setType] = useState<string | null>(null);
  const [topic, setTopic] = useState<string | null>(null);
  const [capabilities, setCapabilities] = useState<Capability[]>([]);

  const toggleCapability = (id: Capability) =>
    setCapabilities((current) =>
      current.includes(id) ? current.filter((entry) => entry !== id) : [...current, id],
    );

  const visible = useMemo(
    () =>
      artifacts.filter((artifact) => {
        if (type && artifact.type !== type) return false;
        if (topic && !artifact.topics.includes(topic)) return false;
        if (capabilities.includes('machine-readable') && artifact.machineReadable.length === 0) return false;
        if (capabilities.includes('doi') && !artifact.doi) return false;
        return true;
      }),
    [artifacts, type, topic, capabilities],
  );

  const filtersActive = Boolean(type || topic || capabilities.length);

  return (
    <div>
      <section className="mb-8 border border-zinc-800 bg-[#121214] p-5" aria-labelledby="filters-heading">
        <h3 id="filters-heading" className="mb-4 font-mono text-[10px] uppercase tracking-widest text-zinc-500">
          Filter the registry
        </h3>

        <div className="space-y-4">
          <FilterGroup label="Artifact type">
            <FilterButton active={type === null} onClick={() => setType(null)}>
              All types
            </FilterButton>
            {types.map((entry) => (
              <FilterButton key={entry.id} active={type === entry.id} onClick={() => setType(entry.id)}>
                {entry.label}
              </FilterButton>
            ))}
          </FilterGroup>

          <FilterGroup label="Topic">
            <FilterButton active={topic === null} onClick={() => setTopic(null)}>
              All topics
            </FilterButton>
            {topics.map((entry) => (
              <FilterButton key={entry} active={topic === entry} onClick={() => setTopic(entry)}>
                {entry}
              </FilterButton>
            ))}
          </FilterGroup>

          <FilterGroup label="Availability">
            {CAPABILITY_LABELS.map((entry) => (
              <FilterButton
                key={entry.id}
                active={capabilities.includes(entry.id)}
                onClick={() => toggleCapability(entry.id)}
              >
                {entry.label}
              </FilterButton>
            ))}
          </FilterGroup>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-4 border-t border-zinc-800 pt-4">
          <p aria-live="polite" className="font-mono text-[10px] uppercase tracking-widest text-zinc-400">
            Showing {visible.length} of {artifacts.length} artifacts
          </p>
          {filtersActive && (
            <button
              type="button"
              onClick={() => {
                setType(null);
                setTopic(null);
                setCapabilities([]);
              }}
              className="inline-flex min-h-11 items-center border border-zinc-700 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-zinc-300 transition-colors hover:border-white hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
            >
              Clear filters
            </button>
          )}
        </div>

        <noscript>
          <p className="mt-4 border-l border-amber-400/40 pl-3 text-xs leading-relaxed text-zinc-400">
            Filtering needs JavaScript. Every registered artifact is listed below regardless, so nothing is hidden
            from you.
          </p>
        </noscript>
      </section>

      {visible.length === 0 ? (
        <p className="border border-zinc-800 bg-[#121214] p-6 text-sm text-zinc-400">
          No registered artifact matches that combination. The registry is deliberately small — every entry is
          verified against the repository rather than listed on description alone.
        </p>
      ) : (
        <ul className="space-y-6">
          {visible.map((artifact) => (
            <li key={artifact.id}>
              <ArtifactCard artifact={artifact} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap items-center gap-2">
      <span className="mr-1 w-full font-mono text-[9px] uppercase tracking-widest text-zinc-600 sm:w-auto">
        {label}
      </span>
      {children}
    </div>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={[
        'inline-flex min-h-11 items-center border px-3 py-1 text-xs transition-colors',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#121214]',
        active
          ? 'border-indigo-400 bg-indigo-400/15 text-white'
          : 'border-zinc-700 text-zinc-300 hover:border-indigo-400/60 hover:text-white',
      ].join(' ')}
    >
      {children}
    </button>
  );
}

function ArtifactCard({ artifact }: { artifact: RegistryArtifact }) {
  const type = getArtifactType(artifact.type);

  return (
    <article
      id={artifact.id}
      className="scroll-mt-6 border border-zinc-800 bg-[#121214] p-5 transition-colors hover:border-indigo-500/30 md:p-7"
    >
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="border border-indigo-400/40 bg-indigo-400/10 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-indigo-200">
          {type.label}
        </span>
        <span className="border border-zinc-700 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-zinc-400">
          v{artifact.version}
        </span>
        {artifact.doi && (
          <span className="border border-emerald-400/40 bg-emerald-400/10 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-emerald-200">
            DOI
          </span>
        )}
      </div>

      <h3 className="text-xl font-light leading-snug text-white">
        <Link href={artifact.canonicalPath} className="hover:text-indigo-300">
          {artifact.title}
        </Link>
      </h3>

      <p className="mt-3 font-mono text-[10px] uppercase tracking-widest text-amber-300">{artifact.status}</p>
      <p className="mt-2 border-l border-amber-400/40 pl-3 text-xs leading-relaxed text-zinc-400">
        {artifact.statusNote}
      </p>

      <p className="mt-4 text-sm leading-relaxed text-zinc-400">{artifact.description}</p>

      <ul className="mt-4 flex flex-wrap gap-2">
        {artifact.features.map((feature) => (
          <li
            key={feature}
            className="border border-zinc-700 px-2 py-1 font-mono text-[9px] uppercase tracking-widest text-zinc-400"
          >
            {feature}
          </li>
        ))}
      </ul>

      <dl className="mt-6 space-y-4 text-sm leading-relaxed text-zinc-400">
        <div>
          <dt className="mb-2 font-mono text-[10px] uppercase tracking-widest text-zinc-500">Pages</dt>
          <dd className="flex flex-wrap gap-2">
            <Link
              href={artifact.canonicalPath}
              className="inline-flex min-h-11 items-center border border-zinc-700 px-3 py-1 text-xs text-zinc-300 transition-colors hover:border-indigo-400 hover:text-white"
            >
              Canonical page
            </Link>
            {artifact.relatedLinks.map((link) =>
              link.external ? (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-11 items-center border border-zinc-700 px-3 py-1 text-xs text-zinc-300 transition-colors hover:border-indigo-400 hover:text-white"
                >
                  {link.label} ↗
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="inline-flex min-h-11 items-center border border-zinc-700 px-3 py-1 text-xs text-zinc-300 transition-colors hover:border-indigo-400 hover:text-white"
                >
                  {link.label}
                </Link>
              ),
            )}
          </dd>
        </div>

        <div>
          <dt className="mb-2 font-mono text-[10px] uppercase tracking-widest text-zinc-500">
            Machine-readable ({artifact.machineReadable.length})
          </dt>
          <dd>
            <ul className="space-y-3">
              {artifact.machineReadable.map((endpoint) => (
                <li key={endpoint.path} className="text-xs leading-relaxed">
                  <a href={endpoint.path} className="inline-block py-1.5 text-indigo-300 underline">
                    {endpoint.label}
                  </a>
                  <span className="text-zinc-600"> · {endpoint.format}</span>
                  {endpoint.note && <span className="block text-zinc-500">{endpoint.note}</span>}
                </li>
              ))}
            </ul>
          </dd>
        </div>

        {artifact.doi && (
          <div>
            <dt className="mb-1 font-mono text-[10px] uppercase tracking-widest text-zinc-500">Archive</dt>
            <dd className="text-xs leading-relaxed">
              <a href={artifact.doi.doiUrl} target="_blank" rel="noreferrer" className="text-indigo-300 underline">
                DOI {artifact.doi.version} ↗
              </a>
              {artifact.doi.concept && (
                <>
                  {' · '}
                  <a
                    href={`https://doi.org/${artifact.doi.concept}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-300 underline"
                  >
                    concept DOI {artifact.doi.concept} ↗
                  </a>
                </>
              )}
              <span className="mt-1 block text-zinc-500">This DOI identifies {artifact.doi.identifies}</span>
            </dd>
          </div>
        )}

        <div>
          <dt className="mb-1 font-mono text-[10px] uppercase tracking-widest text-zinc-500">Intended use</dt>
          <dd>
            <ul className="list-disc space-y-1 pl-4 text-xs leading-relaxed text-zinc-400">
              {artifact.intendedUse.map((use) => (
                <li key={use}>{use}</li>
              ))}
            </ul>
          </dd>
        </div>

        <div>
          <dt className="mb-1 font-mono text-[10px] uppercase tracking-widest text-amber-300">
            What this does not establish
          </dt>
          <dd>
            <ul className="space-y-1 border-l border-amber-400/40 pl-4 text-xs leading-relaxed text-zinc-400">
              {artifact.exclusions.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </dd>
        </div>
      </dl>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-800 pt-4">
        <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">
          Updated {artifact.lastUpdated} · Reviewed {artifact.reviewDate} · {artifact.licenseLabel}
        </p>
        <p className="flex flex-wrap gap-2">
          {artifact.topics.map((entry) => (
            <span key={entry} className="font-mono text-[9px] uppercase tracking-widest text-zinc-600">
              {entry}
            </span>
          ))}
        </p>
      </div>
    </article>
  );
}
