import { Professional, ProjectRequirement, Proposal, ActiveProject } from '../types';

export const INITIAL_PROFESSIONALS: Professional[] = [
  {
    id: 'prof-1',
    name: 'Ar. Ananya Verma',
    role: 'Architects',
    title: 'Principal Architect & Founder, Atelier Verma',
    rating: 4.9,
    reviewCount: 128,
    experienceYears: 14,
    pricePerSqFt: 180,
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCS53da19ANzI9gGTjR_s8eShbFTJw0FnQ-v1JiJrk_Tbxs6A4ZbW_cCa2yZzjeq2AfWuR11c0mSC1yEKGboNmKEF3QwEE8qjSze9hsXLTbU-9t-eubUbGIl78F5OZhQKFbSO82Zx63Bro6AEdSAL8G3i81ZQ-hDeBN2dYmjwc-lp1Y9Tmh6s2TI7ISz42tK_zQG7NERqLTmT6MHnagyBxCxSFKtWUfTrHZGZnl0277NNaYAu5JEKM',
    badge: 'Top Rated',
    location: 'Delhi NCR, India',
    bio: 'Specializing in sustainable luxury villas, modern elevation design, and climate-responsive residential blueprints with passive solar integration.',
    specialties: ['Modern Villas', 'Elevation Architecture', 'Sustainable Blueprinting', 'Biophilic Design'],
    completedProjectsCount: 42,
    phone: '+91 98765 43210',
    email: 'ananya@atelierverma.in',
    portfolio: [
      {
        id: 'port-1',
        title: 'The Modern Terrace Villa',
        category: 'Residential Villa',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        description: 'A 3-story luxury residence featuring slate stone cladding, golden louvers, and expansive teak pergola balconies.',
        areaSqFt: 4500,
        location: 'Dehradun, Uttarakhand, India'
      },
      {
        id: 'port-2',
        title: 'Glasshaus Horizon Retreat',
        category: 'Minimalist Residence',
        image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
        description: 'Cantilevered concrete structure with full-height glazing overlooking valley views.',
        areaSqFt: 3800,
        location: 'Roorkee, Uttarakhand, India'
      }
    ]
  },
  {
    id: 'prof-2',
    name: 'Rohan Kapoor',
    role: 'Interior Designers',
    title: 'Lead Spatial Designer, Kapoor Interiors',
    rating: 4.8,
    reviewCount: 94,
    experienceYears: 11,
    pricePerSqFt: 150,
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDTPrdAS0On6oT1Nd1rJi3fMOBGTdH5PV2R5zCjq-WrC_tp0etHkT8xkJQmFLZXrryYDHKor4rqXkma_G76-NGifVfWoelWaO7nUQaNv9JL7FPtOiDDB3w_6-wrt_DVDNXN8ybLhAz08rzPS2ASeEwmeGoHPTTqF1f-zlPOo18wueyTIF97PqCL9zXPeDFctaxTUWHZdIkZzaL1zGMMK24AzOy2ITLHYYUaOxyuYcaPtaJUEH22uC0',
    badge: 'Master Guild',
    location: 'Dehradun, Uttarakhand, India',
    bio: 'Creating warm minimal spatial luxury with natural oak, Italian marble, warm custom illumination, and custom furniture curation.',
    specialties: ['Minimalist Interiors', 'Custom Woodwork', 'Lighting Curation', 'Open Plan Living'],
    completedProjectsCount: 65,
    phone: '+91 98123 45678',
    email: 'rohan@kapoorinteriors.in',
    portfolio: [
      {
        id: 'port-3',
        title: 'Zenith Loft Living Space',
        category: 'Luxury Interior',
        image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
        description: 'Tactile earthy tones with warm brass accents and bespoke velvet acoustics.',
        areaSqFt: 2900,
        location: 'Delhi NCR, India'
      }
    ]
  },
  {
    id: 'prof-3',
    name: 'Er. Vikram Malhotra',
    role: 'Civil Engineers',
    title: 'Chief Structural Engineer, Malhotra Dynamics',
    rating: 4.95,
    reviewCount: 156,
    experienceYears: 18,
    pricePerSqFt: 90,
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCI3bGY4Y_Hhv8bdTjN0koXT-LVa0C5mb4kKoZ6954epVRXTZRVLAtuE3ti18XLzWGzEcBHr5864HgYhfOPUdN2-E41SIg7HvWXhJpPyIomc7l-TCms_TIAyI3EDqrqV0i4QVkcBXnKs7A9a1Lk79703rinW218Ar84VwSxOflJwaKgwsicKGApKvHF5FdqbOjfAZz4s1fVBJNK-7KLe9K1jEcZn3SjEFGAxC41C0vf-6c_3cZ-5pk',
    badge: 'Verified',
    location: 'Roorkee, Uttarakhand, India',
    bio: 'Expert in reinforced concrete frames, earthquake-resistant foundation engineering, steel pergolas, and deep site grading.',
    specialties: ['Seismic Foundations', 'Post-Tension Slabs', 'Structural Audits', 'Cantilever Engineering'],
    completedProjectsCount: 88,
    phone: '+91 97654 32109',
    email: 'vikram@malhotradynamics.in',
    portfolio: [
      {
        id: 'port-4',
        title: 'Roorkee Canal Hillside Frame',
        category: 'Structural Engineering',
        image: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=1200&q=80',
        description: 'Complex retaining wall and heavy steel cantilever framing for hillside estate.',
        areaSqFt: 5200,
        location: 'Roorkee, Uttarakhand, India'
      }
    ]
  },
  {
    id: 'prof-4',
    name: 'Apex Material Solutions',
    role: 'Material Providers',
    title: 'Direct Supplier for Architectural Stone, Timber & Glass',
    rating: 4.85,
    reviewCount: 210,
    experienceYears: 20,
    pricePerSqFt: 75,
    avatar: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=400&q=80',
    badge: 'Verified',
    location: 'Delhi NCR, India',
    bio: 'Ethically sourced natural slate, treated teak wood panels, low-E triple glazed window systems, and gold anodized aluminum finishes.',
    specialties: ['Natural Slate Cladding', 'Thermally Treated Teak', 'Low-E Architectural Glass', 'Anodized Metals'],
    completedProjectsCount: 310,
    phone: '+91 98989 12345',
    email: 'sales@apexmaterials.in',
    portfolio: [
      {
        id: 'port-5',
        title: 'Premium Villa Cladding & Glass Package',
        category: 'Material Supply',
        image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
        description: 'High durability stone veneer tiles and acoustic double-glazed balcony panels.',
        areaSqFt: 6000,
        location: 'Dehradun, Uttarakhand, India'
      }
    ]
  }
];

