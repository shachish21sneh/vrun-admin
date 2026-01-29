import { useState, useMemo } from "react";
import PageContainer from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import SearchInput from "@/components/search-input";
import { useDebounce } from "@/hooks/use-debounce";
import { DataTable } from "@/components/ui/table/data-table";
import { columns } from "./columns";
import { PaginationState } from "@tanstack/react-table";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import { masterCarBrandsApi } from "@/toolkit/masterCarBrands/masterCarBrands.api";
import CreateMasterCarBrandModal from "../views/CreateMasterCarBrandModal";

export default function MasterCarBrandsListingPage() {
  const { useGetAllCarBrandsQuery } = masterCarBrandsApi;
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [pageSize, setPageSize] = useState<number>(50);
  const [pageIndex, setPageIndex] = useState<number>(0);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const {
    data: masterCarBrand,
    isSuccess,
    isLoading,
    isError,
    refetch,
  } = useGetAllCarBrandsQuery();

  const handleSearchChange = (value: string) => {
    setSearchQuery(value.trim());
    setPageIndex(0);
  };

  const handlePaginationChange = ({ pageIndex, pageSize }: PaginationState) => {
    setPageIndex(pageIndex);
    setPageSize(pageSize);
  };

  const [showMasterCarBrandModal, setShowMasterCarBrandModal] = useState(false);

  const handleShowMasterCarBrandModal = () => {
    setShowMasterCarBrandModal(!showMasterCarBrandModal);
  };

  const filteredData = useMemo(() => {
    if (!isSuccess || !masterCarBrand?.data) return [];
    return masterCarBrand.data.filter((brand) =>
      brand.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
    );
  }, [debouncedSearchQuery, masterCarBrand, isSuccess]);

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
            title={`Master car brands (${filteredData.length})`}
            description="Manage master car brands"
          />

          <Button onClick={handleShowMasterCarBrandModal}>
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Button>
        </div>

        <div className="flex justify-end">
          <div className="w-1/3">
            <SearchInput onSearchChange={handleSearchChange} />
          </div>
        </div>

        <Separator />

        {isLoading && <DataTableSkeleton columnCount={4} rowCount={10} />}
        {isError && <p>Failed to load car brands. Please try again later.</p>}
        {isSuccess && filteredData.length === 0 && (
          <p>No car brands found matching your search criteria.</p>
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
      <CreateMasterCarBrandModal
        isOpen={showMasterCarBrandModal}
        onClose={handleShowMasterCarBrandModal}
        refetch={refetch}
      />
    </PageContainer>
  );
}
