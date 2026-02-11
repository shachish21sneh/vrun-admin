import { ColumnDef } from "@tanstack/react-table";
import { Plan } from "@/types/plan";
import { CellAction } from "./cell-action";

export const columns: ColumnDef<Plan>[] = [
  {
    accessorKey: "name",
    header: "Plan Name"
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) =>
      `${row.original.currency} ${row.original.amount}`,
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "features",
    header: "Features"
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (row.original.status ? "active" : "inactive")
  },
  {
    accessorKey: "createdAt",
    header: "Created At"
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />
  }
];