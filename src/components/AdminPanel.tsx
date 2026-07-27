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
  const [activeTab, setActiveTab] = useState<'users' | 'professionals' | 'requirements' | 'proposals'>('users');
  
  // Data states
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [requirements, setRequirements] = useState<ProjectRequirement[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  
  // Loading & Error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

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
        createdAt: new Date(r.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
      })));

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

  // Deletion Actions
  const handleDeleteUser = async (userId: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete user "${name}"? This action is permanent and might leave orphaned requests.`)) return;
    try {
      const { error } = await supabase.from('user_profiles').delete().eq('id', userId);
      if (error) throw error;
      setUsers(prev => prev.filter(u => u.id !== userId));
      triggerToast(`User "${name}" deleted successfully.`);
    } catch (err: any) {
      triggerToast(`Delete failed: ${err.message}`, true);
    }
  };

  const handleDeleteProfessional = async (profId: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete professional "${name}"? This will remove their catalog listings.`)) return;
    try {
      const { error } = await supabase.from('professionals').delete().eq('id', profId);
      if (error) throw error;
      setProfessionals(prev => prev.filter(p => p.id !== profId));
      triggerToast(`Professional "${name}" deleted successfully.`);
    } catch (err: any) {
      triggerToast(`Delete failed: ${err.message}`, true);
    }
  };

  const handleDeleteRequirement = async (reqId: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete project brief "${title}"?`)) return;
    try {
      const { error } = await supabase.from('requirements').delete().eq('id', reqId);
      if (error) throw error;
      setRequirements(prev => prev.filter(r => r.id !== reqId));
      triggerToast(`Project "${title}" deleted successfully.`);
    } catch (err: any) {
      triggerToast(`Delete failed: ${err.message}`, true);
    }
  };

  const handleDeleteProposal = async (propId: string, profName: string) => {
    if (!window.confirm(`Are you sure you want to delete proposal bid by "${profName}"?`)) return;
    try {
      const { error } = await supabase.from('proposals').delete().eq('id', propId);
      if (error) throw error;
      setProposals(prev => prev.filter(p => p.id !== propId));
      triggerToast(`Proposal from "${profName}" deleted successfully.`);
    } catch (err: any) {
      triggerToast(`Delete failed: ${err.message}`, true);
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
    return proposals.filter(p => p.professionalName.toLowerCase().includes(q) || p.professionalRole.toLowerCase().includes(q) || p.status.toLowerCase().includes(q));
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
          </div>

          {/* Main Grid View */}
          <div className="flex-1 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
            
            {/* Search filter */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#4A3728]"
              />
            </div>

            {loading ? (
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
                        <th className="p-3">User ID</th>
                        <th className="p-3">Full Name</th>
                        <th className="p-3">Designation Role</th>
                        <th className="p-3 text-right">Control Action</th>
                      </tr>
                    </thead>
                  )}
                  {activeTab === 'professionals' && (
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px]">
                        <th className="p-3">Expert ID</th>
                        <th className="p-3">Name</th>
                        <th className="p-3">Category</th>
                        <th className="p-3">Rating</th>
                        <th className="p-3">Location</th>
                        <th className="p-3 text-right">Control Action</th>
                      </tr>
                    </thead>
                  )}
                  {activeTab === 'requirements' && (
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px]">
                        <th className="p-3">Req ID</th>
                        <th className="p-3">Project Title</th>
                        <th className="p-3">Category</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Location</th>
                        <th className="p-3 text-right">Control Action</th>
                      </tr>
                    </thead>
                  )}
                  {activeTab === 'proposals' && (
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px]">
                        <th className="p-3">Bid ID</th>
                        <th className="p-3">Professional</th>
                        <th className="p-3">Rate Est</th>
                        <th className="p-3">Timeline</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Control Action</th>
                      </tr>
                    </thead>
                  )}

                  {/* Tab-dependent rows */}
                  <tbody>
                    {activeTab === 'users' && (filteredItems as AdminUser[]).map(u => (
                      <tr key={u.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                        <td className="p-3 font-mono text-[10px] text-slate-400 select-all max-w-[120px] truncate">{u.id}</td>
                        <td className="p-3 font-bold text-slate-900">{u.name}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            u.role === 'client' ? 'bg-blue-100 text-blue-800' : u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-amber-100 text-amber-900'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleDeleteUser(u.id, u.name)}
                            className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 hover:text-red-700 transition-colors cursor-pointer"
                            title="Delete User Profile"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}

                    {activeTab === 'professionals' && (filteredItems as Professional[]).map(p => (
                      <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                        <td className="p-3 font-mono text-[10px] text-slate-400 select-all max-w-[120px] truncate">{p.id}</td>
                        <td className="p-3 font-bold text-slate-900">{p.name}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 bg-amber-50 text-amber-800 rounded-full border border-amber-200 text-[10px] font-bold">
                            {p.role}
                          </span>
                        </td>
                        <td className="p-3 font-bold text-amber-700">★ {p.rating}</td>
                        <td className="p-3 text-slate-500 font-medium">{p.location}</td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleDeleteProfessional(p.id, p.name)}
                            className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 hover:text-red-700 transition-colors cursor-pointer"
                            title="Delete Professional Listing"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}

                    {activeTab === 'requirements' && (filteredItems as ProjectRequirement[]).map(r => (
                      <tr key={r.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
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
                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleDeleteRequirement(r.id, r.title)}
                            className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 hover:text-red-700 transition-colors cursor-pointer"
                            title="Delete Project Brief"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}

                    {activeTab === 'proposals' && (filteredItems as Proposal[]).map(p => (
                      <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
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
                          <button
                            onClick={() => handleDeleteProposal(p.id, p.professionalName)}
                            className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 hover:text-red-700 transition-colors cursor-pointer"
                            title="Delete Proposal Bid"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
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
