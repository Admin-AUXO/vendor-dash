import { useState, useMemo, useCallback } from 'react';
import { getInvoicesCached } from '../data/dummy-dashboard';
import type { Invoice, InvoiceStatus } from '../types/dashboard';
import PageHeader from './PageHeader';
import KPICard from './KPICard';
import SearchInput from './SearchInput';
import StatusBadge from './StatusBadge';
import Pagination from './Pagination';
import Dropdown from './Dropdown';
import { Dollar, Exclamation, Building } from '../lib/icons';

const KPI_ICON = 'w-6 h-6';

const CREATE_OPTIONS = [
  { id: 'new', label: 'New Invoice' },
  { id: 'batch', label: 'Batch Create' },
];

const STATUS_TABS: { id: InvoiceStatus | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'sent', label: 'Sent' },
  { id: 'paid', label: 'Paid' },
  { id: 'overdue', label: 'Overdue' },
  { id: 'draft', label: 'Draft' },
];

export default function InvoicesPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | 'all'>('all');
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const all = getInvoicesCached();
  const sentCount = useMemo(() => all.filter((i) => i.status === 'sent').length, [all]);
  const paidCount = useMemo(() => all.filter((i) => i.status === 'paid').length, [all]);
  const overdueCount = useMemo(() => all.filter((i) => i.status === 'overdue').length, [all]);

  const filtered = useMemo(() => {
    let list = all;
    if (statusFilter !== 'all') list = list.filter((i) => i.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (i) =>
          i.id.toLowerCase().includes(q) ||
          i.vendor.toLowerCase().includes(q) ||
          i.projectId.toLowerCase().includes(q)
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
        title="Invoices"
        subtitle={`${all.length} total`}
        action={<Dropdown label="Create" options={CREATE_OPTIONS} onSelect={() => {}} />}
      />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KPICard label="Sent" value={sentCount} icon={<Dollar className={KPI_ICON} />} />
        <KPICard label="Paid" value={paidCount} icon={<Building className={KPI_ICON} />} />
        <KPICard label="Overdue" value={overdueCount} icon={<Exclamation className={KPI_ICON} />} />
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
            placeholder="Search invoices..."
            aria-label="Search invoices"
          />
        </div>
        <div className="rounded-lg border border-neutral-200 bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 font-medium">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Vendor</th>
                  <th className="px-4 py-3">Project</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Due</th>
                  <th className="px-4 py-3">Issued</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {paginated.map((i) => (
                  <tr key={i.id} className="hover:bg-neutral-50">
                    <td className="px-4 py-3 font-medium text-neutral-900">{i.id}</td>
                    <td className="px-4 py-3 text-neutral-700 truncate max-w-[10rem]">{i.vendor}</td>
                    <td className="px-4 py-3 text-neutral-600">{i.projectId}</td>
                    <td className="px-4 py-3 text-neutral-700 font-medium">{i.amount}</td>
                    <td className="px-4 py-3"><StatusBadge status={i.status} /></td>
                    <td className="px-4 py-3 text-neutral-600">{i.dueDate}</td>
                    <td className="px-4 py-3 text-neutral-600">{i.issuedDate}</td>
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
            No invoices match your filters.
          </div>
        )}
      </section>
    </div>
  );
}
