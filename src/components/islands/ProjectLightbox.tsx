import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';

export interface LightboxImage {
  src: string;
  alt: string;
}

export function ProjectLightbox({ images }: { images: LightboxImage[] }) {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" className="min-h-12 rounded-md border border-white/20 px-4" onClick={() => setOpen(true)}>
        Open Gallery
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <div className="flex items-center justify-between gap-4">
            <button type="button" className="min-h-12 min-w-12" onClick={() => setIndex((value) => (value - 1 + images.length) % images.length)}>
              <ChevronLeft />
            </button>
            <img src={images[index]?.src} alt={images[index]?.alt} className="max-h-[70vh] rounded-lg" />
            <button type="button" className="min-h-12 min-w-12" onClick={() => setIndex((value) => (value + 1) % images.length)}>
              <ChevronRight />
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
