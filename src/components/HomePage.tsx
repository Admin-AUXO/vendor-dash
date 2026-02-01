import { useMemo } from 'react';
import { getDummyProjects, getDummyKpis } from '../data/dummy-projects';
import {
  getHomeSummaryCached,
  getWorkOrdersCached,
  getInvoicesCached,
} from '../data/dummy-dashboard';
import type { Project } from '../types/projects';
import type { WorkOrder, Invoice } from '../types/dashboard';
import KPICard from './KPICard';
import PageHeader from './PageHeader';
import { Building, Clock, Exclamation, Rupee } from '../lib/icons';

const KPI_ICON_CLASS = 'w-6 h-6';

export default function HomePage() {
  const summary = getHomeSummaryCached();
  const kpis = getDummyKpis();
  const projects = getDummyProjects();
  const workOrders = getWorkOrdersCached();
  const invoices = getInvoicesCached();

  const recentProjects = useMemo(
    () => summary.recentProjectIds.map((id) => projects.find((p) => p.id === id)).filter((p): p is Project => p != null),
    [summary.recentProjectIds, projects]
  );
  const recentWorkOrders = useMemo(
    () => summary.recentWorkOrderIds.map((id) => workOrders.find((w) => w.id === id)).filter((w): w is WorkOrder => w != null),
    [summary.recentWorkOrderIds, workOrders]
  );
  const recentInvoices = useMemo(
    () => summary.recentInvoiceIds.map((id) => invoices.find((i) => i.id === id)).filter((i): i is Invoice => i != null),
    [summary.recentInvoiceIds, invoices]
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        subtitle={`Last updated ${summary.lastUpdated}`}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard label="Active Projects" value={kpis.activeProjects} icon={<Building className={KPI_ICON_CLASS} />} />
        <KPICard label="Active Value" value={`$${kpis.activeProjectsValue.toLocaleString()}`} icon={<Rupee className={KPI_ICON_CLASS} />} />
        <KPICard label="Delayed" value={kpis.delayedProjects} icon={<Clock className={KPI_ICON_CLASS} />} />
        <KPICard label="Pending Compliance" value={kpis.pendingCompliance} icon={<Exclamation className={KPI_ICON_CLASS} />} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="rounded-lg bg-white border border-neutral-200 p-4">
          <h2 className="text-lg font-semibold text-neutral-900 mb-3">Recent Projects</h2>
          <ul className="space-y-2">
            {recentProjects.slice(0, 5).map((p) => (
              <li key={p!.id}>
                <a href="/projects" className="text-sm text-neutral-700 hover:text-brand truncate block">
                  {p!.id} · {p!.title}
                </a>
              </li>
            ))}
          </ul>
          <a href="/projects" className="mt-3 text-sm font-medium text-brand hover:underline block">View all</a>
        </section>
        <section className="rounded-lg bg-white border border-neutral-200 p-4">
          <h2 className="text-lg font-semibold text-neutral-900 mb-3">Recent Work Orders</h2>
          <ul className="space-y-2">
            {recentWorkOrders.slice(0, 5).map((w) => (
              <li key={w!.id}>
                <a href="/work-orders" className="text-sm text-neutral-700 hover:text-brand truncate block">
                  {w!.id} · {w!.title}
                </a>
              </li>
            ))}
          </ul>
          <a href="/work-orders" className="mt-3 text-sm font-medium text-brand hover:underline block">View all</a>
        </section>
        <section className="rounded-lg bg-white border border-neutral-200 p-4">
          <h2 className="text-lg font-semibold text-neutral-900 mb-3">Recent Invoices</h2>
          <ul className="space-y-2">
            {recentInvoices.slice(0, 5).map((i) => (
              <li key={i!.id}>
                <a href="/invoices" className="text-sm text-neutral-700 hover:text-brand truncate block">
                  {i!.id} · {i!.amount}
                </a>
              </li>
            ))}
          </ul>
          <a href="/invoices" className="mt-3 text-sm font-medium text-brand hover:underline block">View all</a>
        </section>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <a href="/projects" className="p-4 rounded-lg bg-brand text-neutral-900 font-medium hover:opacity-90 transition-opacity text-center">
          Projects
        </a>
        <a href="/work-orders" className="p-4 rounded-lg bg-neutral-200 text-neutral-800 font-medium hover:bg-neutral-300 transition-colors text-center">
          Work Orders
        </a>
        <a href="/invoices" className="p-4 rounded-lg bg-neutral-200 text-neutral-800 font-medium hover:bg-neutral-300 transition-colors text-center">
          Invoices
        </a>
      </div>
    </div>
  );
}
