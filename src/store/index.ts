import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  User,
  UserRole,
  StudentProfile,
  Company,
  Application,
  ApplicationStatus,
  RecommendationResult,
  ActivityLog,
  SkillItem,
  ProjectItem,
  CertificationItem
} from '../types';
import {
  fetchRecommendationsApi,
  fetchStudentProfileApi,
  updateStudentProfileApi,
  fetchCompaniesApi,
  createCompanyApi,
  updateCompanyApi,
  deleteCompanyApi,
  fetchApplicationsApi,
  createApplicationApi,
  updateApplicationApi,
  deleteApplicationApi,
  fetchSavedCompaniesApi,
  toggleSavedCompanyApi,
  loginApi,
  signupApi,
  fetchMeApi,
  RecommendationFilterParams
} from '../services/api';
import { calculateProfileStrength } from '../utils/recommendationEngine';

// Clean initial empty profile (No fake or mock data)
export const EMPTY_STUDENT_PROFILE: StudentProfile = {
  id: '',
  userId: '',
  name: '',
  email: '',
  phone: '',
  location: '',
  college: '',
  degree: '',
  department: '',
  cgpa: 0,
  graduationYear: 2026,
  skills: [],
  programmingLanguages: [],
  certifications: [],
  projects: [],
  careerPreferences: {
    preferredRoles: [],
    preferredLocations: [],
    experienceLevel: 'Fresher / Entry-level',
    careerInterests: [],
    minSalaryLPA: 0
  },
  softSkills: {
    aptitudeScore: 80,
    communicationScore: 80
  },
  resumeFileName: '',
  resumeScore: 0,
  profileStrength: 0
};

// ==================== AUTH STORE ====================
interface AuthState {
  currentUser: User | null;
  isAuthenticated: boolean;
  token: string | null;
  login: (email: string, password?: string, role?: UserRole) => Promise<boolean>;
  signup: (name: string, email: string, password?: string, role?: UserRole) => Promise<boolean>;
  checkAuth: () => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      isAuthenticated: false,
      token: null,

      login: async (email: string, password?: string, role: UserRole = 'student') => {
        try {
          const res = await loginApi(email, password, role);
          set({
            currentUser: res.user,
            isAuthenticated: true,
            token: res.token
          });

          if (res.profile) {
            useProfileStore.getState().setProfile(res.profile);
          }
          return true;
        } catch (e: any) {
          throw new Error(e.message || 'Login failed.');
        }
      },

      signup: async (name: string, email: string, password?: string, role: UserRole = 'student') => {
        try {
          const res = await signupApi(name, email, password, role);
          set({
            currentUser: res.user,
            isAuthenticated: true,
            token: res.token
          });

          if (res.profile) {
            useProfileStore.getState().setProfile(res.profile);
          }
          return true;
        } catch (e: any) {
          throw new Error(e.message || 'Signup failed.');
        }
      },

      checkAuth: async () => {
        const token = localStorage.getItem('ai_recom_jwt_token');
        if (!token) {
          set({ currentUser: null, isAuthenticated: false, token: null });
          return false;
        }
        try {
          const res = await fetchMeApi();
          set({
            currentUser: res.user,
            isAuthenticated: true,
            token
          });
          if (res.profile) {
            useProfileStore.getState().setProfile(res.profile);
          }
          return true;
        } catch (e) {
          localStorage.removeItem('ai_recom_jwt_token');
          set({ currentUser: null, isAuthenticated: false, token: null });
          return false;
        }
      },

      logout: () => {
        localStorage.removeItem('ai_recom_jwt_token');
        localStorage.removeItem('ai_recom_auth_store');
        localStorage.removeItem('ai_recom_profile_store');
        localStorage.removeItem('ai_recom_applications_store');
        localStorage.removeItem('ai_recom_saved_store');

        set({ currentUser: null, isAuthenticated: false, token: null });
        useProfileStore.getState().setProfile(EMPTY_STUDENT_PROFILE);
        useApplicationStore.setState({ applications: [] });
        useSavedStore.setState({ savedCompanyIds: [] });
      }
    }),
    { name: 'ai_recom_auth_store' }
  )
);

