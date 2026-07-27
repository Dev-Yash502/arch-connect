import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Star,
  MapPin,
  Briefcase,
  Home,
  CheckCircle2,
  ChevronRight,
  Building2,
  Layers,
  Wrench,
  Armchair
} from 'lucide-react';

interface LandingPageProps {
  onOpenAuth: (mode?: 'login' | 'signup') => void;
}

const STATS = [
  { value: '1,200+', label: 'Verified Professionals' },
  { value: '3,800+', label: 'Projects Completed' },
  { value: '4.9★', label: 'Average Rating' },
  { value: '₹0', label: 'Platform Fee' },
];

const FEATURES = [
  {
    icon: <ShieldCheck className="w-6 h-6" />,
    title: 'Verified Experts Only',
    desc: 'Every architect, engineer & designer is background-verified before listing.',
    color: 'bg-amber-100 text-amber-800',
  },
  {
    icon: <Layers className="w-6 h-6" />,
    title: 'Smart Matching Engine',
    desc: 'AI matches your project requirements with the best-fit professional in seconds.',
    color: 'bg-blue-100 text-blue-700',
  },
  {
    icon: <CheckCircle2 className="w-6 h-6" />,
    title: 'Transparent Pricing',
    desc: 'See exact ₹/sqft rates upfront. No hidden costs, no surprises.',
    color: 'bg-green-100 text-green-700',
  },
];

const CATEGORIES = [
  { icon: <Building2 className="w-5 h-5" />, label: 'Architects', color: 'bg-amber-50 border-amber-200 text-amber-800' },
  { icon: <Armchair className="w-5 h-5" />, label: 'Interior Designers', color: 'bg-rose-50 border-rose-200 text-rose-700' },
  { icon: <Wrench className="w-5 h-5" />, label: 'Civil Engineers', color: 'bg-blue-50 border-blue-200 text-blue-700' },
  { icon: <Layers className="w-5 h-5" />, label: 'Material Providers', color: 'bg-slate-50 border-slate-200 text-slate-700' },
];

