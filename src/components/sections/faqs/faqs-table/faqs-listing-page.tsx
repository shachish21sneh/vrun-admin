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
import { faqsApi } from "@/toolkit/faqs/faqs.api";
import CreateFaqModal from "../views/CreateFaqModal";

export default function FaqsListingPage() {
  const { useGetAllFaqsQuery } = faqsApi;
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [pageSize, setPageSize] = useState<number>(10);
  const [pageIndex, setPageIndex] = useState<number>(0);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const {
    data: faqsData,
    isSuccess,
    isLoading,
    isError,
    refetch,
  } = useGetAllFaqsQuery();

  const handleSearchChange = (value: string) => {
    setSearchQuery(value.trim());
    setPageIndex(0);
  };

  const handlePaginationChange = ({ pageIndex, pageSize }: PaginationState) => {
    setPageIndex(pageIndex);
    setPageSize(pageSize);
  };

  const [showFaqModal, setShowFaqModal] = useState(false);

  const handleShowFaqModal = () => {
    setShowFaqModal(!showFaqModal);
  };

  const filteredData = useMemo(() => {
    if (!isSuccess || !faqsData?.data) return [];
    return faqsData.data.filter((faq) =>
      faq.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
    );
  }, [debouncedSearchQuery, faqsData, isSuccess]);

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
            title={`FAQs (${filteredData.length})`}
            description="Manage Faqs"
          />

          <Button onClick={handleShowFaqModal}>
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
        {isError && <p>Failed to load faqs. Please try again later.</p>}
        {isSuccess && filteredData.length === 0 && (
          <p>No faqs found matching your search criteria.</p>
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
      <CreateFaqModal
        isOpen={showFaqModal}
        onClose={handleShowFaqModal}
        refetch={refetch}
      />
    </PageContainer>
  );
}
