import { normalizeSkill, isSkillMatched } from './skillNormalizer.js';

/**
 * Deterministic, transparent weighted matching algorithm
 * Computed purely from student's profile data and company records in DB.
 */
export function calculateRecommendationForStudent(student, company) {
  const targetRole = (company.openRoles && company.openRoles[0]) || {
    id: `${company.id}-default`,
    title: 'Software Developer',
    department: 'Engineering',
    location: company.locations?.[0] || 'Chennai',
    type: 'Full-time',
    salary: company.salaryDisplay || '₹6–10 LPA',
    minLPA: company.minLPA || 6,
    maxLPA: company.maxLPA || 10,
    openings: 10,
    requirements: company.requiredSkills || []
  };

  // Collect student technical skills
  const studentSkillNames = (student.skills || []).map(s => typeof s === 'string' ? s : s.name);
  const studentLangNames = student.programmingLanguages || [];
  const allStudentSkills = [...new Set([...studentSkillNames, ...studentLangNames])];

  // 1. Skill Match (30% Weight)
  const requiredSkills = company.requiredSkills || [];
  const matchedSkills = [];
  const missingSkills = [];

  requiredSkills.forEach(reqSkill => {
    if (isSkillMatched(reqSkill, allStudentSkills)) {
      matchedSkills.push(reqSkill);
    } else {
      missingSkills.push(reqSkill);
    }
  });

  const preferredSkills = company.preferredSkills || [];
  let preferredMatchedCount = 0;
  preferredSkills.forEach(prefSkill => {
    if (isSkillMatched(prefSkill, allStudentSkills)) {
      preferredMatchedCount++;
    }
  });

  let skillScore = 0;
  if (requiredSkills.length > 0) {
    const baseMatchRatio = (matchedSkills.length / requiredSkills.length) * 100;
    const prefBonus = preferredSkills.length > 0 ? (preferredMatchedCount / preferredSkills.length) * 10 : 0;
    skillScore = Math.min(100, Math.round(baseMatchRatio + prefBonus));
  } else {
    skillScore = 80;
  }

  // 2. CGPA Match (15% Weight)
  const studentCgpa = Number(student.cgpa) || 0;
  const minCgpa = Number(company.minimumCgpa) || 6.0;
  const cgpaEligible = studentCgpa >= minCgpa;
  let cgpaScore = 0;

  if (cgpaEligible) {
    const margin = studentCgpa - minCgpa;
    cgpaScore = Math.min(100, Math.round(85 + margin * 10));
  } else {
    const deficit = minCgpa - studentCgpa;
    cgpaScore = Math.max(0, Math.round(70 - deficit * 35));
  }

  // 3. Role Match (15% Weight)
  const prefRoles = (student.careerPreferences?.preferredRoles || []).map(r => r.toLowerCase());
  const roleTitleLower = targetRole.title.toLowerCase();
  let roleScore = 60;

  if (prefRoles.length === 0) {
    roleScore = 70;
  } else if (prefRoles.some(pr => roleTitleLower.includes(pr) || pr.includes(roleTitleLower))) {
    roleScore = 100;
  } else if (
    (roleTitleLower.includes('software') && prefRoles.some(p => p.includes('developer') || p.includes('engineer'))) ||
    (roleTitleLower.includes('data') && prefRoles.some(p => p.includes('analyst') || p.includes('scientist') || p.includes('ml'))) ||
    (roleTitleLower.includes('devops') && prefRoles.some(p => p.includes('cloud') || p.includes('sre') || p.includes('infrastructure')))
  ) {
    roleScore = 90;
  } else {
    roleScore = 65;
  }

  // 4. Location Match (10% Weight)
  const prefLocations = (student.careerPreferences?.preferredLocations || []).map(l => l.toLowerCase());
  const companyLocations = (company.locations || []).map(l => l.toLowerCase());
  let locationScore = 60;

  if (prefLocations.length === 0) {
    locationScore = 75;
  } else if (companyLocations.some(cl => prefLocations.some(pl => cl.includes(pl) || pl.includes(cl)))) {
    locationScore = 100;
  } else if (prefLocations.includes('remote')) {
    locationScore = 85;
  } else {
    locationScore = 60;
  }

  // 5. Project Tech Overlap Match (10% Weight)
  const studentProjects = student.projects || [];
  const companyStack = (company.techStack || []).map(t => normalizeSkill(t).toLowerCase());
  let matchedProjectTechCount = 0;

  studentProjects.forEach(proj => {
    (proj.technologies || []).forEach(tech => {
      const norm = normalizeSkill(tech).toLowerCase();
      if (companyStack.some(cs => cs === norm || cs.includes(norm) || norm.includes(cs))) {
        matchedProjectTechCount++;
      }
    });
  });

  let projectScore = 60;
  if (studentProjects.length > 0) {
    projectScore = Math.min(100, Math.max(50, 60 + matchedProjectTechCount * 10 + (studentProjects.length >= 2 ? 15 : 5)));
  } else {
    projectScore = 40;
  }

  // 6. Certification Match (5% Weight)
  const certs = student.certifications || [];
  let certScore = certs.length >= 2 ? 100 : certs.length === 1 ? 85 : 50;

  // 7. Experience Match (5% Weight)
  const expLevel = student.careerPreferences?.experienceLevel || 'Fresher / Entry-level';
  let expScore = expLevel.toLowerCase().includes('fresher') ? 95 : 85;

  // 8. Aptitude Score (5% Weight)
  const aptitudeScore = Number(student.softSkills?.aptitudeScore) || 80;

  // 9. Communication Score (5% Weight)
  const communicationScore = Number(student.softSkills?.communicationScore) || 80;

  // Weighted Sum Calculation
  const finalScore = Math.min(99, Math.max(30, Math.round(
    (skillScore * 0.30) +
    (cgpaScore * 0.15) +
    (roleScore * 0.15) +
    (locationScore * 0.10) +
    (projectScore * 0.10) +
    (certScore * 0.05) +
    (expScore * 0.05) +
    (aptitudeScore * 0.05) +
    (communicationScore * 0.05)
  )));

  // Generate Personalized Natural Language Reasons
  const reasons = [];
  if (matchedSkills.length > 0) {
    reasons.push(`Your ${matchedSkills.slice(0, 3).join(' and ')} skills match ${matchedSkills.length} of the required technical skills for this role.`);
  }
  if (cgpaEligible) {
    reasons.push(`Your CGPA of ${studentCgpa.toFixed(1)} is above the required ${minCgpa.toFixed(1)} eligibility cutoff.`);
  } else {
    reasons.push(`Your CGPA of ${studentCgpa.toFixed(1)} is currently below the preferred cutoff of ${minCgpa.toFixed(1)}.`);
  }
  if (locationScore >= 85) {
    const locMatch = (student.careerPreferences?.preferredLocations || [])[0] || company.locations[0];
    reasons.push(`Your preferred location (${locMatch}) matches the company's active recruitment office.`);
  }
  if (missingSkills.length > 0) {
    reasons.push(`You currently need to improve ${missingSkills.slice(0, 2).join(' and ')}.`);
  }

  // 5-Step Tailored Preparation Plan
  const firstMissing = missingSkills[0] || 'System Design & Scalability';
  const secondMissing = missingSkills[1] || 'REST API & Cloud Deployment';
  const primarySkill = allStudentSkills[0] || 'Programming Fundamentals';

  const preparationPlan = [
    {
      step: 1,
      action: `Master ${firstMissing} fundamentals`,
      details: `Study key architectural concepts and enterprise patterns for ${firstMissing}.`,
      estimatedTime: '3–5 days'
    },
    {
      step: 2,
      action: `Build a project module demonstrating ${firstMissing}`,
      details: `Create a functional demo integrating ${firstMissing} with ${primarySkill}.`,
      estimatedTime: '1 week'
    },
    {
      step: 3,
      action: `Practice Core CS & ${primarySkill} interview problems`,
      details: `Solve data structures, algorithm complexity, and SQL queries relevant to ${company.name}.`,
      estimatedTime: '4–6 days'
    },
    {
      step: 4,
      action: `Prepare for ${company.name}'s assessment rounds`,
      details: `Review past interview questions for ${(company.hiringProcess?.[0]?.title) || 'Online Assessment'}.`,
      estimatedTime: '2–3 days'
    },
    {
      step: 5,
      action: `Mock Technical Interview & Viva Practice`,
      details: `Practice explaining project architecture, edge cases, and role compatibility.`,
      estimatedTime: '2 days'
    }
  ];

  return {
    company: {
      id: company.id,
      name: company.name,
      logo: company.logo,
      industry: company.industry,
      description: company.description,
      locations: company.locations,
      salaryDisplay: company.salaryDisplay,
      minLPA: company.minLPA,
      maxLPA: company.maxLPA,
      minimumCgpa: company.minimumCgpa,
      requiredSkills: company.requiredSkills,
      preferredSkills: company.preferredSkills,
      techStack: company.techStack,
      hiringStatus: company.hiringStatus,
      hiringProcess: company.hiringProcess,
      benefits: company.benefits,
      companySize: company.companySize,
      applicationDeadline: company.applicationDeadline
    },
    targetRole,
    finalScore,
    matchScore: finalScore,
    breakdown: {
      skillScore,
      cgpaScore,
      roleScore,
      locationScore,
      projectScore,
      certificationScore: certScore,
      experienceScore: expScore,
      aptitudeScore,
      communicationScore
    },
    matchedSkills,
    missingSkills,
    cgpaEligible,
    reasons,
    explanation: {
      summary: `Your profile demonstrates a ${finalScore}% overall compatibility with ${company.name} for the ${targetRole.title} position based on your skills, academic standing, and preferences.`,
      reasons,
      strengths: reasons.filter(r => !r.includes('below') && !r.includes('need to improve')),
      gaps: missingSkills.map(m => `Missing required skill: ${m}`)
    },
    preparationPlan
  };
}
