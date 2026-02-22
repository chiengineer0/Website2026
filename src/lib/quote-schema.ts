import { z } from 'zod';

export const quoteSchema = z.object({
  jobType: z.enum(['Residential', 'Commercial', 'Industrial']),
  serviceCategory: z.enum([
    'Panel upgrade',
    'New wiring',
    'EV charger install',
    'Generator',
    'Lighting',
    'Outlet/Switch',
    'Emergency',
    'Other',
  ]),
  propertySize: z.number().min(400).max(12000),
  propertyAge: z.enum(['Under 10 years', '10-30 years', '30-60 years', '60+ years']),
  urgency: z.boolean(),
  name: z.string().min(2),
  phone: z.string().min(10),
  email: z.string().email(),
  address: z.string().min(8),
});

export type QuoteFormData = z.infer<typeof quoteSchema>;
