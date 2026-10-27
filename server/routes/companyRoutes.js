import express from 'express';
import { db } from '../db.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /api/companies
 * Retrieves all company listings from database.
 */
router.get('/', (req, res) => {
  const companies = db.getCompanies();
  res.json(companies);
});

/**
 * GET /api/companies/:id
 * Retrieves specific company by ID.
 */
router.get('/:id', (req, res) => {
  const company = db.getCompanyById(req.params.id);
  if (!company) {
    return res.status(404).json({ error: 'Company not found' });
  }
  res.json(company);
});

/**
 * POST /api/companies
 * Admin only: creates a new company record.
 */
router.post('/', authenticateToken, requireAdmin, (req, res) => {
  const newCompany = db.addCompany(req.body);
  res.status(201).json(newCompany);
});

/**
 * PUT /api/companies/:id
 * Admin only: updates company information.
 */
router.put('/:id', authenticateToken, requireAdmin, (req, res) => {
  const updated = db.updateCompany(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Company not found' });
  }
  res.json(updated);
});

/**
 * DELETE /api/companies/:id
 * Admin only: deletes company listing.
 */
router.delete('/:id', authenticateToken, requireAdmin, (req, res) => {
  const success = db.deleteCompany(req.params.id);
  if (!success) {
    return res.status(404).json({ error: 'Company not found' });
  }
  res.json({ message: 'Company deleted successfully' });
});

export default router;
