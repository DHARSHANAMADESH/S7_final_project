import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, MapPin, DollarSign, Users, Briefcase, Bookmark } from 'lucide-react';
import { Company } from '../../types';
import { Badge } from '../common/UIComponents';
import { useSavedStore } from '../../store';

interface CompanyCardProps {
  company: Company;
}

export const CompanyCard: React.FC<CompanyCardProps> = ({ company }) => {
  const { isSaved, toggleSaveCompany } = useSavedStore();
  const saved = isSaved(company.id);

  const getHiringBadge = (status: string) => {
    if (status === 'Currently Hiring') return 'success';
    if (status === 'Hiring Soon') return 'warning';
    return 'neutral';
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-subtle hover:shadow-card hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <img
              src={company.logo}
              alt={company.name}
              className="w-12 h-12 rounded-lg object-cover border border-slate-100 dark:border-slate-800"
            />
            <div>
              <h3 className="font-semibold text-base text-slate-900 dark:text-white">
                {company.name}
              </h3>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {company.industry}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => toggleSaveCompany(company.id)}
            className={`p-1.5 rounded-lg border text-xs transition-colors ${
              saved
                ? 'bg-amber-50 border-amber-200 text-amber-600 dark:bg-amber-950/50 dark:border-amber-800'
                : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${saved ? 'fill-amber-500 text-amber-500' : ''}`} />
          </button>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mb-4 leading-relaxed">
          {company.description}
        </p>

        {/* Quick Details Pills */}
        <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-400 mb-4 bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{company.locations.slice(0, 2).join(', ')}</span>
          </div>
          <div className="flex items-center gap-1.5 font-medium text-slate-800 dark:text-slate-200 truncate">
            <DollarSign className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span className="truncate">{company.salaryDisplay}</span>
          </div>
          <div className="flex items-center gap-1.5 truncate">
            <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{company.openRoles.length} Open Roles</span>
          </div>
          <div className="flex items-center gap-1.5 truncate">
            <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">Min CGPA: {company.minimumCgpa}</span>
          </div>
        </div>

        {/* Tech Stack Chips */}
        <div className="flex flex-wrap gap-1 mb-2">
          {company.techStack.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded font-medium"
            >
              {tech}
            </span>
          ))}
          {company.techStack.length > 4 && (
            <span className="text-[10px] text-slate-400 px-1 py-0.5">
              +{company.techStack.length - 4} more
            </span>
          )}
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <Badge variant={getHiringBadge(company.hiringStatus)} size="sm">
          {company.hiringStatus}
        </Badge>
        <Link
          to={`/companies/${company.id}`}
          className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
        >
          View Profile →
        </Link>
      </div>
    </div>
  );
};
