import React, { useState, useEffect } from 'react';
import { Users, Search, Filter, CheckCircle2, Clock, AlertCircle, RefreshCw } from 'lucide-react';
import { Badge, Button } from '../components/common/UIComponents';
import { fetchAdminStudentsApi } from '../services/api';

interface StudentRecord {
  id: string;
  name: string;
  email: string;
  degree: string;
  department: string;
  cgpa: number;
  skills: string[];
  profileStrength: number;
  status: 'Placed' | 'In Progress' | 'Shortlisted' | 'Open';
  placedCompany?: string;
  package?: string;
}

export const AdminStudentsPage: React.FC = () => {
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [minCgpa, setMinCgpa] = useState(0);

  const loadStudents = async () => {
    setLoading(true);
    try {
      const data = await fetchAdminStudentsApi();
      if (data && Array.isArray(data)) {
        setStudents(data);
      }
    } catch (e) {
      console.warn('Could not load student directory from server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const filteredStudents = students.filter((student) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matches =
        student.name.toLowerCase().includes(q) ||
        student.department.toLowerCase().includes(q) ||
        (student.skills || []).some(s => s.toLowerCase().includes(q));
      if (!matches) return false;
    }
    if (selectedStatus !== 'all' && student.status !== selectedStatus) {
      return false;
    }
    if (minCgpa > 0 && student.cgpa < minCgpa) {
      return false;
    }
    return true;
  });

  const getStatusBadge = (status: StudentRecord['status']) => {
    switch (status) {
      case 'Placed':
        return <Badge variant="success">Placed</Badge>;
      case 'Shortlisted':
        return <Badge variant="primary">Shortlisted</Badge>;
      case 'In Progress':
        return <Badge variant="warning">In Progress</Badge>;
      case 'Open':
        return <Badge variant="neutral">Open</Badge>;
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              Student Directory & Placement Status
            </h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              {students.length} Registered
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time candidate profile tracking, verified skill distribution, and recruitment eligibility.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={loadStudents}
            leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-subtle grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by candidate name, skill, department..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full text-xs py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200"
          >
            <option value="all">All Placement Statuses</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Placed">Placed</option>
            <option value="In Progress">In Progress</option>
            <option value="Open">Open</option>
          </select>
        </div>

        <div>
          <select
            value={minCgpa}
            onChange={(e) => setMinCgpa(Number(e.target.value))}
            className="w-full text-xs py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200"
          >
            <option value={0}>All CGPA Cutoffs</option>
            <option value={7.0}>CGPA ≥ 7.0 (Tier-2 Cutoff)</option>
            <option value={8.0}>CGPA ≥ 8.0 (Tier-1 Cutoff)</option>
            <option value={8.5}>CGPA ≥ 8.5 (Dream Company Cutoff)</option>
          </select>
        </div>
      </div>

      {/* Students Data Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px] sm:text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/40 text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">
                <th className="py-3 px-4">Candidate</th>
                <th className="py-3 px-4">Department & Degree</th>
                <th className="py-3 px-4">CGPA</th>
                <th className="py-3 px-4">Verified Skills</th>
                <th className="py-3 px-4">Profile Strength</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-normal">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    Loading student directory...
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No registered candidates matching the selected criteria.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 dark:text-white text-[13px] sm:text-sm">
                        {st.name}
                      </div>
                      <div className="text-xs text-slate-400">{st.email}</div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                      <div>{st.department}</div>
                      <div className="text-[11px] text-slate-400">{st.degree} (Batch 2026)</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`font-bold ${
                        st.cgpa >= 8.5 ? 'text-emerald-600 dark:text-emerald-400' :
                        st.cgpa >= 7.5 ? 'text-indigo-600 dark:text-indigo-400' :
                        st.cgpa > 0 ? 'text-slate-700 dark:text-slate-300' : 'text-slate-400'
                      }`}>
                        {st.cgpa && Number(st.cgpa) > 0 ? Number(st.cgpa).toFixed(1) : 'N/A'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="flex flex-wrap gap-1">
                        {(st.skills || []).length > 0 ? (
                          st.skills.slice(0, 4).map((s, idx) => (
                            <span
                              key={idx}
                              className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-medium text-slate-700 dark:text-slate-300"
                            >
                              {s}
                            </span>
                          ))
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">No skills added</span>
                        )}
                        {(st.skills || []).length > 4 && (
                          <span className="text-[10px] text-slate-400 font-semibold self-center">
                            +{st.skills.length - 4}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                          <div
                            className={`h-full ${
                              st.profileStrength >= 80 ? 'bg-emerald-500' :
                              st.profileStrength >= 50 ? 'bg-indigo-500' : 'bg-amber-500'
                            }`}
                            style={{ width: `${st.profileStrength || 0}%` }}
                          />
                        </div>
                        <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                          {st.profileStrength || 0}%
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      {getStatusBadge(st.status)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
