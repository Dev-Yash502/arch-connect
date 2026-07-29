export type ProfessionalCategory = 'Architect' | 'Interior Designer' | 'Civil Engineer' | 'Material Provider';

export type UserRole = 'client' | 'professional' | 'admin';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  joinedAt: string;
  avatar?: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  image: string;
  description: string;
  areaSqFt?: number;
  location?: string;
}

export interface Professional {
  id: string;
  name: string;
  role: ProfessionalCategory;
  title: string;
  rating: number;
  reviewCount: number;
  experienceYears: number;
  pricePerSqFt: number; // e.g. ₹180/sqft
  avatar: string;
  badge?: 'Verified' | 'Top Rated' | 'Master Guild';
  location: string;
  bio: string;
  specialties: string[];
  portfolio: PortfolioItem[];
  phone: string;
  email: string;
  completedProjectsCount: number;
}

export interface ProjectRequirement {
  id: string;
  title: string;
  category: ProfessionalCategory | 'All-in-One Turnkey';
  builtUpAreaSqFt: number;
  location: string;
  budgetRange: string;
  preferredTimeline: string;
  architecturalStyle: string;
  description: string;
  status: 'Open for Bids' | 'Matched' | 'Under Review' | 'Completed';
  ownerId?: string;
  createdAt: string;
}

export interface Proposal {
  id: string;
  requirementId: string;
  professionalId: string;
  professionalName: string;
  professionalRole: ProfessionalCategory;
  professionalAvatar: string;
  rating: number;
  priceEstimateTotal: number;
  timelineEstimateMonths: number;
  keyHighlights: string[];
  scopeBreakdown: { item: string; cost: number }[];
  status: 'Pending' | 'Accepted' | 'Shortlisted';
  ratingEnabled?: boolean;
}

export interface CostEstimateInput {
  areaSqFt: number;
  category: 'Architectural Blueprint' | 'Turnkey Interior' | 'Civil Construction' | 'Material Package' | 'Complete Villa';
  qualityLevel: 'Standard' | 'Premium' | 'Luxury';
  locationTier: 'Delhi NCR' | 'Dehradun' | 'Roorkee';
  numberOfFloors: number;
}

export interface ProjectMilestone {
  id: string;
  title: string;
  percentageWeight: number;
  status: 'Completed' | 'In Progress' | 'Upcoming';
  targetDate: string;
  notes?: string;
}

export interface ActiveProject {
  id: string;
  name: string;
  clientName: string;
  location: string;
  overallProgress: number;
  leadArchitect: string;
  leadEngineer: string;
  interiorDesigner: string;
  materialSupplier: string;
  estimatedCompletion: string;
  totalBudget: number;
  amountPaid: number;
  milestones: ProjectMilestone[];
  sitePhotos: { url: string; caption: string; date: string }[];
}
