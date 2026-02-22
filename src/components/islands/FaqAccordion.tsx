import { useMemo, useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');

  const categories = useMemo(() => ['All', ...new Set(items.map((item) => item.category))], [items]);

  const filtered = useMemo(
    () =>
      items.filter((item) => {
        const categoryMatch = category === 'All' || item.category === category;
        const searchMatch =
          query.trim().length === 0 ||
          item.question.toLowerCase().includes(query.toLowerCase()) ||
          item.answer.toLowerCase().includes(query.toLowerCase());
        return categoryMatch && searchMatch;
      }),
    [items, category, query],
  );

  return (
    <div>
      <div className="mb-4 grid gap-3 sm:grid-cols-[1fr_auto]">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search pricing, safety, process, licensing..."
          className="min-h-12 rounded-md border border-white/20 bg-black/30 px-3"
        />
        <select value={category} onChange={(event) => setCategory(event.target.value)} className="min-h-12 rounded-md border border-white/20 bg-black/30 px-3">
          {categories.map((value) => (
            <option key={value}>{value}</option>
          ))}
        </select>
      </div>

      <Accordion type="single" collapsible className="w-full">
        {filtered.map((item) => (
          <AccordionItem key={item.id} value={item.id}>
            <AccordionTrigger>{item.question}</AccordionTrigger>
            <AccordionContent>
              <p>{item.answer}</p>
              <p className="mt-2 text-xs text-white/60">Category: {item.category}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {filtered.length === 0 ? <p className="mt-4 text-sm text-white/60">No matching FAQ entries. Try a broader search phrase.</p> : null}
    </div>
  );
}
