import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { submitContact } from '../lib/api';
import { useCms } from '../context/CmsContext';
import SEOHead from '../components/layout/SEOHead';
import { FadeUp, ScaleIn } from '../components/common/ScrollReveal';
import {
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  Sparkles,
  Send,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';

export default function ContactPage() {
  const { settings } = useCms();
  const [searchParams] = useSearchParams();
  const initialSubject =
    searchParams.get('project') || searchParams.get('service')
      ? `Inquiry for ${searchParams.get('project') || searchParams.get('service')}`
      : 'Buy a Custom Business Website';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: initialSubject,
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError(null);
      await submitContact(formData);
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'Buy a Custom Business Website',
        message: '',
      });
    } catch (err) {
      setError(err.message || 'Failed to submit inquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const cleanPhone = settings?.contactPhone
    ? settings.contactPhone.replace(/[^0-9]/g, '')
    : '014546038';

  return (
    <div className="pt-28 pb-20 bg-[#F8FAFC] min-h-screen">
      <SEOHead
        title="Hire Me / Order a Website — Contact Studio"
        description="Get in touch to order a custom MERN website with Master Admin CMS, integrate AI chatbots, or hire a dedicated IT Officer. Direct WhatsApp, phone, and lead inquiry."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <FadeUp className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-100 text-[var(--brand-primary,#3B66D4)] text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Direct Studio Access</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Order a Website or Hire Our Studio
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            Have a project in mind or need dedicated IT & Marketing consulting? Send us an inquiry or chat directly on WhatsApp.
          </p>
        </FadeUp>

        {/* 2-Column Layout: Direct Details (5 cols) + Order Form (7 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-16">
          {/* Left Column: Direct Contact Cards */}
          <FadeUp delay={0.1} className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-6">
              <h3 className="text-2xl font-bold text-slate-900">Direct Communication</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                We respond to all verified business inquiries within 2 to 4 business hours.
              </p>

              <div className="space-y-4 text-sm">
                {settings?.contactEmail && (
                  <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <Mail className="w-5 h-5 text-[var(--brand-primary,#3B66D4)] shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs text-slate-500 font-medium">Direct Email</div>
                      <a
                        href={`mailto:${settings.contactEmail}`}
                        className="font-bold text-slate-900 hover:text-[var(--brand-primary,#3B66D4)] transition-colors"
                      >
                        {settings.contactEmail}
                      </a>
                    </div>
                  </div>
                )}

                {settings?.contactPhone && (
                  <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <Phone className="w-5 h-5 text-[var(--brand-primary,#3B66D4)] shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs text-slate-500 font-medium">Phone & WhatsApp</div>
                      <a
                        href={`tel:${settings.contactPhone}`}
                        className="font-bold text-slate-900 hover:text-[var(--brand-primary,#3B66D4)] transition-colors"
                      >
                        {settings.contactPhone}
                      </a>
                    </div>
                  </div>
                )}

                {settings?.address && (
                  <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <MapPin className="w-5 h-5 text-[var(--brand-primary,#3B66D4)] shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs text-slate-500 font-medium">Studio Location</div>
                      <div className="font-semibold text-slate-900">{settings.address}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Direct WhatsApp Action Button */}
              {settings?.contactPhone && (
                <div className="pt-2">
                  <a
                    href={`https://wa.me/${cleanPhone}?text=Hello!%20I'm%20interested%20in%20ordering%20a%20website%20or%20IT%20services.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-sm shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] active:scale-95"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>Quick Chat on WhatsApp</span>
                  </a>
                </div>
              )}
            </div>

            {/* SLA Trust Badge */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex items-center gap-4 text-xs text-slate-600">
              <ShieldCheck className="w-8 h-8 text-[var(--brand-primary,#3B66D4)] shrink-0" />
              <div>
                <div className="font-bold text-slate-900">Full Privacy & NDA Guaranteed</div>
                <div className="text-slate-500 mt-0.5">
                  Your project requirements and commercial data are strictly protected.
                </div>
              </div>
            </div>
          </FadeUp>

          {/* Right Column: Interactive Order / Hire Form */}
          <ScaleIn delay={0.15} className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-sm">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Send Project Brief</h3>
              <p className="text-sm text-slate-600 mb-8">
                Fill in the details below to receive a comprehensive proposal and delivery schedule.
              </p>

              {success ? (
                <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-4">
                  <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto" />
                  <h4 className="text-2xl font-bold text-slate-900">Inquiry Dispatched!</h4>
                  <p className="text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
                    Thank you for reaching out. We have received your project details into our Master Admin CMS inbox and will follow up shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSuccess(false)}
                    className="px-6 py-2.5 rounded-full bg-[var(--brand-primary,#3B66D4)] hover:bg-blue-700 text-white text-xs font-bold inline-block"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {error && (
                    <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-[var(--brand-primary,#3B66D4)] focus:ring-2 focus:ring-blue-100 transition-all placeholder-slate-400"
                        placeholder="John Smith"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Your Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-[var(--brand-primary,#3B66D4)] focus:ring-2 focus:ring-blue-100 transition-all placeholder-slate-400"
                        placeholder="john@company.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Phone / WhatsApp (Optional)
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-[var(--brand-primary,#3B66D4)] focus:ring-2 focus:ring-blue-100 transition-all placeholder-slate-400"
                        placeholder="+977 (01) 4546038"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Interested Service *
                      </label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-[var(--brand-primary,#3B66D4)] focus:ring-2 focus:ring-blue-100 transition-all"
                      >
                        <option value="Buy a Custom Business Website">
                          Buy a Custom Business Website (with CMS)
                        </option>
                        <option value="Ready-to-Deploy Website Template">
                          Ready-to-Deploy Website Template ($149)
                        </option>
                        <option value="AI Chatbot & Automation">
                          AI Chatbot & Workflow Automation
                        </option>
                        <option value="Digital Marketing & SEO Package">
                          Digital Marketing & SEO Package
                        </option>
                        <option value="IT Officer & Cloud Systems Support">
                          IT Officer & Cloud Systems Support
                        </option>
                        <option value="General Inquiry">General Inquiry / Consultation</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Project Details & Timeline *
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-[var(--brand-primary,#3B66D4)] focus:ring-2 focus:ring-blue-100 transition-all resize-none placeholder-slate-400"
                      placeholder="Tell us about your business goals, desired features, reference websites, or timeline..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 rounded-xl bg-[var(--brand-primary,#3B66D4)] hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 disabled:opacity-50 transition-all hover:scale-[1.01] active:scale-98"
                  >
                    {submitting ? (
                      <span>Dispatching Brief...</span>
                    ) : (
                      <>
                        <span>Submit Project Brief</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </ScaleIn>
        </div>

        {/* Google Maps Responsive Embed from settings.mapEmbedUrl */}
        {settings?.mapEmbedUrl && (
          <div className="rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-sm h-80 sm:h-96">
            <iframe
              src={settings.mapEmbedUrl}
              title="Office Location"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        )}
      </div>
    </div>
  );
}
