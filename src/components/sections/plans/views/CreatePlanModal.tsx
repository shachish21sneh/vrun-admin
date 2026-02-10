import { useState } from "react";
import { plansApi } from "@/toolkit/plans/plans.api";

export const CreatePlanModal = ({ open, onClose, data }: any) => {
  const [form, setForm] = useState({
    name: "",
    price: "",
    duration: "",
    description: "",
    features: [""],
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
    <div className="modal">
      <h2>{data ? "Update Plan" : "Add Plan"}</h2>

      <input placeholder="Plan Name" />
      <input placeholder="Price" type="number" />
      <input placeholder="Duration (months)" type="number" />

      <textarea placeholder="Description" />

      {form.features.map((_, i) => (
        <input key={i} placeholder="Feature" />
      ))}

      <button onClick={onSubmit}>Save</button>
    </div>
  );
};