import React, { useState } from 'react';
import { X, Check, Star, ShieldCheck, Clock, Award, ArrowRight, FileText } from 'lucide-react';
import { Proposal } from '../types';

interface ProposalComparatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  proposals: Proposal[];
  onAcceptProposal: (proposalId: string) => void;
}

export const ProposalComparatorModal: React.FC<ProposalComparatorModalProps> = ({
  isOpen,
  onClose,
  proposals,
  onAcceptProposal
}) => {
  const [acceptedId, setAcceptedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAccept = (id: string) => {
    setAcceptedId(id);
    onAcceptProposal(id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#f9f9f7] rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 sm:px-8 py-5 bg-[#003629] text-white">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-white/10 rounded-xl">
              <FileText className="w-6 h-6 text-[#ecc246]" />
            </div>
            <div>
              <h2 className="font-display font-bold text-xl sm:text-2xl text-white">
                Proposal Comparison Matrix
              </h2>
              <p className="text-xs text-slate-300">
                Side-by-side bid analysis for Modern 3-Story Residence
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
          {acceptedId && (
            <div className="p-4 bg-emerald-100 border border-emerald-300 text-[#003629] rounded-2xl flex items-center space-x-3">
              <ShieldCheck className="w-6 h-6 text-emerald-700 flex-shrink-0" />
              <div>
                <strong className="font-bold block">Proposal Accepted!</strong>
                <p className="text-xs text-emerald-800">
                  You have locked in your contract with escrow protection. Your lead architect/engineer will reach out for the initial site survey within 24 hours.
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {proposals.map((prop) => {
              const isSelected = acceptedId === prop.id || prop.status === 'Accepted';

              return (
                <div
                  key={prop.id}
                  className={`bg-white rounded-2xl p-6 border shadow-sm flex flex-col justify-between transition-all ${
                    isSelected ? 'border-2 border-[#755b00] ring-2 ring-[#755b00]/20 bg-amber-50/20' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-4">
                    {/* Header info */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <img
                          src={prop.professionalAvatar}
                          alt={prop.professionalName}
                          className="w-12 h-12 rounded-full object-cover border-2 border-[#003629]"
                        />
                        <div>
                          <h3 className="font-display font-bold text-base text-[#003629]">
                            {prop.professionalName}
                          </h3>
                          <span className="text-xs font-semibold text-[#755b00]">
                            {prop.professionalRole}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1 text-xs font-bold text-slate-800 bg-amber-100 px-2.5 py-1 rounded-full">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        <span>{prop.rating}</span>
                      </div>
                    </div>

                    {/* Price & Timeline */}
                    <div className="bg-[#f9f9f7] p-4 rounded-xl border border-slate-200/80 flex justify-between items-center">
                      <div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                          Total Estimate
                        </span>
                        <span className="text-2xl font-display font-extrabold text-[#003629]">
                          ₹{prop.priceEstimateTotal.toLocaleString('en-IN')}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                          Duration
                        </span>
                        <span className="text-sm font-bold text-slate-800 flex items-center space-x-1">
                          <Clock className="w-3.5 h-3.5 text-[#755b00]" />
                          <span>{prop.timelineEstimateMonths} Months</span>
                        </span>
                      </div>
                    </div>

                    {/* Highlights */}
                    <div className="space-y-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                        Included Key Deliverables
                      </span>
                      <ul className="space-y-1.5 text-xs text-slate-700">
                        {prop.keyHighlights.map((hl, idx) => (
                          <li key={idx} className="flex items-start space-x-2">
                            <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                            <span>{hl}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Scope Breakdown */}
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                        Cost Breakdown
                      </span>
                      <div className="space-y-1 text-xs text-slate-600">
                        {prop.scopeBreakdown.map((sb, idx) => (
                          <div key={idx} className="flex justify-between">
                            <span>{sb.item}</span>
                            <span className="font-semibold text-slate-900">₹{sb.cost.toLocaleString('en-IN')}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Action */}
                  <div className="pt-6">
                    <button
                      onClick={() => handleAccept(prop.id)}
                      disabled={isSelected}
                      className={`w-full py-3 rounded-full font-bold text-sm transition-all flex items-center justify-center space-x-2 ${
                        isSelected
                          ? 'bg-emerald-700 text-white cursor-default'
                          : 'bg-[#003629] hover:bg-[#1b4d3e] text-white shadow-md hover:shadow-lg'
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Contract Awarded</span>
                        </>
                      ) : (
                        <>
                          <span>Award Contract</span>
                          <ArrowRight className="w-4 h-4 text-[#ecc246]" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
