import React from 'react';
import { X, Printer, Download, ShieldCheck, AlertTriangle } from 'lucide-react';
import { NistOutcome, OutcomeDecision, ThreatIndex } from '../types/ledger';

interface CisoBoardReportModalProps {
  outcomes: NistOutcome[];
  decisions: Record<string, OutcomeDecision>;
  threatIndex: ThreatIndex;
  onClose: () => void;
}

export const CisoBoardReportModal: React.FC<CisoBoardReportModalProps> = ({
  outcomes,
  decisions,
  threatIndex,
  onClose
}) => {
  const supportedCount = Object.values(decisions).filter(d => d.status === 'SUPPORTED').length;
  const gapCount = Object.values(decisions).filter(d => d.status === 'UNSUPPORTED').length;
  const staleCount = Object.values(decisions).filter(d => d.status === 'STALE').length;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/50 backdrop-blur-xs p-4">
      <div className="bg-white border border-zinc-200 rounded-lg max-w-3xl w-full max-h-[90vh] p-8 shadow-2xl relative text-left flex flex-col justify-between overflow-y-auto">
        
        {/* Header Actions */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-200 mb-6 print:hidden">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-teal-700" />
            <h2 className="text-sm font-semibold text-zinc-900">
              Executive CISO Board Summary Report
            </h2>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 text-xs text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-md font-medium flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Export PDF</span>
            </button>
            <button onClick={onClose} className="text-zinc-400 hover:text-zinc-700">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Report Body */}
        <div className="space-y-6 font-sans">
          
          <div className="border-b border-zinc-200 pb-4">
            <h1 className="text-xl font-bold text-zinc-900 tracking-tight">
              Executive Cybersecurity Posture & Compliance Report
            </h1>
            <p className="text-xs text-zinc-500 mt-1">
              Framework Alignment: NIST CSF 2.0 • SP 800-53 Rev. 5 • EU DORA (Art. 5-14) • NIS2 (Art. 21)
            </p>
            <div className="text-[11px] font-mono text-zinc-400 mt-2">
              Generated Date: {new Date().toLocaleDateString()} | Auditor: Basil Tsalikidis (InfoSec Officer)
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-zinc-50 border border-zinc-200 rounded-md p-3">
              <div className="text-[10px] text-zinc-500 font-medium uppercase">Sector Threat Index</div>
              <div className="text-lg font-bold text-rose-700 mt-0.5">{threatIndex.overallLevel}</div>
              <div className="text-[10px] text-zinc-400 font-mono">{threatIndex.activeSectorKevs} Active KEVs</div>
            </div>

            <div className="bg-emerald-50/60 border border-emerald-200/60 rounded-md p-3">
              <div className="text-[10px] text-emerald-800 font-medium uppercase">Supported Outcomes</div>
              <div className="text-lg font-bold text-emerald-900 mt-0.5">{supportedCount}</div>
              <div className="text-[10px] text-emerald-700 font-mono">Validated Controls</div>
            </div>

            <div className="bg-amber-50/60 border border-amber-200/60 rounded-md p-3">
              <div className="text-[10px] text-amber-800 font-medium uppercase">Stale / Review Due</div>
              <div className="text-lg font-bold text-amber-900 mt-0.5">{staleCount}</div>
              <div className="text-[10px] text-amber-700 font-mono">&gt;180 Day Review</div>
            </div>

            <div className="bg-rose-50/60 border border-rose-200/60 rounded-md p-3">
              <div className="text-[10px] text-rose-800 font-medium uppercase">Critical Gaps</div>
              <div className="text-lg font-bold text-rose-900 mt-0.5">{gapCount}</div>
              <div className="text-[10px] text-rose-700 font-mono">Remediation Target</div>
            </div>
          </div>

          {/* Executive Overview */}
          <div>
            <h3 className="text-xs font-semibold text-zinc-900 uppercase tracking-wider mb-2">
              Executive Overview & Compliance Rationale
            </h3>
            <p className="text-xs text-zinc-700 leading-relaxed bg-zinc-50 border border-zinc-200/80 rounded-md p-3">
              This decision ledger documents the organizational security posture against NIST CSF 2.0, NIST SP 800-53 Rev. 5, and EU DORA/NIS2 mandates. Cryptographic SHA-256 evidence hashing has been established for all approved controls, ensuring immutable audit provenance with zero cloud data exposure.
            </p>
          </div>

          {/* Detailed Ledger Summary */}
          <div>
            <h3 className="text-xs font-semibold text-zinc-900 uppercase tracking-wider mb-2">
              Outcome & Regulatory Control Status Matrix
            </h3>
            <div className="border border-zinc-200 rounded-md overflow-hidden text-xs">
              <table className="min-w-full divide-y divide-zinc-200">
                <thead className="bg-zinc-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-[10px] font-semibold text-zinc-500 uppercase">Outcome</th>
                    <th className="px-3 py-2 text-left text-[10px] font-semibold text-zinc-500 uppercase">SP 800-53 / DORA</th>
                    <th className="px-3 py-2 text-left text-[10px] font-semibold text-zinc-500 uppercase">Status</th>
                    <th className="px-3 py-2 text-left text-[10px] font-semibold text-zinc-500 uppercase">Evidence SHA-256</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 bg-white">
                  {outcomes.map(o => {
                    const dec = decisions[o.id];
                    return (
                      <tr key={o.id}>
                        <td className="px-3 py-2 font-mono font-medium text-zinc-900">{o.id}</td>
                        <td className="px-3 py-2 text-zinc-600 font-mono text-[11px]">
                          {o.sp80053Controls[0]?.code} • {o.doraMapping.article}
                        </td>
                        <td className="px-3 py-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                            dec?.status === 'SUPPORTED' ? 'bg-emerald-100 text-emerald-800' :
                            dec?.status === 'STALE' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {dec?.status || 'UNSUPPORTED'}
                          </span>
                        </td>
                        <td className="px-3 py-2 font-mono text-[10px] text-zinc-500 truncate max-w-[140px]">
                          {dec?.evidence?.referenceHash ? dec.evidence.referenceHash.substring(0, 12) + '...' : 'None'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-zinc-200 flex justify-end print:hidden">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-white bg-zinc-900 rounded-md hover:bg-zinc-800"
          >
            Close Report
          </button>
        </div>

      </div>
    </div>
  );
};
