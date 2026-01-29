"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { Customer } from "@/constants/data";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { format } from "date-fns";

export const columns: ColumnDef<Customer>[] = [
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
    id: "name",
    header: "NAME",
    cell: ({ row }) => {
      const firstName = row.original.first_name || "";
      const lastName = row.original.last_name || "";
      return `${firstName} ${lastName}`.trim();
    },
  },
  {
    accessorKey: "email",
    header: "EMAIL",
    cell: ({ getValue }) => {
      const email = getValue();
      return email ? email : "N/A";
    },
  },
  {
    id: "phone",
    header: "Phone",
    cell: ({ row }) => {
      const phoneExt = row.original.phone_ext || "";
      const phone = row.original.phone || "";
      return `${phoneExt} ${phone}`.trim();
    },
  },
  {
    accessorKey: "created_at",
    header: "Created at",
    cell: ({ getValue }) => {
      const createdAt = getValue<string | undefined>(); // Explicitly type the value
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
