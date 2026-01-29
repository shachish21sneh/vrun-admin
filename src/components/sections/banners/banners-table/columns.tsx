import { Checkbox } from "@/components/ui/checkbox";
import { Banner } from "@/constants/data";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { format } from "date-fns";
import Image from "next/image";

export const columns: ColumnDef<Banner>[] = [
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
    accessorKey: "image_url",
    header: "Image",
    cell: ({ getValue }) => {
      const imageUrl = getValue<string>();
      return imageUrl ? (
        <Image
          src={imageUrl}
          alt="Banner Image"
          width={60}
          height={60}
          objectFit="contain"
        />
      ) : (
        "N/A"
      );
    },
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ getValue }) => {
      const title = getValue<string>();
      return title || "N/A";
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ getValue }) => {
      const description = getValue<string | null>();
      return description || "N/A";
    },
  },
  {
    accessorKey: "start_date",
    header: "Start Date",
    cell: ({ getValue }) => {
      const startDate = getValue<string>();
      try {
        return startDate ? format(new Date(startDate), "dd/MM/yyyy") : "N/A";
      } catch (error) {
        console.error("Invalid date format: ", startDate, error);
        return "Invalid Date";
      }
    },
  },
  {
    accessorKey: "end_date",
    header: "End Date",
    cell: ({ getValue }) => {
      const endDate = getValue<string>();
      try {
        return endDate ? format(new Date(endDate), "dd/MM/yyyy") : "N/A";
      } catch (error) {
        console.error("Invalid date format: ", endDate, error);
        return "Invalid Date";
      }
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
