import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Building2,
  FileCheck,
  Sparkles,
  TrendingUp,
  Plus,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  UserX,
  Clock,
  Target,
  ChevronRight,
  Info,
  Award,
  BookOpen,
  BarChart3,
  Loader2,
  RefreshCw
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
  LabelList
} from 'recharts';
import { Button, ProgressBar, Badge } from '../components/common/UIComponents';
import { fetchAdminDashboardApi } from '../services/api';

// ==================== TYPES ====================
interface DashboardData {
  students: {
    total: number;
    eligible: number;
    profileComplete: number;
    profileIncomplete: number;
    avgProfileStrength: number;
    profileCompleteThreshold: number;
  };
  companies: {
    total: number;
    active: number;
    upcoming: number;
    totalOpenings: number;
  };
  applications: {
    total: number;
    pending: number;
    selected: number;
    rejected: number;
    statusBreakdown: Record<string, number>;
  };
  placements: {
    uniqueStudentsPlaced: number;
    placementPercentage: number;
    denominatorUsed: string;
  };
  recommendations: {
    totalPotentialMatches: number;
    studentsWithRecommendations: number;
    studentsWithoutRecommendations: number;
  };
  skillDistribution: { skill: string; students: number }[];
  applicationFunnel: { status: string; count: number; conversionFromPrev: number | null }[];
  demandedSkills: { skill: string; companyCount: number }[];
  skillGaps: { skill: string; demandedByCompanies: number; studentsWithSkill: number }[];
  topRecruiters: { name: string; id: string; matchingStudents: number; hiringStatus: string; totalOpenings: number }[];
  insights: {
    incompleteProfileStudents: { name: string; email: string; profileStrength: number }[];
    eligibleNotApplied: { name: string; email: string; cgpa: number; profileStrength: number }[];
    studentsWithoutRecommendations: { name: string; email: string; profileStrength: number; reason: string }[];
    pendingApplications: { studentName: string; companyName: string; roleTitle: string; status: string; appliedDate: string }[];
    upcomingDrives: { name: string; hiringStatus: string; deadline: string; openings: number }[];
  };
}

// ==================== CHART COLORS ====================
const FUNNEL_COLORS: Record<string, string> = {
  'Applied': '#6366f1',
  'Assessment': '#8b5cf6',
  'Technical Interview': '#3b82f6',
  'HR': '#06b6d4',
  'Selected': '#10b981',
  'Rejected': '#f43f5e'
};

// ==================== CUSTOM TOOLTIP ====================
const SkillTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900 text-white text-xs rounded-lg px-3 py-2 shadow-xl border border-slate-700">
        <p className="font-semibold mb-0.5">{data.skill}</p>
        <p className="text-slate-300"><span className="font-bold text-white">{data.students}</span> student{data.students !== 1 ? 's' : ''} possess this skill</p>
      </div>
    );
  }
  return null;
};

const FunnelTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900 text-white text-xs rounded-lg px-3 py-2 shadow-xl border border-slate-700">
        <p className="font-semibold mb-0.5">{data.status}</p>
        <p className="text-slate-300"><span className="font-bold text-white">{data.count}</span> application{data.count !== 1 ? 's' : ''}</p>
        {data.conversionFromPrev !== null && (
          <p className="text-slate-400 mt-0.5 text-[11px]">
            {data.conversionFromPrev}% conversion from previous stage
          </p>
        )}
      </div>
    );
  }
  return null;
};

// ==================== KPI CARD ====================
interface KPICardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  highlight?: boolean;
  children: React.ReactNode;
}

const KPICard: React.FC<KPICardProps> = ({ title, value, icon, highlight, children }) => (
  <div className={`bg-white dark:bg-slate-900 border rounded-xl p-5 shadow-subtle transition-all ${highlight ? 'border-indigo-200 dark:border-indigo-900 ring-1 ring-indigo-100 dark:ring-indigo-900/50' : 'border-slate-200/80 dark:border-slate-800'}`}>
    <div className="flex items-center justify-between mb-3">
      <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{title}</span>
      <div className={`p-2 rounded-lg ${highlight ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400' : 'bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400'}`}>
        {icon}
      </div>
    </div>
    <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">{value}</div>
    <div className="space-y-1.5">{children}</div>
  </div>
);

