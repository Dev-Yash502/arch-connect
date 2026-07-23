import React, { useState } from 'react';
import { Menu, X, PlusCircle, Calculator, Building2, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenPostRequirement: () => void;
  onOpenCostEstimator: () => void;
  onOpenAuth: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenPostRequirement,
  onOpenCostEstimator,
  onOpenAuth
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'prof-portal', label: 'Professional Hub' },
    { id: 'client-portal', label: 'Client Portal' },
    { id: 'services', label: 'Services' },
    { id: 'how-it-works', label: 'How it Works' },
    { id: 'professionals', label: 'Professionals' },
    { id: 'estimator', label: 'Cost Estimator' },
    { id: 'contact', label: 'Contact Us' },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);

    // Scroll smoothly to section if on home tab
    if (id === 'services' || id === 'how-it-works') {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="absolute top-0 left-0 right-0 w-full z-50 bg-[#FDF8F0] shadow-xs">
      <div className="flex justify-between items-center px-4 sm:px-8 py-3.5 max-w-7xl mx-auto">
        {/* Brand Logo matching Arch-Connect prompt logo */}
        <button
          onClick={() => handleNavClick('home')}
          className="flex items-center space-x-3 group focus:outline-none"
        >
          {/* Official Arch-Connect Logo */}
          <div className="relative w-10 h-10 overflow-hidden rounded-xl shadow-md border border-[#4A3728]/20 group-hover:scale-105 transition-transform flex-shrink-0">
            <img src="/logo.jpg" alt="Arch-Connect Logo" className="w-full h-full object-cover" />
          </div>

          <div className="text-left">
            <span className="font-display font-extrabold text-xl tracking-tight text-[#4A3728]">
              ARCH<span className="text-[#9B7B5A]">-CONNECT</span>
            </span>
            <span className="block text-[8.5px] uppercase tracking-widest text-slate-500 font-semibold -mt-1">
              Connecting Spaces. Creating Trust.
            </span>
          </div>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-7">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`relative font-semibold text-sm transition-all duration-200 py-1 ${
                activeTab === item.id
                  ? 'text-[#4A3728] font-bold'
                  : 'text-slate-600 hover:text-[#9B7B5A]'
              }`}
            >
              {item.label}
              {/* Active Tab Indicator Bar */}
              {activeTab === item.id && (
                <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#4A3728] via-[#C4A882] to-[#9B7B5A] rounded-full shadow-xs transition-all animate-fade-in" />
              )}
            </button>
          ))}
        </nav>

        {/* Right CTA Actions */}
        <div className="hidden sm:flex items-center space-x-3">
          <button
            onClick={onOpenCostEstimator}
            className="flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold text-[#4A3728] bg-[#4A3728]/5 hover:bg-[#4A3728]/10 rounded-full transition-all border border-[#4A3728]/20"
          >
            <Calculator className="w-3.5 h-3.5 text-[#9B7B5A]" />
            <span>Estimator</span>
          </button>

          <button
            onClick={onOpenAuth}
            className="font-semibold text-sm text-[#4A3728] hover:text-[#9B7B5A] px-3 py-2 transition-colors"
          >
            Login
          </button>

          <button
            onClick={onOpenPostRequirement}
            className="font-semibold text-xs sm:text-sm bg-[#9B7B5A] text-white px-5 py-2.5 rounded-full hover:bg-[#7A5C45] shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center space-x-1.5"
          >
            <PlusCircle className="w-4 h-4 text-amber-200" />
            <span>Post Project</span>
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-[#4A3728] hover:bg-slate-200/50 rounded-lg transition-colors"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FDF8F0] border-b border-slate-200 px-6 py-6 space-y-4 shadow-xl">
          <div className="flex flex-col space-y-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-left font-semibold text-base py-2 border-b border-slate-200/40 ${
                  activeTab === item.id ? 'text-[#4A3728] font-bold pl-2 border-l-4 border-[#9B7B5A]' : 'text-slate-700'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="pt-4 space-y-2.5 border-t border-slate-200">
            <button
              onClick={() => {
                onOpenCostEstimator();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center space-x-2 py-2.5 bg-[#4A3728]/5 text-[#4A3728] font-semibold text-sm rounded-xl border border-[#4A3728]/20"
            >
              <Calculator className="w-4 h-4 text-[#9B7B5A]" />
              <span>Cost Estimator</span>
            </button>

            <button
              onClick={() => {
                onOpenPostRequirement();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center space-x-2 py-3 bg-[#9B7B5A] text-white font-semibold text-sm rounded-xl shadow-md"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post Project Requirement</span>
            </button>

            <button
              onClick={() => {
                onOpenAuth();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 text-center text-sm font-semibold text-[#4A3728]"
            >
              Login / Sign Up
            </button>
          </div>
        </div>
      )}

      {/* Sleek horizontal accent line at the bottom of header */}
      <div className="h-[2.5px] w-full bg-gradient-to-r from-[#4A3728] via-[#C4A882] to-[#9B7B5A]" />
    </header>
  );
};
