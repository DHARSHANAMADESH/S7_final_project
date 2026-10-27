import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Bookmark,
  Send,
  MapPin,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Award,
  Layers,
  Sparkles,
  BookOpen,
  Calendar,
  DollarSign,
  Building2,
  Check,
  Briefcase
} from 'lucide-react';
import { Button, Badge, ProgressBar, Modal } from '../components/common/UIComponents';
import {
  useProfileStore,
  useCompanyStore,
  useSavedStore,
  useApplicationStore
} from '../store';
import { calculateRecommendation } from '../utils/recommendationEngine';

export const RecommendationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { profile } = useProfileStore();
  const { companies } = useCompanyStore();
  const { isSaved, toggleSaveCompany } = useSavedStore();
  const { applyToCompany, hasApplied } = useApplicationStore();

  const company = companies.find(c => c.id === id);

  if (!company) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold">Company not found</h2>
        <Link to="/recommendations" className="text-indigo-600 text-sm font-semibold mt-2 inline-block">
          ← Back to recommendations
        </Link>
      </div>
    );
  }

  const recommendation = calculateRecommendation(profile, company);
  const { finalScore, breakdown, matchedSkills, missingSkills, cgpaEligible, explanation, preparationPlan } = recommendation;
  const saved = isSaved(company.id);
  const applied = hasApplied(company.id);

  // Application Modal state
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState(company.openRoles[0]?.id || '');
  const [coverNote, setCoverNote] = useState(`I am excited to apply for the position at ${company.name}. My technical background in ${matchedSkills.slice(0, 2).join(', ')} aligns well with your team requirements.`);
  const [applySuccess, setApplySuccess] = useState(false);

  // Track completed preparation steps locally
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const toggleStep = (stepNumber: number) => {
    if (completedSteps.includes(stepNumber)) {
      setCompletedSteps(completedSteps.filter(s => s !== stepNumber));
    } else {
      setCompletedSteps([...completedSteps, stepNumber]);
    }
  };

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyToCompany(company, selectedRoleId, finalScore, coverNote);
    setShowApplyModal(false);
    setApplySuccess(true);
    setTimeout(() => {
      navigate('/applications');
    }, 1500);
  };

  return (
    <div className="space-y-8 pb-20 max-w-5xl mx-auto">
      {/* Back link */}
      <div>
        <Link
          to="/recommendations"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to all recommendations</span>
        </Link>
      </div>

      {applySuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-xs font-medium text-emerald-800 dark:text-emerald-300 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Application successfully submitted! Redirecting to Application Tracker...</span>
        </div>
      )}

      {/* Main Header Card */}
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
            </div>
            <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-1">
              {recommendation.targetRole.title}
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-500 mt-1.5 flex-wrap">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {company.locations.join(', ')}
              </span>
              <span>•</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Package: {company.salaryDisplay}
              </span>
            </div>
          </div>
        </div>

        {/* Score & Action Buttons */}
        <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-3 shrink-0">
          <div className="px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
              {finalScore}%
            </span>
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
              Match Compatibility
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
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
              title={saved ? 'Remove bookmark' : 'Save Company'}
            >
              <Bookmark className={`w-4 h-4 ${saved ? 'fill-amber-500 text-amber-500' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Why We Recommend This Company */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-subtle space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-500" />
          <span>Why We Recommend This Company</span>
        </h2>

        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
          {explanation.summary}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {explanation.strengths.map((str, idx) => (
            <div
              key={idx}
              className="p-3 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/60 flex items-start gap-2.5 text-xs text-emerald-900 dark:text-emerald-300"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{str}</span>
            </div>
          ))}
          {explanation.gaps.map((gap, idx) => (
            <div
              key={idx}
              className="p-3 rounded-lg bg-amber-50/50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/60 flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-300"
            >
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>{gap}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Match Breakdown & Skills Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Match Breakdown */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-subtle space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-500" />
            <span>Match Factor Breakdown</span>
          </h3>

          <div className="space-y-3.5">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-600 dark:text-slate-400">Skill Match (Weight: 30%)</span>
                <span className="font-bold text-slate-900 dark:text-white">{breakdown.skillScore}%</span>
              </div>
              <ProgressBar value={breakdown.skillScore} showValue={false} />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-600 dark:text-slate-400">CGPA Eligibility (Weight: 15%)</span>
                <span className="font-bold text-slate-900 dark:text-white">{breakdown.cgpaScore}%</span>
              </div>
              <ProgressBar value={breakdown.cgpaScore} showValue={false} />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-600 dark:text-slate-400">Role Preference (Weight: 15%)</span>
                <span className="font-bold text-slate-900 dark:text-white">{breakdown.roleScore}%</span>
              </div>
              <ProgressBar value={breakdown.roleScore} showValue={false} />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-600 dark:text-slate-400">Location Alignment (Weight: 10%)</span>
                <span className="font-bold text-slate-900 dark:text-white">{breakdown.locationScore}%</span>
              </div>
              <ProgressBar value={breakdown.locationScore} showValue={false} />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-600 dark:text-slate-400">Project Tech Relevance (Weight: 10%)</span>
                <span className="font-bold text-slate-900 dark:text-white">{breakdown.projectScore}%</span>
              </div>
              <ProgressBar value={breakdown.projectScore} showValue={false} />
            </div>
          </div>
        </div>

        {/* Required vs Missing Skills */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-subtle space-y-5">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
              Required Skills Match
            </h3>
            <div className="flex flex-wrap gap-2">
              {company.requiredSkills.map((skill) => {
                const isMatched = matchedSkills.includes(skill);
                return (
                  <span
                    key={skill}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium border flex items-center gap-1.5 ${
                      isMatched
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                        : 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800'
                    }`}
                  >
                    <span>{isMatched ? '✓' : '•'}</span>
                    <span>{skill}</span>
                  </span>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
              Missing / Growth Skills
            </h3>
            {missingSkills.length === 0 ? (
              <div className="text-xs text-emerald-600 font-medium">
                ✓ You possess all core required skills for this position!
              </div>
            ) : (
              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                {missingSkills.map((s) => (
                  <div key={s} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 5-Step Preparation Plan */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-subtle space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-500" />
              <span>Personalized Preparation Roadmap</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Follow these recommended milestones to prepare for {company.name}'s interview rounds.
            </p>
          </div>

          <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
            {completedSteps.length} of {preparationPlan.length} completed
          </span>
        </div>

        <div className="space-y-3 pt-2">
          {preparationPlan.map((plan) => {
            const isDone = completedSteps.includes(plan.step);
            return (
              <div
                key={plan.step}
                onClick={() => toggleStep(plan.step)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                  isDone
                    ? 'border-emerald-200 bg-emerald-50/40 dark:border-emerald-900/60 dark:bg-emerald-950/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-800 bg-slate-50/40 dark:bg-slate-800/30'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 text-xs font-bold transition-colors ${
                    isDone
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {isDone ? '✓' : plan.step}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className={`text-xs sm:text-sm font-bold ${isDone ? 'line-through text-slate-500' : 'text-slate-900 dark:text-white'}`}>
                      {plan.action}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-medium">
                      Est: {plan.estimatedTime}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {plan.details}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Application Modal */}
      <Modal
        isOpen={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        title={`Apply to ${company.name}`}
      >
        <form onSubmit={handleApplySubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Select Target Role
            </label>
            <select
              value={selectedRoleId}
              onChange={(e) => setSelectedRoleId(e.target.value)}
              className="w-full text-xs py-2 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
            >
              {company.openRoles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.title} ({role.salary} • {role.location})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Cover Note & Statement of Interest
            </label>
            <textarea
              value={coverNote}
              onChange={(e) => setCoverNote(e.target.value)}
              rows={4}
              className="w-full text-xs p-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
              required
            />
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg text-[11px] text-slate-500">
            Attached Profile: <strong>{profile.name}</strong> • CGPA: <strong>{profile.cgpa}</strong> • Match Score: <strong>{finalScore}%</strong>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setShowApplyModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" rightIcon={<Send className="w-3.5 h-3.5" />}>
              Submit Application
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
