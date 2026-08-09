import React, { useState } from 'react';
import { X, ShieldAlert } from 'lucide-react';
import { RiskContext, RiskLevel } from '../types/ledger';

interface RiskDrawerProps {
  outcomeId: string;
  existingRisk?: RiskContext;
  onSave: (risk: RiskContext) => void;
  onClose: () => void;
}

export const RiskDrawer: React.FC<RiskDrawerProps> = ({
  outcomeId,
  existingRisk,
  onSave,
  onClose
}) => {
  const [scenario, setScenario] = useState(
    existingRisk?.scenario ||
      `Risk scenario regarding ${outcomeId}: Unauthorized access or operational disruption due to missing/stale control enforcement.`
  );
  const [likelihood, setLikelihood] = useState<RiskLevel>(
    existingRisk?.likelihood || 'HIGH'
  );
  const [impact, setImpact] = useState<RiskLevel>(existingRisk?.impact || 'CRITICAL');
  const [treatment, setTreatment] = useState<RiskContext['treatment']>(
    existingRisk?.treatment || 'MITIGATE'
  );
  const [targetDate, setTargetDate] = useState(
    existingRisk?.targetDate || '2026-11-30'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      scenario,
      likelihood,
      impact,
      treatment,
      targetDate
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-zinc-900/30 backdrop-blur-xs">
      <div className="bg-white border-l border-zinc-200 max-w-md w-full h-full p-6 shadow-2xl overflow-y-auto text-left flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-zinc-200 mb-5">
            <div className="flex items-center space-x-2">
              <ShieldAlert className="w-5 h-5 text-rose-600" />
              <div>
                <h3 className="text-sm font-semibold text-zinc-900">
                  Risk Assessment & Gap Register
                </h3>
                <span className="font-mono text-xs text-rose-700">{outcomeId}</span>
              </div>
            </div>
            <button onClick={onClose} className="text-zinc-400 hover:text-zinc-700">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form id="riskForm" onSubmit={handleSubmit} className="space-y-4">
            {/* Risk Scenario */}
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">
                Risk Scenario Description
              </label>
              <textarea
                value={scenario}
                onChange={(e) => setScenario(e.target.value)}
                rows={3}
                className="w-full text-xs border border-zinc-200 rounded-md p-2.5 focus:outline-none focus:border-rose-600 font-sans"
                required
              />
            </div>

            {/* Likelihood & Impact Matrix */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Likelihood
                </label>
                <select
                  value={likelihood}
                  onChange={(e) => setLikelihood(e.target.value as RiskLevel)}
                  className="w-full text-xs border border-zinc-200 rounded-md px-2.5 py-1.5 focus:outline-none focus:border-rose-600"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="CRITICAL">Critical</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Business Impact
                </label>
                <select
                  value={impact}
                  onChange={(e) => setImpact(e.target.value as RiskLevel)}
                  className="w-full text-xs border border-zinc-200 rounded-md px-2.5 py-1.5 focus:outline-none focus:border-rose-600"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="CRITICAL">Critical</option>
                </select>
              </div>
            </div>

            {/* Treatment Decision */}
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">
                Risk Treatment Strategy
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['MITIGATE', 'ACCEPT', 'TRANSFER', 'AVOID'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTreatment(t)}
                    className={`py-1.5 px-2 text-xs font-medium rounded-md border text-center transition-all ${
                      treatment === t
                        ? 'bg-rose-50 text-rose-800 border-rose-300 font-semibold'
                        : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Date */}
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">
                Target Remediation Date
              </label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full text-xs border border-zinc-200 rounded-md px-2.5 py-1.5 focus:outline-none focus:border-rose-600 font-mono"
                required
              />
            </div>
          </form>
        </div>

        <div className="pt-4 border-t border-zinc-200 flex items-center justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-xs text-zinc-600 hover:bg-zinc-100 rounded-md"
          >
            Cancel
          </button>
          <button
            form="riskForm"
            type="submit"
            className="px-4 py-1.5 text-xs font-medium text-white bg-rose-700 hover:bg-rose-800 rounded-md transition-all shadow-xs"
          >
            Save Risk Assessment
          </button>
        </div>
      </div>
    </div>
  );
};
