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
  FileText,
  Phone,
  Mail,
  User,
  Check,
  ShieldCheck,
  Star,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { ClientEngineerMatcher } from './ClientEngineerMatcher';
import { ProjectRequirement, ProfessionalCategory, Professional, Proposal, AuthUser } from '../types';

interface ClientPortalProps {
  requirements: ProjectRequirement[];
  professionals: Professional[];
  proposals?: Proposal[];
  currentUser?: AuthUser | null;
  onAddRequirement: (req: ProjectRequirement) => void;
  onOpenCostEstimator: () => void;
  onOpenProposalMatrix: () => void;
  onBrowseProfessionals: () => void;
  onRequestQuote: (prof: Professional) => void;
  onSelectProfModal: (prof: Professional) => void;
  onUpdateProposalStatus?: (proposalId: string, status: 'Pending' | 'Accepted' | 'Shortlisted', requirementId?: string) => void;
  onCompleteAndRateProject?: (requirementId: string, professionalId: string, rating: number, feedback: string) => void;
}

export const ClientPortal: React.FC<ClientPortalProps> = ({
  requirements,
  professionals,
  proposals = [],
  currentUser,
  onAddRequirement,
  onOpenCostEstimator,
  onOpenProposalMatrix,
  onBrowseProfessionals,
  onRequestQuote,
  onSelectProfModal,
  onUpdateProposalStatus,
  onCompleteAndRateProject
}) => {
  const [showPostForm, setShowPostForm] = useState(false);
  const [expandedReqId, setExpandedReqId] = useState<string | null>(null);

  // Rating Modal state
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [ratingValue, setRatingValue] = useState(5);
  const [ratingFeedback, setRatingFeedback] = useState('');
  const [ratingReqId, setRatingReqId] = useState('');
  const [ratingProfId, setRatingProfId] = useState('');
  const [ratingProfName, setRatingProfName] = useState('');

  const clientReqs = requirements.filter(r => r.ownerId === currentUser?.id);

  // Requirement form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ProfessionalCategory | 'All-in-One Turnkey'>('Architects');
  const [builtUpAreaSqFt, setBuiltUpAreaSqFt] = useState<number>(2400);
  const [location, setLocation] = useState('Dehradun');
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
              <span>Homeowner & User Portal</span>
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
                    value={builtUpAreaSqFt === 0 ? '' : builtUpAreaSqFt}
                    onChange={(e) => setBuiltUpAreaSqFt(Number(e.target.value))}
                    placeholder="2500"
                    className="w-full px-4 py-2.5 bg-[#FDF8F0] border border-slate-300 rounded-xl text-xs font-semibold text-[#2C1F14] focus:outline-none focus:ring-2 focus:ring-[#4A3728]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Location / City</label>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#FDF8F0] border border-slate-300 rounded-xl text-xs font-semibold text-[#2C1F14] focus:outline-none focus:ring-2 focus:ring-[#4A3728]"
                  >
                    <option value="Dehradun">Dehradun</option>
                    <option value="Roorkee">Roorkee</option>
                    <option value="Delhi">Delhi</option>
                  </select>
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

        {/* SMART ENGINEER & PROFESSIONAL MATCHER SECTION */}
        {clientReqs.length > 0 && (
          <ClientEngineerMatcher
            requirements={clientReqs}
            professionals={professionals}
            onRequestQuote={onRequestQuote}
            onSelectProfModal={onSelectProfModal}
          />
        )}

        {/* Requirements Feed & Actions */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h2 className="font-display font-extrabold text-xl text-[#4A3728] flex items-center space-x-2">
                <FileText className="w-5 h-5 text-[#9B7B5A]" />
                <span>Posted Requirements ({clientReqs.length})</span>
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

          {clientReqs.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-[#FDF8F0] flex items-center justify-center mx-auto text-[#9B7B5A]">
                <FileText className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="font-display font-bold text-[#4A3728] text-base">No Posted Requirements Yet</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Click "Post New Requirement" at the top of the portal to share your project brief and invite quotes from certified experts.
                </p>
              </div>
              <button
                onClick={() => setShowPostForm(true)}
                className="px-5 py-2.5 bg-[#4A3728] hover:bg-[#6B5040] text-white text-xs font-bold rounded-full transition-colors cursor-pointer"
              >
                Post Your First Requirement
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {clientReqs.map((req) => {
                const reqProposals = proposals.filter((p) => p.requirementId === req.id);
                const isExpanded = expandedReqId === req.id;

                return (
                  <div
                    key={req.id}
                    className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4 hover:shadow-md transition-shadow flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 bg-amber-50 text-amber-900 rounded-full border border-amber-200">
                          {req.category}
                        </span>
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full border flex items-center space-x-1 ${
                          req.status === 'Completed'
                            ? 'bg-slate-100 text-slate-800 border-slate-300'
                            : req.status === 'Matched'
                            ? 'bg-blue-50 text-blue-800 border-blue-200'
                            : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        }`}>
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

                      {/* Interested Experts Banner / Drawer */}
                      {reqProposals.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-amber-100">
                          <button
                            onClick={() => setExpandedReqId(isExpanded ? null : req.id)}
                            className="w-full flex items-center justify-between p-3 bg-amber-50/80 hover:bg-amber-100/80 border border-amber-200/80 rounded-2xl transition-all text-left"
                          >
                            <div className="flex items-center space-x-2">
                              <Sparkles className="w-4 h-4 text-amber-700 animate-pulse" />
                              <span className="text-xs font-bold text-amber-900">
                                {reqProposals.length} Expert{reqProposals.length > 1 ? 's' : ''} Expressed Interest
                              </span>
                            </div>
                            <div className="flex items-center space-x-1 text-xs font-bold text-[#4A3728]">
                              <span>{isExpanded ? 'Hide' : 'View Experts'}</span>
                              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </div>
                          </button>

                          {/* Expanded List of Proposals / Interested Experts */}
                          {isExpanded && (
                            <div className="mt-3 space-y-3 animate-fade-in">
                              {reqProposals.map((prop) => {
                                const profDetails = professionals.find((p) => p.id === prop.professionalId || p.name === prop.professionalName);
                                const displayName = profDetails?.name || prop.professionalName;
                                const displayRole = profDetails?.role || prop.professionalRole;
                                const displayAvatar = profDetails?.avatar || prop.professionalAvatar;
                                const isAccepted = prop.status === 'Accepted';

                                return (
                                  <div
                                    key={prop.id}
                                    className={`p-4 rounded-2xl border transition-all ${
                                      isAccepted
                                        ? 'bg-emerald-50/60 border-emerald-300'
                                        : 'bg-slate-50 border-slate-200'
                                    }`}
                                  >
                                    <div className="flex items-start justify-between">
                                      <div className="flex items-center space-x-3">
                                        <img
                                          src={displayAvatar}
                                          alt={displayName}
                                          className="w-10 h-10 rounded-full object-cover border border-[#4A3728]"
                                        />
                                        <div>
                                          <h4 className="font-bold text-xs text-[#4A3728]">{displayName}</h4>
                                          <span className="text-[10px] font-semibold text-[#9B7B5A] block">{displayRole}</span>
                                          <div className="flex items-center space-x-1 text-[10px] text-amber-700 font-bold">
                                            <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                                            <span>{profDetails?.rating || prop.rating || 4.9}</span>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="text-right text-xs font-bold text-[#4A3728]">
                                        <span>Est: ₹{prop.priceEstimateTotal.toLocaleString('en-IN')}</span>
                                        <span className="block text-[10px] text-slate-500 font-normal">{prop.timelineEstimateMonths} Months</span>
                                      </div>
                                    </div>

                                    {/* Scope Highlights */}
                                    {prop.keyHighlights && prop.keyHighlights.length > 0 && (
                                      <ul className="mt-2 space-y-1 text-[11px] text-slate-600 border-t border-slate-200/60 pt-2">
                                        {prop.keyHighlights.slice(0, 2).map((hl, i) => (
                                          <li key={i} className="flex items-center space-x-1.5">
                                            <Check className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                                            <span>{hl}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    )}

                                    {/* Action / Unlocked Contact */}
                                    <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between">
                                      {req.status === 'Completed' ? (
                                        <div className="w-full flex items-center space-x-1.5 text-xs font-bold text-slate-800 bg-slate-100 px-3 py-2.5 rounded-xl border border-slate-300">
                                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                          <span>Project Completed & Closed</span>
                                        </div>
                                      ) : isAccepted ? (
                                        <div className="w-full space-y-2">
                                          <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-800 bg-emerald-100/80 px-3 py-1.5 rounded-xl">
                                            <ShieldCheck className="w-4 h-4 text-emerald-700" />
                                            <span>Proposal Accepted & Contact Unlocked</span>
                                          </div>

                                          <div className="grid grid-cols-2 gap-2 text-xs">
                                            <a
                                              href={`tel:${profDetails?.phone || '+91 98765 43210'}`}
                                              className="px-3 py-2 bg-emerald-700 text-white rounded-xl font-bold flex items-center justify-center space-x-1.5 hover:bg-emerald-800 transition-colors"
                                            >
                                              <Phone className="w-3.5 h-3.5" />
                                              <span>{profDetails?.phone || '+91 98765 43210'}</span>
                                            </a>
                                            <a
                                              href={`mailto:${profDetails?.email || 'contact@expert.in'}`}
                                              className="px-3 py-2 bg-[#4A3728] text-white rounded-xl font-bold flex items-center justify-center space-x-1.5 hover:bg-[#6B5040] transition-colors"
                                            >
                                              <Mail className="w-3.5 h-3.5" />
                                              <span>Send Email</span>
                                            </a>
                                          </div>

                                          <button
                                            type="button"
                                            onClick={() => {
                                              setRatingReqId(req.id);
                                              setRatingProfId(prop.professionalId);
                                              setRatingProfName(displayName);
                                              setRatingValue(5);
                                              setRatingFeedback('');
                                              setRatingModalOpen(true);
                                            }}
                                            className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer shadow-sm"
                                          >
                                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                                            <span>Complete Project & Rate Expert</span>
                                          </button>
                                        </div>
                                      ) : (
                                        <button
                                          onClick={() => {
                                            if (onUpdateProposalStatus) {
                                              onUpdateProposalStatus(prop.id, 'Accepted', req.id);
                                            }
                                          }}
                                          className="w-full py-2 bg-[#4A3728] hover:bg-[#6B5040] text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center justify-center space-x-1.5"
                                        >
                                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                                          <span>Accept Proposal & Unlock Contact</span>
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-400">Style: {req.architecturalStyle}</span>
                      <button
                        onClick={onOpenProposalMatrix}
                        className="text-[#9B7B5A] font-bold hover:underline flex items-center space-x-1"
                      >
                        <span>Compare Bids</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ─── RATING & REVIEW MODAL ─── */}
      {ratingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-md bg-[#FDF8F0] rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 p-6 space-y-5">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center mx-auto text-[#9B7B5A]">
                <Star className="w-6 h-6 fill-amber-500 text-amber-500" />
              </div>
              <h3 className="font-display font-extrabold text-xl text-[#4A3728]">Rate & Review Expert</h3>
              <p className="text-xs text-slate-500">Provide feedback for your experience working with {ratingProfName}</p>
            </div>

            <div className="space-y-4">
              {/* Star Rating Controls */}
              <div className="flex justify-center items-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRatingValue(star)}
                    className="p-1 cursor-pointer transition-transform hover:scale-110 focus:outline-none"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= ratingValue
                          ? 'fill-amber-500 text-amber-500'
                          : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
              </div>

              {/* Feedback Input */}
              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">Review Notes</label>
                <textarea
                  rows={3}
                  value={ratingFeedback}
                  onChange={(e) => setRatingFeedback(e.target.value)}
                  placeholder="Tell us about the quality of architectural blueprints, structural drawings, or site supervision..."
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-[#2C1F14] focus:outline-none focus:ring-2 focus:ring-[#4A3728]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setRatingModalOpen(false)}
                className="py-2.5 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-xl font-bold text-xs transition-colors text-center cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onCompleteAndRateProject) {
                    onCompleteAndRateProject(ratingReqId, ratingProfId, ratingValue, ratingFeedback);
                  }
                  setRatingModalOpen(false);
                }}
                className="py-2.5 bg-[#4A3728] hover:bg-[#6B5040] text-white rounded-xl font-bold text-xs transition-colors flex items-center justify-center space-x-1 shadow-sm cursor-pointer"
              >
                <span>Submit & Close Project</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
