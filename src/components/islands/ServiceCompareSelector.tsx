import { useMemo, useState } from 'react';

interface ServiceItem {
  slug: string;
  title: string;
  category: string;
  timeline: string;
  startingPrice: string;
  description: string;
}

export function ServiceCompareSelector({ services }: { services: ServiceItem[] }) {
  const [leftSlug, setLeftSlug] = useState(services[0]?.slug ?? '');
  const [rightSlug, setRightSlug] = useState(services[1]?.slug ?? services[0]?.slug ?? '');

  const left = useMemo(() => services.find((service) => service.slug === leftSlug), [services, leftSlug]);
  const right = useMemo(() => services.find((service) => service.slug === rightSlug), [services, rightSlug]);

  return (
    <section className="mt-8">
      <h3 className="text-xl font-black">Compare Two Services</h3>
      <p className="mt-1 text-sm text-white/70">Select any two services for a side-by-side comparison.</p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <select className="min-h-12 rounded-md border border-white/20 bg-black/35 px-3" value={leftSlug} onChange={(event) => setLeftSlug(event.target.value)}>
          {services.map((service) => (
            <option key={`left-${service.slug}`} value={service.slug}>{service.title}</option>
          ))}
        </select>
        <select className="min-h-12 rounded-md border border-white/20 bg-black/35 px-3" value={rightSlug} onChange={(event) => setRightSlug(event.target.value)}>
          {services.map((service) => (
            <option key={`right-${service.slug}`} value={service.slug}>{service.title}</option>
          ))}
        </select>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {[left, right].map((service, index) => (
          <article key={`${service?.slug}-${index}`} className="surface-card p-4">
            <h4 className="text-lg font-semibold">{service?.title}</h4>
            <p className="mt-1 text-sm text-white/70">{service?.description}</p>
            <ul className="mt-3 space-y-1 text-sm text-white/80">
              <li><strong>Category:</strong> {service?.category}</li>
              <li><strong>Timeline:</strong> {service?.timeline}</li>
              <li><strong>Starting Investment:</strong> <span className="text-[var(--color-amber)]">{service?.startingPrice}</span></li>
            </ul>
            <a className="mt-4 inline-flex min-h-12 items-center text-[var(--color-electric)]" href={`/Website2026/services/${service?.slug}/`}>
              Explore Service →
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
