import { useState, useMemo, useCallback } from 'react';
import KPICard from './KPICard';
import QueueTabs from './QueueTabs';
import ProjectCard from './ProjectCard';
import Pagination from './Pagination';
import Dropdown from './Dropdown';
import type { Project, QueueTabId } from '../types/projects';
import { getDummyProjects, getDummyKpis } from '../data/dummy-projects';
import { Building, Rupee, Clock, Exclamation, FilterIcon } from '../lib/icons';
import SearchInput from './SearchInput';

const KPI_ICON_CLASS = 'w-6 h-6';

const CREATE_OPTIONS = [
  { id: 'project', label: 'New Project' },
  { id: 'work-order', label: 'New Work Order' },
  { id: 'import', label: 'Import' },
];

const QUEUE_TABS = [
  { id: 'active' as const, label: 'Active' },
  { id: 'upcoming' as const, label: 'Upcoming' },
  { id: 'completed' as const, label: 'Completed' },
  { id: 'irx' as const, label: 'IRX', dropdown: true },
];

const ALL_PROJECTS = getDummyProjects();
const KPIS = getDummyKpis();

export default function ProjectsPage() {
  const [queueTab, setQueueTab] = useState<QueueTabId>('upcoming');
  const [complianceRisks, setComplianceRisks] = useState(true);
  const [overdueApprovals, setOverdueApprovals] = useState(false);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);

  const filtered = useMemo(() => {
    let list: Project[] = ALL_PROJECTS;
    const statusFilter = queueTab === 'irx' ? 'active' as const : queueTab;
    list = list.filter((p) => p.status === statusFilter);
    if (complianceRisks || overdueApprovals) {
      list = list.filter((p) => (complianceRisks && p.hasComplianceIssue) || (overdueApprovals && p.overdueApproval));
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.id.toLowerCase().includes(q) ||
          p.title.toLowerCase().includes(q) ||
          p.type.toLowerCase().includes(q)
      );
    }
    return list;
  }, [queueTab, complianceRisks, overdueApprovals, search]);

  const totalRows = filtered.length;
  const paginated = useMemo(
    () => filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage),
    [filtered, page, rowsPerPage]
  );

  const handleCreateSelect = useCallback((id: string) => {
    setQueueTab(id === 'project' ? 'active' : queueTab);
  }, [queueTab]);

  const handleTabSelect = useCallback((id: QueueTabId) => {
    setQueueTab(id);
    setPage(1);
  }, []);

  const handleComplianceChange = useCallback((checked: boolean) => {
    setComplianceRisks(checked);
    setPage(1);
  }, []);

  const handleOverdueChange = useCallback((checked: boolean) => {
    setOverdueApprovals(checked);
    setPage(1);
  }, []);

  const handlePageChange = useCallback((p: number) => {
    setPage(Math.max(1, Math.min(p, Math.ceil(totalRows / rowsPerPage))));
  }, [totalRows, rowsPerPage]);

  const handleRowsPerPage = useCallback((r: number) => {
    setRowsPerPage(r);
    setPage(1);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Projects</h1>
          <p className="text-sm text-neutral-500 mt-0.5">Last Updated At {KPIS.lastUpdated}</p>
        </div>
        <Dropdown label="Create" options={CREATE_OPTIONS} onSelect={handleCreateSelect} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard label="Active Projects" value={KPIS.activeProjects} icon={<Building className={KPI_ICON_CLASS} />} />
        <KPICard label="Active Projects Value" value={`$${KPIS.activeProjectsValue.toLocaleString()}`} icon={<Rupee className={KPI_ICON_CLASS} />} />
        <KPICard label="Delayed Projects" value={KPIS.delayedProjects} icon={<Clock className={KPI_ICON_CLASS} />} />
        <KPICard label="Pending Compliance" value={KPIS.pendingCompliance} icon={<Exclamation className={KPI_ICON_CLASS} />} />
      </div>
      <section>
        <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
          <h2 className="text-lg font-semibold text-neutral-900">My Queue</h2>
          <div className="flex items-center gap-2">
            <SearchInput
              value={search}
              onChange={(v) => {
                setSearch(v);
                setPage(1);
              }}
              placeholder="Search projects..."
              aria-label="Search projects"
            />
            <button
              type="button"
              onClick={() => setFilterOpen((o) => !o)}
              className={`p-2 rounded-lg text-neutral-600 hover:bg-neutral-200 ${filterOpen ? 'bg-neutral-200' : ''}`}
              aria-label="Filter"
              aria-expanded={filterOpen}
            >
              <FilterIcon />
            </button>
          </div>
        </div>
        {filterOpen && (
          <div className="mb-4 p-4 rounded-lg bg-neutral-100 border border-neutral-200 text-sm text-neutral-600 flex flex-wrap gap-2">
            <span>Status</span><span aria-hidden>·</span><span>Date range</span><span aria-hidden>·</span><span>Vendor</span>
          </div>
        )}
        <QueueTabs
          tabs={QUEUE_TABS}
          activeId={queueTab}
          onSelect={handleTabSelect}
          toggles={[
            { label: 'Compliance Risks', checked: complianceRisks, onChange: handleComplianceChange },
            { label: 'Overdue Approvals', checked: overdueApprovals, onChange: handleOverdueChange },
          ]}
        />
        <div className="mt-4 space-y-3">
          {paginated.length ? (
            paginated.map((p, i) => (
              <ProjectCard
                key={p.id}
                {...p}
                showDescription={i === 0 && !!p.description}
              />
            ))
          ) : (
            <div className="py-12 text-center rounded-lg bg-neutral-50 border border-neutral-200 text-neutral-600">
              No projects match your search or filters.
            </div>
          )}
        </div>
        {totalRows > 0 && (
          <Pagination
            rowsPerPage={rowsPerPage}
            totalRows={totalRows}
            page={page}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPage}
          />
        )}
      </section>
    </div>
  );
}
