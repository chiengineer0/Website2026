import Dexie, { type EntityTable } from 'dexie';
import type { QuoteFormData } from './quote-schema';

export interface QuoteDraft {
  id?: number;
  data: Partial<QuoteFormData>;
  updatedAt: string;
}

const db = new Dexie('brand-electric-db') as Dexie & {
  drafts: EntityTable<QuoteDraft, 'id'>;
};

db.version(1).stores({
  drafts: '++id,updatedAt',
});

export { db };
