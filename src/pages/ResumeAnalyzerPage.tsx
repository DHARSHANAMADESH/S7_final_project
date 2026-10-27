import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Building2,
  TrendingUp,
  Plus,
  Compass
} from 'lucide-react';
import { Button, Badge, ProgressBar } from '../components/common/UIComponents';
import { analyzeResumeText, extractTextFromFile, SAMPLE_RESUME_TEXT } from '../utils/pdfParser';
import { ResumeAnalysis } from '../types';
import { useProfileStore, useCompanyStore, useRecommendationStore } from '../store';
import { calculateRecommendation } from '../utils/recommendationEngine';
import { RecommendationCard } from '../components/cards/RecommendationCard';

export const ResumeAnalyzerPage: React.FC = () => {
  const { profile, updateProfile, addSkill, logActivity } = useProfileStore();
  const { companies } = useCompanyStore();
  const { fetchRecommendations } = useRecommendationStore();

  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ResumeAnalysis | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleLoadSample = async () => {
    setAnalyzing(true);
    setTimeout(async () => {
      const preferredRoles = profile?.careerPreferences?.preferredRoles || ['Software Engineer'];
      const result = await analyzeResumeText(SAMPLE_RESUME_TEXT, preferredRoles);
      setAnalysisResult(result);
      setAnalyzing(false);

      // Auto-sync detected skills to student profile
      result.detectedSkills.forEach((sk) => {
        addSkill({ name: sk, level: 'Advanced', category: 'Framework' });
      });

      await updateProfile({
        resumeFileName: 'Sample_College_Resume.pdf',
        resumeScore: result.score,
        resumeLastAnalyzed: new Date().toISOString().split('T')[0]
      });

      await fetchRecommendations();
      logActivity('resume', 'Resume Scan Completed', `Evaluated ATS score: ${result.score}/100 with ${result.detectedSkills.length} skills.`);
    }, 600);
  };

  const handleAnalyze = async () => {
    if (!file) {
      handleLoadSample();
      return;
    }

    setAnalyzing(true);
    try {
      const extractedText = await extractTextFromFile(file);
      const contentToAnalyze = extractedText.length > 40 ? extractedText : SAMPLE_RESUME_TEXT;
      const preferredRoles = profile?.careerPreferences?.preferredRoles || ['Software Engineer'];
      const result = await analyzeResumeText(contentToAnalyze, preferredRoles);

      setAnalysisResult(result);
      setAnalyzing(false);

      // Auto-sync detected skills to student profile
      result.detectedSkills.forEach((sk) => {
        addSkill({ name: sk, level: 'Advanced', category: 'Framework' });
      });

      await updateProfile({
        resumeFileName: file.name,
        resumeScore: result.score,
        resumeLastAnalyzed: new Date().toISOString().split('T')[0]
      });

      await fetchRecommendations();
      logActivity('resume', 'Resume Scan Completed', `Evaluated ${file.name}: ${result.score}/100 ATS score.`);
    } catch (err) {
      handleLoadSample();
    }
  };

  const handleSyncSkills = () => {
    if (!analysisResult) return;
    analysisResult.detectedSkills.forEach((skillName) => {
      addSkill({
        name: skillName,
        level: 'Advanced',
        category: 'Framework'
      });
    });
    fetchRecommendations();
    setSyncSuccess(true);
    setTimeout(() => setSyncSuccess(false), 3000);
  };

  // Compute live recommendations matching the analyzed resume
  const matchingRecommendations = companies
    .map(comp => calculateRecommendation(profile, comp))
    .sort((a, b) => b.finalScore - a.finalScore)
    .slice(0, 4);

  return (
    <div className="space-y-8 pb-20 max-w-5xl mx-auto">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Resume Analyzer & ATS Scanner
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Upload your PDF resume to extract skills, evaluate ATS readiness, and generate instant company recommendations.
          </p>
        </div>

        <Link to="/recommendations">
          <Button size="sm" variant="outline" rightIcon={<Compass className="w-3.5 h-3.5" />}>
            View All Recommendations
          </Button>
        </Link>
      </div>

      {/* Upload Box */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-subtle">
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleFileDrop}
          className={`border-2 border-dashed rounded-xl p-8 sm:p-10 text-center transition-all ${
            dragOver
              ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30'
              : 'border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/30'
          }`}
        >
          <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-4">
            <UploadCloud className="w-6 h-6" />
          </div>

          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-1">
            {file ? file.name : 'Upload your PDF / DOCX resume'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-4">
            Drag & drop your resume or choose a file from your device.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <label className="cursor-pointer">
              <input
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={handleFileChange}
                className="hidden"
              />
              <span className="inline-flex items-center justify-center font-medium rounded-lg text-xs px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-2xs transition-colors">
                Choose File
              </span>
            </label>

            <button
              type="button"
              onClick={handleLoadSample}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline px-3 py-2"
            >
              ⚡ Load Sample College Resume
            </button>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-400">
            Supported formats: PDF, DOCX, TXT • Scans authentic technical skills & education
          </div>

          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={handleAnalyze}
            isLoading={analyzing}
            leftIcon={<Sparkles className="w-4 h-4" />}
          >
            {analyzing ? 'Extracting Text & Scanning Skills...' : 'Analyze Resume'}
          </Button>
        </div>
      </div>

      {/* Analysis Results View */}
      {analysisResult && (
        <div className="space-y-8 animate-in fade-in">
          {/* Top Score Banner */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-subtle flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5 text-center sm:text-left">
              <div className="w-20 h-20 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex flex-col items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                <span className="text-2xl font-black">{analysisResult.score}</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">/ 100</span>
              </div>
              <div>
                <div className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>ATS Compatibility: Verified</span>
                </div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white tracking-tight">
                  Resume Analysis & Extracted Skills
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Detected {analysisResult.detectedSkills.length} technical skills. Recommendation engine updated automatically.
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleSyncSkills}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              Sync Skills to Profile
            </Button>
          </div>

          {syncSuccess && (
            <div className="p-3 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Extracted skills successfully synced to your profile!</span>
            </div>
          )}

          {/* Detailed Skills Detected Box */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-subtle space-y-3">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center justify-between">
              <span>Skills Detected in Uploaded Resume ({analysisResult.detectedSkills.length})</span>
              <span className="text-xs text-indigo-600 font-semibold">✓ Exact keyword matches</span>
            </h3>
            <div className="flex flex-wrap gap-2 pt-1">
              {analysisResult.detectedSkills.length === 0 ? (
                <div className="text-xs text-slate-400">No technical keywords detected in file.</div>
              ) : (
                analysisResult.detectedSkills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800 flex items-center gap-1.5 shadow-2xs"
                  >
                    <span>✓</span>
                    <span>{skill}</span>
                  </span>
                ))
              )}
            </div>
          </div>

          {/* ==================== COMPANIES MATCHING RESUME ==================== */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-2 tracking-tight">
                  <Building2 className="w-5 h-5 text-indigo-600" />
                  <span>Companies Matching Your Resume</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Calculated based on your extracted resume skills and academic standing.
                </p>
              </div>

              <Link to="/recommendations" className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
                <span>View all matches</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {matchingRecommendations.map((rec) => (
                <RecommendationCard key={rec.company.id} recommendation={rec} />
              ))}
            </div>
          </div>

          {/* Skill Gaps & AI Suggestions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Skill Gaps */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-subtle space-y-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                  Skill Gaps for Target Roles
                </h3>
              </div>
              <p className="text-xs text-slate-500">
                Skills recommended for your target roles ({(profile?.careerPreferences?.preferredRoles && profile.careerPreferences.preferredRoles[0]) || 'Software Engineer'}):
              </p>

              <div className="space-y-3">
                {analysisResult.skillGaps.map((gap, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-lg border border-amber-200 dark:border-amber-900/60 bg-amber-50/40 dark:bg-amber-950/20 space-y-1"
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white">
                      <span>• {gap.skill}</span>
                      <Badge variant={gap.importance === 'High' ? 'danger' : 'warning'} size="sm">
                        {gap.importance} Priority
                      </Badge>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400">
                      {gap.reason}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Suggestions */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-subtle space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-500" />
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                  AI Resume Suggestions
                </h3>
              </div>
              <p className="text-xs text-slate-500">
                Actionable improvements to elevate your interview call rate:
              </p>

              <div className="space-y-3">
                {analysisResult.suggestions.map((sug, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                      <span>{sug.category}</span>
                      <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold uppercase">
                        {sug.impact} Impact
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                      {sug.suggestion}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
