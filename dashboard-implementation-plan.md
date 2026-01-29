# Dashboard Implementation Plan

## Overview
Replace dummy data in the overview page with dynamic data from the dashboard APIs using Redux Toolkit Query.

## Tasks

### 1. Create Dashboard API Slice
- Create `src/toolkit/dashboard/dashboard.api.ts`
- Define TypeScript interfaces for all API responses
- Implement RTK Query endpoints for:
  - `GET dashboard/overview?period=30d`
  - `GET dashboard/recent-sales?limit=10`
  - `GET dashboard/charts/revenue-trend?period=30d`
  - `GET dashboard/revenue?period=30d`
  - `GET dashboard/subscriptions?period=30d`
  - `GET dashboard/tickets?period=1y`

### 2. Update Overview Component
- Import and use the dashboard API hooks
- Replace hardcoded values in metric cards with API data
- Handle loading and error states
- Update the Recent Sales component to use API data

### 3. Update Chart Components
- Update BarGraph component to use revenue trend data
- Update AreaGraph component to use appropriate data
- Update PieGraph component to use tickets status distribution data
- Ensure proper data transformation for chart libraries

### 4. Add Period Selection Support
- Connect CalendarDateRangePicker to API calls
- Pass selected period as query parameter
- Refresh data when period changes

### 5. Handle Edge Cases
- Add proper loading states
- Add error handling
- Format currency and percentage values correctly
- Handle empty data scenarios

## Implementation Order
1. Create dashboard.api.ts with all endpoints
2. Update overview.tsx to use API hooks
3. Update RecentSales component
4. Update chart components (BarGraph, AreaGraph, PieGraph)
5. Test and fix any issues