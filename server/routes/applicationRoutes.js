import express from 'express';
import { db } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /api/applications
 * Retrieves applications for the currently authenticated student.
 */
router.get('/', authenticateToken, (req, res) => {
  const apps = db.getApplications(req.user.id);
  res.json(apps);
});

/**
 * POST /api/applications
 * Creates a new application for the currently authenticated student.
 */
router.post('/', authenticateToken, (req, res) => {
  const { companyId, roleId, matchScore, notes } = req.body;
  const company = db.getCompanyById(companyId);

  if (!company) {
    return res.status(404).json({ error: 'Company not found' });
  }

  const studentProfile = db.getStudentProfile(req.user.id);
  const targetRole = (company.openRoles || []).find(r => r.id === roleId) || (company.openRoles && company.openRoles[0]) || {
    id: `${companyId}-role`,
    title: 'Software Developer',
    salary: company.salaryDisplay
  };

  const newApp = db.createApplication({
    studentId: req.user.id,
    studentName: studentProfile.name,
    companyId: company.id,
    companyName: company.name,
    companyLogo: company.logo,
    roleId: targetRole.id,
    roleTitle: targetRole.title,
    status: 'Applied',
    matchScore: matchScore || 85,
    salary: company.salaryDisplay,
    location: company.locations?.[0] || 'Chennai',
    notes: notes || `Submitted application for ${targetRole.title}`
  });

  res.status(201).json(newApp);
});

/**
 * PUT /api/applications/:id
 * Updates application if owned by authenticated student or admin.
 */
router.put('/:id', authenticateToken, (req, res) => {
  const existingApp = db.getApplicationById(req.params.id);
  if (!existingApp) {
    return res.status(404).json({ error: 'Application not found' });
  }

  if (existingApp.studentId !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: You do not have permission to modify this application.' });
  }

  const updated = db.updateApplication(req.params.id, req.body);
  res.json(updated);
});

/**
 * DELETE /api/applications/:id
 * Deletes application if owned by authenticated student or admin.
 */
router.delete('/:id', authenticateToken, (req, res) => {
  const existingApp = db.getApplicationById(req.params.id);
  if (!existingApp) {
    return res.status(404).json({ error: 'Application not found' });
  }

  if (existingApp.studentId !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: You do not have permission to delete this application.' });
  }

  db.deleteApplication(req.params.id);
  res.json({ message: 'Application deleted successfully' });
});

/**
 * GET /api/applications/saved/list
 * Returns saved company IDs for authenticated student.
 */
router.get('/saved/list', authenticateToken, (req, res) => {
  const savedIds = db.getSavedCompanyIds(req.user.id);
  res.json(savedIds);
});

/**
 * POST /api/applications/saved/:companyId
 * Toggles saved status for a company.
 */
router.post('/saved/:companyId', authenticateToken, (req, res) => {
  const isSaved = db.toggleSavedCompany(req.user.id, req.params.companyId);
  res.json({ isSaved, savedIds: db.getSavedCompanyIds(req.user.id) });
});

export default router;
