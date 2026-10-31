import React, { useState, useEffect } from 'react';
import { DataTable } from '../../components/ui/DataTable.jsx';
import { Modal } from '../../components/ui/Modal.jsx';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog.jsx';
import { StatusBadge } from '../../components/ui/StatusBadge.jsx';
import { api } from '../../lib/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  FileText,
  Download,
  Eye,
  Trash2,
  FileCheck,
  CheckCircle2,
  MessageSquare,
  History,
  Building,
  Mail,
  Phone,
  Globe,
  ExternalLink,
  Linkedin,
  Clock,
  User,
  Plus,
} from 'lucide-react';

export function JobApplicationsView({ initialVacancyId = null }) {
  const { addToast } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [vacancyFilter, setVacancyFilter] = useState(initialVacancyId || 'all');
  const [vacanciesList, setVacanciesList] = useState([]);

  // Detail Modal
  const [viewingApp, setViewingApp] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Status Change State inside Modal
  const [newStatus, setNewStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Recruiter Note State inside Modal
  const [newNoteText, setNewNoteText] = useState('');
  const [addingNote, setAddingNote] = useState(false);

  // Delete State
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch Vacancies for filter dropdown
  useEffect(() => {
    const loadVacancies = async () => {
      try {
        const res = await api.get('/careers', { limit: 100 });
        if (res.success) {
          setVacanciesList(res.data || []);
        }
      } catch (err) {
        console.warn('Could not load vacancies list:', err);
      }
    };
    loadVacancies();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await api.get('/job-applications', {
        page,
        limit: 15,
        search,
        status: statusFilter,
        vacancy: vacancyFilter !== 'all' ? vacancyFilter : undefined,
      });

      if (res.success) {
        setApplications(res.data || []);
        setTotalPages(res.meta?.totalPages || 1);
        setTotalItems(res.meta?.total || 0);
      }
    } catch (err) {
      addToast(err.message || 'Failed to load job applications', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [page, search, statusFilter, vacancyFilter]);

  const handleOpenDetail = async (appId) => {
    try {
      setLoadingDetail(true);
      const res = await api.get(`/job-applications/${appId}`);
      if (res.success && res.data) {
        setViewingApp(res.data);
        setNewStatus(res.data.status);
        setStatusNote('');
      }
    } catch (err) {
      addToast(err.message || 'Failed to load application details', 'error');
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!viewingApp || !newStatus) return;
    try {
      setUpdatingStatus(true);
      const res = await api.patch(`/job-applications/${viewingApp._id}/status`, {
        status: newStatus,
        note: statusNote,
      });
      if (res.success) {
        addToast(`Application status updated to ${newStatus}`, 'success');
        setViewingApp(res.data);
        setStatusNote('');
        fetchApplications();
      }
    } catch (err) {
      addToast(err.message || 'Failed to update status', 'error');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNoteText.trim() || !viewingApp) return;

    try {
      setAddingNote(true);
      const res = await api.patch(`/job-applications/${viewingApp._id}/notes`, {
        text: newNoteText,
      });
      if (res.success) {
        addToast('Internal recruiter note added', 'success');
        setViewingApp(res.data);
        setNewNoteText('');
      }
    } catch (err) {
      addToast(err.message || 'Failed to add note', 'error');
    } finally {
      setAddingNote(false);
    }
  };

  const handleDownloadCv = (appId, candidateName) => {
    const downloadUrl = `/api/v1/job-applications/${appId}/cv`;
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', `${candidateName || 'Candidate'}_Resume`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Initiating authorized CV document download...', 'info');
  };

  const handleExportCsv = () => {
    const exportUrl = '/api/v1/job-applications/export/csv';
    const link = document.createElement('a');
    link.href = exportUrl;
    link.setAttribute('download', 'job_applications.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Exporting applicant dataset to CSV...', 'info');
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      setDeleting(true);
      await api.delete(`/job-applications/${deleteId}`);
      addToast('Application and associated document permanently deleted', 'success');
      setDeleteId(null);
      if (viewingApp?._id === deleteId) {
        setViewingApp(null);
      }
      fetchApplications();
    } catch (err) {
      addToast(err.message || 'Failed to delete application', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    {
      header: 'Reference',
      accessor: 'applicationRef',
      render: (row) => (
        <span
          style={{
            fontFamily: 'monospace',
            fontWeight: 700,
            color: 'var(--primary)',
            fontSize: '12px',
          }}
        >
          {row.applicationRef}
        </span>
      ),
    },
    {
      header: 'Candidate Name',
      accessor: 'candidate.name',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '13.5px' }}>
            {row.candidate?.name || 'Applicant'}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            {row.candidate?.email}
          </div>
        </div>
      ),
    },
    {
      header: 'Applied Position',
      accessor: 'vacancyTitle',
      render: (row) => (
        <div style={{ fontSize: '13px', fontWeight: 500 }}>
          {row.vacancyTitle || row.vacancy?.title || 'Job Opening'}
        </div>
      ),
    },
    {
      header: 'Education / Qualification',
      accessor: 'candidate.education',
      render: (row) => (
        <div style={{ fontSize: '12.5px', color: 'var(--text-main)' }}>
          {row.candidate?.education || 'N/A'}
        </div>
      ),
    },
    {
      header: 'Date Applied',
      accessor: 'createdAt',
      render: (row) => (
        <div style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
          {new Date(row.createdAt).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: 'CV Document',
      accessor: 'resume',
      render: (row) => (
        <button
          className="btn btn-secondary btn-sm"
          style={{ fontSize: '11px', padding: '3px 8px' }}
          onClick={() => handleDownloadCv(row._id, row.candidate?.name)}
          title={`Download ${row.resume?.originalName || 'Resume'}`}
        >
          <Download size={12} /> CV ({(row.resume?.size / 1024).toFixed(0)} KB)
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
            onClick={() => handleOpenDetail(row._id)}
            title="Review Full Application & Notes"
          >
            <Eye size={15} />
          </button>
          <button
            className="btn-icon"
            style={{ color: 'var(--danger)' }}
            onClick={() => setDeleteId(row._id)}
            title="Delete Application"
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
        title="Candidate Job Applications"
        subtitle="Review applicant submissions, track hiring workflows, add internal recruiter notes, and access secure CV documents."
        columns={columns}
        data={applications}
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
          { label: 'New Submissions', value: 'new' },
          { label: 'Under Review', value: 'under_review' },
          { label: 'Shortlisted', value: 'shortlisted' },
          { label: 'Interview Scheduled', value: 'interview' },
          { label: 'Selected / Hired', value: 'selected' },
          { label: 'Rejected', value: 'rejected' },
          { label: 'Withdrawn', value: 'withdrawn' },
        ]}
        createAction={
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {vacanciesList.length > 0 && (
              <select
                className="form-control"
                style={{ width: 'auto', fontSize: '13px' }}
                value={vacancyFilter}
                onChange={(e) => setVacancyFilter(e.target.value)}
              >
                <option value="all">All Vacancies</option>
                {vacanciesList.map((v) => (
                  <option key={v._id} value={v._id}>
                    {v.title}
                  </option>
                ))}
              </select>
            )}
            <button className="btn btn-secondary" onClick={handleExportCsv} title="Download CSV report">
              <Download size={15} /> Export CSV
            </button>
          </div>
        }
      />

      {/* Review Application Details Modal */}
      <Modal
        isOpen={!!viewingApp}
        onClose={() => setViewingApp(null)}
        title={
          viewingApp ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span>{viewingApp.candidate?.name}</span>
              <span
                style={{
                  fontFamily: 'monospace',
                  fontSize: '12px',
                  background: 'var(--surface-hover)',
                  padding: '2px 8px',
                  borderRadius: '4px',
                }}
              >
                {viewingApp.applicationRef}
              </span>
            </div>
          ) : (
            'Application Details'
          )
        }
        size="lg"
        footer={
          <button className="btn btn-secondary" onClick={() => setViewingApp(null)}>
            Close Review
          </button>
        }
      >
        {viewingApp && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Top Bar Status Management */}
            <div
              style={{
                padding: '16px',
                background: 'var(--surface-hover)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <div>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block' }}>
                  Current Status
                </span>
                <StatusBadge status={viewingApp.status} />
              </div>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                <select
                  className="form-control"
                  style={{ width: 'auto', fontSize: '13px' }}
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  <option value="new">New Submission</option>
                  <option value="under_review">Under Review</option>
                  <option value="shortlisted">Shortlisted</option>
                  <option value="interview">Interview Scheduled</option>
                  <option value="selected">Selected / Hired</option>
                  <option value="rejected">Rejected</option>
                  <option value="withdrawn">Withdrawn</option>
                </select>

                <input
                  type="text"
                  className="form-control"
                  placeholder="Optional transition note..."
                  style={{ width: '200px', fontSize: '13px' }}
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                />

                <button
                  className="btn btn-primary btn-sm"
                  onClick={handleUpdateStatus}
                  disabled={updatingStatus || newStatus === viewingApp.status}
                >
                  {updatingStatus ? 'Updating...' : 'Update Status'}
                </button>
              </div>
            </div>

            {/* Candidate Info Grid */}
            <div
              className="card"
              style={{
                padding: '16px',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
              }}
            >
              <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>
                Candidate Profile & Qualifications
              </h3>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '14px',
                }}
              >
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Email Address</span>
                  <div style={{ fontSize: '13px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Mail size={13} style={{ color: 'var(--text-subtle)' }} />
                    <a href={`mailto:${viewingApp.candidate?.email}`} style={{ color: 'var(--primary)' }}>
                      {viewingApp.candidate?.email}
                    </a>
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Phone Number</span>
                  <div style={{ fontSize: '13px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Phone size={13} style={{ color: 'var(--text-subtle)' }} />
                    <span>{viewingApp.candidate?.phone}</span>
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Applied Position</span>
                  <div style={{ fontSize: '13px', fontWeight: 600 }}>
                    {viewingApp.vacancyTitle || viewingApp.vacancy?.title}
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Highest Education</span>
                  <div style={{ fontSize: '13px', fontWeight: 500 }}>
                    {viewingApp.candidate?.education}
                  </div>
                </div>

                {viewingApp.candidate?.currentOrganization && (
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Current Organization</span>
                    <div style={{ fontSize: '13px', fontWeight: 500 }}>
                      {viewingApp.candidate.currentOrganization}
                    </div>
                  </div>
                )}

                {viewingApp.candidate?.experienceYears && (
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Experience</span>
                    <div style={{ fontSize: '13px', fontWeight: 500 }}>
                      {viewingApp.candidate.experienceYears}
                    </div>
                  </div>
                )}

                {viewingApp.candidate?.portfolioUrl && (
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Portfolio / Website</span>
                    <div>
                      <a
                        href={viewingApp.candidate.portfolioUrl}
                        target="_blank"
                        rel="noreferrer"
                        style={{ fontSize: '13px', color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Globe size={13} /> View Portfolio <ExternalLink size={11} />
                      </a>
                    </div>
                  </div>
                )}

                {viewingApp.candidate?.linkedinUrl && (
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>LinkedIn Profile</span>
                    <div>
                      <a
                        href={viewingApp.candidate.linkedinUrl}
                        target="_blank"
                        rel="noreferrer"
                        style={{ fontSize: '13px', color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Linkedin size={13} /> View LinkedIn <ExternalLink size={11} />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* CV Document Box */}
            <div
              style={{
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
                background: 'var(--surface)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--primary-light)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <FileText size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '14px' }}>
                    {viewingApp.resume?.originalName || 'Candidate_Resume.pdf'}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    {viewingApp.resume?.mimeType} •{' '}
                    {((viewingApp.resume?.size || 0) / 1024).toFixed(1)} KB • Stored Privately
                  </div>
                </div>
              </div>

              <button
                className="btn btn-primary btn-sm"
                onClick={() => handleDownloadCv(viewingApp._id, viewingApp.candidate?.name)}
              >
                <Download size={14} /> Download CV Document
              </button>
            </div>

            {/* Cover Letter */}
            {viewingApp.coverLetter && (
              <div
                className="card"
                style={{
                  padding: '16px',
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                }}
              >
                <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>
                  Cover Letter / Introduction
                </h3>
                <p style={{ fontSize: '13.5px', lineHeight: 1.6, whiteSpace: 'pre-line', color: 'var(--text-main)' }}>
                  {viewingApp.coverLetter}
                </p>
              </div>
            )}

            {/* Recruiter Notes Section */}
            <div
              className="card"
              style={{
                padding: '16px',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <MessageSquare size={16} style={{ color: 'var(--primary)' }} />
                <h3 style={{ fontSize: '14px', fontWeight: 600 }}>Internal Recruiter Notes</h3>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  (Protected — Never shown to candidates)
                </span>
              </div>

              {viewingApp.notes?.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
                  {viewingApp.notes.map((note) => (
                    <div
                      key={note._id || Math.random()}
                      style={{
                        padding: '10px 12px',
                        background: 'var(--surface-hover)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '13px',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 600, fontSize: '12px', color: 'var(--primary)' }}>
                          {note.authorName || 'Recruiter'}
                        </span>
                        <span style={{ fontSize: '11px', color: 'var(--text-subtle)' }}>
                          {new Date(note.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p style={{ margin: 0 }}>{note.text}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '14px' }}>
                  No internal notes recorded yet for this candidate.
                </div>
              )}

              <form onSubmit={handleAddNote} style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Write a recruiter note (e.g. Completed initial screening call)..."
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                />
                <button
                  type="submit"
                  className="btn btn-secondary btn-sm"
                  disabled={addingNote || !newNoteText.trim()}
                >
                  <Plus size={14} /> Add Note
                </button>
              </form>
            </div>

            {/* Status History Timeline */}
            {viewingApp.statusHistory?.length > 0 && (
              <div
                className="card"
                style={{
                  padding: '16px',
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <History size={16} style={{ color: 'var(--primary)' }} />
                  <h3 style={{ fontSize: '14px', fontWeight: 600 }}>Status Transition History</h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {viewingApp.statusHistory.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px',
                        fontSize: '12.5px',
                        borderLeft: '2px solid var(--border)',
                        paddingLeft: '12px',
                      }}
                    >
                      <div>
                        <StatusBadge status={item.status} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ color: 'var(--text-muted)', fontSize: '11.5px' }}>
                          By <strong>{item.changedByName || 'Administrator'}</strong> on{' '}
                          {new Date(item.changedAt).toLocaleString()}
                        </div>
                        {item.note && (
                          <div style={{ marginTop: '2px', color: 'var(--text-main)' }}>
                            {item.note}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Job Application"
        message="Are you sure you want to delete this candidate application and its stored CV document? This action is permanent and audited."
        confirmText={deleting ? 'Deleting...' : 'Delete Application'}
        danger
      />
    </div>
  );
}