// ==================== PROFILE STORE ====================
interface ProfileState {
  profile: StudentProfile;
  isLoading: boolean;
  activityLogs: ActivityLog[];
  setProfile: (profile: StudentProfile) => void;
  fetchProfile: () => Promise<void>;
  updateProfile: (updates: Partial<StudentProfile>) => Promise<void>;
  addSkill: (skill: SkillItem) => Promise<void>;
  removeSkill: (skillName: string) => Promise<void>;
  addProject: (project: ProjectItem) => Promise<void>;
  removeProject: (projectId: string) => Promise<void>;
  addCertification: (cert: CertificationItem) => Promise<void>;
  removeCertification: (certId: string) => Promise<void>;
  logActivity: (type: ActivityLog['type'], title: string, description: string) => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      profile: EMPTY_STUDENT_PROFILE,
      isLoading: false,
      activityLogs: [],

      setProfile: (profile) => {
        profile.profileStrength = calculateProfileStrength(profile);
        set({ profile });
      },

      fetchProfile: async () => {
        set({ isLoading: true });
        try {
          const data = await fetchStudentProfileApi();
          if (data) {
            data.profileStrength = calculateProfileStrength(data);
            set({ profile: data, isLoading: false });
          }
        } catch (e) {
          set({ isLoading: false });
        }
      },

      updateProfile: async (updates) => {
        const current = get().profile;
        const newProfile = { ...current, ...updates };
        newProfile.profileStrength = calculateProfileStrength(newProfile);
        set({ profile: newProfile });

        try {
          const saved = await updateStudentProfileApi(updates);
          if (saved) {
            saved.profileStrength = calculateProfileStrength(saved);
            set({ profile: saved });
          }
        } catch (e) {
          // Keep local optimistic updates
        }
      },

      addSkill: async (skill) => {
        const current = get().profile;
        if (current.skills.some(s => s.name.toLowerCase() === skill.name.toLowerCase())) {
          return;
        }
        const updatedSkills = [...current.skills, skill];
        await get().updateProfile({ skills: updatedSkills });
      },

      removeSkill: async (skillName) => {
        const current = get().profile;
        const updatedSkills = current.skills.filter(
          s => s.name.toLowerCase() !== skillName.toLowerCase()
        );
        await get().updateProfile({ skills: updatedSkills });
      },

      addProject: async (project) => {
        const current = get().profile;
        const updatedProjects = [project, ...current.projects];
        await get().updateProfile({ projects: updatedProjects });
      },

      removeProject: async (projectId) => {
        const current = get().profile;
        const updated = current.projects.filter(p => p.id !== projectId);
        await get().updateProfile({ projects: updated });
      },

      addCertification: async (cert) => {
        const current = get().profile;
        const updated = [cert, ...current.certifications];
        await get().updateProfile({ certifications: updated });
      },

      removeCertification: async (certId) => {
        const current = get().profile;
        const updated = current.certifications.filter(c => c.id !== certId);
        await get().updateProfile({ certifications: updated });
      },

      logActivity: (type, title, description) => {
        const newLog: ActivityLog = {
          id: `act-${Date.now()}`,
          type,
          title,
          description,
          timestamp: 'Just now'
        };
        set((state) => ({
          activityLogs: [newLog, ...state.activityLogs.slice(0, 15)]
        }));
      }
    }),
    { name: 'ai_recom_profile_store' }
  )
);

// ==================== COMPANY STORE ====================
interface CompanyState {
  companies: Company[];
  isLoading: boolean;
  fetchCompanies: () => Promise<void>;
  addCompany: (company: Partial<Company>) => Promise<Company>;
  updateCompany: (id: string, updates: Partial<Company>) => Promise<void>;
  deleteCompany: (id: string) => Promise<void>;
  toggleHiringStatus: (id: string, status: Company['hiringStatus']) => Promise<void>;
}

