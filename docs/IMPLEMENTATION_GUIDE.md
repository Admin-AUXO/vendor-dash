# Implementation Guide

## Quick Reference

### Component Structure
```
components/
├── Overview.tsx         # Overview screen
├── WorkOrders.tsx       # Work orders management
├── Invoice.tsx          # Invoice management
├── Payments.tsx         # Payment tracking
├── Marketplace.tsx      # Marketplace and bidding
├── HelpDesk.tsx         # Support tickets and knowledge base
├── shared/              # Reusable components
│   ├── WorkOrderCard.tsx
│   ├── FilterSystem.tsx
│   ├── FilterSidebar.tsx
│   ├── AdvancedFilterPanel.tsx
│   ├── DataTable.tsx
│   ├── StatCard.tsx
│   └── ... (20 components)
└── ui/                  # UI primitives (25+ components)
```

### Data Usage
```tsx
import { workOrders, invoices, payments, metrics } from '@/data';
import type { WorkOrder, Invoice, Payment } from '@/data/types';
```

### Theme Usage
```tsx
// Colors - use CSS variables
className="bg-primary text-primary-foreground"
className="bg-gold-400 text-gold-700"

// Typography
<h1 className="font-display text-2xl font-bold">Title</h1>
<p className="font-sans text-sm">Body text</p>
```

### Standard Screen Layout
```tsx
<div className="p-4 space-y-4 bg-gray-50 min-h-screen">
  {/* Action Buttons (optional) */}
  <div className="flex items-center justify-end mb-2">
    <Button>Action</Button>
  </div>
  
  {/* Stat Cards */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    <StatCard {...stat1} />
    <StatCard {...stat2} />
  </div>
  
  {/* Filter System - Responsive */}
  <div className="lg:grid lg:grid-cols-4 lg:gap-4">
    {/* Desktop: Sidebar */}
    <div className="hidden lg:block lg:col-span-1">
      <FilterSidebar
        filters={filterConfig}
        filterValues={filters}
        onFilterChange={setFilters}
      />
    </div>
    
    {/* Content */}
    <div className="lg:col-span-3">
      {/* Mobile: Filter Drawer */}
      <div className="lg:hidden">
        <FilterSystem
          filters={filterConfig}
          filterValues={filters}
          onFilterChange={setFilters}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>
      
      {/* Data Table */}
      <Card>
        <CardContent>
          <DataTable data={filteredData} columns={columns} />
        </CardContent>
      </Card>
    </div>
  </div>
</div>
```

## Available Components

### Shared Components

#### Navigation
- `Sidebar` - Navigation sidebar with logo and menu items
- `TopHeader` - Top header with page title, notifications, settings, user profile
- `DashboardLayout` - Complete layout wrapper (sidebar + header + content)
- `UserProfile` - User profile card component

#### Data Display
- `StatCard` - KPI cards with icons, values, and trends
- `DataTable` - Sortable, filterable, paginated tables
- `Timeline` - Activity timelines with icons and status
- `WorkOrderCard` - Dedicated work order card component

#### Filtering
- `FilterSystem` - Responsive filter system (mobile drawer)
- `FilterSidebar` - Desktop filter sidebar
- `FilterBar` - Active filter chips and result count
- `AdvancedFilterPanel` - Advanced filter panel with searchable options
- `SearchBar` - Search input with debouncing

#### Inputs
- `DateRangePicker` - Date range selection
- `FileUpload` - Drag-and-drop file uploads

#### Feedback
- `StatusBadge` - Status indicators (success, warning, error, info, pending)
- `PriorityBadge` - Priority indicators (urgent, high, medium, low)
- `EmptyState` - Empty states with icons and messages
- `LoadingSpinner` - Loading indicators

#### Actions
- `ExportButton` - Data export (CSV, Excel, JSON)
- `AlertDialog` - Confirmation dialogs
- `Accordion` - Collapsible content sections

### UI Primitives

- `Button`, `Card`, `Input`, `Textarea`, `Badge`, `Label`
- `Select`, `Checkbox`, `RadioGroup`, `Switch`
- `Tabs`, `Dialog`, `Tooltip`, `Progress`
- `Avatar`, `ScrollArea`, `Separator`
- `Drawer` (Sheet) - Mobile drawer component

## Data Structure

Import from `@/data`:
- `workOrders` - All work orders
- `invoices` - All invoices
- `payments` - All payments
- `marketplaceProjects` - Available projects
- `bids` - Submitted bids
- `supportTickets` - Support tickets
- `clients` - Client data
- `activities` - Activity feed
- `notifications` - Notifications
- `vendor` - Vendor profile
- `metrics` - Dashboard KPIs

Helper functions:
- `getWorkOrdersByStatus(status)`
- `getInvoicesByStatus(status)`
- `weeklyRevenueData`, `monthlyRevenueData`
- `serviceDistributionData`

## Theme System

**Colors**: Use CSS variables (`--primary`, `--gold-400`, etc.)
**Typography**: `font-display` for headings, `font-sans` for body
**Spacing**: 8px grid (`p-4`, `gap-4`, `space-y-4`)
**Shadows**: `shadow-md`, `shadow-lg`

See `styles/globals.css` for all theme variables.

## Filter System Usage

### Filter Configuration
```tsx
const filterConfig: FilterGroup[] = [
  {
    id: 'status',
    label: 'Status',
    type: 'checkbox',
    searchable: false,
    options: [
      { value: 'pending', label: 'Pending' },
      { value: 'in-progress', label: 'In Progress' },
    ],
  },
];
```

### Filter State
```tsx
const [filters, setFilters] = useState<Record<string, string | string[]>>({
  status: [],
  priority: [],
});
```

## Chart Usage

### Line Chart with Average
```tsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts';

<LineChart data={chartData}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="date" />
  <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
  <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']} />
  <ReferenceLine y={average} stroke="#9ca3af" strokeDasharray="5 5" />
  <Line type="monotone" dataKey="revenue" stroke={primaryColor} />
</LineChart>
```

### Bar Chart
```tsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

<BarChart data={chartData}>
  <CartesianGrid strokeDasharray="3 3" vertical={false} />
  <XAxis dataKey="name" angle={-45} textAnchor="end" />
  <YAxis />
  <Tooltip />
  <Bar dataKey="value" fill={primaryColor} radius={[4, 4, 0, 0]} />
</BarChart>
```

---

For detailed documentation, see:
- `WIREFRAME_GUIDE.md` - Screen specifications
- `VENDOR_DASHBOARD_WIREFRAME_GUIDE.md` - Detailed reference
- `data/README.md` - Data structure details
