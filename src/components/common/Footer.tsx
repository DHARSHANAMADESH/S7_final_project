import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Sparkles, Shield, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors text-slate-600 dark:text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm">
                <GraduationCap className="w-4 h-4" />
              </div>
              <span className="font-bold text-sm text-slate-900 dark:text-white">
                AI Company Recommender
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Transparent, weighted career matching platform designed for college placement cells, campus recruitment drives, and student career discovery.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px] font-medium">
                <Shield className="w-3 h-3" /> College Final-Year Project
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-3">
              Platform Features
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/recommendations" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  AI Recommendations
                </Link>
              </li>
              <li>
                <Link to="/resume-analyzer" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  PDF Resume Analyzer
                </Link>
              </li>
              <li>
                <Link to="/companies" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Company Directory
                </Link>
              </li>
              <li>
                <Link to="/applications" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Application Tracker
                </Link>
              </li>
              <li>
                <Link to="/career-assistant" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  AI Career Copilot
                </Link>
              </li>
            </ul>
          </div>

          {/* Matching Engine Specs */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-3">
              Recommendation Weights
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
              <li className="flex justify-between">
                <span>Skill Match:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">30%</span>
              </li>
              <li className="flex justify-between">
                <span>CGPA Eligibility:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">15%</span>
              </li>
              <li className="flex justify-between">
                <span>Role Alignment:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">15%</span>
              </li>
              <li className="flex justify-between">
                <span>Location & Projects:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">20%</span>
              </li>
              <li className="flex justify-between">
                <span>Soft Skills & Others:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">20%</span>
              </li>
            </ul>
          </div>

          {/* Academic Viva Credits */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-3">
              Academic Review
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
              Developed for Department of Computer Science & Engineering. Built with clean architecture, zero placeholder mock data, and transparent algorithms.
            </p>
            <div className="text-[11px] text-slate-400 space-y-1">
              <div>Version: 1.0.0 (Production Release)</div>
              <div>Stack: React 19 • TypeScript • Tailwind • Zustand</div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <div>
            © {new Date().getFullYear()} AI Company Recommendation Engine. Built for University Career Discovery.
          </div>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1">
              Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for College Viva
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
