import { useState, useMemo, useCallback } from 'react';
import { getWorkOrdersCached } from '../data/dummy-dashboard';
import type { WorkOrder, WorkOrderStatus } from '../types/dashboard';
import PageHeader from './PageHeader';
import KPICard from './KPICard';
import SearchInput from './SearchInput';
import StatusBadge from './StatusBadge';
import Pagination from './Pagination';
import Dropdown from './Dropdown';
import { Wrench, Clock, Building } from '../lib/icons';

const KPI_ICON = 'w-6 h-6';

const CREATE_OPTIONS = [
  { id: 'new', label: 'New Work Order' },
  { id: 'template', label: 'From Template' },
];

const STATUS_TABS: { id: WorkOrderStatus | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'issued', label: 'Issued' },
  { id: 'in_progress', label: 'In Progress' },
  { id: 'completed', label: 'Completed' },
  { id: 'draft', label: 'Draft' },
];

export default function WorkOrdersPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<WorkOrderStatus | 'all'>('all');
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const all = getWorkOrdersCached();
  const openCount = useMemo(() => all.filter((w) => w.status === 'issued' || w.status === 'in_progress').length, [all]);
  const completedCount = useMemo(() => all.filter((w) => w.status === 'completed').length, [all]);
  const overdueCount = useMemo(() => all.filter((w) => w.status !== 'completed' && w.status !== 'cancelled').length, [all]);

  const filtered = useMemo(() => {
    let list = all;
    if (statusFilter !== 'all') list = list.filter((w) => w.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (w) =>
          w.id.toLowerCase().includes(q) ||
          w.title.toLowerCase().includes(q) ||
          w.projectId.toLowerCase().includes(q)
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
        title="Work Orders"
        subtitle={`${all.length} total · Last updated recently`}
        action={<Dropdown label="Create" options={CREATE_OPTIONS} onSelect={() => {}} />}
      />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KPICard label="Open" value={openCount} icon={<Wrench className={KPI_ICON} />} />
        <KPICard label="Completed" value={completedCount} icon={<Building className={KPI_ICON} />} />
        <KPICard label="Pending" value={overdueCount} icon={<Clock className={KPI_ICON} />} />
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
            placeholder="Search work orders..."
            aria-label="Search work orders"
          />
        </div>
        <div className="rounded-lg border border-neutral-200 bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 font-medium">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Project</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Due</th>
                  <th className="px-4 py-3">Assigned</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {paginated.map((w) => (
                  <tr key={w.id} className="hover:bg-neutral-50">
                    <td className="px-4 py-3 font-medium text-neutral-900">{w.id}</td>
                    <td className="px-4 py-3 text-neutral-700 truncate max-w-[12rem]">{w.title}</td>
                    <td className="px-4 py-3 text-neutral-600">{w.projectId}</td>
                    <td className="px-4 py-3"><StatusBadge status={w.status} /></td>
                    <td className="px-4 py-3 text-neutral-700">{w.amount}</td>
                    <td className="px-4 py-3 text-neutral-600">{w.dueDate}</td>
                    <td className="px-4 py-3 text-neutral-600 truncate max-w-[8rem]">{w.assignedTo}</td>
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
            No work orders match your filters.
          </div>
        )}
      </section>
    </div>
  );
}
