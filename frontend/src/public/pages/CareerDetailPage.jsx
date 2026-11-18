import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCareerBySlug, submitJobApplication } from '../lib/api';
import { useCms } from '../context/CmsContext';
import SEOHead from '../components/layout/SEOHead';
import {
  Sparkles,
  ArrowLeft,
  MapPin,
  Clock,
  DollarSign,
  Calendar,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Send,
} from 'lucide-react';

export default function CareerDetailPage() {
  const { slug } = useParams();
  const { settings } = useCms();
  const [career, setCareer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Application Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    coverLetter: '',
    portfolioUrl: '',
    linkedInUrl: '',
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await getCareerBySlug(slug);
        setCareer(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate 35MB max size
    const maxSize = 35 * 1024 * 1024;
    if (file.size > maxSize) {
      setSubmitError('Resume file size exceeds the 35 MB upload limit.');
      return;
    }
    setSubmitError(null);
    setResumeFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resumeFile) {
      setSubmitError('Please upload your resume (PDF or Word document up to 35 MB).');
      return;
    }

    try {
      setSubmitting(true);
      setSubmitError(null);

      // Convert resume to base64 or FormData payload
      const reader = new FileReader();
      const resumePromise = new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(resumeFile);
      });

      const base64Resume = await resumePromise;

      const payload = {
        ...formData,
        resume: {
          dataUrl: base64Resume,
          filename: resumeFile.name,
          contentType: resumeFile.type,
          sizeBytes: resumeFile.size,
        },
      };

      await submitJobApplication(slug, payload);
      setSubmitSuccess(true);
    } catch (err) {
      setSubmitError(err.message || 'Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-32 pb-20 text-center text-slate-500 min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-[var(--brand-primary,#3B66D4)] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error || !career) {
    return (
      <div className="pt-32 pb-20 text-center max-w-lg mx-auto px-4 min-h-[60vh]">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Position Not Found</h2>
        <p className="text-sm text-slate-600 mb-6">
          This role is no longer accepting new candidate applications.
        </p>
        <Link
          to="/careers"
          className="px-6 py-2.5 rounded-full bg-[var(--brand-primary,#3B66D4)] hover:bg-blue-700 text-white font-bold text-sm inline-block shadow-md"
        >
          &larr; Back to Open Roles
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 bg-[#F8FAFC] min-h-screen">
      <SEOHead
        title={`${career.title} — Careers`}
        description={career.description}
        schema={{
          '@context': 'https://schema.org',
          '@type': 'JobPosting',
          title: career.title,
          description: career.description,
          employmentType: career.employmentType || 'FULL_TIME',
          hiringOrganization: {
            '@type': 'Organization',
            name: settings?.siteName || 'NEXUS DEVS',
          },
          jobLocationType: 'TELECOMMUTE',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/careers"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[var(--brand-primary,#3B66D4)] mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Careers</span>
        </Link>

        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-100 text-[var(--brand-primary,#3B66D4)] text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{career.department || 'Open Position'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
            {career.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[var(--brand-primary,#3B66D4)]" />
              <span>{career.workMode || 'Remote'}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[var(--brand-primary,#3B66D4)]" />
              <span>{career.employmentType || 'Contract / Full-time'}</span>
            </span>
            {career.salaryRange && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1.5 text-emerald-600 font-bold">
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>{career.salaryRange}</span>
                </span>
              </>
            )}
            {career.applicationDeadline && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1.5 text-amber-600 font-medium">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Deadline: {new Date(career.applicationDeadline).toLocaleDateString()}</span>
                </span>
              </>
            )}
          </div>
        </div>

        {/* 2-Column Grid: Details (7 cols) + Application Form (5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Job Description & Requirements */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">About the Role</h3>
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                  {career.description}
                </p>
              </div>

              {career.responsibilities && (
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Key Responsibilities</h3>
                  <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                    {career.responsibilities}
                  </div>
                </div>
              )}

              {career.requirements && (
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Requirements & Skills</h3>
                  <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                    {career.requirements}
                  </div>
                </div>
              )}

              {(career.experienceRequirement || career.educationRequirement) && (
                <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  {career.experienceRequirement && (
                    <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
                      <div className="text-slate-500 font-medium">Experience</div>
                      <div className="text-slate-900 font-bold mt-1">{career.experienceRequirement}</div>
                    </div>
                  )}
                  {career.educationRequirement && (
                    <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
                      <div className="text-slate-500 font-medium">Education</div>
                      <div className="text-slate-900 font-bold mt-1">{career.educationRequirement}</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: 35MB Application Form Drawer */}
          <div className="lg:col-span-5 sticky top-28">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Apply for this Role</h3>
              <p className="text-xs text-slate-500 mb-6">
                Submit your profile and resume. Resumes up to 35 MB are supported.
              </p>

              {submitSuccess ? (
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h4 className="text-lg font-bold text-slate-900">Application Received!</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Thank you for applying. We review every submission carefully and will get back to you via email or phone shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {submitError && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-[var(--brand-primary,#3B66D4)] focus:ring-2 focus:ring-blue-100 placeholder-slate-400"
                      placeholder="Jane Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-[var(--brand-primary,#3B66D4)] focus:ring-2 focus:ring-blue-100 placeholder-slate-400"
                      placeholder="jane@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-[var(--brand-primary,#3B66D4)] focus:ring-2 focus:ring-blue-100 placeholder-slate-400"
                      placeholder="+977 (01) 4546038"
                    />
                  </div>

                  {/* 35MB Resume Dropzone */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Resume / CV (Max 35 MB: PDF, DOC, DOCX) *
                    </label>
                    <div className="relative border-2 border-dashed border-slate-300 hover:border-blue-400 rounded-2xl p-4 text-center bg-slate-50 transition-all">
                      <input
                        type="file"
                        required
                        accept=".pdf,.doc,.docx,.rtf,.txt"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="flex flex-col items-center justify-center space-y-1">
                        <UploadCloud className="w-8 h-8 text-[var(--brand-primary,#3B66D4)]" />
                        <span className="text-xs text-slate-800 font-medium">
                          {resumeFile ? resumeFile.name : 'Click or drop your resume here'}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {resumeFile
                            ? `${(resumeFile.size / (1024 * 1024)).toFixed(2)} MB`
                            : 'Supports PDF, Word, RTF up to 35 MB'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Portfolio / GitHub URL (Optional)
                    </label>
                    <input
                      type="url"
                      value={formData.portfolioUrl}
                      onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-[var(--brand-primary,#3B66D4)] focus:ring-2 focus:ring-blue-100 placeholder-slate-400"
                      placeholder="https://github.com/username"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Cover Letter / Note (Optional)
                    </label>
                    <textarea
                      rows={3}
                      value={formData.coverLetter}
                      onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-[var(--brand-primary,#3B66D4)] focus:ring-2 focus:ring-blue-100 resize-none placeholder-slate-400"
                      placeholder="Briefly introduce your background and experience..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 rounded-xl bg-[var(--brand-primary,#3B66D4)] hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 disabled:opacity-50 transition-transform hover:scale-[1.01] active:scale-98"
                  >
                    {submitting ? (
                      <span>Uploading Resume & Submitting...</span>
                    ) : (
                      <>
                        <span>Submit Application</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
