import { useState, useMemo } from "react";

//Icons
import { Plus } from "lucide-react";

// Components
import { columns } from "./columns";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import SearchInput from "@/components/search-input";
import { useDebounce } from "@/hooks/use-debounce";
import { PaginationState } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/table/data-table";
import PageContainer from "@/components/layout/page-container";
import CreateTechnicianModal from "../views/CreateTechnicianModal";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";

// Redux
import { techniciansApi } from "@/toolkit/technicians/technicians.api";

export default function TechniciansListingPage() {
  const { useGetAllTechniciansQuery } = techniciansApi;
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [pageSize, setPageSize] = useState<number>(10);
  const [pageIndex, setPageIndex] = useState<number>(0);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const {
    data: technicianData,
    isSuccess,
    isLoading,
    isError,
    refetch,
  } = useGetAllTechniciansQuery();

  const handleSearchChange = (value: string) => {
    setSearchQuery(value.trim());
    setPageIndex(0);
  };

  const handlePaginationChange = ({ pageIndex, pageSize }: PaginationState) => {
    setPageIndex(pageIndex);
    setPageSize(pageSize);
  };

  const [showTechnicianModal, setShowTechnicianModal] = useState(false);

  const handleShowTechnicianModal = () => {
    setShowTechnicianModal(!showTechnicianModal);
  };

  const filteredData = useMemo(() => {
    if (!isSuccess || !technicianData?.data) return [];
    return technicianData.data.filter((brand) =>
      brand.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
    );
  }, [debouncedSearchQuery, technicianData, isSuccess]);

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
            title={`Technicians (${filteredData.length})`}
            description="Manage technicians."
          />
          <Button onClick={handleShowTechnicianModal}>
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
        {isError && <p>Failed to load merchant. Please try again later.</p>}
        {isSuccess && filteredData.length === 0 && (
          <p>No technician found matching your search criteria.</p>
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
      <CreateTechnicianModal
        isOpen={showTechnicianModal}
        onClose={handleShowTechnicianModal}
        refetch={refetch}
      />
    </PageContainer>
  );
}
