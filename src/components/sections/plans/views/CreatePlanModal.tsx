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
  plan_id: string;
  name: string;
  description: string;
  amount: number;
  currency: string;
  features: string[];
  trial_period_days: string | null;
  status: string;
  sunroof_type: string;
  created_at: string;
  updated_at: string;
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
  plan_id: "",
  name: "",
  description: "",
  amount: 0,
  currency: "",
  features:[],
  trial_period_days:"",
  status:"",
  sunroof_type: "",
  created_at: "",
  updated_at: "",
  });

  const onSubmit = async () => {
    if (data?.id) {
      await updatePlan({
  id: data.id,
  data: {
    ...form,
    features: JSON.stringify(form.features),
  },
}).unwrap();
    } else {
      await createPlan({
  ...form,
  features: JSON.stringify(form.features),
}).unwrap();
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