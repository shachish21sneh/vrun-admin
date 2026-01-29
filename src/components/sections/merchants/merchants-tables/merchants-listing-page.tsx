import { useState, useMemo } from "react";
import { useRouter } from "next/router";
import PageContainer from "@/components/layout/page-container";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import SearchInput from "@/components/search-input";
import { useDebounce } from "@/hooks/use-debounce";
import { DataTable } from "@/components/ui/table/data-table";
import { columns } from "./columns";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PaginationState } from "@tanstack/react-table";
import { merchantsApi } from "@/toolkit/merchants/merchants.api";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";

export default function MerchantsListingPage() {
  const router = useRouter();
  const { useGetAllMerchantsQuery } = merchantsApi;
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [pageSize, setPageSize] = useState<number>(10);
  const [pageIndex, setPageIndex] = useState<number>(0);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const {
    data: merchantData,
    isSuccess,
    isLoading,
    isError,
  } = useGetAllMerchantsQuery();

  const handleSearchChange = (value: string) => {
    setSearchQuery(value.trim());
    setPageIndex(0);
  };

  const handlePaginationChange = ({ pageIndex, pageSize }: PaginationState) => {
    setPageIndex(pageIndex);
    setPageSize(pageSize);
  };

  const filteredData = useMemo(() => {
    if (!isSuccess || !merchantData?.data) return [];
    return merchantData.data.filter((brand) =>
      brand.business_name
        .toLowerCase()
        .includes(debouncedSearchQuery.toLowerCase())
    );
  }, [debouncedSearchQuery, merchantData, isSuccess]);

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
            title={`Merchants (${filteredData.length})`}
            description="Manage merchants."
          />
          <Button onClick={() => router.push("/merchant/create")}>
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Button>
        </div>

        <div className="flex justify-end">
          <div className="w-1/3">
            <SearchInput onSearchChange={handleSearchChange} />
          </div>
        </div>
        <Separator />

        {isLoading && <DataTableSkeleton columnCount={5} rowCount={10} />}
        {isError && <p>Failed to load merchant. Please try again later.</p>}
        {isSuccess && filteredData.length === 0 && (
          <p>No merchant found matching your search criteria.</p>
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
    </PageContainer>
  );
}
