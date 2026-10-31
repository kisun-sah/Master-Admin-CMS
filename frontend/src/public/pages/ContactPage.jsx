import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { submitContact } from '../lib/api';
import { useCms } from '../context/CmsContext';
import SEOHead from '../components/layout/SEOHead';
import {
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  Sparkles,
  Send,
  CheckCircle2,
  AlertCircle,
  Github,
  Linkedin,
  Twitter,
  Clock,
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

  const whatsappNumber = settings?.contactPhone
    ? settings.contactPhone.replace(/[^0-9]/g, '')
    : '15550192834';

  return (
    <div className="pt-28 pb-20 bg-[#090D16] min-h-screen">
      <SEOHead
        title="Hire Me / Order a Website — Contact Studio"
        description="Get in touch to order a custom MERN website with Master Admin CMS, integrate AI chatbots, or hire a dedicated IT Officer. Direct WhatsApp, phone, and lead inquiry."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Direct Studio Access</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Order a Website or Hire Our Studio
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-400">
            Have a project in mind or need dedicated IT & Marketing consulting? Send us an inquiry or chat directly on WhatsApp.
          </p>
        </div>

        {/* 2-Column Layout: Direct Details (5 cols) + Order Form (7 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-16">
          {/* Left Column: Direct Contact Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-card rounded-3xl p-8 border border-white/10 space-y-6">
              <h3 className="text-2xl font-bold text-white">Direct Communication</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                We respond to all verified business inquiries within 2 to 4 business hours.
              </p>

              <div className="space-y-4 text-sm text-slate-300">
                {settings?.contactEmail && (
                  <div className="flex items-start gap-3.5 p-4 rounded-2xl glass-panel border border-white/5">
                    <Mail className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs text-slate-400">Direct Email</div>
                      <a
                        href={`mailto:${settings.contactEmail}`}
                        className="font-bold text-white hover:text-cyan-400 transition-colors"
                      >
                        {settings.contactEmail}
                      </a>
                    </div>
                  </div>
                )}

                {settings?.contactPhone && (
                  <div className="flex items-start gap-3.5 p-4 rounded-2xl glass-panel border border-white/5">
                    <Phone className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs text-slate-400">Phone & WhatsApp</div>
                      <a
                        href={`tel:${settings.contactPhone}`}
                        className="font-bold text-white hover:text-cyan-400 transition-colors"
                      >
                        {settings.contactPhone}
                      </a>
                    </div>
                  </div>
                )}

                {settings?.address && (
                  <div className="flex items-start gap-3.5 p-4 rounded-2xl glass-panel border border-white/5">
                    <MapPin className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs text-slate-400">Studio Location</div>
                      <div className="font-semibold text-white">{settings.address}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Direct WhatsApp Action Button */}
              {settings?.contactPhone && (
                <div className="pt-2">
                  <a
                    href={`https://wa.me/${whatsappNumber}?text=Hello!%20I'm%20interested%20in%20ordering%20a%20website%20or%20IT%20services.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-sm shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-2 transition-all"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>Quick Chat on WhatsApp</span>
                  </a>
                </div>
              )}
            </div>

            {/* SLA Trust Badge */}
            <div className="glass-panel rounded-2xl p-6 border border-white/10 flex items-center gap-4 text-xs text-slate-300">
              <ShieldCheck className="w-8 h-8 text-cyan-400 shrink-0" />
              <div>
                <div className="font-bold text-white">Full Privacy & NDA Guaranteed</div>
                <div className="text-slate-400 mt-0.5">
                  Your project requirements and commercial data are strictly protected.
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Order / Hire Form */}
          <div className="lg:col-span-7">
            <div className="glass-card rounded-3xl p-8 sm:p-10 border border-cyan-500/30 shadow-neon-cyan">
              <h3 className="text-2xl font-bold text-white mb-2">Send Project Brief</h3>
              <p className="text-sm text-slate-400 mb-8">
                Fill in the details below to receive a comprehensive proposal and delivery schedule.
              </p>

              {success ? (
                <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-4">
                  <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto" />
                  <h4 className="text-2xl font-bold text-white">Inquiry Dispatched!</h4>
                  <p className="text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
                    Thank you for reaching out. We have received your project details into our Master Admin CMS inbox and will follow up shortly.
                  </p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="px-6 py-2.5 rounded-full btn-primary-glow text-xs font-bold inline-block"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {error && (
                    <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl glass-panel border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400"
                        placeholder="John Smith"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Your Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl glass-panel border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400"
                        placeholder="john@company.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Phone / WhatsApp (Optional)
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl glass-panel border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Interested Service *
                      </label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl glass-panel border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400 bg-slate-900"
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
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Project Details & Timeline *
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl glass-panel border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400 resize-none"
                      placeholder="Tell us about your business goals, desired features, reference websites, or timeline..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 btn-primary-glow font-bold text-sm shadow-neon-cyan flex items-center justify-center gap-2 disabled:opacity-50"
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
          </div>
        </div>

        {/* Google Maps Responsive Embed from settings.mapEmbedUrl */}
        {settings?.mapEmbedUrl && (
          <div className="rounded-3xl overflow-hidden glass-card border border-white/10 shadow-2xl h-80 sm:h-96">
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
