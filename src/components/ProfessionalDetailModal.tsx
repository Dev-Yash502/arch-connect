import React, { useState } from 'react';
import { X, Star, MapPin, Award, CheckCircle2, Phone, Mail, Building, Briefcase, Calendar, MessageSquare, ShieldCheck } from 'lucide-react';
import { Professional, Review } from '../types';

interface ProfessionalDetailModalProps {
  isOpen: boolean;
  professional: Professional | null;
  onClose: () => void;
  onRequestQuote: (prof: Professional) => void;
  reviews?: Review[];
}

export const ProfessionalDetailModal: React.FC<ProfessionalDetailModalProps> = ({
  isOpen,
  professional,
  onClose,
  onRequestQuote,
  reviews = []
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'portfolio' | 'reviews'>('overview');

  if (!isOpen || !professional) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#FDF8F0] rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header Hero Cover */}
        <div className="relative bg-gradient-to-r from-[#4A3728] to-[#6B5040] text-white p-6 sm:p-8 pt-8">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <img
              src={professional.avatar}
              alt={professional.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-white/20 shadow-lg flex-shrink-0"
            />
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] uppercase font-extrabold tracking-widest bg-[#C4A882] text-[#4A3728] px-2.5 py-0.5 rounded-full">
                  {professional.role}
                </span>
                {professional.badge && (
                  <span className="text-[10px] uppercase font-bold tracking-widest bg-white/15 text-amber-200 px-2.5 py-0.5 rounded-full border border-white/20">
                    {professional.badge}
                  </span>
                )}
              </div>

              <h2 className="font-display font-bold text-2xl sm:text-3xl text-white">
                {professional.name}
              </h2>
              <p className="text-xs sm:text-sm text-slate-200 font-medium">{professional.title}</p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1">
                <span className="flex items-center space-x-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-white">{professional.rating}</span>
                  <span>({professional.reviewCount} reviews)</span>
                </span>
                <span className="flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-[#C4A882]" />
                  <span>{professional.location}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Briefcase className="w-3.5 h-3.5 text-[#C4A882]" />
                  <span>{professional.experienceYears} Years Exp.</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Sub-Tabs */}
        <div className="flex border-b border-slate-200 bg-white px-6 sm:px-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3.5 px-4 font-bold text-sm border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-[#4A3728] text-[#4A3728]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Overview & Specialties
          </button>
          <button
            onClick={() => setActiveTab('portfolio')}
            className={`py-3.5 px-4 font-bold text-sm border-b-2 transition-colors ${
              activeTab === 'portfolio'
                ? 'border-[#4A3728] text-[#4A3728]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Project Portfolio ({professional.portfolio.length})
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`py-3.5 px-4 font-bold text-sm border-b-2 transition-colors ${
              activeTab === 'reviews'
                ? 'border-[#4A3728] text-[#4A3728]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Client Reviews ({reviews.filter(r => r.professionalId === professional.id).length})
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 max-h-[60vh] overflow-y-auto space-y-6">
          {activeTab === 'overview' ? (
            <>
              {/* Bio */}
              <div>
                <h3 className="font-display font-bold text-base text-[#4A3728] mb-2">About & Philosophy</h3>
                <p className="text-sm text-slate-700 leading-relaxed bg-white p-4 rounded-2xl border border-slate-200">
                  {professional.bio}
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center">
                  <span className="text-xs text-slate-500 block uppercase font-bold">Base Rate</span>
                  <span className="font-display font-extrabold text-xl text-[#4A3728]">
                    ₹{professional.pricePerSqFt} <span className="text-xs font-normal text-slate-500">/sq ft</span>
                  </span>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center">
                  <span className="text-xs text-slate-500 block uppercase font-bold">Completed</span>
                  <span className="font-display font-extrabold text-xl text-[#4A3728]">
                    {professional.completedProjectsCount}+ <span className="text-xs font-normal text-slate-500">Projects</span>
                  </span>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center">
                  <span className="text-xs text-slate-500 block uppercase font-bold">Client Satisfaction</span>
                  <span className="font-display font-extrabold text-xl text-amber-900">99.4%</span>
                </div>
              </div>

              {/* Specialties */}
              <div>
                <h3 className="font-display font-bold text-base text-[#4A3728] mb-2.5">
                  Core Architectural Competencies
                </h3>
                <div className="flex flex-wrap gap-2">
                  {professional.specialties.map((spec, i) => (
                    <span
                      key={i}
                      className="px-3.5 py-1.5 bg-[#4A3728]/5 text-[#4A3728] font-semibold text-xs rounded-full border border-[#4A3728]/15 flex items-center space-x-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#9B7B5A]" />
                      <span>{spec}</span>
                    </span>
                  ))}
                </div>
              </div>
            </>
          ) : activeTab === 'portfolio' ? (
            /* Portfolio Showcase */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {professional.portfolio.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-2xs space-y-3"
                >
                  <img src={item.image} alt={item.title} className="w-full h-44 object-cover" />
                  <div className="p-4 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#9B7B5A]">
                      {item.category}
                    </span>
                    <h4 className="font-display font-bold text-sm text-[#4A3728]">{item.title}</h4>
                    <p className="text-xs text-slate-600 line-clamp-2">{item.description}</p>
                    {item.location && (
                      <span className="text-[11px] text-slate-400 block pt-1">{item.location} • {item.areaSqFt} sq.ft</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Client Reviews Showcase */
            <div className="space-y-4">
              {reviews.filter(r => r.professionalId === professional.id).length === 0 ? (
                <div className="text-center py-10 bg-white rounded-2xl border border-slate-200 p-6">
                  <p className="text-xs font-semibold text-slate-500">No written reviews submitted yet for this professional.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.filter(r => r.professionalId === professional.id).map((rev) => (
                    <div key={rev.id} className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-display font-bold text-sm text-[#4A3728]">{rev.clientName}</h4>
                          <span className="text-[10px] text-slate-400 font-semibold">{rev.projectTitle}</span>
                        </div>
                        <div className="flex items-center space-x-1 px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-full text-xs font-bold">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          <span>{rev.rating}</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-700 font-medium italic">
                        "{rev.comment}"
                      </p>
                      <span className="text-[9.5px] text-slate-400 font-semibold block text-right">
                        {new Date(rev.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 bg-slate-100 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-600 flex flex-wrap items-center gap-3">
            <span className="flex items-center space-x-1.5 px-3 py-1 bg-amber-900/10 text-amber-900 rounded-full font-semibold border border-amber-800/20">
              <ShieldCheck className="w-3.5 h-3.5 text-[#9B7B5A]" />
              <span>Contact Details Protected</span>
            </span>
            <span className="text-slate-500 font-medium hidden sm:inline">
              Inquire securely via Arch-Connect Platform
            </span>
          </div>

          <button
            onClick={() => {
              onRequestQuote(professional);
              onClose();
            }}
            className="w-full sm:w-auto px-7 py-3 bg-[#9B7B5A] hover:bg-[#7A5C45] text-white font-bold text-sm rounded-full shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2"
          >
            <MessageSquare className="w-4 h-4 text-amber-200" />
            <span>Request Direct Proposal</span>
          </button>
        </div>
      </div>
    </div>
  );
};
