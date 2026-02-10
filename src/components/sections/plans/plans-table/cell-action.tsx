import { useState } from "react";
import { Trash } from "lucide-react";
import type { Plan } from "@/types";
import { useDeletePlanMutation } from "@/toolkit/plans/plans.api";

interface CellActionProps {
  data: Plan;
}

export const CellAction = ({ data }: CellActionProps) => {
  const [deletePlan] = useDeletePlanMutation();
  const [loading, setLoading] = useState(false);

  const onDelete = async () => {
    setLoading(true);
    try {
      await deletePlan(data.id).unwrap();
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={onDelete} disabled={loading}>
      <Trash />
    </button>
  );
};