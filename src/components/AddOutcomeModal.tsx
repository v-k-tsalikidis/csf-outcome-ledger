import React, { useState } from 'react';
import { X, PlusCircle, ShieldCheck } from 'lucide-react';
import { NistOutcome, FunctionCategory } from '../types/ledger';

interface AddOutcomeModalProps {
  onAdd: (outcome: NistOutcome) => void;
  onClose: () => void;
}

export const AddOutcomeModal: React.FC<AddOutcomeModalProps> = ({
  onAdd,
  onClose
}) => {
  const [id, setId] = useState('PR.PS-02');
  const [func, setFunc] = useState<FunctionCategory>('PROTECT');
  const [category, setCategory] = useState('Platform Security Hardening');
  const [description, setDescription] = useState('Security baselines are enforced and audited for operational platform components.');
  const [spCode, setSpCode] = useState('CM-7');
  const [spTitle, setSpTitle] = useState('Least Functionality');
  const [isoCode, setIsoCode] = useState('A.8.9');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !description) return;

    onAdd({
      id: id.trim().toUpperCase(),
      function: func,
      category: category.trim(),
      description: description.trim(),
      sp80053Controls: [{ code: spCode.trim().toUpperCase(), title: spTitle.trim(), family: 'Security Controls' }],
      iso27001Controls: [{ code: isoCode.trim().toUpperCase(), title: 'Information Security Control' }],
      doraMapping: { article: 'Art. 9', title: 'ICT Protection & Hardening' },
      nis2Mapping: { article: 'Art. 21.2e', title: 'Network System Security' }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 backdrop-blur-xs p-4">
      <div className="bg-white border border-zinc-200 rounded-lg max-w-lg w-full p-6 shadow-xl relative text-left">
        
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-700">
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2.5 mb-4">
          <div className="w-8 h-8 rounded-md bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
            <PlusCircle className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-zinc-900">
              Add Custom NIST CSF 2.0 Outcome
            </h3>
            <p className="text-xs text-zinc-500">Extend the ledger with custom subcategories or organizational controls.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 font-sans">
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">
                Outcome ID (e.g. GV.RM-02)
              </label>
              <input
                type="text"
                value={id}
                onChange={(e) => setId(e.target.value)}
                className="w-full text-xs font-mono border border-zinc-200 rounded-md px-3 py-1.5 focus:outline-none focus:border-teal-600"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">
                NIST Function
              </label>
              <select
                value={func}
                onChange={(e) => setFunc(e.target.value as FunctionCategory)}
                className="w-full text-xs border border-zinc-200 rounded-md px-2.5 py-1.5 focus:outline-none focus:border-teal-600"
              >
                <option value="GOVERN">GOVERN</option>
                <option value="IDENTIFY">IDENTIFY</option>
                <option value="PROTECT">PROTECT</option>
                <option value="DETECT">DETECT</option>
                <option value="RESPOND">RESPOND</option>
                <option value="RECOVER">RECOVER</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1">
              Category Name
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full text-xs border border-zinc-200 rounded-md px-3 py-1.5 focus:outline-none focus:border-teal-600"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1">
              Outcome Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full text-xs border border-zinc-200 rounded-md p-2.5 focus:outline-none focus:border-teal-600 leading-relaxed"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">
                SP 800-53 Control (e.g. CM-7)
              </label>
              <input
                type="text"
                value={spCode}
                onChange={(e) => setSpCode(e.target.value)}
                className="w-full text-xs font-mono border border-zinc-200 rounded-md px-2.5 py-1.5 focus:outline-none focus:border-teal-600"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">
                ISO 27001 Control (e.g. A.8.9)
              </label>
              <input
                type="text"
                value={isoCode}
                onChange={(e) => setIsoCode(e.target.value)}
                className="w-full text-xs font-mono border border-zinc-200 rounded-md px-2.5 py-1.5 focus:outline-none focus:border-teal-600"
                required
              />
            </div>
          </div>

          <div className="pt-3 border-t border-zinc-200 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-zinc-600 hover:bg-zinc-100 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-medium text-white bg-teal-700 hover:bg-teal-800 rounded-md shadow-xs flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Add Outcome</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
