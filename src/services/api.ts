import {
  StudentProfile,
  Company,
  Application,
  RecommendationResult,
  User,
  UserRole
} from '../types';

const API_BASE = '/api';

export function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('ai_recom_jwt_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}

// ==================== RECOMMENDATIONS API ====================
export interface RecommendationFilterParams {
  search?: string;
  location?: string;
  role?: string;
  minScore?: number;
  hiringStatus?: string;
  sortBy?: string;
}

export interface RecommendationApiResponse {
  status: string;
  message?: string;
  studentId: string;
  studentName?: string;
  studentCgpa?: number;
  totalMatches: number;
  recommendations: RecommendationResult[];
}

export async function fetchRecommendationsApi(
  params?: RecommendationFilterParams
): Promise<RecommendationApiResponse> {
  const query = new URLSearchParams();
  if (params?.search) query.set('search', params.search);
  if (params?.location && params.location !== 'all') query.set('location', params.location);
  if (params?.role && params.role !== 'all') query.set('role', params.role);
  if (params?.minScore) query.set('minScore', params.minScore.toString());
  if (params?.hiringStatus && params.hiringStatus !== 'all') query.set('hiringStatus', params.hiringStatus);
  if (params?.sortBy) query.set('sortBy', params.sortBy);

  const res = await fetch(`${API_BASE}/recommendations?${query.toString()}`, {
    headers: getAuthHeaders()
  });

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error('Unauthorized');
    }
    throw new Error('Failed to fetch recommendations from server');
  }

  return await res.json();
}

// ==================== STUDENT PROFILE API ====================
export async function fetchStudentProfileApi(): Promise<StudentProfile> {
  const res = await fetch(`${API_BASE}/student/profile`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) {
    if (res.status === 401) throw new Error('Unauthorized');
    throw new Error('Failed to fetch student profile');
  }
  return await res.json();
}

export async function updateStudentProfileApi(updates: Partial<StudentProfile>): Promise<StudentProfile> {
  const res = await fetch(`${API_BASE}/student/profile`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(updates)
  });
  if (!res.ok) {
    if (res.status === 401) throw new Error('Unauthorized');
    throw new Error('Failed to update student profile');
  }
  return await res.json();
}

export async function uploadResumeApi(resumeText: string, fileName: string): Promise<any> {
  const res = await fetch(`${API_BASE}/student/resume`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ resumeText, fileName })
  });
  if (!res.ok) {
    if (res.status === 401) throw new Error('Unauthorized');
    throw new Error('Failed to parse resume');
  }
  return await res.json();
}

export async function fetchAdminStudentsApi(): Promise<any[]> {
  const res = await fetch(`${API_BASE}/student/all`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) {
    if (res.status === 401 || res.status === 403) throw new Error('Unauthorized or Forbidden');
    throw new Error('Failed to fetch student directory');
  }
  return await res.json();
}

// ==================== CAREER ASSISTANT API ====================
export interface CareerAssistantResponse {
  text: string;
  action?: {
    label: string;
    link: string;
  };
}

export async function askCareerAssistantApi(prompt: string): Promise<CareerAssistantResponse> {
  const res = await fetch(`${API_BASE}/career-assistant`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ prompt })
  });
  if (!res.ok) {
    if (res.status === 401) throw new Error('Unauthorized');
    throw new Error('Failed to get career guidance');
  }
  return await res.json();
}

// ==================== COMPANIES API ====================
export async function fetchCompaniesApi(): Promise<Company[]> {
  const res = await fetch(`${API_BASE}/companies`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) {
    throw new Error('Failed to fetch companies');
  }
  return await res.json();
}

export async function createCompanyApi(companyData: Partial<Company>): Promise<Company> {
  const res = await fetch(`${API_BASE}/companies`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(companyData)
  });
  if (!res.ok) {
    if (res.status === 403) throw new Error('Forbidden: Admin access required');
    throw new Error('Failed to create company');
  }
  return await res.json();
}

