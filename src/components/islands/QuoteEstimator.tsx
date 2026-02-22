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

  const completion = ((step + 1) / steps.length) * 100;

  return (
    <section className="rounded-2xl border border-white/15 bg-[var(--color-surface)] p-4 sm:p-8">
      <div className="mb-6 h-2 w-full rounded-full bg-white/10">
        <div className="h-full rounded-full bg-[var(--color-electric)]" style={{ width: `${completion}%` }} />
      </div>
      <p className="text-sm text-white/70">Step {step + 1} of {steps.length}: {steps[step]}</p>

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
            <form action="https://formspree.io/f/mzzvgjov" method="POST" className="mt-6">
              <input type="hidden" name="payload" value={JSON.stringify(data)} />
              <button type="submit" className="pulse-amber min-h-12 rounded-md bg-[var(--color-amber)] px-6 font-semibold text-black">Submit Request</button>
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
            if (step === 3) {
              const parsed = quoteSchema.safeParse(data);
              if (!parsed.success) return;
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
