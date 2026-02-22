import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';

export interface LightboxImage {
  src: string;
  alt: string;
}

export function ProjectLightbox({ images }: { images: LightboxImage[] }) {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const previous = () => setIndex((value) => (value - 1 + images.length) % images.length);
  const next = () => setIndex((value) => (value + 1) % images.length);

  useEffect(() => {
    if (!open) return;
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') previous();
      if (event.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, images.length]);

  return (
    <>
      <button type="button" className="min-h-12 rounded-md border border-white/20 px-4" onClick={() => setOpen(true)}>
        Open Gallery
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <div
            className="flex items-center justify-between gap-4"
            onTouchStart={(event) => {
              touchStartX.current = event.changedTouches[0]?.clientX ?? null;
            }}
            onTouchEnd={(event) => {
              if (touchStartX.current === null) return;
              const endX = event.changedTouches[0]?.clientX ?? touchStartX.current;
              const delta = endX - touchStartX.current;
              if (delta > 40) previous();
              if (delta < -40) next();
              touchStartX.current = null;
            }}
          >
            <button type="button" className="min-h-12 min-w-12 rounded-md border border-white/20" onClick={previous}>
              <ChevronLeft />
            </button>
            <div className="w-full">
              <img src={images[index]?.src} alt={images[index]?.alt} className="max-h-[70vh] w-full rounded-lg object-contain" />
              <p className="mt-2 text-center text-xs text-white/60">Slide {index + 1} of {images.length}</p>
            </div>
            <button type="button" className="min-h-12 min-w-12 rounded-md border border-white/20" onClick={next}>
              <ChevronRight />
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
