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
  DollarSign, 
  CreditCard,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { payments, invoices, type Payment, type Invoice } from '../data';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import currency from 'currency.js';


export function Payments() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Record<string, string | string[]>>({
    status: [],
    paymentMethod: [],
  });

  // Filter data
  const filteredData = useMemo(() => {
    let data = payments;

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      data = data.filter(
        (p: Payment) =>
          p.paymentId.toLowerCase().includes(query) ||
          p.invoiceNumber.toLowerCase().includes(query) ||
          p.clientName.toLowerCase().includes(query) ||
          (p.referenceNumber && p.referenceNumber.toLowerCase().includes(query))
      );
    }

    // Apply filters
    if (filters.status && Array.isArray(filters.status) && filters.status.length > 0) {
      data = data.filter((p: Payment) => filters.status.includes(p.status));
    }
    if (filters.paymentMethod && Array.isArray(filters.paymentMethod) && filters.paymentMethod.length > 0) {
      data = data.filter((p: Payment) => filters.paymentMethod.includes(p.paymentMethod));
    }

    return data;
  }, [searchQuery, filters]);

  // Calculate financial summary
  const financialSummary = useMemo(() => {
    const totalReceived = payments
      .filter((p: Payment) => p.status === 'completed')
      .reduce((sum: number, p: Payment) => sum + p.amount, 0);
    const pendingPayments = payments
      .filter((p: Payment) => p.status === 'pending')
      .reduce((sum: number, p: Payment) => sum + p.amount, 0);
    const outstandingInvoices = invoices
      .filter((inv: Invoice) => inv.status !== 'paid' && inv.status !== 'cancelled')
      .reduce((sum: number, inv: Invoice) => sum + inv.total, 0);
    const thisMonth = payments
      .filter((p: Payment) => {
        const paymentDate = new Date(p.paymentDate);
        const now = new Date();
        return p.status === 'completed' && 
               paymentDate.getMonth() === now.getMonth() &&
               paymentDate.getFullYear() === now.getFullYear();
      })
      .reduce((sum: number, p: Payment) => sum + p.amount, 0);

    return { totalReceived, pendingPayments, outstandingInvoices, thisMonth };
  }, []);

  // Outstanding balances
  const outstandingBalances = useMemo(() => {
    return invoices
      .filter((inv: Invoice) => inv.status !== 'paid' && inv.status !== 'cancelled')
      .sort((a: Invoice, b: Invoice) => {
        const aOverdue = a.status === 'overdue' ? 1 : 0;
        const bOverdue = b.status === 'overdue' ? 1 : 0;
        if (aOverdue !== bOverdue) return bOverdue - aOverdue;
        return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
      })
      .slice(0, 5);
  }, []);


  // Define columns
  const columns: ColumnDef<Payment>[] = useMemo(() => [
    {
      accessorKey: 'paymentId',
      header: 'Payment ID',
      cell: ({ row }) => (
        <span className="font-semibold text-sm">{row.original.paymentId}</span>
      ),
    },
    {
      accessorKey: 'invoiceNumber',
      header: 'Invoice #',
      cell: ({ row }) => (
        <span className="text-sm text-gray-900">{row.original.invoiceNumber}</span>
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
      accessorKey: 'paymentDate',
      header: 'Payment Date',
      cell: ({ row }) => (
        <span className="text-sm text-gray-900">
          {format(new Date(row.original.paymentDate), 'MMM dd, yyyy')}
        </span>
      ),
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: ({ row }) => (
        <span className="text-sm font-medium text-gray-900">
          {currency(row.original.amount).format()}
        </span>
      ),
    },
    {
      accessorKey: 'paymentMethod',
      header: 'Method',
      cell: ({ row }) => (
        <span className="text-sm text-gray-900 capitalize">
          {row.original.paymentMethod.replace('-', ' ')}
        </span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.original.status;
        const statusMap: Record<string, { type: 'success' | 'warning' | 'error' | 'info' | 'pending', label: string }> = {
          'completed': { type: 'success', label: 'Completed' },
          'pending': { type: 'pending', label: 'Pending' },
          'failed': { type: 'error', label: 'Failed' },
          'refunded': { type: 'warning', label: 'Refunded' },
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
        { value: 'pending', label: 'Pending' },
        { value: 'completed', label: 'Completed' },
        { value: 'failed', label: 'Failed' },
        { value: 'refunded', label: 'Refunded' },
        { value: 'cancelled', label: 'Cancelled' },
      ],
    },
    {
      id: 'paymentMethod',
      label: 'Payment Method',
      type: 'checkbox',
      searchable: true,
      options: [
        { value: 'check', label: 'Check' },
        { value: 'ach', label: 'ACH' },
        { value: 'wire', label: 'Wire Transfer' },
        { value: 'credit-card', label: 'Credit Card' },
        { value: 'cash', label: 'Cash' },
        { value: 'other', label: 'Other' },
      ],
    },
  ];

  return (
    <div className="p-4 space-y-4 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-end mb-2">
        <div className="flex items-center gap-2">
          <ExportButton
            data={filteredData}
            filename="payments"
          />
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Received"
          value={currency(financialSummary.totalReceived).format()}
          change="All time"
          icon={DollarSign}
        />
        <StatCard
          title="Pending Payments"
          value={currency(financialSummary.pendingPayments).format()}
          change="Awaiting processing"
          icon={CreditCard}
        />
        <StatCard
          title="Outstanding Invoices"
          value={currency(financialSummary.outstandingInvoices).format()}
          change="Unpaid invoices"
          icon={AlertCircle}
        />
        <StatCard
          title="This Month"
          value={currency(financialSummary.thisMonth).format()}
          change="Current month revenue"
          trend="up"
          icon={TrendingUp}
        />
      </div>


      {/* Outstanding Balances */}
      {outstandingBalances.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" style={{ color: 'var(--warning)' }} />
              Outstanding Balances
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {outstandingBalances.map((inv: Invoice) => (
                <div
                  key={inv.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                  style={inv.status === 'overdue' ? {
                    borderColor: 'var(--status-error-light)',
                    backgroundColor: 'var(--status-error-light)'
                  } : {}}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm">{inv.invoiceNumber}</span>
                      <StatusBadge 
                        status={
                          inv.status === 'paid' ? 'success' :
                          inv.status === 'overdue' ? 'error' :
                          inv.status === 'approved' ? 'success' :
                          inv.status === 'sent' || inv.status === 'viewed' ? 'info' :
                          'pending'
                        }
                        label={inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
                      />
                    </div>
                    <p className="text-sm text-gray-600">{inv.clientName}</p>
                    <p className="text-xs text-gray-500">
                      Due: {format(new Date(inv.dueDate), 'MMM dd, yyyy')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-lg">{currency(inv.total).format()}</p>
                    <Button variant="ghost" size="sm" className="mt-1">
                      Send Reminder
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filter System - Mobile */}
      <div className="lg:hidden">
        <FilterSystem
          filters={filterConfig}
          filterValues={filters}
          onFilterChange={setFilters}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          resultCount={filteredData.length}
          totalCount={payments.length}
          searchPlaceholder="Search payments by ID, invoice number, client name..."
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
            totalCount={payments.length}
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
              totalCount={payments.length}
              searchPlaceholder="Search payments by ID, invoice number, client name..."
              showSearchBar={true}
              showFilterBar={true}
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Payment History ({filteredData.length})</CardTitle>
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
                  title="No payments found"
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
            <CardTitle>Payment History ({filteredData.length})</CardTitle>
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
                title="No payments found"
                description="Try adjusting your search or filters"
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

