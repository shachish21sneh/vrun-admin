import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";

export const columns = (
  onEdit: (plan: any) => void,
  onDelete: (id: string) => void
): ColumnDef<any>[] => [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const { currency, amount } = row.original;
      return `${currency} ${amount}`;
    },
  },
  {
    accessorKey: "features",
    header: "Features",
    cell: ({ row }) => {
      const features = row.original.features;
      return Array.isArray(features)
        ? features.join(", ")
        : "";
    },
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const plan = row.original;

      return (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit(plan)}
          >
            Edit
          </Button>

          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDelete(plan.plan_id)}
          >
            Delete
          </Button>
        </div>
      );
    },
  },
];