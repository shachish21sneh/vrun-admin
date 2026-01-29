import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { Merchant } from "@/constants/data";
import Image from "next/image";

export const columns: ColumnDef<Merchant>[] = [
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
    header: "Logo",
    cell: ({ getValue }) => {
      const url = getValue<string>() || "";
      return url ? (
        <Image
          src={url}
          alt="Business Logo"
          width={50}
          height={50}
          className="object-contain"
        />
      ) : (
        "N/A"
      );
    },
  },
  {
    accessorKey: "business_name",
    header: "Business Name",
    cell: ({ getValue }) => getValue() || "N/A",
  },
  {
    accessorKey: "business_email",
    header: "Business Email",
    cell: ({ getValue }) => getValue() || "N/A",
  },
  {
    accessorKey: "business_phone",
    header: "Business Phone",
    cell: ({ getValue }) => getValue() || "N/A",
  },
  {
    accessorKey: "full_address",
    header: "Full Address",
    cell: ({ getValue }) => getValue() || "N/A",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