// ==================== INSIGHT CARD ====================
interface InsightCardProps {
  icon: React.ReactNode;
  iconColor: string;
  title: string;
  count: number;
  description: string;
  actionLabel: string;
  actionTo: string;
  items?: { label: string; detail: string }[];
}

const InsightCard: React.FC<InsightCardProps> = ({ icon, iconColor, title, count, description, actionLabel, actionTo, items }) => (
  <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-subtle">
    <div className="flex items-start gap-3 mb-3">
      <div className={`p-2 rounded-lg flex-shrink-0 ${iconColor}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{title}</h4>
          <Badge variant={count > 0 ? 'warning' : 'success'} size="sm">{count}</Badge>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">{description}</p>
      </div>
    </div>

    {items && items.length > 0 && (
      <div className="space-y-1.5 mb-3 max-h-32 overflow-y-auto">
        {items.slice(0, 5).map((item, i) => (
          <div key={i} className="flex items-center justify-between text-xs py-1 px-2 rounded bg-slate-50 dark:bg-slate-800/50">
            <span className="text-slate-700 dark:text-slate-300 truncate mr-2">{item.label}</span>
            <span className="text-slate-500 dark:text-slate-400 flex-shrink-0">{item.detail}</span>
          </div>
        ))}
        {items.length > 5 && (
          <p className="text-[11px] text-slate-400 dark:text-slate-500 pl-2">+{items.length - 5} more</p>
        )}
      </div>
    )}

    <Link
      to={actionTo}
      className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
    >
      {actionLabel}
      <ChevronRight className="w-3.5 h-3.5" />
    </Link>
  </div>
);

// ==================== METRIC ROW ====================
const MetricRow: React.FC<{ label: string; value: string | number; muted?: boolean }> = ({ label, value, muted }) => (
  <div className="flex items-center justify-between text-xs">
    <span className={`${muted ? 'text-slate-400 dark:text-slate-500' : 'text-slate-600 dark:text-slate-400'}`}>{label}</span>
    <span className={`font-semibold ${muted ? 'text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-slate-200'}`}>{value}</span>
  </div>
);

// ==================== MAIN COMPONENT ====================
export const AdminDashboardPage: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchAdminDashboardApi();
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  // ========== Loading State ==========
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        <p className="text-sm text-slate-500 dark:text-slate-400">Loading placement analytics…</p>
      </div>
    );
  }

  // ========== Error State ==========
  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 text-center">
        <div className="p-3 bg-rose-50 dark:bg-rose-950/50 rounded-full">
          <AlertTriangle className="w-7 h-7 text-rose-500" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">Dashboard Unavailable</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">{error || 'Unable to load data.'}</p>
        </div>
        <Button size="sm" variant="primary" onClick={loadDashboard} leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>
          Retry
        </Button>
      </div>
    );
  }

  // ========== Derived values ==========
  const { students, companies, applications, placements, recommendations, skillDistribution, applicationFunnel, skillGaps, topRecruiters, insights } = data;

  // Chart insight text
  const topSkill = skillDistribution[0];
  const topFunnelStage = applicationFunnel.reduce((max, s) => (s.status !== 'Selected' && s.status !== 'Rejected' && s.count > max.count ? s : max), applicationFunnel[0]);

  return (
    <div className="space-y-8 pb-20">
      {/* ===== Top Header ===== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-900 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Placement Officer Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Placement Cell Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time analytics computed from {students.total} registered students, {companies.total} recruiting companies, and {applications.total} logged applications.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={loadDashboard} leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>
            Refresh
          </Button>
          <Link to="/admin/companies">
            <Button size="sm" variant="primary" leftIcon={<Plus className="w-3.5 h-3.5" />}>
              Manage Companies
            </Button>
          </Link>
          <Link to="/admin/students">
            <Button size="sm" variant="outline">
              Student Directory
            </Button>
          </Link>
        </div>
      </div>

      {/* ===== AI Recommendation Engine Status Banner ===== */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 rounded-xl text-xs text-indigo-900 dark:text-indigo-200">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
          <span>
            <strong className="font-semibold">AI Recommendation Engine:</strong> {recommendations.studentsWithRecommendations} of {students.total} students currently matched with eligible company profiles.
            {recommendations.studentsWithoutRecommendations > 0 && (
              <span className="text-indigo-700/80 dark:text-indigo-300/80 ml-1">
                ({recommendations.studentsWithoutRecommendations} student{recommendations.studentsWithoutRecommendations !== 1 ? 's need' : ' needs'} profile completion to activate matching).
              </span>
            )}
          </span>
        </div>
        <Link
          to="/admin/students"
          className="font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 inline-flex items-center gap-1 transition-colors"
        >
          Review Students
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* ===== 4 Summary KPI Cards ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Students */}
        <KPICard title="Total Students" value={students.total} icon={<Users className="w-5 h-5" />}>
          <MetricRow label="Profile complete" value={students.profileComplete} />
          <MetricRow label="Eligible (CGPA + profile)" value={students.eligible} />
          <div className="pt-1.5">
            <ProgressBar
              value={students.avgProfileStrength}
              label="Avg profile strength"
              colorClass={students.avgProfileStrength >= 60 ? 'bg-emerald-500' : 'bg-amber-500'}
              heightClass="h-1.5"
            />
          </div>
        </KPICard>

        {/* Card 2: Companies */}
        <KPICard title="Recruiting Companies" value={companies.total} icon={<Building2 className="w-5 h-5" />}>
          <MetricRow label="Currently hiring" value={companies.active} />
          <MetricRow label="Upcoming drives" value={companies.upcoming} />
          <MetricRow label="Total open positions" value={companies.totalOpenings} />
        </KPICard>

        {/* Card 3: Applications */}
        <KPICard title="Applications" value={applications.total} icon={<FileCheck className="w-5 h-5" />}>
          <MetricRow label="Pending review" value={applications.pending} />
          <MetricRow label="Selected (placed)" value={applications.selected} />
          <MetricRow label="Rejected" value={applications.rejected} />
        </KPICard>

        {/* Card 4: Placements */}
        <KPICard title="Placement Statistics" value={`${placements.placementPercentage}%`} icon={<Award className="w-5 h-5" />} highlight>
          <MetricRow label="Unique students placed" value={placements.uniqueStudentsPlaced} />
          <MetricRow label={`Out of ${students.total} registered`} value="" muted />
          <div className="pt-1.5">
            <ProgressBar
              value={placements.placementPercentage}
              showValue={false}
              colorClass={placements.placementPercentage >= 50 ? 'bg-emerald-500' : 'bg-indigo-500'}
              heightClass="h-1.5"
            />
          </div>
        </KPICard>
      </div>

      {/* ===== Charts Section ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Students by Technical Skill */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-subtle space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                Students by Technical Skill
              </h3>
              <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                {students.total} students
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Number of students who have each skill in their profile. Each bar = count of unique students.
            </p>
          </div>

          {skillDistribution.length > 0 ? (
            <>
              <div className="h-72 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={skillDistribution} margin={{ top: 15, right: 10, left: -20, bottom: 30 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.15} />
                    <XAxis
                      dataKey="skill"
                      tick={{ fontSize: 11, fontFamily: 'Inter, sans-serif' }}
                      angle={-25}
                      textAnchor="end"
                      interval={0}
                    />
                    <YAxis tick={{ fontSize: 11, fontFamily: 'Inter, sans-serif' }} allowDecimals={false} />
                    <RechartsTooltip content={<SkillTooltip />} />
                    <Bar dataKey="students" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={48}>
                      <LabelList dataKey="students" position="top" style={{ fontSize: 10, fontFamily: 'Inter, sans-serif', fill: '#64748b' }} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Chart insight */}
              <div className="flex items-start gap-2 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <Info className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {topSkill ? (
                    <>
                      <strong>{topSkill.skill}</strong> is the most common skill ({topSkill.students} student{topSkill.students !== 1 ? 's' : ''}).
                      {skillDistribution.length > 1 && <> The least common shown is <strong>{skillDistribution[skillDistribution.length - 1].skill}</strong> ({skillDistribution[skillDistribution.length - 1].students}).</>}
                    </>
                  ) : 'No skills data available.'}
                </p>
              </div>
            </>
          ) : (
            <div className="h-48 flex items-center justify-center text-sm text-slate-400">No skill data yet — students need to add skills to their profiles.</div>
          )}
        </div>

        {/* Chart 2: Applications by Recruitment Stage */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-subtle space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                Applications by Recruitment Stage
              </h3>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                {applications.selected} placed
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Each bar shows the number of individual applications at that stage. One student may have multiple applications.
            </p>
          </div>

          {applicationFunnel.length > 0 ? (
            <>
              <div className="h-72 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={applicationFunnel} margin={{ top: 15, right: 10, left: -20, bottom: 30 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.15} />
                    <XAxis
                      dataKey="status"
                      tick={{ fontSize: 11, fontFamily: 'Inter, sans-serif' }}
                      angle={-15}
                      textAnchor="end"
                      interval={0}
                    />
                    <YAxis tick={{ fontSize: 11, fontFamily: 'Inter, sans-serif' }} allowDecimals={false} />
                    <RechartsTooltip content={<FunnelTooltip />} />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={48}>
                      {applicationFunnel.map((entry, idx) => (
                        <Cell key={idx} fill={FUNNEL_COLORS[entry.status] || '#6366f1'} />
                      ))}
                      <LabelList dataKey="count" position="top" style={{ fontSize: 10, fontFamily: 'Inter, sans-serif', fill: '#64748b' }} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Stage conversion summary */}
              <div className="flex items-start gap-2 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <Info className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {applications.total > 0 ? (
                    <>
                      Out of <strong>{applications.total}</strong> total applications, <strong>{applications.selected}</strong> resulted in selections and <strong>{applications.rejected}</strong> were rejected.
                      {applications.pending > 0 && <> <strong>{applications.pending}</strong> are still in progress across various stages.</>}
                    </>
                  ) : 'No applications have been logged yet.'}
                </p>
              </div>
            </>
          ) : (
            <div className="h-48 flex items-center justify-center text-sm text-slate-400">No applications data yet.</div>
          )}
        </div>
      </div>

      {/* ===== Top Recruiters & Skill Gaps ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Recruiters */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-subtle space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                Top Matching Recruiters
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Companies ranked by number of eligible students (CGPA + at least one required skill match)
              </p>
            </div>
            <Link to="/admin/companies" className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex-shrink-0">
              View all
            </Link>
          </div>

          {topRecruiters.length > 0 ? (
            <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {topRecruiters.map((comp, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-bold flex items-center justify-center text-slate-600 dark:text-slate-400 flex-shrink-0">
                      {idx + 1}
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">{comp.name}</span>
                    {comp.hiringStatus === 'Currently Hiring' && (
                      <Badge variant="success" size="sm">Hiring</Badge>
                    )}
                    {comp.hiringStatus === 'Hiring Soon' && (
                      <Badge variant="warning" size="sm">Soon</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400 flex-shrink-0">
                    <span>{comp.matchingStudents} eligible students</span>
                    <span className="text-slate-400">{comp.totalOpenings} openings</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-sm text-slate-400">No recruiter data available.</div>
          )}
        </div>

        {/* Skill Gaps */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-subtle space-y-4">
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              Skill Gap Analysis
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Skills required by recruiters but possessed by fewer than half of registered students
            </p>
          </div>

          {skillGaps.length > 0 ? (
            <div className="space-y-3">
              {skillGaps.map((gap, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{gap.skill}</span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        {gap.studentsWithSkill}/{students.total} students · {gap.demandedByCompanies} companies need this
                      </span>
                    </div>
                    <ProgressBar
                      value={gap.studentsWithSkill}
                      max={students.total}
                      showValue={false}
                      colorClass={gap.studentsWithSkill < students.total * 0.25 ? 'bg-rose-500' : 'bg-amber-500'}
                      heightClass="h-1.5"
                    />
                  </div>
                </div>
              ))}

              <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/50">
                <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
                  {skillGaps.length} skill{skillGaps.length !== 1 ? 's are' : ' is'} in demand by recruiters but under-represented among students. Consider organizing workshops or recommending relevant certifications.
                </p>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center">
              <p className="text-sm text-slate-400">No significant skill gaps detected — students' skills align well with recruiter demands.</p>
            </div>
          )}
        </div>
      </div>

      {/* ===== Placement Insights Section ===== */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Placement Insights</h2>
          <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">— Students & applications needing attention</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Insight 1: Incomplete profiles */}
          <InsightCard
            icon={<UserX className="w-4 h-4" />}
            iconColor="bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400"
            title="Incomplete Profiles"
            count={insights.incompleteProfileStudents.length}
            description="Students with profile strength below 60% — they cannot receive recommendations."
            actionLabel="View Students"
            actionTo="/admin/students"
            items={insights.incompleteProfileStudents.slice(0, 5).map(s => ({
              label: s.name,
              detail: `${s.profileStrength}% complete`
            }))}
          />

          {/* Insight 2: Eligible but not applied */}
          <InsightCard
            icon={<Target className="w-4 h-4" />}
            iconColor="bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400"
            title="Eligible, Not Applied"
            count={insights.eligibleNotApplied.length}
            description="Students with complete profiles who haven't submitted any applications yet."
            actionLabel="View Students"
            actionTo="/admin/students"
            items={insights.eligibleNotApplied.slice(0, 5).map(s => ({
              label: s.name,
              detail: `CGPA ${s.cgpa}`
            }))}
          />

          {/* Insight 3: No recommendations */}
          <InsightCard
            icon={<Sparkles className="w-4 h-4" />}
            iconColor="bg-indigo-100 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400"
            title="No Recommendations"
            count={insights.studentsWithoutRecommendations.length}
            description="Students who can't receive company recommendations due to incomplete profiles."
            actionLabel="View Students"
            actionTo="/admin/students"
            items={insights.studentsWithoutRecommendations.slice(0, 5).map(s => ({
              label: s.name,
              detail: s.reason
            }))}
          />

          {/* Insight 4: Pending applications */}
          <InsightCard
            icon={<Clock className="w-4 h-4" />}
            iconColor="bg-sky-100 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400"
            title="Applications Awaiting Decision"
            count={insights.pendingApplications.length}
            description="Applications still moving through the recruitment pipeline."
            actionLabel="Review Applications"
            actionTo="/admin/students"
            items={insights.pendingApplications.slice(0, 5).map(a => ({
              label: `${a.studentName} → ${a.companyName}`,
              detail: a.status
            }))}
          />

          {/* Insight 5: Upcoming drives */}
          <InsightCard
            icon={<TrendingUp className="w-4 h-4" />}
            iconColor="bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400"
            title="Upcoming Recruitment Drives"
            count={insights.upcomingDrives.length}
            description="Companies that are scheduled to start hiring soon."
            actionLabel="Manage Companies"
            actionTo="/admin/companies"
            items={insights.upcomingDrives.map(d => ({
              label: d.name,
              detail: `${d.openings} openings`
            }))}
          />

          {/* Insight 6: Skill gaps action */}
          <InsightCard
            icon={<BookOpen className="w-4 h-4" />}
            iconColor="bg-purple-100 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400"
            title="In-Demand Skill Gaps"
            count={skillGaps.length}
            description="Skills that companies need but fewer than 50% of students have."
            actionLabel="View Companies"
            actionTo="/admin/companies"
            items={skillGaps.slice(0, 5).map(g => ({
              label: g.skill,
              detail: `${g.studentsWithSkill}/${students.total} students`
            }))}
          />
        </div>
      </div>

      {/* ===== Data Accuracy Footer ===== */}
      <div className="text-center py-4 border-t border-slate-200/60 dark:border-slate-800">
        <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-relaxed max-w-2xl mx-auto">
          All metrics are computed in real-time from the database. "Placement %" uses {placements.denominatorUsed} as the denominator.
          Application counts may include multiple applications per student.
        </p>
      </div>
    </div>
  );
};
