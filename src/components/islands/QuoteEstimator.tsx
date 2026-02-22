import { motion } from 'motion/react';
import { useEffect, useMemo, useState } from 'react';
import { db } from '@/lib/db';
import { quoteSchema, type QuoteFormData } from '@/lib/quote-schema';

const initialData: Partial<QuoteFormData> = {
  jobType: 'Residential',
  serviceCategory: 'Panel upgrade',
  propertySize: 2000,
  propertyAge: '10-30 years',
  urgency: false,
};

const steps = ['Project Type', 'Service', 'Property', 'Contact', 'Summary'] as const;

export function QuoteEstimator() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Partial<QuoteFormData>>(initialData);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const raw = localStorage.getItem('quote-draft');
    if (raw) setData(JSON.parse(raw) as Partial<QuoteFormData>);
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

  const completion = ((step + 1) / steps.length) * 100;

  function clearDraft() {
    localStorage.removeItem('quote-draft');
    setData(initialData);
    setStep(0);
    setErrorMessage('');
  }

  async function exportPdf() {
    const { jsPDF } = await import('jspdf');
    const document = new jsPDF();
    const lines = [
      '[BRAND NAME] Electric - Quote Summary',
      `Date: ${new Date().toLocaleString()}`,
      '',
      `Project Type: ${data.jobType ?? '-'}`,
      `Service: ${data.serviceCategory ?? '-'}`,
      `Property Size: ${data.propertySize ?? '-'} sq ft`,
      `Urgency: ${data.urgency ? 'Expedited' : 'Standard'}`,
      `Estimated Range: ${estimate}`,
      `Lead Priority: ${priorityTier} (${leadScore}/100)`,
      '',
      `Client: ${data.name ?? '-'}`,
      `Phone: ${data.phone ?? '-'}`,
      `Email: ${data.email ?? '-'}`,
      `Address: ${data.address ?? '-'}`,
    ];

    let y = 20;
    for (const line of lines) {
      document.text(line, 14, y);
      y += 8;
    }
    document.save('brand-electric-quote-summary.pdf');
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
            <form action="https://formspree.io/f/mzzvgjov" method="POST" className="mt-6">
              <input type="hidden" name="payload" value={JSON.stringify(data)} />
              <input type="hidden" name="leadScore" value={String(leadScore)} />
              <input type="hidden" name="priorityTier" value={priorityTier} />
              <button type="submit" className="pulse-amber min-h-12 rounded-md bg-[var(--color-amber)] px-6 font-semibold text-black">Submit Request</button>
              <button type="button" onClick={exportPdf} className="ml-3 min-h-12 rounded-md border border-white/25 px-6">Download PDF</button>
            </form>
          </div>
        )}
      </motion.div>

      <div className="mt-6 flex gap-3">
        <button type="button" disabled={step === 0} className="min-h-12 rounded-md border border-white/25 px-4 disabled:opacity-50" onClick={() => setStep((value) => Math.max(0, value - 1))}>Back</button>
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
                return;
              }
            }
            setStep((value) => Math.min(4, value + 1));
          }}
        >
          Continue
        </button>
      </div>
    </section>
  );
}
