import React, { useState } from 'react';
import { X, Send, CheckCircle2, Sparkles, Building2, ShieldCheck, MapPin, Calendar } from 'lucide-react';
import { ProjectRequirement, ProfessionalCategory } from '../types';

interface PostRequirementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitRequirement: (req: Omit<ProjectRequirement, 'id' | 'createdAt' | 'status'>) => void;
  initialEstimate?: { areaSqFt: number; totalCost: number };
}

export const PostRequirementModal: React.FC<PostRequirementModalProps> = ({
  isOpen,
  onClose,
  onSubmitRequirement,
  initialEstimate
}) => {
  const [formData, setFormData] = useState({
    title: initialEstimate
      ? `Custom Modern Villa Residence (${initialEstimate.areaSqFt} sq.ft)`
      : 'Modern 3-Story Residence Project',
    category: 'Architects' as ProfessionalCategory | 'All-in-One Turnkey',
    builtUpAreaSqFt: initialEstimate ? initialEstimate.areaSqFt : 3500,
    location: 'Dehradun, Uttarakhand, India',
    budgetRange: initialEstimate
      ? `₹${Math.round(initialEstimate.totalCost * 0.9).toLocaleString('en-IN')} - ₹${Math.round(initialEstimate.totalCost * 1.1).toLocaleString('en-IN')}`
      : '₹50,00,000 - ₹85,00,000',
    preferredTimeline: '6 - 9 Months',
    architecturalStyle: 'Modern Contemporary',
    description:
      'Looking for top-tier architects and civil experts to construct a modern multi-story villa featuring slate stone cladding, gold aluminum accents, and teak pergolas.'
  });

  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitRequirement({
      ...formData,
      category: formData.category
    });
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#f9f9f7] rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 sm:px-8 py-5 bg-[#003629] text-white">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-white/10 rounded-xl">
              <Building2 className="w-6 h-6 text-[#ecc246]" />
            </div>
            <div>
              <h2 className="font-display font-bold text-xl text-white">
                Post Project Requirement
              </h2>
              <p className="text-xs text-slate-300">
                Get matched with verified professionals & receive quotes within 24 hours
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

        {/* Content Body */}
        {submitted ? (
          <div className="p-12 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="font-display font-extrabold text-2xl text-[#003629]">
              Requirement Posted Successfully!
            </h3>
            <p className="text-slate-600 text-sm max-w-md mx-auto">
              Your project brief is now live. Top-rated Architects & Civil Experts nearby are reviewing your specifications and will send competitive proposals shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5 max-h-[75vh] overflow-y-auto">
            {/* Title */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Project Title / Brief Name
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full p-3 bg-white border border-slate-300 rounded-xl text-sm font-semibold text-[#003629] focus:outline-none focus:ring-2 focus:ring-[#003629]"
                placeholder="e.g. 3-Story Luxury Residence Construction"
              />
            </div>

            {/* Category & Builtup Area */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Primary Service Needed
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="w-full p-3 bg-white border border-slate-300 rounded-xl text-sm font-semibold text-[#003629] focus:outline-none focus:ring-2 focus:ring-[#003629]"
                >
                  <option value="Architects">Architects (Elevation & Blueprints)</option>
                  <option value="Interior Designers">Interior Designers (Turnkey Fitout)</option>
                  <option value="Civil Engineers">Civil Engineers (Structural Execution)</option>
                  <option value="Material Providers">Material Providers (Slate, Glass, Teak)</option>
                  <option value="All-in-One Turnkey">All-in-One Turnkey Team</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Built-up Area (Sq Ft)
                </label>
                <input
                  type="number"
                  required
                  value={formData.builtUpAreaSqFt}
                  onChange={(e) => setFormData({ ...formData, builtUpAreaSqFt: Number(e.target.value) })}
                  className="w-full p-3 bg-white border border-slate-300 rounded-xl text-sm font-semibold text-[#003629] focus:outline-none focus:ring-2 focus:ring-[#003629]"
                />
              </div>
            </div>

            {/* Location & Budget */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Project Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full pl-9 pr-3 py-3 bg-white border border-slate-300 rounded-xl text-sm font-semibold text-[#003629] focus:outline-none focus:ring-2 focus:ring-[#003629]"
                    placeholder="City (e.g. Delhi, Dehradun, Roorkee)"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Target Budget
                </label>
                <input
                  type="text"
                  required
                  value={formData.budgetRange}
                  onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
                  className="w-full p-3 bg-white border border-slate-300 rounded-xl text-sm font-semibold text-[#003629] focus:outline-none focus:ring-2 focus:ring-[#003629]"
                  placeholder="e.g. ₹40 Lakhs - ₹70 Lakhs"
                />
              </div>
            </div>

            {/* Style & Timeline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Architectural Style
                </label>
                <select
                  value={formData.architecturalStyle}
                  onChange={(e) => setFormData({ ...formData, architecturalStyle: e.target.value })}
                  className="w-full p-3 bg-white border border-slate-300 rounded-xl text-sm font-semibold text-[#003629] focus:outline-none focus:ring-2 focus:ring-[#003629]"
                >
                  <option value="Modern Contemporary">Modern Contemporary (Estate Style)</option>
                  <option value="Minimalist Glasshaus">Minimalist Glasshaus</option>
                  <option value="Biophilic & Eco Modern">Biophilic & Eco Modern</option>
                  <option value="Classic Industrial">Classic Industrial</option>
                  <option value="Traditional Tuscan Luxury">Traditional Tuscan Luxury</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Preferred Timeline
                </label>
                <select
                  value={formData.preferredTimeline}
                  onChange={(e) => setFormData({ ...formData, preferredTimeline: e.target.value })}
                  className="w-full p-3 bg-white border border-slate-300 rounded-xl text-sm font-semibold text-[#003629] focus:outline-none focus:ring-2 focus:ring-[#003629]"
                >
                  <option value="3 - 6 Months">3 - 6 Months</option>
                  <option value="6 - 9 Months">6 - 9 Months</option>
                  <option value="9 - 12 Months">9 - 12 Months</option>
                  <option value="Flexible">Flexible</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Special Vision Notes / Material Preferences
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-3 bg-white border border-slate-300 rounded-xl text-sm text-[#003629] focus:outline-none focus:ring-2 focus:ring-[#003629]"
                placeholder="Mention specific desires e.g. slate stone tiles, gold louver screens, low-E glazing..."
              />
            </div>

            {/* Security Guarantee Badge */}
            <div className="flex items-center space-x-3 bg-emerald-50 p-3.5 rounded-2xl border border-emerald-200/80">
              <ShieldCheck className="w-5 h-5 text-[#003629] flex-shrink-0" />
              <p className="text-xs text-[#003629]">
                <strong className="font-bold">Arch-Connect Verified Shield:</strong> Only background-checked, licensed professionals will view your requirements and offer quotes.
              </p>
            </div>

            {/* Form Actions */}
            <div className="pt-2 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-7 py-3 bg-[#003629] hover:bg-[#1b4d3e] text-white font-bold text-sm rounded-full shadow-md hover:shadow-lg transition-all flex items-center space-x-2"
              >
                <Send className="w-4 h-4 text-[#ecc246]" />
                <span>Submit & Get Matches</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
