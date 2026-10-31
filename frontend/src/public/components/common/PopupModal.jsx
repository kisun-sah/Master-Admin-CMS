import React, { useEffect, useState } from 'react';
import { getActivePopup, resolveMediaUrl } from '../../lib/api';
import { X, Sparkles, ArrowRight } from 'lucide-react';

export default function PopupModal() {
  const [popup, setPopup] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    async function loadPopup() {
      try {
        const data = await getActivePopup();
        if (!data || !data._id) return;

        const popupId = data._id;
        const frequency = data.frequency || 'once_per_session';

        if (frequency === 'once_per_session') {
          const sessionKey = `popup_shown_${popupId}`;
          if (sessionStorage.getItem(sessionKey)) return;
        } else if (frequency === 'once_per_day') {
          const localKey = `popup_shown_${popupId}`;
          const lastShown = localStorage.getItem(localKey);
          if (lastShown) {
            const timeDiff = Date.now() - parseInt(lastShown, 10);
            if (timeDiff < 24 * 60 * 60 * 1000) return;
          }
        }

        // Delay popup slightly for smooth UX (e.g., 2 seconds after page load)
        const timer = setTimeout(() => {
          setPopup(data);
          setIsOpen(true);
        }, 2000);

        return () => clearTimeout(timer);
      } catch (e) {
        // No active popup or error, gracefully ignore
      }
    }

    loadPopup();
  }, []);

  const handleClose = () => {
    if (!popup) return;
    const popupId = popup._id;
    const frequency = popup.frequency || 'once_per_session';

    if (frequency === 'once_per_session') {
      sessionStorage.setItem(`popup_shown_${popupId}`, 'true');
    } else if (frequency === 'once_per_day') {
      localStorage.setItem(`popup_shown_${popupId}`, Date.now().toString());
    }

    setIsOpen(false);
  };

  if (!isOpen || !popup) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-lg glass-panel rounded-3xl border border-white/20 shadow-2xl overflow-hidden p-6 sm:p-8 animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          aria-label="Close Announcement"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Media Preview if attached */}
        {popup.mediaUrl && (
          <div className="aspect-[16/9] rounded-2xl overflow-hidden mb-6 bg-slate-900 border border-white/10">
            <img
              src={resolveMediaUrl(popup.mediaUrl)}
              alt={popup.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Limited Time Opportunity</span>
        </div>

        {/* Title */}
        <h3 className="text-2xl font-extrabold text-white mb-3">
          {popup.title}
        </h3>

        {/* Content */}
        <div
          className="text-sm text-slate-300 leading-relaxed mb-6 prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: popup.content }}
        />

        {/* CTA Button */}
        {popup.ctaText && popup.ctaLink && (
          <a
            href={popup.ctaLink}
            onClick={handleClose}
            className="w-full py-3.5 btn-primary-glow font-bold text-sm flex items-center justify-center gap-2 shadow-neon-cyan"
          >
            <span>{popup.ctaText}</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        )}
      </div>
    </div>
  );
}
