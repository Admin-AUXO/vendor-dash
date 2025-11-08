import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button } from './ui';
import { 
  StatCard, 
  FilterSystem,
  FilterSidebar,
  DataTable,
  StatusBadge,
  PriorityBadge,
  ExportButton,
  EmptyState,
  type FilterGroup,
} from './shared';
import { 
  ClipboardList, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Plus
} from 'lucide-react';
import { workOrders, type WorkOrder } from '../data';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import currency from 'currency.js';

export function WorkOrders() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Record<string, string | string[]>>({
    status: [],
    priority: [],
    serviceCategory: [],
  });

  // Filter data
  const filteredData = useMemo(() => {
    let data = workOrders;

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      data = data.filter(
        (wo) =>
          wo.workOrderId.toLowerCase().includes(query) ||
          wo.propertyAddress.toLowerCase().includes(query) ||
          wo.clientName.toLowerCase().includes(query) ||
          wo.serviceDescription.toLowerCase().includes(query)
      );
    }

    // Apply filters
    if (filters.status && Array.isArray(filters.status) && filters.status.length > 0) {
      data = data.filter((wo: WorkOrder) => filters.status.includes(wo.status));
    }
    if (filters.priority && Array.isArray(filters.priority) && filters.priority.length > 0) {
      data = data.filter((wo: WorkOrder) => filters.priority.includes(wo.priority));
    }
    if (filters.serviceCategory && Array.isArray(filters.serviceCategory) && filters.serviceCategory.length > 0) {
      data = data.filter((wo: WorkOrder) => filters.serviceCategory.includes(wo.serviceCategory));
    }

    return data;
  }, [searchQuery, filters]);

  // Calculate summary stats
  const summaryStats = useMemo(() => {
    const pending = workOrders.filter((wo: WorkOrder) => wo.status === 'pending' || wo.status === 'assigned').length;
    const inProgress = workOrders.filter((wo: WorkOrder) => wo.status === 'in-progress').length;
    const completed = workOrders.filter((wo: WorkOrder) => wo.status === 'completed').length;
    const overdue = workOrders.filter((wo: WorkOrder) => {
      if (wo.status === 'completed') return false;
      return new Date(wo.dueDate) < new Date();
    }).length;

    return { pending, inProgress, completed, overdue };
  }, []);

  // Define columns
  const columns: ColumnDef<WorkOrder>[] = useMemo(() => [
    {
      accessorKey: 'workOrderId',
      header: 'Work Order ID',
      cell: ({ row }) => (
        <span className="font-semibold text-sm">{row.original.workOrderId}</span>
      ),
    },
    {
      accessorKey: 'propertyAddress',
      header: 'Property Address',
      cell: ({ row }) => (
        <div>
          <p className="text-sm font-medium text-gray-900">{row.original.propertyAddress}</p>
          <p className="text-xs text-gray-500">{row.original.serviceCategory}</p>
        </div>
      ),
    },
    {
      accessorKey: 'clientName',
      header: 'Client',
      cell: ({ row }) => (
        <span className="text-sm text-gray-900">{row.original.clientName}</span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.original.status;
        const statusMap: Record<string, { type: 'success' | 'warning' | 'error' | 'info' | 'pending', label: string }> = {
          'completed': { type: 'success', label: 'Completed' },
          'in-progress': { type: 'info', label: 'In Progress' },
          'assigned': { type: 'info', label: 'Assigned' },
          'pending': { type: 'pending', label: 'Pending' },
          'cancelled': { type: 'error', label: 'Cancelled' },
        };
        const mapped = statusMap[status] || { type: 'pending' as const, label: status };
        return <StatusBadge status={mapped.type} label={mapped.label} />;
      },
    },
    {
      accessorKey: 'priority',
      header: 'Priority',
      cell: ({ row }) => <PriorityBadge priority={row.original.priority} />,
    },
    {
      accessorKey: 'dueDate',
      header: 'Due Date',
      cell: ({ row }) => (
        <span className="text-sm text-gray-900">
          {format(new Date(row.original.dueDate), 'MMM dd, yyyy')}
        </span>
      ),
    },
    {
      accessorKey: 'estimatedCost',
      header: 'Estimated Cost',
      cell: ({ row }) => (
        <span className="text-sm font-medium text-gray-900">
          {currency(row.original.estimatedCost).format()}
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: () => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            View
          </Button>
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
        { value: 'pending', label: 'Pending' },
        { value: 'assigned', label: 'Assigned' },
        { value: 'in-progress', label: 'In Progress' },
        { value: 'completed', label: 'Completed' },
        { value: 'cancelled', label: 'Cancelled' },
      ],
    },
    {
      id: 'priority',
      label: 'Priority',
      type: 'checkbox',
      searchable: false,
      options: [
        { value: 'urgent', label: 'Urgent' },
        { value: 'high', label: 'High' },
        { value: 'medium', label: 'Medium' },
        { value: 'low', label: 'Low' },
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
        <div className="flex items-center gap-2">
          <ExportButton
            data={filteredData}
            filename="work-orders"
          />
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Work Order
          </Button>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Pending"
          value={summaryStats.pending}
          icon={Clock}
        />
        <StatCard
          title="In Progress"
          value={summaryStats.inProgress}
          icon={ClipboardList}
        />
        <StatCard
          title="Completed"
          value={summaryStats.completed}
          icon={CheckCircle}
        />
        <StatCard
          title="Overdue"
          value={summaryStats.overdue}
          icon={AlertCircle}
        />
      </div>

      {/* Filter System - Mobile */}
      <div className="lg:hidden">
        <FilterSystem
          filters={filterConfig}
          filterValues={filters}
          onFilterChange={setFilters}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          resultCount={filteredData.length}
          totalCount={workOrders.length}
          searchPlaceholder="Search work orders by ID, address, client name..."
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
            resultCount={filteredData.length}
            totalCount={workOrders.length}
          />
        </div>
        
        <div className="lg:col-span-3 space-y-4">
          {/* Search Bar and Filter Bar for Desktop */}
          <div className="space-y-3">
            <FilterSystem
              filters={filterConfig}
              filterValues={filters}
              onFilterChange={setFilters}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              resultCount={filteredData.length}
              totalCount={workOrders.length}
              searchPlaceholder="Search work orders by ID, address, client name..."
              showSearchBar={true}
              showFilterBar={true}
            />
          </div>

          {/* Data Table */}
          <Card>
            <CardHeader>
              <CardTitle>Work Orders ({filteredData.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredData.length > 0 ? (
                <DataTable
                  data={filteredData}
                  columns={columns}
                  pagination
                  pageSize={10}
                  searchable={false}
                />
              ) : (
                <EmptyState
                  title="No work orders found"
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
            <CardTitle>Work Orders ({filteredData.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredData.length > 0 ? (
              <DataTable
                data={filteredData}
                columns={columns}
                pagination
                pageSize={10}
                searchable={false}
              />
            ) : (
              <EmptyState
                title="No work orders found"
                description="Try adjusting your search or filters"
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