const TESTIMONIALS = [
  {
    name: 'Rahul Sharma',
    location: 'Dehradun',
    role: 'User',
    avatar: 'RS',
    text: 'Found the perfect architect for my villa in under 10 minutes. The matching engine is brilliant.',
    rating: 5,
  },
  {
    name: 'Ar. Priya Nair',
    location: 'Delhi NCR',
    role: 'Architect',
    avatar: 'PN',
    text: 'My portfolio reach tripled. Quality client inquiries come directly — zero spam.',
    rating: 5,
  },
  {
    name: 'Er. Vikram Singh',
    location: 'Roorkee',
    role: 'Civil Engineer',
    avatar: 'VS',
    text: 'Arch-Connect gave me 4 serious projects in my first month. Best platform for engineers.',
    rating: 5,
  },
];

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenAuth }) => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#FDF8F0] font-sans antialiased overflow-x-hidden">

      {/* ── NAVBAR ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FDF8F0]/90 backdrop-blur-md border-b border-[#4A3728]/10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl overflow-hidden border border-[#4A3728]/20 shadow-sm flex-shrink-0">
              <img src="/logo.jpg" alt="Arch-Connect" className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="font-display font-extrabold text-xl tracking-tight text-[#4A3728]">
                ARCH<span className="text-[#9B7B5A]">-CONNECT</span>
              </span>
              <span className="hidden sm:block text-[8px] uppercase tracking-widest text-slate-500 font-semibold -mt-0.5">
                Connecting Spaces. Creating Trust.
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onOpenAuth('login')}
              className="hidden sm:block font-semibold text-sm text-[#4A3728] hover:text-[#9B7B5A] px-3 py-2 transition-colors"
            >
              Log In
            </button>
            <button
              onClick={() => onOpenAuth('signup')}
              className="font-semibold text-sm bg-[#4A3728] text-white px-5 py-2.5 rounded-full hover:bg-[#6B5040] shadow-md transition-all transform hover:-translate-y-0.5 flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C4A882]" />
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative pt-32 pb-20 px-4 sm:px-8 overflow-hidden">
        {/* Radial grid background */}
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#4A3728_1px,transparent_1px)] [background-size:28px_28px]" />
        {/* Glow blobs */}
        <div className="absolute top-20 left-1/4 w-80 h-80 bg-amber-200/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-60 h-60 bg-[#9B7B5A]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center space-y-7">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#4A3728]/5 border border-[#4A3728]/15 text-[#4A3728] text-xs font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-[#9B7B5A]" />
            India's #1 Verified Architectural Marketplace
          </div>

          {/* Headline */}
          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold text-[#4A3728] tracking-tight leading-[1.08]">
            Your Dream Space,<br />
            <span className="text-[#9B7B5A]">Built with Trust.</span>
          </h1>

          <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Connect with verified architects, interior designers, civil engineers & material providers — all in one intelligent platform.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => onOpenAuth('signup')}
              className="w-full sm:w-auto bg-[#9B7B5A] hover:bg-[#7A5C45] text-white font-bold text-base px-8 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2.5 group"
            >
              <Home className="w-4 h-4" />
              I'm a User — Find Experts
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => onOpenAuth('signup')}
              className="w-full sm:w-auto bg-[#4A3728] hover:bg-[#6B5040] text-white font-bold text-base px-8 py-4 rounded-full shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2.5"
            >
              <Briefcase className="w-4 h-4 text-[#C4A882]" />
              I'm a Professional — Join Now
            </button>
          </div>

          {/* Social proof */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <div className="flex -space-x-2.5">
              {['AV', 'RK', 'VM'].map((initials, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-[#4A3728] to-[#9B7B5A] border-2 border-white flex items-center justify-center text-[9px] font-bold text-white"
                >
                  {initials}
                </div>
              ))}
              <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[9px] font-bold text-[#4A3728]">
                +1k
              </div>
            </div>
            <p className="text-sm text-slate-600">
              <strong className="text-[#4A3728]">Trusted by 1,200+</strong> homeowners across India
            </p>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="bg-[#4A3728] py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 grid grid-cols-2 sm:grid-cols-4 gap-6">
          {STATS.map((s, i) => (
            <div key={i} className="text-center">
              <div className="font-display font-extrabold text-2xl sm:text-3xl text-[#C4A882]">{s.value}</div>
              <div className="text-xs text-amber-200/70 font-medium mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="py-16 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-display font-extrabold text-3xl text-[#4A3728]">Who's on Arch-Connect?</h2>
            <p className="text-slate-500 mt-2 text-sm">One platform, every expert you need for your project</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {CATEGORIES.map((cat, i) => (
              <button
                key={i}
                onClick={() => onOpenAuth('signup')}
                onMouseEnter={() => setHoveredCard(i)}
                onMouseLeave={() => setHoveredCard(null)}
                className={`relative flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all duration-200 ${cat.color} ${
                  hoveredCard === i ? 'scale-105 shadow-lg' : 'hover:scale-102 hover:shadow-md'
                }`}
              >
                <div className="w-11 h-11 rounded-xl bg-white/60 flex items-center justify-center">
                  {cat.icon}
                </div>
                <span className="text-xs font-bold text-center leading-snug">{cat.label}</span>
                <ChevronRight className="w-3 h-3 opacity-50 absolute bottom-3 right-3" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-16 px-4 sm:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display font-extrabold text-3xl text-[#4A3728]">Why Arch-Connect?</h2>
            <p className="text-slate-500 mt-2 text-sm max-w-lg mx-auto">
              Built for the Indian construction market — privacy-first, match-intelligent, transparent.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <div key={i} className="p-6 rounded-2xl border border-slate-100 bg-[#FDF8F0] hover:shadow-md transition-shadow space-y-3">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${f.color}`}>
                  {f.icon}
                </div>
                <h3 className="font-bold text-[#4A3728] text-base">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-16 px-4 sm:px-8 bg-[#4A3728]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display font-extrabold text-3xl text-white">What People Say</h2>
            <p className="text-amber-200/60 mt-2 text-sm">Real clients and professionals, real results</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-5 space-y-3">
                <div className="flex gap-1">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-amber-100/90 leading-relaxed italic">"{t.text}"</p>
                <div className="flex items-center gap-2.5 pt-1">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C4A882] to-[#9B7B5A] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">{t.name}</p>
                    <p className="text-[10px] text-amber-200/50 flex items-center gap-0.5">
                      <MapPin className="w-2.5 h-2.5" /> {t.location} · {t.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-20 px-4 sm:px-8 bg-gradient-to-b from-[#FDF8F0] to-amber-50/60">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h2 className="font-display font-extrabold text-4xl text-[#4A3728]">
            Ready to get started?
          </h2>
          <p className="text-slate-500 text-base">
            Join thousands of clients and professionals already building on Arch-Connect.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onOpenAuth('signup')}
              className="w-full sm:w-auto bg-[#9B7B5A] hover:bg-[#7A5C45] text-white font-bold text-base px-8 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              Create Free Account
            </button>
            <button
              onClick={() => onOpenAuth('login')}
              className="w-full sm:w-auto border-2 border-[#4A3728] text-[#4A3728] hover:bg-[#4A3728]/5 font-bold text-base px-8 py-4 rounded-full transition-all"
            >
              Already have an account? Log In
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#4A3728] text-amber-200/60 py-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-lg overflow-hidden">
            <img src="/logo.jpg" alt="logo" className="w-full h-full object-cover" />
          </div>
          <span className="font-display font-bold text-white text-sm">ARCH-CONNECT</span>
        </div>
        <p className="text-xs">© 2026 Arch-Connect · Connecting Spaces. Creating Trust.</p>
      </footer>

    </div>
  );
};
