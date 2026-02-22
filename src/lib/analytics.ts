export interface AnalyticsPayload {
  [key: string]: string | number | boolean | null | undefined;
}

interface DataLayerEvent {
  event: string;
  payload?: AnalyticsPayload;
  timestamp: string;
}

const MAX_EVENT_HISTORY = 80;

function readStoredEvents(): DataLayerEvent[] {
  if (typeof window === 'undefined') return [];

  try {
    const existing = localStorage.getItem('analytics-events');
    return existing ? (JSON.parse(existing) as DataLayerEvent[]) : [];
  } catch {
    localStorage.removeItem('analytics-events');
    return [];
  }
}

declare global {
  interface Window {
    dataLayer?: DataLayerEvent[];
  }
}

export function trackEvent(event: string, payload?: AnalyticsPayload) {
  if (typeof window === 'undefined') return;

  const record: DataLayerEvent = {
    event,
    payload,
    timestamp: new Date().toISOString(),
  };

  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push(record);

  const list = readStoredEvents();
  list.push(record);
  localStorage.setItem('analytics-events', JSON.stringify(list.slice(-MAX_EVENT_HISTORY)));
}
