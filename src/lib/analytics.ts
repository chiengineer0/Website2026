export interface AnalyticsPayload {
  [key: string]: string | number | boolean | null | undefined;
}

interface DataLayerEvent {
  event: string;
  payload?: AnalyticsPayload;
  timestamp: string;
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

  const existing = localStorage.getItem('analytics-events');
  const list: DataLayerEvent[] = existing ? (JSON.parse(existing) as DataLayerEvent[]) : [];
  list.push(record);
  localStorage.setItem('analytics-events', JSON.stringify(list.slice(-80)));
}
