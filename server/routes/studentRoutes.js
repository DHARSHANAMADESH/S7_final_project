import express from 'express';
import { db } from '../db.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

const SKILL_RULES = [
  { name: 'Java', regex: /\bJava\b(?!\s*script)/i },
  { name: 'JavaScript', regex: /\b(JavaScript|JS|ES6)\b/i },
  { name: 'TypeScript', regex: /\b(TypeScript|TS)\b/i },
  { name: 'Python', regex: /\bPython\b/i },
  { name: 'C++', regex: /\b(C\+\+|CPP)\b/i },
  { name: 'C#', regex: /\b(C#|CSharp|\.NET)\b/i },
  { name: 'C', regex: /\bC\s*(language|programming|\/C\+\+|,\s*C\+\+)\b|\b(with\s+C\b|using\s+C\b)/i },
  { name: 'Go', regex: /\b(Golang|Go\s+language|Go\s+developer|Go\s+backend)\b/i },
  { name: 'Rust', regex: /\bRust\b/i },
  { name: 'Ruby', regex: /\b(Ruby|Ruby on Rails|Rails)\b/i },
  { name: 'PHP', regex: /\bPHP\b/i },
  { name: 'SQL', regex: /\bSQL\b/i },
  { name: 'HTML/CSS', regex: /\b(HTML|CSS|HTML5|CSS3|HTML\/CSS)\b/i },
  { name: 'React', regex: /\b(React|React\.js|ReactJS|React Native)\b/i },
  { name: 'Angular', regex: /\b(Angular|AngularJS)\b/i },
  { name: 'Vue.js', regex: /\b(Vue|Vue\.js|VueJS)\b/i },
  { name: 'Node.js', regex: /\b(Node|Node\.js|NodeJS)\b/i },
  { name: 'Express', regex: /\b(Express|Express\.js|ExpressJS)\b/i },
  { name: 'Spring Boot', regex: /\b(Spring\s*Boot|Spring\s*Framework|Spring)\b/i },
  { name: 'Django', regex: /\bDjango\b/i },
  { name: 'Flask', regex: /\bFlask\b/i },
  { name: 'FastAPI', regex: /\bFastAPI\b/i },
  { name: 'Next.js', regex: /\b(Next\.js|NextJS)\b/i },
  { name: 'Tailwind CSS', regex: /\b(Tailwind|Tailwindcss|Tailwind\s*CSS)\b/i },
  { name: 'MySQL', regex: /\bMySQL\b/i },
  { name: 'PostgreSQL', regex: /\b(PostgreSQL|Postgres)\b/i },
  { name: 'MongoDB', regex: /\b(MongoDB|Mongo)\b/i },
  { name: 'Redis', regex: /\bRedis\b/i },
  { name: 'Oracle DB', regex: /\b(Oracle|Oracle\s*DB|Oracle\s*Database)\b/i },
  { name: 'Git', regex: /\b(Git|GitHub|GitLab)\b/i },
  { name: 'Docker', regex: /\bDocker\b/i },
  { name: 'Kubernetes', regex: /\b(Kubernetes|K8s)\b/i },
  { name: 'AWS', regex: /\b(AWS|Amazon Web Services)\b/i },
  { name: 'Azure', regex: /\b(Azure|Microsoft Azure)\b/i },
  { name: 'GCP', regex: /\b(GCP|Google Cloud)\b/i },
  { name: 'Linux', regex: /\b(Linux|Ubuntu|CentOS)\b/i },
  { name: 'REST API', regex: /\b(REST|RESTful|REST\s*API|REST\s*APIs)\b/i },
  { name: 'GraphQL', regex: /\bGraphQL\b/i },
  { name: 'Microservices', regex: /\bMicroservices\b/i },
  { name: 'Data Structures & Algorithms', regex: /\b(DSA|Data\s*Structures|Algorithms)\b/i },
  { name: 'Object Oriented Programming', regex: /\b(OOP|OOPS|Object\s*Oriented)\b/i },
  { name: 'DBMS', regex: /\bDBMS\b/i },
  { name: 'System Design', regex: /\bSystem\s*Design\b/i },
  { name: 'Machine Learning', regex: /\b(Machine\s*Learning|ML)\b/i },
  { name: 'Pandas', regex: /\bPandas\b/i },
  { name: 'NumPy', regex: /\bNumPy\b/i },
  { name: 'TensorFlow', regex: /\bTensorFlow\b/i },
  { name: 'Power BI', regex: /\bPower\s*BI\b/i }
];

/**
 * GET /api/student/profile
 * Returns profile belonging ONLY to the verified authenticated user.
 */
router.get('/profile', authenticateToken, (req, res) => {
  const profile = db.getStudentProfile(req.user.id);
  res.json(profile);
});

/**
 * PUT /api/student/profile
 * Updates profile belonging ONLY to the verified authenticated user.
 */
router.put('/profile', authenticateToken, (req, res) => {
  const updates = req.body;
  const updatedProfile = db.updateStudentProfile(req.user.id, updates);
  res.json(updatedProfile);
});

/**
 * POST /api/student/resume
 * Extracts skills, CGPA and ATS score for the logged-in user's profile.
 */
router.post('/resume', authenticateToken, (req, res) => {
  const { resumeText, fileName } = req.body;

  if (!resumeText) {
    return res.status(400).json({ error: 'Resume text or file content is required' });
  }

  // Extract skills strictly using word boundary regexes
  const detectedSkills = [];
  SKILL_RULES.forEach(rule => {
    if (rule.regex.test(resumeText)) {
      if (!detectedSkills.includes(rule.name)) {
        detectedSkills.push(rule.name);
      }
    }
  });

  // Extract CGPA if present
  let extractedCgpa = null;
  const cgpaMatch = resumeText.match(/\b(?:cgpa|gpa|score)\s*[:=-]?\s*([0-9]+\.[0-9]+|[0-9]+)\b/i);
  if (cgpaMatch && cgpaMatch[1]) {
    extractedCgpa = parseFloat(cgpaMatch[1]);
  }

  // Calculate ATS Score
  let atsScore = 45;
  if (detectedSkills.length >= 6) atsScore += 25;
  else if (detectedSkills.length >= 3) atsScore += 15;
  else if (detectedSkills.length >= 1) atsScore += 8;

  if (resumeText.length > 400) atsScore += 10;
  if (resumeText.toLowerCase().includes('github') || resumeText.toLowerCase().includes('project')) atsScore += 10;
  atsScore = Math.min(95, Math.max(50, atsScore));

  // Update student profile with extracted skills and resume status
  const currentProfile = db.getStudentProfile(req.user.id);
  const existingSkillNames = (currentProfile.skills || []).map(s => (typeof s === 'string' ? s : s.name).toLowerCase());

  const newSkillsToAdd = detectedSkills
    .filter(s => !existingSkillNames.includes(s.toLowerCase()))
    .map(name => ({ name, level: 'Advanced', category: 'Language' }));

  const updatedSkills = [...(currentProfile.skills || []), ...newSkillsToAdd];

  const profileUpdates = {
    skills: updatedSkills,
    resumeFileName: fileName || 'Uploaded_Resume.pdf',
    resumeScore: atsScore,
    resumeLastAnalyzed: new Date().toISOString().split('T')[0]
  };

  if (extractedCgpa && (!currentProfile.cgpa || currentProfile.cgpa === 0)) {
    profileUpdates.cgpa = extractedCgpa;
  }

  const savedProfile = db.updateStudentProfile(req.user.id, profileUpdates);

  res.json({
    score: atsScore,
    detectedSkills,
    extractedCgpa,
    profile: savedProfile
  });
});

/**
 * GET /api/student/all
 * Admin-only: Returns student directory records
 */
router.get('/all', authenticateToken, requireAdmin, (req, res) => {
  const students = db.getAllStudentsWithProfiles();
  res.json(students);
});

export default router;
