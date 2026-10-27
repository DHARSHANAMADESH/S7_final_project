import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  TrendingUp,
  Bookmark,
  Briefcase,
  ArrowRight,
  ChevronRight,
  RefreshCw,
  FileText
} from 'lucide-react';
import { StatCard, Button, ProgressBar, LoadingSkeleton } from '../components/common/UIComponents';
import { RecommendationCard } from '../components/cards/RecommendationCard';
import {
  useAuthStore,
  useProfileStore,
  useCompanyStore,
  useRecommendationStore,
  useApplicationStore,
  useSavedStore
} from '../store';

export const DashboardPage: React.FC = () => {
  const { currentUser } = useAuthStore();
  const { profile, activityLogs, fetchProfile } = useProfileStore();
  const { companies, fetchCompanies } = useCompanyStore();
  const { recommendations, isLoading, fetchRecommendations, isIncompleteProfile } = useRecommendationStore();
  const { applications, fetchApplications } = useApplicationStore();
  const { savedCompanyIds } = useSavedStore();

  useEffect(() => {
    fetchProfile();
    fetchCompanies();
    fetchRecommendations();
    fetchApplications();
  }, [currentUser?.id]);

  const topRecommendations = recommendations.slice(0, 3);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Derive dynamic skill bars strictly from student's verified profile skills
  const studentSkillItems = profile.skills || [];
  const primarySkills = studentSkillItems.slice(0, 5).map(s => {
    let pct = 75;
    if (s.level === 'Expert') pct = 95;
    else if (s.level === 'Advanced') pct = 88;
    else if (s.level === 'Intermediate') pct = 75;
    else pct = 60;
    return { name: s.name, level: pct, status: s.level };
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Top Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            {getGreeting()}, {profile.name || currentUser?.name || 'Student'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Logged in as <span className="font-semibold text-slate-700 dark:text-slate-300">{currentUser?.email}</span> (CGPA: {profile.cgpa || 'N/A'})
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/recommendations">
            <Button size="sm" variant="primary" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
              View All Matches ({recommendations.length})
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 KPI Metrics Strictly Derived from Live Data */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Profile Strength"
          value={`${profile.profileStrength}%`}
          subtitle={`${(profile.skills || []).length} skills • ${(profile.projects || []).length} projects • ${(profile.certifications || []).length} certs`}
          icon={<TrendingUp className="w-5 h-5" />}
          highlight={profile.profileStrength >= 80}
        />
        <StatCard
          title="Recommended Companies"
          value={recommendations.length}
          subtitle={`${recommendations.filter(r => r.finalScore >= 80).length} high compatibility`}
          icon={<Sparkles className="w-5 h-5" />}
        />
        <StatCard
          title="Saved Companies"
          value={savedCompanyIds.length}
          subtitle="Bookmarked for review"
          icon={<Bookmark className="w-5 h-5" />}
        />
        <StatCard
          title="Applications"
          value={applications.length}
          subtitle={`${applications.filter(a => a.status === 'Selected').length} offers received`}
          icon={<Briefcase className="w-5 h-5" />}
        />
      </div>

      {/* Profile Completion Alert Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-2 flex-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Profile Completion Status
            </span>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
              {profile.profileStrength}%
            </span>
          </div>
          <ProgressBar value={profile.profileStrength} showValue={false} heightClass="h-2.5" />
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {profile.profileStrength < 80
              ? 'Complete your projects section and upload your resume to improve company matching accuracy.'
              : 'Your profile has high technical fidelity and is receiving real-time campus recruitment rankings.'}
          </p>
        </div>

        <Link to="/profile" className="shrink-0">
          <Button variant="outline" size="sm">
            Edit Profile
          </Button>
        </Link>
      </div>

      {/* Main Grid: Top Recommendations & Skill Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Top Recommendations */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white tracking-tight">
                Top Recommendations
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Personalized ranking calculated for {profile.name} (Role: {profile.careerPreferences.preferredRoles[0] || 'Software Engineer'}).
              </p>
            </div>
            <Link
              to="/recommendations"
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>Explore all ({recommendations.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {isLoading ? (
            <LoadingSkeleton count={2} />
          ) : isIncompleteProfile || topRecommendations.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
              <p className="text-xs text-slate-500 mb-3">Complete your profile to generate personalized recommendations.</p>
              <Link to="/profile">
                <Button size="sm" variant="primary">Add Skills & CGPA</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {topRecommendations.map((rec) => (
                <RecommendationCard key={rec.company.id} recommendation={rec} />
              ))}
            </div>
          )}
        </div>

        {/* Right 1 Col: Skill Overview & Activity */}
        <div className="space-y-6">
          {/* Skill Overview Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-subtle">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                Verified Skills ({studentSkillItems.length})
              </h3>
              <Link to="/profile" className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">
                Manage
              </Link>
            </div>

            {primarySkills.length === 0 ? (
              <div className="text-center py-4 px-2">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                  No verified skills added yet.
                </p>
                <Link to="/profile">
                  <Button size="sm" variant="outline" className="w-full text-xs">
                    + Add Skills in Profile
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3.5">
                {primarySkills.map((skill) => (
                  <div key={skill.name}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-slate-800 dark:text-slate-200 truncate">
                        {skill.name}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                        {skill.level}% ({skill.status})
                      </span>
                    </div>
                    <ProgressBar
                      value={skill.level}
                      showValue={false}
                      colorClass="bg-indigo-600 dark:bg-indigo-500"
                    />
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
              <Link
                to="/resume-analyzer"
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center justify-between"
              >
                <span>Upload Resume to Scan Skills</span>
                <FileText className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Recent Activity Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-subtle">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
              Matching Activity
            </h3>

            <div className="space-y-3">
              {activityLogs.slice(0, 4).map((log) => (
                <div key={log.id} className="flex items-start gap-2.5 text-xs">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                  <div className="flex-1">
                    <div className="font-semibold text-slate-800 dark:text-slate-200">
                      {log.title}
                    </div>
                    <div className="text-slate-500 text-[11px] leading-tight">
                      {log.description}
                    </div>
                    <div className="text-slate-400 text-[10px] mt-0.5">
                      {log.timestamp}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
