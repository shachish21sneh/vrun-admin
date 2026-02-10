import { useState } from "react";
import { PlanPayload, plansApi } from "@/toolkit/plans/plans.api";

interface CreatePlanModalProps {
  open: boolean;
  onClose: () => void;
  data?: {
    id: string;
  };
}

export const CreatePlanModal = ({
  open,
  onClose,
  data
}: CreatePlanModalProps) => {
  const [form, setForm] = useState<PlanPayload>({
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
      await plansApi.update(data.id, form);
    } else {
      await plansApi.create(form);
    }
    onClose();
    window.location.reload();
  };

  if (!open) return null;

  return (
    <div>
      <h2>{data ? "Update Plan" : "Add Plan"}</h2>
      <button onClick={onSubmit}>Save</button>
    </div>
  );
};