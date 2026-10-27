import express from 'express';
import { db, computeProfileStrength } from '../db.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /api/admin/dashboard
 * Returns comprehensive, computed placement dashboard analytics.
 * All data is derived from the actual database — nothing is hardcoded.
 */
router.get('/dashboard', authenticateToken, requireAdmin, (req, res) => {
  try {
    // ========== 1. Students ==========
    const allUsers = db.data.users || [];
    const studentUsers = allUsers.filter(u => u.role === 'student');
    const totalStudents = studentUsers.length;

    // Build full profile data for each student
    const studentProfiles = studentUsers.map(u => {
      const prof = db.getStudentProfile(u.id);
      return {
        userId: u.id,
        name: u.name || prof.name,
        email: u.email || prof.email,
        cgpa: prof.cgpa || 0,
        skills: (prof.skills || []).map(s => typeof s === 'string' ? s : s.name),
        profileStrength: prof.profileStrength || computeProfileStrength(prof),
        hasResume: Boolean(prof.resumeFileName),
        college: prof.college || '',
        department: prof.department || '',
        graduationYear: prof.graduationYear || 2026,
        careerPreferences: prof.careerPreferences || {}
      };
    });

    // Profile completion: consider >= 60% strength as "complete"
    const PROFILE_COMPLETE_THRESHOLD = 60;
    const studentsWithCompleteProfile = studentProfiles.filter(
      s => s.profileStrength >= PROFILE_COMPLETE_THRESHOLD
    );
    const studentsWithIncompleteProfile = studentProfiles.filter(
      s => s.profileStrength < PROFILE_COMPLETE_THRESHOLD
    );
    const avgProfileStrength = totalStudents > 0
      ? Math.round(studentProfiles.reduce((sum, s) => sum + s.profileStrength, 0) / totalStudents)
      : 0;

    // ========== 2. Companies ==========
    const companies = db.getCompanies() || [];
    const totalCompanies = companies.length;
    const activeCompanies = companies.filter(c => c.hiringStatus === 'Currently Hiring');
    const upcomingCompanies = companies.filter(c => c.hiringStatus === 'Hiring Soon');
    const totalOpenings = companies.reduce((sum, c) => {
      return sum + (c.openRoles || []).reduce((rs, r) => rs + (r.openings || 0), 0);
    }, 0);

    // ========== 3. Applications ==========
    const allApplications = db.data.applications || [];
    const totalApplications = allApplications.length;

    // Status breakdown
    const statusCounts = {};
    const APPLICATION_STATUSES = ['Applied', 'Assessment', 'Technical Interview', 'HR', 'Selected', 'Rejected'];
    APPLICATION_STATUSES.forEach(s => { statusCounts[s] = 0; });
    allApplications.forEach(app => {
      const st = app.status || 'Applied';
      statusCounts[st] = (statusCounts[st] || 0) + 1;
    });

    // Pending = Applied + Assessment + Technical Interview + HR (not yet final)
    const pendingCount = (statusCounts['Applied'] || 0) +
                         (statusCounts['Assessment'] || 0) +
                         (statusCounts['Technical Interview'] || 0) +
                         (statusCounts['HR'] || 0);
    const selectedCount = statusCounts['Selected'] || 0;
    const rejectedCount = statusCounts['Rejected'] || 0;

    // ========== 4. Placement Statistics ==========
    // Unique students who have at least one "Selected" application
    const selectedStudentIds = new Set();
    allApplications.forEach(app => {
      if (app.status === 'Selected') {
        selectedStudentIds.add(app.studentId);
      }
    });
    const uniqueStudentsPlaced = selectedStudentIds.size;

    // Eligible students = those with profileStrength >= threshold AND cgpa > 0
    const eligibleStudents = studentProfiles.filter(s => s.cgpa > 0 && s.profileStrength >= PROFILE_COMPLETE_THRESHOLD);
    const eligibleCount = eligibleStudents.length;

    // Placement percentage = unique placed / total students * 100
    const placementPercentage = totalStudents > 0
      ? Math.round((uniqueStudentsPlaced / totalStudents) * 100)
      : 0;

    // ========== 5. Recommendations data ==========
    // Count how many companies each student could be recommended to (all companies)
    // This is the total potential student-company match pairs
    const totalRecommendationPairs = totalStudents * totalCompanies;

    // Students who have received recommendations = students with complete profiles
    // (since recommendations require a non-empty profile)
    const studentsWithRecommendations = studentsWithCompleteProfile.length;

    // ========== 6. Skill distribution (from actual student profiles) ==========
    const skillCountMap = {};
    studentProfiles.forEach(s => {
      s.skills.forEach(skill => {
        skillCountMap[skill] = (skillCountMap[skill] || 0) + 1;
      });
    });

    // Sort skills by count descending and take top 10
    const skillDistribution = Object.entries(skillCountMap)
      .map(([skill, count]) => ({ skill, students: count }))
      .sort((a, b) => b.students - a.students)
      .slice(0, 10);

    // ========== 7. Skills demanded by companies ==========
    const demandedSkillMap = {};
    companies.forEach(c => {
      (c.requiredSkills || []).forEach(skill => {
        demandedSkillMap[skill] = (demandedSkillMap[skill] || 0) + 1;
      });
    });

    const demandedSkills = Object.entries(demandedSkillMap)
      .map(([skill, companyCount]) => ({ skill, companyCount }))
      .sort((a, b) => b.companyCount - a.companyCount)
      .slice(0, 10);

    // Skill gaps: skills demanded by >=3 companies but possessed by fewer than half the students
    const skillGaps = demandedSkills
      .filter(ds => {
        const studentCount = skillCountMap[ds.skill] || 0;
        return ds.companyCount >= 2 && studentCount < totalStudents * 0.5;
      })
      .map(ds => ({
        skill: ds.skill,
        demandedByCompanies: ds.companyCount,
        studentsWithSkill: skillCountMap[ds.skill] || 0
      }));

    // ========== 8. Application funnel with conversion rates ==========
    const applicationFunnel = APPLICATION_STATUSES.map((status, idx) => {
      const count = statusCounts[status] || 0;
      let conversionFromPrev = null;
      if (idx > 0 && idx < 4) {
        // Funnel stages: Applied -> Assessment -> Technical Interview -> HR
        const prevStatus = APPLICATION_STATUSES[idx - 1];
        const prevCount = statusCounts[prevStatus] || 0;
        conversionFromPrev = prevCount > 0 ? Math.round((count / prevCount) * 100) : 0;
      }
      return { status, count, conversionFromPrev };
    });

    // ========== 9. Insights (actionable) ==========
    // Students with incomplete profiles
    const incompleteProfileStudents = studentsWithIncompleteProfile.map(s => ({
      name: s.name,
      email: s.email,
      profileStrength: s.profileStrength
    }));

    // Eligible students who haven't applied anywhere
    const studentIdsWithApplications = new Set(allApplications.map(a => a.studentId));
    const eligibleNotApplied = eligibleStudents
      .filter(s => !studentIdsWithApplications.has(s.userId))
      .map(s => ({ name: s.name, email: s.email, cgpa: s.cgpa, profileStrength: s.profileStrength }));

    // Students without recommendations (incomplete profile)
    const studentsWithoutRecommendations = studentsWithIncompleteProfile.map(s => ({
      name: s.name,
      email: s.email,
      profileStrength: s.profileStrength,
      reason: s.skills.length === 0 ? 'No skills added' : s.cgpa === 0 ? 'No CGPA entered' : 'Profile incomplete'
    }));

    // Applications awaiting decisions (pending status)
    const pendingApplications = allApplications
      .filter(a => !['Selected', 'Rejected'].includes(a.status))
      .map(a => ({
        studentName: a.studentName || 'Unknown',
        companyName: a.companyName || 'Unknown',
        roleTitle: a.roleTitle || 'N/A',
        status: a.status,
        appliedDate: a.appliedDate
      }));

    // Most recommended companies (companies with most student-skill matches)
    // We'll rank by how many students meet their minimum CGPA and have >=1 required skill
    const companyMatchCounts = companies.map(c => {
      const matchingStudents = studentProfiles.filter(s => {
        const meetsCgpa = s.cgpa >= (c.minimumCgpa || 0);
        const hasRequiredSkill = (c.requiredSkills || []).some(rs =>
          s.skills.some(ss => ss.toLowerCase() === rs.toLowerCase())
        );
        return meetsCgpa && hasRequiredSkill;
      });
      return {
        name: c.name,
        id: c.id,
        matchingStudents: matchingStudents.length,
        hiringStatus: c.hiringStatus,
        totalOpenings: (c.openRoles || []).reduce((sum, r) => sum + (r.openings || 0), 0)
      };
    }).sort((a, b) => b.matchingStudents - a.matchingStudents);

    // ========== Response ==========
    res.json({
      // Summary KPIs
      students: {
        total: totalStudents,
        eligible: eligibleCount,
        profileComplete: studentsWithCompleteProfile.length,
        profileIncomplete: studentsWithIncompleteProfile.length,
        avgProfileStrength,
        profileCompleteThreshold: PROFILE_COMPLETE_THRESHOLD
      },
      companies: {
        total: totalCompanies,
        active: activeCompanies.length,
        upcoming: upcomingCompanies.length,
        totalOpenings
      },
      applications: {
        total: totalApplications,
        pending: pendingCount,
        selected: selectedCount,
        rejected: rejectedCount,
        statusBreakdown: statusCounts
      },
      placements: {
        uniqueStudentsPlaced,
        placementPercentage,
        denominatorUsed: `${totalStudents} total registered students`
      },
      recommendations: {
        totalPotentialMatches: totalRecommendationPairs,
        studentsWithRecommendations,
        studentsWithoutRecommendations: studentsWithoutRecommendations.length
      },

      // Charts
      skillDistribution,
      applicationFunnel,
      demandedSkills,
      skillGaps,
      topRecruiters: companyMatchCounts.slice(0, 8),

      // Insights
      insights: {
        incompleteProfileStudents,
        eligibleNotApplied,
        studentsWithoutRecommendations,
        pendingApplications,
        upcomingDrives: upcomingCompanies.map(c => ({
          name: c.name,
          hiringStatus: c.hiringStatus,
          deadline: c.applicationDeadline,
          openings: (c.openRoles || []).reduce((sum, r) => sum + (r.openings || 0), 0)
        }))
      }
    });
  } catch (err) {
    console.error('Admin dashboard error:', err);
    res.status(500).json({ error: 'Failed to compute dashboard analytics' });
  }
});

export default router;
