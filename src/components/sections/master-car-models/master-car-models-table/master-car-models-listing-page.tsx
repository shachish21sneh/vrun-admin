import { useState } from "react";
import PageContainer from "@/components/layout/page-container";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import SearchInput from "@/components/search-input";
import { useDebounce } from "@/hooks/use-debounce";
import { DataTable } from "@/components/ui/table/data-table";
import { Button } from "@/components/ui/button";
import { columns } from "./columns";
import { PaginationState } from "@tanstack/react-table";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import { masterCarModelApi } from "@/toolkit/masterCarModels/masterCarModels.api";
import CreateMasterCarModelModal from "../views/CreateMasterCarModelModal";

export default function MasterCarModelsListingPage() {
  const { useGetAllCarModelsQuery } = masterCarModelApi;
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [pageSize, setPageSize] = useState<number>(100);
  const [pageIndex, setPageIndex] = useState<number>(0);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const {
    data: masterCarModel,
    isSuccess,
    isLoading,
    isError,
    refetch,
  } = useGetAllCarModelsQuery({
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

  const [showMasterCarModelModal, setShowMasterCarModelModal] = useState(false);

  const handleShowMasterCarModelModal = () => {
    setShowMasterCarModelModal(!showMasterCarModelModal);
  };

  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title={`Master car models (${masterCarModel?.total || 0})`}
            description="Manage master car models"
          />

          <Button onClick={handleShowMasterCarModelModal}>
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
        {isError && <p>Failed to load users. Please try again later.</p>}
        {isSuccess && masterCarModel?.data?.length === 0 && (
          <p>No users found matching your search criteria.</p>
        )}
        {isSuccess && masterCarModel?.data?.length > 0 && (
          <div className="space-y-4">
            <DataTable
              columns={columns}
              data={masterCarModel.data}
              totalItems={masterCarModel.total}
              pageSize={pageSize}
              pageIndex={pageIndex}
              onPaginationChange={handlePaginationChange}
            />
          </div>
        )}
      </div>
      <CreateMasterCarModelModal
        isOpen={showMasterCarModelModal}
        onClose={handleShowMasterCarModelModal}
        refetch={refetch}
      />
    </PageContainer>
  );
}
