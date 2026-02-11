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
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
];