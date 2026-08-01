import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Trash2, Users, Briefcase, FileText, MessageSquare, ShieldAlert, Search } from 'lucide-react';
import { Professional, ProjectRequirement, Proposal } from '../types';

interface AdminUser {
  id: string;
  name: string;
  role: string;
  joined_at?: string;
}

export const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'professionals' | 'requirements' | 'proposals' | 'approvals' | 'analytics'>('users');
  
  // Data states
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [requirements, setRequirements] = useState<ProjectRequirement[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [pendingApprovals, setPendingApprovals] = useState<any[]>([]);
  const [activeProjects, setActiveProjects] = useState<any[]>([]);
  
  // Loading & Error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Bulk deletion selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    setSelectedIds([]);
  }, [activeTab]);

  // Fetch all data from database
  const loadAllData = async () => {
    setLoading(true);
    setError('');
    try {
      // 1. Fetch user profiles
      const { data: userData, error: userErr } = await supabase
        .from('user_profiles')
        .select('*')
        .order('joined_at', { ascending: false });
      if (userErr) throw userErr;
      setUsers(userData || []);

      // 2. Fetch professionals (without frontend filtering for admin view)
      const { data: profData, error: profErr } = await supabase
        .from('professionals')
        .select('*')
        .order('created_at', { ascending: false });
      if (profErr) throw profErr;
      setProfessionals(profData || []);

      // Load pending approvals from database, fallback to localStorage
      const approvalsList: any[] = [];
      if (profData) {
        profData.forEach((prof: any) => {
          if (prof.verification_status === 'pending') {
            approvalsList.push({
              professional: prof,
              docs: {
                aadhaarNumber: prof.aadhaar_number,
                aadhaarFileName: prof.aadhaar_file_name,
                aadhaarFileUrl: prof.aadhaar_file_url,
                aadhaarUploaded: !!prof.aadhaar_file_name,
                panNumber: prof.pan_number,
                panFileName: prof.pan_file_name,
                panFileUrl: prof.pan_file_url,
                panUploaded: !!prof.pan_file_name,
                licenseType: prof.license_type,
                licenseId: prof.license_id,
                licenseFileName: prof.license_file_name,
                licenseFileUrl: prof.license_file_url,
                licenseUploaded: !!prof.license_file_name,
              }
            });
          } else {
            const cachedDoc = localStorage.getItem(`prof_doc_${prof.id}`);
            if (cachedDoc) {
              try {
                const parsed = JSON.parse(cachedDoc);
                const hasDocs = parsed.aadhaarUploaded || parsed.panUploaded || parsed.licenseUploaded;
                if (hasDocs && prof.badge !== 'Verified' && !parsed.approved) {
                  approvalsList.push({
                    professional: prof,
                    docs: parsed
                  });
                }
              } catch (e) {}
            }
          }
        });
      }
      setPendingApprovals(approvalsList);

      // 3. Fetch requirements
      const { data: reqData, error: reqErr } = await supabase
        .from('requirements')
        .select('*')
        .order('created_at', { ascending: false });
      if (reqErr) throw reqErr;
      setRequirements((reqData || []).map((r: any) => ({
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
      })));

      // 4. Fetch proposals
      const { data: propData, error: propErr } = await supabase
        .from('proposals')
        .select('*')
        .order('created_at', { ascending: false });
      if (propErr) throw propErr;
      setProposals((propData || []).map((r: any) => ({
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
        ratingEnabled: !!r.rating_enabled,
        createdAt: new Date(r.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
      })));

      // 5. Fetch active projects
      try {
        const { data: projData, error: projErr } = await supabase
          .from('active_projects')
          .select('*');
        if (projErr) throw projErr;
        setActiveProjects(projData || []);
      } catch (e) {
        console.warn("Could not load active projects for admin, using local fallback:", e);
        const cached = localStorage.getItem('archconnect_active_projects');
        if (cached) {
          try { setActiveProjects(JSON.parse(cached)); } catch (_) {}
        }
      }

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to load administration data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Show status toasts
  const triggerToast = (msg: string, isError = false) => {
    if (isError) {
      setError(msg);
      setTimeout(() => setError(''), 4000);
    } else {
      setSuccessMsg(msg);
      setTimeout(() => setSuccessMsg(''), 4000);
    }
  };

  const handleApproveDocs = async (profId: string) => {
    try {
      // 1. Update professional badge to 'Verified' in Supabase
      const { error } = await supabase
        .from('professionals')
        .update({ badge: 'Verified' })
        .eq('id', profId);
      if (error) throw error;

      // 2. Update localStorage entry to mark as approved
      const cachedDoc = localStorage.getItem(`prof_doc_${profId}`);
      if (cachedDoc) {
        try {
          const parsed = JSON.parse(cachedDoc);
          parsed.approved = true;
          parsed.rejected = false;
          localStorage.setItem(`prof_doc_${profId}`, JSON.stringify(parsed));
        } catch (e) {}
      }

      triggerToast('Professional profile successfully verified!');
      loadAllData(); // Reload database and approvals list
    } catch (err: any) {
      triggerToast(`Approval failed: ${err.message}`, true);
    }
  };

  const handleRejectDocs = async (profId: string) => {
    try {
      // 1. Clear professional badge in Supabase
      const { error } = await supabase
        .from('professionals')
        .update({ badge: null })
        .eq('id', profId);
      if (error) throw error;

      // 2. Update localStorage entry to mark as rejected and clear uploaded files
      const cachedDoc = localStorage.getItem(`prof_doc_${profId}`);
      if (cachedDoc) {
        try {
          const parsed = JSON.parse(cachedDoc);
          parsed.approved = false;
          parsed.rejected = true;
          parsed.aadhaarUploaded = false;
          parsed.aadhaarFileName = '';
          parsed.panUploaded = false;
          parsed.panFileName = '';
          parsed.licenseUploaded = false;
          parsed.licenseFileName = '';
          localStorage.setItem(`prof_doc_${profId}`, JSON.stringify(parsed));
        } catch (e) {}
      }

      triggerToast('Verification documents rejected.');
      loadAllData(); // Reload database and approvals list
    } catch (err: any) {
      triggerToast(`Rejection failed: ${err.message}`, true);
    }
  };

  // Selection and Bulk Actions
  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    const allFilteredIds = filteredItems.map(item => item.id);
    const allSelected = allFilteredIds.every(id => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds(prev => prev.filter(id => !allFilteredIds.includes(id)));
    } else {
      setSelectedIds(prev => {
        const unique = new Set([...prev, ...allFilteredIds]);
        return Array.from(unique);
      });
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    const confirmMsg = `Are you sure you want to delete the ${selectedIds.length} selected ${activeTab}? This action is permanent and cannot be undone.`;
    if (!window.confirm(confirmMsg)) return;

    try {
      let table = '';
      if (activeTab === 'users') table = 'user_profiles';
      else if (activeTab === 'professionals') table = 'professionals';
      else if (activeTab === 'requirements') table = 'requirements';
      else if (activeTab === 'proposals') table = 'proposals';

      const { error } = await supabase
        .from(table)
        .delete()
        .in('id', selectedIds);

      if (error) throw error;

      // Update local state
      if (activeTab === 'users') {
        setUsers(prev => prev.filter(u => !selectedIds.includes(u.id)));
      } else if (activeTab === 'professionals') {
        setProfessionals(prev => prev.filter(p => !selectedIds.includes(p.id)));
      } else if (activeTab === 'requirements') {
        setRequirements(prev => prev.filter(r => !selectedIds.includes(r.id)));
      } else if (activeTab === 'proposals') {
        setProposals(prev => prev.filter(p => !selectedIds.includes(p.id)));
      }

      triggerToast(`Successfully deleted ${selectedIds.length} ${activeTab}.`);
      setSelectedIds([]);
    } catch (err: any) {
      triggerToast(`Bulk delete failed: ${err.message}`, true);
    }
  };

  const handleToggleProposalRating = async (proposalId: string, enabled: boolean) => {
    try {
      const { error } = await supabase
        .from('proposals')
        .update({ rating_enabled: enabled })
        .eq('id', proposalId);
      if (error) throw error;
      setProposals(prev => prev.map(p => p.id === proposalId ? { ...p, ratingEnabled: enabled } : p));
      triggerToast(`Rating access ${enabled ? 'enabled' : 'disabled'} successfully.`);
    } catch (err: any) {
      triggerToast(`Update failed: ${err.message}`, true);
    }
  };

  // Search Filter
  const getFilteredData = () => {
    const q = searchQuery.toLowerCase().trim();
    if (activeTab === 'users') {
      return users.filter(u => u.name.toLowerCase().includes(q) || u.role.toLowerCase().includes(q));
    }
    if (activeTab === 'professionals') {
      return professionals.filter(p => p.name.toLowerCase().includes(q) || p.role.toLowerCase().includes(q) || p.location.toLowerCase().includes(q));
    }
    if (activeTab === 'requirements') {
      return requirements.filter(r => r.title.toLowerCase().includes(q) || r.location.toLowerCase().includes(q) || r.category.toLowerCase().includes(q));
    }
    if (activeTab === 'proposals') {
      return proposals.filter(p => p.professionalName.toLowerCase().includes(q) || p.professionalRole.toLowerCase().includes(q) || p.status.toLowerCase().includes(q));
    }
    return pendingApprovals.filter(item => 
      item.professional.name.toLowerCase().includes(q) || 
      item.professional.role.toLowerCase().includes(q) ||
      (item.docs.licenseId || '').toLowerCase().includes(q)
    );
  };

  const filteredItems = getFilteredData();

  return (
    <div className="py-12 bg-[#FDF8F0] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
        
        {/* Admin Header */}
        <div className="bg-gradient-to-r from-red-800 via-stone-800 to-red-800 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-red-200 text-xs font-bold tracking-wide">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Platform Administration Command Center</span>
            </div>
            <h1 className="font-display font-extrabold text-2xl sm:text-4xl text-white">
              Super-Admin Control Panel
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 max-w-xl">
              Manage database records, delete orphaned entries, remove profiles, and control the entire Arch-Connect workspace live.
            </p>
          </div>
          <button
            onClick={loadAllData}
            className="px-5 py-2.5 bg-white text-slate-900 text-xs font-bold rounded-full hover:bg-slate-100 transition-colors shadow-sm cursor-pointer"
          >
            Refresh Database
          </button>
        </div>

        {/* Notifications and Alerts */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl text-xs font-bold shadow-xs">
            ⚠️ {error}
          </div>
        )}
        {successMsg && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-xs font-bold shadow-xs animate-pulse">
            ✅ {successMsg}
          </div>
        )}

        {/* Controls Layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Sidebar Tabs */}
          <div className="lg:w-64 flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            <button
              onClick={() => { setActiveTab('users'); setSearchQuery(''); }}
              className={`flex-shrink-0 flex items-center space-x-2.5 px-4 py-3 rounded-2xl text-xs font-bold border transition-all cursor-pointer ${
                activeTab === 'users'
                  ? 'bg-[#4A3728] text-white border-[#4A3728] shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Users ({users.length})</span>
            </button>

            <button
              onClick={() => { setActiveTab('professionals'); setSearchQuery(''); }}
              className={`flex-shrink-0 flex items-center space-x-2.5 px-4 py-3 rounded-2xl text-xs font-bold border transition-all cursor-pointer ${
                activeTab === 'professionals'
                  ? 'bg-[#4A3728] text-white border-[#4A3728] shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Professionals ({professionals.length})</span>
            </button>

            <button
              onClick={() => { setActiveTab('requirements'); setSearchQuery(''); }}
              className={`flex-shrink-0 flex items-center space-x-2.5 px-4 py-3 rounded-2xl text-xs font-bold border transition-all cursor-pointer ${
                activeTab === 'requirements'
                  ? 'bg-[#4A3728] text-white border-[#4A3728] shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Requirements ({requirements.length})</span>
            </button>

            <button
              onClick={() => { setActiveTab('proposals'); setSearchQuery(''); }}
              className={`flex-shrink-0 flex items-center space-x-2.5 px-4 py-3 rounded-2xl text-xs font-bold border transition-all cursor-pointer ${
                activeTab === 'proposals'
                  ? 'bg-[#4A3728] text-white border-[#4A3728] shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Proposals ({proposals.length})</span>
            </button>

            <button
              onClick={() => { setActiveTab('approvals'); setSearchQuery(''); }}
              className={`flex-shrink-0 flex items-center space-x-2.5 px-4 py-3 rounded-2xl text-xs font-bold border transition-all cursor-pointer ${
                activeTab === 'approvals'
                  ? 'bg-red-800 text-white border-red-800 shadow-sm hover:bg-red-900'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Approvals ({pendingApprovals.length})</span>
            </button>

            <button
              onClick={() => { setActiveTab('analytics'); setSearchQuery(''); }}
              className={`flex-shrink-0 flex items-center space-x-2.5 px-4 py-3 rounded-2xl text-xs font-bold border transition-all cursor-pointer ${
                activeTab === 'analytics'
                  ? 'bg-blue-800 text-white border-blue-800 shadow-sm hover:bg-blue-900'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Analytics Dashboard</span>
            </button>
          </div>

          {/* Main Grid View */}
          <div className="flex-1 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
            
            {/* Search filter & Bulk actions */}
            {activeTab !== 'analytics' && (
              <div className="flex items-center space-x-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder={`Search ${activeTab}...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#4A3728]"
                  />
                </div>
                {selectedIds.length > 0 && activeTab !== 'approvals' && (
                  <button
                    onClick={handleBulkDelete}
                    className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer shadow-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Selected ({selectedIds.length})</span>
                  </button>
                )}
              </div>
            )}

            {activeTab === 'analytics' ? (
              <div className="space-y-8">
                <div className="border-b border-slate-200 pb-4">
                  <h3 className="font-display font-extrabold text-xl text-[#4A3728]">Arch-Connect Live Platform Metrics</h3>
                  <p className="text-xs text-slate-500">Real-time stats visualizer for system administrators.</p>
                </div>

                {/* Metrics Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-[#FDF8F0] p-5 rounded-2xl border border-[#F3EBE1] space-y-2">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Total User Profiles</span>
                    <span className="text-3xl font-display font-extrabold text-[#4A3728] block">{users.length}</span>
                    <span className="text-[10.5px] text-slate-500 font-semibold">Registered Homeowners</span>
                  </div>

                  <div className="bg-[#FDF8F0] p-5 rounded-2xl border border-[#F3EBE1] space-y-2">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Total Professional Studios</span>
                    <span className="text-3xl font-display font-extrabold text-[#4A3728] block">{professionals.length}</span>
                    <span className="text-[10.5px] text-slate-500 font-semibold">Architects, Engineers & Providers</span>
                  </div>

                  <div className="bg-[#FDF8F0] p-5 rounded-2xl border border-[#F3EBE1] space-y-2">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Active Workspace Projects</span>
                    <span className="text-3xl font-display font-extrabold text-emerald-700 block">{activeProjects.length}</span>
                    <span className="text-[10.5px] text-slate-500 font-semibold">Matched and in-construction</span>
                  </div>

                  <div className="bg-[#FDF8F0] p-5 rounded-2xl border border-[#F3EBE1] space-y-2">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Cumulative Revenue Value</span>
                    <span className="text-3xl font-display font-extrabold text-blue-700 block">
                      ₹{activeProjects.reduce((acc, p) => acc + (Number(p.total_budget || p.totalBudget) || 0), 0).toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10.5px] text-slate-500 font-semibold">Calculated from project budgets</span>
                  </div>
                </div>

                {/* Additional detailed charts or summaries */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Verification stats */}
                  <div className="p-5 border border-slate-200 rounded-3xl space-y-4">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Document Verification Funnel</h4>
                    <div className="space-y-3 text-xs">
                      <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                        <span className="text-slate-600 font-semibold">Pending Document Reviews</span>
                        <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 border border-amber-200 rounded-full">{pendingApprovals.length}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                        <span className="text-slate-600 font-semibold">Verified Professionals Badge</span>
                        <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-200 rounded-full">
                          {professionals.filter(p => p.verificationStatus === 'approved' || p.badge === 'Verified').length}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600 font-semibold">Unverified Profiles</span>
                        <span className="font-bold text-slate-500 bg-slate-50 px-2 py-0.5 border border-slate-200 rounded-full">
                          {professionals.filter(p => !p.badge && p.verificationStatus !== 'pending').length}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Requirements categories breakdown */}
                  <div className="p-5 border border-slate-200 rounded-3xl space-y-4">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Demand Categories (Requirements)</h4>
                    <div className="space-y-3 text-xs">
                      <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                        <span className="text-slate-600 font-semibold">Complete Villa Projects</span>
                        <span className="font-bold text-slate-800">{requirements.filter(r => r.category === 'Complete Villa' || r.category === 'All-in-One Turnkey').length}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                        <span className="text-slate-600 font-semibold">Architectural Blueprints Only</span>
                        <span className="font-bold text-slate-800">{requirements.filter(r => r.category === 'Architect').length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600 font-semibold">Other (Civil, Interior, Materials)</span>
                        <span className="font-bold text-slate-800">{requirements.filter(r => r.category !== 'Architect' && r.category !== 'Complete Villa' && r.category !== 'All-in-One Turnkey').length}</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            ) : loading ? (
              <div className="text-center py-20 text-slate-500 font-semibold text-xs animate-pulse">
                Synchronizing database tables...
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="text-center py-20 text-slate-500 text-xs font-medium border-2 border-dashed border-slate-100 rounded-2xl">
                No items match your search parameter.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-xs font-semibold text-slate-700">
                  
                  {/* Tab-dependent headers */}
                  {activeTab === 'users' && (
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px]">
                        <th className="p-3 w-10">
                          <input
                            type="checkbox"
                            checked={filteredItems.length > 0 && filteredItems.every(item => selectedIds.includes(item.id))}
                            onChange={handleSelectAll}
                            className="rounded border-slate-300 text-[#4A3728] focus:ring-[#4A3728]"
                          />
                        </th>
                        <th className="p-3">User ID</th>
                        <th className="p-3">Full Name</th>
                        <th className="p-3">Designation Role</th>
                      </tr>
                    </thead>
                  )}
                  {activeTab === 'professionals' && (
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px]">
                        <th className="p-3 w-10">
                          <input
                            type="checkbox"
                            checked={filteredItems.length > 0 && filteredItems.every(item => selectedIds.includes(item.id))}
                            onChange={handleSelectAll}
                            className="rounded border-slate-300 text-[#4A3728] focus:ring-[#4A3728]"
                          />
                        </th>
                        <th className="p-3">Expert ID</th>
                        <th className="p-3">Name</th>
                        <th className="p-3">Category</th>
                        <th className="p-3">Rating</th>
                        <th className="p-3">Location</th>
                      </tr>
                    </thead>
                  )}
                  {activeTab === 'requirements' && (
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px]">
                        <th className="p-3 w-10">
                          <input
                            type="checkbox"
                            checked={filteredItems.length > 0 && filteredItems.every(item => selectedIds.includes(item.id))}
                            onChange={handleSelectAll}
                            className="rounded border-slate-300 text-[#4A3728] focus:ring-[#4A3728]"
                          />
                        </th>
                        <th className="p-3">Req ID</th>
                        <th className="p-3">Project Title</th>
                        <th className="p-3">Category</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Location</th>
                      </tr>
                    </thead>
                  )}
                  {activeTab === 'proposals' && (
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px]">
                        <th className="p-3 w-10">
                          <input
                            type="checkbox"
                            checked={filteredItems.length > 0 && filteredItems.every(item => selectedIds.includes(item.id))}
                            onChange={handleSelectAll}
                            className="rounded border-slate-300 text-[#4A3728] focus:ring-[#4A3728]"
                          />
                        </th>
                        <th className="p-3">Bid ID</th>
                        <th className="p-3">Professional</th>
                        <th className="p-3">Rate Est</th>
                        <th className="p-3">Timeline</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Rating Control</th>
                      </tr>
                    </thead>
                  )}
                  {activeTab === 'approvals' && (
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px]">
                        <th className="p-3">Professional</th>
                        <th className="p-3">Role</th>
                        <th className="p-3">Aadhaar (ID & File)</th>
                        <th className="p-3">PAN (ID & File)</th>
                        <th className="p-3">License (ID & File)</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                  )}

                  {/* Tab-dependent rows */}
                  <tbody>
                    {activeTab === 'users' && (filteredItems as AdminUser[]).map(u => (
                      <tr key={u.id} className={`border-b border-slate-100 hover:bg-slate-50/50 transition-colors ${selectedIds.includes(u.id) ? 'bg-amber-50/30' : ''}`}>
                        <td className="p-3 w-10">
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(u.id)}
                            onChange={() => handleToggleSelect(u.id)}
                            className="rounded border-slate-300 text-[#4A3728] focus:ring-[#4A3728]"
                          />
                        </td>
                        <td className="p-3 font-mono text-[10px] text-slate-400 select-all max-w-[120px] truncate">{u.id}</td>
                        <td className="p-3 font-bold text-slate-900">{u.name}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            u.role === 'client' ? 'bg-blue-100 text-blue-800' : u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-amber-100 text-amber-900'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                      </tr>
                    ))}

                    {activeTab === 'professionals' && (filteredItems as Professional[]).map(p => (
                      <tr key={p.id} className={`border-b border-slate-100 hover:bg-slate-50/50 transition-colors ${selectedIds.includes(p.id) ? 'bg-amber-50/30' : ''}`}>
                        <td className="p-3 w-10">
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(p.id)}
                            onChange={() => handleToggleSelect(p.id)}
                            className="rounded border-slate-300 text-[#4A3728] focus:ring-[#4A3728]"
                          />
                        </td>
                        <td className="p-3 font-mono text-[10px] text-slate-400 select-all max-w-[120px] truncate">{p.id}</td>
                        <td className="p-3 font-bold text-slate-900">{p.name}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 bg-amber-50 text-amber-800 rounded-full border border-amber-200 text-[10px] font-bold">
                            {p.role}
                          </span>
                        </td>
                        <td className="p-3 font-bold text-amber-700">★ {p.rating}</td>
                        <td className="p-3 text-slate-500 font-medium">{p.location}</td>
                      </tr>
                    ))}

                    {activeTab === 'requirements' && (filteredItems as ProjectRequirement[]).map(r => (
                      <tr key={r.id} className={`border-b border-slate-100 hover:bg-slate-50/50 transition-colors ${selectedIds.includes(r.id) ? 'bg-amber-50/30' : ''}`}>
                        <td className="p-3 w-10">
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(r.id)}
                            onChange={() => handleToggleSelect(r.id)}
                            className="rounded border-slate-300 text-[#4A3728] focus:ring-[#4A3728]"
                          />
                        </td>
                        <td className="p-3 font-mono text-[10px] text-slate-400 select-all max-w-[120px] truncate">{r.id}</td>
                        <td className="p-3 font-bold text-slate-900">{r.title}</td>
                        <td className="p-3 font-medium text-slate-500">{r.category}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            r.status === 'Completed' ? 'bg-slate-100 text-slate-700' : r.status === 'Matched' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {r.status}
                          </span>
                        </td>
                        <td className="p-3 text-slate-500 font-medium">{r.location}</td>
                      </tr>
                    ))}

                    {activeTab === 'proposals' && (filteredItems as Proposal[]).map(p => (
                      <tr key={p.id} className={`border-b border-slate-100 hover:bg-slate-50/50 transition-colors ${selectedIds.includes(p.id) ? 'bg-amber-50/30' : ''}`}>
                        <td className="p-3 w-10">
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(p.id)}
                            onChange={() => handleToggleSelect(p.id)}
                            className="rounded border-slate-300 text-[#4A3728] focus:ring-[#4A3728]"
                          />
                        </td>
                        <td className="p-3 font-mono text-[10px] text-slate-400 select-all max-w-[120px] truncate">{p.id}</td>
                        <td className="p-3 font-bold text-slate-900">{p.professionalName}</td>
                        <td className="p-3 font-bold text-slate-600">₹{p.priceEstimateTotal.toLocaleString('en-IN')}</td>
                        <td className="p-3 text-slate-500 font-medium">{p.timelineEstimateMonths} Months</td>
                        <td className="p-3 font-bold text-slate-700">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                            p.status === 'Accepted' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          {p.status === 'Accepted' && (
                            <button
                              onClick={() => handleToggleProposalRating(p.id, !p.ratingEnabled)}
                              className={`px-2.5 py-1.5 rounded-lg font-bold text-[10px] transition-all cursor-pointer shadow-xs border ${
                                p.ratingEnabled
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                                  : 'bg-slate-50 text-slate-600 border-slate-300 hover:bg-slate-100'
                              }`}
                              title={p.ratingEnabled ? "Click to Disable Client Rating" : "Click to Enable Client Rating"}
                            >
                              {p.ratingEnabled ? "★ Rating Enabled" : "☆ Enable Rating"}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}

                    {activeTab === 'approvals' && (filteredItems as any[]).map(item => (
                      <tr key={item.professional.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                        <td className="p-3">
                          <div className="flex items-center gap-2.5">
                            <img src={item.professional.avatar || "/logo.jpg"} className="w-8 h-8 rounded-xl object-cover border border-slate-200" />
                            <div>
                              <div className="font-bold text-slate-900 leading-tight">{item.professional.name}</div>
                              <div className="text-[9.5px] text-slate-400 font-mono mt-0.5 max-w-[110px] truncate" title={item.professional.id}>{item.professional.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 bg-amber-50 text-amber-800 rounded-full border border-amber-200 text-[10px] font-bold">
                            {item.professional.role}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="space-y-1">
                            <div className="font-mono text-slate-700 font-bold text-[10.5px]">
                              {item.docs.aadhaarNumber ? item.docs.aadhaarNumber.replace(/(\d{4})/g, '$1 ').trim() : 'N/A'}
                            </div>
                            {item.docs.aadhaarUploaded ? (
                              item.docs.aadhaarFileUrl ? (
                                <a
                                  href={item.docs.aadhaarFileUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-2 py-0.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded text-[9.5px] font-bold block w-fit transition-colors cursor-pointer"
                                >
                                  📄 {item.docs.aadhaarFileName}
                                </a>
                              ) : (
                                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-[9.5px] font-bold block w-fit">
                                  📄 {item.docs.aadhaarFileName}
                                </span>
                              )
                            ) : (
                              <span className="text-slate-400 font-semibold text-[10px]">No file</span>
                            )}
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="space-y-1">
                            <div className="font-mono text-slate-700 font-bold text-[10.5px]">
                              {item.docs.panNumber || 'N/A'}
                            </div>
                            {item.docs.panUploaded ? (
                              item.docs.panFileUrl ? (
                                <a
                                  href={item.docs.panFileUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-2 py-0.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded text-[9.5px] font-bold block w-fit transition-colors cursor-pointer"
                                >
                                  📄 {item.docs.panFileName}
                                </a>
                              ) : (
                                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-[9.5px] font-bold block w-fit">
                                  📄 {item.docs.panFileName}
                                </span>
                              )
                            ) : (
                              <span className="text-slate-400 font-semibold text-[10px]">No file</span>
                            )}
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="space-y-1">
                            <div className="text-slate-700 font-bold text-[10.5px]">
                              <span className="text-slate-400 text-[8.5px] uppercase font-bold block leading-none">{item.docs.licenseType}</span>
                              <span className="font-mono">{item.docs.licenseId || 'N/A'}</span>
                            </div>
                            {item.docs.licenseUploaded ? (
                              item.docs.licenseFileUrl ? (
                                <a
                                  href={item.docs.licenseFileUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-2 py-0.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded text-[9.5px] font-bold block w-fit transition-colors cursor-pointer"
                                >
                                  📄 {item.docs.licenseFileName}
                                </a>
                              ) : (
                                <span className="px-2 py-0.5 bg-amber-50 text-amber-900 border border-amber-200 rounded text-[9.5px] font-bold block w-fit">
                                  📄 {item.docs.licenseFileName}
                                </span>
                              )
                            ) : (
                              <span className="text-slate-400 font-semibold text-[10px]">No file</span>
                            )}
                          </div>
                        </td>
                        <td className="p-3 text-right">
                          <div className="inline-flex gap-2">
                            <button
                              onClick={() => handleApproveDocs(item.professional.id)}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[10px] shadow-xs cursor-pointer transition-all"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleRejectDocs(item.professional.id)}
                              className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg font-bold text-[10px] cursor-pointer transition-all"
                            >
                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
