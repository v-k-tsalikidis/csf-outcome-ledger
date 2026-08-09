import React from 'react';
import { X, Network, AlertOctagon, FileCheck } from 'lucide-react';
import { NistOutcome, OutcomeDecision } from '../types/ledger';

interface TopologyMapProps {
  outcomes: NistOutcome[];
  decisions: Record<string, OutcomeDecision>;
  onClose: () => void;
}

export const TopologyMap: React.FC<TopologyMapProps> = ({
  outcomes,
  decisions: _decisions,
  onClose
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/50 backdrop-blur-xs p-4">
      <div className="bg-white border border-zinc-200 rounded-lg max-w-4xl w-full h-[80vh] p-6 shadow-2xl relative text-left flex flex-col justify-between">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-200">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-md bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700">
              <Network className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-zinc-900">
                Interactive Control & Threat Dependency Topology Map
              </h3>
              <p className="text-xs text-zinc-500">
                Visualizing Live Threat (CISA KEV) ➔ NIST Outcome ➔ SP 800-53 Control ➔
                Risk ➔ SHA-256 Evidence
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Visual Graph View */}
        <div className="flex-1 my-4 bg-zinc-50 border border-zinc-200 rounded-lg p-6 overflow-y-auto flex flex-col items-center justify-center space-y-8 relative">
          <div className="w-full grid grid-cols-5 gap-4 text-center">
            {/* Column 1: Live Threat */}
            <div className="flex flex-col items-center space-y-3">
              <div className="text-[11px] font-semibold text-rose-700 uppercase tracking-wider">
                1. CISA Threat Feed
              </div>
              <div className="w-full bg-white border border-rose-200 rounded-md p-3 shadow-xs text-left">
                <div className="flex items-center space-x-1.5 text-rose-700 font-mono text-xs font-semibold mb-1">
                  <AlertOctagon className="w-3.5 h-3.5" />
                  <span>CVE-2024-3400</span>
                </div>
                <div className="text-[10px] text-zinc-600">
                  PAN-OS Command Injection
                </div>
              </div>
            </div>

            {/* Column 2: NIST Outcome */}
            <div className="flex flex-col items-center space-y-3">
              <div className="text-[11px] font-semibold text-teal-700 uppercase tracking-wider">
                2. NIST CSF 2.0
              </div>
              {outcomes.slice(2, 4).map((o) => (
                <div
                  key={o.id}
                  className="w-full bg-white border border-teal-200 rounded-md p-2.5 shadow-xs text-left"
                >
                  <div className="font-mono text-xs font-semibold text-teal-800">
                    {o.id}
                  </div>
                  <div className="text-[10px] text-zinc-500 truncate">{o.category}</div>
                </div>
              ))}
            </div>

            {/* Column 3: SP 800-53 Control */}
            <div className="flex flex-col items-center space-y-3">
              <div className="text-[11px] font-semibold text-indigo-700 uppercase tracking-wider">
                3. SP 800-53 Controls
              </div>
              <div className="w-full bg-white border border-indigo-200 rounded-md p-2.5 shadow-xs text-left">
                <div className="font-mono text-xs font-semibold text-indigo-800">
                  AC-2 / IA-2
                </div>
                <div className="text-[10px] text-zinc-500">MFA & Access Control</div>
              </div>
              <div className="w-full bg-white border border-indigo-200 rounded-md p-2.5 shadow-xs text-left">
                <div className="font-mono text-xs font-semibold text-indigo-800">
                  SC-8 / SC-28
                </div>
                <div className="text-[10px] text-zinc-500">Data Encryption</div>
              </div>
            </div>

            {/* Column 4: EU DORA / NIS2 */}
            <div className="flex flex-col items-center space-y-3">
              <div className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider">
                4. EU Regulation
              </div>
              <div className="w-full bg-white border border-amber-200 rounded-md p-2.5 shadow-xs text-left">
                <div className="font-mono text-xs font-semibold text-amber-800">
                  DORA Art. 9
                </div>
                <div className="text-[10px] text-zinc-500">Access Management</div>
              </div>
            </div>

            {/* Column 5: SHA-256 Provenance */}
            <div className="flex flex-col items-center space-y-3">
              <div className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider">
                5. Evidence Hash
              </div>
              <div className="w-full bg-white border border-emerald-200 rounded-md p-2.5 shadow-xs text-left font-mono text-[10px] text-emerald-900">
                <FileCheck className="w-3.5 h-3.5 text-emerald-600 mb-1 inline mr-1" />
                <span>e3b0c442...b855</span>
              </div>
            </div>
          </div>

          <div className="text-xs text-zinc-500 text-center font-mono">
            Connected Topology Graph • End-to-End Governance Traceability
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-zinc-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-white bg-zinc-900 rounded-md hover:bg-zinc-800"
          >
            Close Topology Map
          </button>
        </div>
      </div>
    </div>
  );
};
