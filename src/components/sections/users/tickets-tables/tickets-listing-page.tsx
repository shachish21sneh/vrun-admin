import { useState } from "react";
import PageContainer from "@/components/layout/page-container";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/table/data-table";
import { columns } from "./columns";
import SearchInput from "@/components/search-input";
import { PaginationState } from "@tanstack/react-table";
import { DataTableFilterBox } from "@/components/ui/table/data-table-filter-box";
import { DataTableResetFilter } from "@/components/ui/table/data-table-reset-filter";
import { Ticket } from "@/constants/data";

export const TICKET_STATUS = [
  { value: "new", label: "New" },
  { value: "accepted", label: "Accepted" },
  { value: "inprogress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "rejected", label: "Rejected" },
  { value: "cancelled", label: "Cancelled" },
];

export default function UserTicketsListingPage({
  userTicketHistoryData,
}: {
  userTicketHistoryData: Ticket[];
}) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [pageSize, setPageSize] = useState<number>(10);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value.trim());
    setPageIndex(0);
  };

  const handlePaginationChange = ({ pageIndex, pageSize }: PaginationState) => {
    setPageIndex(pageIndex);
    setPageSize(pageSize);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setStatusFilter(null);
    setPageIndex(0);
  };

  const handleStatusFilterChange = (
    value: string | ((old: string) => string | null) | null
  ) => {
    const newValue =
      typeof value === "function" ? value(statusFilter || "") : value;
    setStatusFilter(newValue);
    if (newValue !== null) {
      return Promise.resolve(new URLSearchParams({ status: newValue }));
    } else {
      return Promise.resolve(new URLSearchParams());
    }
  };

  const isAnyFilterActive = !!searchQuery || !!statusFilter;

  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title={`Tickets (${userTicketHistoryData?.length || 0})`}
            description="Manage tickets."
          />
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="w-1/3">
            <SearchInput onSearchChange={handleSearchChange} />
          </div>
          <div>
            <DataTableFilterBox
              filterKey="status"
              title="Status"
              options={TICKET_STATUS}
              setFilterValue={handleStatusFilterChange} // Update the status filter state
              filterValue={statusFilter || ""}
            />
            <DataTableResetFilter
              isFilterActive={isAnyFilterActive} // Check if any filter is active
              onReset={resetFilters} // Reset all filters
            />
          </div>
        </div>
        <Separator />

        {userTicketHistoryData && userTicketHistoryData.length > 0 && (
          <div className="space-y-4">
            <DataTable
              columns={columns}
              data={userTicketHistoryData}
              totalItems={userTicketHistoryData?.length}
              pageSize={pageSize}
              pageIndex={pageIndex}
              onPaginationChange={handlePaginationChange}
            />
          </div>
        )}
      </div>
    </PageContainer>
  );
}
