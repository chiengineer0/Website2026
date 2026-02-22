import { Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

interface PagefindResult {
  id: string;
  url: string;
  meta: { title?: string };
  excerpt?: string;
}

export function PagefindSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<PagefindResult[]>([]);

  useEffect(() => {
    const keyHandler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen((state) => !state);
      }
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', keyHandler);
    return () => window.removeEventListener('keydown', keyHandler);
  }, []);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }
    const timer = window.setTimeout(async () => {
      try {
        const modulePath = `${import.meta.env.BASE_URL}pagefind/pagefind.js`;
        const module = await import(/* @vite-ignore */ modulePath);
        const pagefind = await module.options({ excerptLength: 18 });
        const search = await pagefind.search(query);
        const loaded = await Promise.all(search.results.slice(0, 8).map((item: any) => item.data()));
        setResults(loaded as PagefindResult[]);
      } catch {
        setResults([]);
      }
    }, 200);
    return () => window.clearTimeout(timer);
  }, [query]);

  const triggerLabel = useMemo(() => (open ? 'Close search' : 'Search site'), [open]);

  return (
    <>
      <button
        type="button"
        aria-label={triggerLabel}
        className="fixed left-1/2 top-4 z-50 flex min-h-12 -translate-x-1/2 items-center gap-2 rounded-full border border-white/25 bg-black/70 px-4 text-sm text-white backdrop-blur-sm transition hover:border-[var(--color-electric)]"
        onClick={() => setOpen((state) => !state)}
      >
        <Search size={16} /> CMD + K
      </button>
      {open ? (
        <div className="fixed inset-0 z-50 bg-black/82 p-4">
          <div className="mx-auto mt-24 w-[min(780px,100%)] rounded-2xl border border-white/15 bg-[var(--color-surface)] p-4">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search services, projects, blog, FAQ..."
              className="min-h-12 w-full rounded-md border border-white/20 bg-black/40 px-4 text-white"
            />
            <ul className="mt-4 space-y-2">
              {results.map((result) => (
                <li key={result.id}>
                  <a href={result.url} className="block rounded-lg border border-white/10 p-3 hover:border-[var(--color-electric)]">
                    <p className="font-semibold">{result.meta.title}</p>
                    <p className="text-sm text-white/75" dangerouslySetInnerHTML={{ __html: result.excerpt ?? '' }} />
                  </a>
                </li>
              ))}
            </ul>
            {query && results.length === 0 ? <p className="mt-4 text-sm text-white/60">No direct matches yet. Try broader terms like panel, EV, emergency, or inspection.</p> : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
