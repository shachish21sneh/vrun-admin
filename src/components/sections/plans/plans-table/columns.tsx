import { ColumnDef } from "@tanstack/react-table";
import { Plan } from "@/types/plan";
import { CellAction } from "./cell-action";

export const columns: ColumnDef<Plan>[] = [
  {
    accessorKey: "name",
    header: "Plan Name"
  },
  {
    accessorKey: "price",
    header: "Price"
  },
  {
    accessorKey: "duration",
    header: "Duration (Months)"
  },
  {
    accessorKey: "sortOrder",
    header: "Sort Order"
  },
  {
    accessorKey: "isActive",
    header: "Active",
    cell: ({ row }) => (row.original.isActive ? "Yes" : "No")
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