export async function updateCompanyApi(id: string, updates: Partial<Company>): Promise<Company> {
  const res = await fetch(`${API_BASE}/companies/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(updates)
  });
  if (!res.ok) {
    if (res.status === 403) throw new Error('Forbidden: Admin access required');
    throw new Error('Failed to update company');
  }
  return await res.json();
}

export async function deleteCompanyApi(id: string): Promise<boolean> {
  const res = await fetch(`${API_BASE}/companies/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  if (!res.ok) {
    if (res.status === 403) throw new Error('Forbidden: Admin access required');
    throw new Error('Failed to delete company');
  }
  return res.ok;
}

// ==================== APPLICATIONS API ====================
export async function fetchApplicationsApi(): Promise<Application[]> {
  const res = await fetch(`${API_BASE}/applications`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) {
    if (res.status === 401) throw new Error('Unauthorized');
    throw new Error('Failed to fetch applications');
  }
  return await res.json();
}

export async function createApplicationApi(payload: {
  companyId: string;
  roleId?: string;
  matchScore?: number;
  notes?: string;
}): Promise<Application> {
  const res = await fetch(`${API_BASE}/applications`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    if (res.status === 401) throw new Error('Unauthorized');
    throw new Error('Failed to create application');
  }
  return await res.json();
}

export async function updateApplicationApi(id: string, updates: Partial<Application>): Promise<Application> {
  const res = await fetch(`${API_BASE}/applications/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(updates)
  });
  if (!res.ok) {
    if (res.status === 401 || res.status === 403) throw new Error('Unauthorized or Forbidden');
    throw new Error('Failed to update application');
  }
  return await res.json();
}

export async function deleteApplicationApi(id: string): Promise<boolean> {
  const res = await fetch(`${API_BASE}/applications/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  if (!res.ok) {
    if (res.status === 401 || res.status === 403) throw new Error('Unauthorized or Forbidden');
    throw new Error('Failed to delete application');
  }
  return res.ok;
}

export async function fetchSavedCompaniesApi(): Promise<string[]> {
  const res = await fetch(`${API_BASE}/applications/saved/list`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) {
    if (res.status === 401) throw new Error('Unauthorized');
    throw new Error('Failed to fetch saved companies');
  }
  return await res.json();
}

export async function toggleSavedCompanyApi(companyId: string): Promise<{ isSaved: boolean; savedIds: string[] }> {
  const res = await fetch(`${API_BASE}/applications/saved/${companyId}`, {
    method: 'POST',
    headers: getAuthHeaders()
  });
  if (!res.ok) {
    if (res.status === 401) throw new Error('Unauthorized');
    throw new Error('Failed to toggle saved company');
  }
  return await res.json();
}

// ==================== AUTH API ====================
export async function loginApi(email: string, password?: string, role?: UserRole): Promise<any> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, role })
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || 'Login failed. Please check your credentials.');
  }
  const data = await res.json();
  if (data.token) {
    localStorage.setItem('ai_recom_jwt_token', data.token);
  }
  return data;
}

export async function signupApi(name: string, email: string, password?: string, role: UserRole = 'student'): Promise<any> {
  const res = await fetch(`${API_BASE}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, role })
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || 'Signup failed.');
  }
  const data = await res.json();
  if (data.token) {
    localStorage.setItem('ai_recom_jwt_token', data.token);
  }
  return data;
}

export async function fetchMeApi(): Promise<any> {
  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) {
    throw new Error('Session invalid or expired');
  }
  return await res.json();
}

// ==================== ADMIN DASHBOARD API ====================
export async function fetchAdminDashboardApi(): Promise<any> {
  const res = await fetch(`${API_BASE}/admin/dashboard`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) {
    if (res.status === 401 || res.status === 403) throw new Error('Unauthorized or Forbidden');
    throw new Error('Failed to fetch admin dashboard data');
  }
  return await res.json();
}
