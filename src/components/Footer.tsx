import React from 'react';

interface FooterProps {
  onNavClick: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavClick }) => {
  return (
    <footer className="bg-[#4A3728] text-white w-full py-16 border-t border-emerald-900">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Col 1: Brand Info */}
        <div className="md:col-span-1 space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl overflow-hidden shadow-sm border border-emerald-700/50 flex-shrink-0">
              <img src="/logo.jpg" alt="Arch-Connect Logo" className="w-full h-full object-cover" />
            </div>
            <div className="font-display font-extrabold text-2xl text-white tracking-tight">
              Arch-Connect
            </div>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            Your Dream Space, Built with Trust. Connecting visionaries with structural precision, verified architects, and material suppliers.
          </p>
        </div>

        {/* Col 2: Platform */}
        <div className="flex flex-col space-y-2.5 text-sm">
          <span className="font-bold text-[#C4A882] uppercase tracking-wider text-xs mb-1">
            Platform
          </span>
          <button onClick={() => onNavClick('professionals')} className="text-slate-300 hover:text-white text-left transition-colors">
            Architect Directory
          </button>
          <button onClick={() => onNavClick('projects')} className="text-slate-300 hover:text-white text-left transition-colors">
            3D Active Projects
          </button>
          <button onClick={() => onNavClick('estimator')} className="text-slate-300 hover:text-white text-left transition-colors">
            Construction Estimator
          </button>
        </div>

        {/* Col 3: Company */}
        <div className="flex flex-col space-y-2.5 text-sm">
          <span className="font-bold text-[#C4A882] uppercase tracking-wider text-xs mb-1">
            Company
          </span>
          <a href="#" className="text-slate-300 hover:text-white transition-colors">About Us</a>
          <a href="#" className="text-slate-300 hover:text-white transition-colors">Careers & Guild</a>
          <button onClick={() => onNavClick('contact')} className="text-slate-300 hover:text-white text-left transition-colors cursor-pointer">Contact Support</button>
        </div>

        {/* Col 4: Legal */}
        <div className="flex flex-col space-y-2.5 text-sm">
          <span className="font-bold text-[#C4A882] uppercase tracking-wider text-xs mb-1">
            Legal
          </span>
          <a href="#" className="text-slate-300 hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="text-slate-300 hover:text-white transition-colors">Terms of Service</a>
          <a href="#" className="text-slate-300 hover:text-white transition-colors">Escrow Protection Guarantee</a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 mt-12 pt-8 border-t border-[#6B5040] text-center text-xs text-slate-400">
        <p>© 2026 Arch-Connect Marketplace. All rights reserved.</p>
      </div>
    </footer>
  );
};
