import express from 'express';
import { db } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';
import { calculateRecommendationForStudent } from '../services/recommendationEngine.js';

const router = express.Router();

/**
 * GET /api/recommendations
 * Computes live, personalized recommendation results for the currently authenticated user.
 */
router.get('/', authenticateToken, (req, res) => {
  const studentId = req.user.id;
  const studentProfile = db.getStudentProfile(studentId);

  // Check if profile is completely empty
  const hasSkills = studentProfile.skills && studentProfile.skills.length > 0;
  const hasAcademic = studentProfile.cgpa && Number(studentProfile.cgpa) > 0;
  const hasResume = Boolean(studentProfile.resumeFileName);

  if (!hasSkills && !hasAcademic && !hasResume) {
    return res.json({
      status: 'incomplete_profile',
      message: 'Complete your profile to get personalized company recommendations.',
      studentId,
      studentName: studentProfile.name,
      totalMatches: 0,
      recommendations: []
    });
  }

  const companies = db.getCompanies();

  // Calculate recommendation for every company using the active student's real profile
  let results = companies.map(comp => calculateRecommendationForStudent(studentProfile, comp));

  // Query parameters filtering
  const { search, location, role, minScore, hiringStatus, sortBy } = req.query;

  if (search && typeof search === 'string' && search.trim()) {
    const q = search.toLowerCase().trim();
    results = results.filter(r =>
      r.company.name.toLowerCase().includes(q) ||
      r.targetRole.title.toLowerCase().includes(q) ||
      (r.company.techStack || []).some(t => t.toLowerCase().includes(q)) ||
      r.matchedSkills.some(s => s.toLowerCase().includes(q))
    );
  }

  if (location && location !== 'all') {
    results = results.filter(r =>
      (r.company.locations || []).some(l => l.toLowerCase() === location.toLowerCase())
    );
  }

  if (role && role !== 'all') {
    results = results.filter(r =>
      r.targetRole.title.toLowerCase().includes(role.toLowerCase())
    );
  }

  if (minScore && Number(minScore) > 0) {
    results = results.filter(r => r.finalScore >= Number(minScore));
  }

  if (hiringStatus && hiringStatus !== 'all') {
    results = results.filter(r => r.company.hiringStatus === hiringStatus);
  }

  // Sorting
  results.sort((a, b) => {
    if (sortBy === 'salary_desc') return (b.company.maxLPA || 0) - (a.company.maxLPA || 0);
    if (sortBy === 'cgpa_asc') return (a.company.minimumCgpa || 0) - (b.company.minimumCgpa || 0);
    if (sortBy === 'name_asc') return a.company.name.localeCompare(b.company.name);
    return b.finalScore - a.finalScore; // Default: match_desc
  });

  res.json({
    status: 'success',
    studentId,
    studentName: studentProfile.name,
    studentCgpa: studentProfile.cgpa,
    studentSkillsCount: (studentProfile.skills || []).length,
    totalMatches: results.length,
    recommendations: results
  });
});

export default router;
