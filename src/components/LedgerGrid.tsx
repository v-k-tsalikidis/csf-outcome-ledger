import React, { useState } from 'react';
import { ShieldCheck, AlertCircle, Clock, Hash, AlertTriangle, ChevronRight, Globe, Layers, PlusCircle, Filter } from 'lucide-react';
import { NistOutcome, OutcomeDecision, MappingStatus, FunctionCategory } from '../types/ledger';
import { formatShortHash } from '../utils/cryptoUtils';

interface LedgerGridProps {
  outcomes: NistOutcome[];
  decisions: Record<string, OutcomeDecision>;
  doraOverlayActive: boolean;
  onUpdateStatus: (outcomeId: string, status: MappingStatus) => void;
  onOpenEvidenceModal: (outcomeId: string) => void;
  onOpenRiskDrawer: (outcomeId: string) => void;
  onOpenAddOutcomeModal: () => void;
}

export const LedgerGrid: React.FC<LedgerGridProps> = ({
  outcomes,
  decisions,
  doraOverlayActive,
  onUpdateStatus,
  onOpenEvidenceModal,
  onOpenRiskDrawer,
  onOpenAddOutcomeModal
}) => {
  const [selectedFunction, setSelectedFunction] = useState<FunctionCategory | 'ALL'>('ALL');

  const filteredOutcomes = selectedFunction === 'ALL'
    ? outcomes
    : outcomes.filter(o => o.function === selectedFunction);

  const functionCounts = {
    ALL: outcomes.length,
    GOVERN: outcomes.filter(o => o.function === 'GOVERN').length,
    IDENTIFY: outcomes.filter(o => o.function === 'IDENTIFY').length,
    PROTECT: outcomes.filter(o => o.function === 'PROTECT').length,
    DETECT: outcomes.filter(o => o.function === 'DETECT').length,
    RESPOND: outcomes.filter(o => o.function === 'RESPOND').length,
    RECOVER: outcomes.filter(o => o.function === 'RECOVER').length
  };

  return (
    <div className="bg-white border border-zinc-200 rounded-lg shadow-xs overflow-hidden text-left">
      
      {/* Header & Controls */}
      <div className="px-5 py-4 border-b border-zinc-200 bg-zinc-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-zinc-900 tracking-tight flex items-center gap-2">
            <span>NIST CSF 2.0 & SP 800-53 Mapping Ledger</span>
            {doraOverlayActive && (
              <span className="bg-teal-100 text-teal-800 text-[10px] font-mono font-medium px-2 py-0.5 rounded border border-teal-200">
                EU DORA & NIS2 Active
              </span>
            )}
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Local-first decision records with audit rationale, SHA-256 evidence hashing, and risk context.
          </p>
        </div>

        <button
          onClick={onOpenAddOutcomeModal}
          className="self-start md:self-auto px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium rounded-md shadow-xs flex items-center gap-1.5 transition-colors"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>+ Add Custom Outcome</span>
        </button>
      </div>

      {/* Function Filter Tabs */}
      <div className="px-5 py-2.5 border-b border-zinc-200 bg-white flex items-center space-x-1 overflow-x-auto text-xs font-medium text-zinc-600">
        <span className="text-[11px] text-zinc-400 font-mono uppercase tracking-wider mr-2 flex items-center gap-1">
          <Filter className="w-3 h-3" /> Function:
        </span>
        {(['ALL', 'GOVERN', 'IDENTIFY', 'PROTECT', 'DETECT', 'RESPOND', 'RECOVER'] as const).map((fn) => (
          <button
            key={fn}
            onClick={() => setSelectedFunction(fn)}
            className={`px-3 py-1 rounded-md text-xs font-mono transition-colors whitespace-nowrap ${
              selectedFunction === fn
                ? 'bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200'
                : 'text-zinc-600 hover:bg-zinc-100'
            }`}
          >
            {fn} ({functionCounts[fn]})
          </button>
        ))}
      </div>

      {/* Main Ledger Items */}
      <div className="divide-y divide-zinc-200">
        {filteredOutcomes.map((outcome) => {
          const decision = decisions[outcome.id] || { outcomeId: outcome.id, status: 'UNSUPPORTED', lastUpdated: 'Never' };
          const hasEvidence = Boolean(decision.evidence?.referenceHash);
          const hasRisk = Boolean(decision.riskContext?.scenario);

          return (
            <div key={outcome.id} className="p-5 hover:bg-zinc-50/40 transition-colors">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                
                {/* Left: Outcome Info & Cross-Mappings */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1.5">
                    <span className="font-mono text-xs font-bold text-zinc-900 bg-zinc-100 border border-zinc-200 px-2 py-0.5 rounded">
                      {outcome.id}
                    </span>
                    <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider font-mono">
                      {outcome.function} ➔ {outcome.category}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-800 font-normal leading-relaxed mb-3">
                    {outcome.description}
                  </p>

                  {/* Badges: SP 800-53, ISO 27001, DORA */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] text-zinc-400 font-mono uppercase mr-1">Controls:</span>
                    {outcome.sp80053Controls.map((c) => (
                      <span key={c.code} className="inline-flex items-center text-[10px] font-mono bg-indigo-50/70 text-indigo-800 border border-indigo-200/80 px-2 py-0.5 rounded">
                        NIST {c.code} ({c.title})
                      </span>
                    ))}

                    {outcome.iso27001Controls?.map((iso) => (
                      <span key={iso.code} className="inline-flex items-center text-[10px] font-mono bg-zinc-100 text-zinc-700 border border-zinc-200 px-2 py-0.5 rounded">
                        ISO {iso.code}
                      </span>
                    ))}

                    {doraOverlayActive && outcome.doraMapping && (
                      <span className="inline-flex items-center text-[10px] font-mono bg-teal-50 text-teal-800 border border-teal-200 px-2 py-0.5 rounded">
                        DORA {outcome.doraMapping.article} ({outcome.doraMapping.title})
                      </span>
                    )}
                  </div>
                </div>

                {/* Right: Actions & Decision Inputs */}
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 lg:self-start">
                  
                  {/* Status Dropdown */}
                  <select
                    value={decision.status}
                    onChange={(e) => onUpdateStatus(outcome.id, e.target.value as MappingStatus)}
                    className={`text-xs font-semibold px-2.5 py-1.5 rounded-md border focus:outline-none cursor-pointer transition-colors ${
                      decision.status === 'SUPPORTED'
                        ? 'bg-teal-50 text-teal-800 border-teal-200'
                        : decision.status === 'UNSUPPORTED'
                        ? 'bg-rose-50 text-rose-800 border-rose-200'
                        : decision.status === 'STALE'
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : 'bg-zinc-100 text-zinc-700 border-zinc-200'
                    }`}
                  >
                    <option value="SUPPORTED">✓ SUPPORTED</option>
                    <option value="UNSUPPORTED">✕ UNSUPPORTED</option>
                    <option value="STALE">⏳ STALE (&gt;180 Days)</option>
                    <option value="OUT_OF_SCOPE">OUT OF SCOPE</option>
                  </select>

                  {/* Evidence Button */}
                  <button
                    onClick={() => onOpenEvidenceModal(outcome.id)}
                    className={`px-2.5 py-1.5 text-xs font-mono rounded-md border flex items-center space-x-1.5 transition-colors ${
                      hasEvidence
                        ? 'bg-teal-50/60 border-teal-200 text-teal-800 font-semibold'
                        : 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                    }`}
                  >
                    <Hash className="w-3.5 h-3.5" />
                    <span>
                      {hasEvidence ? `Hash: ${formatShortHash(decision.evidence?.referenceHash || '')}` : '# Add Evidence'}
                    </span>
                  </button>

                  {/* Risk Assessment Button */}
                  <button
                    onClick={() => onOpenRiskDrawer(outcome.id)}
                    className={`px-2.5 py-1.5 text-xs rounded-md border flex items-center space-x-1.5 transition-colors ${
                      hasRisk
                        ? 'bg-amber-50 border-amber-200 text-amber-900 font-semibold'
                        : 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                    }`}
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>{hasRisk ? `Risk: ${decision.riskContext?.likelihood}` : 'Risk Assessment'}</span>
                  </button>

                </div>

              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