export const MOCK_ACTIVE_PROJECT: ActiveProject = {
  id: 'proj-modern-villa',
  name: 'Modern Villa Project',
  clientName: 'Rahul & Priya Sharma',
  location: 'Rajpur Road Enclave, Dehradun, India',
  overallProgress: 75,
  leadArchitect: 'Ar. Ananya Verma',
  leadEngineer: 'Er. Vikram Malhotra',
  interiorDesigner: 'Rohan Kapoor',
  materialSupplier: 'Apex Material Solutions',
  estimatedCompletion: 'October 2026',
  totalBudget: 8500000,
  amountPaid: 6200000,
  milestones: [
    {
      id: 'm-1',
      title: 'Architectural Blueprint & Municipal Approval',
      percentageWeight: 15,
      status: 'Completed',
      targetDate: 'Jan 15, 2026',
      notes: 'Structural drawings and municipal zoning permits cleared.'
    },
    {
      id: 'm-2',
      title: 'Excavation & Deep Soil Foundation',
      percentageWeight: 20,
      status: 'Completed',
      targetDate: 'Mar 10, 2026',
      notes: 'Reinforced pile foundation and retaining walls set.'
    },
    {
      id: 'm-3',
      title: '3-Story Superstructure & Pergola Roof Frame',
      percentageWeight: 25,
      status: 'Completed',
      targetDate: 'May 28, 2026',
      notes: 'Post-tensioned slabs and cantilevered balcony steel ready.'
    },
    {
      id: 'm-4',
      title: 'Exterior Slate Cladding & Low-E Glazing',
      percentageWeight: 15,
      status: 'In Progress',
      targetDate: 'Aug 15, 2026',
      notes: '75% of stone facade installed; window frames fitted.'
    },
    {
      id: 'm-5',
      title: 'Interior Turnkey Finishing & Lighting',
      percentageWeight: 25,
      status: 'Upcoming',
      targetDate: 'Oct 20, 2026',
      notes: 'Teak wood flooring, acoustic panels, and smart lighting system.'
    }
  ],
  sitePhotos: [
    {
      url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
      caption: 'Exterior facade slate tile mounting',
      date: 'July 18, 2026'
    },
    {
      url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=1000&q=80',
      caption: 'Roof pergola structural beam verification',
      date: 'June 30, 2026'
    }
  ]
};