export const useCompanyStore = create<CompanyState>()(
  persist(
    (set, get) => ({
      companies: [],
      isLoading: false,

      fetchCompanies: async () => {
        set({ isLoading: true });
        try {
          const list = await fetchCompaniesApi();
          if (list && Array.isArray(list)) {
            set({ companies: list, isLoading: false });
          } else {
            set({ isLoading: false });
          }
        } catch (e) {
          set({ isLoading: false });
        }
      },

      addCompany: async (companyData) => {
        const created = await createCompanyApi(companyData);
        set((state) => ({ companies: [created, ...state.companies] }));
        return created;
      },

      updateCompany: async (id, updates) => {
        set((state) => ({
          companies: state.companies.map(c => c.id === id ? { ...c, ...updates } : c)
        }));
        await updateCompanyApi(id, updates);
      },

      deleteCompany: async (id) => {
        set((state) => ({
          companies: state.companies.filter(c => c.id !== id)
        }));
        await deleteCompanyApi(id);
      },

      toggleHiringStatus: async (id, status) => {
        await get().updateCompany(id, { hiringStatus: status });
      }
    }),
    { name: 'ai_recom_company_store' }
  )
);

// ==================== RECOMMENDATION STORE (DYNAMIC & BACKEND DRIVEN) ====================
export interface FilterState {
  searchQuery: string;
  selectedLocation: string;
  selectedRole: string;
  minMatchScore: number;
  selectedHiringStatus: string;
  sortBy: 'match_desc' | 'salary_desc' | 'cgpa_asc' | 'name_asc';
}

interface RecommendationState {
  recommendations: RecommendationResult[];
  isLoading: boolean;
  loadingMessage: string;
  error: string | null;
  isIncompleteProfile: boolean;
  totalMatches: number;
  filters: FilterState;
  setFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  resetFilters: () => void;
  fetchRecommendations: () => Promise<void>;
}

const defaultFilters: FilterState = {
  searchQuery: '',
  selectedLocation: 'all',
  selectedRole: 'all',
  minMatchScore: 0,
  selectedHiringStatus: 'all',
  sortBy: 'match_desc'
};

export const useRecommendationStore = create<RecommendationState>((set, get) => ({
  recommendations: [],
  isLoading: false,
  loadingMessage: 'Analyzing your profile...',
  error: null,
  isIncompleteProfile: false,
  totalMatches: 0,
  filters: defaultFilters,

  setFilter: (key, value) => {
    set((state) => ({
      filters: { ...state.filters, [key]: value }
    }));
    get().fetchRecommendations();
  },

  resetFilters: () => {
    set({ filters: defaultFilters });
    get().fetchRecommendations();
  },

  fetchRecommendations: async () => {
    const { filters } = get();
    set({
      isLoading: true,
      error: null,
      loadingMessage: 'Analyzing your skills & profile from database...'
    });

    try {
      const apiParams: RecommendationFilterParams = {
        search: filters.searchQuery,
        location: filters.selectedLocation,
        role: filters.selectedRole,
        minScore: filters.minMatchScore,
        hiringStatus: filters.selectedHiringStatus,
        sortBy: filters.sortBy
      };

      const res = await fetchRecommendationsApi(apiParams);

      if (res.status === 'incomplete_profile') {
        set({
          recommendations: [],
          isIncompleteProfile: true,
          totalMatches: 0,
          isLoading: false
        });
        return;
      }

      set({
        recommendations: res.recommendations || [],
        totalMatches: res.totalMatches || (res.recommendations ? res.recommendations.length : 0),
        isIncompleteProfile: false,
        isLoading: false
      });
    } catch (err: any) {
      if (err.message === 'Unauthorized') {
        set({
          recommendations: [],
          isLoading: false,
          error: 'Please log in to view recommendations.'
        });
        return;
      }

      set({
        recommendations: [],
        isIncompleteProfile: true,
        totalMatches: 0,
        isLoading: false,
        error: 'Unable to load recommendations. Please check your profile.'
      });
    }
  }
}));

