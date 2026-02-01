import { useState, useMemo, useCallback } from 'react';
import { getHelpdeskTicketsCached } from '../data/dummy-dashboard';
import type { HelpdeskTicket, TicketStatus } from '../types/dashboard';
import PageHeader from './PageHeader';
import KPICard from './KPICard';
import SearchInput from './SearchInput';
import StatusBadge from './StatusBadge';
import Pagination from './Pagination';
import Dropdown from './Dropdown';
import { Shield, Clock, Exclamation } from '../lib/icons';

const KPI_ICON = 'w-6 h-6';

const CREATE_OPTIONS = [
  { id: 'ticket', label: 'New Ticket' },
  { id: 'faq', label: 'Browse FAQ' },
];

const STATUS_TABS: { id: TicketStatus | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'open', label: 'Open' },
  { id: 'in_progress', label: 'In Progress' },
  { id: 'resolved', label: 'Resolved' },
  { id: 'closed', label: 'Closed' },
];

const PRIORITY_CLASS: Record<string, string> = {
  low: 'text-neutral-600',
  medium: 'text-amber-600',
  high: 'text-red-600 font-medium',
};

export default function HelpdeskPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'all'>('all');
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const all = getHelpdeskTicketsCached();
  const openCount = useMemo(() => all.filter((t) => t.status === 'open').length, [all]);
  const inProgressCount = useMemo(() => all.filter((t) => t.status === 'in_progress').length, [all]);
  const resolvedCount = useMemo(() => all.filter((t) => t.status === 'resolved' || t.status === 'closed').length, [all]);

  const filtered = useMemo(() => {
    let list = all;
    if (statusFilter !== 'all') list = list.filter((t) => t.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (t) =>
          t.id.toLowerCase().includes(q) ||
          t.subject.toLowerCase().includes(q)
      );
    }
    return list;
  }, [all, statusFilter, search]);

  const paginated = useMemo(
    () => filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage),
    [filtered, page, rowsPerPage]
  );

  const handlePageChange = useCallback(
    (p: number) => setPage(Math.max(1, Math.min(p, Math.ceil(filtered.length / rowsPerPage)))),
    [filtered.length, rowsPerPage]
  );
  const handleRowsPerPage = useCallback((r: number) => {
    setRowsPerPage(r);
    setPage(1);
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Helpdesk"
        subtitle={`${all.length} tickets`}
        action={<Dropdown label="New" options={CREATE_OPTIONS} onSelect={() => {}} />}
      />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KPICard label="Open" value={openCount} icon={<Shield className={KPI_ICON} />} />
        <KPICard label="In Progress" value={inProgressCount} icon={<Clock className={KPI_ICON} />} />
        <KPICard label="Resolved" value={resolvedCount} icon={<Exclamation className={KPI_ICON} />} />
      </div>
      <section>
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex flex-wrap gap-2">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setStatusFilter(tab.id);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                  statusFilter === tab.id ? 'bg-neutral-800 text-white' : 'bg-neutral-200 text-neutral-800 hover:bg-neutral-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <SearchInput
            value={search}
            onChange={(v) => {
              setSearch(v);
              setPage(1);
            }}
            placeholder="Search tickets..."
            aria-label="Search tickets"
          />
        </div>
        <div className="rounded-lg border border-neutral-200 bg-white divide-y divide-neutral-100">
          {paginated.map((t: HelpdeskTicket) => (
            <div key={t.id} className="px-4 py-3 hover:bg-neutral-50 flex flex-wrap items-center gap-4">
              <div className="min-w-0 flex-1">
                <p className="font-medium text-neutral-900 truncate">{t.id} · {t.subject}</p>
                <p className="text-sm text-neutral-500 mt-0.5">Created {t.createdAt} · Updated {t.updatedAt}</p>
              </div>
              <StatusBadge status={t.status} />
              <span className={`text-sm capitalize ${PRIORITY_CLASS[t.priority] ?? ''}`}>{t.priority}</span>
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
            No tickets match your filters.
          </div>
        )}
      </section>
    </div>
  );
}
