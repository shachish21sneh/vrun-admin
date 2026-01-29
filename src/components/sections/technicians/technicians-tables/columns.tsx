import { Checkbox } from "@/components/ui/checkbox";
import { Technician } from "@/constants/data";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

export const columns: ColumnDef<Technician>[] = [
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
      const name = row.original.name || "N/A";
      return name;
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
      const phone = row.original.phone || "N/A";
      return phone;
    },
  },
  {
    id: "availability_status",
    header: "Availability",
    cell: ({ row }) => {
      const availability = row.original.availability_status || "Unavailable";
      const color = availability === "Available" ? "green" : "red";
      return <Badge color={color} className="capitalize">{availability}</Badge>;
    },
  },
  // {
  //   id: "merchant_id",
  //   header: "Merchant",
  //   cell: ({ row }) => row.original.merchant_id || "N/A",
  // },
  {
    accessorKey: "created_at",
    header: "Created at",
    cell: ({ getValue }) => {
      const createdAt = getValue<string | undefined>();
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
    header: "Actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
