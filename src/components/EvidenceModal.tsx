import React, { useState } from 'react';
import { X, Hash, Upload, ShieldCheck, FileCheck } from 'lucide-react';
import { computeSha256, formatShortHash } from '../utils/cryptoUtils';
import { EvidenceRecord } from '../types/ledger';

interface EvidenceModalProps {
  outcomeId: string;
  existingEvidence?: EvidenceRecord;
  onSave: (evidence: EvidenceRecord) => void;
  onClose: () => void;
}

export const EvidenceModal: React.FC<EvidenceModalProps> = ({
  outcomeId,
  existingEvidence,
  onSave,
  onClose
}) => {
  const [docName, setDocName] = useState(existingEvidence?.documentName || '');
  const [hash, setHash] = useState(existingEvidence?.referenceHash || '');
  const [reviewer, setReviewer] = useState(
    existingEvidence?.reviewerName || 'Basil Tsalikidis (InfoSec Officer)'
  );
  const [reviewDate] = useState(
    existingEvidence?.reviewDate || new Date().toISOString().split('T')[0]
  );
  const [expiryDate, setExpiryDate] = useState(
    existingEvidence?.expiryDate || '2027-08-01'
  );
  const [rationale, setRationale] = useState(
    existingEvidence?.rationale ||
      'Evidence reviewed and mapped against NIST CSF 2.0 requirements with strict audit provenance.'
  );

  const [hashingFile, setHashingFile] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setHashingFile(true);
    setDocName(file.name);

    try {
      const buffer = await file.arrayBuffer();
      const computedHash = await computeSha256(buffer);
      setHash(computedHash);
    } catch (err) {
      console.error('Error computing SHA-256:', err);
    } finally {
      setHashingFile(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName || !hash) return;

    onSave({
      id: existingEvidence?.id || `EVD-${Date.now()}`,
      documentName: docName,
      referenceHash: hash,
      reviewerName: reviewer,
      reviewDate,
      expiryDate,
      rationale
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 backdrop-blur-xs p-4">
      <div className="bg-white border border-zinc-200 rounded-lg max-w-lg w-full p-6 shadow-xl relative text-left">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2.5 mb-4">
          <div className="w-8 h-8 rounded-md bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
            <FileCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-zinc-900">
              Evidence Provenance & SHA-256 Hasher
            </h3>
            <span className="font-mono text-xs text-teal-700">
              Mapping to {outcomeId}
            </span>
          </div>
        </div>

        <p className="text-xs text-zinc-500 mb-5">
          Compute local SHA-256 file hashes for cryptographic audit verification. Your
          source documents remain 100% local on your device.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* File Picker or Input */}
          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1">
              Select Evidence File (for local SHA-256 calculation)
            </label>
            <div className="flex items-center space-x-2">
              <label className="cursor-pointer bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-md px-3 py-1.5 text-xs text-zinc-700 font-medium flex items-center gap-1.5 transition-colors">
                <Upload className="w-3.5 h-3.5 text-zinc-500" />
                <span>{hashingFile ? 'Hashing...' : 'Browse File'}</span>
                <input type="file" onChange={handleFileUpload} className="hidden" />
              </label>
              <input
                type="text"
                value={docName}
                onChange={(e) => setDocName(e.target.value)}
                placeholder="e.g. ISO27001_Audit_Report_2026.pdf"
                className="flex-1 text-xs border border-zinc-200 rounded-md px-3 py-1.5 focus:outline-none focus:border-teal-600 font-sans"
                required
              />
            </div>
          </div>

          {/* SHA-256 Hash Display */}
          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1 flex items-center gap-1">
              <Hash className="w-3.5 h-3.5 text-teal-600" />
              <span>Cryptographic Audit Hash (SHA-256)</span>
            </label>
            <input
              type="text"
              value={hash}
              onChange={(e) => setHash(e.target.value)}
              placeholder="e.g. e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
              className="w-full text-xs font-mono border border-zinc-200 bg-zinc-50 rounded-md px-3 py-1.5 focus:outline-none focus:border-teal-600 text-zinc-800"
              required
            />
            {hash && (
              <span className="text-[10px] text-teal-700 font-mono mt-1 block">
                ✓ Provenance Fingerprint: {formatShortHash(hash)}
              </span>
            )}
          </div>

          {/* Dates & Reviewer */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">
                Reviewer / Auditor
              </label>
              <input
                type="text"
                value={reviewer}
                onChange={(e) => setReviewer(e.target.value)}
                className="w-full text-xs border border-zinc-200 rounded-md px-2.5 py-1.5 focus:outline-none focus:border-teal-600"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">
                Evidence Expiry Date
              </label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full text-xs border border-zinc-200 rounded-md px-2.5 py-1.5 focus:outline-none focus:border-teal-600 font-mono"
                required
              />
            </div>
          </div>

          {/* Rationale */}
          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1">
              Mapping Rationale & Audit Notes
            </label>
            <textarea
              value={rationale}
              onChange={(e) => setRationale(e.target.value)}
              rows={3}
              className="w-full text-xs border border-zinc-200 rounded-md p-2.5 focus:outline-none focus:border-teal-600 leading-relaxed font-sans"
              required
            />
          </div>

          {/* Footer actions */}
          <div className="pt-3 border-t border-zinc-200 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-zinc-600 hover:bg-zinc-100 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-medium text-white bg-teal-700 hover:bg-teal-800 rounded-md transition-all shadow-xs flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Record Decision</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
