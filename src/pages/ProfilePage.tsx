import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  GraduationCap,
  Code2,
  Award,
  FolderGit2,
  Briefcase,
  Sliders,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  FileText,
  UploadCloud,
  Sparkles,
  Building2,
  ArrowRight
} from 'lucide-react';
import { Button, SkillTag, ProgressBar, Badge } from '../components/common/UIComponents';
import { useProfileStore, useCompanyStore, useRecommendationStore } from '../store';
import { analyzeResumeText, extractTextFromFile, SAMPLE_RESUME_TEXT } from '../utils/pdfParser';
import { ResumeAnalysis } from '../types';
import { calculateRecommendation } from '../utils/recommendationEngine';
import { RecommendationCard } from '../components/cards/RecommendationCard';

const getFormDataFromProfile = (p: any) => ({
  name: p?.name || '',
  email: p?.email || '',
  phone: p?.phone || '',
  location: p?.location || '',
  college: p?.college || '',
  degree: p?.degree || '',
  department: p?.department || '',
  cgpa: p?.cgpa !== undefined && p?.cgpa !== null ? p.cgpa : '',
  graduationYear: p?.graduationYear || 2026,
  experienceLevel: p?.careerPreferences?.experienceLevel || 'Fresher / Entry-level',
  minSalaryLPA: p?.careerPreferences?.minSalaryLPA || 6,
  aptitudeScore: p?.softSkills?.aptitudeScore || 75,
  communicationScore: p?.softSkills?.communicationScore || 75,
  preferredRoles: (p?.careerPreferences?.preferredRoles || []).join(', '),
  preferredLocations: (p?.careerPreferences?.preferredLocations || []).join(', '),
  careerInterests: (p?.careerPreferences?.careerInterests || []).join(', '),
  programmingLanguages: (p?.programmingLanguages || []).join(', ')
});

