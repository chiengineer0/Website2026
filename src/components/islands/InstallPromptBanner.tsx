import { Download, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface DeferredPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallPromptBanner() {
  const [event, setEvent] = useState<DeferredPromptEvent | null>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('pwa-banner-dismissed') === '1') {
      setHidden(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setEvent(e as DeferredPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  if (!event || hidden) return null;

  return (
    <aside className="fixed bottom-24 left-1/2 z-50 w-[min(720px,calc(100%-1rem))] -translate-x-1/2 rounded-xl border border-white/20 bg-black/90 p-4 shadow-2xl backdrop-blur-md md:bottom-6" aria-label="Install app banner">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold">Install [BRAND NAME] Electric App</p>
          <p className="mt-1 text-sm text-white/75">Quick emergency access, offline service details, and faster repeat quote requests.</p>
          <button
            type="button"
            className="mt-3 inline-flex min-h-12 items-center gap-2 rounded-md bg-[var(--color-amber)] px-4 font-bold text-black"
            onClick={async () => {
              await event.prompt();
              const result = await event.userChoice;
              if (result.outcome === 'accepted') {
                setEvent(null);
              }
            }}
          >
            <Download size={16} /> Install App
          </button>
        </div>
        <button
          type="button"
          className="min-h-12 min-w-12 rounded-md border border-white/20"
          onClick={() => {
            localStorage.setItem('pwa-banner-dismissed', '1');
            setHidden(true);
          }}
          aria-label="Dismiss install prompt"
        >
          <X size={16} />
        </button>
      </div>
    </aside>
  );
}
