import { useState, useMemo, useCallback } from 'react';
import { getPaymentsCached } from '../data/dummy-dashboard';
import type { Payment, PaymentStatus } from '../types/dashboard';
import PageHeader from './PageHeader';
import KPICard from './KPICard';
import SearchInput from './SearchInput';
import StatusBadge from './StatusBadge';
import Pagination from './Pagination';
import { Dollar, Clock, Exclamation } from '../lib/icons';

const KPI_ICON = 'w-6 h-6';

const STATUS_TABS: { id: PaymentStatus | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'completed', label: 'Completed' },
  { id: 'pending', label: 'Pending' },
  { id: 'failed', label: 'Failed' },
];

export default function PaymentsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | 'all'>('all');
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const all = getPaymentsCached();
  const completedCount = useMemo(() => all.filter((p) => p.status === 'completed').length, [all]);
  const pendingCount = useMemo(() => all.filter((p) => p.status === 'pending').length, [all]);
  const totalAmount = useMemo(
    () => all.filter((p) => p.status === 'completed').reduce((sum, p) => sum + Number(p.amount.replace(/[$,]/g, '')) || 0, 0),
    [all]
  );

  const filtered = useMemo(() => {
    let list = all;
    if (statusFilter !== 'all') list = list.filter((p) => p.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.id.toLowerCase().includes(q) ||
          p.invoiceId.toLowerCase().includes(q)
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
      <PageHeader title="Payments" subtitle={`${all.length} transactions`} />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KPICard label="Completed" value={completedCount} icon={<Dollar className={KPI_ICON} />} />
        <KPICard label="Pending" value={pendingCount} icon={<Clock className={KPI_ICON} />} />
        <KPICard label="Total Paid" value={`$${Math.round(totalAmount).toLocaleString()}`} icon={<Exclamation className={KPI_ICON} />} />
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
            placeholder="Search by ID or invoice..."
            aria-label="Search payments"
          />
        </div>
        <div className="rounded-lg border border-neutral-200 bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 font-medium">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Invoice</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Method</th>
                  <th className="px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {paginated.map((p) => (
                  <tr key={p.id} className="hover:bg-neutral-50">
                    <td className="px-4 py-3 font-medium text-neutral-900">{p.id}</td>
                    <td className="px-4 py-3 text-neutral-600">{p.invoiceId}</td>
                    <td className="px-4 py-3 text-neutral-700 font-medium">{p.amount}</td>
                    <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                    <td className="px-4 py-3 text-neutral-600">{p.method}</td>
                    <td className="px-4 py-3 text-neutral-600">{p.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
            No payments match your filters.
          </div>
        )}
      </section>
    </div>
  );
}
