import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  FileCheck,
  Search,
  CheckCircle2,
  ChevronDown,
  Briefcase,
  TrendingUp,
  Cpu,
  Layers,
  GraduationCap,
  ShieldCheck,
  Building2,
  Users,
  Target
} from 'lucide-react';
import { Button, Badge } from '../components/common/UIComponents';
import { FAQ_DATA, TESTIMONIALS, MOCK_COMPANIES } from '../data/mockData';
import { useAuthStore } from '../store';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="space-y-24 pb-20">
      {/* ==================== HERO SECTION ==================== */}
      <section className="relative pt-12 sm:pt-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        {/* Subtle pill tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-200 dark:border-indigo-800/80 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-6">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>Intelligent University Placement & Career Matching</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight max-w-3xl mx-auto">
          Find Companies That Fit Your Career
        </h1>

        <p className="mt-5 text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Analyze your skills, resume, CGPA and career preferences to discover companies that match your profile.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to={isAuthenticated ? "/dashboard" : "/signup"}>
            <Button size="lg" variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Get Started
            </Button>
          </Link>
          <Link to="/companies">
            <Button size="lg" variant="outline">
              Explore Companies
            </Button>
          </Link>
        </div>

        {/* Simple visual representation of the recommendation process */}
        <div className="mt-14 p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-card max-w-2xl mx-auto">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-6">
            Transparent Matching Pipeline
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 relative">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
              <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-2 text-sm font-bold">
                1
              </div>
              <div className="font-semibold text-sm text-slate-900 dark:text-white">Your Profile</div>
              <div className="text-[11px] text-slate-500 mt-1">Skills, CGPA, Projects & Resume</div>
            </div>

            <div className="flex sm:hidden justify-center text-slate-400">↓</div>

            <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/40 rounded-xl border border-indigo-200 dark:border-indigo-900 text-center">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center mx-auto mb-2 text-sm font-bold shadow-xs">
                2
              </div>
              <div className="font-semibold text-sm text-slate-900 dark:text-white">AI Analysis</div>
              <div className="text-[11px] text-slate-500 mt-1">Weighted 9-Factor Matching</div>
            </div>

            <div className="flex sm:hidden justify-center text-slate-400">↓</div>

            <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-900 text-center">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto mb-2 text-sm font-bold shadow-xs">
                3
              </div>
              <div className="font-semibold text-sm text-slate-900 dark:text-white">Company Matches</div>
              <div className="text-[11px] text-slate-500 mt-1">Scores, Gaps & Prep Plans</div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== STATISTICS SECTION ==================== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-6 text-center shadow-subtle">
            <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
              500+
            </div>
            <div className="text-sm font-medium text-slate-600 dark:text-slate-400 mt-1">
              Students Active
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-6 text-center shadow-subtle">
            <div className="text-3xl font-bold text-slate-900 dark:text-white">
              100+
            </div>
            <div className="text-sm font-medium text-slate-600 dark:text-slate-400 mt-1">
              Partner Companies
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-6 text-center shadow-subtle">
            <div className="text-3xl font-bold text-slate-900 dark:text-white">
              1,500+
            </div>
            <div className="text-sm font-medium text-slate-600 dark:text-slate-400 mt-1">
              Recommendations
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-6 text-center shadow-subtle">
            <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
              85%
            </div>
            <div className="text-sm font-medium text-slate-600 dark:text-slate-400 mt-1">
              Average Match Accuracy
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FEATURES SECTION ==================== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
            Comprehensive Career Matching Tools
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
            Every feature is engineered to simplify campus placement preparation and maximize hiring chances.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-subtle hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              AI Company Matching
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Weighted compatibility calculation factoring skills, CGPA cutoffs, desired roles, and preferred work locations.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-subtle hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
              <FileCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              Resume Analysis
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Extract technical skills, academic records, and projects from PDF resumes with ATS score validation.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-subtle hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              Skill Gap Detection
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Pinpoint required frameworks and database tools missing from your profile before applying.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-subtle hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              Career Insights
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Explore salary distributions, CTC packages, hiring rounds, and tech stacks for 100+ recruiters.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-subtle hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
              <Briefcase className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              Application Tracking
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Manage interview stages from initial application to final offer letter using an organized status board.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-subtle hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              Personalized Preparation
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Receive step-by-step 5-stage roadmaps custom tailored to each specific company's hiring rounds.
            </p>
          </div>
        </div>
      </section>

      {/* ==================== HOW IT WORKS SECTION ==================== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-8 sm:p-12">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
              How It Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              Simple 4-step workflow to find your dream campus placement.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200/60 dark:border-slate-800 relative">
              <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                01
              </span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-2 mb-1">
                Create Profile
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Add your degree, CGPA, technical skills, projects, and career preferences.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200/60 dark:border-slate-800 relative">
              <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                02
              </span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-2 mb-1">
                Upload Resume
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Our parser extracts verified keywords, project metrics, and calculates ATS scores.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200/60 dark:border-slate-800 relative">
              <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                03
              </span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-2 mb-1">
                AI Analyzes Profile
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Deterministic weighted matching compares eligibility against live company criteria.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200/60 dark:border-slate-800 relative">
              <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                04
              </span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-2 mb-1">
                Get Recommendations
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Review ranked matches, missing skills, preparation plans, and apply directly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== TESTIMONIALS SECTION ==================== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
            Student Success Stories
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
            How seniors used our recommendation engine during final-year placements.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-subtle flex flex-col justify-between"
            >
              <p className="text-xs text-slate-600 dark:text-slate-300 italic mb-6 leading-relaxed">
                "{t.quote}"
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    {t.name}
                  </div>
                  <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                    {t.company}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {t.degree}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ==================== FAQ SECTION ==================== */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
            Common questions regarding matching scores, resume extraction, and campus eligibility.
          </p>
        </div>

        <div className="space-y-3">
          {FAQ_DATA.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-subtle transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between text-sm font-semibold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ml-3 ${
                      isOpen ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ==================== FINAL CTA BANNER ==================== */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white rounded-2xl p-8 sm:p-12 text-center shadow-elevated">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Ready to Discover Your Best-Fit Companies?
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-indigo-200 max-w-xl mx-auto leading-relaxed">
            Test your profile against top tech recruiters and get actionable roadmap suggestions today.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link to={isAuthenticated ? "/dashboard" : "/signup"}>
              <Button size="lg" className="bg-white text-indigo-900 hover:bg-slate-100 font-semibold shadow-md">
                Launch My Recommendations →
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
