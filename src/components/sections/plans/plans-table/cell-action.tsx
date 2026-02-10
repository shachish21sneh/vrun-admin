import { useState } from "react";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import { Plan } from "@/types/plan";
import { plansApi } from "@/toolkit/plans/plans.api";

interface CellActionProps {
  data: Plan;
}

export const CellAction = ({ data }: CellActionProps) => {
  const [loading, setLoading] = useState<boolean>(false);

  const onDelete = async () => {
    setLoading(true);
    await plansApi.delete(data.id);
    window.location.reload();
  };

  return (
    <div>
      <button>
        <MoreHorizontal />
      </button>

      <div>
        <button>
          <Pencil /> Update
        </button>

        <button onClick={onDelete} disabled={loading}>
          <Trash /> Delete
        </button>
      </div>
    </div>
  );
};