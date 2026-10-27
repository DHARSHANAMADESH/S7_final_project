import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, RotateCcw, UserX, AlertCircle, RefreshCw } from 'lucide-react';
import { RecommendationCard } from '../components/cards/RecommendationCard';
import { EmptyState, Button, LoadingSkeleton } from '../components/common/UIComponents';
import {
  useRecommendationStore,
  useCompanyStore,
  useProfileStore,
  useAuthStore
} from '../store';

export const RecommendationsPage: React.FC = () => {
  const {
    recommendations,
    isLoading,
    loadingMessage,
    isIncompleteProfile,
    totalMatches,
    filters,
    setFilter,
    resetFilters,
    fetchRecommendations
  } = useRecommendationStore();

  const { companies, fetchCompanies } = useCompanyStore();
  const { profile } = useProfileStore();
  const { currentUser } = useAuthStore();

  useEffect(() => {
    fetchCompanies();
    fetchRecommendations();
  }, [currentUser?.id, profile.skills?.length, profile.cgpa, profile.careerPreferences?.preferredRoles]);

  // Unique filter options extracted dynamically
  const allLocations = Array.from(new Set(companies.flatMap(c => c.locations || []))).sort();
  const allRoles = Array.from(new Set(companies.flatMap(c => (c.openRoles || []).map(r => r.title)))).sort();

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              Recommended Companies
            </h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              Live Verified Matches: {recommendations.length}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Companies ranked strictly according to your authenticated profile compatibility ({profile.name || currentUser?.name || 'Student'}).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => fetchRecommendations()}
            leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />}
          >
            Recalculate Matches
          </Button>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-subtle space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => setFilter('searchQuery', e.target.value)}
            placeholder="Search by company name, role, or required skill (e.g. Zoho, Java, React)..."
            className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Location
            </label>
            <select
              value={filters.selectedLocation}
              onChange={(e) => setFilter('selectedLocation', e.target.value)}
              className="w-full text-xs py-2 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Locations</option>
              {allLocations.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Role
            </label>
            <select
              value={filters.selectedRole}
              onChange={(e) => setFilter('selectedRole', e.target.value)}
              className="w-full text-xs py-2 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Roles</option>
              {allRoles.map((role) => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Min Match %
            </label>
            <select
              value={filters.minMatchScore}
              onChange={(e) => setFilter('minMatchScore', Number(e.target.value))}
              className="w-full text-xs py-2 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500"
            >
              <option value={0}>Any Match %</option>
              <option value={80}>80%+ High Match</option>
              <option value={85}>85%+ Strong Match</option>
              <option value={90}>90%+ Top Tier Match</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Hiring Status
            </label>
            <select
              value={filters.selectedHiringStatus}
              onChange={(e) => setFilter('selectedHiringStatus', e.target.value)}
              className="w-full text-xs py-2 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Statuses</option>
              <option value="Currently Hiring">Currently Hiring</option>
              <option value="Hiring Soon">Hiring Soon</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Sort By
            </label>
            <select
              value={filters.sortBy}
              onChange={(e) => setFilter('sortBy', e.target.value as any)}
              className="w-full text-xs py-2 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 font-medium"
            >
              <option value="match_desc">Highest Match %</option>
              <option value="salary_desc">Highest Package (CTC)</option>
              <option value="cgpa_asc">Lowest CGPA Cutoff</option>
              <option value="name_asc">Company Name (A-Z)</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-1">
          <button
            type="button"
            onClick={resetFilters}
            className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Filters</span>
          </button>
        </div>
      </div>

      {/* Main Recommendations Content */}
      {isLoading ? (
        <div className="space-y-4 py-8 text-center">
          <div className="inline-flex items-center gap-2 p-3 px-5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-xs font-semibold text-indigo-700 dark:text-indigo-300 animate-pulse">
            <RefreshCw className="w-4 h-4 text-indigo-600 animate-spin" />
            <span>{loadingMessage}</span>
          </div>
          <LoadingSkeleton count={3} />
        </div>
      ) : isIncompleteProfile ? (
        <EmptyState
          icon={<UserX className="w-10 h-10 text-amber-500" />}
          title="Complete your profile to get personalized company recommendations."
          description="Your skills and CGPA have not been populated yet. Add your verified skills or upload your resume to generate accurate matches."
          actionText="Complete Profile Now"
          onAction={() => window.location.href = '/profile'}
        />
      ) : recommendations.length === 0 ? (
        <EmptyState
          icon={<AlertCircle className="w-10 h-10 text-slate-400" />}
          title="No suitable companies found based on your current profile."
          description="Try broadening your filter criteria, adding more technical skills, or updating your preferred role."
          actionText="Update Skills & Profile"
          onAction={() => window.location.href = '/profile'}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {recommendations.map((rec) => (
            <RecommendationCard key={rec.company.id} recommendation={rec} />
          ))}
        </div>
      )}
    </div>
  );
};
