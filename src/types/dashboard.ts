export type WorkOrderStatus = 'draft' | 'issued' | 'in_progress' | 'completed' | 'cancelled';
export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';
export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high';

export interface WorkOrder {
  id: string;
  projectId: string;
  title: string;
  status: WorkOrderStatus;
  amount: string;
  dueDate: string;
  assignedTo: string;
  createdAt: string;
}

export interface Invoice {
  id: string;
  projectId: string;
  workOrderId?: string;
  amount: string;
  status: InvoiceStatus;
  dueDate: string;
  issuedDate: string;
  vendor: string;
}

export interface Payment {
  id: string;
  invoiceId: string;
  amount: string;
  status: PaymentStatus;
  date: string;
  method: string;
}

export interface MarketplaceItem {
  id: string;
  title: string;
  category: string;
  price: string;
  description: string;
  vendor: string;
}

export interface ArchiveItem {
  id: string;
  type: 'project' | 'document';
  title: string;
  archivedAt: string;
  originalId: string;
}

export interface HelpdeskTicket {
  id: string;
  subject: string;
  status: TicketStatus;
  priority: TicketPriority;
  createdAt: string;
  updatedAt: string;
}

export interface HomeSummary {
  projectKpis: { activeProjects: number; delayedProjects: number; pendingCompliance: number };
  recentProjectIds: string[];
  recentWorkOrderIds: string[];
  recentInvoiceIds: string[];
  lastUpdated: string;
}
