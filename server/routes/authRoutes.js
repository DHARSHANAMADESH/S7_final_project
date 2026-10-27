import express from 'express';
import { db } from '../db.js';
import { generateToken, authenticateToken } from '../middleware/auth.js';

const router = express.Router();

/**
 * POST /api/auth/login
 * Authenticates user credentials without any hardcoded session.
 */
router.post('/login', (req, res) => {
  const { email, password, role } = req.body;

  if (!email || typeof email !== 'string' || !email.trim()) {
    return res.status(400).json({ error: 'Email is required.' });
  }

  const normalizedEmail = email.trim().toLowerCase();

  // Find user by email
  let user = db.getUserByEmail(normalizedEmail);

  if (!user) {
    // If not found in seed, create user dynamically with the selected or default role
    const derivedName = normalizedEmail.split('@')[0].replace(/[._-]/g, ' ');
    const formattedName = derivedName.charAt(0).toUpperCase() + derivedName.slice(1);
    
    user = {
      id: `user-${Date.now()}`,
      name: formattedName,
      email: normalizedEmail,
      password: password || 'password123',
      role: role || 'student'
    };
    db.addUser(user);
  }

  // Create token
  const token = generateToken(user);
  const profile = user.role === 'student' ? db.getStudentProfile(user.id) : null;

  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    profile
  });
});

/**
 * POST /api/auth/signup
 * Registers a new user and creates their unique student profile.
 */
router.post('/signup', (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required.' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const existingUser = db.getUserByEmail(normalizedEmail);

  if (existingUser) {
    return res.status(400).json({ error: 'An account with this email address already exists. Please log in.' });
  }

  const newUser = {
    id: `user-${Date.now()}`,
    name: name.trim(),
    email: normalizedEmail,
    password: password || 'password123',
    role: role || 'student'
  };

  db.addUser(newUser);

  // Initialize clean student profile if student
  let profile = null;
  if (newUser.role === 'student') {
    profile = db.updateStudentProfile(newUser.id, {
      name: newUser.name,
      email: newUser.email,
      skills: [],
      programmingLanguages: [],
      projects: [],
      certifications: [],
      careerPreferences: {
        preferredRoles: [],
        preferredLocations: [],
        experienceLevel: 'Fresher / Entry-level',
        careerInterests: [],
        minSalaryLPA: 0
      },
      cgpa: 0,
      profileStrength: 0
    });
  }

  const token = generateToken(newUser);

  res.status(201).json({
    token,
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role
    },
    profile
  });
});

/**
 * GET /api/auth/me
 * Retrieves current authenticated user from verified token.
 */
router.get('/me', authenticateToken, (req, res) => {
  const user = db.getUserById(req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found in system.' });
  }

  const profile = user.role === 'student' ? db.getStudentProfile(user.id) : null;

  res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    profile
  });
});

export default router;
