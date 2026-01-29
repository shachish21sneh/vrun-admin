import { Checkbox } from "@/components/ui/checkbox";
import { Ticket } from "@/constants/data";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge"; // Assuming there's a Badge component

export const columns: ColumnDef<Ticket>[] = [
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
    accessorKey: "id",
    header: "Ticket ID",
    cell: ({ getValue }) => {
      const id = getValue<string>() || "N/A";
      return id !== "N/A" ? `#${id.slice(0, 7)}` : id;
    },
  },
  {
    id: "sunroof_problem",
    header: "Problem",
    cell: ({ row }) => {
      const problem = row.original.sunroof_problem?.display_name || "N/A";
      return problem;
    },
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;

      return (
        <Badge
          className={`captialize ${
            status === "new"
              ? "bg-green-500"
              : status === "accepted"
              ? "bg-blue-500"
              : status === "inprogress"
              ? "bg-yellow-400"
              : "bg-gray-500"
          }`}
        >
          <span className="capitalize">
            {status === "inprogress" ? "In Progress" : status}
          </span>
        </Badge>
      );
    },
  },
  {
    id: "car",
    header: "Car",
    cell: ({ row }) => {
      const carModel = row.original.car?.car_model?.display_name || "N/A";
      return <div>{carModel}</div>;
    },
  },

  // {
  //   accessorKey: "merchant",
  //   header: "Merchant",
  //   cell: ({ row }) => {
  //     const firstName = row.original.merchant?.first_name || "N/A";
  //     const email = row.original.merchant?.email || "N/A";
  //     return (
  //       <>
  //         <div>{firstName}</div>
  //         <div>{email}</div>
  //       </>
  //     );
  //   },
  // },
  {
    accessorKey: "user",
    header: "User",
    cell: ({ row }) => {
      const firstName = row.original.user?.first_name || "N/A";
      const email = row.original.user?.email || "N/A";
      return (
        <>
          <div>{firstName}</div>
          <div>{email}</div>
        </>
      );
    },
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => {
      const location = row.original.location?.full_address || "N/A";
      const city = row.original.location?.city || "N/A";
      return (
        <>
          <div>{city}</div>
          <div>{location}</div>
        </>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Created at",
    cell: ({ getValue }) => {
      const createdAt = getValue<string | undefined>();
      try {
        return createdAt
          ? format(new Date(createdAt), "dd/MM/yyyy HH:mm:ss")
          : "N/A";
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
