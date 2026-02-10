import { useState } from "react";
import {
  useCreatePlanMutation,
  useUpdatePlanMutation
} from "@/toolkit/plans/plans.api";

interface CreatePlanModalProps {
  open: boolean;
  onClose: () => void;
  data?: {
    id: string;
  };
}

interface PlanForm {
  name: string;
  price: number;
  duration: number;
  description: string;
  features: string[];
  sortOrder: number;
  isActive: boolean;
  isPopular: boolean;
}

export const CreatePlanModal = ({
  open,
  onClose,
  data
}: CreatePlanModalProps) => {
  const [createPlan] = useCreatePlanMutation();
  const [updatePlan] = useUpdatePlanMutation();

  // 👇 setForm hata diya
  const [form] = useState<PlanForm>({
    name: "",
    price: 0,
    duration: 0,
    description: "",
    features: [],
    sortOrder: 1,
    isActive: true,
    isPopular: false
  });

  const onSubmit = async () => {
    if (data?.id) {
      await updatePlan({
        id: data.id,
        data: form
      }).unwrap();
    } else {
      await createPlan(form).unwrap();
    }

    onClose();
  };

  if (!open) return null;

  return (
    <div>
      <h2>{data ? "Update Plan" : "Create Plan"}</h2>

      <button onClick={onSubmit}>
        {data ? "Update" : "Create"}
      </button>

      <button onClick={onClose}>Cancel</button>
    </div>
  );
};