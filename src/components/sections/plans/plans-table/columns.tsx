import { ColumnDef } from "@tanstack/react-table";
import type { Plan } from "@/types";

export const columns: ColumnDef<Plan>[] = [
  {
    accessorKey: "plan_id",
    header: "Plan Id",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "currency",
    header: "Currency",
  },
  {
    accessorKey: "features",
    header: "Features",
  },
  {
    accessorKey: "trial_period_days",
    header: "Duration",
  },
  {
    accessorKey: "sunroof_type",
    header: "Sunroof Type",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "created_at",
    header: "Created At",
  },
];