import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  serviceType: z.string().min(2),
  message: z.string().min(10),
  preferredContact: z.enum(['Phone', 'Email', 'Text Message']),
  bestTime: z.string().min(2),
});

type ContactData = z.infer<typeof schema>;

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ContactData>({
    resolver: zodResolver(schema),
    defaultValues: { preferredContact: 'Phone' },
  });

  const action = useMemo(() => 'https://formspree.io/f/mzzvgjov', []);

  if (sent) {
    return <div className="rounded-xl border border-emerald-400/50 bg-emerald-900/30 p-5">Thanks — your message is confirmed. A licensed estimator will respond within 1 business hour, and emergency requests are escalated immediately.</div>;
  }

  return (
    <form
      action={action}
      method="POST"
      className="grid gap-3 rounded-xl border border-white/15 bg-white/5 p-4"
      onSubmit={handleSubmit(async (values, event) => {
        event?.preventDefault();
        setSubmitError('');
        const response = await fetch(action, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(values) });
        if (!response.ok) {
          setSubmitError('Unable to submit right now. Please call (555) 123-9876 for immediate assistance.');
          return;
        }
        setSent(true);
      })}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <input className="min-h-12 w-full rounded-md border border-white/20 bg-black/40 px-3" placeholder="Name" {...register('name')} />
          <p className="mt-1 text-xs text-red-300">{errors.name?.message}</p>
        </div>
        <div>
          <input className="min-h-12 w-full rounded-md border border-white/20 bg-black/40 px-3" placeholder="Phone" {...register('phone')} />
          <p className="mt-1 text-xs text-red-300">{errors.phone?.message}</p>
        </div>
      </div>
      <div>
        <input className="min-h-12 w-full rounded-md border border-white/20 bg-black/40 px-3" placeholder="Email" {...register('email')} />
        <p className="mt-1 text-xs text-red-300">{errors.email?.message}</p>
      </div>
      <input className="min-h-12 rounded-md border border-white/20 bg-black/40 px-3" placeholder="Service Type" {...register('serviceType')} />
      <textarea className="min-h-36 rounded-md border border-white/20 bg-black/40 px-3 py-2" placeholder="Project details" {...register('message')} />
      <div className="grid gap-3 sm:grid-cols-2">
        <select className="min-h-12 rounded-md border border-white/20 bg-black/40 px-3" {...register('preferredContact')}>
          <option>Phone</option><option>Email</option><option>Text Message</option>
        </select>
        <input className="min-h-12 rounded-md border border-white/20 bg-black/40 px-3" placeholder="Best Time to Call" {...register('bestTime')} />
      </div>
      {submitError ? <p className="rounded-md border border-red-300/50 bg-red-900/30 px-3 py-2 text-sm text-red-200">{submitError}</p> : null}
      <button disabled={isSubmitting} type="submit" className="min-h-12 rounded-md bg-[var(--color-amber)] px-4 font-bold text-black">{isSubmitting ? 'Sending...' : 'Send Request'}</button>
    </form>
  );
}
