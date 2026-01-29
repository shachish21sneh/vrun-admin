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
import { testimonialsApi } from "@/toolkit/testimonials/testimonials.api";
import CreateTestimonialModal from "../views/CreateTestimonialModal";

export default function TestimonialsListingPage() {
  const { useGetAllTestimonialsQuery } = testimonialsApi;
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [pageSize, setPageSize] = useState<number>(10);
  const [pageIndex, setPageIndex] = useState<number>(0);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const {
    data: testimonialsData,
    isSuccess,
    isLoading,
    isError,
    refetch,
  } = useGetAllTestimonialsQuery();

  const handleSearchChange = (value: string) => {
    setSearchQuery(value.trim());
    setPageIndex(0);
  };

  const handlePaginationChange = ({ pageIndex, pageSize }: PaginationState) => {
    setPageIndex(pageIndex);
    setPageSize(pageSize);
  };

  const [showTestimonialModal, setShowTestimonialModal] = useState(false);

  const handleShowTestimonialModal = () => {
    setShowTestimonialModal(!showTestimonialModal);
  };

  const filteredData = useMemo(() => {
    if (!isSuccess || !testimonialsData?.data) return [];
    return testimonialsData.data.filter((testimonial) =>
      testimonial.review
        .toLowerCase()
        .includes(debouncedSearchQuery.toLowerCase())
    );
  }, [debouncedSearchQuery, testimonialsData, isSuccess]);

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
            title={`Testimonials (${filteredData.length})`}
            description="Manage testimonials for your website."
          />

          <Button onClick={handleShowTestimonialModal}>
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
        {isError && <p>Failed to load testimonials. Please try again later.</p>}
        {isSuccess && filteredData.length === 0 && (
          <p>No review found matching your search criteria.</p>
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
      <CreateTestimonialModal
        isOpen={showTestimonialModal}
        onClose={handleShowTestimonialModal}
        refetch={refetch}
      />
    </PageContainer>
  );
}
