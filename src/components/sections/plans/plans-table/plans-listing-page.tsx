import { useState, useMemo } from "react";
import PageContainer from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import SearchInput from "@/components/search-input";
import { useDebounce } from "@/hooks/use-debounce";
import { DataTable } from "@/components/ui/table/data-table";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import { PaginationState } from "@tanstack/react-table";
import { useGetPlansQuery } from "@/toolkit/plans/plans.api";
import { columns } from "./columns";
import { CreatePlanModal } from "../views/CreatePlanModal";
import type { Plan } from "@/types";

export const PlansListingPage = () => {
  const { data: plansData, isLoading, isError, isSuccess, refetch } =
    useGetPlansQuery();

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [pageSize, setPageSize] = useState<number>(10);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [open, setOpen] = useState(false);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value.trim());
    setPageIndex(0);
  };

  const handlePaginationChange = ({ pageIndex, pageSize }: PaginationState) => {
    setPageIndex(pageIndex);
    setPageSize(pageSize);
  };

  const paginatedData = useMemo(() => {
    const start = pageIndex * pageSize;
    const end = start + pageSize;
    return filteredData.slice(start, end);
  }, [filteredData, pageIndex, pageSize]);

  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title={`Plans (${filteredData.length})`}
            description="Manage subscription plans"
          />

          <Button onClick={() => setOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Button>
        </div>

        <div className="flex justify-end">
          <div className="w-1/3">
            <SearchInput onSearchChange={handleSearchChange} />
          </div>
        </div>

        <Separator />

        {isLoading && <DataTableSkeleton columnCount={3} rowCount={10} />}
        {isError && <p>Failed to load plans. Please try again later.</p>}
        {isSuccess && filteredData.length === 0 && (
          <p>No plans found matching your search criteria.</p>
        )}

        {isSuccess && filteredData.length > 0 && (
          <div className="space-y-4">
            <DataTable
              columns={columns}
              data={paginatedData}
              totalItems={filteredData.length}
              pageSize={pageSize}
              pageIndex={pageIndex}
              onPaginationChange={handlePaginationChange}
            />
          </div>
        )}
      </div>

      <CreatePlanModal
        open={open}
        onClose={() => setOpen(false)}
        refetch={refetch}
      />
    </PageContainer>
  );
};