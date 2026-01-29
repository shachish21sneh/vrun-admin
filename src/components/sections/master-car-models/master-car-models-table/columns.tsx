import { Checkbox } from "@/components/ui/checkbox";
import { MasterCarModel } from "@/constants/data";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { format } from "date-fns";
import Image from "next/image";

export const columns: ColumnDef<MasterCarModel>[] = [
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
    accessorKey: "icon",
    header: "Image",
    cell: ({ getValue }) => {
      const iconUrl = getValue<string | null>();
      return iconUrl ? (
        <Image
          src={iconUrl}
          alt="Icon"
          width={50}
          height={50}
          objectFit="contain"
        />
      ) : (
        "N/A"
      );
    },
  },
  {
    accessorKey: "display_name",
    header: "Display Name",
    cell: ({ getValue }) => {
      const displayName = getValue<string>();
      return displayName || "N/A";
    },
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ getValue }) => {
      const name = getValue<string>();
      return name || "N/A";
    },
  },
 
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
      const isActive = getValue<boolean>();
      return isActive ? "Yes" : "No";
    },
  },
  // {
  //   accessorKey: "car_brand_id",
  //   header: "Car Brand ID",
  //   cell: ({ getValue }) => {
  //     const carBrandId = getValue<string>();
  //     return carBrandId || "N/A";
  //   },
  // },
  {
    accessorKey: "created_at",
    header: "Created At",
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
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
