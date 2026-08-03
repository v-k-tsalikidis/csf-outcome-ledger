import React from 'react';
import { ShieldCheck, AlertCircle, Clock, Hash, AlertTriangle, ChevronRight, Globe, Layers } from 'lucide-react';
import { NistOutcome, OutcomeDecision, MappingStatus } from '../types/ledger';
import { formatShortHash } from '../utils/cryptoUtils';

interface LedgerGridProps {
  outcomes: NistOutcome[];
  decisions: Record<string, OutcomeDecision>;
  doraOverlayActive: boolean;
  onUpdateStatus: (outcomeId: string, status: MappingStatus) => void;
  onOpenEvidenceModal: (outcomeId: string) => void;
  onOpenRiskDrawer: (outcomeId: string) => void;
}

export const LedgerGrid: React.FC<LedgerGridProps> = ({
  outcomes,
  decisions,
  doraOverlayActive,
  onUpdateStatus,
  onOpenEvidenceModal,
  onOpenRiskDrawer
}) => {
  return (
    <div className="bg-white border border-zinc-200 rounded-lg shadow-xs overflow-hidden">
      
      <div className="px-5 py-4 border-b border-zinc-200 bg-zinc-50/50 flex items-center justify-between">
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
      </div>

      <div className="divide-y divide-zinc-200">
        {outcomes.map((outcome) => {
          const decision = decisions[outcome.id] || { outcomeId: outcome.id, status: 'UNSUPPORTED', lastUpdated: 'Never' };
          const hasEvidence = Boolean(decision.evidence?.referenceHash);
          const hasRisk = Boolean(decision.riskContext?.scenario);

          return (
            <div key={outcome.id} className="p-5 hover:bg-zinc-50/60 transition-colors text-left">
              
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                
                {/* Left: ID, Function, Description */}
                <div className="flex-1">
                  
                  <div className="flex items-center space-x-2.5 mb-1.5">
                    <span className="font-mono text-xs font-semibold px-2 py-0.5 bg-zinc-100 text-zinc-800 border border-zinc-200 rounded">
                      {outcome.id}
                    </span>
                    <span className="text-[10px] uppercase font-semibold text-zinc-500 tracking-wider">
                      {outcome.function} • {outcome.category}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-800 font-medium leading-relaxed mb-3">
                    {outcome.description}
                  </p>

                  {/* Framework Cross-Mappings (SP 800-53, ISO 27001, DORA, NIS2) */}
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                    <span className="text-zinc-400 font-medium text-[10px]">SP 800-53:</span>
                    {outcome.sp80053Controls.map(c => (
                      <span key={c.code} title={c.title} className="font-mono text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-200/60 px-1.5 py-0.5 rounded">
                        {c.code}
                      </span>
                    ))}

                    <span className="text-zinc-400 font-medium text-[10px] ml-2">ISO 27001:</span>
                    {outcome.iso27001Controls.map(c => (
                      <span key={c.code} title={c.title} className="font-mono text-[10px] bg-zinc-100 text-zinc-700 border border-zinc-200 px-1.5 py-0.5 rounded">
                        {c.code}
                      </span>
                    ))}

                    {/* DORA & NIS2 Overlays when active */}
                    {doraOverlayActive && (
                      <>
                        <span className="text-teal-700 font-medium text-[10px] ml-2">DORA:</span>
                        <span className="font-mono text-[10px] bg-teal-50 text-teal-800 border border-teal-200/80 px-1.5 py-0.5 rounded font-medium">
                          {outcome.doraMapping.article} ({outcome.doraMapping.title})
                        </span>

                        <span className="text-amber-700 font-medium text-[10px] ml-1">NIS2:</span>
                        <span className="font-mono text-[10px] bg-amber-50 text-amber-800 border border-amber-200/80 px-1.5 py-0.5 rounded font-medium">
                          {outcome.nis2Mapping.article}
                        </span>
                      </>
                    )}
                  </div>

                </div>

                {/* Right: Mapping Status Dropdown, Evidence & Risk Actions */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                  
                  {/* Status Dropdown */}
                  <select
                    value={decision.status}
                    onChange={(e) => onUpdateStatus(outcome.id, e.target.value as MappingStatus)}
                    className={`text-xs font-semibold rounded-md px-3 py-1.5 border focus:outline-none transition-all ${
                      decision.status === 'SUPPORTED' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' :
                      decision.status === 'STALE' ? 'bg-amber-50 text-amber-800 border-amber-300' :
                      decision.status === 'OUT_OF_SCOPE' ? 'bg-zinc-100 text-zinc-700 border-zinc-300' :
                      'bg-rose-50 text-rose-800 border-rose-300'
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
                    className={`px-3 py-1.5 text-xs font-medium rounded-md border flex items-center gap-1.5 transition-all ${
                      hasEvidence
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50'
                    }`}
                    title="Add or View SHA-256 Evidence Provenance"
                  >
                    <Hash className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{hasEvidence ? formatShortHash(decision.evidence!.referenceHash) : 'Add Evidence'}</span>
                  </button>

                  {/* Risk Assessment Button */}
                  <button
                    onClick={() => onOpenRiskDrawer(outcome.id)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md border flex items-center gap-1.5 transition-all ${
                      hasRisk
                        ? 'bg-rose-50 text-rose-800 border-rose-300'
                        : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50'
                    }`}
                    title="Record Risk Assessment Context"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                    <span>{hasRisk ? 'Risk Recorded' : 'Risk Assessment'}</span>
                  </button>

                </div>

              </div>

              {/* Rationale & Evidence Provenance Drawer Summary */}
              {hasEvidence && (
                <div className="mt-3 pt-3 border-t border-zinc-100 bg-zinc-50/80 rounded-md p-3 text-xs text-zinc-700 font-sans flex items-start justify-between">
                  <div>
                    <span className="font-semibold text-zinc-900">Audit Rationale: </span>
                    <span>{decision.evidence?.rationale}</span>
                    <div className="text-[10px] font-mono text-zinc-400 mt-1">
                      Document: {decision.evidence?.documentName} • Reviewer: {decision.evidence?.reviewerName} • Expires: {decision.evidence?.expiryDate}
                    </div>
                  </div>
                  <span className="font-mono text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
                    SHA-256 Verified
                  </span>
                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
};
