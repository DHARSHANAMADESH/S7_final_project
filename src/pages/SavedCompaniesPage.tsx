import React from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Building2, ArrowRight, Trash2, MapPin } from 'lucide-react';
import { Button, Badge, EmptyState } from '../components/common/UIComponents';
import { useSavedStore, useCompanyStore, useProfileStore } from '../store';
import { calculateRecommendation } from '../utils/recommendationEngine';

export const SavedCompaniesPage: React.FC = () => {
  const { savedCompanyIds, toggleSaveCompany } = useSavedStore();
  const { companies } = useCompanyStore();
  const { profile } = useProfileStore();

  const savedCompanies = companies.filter(c => savedCompanyIds.includes(c.id));

  return (
    <div className="space-y-6 pb-20 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Saved Companies
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Companies bookmarked for recruitment deadlines and preparation tracking.
          </p>
        </div>

        <div className="text-xs font-semibold text-slate-500">
          <span className="text-indigo-600 dark:text-indigo-400 font-bold">{savedCompanies.length}</span> companies bookmarked
        </div>
      </div>

      {savedCompanies.length === 0 ? (
        <EmptyState
          icon={<Bookmark className="w-8 h-8" />}
          title="No saved companies yet"
          description="Explore recommendations and save companies you're interested in applying to."
          actionText="Explore Recommendations"
          onAction={() => window.location.href = '/recommendations'}
        />
      ) : (
        <div className="space-y-3">
          {savedCompanies.map((company) => {
            const recommendation = calculateRecommendation(profile, company);
            return (
              <div
                key={company.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-subtle hover:border-indigo-200 dark:hover:border-indigo-900 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start sm:items-center gap-4">
                  <img
                    src={company.logo}
                    alt={company.name}
                    className="w-12 h-12 rounded-lg object-cover border border-slate-100 dark:border-slate-800 shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {company.name}
                      </h3>
                      <Badge variant="neutral" size="sm">
                        {company.hiringStatus}
                      </Badge>
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                      {recommendation.targetRole.title} • {company.salaryDisplay}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                      <MapPin className="w-3 h-3" />
                      <span>{company.locations.join(', ')}</span>
                      <span>•</span>
                      <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                        {recommendation.finalScore}% Match
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <Link to={`/recommendations/${company.id}`}>
                    <Button size="sm" variant="primary" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                      View Recommendation
                    </Button>
                  </Link>

                  <button
                    type="button"
                    onClick={() => toggleSaveCompany(company.id)}
                    className="p-2 text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