// ==================== APPLICATION STORE ====================
interface ApplicationState {
  applications: Application[];
  isLoading: boolean;
  fetchApplications: () => Promise<void>;
  applyToCompany: (
    company: Company,
    roleId?: string,
    matchScore?: number,
    notes?: string
  ) => Promise<Application>;
  updateApplicationStatus: (id: string, status: ApplicationStatus) => Promise<void>;
  updateApplicationNotes: (id: string, notes: string, nextRoundDate?: string) => Promise<void>;
  deleteApplication: (id: string) => Promise<void>;
  hasApplied: (companyId: string) => boolean;
}

export const useApplicationStore = create<ApplicationState>()(
  persist(
    (set, get) => ({
      applications: [],
      isLoading: false,

      fetchApplications: async () => {
        set({ isLoading: true });
        try {
          const apps = await fetchApplicationsApi();
          if (apps) {
            set({ applications: apps, isLoading: false });
          }
        } catch (e) {
          set({ isLoading: false });
        }
      },

      applyToCompany: async (company, roleId, matchScore = 85, notes = '') => {
        const created = await createApplicationApi({
          companyId: company.id,
          roleId,
          matchScore,
          notes
        });
        set((state) => ({ applications: [created, ...state.applications] }));
        return created;
      },

      updateApplicationStatus: async (id, status) => {
        set((state) => ({
          applications: state.applications.map(a =>
            a.id === id ? { ...a, status, lastUpdated: new Date().toISOString().split('T')[0] } : a
          )
        }));
        await updateApplicationApi(id, { status });
      },

      updateApplicationNotes: async (id, notes, nextRoundDate) => {
        set((state) => ({
          applications: state.applications.map(a =>
            a.id === id ? { ...a, notes, nextRoundDate, lastUpdated: new Date().toISOString().split('T')[0] } : a
          )
        }));
        await updateApplicationApi(id, { notes, nextRoundDate });
      },

      deleteApplication: async (id) => {
        set((state) => ({
          applications: state.applications.filter(a => a.id !== id)
        }));
        await deleteApplicationApi(id);
      },

      hasApplied: (companyId) => {
        return get().applications.some(a => a.companyId === companyId);
      }
    }),
    { name: 'ai_recom_applications_store' }
  )
);

// ==================== SAVED COMPANIES STORE ====================
interface SavedState {
  savedCompanyIds: string[];
  fetchSavedCompanies: () => Promise<void>;
  toggleSaveCompany: (id: string) => Promise<boolean>;
  isSaved: (id: string) => boolean;
}

export const useSavedStore = create<SavedState>()(
  persist(
    (set, get) => ({
      savedCompanyIds: [],

      fetchSavedCompanies: async () => {
        try {
          const ids = await fetchSavedCompaniesApi();
          if (ids) {
            set({ savedCompanyIds: ids });
          }
        } catch (e) {
          // ignore
        }
      },

      toggleSaveCompany: async (id: string) => {
        const current = get().savedCompanyIds;
        const exists = current.includes(id);
        const next = exists ? current.filter(item => item !== id) : [...current, id];
        set({ savedCompanyIds: next });

        try {
          const res = await toggleSavedCompanyApi(id);
          if (res && res.savedIds) {
            set({ savedCompanyIds: res.savedIds });
          }
        } catch (e) {
          // keep optimistic
        }
        return !exists;
      },

      isSaved: (id: string) => {
        return get().savedCompanyIds.includes(id);
      }
    }),
    { name: 'ai_recom_saved_store' }
  )
);

// ==================== THEME STORE ====================
interface ThemeState {
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      isDark: false,
      toggleTheme: () => set((s) => {
        const next = !s.isDark;
        if (next) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        return { isDark: next };
      }),
      setTheme: (isDark) => {
        if (isDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        set({ isDark });
      }
    }),
    { name: 'ai_recom_theme_store' }
  )
);
