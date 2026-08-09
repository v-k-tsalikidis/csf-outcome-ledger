import React from 'react';
import { ExternalLink, ShieldAlert, RefreshCw } from 'lucide-react';
import { CisaKevEntry, ThreatIndex } from '../types/ledger';
import { OFFLINE_SAMPLE_DATE } from '../services/cisaKevApi';

interface ThreatIntelligencePanelProps {
  entries: CisaKevEntry[];
  index: ThreatIndex;
  loading: boolean;
  onRefresh: () => void;
}

export const ThreatIntelligencePanel: React.FC<ThreatIntelligencePanelProps> = ({
  entries,
  index,
  loading,
  onRefresh
}) => {
  const isLive = index.source === 'live';

  return (
    <div className="bg-white border border-zinc-200 rounded-lg p-5 mb-6 shadow-xs">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <ShieldAlert className="w-5 h-5 text-zinc-500" />
          <h2 className="text-sm font-semibold text-zinc-900 tracking-tight">
            CISA Known Exploited Vulnerabilities
          </h2>
          <span
            className={`text-[10px] font-mono px-2 py-0.5 rounded font-medium border ${
              isLive
                ? 'bg-teal-50 text-teal-800 border-teal-200/70'
                : 'bg-amber-50 text-amber-800 border-amber-200/70'
            }`}
          >
            {isLive ? 'Live feed' : `Offline sample — ${OFFLINE_SAMPLE_DATE}`}
          </span>
        </div>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="text-xs text-zinc-500 hover:text-zinc-900 flex items-center gap-1 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Retry</span>
        </button>
      </div>

      <p className="text-xs text-zinc-500 mb-4 leading-relaxed">
        {isLive ? (
          <>
            The {index.shown} most recently added records, of{' '}
            {index.catalogueSize?.toLocaleString()} in the catalogue.{' '}
            {index.ransomwareLinked} of those shown are linked by CISA to a known
            ransomware campaign, and {index.pastDue} are past their CISA remediation due
            date. This catalogue lists vulnerabilities known to be exploited; it does
            not assess whether any of them apply to your estate.
          </>
        ) : (
          <>
            The live feed could not be reached, so these are {index.shown} real records
            saved on {OFFLINE_SAMPLE_DATE}. They are a dated snapshot and should not be
            read as the current catalogue.
          </>
        )}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {entries.slice(0, 3).map((entry) => (
          <div
            key={entry.cveID}
            className="border border-zinc-200 rounded-md p-3 bg-zinc-50/50 hover:bg-white transition-all text-left flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-xs font-semibold text-zinc-700 bg-white px-1.5 py-0.5 rounded border border-zinc-200">
                  {entry.cveID}
                </span>
                <span className="text-[10px] text-zinc-400 font-mono">
                  added {entry.dateAdded}
                </span>
              </div>
              <h3 className="text-xs font-medium text-zinc-900 mb-1 line-clamp-1">
                {entry.vendorProject} — {entry.product}
              </h3>
              <p className="text-[11px] text-zinc-600 line-clamp-2 mb-2 leading-relaxed">
                {entry.shortDescription}
              </p>
            </div>

            <div className="pt-2 border-t border-zinc-200/60 flex items-center justify-between text-[10px]">
              <span className="text-zinc-500 font-medium">
                {entry.knownRansomwareCampaignUse.toLowerCase() === 'known'
                  ? 'Ransomware campaign: known'
                  : `Remediate by ${entry.dueDate}`}
              </span>
              <a
                href={`https://nvd.nist.gov/vuln/detail/${entry.cveID}`}
                target="_blank"
                rel="noreferrer"
                className="text-teal-700 hover:underline flex items-center gap-0.5"
              >
                <span>NVD</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
