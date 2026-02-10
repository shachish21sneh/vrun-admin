import { useState } from "react";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import { plansApi } from "@/toolkit/plans/plans.api";

export const CellAction = ({ data }: any) => {
  const [loading, setLoading] = useState(false);

  const onDelete = async () => {
    setLoading(true);
    await plansApi.delete(data.id);
    window.location.reload();
  };

  return (
    <div className="relative">
      <button>
        <MoreHorizontal />
      </button>

      <div className="absolute right-0 mt-2 bg-white shadow">
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