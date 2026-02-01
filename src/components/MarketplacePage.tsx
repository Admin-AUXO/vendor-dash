import { useState, useMemo } from 'react';
import { getMarketplaceCached } from '../data/dummy-dashboard';
import type { MarketplaceItem } from '../types/dashboard';
import PageHeader from './PageHeader';
import SearchInput from './SearchInput';

const CATEGORIES = ['All', 'Equipment', 'Materials', 'Services', 'Software', 'Safety'];

export default function MarketplacePage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const all = getMarketplaceCached();
  const filtered = useMemo(() => {
    let list = all;
    if (category !== 'All') list = list.filter((i) => i.category === category);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.category.toLowerCase().includes(q) ||
          i.vendor.toLowerCase().includes(q)
      );
    }
    return list;
  }, [all, category, search]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Marketplace"
        subtitle={`${all.length} offerings`}
        action={
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search marketplace..."
            aria-label="Search marketplace"
          />
        }
      />
      <div className="flex flex-wrap gap-2 mb-4">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(c)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
              category === c ? 'bg-brand text-neutral-900' : 'bg-neutral-200 text-neutral-800 hover:bg-neutral-300'
            }`}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((item: MarketplaceItem) => (
          <article
            key={item.id}
            className="rounded-lg border border-neutral-200 bg-white p-4 hover:shadow-md transition-shadow"
          >
            <span className="text-xs font-medium text-neutral-500 uppercase tracking-wide">{item.category}</span>
            <h3 className="font-semibold text-neutral-900 mt-1 truncate">{item.title}</h3>
            <p className="text-sm text-neutral-600 mt-1 line-clamp-2">{item.description}</p>
            <p className="text-sm text-neutral-500 mt-2 truncate">{item.vendor}</p>
            <p className="text-lg font-semibold text-brand mt-2">{item.price}</p>
          </article>
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="py-12 text-center rounded-lg bg-neutral-50 border border-neutral-200 text-neutral-600">
          No marketplace items match your filters.
        </div>
      )}
    </div>
  );
}
