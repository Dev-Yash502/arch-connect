import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { Header } from './components/Header';
import { ScrollAnimationHero } from './components/ScrollAnimationHero';

import { ProfessionalsDirectory } from './components/ProfessionalsDirectory';
import { CostEstimatorModal } from './components/CostEstimatorModal';
import { PostRequirementModal } from './components/PostRequirementModal';
import { ProposalComparatorModal } from './components/ProposalComparatorModal';
import { ProfessionalDetailModal } from './components/ProfessionalDetailModal';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';

import { ProfessionalPortal } from './components/ProfessionalPortal';
import { ClientPortal } from './components/ClientPortal';
import { LandingPage } from './components/LandingPage';
import { AdminPanel } from './components/AdminPanel';

import { Professional, CostEstimateInput, ProjectRequirement, AuthUser, Proposal } from './types';

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
  const [activeTab, setActiveTabState] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    const validTabs = ['home', 'professionals', 'client-portal', 'prof-portal', 'admin-panel'];
    return validTabs.includes(hash) ? hash : 'home';
  });

  const setActiveTab = (tab: string, pushHistory = true) => {
    setActiveTabState(tab);
    if (pushHistory) {
      if (window.location.hash !== `#${tab}`) {
        window.history.pushState({ tab }, '', `#${tab}`);
      }
    }
  };

  // --- Auth / RBAC State (Supabase Auth) ---
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [pendingRequirement, setPendingRequirement] = useState<any>(null);

  // On mount: restore session from Supabase + listen for auth changes
  useEffect(() => {
    // Back button / Popstate history listener
    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.tab) {
        setActiveTabState(event.state.tab);
      } else {
        const hash = window.location.hash.replace('#', '');
        const validTabs = ['home', 'professionals', 'client-portal', 'prof-portal', 'admin-panel'];
        if (validTabs.includes(hash)) {
          setActiveTabState(hash);
        } else {
          setActiveTabState('home');
        }
      }
    };

    window.addEventListener('popstate', handlePopState);

    // Initialize initial state in history
    const hash = window.location.hash.replace('#', '');
    const validTabs = ['home', 'professionals', 'client-portal', 'prof-portal', 'admin-panel'];
    const initialTab = validTabs.includes(hash) ? hash : 'home';
    window.history.replaceState({ tab: initialTab }, '', `#${initialTab}`);

    // Restore admin session from localStorage if present
    const savedAdmin = localStorage.getItem('admin_session');
    if (savedAdmin) {
      try {
        const adminUser = JSON.parse(savedAdmin);
        setCurrentUser(adminUser);
        setAuthLoading(false);
        return;
      } catch (err) {
        localStorage.removeItem('admin_session');
      }
    }

    // Restore user session from localStorage if present for instant login
    const savedUser = localStorage.getItem('archconnect_user_session');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
        setAuthLoading(false);
      } catch (err) {
        localStorage.removeItem('archconnect_user_session');
      }
    }

    // Restore existing session from Supabase
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('name, role, joined_at')
          .eq('id', session.user.id)
          .single();
        if (profile) {
          const authUser = {
            id: session.user.id,
            name: profile.name,
            email: session.user.email!,
            role: profile.role,
            joinedAt: profile.joined_at,
          };
          setCurrentUser(authUser);
          localStorage.setItem('archconnect_user_session', JSON.stringify(authUser));
        } else {
          setCurrentUser(null);
          localStorage.removeItem('archconnect_user_session');
        }
      } else {
        setCurrentUser(null);
        localStorage.removeItem('archconnect_user_session');
      }
      setAuthLoading(false);
    });

    // Listen for future login/logout events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        setCurrentUser(null);
        localStorage.removeItem('archconnect_user_session');
        setActiveTab('home');
      } else if (session?.user) {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('name, role, joined_at')
          .eq('id', session.user.id)
          .single();
        if (profile) {
          const authUser = {
            id: session.user.id,
            name: profile.name,
            email: session.user.email!,
            role: profile.role,
            joinedAt: profile.joined_at,
          };
          setCurrentUser(authUser);
          localStorage.setItem('archconnect_user_session', JSON.stringify(authUser));
        }
      }
    });

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Fetch professionals from Supabase (falls back to mock data for seeding)
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [profsLoaded, setProfsLoaded] = useState(false);

  const fetchProfessionals = async () => {
    const { data, error } = await supabase
      .from('professionals')
      .select('*')
      .order('created_at', { ascending: true });

    if (error || !data) {
      setProfessionals([]);
    } else {
      const filtered = data.filter((r: any) => {
        const name = (r.name || '').toLowerCase();
        return !name.includes('vikram') && !name.includes('rohan') && !name.includes('apex');
      });
      const mapped: Professional[] = filtered.map((r: any) => ({
        id: r.id,
        name: r.name,
        role: r.role,
        title: r.title,
        rating: Number(r.rating || 5.0),
        reviewCount: Number(r.review_count || 0),
        experienceYears: Number(r.experience_years || 0),
        pricePerSqFt: Number(r.price_per_sqft || 0),
        avatar: r.avatar,
        badge: r.badge,
        location: r.location,
        bio: r.bio,
        specialties: r.specialties ?? [],
        portfolio: r.portfolio ?? [],
        phone: r.phone,
        email: r.email,
        completedProjectsCount: Number(r.completed_projects_count || 0),
      }));
      setProfessionals(mapped);
    }
    setProfsLoaded(true);
  };

  useEffect(() => {
    const runCleanupAndFetch = async () => {
      // Clean up old mock database rows (Vikram Malhotra, Rohan Kapoor, Apex Material Solutions)
      await supabase
        .from('professionals')
        .delete()
        .or('name.ilike.%Vikram%,name.ilike.%Rohan%,name.ilike.%Apex%');
      await fetchProfessionals();
    };
    runCleanupAndFetch();
  }, []);

  // Fetch requirements from Supabase
  const [requirements, setRequirements] = useState<ProjectRequirement[]>([]);
  const [reqsLoaded, setReqsLoaded] = useState(false);

  useEffect(() => {
    const fetchRequirements = async () => {
      const { data, error } = await supabase
        .from('requirements')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data) {
        setRequirements([]);
      } else {
        const mapped: ProjectRequirement[] = data.map((r: any) => ({
          id: r.id,
          title: r.title,
          category: r.category,
          builtUpAreaSqFt: Number(r.built_up_area_sqft || 0),
          location: r.location,
          budgetRange: r.budget_range,
          preferredTimeline: r.preferred_timeline,
          architecturalStyle: r.architectural_style,
          description: r.description,
          status: r.status,
          ownerId: r.owner_id,
          createdAt: new Date(r.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        }));
        setRequirements(mapped);
      }
      setReqsLoaded(true);
    };
    fetchRequirements();
  }, []);

  // Fetch proposals from Supabase
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [proposalsLoaded, setProposalsLoaded] = useState(false);

  useEffect(() => {
    const fetchProposals = async () => {
      const { data, error } = await supabase
        .from('proposals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data) {
        setProposals([]);
      } else {
        const mapped: Proposal[] = data.map((r: any) => ({
          id: r.id,
          requirementId: r.requirement_id,
          professionalId: r.professional_id,
          professionalName: r.professional_name,
          professionalRole: r.professional_role,
          professionalAvatar: r.professional_avatar,
          rating: Number(r.rating || 4.5),
          priceEstimateTotal: Number(r.price_estimate_total || 0),
          timelineEstimateMonths: Number(r.timeline_estimate_months || 0),
          keyHighlights: r.key_highlights ?? [],
          scopeBreakdown: r.scope_breakdown ?? [],
          status: r.status as any,
          createdAt: new Date(r.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
        }));
        setProposals(mapped);
      }
      setProposalsLoaded(true);
    };
    fetchProposals();
  }, []);

  const handleAddProposal = async (newProp: Proposal) => {
    setProposals(prev => [newProp, ...prev]);
    const dbRow = {
      id: newProp.id,
      requirement_id: newProp.requirementId,
      professional_id: newProp.professionalId,
      professional_name: newProp.professionalName,
      professional_role: newProp.professionalRole,
      professional_avatar: newProp.professionalAvatar,
      rating: newProp.rating,
      price_estimate_total: newProp.priceEstimateTotal,
      timeline_estimate_months: newProp.timelineEstimateMonths,
      key_highlights: newProp.keyHighlights,
      scope_breakdown: newProp.scopeBreakdown,
      status: newProp.status
    };
    const { error } = await supabase.from('proposals').insert(dbRow);
    if (error) console.error('Failed to save proposal:', error.message);
  };

  const handleUpdateProposalStatus = async (proposalId: string, status: 'Pending' | 'Accepted' | 'Shortlisted', requirementId?: string) => {
    setProposals(prev => prev.map(p => p.id === proposalId ? { ...p, status } : p));
    await supabase.from('proposals').update({ status }).eq('id', proposalId);

    if (status === 'Accepted') {
      const targetReqId = requirementId || proposals.find(p => p.id === proposalId)?.requirementId;
      if (targetReqId) {
        setRequirements(prev => prev.map(r => r.id === targetReqId ? { ...r, status: 'Matched' } : r));
        await supabase.from('requirements').update({ status: 'Matched' }).eq('id', targetReqId);
      }
    }
  };

  const handleCompleteAndRateProject = async (requirementId: string, professionalId: string, rating: number, feedback: string) => {
    // 1. Update local & DB requirement status to 'Completed'
    setRequirements(prev => prev.map(r => r.id === requirementId ? { ...r, status: 'Completed' } : r));
    await supabase.from('requirements').update({ status: 'Completed' }).eq('id', requirementId);

    // 2. Retrieve professional's current scores
    const { data: profData, error: fetchError } = await supabase
      .from('professionals')
      .select('rating, review_count, completed_projects_count')
      .eq('id', professionalId)
      .single();

    if (!fetchError && profData) {
      const currentRating = Number(profData.rating || 4.5);
      const currentReviews = Number(profData.review_count || 0);
      const currentCompleted = Number(profData.completed_projects_count || 0);

      const newReviews = currentReviews + 1;
      const newRating = parseFloat((((currentRating * currentReviews) + rating) / newReviews).toFixed(2));
      const newCompleted = currentCompleted + 1;

      // 3. Update local professionals state
      setProfessionals(prev =>
        prev.map(p =>
          p.id === professionalId
            ? { ...p, rating: newRating, reviewCount: newReviews, completedProjectsCount: newCompleted }
            : p
        )
      );

      // 4. Update professionals DB table
      await supabase
        .from('professionals')
        .update({
          rating: newRating,
          review_count: newReviews,
          completed_projects_count: newCompleted
        })
        .eq('id', professionalId);
    }
  };

  const handleLogin = (user: AuthUser) => {
    setCurrentUser(user);
    localStorage.setItem('archconnect_user_session', JSON.stringify(user));
    if (user.role === 'professional') {
      setActiveTab('prof-portal');
    } else if (user.role === 'client') {
      setActiveTab('client-portal');
      if (pendingRequirement) {
        const submitPending = async () => {
          const reqId = `req-${Date.now()}`;
          const dbRow = {
            id: reqId,
            title: pendingRequirement.title,
            category: pendingRequirement.category,
            built_up_area_sqft: Number(pendingRequirement.builtUpAreaSqFt),
            location: pendingRequirement.location,
            budget_range: pendingRequirement.budgetRange,
            preferred_timeline: pendingRequirement.preferredTimeline,
            architectural_style: pendingRequirement.architecturalStyle,
            description: pendingRequirement.description,
            status: 'Open for Bids',
            owner_id: user.id,
          };
          const { error } = await supabase.from('requirements').insert(dbRow);
          if (!error) {
            setRequirements(prev => [
              {
                id: reqId,
                title: pendingRequirement.title,
                category: pendingRequirement.category,
                builtUpAreaSqFt: Number(pendingRequirement.builtUpAreaSqFt),
                location: pendingRequirement.location,
                budgetRange: pendingRequirement.budgetRange,
                preferredTimeline: pendingRequirement.preferredTimeline,
                architecturalStyle: pendingRequirement.architecturalStyle,
                description: pendingRequirement.description,
                status: 'Open for Bids',
                createdAt: 'Just now'
              },
              ...prev
            ]);
          }
          setPendingRequirement(null);
        };
        submitPending();
      }
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem('admin_session');
    localStorage.removeItem('archconnect_user_session');
    await supabase.auth.signOut();
    setCurrentUser(null);
    setActiveTab('home');
  };

  const handleSaveProfessional = async (updatedProf: Professional) => {
    // Optimistic UI update
    setProfessionals((prev) => {
      const exists = prev.some((p) => p.id === updatedProf.id);
      return exists
        ? prev.map((p) => (p.id === updatedProf.id ? updatedProf : p))
        : [updatedProf, ...prev];
    });

    // Persist to Supabase
    const dbRow = {
      id: updatedProf.id,
      name: updatedProf.name,
      role: updatedProf.role,
      title: updatedProf.title,
      rating: updatedProf.rating,
      review_count: updatedProf.reviewCount,
      experience_years: updatedProf.experienceYears,
      price_per_sqft: updatedProf.pricePerSqFt,
      avatar: updatedProf.avatar,
      badge: updatedProf.badge ?? null,
      location: updatedProf.location,
      bio: updatedProf.bio,
      specialties: updatedProf.specialties,
      portfolio: updatedProf.portfolio,
      phone: updatedProf.phone,
      email: updatedProf.email,
      completed_projects_count: updatedProf.completedProjectsCount,
      owner_id: currentUser?.id ?? null,
    };
    const { error } = await supabase.from('professionals').upsert(dbRow, { onConflict: 'id' });
    if (error) {
      console.error('Failed to save professional:', error.message);
    } else {
      await fetchProfessionals();
    }
  };

  const handleAddRequirement = async (newReq: ProjectRequirement) => {
    // Optimistic UI update
    setRequirements((prev) => [newReq, ...prev]);

    // Persist to Supabase
    const dbRow = {
      id: newReq.id,
      title: newReq.title,
      category: newReq.category,
      built_up_area_sqft: newReq.builtUpAreaSqFt,
      location: newReq.location,
      budget_range: newReq.budgetRange,
      preferred_timeline: newReq.preferredTimeline,
      architectural_style: newReq.architecturalStyle,
      description: newReq.description,
      status: newReq.status,
      owner_id: currentUser?.id ?? null,
    };
    const { error } = await supabase.from('requirements').insert(dbRow);
    if (error) console.error('Failed to save requirement:', error.message);
  };

  // Modals state
  const [isCostEstimatorOpen, setIsCostEstimatorOpen] = useState(false);
  const [isPostReqOpen, setIsPostReqOpen] = useState(false);
  const [isProposalMatrixOpen, setIsProposalMatrixOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');

  const openAuth = (mode: 'login' | 'signup' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthOpen(true);
  };

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
  const handlePostRequirement = async (data: any) => {
    if (!currentUser) {
      setPendingRequirement(data);
      setIsPostReqOpen(false);
      openAuth('signup');
      return;
    }

    const reqId = `req-${Date.now()}`;
    const newReq: ProjectRequirement = {
      id: reqId,
      title: data.title,
      category: data.category,
      builtUpAreaSqFt: Number(data.builtUpAreaSqFt),
      location: data.location,
      budgetRange: data.budgetRange,
      preferredTimeline: data.preferredTimeline,
      architecturalStyle: data.architecturalStyle,
      description: data.description,
      status: 'Open for Bids',
      ownerId: currentUser.id,
      createdAt: 'Just now'
    };

    setRequirements((prev) => [newReq, ...prev]);

    const dbRow = {
      id: reqId,
      title: data.title,
      category: data.category,
      built_up_area_sqft: Number(data.builtUpAreaSqFt),
      location: data.location,
      budget_range: data.budgetRange,
      preferred_timeline: data.preferredTimeline,
      architectural_style: data.architecturalStyle,
      description: data.description,
      status: 'Open for Bids',
      owner_id: currentUser.id,
    };

    const { error } = await supabase.from('requirements').insert(dbRow);
    if (error) {
      console.error('Failed to save requirement to DB:', error.message);
    } else {
      setActiveTab('client-portal');
    }
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
  // AUTH GATE — show LandingPage until user is logged in
  // ------------------------------------------------------------
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#FDF8F0] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-lg border border-[#4A3728]/20">
            <img src="/logo.jpg" alt="Arch-Connect" className="w-full h-full object-cover" />
          </div>
          <div className="flex gap-1.5">
            {[0, 1, 2].map(i => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-[#9B7B5A] animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
          <p className="text-xs text-slate-400 font-medium">Loading Arch-Connect…</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <>
        <LandingPage onOpenAuth={openAuth} />
        <AuthModal
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
          onLogin={handleLogin}
          defaultMode={authModalMode}
        />
      </>
    );
  }

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
    <div className="min-h-screen bg-[#FDF8F0] text-[#2C1F14] font-sans antialiased flex flex-col justify-between selection:bg-[#4A3728] selection:text-white overflow-x-hidden">
      {/* Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenPostRequirement={() => setIsPostReqOpen(true)}
        onOpenCostEstimator={() => setIsCostEstimatorOpen(true)}
        onOpenAuth={() => openAuth('login')}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 pt-20 overflow-x-hidden">
        {activeTab === 'prof-portal' ? (
          /* Role guard: only professional or admin */
          currentUser && (currentUser.role === 'professional' || currentUser.role === 'admin') ? (
            <ProfessionalPortal
              professionals={professionals}
              requirements={requirements}
              proposals={proposals}
              onSaveProfessional={handleSaveProfessional}
              onSelectViewDirectory={() => setActiveTab('professionals')}
              onAddProposal={handleAddProposal}
              currentUser={currentUser}
            />
          ) : (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-amber-700" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
              </div>
              <h2 className="font-display font-bold text-2xl text-[#4A3728]">Professional Access Only</h2>
              <p className="text-slate-500 max-w-sm text-sm">The Professional Hub is available only to registered Architects, Engineers, and Designers. Please log in or sign up as a Professional to continue.</p>
              <button onClick={() => setIsAuthOpen(true)} className="mt-2 bg-[#4A3728] text-white font-bold text-sm px-7 py-3 rounded-full hover:bg-[#6B5040] transition-all shadow-md">Log In / Sign Up as Professional</button>
            </div>
          )
        ) : activeTab === 'client-portal' ? (
          /* Role guard: only client or admin */
          currentUser && (currentUser.role === 'client' || currentUser.role === 'admin') ? (
            <ClientPortal
              requirements={requirements}
              professionals={professionals}
              proposals={proposals}
              currentUser={currentUser}
              onAddRequirement={handleAddRequirement}
              onOpenCostEstimator={() => setIsCostEstimatorOpen(true)}
              onOpenProposalMatrix={() => setIsProposalMatrixOpen(true)}
              onBrowseProfessionals={() => setActiveTab('professionals')}
              onRequestQuote={(prof) => {
                setSelectedProfForModal(prof);
                setIsPostReqOpen(true);
              }}
              onSelectProfModal={(prof) => setSelectedProfForModal(prof)}
              onUpdateProposalStatus={handleUpdateProposalStatus}
              onCompleteAndRateProject={handleCompleteAndRateProject}
            />
          ) : (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-700" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
              </div>
              <h2 className="font-display font-bold text-2xl text-[#4A3728]">User Access Only</h2>
              <p className="text-slate-500 max-w-sm text-sm">The User Portal is available only to registered Users. Please log in or sign up as a User to post requirements and find your perfect match.</p>
              <button onClick={() => setIsAuthOpen(true)} className="mt-2 bg-[#4A3728] text-white font-bold text-sm px-7 py-3 rounded-full hover:bg-[#6B5040] transition-all shadow-md">Log In / Sign Up as User</button>
            </div>
          )
        ) : activeTab === 'admin-panel' ? (
          currentUser && currentUser.role === 'admin' ? (
            <AdminPanel />
          ) : (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-4">
              <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center animate-bounce">
                <svg className="w-8 h-8 text-red-700" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
              </div>
              <h2 className="font-display font-bold text-2xl text-[#4A3728]">Admin Access Only</h2>
              <p className="text-slate-500 max-w-sm text-sm">This portal is restricted to system administrators. Please log in with correct admin credentials.</p>
            </div>
          )
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
                  onClick={() => setActiveTab('client-portal')}
                  className="bg-[#9B7B5A] hover:bg-[#7A5C45] text-white font-bold text-sm px-7 py-3.5 sm:py-4 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center space-x-2 w-full sm:w-auto cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-200" />
                  <span>⚡ Find Engineer Match</span>
                </button>

                <button
                  onClick={() => setIsPostReqOpen(true)}
                  className="bg-[#4A3728] hover:bg-[#6B5040] text-white font-bold text-sm px-7 py-3.5 sm:py-4 rounded-full shadow-md transition-all text-center w-full sm:w-auto cursor-pointer"
                >
                  Post Requirement
                </button>

                <button
                  onClick={() => handleCategoryExplore('All')}
                  className="border-2 border-[#4A3728] text-[#4A3728] hover:bg-[#4A3728]/5 font-bold text-sm px-7 py-3.5 sm:py-4 rounded-full transition-all text-center w-full sm:w-auto cursor-pointer"
                >
                  Browse Directory
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
        onAcceptProposal={(id) => handleUpdateProposalStatus(id, 'Accepted')}
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
        onLogin={handleLogin}
        defaultMode={authModalMode}
      />
    </div>
  );
}
