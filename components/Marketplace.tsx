import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Tabs, TabsContent, TabsList, TabsTrigger } from './ui';
import { 
  StatCard, 
  FilterSystem,
  FilterSidebar,
  DataTable,
  StatusBadge,
  EmptyState,
  type FilterGroup,
} from './shared';
import { 
  Briefcase, 
  FileCheck, 
  TrendingUp, 
  Target,
  Plus
} from 'lucide-react';
import { marketplaceProjects, bids, type MarketplaceProject, type Bid } from '../data';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import currency from 'currency.js';

export function Marketplace() {
  const [activeTab, setActiveTab] = useState('projects');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Record<string, string | string[]>>({
    status: [],
    serviceCategory: [],
  });

  // Filter projects
  const filteredProjects = useMemo(() => {
    let data = marketplaceProjects;

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      data = data.filter(
        (proj: MarketplaceProject) =>
          proj.projectId.toLowerCase().includes(query) ||
          proj.propertyAddress.toLowerCase().includes(query) ||
          proj.serviceCategory.toLowerCase().includes(query) ||
          proj.projectDescription.toLowerCase().includes(query)
      );
    }

    // Apply filters
    if (filters.status && Array.isArray(filters.status) && filters.status.length > 0) {
      data = data.filter((proj: MarketplaceProject) => filters.status.includes(proj.status));
    }
    if (filters.serviceCategory && Array.isArray(filters.serviceCategory) && filters.serviceCategory.length > 0) {
      data = data.filter((proj: MarketplaceProject) => filters.serviceCategory.includes(proj.serviceCategory));
    }

    return data;
  }, [searchQuery, filters]);

  // Filter bids
  const filteredBids = useMemo(() => {
    return bids;
  }, []);

  // Calculate marketplace stats
  const marketplaceStats = useMemo(() => {
    const availableProjects = marketplaceProjects.filter((p: MarketplaceProject) => p.status === 'open').length;
    const myBids = bids.length;
    const wonBids = bids.filter((b: Bid) => b.status === 'accepted').length;
    const winRate = myBids > 0 ? Math.round((wonBids / myBids) * 100) : 0;
    const totalProjectValue = marketplaceProjects
      .filter((p: MarketplaceProject) => p.status === 'open')
      .reduce((sum: number, p: MarketplaceProject) => sum + (p.budgetMin + p.budgetMax) / 2, 0);

    return { availableProjects, myBids, wonBids, winRate, totalProjectValue };
  }, []);

  // Project columns
  const projectColumns: ColumnDef<MarketplaceProject>[] = useMemo(() => [
    {
      accessorKey: 'projectId',
      header: 'Project ID',
      cell: ({ row }) => (
        <span className="font-semibold text-sm">{row.original.projectId}</span>
      ),
    },
    {
      accessorKey: 'propertyAddress',
      header: 'Property Address',
      cell: ({ row }) => (
        <div>
          <p className="text-sm font-medium text-gray-900">{row.original.propertyAddress}</p>
          <p className="text-xs text-gray-500 capitalize">{row.original.serviceCategory}</p>
        </div>
      ),
    },
    {
      accessorKey: 'budgetRange',
      header: 'Budget Range',
      cell: ({ row }) => (
        <span className="text-sm text-gray-900">
          {currency(row.original.budgetMin).format()} - {currency(row.original.budgetMax).format()}
        </span>
      ),
    },
    {
      accessorKey: 'deadline',
      header: 'Deadline',
      cell: ({ row }) => (
        <span className="text-sm text-gray-900">
          {format(new Date(row.original.deadline), 'MMM dd, yyyy')}
        </span>
      ),
    },
    {
      accessorKey: 'numberOfBids',
      header: 'Bids',
      cell: ({ row }) => (
        <span className="text-sm text-gray-900">{row.original.numberOfBids}</span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.original.status;
        const statusMap: Record<string, { type: 'success' | 'warning' | 'error' | 'info' | 'pending', label: string }> = {
          'open': { type: 'info', label: 'Open' },
          'in-review': { type: 'pending', label: 'In Review' },
          'awarded': { type: 'success', label: 'Awarded' },
          'closed': { type: 'warning', label: 'Closed' },
          'cancelled': { type: 'error', label: 'Cancelled' },
        };
        const mapped = statusMap[status] || { type: 'pending' as const, label: status };
        return <StatusBadge status={mapped.type} label={mapped.label} />;
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            View
          </Button>
          {row.original.status === 'open' && (
            <Button size="sm">
              Submit Bid
            </Button>
          )}
        </div>
      ),
    },
  ], []);

  // Bid columns
  const bidColumns: ColumnDef<Bid>[] = useMemo(() => [
    {
      accessorKey: 'bidId',
      header: 'Bid ID',
      cell: ({ row }) => (
        <span className="font-semibold text-sm">{row.original.bidId}</span>
      ),
    },
    {
      accessorKey: 'projectId',
      header: 'Project ID',
      cell: ({ row }) => (
        <span className="text-sm text-gray-900">{row.original.projectId}</span>
      ),
    },
    {
      accessorKey: 'proposedCost',
      header: 'Proposed Cost',
      cell: ({ row }) => (
        <span className="text-sm font-medium text-gray-900">
          {currency(row.original.proposedCost).format()}
        </span>
      ),
    },
    {
      accessorKey: 'estimatedTimeline',
      header: 'Timeline',
      cell: ({ row }) => (
        <span className="text-sm text-gray-900">{row.original.estimatedTimeline}</span>
      ),
    },
    {
      accessorKey: 'submittedDate',
      header: 'Submitted',
      cell: ({ row }) => (
        <span className="text-sm text-gray-900">
          {format(new Date(row.original.submittedDate), 'MMM dd, yyyy')}
        </span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.original.status;
        const statusMap: Record<string, { type: 'success' | 'warning' | 'error' | 'info' | 'pending', label: string }> = {
          'accepted': { type: 'success', label: 'Accepted' },
          'pending': { type: 'pending', label: 'Pending' },
          'under-review': { type: 'info', label: 'Under Review' },
          'rejected': { type: 'error', label: 'Rejected' },
          'withdrawn': { type: 'warning', label: 'Withdrawn' },
        };
        const mapped = statusMap[status] || { type: 'pending' as const, label: status };
        return <StatusBadge status={mapped.type} label={mapped.label} />;
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            View
          </Button>
          {row.original.status === 'pending' && (
            <Button variant="outline" size="sm">
              Withdraw
            </Button>
          )}
        </div>
      ),
    },
  ], []);

  // Filter configuration
  const filterConfig: FilterGroup[] = [
    {
      id: 'status',
      label: 'Status',
      type: 'checkbox',
      searchable: false,
      options: [
        { value: 'open', label: 'Open' },
        { value: 'in-review', label: 'In Review' },
        { value: 'awarded', label: 'Awarded' },
        { value: 'closed', label: 'Closed' },
        { value: 'cancelled', label: 'Cancelled' },
      ],
    },
    {
      id: 'serviceCategory',
      label: 'Service Category',
      type: 'checkbox',
      searchable: true,
      options: [
        { value: 'plumbing', label: 'Plumbing' },
        { value: 'hvac', label: 'HVAC' },
        { value: 'electrical', label: 'Electrical' },
        { value: 'carpentry', label: 'Carpentry' },
        { value: 'painting', label: 'Painting' },
        { value: 'landscaping', label: 'Landscaping' },
        { value: 'appliance', label: 'Appliance' },
        { value: 'general', label: 'General' },
      ],
    },
  ];

  return (
    <div className="p-4 space-y-4 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-end mb-2">
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          My Bids
        </Button>
      </div>

      {/* Marketplace Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Available Projects"
          value={marketplaceStats.availableProjects}
          icon={Briefcase}
        />
        <StatCard
          title="My Bids"
          value={marketplaceStats.myBids}
          icon={FileCheck}
        />
        <StatCard
          title="Won Bids"
          value={marketplaceStats.wonBids}
          change={`${marketplaceStats.winRate}% win rate`}
          trend="up"
          icon={TrendingUp}
        />
        <StatCard
          title="Total Opportunity"
          value={currency(marketplaceStats.totalProjectValue).format()}
          icon={Target}
        />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="projects">Available Projects</TabsTrigger>
          <TabsTrigger value="bids">My Bids</TabsTrigger>
        </TabsList>

        {/* Available Projects Tab */}
        <TabsContent value="projects" className="space-y-4">
          {/* Filter System - Mobile */}
          <div className="lg:hidden">
            <FilterSystem
              filters={filterConfig}
              filterValues={filters}
              onFilterChange={setFilters}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              resultCount={filteredProjects.length}
              totalCount={marketplaceProjects.length}
              searchPlaceholder="Search projects by ID, address, service category..."
            />
          </div>

          {/* Desktop Layout with Sidebar */}
          <div className="hidden lg:grid lg:grid-cols-4 lg:gap-4">
            <div className="lg:col-span-1">
              <FilterSidebar
                filters={filterConfig}
                filterValues={filters}
                onFilterChange={setFilters}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                resultCount={filteredProjects.length}
                totalCount={marketplaceProjects.length}
              />
            </div>
            
            <div className="lg:col-span-3 space-y-4">
              <div className="space-y-3">
                <FilterSystem
                  filters={filterConfig}
                  filterValues={filters}
                  onFilterChange={setFilters}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  resultCount={filteredProjects.length}
                  totalCount={marketplaceProjects.length}
                  searchPlaceholder="Search projects by ID, address, service category..."
                  showSearchBar={true}
                  showFilterBar={true}
                />
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Available Projects ({filteredProjects.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {filteredProjects.length > 0 ? (
                    <DataTable
                      data={filteredProjects}
                      columns={projectColumns}
                      pagination
                      pageSize={10}
                      searchable={false}
                    />
                  ) : (
                    <EmptyState
                      title="No projects found"
                      description="Try adjusting your search or filters"
                    />
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Mobile Data Table */}
          <div className="lg:hidden mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Available Projects ({filteredProjects.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {filteredProjects.length > 0 ? (
                  <DataTable
                    data={filteredProjects}
                    columns={projectColumns}
                    pagination
                    pageSize={10}
                    searchable={false}
                  />
                ) : (
                  <EmptyState
                    title="No projects found"
                    description="Try adjusting your search or filters"
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* My Bids Tab */}
        <TabsContent value="bids" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>My Bids ({filteredBids.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredBids.length > 0 ? (
                <DataTable
                  data={filteredBids}
                  columns={bidColumns}
                  pagination
                  pageSize={10}
                  searchable={false}
                />
              ) : (
                <EmptyState
                  title="No bids found"
                  description="You haven't submitted any bids yet"
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

