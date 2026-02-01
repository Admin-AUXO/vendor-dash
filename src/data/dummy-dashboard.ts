import { faker } from '@faker-js/faker';
import { getDummyProjects } from './dummy-projects';
import type {
  WorkOrder,
  Invoice,
  Payment,
  MarketplaceItem,
  ArchiveItem,
  HelpdeskTicket,
  HomeSummary,
} from '../types/dashboard';

faker.seed(43);

const projects = getDummyProjects();
const projectIds = projects.map((p) => p.id);
const completedProjects = projects.filter((p) => p.status === 'completed');

function fmtDate(d: Date) {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function getWorkOrders(): WorkOrder[] {
  const list: WorkOrder[] = [];
  const statuses: WorkOrder['status'][] = ['draft', 'issued', 'in_progress', 'completed', 'cancelled'];
  for (let i = 0; i < 60; i++) {
    const status = faker.helpers.arrayElement(statuses);
    const due = faker.date.soon({ days: 30 });
    list.push({
      id: `WO-${String(i + 1).padStart(4, '0')}`,
      projectId: faker.helpers.arrayElement(projectIds),
      title: faker.helpers.arrayElement([
        faker.commerce.productName(),
        `${faker.word.verb()} ${faker.word.noun()}`,
        faker.company.buzzVerb() + ' ' + faker.word.noun(),
      ]),
      status,
      amount: `$${faker.number.int({ min: 100, max: 15000 }).toLocaleString()}`,
      dueDate: fmtDate(due),
      assignedTo: faker.person.fullName(),
      createdAt: fmtDate(faker.date.past({ years: 1 })),
    });
  }
  return list;
}

export function getInvoices(): Invoice[] {
  const list: Invoice[] = [];
  const statuses: Invoice['status'][] = ['draft', 'sent', 'paid', 'overdue', 'cancelled'];
  for (let i = 0; i < 45; i++) {
    const status = faker.helpers.arrayElement(statuses);
    const issued = faker.date.past({ years: 1 });
    const due = faker.date.soon({ days: 60 });
    list.push({
      id: `INV-${String(i + 1).padStart(4, '0')}`,
      projectId: faker.helpers.arrayElement(projectIds),
      workOrderId: `WO-${String(faker.number.int({ min: 1, max: 60 })).padStart(4, '0')}`,
      amount: `$${faker.number.int({ min: 500, max: 25000 }).toLocaleString()}.00`,
      status,
      dueDate: fmtDate(due),
      issuedDate: fmtDate(issued),
      vendor: faker.company.name(),
    });
  }
  return list;
}

export function getPayments(invoices: Invoice[]): Payment[] {
  const list: Payment[] = [];
  const statuses: Payment['status'][] = ['pending', 'completed', 'failed', 'refunded'];
  const methods = ['ACH', 'Wire', 'Card', 'Check'];
  for (let i = 0; i < 50; i++) {
    const inv = faker.helpers.arrayElement(invoices);
    list.push({
      id: `PAY-${String(i + 1).padStart(4, '0')}`,
      invoiceId: inv.id,
      amount: inv.amount,
      status: faker.helpers.arrayElement(statuses),
      date: fmtDate(faker.date.recent({ days: 90 })),
      method: faker.helpers.arrayElement(methods),
    });
  }
  return list;
}

export function getMarketplaceItems(): MarketplaceItem[] {
  const categories = ['Equipment', 'Materials', 'Services', 'Software', 'Safety'];
  const list: MarketplaceItem[] = [];
  for (let i = 0; i < 24; i++) {
    const price = faker.number.int({ min: 50, max: 5000 });
    list.push({
      id: `MK-${String(i + 1).padStart(4, '0')}`,
      title: faker.commerce.productName(),
      category: faker.helpers.arrayElement(categories),
      price: `$${price.toLocaleString()}`,
      description: (faker.commerce.productAdjective() + ' ' + faker.commerce.product() + '. ' + faker.lorem.sentence()).slice(0, 80) + '…',
      vendor: faker.company.name(),
    });
  }
  return list;
}

export function getArchiveItems(): ArchiveItem[] {
  const items: ArchiveItem[] = completedProjects.slice(0, 20).map((p) => ({
    id: `ARC-P-${p.id}`,
    type: 'project' as const,
    title: p.title,
    archivedAt: fmtDate(faker.date.past({ years: 1 })),
    originalId: p.id,
  }));
  for (let i = 0; i < 15; i++) {
    items.push({
      id: `ARC-D-${String(i + 1).padStart(4, '0')}`,
      type: 'document',
      title: faker.helpers.arrayElement([
        `Report: ${faker.company.buzzNoun()}`,
        `Contract ${faker.string.alphanumeric(6).toUpperCase()}`,
        faker.system.fileName(),
      ]),
      archivedAt: fmtDate(faker.date.past({ years: 1 })),
      originalId: `DOC-${i + 1}`,
    });
  }
  return items;
}

export function getHelpdeskTickets(): HelpdeskTicket[] {
  const list: HelpdeskTicket[] = [];
  const statuses: HelpdeskTicket['status'][] = ['open', 'in_progress', 'resolved', 'closed'];
  const priorities: HelpdeskTicket['priority'][] = ['low', 'medium', 'high'];
  for (let i = 0; i < 30; i++) {
    const created = faker.date.past({ years: 1 });
    const updated = faker.date.between({ from: created, to: new Date() });
    list.push({
      id: `TKT-${String(i + 1).padStart(4, '0')}`,
      subject: faker.helpers.arrayElement([
        `Issue with ${faker.commerce.productName()}`,
        `Request: ${faker.company.buzzPhrase()}`,
        faker.lorem.sentence(),
      ]),
      status: faker.helpers.arrayElement(statuses),
      priority: faker.helpers.arrayElement(priorities),
      createdAt: fmtDate(created),
      updatedAt: fmtDate(updated),
    });
  }
  return list;
}

const WORK_ORDERS = getWorkOrders();
const INVOICES = getInvoices();
const PAYMENTS = getPayments(INVOICES);
const MARKETPLACE = getMarketplaceItems();
const ARCHIVE = getArchiveItems();
const TICKETS = getHelpdeskTickets();

function buildHomeSummary(): HomeSummary {
  const active = projects.filter((p) => p.status === 'active');
  return {
    projectKpis: {
      activeProjects: active.length,
      delayedProjects: projects.filter((p) => p.isDelayed).length,
      pendingCompliance: projects.filter((p) => p.hasComplianceIssue).length,
    },
    recentProjectIds: projects.slice(0, 5).map((p) => p.id),
    recentWorkOrderIds: WORK_ORDERS.slice(0, 5).map((w) => w.id),
    recentInvoiceIds: INVOICES.slice(0, 5).map((i) => i.id),
    lastUpdated: faker.date.recent({ days: 1 }).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }),
  };
}

const HOME_SUMMARY = buildHomeSummary();

export function getHomeSummary(): HomeSummary {
  return HOME_SUMMARY;
}

export function getWorkOrdersCached(): WorkOrder[] {
  return WORK_ORDERS;
}
export function getInvoicesCached(): Invoice[] {
  return INVOICES;
}
export function getPaymentsCached(): Payment[] {
  return PAYMENTS;
}
export function getMarketplaceCached(): MarketplaceItem[] {
  return MARKETPLACE;
}
export function getArchiveCached(): ArchiveItem[] {
  return ARCHIVE;
}
export function getHelpdeskTicketsCached(): HelpdeskTicket[] {
  return TICKETS;
}
export function getHomeSummaryCached(): HomeSummary {
  return HOME_SUMMARY;
}
