import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  Plus,
  Edit2,
  Trash2,
  LayoutGrid,
  List as ListIcon
} from 'lucide-react';
import { Button, Badge, Modal, EmptyState } from '../components/common/UIComponents';
import { useApplicationStore, useCompanyStore } from '../store';
import { ApplicationStatus, Application } from '../types';

const STATUS_COLUMNS: { key: ApplicationStatus; label: string; badgeVariant: any }[] = [
  { key: 'Applied', label: 'Applied', badgeVariant: 'neutral' },
  { key: 'Assessment', label: 'Online Assessment', badgeVariant: 'primary' },
  { key: 'Technical Interview', label: 'Tech Interview', badgeVariant: 'warning' },
  { key: 'HR', label: 'HR Round', badgeVariant: 'indigo' },
  { key: 'Selected', label: 'Selected / Offer', badgeVariant: 'success' },
  { key: 'Rejected', label: 'Archived / Rejected', badgeVariant: 'danger' }
];

export const ApplicationsPage: React.FC = () => {
  const { applications, updateApplicationStatus, updateApplicationNotes, deleteApplication, applyToCompany } = useApplicationStore();
  const { companies } = useCompanyStore();

  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [editingNotes, setEditingNotes] = useState('');
  const [editingStatus, setEditingStatus] = useState<ApplicationStatus>('Applied');
  const [editingDate, setEditingDate] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);

  // New Application Modal
  const [showNewAppModal, setShowNewAppModal] = useState(false);
  const [newCompanyId, setNewCompanyId] = useState(companies[0]?.id || '');
  const [newNotes, setNewNotes] = useState('');

  const openEditModal = (app: Application) => {
    setSelectedApp(app);
    setEditingNotes(app.notes || '');
    setEditingStatus(app.status);
    setEditingDate(app.nextRoundDate || '');
    setShowEditModal(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp) return;
    updateApplicationStatus(selectedApp.id, editingStatus);
    updateApplicationNotes(selectedApp.id, editingNotes, editingDate);
    setShowEditModal(false);
  };

  const handleCreateNewApp = (e: React.FormEvent) => {
    e.preventDefault();
    const comp = companies.find(c => c.id === newCompanyId);
    if (!comp) return;
    applyToCompany(comp, comp.openRoles[0]?.id, 85, newNotes);
    setShowNewAppModal(false);
    setNewNotes('');
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Application Tracker
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track your recruitment stages, upcoming assessment dates, and interview logs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setViewMode('board')}
              className={`p-1.5 rounded-md text-xs font-semibold flex items-center gap-1 transition-colors ${
                viewMode === 'board'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Pipeline</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md text-xs font-semibold flex items-center gap-1 transition-colors ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <ListIcon className="w-3.5 h-3.5" />
              <span>List</span>
            </button>
          </div>

          <Button
            size="sm"
            variant="primary"
            onClick={() => setShowNewAppModal(true)}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Add Application
          </Button>
        </div>
      </div>

      {applications.length === 0 ? (
        <EmptyState
          icon={<Briefcase className="w-8 h-8" />}
          title="No applications tracked yet"
          description="Apply directly to recommended companies or log external applications."
          actionText="Explore Recommendations"
          onAction={() => window.location.href = '/recommendations'}
        />
      ) : viewMode === 'board' ? (
        /* ==================== KANBAN PIPELINE VIEW ==================== */
        <div className="flex gap-4 overflow-x-auto pb-6 pt-1 items-start min-h-[520px] scrollbar-thin">
          {STATUS_COLUMNS.map((column) => {
            const columnApps = applications.filter(a => a.status === column.key);
            
            // Accent colors per column
            const columnColors: Record<string, { dot: string; headerBg: string; border: string }> = {
              'Applied': { dot: 'bg-blue-500', headerBg: 'bg-blue-50/50 dark:bg-blue-950/20', border: 'border-blue-200/60 dark:border-blue-900/40' },
              'Assessment': { dot: 'bg-indigo-500', headerBg: 'bg-indigo-50/50 dark:bg-indigo-950/20', border: 'border-indigo-200/60 dark:border-indigo-900/40' },
              'Technical Interview': { dot: 'bg-amber-500', headerBg: 'bg-amber-50/50 dark:bg-amber-950/20', border: 'border-amber-200/60 dark:border-amber-900/40' },
              'HR': { dot: 'bg-purple-500', headerBg: 'bg-purple-50/50 dark:bg-purple-950/20', border: 'border-purple-200/60 dark:border-purple-900/40' },
              'Selected': { dot: 'bg-emerald-500', headerBg: 'bg-emerald-50/50 dark:bg-emerald-950/20', border: 'border-emerald-200/60 dark:border-emerald-900/40' },
              'Rejected': { dot: 'bg-rose-500', headerBg: 'bg-rose-50/50 dark:bg-rose-950/20', border: 'border-rose-200/60 dark:border-rose-900/40' },
            };
            const colTheme = columnColors[column.key] || { dot: 'bg-slate-500', headerBg: 'bg-slate-50 dark:bg-slate-800', border: 'border-slate-200 dark:border-slate-800' };

            return (
              <div
                key={column.key}
                className="w-72 shrink-0 flex flex-col bg-slate-50/90 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 shadow-sm min-h-[480px]"
              >
                {/* Column Header */}
                <div className={`flex items-center justify-between px-3 py-2 rounded-xl mb-3 border ${colTheme.headerBg} ${colTheme.border}`}>
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${colTheme.dot} shrink-0 animate-pulse`} />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                      {column.label}
                    </span>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 shadow-2xs">
                    {columnApps.length}
                  </span>
                </div>

                {/* Cards in Column */}
                <div className="space-y-3 flex-1 flex flex-col">
                  {columnApps.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 dark:border-slate-800/80 rounded-xl text-center">
                      <p className="text-xs font-medium text-slate-400 dark:text-slate-500">
                        No applications in this stage
                      </p>
                    </div>
                  ) : (
                    columnApps.map((app) => (
                      <div
                        key={app.id}
                        onClick={() => openEditModal(app)}
                        className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-xs hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700 transition-all cursor-pointer space-y-2.5 relative"
                      >
                        <div className="flex items-start gap-2.5">
                          <img
                            src={app.companyLogo || 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=100&auto=format&fit=crop&q=60'}
                            alt={app.companyName}
                            className="w-9 h-9 rounded-lg object-cover border border-slate-100 dark:border-slate-800 shrink-0 shadow-2xs"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=100&auto=format&fit=crop&q=60';
                            }}
                          />
                          <div className="min-w-0 flex-1">
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                              {app.companyName}
                            </h4>
                            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">
                              {app.roleTitle}
                            </p>
                          </div>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-900/50 shrink-0">
                            {app.matchScore}% Match
                          </span>
                        </div>

                        {app.salary && (
                          <div className="text-[11px] text-slate-600 dark:text-slate-400 font-semibold flex items-center gap-1.5">
                            <Briefcase className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="truncate">{app.salary}</span>
                          </div>
                        )}

                        <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {app.appliedDate}
                          </span>
                          <span className="text-indigo-600 dark:text-indigo-400 font-semibold group-hover:underline">
                            Edit / Move &rarr;
                          </span>
                        </div>

                        {app.nextRoundDate && (
                          <div className="text-[10px] font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900/50 px-2 py-1 rounded-lg flex items-center gap-1.5">
                            <Calendar className="w-3 h-3 text-amber-600 dark:text-amber-400 shrink-0" />
                            <span className="truncate">Upcoming: {app.nextRoundDate}</span>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* ==================== LIST VIEW ==================== */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-subtle divide-y divide-slate-100 dark:divide-slate-800">
          {applications.map((app) => (
            <div
              key={app.id}
              className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
            >
              <div className="flex items-start sm:items-center gap-3">
                <img
                  src={app.companyLogo}
                  alt={app.companyName}
                  className="w-11 h-11 rounded-lg object-cover border border-slate-100 dark:border-slate-800 shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {app.companyName}
                    </h3>
                    <Badge variant={app.status === 'Selected' ? 'success' : app.status === 'Rejected' ? 'danger' : 'indigo'} size="sm">
                      {app.status}
                    </Badge>
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                    {app.roleTitle} • {app.salary}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Applied on {app.appliedDate} • Match Score: {app.matchScore}%
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <Button size="sm" variant="outline" onClick={() => openEditModal(app)} leftIcon={<Edit2 className="w-3.5 h-3.5" />}>
                  Update Status
                </Button>
                <button
                  type="button"
                  onClick={() => deleteApplication(app.id)}
                  className="p-2 text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                  title="Delete application"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit / Update Status Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title={selectedApp ? `Update: ${selectedApp.companyName}` : 'Update Application'}
      >
        {selectedApp && (
          <form onSubmit={handleSaveEdit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Current Pipeline Status
              </label>
              <select
                value={editingStatus}
                onChange={(e) => setEditingStatus(e.target.value as ApplicationStatus)}
                className="w-full text-xs py-2 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
              >
                {STATUS_COLUMNS.map((col) => (
                  <option key={col.key} value={col.key}>{col.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Next Round Date (Optional)
              </label>
              <input
                type="date"
                value={editingDate}
                onChange={(e) => setEditingDate(e.target.value)}
                className="w-full text-xs py-2 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Interview / Round Notes
              </label>
              <textarea
                value={editingNotes}
                onChange={(e) => setEditingNotes(e.target.value)}
                rows={3}
                placeholder="Log question topics, interviewer feedback, or next steps..."
                className="w-full text-xs p-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                onClick={() => {
                  deleteApplication(selectedApp.id);
                  setShowEditModal(false);
                }}
                className="text-xs text-rose-600 hover:underline"
              >
                Delete Application
              </button>

              <div className="flex gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowEditModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Save Updates
                </Button>
              </div>
            </div>
          </form>
        )}
      </Modal>

      {/* New Application Modal */}
      <Modal
        isOpen={showNewAppModal}
        onClose={() => setShowNewAppModal(false)}
        title="Add Tracked Application"
      >
        <form onSubmit={handleCreateNewApp} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Select Company
            </label>
            <select
              value={newCompanyId}
              onChange={(e) => setNewCompanyId(e.target.value)}
              className="w-full text-xs py-2 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
            >
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.salaryDisplay})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Initial Notes
            </label>
            <textarea
              value={newNotes}
              onChange={(e) => setNewNotes(e.target.value)}
              rows={3}
              placeholder="Application reference number or referral info..."
              className="w-full text-xs p-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setShowNewAppModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Create Entry
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
