import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ThreatIntelligencePanel } from './components/ThreatIntelligencePanel';
import { LedgerGrid } from './components/LedgerGrid';
import { EvidenceModal } from './components/EvidenceModal';
import { RiskDrawer } from './components/RiskDrawer';
import { TopologyMap } from './components/TopologyMap';
import { CisoBoardReportModal } from './components/CisoBoardReportModal';
import { ProfileTierWidget } from './components/ProfileTierWidget';
import { AddOutcomeModal } from './components/AddOutcomeModal';
import { NIST_CSF_OUTCOMES } from './data/nistCsfData';
import { fetchCisaKevThreatFeed } from './services/cisaKevApi';
import { OutcomeDecision, MappingStatus, EvidenceRecord, RiskContext, CisaKevEntry, ThreatIndex, NistOutcome } from './types/ledger';

const LOCAL_STORAGE_KEY = 'csf_outcome_ledger_decisions_v1';
const LOCAL_STORAGE_OUTCOMES_KEY = 'csf_outcome_ledger_custom_outcomes_v1';

export function App() {
  const [outcomes, setOutcomes] = useState<NistOutcome[]>(NIST_CSF_OUTCOMES);
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
  const [addOutcomeModalOpen, setAddOutcomeModalOpen] = useState(false);

  // Load initial decisions & custom outcomes from LocalStorage
  useEffect(() => {
    try {
      const savedDecisions = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedDecisions) {
        setDecisions(JSON.parse(savedDecisions));
      } else {
        const seed: Record<string, OutcomeDecision> = {
          'PR.AA-01': {
            outcomeId: 'PR.AA-01',
            status: 'SUPPORTED',
            lastUpdated: new Date().toISOString().split('T')[0],
            evidence: {
              id: 'EVD-001',
              documentName: 'Identity_MFA_Enforcement_Policy_2026.pdf',
              referenceHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
              reviewerName: 'Basil Tsalikidis (InfoSec Officer)',
              reviewDate: '2026-06-15',
              expiryDate: '2027-06-15',
              rationale: 'MFA enforced across enterprise VPN and NATO CIS gateways per ISO 27001 & DORA Article 9.'
            }
          }
        };
        setDecisions(seed);
      }

      const savedCustomOutcomes = localStorage.getItem(LOCAL_STORAGE_OUTCOMES_KEY);
      if (savedCustomOutcomes) {
        const parsedCustom: NistOutcome[] = JSON.parse(savedCustomOutcomes);
        setOutcomes([...NIST_CSF_OUTCOMES, ...parsedCustom]);
      }
    } catch (e) {
      console.error('Error reading localStorage:', e);
    }
  }, []);

  // Fetch Live CISA Threats
  useEffect(() => {
    handleSyncThreatFeed();
  }, []);

  const handleSyncThreatFeed = async () => {
    setThreatLoading(true);
    const result = await fetchCisaKevThreatFeed();
    setThreatEntries(result.entries);
    setThreatIndex(result.index);
    setThreatLoading(false);
  };

  // Status updates
  const handleUpdateStatus = (outcomeId: string, status: MappingStatus) => {
    const updated = {
      ...decisions,
      [outcomeId]: {
        ...decisions[outcomeId],
        outcomeId,
        status,
        lastUpdated: new Date().toISOString().split('T')[0]
      }
    };
    setDecisions(updated);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  };

  // Add Custom Outcome
  const handleAddCustomOutcome = (newOutcome: NistOutcome) => {
    const updatedOutcomes = [...outcomes, newOutcome];
    setOutcomes(updatedOutcomes);

    // Save custom additions
    const customOnly = updatedOutcomes.filter(o => !NIST_CSF_OUTCOMES.some(defaultO => defaultO.id === o.id));
    localStorage.setItem(LOCAL_STORAGE_OUTCOMES_KEY, JSON.stringify(customOnly));

    setAddOutcomeModalOpen(false);
  };

  // Evidence recording
  const handleSaveEvidence = (outcomeId: string, evidence: EvidenceRecord) => {
    const updated = {
      ...decisions,
      [outcomeId]: {
        ...decisions[outcomeId],
        outcomeId,
        status: 'SUPPORTED' as MappingStatus,
        evidence,
        lastUpdated: new Date().toISOString().split('T')[0]
      }
    };
    setDecisions(updated);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    setActiveEvidenceModalOutcomeId(null);
  };

  // Risk context recording
  const handleSaveRiskContext = (outcomeId: string, riskContext: RiskContext) => {
    const updated = {
      ...decisions,
      [outcomeId]: {
        ...decisions[outcomeId],
        outcomeId,
        riskContext,
        lastUpdated: new Date().toISOString().split('T')[0]
      }
    };
    setDecisions(updated);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    setActiveRiskDrawerOutcomeId(null);
  };

  // Export JSON
  const handleExportJson = () => {
    const exportData = {
      outcomes,
      decisions,
      exportedAt: new Date().toISOString()
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `csf_outcome_ledger_export_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import JSON
  const handleImportJson = (importedData: Record<string, any>) => {
    if (importedData.decisions) {
      setDecisions(importedData.decisions);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(importedData.decisions));
      if (importedData.outcomes && Array.isArray(importedData.outcomes)) {
        setOutcomes(importedData.outcomes);
      }
    } else {
      setDecisions(importedData);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(importedData));
    }
    alert('Ledger dataset imported successfully! All control mapping decisions, evidence hashes, and risk contexts have been loaded.');
  };

  const activeEvidenceOutcome = outcomes.find(o => o.id === activeEvidenceModalOutcomeId);
  const activeRiskOutcome = outcomes.find(o => o.id === activeRiskDrawerOutcomeId);

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
          outcomes={outcomes}
          decisions={decisions}
        />

        {/* NIST CSF 2.0 & SP 800-53 / DORA Mapping Ledger */}
        <LedgerGrid
          outcomes={outcomes}
          decisions={decisions}
          doraOverlayActive={doraOverlayActive}
          onUpdateStatus={handleUpdateStatus}
          onOpenEvidenceModal={(id) => setActiveEvidenceModalOutcomeId(id)}
          onOpenRiskDrawer={(id) => setActiveRiskDrawerOutcomeId(id)}
          onOpenAddOutcomeModal={() => setAddOutcomeModalOpen(true)}
        />

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-zinc-200 py-6 mt-12 text-center text-xs text-zinc-500 font-mono">
        <p>CSF Outcome Ledger v1.0.0 — Open Source NIST CSF 2.0 & EU DORA Workbench</p>
        <p className="mt-1 text-zinc-400">Created by Vasileios (Basil) Tsalikidis — MIT License</p>
      </footer>

      {/* Modals & Drawers */}
      {activeEvidenceOutcome && (
        <EvidenceModal
          outcomeId={activeEvidenceOutcome.id}
          existingEvidence={decisions[activeEvidenceOutcome.id]?.evidence}
          onSave={(evd) => handleSaveEvidence(activeEvidenceOutcome.id, evd)}
          onClose={() => setActiveEvidenceModalOutcomeId(null)}
        />
      )}

      {activeRiskOutcome && (
        <RiskDrawer
          outcomeId={activeRiskOutcome.id}
          existingRisk={decisions[activeRiskOutcome.id]?.riskContext}
          onSave={(risk) => handleSaveRiskContext(activeRiskOutcome.id, risk)}
          onClose={() => setActiveRiskDrawerOutcomeId(null)}
        />
      )}

      {topologyMapOpen && (
        <TopologyMap
          outcomes={outcomes}
          decisions={decisions}
          onClose={() => setTopologyMapOpen(false)}
        />
      )}

      {cisoReportModalOpen && (
        <CisoBoardReportModal
          outcomes={outcomes}
          decisions={decisions}
          threatIndex={threatIndex}
          onClose={() => setCisoReportModalOpen(false)}
        />
      )}

      {addOutcomeModalOpen && (
        <AddOutcomeModal
          onAdd={handleAddCustomOutcome}
          onClose={() => setAddOutcomeModalOpen(false)}
        />
      )}

    </div>
  );
}

export default App;
