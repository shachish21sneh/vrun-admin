import { ColumnDef } from "@tanstack/react-table";
import type { Plan } from "@/types";

export const columns: ColumnDef<Plan>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
  {
    accessorKey: "features",
    header: "Features",
  },
  {
    accessorKey: "sunroof_type",
    header: "Sunroof Type",
  },
  {
    accessorKey: "status",
    header: "Status",
  }
];