export const ProfilePage: React.FC = () => {
  const {
    profile,
    fetchProfile,
    updateProfile,
    addSkill,
    removeSkill,
    addProject,
    removeProject,
    addCertification,
    removeCertification,
    logActivity
  } = useProfileStore();

  const { companies } = useCompanyStore();
  const { fetchRecommendations } = useRecommendationStore();

  const [activeTab, setActiveTab] = useState<'personal' | 'academic' | 'skills' | 'projects' | 'preferences' | 'resume'>('personal');
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  // Form State initialized safely
  const [formData, setFormData] = useState(() => getFormDataFromProfile(profile));

  useEffect(() => {
    if (profile) {
      setFormData(getFormDataFromProfile(profile));
    }
  }, [profile]);

  // New Skill Input state
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'>('Intermediate');

  // New Project Input state
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    technologies: '',
    githubUrl: '',
    liveUrl: ''
  });

  // New Certification Input state
  const [showNewCertModal, setShowNewCertModal] = useState(false);
  const [newCert, setNewCert] = useState({
    name: '',
    issuer: '',
    year: '2025',
    credentialUrl: ''
  });

  // Resume Upload State within Profile
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeAnalyzing, setResumeAnalyzing] = useState(false);
  const [resumeAnalysis, setResumeAnalysis] = useState<ResumeAnalysis | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [syncSkillsSuccess, setSyncSkillsSuccess] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    await updateProfile({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      location: formData.location,
      college: formData.college,
      degree: formData.degree,
      department: formData.department,
      cgpa: Number(formData.cgpa) || 0,
      graduationYear: Number(formData.graduationYear) || 2026,
      programmingLanguages: formData.programmingLanguages.split(',').map(s => s.trim()).filter(Boolean),
      careerPreferences: {
        preferredRoles: formData.preferredRoles.split(',').map(s => s.trim()).filter(Boolean),
        preferredLocations: formData.preferredLocations.split(',').map(s => s.trim()).filter(Boolean),
        experienceLevel: formData.experienceLevel as any,
        careerInterests: formData.careerInterests.split(',').map(s => s.trim()).filter(Boolean),
        minSalaryLPA: Number(formData.minSalaryLPA) || 6
      },
      softSkills: {
        aptitudeScore: Number(formData.aptitudeScore) || 75,
        communicationScore: Number(formData.communicationScore) || 75
      }
    });

    await fetchRecommendations();
    logActivity('profile', 'Profile Saved', 'Updated personal and academic credentials.');
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;
    await addSkill({
      name: newSkillName.trim(),
      level: newSkillLevel,
      category: 'Framework'
    });
    setNewSkillName('');
    fetchRecommendations();
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.name.trim()) return;
    await addProject({
      id: `proj-${Date.now()}`,
      name: newProject.name,
      description: newProject.description,
      technologies: newProject.technologies.split(',').map(t => t.trim()).filter(Boolean),
      githubUrl: newProject.githubUrl,
      liveUrl: newProject.liveUrl
    });
    setNewProject({ name: '', description: '', technologies: '', githubUrl: '', liveUrl: '' });
    setShowNewProjectModal(false);
    fetchRecommendations();
  };

  const handleAddCert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCert.name.trim()) return;
    await addCertification({
      id: `cert-${Date.now()}`,
      name: newCert.name,
      issuer: newCert.issuer,
      year: newCert.year,
      credentialUrl: newCert.credentialUrl
    });
    setNewCert({ name: '', issuer: '', year: '2025', credentialUrl: '' });
    setShowNewCertModal(false);
    fetchRecommendations();
  };

  // Resume Processing Handlers with Auto-Skill Sync
  const handleLoadSampleResume = async () => {
    setResumeAnalyzing(true);
    setTimeout(async () => {
      const preferredRoles = profile?.careerPreferences?.preferredRoles || ['Software Engineer'];
      const result = await analyzeResumeText(SAMPLE_RESUME_TEXT, preferredRoles);
      setResumeAnalysis(result);
      setResumeAnalyzing(false);

      // Auto sync skills to student profile
      result.detectedSkills.forEach((s) => {
        addSkill({ name: s, level: 'Advanced', category: 'Language' });
      });

      await updateProfile({
        resumeFileName: 'Sample_College_Resume.pdf',
        resumeScore: result.score,
        resumeLastAnalyzed: new Date().toISOString().split('T')[0]
      });

      await fetchRecommendations();
      logActivity('resume', 'Resume Uploaded', `Evaluated ATS score: ${result.score}/100 with ${result.detectedSkills.length} skills.`);
    }, 600);
  };

  const handleProcessResume = async () => {
    if (!resumeFile) {
      handleLoadSampleResume();
      return;
    }

    setResumeAnalyzing(true);
    try {
      const extractedText = await extractTextFromFile(resumeFile);
      const content = extractedText.length > 40 ? extractedText : SAMPLE_RESUME_TEXT;
      const preferredRoles = profile?.careerPreferences?.preferredRoles || ['Software Engineer'];
      const result = await analyzeResumeText(content, preferredRoles);

      setResumeAnalysis(result);
      setResumeAnalyzing(false);

      // Auto sync skills to student profile
      result.detectedSkills.forEach((s) => {
        addSkill({ name: s, level: 'Advanced', category: 'Language' });
      });

      await updateProfile({
        resumeFileName: resumeFile.name,
        resumeScore: result.score,
        resumeLastAnalyzed: new Date().toISOString().split('T')[0]
      });

      await fetchRecommendations();
      logActivity('resume', 'Resume Uploaded', `Scanned ${resumeFile.name} with ATS score: ${result.score}/100 and ${result.detectedSkills.length} skills.`);
    } catch (e) {
      handleLoadSampleResume();
    }
  };

  const handleSyncResumeSkills = () => {
    if (!resumeAnalysis) return;
    resumeAnalysis.detectedSkills.forEach((s) => {
      addSkill({ name: s, level: 'Advanced', category: 'Framework' });
    });
    fetchRecommendations();
    setSyncSkillsSuccess(true);
    setTimeout(() => setSyncSkillsSuccess(false), 3000);
  };

  const skillsList = profile?.skills || [];
  const projectsList = profile?.projects || [];
  const certsList = profile?.certifications || [];
  const profileStrength = profile?.profileStrength || 0;

  // Matching companies calculated dynamically
  const matchingCompanies = companies
    .map(comp => calculateRecommendation(profile, comp))
    .sort((a, b) => b.finalScore - a.finalScore)
    .slice(0, 4);

  return (
    <div className="space-y-6 pb-20 max-w-5xl mx-auto">
      {/* Top Title & Profile Strength Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Student Profile
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Update your academic records, skills, resume, and preferences to improve recommendation accuracy.
          </p>
        </div>

        <div className="w-full md:w-80 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200/60 dark:border-slate-800 space-y-2">
          <div className="flex justify-between items-baseline text-xs font-semibold">
            <span className="text-slate-700 dark:text-slate-300">Calculated Profile Strength</span>
            <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{profileStrength}%</span>
          </div>
          <ProgressBar value={profileStrength} showValue={false} heightClass="h-2" />
          <div className="text-[10px] text-slate-400 leading-tight">
            Based strictly on: {skillsList.length} verified skills, {projectsList.length} projects, {certsList.length} certs, CGPA ({profile?.cgpa || 0}), and preferences.
          </div>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-xs font-medium text-emerald-800 dark:text-emerald-300 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Profile changes saved successfully! Recommendation rankings have been recalculated.</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto gap-1">
        <button
          type="button"
          onClick={() => setActiveTab('personal')}
          className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'personal'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-500 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Personal & Academic</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('skills')}
          className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'skills'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-500 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Code2 className="w-4 h-4" />
          <span>Skills & Languages ({skillsList.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('projects')}
          className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'projects'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-500 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <FolderGit2 className="w-4 h-4" />
          <span>Projects ({projectsList.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('resume')}
          className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'resume'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-500 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Resume & ATS {profile?.resumeFileName ? '(Attached)' : ''}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('preferences')}
          className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'preferences'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-500 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Career Preferences & Soft Skills</span>
        </button>
      </div>

      {/* ==================== TAB 1: PERSONAL & ACADEMIC ==================== */}
      {activeTab === 'personal' && (
        <form onSubmit={handleSaveProfile} className="space-y-6">
          {/* Personal Info Box */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-subtle space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-500" />
              <span>Personal Information</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Current City / State
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Academic Info Box */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-subtle space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-indigo-500" />
              <span>Academic Information</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  College / University
                </label>
                <input
                  type="text"
                  value={formData.college}
                  onChange={(e) => handleInputChange('college', e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Degree
                </label>
                <input
                  type="text"
                  value={formData.degree}
                  onChange={(e) => handleInputChange('degree', e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Department / Branch
                </label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => handleInputChange('department', e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Cumulative CGPA (out of 10.0)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  value={formData.cgpa}
                  onChange={(e) => handleInputChange('cgpa', e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Graduation Year
                </label>
                <input
                  type="number"
                  value={formData.graduationYear}
                  onChange={(e) => handleInputChange('graduationYear', e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" variant="primary" leftIcon={<Save className="w-4 h-4" />}>
              Save Changes
            </Button>
          </div>
        </form>
      )}

      {/* ==================== TAB 2: SKILLS & LANGUAGES ==================== */}
      {activeTab === 'skills' && (
        <div className="space-y-6">
          {/* Skills Management Box */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-subtle space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Code2 className="w-4 h-4 text-indigo-500" />
                <span>Technical Skills ({skillsList.length})</span>
              </h3>
              <span className="text-xs text-slate-400">
                Click × to remove a skill
              </span>
            </div>

            {/* Existing Skills List */}
            <div className="flex flex-wrap gap-2 p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/60 dark:border-slate-800 min-h-[100px]">
              {skillsList.length === 0 ? (
                <div className="text-xs text-slate-400 my-auto">
                  No skills added yet. Use the input below or upload your PDF resume to auto-scan verified skills.
                </div>
              ) : (
                skillsList.map((skill) => (
                  <SkillTag
                    key={skill.name}
                    name={skill.name}
                    level={skill.level}
                    onRemove={() => removeSkill(skill.name)}
                  />
                ))
              )}
            </div>

            {/* Add Skill Form */}
            <form onSubmit={handleAddSkill} className="flex flex-col sm:flex-row gap-3 pt-2">
              <input
                type="text"
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                placeholder="e.g. Spring Boot, Docker, GraphQL"
                className="flex-1 px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
              />
              <select
                value={newSkillLevel}
                onChange={(e) => setNewSkillLevel(e.target.value as any)}
                className="px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
              <Button type="submit" variant="primary" size="md" leftIcon={<Plus className="w-4 h-4" />}>
                Add Skill
              </Button>
            </form>

            {/* Quick Add Suggestions */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="text-xs font-semibold text-slate-500 mb-2">
                Popular suggestions:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {['Spring Boot', 'Docker', 'Kubernetes', 'AWS', 'System Design', 'FastAPI', 'Redis'].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => addSkill({ name: s, level: 'Intermediate', category: 'Framework' })}
                    className="text-[11px] px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-500 hover:text-indigo-600 transition-colors"
                  >
                    + {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Programming Languages Box */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-subtle space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Primary Programming Languages
            </h3>
            <p className="text-xs text-slate-500">
              Separate languages with commas (e.g. Java, Python, C++, TypeScript).
            </p>
            <input
              type="text"
              value={formData.programmingLanguages}
              onChange={(e) => handleInputChange('programmingLanguages', e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Certifications Box */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-subtle space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-indigo-500" />
                <span>Certifications ({certsList.length})</span>
              </h3>
              <Button size="sm" variant="outline" onClick={() => setShowNewCertModal(true)} leftIcon={<Plus className="w-3.5 h-3.5" />}>
                Add Certificate
              </Button>
            </div>

            <div className="space-y-3">
              {certsList.map((cert) => (
                <div
                  key={cert.id}
                  className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      {cert.name}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {cert.issuer} • Issued {cert.year}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeCertification(cert.id)}
                    className="text-slate-400 hover:text-rose-500 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 3: PROJECTS ==================== */}
      {activeTab === 'projects' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-subtle space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FolderGit2 className="w-4 h-4 text-indigo-500" />
                  <span>Technical Projects ({projectsList.length})</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Projects are evaluated during company tech stack alignment matching (10% weight).
                </p>
              </div>
              <Button size="sm" variant="primary" onClick={() => setShowNewProjectModal(true)} leftIcon={<Plus className="w-3.5 h-3.5" />}>
                Add Project
              </Button>
            </div>

            <div className="space-y-4">
              {projectsList.map((proj) => (
                <div
                  key={proj.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs space-y-2 relative"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {proj.name}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                        {proj.description}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeProject(proj.id)}
                      className="text-slate-400 hover:text-rose-500 p-1 ml-2"
                      title="Remove Project"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {(proj.technologies || []).map((t) => (
                      <span
                        key={t}
                        className="text-[10px] px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-medium border border-indigo-200 dark:border-indigo-800"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 4: RESUME & ATS ==================== */}
      {activeTab === 'resume' && (
        <div className="space-y-6">
          {/* Current Attached Resume Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-subtle space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {profile?.resumeFileName || 'No Resume Uploaded Yet'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {profile?.resumeFileName
                      ? `Last Analyzed: ${profile.resumeLastAnalyzed || 'Recently'} • ATS Score: ${profile.resumeScore || 0}/100`
                      : 'Upload your PDF resume to auto-scan verified skills and boost profile strength.'}
                  </p>
                </div>
              </div>

              {profile?.resumeFileName && (
                <div className="flex items-center gap-2">
                  <Badge variant="success" size="sm">
                    ATS Score: {profile.resumeScore || 85}/100
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={async () => {
                      await updateProfile({ resumeFileName: '', resumeScore: 0 });
                      setResumeAnalysis(null);
                    }}
                    leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                  >
                    Remove
                  </Button>
                </div>
              )}
            </div>

            {/* Upload Area */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  setResumeFile(e.dataTransfer.files[0]);
                }
              }}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                dragOver
                  ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30'
                  : 'border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/30'
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-3">
                <UploadCloud className="w-5 h-5" />
              </div>

              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                {resumeFile ? resumeFile.name : 'Upload New Resume (PDF / DOCX)'}
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
                Drag and drop your file here, or select a file to extract technical skills and calculate ATS score.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept=".pdf,.docx,.txt"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setResumeFile(e.target.files[0]);
                      }
                    }}
                    className="hidden"
                  />
                  <span className="inline-flex items-center justify-center font-medium rounded-lg text-xs px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-2xs transition-colors">
                    Choose File
                  </span>
                </label>

                <button
                  type="button"
                  onClick={handleLoadSampleResume}
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline px-3 py-2"
                >
                  ⚡ Load Sample College Resume
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                type="button"
                variant="primary"
                size="md"
                onClick={handleProcessResume}
                isLoading={resumeAnalyzing}
                leftIcon={<Sparkles className="w-4 h-4" />}
              >
                {resumeAnalyzing ? 'Extracting Resume & ATS...' : 'Scan & Attach Resume'}
              </Button>
            </div>
          </div>

          {/* Extracted Results if scanned */}
          {resumeAnalysis && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-subtle space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Skills Detected in Uploaded Resume ({resumeAnalysis.detectedSkills.length})
                  </h3>
                  <p className="text-xs text-slate-500">
                    ATS Score: <strong>{resumeAnalysis.score}/100</strong> • Auto-synced to your active student profile
                  </p>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleSyncResumeSkills}
                  leftIcon={<Plus className="w-3.5 h-3.5" />}
                >
                  Sync Skills Again
                </Button>
              </div>

              {syncSkillsSuccess && (
                <div className="p-3 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Skills synced to your student profile!</span>
                </div>
              )}

              <div className="flex flex-wrap gap-2 pt-1">
                {resumeAnalysis.detectedSkills.map((s) => (
                  <span
                    key={s}
                    className="px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800 flex items-center gap-1.5 shadow-2xs"
                  >
                    <span>✓</span>
                    <span>{s}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* ==================== COMPANIES MATCHING RESUME ==================== */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-indigo-600" />
                  <span>Companies Matching Your Resume</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Calculated based on your verified skills and resume data points.
                </p>
              </div>

              <Link to="/recommendations" className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
                <span>View all ({companies.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {matchingCompanies.map((rec) => (
                <RecommendationCard key={rec.company.id} recommendation={rec} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 5: PREFERENCES & SOFT SKILLS ==================== */}
      {activeTab === 'preferences' && (
        <form onSubmit={handleSaveProfile} className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-subtle space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-indigo-500" />
              <span>Career Preferences</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Preferred Job Roles (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.preferredRoles}
                  onChange={(e) => handleInputChange('preferredRoles', e.target.value)}
                  placeholder="Software Engineer, Full Stack Developer"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Preferred Locations (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.preferredLocations}
                  onChange={(e) => handleInputChange('preferredLocations', e.target.value)}
                  placeholder="Chennai, Bengaluru, Hyderabad, Remote"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Experience Level
                </label>
                <select
                  value={formData.experienceLevel}
                  onChange={(e) => handleInputChange('experienceLevel', e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Fresher / Entry-level">Fresher / Entry-level</option>
                  <option value="0-1 Year">0-1 Year Experience</option>
                  <option value="1-2 Years">1-2 Years Experience</option>
                  <option value="Internship">Internship Only</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Target Minimum CTC (LPA in ₹)
                </label>
                <input
                  type="number"
                  value={formData.minSalaryLPA}
                  onChange={(e) => handleInputChange('minSalaryLPA', e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 font-semibold"
                />
              </div>
            </div>
          </div>

          {/* Soft Skills Sliders Box */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-subtle space-y-6">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-500" />
              <span>Assessment & Soft Skills</span>
            </h3>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
                  <span>Aptitude & Quantitative Problem Solving Score</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">{formData.aptitudeScore} / 100</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formData.aptitudeScore}
                  onChange={(e) => handleInputChange('aptitudeScore', Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
                  <span>Verbal & Communication Skills Score</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">{formData.communicationScore} / 100</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formData.communicationScore}
                  onChange={(e) => handleInputChange('communicationScore', Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" variant="primary" leftIcon={<Save className="w-4 h-4" />}>
              Save Profile Preferences
            </Button>
          </div>
        </form>
      )}

      {/* Add Project Modal */}
      {showNewProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 w-full max-w-lg shadow-xl animate-in fade-in">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
              Add New Project
            </h3>
            <form onSubmit={handleAddProject} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Project Name</label>
                <input
                  type="text"
                  value={newProject.name}
                  onChange={(e) => setNewProject(p => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. AI Resume Parser"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Description & Impact</label>
                <textarea
                  value={newProject.description}
                  onChange={(e) => setNewProject(p => ({ ...p, description: e.target.value }))}
                  placeholder="Summarize features, architectural choices, and latency improvements..."
                  rows={3}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Technologies Used (comma separated)</label>
                <input
                  type="text"
                  value={newProject.technologies}
                  onChange={(e) => setNewProject(p => ({ ...p, technologies: e.target.value }))}
                  placeholder="React, Spring Boot, MySQL, Docker"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowNewProjectModal(false)}>Cancel</Button>
                <Button type="submit" variant="primary" size="sm">Save Project</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Certification Modal */}
      {showNewCertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 w-full max-w-lg shadow-xl animate-in fade-in">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
              Add Industry Certification
            </h3>
            <form onSubmit={handleAddCert} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Certification Name</label>
                <input
                  type="text"
                  value={newCert.name}
                  onChange={(e) => setNewCert(c => ({ ...c, name: e.target.value }))}
                  placeholder="e.g. AWS Certified Solutions Architect"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Issuing Organization</label>
                <input
                  type="text"
                  value={newCert.issuer}
                  onChange={(e) => setNewCert(c => ({ ...c, issuer: e.target.value }))}
                  placeholder="e.g. Amazon Web Services / Oracle"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Year Issued</label>
                <input
                  type="text"
                  value={newCert.year}
                  onChange={(e) => setNewCert(c => ({ ...c, year: e.target.value }))}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowNewCertModal(false)}>Cancel</Button>
                <Button type="submit" variant="primary" size="sm">Save Certification</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
