import { Checkbox } from "@/components/ui/checkbox";
import { Faq } from "@/constants/data";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { format } from "date-fns";

export const columns: ColumnDef<Faq>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ getValue }) => getValue<string>() || "N/A",
  },
  {
    accessorKey: "content",
    header: "Content",
    cell: ({ getValue }) => getValue<string>() || "N/A",
  },
  // {
  //   accessorKey: "category",
  //   header: "Category",
  //   cell: ({ getValue }) => {
  //     const category = getValue<string | null>();
  //     return category || "Uncategorized";
  //   },
  // },
  {
    accessorKey: "sort_order",
    header: "Sort Order",
    cell: ({ getValue }) => {
      const sortOrder = getValue<number>();
      return sortOrder !== undefined ? sortOrder : "N/A";
    },
  },
  {
    accessorKey: "active",
    header: "Active",
    cell: ({ getValue }) => {
      const active = getValue<boolean>();
      return active ? "Yes" : "No";
    },
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    cell: ({ getValue }) => {
      const createdAt = getValue<string>();
      try {
        return createdAt ? format(new Date(createdAt), "dd/MM/yyyy") : "N/A";
      } catch (error) {
        console.error("Invalid date format: ", createdAt, error);
        return "Invalid Date";
      }
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
