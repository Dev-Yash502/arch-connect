import React, { useState } from 'react';
import { Menu, X, PlusCircle, Calculator, LogOut, ChevronDown, Crown, Home, Briefcase, ShieldCheck } from 'lucide-react';
import { AuthUser } from '../types';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenPostRequirement: () => void;
  onOpenCostEstimator: () => void;
  onOpenAuth: () => void;
  currentUser: AuthUser | null;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenPostRequirement,
  onOpenCostEstimator,
  onOpenAuth,
  currentUser,
  onLogout
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Build role-aware nav items
  const allNavItems = [
    { id: 'home', label: 'Home', roles: ['client', 'professional', 'admin', null] },
    { id: 'prof-portal', label: 'Professional Hub', roles: ['professional', 'admin'] },
    { id: 'client-portal', label: 'User Portal', roles: ['client', 'admin'] },
    { id: 'admin-panel', label: 'Admin Panel', roles: ['admin'] },
    { id: 'professionals', label: 'Professionals', roles: ['professional', 'admin', null] },
    { id: 'contact', label: 'Contact Us', roles: ['client', 'professional', 'admin', null] },
  ];

  const userRole = currentUser?.role ?? null;
  const navItems = allNavItems.filter(item => item.roles.includes(userRole));

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  const getRoleBadge = () => {
    if (!currentUser) return null;
    const configs: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
      client: { label: 'User', icon: <Home className="w-3 h-3" />, color: 'bg-blue-100 text-blue-700' },
      professional: { label: 'Professional', icon: <Briefcase className="w-3 h-3" />, color: 'bg-amber-100 text-amber-800' },
      admin: { label: 'Admin', icon: <Crown className="w-3 h-3" />, color: 'bg-purple-100 text-purple-700' },
    };
    const c = configs[currentUser.role];
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${c.color}`}>
        {c.icon}
        {c.label}
      </span>
    );
  };

  const getInitial = () => currentUser?.name?.charAt(0)?.toUpperCase() ?? '?';

  return (
    <header className="absolute top-0 left-0 right-0 w-full z-50 bg-[#FDF8F0] shadow-xs">
      <div className="flex justify-between items-center px-4 sm:px-8 py-3.5 max-w-7xl mx-auto">

        {/* Brand Logo */}
        <button
          onClick={() => handleNavClick('home')}
          className="flex items-center space-x-3 group focus:outline-none"
        >
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

          {currentUser ? (
            /* Logged-In User Pill & One-Touch Logout */
            <div className="flex items-center space-x-2.5">
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-[#4A3728]/5 border border-[#4A3728]/20 rounded-full hover:bg-[#4A3728]/10 transition-all"
                >
                  {/* Avatar */}
                  {currentUser.avatar ? (
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-7 h-7 rounded-full object-cover flex-shrink-0 border border-[#4A3728]/25"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-[#4A3728] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                      {getInitial()}
                    </div>
                  )}
                  <span className="text-xs font-bold text-[#4A3728] max-w-[90px] truncate">{currentUser.name.split(' ')[0]}</span>
                  {getRoleBadge()}
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </button>

                {/* Dropdown */}
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50 animate-fade-in">
                    <div className="px-4 py-3 bg-[#4A3728]/5 border-b border-slate-200">
                      <p className="text-xs font-bold text-[#4A3728] truncate">{currentUser.name}</p>
                      <p className="text-[10px] text-slate-500 truncate">{currentUser.email}</p>
                      <div className="mt-1.5">{getRoleBadge()}</div>
                    </div>

                    {/* Quick links based on role */}
                    {currentUser.role === 'client' && (
                      <button
                        onClick={() => { setActiveTab('client-portal'); setUserMenuOpen(false); }}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <Home className="w-3.5 h-3.5 text-[#9B7B5A]" />
                        My User Portal
                      </button>
                    )}
                    {currentUser.role === 'professional' && (
                      <button
                        onClick={() => { setActiveTab('prof-portal'); setUserMenuOpen(false); }}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <Briefcase className="w-3.5 h-3.5 text-[#9B7B5A]" />
                        My Professional Hub
                      </button>
                    )}
                     {currentUser.role === 'admin' && (
                      <>
                        <button
                          onClick={() => { setActiveTab('client-portal'); setUserMenuOpen(false); }}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <Home className="w-3.5 h-3.5 text-blue-500" />
                          User Portal
                        </button>
                        <button
                          onClick={() => { setActiveTab('prof-portal'); setUserMenuOpen(false); }}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <Briefcase className="w-3.5 h-3.5 text-amber-500" />
                          Professional Hub
                        </button>
                        <button
                          onClick={() => { setActiveTab('admin-panel'); setUserMenuOpen(false); }}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-red-500" />
                          Admin Panel
                        </button>
                      </>
                    )}

                    <button
                      onClick={() => { onLogout(); setUserMenuOpen(false); }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50 border-t border-slate-100 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Log Out
                    </button>
                  </div>
                )}
              </div>

              {/* Dedicated One-Touch Logout Button */}
              <button
                onClick={onLogout}
                className="p-2 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 rounded-full transition-all border border-red-200 cursor-pointer shadow-xs"
                title="One-Touch Logout"
              >
                <LogOut className="w-4.5 h-4.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="font-semibold text-sm text-[#4A3728] hover:text-[#9B7B5A] px-3 py-2 transition-colors flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4 text-[#9B7B5A]" />
              Login
            </button>
          )}

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
          {/* User info in mobile */}
          {currentUser && (
            <div className="flex items-center gap-3 p-3 bg-[#4A3728]/5 rounded-xl border border-[#4A3728]/10 mb-2">
              {currentUser.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-9 h-9 rounded-full object-cover flex-shrink-0 border border-[#4A3728]/25"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-[#4A3728] text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
                  {getInitial()}
                </div>
              )}
              <div className="min-w-0">
                <p className="text-xs font-bold text-[#4A3728] truncate">{currentUser.name}</p>
                <div className="mt-0.5">{getRoleBadge()}</div>
              </div>
            </div>
          )}

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
              onClick={() => { onOpenCostEstimator(); setMobileMenuOpen(false); }}
              className="w-full flex items-center justify-center space-x-2 py-2.5 bg-[#4A3728]/5 text-[#4A3728] font-semibold text-sm rounded-xl border border-[#4A3728]/20"
            >
              <Calculator className="w-4 h-4 text-[#9B7B5A]" />
              <span>Cost Estimator</span>
            </button>

            <button
              onClick={() => { onOpenPostRequirement(); setMobileMenuOpen(false); }}
              className="w-full flex items-center justify-center space-x-2 py-3 bg-[#9B7B5A] text-white font-semibold text-sm rounded-xl shadow-md"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post Project Requirement</span>
            </button>

            {currentUser ? (
              <button
                onClick={() => { onLogout(); setMobileMenuOpen(false); }}
                className="w-full py-2.5 text-center text-sm font-semibold text-red-600 flex items-center justify-center gap-1.5"
              >
                <LogOut className="w-4 h-4" />
                Log Out
              </button>
            ) : (
              <button
                onClick={() => { onOpenAuth(); setMobileMenuOpen(false); }}
                className="w-full py-2.5 text-center text-sm font-semibold text-[#4A3728]"
              >
                Login / Sign Up
              </button>
            )}
          </div>
        </div>
      )}

      {/* Accent line */}
      <div className="h-[2.5px] w-full bg-gradient-to-r from-[#4A3728] via-[#C4A882] to-[#9B7B5A]" />
    </header>
  );
};
