import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Tabs, TabsContent, TabsList, TabsTrigger } from './ui';
import { 
  StatCard, 
  FilterSystem,
  FilterSidebar,
  SearchBar,
  DataTable,
  StatusBadge,
  PriorityBadge,
  EmptyState,
  Accordion,
  type FilterGroup,
} from './shared';
import { 
  Headphones, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Plus,
  MessageSquare
} from 'lucide-react';
import { supportTickets, type SupportTicket } from '../data';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';

export function HelpDesk() {
  const [activeTab, setActiveTab] = useState('tickets');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Record<string, string | string[]>>({
    status: [],
    priority: [],
    category: [],
  });

  // Filter tickets
  const filteredTickets = useMemo(() => {
    let data = supportTickets;

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      data = data.filter(
        (ticket: SupportTicket) =>
          ticket.ticketId.toLowerCase().includes(query) ||
          ticket.subject.toLowerCase().includes(query) ||
          ticket.description.toLowerCase().includes(query)
      );
    }

    // Apply filters
    if (filters.status && Array.isArray(filters.status) && filters.status.length > 0) {
      data = data.filter((ticket: SupportTicket) => filters.status.includes(ticket.status));
    }
    if (filters.priority && Array.isArray(filters.priority) && filters.priority.length > 0) {
      data = data.filter((ticket: SupportTicket) => filters.priority.includes(ticket.priority));
    }
    if (filters.category && Array.isArray(filters.category) && filters.category.length > 0) {
      data = data.filter((ticket: SupportTicket) => filters.category.includes(ticket.category));
    }

    return data;
  }, [searchQuery, filters]);

  // Calculate support stats
  const supportStats = useMemo(() => {
    const open = supportTickets.filter((t: SupportTicket) => t.status === 'open').length;
    const inProgress = supportTickets.filter((t: SupportTicket) => t.status === 'in-progress').length;
    const resolved = supportTickets.filter((t: SupportTicket) => t.status === 'resolved' || t.status === 'closed').length;
    const avgResponseTime = 2.5; // This would be calculated from actual data

    return { open, inProgress, resolved, avgResponseTime };
  }, []);

  // Knowledge base articles (mock data)
  const knowledgeBaseArticles = [
    {
      id: '1',
      category: 'Getting Started',
      title: 'How to create a work order',
      content: 'To create a work order, navigate to the Work Orders section and click the "Create Work Order" button. Fill in the required information including property address, service type, and client details.',
    },
    {
      id: '2',
      category: 'Billing & Payments',
      title: 'How to create an invoice',
      content: 'Invoices can be created from the Invoice screen. Click "Create Invoice" and select the work order you want to invoice. The system will automatically populate the invoice with work order details.',
    },
    {
      id: '3',
      category: 'Marketplace',
      title: 'How to submit a bid',
      content: 'To submit a bid on a project, go to the Marketplace screen, find the project you want to bid on, and click "Submit Bid". Fill in your proposed cost, timeline, and any additional notes.',
    },
    {
      id: '4',
      category: 'Account Management',
      title: 'How to update your profile',
      content: 'You can update your profile information by clicking on your profile icon in the top right corner and selecting "View Profile". From there, you can edit your company information and contact details.',
    },
    {
      id: '5',
      category: 'Technical Support',
      title: 'Browser compatibility',
      content: 'The dashboard is compatible with Chrome, Firefox, Safari, and Edge browsers. For the best experience, we recommend using the latest version of Chrome.',
    },
  ];

  // Define columns
  const columns: ColumnDef<SupportTicket>[] = useMemo(() => [
    {
      accessorKey: 'ticketId',
      header: 'Ticket ID',
      cell: ({ row }) => (
        <span className="font-semibold text-sm">{row.original.ticketId}</span>
      ),
    },
    {
      accessorKey: 'subject',
      header: 'Subject',
      cell: ({ row }) => (
        <span className="text-sm font-medium text-gray-900">{row.original.subject}</span>
      ),
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ row }) => (
        <span className="text-sm text-gray-900 capitalize">
          {row.original.category.replace('-', ' ')}
        </span>
      ),
    },
    {
      accessorKey: 'priority',
      header: 'Priority',
      cell: ({ row }) => <PriorityBadge priority={row.original.priority} />,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.original.status;
        const statusMap: Record<string, { type: 'success' | 'warning' | 'error' | 'info' | 'pending', label: string }> = {
          'resolved': { type: 'success', label: 'Resolved' },
          'closed': { type: 'success', label: 'Closed' },
          'in-progress': { type: 'info', label: 'In Progress' },
          'open': { type: 'pending', label: 'Open' },
          'waiting-response': { type: 'warning', label: 'Waiting Response' },
        };
        const mapped = statusMap[status] || { type: 'pending' as const, label: status };
        return <StatusBadge status={mapped.type} label={mapped.label} />;
      },
    },
    {
      accessorKey: 'createdDate',
      header: 'Created',
      cell: ({ row }) => (
        <span className="text-sm text-gray-900">
          {format(new Date(row.original.createdDate), 'MMM dd, yyyy')}
        </span>
      ),
    },
    {
      accessorKey: 'assignedAgent',
      header: 'Assigned To',
      cell: ({ row }) => (
        <span className="text-sm text-gray-900">
          {row.original.assignedAgent || 'Unassigned'}
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
        { value: 'open', label: 'Open' },
        { value: 'in-progress', label: 'In Progress' },
        { value: 'waiting-response', label: 'Waiting Response' },
        { value: 'resolved', label: 'Resolved' },
        { value: 'closed', label: 'Closed' },
      ],
    },
    {
      id: 'priority',
      label: 'Priority',
      type: 'checkbox',
      searchable: false,
      options: [
        { value: 'low', label: 'Low' },
        { value: 'medium', label: 'Medium' },
        { value: 'high', label: 'High' },
        { value: 'urgent', label: 'Urgent' },
      ],
    },
    {
      id: 'category',
      label: 'Category',
      type: 'checkbox',
      searchable: true,
      options: [
        { value: 'technical', label: 'Technical' },
        { value: 'billing', label: 'Billing' },
        { value: 'account', label: 'Account' },
        { value: 'feature-request', label: 'Feature Request' },
        { value: 'bug', label: 'Bug' },
        { value: 'other', label: 'Other' },
      ],
    },
  ];

  // Group articles by category
  const articlesByCategory = useMemo(() => {
    const grouped: Record<string, typeof knowledgeBaseArticles> = {};
    knowledgeBaseArticles.forEach(article => {
      if (!grouped[article.category]) {
        grouped[article.category] = [];
      }
      grouped[article.category].push(article);
    });
    return grouped;
  }, []);

  return (
    <div className="p-4 space-y-4 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-end mb-2">
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Ticket
        </Button>
      </div>

      {/* Support Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Open Tickets"
          value={supportStats.open}
          icon={AlertCircle}
        />
        <StatCard
          title="In Progress"
          value={supportStats.inProgress}
          icon={Clock}
        />
        <StatCard
          title="Resolved"
          value={supportStats.resolved}
          icon={CheckCircle}
        />
        <StatCard
          title="Avg Response Time"
          value={`${supportStats.avgResponseTime}h`}
          icon={Headphones}
        />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="tickets">Support Tickets</TabsTrigger>
          <TabsTrigger value="knowledge-base">Knowledge Base</TabsTrigger>
          <TabsTrigger value="live-chat" disabled>Live Chat</TabsTrigger>
        </TabsList>

        {/* Support Tickets Tab */}
        <TabsContent value="tickets" className="space-y-4">
          {/* Filter System - Mobile */}
          <div className="lg:hidden">
            <FilterSystem
              filters={filterConfig}
              filterValues={filters}
              onFilterChange={setFilters}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              resultCount={filteredTickets.length}
              totalCount={supportTickets.length}
              searchPlaceholder="Search tickets by ID, subject, description..."
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
                resultCount={filteredTickets.length}
                totalCount={supportTickets.length}
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
                  resultCount={filteredTickets.length}
                  totalCount={supportTickets.length}
                  searchPlaceholder="Search tickets by ID, subject, description..."
                  showSearchBar={true}
                  showFilterBar={true}
                />
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Support Tickets ({filteredTickets.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {filteredTickets.length > 0 ? (
                    <DataTable
                      data={filteredTickets}
                      columns={columns}
                      pagination
                      pageSize={10}
                      searchable={false}
                    />
                  ) : (
                    <EmptyState
                      title="No tickets found"
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
                <CardTitle>Support Tickets ({filteredTickets.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {filteredTickets.length > 0 ? (
                  <DataTable
                    data={filteredTickets}
                    columns={columns}
                    pagination
                    pageSize={10}
                    searchable={false}
                  />
                ) : (
                  <EmptyState
                    title="No tickets found"
                    description="Try adjusting your search or filters"
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Knowledge Base Tab */}
        <TabsContent value="knowledge-base" className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <SearchBar
                placeholder="Search knowledge base articles..."
                onSearch={setSearchQuery}
              />
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Knowledge Base</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(articlesByCategory).map(([category, articles]) => (
                  <Accordion
                    key={category}
                    type="single"
                    items={[
                      {
                        id: category,
                        title: category,
                        content: (
                          <div className="space-y-3 pt-2">
                            {articles.map((article) => (
                              <div
                                key={article.id}
                                className="p-3 border border-border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                              >
                                <h4 className="font-semibold text-sm text-gray-900 mb-1">
                                  {article.title}
                                </h4>
                                <p className="text-sm text-gray-600">{article.content}</p>
                              </div>
                            ))}
                          </div>
                        ),
                      },
                    ]}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Live Chat Tab */}
        <TabsContent value="live-chat" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Live Chat
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EmptyState
                title="Live chat coming soon"
                description="Live chat support will be available in a future update"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

