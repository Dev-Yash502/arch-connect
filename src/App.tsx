import React, { useState } from 'react';
import { Header } from './components/Header';
import { ScrollAnimationHero } from './components/ScrollAnimationHero';

import { ProfessionalsDirectory } from './components/ProfessionalsDirectory';
import { CostEstimatorModal } from './components/CostEstimatorModal';
import { PostRequirementModal } from './components/PostRequirementModal';
import { ProposalComparatorModal } from './components/ProposalComparatorModal';
import { ProjectDetailsModal } from './components/ProjectDetailsModal';
import { ProfessionalDetailModal } from './components/ProfessionalDetailModal';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';

import { ProfessionalPortal } from './components/ProfessionalPortal';
import { ClientPortal } from './components/ClientPortal';

import { INITIAL_PROFESSIONALS, MOCK_ACTIVE_PROJECT, MOCK_PROPOSALS, MOCK_REQUIREMENTS } from './data/mockData';
import { Professional, CostEstimateInput, ProjectRequirement } from './types';

import {
  Compass,
  Armchair,
  Wrench,
  Package,
  FileEdit,
  UserPlus,
  ArrowRightLeft,
  Handshake,
  ArrowRight,
  ShieldCheck,
  Calculator,
  Layers,
  Sparkles,
  Eye,
  CheckCircle2,
  Twitter,
  Circle,
  Instagram,
  Linkedin
} from 'lucide-react';

const VIDEO_URL = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260602_150901_c45b90ec-18d7-42ff-90e2-b95d7109e330.mp4";

const SERVICES = [
  "Website",
  "Mobile App",
  "Web App",
  "E-Commerce",
  "Visual Identity",
  "3D & Motion",
  "Digital Marketing",
  "Growth & Consulting",
  "Other"
];

interface SocialBtnProps {
  href: string;
  icon: React.ComponentType<{ size?: number | string; className?: string }>;
  bgColor: string;
  textColor: string;
}

