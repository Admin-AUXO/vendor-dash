export type ProjectStatus = 'active' | 'upcoming' | 'completed';

export interface Project {
  id: string;
  title: string;
  type: string;
  status: ProjectStatus;
  workOrdersStatus: string;
  workOrdersTag?: string;
  cost: string;
  activeVendors: number;
  irxScore: number;
  compliance: string;
  progress: number;
  description?: string;
  isDelayed?: boolean;
  hasComplianceIssue?: boolean;
  overdueApproval?: boolean;
}

export type QueueTabId = 'active' | 'upcoming' | 'completed' | 'irx';

export interface DashboardKpis {
  activeProjects: number;
  activeProjectsValue: number;
  delayedProjects: number;
  pendingCompliance: number;
  lastUpdated: string;
}
