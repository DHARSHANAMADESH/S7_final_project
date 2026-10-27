import React, { useState } from 'react';
import { Building2, Search, Filter, RotateCcw } from 'lucide-react';
import { CompanyCard } from '../components/cards/CompanyCard';
import { EmptyState } from '../components/common/UIComponents';
import { useCompanyStore } from '../store';

export const CompaniesPage: React.FC = () => {
  const { companies } = useCompanyStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedHiringStatus, setSelectedHiringStatus] = useState('all');

  const industries = Array.from(new Set(companies.map(c => c.industry))).sort();
  const locations = Array.from(new Set(companies.flatMap(c => c.locations))).sort();

  const filteredCompanies = companies.filter((company) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        company.name.toLowerCase().includes(q) ||
        company.industry.toLowerCase().includes(q) ||
        company.techStack.some(t => t.toLowerCase().includes(q)) ||
        company.requiredSkills.some(s => s.toLowerCase().includes(q));
      if (!matchesSearch) return false;
    }

    if (selectedIndustry !== 'all' && company.industry !== selectedIndustry) {
      return false;
    }

    if (selectedLocation !== 'all' && !company.locations.includes(selectedLocation)) {
      return false;
    }

    if (selectedHiringStatus !== 'all' && company.hiringStatus !== selectedHiringStatus) {
      return false;
    }

    return true;
  });

  const handleReset = () => {
    setSearchQuery('');
    setSelectedIndustry('all');
    setSelectedLocation('all');
    setSelectedHiringStatus('all');
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Company Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Browse corporate recruitment profiles, hiring processes, technology stacks, and eligibility cutoffs.
          </p>
        </div>

        <div className="text-xs font-semibold text-slate-500">
          Showing <span className="text-indigo-600 dark:text-indigo-400 font-bold">{filteredCompanies.length}</span> companies
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-subtle space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search companies by name, industry, or tech stack (e.g. Microsoft, SaaS, Python)..."
            className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Industry
            </label>
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="w-full text-xs py-2 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Industries</option>
              {industries.map(ind => (
                <option key={ind} value={ind}>{ind}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Location
            </label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full text-xs py-2 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Locations</option>
              {locations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Hiring Status
            </label>
            <select
              value={selectedHiringStatus}
              onChange={(e) => setSelectedHiringStatus(e.target.value)}
              className="w-full text-xs py-2 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Statuses</option>
              <option value="Currently Hiring">Currently Hiring</option>
              <option value="Hiring Soon">Hiring Soon</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="button"
              onClick={handleReset}
              className="w-full py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          </div>
        </div>
      </div>

      {filteredCompanies.length === 0 ? (
        <EmptyState
          icon={<Building2 className="w-8 h-8" />}
          title="No companies match your filters"
          description="Try clearing your search terms or selecting 'All Industries'."
          actionText="Reset Filters"
          onAction={handleReset}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCompanies.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>
      )}
    </div>
  );
};
