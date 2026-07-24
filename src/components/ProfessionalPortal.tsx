import React, { useState } from 'react';
import {
  User,
  Plus,
  Image as ImageIcon,
  Briefcase,
  Award,
  DollarSign,
  MapPin,
  CheckCircle2,
  Trash2,
  Sparkles,
  Save,
  Eye,
  ShieldCheck,
  Building
} from 'lucide-react';
import { Professional, ProfessionalCategory, PortfolioItem } from '../types';

interface ProfessionalPortalProps {
  professionals: Professional[];
  onSaveProfessional: (prof: Professional) => void;
  onSelectViewDirectory: () => void;
}

export const ProfessionalPortal: React.FC<ProfessionalPortalProps> = ({
  professionals,
  onSaveProfessional,
  onSelectViewDirectory
}) => {
  const [selectedProfId, setSelectedProfId] = useState<string>(professionals[0]?.id || '');
  
  // Active editing state
  const currentProf = professionals.find((p) => p.id === selectedProfId) || professionals[0];

  const [name, setName] = useState(currentProf?.name || '');
  const [role, setRole] = useState<ProfessionalCategory>(currentProf?.role || 'Architects');
  const [title, setTitle] = useState(currentProf?.title || '');
  const [experienceYears, setExperienceYears] = useState(currentProf?.experienceYears || 5);
  const [pricePerSqFt, setPricePerSqFt] = useState(currentProf?.pricePerSqFt || 150);
  const [location, setLocation] = useState(currentProf?.location || 'Delhi NCR, India');
  const [bio, setBio] = useState(currentProf?.bio || '');
  const [specialtiesText, setSpecialtiesText] = useState(currentProf?.specialties?.join(', ') || '');
  const [avatar, setAvatar] = useState(currentProf?.avatar || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80');
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(currentProf?.portfolio || []);

  // Form for adding new portfolio project
  const [showAddProject, setShowAddProject] = useState(false);
  const [projTitle, setProjTitle] = useState('');
  const [projCategory, setProjCategory] = useState('Residential Villa');
  const [projImage, setProjImage] = useState('');
  const [projDesc, setProjDesc] = useState('');
  const [projArea, setProjArea] = useState<number>(2500);
  const [projLocation, setProjLocation] = useState('Dehradun, India');

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sync state when selecting another professional to edit
  const handleSelectProf = (id: string) => {
    setSelectedProfId(id);
    const prof = professionals.find((p) => p.id === id);
    if (prof) {
      setName(prof.name);
      setRole(prof.role);
      setTitle(prof.title);
      setExperienceYears(prof.experienceYears);
      setPricePerSqFt(prof.pricePerSqFt);
      setLocation(prof.location);
      setBio(prof.bio);
      setSpecialtiesText(prof.specialties.join(', '));
      setAvatar(prof.avatar);
      setPortfolio(prof.portfolio);
    }
  };

  const handleAddPortfolioProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projTitle.trim() || !projImage.trim()) return;

    const newItem: PortfolioItem = {
      id: `port-${Date.now()}`,
      title: projTitle,
      category: projCategory,
      image: projImage,
      description: projDesc,
      areaSqFt: Number(projArea),
      location: projLocation
    };

    setPortfolio([newItem, ...portfolio]);
    setProjTitle('');
    setProjImage('');
    setProjDesc('');
    setShowAddProject(false);
  };

  const handleRemovePortfolioProject = (id: string) => {
    setPortfolio(portfolio.filter((p) => p.id !== id));
  };

  const handleCreateNewProfile = () => {
    const newId = `prof-${Date.now()}`;
    const newProf: Professional = {
      id: newId,
      name: 'Ar. New Expert',
      role: 'Architects',
      title: 'Principal Designer & Founder',
      rating: 5.0,
      reviewCount: 1,
      experienceYears: 6,
      pricePerSqFt: 160,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      badge: 'Verified',
      location: 'Delhi NCR, India',
      bio: 'Crafting modern luxury architectural spaces.',
      specialties: ['Residential Design', 'Modern Elevation', '3D Blueprinting'],
      completedProjectsCount: 12,
      phone: '+91 98000 00000',
      email: 'contact@expert.in',
      portfolio: []
    };

    onSaveProfessional(newProf);
    handleSelectProf(newId);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProf) return;

    const updated: Professional = {
      ...currentProf,
      name,
      role,
      title,
      experienceYears: Number(experienceYears),
      pricePerSqFt: Number(pricePerSqFt),
      location,
      bio,
      avatar,
      specialties: specialtiesText.split(',').map((s) => s.trim()).filter(Boolean),
      portfolio
    };

    onSaveProfessional(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="py-12 bg-[#FDF8F0] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-10">
        
        {/* Portal Header */}
        <div className="bg-gradient-to-r from-[#4A3728] via-[#6B5040] to-[#4A3728] rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-amber-200 text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Professional Studio Dashboard</span>
            </div>
            <h1 className="font-display font-extrabold text-2xl sm:text-4xl text-white">
              Portfolio & Profile Builder
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 max-w-xl">
              Build your verified profile, showcase high-res project portfolios, set custom pricing per sq.ft., and receive direct client quote inquiries.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleCreateNewProfile}
              className="px-5 py-3 bg-[#9B7B5A] hover:bg-[#7A5C45] text-white font-bold text-xs sm:text-sm rounded-full shadow-md transition-all flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Profile</span>
            </button>
            <button
              onClick={onSelectViewDirectory}
              className="px-5 py-3 bg-white/15 hover:bg-white/25 text-white font-bold text-xs sm:text-sm rounded-full border border-white/20 transition-all flex items-center space-x-1.5"
            >
              <Eye className="w-4 h-4" />
              <span>View Public Directory</span>
            </button>
          </div>
        </div>

        {/* Profile Switcher Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 border-b border-slate-200">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider pr-2 flex-shrink-0">
            Editing Profile:
          </span>
          {professionals.map((prof) => (
            <button
              key={prof.id}
              onClick={() => handleSelectProf(prof.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex-shrink-0 flex items-center space-x-2 ${
                selectedProfId === prof.id
                  ? 'bg-[#4A3728] text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200/60 border border-slate-200'
              }`}
            >
              <img src={prof.avatar} alt={prof.name} className="w-4 h-4 rounded-full object-cover" />
              <span>{prof.name}</span>
            </button>
          ))}
        </div>

        {savedSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-2xl flex items-center space-x-3 animate-fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span className="text-sm font-bold">
              Profile & Portfolio saved successfully! Changes are live on the Arch-Connect directory.
            </span>
          </div>
        )}

        {/* Main Editor Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Profile Details Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div className="border-b border-slate-200 pb-4 flex items-center justify-between">
              <h2 className="font-display font-bold text-lg text-[#4A3728] flex items-center space-x-2">
                <User className="w-5 h-5 text-[#9B7B5A]" />
                <span>Professional Details</span>
              </h2>
              <span className="text-xs font-bold uppercase px-3 py-1 bg-amber-50 text-amber-900 rounded-full border border-amber-200">
                {role}
              </span>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Full Name & Title</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ar. Ananya Verma"
                    className="w-full px-4 py-2.5 bg-[#FDF8F0] border border-slate-300 rounded-xl text-xs font-semibold text-[#2C1F14] focus:outline-none focus:ring-2 focus:ring-[#4A3728]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Category / Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as ProfessionalCategory)}
                    className="w-full px-4 py-2.5 bg-[#FDF8F0] border border-slate-300 rounded-xl text-xs font-semibold text-[#2C1F14] focus:outline-none focus:ring-2 focus:ring-[#4A3728]"
                  >
                    <option value="Architects">Architects</option>
                    <option value="Interior Designers">Interior Designers</option>
                    <option value="Civil Engineers">Civil Engineers</option>
                    <option value="Material Providers">Material Providers</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Designation & Firm Name</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Principal Architect & Founder, Atelier Verma"
                  className="w-full px-4 py-2.5 bg-[#FDF8F0] border border-slate-300 rounded-xl text-xs font-semibold text-[#2C1F14] focus:outline-none focus:ring-2 focus:ring-[#4A3728]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Price / Sq.Ft (₹)</label>
                  <input
                    type="number"
                    required
                    value={pricePerSqFt}
                    onChange={(e) => setPricePerSqFt(Number(e.target.value))}
                    placeholder="180"
                    className="w-full px-4 py-2.5 bg-[#FDF8F0] border border-slate-300 rounded-xl text-xs font-semibold text-[#2C1F14] focus:outline-none focus:ring-2 focus:ring-[#4A3728]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Experience (Years)</label>
                  <input
                    type="number"
                    required
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(Number(e.target.value))}
                    placeholder="12"
                    className="w-full px-4 py-2.5 bg-[#FDF8F0] border border-slate-300 rounded-xl text-xs font-semibold text-[#2C1F14] focus:outline-none focus:ring-2 focus:ring-[#4A3728]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">City / Location</label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Dehradun, India"
                    className="w-full px-4 py-2.5 bg-[#FDF8F0] border border-slate-300 rounded-xl text-xs font-semibold text-[#2C1F14] focus:outline-none focus:ring-2 focus:ring-[#4A3728]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Profile Photo / Avatar</label>
                <div className="flex flex-col sm:flex-row items-center gap-4 bg-[#FDF8F0] p-4 rounded-2xl border border-slate-300">
                  <img
                    src={avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                    alt="Avatar Preview"
                    className="w-16 h-16 rounded-full object-cover border-2 border-[#4A3728] shadow-sm flex-shrink-0"
                  />
                  <div className="flex-1 w-full space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <label className="px-4 py-2 bg-[#4A3728] hover:bg-[#6B5040] text-white text-xs font-bold rounded-xl cursor-pointer shadow-xs transition-colors inline-flex items-center space-x-1.5">
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>Upload Photo from Device</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setAvatar(reader.result as string);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                      <span className="text-[11px] text-slate-500 font-medium">PNG, JPG up to 5MB</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Specialties (Comma Separated)</label>
                <input
                  type="text"
                  value={specialtiesText}
                  onChange={(e) => setSpecialtiesText(e.target.value)}
                  placeholder="Modern Villas, Elevation Architecture, Passive Solar"
                  className="w-full px-4 py-2.5 bg-[#FDF8F0] border border-slate-300 rounded-xl text-xs font-semibold text-[#2C1F14] focus:outline-none focus:ring-2 focus:ring-[#4A3728]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Bio & Design Philosophy</label>
                <textarea
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Detail your architectural philosophy, background, and signature design style..."
                  className="w-full px-4 py-2.5 bg-[#FDF8F0] border border-slate-300 rounded-xl text-xs font-semibold text-[#2C1F14] focus:outline-none focus:ring-2 focus:ring-[#4A3728]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#4A3728] hover:bg-[#6B5040] text-white font-extrabold text-sm rounded-2xl shadow-md transition-all flex items-center justify-center space-x-2"
                >
                  <Save className="w-4 h-4 text-amber-200" />
                  <span>Save Profile & Portfolio Changes</span>
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Portfolio Project Manager */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Header & Add Action */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display font-bold text-lg text-[#4A3728]">
                    Showcase Portfolio ({portfolio.length})
                  </h2>
                  <p className="text-xs text-slate-500">
                    Add projects to display in your public portfolio section.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddProject(!showAddProject)}
                  className="px-4 py-2 bg-[#9B7B5A] hover:bg-[#7A5C45] text-white font-bold text-xs rounded-full shadow-xs transition-all flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{showAddProject ? 'Close' : 'Add Project'}</span>
                </button>
              </div>

              {/* Add Project Form Drawer */}
              {showAddProject && (
                <form onSubmit={handleAddPortfolioProject} className="p-4 bg-[#FDF8F0] rounded-2xl border border-slate-300 space-y-3 animate-fade-in">
                  <h3 className="font-display font-bold text-xs text-[#4A3728] uppercase tracking-wider">
                    Add New Showcase Project
                  </h3>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">Project Title</label>
                    <input
                      type="text"
                      required
                      value={projTitle}
                      onChange={(e) => setProjTitle(e.target.value)}
                      placeholder="The Modern Glass Residence"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">Category</label>
                      <input
                        type="text"
                        required
                        value={projCategory}
                        onChange={(e) => setProjCategory(e.target.value)}
                        placeholder="Residential Villa"
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">Area (Sq.Ft)</label>
                      <input
                        type="number"
                        required
                        value={projArea}
                        onChange={(e) => setProjArea(Number(e.target.value))}
                        placeholder="3500"
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">Project Cover Image</label>
                    <div className="flex items-center gap-2">
                      <label className="px-3 py-1.5 bg-[#4A3728] hover:bg-[#6B5040] text-white text-xs font-bold rounded-lg cursor-pointer transition-colors inline-flex items-center space-x-1">
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>Choose File from Device</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setProjImage(reader.result as string);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                      {projImage ? (
                        <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          Photo Selected ✓
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-medium">
                          No photo chosen
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">Location</label>
                    <input
                      type="text"
                      value={projLocation}
                      onChange={(e) => setProjLocation(e.target.value)}
                      placeholder="Dehradun, India"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">Description</label>
                    <textarea
                      rows={2}
                      value={projDesc}
                      onChange={(e) => setProjDesc(e.target.value)}
                      placeholder="Key highlights of structure, louvers, slate tiles, and cantilever design..."
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#4A3728] text-white font-bold text-xs rounded-xl shadow-xs hover:bg-[#6B5040] transition-colors"
                  >
                    Add Project to Portfolio
                  </button>
                </form>
              )}

              {/* Portfolio Items List */}
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {portfolio.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 space-y-2">
                    <ImageIcon className="w-8 h-8 mx-auto text-slate-300" />
                    <p className="text-xs">No showcase projects added yet.</p>
                  </div>
                ) : (
                  portfolio.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between bg-[#FDF8F0] p-3 rounded-2xl border border-slate-200 gap-3 group"
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-[9px] font-extrabold uppercase text-[#9B7B5A]">
                          {item.category}
                        </span>
                        <h4 className="font-display font-bold text-xs text-[#4A3728] truncate">
                          {item.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 truncate">
                          {item.location} {item.areaSqFt ? `• ${item.areaSqFt} sq.ft` : ''}
                        </p>
                      </div>

                      <button
                        onClick={() => handleRemovePortfolioProject(item.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                        title="Remove Project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Privacy Protection Callout Banner */}
            <div className="bg-amber-900/10 border border-amber-800/20 p-5 rounded-3xl space-y-2 text-amber-900">
              <div className="flex items-center space-x-2 font-bold text-xs">
                <ShieldCheck className="w-4 h-4 text-[#9B7B5A]" />
                <span>Contact Privacy Active</span>
              </div>
              <p className="text-xs leading-relaxed text-slate-700">
                Your direct phone & email are masked on the public directory. Clients inquire safely through Arch-Connect's verified proposal tool.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