export const MOCK_REQUIREMENTS: ProjectRequirement[] = [
  {
    id: 'req-1',
    title: 'Modern 3-Story Luxury Residence with Teak Pergola',
    category: 'Architects',
    builtUpAreaSqFt: 4200,
    location: 'Dehradun, Uttarakhand, India',
    budgetRange: '₹50 Lakhs - ₹85 Lakhs',
    preferredTimeline: '6 - 9 Months',
    architecturalStyle: 'Modern Contemporary',
    description: 'Looking for a complete architectural design for a 3-level villa featuring dark slate stone accents, wood pergolas, and large balconies.',
    status: 'Open for Bids',
    createdAt: '2 days ago'
  }
];

export const MOCK_PROPOSALS: Proposal[] = [
  {
    id: 'prop-1',
    requirementId: 'req-1',
    professionalId: 'prof-1',
    professionalName: 'Ar. Ananya Verma',
    professionalRole: 'Architects',
    professionalAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCS53da19ANzI9gGTjR_s8eShbFTJw0FnQ-v1JiJrk_Tbxs6A4ZbW_cCa2yZzjeq2AfWuR11c0mSC1yEKGboNmKEF3QwEE8qjSze9hsXLTbU-9t-eubUbGIl78F5OZhQKFbSO82Zx63Bro6AEdSAL8G3i81ZQ-hDeBN2dYmjwc-lp1Y9Tmh6s2TI7ISz42tK_zQG7NERqLTmT6MHnagyBxCxSFKtWUfTrHZGZnl0277NNaYAu5JEKM',
    rating: 4.9,
    priceEstimateTotal: 1850000,
    timelineEstimateMonths: 7,
    keyHighlights: [
      'Full 3D Elevation modeling & Virtual Walkthrough',
      'Passive solar climate modeling',
      'Complete municipal permit package included'
    ],
    scopeBreakdown: [
      { item: 'Conceptual Design & 3D Visuals', cost: 450000 },
      { item: 'Structural Engineering Drawings', cost: 540000 },
      { item: 'MEP & Lighting Design', cost: 400000 },
      { item: 'Site Supervision (10 Visits)', cost: 460000 }
    ],
    status: 'Shortlisted'
  },
  {
    id: 'prop-2',
    requirementId: 'req-1',
    professionalId: 'prof-3',
    professionalName: 'Er. Vikram Malhotra',
    professionalRole: 'Civil Engineers',
    professionalAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCI3bGY4Y_Hhv8bdTjN0koXT-LVa0C5mb4kKoZ6954epVRXTZRVLAtuE3ti18XLzWGzEcBHr5864HgYhfOPUdN2-E41SIg7HvWXhJpPyIomc7l-TCms_TIAyI3EDqrqV0i4QVkcBXnKs7A9a1Lk79703rinW218Ar84VwSxOflJwaKgwsicKGApKvHF5FdqbOjfAZz4s1fVBJNK-7KLe9K1jEcZn3SjEFGAxC41C0vf-6c_3cZ-5pk',
    rating: 4.95,
    priceEstimateTotal: 1650000,
    timelineEstimateMonths: 6,
    keyHighlights: [
      'Turnkey civil foundation & superstructure framing',
      'Seismic strain analysis',
      'On-site quality inspector assigned'
    ],
    scopeBreakdown: [
      { item: 'Foundation & Soil Retaining', cost: 600000 },
      { item: 'Superstructure Concrete Columns', cost: 750000 },
      { item: 'Pergola Steel Integration', cost: 300000 }
    ],
    status: 'Pending'
  }
];
