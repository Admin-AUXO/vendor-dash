import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button } from './ui';
import { 
  StatCard, 
  FilterSystem,
  FilterSidebar,
  DataTable,
  StatusBadge,
  ExportButton,
  EmptyState,
  type FilterGroup,
} from './shared';
import { 
  FileText, 
  DollarSign, 
  Clock, 
  AlertCircle,
  Plus
} from 'lucide-react';
import { invoices, type Invoice } from '../data';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import currency from 'currency.js';


export function Invoice() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Record<string, string | string[]>>({
    status: [],
  });

  // Filter data
  const filteredData = useMemo(() => {
    let data = invoices;

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      data = data.filter(
        (inv: Invoice) =>
          inv.invoiceNumber.toLowerCase().includes(query) ||
          inv.clientName.toLowerCase().includes(query) ||
          (inv.workOrderId && inv.workOrderId.toLowerCase().includes(query))
      );
    }

    // Apply filters
    if (filters.status && Array.isArray(filters.status) && filters.status.length > 0) {
      data = data.filter((inv: Invoice) => filters.status.includes(inv.status));
    }

    return data;
  }, [searchQuery, filters]);

  // Calculate summary stats
  const summaryStats = useMemo(() => {
    const total = invoices.length;
    const paid = invoices.filter((inv: Invoice) => inv.status === 'paid').length;
    const pending = invoices.filter((inv: Invoice) => inv.status === 'sent' || inv.status === 'viewed' || inv.status === 'approved').length;
    const overdue = invoices.filter((inv: Invoice) => inv.status === 'overdue').length;
    const paidAmount = invoices
      .filter((inv: Invoice) => inv.status === 'paid')
      .reduce((sum: number, inv: Invoice) => sum + inv.total, 0);
    const pendingAmount = invoices
      .filter((inv: Invoice) => inv.status === 'sent' || inv.status === 'viewed' || inv.status === 'approved')
      .reduce((sum: number, inv: Invoice) => sum + inv.total, 0);
    const overdueAmount = invoices
      .filter((inv: Invoice) => inv.status === 'overdue')
      .reduce((sum: number, inv: Invoice) => sum + inv.total, 0);

    return { total, paid, pending, overdue, paidAmount, pendingAmount, overdueAmount };
  }, []);


  // Define columns
  const columns: ColumnDef<Invoice>[] = useMemo(() => [
    {
      accessorKey: 'invoiceNumber',
      header: 'Invoice #',
      cell: ({ row }) => (
        <span className="font-semibold text-sm">{row.original.invoiceNumber}</span>
      ),
    },
    {
      accessorKey: 'workOrderId',
      header: 'Work Order',
      cell: ({ row }) => (
        <span className="text-sm text-gray-900">
          {row.original.workOrderId || 'N/A'}
        </span>
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
      accessorKey: 'issueDate',
      header: 'Issue Date',
      cell: ({ row }) => (
        <span className="text-sm text-gray-900">
          {format(new Date(row.original.issueDate), 'MMM dd, yyyy')}
        </span>
      ),
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
      accessorKey: 'total',
      header: 'Amount',
      cell: ({ row }) => (
        <span className="text-sm font-medium text-gray-900">
          {currency(row.original.total).format()}
        </span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.original.status;
        const statusMap: Record<string, { type: 'success' | 'warning' | 'error' | 'info' | 'pending', label: string }> = {
          'paid': { type: 'success', label: 'Paid' },
          'approved': { type: 'success', label: 'Approved' },
          'sent': { type: 'info', label: 'Sent' },
          'viewed': { type: 'info', label: 'Viewed' },
          'draft': { type: 'pending', label: 'Draft' },
          'overdue': { type: 'error', label: 'Overdue' },
          'disputed': { type: 'warning', label: 'Disputed' },
          'cancelled': { type: 'error', label: 'Cancelled' },
        };
        const mapped = statusMap[status] || { type: 'pending' as const, label: status };
        return <StatusBadge status={mapped.type} label={mapped.label} />;
      },
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
        { value: 'draft', label: 'Draft' },
        { value: 'sent', label: 'Sent' },
        { value: 'viewed', label: 'Viewed' },
        { value: 'approved', label: 'Approved' },
        { value: 'paid', label: 'Paid' },
        { value: 'overdue', label: 'Overdue' },
        { value: 'disputed', label: 'Disputed' },
        { value: 'cancelled', label: 'Cancelled' },
      ],
    },
  ];

  return (
    <div className="p-4 space-y-4 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-end mb-2">
        <div className="flex items-center gap-2">
          <ExportButton
            data={filteredData}
            filename="invoices"
          />
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Invoice
          </Button>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Invoices"
          value={summaryStats.total}
          icon={FileText}
        />
        <StatCard
          title="Paid Amount"
          value={currency(summaryStats.paidAmount).format()}
          change={`${summaryStats.paid} paid`}
          icon={DollarSign}
        />
        <StatCard
          title="Pending Amount"
          value={currency(summaryStats.pendingAmount).format()}
          change={`${summaryStats.pending} pending`}
          icon={Clock}
        />
        <StatCard
          title="Overdue Amount"
          value={currency(summaryStats.overdueAmount).format()}
          change={`${summaryStats.overdue} overdue`}
          trend={summaryStats.overdue > 0 ? "down" : "neutral"}
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
          totalCount={invoices.length}
          searchPlaceholder="Search invoices by number, client name, work order..."
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
            totalCount={invoices.length}
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
              resultCount={filteredData.length}
              totalCount={invoices.length}
              searchPlaceholder="Search invoices by number, client name, work order..."
              showSearchBar={true}
              showFilterBar={true}
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Invoices ({filteredData.length})</CardTitle>
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
                  title="No invoices found"
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
            <CardTitle>Invoices ({filteredData.length})</CardTitle>
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
                title="No invoices found"
                description="Try adjusting your search or filters"
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

