import React from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, MapPin, CheckCircle2, AlertCircle, ArrowRight, DollarSign } from 'lucide-react';
import { RecommendationResult } from '../../types';
import { Badge, Button } from '../common/UIComponents';
import { useSavedStore } from '../../store';

interface RecommendationCardProps {
  recommendation: RecommendationResult;
  onApplyClick?: () => void;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  onApplyClick
}) => {
  const { company, targetRole, finalScore, matchedSkills, missingSkills, cgpaEligible } = recommendation;
  const { isSaved, toggleSaveCompany } = useSavedStore();
  const saved = isSaved(company.id);

  // Determine score color badge
  const getScoreBadge = (score: number) => {
    if (score >= 90) return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800';
    if (score >= 80) return 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800';
    if (score >= 70) return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800';
    return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800';
  };

  const getHiringBadge = (status: string) => {
    if (status === 'Currently Hiring') return 'success';
    if (status === 'Hiring Soon') return 'warning';
    return 'neutral';
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-subtle hover:shadow-card hover:border-indigo-200 dark:hover:border-indigo-900 transition-all duration-200 flex flex-col justify-between">
      <div>
        {/* Top Header: Logo, Company Name & Match Score */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <img
              src={company.logo}
              alt={company.name}
              className="w-11 h-11 rounded-lg object-cover border border-slate-100 dark:border-slate-800 shadow-xs"
            />
            <div>
              <h3 className="font-semibold text-base text-slate-900 dark:text-white tracking-tight">
                {company.name}
              </h3>
              <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                {targetRole.title}
              </div>
              <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                <MapPin className="w-3 h-3 text-slate-400" />
                <span>{company.locations[0] || 'India'}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <div className={`px-2.5 py-1 rounded-lg font-bold text-sm border ${getScoreBadge(finalScore)}`}>
              {finalScore}% Match
            </div>
            <Badge variant={getHiringBadge(company.hiringStatus)} size="sm" className="mt-1.5 text-[10px]">
              {company.hiringStatus}
            </Badge>
          </div>
        </div>

        {/* Strongest Matches section */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
          <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Your strongest matches:
          </div>
          <div className="space-y-1 text-xs">
            {matchedSkills.slice(0, 3).map((skill) => (
              <div key={skill} className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
                <span className="font-bold">✓</span>
                <span className="text-slate-800 dark:text-slate-200">{skill}</span>
              </div>
            ))}
            {cgpaEligible && (
              <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
                <span className="font-bold">✓</span>
                <span className="text-slate-800 dark:text-slate-200">CGPA eligibility met (Min: {company.minimumCgpa})</span>
              </div>
            )}
          </div>
        </div>

        {/* Missing Skills section */}
        {missingSkills.length > 0 && (
          <div className="mt-3">
            <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Missing:
            </div>
            <div className="flex flex-wrap gap-1.5 text-xs">
              {missingSkills.slice(0, 3).map((skill) => (
                <span key={skill} className="inline-flex items-center gap-1 text-amber-700 dark:text-amber-400 text-[11px] bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-900">
                  <span>•</span>
                  <span>{skill}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Salary Information */}
        <div className="mt-3 pt-2 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
          <span className="text-slate-500">Package:</span>
          <span className="font-semibold text-slate-900 dark:text-slate-100">
            {company.salaryDisplay}
          </span>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
        <Link
          to={`/recommendations/${company.id}`}
          className="flex-1 text-center py-2 px-3 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors flex items-center justify-center gap-1"
        >
          <span>View Details</span>
          <ArrowRight className="w-3 h-3" />
        </Link>

        <button
          type="button"
          onClick={() => toggleSaveCompany(company.id)}
          className={`p-2 rounded-lg border text-xs font-medium transition-colors ${
            saved
              ? 'bg-amber-50 border-amber-200 text-amber-600 dark:bg-amber-950/50 dark:border-amber-800'
              : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
          title={saved ? 'Remove from Saved' : 'Save Company'}
        >
          <Bookmark className={`w-4 h-4 ${saved ? 'fill-amber-500 text-amber-500' : ''}`} />
        </button>
      </div>
    </div>
  );
};
