import React, { useState } from 'react';
import {
  Building2,
  Plus,
  Edit2,
  Trash2,
  Search,
  ExternalLink,
  MapPin,
  DollarSign,
  Users,
  CheckCircle2
} from 'lucide-react';
import { Button, Badge, Modal } from '../components/common/UIComponents';
import { useCompanyStore } from '../store';
import { Company } from '../types';

export const AdminCompaniesPage: React.FC = () => {
  const { companies, addCompany, updateCompany, deleteCompany, toggleHiringStatus } = useCompanyStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    industry: 'Software / SaaS',
    description: '',
    website: 'https://',
    headquarters: 'Bengaluru, India',
    locations: 'Bengaluru, Chennai, Hyderabad',
    salaryDisplay: '₹8–14 LPA',
    minLPA: 8,
    maxLPA: 14,
    minimumCgpa: 7.0,
    requiredSkills: 'Java, React, SQL, DSA',
    preferredSkills: 'Spring Boot, Docker',
    techStack: 'Java, React, PostgreSQL, AWS',
    companySize: '5,000+ Employees',
    hiringStatus: 'Currently Hiring' as Company['hiringStatus'],
    tier: 'Tier-2' as Company['tier'],
    roleTitle: 'Software Engineer',
    roleSalary: '₹8–14 LPA',
    applicationDeadline: '2026-10-31'
  });

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({
      name: '',
      industry: 'Software / SaaS',
      description: '',
      website: 'https://',
      headquarters: 'Bengaluru, India',
      locations: 'Bengaluru, Chennai',
      salaryDisplay: '₹8–14 LPA',
      minLPA: 8,
      maxLPA: 14,
      minimumCgpa: 7.0,
      requiredSkills: 'Java, React, SQL, DSA',
      preferredSkills: 'Spring Boot, Docker',
      techStack: 'Java, React, PostgreSQL',
      companySize: '5,000+ Employees',
      hiringStatus: 'Currently Hiring',
      tier: 'Tier-2',
      roleTitle: 'Software Engineer',
      roleSalary: '₹8–14 LPA',
      applicationDeadline: '2026-10-31'
    });
    setShowModal(true);
  };

  const openEditModal = (comp: Company) => {
    setEditingId(comp.id);
    setFormData({
      name: comp.name,
      industry: comp.industry,
      description: comp.description,
      website: comp.website,
      headquarters: comp.headquarters,
      locations: comp.locations.join(', '),
      salaryDisplay: comp.salaryDisplay,
      minLPA: comp.minLPA,
      maxLPA: comp.maxLPA,
      minimumCgpa: comp.minimumCgpa,
      requiredSkills: comp.requiredSkills.join(', '),
      preferredSkills: comp.preferredSkills.join(', '),
      techStack: comp.techStack.join(', '),
      companySize: comp.companySize,
      hiringStatus: comp.hiringStatus,
      tier: comp.tier,
      roleTitle: comp.openRoles[0]?.title || 'Software Engineer',
      roleSalary: comp.openRoles[0]?.salary || comp.salaryDisplay,
      applicationDeadline: comp.applicationDeadline
    });
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const companyPayload = {
      name: formData.name,
      logo: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=100&auto=format&fit=crop&q=80',
      industry: formData.industry,
      description: formData.description || `${formData.name} is a leading enterprise software provider offering innovative solutions.`,
      website: formData.website,
      headquarters: formData.headquarters,
      locations: formData.locations.split(',').map(s => s.trim()).filter(Boolean),
      salaryDisplay: formData.salaryDisplay,
      minLPA: Number(formData.minLPA),
      maxLPA: Number(formData.maxLPA),
      minimumCgpa: Number(formData.minimumCgpa),
      requiredSkills: formData.requiredSkills.split(',').map(s => s.trim()).filter(Boolean),
      preferredSkills: formData.preferredSkills.split(',').map(s => s.trim()).filter(Boolean),
      techStack: formData.techStack.split(',').map(s => s.trim()).filter(Boolean),
      companySize: formData.companySize,
      hiringStatus: formData.hiringStatus,
      tier: formData.tier,
      rating: 4.5,
      applicationDeadline: formData.applicationDeadline,
      benefits: ['Health Insurance', 'Learning Stipend', 'Performance Bonus', 'Work From Anywhere Flexibility'],
      hiringProcess: [
        { step: 1, title: 'Online Assessment', description: 'Aptitude & Coding questions' },
        { step: 2, title: 'Technical Interview', description: 'Data structures and problem solving' },
        { step: 3, title: 'HR Round', description: 'Culture fit and offer discussion' }
      ],
      openRoles: [
        {
          id: `role-${Date.now()}`,
          title: formData.roleTitle,
          department: 'Engineering',
          location: formData.locations.split(',')[0]?.trim() || 'Chennai',
          type: 'Full-time' as const,
          salary: formData.roleSalary,
          minLPA: Number(formData.minLPA),
          maxLPA: Number(formData.maxLPA),
          openings: 25,
          requirements: formData.requiredSkills.split(',').map(s => s.trim()).filter(Boolean)
        }
      ]
    };

    if (editingId) {
      updateCompany(editingId, companyPayload);
    } else {
      addCompany(companyPayload);
    }

    setShowModal(false);
  };

  const filteredCompanies = companies.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.industry.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Company Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Add recruiting companies, set minimum CGPA cutoffs, required skills, and update hiring statuses.
          </p>
        </div>

        <Button size="sm" variant="primary" onClick={openCreateModal} leftIcon={<Plus className="w-3.5 h-3.5" />}>
          Add New Company
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search companies by name or industry..."
          className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Companies Management Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-subtle">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px] sm:text-sm text-slate-600 dark:text-slate-400">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="py-3.5 px-4">Company</th>
                <th className="py-3.5 px-4">Industry</th>
                <th className="py-3.5 px-4">Min CGPA</th>
                <th className="py-3.5 px-4">Package</th>
                <th className="py-3.5 px-4">Required Skills</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-normal">
              {filteredCompanies.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img src={c.logo} alt={c.name} className="w-8 h-8 rounded-lg object-cover border shrink-0" />
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white text-[13px] sm:text-sm">{c.name}</div>
                        <div className="text-xs text-slate-400">{c.locations[0]}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">{c.industry}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">{c.minimumCgpa}</td>
                  <td className="py-3.5 px-4 text-emerald-600 dark:text-emerald-400 font-semibold">{c.salaryDisplay}</td>
                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {c.requiredSkills.slice(0, 3).map((s) => (
                        <span key={s} className="text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-700 dark:text-slate-300">
                          {s}
                        </span>
                      ))}
                      {c.requiredSkills.length > 3 && (
                        <span className="text-[10px] text-slate-400">+{c.requiredSkills.length - 3}</span>
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <select
                      value={c.hiringStatus}
                      onChange={(e) => toggleHiringStatus(c.id, e.target.value as any)}
                      className="text-[11px] font-semibold py-1 px-2 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200"
                    >
                      <option value="Currently Hiring">Currently Hiring</option>
                      <option value="Hiring Soon">Hiring Soon</option>
                      <option value="Off-Campus">Off-Campus</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openEditModal(c)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                        title="Edit company"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Are you sure you want to remove ${c.name}?`)) {
                            deleteCompany(c.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                        title="Delete company"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Company Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingId ? 'Edit Company Profile' : 'Add New Recruiting Company'}
        maxWidth="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium mb-1">Company Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(d => ({ ...d, name: e.target.value }))}
                placeholder="e.g. Atlassian"
                className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Industry</label>
              <input
                type="text"
                value={formData.industry}
                onChange={(e) => setFormData(d => ({ ...d, industry: e.target.value }))}
                placeholder="Software / SaaS / FinTech"
                className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-medium mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(d => ({ ...d, description: e.target.value }))}
              placeholder="Company profile and work culture..."
              rows={2}
              className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium mb-1">Minimum CGPA Cutoff</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={formData.minimumCgpa}
                onChange={(e) => setFormData(d => ({ ...d, minimumCgpa: Number(e.target.value) }))}
                className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Package Display (CTC)</label>
              <input
                type="text"
                value={formData.salaryDisplay}
                onChange={(e) => setFormData(d => ({ ...d, salaryDisplay: e.target.value }))}
                placeholder="e.g. ₹10–16 LPA"
                className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium mb-1">Locations (comma separated)</label>
              <input
                type="text"
                value={formData.locations}
                onChange={(e) => setFormData(d => ({ ...d, locations: e.target.value }))}
                placeholder="Bengaluru, Chennai, Hyderabad"
                className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Hiring Status</label>
              <select
                value={formData.hiringStatus}
                onChange={(e) => setFormData(d => ({ ...d, hiringStatus: e.target.value as any }))}
                className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
              >
                <option value="Currently Hiring">Currently Hiring</option>
                <option value="Hiring Soon">Hiring Soon</option>
                <option value="Off-Campus">Off-Campus</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-medium mb-1">Required Skills (comma separated)</label>
            <input
              type="text"
              value={formData.requiredSkills}
              onChange={(e) => setFormData(d => ({ ...d, requiredSkills: e.target.value }))}
              placeholder="Java, React, SQL, DSA"
              className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Tech Stack (comma separated)</label>
            <input
              type="text"
              value={formData.techStack}
              onChange={(e) => setFormData(d => ({ ...d, techStack: e.target.value }))}
              placeholder="Java, Spring, React, AWS"
              className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <Button type="button" variant="outline" size="sm" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              {editingId ? 'Save Changes' : 'Create Company'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
