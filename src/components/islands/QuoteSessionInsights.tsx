import { useEffect, useMemo, useState } from 'react';
import { db, type QuoteDraft } from '@/lib/db';

interface AnalyticsEvent {
  event: string;
  timestamp: string;
}

function readAnalyticsEvents(): AnalyticsEvent[] {
  try {
    const raw = localStorage.getItem('analytics-events');
    return raw ? (JSON.parse(raw) as AnalyticsEvent[]) : [];
  } catch {
    localStorage.removeItem('analytics-events');
    return [];
  }
}

export function QuoteSessionInsights() {
  const [draft, setDraft] = useState<QuoteDraft | null>(null);
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);

  useEffect(() => {
    void db.drafts.get(1).then((entry) => setDraft(entry ?? null));

    setEvents(readAnalyticsEvents().slice(-20));
  }, []);

  const grouped = useMemo(() => {
    const map = new Map<string, number>();
    for (const event of events) {
      map.set(event.event, (map.get(event.event) ?? 0) + 1);
    }
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]).slice(0, 6);
  }, [events]);

  return (
    <section className="surface-card mt-8 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-black">Session Insights</h2>
          <p className="mt-1 text-sm text-white/70">Local-only activity snapshot from this browser session.</p>
        </div>
        <button
          type="button"
          className="min-h-12 rounded-md border border-white/25 px-3 text-xs text-white/80 hover:border-white/40"
          onClick={() => {
            localStorage.removeItem('analytics-events');
            setEvents([]);
          }}
        >
          Clear activity
        </button>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div>
          <h3 className="font-semibold">Saved Draft</h3>
          {draft ? (
            <ul className="mt-2 space-y-1 text-sm text-white/80">
              <li><strong>Last Updated:</strong> {new Date(draft.updatedAt).toLocaleString()}</li>
              <li><strong>Service:</strong> {draft.data.serviceCategory ?? 'Not selected'}</li>
              <li><strong>Job Type:</strong> {draft.data.jobType ?? 'Not selected'}</li>
              <li><strong>Urgency:</strong> {draft.data.urgency ? 'Expedited' : 'Standard'}</li>
            </ul>
          ) : (
            <p className="mt-2 text-sm text-white/65">No local draft saved yet.</p>
          )}
        </div>

        <div>
          <h3 className="font-semibold">Top Interaction Events</h3>
          {grouped.length > 0 ? (
            <ul className="mt-2 space-y-1 text-sm text-white/80">
              {grouped.map(([name, count]) => (
                <li key={name}><strong>{name}</strong>: {count}</li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-white/65">No interaction events captured yet.</p>
          )}
        </div>
      </div>

      <p className="mt-4 text-xs text-white/55">{events.length} recent event(s) captured. This panel is private to your browser and helps you resume and optimize estimate completion.</p>
    </section>
  );
}
