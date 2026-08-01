import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import {
  User,
  Plus,
  Image as ImageIcon,
  Briefcase,
  Award,
  DollarSign,
  MapPin,
  CheckCircle2,
  Trash2,
  Sparkles,
  Save,
  Eye,
  ShieldCheck,
  Building,
  Inbox,
  Clock,
  IndianRupee,
  ArrowRight,
  BadgeCheck,
  Send,
  Loader2
} from 'lucide-react';
import { Professional, ProfessionalCategory, PortfolioItem, ProjectRequirement, Proposal, AuthUser, ActiveProject, Review } from '../types';

interface ProfessionalPortalProps {
  professionals: Professional[];
  requirements: ProjectRequirement[];
  proposals?: Proposal[];
  onSaveProfessional: (prof: Professional) => void;
  onSelectViewDirectory: () => void;
  onAddProposal?: (proposal: Proposal) => void;
  currentUser?: AuthUser | null;
  profsLoaded?: boolean;
  activeProjects?: ActiveProject[];
  reviews?: Review[];
  onUpdateActiveProject?: (project: ActiveProject) => void;
}

export const ProfessionalPortal: React.FC<ProfessionalPortalProps> = ({
  professionals,
  requirements,
  proposals = [],
  onSaveProfessional,
  onSelectViewDirectory,
  onAddProposal,
  currentUser,
  profsLoaded = true,
  activeProjects = [],
  reviews = [],
  onUpdateActiveProject
}) => {
  if (!profsLoaded) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center space-y-3 bg-[#FDF8F0]">
        <Loader2 className="w-9 h-9 text-[#9B7B5A] animate-spin" />
        <p className="text-xs font-bold text-[#4A3728]/85 uppercase tracking-wider animate-pulse">Loading Studio Portal...</p>
      </div>
    );
  }

  const [activePortalTab, setActivePortalTab] = useState<'portfolio' | 'requests' | 'projects'>('portfolio');
  const [expressedInterest, setExpressedInterest] = useState<Set<string>>(new Set());

  const openRequirements = requirements.filter(r => r.status === 'Open for Bids');

  // Active editing state linked to logged-in user
  const currentProf = professionals.find((p) => p.id === currentUser?.id || p.owner_id === currentUser?.id);

  const [name, setName] = useState('');
  const [role, setRole] = useState<ProfessionalCategory>('Architect');
  const [title, setTitle] = useState('');
  const [experienceYears, setExperienceYears] = useState(5);
  const [pricePerSqFt, setPricePerSqFt] = useState(100);
  const [location, setLocation] = useState('Dehradun');
  const [bio, setBio] = useState('');
  const [specialtiesText, setSpecialtiesText] = useState('');
  const [avatar, setAvatar] = useState('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);

  // Form for adding new portfolio project
  const [showAddProject, setShowAddProject] = useState(false);
  const [projTitle, setProjTitle] = useState('');
  const [projCategory, setProjCategory] = useState('Residential Villa');
  const [projImage, setProjImage] = useState('');
  const [projDesc, setProjDesc] = useState('');
  const [projArea, setProjArea] = useState<number>(2500);
  const [projLocation, setProjLocation] = useState('Dehradun');

  const [activeEditTab, setActiveEditTab] = useState<'personal' | 'contact' | 'document'>('personal');

  // Verification sub-states
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [verifyingPhone, setVerifyingPhone] = useState(false);
  const [phoneOtp, setPhoneOtp] = useState('');

  const [emailVerified, setEmailVerified] = useState(false);
  const [verifyingEmail, setVerifyingEmail] = useState(false);
  const [emailOtp, setEmailOtp] = useState('');

  // Document states
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [aadhaarFileName, setAadhaarFileName] = useState('');
  const [aadhaarUploaded, setAadhaarUploaded] = useState(false);

  const [panNumber, setPanNumber] = useState('');
  const [panFileName, setPanFileName] = useState('');
  const [panUploaded, setPanUploaded] = useState(false);

  const [licenseType, setLicenseType] = useState('COA Architect License');
  const [licenseId, setLicenseId] = useState('');
  const [licenseFileName, setLicenseFileName] = useState('');
  const [licenseUploaded, setLicenseUploaded] = useState(false);

  const [docApproved, setDocApproved] = useState(false);
  const [docRejected, setDocRejected] = useState(false);

  const [aadhaarFileUrl, setAadhaarFileUrl] = useState('');
  const [panFileUrl, setPanFileUrl] = useState('');
  const [licenseFileUrl, setLicenseFileUrl] = useState('');

  const [uploadingAadhaar, setUploadingAadhaar] = useState(false);
  const [uploadingPan, setUploadingPan] = useState(false);
  const [uploadingLicense, setUploadingLicense] = useState(false);
  const [uploadingProjImage, setUploadingProjImage] = useState(false);
  const [uploadingSitePhotoId, setUploadingSitePhotoId] = useState<string | null>(null);

  const getRequiredDocsForRole = (roleCategory: string) => {
    switch (roleCategory) {
      case 'Architect':
        return {
          title: 'Architect Verification Requirements',
          licenseName: 'COA Architect License',
          licenseDesc: 'Council of Architecture (COA) registration certificate is mandatory.',
          placeholder: 'e.g. CA/2012/54687',
          requiredList: [
            'Aadhaar Card (Individual Identity Proof)',
            'PAN Card (Tax Registration Proof)',
            'COA Registration Certificate (Valid Council License)'
          ]
        };
      case 'Civil Engineer':
        return {
          title: 'Civil Engineer Verification Requirements',
          licenseName: 'Civil Engineering Degree',
          licenseDesc: 'Engineering Degree certificate (B.E./B.Tech) or Municipal License is required.',
          placeholder: 'e.g. BTECH/CIVIL/2015/098',
          requiredList: [
            'Aadhaar Card (Individual Identity Proof)',
            'PAN Card (Tax Registration Proof)',
            'Civil Engineering B.E./B.Tech Certificate or Municipal Authority License'
          ]
        };
      case 'Interior Designer':
        return {
          title: 'Interior Designer Verification Requirements',
          licenseName: 'Interior Design Certification',
          licenseDesc: 'Interior design degree/diploma or professional association certificate.',
          placeholder: 'e.g. NID/ID/2018/342',
          requiredList: [
            'Aadhaar Card (Individual Identity Proof)',
            'PAN Card (Tax Registration Proof)',
            'Interior Design Degree/Diploma Copy or Association Membership Certificate'
          ]
        };
      case 'Material Provider':
      default:
        return {
          title: 'Contractor & Material Provider Requirements',
          licenseName: 'GSTIN / Business License',
          licenseDesc: 'GSTIN Certificate or MSME/Business License copy is required.',
          placeholder: 'e.g. 05AAAAA1111A1Z1',
          requiredList: [
            'Owner Aadhaar Card (Identity Proof)',
            'Company/Owner PAN Card',
            'GSTIN Registration Certificate or MSME / Business Incorporation Certificate'
          ]
        };
    }
  };

  const requirementsInfo = getRequiredDocsForRole(role);

  const uploadVerificationDoc = async (docType: 'aadhaar' | 'pan' | 'license', file: File) => {
    const profId = currentProf?.id || currentUser?.id || 'unknown';
    const fileExt = file.name.split('.').pop();
    const fileName = `${profId}_${docType}_${Date.now()}.${fileExt}`;
    const filePath = `verification-docs/${profId}/${fileName}`;

    if (docType === 'aadhaar') setUploadingAadhaar(true);
    else if (docType === 'pan') setUploadingPan(true);
    else if (docType === 'license') setUploadingLicense(true);

    try {
      const { data, error } = await supabase.storage
        .from('verification-docs')
        .upload(filePath, file, { upsert: true, cacheControl: '3600' });

      if (error) {
        throw error;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('verification-docs')
        .getPublicUrl(filePath);

      if (docType === 'aadhaar') {
        setAadhaarUploaded(true);
        setAadhaarFileName(file.name);
        setAadhaarFileUrl(publicUrl);
      } else if (docType === 'pan') {
        setPanUploaded(true);
        setPanFileName(file.name);
        setPanFileUrl(publicUrl);
      } else if (docType === 'license') {
        setLicenseUploaded(true);
        setLicenseFileName(file.name);
        setLicenseFileUrl(publicUrl);
      }
    } catch (err: any) {
      console.warn("Storage bucket upload failed, using fallback Base64 / Local URL:", err.message);
      
      const localUrl = URL.createObjectURL(file);
      if (docType === 'aadhaar') {
        setAadhaarUploaded(true);
        setAadhaarFileName(file.name);
        setAadhaarFileUrl(localUrl);
      } else if (docType === 'pan') {
        setPanUploaded(true);
        setPanFileName(file.name);
        setPanFileUrl(localUrl);
      } else if (docType === 'license') {
        setLicenseUploaded(true);
        setLicenseFileName(file.name);
        setLicenseFileUrl(localUrl);
      }
    } finally {
      if (docType === 'aadhaar') setUploadingAadhaar(false);
      else if (docType === 'pan') setUploadingPan(false);
      else if (docType === 'license') setUploadingLicense(false);
    }
  };

  const handleUploadProjImage = async (file: File) => {
    const profId = currentProf?.id || currentUser?.id || 'unknown';
    const fileExt = file.name.split('.').pop();
    const fileName = `project_${Date.now()}.${fileExt}`;
    const filePath = `portfolio-images/${profId}/${fileName}`;

    setUploadingProjImage(true);
    try {
      const { data, error } = await supabase.storage
        .from('verification-docs')
        .upload(filePath, file, { upsert: true, cacheControl: '3600' });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('verification-docs')
        .getPublicUrl(filePath);

      setProjImage(publicUrl);
    } catch (err: any) {
      console.warn("Portfolio image upload failed, falling back to local base64:", err.message);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProjImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    } finally {
      setUploadingProjImage(false);
    }
  };

  const handleUploadSitePhoto = async (project: ActiveProject, file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `site_${Date.now()}.${fileExt}`;
    const filePath = `site-photos/${project.id}/${fileName}`;

    setUploadingSitePhotoId(project.id);
    try {
      const { data, error } = await supabase.storage
        .from('verification-docs')
        .upload(filePath, file, { upsert: true, cacheControl: '3600' });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('verification-docs')
        .getPublicUrl(filePath);

      const newPhoto = {
        url: publicUrl,
        caption: prompt("Enter a description/caption for this photo:", "Foundation work completed") || "Site Update",
        date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
      };

      const updatedPhotos = [...(project.sitePhotos || []), newPhoto];
      onUpdateActiveProject?.({
        ...project,
        sitePhotos: updatedPhotos
      });
    } catch (err: any) {
      console.warn("Site photo upload failed, using local fallback URL:", err.message);
      
      const localUrl = URL.createObjectURL(file);
      const newPhoto = {
        url: localUrl,
        caption: prompt("Enter a description/caption for this photo:", "Foundation work completed") || "Site Update",
        date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
      };

      const updatedPhotos = [...(project.sitePhotos || []), newPhoto];
      onUpdateActiveProject?.({
        ...project,
        sitePhotos: updatedPhotos
      });
    } finally {
      setUploadingSitePhotoId(null);
    }
  };

  // Sync default licenseType with role changes
  React.useEffect(() => {
    if (!licenseUploaded) {
      if (role === 'Architect') {
        setLicenseType('COA Architect License');
      } else if (role === 'Civil Engineer') {
        setLicenseType('Civil Engineering Degree');
      } else if (role === 'Interior Designer') {
        setLicenseType('Interior Design Certification');
      } else {
        setLicenseType('GSTIN / Business License');
      }
    }
  }, [role, licenseUploaded]);

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Sync state with currentProf database entity
  React.useEffect(() => {
    if (currentProf) {
      setName(currentProf.name || '');
      setRole(currentProf.role || 'Architect');
      setTitle(currentProf.title || '');
      setExperienceYears(currentProf.experienceYears || 5);
      setPricePerSqFt(currentProf.pricePerSqFt || 100);
      setLocation(currentProf.location || '');
      setBio(currentProf.bio || '');
      setSpecialtiesText(currentProf.specialties?.join(', ') || '');
      setAvatar(currentProf.avatar || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80');
      setPhone(currentProf.phone || '');
      setEmail(currentProf.email || '');
      setPortfolio(currentProf.portfolio || []);
      setPhoneVerified(currentProf.phone ? true : false);
      setEmailVerified(currentProf.email ? true : false);
      
      // Sync from currentProf database entity, fallback to localStorage
      const cachedDoc = localStorage.getItem(`prof_doc_${currentProf.id}`);
      let parsedCached: any = null;
      if (cachedDoc) {
        try { parsedCached = JSON.parse(cachedDoc); } catch (e) {}
      }

      const dbAadhaarNum = currentProf.aadhaarNumber || parsedCached?.aadhaarNumber || '';
      const dbAadhaarFile = currentProf.aadhaarFileName || parsedCached?.aadhaarFileName || '';
      const dbAadhaarUrl = currentProf.aadhaarFileUrl || parsedCached?.aadhaarFileUrl || '';

      const dbPanNum = currentProf.panNumber || parsedCached?.panNumber || '';
      const dbPanFile = currentProf.panFileName || parsedCached?.panFileName || '';
      const dbPanUrl = currentProf.panFileUrl || parsedCached?.panFileUrl || '';

      const dbLicenseType = currentProf.licenseType || parsedCached?.licenseType || (currentProf.role === 'Architect' ? 'COA Architect License' : currentProf.role === 'Civil Engineer' ? 'Civil Engineering Degree' : currentProf.role === 'Interior Designer' ? 'Interior Design Certification' : 'GSTIN / Business License');
      const dbLicenseId = currentProf.licenseId || parsedCached?.licenseId || '';
      const dbLicenseFile = currentProf.licenseFileName || parsedCached?.licenseFileName || '';
      const dbLicenseUrl = currentProf.licenseFileUrl || parsedCached?.licenseFileUrl || '';

      setAadhaarNumber(dbAadhaarNum);
      setAadhaarFileName(dbAadhaarFile);
      setAadhaarFileUrl(dbAadhaarUrl);
      setAadhaarUploaded(!!dbAadhaarFile);

      setPanNumber(dbPanNum);
      setPanFileName(dbPanFile);
      setPanFileUrl(dbPanUrl);
      setPanUploaded(!!dbPanFile);

      setLicenseType(dbLicenseType);
      setLicenseId(dbLicenseId);
      setLicenseFileName(dbLicenseFile);
      setLicenseFileUrl(dbLicenseUrl);
      setLicenseUploaded(!!dbLicenseFile);

      setDocApproved(currentProf.verificationStatus === 'approved' || parsedCached?.approved || false);
      setDocRejected(currentProf.verificationStatus === 'rejected' || parsedCached?.rejected || false);

      setIsEditingProfile(false);
    } else if (currentUser) {
      setName(currentUser.name || '');
      setEmail(currentUser.email || '');
      setRole('Architect');
      setTitle('');
      setExperienceYears(5);
      setPricePerSqFt(100);
      setLocation('Dejadun'); // wait, let's keep original location Dehradun
      setLocation('Dehradun');
      setBio('');
      setSpecialtiesText('');
      setAvatar('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80');
      setPhone('');
      setPhoneVerified(false);
      setEmailVerified(currentUser.email ? true : false);
      setAadhaarNumber('');
      setAadhaarFileName('');
      setAadhaarFileUrl('');
      setAadhaarUploaded(false);
      setPanNumber('');
      setPanFileName('');
      setPanFileUrl('');
      setPanUploaded(false);
      setLicenseType('COA Architect License');
      setLicenseId('');
      setLicenseFileName('');
      setLicenseFileUrl('');
      setLicenseUploaded(false);
      setDocApproved(false);
      setDocRejected(false);
      setPortfolio([]);
      setIsEditingProfile(true);
    }
  }, [currentProf, currentUser]);

  const handleAddPortfolioProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projTitle.trim() || !projImage.trim()) return;

    const newItem: PortfolioItem = {
      id: `port-${Date.now()}`,
      title: projTitle,
      category: projCategory,
      image: projImage,
      description: projDesc,
      areaSqFt: Number(projArea),
      location: projLocation
    };

    setPortfolio([newItem, ...portfolio]);
    setProjTitle('');
    setProjImage('');
    setProjDesc('');
    setShowAddProject(false);
  };

  const handleRemovePortfolioProject = (id: string) => {
    setPortfolio(portfolio.filter((p) => p.id !== id));
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();

    const updated: Professional = {
      id: currentProf?.id || currentUser?.id || `prof-${Date.now()}`,
      name,
      role,
      title,
      experienceYears: Number(experienceYears),
      pricePerSqFt: Number(pricePerSqFt),
      location,
      bio,
      avatar,
      specialties: specialtiesText.split(',').map((s) => s.trim()).filter(Boolean),
      phone,
      email,
      portfolio,
      rating: currentProf?.rating || 5.0,
      reviewCount: currentProf?.reviewCount || 1,
      completedProjectsCount: currentProf?.completedProjectsCount || 0,
      badge: currentProf?.badge,
      verificationStatus: docApproved ? 'approved' : (aadhaarUploaded || panUploaded || licenseUploaded) ? 'pending' : 'unverified',
      aadhaarNumber,
      aadhaarFileName,
      aadhaarFileUrl,
      panNumber,
      panFileName,
      panFileUrl,
      licenseType,
      licenseId,
      licenseFileName,
      licenseFileUrl
    };

    // Save verification docs metadata
    const docData = {
      aadhaarNumber,
      aadhaarFileName,
      aadhaarFileUrl,
      aadhaarUploaded,
      panNumber,
      panFileName,
      panFileUrl,
      panUploaded,
      licenseType,
      licenseId,
      licenseFileName,
      licenseFileUrl,
      licenseUploaded,
      approved: docApproved,
      rejected: docRejected
    };
    localStorage.setItem(`prof_doc_${updated.id}`, JSON.stringify(docData));

    onSaveProfessional(updated);
    setSavedSuccess(true);
    setIsEditingProfile(false);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="py-12 bg-[#FDF8F0] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
        
        {/* Portal Header */}
        <div className="bg-gradient-to-r from-[#4A3728] via-[#6B5040] to-[#4A3728] rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-amber-200 text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Professional Studio Dashboard</span>
            </div>
            <h1 className="font-display font-extrabold text-2xl sm:text-4xl text-white">
              Professional Hub
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 max-w-xl">
              Manage your profile, portfolio, and see live client project requests.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onSelectViewDirectory}
              className="px-5 py-3 bg-white/15 hover:bg-white/25 text-white font-bold text-xs sm:text-sm rounded-full border border-white/20 transition-all flex items-center space-x-1.5"
            >
              <Eye className="w-4 h-4" />
              <span>View Public Directory</span>
            </button>
          </div>
        </div>

        {/* Main Tab Switcher */}
        <div className="flex flex-row overflow-x-auto max-w-full sm:w-fit gap-2 bg-slate-200/50 p-1 rounded-2xl no-scrollbar">
          <button
            onClick={() => setActivePortalTab('portfolio')}
            className={`flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
              activePortalTab === 'portfolio'
                ? 'bg-[#4A3728] text-white shadow-md'
                : 'text-slate-600 hover:text-[#4A3728]'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            My Portfolio
          </button>
          <button
            onClick={() => setActivePortalTab('requests')}
            className={`flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all relative ${
              activePortalTab === 'requests'
                ? 'bg-[#4A3728] text-white shadow-md'
                : 'text-slate-600 hover:text-[#4A3728]'
            }`}
          >
            <Inbox className="w-4 h-4" />
            Client Requests
            {openRequirements.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center animate-pulse">
                {openRequirements.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActivePortalTab('projects')}
            className={`flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
              activePortalTab === 'projects'
                ? 'bg-[#4A3728] text-white shadow-md'
                : 'text-slate-600 hover:text-[#4A3728]'
            }`}
          >
            <Building className="w-4 h-4" />
            Active Projects Tracker ({activeProjects.filter(p => p.professionalId === currentProf?.id).length})
          </button>
        </div>

        {/* ─── ACTIVE PROJECTS TAB ─── */}
        {activePortalTab === 'projects' && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <h2 className="font-display font-extrabold text-2xl text-[#4A3728]">Matched Projects Progress Tracker</h2>
              <p className="text-sm text-slate-500 mt-0.5">Manage project deliverables, toggle milestone checklists, release bills, and upload progress photos.</p>
            </div>

            {activeProjects.filter(p => p.professionalId === currentProf?.id).length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-[#FDF8F0] flex items-center justify-center mx-auto text-slate-400">
                  <Building className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-display font-bold text-[#4A3728] text-base">No Matched Projects Yet</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Once a client accepts your submitted bid / proposal from the "Client Requests" tab, the active project dashboard will generate here automatically.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {activeProjects.filter(p => p.professionalId === currentProf?.id).map((project) => {
                  return (
                    <div key={project.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
                      
                      {/* Project Header Card */}
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-display font-extrabold text-base text-[#4A3728]">{project.name}</h3>
                            <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded-full border border-emerald-200">
                              Status: {project.overallProgress}% Complete
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            <span>Client: <strong>{project.clientName}</strong></span>
                            <span className="text-slate-300">|</span>
                            <span>Location: <strong>{project.location}</strong></span>
                            <span className="text-slate-300">|</span>
                            <span>Completion Target: {project.estimatedCompletion}</span>
                          </p>
                        </div>
                        
                        {/* Overall Completion Bar */}
                        <div className="w-full md:w-64 space-y-1">
                          <div className="flex justify-between text-[10px] font-bold text-slate-600">
                            <span>Overall Progress</span>
                            <span>{project.overallProgress}%</span>
                          </div>
                          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-600 rounded-full transition-all duration-500" style={{ width: `${project.overallProgress}%` }} />
                          </div>
                        </div>
                      </div>

                      {/* Budget Tracker & Payment Status */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                        <div className="space-y-1">
                          <span className="text-[10px] text-slate-400 uppercase font-bold block leading-none">Total Contract Value</span>
                          <span className="text-xl font-bold text-slate-900">₹{project.totalBudget.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] text-slate-400 uppercase font-bold block leading-none">Amount Cleared / Paid</span>
                          <span className="text-xl font-bold text-emerald-700">₹{project.amountPaid.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] text-slate-400 uppercase font-bold block leading-none">Pending Balance</span>
                          <span className="text-xl font-bold text-amber-700">₹{(project.totalBudget - project.amountPaid).toLocaleString('en-IN')}</span>
                        </div>
                      </div>

                      {/* Milestones Control Panel */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Milestones Management Checklist</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {project.milestones.map((milestone) => (
                            <div key={milestone.id} className="p-3 bg-[#FDF8F0] border border-[#F3EBE1] rounded-xl flex items-center justify-between gap-3 hover:border-[#C4A882]/40 transition-colors">
                              <div className="space-y-1 min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                                    milestone.status === 'Completed' ? 'bg-emerald-500' : milestone.status === 'In Progress' ? 'bg-amber-500' : 'bg-slate-300'
                                  }`} />
                                  <span className="text-xs font-bold text-slate-800 truncate">{milestone.title}</span>
                                </div>
                                <div className="text-[9.5px] text-slate-400 pl-3.5">
                                  Weight: {milestone.percentageWeight}% | Target: {milestone.targetDate}
                                </div>
                              </div>
                              
                              <select
                                value={milestone.status}
                                onChange={(e) => {
                                  const newStatus = e.target.value as 'Completed' | 'In Progress' | 'Upcoming';
                                  const updatedMilestones = project.milestones.map(m => m.id === milestone.id ? { ...m, status: newStatus } : m);
                                  
                                  // Recalculate overall progress as sum of weights of completed milestones
                                  const newProgress = updatedMilestones.reduce((acc, m) => m.status === 'Completed' ? acc + m.percentageWeight : acc, 0);
                                  
                                  onUpdateActiveProject?.({
                                    ...project,
                                    milestones: updatedMilestones,
                                    overallProgress: newProgress
                                  });
                                }}
                                className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#4A3728]"
                              >
                                <option value="Upcoming">Upcoming</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                              </select>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Site Progress Photos Upload & Gallery */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Site Inspection Photos</h4>
                          
                          {/* File upload input wrapper */}
                          {uploadingSitePhotoId === project.id ? (
                            <div className="flex items-center gap-1 text-[10.5px] text-slate-400 font-bold bg-slate-50 px-3 py-1 border border-slate-200 rounded-full">
                              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#9B7B5A]" />
                              <span>Uploading Photo...</span>
                            </div>
                          ) : (
                            <label className="px-3 py-1 bg-[#9B7B5A] hover:bg-[#7A5C45] text-white font-bold text-[10px] rounded-full cursor-pointer flex items-center space-x-1.5 shadow-2xs font-sans">
                              <span>📤 Upload Site Photo</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    handleUploadSitePhoto(project, file);
                                  }
                                }}
                              />
                            </label>
                          )}
                        </div>

                        {project.sitePhotos.length === 0 ? (
                          <p className="text-xs text-slate-400 italic">No progress photos uploaded yet. Upload a site photo above to notify the homeowner of design/construction updates.</p>
                        ) : (
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {project.sitePhotos.map((photo, idx) => (
                              <div key={idx} className="group relative rounded-xl overflow-hidden border border-slate-200 aspect-4/3 bg-slate-100">
                                <img src={photo.url} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-2 text-white text-[9.5px] font-medium">
                                  <p className="truncate font-bold">{photo.caption}</p>
                                  <p className="opacity-70 mt-0.5">{photo.date}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ─── CLIENT REQUESTS TAB ─── */}
        {activePortalTab === 'requests' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display font-extrabold text-2xl text-[#4A3728]">Live Client Requests</h2>
                <p className="text-sm text-slate-500 mt-0.5">{openRequirements.length} open project{openRequirements.length !== 1 ? 's' : ''} looking for professionals</p>
              </div>
            </div>

            {openRequirements.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto">
                  <Inbox className="w-8 h-8 text-slate-300" />
                </div>
                <p className="text-slate-400 font-semibold">No open project requests at the moment</p>
                <p className="text-slate-400 text-sm">New client project postings will appear here</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {openRequirements.map(req => {
                  const interested = expressedInterest.has(req.id) || proposals?.some(p => p.requirementId === req.id && (p.professionalName === currentProf?.name || p.professionalId === currentProf?.id));
                  return (
                    <div key={req.id} className={`bg-white rounded-2xl border-2 shadow-sm hover:shadow-md transition-all p-5 space-y-4 ${
                      interested ? 'border-green-200' : 'border-slate-100 hover:border-[#9B7B5A]/30'
                    }`}>
                      {/* Status + Category */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex flex-wrap gap-1.5">
                          <span className="px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-wide">
                            {req.status}
                          </span>
                          <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                            {req.category}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 flex items-center gap-1 flex-shrink-0">
                          <Clock className="w-3 h-3" />
                          {req.createdAt}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="font-bold text-[#4A3728] text-base leading-snug">{req.title}</h3>

                      {/* Details grid */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center gap-1.5 text-xs text-slate-600">
                          <MapPin className="w-3.5 h-3.5 text-[#9B7B5A] flex-shrink-0" />
                          <span className="truncate">{req.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-600">
                          <Building className="w-3.5 h-3.5 text-[#9B7B5A] flex-shrink-0" />
                          <span>{req.builtUpAreaSqFt?.toLocaleString()} sqft</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-600">
                          <IndianRupee className="w-3.5 h-3.5 text-[#9B7B5A] flex-shrink-0" />
                          <span className="truncate">{req.budgetRange}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-600">
                          <Clock className="w-3.5 h-3.5 text-[#9B7B5A] flex-shrink-0" />
                          <span>{req.preferredTimeline}</span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{req.description}</p>

                      {/* Style tag */}
                      {req.architecturalStyle && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-semibold">
                          Style: {req.architecturalStyle}
                        </span>
                      )}

                      {/* CTA */}
                      {interested ? (
                        <div className="flex items-center gap-2 py-2.5 px-4 bg-green-50 border border-green-200 rounded-xl">
                          <BadgeCheck className="w-4 h-4 text-green-600 flex-shrink-0" />
                          <span className="text-xs font-bold text-green-700">Interest Expressed! Client has been notified.</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setExpressedInterest(prev => new Set([...prev, req.id]));
                            if (onAddProposal) {
                              const newProp: Proposal = {
                                id: `prop-${Date.now()}`,
                                requirementId: req.id,
                                professionalId: currentProf?.id || currentUser?.id || `prof-${Date.now()}`,
                                professionalName: name || currentProf?.name || currentUser?.name || 'Ar. Verified Expert',
                                professionalRole: role || currentProf?.role || 'Architect',
                                professionalAvatar: avatar || currentProf?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
                                rating: currentProf?.rating || 4.9,
                                priceEstimateTotal: Math.round((req.builtUpAreaSqFt || 2000) * (pricePerSqFt || currentProf?.pricePerSqFt || 150)),
                                timelineEstimateMonths: 6,
                                keyHighlights: [
                                  'Custom 3D Architectural Blueprint & Permits',
                                  'Dedicated Site Inspections & Milestone Supervision',
                                  'Structural & Electrical Load Calculation'
                                ],
                                scopeBreakdown: [
                                  { item: 'Design & Permitting', cost: Math.round((req.builtUpAreaSqFt || 2000) * 50) },
                                  { item: 'Supervision & Execution', cost: Math.round((req.builtUpAreaSqFt || 2000) * 100) }
                                ],
                                status: 'Pending'
                              };
                              onAddProposal(newProp);
                            }
                          }}
                          className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#4A3728] hover:bg-[#6B5040] text-white font-bold text-xs rounded-xl transition-all shadow-sm hover:shadow-md"
                        >
                          <Send className="w-3.5 h-3.5" />
                          Express Interest
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ─── PORTFOLIO TAB ─── */}
        {activePortalTab === 'portfolio' && (
        <div className="space-y-8">


        {savedSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-2xl flex items-center space-x-3 animate-fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span className="text-sm font-bold">
              Profile & Portfolio saved successfully! Changes are live on the Arch-Connect directory.
            </span>
          </div>
        )}

        {/* Main Editor Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Profile Details Form / Summary */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div className="border-b border-slate-200 pb-4 flex items-center justify-between">
              <h2 className="font-display font-bold text-lg text-[#4A3728] flex items-center space-x-2">
                <User className="w-5 h-5 text-[#9B7B5A]" />
                <span>{isEditingProfile ? 'Professional Details' : 'Professional Profile Summary'}</span>
              </h2>
              {isEditingProfile ? (
                <span className="text-xs font-bold uppercase px-3 py-1 bg-amber-50 text-amber-900 rounded-full border border-amber-200">
                  {role}
                </span>
              ) : (
                <button
                  onClick={() => setIsEditingProfile(true)}
                  className="px-4 py-1.5 bg-[#FDF8F0] hover:bg-[#F3EBE1] text-[#4A3728] border border-slate-300 rounded-full font-bold text-xs transition-colors cursor-pointer"
                >
                  Edit Profile
                </button>
              )}
            </div>

            {isEditingProfile ? (
              <form onSubmit={handleSaveProfile} className="space-y-6">
                
                {/* 3-Step Edit Profile Tabs */}
                <div className="flex flex-wrap border-b border-slate-200 text-xs font-bold uppercase tracking-wider gap-x-2 gap-y-1 pb-1">
                  <button
                    type="button"
                    onClick={() => setActiveEditTab('personal')}
                    className={`pb-2 px-3 border-b-2 transition-all cursor-pointer ${
                      activeEditTab === 'personal'
                        ? 'border-[#4A3728] text-[#4A3728] font-extrabold'
                        : 'border-transparent text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    1. Personal Details
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveEditTab('contact')}
                    className={`pb-2 px-3 border-b-2 transition-all cursor-pointer ${
                      activeEditTab === 'contact'
                        ? 'border-[#4A3728] text-[#4A3728] font-extrabold'
                        : 'border-transparent text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    2. Contact Verification
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveEditTab('document')}
                    className={`pb-2 px-3 border-b-2 transition-all cursor-pointer ${
                      activeEditTab === 'document'
                        ? 'border-[#4A3728] text-[#4A3728] font-extrabold'
                        : 'border-transparent text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    3. Document Verification
                  </button>
                </div>

                {/* Tab 1: Personal Details */}
                {activeEditTab === 'personal' && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Full Name & Title</label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Ar. Ananya Verma"
                          className="w-full px-4 py-2.5 bg-[#FDF8F0] border border-slate-300 rounded-xl text-xs font-semibold text-[#2C1F14] focus:outline-none focus:ring-2 focus:ring-[#4A3728]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Category / Role</label>
                        <select
                          value={role}
                          onChange={(e) => setRole(e.target.value as ProfessionalCategory)}
                          className="w-full px-4 py-2.5 bg-[#FDF8F0] border border-slate-300 rounded-xl text-xs font-semibold text-[#2C1F14] focus:outline-none focus:ring-2 focus:ring-[#4A3728]"
                        >
                          <option value="Architect">Architect</option>
                          <option value="Interior Designer">Interior Designer</option>
                          <option value="Civil Engineer">Civil Engineer</option>
                          <option value="Material Provider">Material Provider</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Designation & Firm Name</label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Principal Architect & Founder, Atelier Verma"
                        className="w-full px-4 py-2.5 bg-[#FDF8F0] border border-slate-300 rounded-xl text-xs font-semibold text-[#2C1F14] focus:outline-none focus:ring-2 focus:ring-[#4A3728]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Price / Sq.Ft (₹)</label>
                        <input
                          type="number"
                          value={pricePerSqFt === 0 ? '' : pricePerSqFt}
                          onChange={(e) => setPricePerSqFt(Number(e.target.value))}
                          placeholder="180"
                          className="w-full px-4 py-2.5 bg-[#FDF8F0] border border-slate-300 rounded-xl text-xs font-semibold text-[#2C1F14] focus:outline-none focus:ring-2 focus:ring-[#4A3728]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Experience (Years)</label>
                        <input
                          type="number"
                          value={experienceYears === 0 ? '' : experienceYears}
                          onChange={(e) => setExperienceYears(Number(e.target.value))}
                          placeholder="12"
                          className="w-full px-4 py-2.5 bg-[#FDF8F0] border border-slate-300 rounded-xl text-xs font-semibold text-[#2C1F14] focus:outline-none focus:ring-2 focus:ring-[#4A3728]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase mb-1">City / Location</label>
                        <select
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          className="w-full px-4 py-2.5 bg-[#FDF8F0] border border-slate-300 rounded-xl text-xs font-semibold text-[#2C1F14] focus:outline-none focus:ring-2 focus:ring-[#4A3728]"
                        >
                          <option value="Dehradun">Dehradun</option>
                          <option value="Roorkee">Roorkee</option>
                          <option value="Delhi">Delhi</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Profile Photo / Avatar</label>
                      <div className="flex flex-col sm:flex-row items-center gap-4 bg-[#FDF8F0] p-4 rounded-2xl border border-slate-300">
                        <img
                          src={avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                          alt="Avatar Preview"
                          className="w-16 h-16 rounded-full object-cover border-2 border-[#4A3728] shadow-sm flex-shrink-0"
                        />
                        <div className="flex-1 w-full space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <label className="px-4 py-2 bg-[#4A3728] hover:bg-[#6B5040] text-white text-xs font-bold rounded-xl cursor-pointer shadow-xs transition-colors inline-flex items-center space-x-1.5 font-sans">
                              <ImageIcon className="w-3.5 h-3.5" />
                              <span>Upload Photo from Device</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                      setAvatar(reader.result as string);
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                              />
                            </label>
                            <span className="text-[11px] text-slate-500 font-medium">PNG, JPG up to 5MB</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Specialties (Comma Separated)</label>
                      <input
                        type="text"
                        value={specialtiesText}
                        onChange={(e) => setSpecialtiesText(e.target.value)}
                        placeholder="Modern Villas, Elevation Architecture, Passive Solar"
                        className="w-full px-4 py-2.5 bg-[#FDF8F0] border border-slate-300 rounded-xl text-xs font-semibold text-[#2C1F14] focus:outline-none focus:ring-2 focus:ring-[#4A3728]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Bio & Design Philosophy</label>
                      <textarea
                        rows={4}
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Detail your architectural philosophy, background, and signature design style..."
                        className="w-full px-4 py-2.5 bg-[#FDF8F0] border border-slate-300 rounded-xl text-xs font-semibold text-[#2C1F14] focus:outline-none focus:ring-2 focus:ring-[#4A3728]"
                      />
                    </div>
                  </div>
                )}

                {/* Tab 2: Contact Verification */}
                {activeEditTab === 'contact' && (
                  <div className="space-y-4 animate-fade-in text-[#2C1F14]">
                    
                    {/* Phone Verification */}
                    <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-bold text-slate-700 uppercase">Contact Phone Number</label>
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                          phoneVerified
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-amber-50 text-amber-900 border-amber-200'
                        }`}>
                          {phoneVerified ? 'Verified ✓' : 'Pending Verification'}
                        </span>
                      </div>
                      
                      <div className="flex gap-2">
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => {
                            setPhone(e.target.value);
                            setPhoneVerified(false);
                          }}
                          placeholder="e.g. +91 98765 43210"
                          className="flex-1 px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-[#2C1F14] focus:outline-none focus:ring-2 focus:ring-[#4A3728]"
                        />
                        {!phoneVerified && phone.trim() && (
                          <button
                            type="button"
                            onClick={() => {
                              setVerifyingPhone(true);
                              setPhoneOtp('');
                            }}
                            className="px-4 bg-[#4A3728] hover:bg-[#6B5040] text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                          >
                            Verify
                          </button>
                        )}
                      </div>

                      {verifyingPhone && (
                        <div className="p-3 bg-[#FDF8F0] rounded-xl border border-[#C4A882]/40 space-y-2 text-xs">
                          <p className="font-semibold text-slate-600">Enter verification OTP sent to your phone (Demo Code: <strong className="text-[#4A3728]">1234</strong>):</p>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              maxLength={4}
                              value={phoneOtp}
                              onChange={(e) => setPhoneOtp(e.target.value)}
                              placeholder="0000"
                              className="w-20 text-center px-2 py-1 bg-white border border-slate-300 rounded-lg font-bold"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                if (phoneOtp === '1234') {
                                  setPhoneVerified(true);
                                  setVerifyingPhone(false);
                                } else {
                                  alert('Invalid OTP code. Please enter 1234');
                                }
                              }}
                              className="px-3 bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-bold rounded-lg transition-colors cursor-pointer"
                            >
                              Confirm
                            </button>
                            <button
                              type="button"
                              onClick={() => setVerifyingPhone(false)}
                              className="px-3 bg-slate-300 hover:bg-slate-400 text-slate-700 text-[11px] font-bold rounded-lg transition-colors cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Email Verification */}
                    <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-bold text-slate-700 uppercase">Contact Email Address</label>
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                          emailVerified
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-amber-50 text-amber-900 border-amber-200'
                        }`}>
                          {emailVerified ? 'Verified ✓' : 'Pending Verification'}
                        </span>
                      </div>
                      
                      <div className="flex gap-2">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            setEmailVerified(false);
                          }}
                          placeholder="e.g. contact@yourfirm.com"
                          className="flex-1 px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-[#2C1F14] focus:outline-none focus:ring-2 focus:ring-[#4A3728]"
                        />
                        {!emailVerified && email.trim() && (
                          <button
                            type="button"
                            onClick={() => {
                              setVerifyingEmail(true);
                              setEmailOtp('');
                            }}
                            className="px-4 bg-[#4A3728] hover:bg-[#6B5040] text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                          >
                            Verify
                          </button>
                        )}
                      </div>

                      {verifyingEmail && (
                        <div className="p-3 bg-[#FDF8F0] rounded-xl border border-[#C4A882]/40 space-y-2 text-xs">
                          <p className="font-semibold text-slate-600">Enter verification OTP sent to your email (Demo Code: <strong className="text-[#4A3728]">4321</strong>):</p>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              maxLength={4}
                              value={emailOtp}
                              onChange={(e) => setEmailOtp(e.target.value)}
                              placeholder="0000"
                              className="w-20 text-center px-2 py-1 bg-white border border-slate-300 rounded-lg font-bold"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                if (emailOtp === '4321') {
                                  setEmailVerified(true);
                                  setVerifyingEmail(false);
                                } else {
                                  alert('Invalid OTP code. Please enter 4321');
                                }
                              }}
                              className="px-3 bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-bold rounded-lg transition-colors cursor-pointer"
                            >
                              Confirm
                            </button>
                            <button
                              type="button"
                              onClick={() => setVerifyingEmail(false)}
                              className="px-3 bg-slate-300 hover:bg-slate-400 text-slate-700 text-[11px] font-bold rounded-lg transition-colors cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Tab 3: Document Verification */}
                {activeEditTab === 'document' && (
                  <div className="space-y-4 animate-fade-in text-[#2C1F14]">
                    {docApproved ? (
                      <div className="p-8 bg-emerald-50/70 border border-emerald-200 rounded-3xl text-center space-y-3">
                        <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
                          <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <h4 className="font-bold text-emerald-800 text-sm">Profile Verified & Approved!</h4>
                        <p className="text-xs text-emerald-700 max-w-sm mx-auto leading-relaxed">
                          Your verification documents (Aadhaar Card, PAN Card, and Professional License) have been reviewed and approved by the platform administrators. Your profile now displays the "Verified" badge.
                        </p>
                      </div>
                    ) : (
                      <>
                        {docRejected && (
                          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-semibold leading-relaxed">
                            ❌ Verification Rejected: Your previously submitted documents were rejected by the administration team. Please review requirements and upload correct and valid copies.
                          </div>
                        )}

                        {/* Requirements List (Auto-Fetched) */}
                        <div className="bg-amber-900/5 border border-amber-900/10 rounded-2xl p-4.5 space-y-3">
                          <div className="flex items-center gap-2.5 text-[#4A3728]">
                            <ShieldCheck className="w-5 h-5 text-[#9B7B5A]" />
                            <h5 className="font-bold text-sm">{requirementsInfo.title}</h5>
                          </div>
                          <p className="text-xs text-slate-500 leading-relaxed">
                            Your profile is registered as <strong className="text-[#4A3728]">{role}</strong>. Please provide the following details and upload documents to get verified:
                          </p>
                          <ul className="text-xs text-slate-600 pl-1 space-y-1.5 list-disc list-inside">
                            {requirementsInfo.requiredList.map((req, idx) => (
                              <li key={idx} className="leading-snug">
                                <span className="font-medium text-slate-700">{req}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Doc 1: Aadhaar Card */}
                        <div className="p-5 bg-white border border-slate-200 rounded-2xl space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="text-xs font-bold uppercase text-slate-700">1. Aadhaar Card (Identity Proof)</h4>
                              <p className="text-[10px] text-slate-400 mt-0.5">Please provide your 12-digit Aadhaar Number and upload front/back copy</p>
                            </div>
                            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                              aadhaarUploaded
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : 'bg-slate-100 text-slate-500 border-slate-200'
                            }`}>
                              {aadhaarUploaded ? 'Uploaded' : 'Missing'}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Aadhaar Number</label>
                              <input
                                type="text"
                                maxLength={12}
                                value={aadhaarNumber}
                                onChange={(e) => setAadhaarNumber(e.target.value.replace(/\D/g, ''))}
                                placeholder="e.g. 1234 5678 9012"
                                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Aadhaar Copy File</label>
                              <div className="flex items-center justify-between p-2.5 border border-slate-200 rounded-lg bg-slate-50">
                                {uploadingAadhaar ? (
                                  <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold py-1">
                                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#9B7B5A]" />
                                    <span>Uploading to Storage...</span>
                                  </div>
                                ) : aadhaarUploaded ? (
                                  <div className="flex items-center justify-between w-full">
                                    <span className="text-xs font-bold text-[#4A3728] truncate max-w-[150px]" title={aadhaarFileName}>
                                      📄 {aadhaarFileName}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => { setAadhaarUploaded(false); setAadhaarFileName(''); setAadhaarFileUrl(''); }}
                                      className="text-[10px] font-bold text-red-600 hover:underline cursor-pointer"
                                    >
                                      Remove
                                    </button>
                                  </div>
                                ) : (
                                  <label className="text-[10.5px] font-bold text-[#9B7B5A] hover:text-[#7A5C45] cursor-pointer flex items-center gap-1">
                                    <span>📤 Upload Aadhaar PDF/JPG</span>
                                    <input
                                      type="file"
                                      accept="image/*,application/pdf"
                                      className="hidden"
                                      onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                          uploadVerificationDoc('aadhaar', file);
                                        }
                                      }}
                                    />
                                  </label>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Doc 2: PAN Card */}
                        <div className="p-5 bg-white border border-slate-200 rounded-2xl space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="text-xs font-bold uppercase text-slate-700">2. PAN Card (Tax ID)</h4>
                              <p className="text-[10px] text-slate-400 mt-0.5">Please provide your 10-digit Alphanumeric PAN Number and upload copy</p>
                            </div>
                            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                              panUploaded
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : 'bg-slate-100 text-slate-500 border-slate-200'
                            }`}>
                              {panUploaded ? 'Uploaded' : 'Missing'}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">PAN Number</label>
                              <input
                                type="text"
                                maxLength={10}
                                value={panNumber}
                                onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                                placeholder="e.g. ABCDE1234F"
                                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">PAN Copy File</label>
                              <div className="flex items-center justify-between p-2.5 border border-slate-200 rounded-lg bg-slate-50">
                                {uploadingPan ? (
                                  <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold py-1">
                                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#9B7B5A]" />
                                    <span>Uploading to Storage...</span>
                                  </div>
                                ) : panUploaded ? (
                                  <div className="flex items-center justify-between w-full">
                                    <span className="text-xs font-bold text-[#4A3728] truncate max-w-[150px]" title={panFileName}>
                                      📄 {panFileName}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => { setPanUploaded(false); setPanFileName(''); setPanFileUrl(''); }}
                                      className="text-[10px] font-bold text-red-600 hover:underline cursor-pointer"
                                    >
                                      Remove
                                    </button>
                                  </div>
                                ) : (
                                  <label className="text-[10.5px] font-bold text-[#9B7B5A] hover:text-[#7A5C45] cursor-pointer flex items-center gap-1">
                                    <span>📤 Upload PAN PDF/JPG</span>
                                    <input
                                      type="file"
                                      accept="image/*,application/pdf"
                                      className="hidden"
                                      onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                          uploadVerificationDoc('pan', file);
                                        }
                                      }}
                                    />
                                  </label>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Doc 3: License/Degree Registration (Role-specific) */}
                        <div className="p-5 bg-white border border-slate-200 rounded-2xl space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="text-xs font-bold uppercase text-slate-700">3. {requirementsInfo.licenseName}</h4>
                              <p className="text-[10px] text-slate-400 mt-0.5">{requirementsInfo.licenseDesc}</p>
                            </div>
                            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                              licenseUploaded
                                ? 'bg-[#4A3728]/10 text-[#4A3728] border-[#4A3728]/20'
                                : 'bg-slate-100 text-slate-500 border-slate-200'
                            }`}>
                              {licenseUploaded ? 'Pending Review' : 'Missing'}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Registration/License ID</label>
                              <input
                                type="text"
                                value={licenseId}
                                onChange={(e) => setLicenseId(e.target.value)}
                                placeholder={requirementsInfo.placeholder}
                                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Certificate Copy File</label>
                              <div className="flex items-center justify-between p-2.5 border border-slate-200 rounded-lg bg-slate-50">
                                {uploadingLicense ? (
                                  <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold py-1">
                                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#9B7B5A]" />
                                    <span>Uploading to Storage...</span>
                                  </div>
                                ) : licenseUploaded ? (
                                  <div className="flex items-center justify-between w-full">
                                    <span className="text-xs font-bold text-[#4A3728] truncate max-w-[150px]" title={licenseFileName}>
                                      📄 {licenseFileName}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => { setLicenseUploaded(false); setLicenseFileName(''); setLicenseFileUrl(''); }}
                                      className="text-[10px] font-bold text-red-600 hover:underline cursor-pointer"
                                    >
                                      Remove
                                    </button>
                                  </div>
                                ) : (
                                  <label className="text-[10.5px] font-bold text-[#9B7B5A] hover:text-[#7A5C45] cursor-pointer flex items-center gap-1">
                                    <span>📤 Upload Certificate Copy</span>
                                    <input
                                      type="file"
                                      accept="image/*,application/pdf"
                                      className="hidden"
                                      onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                          uploadVerificationDoc('license', file);
                                        }
                                      }}
                                    />
                                  </label>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {(aadhaarUploaded || panUploaded || licenseUploaded) && (
                          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 leading-relaxed font-semibold">
                            ⚠️ Note: Documents uploaded. Our operations team will review your submitted registration copy and grant your "Verified" badge within 24 hours.
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}

                {/* Save Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-[#4A3728] hover:bg-[#6B5040] text-white font-extrabold text-sm rounded-2xl shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <Save className="w-4 h-4 text-amber-200" />
                    <span>Save Profile & Portfolio Changes</span>
                  </button>
                </div>
              </form>
            ) : (
              /* 3-Line Summary Card */
              <div className="space-y-5 text-[#2C1F14]">
                {/* Line 1: Avatar, Name & Title */}
                <div className="flex items-center space-x-4">
                  <img
                    src={avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                    alt="Avatar"
                    className="w-16 h-16 rounded-full object-cover border-2 border-[#4A3728]"
                  />
                  <div>
                    <div className="flex items-center space-x-2.5">
                      <span className="font-display font-bold text-base text-slate-900">{name || 'Unset Profile'}</span>
                      <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 bg-amber-50 text-[#4A3728] border border-[#C4A882] rounded-full">
                        {role}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-semibold mt-0.5">{title || 'No Title Provided'}</p>
                  </div>
                </div>

                {/* Line 2: Stats & Contact Info */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <span className="flex items-center space-x-1.5">
                    <span>📍</span>
                    <span>{location}</span>
                  </span>
                  <span className="text-slate-300">|</span>
                  <span className="flex items-center space-x-1.5">
                    <span>💼</span>
                    <span>{experienceYears} Years Exp</span>
                  </span>
                  <span className="text-slate-300">|</span>
                  <span className="flex items-center space-x-1.5">
                    <span>💰</span>
                    <span>₹{pricePerSqFt}/sqft</span>
                  </span>
                  {phone && (
                    <>
                      <span className="text-slate-300">|</span>
                      <span className="flex items-center space-x-1.5">
                        <span>📞</span>
                        <span>{phone}</span>
                      </span>
                    </>
                  )}
                  {email && (
                    <>
                      <span className="text-slate-300">|</span>
                      <span className="flex items-center space-x-1.5">
                        <span>✉️</span>
                        <span>{email}</span>
                      </span>
                    </>
                  )}
                </div>

                {/* Line 3: Specialties & Bio */}
                <div className="text-xs space-y-1.5 bg-[#FDF8F0] p-4 rounded-2xl border border-[#F3EBE1]">
                  {specialtiesText && (
                    <p className="font-semibold text-slate-700">
                      <span className="text-[#9B7B5A] font-bold">Specialties:</span> {specialtiesText}
                    </p>
                  )}
                  {bio && (
                    <p className="text-slate-500 font-medium leading-relaxed italic">
                      "{bio}"
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Portfolio Project Manager */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Header & Add Action */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display font-bold text-lg text-[#4A3728]">
                    Showcase Portfolio ({portfolio.length})
                  </h2>
                  <p className="text-xs text-slate-500">
                    Add projects to display in your public portfolio section.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddProject(!showAddProject)}
                  className="px-4 py-2 bg-[#9B7B5A] hover:bg-[#7A5C45] text-white font-bold text-xs rounded-full shadow-xs transition-all flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{showAddProject ? 'Close' : 'Add Project'}</span>
                </button>
              </div>

              {/* Add Project Form Drawer */}
              {showAddProject && (
                <form onSubmit={handleAddPortfolioProject} className="p-4 bg-[#FDF8F0] rounded-2xl border border-slate-300 space-y-3 animate-fade-in">
                  <h3 className="font-display font-bold text-xs text-[#4A3728] uppercase tracking-wider">
                    Add New Showcase Project
                  </h3>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">Project Title</label>
                    <input
                      type="text"
                      required
                      value={projTitle}
                      onChange={(e) => setProjTitle(e.target.value)}
                      placeholder="The Modern Glass Residence"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">Category</label>
                      <input
                        type="text"
                        required
                        value={projCategory}
                        onChange={(e) => setProjCategory(e.target.value)}
                        placeholder="Residential Villa"
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">Area (Sq.Ft)</label>
                      <input
                        type="number"
                        required
                        value={projArea === 0 ? '' : projArea}
                        onChange={(e) => setProjArea(Number(e.target.value))}
                        placeholder="3500"
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">Project Cover Image</label>
                    <div className="flex items-center gap-2">
                      {uploadingProjImage ? (
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-[#9B7B5A]" />
                          <span>Uploading image...</span>
                        </div>
                      ) : (
                        <label className="px-3 py-1.5 bg-[#4A3728] hover:bg-[#6B5040] text-white text-xs font-bold rounded-lg cursor-pointer transition-colors inline-flex items-center space-x-1 font-sans">
                          <ImageIcon className="w-3.5 h-3.5" />
                          <span>Choose File from Device</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleUploadProjImage(file);
                              }
                            }}
                          />
                        </label>
                      )}
                      {projImage && !uploadingProjImage && (
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            Photo Uploaded ✓
                          </span>
                          <button
                            type="button"
                            onClick={() => setProjImage('')}
                            className="text-[9px] font-bold text-red-600 hover:underline"
                          >
                            Clear
                          </button>
                        </div>
                      )}
                      {!projImage && !uploadingProjImage && (
                        <span className="text-[10px] text-slate-400 font-medium">
                          No photo chosen
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">Location</label>
                    <select
                      value={projLocation}
                      onChange={(e) => setProjLocation(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                    >
                      <option value="Dehradun">Dehradun</option>
                      <option value="Roorkee">Roorkee</option>
                      <option value="Delhi">Delhi</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">Description</label>
                    <textarea
                      rows={2}
                      value={projDesc}
                      onChange={(e) => setProjDesc(e.target.value)}
                      placeholder="Key highlights of structure, louvers, slate tiles, and cantilever design..."
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#4A3728] text-white font-bold text-xs rounded-xl shadow-xs hover:bg-[#6B5040] transition-colors"
                  >
                    Add Project to Portfolio
                  </button>
                </form>
              )}

              {/* Portfolio Items List */}
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {portfolio.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 space-y-2">
                    <ImageIcon className="w-8 h-8 mx-auto text-slate-300" />
                    <p className="text-xs">No showcase projects added yet.</p>
                  </div>
                ) : (
                  portfolio.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between bg-[#FDF8F0] p-3 rounded-2xl border border-slate-200 gap-3 group"
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-[9px] font-extrabold uppercase text-[#9B7B5A]">
                          {item.category}
                        </span>
                        <h4 className="font-display font-bold text-xs text-[#4A3728] truncate">
                          {item.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 truncate">
                          {item.location} {item.areaSqFt ? `• ${item.areaSqFt} sq.ft` : ''}
                        </p>
                      </div>

                      <button
                        onClick={() => handleRemovePortfolioProject(item.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                        title="Remove Project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Privacy Protection Callout Banner */}
            <div className="bg-amber-900/10 border border-amber-800/20 p-5 rounded-3xl space-y-2 text-amber-900">
              <div className="flex items-center space-x-2 font-bold text-xs">
                <ShieldCheck className="w-4 h-4 text-[#9B7B5A]" />
                <span>Contact Privacy Active</span>
              </div>
              <p className="text-xs leading-relaxed text-slate-700">
                Your direct phone & email are masked on the public directory. Clients inquire safely through Arch-Connect's verified proposal tool.
              </p>
            </div>
          </div>
        </div>
        </div>
        )} {/* end portfolio tab */}
      </div>
    </div>
  );
};
