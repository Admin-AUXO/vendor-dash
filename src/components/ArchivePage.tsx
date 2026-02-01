import { useState, useMemo, useCallback } from 'react';
import { getArchiveCached } from '../data/dummy-dashboard';
import type { ArchiveItem } from '../types/dashboard';
import PageHeader from './PageHeader';
import SearchInput from './SearchInput';
import Pagination from './Pagination';
import { Building, Document } from '../lib/icons';

function ArchiveIcon({ type }: { type: 'project' | 'document' }) {
  return type === 'project' ? <Building className="w-5 h-5 shrink-0" /> : <Document className="w-5 h-5 shrink-0" />;
}

export default function ArchivePage() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'project' | 'document'>('all');
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const all = getArchiveCached();
  const filtered = useMemo(() => {
    let list = all;
    if (typeFilter !== 'all') list = list.filter((i) => i.type === typeFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.originalId.toLowerCase().includes(q)
      );
    }
    return list;
  }, [all, typeFilter, search]);

  const paginated = useMemo(
    () => filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage),
    [filtered, page]
  );

  const handlePageChange = useCallback(
    (p: number) => setPage(Math.max(1, Math.min(p, Math.ceil(filtered.length / rowsPerPage)))),
    [filtered.length]
  );
  const handleRowsPerPage = useCallback((r: number) => {
    setRowsPerPage(r);
    setPage(1);
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Archive"
        subtitle={`${all.length} archived items`}
        action={
          <SearchInput
            value={search}
            onChange={(v) => {
              setSearch(v);
              setPage(1);
            }}
            placeholder="Search archive..."
            aria-label="Search archive"
          />
        }
      />
      <div className="flex flex-wrap gap-2 mb-4">
        {(['all', 'project', 'document'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => {
              setTypeFilter(t);
              setPage(1);
            }}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize ${
              typeFilter === t ? 'bg-brand text-neutral-900' : 'bg-neutral-200 text-neutral-800 hover:bg-neutral-300'
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="rounded-lg border border-neutral-200 bg-white divide-y divide-neutral-100">
        {paginated.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 px-4 py-3 hover:bg-neutral-50"
          >
            <div className="shrink-0 w-10 h-10 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-600">
              <ArchiveIcon type={item.type} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-neutral-900 truncate">{item.title}</p>
              <p className="text-sm text-neutral-500">{item.type} · {item.originalId} · Archived {item.archivedAt}</p>
            </div>
          </div>
        ))}
      </div>
      {filtered.length > 0 && (
        <Pagination
          rowsPerPage={rowsPerPage}
          totalRows={filtered.length}
          page={page}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPage}
        />
      )}
      {filtered.length === 0 && (
        <div className="py-12 text-center rounded-lg bg-neutral-50 border border-neutral-200 text-neutral-600">
          No archived items match your filters.
        </div>
      )}
    </div>
  );
}
