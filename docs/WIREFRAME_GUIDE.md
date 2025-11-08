# Vendor Dashboard Wireframe Guide

## Overview

Real Estate B2B Vendor Dashboard with 6 screens designed for desktop use (1920x1080+). Each screen serves a specific purpose in managing vendor operations.

**Note**: Page titles are displayed in the top header, not on individual screens.

---

## Screen 1: Overview

**Purpose**: Central hub showing business performance, KPIs, and critical alerts.

**Key Elements**:
- **4 KPI Cards**: Active Work Orders, Monthly Revenue, Outstanding Invoices, Completion Rate
- **Charts**: 
  - Weekly Revenue (Line chart with average reference line)
  - Service Distribution (Bar chart - sorted by value)
- **Urgent Work Orders**: Alert card with high-priority items using `WorkOrderCard` component
- **Activity Feed**: Recent actions (work orders, invoices, payments, bids)

**Data Sources**: `metrics`, `workOrders`, `activities`, `weeklyRevenueData`, `serviceDistributionData`

**Components Used**: `StatCard`, `WorkOrderCard`, `Timeline`, `LineChart`, `BarChart`

---

## Screen 2: Work Orders

**Purpose**: Manage, track, and update all work orders.

**Key Elements**:
- **Action Buttons**: Export, Create Work Order (top right)
- **Summary Stats**: Pending, In Progress, Completed, Total
- **Responsive Filter System**: 
  - Desktop: Filter sidebar + filter bar
  - Mobile: Filter drawer
- **Data Table**: Work orders with sorting, filtering, pagination
- **Columns**: ID, Property, Service, Status, Priority, Dates, Client, Cost

**Data Sources**: `workOrders` (filter by status, priority, date, service category)

**Components Used**: `StatCard`, `FilterSystem`, `FilterSidebar`, `DataTable`, `StatusBadge`, `PriorityBadge`, `ExportButton`

---

## Screen 3: Invoice

**Purpose**: Create, track, and manage invoices.

**Key Elements**:
- **Action Buttons**: Export, Create Invoice (top right)
- **Summary Stats**: Total Invoices, Paid Amount, Pending, Overdue
- **Responsive Filter System**: Status, date, client filters
- **Data Table**: Invoices with status, amounts, dates
- **No Charts**: Charts removed per design requirements

**Data Sources**: `invoices` (linked to work orders)

**Components Used**: `StatCard`, `FilterSystem`, `FilterSidebar`, `DataTable`, `StatusBadge`, `ExportButton`

---

## Screen 4: Payments

**Purpose**: Track and manage payment transactions.

**Key Elements**:
- **Action Buttons**: Export (top right)
- **Financial Summary**: Total Received, Pending, Outstanding, Net Income
- **Outstanding Balances**: List of overdue invoices
- **Responsive Filter System**: Payment method, status, date filters
- **Data Table**: Payment history with details
- **No Charts**: Charts removed per design requirements

**Data Sources**: `payments`, `invoices` (for outstanding balances)

**Components Used**: `StatCard`, `FilterSystem`, `FilterSidebar`, `DataTable`, `StatusBadge`, `ExportButton`

---

## Screen 5: Marketplace

**Purpose**: Discover and bid on available work opportunities.

**Key Elements**:
- **Action Buttons**: My Bids (top right)
- **Tabs**: Available Projects | My Bids
- **Summary Stats**: Available Projects, My Bids, Won Bids, Win Rate
- **Responsive Filter System**: Service type, budget, location filters
- **Project Cards/Table**: Available projects with details
- **My Bids**: Track bid status (pending, accepted, rejected)

**Data Sources**: `marketplaceProjects`, `bids`

**Components Used**: `StatCard`, `Tabs`, `FilterSystem`, `FilterSidebar`, `DataTable`, `StatusBadge`

---

## Screen 6: Help Desk

**Purpose**: Support tickets and knowledge base access.

**Key Elements**:
- **Action Buttons**: New Ticket (top right)
- **Tabs**: Support Tickets | Knowledge Base
- **Summary Stats**: Open Tickets, In Progress, Resolved, Avg Response Time
- **Responsive Filter System**: Category, priority, status filters
- **Data Table**: Support tickets with status, priority, category
- **Knowledge Base**: Searchable articles and FAQs using `Accordion`

**Data Sources**: `supportTickets`, knowledge base articles

**Components Used**: `StatCard`, `Tabs`, `FilterSystem`, `FilterSidebar`, `DataTable`, `StatusBadge`, `PriorityBadge`, `SearchBar`, `Accordion`

---

## Reusable Elements

### Navigation
- **Sidebar**: Screen navigation with icons (compact design)
- **Top Header**: Page title, notifications, settings, user profile

### Data Display
- **StatCard**: KPI cards with icons and trends
- **DataTable**: Sortable, filterable, paginated tables
- **WorkOrderCard**: Dedicated work order card component
- **Charts**: Line charts (with averages), Bar charts (sorted)

### Forms & Inputs
- **FilterSystem**: Responsive filter system (mobile drawer + desktop sidebar)
- **FilterSidebar**: Desktop filter sidebar
- **FilterBar**: Active filter chips and result count
- **AdvancedFilterPanel**: Searchable filter options
- **SearchBar**: Debounced search input
- **DateRangePicker**: Date range selection
- **FileUpload**: Drag-and-drop file uploads

### Feedback
- **StatusBadge**: Status indicators (success, warning, error, info, pending)
- **PriorityBadge**: Priority indicators (urgent, high, medium, low)
- **EmptyState**: No data states
- **LoadingSpinner**: Loading indicators
- **Timeline**: Activity/event timeline

### Actions
- **ExportButton**: Export data (CSV, Excel, JSON)
- **AlertDialog**: Confirmation dialogs
- **Accordion**: Collapsible content sections

---

## Design Principles

- **Desktop-First**: Optimized for 1920x1080+ screens
- **Responsive**: Mobile-friendly filter system
- **Theme**: Gold/yellow (#f7d604) with consistent styling
- **Spacing**: 8px grid system (optimized spacing)
- **Typography**: Inter (body) + Space Grotesk (headings)
- **Accessibility**: Keyboard navigation, ARIA labels, screen reader support
- **Page Titles**: Displayed in top header only
- **Charts**: Bar charts preferred over pie charts, line charts with averages

---

## Data Models

- **Work Orders**: Properties, services, status, priority, costs
- **Invoices**: Linked to work orders, line items, payment status
- **Payments**: Linked to invoices, payment methods, status
- **Marketplace Projects**: Available projects with budgets
- **Bids**: Submitted bids with cost breakdowns
- **Support Tickets**: Tickets with categories, priorities, messages
- **Clients**: Client information and history
- **Activities**: Activity feed items
- **Notifications**: System alerts and updates

All data available in `@/data` - see `data/README.md` for details.

---

## Key Features

- ✅ Responsive filter system (mobile drawer + desktop sidebar)
- ✅ Advanced filtering with searchable options
- ✅ Optimized charts (bar charts, line charts with averages)
- ✅ Dedicated work order card component
- ✅ Clean layout (page titles in header only)
- ✅ Efficient spacing and layout optimization
