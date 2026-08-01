import React, { useState, useEffect } from 'react';
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
  ChevronLeft,
  Building2,
  Layers,
  Wrench,
  Armchair
} from 'lucide-react';

interface LandingPageProps {
  onOpenAuth: (mode?: 'login' | 'signup') => void;
}


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
  { icon: <Building2 className="w-5 h-5" />, label: 'Architect', color: 'bg-amber-50 border-amber-200 text-amber-800' },
  { icon: <Armchair className="w-5 h-5" />, label: 'Interior Designer', color: 'bg-rose-50 border-rose-200 text-rose-700' },
  { icon: <Wrench className="w-5 h-5" />, label: 'Civil Engineer', color: 'bg-blue-50 border-blue-200 text-blue-700' },
  { icon: <Layers className="w-5 h-5" />, label: 'Material Provider', color: 'bg-slate-50 border-slate-200 text-slate-700' },
];

const TESTIMONIALS = [
  {
    name: 'Rahul Sharma',
    role: 'Homeowner',
    avatar: 'RS',
    text: 'Was struggling to find a reliable architect for my duplex. Local contractors were giving vague estimates. Found an architect through Arch-Connect, and the upfront transparent pricing saved me a lot of headache.',
    rating: 5,
  },
  {
    name: 'Ar. Priya Nair',
    role: 'Architect',
    avatar: 'PN',
    text: 'I was skeptical about online lead generation because of spam. But here, clients have verified requirements before they can contact us. It has helped my studio sign three premium design contracts this quarter.',
    rating: 5,
  },
  {
    name: 'Er. Vikram Singh',
    role: 'Civil Engineer',
    avatar: 'VS',
    text: 'The payment transparency is what convinced me. I finished 2 residential structural planning projects last month, and clients paid on time as agreed in the contract template provided.',
    rating: 4,
  },
  {
    name: 'Neha Patel',
    role: 'Homeowner',
    avatar: 'NP',
    text: 'Renovating a 3BHK flat is stressful. We got matched with an interior designer who actually listened to our space-saving needs. The background-verification process gave us complete peace of mind.',
    rating: 5,
  },
  {
    name: 'Rajesh Iyer',
    role: 'Homeowner',
    avatar: 'RI',
    text: 'Had a hard time finding a structural engineer who understood pile foundations for our coastal property. Found a qualified professional on here within 2 days. The response time was incredibly fast.',
    rating: 5,
  },
  {
    name: 'Ar. Amit Verma',
    role: 'Architect',
    avatar: 'AV',
    text: "Getting verified takes a couple of days because they check your COA registration, but that's a good thing. It filters out uncertified designers. Highly recommend for serious professionals.",
    rating: 4,
  },
  {
    name: 'Meera Deshmukh',
    role: 'Homeowner',
    avatar: 'MD',
    text: 'Sourced vitrified tiles and premium plywood directly from verified material vendors for our clinic setup. Saved about 12% compared to local retail quotes. The direct chat feature is very convenient.',
    rating: 4,
  },
  {
    name: 'Er. Kunal Sen',
    role: 'Civil Engineer',
    avatar: 'KS',
    text: 'Unlike other platforms that charge huge commissions, Arch-Connect keeps it very fair. Most clients come with clear architectural drawings, which makes my job as a structural consultant much easier.',
    rating: 5,
  },
  {
    name: 'Pooja Gupta',
    role: 'Interior Designer',
    avatar: 'PG',
    text: 'I just started my independent practice. Getting high-ticket clients was tough without a big office. Presenting my portfolio on this clean layout helped build trust. Got 4 bookings in 2 months!',
    rating: 5,
  },
  {
    name: 'Ankit Mehta',
    role: 'Homeowner',
    avatar: 'AM',
    text: 'Used it to hire a civil engineer and site supervisor for our farmhouse construction. Great interface, though I wish there was a filter for specific experience levels. Overall, very satisfied with the team we found.',
    rating: 4,
  },
];


export const LandingPage: React.FC<LandingPageProps> = ({ onOpenAuth }) => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      let cards = 3;
      if (window.innerWidth < 640) {
        cards = 1;
      } else if (window.innerWidth < 1024) {
        cards = 2;
      }
      setVisibleCards(cards);
      setCurrentIndex((prev) => Math.min(prev, TESTIMONIALS.length - cards));
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => {
      const maxIndex = TESTIMONIALS.length - visibleCards;
      return prev >= maxIndex ? 0 : prev + 1;
    });
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => {
      const maxIndex = TESTIMONIALS.length - visibleCards;
      return prev <= 0 ? maxIndex : prev - 1;
    });
  };

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
      <section className="py-16 px-4 sm:px-8 bg-[#4A3728] relative overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display font-extrabold text-3xl text-white">What People Say</h2>
            <p className="text-amber-200/60 mt-2 text-sm">Real clients and professionals, real results</p>
          </div>

          {/* Carousel Wrapper */}
          <div className="relative px-4 sm:px-12">
            {/* Left Arrow Button */}
            <button
              onClick={prevSlide}
              aria-label="Previous testimonials"
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-105"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Viewport */}
            <div className="overflow-hidden -mx-2.5">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{
                  transform: `translateX(-${currentIndex * (100 / visibleCards)}%)`,
                }}
              >
                {TESTIMONIALS.map((t, i) => (
                  <div
                    key={i}
                    className="w-full sm:w-1/2 lg:w-1/3 flex-shrink-0 px-2.5"
                  >
                    <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-5 space-y-3 h-full flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex gap-1">
                          {Array.from({ length: t.rating }).map((_, j) => (
                            <Star key={j} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                          ))}
                        </div>
                        <p className="text-sm text-amber-100/90 leading-relaxed italic">"{t.text}"</p>
                      </div>
                      <div className="flex items-center gap-2.5 pt-3 border-t border-white/5 mt-auto">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C4A882] to-[#9B7B5A] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                          {t.avatar}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">{t.name}</p>
                          <p className="text-[10px] text-amber-200/50 font-medium">
                            {t.role}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Arrow Button */}
            <button
              onClick={nextSlide}
              aria-label="Next testimonials"
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-105"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center flex-wrap gap-1.5 mt-8">
            {Array.from({ length: TESTIMONIALS.length - visibleCards + 1 }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                  currentIndex === idx ? 'bg-amber-400 w-4' : 'bg-white/20 hover:bg-white/40'
                }`}
              />
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
