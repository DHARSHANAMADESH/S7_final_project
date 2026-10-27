import { Company, StudentProfile, RecommendationResult, RecommendationBreakdown, PreparationPlanStep } from '../types';

/**
 * Deterministic, transparent weighted matching algorithm:
 * Skill Match (30%)
 * CGPA Eligibility (15%)
 * Role Match (15%)
 * Location Match (10%)
 * Project Match (10%)
 * Certification Match (5%)
 * Experience Match (5%)
 * Aptitude Score (5%)
 * Communication Score (5%)
 */
export function calculateRecommendation(student: StudentProfile, company: Company): RecommendationResult {
  const targetRole = company.openRoles[0] || {
    id: `${company.id}-default`,
    title: 'Software Engineer',
    department: 'Engineering',
    location: company.locations[0] || 'Chennai',
    type: 'Full-time',
    salary: company.salaryDisplay,
    minLPA: company.minLPA,
    maxLPA: company.maxLPA,
    openings: 10,
    requirements: company.requiredSkills
  };

  const studentSkillsLower = student.skills.map(s => s.name.toLowerCase());
  const studentLangsLower = student.programmingLanguages.map(l => l.toLowerCase());
  const allStudentTechnicalLower = [...new Set([...studentSkillsLower, ...studentLangsLower])];

  // 1. Skill Match (Weight: 30%)
  const requiredSkills = company.requiredSkills;
  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];

  requiredSkills.forEach(req => {
    const reqLower = req.toLowerCase();
    const isMatched = allStudentTechnicalLower.some(
      s => s.includes(reqLower) || reqLower.includes(s)
    );
    if (isMatched) {
      matchedSkills.push(req);
    } else {
      missingSkills.push(req);
    }
  });

  const preferredSkills = company.preferredSkills || [];
  let preferredBonus = 0;
  preferredSkills.forEach(pref => {
    const prefLower = pref.toLowerCase();
    if (allStudentTechnicalLower.some(s => s.includes(prefLower) || prefLower.includes(s))) {
      preferredBonus += 5;
    }
  });

  const baseSkillRatio = requiredSkills.length > 0 ? (matchedSkills.length / requiredSkills.length) * 100 : 80;
  const skillScore = Math.min(100, Math.round(baseSkillRatio + (preferredBonus / (preferredSkills.length || 1))));

  // 2. CGPA Match (Weight: 15%)
  const cgpaEligible = student.cgpa >= company.minimumCgpa;
  let cgpaScore = 0;
  if (cgpaEligible) {
    const margin = student.cgpa - company.minimumCgpa;
    // Base 85 points for meeting minimum, up to 100 for exceeding
    cgpaScore = Math.min(100, Math.round(85 + margin * 10));
  } else {
    // Partial score if close
    const deficit = company.minimumCgpa - student.cgpa;
    cgpaScore = Math.max(0, Math.round(70 - deficit * 35));
  }

  // 3. Role Match (Weight: 15%)
  const prefRolesLower = student.careerPreferences.preferredRoles.map(r => r.toLowerCase());
  let roleScore = 60;
  const targetTitleLower = targetRole.title.toLowerCase();
  
  if (prefRolesLower.some(pr => targetTitleLower.includes(pr) || pr.includes(targetTitleLower))) {
    roleScore = 100;
  } else if (
    (targetTitleLower.includes('software') && prefRolesLower.some(p => p.includes('developer') || p.includes('engineer'))) ||
    (targetTitleLower.includes('developer') && prefRolesLower.some(p => p.includes('software')))
  ) {
    roleScore = 90;
  } else {
    roleScore = 70;
  }

  // 4. Location Match (Weight: 10%)
  const prefLocationsLower = student.careerPreferences.preferredLocations.map(l => l.toLowerCase());
  const companyLocationsLower = company.locations.map(l => l.toLowerCase());
  const hasRemotePref = prefLocationsLower.includes('remote');
  const locationMatches = companyLocationsLower.some(cl => prefLocationsLower.includes(cl));
  const locationScore = locationMatches ? 100 : hasRemotePref ? 85 : 60;

  // 5. Project Match (Weight: 10%)
  let projectTechMatches = 0;
  student.projects.forEach(proj => {
    proj.technologies.forEach(tech => {
      const tLower = tech.toLowerCase();
      if (company.techStack.some(ct => ct.toLowerCase().includes(tLower) || tLower.includes(ct.toLowerCase()))) {
        projectTechMatches++;
      }
    });
  });
  const projectScore = Math.min(100, Math.max(50, 60 + projectTechMatches * 10 + (student.projects.length >= 2 ? 15 : 5)));

  // 6. Certification Match (Weight: 5%)
  const certScore = student.certifications.length >= 2 ? 100 : student.certifications.length === 1 ? 85 : 60;

  // 7. Experience Match (Weight: 5%)
  const experienceScore = student.careerPreferences.experienceLevel.includes('Fresher') ? 95 : 85;

  // 8. Aptitude Score (Weight: 5%)
  const aptitudeScore = student.softSkills.aptitudeScore || 80;

  // 9. Communication Score (Weight: 5%)
  const communicationScore = student.softSkills.communicationScore || 80;

  // Weighted Total calculation
  const weightedSum =
    (skillScore * 0.30) +
    (cgpaScore * 0.15) +
    (roleScore * 0.15) +
    (locationScore * 0.10) +
    (projectScore * 0.10) +
    (certScore * 0.05) +
    (experienceScore * 0.05) +
    (aptitudeScore * 0.05) +
    (communicationScore * 0.05);

  const finalScore = Math.min(99, Math.max(35, Math.round(weightedSum)));

  const breakdown: RecommendationBreakdown = {
    skillScore,
    cgpaScore,
    roleScore,
    locationScore,
    projectScore,
    certificationScore: certScore,
    experienceScore,
    aptitudeScore,
    communicationScore
  };

  // Structured Explanation Generation
  const strengths: string[] = [];
  const reasons: string[] = [];
  const gaps: string[] = [];

  if (matchedSkills.length > 0) {
    strengths.push(`Your ${matchedSkills.slice(0, 3).join(', ')} skills strongly match the requirements for this role.`);
    reasons.push(`Core technical stack alignment on ${matchedSkills.slice(0, 2).join(' and ')}.`);
  }

  if (cgpaEligible) {
    strengths.push(`Your CGPA (${student.cgpa.toFixed(1)}) exceeds the minimum eligibility threshold (${company.minimumCgpa.toFixed(1)}).`);
    reasons.push(`Academically eligible for on-campus & direct recruitment.`);
  } else {
    gaps.push(`Your CGPA (${student.cgpa.toFixed(1)}) is below the stated cutoff of ${company.minimumCgpa.toFixed(1)}.`);
  }

  if (locationMatches) {
    reasons.push(`Preferred location matches available branch in ${company.locations[0]}.`);
  }

  if (missingSkills.length > 0) {
    gaps.push(`Key skills to acquire: ${missingSkills.slice(0, 3).join(', ')}.`);
  }

  const explanationSummary = `Your profile demonstrates a ${finalScore}% overall compatibility with ${company.name} for the ${targetRole.title} position based on your skills, academic standing, and project portfolio.`;

  // Tailored 5-step preparation plan
  const firstMissing = missingSkills[0] || 'Advanced System Design';
  const secondMissing = missingSkills[1] || 'Cloud Deployment (Docker/AWS)';
  const primaryLang = student.programmingLanguages[0] || 'Java';

  const preparationPlan: PreparationPlanStep[] = [
    {
      step: 1,
      action: `Master ${firstMissing} fundamentals`,
      details: `Review core concepts, architecture patterns, and standard use cases for ${firstMissing}.`,
      estimatedTime: '3–5 days',
      completed: false
    },
    {
      step: 2,
      action: `Build a mini application using ${firstMissing} & ${secondMissing}`,
      details: `Develop a practical project or add a module to an existing project demonstrating hands-on proficiency.`,
      estimatedTime: '1 week',
      completed: false
    },
    {
      step: 3,
      action: `Practice SQL queries and ${primaryLang} Data Structures`,
      details: `Solve medium-level challenges on joins, indexing, trees, dynamic programming, and complexity analysis.`,
      estimatedTime: '4–6 days',
      completed: false
    },
    {
      step: 4,
      action: `Prepare for ${company.name}'s specific hiring rounds`,
      details: `Review previous interview patterns for ${company.hiringProcess[0]?.title || 'Online Assessment'} and ${company.hiringProcess[1]?.title || 'Technical Round'}.`,
      estimatedTime: '2–3 days',
      completed: false
    },
    {
      step: 5,
      action: `Conduct Mock Technical & Behavioral Viva`,
      details: `Practice explaining your project architecture, edge cases handled, and role-specific leadership scenarios.`,
      estimatedTime: '2 days',
      completed: false
    }
  ];

  return {
    company,
    targetRole,
    finalScore,
    breakdown,
    matchedSkills,
    missingSkills,
    cgpaEligible,
    explanation: {
      summary: explanationSummary,
      strengths,
      reasons,
      gaps
    },
    preparationPlan
  };
}

