import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ThreatIntelligencePanel } from './components/ThreatIntelligencePanel';
import { LedgerGrid } from './components/LedgerGrid';
import { EvidenceModal } from './components/EvidenceModal';
import { RiskDrawer } from './components/RiskDrawer';
import { TopologyMap } from './components/TopologyMap';
import { CisoBoardReportModal } from './components/CisoBoardReportModal';
import { ProfileTierWidget } from './components/ProfileTierWidget';
import { NIST_CSF_OUTCOMES } from './data/nistCsfData';
import { fetchCisaKevThreatFeed } from './services/cisaKevApi';
import { OutcomeDecision, MappingStatus, EvidenceRecord, RiskContext, CisaKevEntry, ThreatIndex } from './types/ledger';

const LOCAL_STORAGE_KEY = 'csf_outcome_ledger_decisions_v1';

export function App() {
  const [decisions, setDecisions] = useState<Record<string, OutcomeDecision>>({});
  const [doraOverlayActive, setDoraOverlayActive] = useState(true);
  const [threatEntries, setThreatEntries] = useState<CisaKevEntry[]>([]);
  const [threatIndex, setThreatIndex] = useState<ThreatIndex>({
    overallLevel: 'HIGH',
    activeSectorKevs: 3,
    lastSync: 'Syncing...'
  });
  const [threatLoading, setThreatLoading] = useState(false);

  // Modals & Drawers state
  const [activeEvidenceModalOutcomeId, setActiveEvidenceModalOutcomeId] = useState<string | null>(null);
  const [activeRiskDrawerOutcomeId, setActiveRiskDrawerOutcomeId] = useState<string | null>(null);
  const [topologyMapOpen, setTopologyMapOpen] = useState(false);
  const [cisoReportModalOpen, setCisoReportModalOpen] = useState(false);

  // Load initial decisions from LocalStorage or seed default state
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        setDecisions(JSON.parse(saved));
      } else {
        // Default seed decisions
        const seed: Record<string, OutcomeDecision> = {
          'PROTECT.PR.AA-01': {
            outcomeId: 'PROTECT.PR.AA-01',
            status: 'SUPPORTED',
            lastUpdated: new Date().toISOString().split('T')[0],
            evidence: {
              id: 'EVD-001',
              documentName: 'Identity_MFA_Enforcement_Policy_2026.pdf',
              referenceHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
              reviewerName: 'Basil Tsalikidis (InfoSec Officer)',
              reviewDate: '2026-06-15',
              expiryDate: '2027-06-15',
              rationale: 'MFA enforced across all enterprise VPN and NATO CIS gateways per ISO 27001 & DORA Article 9.'
            }
          },
          'DETECT.DE.AE-01': {
            outcomeId: 'DETECT.DE.AE-01',
            status: 'SUPPORTED',
            lastUpdated: new Date().toISOString().split('T')[0],
            evidence: {
              id: 'EVD-002',
              documentName: 'SOC_SIEM_Monitoring_SOP.pdf',
              referenceHash: '127e57f594582f349afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
              reviewerName: 'Basil Tsalikidis (InfoSec Officer)',
              reviewDate: '2026-05-10',
              expiryDate: '2027-05-10',
              rationale: '24/7 SOC log ingestion and automated correlation against CISA KEV feeds.'
            }
          },
          'RESPOND.RS.MA-01': {
            outcomeId: 'RESPOND.RS.MA-01',
            status: 'STALE',
            lastUpdated: '2025-10-01',
            riskContext: {
              scenario: 'Incident response playbooks pending annual update for ransomware scenarios.',
              likelihood: 'MEDIUM',
              impact: 'HIGH',
              treatment: 'MITIGATE',
              targetDate: '2026-10-15'
            }
          }
        };
        setDecisions(seed);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(seed));
      }
    } catch (e) {
      console.error('Failed to load local decisions:', e);
    }
  }, []);

  // Sync CISA KEV feed
  const handleSyncThreatFeed = async () => {
    setThreatLoading(true);
    const data = await fetchCisaKevThreatFeed();
    setThreatEntries(data.entries);
    setThreatIndex(data.index);
    setThreatLoading(false);
  };

  useEffect(() => {
    handleSyncThreatFeed();
  }, []);

  // Update Status
  const handleUpdateStatus = (outcomeId: string, status: MappingStatus) => {
    const updated = {
      ...decisions,
      [outcomeId]: {
        ...(decisions[outcomeId] || { outcomeId }),
        status,
        lastUpdated: new Date().toISOString().split('T')[0]
      }
    };
    setDecisions(updated);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  };

  // Save Evidence Record
  const handleSaveEvidence = (evidence: EvidenceRecord) => {
    if (!activeEvidenceModalOutcomeId) return;

    const existing = decisions[activeEvidenceModalOutcomeId];
    const updatedRecord: OutcomeDecision = {
      outcomeId: activeEvidenceModalOutcomeId,
      status: (existing?.status || 'SUPPORTED') as MappingStatus,
      evidence,
      riskContext: existing?.riskContext,
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    const updated = {
      ...decisions,
      [activeEvidenceModalOutcomeId]: updatedRecord
    };
    setDecisions(updated);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    setActiveEvidenceModalOutcomeId(null);
  };

  // Save Risk Context
  const handleSaveRisk = (riskContext: RiskContext) => {
    if (!activeRiskDrawerOutcomeId) return;

    const existing = decisions[activeRiskDrawerOutcomeId];
    const updatedRecord: OutcomeDecision = {
      outcomeId: activeRiskDrawerOutcomeId,
      status: (existing?.status || 'UNSUPPORTED') as MappingStatus,
      evidence: existing?.evidence,
      riskContext,
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    const updated = {
      ...decisions,
      [activeRiskDrawerOutcomeId]: updatedRecord
    };
    setDecisions(updated);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    setActiveRiskDrawerOutcomeId(null);
  };

  // Export JSON
  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(decisions, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `csf_outcome_ledger_export_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import JSON
  const handleImportJson = (importedData: Record<string, any>) => {
    setDecisions(importedData);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(importedData));
    alert('Ledger dataset imported successfully! All control mapping decisions, evidence hashes, and risk contexts have been loaded.');
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] flex flex-col font-sans">
      
      {/* Header Bar */}
      <Header
        threatIndex={threatIndex}
        doraOverlayActive={doraOverlayActive}
        onToggleDoraOverlay={() => setDoraOverlayActive(!doraOverlayActive)}
        onOpenReportModal={() => setCisoReportModalOpen(true)}
        onOpenTopologyMap={() => setTopologyMapOpen(true)}
        onExportJson={handleExportJson}
        onImportJson={handleImportJson}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Live CISA KEV Threat Intelligence Panel */}
        <ThreatIntelligencePanel
          entries={threatEntries}
          loading={threatLoading}
          onRefresh={handleSyncThreatFeed}
        />

        {/* NIST CSF 2.0 Implementation Tier & Profile Progression */}
        <ProfileTierWidget
          outcomes={NIST_CSF_OUTCOMES}
          decisions={decisions}
        />

        {/* NIST CSF 2.0 & SP 800-53 / DORA Mapping Ledger */}
        <LedgerGrid
          outcomes={NIST_CSF_OUTCOMES}
          decisions={decisions}
          doraOverlayActive={doraOverlayActive}
          onUpdateStatus={handleUpdateStatus}
          onOpenEvidenceModal={(id) => setActiveEvidenceModalOutcomeId(id)}
          onOpenRiskDrawer={(id) => setActiveRiskDrawerOutcomeId(id)}
        />

      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 bg-white py-4 text-xs text-zinc-500 text-center font-mono">
        CSF Outcome Ledger • NIST CSF 2.0 / SP 800-53 / EU DORA & NIS2 • Local-First Architecture • Basil Tsalikidis
      </footer>

      {/* Evidence Modal */}
      {activeEvidenceModalOutcomeId && (
        <EvidenceModal
          outcomeId={activeEvidenceModalOutcomeId}
          existingEvidence={decisions[activeEvidenceModalOutcomeId]?.evidence}
          onSave={handleSaveEvidence}
          onClose={() => setActiveEvidenceModalOutcomeId(null)}
        />
      )}

      {/* Risk Drawer */}
      {activeRiskDrawerOutcomeId && (
        <RiskDrawer
          outcomeId={activeRiskDrawerOutcomeId}
          existingRisk={decisions[activeRiskDrawerOutcomeId]?.riskContext}
          onSave={handleSaveRisk}
          onClose={() => setActiveRiskDrawerOutcomeId(null)}
        />
      )}

      {/* Topology Map */}
      {topologyMapOpen && (
        <TopologyMap
          outcomes={NIST_CSF_OUTCOMES}
          decisions={decisions}
          onClose={() => setTopologyMapOpen(false)}
        />
      )}

      {/* CISO Board Report Modal */}
      {cisoReportModalOpen && (
        <CisoBoardReportModal
          outcomes={NIST_CSF_OUTCOMES}
          decisions={decisions}
          threatIndex={threatIndex}
          onClose={() => setCisoReportModalOpen(false)}
        />
      )}

    </div>
  );
}

export default App;