function SocialBtn({ href, icon: Icon, bgColor, textColor }: SocialBtnProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`w-8 h-8 rounded-xl flex items-center justify-center ${bgColor} ${textColor} hover:opacity-80 transition-opacity`}
    >
      <Icon size={13} />
    </a>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [professionals, setProfessionals] = useState<Professional[]>(() => {
    try {
      const saved = localStorage.getItem('arch_connect_professionals');
      return saved ? JSON.parse(saved) : INITIAL_PROFESSIONALS;
    } catch {
      return INITIAL_PROFESSIONALS;
    }
  });

  const [requirements, setRequirements] = useState<ProjectRequirement[]>(() => {
    try {
      const saved = localStorage.getItem('arch_connect_requirements');
      return saved ? JSON.parse(saved) : MOCK_REQUIREMENTS;
    } catch {
      return MOCK_REQUIREMENTS;
    }
  });

  const [proposals, setProposals] = useState(MOCK_PROPOSALS);

  const handleSaveProfessional = (updatedProf: Professional) => {
    setProfessionals((prev) => {
      const exists = prev.some((p) => p.id === updatedProf.id);
      const newList = exists
        ? prev.map((p) => (p.id === updatedProf.id ? updatedProf : p))
        : [updatedProf, ...prev];
      localStorage.setItem('arch_connect_professionals', JSON.stringify(newList));
      return newList;
    });
  };

  const handleAddRequirement = (newReq: ProjectRequirement) => {
    setRequirements((prev) => {
      const newList = [newReq, ...prev];
      localStorage.setItem('arch_connect_requirements', JSON.stringify(newList));
      return newList;
    });
  };

  // Modals state
  const [isCostEstimatorOpen, setIsCostEstimatorOpen] = useState(false);
  const [isPostReqOpen, setIsPostReqOpen] = useState(false);
  const [isProposalMatrixOpen, setIsProposalMatrixOpen] = useState(false);
  const [isProjectDetailsOpen, setIsProjectDetailsOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Selected state
  const [selectedProfForModal, setSelectedProfForModal] = useState<Professional | null>(null);
  const [categoryFilterForDir, setCategoryFilterForDir] = useState<string>('All');
  const [passedEstimate, setPassedEstimate] = useState<{ areaSqFt: number; totalCost: number } | undefined>(undefined);

  // Contact Page form states
  const [contactServices, setContactServices] = useState<string[]>([]);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSending, setContactSending] = useState(false);
  const [contactSent, setContactSent] = useState(false);

  // Handle post requirement submission
  const handlePostRequirement = (data: any) => {
    // Generate new mock proposal for demonstration
    const newProposal = {
      id: `prop-${Date.now()}`,
      requirementId: 'req-new',
      professionalId: 'prof-1',
      professionalName: 'Ar. Ananya Verma',
      professionalRole: 'Architects' as const,
      professionalAvatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCS53da19ANzI9gGTjR_s8eShbFTJw0FnQ-v1JiJrk_Tbxs6A4ZbW_cCa2yZzjeq2AfWuR11c0mSC1yEKGboNmKEF3QwEE8qjSze9hsXLTbU-9t-eubUbGIl78F5OZhQKFbSO82Zx63Bro6AEdSAL8G3i81ZQ-hDeBN2dYmjwc-lp1Y9Tmh6s2TI7ISz42tK_zQG7NERqLTmT6MHnagyBxCxSFKtWUfTrHZGZnl0277NNaYAu5JEKM',
      rating: 4.9,
      priceEstimateTotal: data.builtUpAreaSqFt * 180,
      timelineEstimateMonths: 7,
      keyHighlights: [
        'Custom 3D Elevation Blueprint & Permitting',
        'Passive Climate Modeling & Material Selection',
        'Direct Site Inspections'
      ],
      scopeBreakdown: [
        { item: 'Architectural Blueprint', cost: Math.round(data.builtUpAreaSqFt * 80) },
        { item: 'Structural & MEP Drawings', cost: Math.round(data.builtUpAreaSqFt * 60) },
        { item: 'Site Supervision', cost: Math.round(data.builtUpAreaSqFt * 40) }
      ],
      status: 'Pending' as const
    };

    setProposals((prev) => [newProposal, ...prev]);
    setIsProposalMatrixOpen(true);
  };

  const handlePostReqWithEstimate = (inputs: CostEstimateInput, total: number) => {
    setPassedEstimate({ areaSqFt: inputs.areaSqFt, totalCost: total });
    setIsPostReqOpen(true);
  };

  const handleCategoryExplore = (catName: string) => {
    setCategoryFilterForDir(catName);
    const el = document.getElementById('professionals');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Helper to click link inside contact page and scroll to section on marketplace home
  const handleContactLinkClick = (sectionId: string) => {
    setActiveTab('home');
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleToggleContactService = (service: string) => {
    setContactServices(prev =>
      prev.includes(service)
        ? prev.filter(s => s !== service)
        : [...prev, service]
    );
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactEmail.trim()) return;
    setContactSending(true);
    await new Promise(r => setTimeout(r, 1000));
    setContactSending(false);
    setContactSent(true);
  };

  // ------------------------------------------------------------
  // RENDERING CONTACT PAGE AS A FULL-SCREEN DEDICATED VIEW
  // ------------------------------------------------------------
  if (activeTab === 'contact') {
    return (
      <div className="min-h-screen bg-white p-3 sm:p-4 md:p-6 flex flex-col justify-center">
        <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden min-h-[calc(100vh-24px)] sm:min-h-[calc(100vh-32px)] md:min-h-[calc(100vh-48px)] lg:h-[calc(100vh-48px)] shadow-2xl bg-gray-950">
          
          {/* Background Video */}
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            src={VIDEO_URL}
          />
          
          {/* Dark overlay for readability */}
          <div className="absolute inset-0 bg-black/25 backdrop-brightness-[0.9]" />

          {/* Content Layer */}
          <div className="relative z-10 flex flex-col min-h-[calc(100vh-24px)] sm:min-h-[calc(100vh-32px)] md:min-h-[calc(100vh-48px)] lg:h-full p-4 sm:p-6 md:p-8 gap-6 justify-between">
            
            {/* Navbar (top) */}
            <div className="flex-shrink-0 flex justify-start">
              <nav className="bg-white/60 backdrop-blur-md rounded-2xl shadow-sm pl-3 sm:pl-4 pr-2 py-2 w-full sm:w-auto flex items-center gap-3 sm:gap-6">
                
                {/* Logo redirects back to home */}
                <button
                  onClick={() => setActiveTab('home')}
                  className="flex items-center focus:outline-none hover:opacity-80 transition-opacity cursor-pointer"
                  title="Back to Home"
                >
                  <svg viewBox="0 0 256 256" className="w-8 h-8 flex-shrink-0 text-black" fill="currentColor">
                    <path d="M 256 256 L 128 256 L 0 128 L 128 128 Z" />
                    <path d="M 256 128 L 128 128 L 0 0 L 128 0 Z" />
                  </svg>
                </button>
                
                {/* Links redirect to homepage sections */}
                <div className="hidden sm:flex items-center gap-6">
                  <button
                    onClick={() => handleContactLinkClick('how-it-works')}
                    className="text-gray-800 text-sm font-medium hover:opacity-60 transition-opacity whitespace-nowrap cursor-pointer"
                  >
                    Our story
                  </button>
                  <button
                    onClick={() => handleContactLinkClick('services')}
                    className="text-gray-800 text-sm font-medium hover:opacity-60 transition-opacity whitespace-nowrap cursor-pointer"
                  >
                    Expertise
                  </button>
                  <button
                    onClick={() => handleContactLinkClick('professionals')}
                    className="text-gray-800 text-sm font-medium hover:opacity-60 transition-opacity whitespace-nowrap cursor-pointer"
                  >
                    Our work
                  </button>
                  <button
                    onClick={() => setActiveTab('home')}
                    className="text-gray-800 text-sm font-medium hover:opacity-60 transition-opacity whitespace-nowrap cursor-pointer"
                  >
                    Journal
                  </button>
                </div>
                
                {/* CTA button redirects back to active submission */}
                <button
                  onClick={() => setActiveTab('home')}
                  className="bg-black text-white text-sm font-medium px-4 sm:px-5 py-2 rounded-xl hover:bg-gray-800 transition-colors ml-auto cursor-pointer"
                >
                  Start a project
                </button>
              </nav>
            </div>

            {/* Spacer */}
            <div className="flex-1 min-h-[2rem]" />

            {/* Bottom row (headline + form) */}
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              
              {/* Headline (left) */}
              <p className="text-white text-3xl sm:text-4xl xl:text-5xl font-medium leading-tight drop-shadow-lg lg:max-w-lg xl:max-w-2xl shrink-0">
                We craft bold ideas<br />
                and ship them as{' '}
                <span style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontWeight: 400 }}>
                  products
                </span>
              </p>

              {/* Contact Form Card (right) */}
              <div className="w-full lg:w-[min(480px,45%)] shrink-0">
                <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden p-4 sm:p-6 flex flex-col gap-4">
                  
                  {/* Heading */}
                  <h2 className="text-xl sm:text-2xl font-semibold text-black tracking-tight">
                    Say hello! 👋
                  </h2>

                  {/* Email + Socials Row */}
                  <div className="flex flex-row items-center justify-between gap-3 bg-gray-50 rounded-2xl px-4 py-2.5">
                    <div className="flex flex-col min-w-0">
                      <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold leading-none mb-0.5">Drop us a line</span>
                      <a href="mailto:hello@forma.co" className="text-blue-600 font-semibold hover:underline truncate text-sm">
                        hello@forma.co
                      </a>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <SocialBtn href="https://twitter.com" icon={Twitter} bgColor="bg-gray-100" textColor="text-gray-800" />
                      <SocialBtn href="https://circle.com" icon={Circle} bgColor="bg-pink-100" textColor="text-pink-500" />
                      <SocialBtn href="https://instagram.com" icon={Instagram} bgColor="bg-orange-100" textColor="text-orange-400" />
                      <SocialBtn href="https://linkedin.com" icon={Linkedin} bgColor="bg-blue-100" textColor="text-blue-600" />
                    </div>
                  </div>

                  {/* OR Divider */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-gray-200" />
                    <span className="text-gray-400 font-medium text-xs tracking-wider">OR</span>
                    <div className="flex-1 h-px bg-gray-200" />
                  </div>

                  {/* Form / Success State */}
                  {contactSent ? (
                    <div className="flex flex-col items-center text-center py-6 gap-3">
                      <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-xl text-green-600 font-bold">
                        ✓
                      </div>
                      <h3 className="text-base font-semibold text-gray-900">You're all set!</h3>
                      <p className="text-sm text-gray-500">Expect a reply within 24 hours.</p>
                      <button
                        onClick={() => setActiveTab('home')}
                        className="mt-2 text-xs font-semibold text-gray-600 hover:text-black border border-gray-300 rounded-lg px-3 py-1 hover:border-black transition-all cursor-pointer"
                      >
                        Return to Marketplace
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleContactSubmit} className="flex flex-col gap-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium text-black">Tell us about your vision</span>
                      </div>

                      {/* Full Name & Email */}
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="text"
                          placeholder="Full name"
                          required
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          className="flex-1 min-w-0 text-sm px-3 py-2.5 rounded-xl border border-gray-200 bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                        />
                        <input
                          type="email"
                          placeholder="Email"
                          required
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          className="flex-1 min-w-0 text-sm px-3 py-2.5 rounded-xl border border-gray-200 bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                        />
                      </div>

                      {/* Vision Textarea */}
                      <textarea
                        rows={4}
                        placeholder="What are you looking to build or improve..."
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        className="flex-1 min-w-0 text-sm px-3 py-2.5 rounded-xl border border-gray-200 bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition resize-none"
                      />

                      {/* Services Tags */}
                      <div className="flex flex-col gap-2">
                        <span className="text-xs font-semibold text-gray-500">I need help with...</span>
                        <div className="flex flex-wrap gap-1.5">
                          {SERVICES.map((service) => {
                            const isSelected = contactServices.includes(service);
                            return (
                              <button
                                key={service}
                                type="button"
                                onClick={() => handleToggleContactService(service)}
                                className={`text-xs font-medium px-3 py-2 rounded-lg border transition-all ${
                                  isSelected
                                    ? "bg-gray-100 text-black border-black"
                                    : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
                                }`}
                              >
                                {service}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={contactSending || !contactName.trim() || !contactEmail.trim()}
                        className="w-full bg-black text-white text-sm font-semibold py-3 rounded-2xl hover:bg-gray-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                      >
                        {contactSending ? "Sending..." : "Send my message"}
                      </button>
                    </form>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    );
  }

  // ------------------------------------------------------------
  // ORIGINAL MARKETPLACE RENDERING
  // ------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#FDF8F0] text-[#2C1F14] font-sans antialiased flex flex-col justify-between selection:bg-[#4A3728] selection:text-white">
      {/* Navigation Header */}
      <Header
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      onOpenPostRequirement={() => setIsPostReqOpen(true)}
      onOpenCostEstimator={() => setIsCostEstimatorOpen(true)}
      onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 pt-20">
        {activeTab === 'prof-portal' ? (
          <ProfessionalPortal
            professionals={professionals}
            onSaveProfessional={handleSaveProfessional}
            onSelectViewDirectory={() => setActiveTab('professionals')}
          />
        ) : activeTab === 'client-portal' ? (
          <ClientPortal
            requirements={requirements}
            onAddRequirement={handleAddRequirement}
            onOpenCostEstimator={() => setIsCostEstimatorOpen(true)}
            onOpenProposalMatrix={() => setIsProposalMatrixOpen(true)}
            onBrowseProfessionals={() => setActiveTab('professionals')}
          />
        ) : (
          <>
        {/* HERO SECTION */}
        <section className="relative pt-12 sm:pt-16 pb-20 overflow-hidden bg-gradient-to-b from-amber-50/40 via-[#FDF8F0] to-[#FDF8F0]">
          {/* Subtle Grid Background Pattern */}
          <div className="absolute inset-0 opacity-30 pointer-events-none bg-[radial-gradient(#4A3728_1px,transparent_1px)] [background-size:24px_24px]" />

          <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Hero Left Content */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#4A3728]/5 border border-[#4A3728]/15 text-[#4A3728] text-xs font-bold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-[#9B7B5A]" />
                <span>Verified Architectural Marketplace</span>
              </div>

              <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#4A3728] tracking-tight leading-[1.12]">
                Your Dream Space,<br />
                <span className="text-[#9B7B5A]">Built with Trust</span>
              </h1>

              <p className="text-sm sm:text-base lg:text-lg text-slate-600 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                Connect with verified architects, interior designers, civil engineers & material providers — all in one place.
              </p>

              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-3 pt-2 px-2 sm:px-0">
                <button
                  onClick={() => setIsPostReqOpen(true)}
                  className="bg-[#9B7B5A] hover:bg-[#7A5C45] text-white font-bold text-sm px-8 py-3.5 sm:py-4 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center space-x-2 w-full sm:w-auto cursor-pointer"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4 text-amber-200" />
                </button>

                <button
                  onClick={() => handleCategoryExplore('All')}
                  className="border-2 border-[#4A3728] text-[#4A3728] hover:bg-[#4A3728]/5 font-bold text-sm px-8 py-3.5 sm:py-4 rounded-full transition-all text-center w-full sm:w-auto cursor-pointer"
                >
                  Browse Professionals
                </button>
              </div>

              {/* Social Proof Avatars Stack */}
              <div className="pt-5 sm:pt-6 flex flex-wrap items-center justify-center lg:justify-start gap-3 border-t border-slate-200/80">
                <div className="flex -space-x-3">
                  <img
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-white object-cover shadow-xs"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCS53da19ANzI9gGTjR_s8eShbFTJw0FnQ-v1JiJrk_Tbxs6A4ZbW_cCa2yZzjeq2AfWuR11c0mSC1yEKGboNmKEF3QwEE8qjSze9hsXLTbU-9t-eubUbGIl78F5OZhQKFbSO82Zx63Bro6AEdSAL8G3i81ZQ-hDeBN2dYmjwc-lp1Y9Tmh6s2TI7ISz42tK_zQG7NERqLTmT6MHnagyBxCxSFKtWUfTrHZGZnl0277NNaYAu5JEKM"
                    alt="Architect Avatar"
                  />
                  <img
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-white object-cover shadow-xs"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDTPrdAS0On6oT1Nd1rJi3fMOBGTdH5PV2R5zCjq-WrC_tp0etHkT8xkJQmFLZXrryYDHKor4rqXkma_G76-NGifVfWoelWaO7nUQaNv9JL7FPtOiDDB3w_6-wrt_DVDNXN8ybLhAz08rzPS2ASeEwmeGoHPTTqF1f-zlPOo18wueyTIF97PqCL9zXPeDFctaxTUWHZdIkZzaL1zGMMK24AzOy2ITLHYYUaOxyuYcaPtaJUEH22uC0"
                    alt="Interior Designer Avatar"
                  />
                  <img
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-white object-cover shadow-xs"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCI3bGY4Y_Hhv8bdTjN0koXT-LVa0C5mb4kKoZ6954epVRXTZRVLAtuE3ti18XLzWGzEcBHr5864HgYhfOPUdN2-E41SIg7HvWXhJpPyIomc7l-TCms_TIAyI3EDqrqV0i4QVkcBXnKs7A9a1Lk79703rinW218Ar84VwSxOflJwaKgwsicKGApKvHF5FdqbOjfAZz4s1fVBJNK-7KLe9K1jEcZn3SjEFGAxC41C0vf-6c_3cZ-5pk"
                    alt="Civil Engineer Avatar"
                  />
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-xs font-bold text-[#4A3728]">
                    +1k
                  </div>
                </div>

                <div className="text-xs sm:text-sm text-slate-600">
                  <strong className="font-bold text-[#4A3728]">Trusted by</strong> thousands of homeowners
                </div>
              </div>
            </div>

            {/* Hero Right: Big Logo Image */}
            <div className="lg:col-span-6 flex items-center justify-center lg:justify-end p-2 w-full lg:pl-32">
              <div className="flex items-center justify-center lg:justify-end w-full">
                <img
                  src="/logo.jpg"
                  alt="Arch-Connect Logo"
                  className="w-full max-w-[280px] sm:max-w-md lg:max-w-xl h-auto rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl object-contain border border-[#4A3728]/10 transition-transform duration-300 hover:scale-[1.02] lg:translate-x-24"
                />
              </div>
            </div>
          </div>
        </section>

        {/* SCROLL ANIMATION SECTION */}
        <ScrollAnimationHero onScrollComplete={() => setIsPostReqOpen(true)} />

        {/* SERVICES SECTION */}
        <section id="services" className="py-20 bg-white border-y border-slate-200/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[#4A3728]">
                Our Services
              </h2>
              <p className="text-slate-600 text-base">
                Everything you need to build or renovate, guided by industry-leading professionals.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Card 1: Architects */}
              <div className="bg-[#FDF8F0] rounded-2xl p-6 shadow-xs hover-lift border border-slate-200/80 flex flex-col justify-between items-start h-full group">
                <div>
                  <div className="w-14 h-14 bg-[#F0E6D3] rounded-2xl flex items-center justify-center text-[#4A3728] mb-6 shadow-2xs">
                    <Compass className="w-7 h-7" />
                  </div>
                  <h3 className="font-display font-bold text-xl text-[#4A3728] mb-2.5">
                    Architects
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                    Visionary designs mapped to precise structural blueprints for modern living.
                  </p>
                </div>

                <button
                  onClick={() => handleCategoryExplore('Architects')}
                  className="text-[#4A3728] font-bold text-sm flex items-center space-x-1.5 group-hover:text-[#9B7B5A] transition-colors cursor-pointer"
                >
                  <span>Explore</span>
                  <ArrowRight className="w-4 h-4 text-[#9B7B5A] group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Card 2: Interior Designers */}
              <div className="bg-[#FDF8F0] rounded-2xl p-6 shadow-xs hover-lift border border-slate-200/80 flex flex-col justify-between items-start h-full group">
                <div>
                  <div className="w-14 h-14 bg-[#EDE3D3] rounded-2xl flex items-center justify-center text-[#9B7B5A] mb-6 shadow-2xs">
                    <Armchair className="w-7 h-7" />
                  </div>
                  <h3 className="font-display font-bold text-xl text-[#4A3728] mb-2.5">
                    Interior Designers
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                    Transform raw spaces into tactile, sophisticated environments reflecting your style.
                  </p>
                </div>

                <button
                  onClick={() => handleCategoryExplore('Interior Designers')}
                  className="text-[#4A3728] font-bold text-sm flex items-center space-x-1.5 group-hover:text-[#9B7B5A] transition-colors cursor-pointer"
                >
                  <span>Explore</span>
                  <ArrowRight className="w-4 h-4 text-[#9B7B5A] group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Card 3: Civil Engineers */}
              <div className="bg-[#FDF8F0] rounded-2xl p-6 shadow-xs hover-lift border border-slate-200/80 flex flex-col justify-between items-start h-full group">
                <div>
                  <div className="w-14 h-14 bg-[#E8DDD0] rounded-2xl flex items-center justify-center text-[#4A3020] mb-6 shadow-2xs">
                    <Wrench className="w-7 h-7" />
                  </div>
                  <h3 className="font-display font-bold text-xl text-[#4A3728] mb-2.5">
                    Civil Engineers
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                    Ensuring grounded stability, safety, and structural integrity for every project.
                  </p>
                </div>

                <button
                  onClick={() => handleCategoryExplore('Civil Engineers')}
                  className="text-[#4A3728] font-bold text-sm flex items-center space-x-1.5 group-hover:text-[#9B7B5A] transition-colors cursor-pointer"
                >
                  <span>Explore</span>
                  <ArrowRight className="w-4 h-4 text-[#9B7B5A] group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Card 4: Material Providers */}
              <div className="bg-[#FDF8F0] rounded-2xl p-6 shadow-xs hover-lift border border-slate-200/80 flex flex-col justify-between items-start h-full group">
                <div>
                  <div className="w-14 h-14 bg-[#EDE3D8] rounded-2xl flex items-center justify-center text-slate-800 mb-6 shadow-2xs">
                    <Package className="w-7 h-7" />
                  </div>
                  <h3 className="font-display font-bold text-xl text-[#4A3728] mb-2.5">
                    Material Providers
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                    Source premium timber, stone, and glass directly from trusted industry suppliers.
                  </p>
                </div>

                <button
                  onClick={() => handleCategoryExplore('Material Providers')}
                  className="text-[#4A3728] font-bold text-sm flex items-center space-x-1.5 group-hover:text-[#9B7B5A] transition-colors cursor-pointer"
                >
                  <span>Explore</span>
                  <ArrowRight className="w-4 h-4 text-[#9B7B5A] group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section id="how-it-works" className="py-20 bg-[#FDF8F0]">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-16">
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[#4A3728] text-center">
              How It Works
            </h2>

            <div className="relative grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
              {/* Connecting Line background on desktop */}
              <div className="hidden md:block absolute top-12 left-[12%] right-[12%] h-0.5 bg-slate-300/60 z-0" />

              {/* Step 1 */}
              <button
                onClick={() => setIsPostReqOpen(true)}
                className="relative z-10 flex flex-col items-center text-center group cursor-pointer"
              >
                <div className="w-24 h-24 rounded-full bg-white border-4 border-[#FDF8F0] shadow-lg flex items-center justify-center text-[#4A3728] mb-5 group-hover:scale-110 transition-transform">
                  <FileEdit className="w-10 h-10 text-[#4A3728]" />
                </div>
                <h4 className="font-display font-bold text-lg text-[#4A3728] mb-1.5 group-hover:text-[#9B7B5A]">
                  1. Post Requirement
                </h4>
                <p className="text-xs text-slate-600 max-w-xs">
                  Detail your vision, budget, and timeline.
                </p>
              </button>

              {/* Step 2 */}
              <button
                onClick={() => handleCategoryExplore('All')}
                className="relative z-10 flex flex-col items-center text-center group cursor-pointer"
              >
                <div className="w-24 h-24 rounded-full bg-white border-4 border-[#FDF8F0] shadow-lg flex items-center justify-center text-[#4A3728] mb-5 group-hover:scale-110 transition-transform">
                  <UserPlus className="w-10 h-10 text-[#4A3728]" />
                </div>
                <h4 className="font-display font-bold text-lg text-[#4A3728] mb-1.5 group-hover:text-[#9B7B5A]">
                  2. Get Matched
                </h4>
                <p className="text-xs text-slate-600 max-w-xs">
                  We suggest top-rated professionals nearby.
                </p>
              </button>

              {/* Step 3 */}
              <button
                onClick={() => setIsProposalMatrixOpen(true)}
                className="relative z-10 flex flex-col items-center text-center group cursor-pointer"
              >
                <div className="w-24 h-24 rounded-full bg-white border-4 border-[#FDF8F0] shadow-lg flex items-center justify-center text-[#4A3728] mb-5 group-hover:scale-110 transition-transform">
                  <ArrowRightLeft className="w-10 h-10 text-[#4A3728]" />
                </div>
                <h4 className="font-display font-bold text-lg text-[#4A3728] mb-1.5 group-hover:text-[#9B7B5A]">
                  3. Compare Proposals
                </h4>
                <p className="text-xs text-slate-600 max-w-xs">
                  Review portfolios, quotes, and ratings.
                </p>
              </button>

              {/* Step 4 */}
              <button
                onClick={() => setIsProjectDetailsOpen(true)}
                className="relative z-10 flex flex-col items-center text-center group cursor-pointer"
              >
                <div className="w-24 h-24 rounded-full bg-[#9B7B5A] border-4 border-[#FDF8F0] shadow-lg flex items-center justify-center text-white mb-5 group-hover:scale-110 transition-transform">
                  <Handshake className="w-10 h-10 text-white" />
                </div>
                <h4 className="font-display font-bold text-lg text-[#4A3728] mb-1.5 group-hover:text-[#9B7B5A]">
                  4. Book & Build
                </h4>
                <p className="text-xs text-slate-600 max-w-xs">
                  Hire securely and track project progress.
                </p>
              </button>
            </div>
          </div>
        </section>

        {/* INTERACTIVE COST ESTIMATOR PROMO BANNER */}
        <section className="py-12 bg-gradient-to-r from-[#4A3728] via-[#6B5040] to-[#4A3728] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <span className="text-xs font-bold uppercase tracking-widest text-[#C4A882]">
                Instant Architectural Budget Tool
              </span>
              <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
                Calculate Construction & Interior Costs in 30 Seconds
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                Get itemized cost breakdowns for blueprints, civil foundations, slate cladding, and interior fitouts before posting your job.
              </p>
            </div>

            <button
              onClick={() => setIsCostEstimatorOpen(true)}
              className="bg-[#C4A882] hover:bg-[#B89468] text-[#4A3728] font-extrabold text-sm px-8 py-4 rounded-full shadow-lg transition-all flex items-center space-x-2 flex-shrink-0 cursor-pointer"
            >
              <Calculator className="w-5 h-5" />
              <span>Launch Cost Estimator</span>
            </button>
          </div>
        </section>

        {/* PROFESSIONALS DIRECTORY SECTION */}
        <ProfessionalsDirectory
          professionals={professionals}
          onSelectProfessional={(prof) => setSelectedProfForModal(prof)}
          onRequestQuote={(prof) => {
            setSelectedProfForModal(prof);
            setIsPostReqOpen(true);
          }}
          selectedCategoryFilter={categoryFilterForDir}
        />
          </>
        )}
      </main>

      {/* FOOTER */}
      <Footer onNavClick={(tab) => setActiveTab(tab)} />

      {/* MODALS */}
      <CostEstimatorModal
        isOpen={isCostEstimatorOpen}
        onClose={() => setIsCostEstimatorOpen(false)}
        onPostRequirementWithEstimate={handlePostReqWithEstimate}
      />

      <PostRequirementModal
        isOpen={isPostReqOpen}
        onClose={() => setIsPostReqOpen(false)}
        onSubmitRequirement={handlePostRequirement}
        initialEstimate={passedEstimate}
      />

      <ProposalComparatorModal
        isOpen={isProposalMatrixOpen}
        onClose={() => setIsProposalMatrixOpen(false)}
        proposals={proposals}
        onAcceptProposal={(id) => console.log('Accepted proposal:', id)}
      />

      <ProjectDetailsModal
        isOpen={isProjectDetailsOpen}
        onClose={() => setIsProjectDetailsOpen(false)}
        project={MOCK_ACTIVE_PROJECT}
      />

      <ProfessionalDetailModal
        isOpen={selectedProfForModal !== null}
        professional={selectedProfForModal}
        onClose={() => setSelectedProfForModal(null)}
        onRequestQuote={(prof) => {
          setIsPostReqOpen(true);
        }}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />
    </div>
  );
}
