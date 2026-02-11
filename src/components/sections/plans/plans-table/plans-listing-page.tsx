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

export const PlansListingPage = () => {
  const {
    data: plansData = [],
    isLoading,
    isError,
    isSuccess,
    refetch,
  } = useGetPlansQuery();

  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(0);
  const [open, setOpen] = useState(false);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const handlePaginationChange = ({ pageIndex, pageSize }: PaginationState) => {
    setPageIndex(pageIndex);
    setPageSize(pageSize);
  };

  const filteredData = useMemo(() => {
    if (!isSuccess) return [];

    return plansData.filter((plan) =>
      plan.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
    );
  }, [plansData, debouncedSearchQuery, isSuccess]);

  const paginatedData = useMemo(() => {
    const start = pageIndex * pageSize;
    return filteredData.slice(start, start + pageSize);
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
            <SearchInput onSearchChange={setSearchQuery} />
          </div>
        </div>

        <Separator />

        {isLoading && <DataTableSkeleton columnCount={4} rowCount={10} />}
        {isError && <p>Failed to load plans.</p>}

        {isSuccess && filteredData.length > 0 && (
          <DataTable
            columns={columns}
            data={paginatedData}
            totalItems={filteredData.length}
            pageSize={pageSize}
            pageIndex={pageIndex}
            onPaginationChange={handlePaginationChange}
          />
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