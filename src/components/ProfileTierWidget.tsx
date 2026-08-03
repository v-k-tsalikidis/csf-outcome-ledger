import React from 'react';
import { Layers, ArrowRight, CheckCircle2, AlertCircle, TrendingUp, Target, Award } from 'lucide-react';
import { NistOutcome, OutcomeDecision } from '../types/ledger';

interface ProfileTierWidgetProps {
  outcomes: NistOutcome[];
  decisions: Record<string, OutcomeDecision>;
}

export const ProfileTierWidget: React.FC<ProfileTierWidgetProps> = ({
  outcomes,
  decisions
}) => {
  const totalOutcomes = outcomes.length;
  const supportedDecisions = outcomes.filter(o => decisions[o.id]?.status === 'SUPPORTED');
  const supportedCount = supportedDecisions.length;
  const evidenceCount = supportedDecisions.filter(o => Boolean(decisions[o.id]?.evidence?.referenceHash)).length;
  const gapOutcomes = outcomes.filter(o => decisions[o.id]?.status !== 'SUPPORTED');
  const percentage = Math.round((supportedCount / totalOutcomes) * 100);

  // Compute NIST Implementation Tier
  let currentTierName = 'Tier 1: Partial';
  let currentTierLevel = 1;
  let tierDescription = 'Security activities are reactive and handled ad-hoc with limited audit evidence.';
  let targetTierName = 'Tier 3: Repeatable';

  if (percentage >= 90 && evidenceCount >= supportedCount - 1) {
    currentTierName = 'Tier 4: Adaptive';
    currentTierLevel = 4;
    tierDescription = 'Security practices adapt dynamically based on continuous threat feeds & automated evidence.';
    targetTierName = 'Tier 4: Adaptive (Maintained)';
  } else if (percentage >= 65 && evidenceCount >= Math.floor(supportedCount * 0.6)) {
    currentTierName = 'Tier 3: Repeatable';
    currentTierLevel = 3;
    tierDescription = 'Formal security policies and controls are consistently applied and evidence-backed.';
    targetTierName = 'Tier 4: Adaptive';
  } else if (percentage >= 35) {
    currentTierName = 'Tier 2: Risk-Informed';
    currentTierLevel = 2;
    tierDescription = 'Risk management practices are approved by management, but formal evidence is incomplete.';
    targetTierName = 'Tier 3: Repeatable';
  }

  return (
    <div className="bg-white border border-zinc-200 rounded-lg p-5 mb-6 shadow-xs text-left">
      
      {/* Title Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-200">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-md bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-zinc-900 tracking-tight">
              NIST CSF 2.0 Implementation Tier & Gap Analysis
            </h2>
            <p className="text-xs text-zinc-500">
              Current Profile vs. Target Profile progression roadmap and required gap remediations.
            </p>
          </div>
        </div>
        <span className="font-mono text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded border border-indigo-200">
          {percentage}% Compliance Match
        </span>
      </div>

      {/* Tier Progression Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        
        {/* Current Profile Card */}
        <div className="bg-zinc-50 border border-zinc-200 rounded-md p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase font-semibold text-zinc-500 tracking-wider">
                Current Profile (Baseline)
              </span>
              <span className="bg-zinc-200 text-zinc-800 font-mono text-[10px] font-semibold px-2 py-0.5 rounded">
                Level {currentTierLevel} of 4
              </span>
            </div>
            <h3 className="text-base font-bold text-zinc-900 mb-1 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-indigo-600" />
              <span>{currentTierName}</span>
            </h3>
            <p className="text-xs text-zinc-600 leading-relaxed mb-3">
              {tierDescription}
            </p>
          </div>
          <div className="text-[11px] font-mono text-zinc-500">
            ✓ {supportedCount} of {totalOutcomes} Outcomes Supported ({evidenceCount} SHA-256 Evidence Verified)
          </div>
        </div>

        {/* Target Profile Card */}
        <div className="bg-teal-50/50 border border-teal-200/80 rounded-md p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase font-semibold text-teal-800 tracking-wider">
                Target Profile (Goal)
              </span>
              <span className="bg-teal-100 text-teal-900 font-mono text-[10px] font-semibold px-2 py-0.5 rounded border border-teal-200">
                Target
              </span>
            </div>
            <h3 className="text-base font-bold text-teal-950 mb-1 flex items-center gap-1.5">
              <Target className="w-4 h-4 text-teal-700" />
              <span>{targetTierName}</span>
            </h3>
            <p className="text-xs text-teal-900 leading-relaxed mb-3">
              Full alignment with NIST SP 800-53 Rev. 5 controls, EU DORA/NIS2 mandates, and 100% evidence hashing.
            </p>
          </div>
          <div className="text-[11px] font-mono text-teal-800">
            🎯 Target Action Plan: Remediate remaining {gapOutcomes.length} gaps listed below.
          </div>
        </div>

      </div>

      {/* Required Action List to Reach Next Tier */}
      {gapOutcomes.length > 0 && (
        <div className="bg-amber-50/60 border border-amber-200/80 rounded-md p-4">
          <h4 className="text-xs font-semibold text-amber-900 mb-2 flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-amber-700" />
            <span>Gap Remediation Checklist (Required to reach {targetTierName}):</span>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {gapOutcomes.map(o => (
              <div key={o.id} className="bg-white border border-amber-200/60 rounded p-2 text-xs flex items-start space-x-2">
                <span className="font-mono font-semibold text-amber-800 text-[11px] bg-amber-100 px-1.5 py-0.5 rounded">
                  {o.id}
                </span>
                <div className="flex-1 text-zinc-800 text-[11px] line-clamp-1">
                  <span className="font-medium">{o.category}:</span> {o.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
