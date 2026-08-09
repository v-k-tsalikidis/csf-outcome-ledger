import React, { useRef } from 'react';
import {
  ShieldCheck,
  FileText,
  Download,
  Upload,
  Activity,
  Globe,
  Sparkles
} from 'lucide-react';
import { ThreatIndex } from '../types/ledger';

interface HeaderProps {
  threatIndex: ThreatIndex;
  doraOverlayActive: boolean;
  onToggleDoraOverlay: () => void;
  onOpenReportModal: () => void;
  onOpenTopologyMap: () => void;
  onExportJson: () => void;
  onImportJson: (importedData: Record<string, unknown>) => void;
}

export const Header: React.FC<HeaderProps> = ({
  threatIndex,
  doraOverlayActive,
  onToggleDoraOverlay,
  onOpenReportModal,
  onOpenTopologyMap,
  onExportJson,
  onImportJson
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        onImportJson(parsed);
      } catch {
        alert(
          'Invalid JSON file format. Please upload a valid CSF Outcome Ledger export.'
        );
      }
    };
    reader.readAsText(file);
  };

  return (
    <header className="bg-white border-b border-zinc-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-teal-700 flex items-center justify-center text-white shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-semibold text-zinc-900 tracking-tight font-sans">
                  CSF Outcome Ledger
                </h1>
                <span className="bg-zinc-100 text-zinc-600 text-[10px] font-mono font-medium px-1.5 py-0.5 rounded border border-zinc-200">
                  v1.0.0
                </span>
              </div>
              <p className="text-xs text-zinc-500 hidden sm:block">
                NIST CSF 2.0 & SP 800-53 Decision Ledger with Live CISA Threat Feed
              </p>
            </div>
          </div>

          {/* Sector Threat Index & EU Regulation Toggle */}
          <div className="flex items-center space-x-3">
            {/* Live Threat Pill */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded-md">
              <Activity className="w-4 h-4 text-zinc-500" />
              <div className="text-left">
                <div className="text-[10px] uppercase tracking-wider font-semibold text-zinc-600">
                  CISA KEV catalogue
                </div>
                <div className="text-xs font-mono font-semibold text-zinc-900 flex items-center gap-1.5">
                  <span>
                    {threatIndex.catalogueSize !== null
                      ? `${threatIndex.catalogueSize.toLocaleString()} entries`
                      : 'offline sample'}
                  </span>
                  <span className="text-[10px] text-zinc-500 font-normal">
                    [
                    {threatIndex.retrievedAt
                      ? new Date(threatIndex.retrievedAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      : 'not retrieved'}
                    ]
                  </span>
                </div>
              </div>
            </div>

            {/* DORA / NIS2 Overlay Toggle */}
            <button
              onClick={onToggleDoraOverlay}
              className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-all flex items-center gap-1.5 ${
                doraOverlayActive
                  ? 'bg-teal-50 text-teal-800 border-teal-300 shadow-xs'
                  : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50'
              }`}
              title="Toggle EU DORA & NIS2 Regulatory Compliance Mapping"
            >
              <Globe
                className={`w-3.5 h-3.5 ${doraOverlayActive ? 'text-teal-600' : 'text-zinc-400'}`}
              />
              <span>EU DORA / NIS2 Overlay</span>
              {doraOverlayActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-teal-600 inline-block"></span>
              )}
            </button>

            {/* Topology Map */}
            <button
              onClick={onOpenTopologyMap}
              className="px-3 py-1.5 text-xs font-medium text-zinc-700 bg-white border border-zinc-200 hover:bg-zinc-50 rounded-md transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden sm:inline">Topology Map</span>
            </button>

            {/* CISO Board Report */}
            <button
              onClick={onOpenReportModal}
              className="px-3 py-1.5 text-xs font-medium text-white bg-zinc-900 hover:bg-zinc-800 rounded-md transition-all flex items-center gap-1.5 shadow-xs"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>CISO Board Report</span>
            </button>

            {/* Import JSON */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-1.5 text-zinc-500 hover:text-zinc-900 border border-zinc-200 hover:bg-zinc-50 rounded-md transition-all"
              title="Import Ledger JSON Dataset"
            >
              <Upload className="w-4 h-4" />
            </button>

            {/* Export JSON */}
            <button
              onClick={onExportJson}
              className="p-1.5 text-zinc-500 hover:text-zinc-900 border border-zinc-200 hover:bg-zinc-50 rounded-md transition-all"
              title="Export Ledger JSON Dataset"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
