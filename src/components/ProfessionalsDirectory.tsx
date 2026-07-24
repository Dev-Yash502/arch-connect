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
  const [maxPriceFilter, setMaxPriceFilter] = useState<number>(250);
  const [minRatingFilter, setMinRatingFilter] = useState<number>(4.0);

  const categories = ['All', 'Architects', 'Interior Designers', 'Civil Engineers', 'Material Providers'];

  const filtered = professionals.filter((p) => {
    const matchesCategory = activeCategory === 'All' || p.role === activeCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.specialties.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesPrice = p.pricePerSqFt <= maxPriceFilter;
    const matchesRating = p.rating >= minRatingFilter;

    return matchesCategory && matchesSearch && matchesPrice && matchesRating;
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

        {/* Search & Secondary Filter Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Search Field */}
          <div className="md:col-span-5 relative">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, location, or style (e.g. Dehradun, Delhi, Villa)..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-[#4A3728] focus:outline-none focus:ring-2 focus:ring-[#4A3728]"
            />
          </div>

          {/* Max Price Slider */}
          <div className="md:col-span-4 flex items-center space-x-3 px-2">
            <div className="flex-1">
              <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-1">
                <span>Max Fee Rate:</span>
                <span className="text-[#4A3728] font-extrabold">₹{maxPriceFilter}/sq.ft</span>
              </div>
              <input
                type="range"
                min="50"
                max="300"
                step="10"
                value={maxPriceFilter}
                onChange={(e) => setMaxPriceFilter(Number(e.target.value))}
                className="w-full accent-[#4A3728] cursor-pointer"
              />
            </div>
          </div>

          {/* Rating Dropdown */}
          <div className="md:col-span-3">
            <select
              value={minRatingFilter}
              onChange={(e) => setMinRatingFilter(Number(e.target.value))}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
            >
              <option value={4.0}>4.0★ & above</option>
              <option value={4.5}>4.5★ & above (Top Rated)</option>
              <option value={4.8}>4.8★ & above (Master Guild)</option>
            </select>
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
                setMaxPriceFilter(250);
                setMinRatingFilter(4.0);
              }}
              className="px-5 py-2 bg-[#4A3728] text-white font-bold text-xs rounded-full"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
