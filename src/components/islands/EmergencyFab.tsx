import { AnimatePresence, motion } from 'motion/react';
import { Phone } from 'lucide-react';
import { useState } from 'react';
import { trackEvent } from '@/lib/analytics';

export function EmergencyFab() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-20 right-4 z-50 sm:bottom-6">
      <button
        type="button"
        onClick={() => {
          setOpen((current) => {
            const next = !current;
            trackEvent('emergency_fab_toggle', { open: next });
            return next;
          });
        }}
        className="emergency-shake min-h-12 rounded-full bg-[var(--color-emergency)] px-4 py-3 font-semibold text-white shadow-lg shadow-red-600/40"
        aria-expanded={open}
      >
        ⚡ Emergency? Call Now
      </button>
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="mt-3 rounded-xl border border-red-400/40 bg-black/95 p-4 text-white"
          >
            <p className="text-sm">24/7 Dispatch</p>
            <a href="tel:+15551239876" onClick={() => trackEvent('emergency_call_click', { source: 'fab' })} className="mt-2 inline-flex min-h-12 items-center gap-2 font-bold text-[var(--color-amber)]">
              <Phone size={18} /> (555) 123-9876
            </a>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
