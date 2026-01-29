import { useState } from "react";
import PageContainer from "@/components/layout/page-container";
import { buttonVariants } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import Link from "next/link";
import { customersApi } from "@/toolkit/customers/customers.api";
import SearchInput from "@/components/search-input";
import { useDebounce } from "@/hooks/use-debounce";
import { DataTable } from "@/components/ui/table/data-table";
import { columns } from "./columns";
import { PaginationState } from "@tanstack/react-table";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";

export default function UsersListingPage() {
  const { useGetAllCustomersQuery } = customersApi;
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [pageSize, setPageSize] = useState<number>(10);
  const [pageIndex, setPageIndex] = useState<number>(0);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const {
    data: customers,
    isSuccess,
    isLoading,
    isError,
  } = useGetAllCustomersQuery({
    limit: pageSize,
    offset: pageIndex * pageSize,
    query: debouncedSearchQuery,
  });

  const handleSearchChange = (value: string) => {
    setSearchQuery(value.trim());
    setPageIndex(0);
  };

  const handlePaginationChange = ({ pageIndex, pageSize }: PaginationState) => {
    setPageIndex(pageIndex);
    setPageSize(pageSize);
  };

  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title={`Users (${customers?.total || 0})`}
            description="Manage users"
          />

          <Link
            href="/users/new"
            className={cn(buttonVariants({ variant: "default" }))}
          >
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Link>
        </div>

        <div className="flex justify-end">
          <div className="w-1/3">
            <SearchInput onSearchChange={handleSearchChange} />
          </div>
        </div>

        <Separator />

        {isLoading && <DataTableSkeleton columnCount={4} rowCount={10} />}
        {isError && <p>Failed to load users. Please try again later.</p>}
        {isSuccess && customers?.data?.length === 0 && (
          <p>No users found matching your search criteria.</p>
        )}
        {isSuccess && customers?.data?.length > 0 && (
          <div className="space-y-4">
            <DataTable
              columns={columns}
              data={customers.data}
              totalItems={customers.total}
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
