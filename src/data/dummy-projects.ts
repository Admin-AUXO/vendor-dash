import { faker } from '@faker-js/faker';
import type { Project, DashboardKpis } from '../types/projects';

faker.seed(42);

const PROJECT_TYPES = [
  'IT Infrastructure Upgrade',
  'HVAC Installation',
  'Electrical Wiring',
  'Plumbing Repair',
  'Roof Replacement',
  'Facility Expansion',
  'Security System',
  'Fire Safety Upgrade',
];

const WORK_ORDER_TAGS = ['Issued', 'Pending', 'In Progress', 'Completed'];
const COMPLIANCE_OPTIONS = ['No Compliance Issues', 'Review Required', 'Action Needed'];

function parseCost(cost: string): number {
  return Number(cost.replace(/[$,]/g, '')) || 0;
}

export function generateDummyProjects(count: number): Project[] {
  const projects: Project[] = [];
  for (let i = 0; i < count; i++) {
    const status = faker.helpers.arrayElement(['active', 'upcoming', 'completed'] as const);
    const hasComplianceIssue = faker.datatype.boolean({ probability: 0.2 });
    const isDelayed = status === 'active' && faker.datatype.boolean({ probability: 0.25 });
    const overdueApproval = status === 'active' && faker.datatype.boolean({ probability: 0.15 });
    const cost = faker.commerce.price({ min: 200, max: 50000, dec: 2 });
    projects.push({
      id: `PO-${String(i + 1).padStart(4, '0')}`,
      title: faker.helpers.arrayElement([
        faker.company.catchPhrase(),
        `Fix ${faker.word.noun()} in ${faker.location.buildingNumber()}`,
        `${faker.commerce.productAdjective()} ${faker.commerce.product()} upgrade`,
      ]),
      type: faker.helpers.arrayElement(PROJECT_TYPES),
      status,
      workOrdersStatus: 'Work Orders:',
      workOrdersTag: faker.helpers.arrayElement(WORK_ORDER_TAGS),
      cost: `$${Number(cost).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      activeVendors: faker.number.int({ min: 5, max: 80 }),
      irxScore: faker.number.int({ min: 10, max: 95 }),
      compliance: hasComplianceIssue ? faker.helpers.arrayElement(COMPLIANCE_OPTIONS.slice(1)) : COMPLIANCE_OPTIONS[0],
      progress: faker.number.int({ min: 0, max: 100 }),
      description: faker.datatype.boolean({ probability: 0.4 })
        ? faker.lorem.paragraph()
        : undefined,
      isDelayed,
      hasComplianceIssue,
      overdueApproval,
    });
  }
  return projects;
}

export function computeKpis(projects: Project[], lastUpdated: Date): DashboardKpis {
  const active = projects.filter((p) => p.status === 'active');
  const activeValue = active.reduce((sum, p) => sum + parseCost(p.cost), 0);
  return {
    activeProjects: active.length,
    activeProjectsValue: Math.round(activeValue),
    delayedProjects: projects.filter((p) => p.isDelayed).length,
    pendingCompliance: projects.filter((p) => p.hasComplianceIssue).length,
    lastUpdated: lastUpdated.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }),
  };
}

const DUMMY_PROJECTS = generateDummyProjects(48);
const DUMMY_KPIS = computeKpis(DUMMY_PROJECTS, faker.date.recent({ days: 2 }));

export function getDummyProjects(): Project[] {
  return DUMMY_PROJECTS;
}

export function getDummyKpis(): DashboardKpis {
  return DUMMY_KPIS;
}
