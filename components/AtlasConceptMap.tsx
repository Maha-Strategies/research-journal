'use client';

import { useState } from 'react';
import {
  ATLAS_EDGES,
  ATLAS_NODES,
  getNode,
  getSource,
  getStatus,
  type AtlasNode,
} from '@/lib/atlas/de-sitter';

const VIEW_W = 1000;
const VIEW_H = 700;

const toX = (percent: number) => (percent / 100) * VIEW_W;
const toY = (percent: number) => (percent / 100) * VIEW_H;

/**
 * Nodes are real <button> elements positioned over an SVG edge layer, so
 * keyboard focus, focus rings, and screen-reader semantics come from the
 * platform rather than being reimplemented on SVG shapes. Below the md
 * breakpoint the positioned map is replaced by the same buttons in a grouped
 * list, which stays readable on a phone.
 */
export default function AtlasConceptMap() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = selectedId ? getNode(selectedId) : undefined;

  const toggle = (id: string) => setSelectedId((current) => (current === id ? null : id));

  const isConnected = (nodeId: string) =>
    selectedId !== null &&
    ATLAS_EDGES.some(
      (edge) =>
        (edge.from === selectedId && edge.to === nodeId) ||
        (edge.to === selectedId && edge.from === nodeId),
    );

  return (
    <div
      onKeyDown={(event) => {
        if (event.key === 'Escape' && selectedId) {
          event.stopPropagation();
          setSelectedId(null);
        }
      }}
    >
      <p className="mb-6 text-xs leading-relaxed text-zinc-500">
        Select a concept to open its definition, epistemic status, and sources. Arrows show the direction of
        dependence or derivation, not agreement — several of them mark exactly where the field disagrees.
        Press <kbd className="border border-zinc-700 px-1 font-mono text-[10px] text-zinc-400">Esc</kbd> to
        close the panel.
      </p>

      {/* MAP — md and up */}
      <div className="hidden md:block">
        <div className="relative aspect-[10/7] w-full border border-zinc-800/70 bg-[#0d0d10]">
          <svg
            viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
            className="absolute inset-0 h-full w-full"
            role="presentation"
            aria-hidden="true"
          >
            <defs>
              <marker id="atlas-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" className="fill-zinc-700" />
              </marker>
              <marker id="atlas-arrow-active" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#818cf8" />
              </marker>
            </defs>
            {ATLAS_EDGES.map((edge) => {
              const from = getNode(edge.from);
              const to = getNode(edge.to);
              if (!from || !to) return null;
              const active = selectedId === edge.from || selectedId === edge.to;
              const x1 = toX(from.x);
              const y1 = toY(from.y);
              const x2 = toX(to.x);
              const y2 = toY(to.y);
              return (
                <g key={`${edge.from}-${edge.to}`}>
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={active ? '#818cf8' : '#3f3f46'}
                    strokeWidth={active ? 2 : 1}
                    strokeOpacity={selectedId && !active ? 0.3 : 1}
                    markerEnd={active ? 'url(#atlas-arrow-active)' : 'url(#atlas-arrow)'}
                  />
                  {active && (
                    <text
                      x={(x1 + x2) / 2}
                      y={(y1 + y2) / 2 - 6}
                      textAnchor="middle"
                      className="fill-indigo-300"
                      style={{ fontSize: 13 }}
                    >
                      {edge.label}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          {ATLAS_NODES.map((node) => (
            <NodeButton
              key={node.id}
              node={node}
              selected={selectedId === node.id}
              dimmed={selectedId !== null && selectedId !== node.id && !isConnected(node.id)}
              positioned
              onSelect={toggle}
            />
          ))}
        </div>
      </div>

      {/* LIST — below md */}
      <div className="md:hidden">
        <ul className="flex flex-col gap-2">
          {ATLAS_NODES.map((node) => (
            <li key={node.id}>
              <NodeButton
                node={node}
                selected={selectedId === node.id}
                dimmed={false}
                onSelect={toggle}
              />
            </li>
          ))}
        </ul>
      </div>

      <DetailPanel node={selected} onSelect={setSelectedId} onClose={() => setSelectedId(null)} />
    </div>
  );
}

function NodeButton({
  node,
  selected,
  dimmed,
  positioned,
  onSelect,
}: {
  node: AtlasNode;
  selected: boolean;
  dimmed: boolean;
  positioned?: boolean;
  onSelect: (id: string) => void;
}) {
  const status = getStatus(node.status);
  return (
    <button
      type="button"
      onClick={() => onSelect(node.id)}
      aria-expanded={selected}
      aria-controls="atlas-node-detail"
      style={positioned ? { left: `${node.x}%`, top: `${node.y}%` } : undefined}
      className={[
        positioned
          ? 'absolute w-[19%] -translate-x-1/2 -translate-y-1/2 px-2 py-2 text-center text-[11px]'
          : 'flex min-h-11 w-full items-center gap-2 px-3 py-3 text-left text-xs',
        'z-10 border leading-tight transition-colors',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0c]',
        selected
          ? 'border-indigo-400 bg-indigo-400/15 text-white'
          : 'border-zinc-700 bg-[#121214] text-zinc-300 hover:border-indigo-400/60 hover:text-white',
        dimmed ? 'opacity-40' : 'opacity-100',
      ].join(' ')}
    >
      <span
        className={`${positioned ? 'mx-auto mb-1 block' : 'shrink-0'} h-1.5 w-1.5 rounded-full ${status.dotClass}`}
        aria-hidden="true"
      />
      <span className={positioned ? 'block' : ''}>{node.label}</span>
      <span className="sr-only"> — {status.label}</span>
    </button>
  );
}

function DetailPanel({
  node,
  onSelect,
  onClose,
}: {
  node: AtlasNode | undefined;
  onSelect: (id: string) => void;
  onClose: () => void;
}) {
  return (
    <section
      id="atlas-node-detail"
      aria-live="polite"
      aria-label="Concept detail"
      className="mt-6 border border-zinc-800 bg-[#121214] p-5 md:p-8"
    >
      {!node ? (
        <p className="text-sm text-zinc-500">
          No concept selected. Choose one from the map above to see its definition, why it matters, its
          epistemic status, and its sources.
        </p>
      ) : (
        <ConceptDetail node={node} onSelect={onSelect} onClose={onClose} />
      )}
    </section>
  );
}

function ConceptDetail({
  node,
  onSelect,
  onClose,
}: {
  node: AtlasNode;
  onSelect: (id: string) => void;
  onClose: () => void;
}) {
  const status = getStatus(node.status);
  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <h3 className="text-xl font-light tracking-wide text-white">{node.label}</h3>
          <p className={`mt-2 inline-block border px-2 py-1 font-mono text-[10px] uppercase tracking-widest ${status.badgeClass}`}>
            {status.label}
          </p>
          {node.contextual && (
            <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-zinc-500">
              Orientation node · not directly cited in the source map
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="border border-zinc-700 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-zinc-400 transition-colors hover:border-white hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
        >
          Close
        </button>
      </div>

      <dl className="mt-5 space-y-5 text-sm leading-relaxed text-zinc-400">
        <div>
          <dt className="mb-1 font-mono text-[10px] uppercase tracking-widest text-zinc-500">In plain language</dt>
          <dd>{node.definition}</dd>
        </div>
        <div>
          <dt className="mb-1 font-mono text-[10px] uppercase tracking-widest text-zinc-500">Why it matters</dt>
          <dd>{node.whyItMatters}</dd>
        </div>
        {node.notEstablished && (
          <div>
            <dt className="mb-1 font-mono text-[10px] uppercase tracking-widest text-amber-300">
              What this does not establish
            </dt>
            <dd className="border-l border-amber-400/40 pl-4 text-zinc-400">{node.notEstablished}</dd>
          </div>
        )}
        <div>
          <dt className="mb-2 font-mono text-[10px] uppercase tracking-widest text-zinc-500">Related concepts</dt>
          <dd className="flex flex-wrap gap-2">
            {node.related.map((id) => {
              const related = getNode(id);
              if (!related) return null;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => onSelect(id)}
                  className="border border-zinc-700 px-2 py-1 text-xs text-zinc-300 transition-colors hover:border-indigo-400 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                >
                  {related.label}
                </button>
              );
            })}
          </dd>
        </div>
        <div>
          <dt className="mb-2 font-mono text-[10px] uppercase tracking-widest text-zinc-500">Sources</dt>
          <dd>
            {node.sources.length === 0 ? (
              <p className="text-xs text-zinc-500">
                No citation from the source map&rsquo;s verified set applies directly to this orientation node.
                None has been supplied rather than attaching one that the source does not support.
              </p>
            ) : (
              <ul className="space-y-2">
                {node.sources.map((id) => {
                  const source = getSource(id);
                  if (!source) return null;
                  return (
                    <li key={id} className="text-xs leading-relaxed text-zinc-400">
                      {source.url ? (
                        <a href={source.url} target="_blank" rel="noreferrer" className="text-indigo-300 underline">
                          {source.label} ↗
                        </a>
                      ) : (
                        <span className="text-zinc-300">{source.label}</span>
                      )}
                      {source.authors && <span> · {source.authors}</span>}
                      {source.identifier && <span> · {source.identifier}</span>}
                      {source.journal && <span> · {source.journal}</span>}
                    </li>
                  );
                })}
              </ul>
            )}
          </dd>
        </div>
      </dl>
    </div>
  );
}
