"use client";

import { useState, useMemo } from "react";
import PageContainer from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/ui/table/data-table";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import { PaginationState } from "@tanstack/react-table";

import {
  useGetPlansQuery,
  useDeletePlanMutation,
} from "@/toolkit/plans/plans.api";

import { columns } from "./columns";
import { CreatePlanModal } from "../views/CreatePlanModal";
import type { Plan } from "@/types";

export const PlansListingPage = () => {
  const { data: plansData = [], isLoading, isError } =
    useGetPlansQuery();

  const [deletePlan] = useDeletePlanMutation();

  const [open, setOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(0);

  const handlePaginationChange = ({
    pageIndex,
    pageSize,
  }: PaginationState) => {
    setPageIndex(pageIndex);
    setPageSize(pageSize);
  };

  const paginatedData = useMemo(() => {
    const start = pageIndex * pageSize;
    return plansData.slice(start, start + pageSize);
  }, [plansData, pageIndex, pageSize]);

  const handleAdd = () => {
    setSelectedPlan(null);
    setOpen(true);
  };

  const handleEdit = (plan: Plan) => {
    setSelectedPlan(plan);
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    await deletePlan(id);
  };

  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title={`Plans (${plansData.length})`}
            description="Manage subscription plans"
          />

          <Button onClick={handleAdd}>
            <Plus className="mr-2 h-4 w-4" />
            Add New
          </Button>
        </div>

        <Separator />

        {isLoading && (
          <DataTableSkeleton columnCount={5} rowCount={10} />
        )}

        {isError && (
          <p className="text-red-500">Failed to load plans.</p>
        )}

        {!isLoading && !isError && (
          <DataTable
            columns={columns(handleEdit, handleDelete)}
            data={paginatedData}
            totalItems={plansData.length}
            pageSize={pageSize}
            pageIndex={pageIndex}
            onPaginationChange={handlePaginationChange}
          />
        )}
      </div>

      <CreatePlanModal
        open={open}
        onClose={() => setOpen(false)}
        plan={selectedPlan}
      />
    </PageContainer>
  );
};