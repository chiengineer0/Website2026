import { motion } from 'motion/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { db } from '@/lib/db';
import { trackEvent } from '@/lib/analytics';
import { quoteSchema, type QuoteFormData } from '@/lib/quote-schema';

const initialData: Partial<QuoteFormData> = {
  jobType: 'Residential',
  serviceCategory: 'Panel upgrade',
  propertySize: 2000,
  propertyAge: '10-30 years',
  urgency: false,
};

const steps = ['Project Type', 'Service', 'Property', 'Contact', 'Summary'] as const;

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function QuoteEstimator() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Partial<QuoteFormData>>(initialData);
  const [errorMessage, setErrorMessage] = useState('');
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const sessionStartRef = useRef(0);
  const stepStartRef = useRef(0);
  const summaryViewTrackedRef = useRef(false);

  useEffect(() => {
    sessionStartRef.current = performance.now();
    stepStartRef.current = performance.now();

    let restoredDraft = false;
    try {
      const raw = localStorage.getItem('quote-draft');
      if (raw) {
        setData(JSON.parse(raw) as Partial<QuoteFormData>);
        restoredDraft = true;
      }
    } catch {
      localStorage.removeItem('quote-draft');
    }

    trackEvent('quote_estimator_loaded', { restoredDraft });
  }, []);

  useEffect(() => {
    localStorage.setItem('quote-draft', JSON.stringify(data));
    db.drafts.put({ id: 1, data, updatedAt: new Date().toISOString() });
  }, [data]);

  const estimate = useMemo(() => {
    const base = data.serviceCategory === 'Emergency' ? 1200 : 800;
    const sizeFactor = (data.propertySize ?? 2000) / 1000;
    const urgencyFactor = data.urgency ? 1.35 : 1;
    const low = Math.round(base * sizeFactor * urgencyFactor);
    const high = Math.round(low * 1.45);
    return `$${low.toLocaleString()} - $${high.toLocaleString()}`;
  }, [data]);

  const leadScore = useMemo(() => {
    let score = 35;
    if (data.jobType === 'Commercial') score += 20;
    if (data.jobType === 'Industrial') score += 28;
    if (data.urgency) score += 22;
    if ((data.propertySize ?? 0) > 3500) score += 10;
    if (data.serviceCategory === 'Emergency') score += 25;
    if (data.serviceCategory === 'Panel upgrade' || data.serviceCategory === 'Generator') score += 8;
    return Math.min(100, score);
  }, [data]);

  const priorityTier = useMemo(() => {
    if (leadScore >= 80) return 'Priority Dispatch Candidate';
    if (leadScore >= 60) return 'Accelerated Review';
    return 'Standard Review Queue';
  }, [leadScore]);

  const recommendation = useMemo(() => {
    if (data.serviceCategory === 'Emergency') return 'Immediate safety dispatch recommended. Call directly for fastest triage.';
    if ((data.propertySize ?? 0) > 4000) return 'A site walk-through is recommended before final estimate to validate load planning and access conditions.';
    if (data.serviceCategory === 'EV charger install') return 'Include vehicle charging habits and panel photos for a tighter first proposal.';
    return 'Provide photos of your panel and project area to accelerate final estimate turnaround.';
  }, [data]);

  useEffect(() => {
    if (step !== 4 || summaryViewTrackedRef.current) return;

    const elapsedMs = Math.round(performance.now() - sessionStartRef.current);
    trackEvent('quote_summary_viewed', { elapsedMs, leadScore, priorityTier });
    summaryViewTrackedRef.current = true;
  }, [step, leadScore, priorityTier]);

  const completion = ((step + 1) / steps.length) * 100;

  function clearDraft() {
    localStorage.removeItem('quote-draft');
    setData(initialData);
    setStep(0);
    setErrorMessage('');
    stepStartRef.current = performance.now();
    summaryViewTrackedRef.current = false;
    trackEvent('quote_draft_cleared');
  }

  function exportPdf() {
    if (isExportingPdf) return;
    setIsExportingPdf(true);
    const exportStart = performance.now();

    try {
      const printWindow = window.open('', '_blank', 'noopener,noreferrer');
      if (!printWindow) {
        setErrorMessage('Unable to open print preview. Please allow popups for this site.');
        trackEvent('quote_pdf_download_failed', { reason: 'popup_blocked' });
        return;
      }

      const generatedAt = new Date().toLocaleString();
      const summaryRows = [
        ['Project Type', data.jobType ?? '-'],
        ['Service', data.serviceCategory ?? '-'],
        ['Property Size', `${data.propertySize ?? '-'} sq ft`],
        ['Urgency', data.urgency ? 'Expedited' : 'Standard'],
        ['Estimated Range', estimate],
        ['Lead Priority', `${priorityTier} (${leadScore}/100)`],
        ['Client', data.name ?? '-'],
        ['Phone', data.phone ?? '-'],
        ['Email', data.email ?? '-'],
        ['Address', data.address ?? '-'],
      ];

      const rows = summaryRows
        .map(([label, value]) => `<tr><th>${escapeHtml(label)}</th><td>${escapeHtml(value)}</td></tr>`)
        .join('');

      printWindow.document.write(`<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Quote Summary</title>
    <style>
      body { font-family: Inter, Arial, sans-serif; margin: 24px; color: #111827; }
      h1 { margin: 0 0 4px; font-size: 22px; }
      p { margin: 0 0 16px; color: #4b5563; }
      table { border-collapse: collapse; width: 100%; margin-top: 12px; }
      th, td { text-align: left; border: 1px solid #e5e7eb; padding: 10px; vertical-align: top; }
      th { width: 220px; background: #f9fafb; font-weight: 600; }
      .footer { margin-top: 16px; font-size: 12px; color: #6b7280; }
    </style>
  </head>
  <body>
    <h1>إصلاح الكهرباء - Quote Summary</h1>
    <p>Generated ${escapeHtml(generatedAt)}</p>
    <table>${rows}</table>
    <p class="footer">Print this page and choose “Save as PDF” in the print dialog if you need a PDF file.</p>
  </body>
</html>`);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();

      const generationMs = Math.round(performance.now() - exportStart);
      trackEvent('quote_pdf_downloaded', { leadScore, priorityTier, generationMs, method: 'browser_print' });
    } catch {
      setErrorMessage('Unable to generate PDF right now. Please retry in a moment.');
      trackEvent('quote_pdf_download_failed');
    } finally {
      setIsExportingPdf(false);
    }
  }

  return (
    <section className="rounded-2xl border border-white/15 bg-[var(--color-surface)] p-4 sm:p-8">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          {steps.map((label, index) => (
            <span key={label} className={`rounded-full px-3 py-1 text-xs ${index <= step ? 'bg-[var(--color-electric)]/25 text-white' : 'bg-white/10 text-white/60'}`}>
              {index + 1}. {label}
            </span>
          ))}
        </div>
        <button type="button" onClick={clearDraft} className="min-h-12 rounded-md border border-white/25 px-3 text-xs text-white/80 hover:border-white/40">
          Clear saved draft
        </button>
      </div>
      <div className="mb-6 h-2 w-full rounded-full bg-white/10">
        <div className="h-full rounded-full bg-[var(--color-electric)]" style={{ width: `${completion}%` }} />
      </div>
      <p className="text-sm text-white/70">Step {step + 1} of {steps.length}: {steps[step]}</p>
      {errorMessage ? <p className="mt-2 rounded-md border border-red-300/50 bg-red-900/30 px-3 py-2 text-sm text-red-200">{errorMessage}</p> : null}

      <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="mt-4">
        {step === 0 && (
          <div className="grid gap-3 sm:grid-cols-3">
            {['Residential', 'Commercial', 'Industrial'].map((job) => (
              <button key={job} type="button" className="min-h-12 rounded-lg border border-white/20 p-3" onClick={() => setData((v) => ({ ...v, jobType: job as QuoteFormData['jobType'] }))}>{job}</button>
            ))}
          </div>
        )}

        {step === 1 && (
          <select className="min-h-12 w-full rounded-md border border-white/20 bg-black/40 px-3" value={data.serviceCategory} onChange={(event) => setData((v) => ({ ...v, serviceCategory: event.target.value as QuoteFormData['serviceCategory'] }))}>
            {['Panel upgrade', 'New wiring', 'EV charger install', 'Generator', 'Lighting', 'Outlet/Switch', 'Emergency', 'Other'].map((option) => <option key={option}>{option}</option>)}
          </select>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <label className="block">Property size: {data.propertySize} sq ft
              <input type="range" min={400} max={12000} step={100} value={data.propertySize} onChange={(event) => setData((v) => ({ ...v, propertySize: Number(event.target.value) }))} className="mt-2 w-full" />
            </label>
            <select className="min-h-12 w-full rounded-md border border-white/20 bg-black/40 px-3" value={data.propertyAge} onChange={(event) => setData((v) => ({ ...v, propertyAge: event.target.value as QuoteFormData['propertyAge'] }))}>
              {['Under 10 years', '10-30 years', '30-60 years', '60+ years'].map((option) => <option key={option}>{option}</option>)}
            </select>
            <label className="flex min-h-12 items-center gap-3"><input type="checkbox" checked={Boolean(data.urgency)} onChange={(event) => setData((v) => ({ ...v, urgency: event.target.checked }))} />Urgent scheduling needed</label>
          </div>
        )}

        {step === 3 && (
          <div className="grid gap-3 sm:grid-cols-2">
            {['name', 'phone', 'email', 'address'].map((field) => (
              <input
                key={field}
                className="min-h-12 rounded-md border border-white/20 bg-black/40 px-3"
                placeholder={field[0].toUpperCase() + field.slice(1)}
                value={(data[field as keyof QuoteFormData] as string | undefined) ?? ''}
                onChange={(event) => setData((v) => ({ ...v, [field]: event.target.value }))}
              />
            ))}
          </div>
        )}

        {step === 4 && (
          <div className="rounded-xl border border-white/20 bg-black/40 p-5">
            <h3 className="text-xl font-semibold">Estimated Investment Range</h3>
            <p className="mt-2 text-3xl font-black text-[var(--color-amber)]">{estimate}</p>
            <p className="mt-2 text-sm text-white/70">Final proposal follows an onsite assessment by a licensed electrician.</p>
            <div className="mt-4 grid gap-2 text-sm text-white/75 sm:grid-cols-2">
              <p><strong>Project Type:</strong> {data.jobType}</p>
              <p><strong>Service:</strong> {data.serviceCategory}</p>
              <p><strong>Property Size:</strong> {data.propertySize} sq ft</p>
              <p><strong>Urgency:</strong> {data.urgency ? 'Expedited' : 'Standard'}</p>
            </div>
            <div className="mt-4 rounded-md border border-white/20 bg-black/35 p-3 text-sm text-white/80">
              <p><strong>Lead Priority Score:</strong> {leadScore}/100 · {priorityTier}</p>
              <p className="mt-1 text-white/70">{recommendation}</p>
            </div>
            <form
              action="https://formspree.io/f/mzzvgjov"
              method="POST"
              className="mt-6"
              onSubmit={() => {
                trackEvent('quote_form_submitted', { leadScore, priorityTier, urgency: data.urgency ?? false });
              }}
            >
              <input type="hidden" name="payload" value={JSON.stringify(data)} />
              <input type="hidden" name="leadScore" value={String(leadScore)} />
              <input type="hidden" name="priorityTier" value={priorityTier} />
              <button type="submit" className="pulse-amber min-h-12 rounded-md bg-[var(--color-amber)] px-6 font-semibold text-black">Submit Request</button>
              <button type="button" disabled={isExportingPdf} onClick={exportPdf} className="ml-3 min-h-12 rounded-md border border-white/25 px-6 disabled:opacity-50">{isExportingPdf ? 'Generating PDF...' : 'Download PDF'}</button>
            </form>
          </div>
        )}
      </motion.div>

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          disabled={step === 0}
          className="min-h-12 rounded-md border border-white/25 px-4 disabled:opacity-50"
          onClick={() => {
            const dwellMs = Math.round(performance.now() - stepStartRef.current);
            trackEvent('quote_step_reversed', { fromStep: step + 1, toStep: Math.max(1, step), dwellMs });
            stepStartRef.current = performance.now();
            setStep((value) => Math.max(0, value - 1));
          }}
        >
          Back
        </button>
        <button
          type="button"
          disabled={step === 4}
          className="min-h-12 rounded-md bg-[var(--color-electric)] px-4 font-semibold text-white disabled:opacity-50"
          onClick={() => {
            setErrorMessage('');
            if (step === 3) {
              const parsed = quoteSchema.safeParse(data);
              if (!parsed.success) {
                setErrorMessage('Please complete all contact fields with valid details before continuing.');
                trackEvent('quote_step_validation_failed', { step: 4 });
                return;
              }
            }
            const nextStep = Math.min(4, step + 1);
            const dwellMs = Math.round(performance.now() - stepStartRef.current);
            trackEvent('quote_step_advanced', { fromStep: step + 1, toStep: nextStep + 1, dwellMs });
            stepStartRef.current = performance.now();
            setStep((value) => Math.min(4, value + 1));
          }}
        >
          Continue
        </button>
      </div>
    </section>
  );
}
