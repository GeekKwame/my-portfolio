import { memo, useEffect, useState } from 'react';
import Link from './Link';
import { ARCHITECTURE_ORDER, ARCHITECTURE_TRACES } from '../data/architectureTraces';
import { projectHref } from '../data/projects';

const ArchitectureLab = memo(function ArchitectureLab({ initialSlug = 'file-service', lockedSlug = null }) {
  const activeSlug = lockedSlug || initialSlug;
  const [selectedSlug, setSelectedSlug] = useState(activeSlug);
  const currentSlug = lockedSlug || selectedSlug;
  const system = ARCHITECTURE_TRACES[currentSlug] || ARCHITECTURE_TRACES['file-service'];

  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);

  const scenario = system.scenarios[scenarioIndex] || system.scenarios[0];
  const currentStep = scenario.steps[stepIndex] || scenario.steps[0];
  const activeNode = system.nodes.find((n) => n.id === currentStep.nodeId) || system.nodes[0];

  function selectSystem(slug) {
    setSelectedSlug(slug);
    setScenarioIndex(0);
    setStepIndex(0);
    setPlaying(false);
  }

  function selectScenario(idx) {
    setScenarioIndex(idx);
    setStepIndex(0);
    setPlaying(false);
  }

  function selectNode(nodeId) {
    setPlaying(false);
    const matchingStepIndex = scenario.steps.findIndex((s) => s.nodeId === nodeId);
    if (matchingStepIndex !== -1) {
      setStepIndex(matchingStepIndex);
    }
  }

  useEffect(() => {
    if (!playing) return undefined;
    const timer = setInterval(() => {
      setStepIndex((prev) => {
        if (prev + 1 < scenario.steps.length) return prev + 1;
        setPlaying(false);
        return prev;
      });
    }, 1800);
    return () => clearInterval(timer);
  }, [playing, scenario.steps.length]);

  const togglePlay = () => {
    if (playing) {
      setPlaying(false);
    } else {
      if (stepIndex >= scenario.steps.length - 1) setStepIndex(0);
      setPlaying(true);
    }
  };

  return (
    <div
      className="rounded-2xl border border-rule-strong bg-paper-raised overflow-hidden"
      role="region"
      aria-label={`Interactive system architecture inspector: ${system.title}`}
    >
      {/* Top Blueprint Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-rule bg-paper-sunken px-5 py-3.5 sm:px-7">
        <div className="flex items-center gap-2.5">
          <span className="h-2 w-2 rounded-full bg-signal" aria-hidden="true" />
          <span className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-ink">
            System Architecture &amp; Request-Flow Inspector
          </span>
        </div>
        <span className="font-mono text-xs text-accent-strong">{system.badge}</span>
      </div>

      {/* System Selector Tabs (shown when not locked to a single case study) */}
      {!lockedSlug && (
        <div
          className="flex flex-wrap items-center gap-2 border-b border-rule px-5 py-3.5 sm:px-7"
          role="group"
          aria-label="Select a featured system architecture"
        >
          <span className="font-mono text-xs uppercase tracking-[0.08em] text-ink-muted mr-2">System:</span>
          {ARCHITECTURE_ORDER.map((slug, idx) => {
            const item = ARCHITECTURE_TRACES[slug];
            const active = slug === currentSlug;
            return (
              <button
                key={slug}
                type="button"
                aria-pressed={active}
                onClick={() => selectSystem(slug)}
                className={`min-h-[38px] rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                  active
                    ? 'border-ink bg-ink text-paper'
                    : 'border-rule-strong bg-paper text-ink-muted hover:border-ink/50 hover:text-ink'
                }`}
              >
                <span className={`font-mono mr-1.5 ${active ? 'text-paper' : 'text-accent-strong'}`}>{String(idx + 1).padStart(2, '0')}</span>
                {item.shortTitle}
              </button>
            );
          })}
        </div>
      )}

      <div className="p-5 sm:p-7">
        {/* System Summary & Verified Metrics Row */}
        <div className="flex flex-wrap items-start justify-between gap-4 pb-6 border-b border-rule">
          <div className="max-w-2xl">
            <h3 className="text-xl sm:text-2xl text-ink">{system.title}</h3>
            <p className="mt-1 text-sm text-ink-muted">{system.subtitle}</p>
          </div>
          {!lockedSlug && (
            <Link to={projectHref(system.slug)} className="btn-secondary !min-h-[38px] !px-4 !text-xs shrink-0">
              Full case study <span aria-hidden="true">→</span>
            </Link>
          )}
        </div>

        <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {system.metrics.map((m) => (
            <div key={m.label} className="rounded-xl border border-rule bg-paper p-3">
              <dt className="font-mono text-[0.6875rem] uppercase tracking-[0.06em] text-ink-muted">{m.label}</dt>
              <dd className="mt-1 font-mono text-xs sm:text-sm font-semibold text-ink">{m.value}</dd>
            </div>
          ))}
        </dl>

        {/* Scenario Selector & Trace Playback Controls */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Trace scenario">
            <span className="font-mono text-xs uppercase tracking-[0.08em] text-ink-muted mr-1">Trace flow:</span>
            {system.scenarios.map((sc, idx) => {
              const active = idx === scenarioIndex;
              return (
                <button
                  key={sc.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => selectScenario(idx)}
                  className={`min-h-[36px] rounded-lg border px-3 py-1 text-xs font-medium transition-colors ${
                    active
                      ? 'border-accent bg-ink text-paper'
                      : 'border-rule-strong bg-paper text-ink-soft hover:border-ink/50'
                  }`}
                >
                  {sc.name}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2" role="group" aria-label="Trace playback controls">
            <button
              type="button"
              disabled={stepIndex === 0}
              onClick={() => { setPlaying(false); setStepIndex((s) => Math.max(0, s - 1)); }}
              aria-label="Previous trace step"
              className="min-h-[36px] rounded-lg border border-rule-strong bg-paper px-3 text-xs font-mono text-ink disabled:opacity-40 hover:border-ink/50"
            >
              ← Prev
            </button>
            <button
              type="button"
              onClick={togglePlay}
              aria-pressed={playing}
              className="min-h-[36px] rounded-lg border border-ink bg-ink px-3.5 text-xs font-semibold text-paper hover:opacity-90"
            >
              {playing ? 'Pause trace' : 'Simulate trace ▸'}
            </button>
            <button
              type="button"
              disabled={stepIndex >= scenario.steps.length - 1}
              onClick={() => { setPlaying(false); setStepIndex((s) => Math.min(scenario.steps.length - 1, s + 1)); }}
              aria-label="Next trace step"
              className="min-h-[36px] rounded-lg border border-rule-strong bg-paper px-3 text-xs font-mono text-ink disabled:opacity-40 hover:border-ink/50"
            >
              Next →
            </button>
          </div>
        </div>

        {/* Interactive Topology Schematic Node Graph */}
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" role="list" aria-label="System topology nodes">
          {system.nodes.map((node, i) => {
            const isActiveNode = currentStep.nodeId === node.id;
            const visitedIndex = scenario.steps.findIndex((s) => s.nodeId === node.id);
            const isPassed = visitedIndex !== -1 && visitedIndex < stepIndex;
            return (
              <div key={node.id} role="listitem" className="relative flex">
                <button
                  type="button"
                  onClick={() => selectNode(node.id)}
                  aria-pressed={isActiveNode}
                  className={`w-full text-left rounded-xl border p-4 transition-all ${
                    isActiveNode
                      ? 'border-accent bg-paper shadow-sm ring-1 ring-accent'
                      : isPassed
                        ? 'border-ink/40 bg-paper'
                        : 'border-rule bg-paper-sunken hover:border-ink/40'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-accent-strong">
                      0{i + 1} · {node.layer}
                    </span>
                    <span
                      aria-hidden="true"
                      className={`h-2 w-2 rounded-full ${
                        isActiveNode ? 'bg-signal' : isPassed ? 'bg-accent' : 'bg-rule-strong'
                      }`}
                    />
                  </div>
                  <p className="mt-2 font-sans text-sm font-bold text-ink">{node.label}</p>
                  <p className="mt-0.5 font-mono text-xs text-ink-muted">{node.sublabel}</p>
                </button>
              </div>
            );
          })}
        </div>

        {/* Active Step & Node Telemetry Readout */}
        <div
          className="mt-5 rounded-xl border border-rule-strong bg-paper p-4 sm:p-5"
          aria-live="polite"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-rule pb-3">
            <div className="flex items-center gap-2.5">
              <span className="rounded bg-ink px-2 py-0.5 font-mono text-xs font-semibold text-paper">
                Step {stepIndex + 1} / {scenario.steps.length}
              </span>
              <span className="font-sans text-sm font-bold text-ink">{currentStep.action}</span>
            </div>
            <span className="font-mono text-xs font-semibold text-accent-strong">{scenario.status}</span>
          </div>

          <div className="mt-3.5 grid gap-4 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
            <div>
              <p className="font-mono text-xs text-ink">
                <span className="text-ink-muted">Protocol / Rule: </span>
                <code className="rounded bg-paper-sunken px-1.5 py-0.5 font-mono text-xs text-ink">{currentStep.protocol}</code>
              </p>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{currentStep.note}</p>
            </div>

            <div className="border-t border-rule pt-3 md:border-l md:border-t-0 md:pl-4 md:pt-0">
              <p className="font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-ink-muted">
                Active Component: {activeNode.label}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-ink-muted">{activeNode.detail}</p>
            </div>
          </div>

          {/* Step Progress Bar Pills */}
          <div className="mt-4 flex flex-wrap items-center gap-1.5 pt-2" role="group" aria-label="Jump to trace step">
            {scenario.steps.map((st, idx) => (
              <button
                key={`${st.nodeId}-${idx}`}
                type="button"
                aria-pressed={idx === stepIndex}
                onClick={() => { setPlaying(false); setStepIndex(idx); }}
                className={`min-h-[30px] rounded px-2.5 py-1 font-mono text-[0.6875rem] transition-colors ${
                  idx === stepIndex
                    ? 'bg-ink text-paper font-semibold'
                    : 'bg-paper-sunken text-ink-muted hover:text-ink'
                }`}
              >
                0{idx + 1}. {st.action}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

export default ArchitectureLab;

