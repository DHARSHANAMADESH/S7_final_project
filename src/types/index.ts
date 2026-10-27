export type UserRole = 'student' | 'recruiter' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
}

export interface SkillItem {
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  category?: 'Language' | 'Framework' | 'Database' | 'Tool' | 'Cloud' | 'Core CS';
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  year: string;
  credentialUrl?: string;
}

export interface CareerPreferences {
  preferredRoles: string[];
  preferredLocations: string[];
  experienceLevel: 'Fresher / Entry-level' | '0-1 Year' | '1-2 Years' | 'Internship';
  careerInterests: string[];
  minSalaryLPA: number;
}

export interface SoftSkills {
  aptitudeScore: number; // 0 to 100
  communicationScore: number; // 0 to 100
}

export interface StudentProfile {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  avatarUrl?: string;
  
  // Academic
  college: string;
  degree: string;
  department: string;
  cgpa: number; // e.g. 8.4
  graduationYear: number;

  // Technical
  skills: SkillItem[];
  programmingLanguages: string[];
  certifications: CertificationItem[];
  projects: ProjectItem[];

  // Preferences & Soft Skills
  careerPreferences: CareerPreferences;
  softSkills: SoftSkills;

  // Resume status
  resumeFileName?: string;
  resumeScore?: number;
  resumeLastAnalyzed?: string;

  // Computed strength
  profileStrength: number;
}

export interface JobRole {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'Full-time' | 'Internship' | 'Contract';
  salary: string; // e.g. "₹6–10 LPA"
  minLPA: number;
  maxLPA: number;
  openings: number;
  requirements: string[];
}

export interface HiringRound {
  step: number;
  title: string;
  description: string;
}

export interface Company {
  id: string;
  name: string;
  logo: string;
  industry: string;
  description: string;
  website: string;
  headquarters: string;
  locations: string[];
  salaryDisplay: string; // e.g. "₹6–10 LPA"
  minLPA: number;
  maxLPA: number;
  requiredSkills: string[];
  preferredSkills: string[];
  minimumCgpa: number;
  openRoles: JobRole[];
  hiringStatus: 'Currently Hiring' | 'Hiring Soon' | 'Off-Campus' | 'Closed';
  hiringProcess: HiringRound[];
  benefits: string[];
  techStack: string[];
  companySize: string;
  applicationDeadline: string;
  rating: number;
  tier: 'Dream / Tier-1' | 'Tier-2' | 'Core IT / Mass';
}

export interface RecommendationBreakdown {
  skillScore: number;       // 30% weight
  cgpaScore: number;        // 15% weight
  roleScore: number;        // 15% weight
  locationScore: number;    // 10% weight
  projectScore: number;     // 10% weight
  certificationScore: number; // 5% weight
  experienceScore: number;  // 5% weight
  aptitudeScore: number;    // 5% weight
  communicationScore: number; // 5% weight
}

export interface PreparationPlanStep {
  step: number;
  action: string;
  details: string;
  estimatedTime: string;
  completed?: boolean;
}

export interface RecommendationResult {
  company: Company;
  targetRole: JobRole;
  finalScore: number; // 0 to 100
  breakdown: RecommendationBreakdown;
  matchedSkills: string[];
  missingSkills: string[];
  cgpaEligible: boolean;
  explanation: {
    summary: string;
    strengths: string[];
    reasons: string[];
    gaps: string[];
  };
  preparationPlan: PreparationPlanStep[];
}

export type ApplicationStatus =
  | 'Applied'
  | 'Assessment'
  | 'Technical Interview'
  | 'HR'
  | 'Selected'
  | 'Rejected';

export interface Application {
  id: string;
  studentId: string;
  studentName: string;
  companyId: string;
  companyName: string;
  companyLogo: string;
  roleId: string;
  roleTitle: string;
  status: ApplicationStatus;
  appliedDate: string;
  lastUpdated: string;
  matchScore: number;
  salary: string;
  location: string;
  notes?: string;
  nextRoundDate?: string;
}

export interface SkillGapItem {
  skill: string;
  importance: 'High' | 'Medium' | 'Low';
  reason: string;
}

export interface SuggestionItem {
  category: string;
  suggestion: string;
  impact: 'High' | 'Medium';
}

export interface ResumeAnalysis {
  score: number;
  detectedSkills: string[];
  detectedEducation: {
    degree: string;
    institution: string;
    cgpa?: string;
    graduationYear?: string;
  };
  detectedProjectsCount: number;
  detectedProjects: { title: string; summary: string; tech: string[] }[];
  detectedCertificationsCount: number;
  detectedCertifications: string[];
  skillGaps: SkillGapItem[];
  suggestions: SuggestionItem[];
  extractedTextSample?: string;
}

export interface ActivityLog {
  id: string;
  type: 'resume' | 'recommendation' | 'application' | 'profile' | 'save';
  title: string;
  description: string;
  timestamp: string;
}

export interface PlacementStats {
  totalStudents: number;
  totalCompanies: number;
  totalApplications: number;
  recommendationsGenerated: number;
  averageMatchScore: number;
  placedStudentsCount: number;
}
