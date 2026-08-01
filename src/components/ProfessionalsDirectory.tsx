import React, { useState } from 'react';
import { Search, Filter, Star, MapPin, Award, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';
import { Professional, ProfessionalCategory } from '../types';

interface ProfessionalsDirectoryProps {
  professionals: Professional[];
  onSelectProfessional: (prof: Professional) => void;
  onRequestQuote: (prof: Professional) => void;
  selectedCategoryFilter?: string;
}

export const ProfessionalsDirectory: React.FC<ProfessionalsDirectoryProps> = ({
  professionals,
  onSelectProfessional,
  onRequestQuote,
  selectedCategoryFilter = 'All'
}) => {
  const [activeCategory, setActiveCategory] = useState<string>(selectedCategoryFilter);
  const [searchQuery, setSearchQuery] = useState('');
  const [minRatingFilter, setMinRatingFilter] = useState<number>(4.0);
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedExperience, setSelectedExperience] = useState('All');
  const [selectedPriceRange, setSelectedPriceRange] = useState('All');

  const categories = ['All', 'Architect', 'Interior Designer', 'Civil Engineer', 'Material Provider'];

  // Dynamically extract unique cities from professionals list
  const uniqueCities = ['All', ...Array.from(new Set(professionals.map((p) => p.location).filter(Boolean)))];

  const filtered = professionals.filter((p) => {
    const matchesCategory = activeCategory === 'All' || p.role === activeCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.specialties.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Rating match
    const matchesRating = p.rating >= minRatingFilter;

    // City match
    const matchesCity = selectedCity === 'All' || p.location.toLowerCase() === selectedCity.toLowerCase();

    // Experience match
    let matchesExperience = true;
    if (selectedExperience === '0-3') {
      matchesExperience = p.experienceYears >= 0 && p.experienceYears <= 3;
    } else if (selectedExperience === '3-7') {
      matchesExperience = p.experienceYears > 3 && p.experienceYears <= 7;
    } else if (selectedExperience === '7-12') {
      matchesExperience = p.experienceYears > 7 && p.experienceYears <= 12;
    } else if (selectedExperience === '12+') {
      matchesExperience = p.experienceYears > 12;
    }

    // Price range match
    let matchesPrice = true;
    if (selectedPriceRange === 'under-100') {
      matchesPrice = p.pricePerSqFt < 100;
    } else if (selectedPriceRange === '100-150') {
      matchesPrice = p.pricePerSqFt >= 100 && p.pricePerSqFt <= 150;
    } else if (selectedPriceRange === '150-250') {
      matchesPrice = p.pricePerSqFt > 150 && p.pricePerSqFt <= 250;
    } else if (selectedPriceRange === '250+') {
      matchesPrice = p.pricePerSqFt > 250;
    }

    return matchesCategory && matchesSearch && matchesRating && matchesCity && matchesExperience && matchesPrice;
  });

  return (
    <section id="professionals" className="py-16 bg-[#FDF8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#9B7B5A]">
            Verified Guild Network
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[#4A3728]">
            Browse Certified Experts
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Direct access to licensed architects, spatial interior designers, civil structural experts, and premium material providers.
          </p>
        </div>

        {/* Category Pills Filter Bar */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
          {categories.map((cat) => {
            const isMaterial = cat === 'Material Providers';
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all shadow-2xs flex items-center space-x-1.5 ${
                  activeCategory === cat
                    ? 'bg-[#4A3728] text-white shadow-md scale-105'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <span>{cat}</span>
                {isMaterial && (
                  <span className="text-[9px] uppercase font-extrabold px-2 py-0.5 bg-amber-200 text-amber-900 rounded-full border border-amber-300 ml-1">
                    Coming Soon
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {activeCategory === 'Material Providers' && (
          <div className="bg-amber-900/10 border border-amber-800/20 p-6 rounded-3xl text-center space-y-2 max-w-xl mx-auto">
            <span className="text-xs uppercase font-extrabold tracking-widest text-[#9B7B5A]">
              Direct Supplier Marketplace
            </span>
            <h3 className="font-display font-extrabold text-xl text-[#4A3728]">
              Material Supply Portal Launching Q3 2026 🚀
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed">
              We are onboarding certified distributors for Italian Slate, Teak Timber, Solar Panels & Structural Steel. In the meantime, certified Civil Engineers and Architects are fully active and taking bookings!
            </p>
          </div>
        )}

        {/* Search & Advanced Filter Console */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by professional's name, specialties, or custom designs..."
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-[#4A3728] focus:outline-none focus:ring-2 focus:ring-[#4A3728] font-medium"
              />
            </div>
            
            {/* Reset Button */}
            {(searchQuery || selectedCity !== 'All' || selectedExperience !== 'All' || selectedPriceRange !== 'All' || minRatingFilter !== 4.0) && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCity('All');
                  setSelectedExperience('All');
                  setSelectedPriceRange('All');
                  setMinRatingFilter(4.0);
                }}
                className="px-4 py-2 text-xs font-bold text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200 hover:border-red-300 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 self-stretch sm:self-auto justify-center"
              >
                <span>Reset Filters</span>
              </button>
            )}
          </div>

          {/* Grid of 4 Filters */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
            {/* Filter 1: City */}
            <div>
              <label className="block text-[9.5px] font-bold text-slate-500 uppercase tracking-wider mb-1">Select City / Area</label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#4A3728] cursor-pointer"
              >
                <option value="All">All Cities</option>
                {uniqueCities.filter(city => city !== 'All').map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            {/* Filter 2: Experience */}
            <div>
              <label className="block text-[9.5px] font-bold text-slate-500 uppercase tracking-wider mb-1">Experience Years</label>
              <select
                value={selectedExperience}
                onChange={(e) => setSelectedExperience(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#4A3728] cursor-pointer"
              >
                <option value="All">All Experience</option>
                <option value="0-3">0-3 Years (Budding)</option>
                <option value="3-7">3-7 Years (Intermediate)</option>
                <option value="7-12">7-12 Years (Senior)</option>
                <option value="12+">12+ Years (Master)</option>
              </select>
            </div>

            {/* Filter 3: Fee Rate */}
            <div>
              <label className="block text-[9.5px] font-bold text-slate-500 uppercase tracking-wider mb-1">Price per sq.ft</label>
              <select
                value={selectedPriceRange}
                onChange={(e) => setSelectedPriceRange(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#4A3728] cursor-pointer"
              >
                <option value="All">All Price Ranges</option>
                <option value="under-100">Under ₹100/sqft</option>
                <option value="100-150">₹100 - ₹150/sqft</option>
                <option value="150-250">₹150 - ₹250/sqft</option>
                <option value="250+">₹250+/sqft</option>
              </select>
            </div>

            {/* Filter 4: Rating */}
            <div>
              <label className="block text-[9.5px] font-bold text-slate-500 uppercase tracking-wider mb-1">Minimum Rating</label>
              <select
                value={minRatingFilter}
                onChange={(e) => setMinRatingFilter(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#4A3728] cursor-pointer"
              >
                <option value={4.0}>4.0★ & above</option>
                <option value={4.5}>4.5★ & above</option>
                <option value={4.8}>4.8★ & above</option>
              </select>
            </div>
          </div>
        </div>

        {/* Directory Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((prof) => (
            <div
              key={prof.id}
              className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover-lift flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={prof.avatar}
                      alt={prof.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-[#4A3728]"
                    />
                    <div>
                      <h3 className="font-display font-bold text-base text-[#4A3728] hover:text-[#9B7B5A] cursor-pointer" onClick={() => onSelectProfessional(prof)}>
                        {prof.name}
                      </h3>
                      <span className="text-xs font-semibold text-[#9B7B5A]">{prof.role}</span>
                      <p className="text-[11px] text-slate-500 flex items-center space-x-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{prof.location}</span>
                      </p>
                    </div>
                  </div>

                  {/* Rating Tag */}
                  <div className="flex items-center space-x-1 bg-amber-50 px-2.5 py-1 rounded-full text-xs font-bold text-[#9B7B5A] border border-amber-200">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>{prof.rating}</span>
                  </div>
                </div>

                {/* Bio snippet */}
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {prof.bio}
                </p>

                {/* Key specialties */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {prof.specialties.slice(0, 3).map((spec, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-semibold bg-[#4A3728]/5 text-[#4A3728] px-2.5 py-1 rounded-md border border-[#4A3728]/10"
                    >
                      {spec}
                    </span>
                  ))}
                </div>

                {/* Stats bar */}
                <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
                  <span>
                    Rate: <strong className="text-[#4A3728] font-bold">₹{prof.pricePerSqFt}/sq.ft</strong>
                  </span>
                  <span>
                    Projects: <strong className="text-slate-800 font-bold">{prof.completedProjectsCount}+</strong>
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-5 mt-4 border-t border-slate-100 grid grid-cols-2 gap-2">
                <button
                  onClick={() => onSelectProfessional(prof)}
                  className="py-2.5 px-3 border border-[#4A3728] text-[#4A3728] hover:bg-[#4A3728]/5 rounded-full font-bold text-xs transition-colors text-center"
                >
                  Portfolio
                </button>
                <button
                  onClick={() => onRequestQuote(prof)}
                  className="py-2.5 px-3 bg-[#9B7B5A] hover:bg-[#7A5C45] text-white rounded-full font-bold text-xs transition-colors shadow-2xs flex items-center justify-center space-x-1"
                >
                  <span>Request Quote</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
            <p className="text-slate-600 font-bold text-base">No professionals found matching your filters.</p>
            <button
              onClick={() => {
                setActiveCategory('All');
                setSearchQuery('');
                setSelectedCity('All');
                setSelectedExperience('All');
                setSelectedPriceRange('All');
                setMinRatingFilter(4.0);
              }}
              className="px-5 py-2 bg-[#4A3728] text-white font-bold text-xs rounded-full hover:bg-[#6B5040] transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
