import React, { useState } from 'react';
import {
  FilePlus,
  Building,
  MapPin,
  Clock,
  DollarSign,
  Layers,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ListFilter,
  ArrowRightLeft,
  Calculator,
  Compass,
  FileText
} from 'lucide-react';
import { ProjectRequirement, ProfessionalCategory } from '../types';

interface ClientPortalProps {
  requirements: ProjectRequirement[];
  onAddRequirement: (req: ProjectRequirement) => void;
  onOpenCostEstimator: () => void;
  onOpenProposalMatrix: () => void;
  onBrowseProfessionals: () => void;
}

export const ClientPortal: React.FC<ClientPortalProps> = ({
  requirements,
  onAddRequirement,
  onOpenCostEstimator,
  onOpenProposalMatrix,
  onBrowseProfessionals
}) => {
  const [showPostForm, setShowPostForm] = useState(false);

  // Requirement form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ProfessionalCategory | 'All-in-One Turnkey'>('Architects');
  const [builtUpAreaSqFt, setBuiltUpAreaSqFt] = useState<number>(2400);
  const [location, setLocation] = useState('Dehradun, India');
  const [budgetRange, setBudgetRange] = useState('₹45L - ₹65L');
  const [preferredTimeline, setPreferredTimeline] = useState('6 - 8 Months');
  const [architecturalStyle, setArchitecturalStyle] = useState('Modern Minimalist Villa');
  const [description, setDescription] = useState('');

  const [postedSuccess, setPostedSuccess] = useState(false);

  const handleSubmitRequirement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const newReq: ProjectRequirement = {
      id: `req-${Date.now()}`,
      title,
      category,
      builtUpAreaSqFt: Number(builtUpAreaSqFt),
      location,
      budgetRange,
      preferredTimeline,
      architecturalStyle,
      description,
      status: 'Open for Bids',
      createdAt: 'Just now'
    };

    onAddRequirement(newReq);
    setPostedSuccess(true);
    setTitle('');
    setDescription('');
    setShowPostForm(false);
    setTimeout(() => setPostedSuccess(false), 3000);
  };

  return (
    <div className="py-12 bg-[#FDF8F0] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-10">
        
        {/* Client Portal Hero Banner */}
        <div className="bg-gradient-to-r from-[#4A3728] via-[#6B5040] to-[#4A3728] rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-amber-200 text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Homeowner & Client Portal</span>
            </div>
            <h1 className="font-display font-extrabold text-2xl sm:text-4xl text-white">
              Project Requirements & Bids
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 max-w-xl">
              Post construction vision, set custom budget & timeline, receive verified proposals from certified architects and contractors.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowPostForm(!showPostForm)}
              className="px-6 py-3 bg-[#9B7B5A] hover:bg-[#7A5C45] text-white font-bold text-xs sm:text-sm rounded-full shadow-md transition-all flex items-center space-x-2"
            >
              <FilePlus className="w-4 h-4 text-amber-200" />
              <span>{showPostForm ? 'Close Form' : 'Post New Requirement'}</span>
            </button>
            
            <button
              onClick={onOpenCostEstimator}
              className="px-5 py-3 bg-white/15 hover:bg-white/25 text-white font-bold text-xs sm:text-sm rounded-full border border-white/20 transition-all flex items-center space-x-1.5"
            >
              <Calculator className="w-4 h-4 text-[#C4A882]" />
              <span>Cost Estimator</span>
            </button>
          </div>
        </div>

        {postedSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-2xl flex items-center space-x-3 animate-fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span className="text-sm font-bold">
              Your requirement has been posted successfully! Verified professionals will submit bids shortly.
            </span>
          </div>
        )}

        {/* Post Requirement Drawer Form */}
        {showPostForm && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-lg space-y-6 animate-fade-in">
            <div className="border-b border-slate-200 pb-4 flex items-center justify-between">
              <div>
                <h2 className="font-display font-bold text-lg text-[#4A3728]">
                  Post a Project Requirement
                </h2>
                <p className="text-xs text-slate-500">
                  Fill in your property specifications to invite quotes from verified experts.
                </p>
              </div>
              <span className="text-xs font-bold uppercase px-3 py-1 bg-amber-50 text-amber-900 rounded-full border border-amber-200">
                Step 1 of 2
              </span>
            </div>

            <form onSubmit={handleSubmitRequirement} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Project Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. 3-Story Modern Villa Elevation & Interior"
                    className="w-full px-4 py-2.5 bg-[#FDF8F0] border border-slate-300 rounded-xl text-xs font-semibold text-[#2C1F14] focus:outline-none focus:ring-2 focus:ring-[#4A3728]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Target Role Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-4 py-2.5 bg-[#FDF8F0] border border-slate-300 rounded-xl text-xs font-semibold text-[#2C1F14] focus:outline-none focus:ring-2 focus:ring-[#4A3728]"
                  >
                    <option value="Architects">Architects (Blueprints & Elevation)</option>
                    <option value="Interior Designers">Interior Designers (Turnkey Living)</option>
                    <option value="Civil Engineers">Civil Engineers (Structural Frame)</option>
                    <option value="Material Providers">Material Providers (Slate & Glass)</option>
                    <option value="All-in-One Turnkey">All-in-One Turnkey Package</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Built-Up Area (Sq.Ft)</label>
                  <input
                    type="number"
                    required
                    value={builtUpAreaSqFt}
                    onChange={(e) => setBuiltUpAreaSqFt(Number(e.target.value))}
                    placeholder="2500"
                    className="w-full px-4 py-2.5 bg-[#FDF8F0] border border-slate-300 rounded-xl text-xs font-semibold text-[#2C1F14] focus:outline-none focus:ring-2 focus:ring-[#4A3728]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Location / City</label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Dehradun, Uttarakhand"
                    className="w-full px-4 py-2.5 bg-[#FDF8F0] border border-slate-300 rounded-xl text-xs font-semibold text-[#2C1F14] focus:outline-none focus:ring-2 focus:ring-[#4A3728]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Budget Range</label>
                  <input
                    type="text"
                    required
                    value={budgetRange}
                    onChange={(e) => setBudgetRange(e.target.value)}
                    placeholder="₹50L - ₹75L"
                    className="w-full px-4 py-2.5 bg-[#FDF8F0] border border-slate-300 rounded-xl text-xs font-semibold text-[#2C1F14] focus:outline-none focus:ring-2 focus:ring-[#4A3728]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Preferred Timeline</label>
                  <input
                    type="text"
                    required
                    value={preferredTimeline}
                    onChange={(e) => setPreferredTimeline(e.target.value)}
                    placeholder="6 - 8 Months"
                    className="w-full px-4 py-2.5 bg-[#FDF8F0] border border-slate-300 rounded-xl text-xs font-semibold text-[#2C1F14] focus:outline-none focus:ring-2 focus:ring-[#4A3728]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Architectural Style</label>
                  <input
                    type="text"
                    required
                    value={architecturalStyle}
                    onChange={(e) => setArchitecturalStyle(e.target.value)}
                    placeholder="Modern Minimalist Villa with Slate Facade"
                    className="w-full px-4 py-2.5 bg-[#FDF8F0] border border-slate-300 rounded-xl text-xs font-semibold text-[#2C1F14] focus:outline-none focus:ring-2 focus:ring-[#4A3728]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Detailed Vision & Scope</label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your design expectations, room count, material preferences, lighting, cantilever balcony framing..."
                  className="w-full px-4 py-2.5 bg-[#FDF8F0] border border-slate-300 rounded-xl text-xs font-semibold text-[#2C1F14] focus:outline-none focus:ring-2 focus:ring-[#4A3728]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#4A3728] hover:bg-[#6B5040] text-white font-extrabold text-sm rounded-2xl shadow-md transition-all flex items-center justify-center space-x-2"
              >
                <FilePlus className="w-4 h-4 text-amber-200" />
                <span>Submit Job Requirement for Bids</span>
              </button>
            </form>
          </div>
        )}

        {/* Requirements Feed & Actions */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h2 className="font-display font-extrabold text-xl text-[#4A3728] flex items-center space-x-2">
                <FileText className="w-5 h-5 text-[#9B7B5A]" />
                <span>Posted Requirements ({requirements.length})</span>
              </h2>
              <p className="text-xs text-slate-500">
                Manage your active job postings and compare proposals submitted by experts.
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={onOpenProposalMatrix}
                className="px-4 py-2 bg-white text-[#4A3728] border border-slate-300 rounded-full font-bold text-xs shadow-2xs hover:bg-slate-100 transition-colors flex items-center space-x-1.5"
              >
                <ArrowRightLeft className="w-3.5 h-3.5 text-[#9B7B5A]" />
                <span>Compare Received Bids</span>
              </button>
              
              <button
                onClick={onBrowseProfessionals}
                className="px-4 py-2 bg-[#9B7B5A] text-white rounded-full font-bold text-xs shadow-2xs hover:bg-[#7A5C45] transition-colors flex items-center space-x-1.5"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Explore Experts</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {requirements.map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4 hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 bg-amber-50 text-amber-900 rounded-full border border-amber-200">
                      {req.category}
                    </span>
                    <span className="text-xs font-bold px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-full border border-emerald-200 flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>{req.status}</span>
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-lg text-[#4A3728]">
                    {req.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {req.description}
                  </p>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                    <div className="flex items-center space-x-1.5 text-slate-600">
                      <Building className="w-3.5 h-3.5 text-[#9B7B5A]" />
                      <span>{req.builtUpAreaSqFt} Sq.Ft</span>
                    </div>
                    <div className="flex items-center space-x-1.5 text-slate-600">
                      <MapPin className="w-3.5 h-3.5 text-[#9B7B5A]" />
                      <span>{req.location}</span>
                    </div>
                    <div className="flex items-center space-x-1.5 text-slate-600">
                      <DollarSign className="w-3.5 h-3.5 text-[#9B7B5A]" />
                      <span>{req.budgetRange}</span>
                    </div>
                    <div className="flex items-center space-x-1.5 text-slate-600">
                      <Clock className="w-3.5 h-3.5 text-[#9B7B5A]" />
                      <span>{req.preferredTimeline}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Style: {req.architecturalStyle}</span>
                  <button
                    onClick={onOpenProposalMatrix}
                    className="text-[#9B7B5A] font-bold hover:underline flex items-center space-x-1"
                  >
                    <span>View Proposals</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
