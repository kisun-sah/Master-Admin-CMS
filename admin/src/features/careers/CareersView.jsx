import React, { useState, useEffect } from 'react';
import { DataTable } from '../../components/ui/DataTable.jsx';
import { Modal } from '../../components/ui/Modal.jsx';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog.jsx';
import { StatusBadge } from '../../components/ui/StatusBadge.jsx';
import { SEOPanel } from '../../components/common/SEOPanel.jsx';
import { MediaPickerModal } from '../../components/common/MediaPickerModal.jsx';
import { api } from '../../lib/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  Plus,
  Edit,
  Trash2,
  Briefcase,
  Users,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  Building,
  GraduationCap,
  Calendar,
  Send,
  ExternalLink,
  FileText,
} from 'lucide-react';

export function CareersView({ onNavigateToApplications }) {
  const { addToast, hasPermission } = useAuth();
  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [departments, setDepartments] = useState([]);

  // Editor Modal
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingVacancy, setEditingVacancy] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    department: 'Engineering',
    employmentType: 'full-time',
    location: 'Headquarters',
    workMode: 'on-site',
    openings: 1,
    experience: '',
    education: '',
    salaryRange: '',
    shortDescription: '',
    description: '',
    responsibilities: '',
    requirements: '',
    deadline: '',
    featuredImage: '',
    status: 'published',
    seo: { title: '', metaDescription: '', robots: 'index, follow' },
  });
  const [saving, setSaving] = useState(false);

  // View Details Modal
  const [viewingVacancy, setViewingVacancy] = useState(null);

  // Delete Dialog
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Media Picker
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);

  // Public Application Simulation / Tester Modal
  const [simulatingVacancy, setSimulatingVacancy] = useState(null);
  const [simForm, setSimForm] = useState({
    name: '',
    email: '',
    phone: '',
    education: '',
    currentOrganization: '',
    experienceYears: '',
    portfolioUrl: '',
    linkedinUrl: '',
    coverLetter: '',
    privacyConsent: true,
  });
  const [simResumeFile, setSimResumeFile] = useState(null);
  const [simSubmitting, setSimSubmitting] = useState(false);

  const fetchVacancies = async () => {
    try {
      setLoading(true);
      const res = await api.get('/careers', {
        page,
        limit: 10,
        search,
        status: statusFilter,
        department: departmentFilter,
      });

      if (res.success) {
        setVacancies(res.data || []);
        setTotalPages(res.meta?.totalPages || 1);
        setTotalItems(res.meta?.total || 0);

        // Collect distinct departments
        const depts = new Set();
        (res.data || []).forEach((v) => {
          if (v.department) depts.add(v.department);
        });
        if (depts.size > 0) {
          setDepartments(Array.from(depts));
        }
      }
    } catch (err) {
      addToast(err.message || 'Failed to load vacancies', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVacancies();
  }, [page, search, statusFilter, departmentFilter]);

  const handleOpenCreate = () => {
    setEditingVacancy(null);
    setFormData({
      title: '',
      slug: '',
      department: 'Engineering',
      employmentType: 'full-time',
      location: 'Headquarters',
      workMode: 'on-site',
      openings: 1,
      experience: '3+ years',
      education: "Bachelor's Degree",
      salaryRange: '$80,000 - $120,000',
      shortDescription: '',
      description: '',
      responsibilities: '',
      requirements: '',
      deadline: '',
      featuredImage: '',
      status: 'published',
      seo: { title: '', metaDescription: '', robots: 'index, follow' },
    });
    setIsEditorOpen(true);
  };

  const handleOpenEdit = async (item) => {
    try {
      const res = await api.get(`/careers/${item._id}`);
      if (res.success && res.data) {
        const v = res.data;
        setEditingVacancy(v);
        setFormData({
          title: v.title || '',
          slug: v.slug || '',
          department: v.department || 'General',
          employmentType: v.employmentType || 'full-time',
          location: v.location || 'Headquarters',
          workMode: v.workMode || 'on-site',
          openings: v.openings || 1,
          experience: v.experience || '',
          education: v.education || '',
          salaryRange: v.salaryRange || '',
          shortDescription: v.shortDescription || '',
          description: v.description || '',
          responsibilities: Array.isArray(v.responsibilities) ? v.responsibilities.join('\n') : '',
          requirements: Array.isArray(v.requirements) ? v.requirements.join('\n') : '',
          deadline: v.deadline ? v.deadline.slice(0, 10) : '',
          featuredImage: v.featuredImage || '',
          status: v.status || 'published',
          seo: v.seo || { title: '', metaDescription: '', robots: 'index, follow' },
        });
        setIsEditorOpen(true);
      }
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (editingVacancy) {
        await api.put(`/careers/${editingVacancy._id}`, formData);
        addToast('Job vacancy updated successfully!', 'success');
      } else {
        await api.post('/careers', formData);
        addToast('New job vacancy published successfully!', 'success');
      }
      setIsEditorOpen(false);
      fetchVacancies();
    } catch (err) {
      addToast(err.message || 'Failed to save job vacancy', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleStatusToggle = async (item, newStatus) => {
    try {
      await api.patch(`/careers/${item._id}/status`, { status: newStatus });
      addToast(`Vacancy status changed to ${newStatus}`, 'success');
      fetchVacancies();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      setDeleting(true);
      const res = await api.delete(`/careers/${deleteId}`);
      addToast(res.data?.message || 'Vacancy deleted', 'success');
      setDeleteId(null);
      fetchVacancies();
    } catch (err) {
      addToast(err.message || 'Failed to delete vacancy', 'error');
    } finally {
      setDeleting(false);
    }
  };

  // Submit Simulated Public Application
  const handleSimulatedSubmit = async (e) => {
    e.preventDefault();
    if (!simResumeFile) {
      addToast('Please attach a sample CV/Resume document (PDF, DOC, DOCX)', 'error');
      return;
    }

    try {
      setSimSubmitting(true);
      const data = new FormData();
      data.append('name', simForm.name);
      data.append('email', simForm.email);
      data.append('phone', simForm.phone);
      data.append('education', simForm.education);
      data.append('currentOrganization', simForm.currentOrganization);
      data.append('experienceYears', simForm.experienceYears);
      data.append('portfolioUrl', simForm.portfolioUrl);
      data.append('linkedinUrl', simForm.linkedinUrl);
      data.append('coverLetter', simForm.coverLetter);
      data.append('privacyConsent', simForm.privacyConsent);
      data.append('resume', simResumeFile);

      const res = await api.post(`/public/careers/${simulatingVacancy.slug}/applications`, data);
      if (res.success) {
        addToast(
          `Application submitted successfully! Ref: ${res.data.applicationRef}`,
          'success'
        );
        setSimulatingVacancy(null);
        fetchVacancies();
      }
    } catch (err) {
      addToast(err.message || 'Public submission test failed', 'error');
    } finally {
      setSimSubmitting(false);
    }
  };

  const columns = [
    {
      header: 'Vacancy Title & Department',
      accessor: 'title',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '14px' }}>
            {row.title}
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '12px',
              color: 'var(--text-muted)',
              marginTop: '2px',
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
              <Building size={12} /> {row.department}
            </span>
            <span>•</span>
            <span style={{ textTransform: 'capitalize' }}>{row.workMode}</span>
            <span>•</span>
            <span style={{ textTransform: 'capitalize' }}>{row.employmentType}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Location & Openings',
      accessor: 'location',
      render: (row) => (
        <div style={{ fontSize: '13px' }}>
          <div>{row.location}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            {row.openings} {row.openings === 1 ? 'Opening' : 'Openings'}
          </div>
        </div>
      ),
    },
    {
      header: 'Application Deadline',
      accessor: 'deadline',
      render: (row) => {
        if (!row.deadline) {
          return <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>No Deadline</span>;
        }
        const deadlineDate = new Date(row.deadline);
        const isPast = deadlineDate < new Date();
        return (
          <div style={{ fontSize: '13px', color: isPast ? 'var(--danger)' : 'var(--text-main)' }}>
            {deadlineDate.toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
            {isPast && (
              <span style={{ display: 'block', fontSize: '11px', fontWeight: 600 }}>Expired</span>
            )}
          </div>
        );
      },
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: 'Applications',
      accessor: 'applicationCount',
      render: (row) => (
        <button
          className="btn btn-secondary btn-sm"
          style={{ fontSize: '12px', padding: '3px 8px' }}
          onClick={() => {
            if (onNavigateToApplications) {
              onNavigateToApplications(row._id);
            }
          }}
          title="View candidates who applied for this vacancy"
        >
          <Users size={13} /> {row.applicationCount || 0} Applicants
        </button>
      ),
    },
    {
      header: 'Actions',
      accessor: '_id',
      render: (row) => (
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <button
            className="btn-icon"
            onClick={() => setViewingVacancy(row)}
            title="View Details"
          >
            <Eye size={15} />
          </button>
          <button
            className="btn-icon"
            onClick={() => handleOpenEdit(row)}
            title="Edit Vacancy"
          >
            <Edit size={15} />
          </button>
          {row.status === 'published' ? (
            <button
              className="btn-icon"
              style={{ color: 'var(--warning)' }}
              onClick={() => handleStatusToggle(row, 'closed')}
              title="Close Vacancy"
            >
              <XCircle size={15} />
            </button>
          ) : (
            <button
              className="btn-icon"
              style={{ color: 'var(--success)' }}
              onClick={() => handleStatusToggle(row, 'published')}
              title="Publish Vacancy"
            >
              <CheckCircle2 size={15} />
            </button>
          )}
          <button
            className="btn-icon"
            style={{ color: 'var(--info)' }}
            onClick={() => {
              setSimulatingVacancy(row);
              setSimForm({
                name: 'Jane Doe',
                email: 'candidate@example.com',
                phone: '+1 (555) 987-6543',
                education: "Master's Degree in Computer Science",
                currentOrganization: 'Tech Solutions Inc',
                experienceYears: '4 years',
                portfolioUrl: 'https://github.com/janedoe',
                linkedinUrl: 'https://linkedin.com/in/janedoe',
                coverLetter: 'I am excited to submit my candidate application for this role.',
                privacyConsent: true,
              });
              setSimResumeFile(null);
            }}
            title="Test / Submit Candidate Application"
          >
            <Send size={15} />
          </button>
          <button
            className="btn-icon"
            style={{ color: 'var(--danger)' }}
            onClick={() => setDeleteId(row._id)}
            title="Delete Vacancy"
          >
            <Trash2 size={15} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <DataTable
        title="Careers & Job Vacancies"
        subtitle="Publish job openings, manage application deadlines, and monitor candidate submissions."
        columns={columns}
        data={vacancies}
        loading={loading}
        search={search}
        onSearchChange={setSearch}
        page={page}
        totalPages={totalPages}
        totalItems={totalItems}
        onPageChange={setPage}
        filterValue={statusFilter}
        onFilterChange={setStatusFilter}
        filterOptions={[
          { label: 'All Statuses', value: 'all' },
          { label: 'Published Only', value: 'published' },
          { label: 'Drafts Only', value: 'draft' },
          { label: 'Closed Only', value: 'closed' },
        ]}
        createAction={
          <div style={{ display: 'flex', gap: '8px' }}>
            {departments.length > 0 && (
              <select
                className="form-control"
                style={{ width: 'auto', fontSize: '13px' }}
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
              >
                <option value="all">All Departments</option>
                {departments.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            )}
            <button className="btn btn-primary" onClick={handleOpenCreate}>
              <Plus size={16} /> Post New Vacancy
            </button>
          </div>
        }
      />

      {/* Editor Modal */}
      <Modal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        title={editingVacancy ? 'Edit Job Vacancy' : 'Post New Job Vacancy'}
        size="lg"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsEditorOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : editingVacancy ? 'Update Vacancy' : 'Publish Vacancy'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Job Title *</label>
              <input
                type="text"
                className="form-control"
                required
                placeholder="e.g. Senior Full-Stack Engineer"
                value={formData.title}
                onChange={(e) => {
                  const title = e.target.value;
                  setFormData((prev) => ({
                    ...prev,
                    title,
                    slug: prev.slug || title.toLowerCase().replace(/[\s\W-]+/g, '-'),
                  }));
                }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">URL Slug *</label>
              <input
                type="text"
                className="form-control"
                required
                placeholder="senior-full-stack-engineer"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Department</label>
              <input
                type="text"
                className="form-control"
                placeholder="Engineering, Design, Marketing..."
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Employment Type</label>
              <select
                className="form-control"
                value={formData.employmentType}
                onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })}
              >
                <option value="full-time">Full-Time</option>
                <option value="part-time">Part-Time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
                <option value="temporary">Temporary</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Work Mode</label>
              <select
                className="form-control"
                value={formData.workMode}
                onChange={(e) => setFormData({ ...formData, workMode: e.target.value })}
              >
                <option value="on-site">On-Site</option>
                <option value="hybrid">Hybrid</option>
                <option value="remote">Remote</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Location</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. San Francisco, CA / Remote"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Number of Openings</label>
              <input
                type="number"
                min="1"
                className="form-control"
                value={formData.openings}
                onChange={(e) =>
                  setFormData({ ...formData, openings: parseInt(e.target.value, 10) || 1 })
                }
              />
            </div>

            <div className="form-group">
              <label className="form-label">Salary Range (Optional)</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. $120,000 - $150,000 / yr"
                value={formData.salaryRange}
                onChange={(e) => setFormData({ ...formData, salaryRange: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Experience Requirement</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. 3-5 Years in SaaS"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Education Requirement</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Bachelor's in CS"
                value={formData.education}
                onChange={(e) => setFormData({ ...formData, education: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Application Deadline</label>
              <input
                type="date"
                className="form-control"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Short Summary Description *</label>
            <textarea
              rows={2}
              className="form-control"
              required
              placeholder="Brief 1-2 sentence overview shown on careers listing..."
              value={formData.shortDescription}
              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Full Job Description *</label>
            <textarea
              rows={5}
              className="form-control"
              required
              placeholder="Detailed overview of the role, expectations, and day-to-day impact..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Responsibilities (One item per line)</label>
              <textarea
                rows={4}
                className="form-control"
                placeholder="Design distributed systems&#10;Lead sprint planning&#10;Review pull requests"
                value={formData.responsibilities}
                onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Skills & Qualifications (One item per line)</label>
              <textarea
                rows={4}
                className="form-control"
                placeholder="Strong TypeScript skills&#10;Experience with Docker&#10;REST API design"
                value={formData.requirements}
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Featured Banner Image URL</label>
              <div style={{ display: 'flex', gap: '6px' }}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="https://... or select from Media Library"
                  value={formData.featuredImage}
                  onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
                />
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setIsMediaPickerOpen(true)}
                >
                  Browse
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Publishing Status</label>
              <select
                className="form-control"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="published">Published (Live for Applications)</option>
                <option value="draft">Draft (Internal Only)</option>
                <option value="closed">Closed (No New Applications)</option>
              </select>
            </div>
          </div>

          <SEOPanel
            seo={formData.seo}
            onChange={(seo) => setFormData({ ...formData, seo })}
            defaultTitle={formData.title}
          />
        </form>
      </Modal>

      {/* View Details Modal */}
      <Modal
        isOpen={!!viewingVacancy}
        onClose={() => setViewingVacancy(null)}
        title={viewingVacancy?.title || 'Vacancy Details'}
        size="lg"
        footer={
          <button className="btn btn-secondary" onClick={() => setViewingVacancy(null)}>
            Close
          </button>
        }
      >
        {viewingVacancy && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 16px',
                background: 'var(--surface-hover)',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <div>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Status:</span>{' '}
                <StatusBadge status={viewingVacancy.status} />
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                <strong>{viewingVacancy.applicationCount || 0}</strong> Candidates Applied
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Department</span>
                <div style={{ fontWeight: 600 }}>{viewingVacancy.department}</div>
              </div>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Work Mode</span>
                <div style={{ fontWeight: 600, textTransform: 'capitalize' }}>
                  {viewingVacancy.workMode}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Employment Type</span>
                <div style={{ fontWeight: 600, textTransform: 'capitalize' }}>
                  {viewingVacancy.employmentType}
                </div>
              </div>
            </div>

            <div>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Summary Description</span>
              <p style={{ marginTop: '4px', fontSize: '14px', lineHeight: 1.5 }}>
                {viewingVacancy.shortDescription}
              </p>
            </div>

            <div>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Full Description</span>
              <p style={{ marginTop: '4px', fontSize: '14px', whiteSpace: 'pre-line' }}>
                {viewingVacancy.description}
              </p>
            </div>

            {viewingVacancy.responsibilities?.length > 0 && (
              <div>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Key Responsibilities</span>
                <ul style={{ paddingLeft: '20px', marginTop: '6px', fontSize: '13px' }}>
                  {viewingVacancy.responsibilities.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
            )}

            {viewingVacancy.requirements?.length > 0 && (
              <div>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Skills & Qualifications
                </span>
                <ul style={{ paddingLeft: '20px', marginTop: '6px', fontSize: '13px' }}>
                  {viewingVacancy.requirements.map((req, i) => (
                    <li key={i}>{req}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Public Application Tester / Simulator Modal */}
      <Modal
        isOpen={!!simulatingVacancy}
        onClose={() => setSimulatingVacancy(null)}
        title={`Submit Application — ${simulatingVacancy?.title || ''}`}
        size="md"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setSimulatingVacancy(null)}>
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={handleSimulatedSubmit}
              disabled={simSubmitting}
            >
              {simSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </>
        }
      >
        <div style={{ marginBottom: '12px', fontSize: '13px', color: 'var(--text-muted)' }}>
          This tests the public candidate application portal (<code>POST /api/v1/public/careers/:slug/applications</code>) with private CV storage.
        </div>
        <form
          onSubmit={handleSimulatedSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
        >
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              className="form-control"
              required
              value={simForm.name}
              onChange={(e) => setSimForm({ ...simForm, name: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input
                type="email"
                className="form-control"
                required
                value={simForm.email}
                onChange={(e) => setSimForm({ ...simForm, email: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number *</label>
              <input
                type="text"
                className="form-control"
                required
                value={simForm.phone}
                onChange={(e) => setSimForm({ ...simForm, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Education / Highest Qualification *</label>
            <input
              type="text"
              className="form-control"
              required
              value={simForm.education}
              onChange={(e) => setSimForm({ ...simForm, education: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Current Organization (Optional)</label>
              <input
                type="text"
                className="form-control"
                value={simForm.currentOrganization}
                onChange={(e) => setSimForm({ ...simForm, currentOrganization: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Years of Experience</label>
              <input
                type="text"
                className="form-control"
                value={simForm.experienceYears}
                onChange={(e) => setSimForm({ ...simForm, experienceYears: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">CV / Resume Document (PDF, DOC, DOCX up to 35 MB) *</label>
            <input
              type="file"
              className="form-control"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              required
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setSimResumeFile(e.target.files[0]);
                }
              }}
            />
            {simResumeFile && (
              <span className="form-hint" style={{ color: 'var(--success)', fontWeight: 500 }}>
                Selected: {simResumeFile.name} ({(simResumeFile.size / 1024).toFixed(1)} KB)
              </span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Cover Letter (Optional)</label>
            <textarea
              rows={2}
              className="form-control"
              value={simForm.coverLetter}
              onChange={(e) => setSimForm({ ...simForm, coverLetter: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
            <input
              type="checkbox"
              id="sim-privacy"
              checked={simForm.privacyConsent}
              onChange={(e) => setSimForm({ ...simForm, privacyConsent: e.target.checked })}
            />
            <label htmlFor="sim-privacy" style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
              I consent to the organization's privacy policy and recruitment data processing.
            </label>
          </div>
        </form>
      </Modal>

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={isMediaPickerOpen}
        onClose={() => setIsMediaPickerOpen(false)}
        onSelect={(url) => {
          setFormData((prev) => ({ ...prev, featuredImage: url }));
          setIsMediaPickerOpen(false);
        }}
        currentUrl={formData.featuredImage}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Job Vacancy"
        message="Are you sure you want to delete this vacancy? If candidate applications exist, the vacancy will be safely archived and historical application records preserved."
        confirmText={deleting ? 'Deleting...' : 'Delete Vacancy'}
        danger
      />
    </div>
  );
}

