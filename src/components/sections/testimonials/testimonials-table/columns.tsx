import { Checkbox } from "@/components/ui/checkbox";
import { Testimonial } from "@/constants/data";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { format } from "date-fns";
import Image from "next/image";

export const columns: ColumnDef<Testimonial>[] = [
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
    accessorKey: "image",
    header: "Image",
    cell: ({ getValue }) => {
      const imageUrl = getValue<string>();
      return imageUrl ? (
        <Image
          src={imageUrl}
          alt="Image"
          width={40}
          height={40}
          objectFit="contain"
        />
      ) : (
        "N/A"
      );
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
    accessorKey: "designation",
    header: "Designation",
    cell: ({ getValue }) => {
      const designation = getValue<string>();
      return designation || "N/A";
    },
  },
  {
    accessorKey: "company",
    header: "Company",
    cell: ({ getValue }) => {
      const company = getValue<string>();
      return company || "N/A";
    },
  },
  {
    accessorKey: "review",
    header: "Review",
    cell: ({ getValue }) => {
      const review = getValue<string>();
      return review || "N/A";
    },
  },
  {
    accessorKey: "rating",
    header: "Rating",
    cell: ({ getValue }) => {
      const rating = getValue<number>();
      return rating !== undefined ? rating : "N/A";
    },
  },
  // {
  //   accessorKey: "category",
  //   header: "Category",
  //   cell: ({ getValue }) => {
  //     const category = getValue<string | null>();
  //     return category || "N/A";
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