/**
 * Calculates profile strength percentage (0-100) strictly from user-entered portfolio data
 * Returns 0% if no core academic, skill, or project data has been entered.
 */
export function calculateProfileStrength(profile: Partial<StudentProfile>): number {
  if (!profile) return 0;

  const skillsCount = (profile.skills || []).length;
  const projectsCount = (profile.projects || []).length;
  const certsCount = (profile.certifications || []).length;
  const hasCgpa = profile.cgpa && Number(profile.cgpa) > 0;
  const hasResume = Boolean(profile.resumeFileName || (profile.resumeScore && profile.resumeScore > 0));

  // If user hasn't entered any placement data, strength is strictly 0%
  if (skillsCount === 0 && projectsCount === 0 && certsCount === 0 && !hasCgpa && !hasResume) {
    return 0;
  }

  let score = 0;

  // 1. Verified Technical Skills (30% max: 5% per skill, up to 6 skills)
  score += Math.min(30, skillsCount * 5);

  // 2. Projects (30% max: 15% per project, up to 2 projects)
  score += Math.min(30, projectsCount * 15);

  // 3. Academic Credentials (20% max: CGPA: 10%, College: 5%, Department: 5%)
  if (hasCgpa) score += 10;
  if (profile.college && profile.college.trim()) score += 5;
  if (profile.department && profile.department.trim()) score += 5;

  // 4. Certifications (10% max: 5% per certification, up to 2 certs)
  score += Math.min(10, certsCount * 5);

  // 5. Career Preferences (5% max)
  if (profile.careerPreferences?.preferredRoles?.length) score += 5;

  // 6. Resume Uploaded & Scanned (5% max)
  if (hasResume) score += 5;

  return Math.min(100, Math.max(0, score));
}
