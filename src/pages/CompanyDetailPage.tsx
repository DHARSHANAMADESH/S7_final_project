import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Bookmark,
  Send,
  MapPin,
  Building2,
  Users,
  DollarSign,
  Calendar,
  Layers,
  GraduationCap,
  Sparkles,
  ExternalLink,
  Shield,
  Gift,
  CheckCircle2
} from 'lucide-react';
import { Button, Badge, Modal } from '../components/common/UIComponents';
import { useCompanyStore, useSavedStore, useApplicationStore, useProfileStore } from '../store';
import { calculateRecommendation } from '../utils/recommendationEngine';

export const CompanyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { companies } = useCompanyStore();
  const { isSaved, toggleSaveCompany } = useSavedStore();
  const { applyToCompany, hasApplied } = useApplicationStore();
  const { profile } = useProfileStore();

  const company = companies.find(c => c.id === id);

  if (!company) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold">Company not found</h2>
        <Link to="/companies" className="text-indigo-600 text-sm font-semibold mt-2 inline-block">
          ← Back to companies directory
        </Link>
      </div>
    );
  }

  const recommendation = calculateRecommendation(profile, company);
  const saved = isSaved(company.id);
  const applied = hasApplied(company.id);

  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState(company.openRoles[0]?.id || '');
  const [coverNote, setCoverNote] = useState(`I would love to be considered for open positions at ${company.name}.`);
  const [applySuccess, setApplySuccess] = useState(false);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    applyToCompany(company, selectedRoleId, recommendation.finalScore, coverNote);
    setShowApplyModal(false);
    setApplySuccess(true);
    setTimeout(() => {
      navigate('/applications');
    }, 1500);
  };

  return (
    <div className="space-y-8 pb-20 max-w-5xl mx-auto">
      <div>
        <Link
          to="/companies"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to company directory</span>
        </Link>
      </div>

      {applySuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-xs font-medium text-emerald-800 dark:text-emerald-300 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Application submitted! Redirecting to tracker...</span>
        </div>
      )}

      {/* Header Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <img
            src={company.logo}
            alt={company.name}
            className="w-16 h-16 rounded-xl object-cover border border-slate-100 dark:border-slate-800 shadow-xs shrink-0"
          />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                {company.name}
              </h1>
              <Badge variant="neutral" size="sm">
                {company.industry}
              </Badge>
              <Badge variant="success" size="sm">
                {company.hiringStatus}
              </Badge>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-500 mt-2 flex-wrap">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {company.headquarters}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                {company.companySize}
              </span>
              <span>•</span>
              <a
                href={company.website}
                target="_blank"
                rel="noreferrer"
                className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-medium"
              >
                <span>Visit Website</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="primary"
            size="md"
            onClick={() => setShowApplyModal(true)}
            disabled={applied}
            leftIcon={<Send className="w-4 h-4" />}
          >
            {applied ? 'Already Applied' : 'Apply Now'}
          </Button>

          <button
            type="button"
            onClick={() => toggleSaveCompany(company.id)}
            className={`p-2.5 rounded-lg border text-xs transition-colors ${
              saved
                ? 'bg-amber-50 border-amber-200 text-amber-600 dark:bg-amber-950/50 dark:border-amber-800'
                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${saved ? 'fill-amber-500 text-amber-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* Match Compatibility Highlight Banner */}
      <div className="bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900 rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 text-white rounded-lg">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-white">
              Your Profile Compatibility: {recommendation.finalScore}%
            </div>
            <div className="text-[11px] text-slate-600 dark:text-slate-300">
              {recommendation.matchedSkills.length} matching skills • Minimum CGPA: {company.minimumCgpa}
            </div>
          </div>
        </div>
        <Link to={`/recommendations/${company.id}`}>
          <Button size="sm" variant="outline" className="bg-white dark:bg-slate-900 text-xs">
            View Match Analysis →
          </Button>
        </Link>
      </div>

      {/* Overview & Stack Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Overview */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-subtle space-y-3">
            <h2 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white">
              Company Overview
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {company.description}
            </p>
          </div>

          {/* Hiring Process */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-subtle space-y-4">
            <h2 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white">
              Recruitment Process & Hiring Rounds
            </h2>
            <div className="space-y-3 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
              {company.hiringProcess.map((round) => (
                <div key={round.step} className="flex items-start gap-4 relative pl-1">
                  <div className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0 z-10">
                    {round.step}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                      {round.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                      {round.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Open Roles */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-subtle space-y-4">
            <h2 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white">
              Open Positions ({company.openRoles.length})
            </h2>
            <div className="space-y-3">
              {company.openRoles.map((role) => (
                <div
                  key={role.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30 space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">{role.title}</h3>
                      <div className="text-xs text-slate-500">{role.department} • {role.location}</div>
                    </div>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{role.salary}</span>
                  </div>

                  <div className="space-y-1 pt-1">
                    {role.requirements.map((req, i) => (
                      <div key={i} className="text-[11px] text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                        <span className="text-indigo-500">•</span>
                        <span>{req}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar: Tech Stack, Eligibility & Benefits */}
        <div className="space-y-6">
          {/* Tech Stack */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-subtle space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Technology Stack
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {company.techStack.map((tech) => (
                <span
                  key={tech}
                  className="text-xs font-medium px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Eligibility Criteria */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-subtle space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Eligibility Criteria
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Minimum CGPA:</span>
                <span className="font-bold text-slate-900 dark:text-white">{company.minimumCgpa} / 10.0</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Salary Range:</span>
                <span className="font-bold text-slate-900 dark:text-white">{company.salaryDisplay}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Deadline:</span>
                <span className="font-bold text-slate-900 dark:text-white">{company.applicationDeadline}</span>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-subtle space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Gift className="w-3.5 h-3.5 text-indigo-500" />
              <span>Perks & Benefits</span>
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
              {company.benefits.map((benefit, i) => (
                <li key={i} className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      <Modal
        isOpen={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        title={`Apply to ${company.name}`}
      >
        <form onSubmit={handleApply} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Select Position
            </label>
            <select
              value={selectedRoleId}
              onChange={(e) => setSelectedRoleId(e.target.value)}
              className="w-full text-xs py-2 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
            >
              {company.openRoles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.title} ({r.salary})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Candidate Note
            </label>
            <textarea
              value={coverNote}
              onChange={(e) => setCoverNote(e.target.value)}
              rows={3}
              className="w-full text-xs p-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setShowApplyModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Confirm & Apply
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
