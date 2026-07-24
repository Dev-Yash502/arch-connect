import React, { useState } from 'react';
import {
  Sparkles,
  Award,
  CheckCircle2,
  MapPin,
  Star,
  Zap,
  ArrowRight,
  ShieldCheck,
  Building,
  UserCheck,
  MessageSquare,
  Briefcase
} from 'lucide-react';
import { Professional, ProjectRequirement } from '../types';

interface ClientEngineerMatcherProps {
  requirements: ProjectRequirement[];
  professionals: Professional[];
  onRequestQuote: (prof: Professional) => void;
  onSelectProfModal: (prof: Professional) => void;
}

export const ClientEngineerMatcher: React.FC<ClientEngineerMatcherProps> = ({
  requirements,
  professionals,
  onRequestQuote,
  onSelectProfModal
}) => {
  const [selectedReqId, setSelectedReqId] = useState<string>(requirements[0]?.id || '');
  const [targetCategory, setTargetCategory] = useState<'All' | 'Civil Engineers' | 'Architects' | 'Interior Designers'>('Civil Engineers');

  const selectedReq = requirements.find((r) => r.id === selectedReqId) || requirements[0];

  // Smart Matching Algorithm
  const matchedProfessionals = professionals
    .filter((prof) => prof.role !== 'Material Providers') // Exclude Material Providers as requested (Coming Soon)
    .filter((prof) => targetCategory === 'All' || prof.role === targetCategory)
    .map((prof) => {
      let score = 70; // Base score
      const matchReasons: string[] = [];

      // Category match boost
      if (selectedReq && (prof.role === selectedReq.category || selectedReq.category === 'All-in-One Turnkey')) {
        score += 15;
        matchReasons.push(`Exact role match for ${prof.role}`);
      }

      // Location match boost
      if (selectedReq && prof.location.toLowerCase().includes(selectedReq.location.toLowerCase().split(',')[0])) {
        score += 10;
        matchReasons.push(`Located in ${prof.location}`);
      } else {
        matchReasons.push(`Serves regional area (${prof.location})`);
      }

      // Rating boost
      if (prof.rating >= 4.8) {
        score += 4;
        matchReasons.push(`Top Guild rating (${prof.rating} ★)`);
      }

      // Experience boost
      if (prof.experienceYears >= 10) {
        score += 3;
        matchReasons.push(`${prof.experienceYears}+ years structural experience`);
      }

      // Specialty match
      if (prof.specialties.some((s) => s.toLowerCase().includes('structural') || s.toLowerCase().includes('civil') || s.toLowerCase().includes('villa'))) {
        score += 3;
        matchReasons.push(`Specializes in ${prof.specialties[0]}`);
      }

      const matchPercentage = Math.min(99, score);

      return {
        prof,
        matchPercentage,
        matchReasons
      };
    })
    .sort((a, b) => b.matchPercentage - a.matchPercentage);

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-amber-900/10 text-amber-900 rounded-full font-bold text-xs">
            <Zap className="w-3.5 h-3.5 text-[#9B7B5A]" />
            <span>AI Engineer & Expert Matching Engine</span>
          </div>
          <h2 className="font-display font-extrabold text-2xl text-[#4A3728]">
            Smart Engineer & Architect Matcher
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Calculates verified compatibility scores for your project specifications.
          </p>
        </div>

        {/* Category Selector Filter */}
        <div className="flex items-center gap-1.5 bg-[#FDF8F0] p-1.5 rounded-2xl border border-slate-300 text-xs font-bold">
          {(['Civil Engineers', 'Architects', 'Interior Designers', 'All'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setTargetCategory(cat)}
              className={`px-3 py-2 rounded-xl transition-all ${
                targetCategory === cat
                  ? 'bg-[#4A3728] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Select Active Requirement */}
      {requirements.length > 0 && (
        <div className="flex items-center space-x-3 overflow-x-auto pb-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex-shrink-0">
            Matching For Project:
          </span>
          {requirements.map((req) => (
            <button
              key={req.id}
              onClick={() => setSelectedReqId(req.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex-shrink-0 flex items-center space-x-2 ${
                selectedReqId === req.id
                  ? 'bg-[#9B7B5A] text-white shadow-xs'
                  : 'bg-[#FDF8F0] text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              <Building className="w-3.5 h-3.5" />
              <span className="truncate max-w-[200px]">{req.title}</span>
            </button>
          ))}
        </div>
      )}

      {/* Matched Engineers List */}
      <div className="space-y-4">
        {matchedProfessionals.length === 0 ? (
          <div className="text-center py-10 text-slate-500">
            No matching professionals found for this category.
          </div>
        ) : (
          matchedProfessionals.map(({ prof, matchPercentage, matchReasons }) => (
            <div
              key={prof.id}
              className="bg-[#FDF8F0] rounded-2xl p-5 border border-slate-200 shadow-2xs hover:border-[#4A3728]/40 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-5 group"
            >
              <div className="flex items-start space-x-4">
                <img
                  src={prof.avatar}
                  alt={prof.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-white shadow-sm flex-shrink-0"
                />

                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-0.5 bg-[#4A3728] text-white font-extrabold text-[11px] rounded-full flex items-center space-x-1">
                      <Zap className="w-3 h-3 text-amber-300" />
                      <span>{matchPercentage}% Match</span>
                    </span>

                    <span className="text-[10px] uppercase font-extrabold tracking-wider px-2.5 py-0.5 bg-[#C4A882]/30 text-[#4A3728] rounded-full">
                      {prof.role}
                    </span>

                    {prof.badge && (
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-amber-100 text-amber-900 rounded-full border border-amber-300">
                        {prof.badge}
                      </span>
                    )}
                  </div>

                  <div>
                    <h3
                      onClick={() => onSelectProfModal(prof)}
                      className="font-display font-bold text-lg text-[#4A3728] hover:text-[#9B7B5A] cursor-pointer transition-colors"
                    >
                      {prof.name}
                    </h3>
                    <p className="text-xs text-slate-600">{prof.title}</p>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {matchReasons.map((reason, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-semibold text-[#4A3728] bg-white px-2.5 py-1 rounded-lg border border-slate-200 flex items-center space-x-1"
                      >
                        <CheckCircle2 className="w-3 h-3 text-[#9B7B5A]" />
                        <span>{reason}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions & Fee */}
              <div className="w-full md:w-auto flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 pt-3 md:pt-0 border-slate-200 gap-3 flex-shrink-0">
                <div className="text-left md:text-right">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Rate / Sq.Ft</span>
                  <span className="font-display font-extrabold text-lg text-[#4A3728]">
                    ₹{prof.pricePerSqFt}
                  </span>
                </div>

                <button
                  onClick={() => onRequestQuote(prof)}
                  className="px-5 py-2.5 bg-[#9B7B5A] hover:bg-[#7A5C45] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center space-x-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-amber-200" />
                  <span>Request Proposal</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
