import { defineCollection, z } from 'astro:content';

const services = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    icon: z.string(),
    timeline: z.string(),
    startingPrice: z.string(),
    category: z.enum(['Residential', 'Commercial', 'Panel', 'EV', 'Lighting', 'Industrial', 'Emergency']),
    featured: z.boolean().default(false),
    seoTitle: z.string(),
    seoDescription: z.string(),
  }),
});

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    city: z.string(),
    scope: z.string(),
    duration: z.string(),
    category: z.enum(['Residential', 'Commercial', 'Panel', 'EV', 'Lighting', 'Industrial']),
    tags: z.array(z.string()),
    coverAlt: z.string(),
    beforeImage: z.string(),
    afterImage: z.string(),
    featured: z.boolean().default(false),
  }),
});

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    author: z.string(),
    tags: z.array(z.string()),
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    coverAlt: z.string(),
  }),
});

const faq = defineCollection({
  type: 'data',
  schema: z.object({
    category: z.enum(['Pricing', 'Safety', 'Process', 'Licensing', 'Emergency']),
    question: z.string(),
    answer: z.string(),
  }),
});

const testimonials = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    city: z.string(),
    rating: z.number().min(1).max(5),
    quote: z.string(),
    jobType: z.string(),
  }),
});

export const collections = {
  services,
  projects,
  blog,
  faq,
  testimonials,
};
