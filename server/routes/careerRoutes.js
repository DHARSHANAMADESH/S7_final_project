import express from 'express';
import { db } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';
import { calculateRecommendationForStudent } from '../services/recommendationEngine.js';

const router = express.Router();

/**
 * POST /api/career-assistant
 * Generates personalized AI career guidance based on the authenticated student's real profile.
 */
router.post('/', authenticateToken, (req, res) => {
  const studentId = req.user.id;
  const profile = db.getStudentProfile(studentId);
  const prompt = (req.body.prompt || req.body.message || '').trim();

  const studentSkills = (profile.skills || []).map(s => typeof s === 'string' ? s : s.name);
  const studentLangs = profile.programmingLanguages || [];
  const allSkills = [...new Set([...studentSkills, ...studentLangs])];
  const preferredRoles = profile.careerPreferences?.preferredRoles || [];
  const preferredLocations = profile.careerPreferences?.preferredLocations || [];
  const studentProjects = profile.projects || [];
  const studentCerts = profile.certifications || [];
  const cgpa = Number(profile.cgpa) || 0;

  // Check for empty/incomplete profile
  if (allSkills.length === 0 && preferredRoles.length === 0 && cgpa === 0) {
    return res.json({
      text: 'Please complete your skills and preferred job role to receive personalized career guidance.',
      action: { label: 'Complete Profile Now', link: '/profile' }
    });
  }

  // Calculate live matching against database companies
  const companies = db.getCompanies();
  const scoredMatches = companies
    .map(c => calculateRecommendationForStudent(profile, c))
    .sort((a, b) => b.finalScore - a.finalScore);

  const topMatch = scoredMatches[0];
  const topCompany = topMatch?.company;
  const targetRole = topMatch?.targetRole?.title || preferredRoles[0] || 'Software Engineer';
  const missingSkills = topMatch?.missingSkills || [];
  const matchedSkills = topMatch?.matchedSkills || [];

  const pLower = prompt.toLowerCase();

  // 1. Resume Improvement Guidance
  if (pLower.includes('resume') || pLower.includes('cv') || pLower.includes('ats')) {
    const primaryProj = studentProjects[0]?.name || 'Capstone Project';
    const topReqSkills = (topCompany?.requiredSkills || []).slice(0, 3).join(', ');
    
    let text = `Based on your authenticated profile (${allSkills.length} skills, CGPA: ${cgpa.toFixed(1)}):\n\n`;
    text += `1. **Highlight Project Metrics**: For your project "${primaryProj}", describe the impact with quantifiable metrics (e.g. "improved throughput by 40% using ${allSkills.slice(0, 2).join(' & ')}").\n`;
    if (missingSkills.length > 0) {
      text += `2. **Address Top Skill Gaps**: Top recruiters like ${topCompany?.name || 'Zoho and Microsoft'} prioritize **${missingSkills.slice(0, 2).join(', ')}** for ${targetRole} positions.\n`;
    }
    if (studentCerts.length === 0) {
      text += `3. **Add Industry Certifications**: Adding verified credentials (e.g., AWS Cloud Practitioner, Oracle Java, or Meta Frontend) will increase your recruiter visibility score.\n`;
    } else {
      text += `3. **Leverage Existing Certifications**: Ensure your "${studentCerts[0]?.name}" certification is highlighted in the executive summary.\n`;
    }
    text += `4. **ATS Keyword Alignment**: Ensure your resume includes exact keywords: ${topReqSkills || allSkills.slice(0, 4).join(', ')}.`;

    return res.json({
      text,
      action: { label: 'Open Resume Analyzer', link: '/resume-analyzer' }
    });
  }

  // 2. Interview Preparation Strategy
  if (pLower.includes('interview') || pLower.includes('prepare') || pLower.includes('crack') || pLower.includes('round')) {
    const compName = topCompany?.name || 'Top Campus Recruiters';
    const hiringSteps = topCompany?.hiringProcess || [
      { step: 1, title: 'Online Assessment', description: 'DSA and aptitude test' },
      { step: 2, title: 'Technical Interview', description: 'Core CS and live coding' },
      { step: 3, title: 'HR & Management', description: 'Culture and communication' }
    ];

    let text = `High-yield interview preparation plan for **${compName}** (${targetRole} • ${topCompany?.salaryDisplay || 'Competitive CTC'}):\n\n`;
    hiringSteps.forEach(s => {
      text += `• **${s.title}**: ${s.description}\n`;
    });
    text += `\n**Key CS Areas for Your Profile**:\n`;
    text += `• **Language Mastery**: In-depth revision of ${allSkills.slice(0, 2).join(' and ')} internals and memory models.\n`;
    text += `• **Data Structures**: Focus on Trees, HashMaps, and Dynamic Programming algorithms.\n`;
    text += `• **Database & SQL**: Indexing, transactions (ACID), and query optimizations.`;

    return res.json({
      text,
      action: { label: `View ${compName} Details`, link: topCompany ? `/recommendations/${topCompany.id}` : '/recommendations' }
    });
  }

  // 3. Finding Suitable Companies
  if (pLower.includes('suitable') || pLower.includes('companies') || pLower.includes('recommend') || pLower.includes('match') || pLower.includes('jobs')) {
    const top3 = scoredMatches.slice(0, 4).map(r =>
      `• **${r.company.name}** — **${r.finalScore}% Match** (${r.targetRole.title}, ${r.company.salaryDisplay}, Cutoff: ${r.company.minimumCgpa} CGPA)`
    ).join('\n');

    let text = `Based on your real-time academic profile (CGPA: ${cgpa.toFixed(1)}, Skills: ${allSkills.slice(0, 4).join(', ')}):\n\n`;
    text += `Here are your top-ranking compatible companies:\n\n${top3}\n\n`;
    text += `Your highest compatibility aligns with **${targetRole}** positions in ${preferredLocations.join(', ') || 'major tech hubs'}.`;

    return res.json({
      text,
      action: { label: 'Explore All Matches', link: '/recommendations' }
    });
  }

  // 4. Skill Roadmap Creation
  if (pLower.includes('roadmap') || pLower.includes('path') || pLower.includes('learn') || pLower.includes('curriculum')) {
    const firstGap = missingSkills[0] || 'Enterprise System Design';
    const secondGap = missingSkills[1] || 'Cloud & Docker Deployment';
    const coreSkill = allSkills[0] || 'Core Java/Python';

    let text = `Here is your customized 4-week placement skill roadmap for **${targetRole}**:\n\n`;
    text += `• **Week 1 (${coreSkill} & DSA)**: Master advanced data structures, graph traversals, and dynamic programming optimization.\n`;
    text += `• **Week 2 (${firstGap})**: Deep dive into ${firstGap} architectural patterns, building a production-ready module.\n`;
    text += `• **Week 3 (${secondGap})**: Containerize your existing projects and integrate CI/CD workflows.\n`;
    text += `• **Week 4 (Mock Interviews & Viva)**: Conduct whiteboard system architecture reviews and behavioral practice.\n\n`;
    text += `Completing these target milestones will maximize your eligibility for Tier-1 engineering roles.`;

    return res.json({
      text,
      action: { label: 'Update Profile Skills', link: '/profile' }
    });
  }

  // 5. Skill Gap Analysis
  if (pLower.includes('gap') || pLower.includes('missing') || pLower.includes('weakness') || pLower.includes('improve')) {
    let text = `Skill Gap Analysis for **${profile.name}** (Targeting: ${targetRole}):\n\n`;
    if (missingSkills.length > 0) {
      text += `The primary skill gaps identified against top recruiters (${topCompany?.name || 'Tier-1 Companies'}) are:\n\n`;
      missingSkills.slice(0, 4).forEach(gap => {
        text += `• **${gap}**: Highly prioritized for enterprise development and coding rounds.\n`;
      });
      text += `\nAcquiring these skills will increase your match score by up to **+15%**.`;
    } else {
      text += `Excellent! Your profile covers the core required skill set for **${topCompany?.name || 'your target roles'}**. Focus on system design complexity and mock coding tests.`;
    }

    return res.json({
      text,
      action: { label: 'Add Skills to Profile', link: '/profile' }
    });
  }

  // Default / General Query Response tailored to the user's authentic data
  const currentSkillsList = allSkills.length > 0 ? allSkills.join(', ') : 'None specified yet';
  let text = `For **${profile.name}** (CGPA: ${cgpa.toFixed(1)}, Skills: ${currentSkillsList}):\n\n`;
  text += `Based on your profile, your highest matching opportunity is **${topCompany?.name || 'Software Engineering'}** (${topMatch?.finalScore || 85}% Match score).\n\n`;
  text += `You can ask me to:\n`;
  text += `• Analyze your skill gaps for specific companies\n`;
  text += `• Give tailored interview rounds for ${topCompany?.name || 'target companies'}\n`;
  text += `• Provide a personalized 4-week roadmap\n`;
  text += `• Suggest resume optimizations for ${targetRole} roles`;

  return res.json({
    text,
    action: { label: 'View Recommendations', link: '/recommendations' }
  });
});

export default router;
